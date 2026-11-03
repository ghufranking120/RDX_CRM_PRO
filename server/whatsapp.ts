/**
 * RDX CRM - Official Meta WhatsApp Business Cloud API Integration Engine
 * Connects directly to graph.facebook.com/v20.0 with secure token handling,
 * idempotent webhook deduplication, and message transmission.
 */

import crypto from 'crypto';
import { db, BusinessRecord, MessageRecord, ContactRecord, ConversationRecord } from './db';
import { n8nService } from './n8n';

export interface OutboundMessagePayload {
  businessId: string;
  recipientPhone: string;
  text?: string;
  templateName?: string;
  templateLanguage?: string;
  templateVariables?: string[];
  messageId?: string;
  conversationId?: string;
  simulateFailure?: boolean;
  simulateFailureCount?: number; // Fail N times, then succeed to demonstrate recovery
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
}

export const whatsappService = {
  // Webhook Verification (Meta GET /webhook)
  verifyWebhook(query: any): { status: number; body: string } {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    // Global verification token or match any tenant verify token
    const masterVerifyToken = 'rdx_token_meta_cloud_waba_2026';
    const isTokenMatch =
      token === masterVerifyToken || db.raw.businesses.some((b) => b.metaVerifyToken === token);

    const isSuccess = mode === 'subscribe' && isTokenMatch;
    const statusCode = isSuccess ? 200 : 403;

    // Log the verification challenge event for developer diagnostics
    db.raw.incomingWebhookLogs.unshift({
      id: `wh_log_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString(),
      signature: undefined,
      signatureValid: true,
      deliveryStatus: isSuccess ? 'delivered' : 'rejected',
      eventType: 'verification_challenge',
      payloadSummary: isSuccess
        ? `Meta Webhook Verification Handshake Verified (hub.mode=subscribe, challenge=${challenge?.slice(0, 8)}...)`
        : `Meta Webhook Verification Failed: Invalid Token provided "${token || 'missing'}"`,
      rawPayloadSnippet: JSON.stringify(query, null, 2),
      httpStatus: statusCode,
    });

    if (db.raw.incomingWebhookLogs.length > 100) {
      db.raw.incomingWebhookLogs = db.raw.incomingWebhookLogs.slice(0, 100);
    }
    db.save();

    if (isSuccess) {
      return { status: 200, body: challenge };
    }
    return { status: 403, body: 'Forbidden: Invalid verify token' };
  },

  // Verify HMAC-SHA256 Signature from Meta (Optional when App Secret configured)
  verifySignature(payload: string, signatureHeader?: string, appSecret?: string): boolean {
    if (!signatureHeader || !appSecret) {
      return true; // Skip if app secret not explicitly configured in dev
    }
    try {
      const hmac = crypto.createHmac('sha256', appSecret);
      const digest = `sha256=${hmac.update(payload).digest('hex')}`;
      return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));
    } catch {
      return false;
    }
  },

  // Process Inbound Webhook Event (Meta POST /webhook)
  async processInboundWebhook(
    rawPayload: any,
    options?: {
      signature?: string;
      signatureValid?: boolean;
      isSimulated?: boolean;
      ipAddress?: string;
    }
  ): Promise<{ handled: boolean; messageId?: string; reason?: string; logId?: string }> {
    const signature = options?.signature;
    const signatureValid = options?.signatureValid !== false;
    const isSimulated = options?.isSimulated === true;

    if (!rawPayload?.entry || !Array.isArray(rawPayload.entry)) {
      const logId = `wh_log_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      db.raw.incomingWebhookLogs.unshift({
        id: logId,
        timestamp: new Date().toISOString(),
        signature,
        signatureValid,
        deliveryStatus: 'rejected',
        eventType: 'unknown',
        payloadSummary: 'Rejected: Malformed Meta webhook envelope (missing entry array)',
        rawPayloadSnippet: typeof rawPayload === 'object' ? JSON.stringify(rawPayload, null, 2) : String(rawPayload),
        httpStatus: 400,
      });
      if (db.raw.incomingWebhookLogs.length > 100) {
        db.raw.incomingWebhookLogs = db.raw.incomingWebhookLogs.slice(0, 100);
      }
      db.save();
      return { handled: false, reason: 'Invalid Meta webhook envelope', logId };
    }

    let processedCount = 0;

    for (const entry of rawPayload.entry) {
      for (const change of entry.changes || []) {
        const value = change.value;
        if (!value) continue;

        const recipientPhoneId = value.metadata?.phone_number_id;

        // Find which business tenant owns this Phone Number ID
        const tenant =
          db.raw.businesses.find((b) => b.metaPhoneId === recipientPhoneId) ||
          db.raw.businesses[0]; // Fallback to primary tenant for demo/unassigned webhooks

        if (!tenant) continue;

        // 1. Handle Status Updates (sent, delivered, read, failed)
        if (value.statuses && Array.isArray(value.statuses)) {
          for (const statusObj of value.statuses) {
            const wamid = statusObj.id;
            const newStatus = statusObj.status; // 'sent' | 'delivered' | 'read' | 'failed'
            const msg = db.raw.messages.find((m) => m.metaMessageId === wamid);
            if (msg) {
              msg.status = newStatus;
            }

            db.raw.incomingWebhookLogs.unshift({
              id: `wh_log_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
              timestamp: new Date().toISOString(),
              signature,
              signatureValid,
              deliveryStatus: isSimulated ? 'simulated' : newStatus === 'failed' ? 'rejected' : 'delivered',
              eventType: 'statuses',
              payloadSummary: `Status update: ${newStatus} (WAMID: ${wamid?.slice(0, 20)}...)`,
              senderPhone: statusObj.recipient_id ? `+${statusObj.recipient_id}` : undefined,
              recipientPhoneId,
              wamid,
              businessId: tenant.id,
              rawPayloadSnippet: JSON.stringify(rawPayload, null, 2),
              httpStatus: 200,
            });
            if (db.raw.incomingWebhookLogs.length > 100) {
              db.raw.incomingWebhookLogs = db.raw.incomingWebhookLogs.slice(0, 100);
            }
          }
          db.save();
        }

        // 2. Handle Inbound Messages
        if (value.messages && Array.isArray(value.messages)) {
          for (const msgObj of value.messages) {
            const wamid = msgObj.id;
            const senderPhone = `+${msgObj.from}`;
            const messageText = msgObj.text?.body || (msgObj.type ? `[Media: ${msgObj.type}]` : 'Inbound inquiry');
            const timestampFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Idempotent Deduplication Check
            if (db.raw.processedWebhookMessageIds[wamid]) {
              console.log(`[Deduplication] Ignored duplicate Meta message: ${wamid}`);
              db.raw.incomingWebhookLogs.unshift({
                id: `wh_log_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
                timestamp: new Date().toISOString(),
                signature,
                signatureValid,
                deliveryStatus: 'duplicate',
                eventType: 'messages',
                payloadSummary: `Duplicate message ignored: ${wamid} from ${senderPhone}`,
                senderPhone,
                recipientPhoneId,
                wamid,
                businessId: tenant.id,
                rawPayloadSnippet: JSON.stringify(rawPayload, null, 2),
                httpStatus: 200,
              });
              if (db.raw.incomingWebhookLogs.length > 100) {
                db.raw.incomingWebhookLogs = db.raw.incomingWebhookLogs.slice(0, 100);
              }
              db.save();
              continue;
            }
            db.raw.processedWebhookMessageIds[wamid] = new Date().toISOString();

            // Find or create Contact
            let contact = db.raw.contacts.find((c) => c.businessId === tenant.id && c.phone === senderPhone);
            if (!contact) {
              const customerName = value.contacts?.[0]?.profile?.name || `WhatsApp Lead ${senderPhone.slice(-4)}`;
              contact = {
                id: `cnt_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
                businessId: tenant.id,
                name: customerName,
                phone: senderPhone,
                tags: ['Inbound Lead', 'WhatsApp Verified'],
                leadSource: 'WhatsApp Inbound',
                leadStatus: 'New',
                assignedToAgentId: 'usr_agent_01',
                assignedToAgentName: 'Marcus Vance',
                notes: [],
                customFields: {},
                createdAt: new Date().toISOString(),
                lastContactedAt: new Date().toISOString(),
              };
              db.raw.contacts.unshift(contact);

              // Trigger n8n Workflow 2: New Lead Pipeline Synchronizer
              n8nService.dispatchWorkflow('n8n_wf_02', {
                event: 'crm.lead.created',
                businessId: tenant.id,
                contactId: contact.id,
                name: contact.name,
                phone: contact.phone,
              });
            } else {
              contact.lastContactedAt = new Date().toISOString();
            }

            // Find or create Conversation
            let conversation = db.raw.conversations.find(
              (c) => c.businessId === tenant.id && c.contactPhone === senderPhone
            );
            if (!conversation) {
              conversation = {
                id: `conv_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
                businessId: tenant.id,
                contactId: contact.id,
                contactName: contact.name,
                contactPhone: senderPhone,
                unreadCount: 1,
                state: 'open',
                lastMessageText: messageText,
                lastMessageTime: timestampFormatted,
                assignedAgentId: contact.assignedToAgentId,
                assignedAgentName: contact.assignedToAgentName,
                leadStatus: contact.leadStatus,
                isHandedOverToHuman: false,
              };
              db.raw.conversations.unshift(conversation);
            } else {
              conversation.lastMessageText = messageText;
              conversation.lastMessageTime = timestampFormatted;
              conversation.unreadCount += 1;
              if (conversation.state === 'closed') {
                conversation.state = 'open';
              }
            }

            // Record Message
            const newMsgRecord: MessageRecord = {
              id: `msg_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
              conversationId: conversation.id,
              businessId: tenant.id,
              sender: 'customer',
              text: messageText,
              timestamp: timestampFormatted,
              status: 'read',
              metaMessageId: wamid,
            };
            db.raw.messages.push(newMsgRecord);
            processedCount++;

            // Record Incoming Webhook Log for Developer Debugging
            db.raw.incomingWebhookLogs.unshift({
              id: `wh_log_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
              timestamp: new Date().toISOString(),
              signature,
              signatureValid,
              deliveryStatus: isSimulated ? 'simulated' : 'processed',
              eventType: 'messages',
              payloadSummary: `Inbound customer inquiry from ${senderPhone}: "${messageText.length > 55 ? messageText.substring(0, 52) + '...' : messageText}"`,
              senderPhone,
              recipientPhoneId,
              wamid,
              businessId: tenant.id,
              rawPayloadSnippet: JSON.stringify(rawPayload, null, 2),
              httpStatus: 200,
            });
            if (db.raw.incomingWebhookLogs.length > 100) {
              db.raw.incomingWebhookLogs = db.raw.incomingWebhookLogs.slice(0, 100);
            }

            // Trigger n8n Workflow 1: Inbound WhatsApp Message Ingestion
            n8nService.dispatchWorkflow('n8n_wf_01', {
              event: 'whatsapp.message.received',
              businessId: tenant.id,
              conversationId: conversation.id,
              sender: senderPhone,
              text: messageText,
              wamid,
            });

            db.save();
          }
        }
      }
    }

    return { handled: true, reason: `Processed ${processedCount} inbound messages` };
  },

  // Direct Meta Graph API message request (Single attempt)
  async sendDirectMetaRequest(
    tenant: BusinessRecord,
    cleanPhone: string,
    payload: OutboundMessagePayload,
    attemptNumber = 0
  ): Promise<{ success: boolean; metaMessageId?: string; error?: string; isSimulated?: boolean }> {
    // 1. Simulation hooks for verifying the automatic retry mechanism
    if (payload.simulateFailureCount !== undefined && payload.simulateFailureCount > 0) {
      if (attemptNumber < payload.simulateFailureCount) {
        return {
          success: false,
          error: `Meta API Error 503: Service Temporarily Unavailable - Rate limit throttle (Simulated attempt ${attemptNumber + 1}/${payload.simulateFailureCount})`,
        };
      }
      const simulatedWamid = `wamid.sim_recovered_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      return {
        success: true,
        metaMessageId: simulatedWamid,
        isSimulated: true,
      };
    }

    if (payload.simulateFailure) {
      return {
        success: false,
        error: 'Meta API Error 429: Rate Limit Exceeded - Outbound queue saturated (Simulated)',
      };
    }

    // 2. Check live Meta credentials
    const hasLiveCredentials = !!(tenant.metaPhoneId && tenant.metaAccessToken && !tenant.metaPhoneId.includes('DEMO'));

    if (!hasLiveCredentials) {
      const simulatedWamid = `wamid.sim_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      return {
        success: true,
        metaMessageId: simulatedWamid,
        isSimulated: true,
        error: 'Meta WhatsApp Cloud API credentials not configured. Simulating delivery in Sandbox.',
      };
    }

    try {
      const endpoint = `https://graph.facebook.com/v20.0/${tenant.metaPhoneId}/messages`;

      let bodyPayload: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
      };

      if (payload.templateName) {
        bodyPayload.type = 'template';
        bodyPayload.template = {
          name: payload.templateName,
          language: { code: payload.templateLanguage || 'en_US' },
          components: payload.templateVariables
            ? [
                {
                  type: 'body',
                  parameters: payload.templateVariables.map((v) => ({ type: 'text', text: v })),
                },
              ]
            : undefined,
        };
      } else {
        bodyPayload.type = 'text';
        bodyPayload.text = { preview_url: true, body: payload.text || '' };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tenant.metaAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data?.error?.message || `Meta API Error ${response.status}`,
        };
      }

      tenant.messagesSentThisMonth += 1;
      const metaMessageId = data?.messages?.[0]?.id;
      db.save();

      return { success: true, metaMessageId };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error reaching graph.facebook.com' };
    }
  },

  // Outbound Send Message with Automatic Exponential Backoff Retry Mechanism
  async sendMessageWithRetry(payload: OutboundMessagePayload): Promise<{
    success: boolean;
    metaMessageId?: string;
    error?: string;
    status: 'delivered' | 'Retrying' | 'failed' | 'sent';
    retryCount?: number;
    messageId?: string;
    nextRetryInMs?: number;
    isSimulated?: boolean;
  }> {
    const tenant = db.raw.businesses.find((b) => b.id === payload.businessId) || db.raw.businesses[0];
    if (!tenant) {
      throw new Error(`Tenant business not found for ID: ${payload.businessId}`);
    }

    const cleanPhone = payload.recipientPhone.replace(/[^0-9]/g, '');
    const maxRetries = payload.maxRetries ?? 3;
    const initialDelayMs = payload.initialDelayMs ?? 1500;
    const backoffFactor = payload.backoffFactor ?? 2;
    const maxDelayMs = 30000;

    // Locate or create MessageRecord
    let messageRecord = payload.messageId
      ? db.raw.messages.find((m) => m.id === payload.messageId)
      : undefined;

    if (!messageRecord) {
      const newMsgId = payload.messageId || `msg_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      messageRecord = {
        id: newMsgId,
        conversationId: payload.conversationId || `conv_${Date.now()}`,
        businessId: tenant.id,
        sender: 'agent',
        senderName: 'Marcus Vance',
        text: payload.text || (payload.templateName ? `[Template: ${payload.templateName}]` : ''),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        recipientPhone: cleanPhone,
        retryCount: 0,
        maxRetries,
        retryHistory: [],
      };
      db.raw.messages.push(messageRecord);
      db.save();
    } else {
      messageRecord.recipientPhone = cleanPhone;
      messageRecord.maxRetries = maxRetries;
    }

    // Attempt 0: Initial delivery attempt
    const initialResult = await this.sendDirectMetaRequest(tenant, cleanPhone, payload, 0);

    if (initialResult.success) {
      messageRecord.status = 'delivered';
      messageRecord.metaMessageId = initialResult.metaMessageId;
      messageRecord.retryCount = 0;
      messageRecord.lastRetryError = undefined;
      messageRecord.nextRetryAt = undefined;
      db.save();

      return {
        success: true,
        metaMessageId: initialResult.metaMessageId,
        status: 'delivered',
        messageId: messageRecord.id,
        retryCount: 0,
        isSimulated: initialResult.isSimulated,
      };
    }

    // Initial delivery failed: immediately transition message status to 'Retrying'
    const attempt1 = 1;
    // Exponential backoff formula: delay = initialDelay * (backoffFactor ^ (attempt - 1)) + jitter
    const delayMs = Math.min(initialDelayMs * Math.pow(backoffFactor, 0), maxDelayMs) + Math.floor(Math.random() * 200);
    const nextRetryIso = new Date(Date.now() + delayMs).toISOString();

    messageRecord.status = 'Retrying';
    messageRecord.retryCount = attempt1;
    messageRecord.lastRetryError = initialResult.error;
    messageRecord.nextRetryAt = nextRetryIso;
    messageRecord.retryHistory = messageRecord.retryHistory || [];
    messageRecord.retryHistory.push({
      attempt: attempt1,
      timestamp: new Date().toISOString(),
      delayMs,
      status: 'Retrying',
      error: initialResult.error,
    });

    db.raw.auditLogs.unshift({
      id: `log_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'WhatsApp Retry Engine',
      role: 'system',
      businessId: tenant.id,
      action: 'OUTBOUND_MESSAGE_RETRYING',
      target: `${cleanPhone}: Send failed (${initialResult.error}). Status set to 'Retrying'. Scheduled retry 1/${maxRetries} in ${delayMs}ms.`,
      ipAddress: '127.0.0.1',
      status: 'Warning',
    });

    db.save();

    // Schedule automatic exponential retry in background
    this.scheduleRetry(messageRecord.id, payload, attempt1, delayMs, {
      maxRetries,
      initialDelayMs,
      backoffFactor,
      maxDelayMs,
    });

    return {
      success: false,
      status: 'Retrying',
      error: initialResult.error,
      messageId: messageRecord.id,
      retryCount: attempt1,
      nextRetryInMs: delayMs,
      isSimulated: initialResult.isSimulated,
    };
  },

  // Asynchronous Exponential Backoff Scheduler
  scheduleRetry(
    messageId: string,
    payload: OutboundMessagePayload,
    currentAttempt: number,
    delayMs: number,
    config: { maxRetries: number; initialDelayMs: number; backoffFactor: number; maxDelayMs: number }
  ): void {
    setTimeout(async () => {
      try {
        const msg = db.raw.messages.find((m) => m.id === messageId);
        if (!msg) return;

        // Skip if message was already delivered or read
        if (msg.status === 'delivered' || msg.status === 'read') return;

        const tenant = db.raw.businesses.find((b) => b.id === msg.businessId) || db.raw.businesses[0];
        const cleanPhone = (msg.recipientPhone || payload.recipientPhone).replace(/[^0-9]/g, '');

        // Keep status as 'Retrying' during attempt
        msg.status = 'Retrying';
        msg.retryCount = currentAttempt;

        const retryResult = await this.sendDirectMetaRequest(tenant, cleanPhone, payload, currentAttempt);

        if (retryResult.success) {
          // Retry Succeeded! Transition to delivered
          msg.status = 'delivered';
          msg.metaMessageId = retryResult.metaMessageId;
          msg.lastRetryError = undefined;
          msg.nextRetryAt = undefined;
          msg.retryHistory = msg.retryHistory || [];
          msg.retryHistory.push({
            attempt: currentAttempt,
            timestamp: new Date().toISOString(),
            delayMs,
            status: 'delivered',
          });

          db.raw.auditLogs.unshift({
            id: `log_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actor: 'WhatsApp Retry Engine',
            role: 'system',
            businessId: tenant.id,
            action: 'OUTBOUND_MESSAGE_RETRY_SUCCESS',
            target: `${cleanPhone}: Successfully delivered on retry attempt ${currentAttempt}/${config.maxRetries} (WAMID: ${retryResult.metaMessageId})`,
            ipAddress: '127.0.0.1',
            status: 'Success',
          });

          db.save();
          return;
        }

        // Retry Attempt Failed
        if (currentAttempt < config.maxRetries) {
          const nextAttempt = currentAttempt + 1;
          // Exponential backoff: delay = initialDelay * (backoffFactor ^ (nextAttempt - 1)) + jitter
          const nextDelay =
            Math.min(config.initialDelayMs * Math.pow(config.backoffFactor, nextAttempt - 1), config.maxDelayMs) +
            Math.floor(Math.random() * 200);

          // Update message status to 'Retrying' with next backoff timestamp
          msg.status = 'Retrying';
          msg.retryCount = nextAttempt;
          msg.lastRetryError = retryResult.error;
          msg.nextRetryAt = new Date(Date.now() + nextDelay).toISOString();
          msg.retryHistory = msg.retryHistory || [];
          msg.retryHistory.push({
            attempt: currentAttempt,
            timestamp: new Date().toISOString(),
            delayMs,
            status: 'Retrying',
            error: retryResult.error,
          });

          db.raw.auditLogs.unshift({
            id: `log_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actor: 'WhatsApp Retry Engine',
            role: 'system',
            businessId: tenant.id,
            action: 'OUTBOUND_MESSAGE_RETRYING',
            target: `${cleanPhone}: Retry attempt ${currentAttempt}/${config.maxRetries} failed (${retryResult.error}). Status remains 'Retrying'. Next backoff retry in ${nextDelay}ms.`,
            ipAddress: '127.0.0.1',
            status: 'Warning',
          });

          db.save();

          // Schedule next exponential retry
          this.scheduleRetry(messageId, payload, nextAttempt, nextDelay, config);
        } else {
          // All exponential retries exhausted -> mark as failed
          msg.status = 'failed';
          msg.nextRetryAt = undefined;
          msg.lastRetryError = `All ${config.maxRetries} exponential backoff attempts exhausted: ${retryResult.error}`;
          msg.retryHistory = msg.retryHistory || [];
          msg.retryHistory.push({
            attempt: currentAttempt,
            timestamp: new Date().toISOString(),
            delayMs,
            status: 'failed',
            error: retryResult.error,
          });

          db.raw.auditLogs.unshift({
            id: `log_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actor: 'WhatsApp Retry Engine',
            role: 'system',
            businessId: tenant.id,
            action: 'OUTBOUND_MESSAGE_RETRIES_EXHAUSTED',
            target: `${cleanPhone}: Permanently marked as 'failed' after ${config.maxRetries} exponential retries (${retryResult.error})`,
            ipAddress: '127.0.0.1',
            status: 'Error',
          });

          // Trigger n8n Workflow 7 alert
          n8nService.dispatchWorkflow('n8n_wf_07', {
            event: 'api.error.failure',
            businessId: tenant.id,
            recipientPhone: cleanPhone,
            metaError: {
              message: retryResult.error,
              attempts: config.maxRetries,
              retriesExhausted: true,
            },
          });

          db.save();
        }
      } catch (err: any) {
        console.error(`Unexpected error during retry of message ${messageId}:`, err);
      }
    }, delayMs);
  },

  // Standard sendMessage caller wrapper
  async sendMessage(payload: OutboundMessagePayload): Promise<{
    success: boolean;
    metaMessageId?: string;
    error?: string;
    isSimulated?: boolean;
    status?: 'delivered' | 'Retrying' | 'failed' | 'sent';
    retryCount?: number;
    messageId?: string;
    nextRetryInMs?: number;
  }> {
    return this.sendMessageWithRetry(payload);
  },

  // Force immediate retry for a specific message
  async retryMessageNow(messageId: string): Promise<{ success: boolean; message?: MessageRecord; error?: string }> {
    const msg = db.raw.messages.find((m) => m.id === messageId);
    if (!msg) return { success: false, error: 'Message not found' };

    msg.status = 'Retrying';
    db.save();

    const payload: OutboundMessagePayload = {
      businessId: msg.businessId,
      recipientPhone: msg.recipientPhone || '+923138066389',
      text: msg.text,
      messageId: msg.id,
      conversationId: msg.conversationId,
      maxRetries: msg.maxRetries || 3,
      initialDelayMs: 1500,
    };

    const result = await this.sendMessageWithRetry(payload);
    return { success: result.success, message: msg, error: result.error };
  },

  // Query all active retrying messages
  getRetryingMessages(businessId?: string): {
    activeRetrying: MessageRecord[];
    recentlyFailed: MessageRecord[];
    metrics: {
      retryingCount: number;
      failedCount: number;
      totalRetriedCount: number;
    };
  } {
    let all = db.raw.messages;
    if (businessId) {
      all = all.filter((m) => m.businessId === businessId);
    }

    const activeRetrying = all.filter((m) => m.status === 'Retrying' || m.status === 'retrying');
    const recentlyFailed = all.filter((m) => m.status === 'failed' && m.retryCount && m.retryCount > 0);
    const totalRetried = all.filter((m) => (m.retryCount && m.retryCount > 0) || (m.retryHistory && m.retryHistory.length > 0));

    return {
      activeRetrying,
      recentlyFailed,
      metrics: {
        retryingCount: activeRetrying.length,
        failedCount: recentlyFailed.length,
        totalRetriedCount: totalRetried.length,
      },
    };
  },

  // Resume any pending retries on system start
  resumePendingRetries(): void {
    const pending = db.raw.messages.filter((m) => m.status === 'Retrying' || m.status === 'retrying');
    for (const msg of pending) {
      const payload: OutboundMessagePayload = {
        businessId: msg.businessId,
        recipientPhone: msg.recipientPhone || '+923138066389',
        text: msg.text,
        messageId: msg.id,
        conversationId: msg.conversationId,
        maxRetries: msg.maxRetries || 3,
        initialDelayMs: 2000,
      };
      this.scheduleRetry(msg.id, payload, msg.retryCount || 1, 1000, {
        maxRetries: msg.maxRetries || 3,
        initialDelayMs: 1500,
        backoffFactor: 2,
        maxDelayMs: 30000,
      });
    }
  },

  // Connection Diagnostics
  async testConnection(
    businessId: string,
    customCreds?: { phoneId?: string; accessToken?: string }
  ): Promise<{ success: boolean; details: string; phoneId?: string }> {
    const tenant = db.raw.businesses.find((b) => b.id === businessId) || db.raw.businesses[0];
    const phoneId = customCreds?.phoneId || tenant?.metaPhoneId;
    const accessToken = customCreds?.accessToken || tenant?.metaAccessToken;

    if (!phoneId || !accessToken || phoneId.includes('DEMO')) {
      return {
        success: false,
        details:
          'Sandbox Configuration: Meta Phone Number ID or Access Token is in Demo mode or unconfigured. Live messaging requires production credentials from developers.facebook.com.',
        phoneId: phoneId || undefined,
      };
    }

    try {
      const probeUrl = `https://graph.facebook.com/v20.0/${phoneId}`;
      const res = await fetch(probeUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();

      if (res.ok) {
        return {
          success: true,
          details: `Connected successfully to Meta WhatsApp Cloud API! Verified Name: ${data.verified_name || data.display_phone_number || 'Verified Business Phone'} (ID: ${data.id})`,
          phoneId,
        };
      } else {
        return {
          success: false,
          details: `Meta API connection failed: ${data.error?.message || res.statusText}`,
          phoneId,
        };
      }
    } catch (err: any) {
      return { success: false, details: `Network error connecting to Meta: ${err.message}` };
    }
  },
};
