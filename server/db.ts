/**
 * RDX CRM - Multi-Tenant Relational-Ready Database Engine
 * Crash-resilient file persistence with strict tenant isolation and atomic writes.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type UserRole =
  | 'Platform Super Admin'
  | 'Business Owner'
  | 'Business Admin'
  | 'Team Agent'
  | 'Read-only Manager';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  businessId: string;
  businessName: string;
  status: 'active' | 'suspended';
  phone?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
  businessId: string;
  role: UserRole;
  expiresAt: string;
  createdAt: string;
}

export interface PasswordResetTokenRecord {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface BusinessRecord {
  id: string;
  name: string;
  ownerEmail: string;
  planId: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'suspended';
  connectedSince: string;
  // Meta WhatsApp Credentials (stored securely server-side)
  metaPhoneId?: string;
  metaWabaId?: string;
  metaAccessToken?: string;
  metaVerifyToken?: string;
  whatsappPhone?: string;
  // Per-business AI settings
  aiSettings: {
    enabled: boolean;
    businessPrompt: string;
    tone: 'professional' | 'friendly' | 'urgent' | 'direct';
    language: string;
    knowledgeBase: string;
    autoReplyOutsideHours: boolean;
    handoverKeywords: string[];
    monthlyUsageLimit: number;
    usageThisMonth: number;
  };
  // Limits and usage
  messagesSentThisMonth: number;
  messageLimit: number;
  agentSeatsLimit: number;
}

export interface ContactRecord {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  tags: string[];
  leadSource: string;
  leadStatus: 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';
  assignedToAgentId: string;
  assignedToAgentName: string;
  notes: Array<{
    id: string;
    authorName: string;
    text: string;
    timestamp: string;
  }>;
  customFields: Record<string, string>;
  estimatedDealValue?: number;
  createdAt: string;
  lastContactedAt: string;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  businessId: string;
  sender: 'customer' | 'agent' | 'system' | 'ai';
  senderName?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'Retrying' | 'retrying';
  metaMessageId?: string;
  isAiGenerated?: boolean;
  recipientPhone?: string;
  retryCount?: number;
  maxRetries?: number;
  nextRetryAt?: string;
  lastRetryError?: string;
  retryHistory?: Array<{
    attempt: number;
    timestamp: string;
    delayMs: number;
    status: 'Retrying' | 'delivered' | 'failed';
    error?: string;
  }>;
}

export interface ConversationRecord {
  id: string;
  businessId: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  unreadCount: number;
  state: 'open' | 'pending' | 'closed';
  lastMessageText: string;
  lastMessageTime: string;
  assignedAgentId: string;
  assignedAgentName: string;
  leadStatus: 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';
  isHandedOverToHuman: boolean;
}

export interface PipelineDealRecord {
  id: string;
  businessId: string;
  title: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  value: number;
  currency: string;
  assignedAgent: string;
  expectedCloseDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface FollowUpTaskRecord {
  id: string;
  businessId: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  title: string;
  dueTime: string;
  priority: 'urgent' | 'normal' | 'low';
  completed: boolean;
  assignedTo: string;
  notes?: string;
}

export interface N8nWorkflowRecord {
  id: string;
  name: string;
  triggerEvent: string;
  webhookUrl: string;
  authHeader?: string;
  active: boolean;
  description: string;
}

export interface WorkflowExecutionRecord {
  id: string;
  workflowId: string;
  businessId: string;
  event: string;
  status: 'success' | 'failed' | 'retrying';
  requestPayload: any;
  responseStatus?: number;
  responseBody?: string;
  executedAt: string;
  retryCount: number;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  businessId?: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Error';
  details?: string;
}

export interface IncomingWebhookLogRecord {
  id: string;
  timestamp: string;
  signature?: string;
  signatureValid: boolean;
  deliveryStatus: 'delivered' | 'processed' | 'rejected' | 'duplicate' | 'simulated';
  eventType: 'messages' | 'statuses' | 'verification_challenge' | 'unknown';
  payloadSummary: string;
  senderPhone?: string;
  recipientPhoneId?: string;
  wamid?: string;
  businessId?: string;
  rawPayloadSnippet: string;
  httpStatus: number;
}

export interface CampaignRecord {
  id: string;
  businessId: string;
  name: string;
  audienceSegment: string;
  templateId: string;
  templateName: string;
  scheduledAt?: string;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Completed' | 'Failed';
  totalRecipients: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  createdAt: string;
}

export interface ChatbotRecord {
  id: string;
  businessId: string;
  name: string;
  triggerKeyword: string;
  flowJson: string; // JSON serialized nodes & connections
  active: boolean;
  fallbackMessage: string;
  workingHoursOnly: boolean;
  handoverToHuman: boolean;
  createdAt: string;
}

export interface AppointmentRecord {
  id: string;
  businessId: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  title: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface SupportTicketRecord {
  id: string;
  businessId: string;
  businessName: string;
  submittedByEmail: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  replies: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlanRecord {
  id: string;
  name: string;
  pricePKR: number;
  priceUSD: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxContacts: number;
  maxMessages: number;
  maxAgents: number;
  isPopular?: boolean;
  active: boolean;
}

export interface PaymentRecord {
  id: string;
  businessId: string;
  businessName: string;
  amount: number;
  currency: string;
  planName: string;
  status: 'Paid' | 'Pending' | 'Failed';
  invoiceNumber: string;
  paymentMethod: string;
  date: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  expiryDate: string;
  usageCount: number;
  maxUsage?: number;
}

interface DatabaseSchema {
  users: UserRecord[];
  sessions: SessionRecord[];
  passwordResets: PasswordResetTokenRecord[];
  businesses: BusinessRecord[];
  contacts: ContactRecord[];
  conversations: ConversationRecord[];
  messages: MessageRecord[];
  deals: PipelineDealRecord[];
  tasks: FollowUpTaskRecord[];
  n8nWorkflows: N8nWorkflowRecord[];
  workflowExecutions: WorkflowExecutionRecord[];
  campaigns: CampaignRecord[];
  chatbots: ChatbotRecord[];
  appointments: AppointmentRecord[];
  supportTickets: SupportTicketRecord[];
  subscriptionPlans: SubscriptionPlanRecord[];
  payments: PaymentRecord[];
  coupons: CouponRecord[];
  auditLogs: AuditLogRecord[];
  processedWebhookMessageIds: Record<string, string>; // Deduplication map (wamid -> timestamp)
  incomingWebhookLogs: IncomingWebhookLogRecord[]; // Recent Meta webhook logs for developer debugging
  websiteContent: {
    heroHeadline: string;
    heroSubtitle: string;
    announcementText: string;
    announcementActive: boolean;
    aboutMission: string;
    contactPhone: string;
    contactWhatsappLink: string;
    contactEmail: string;
    footerText: string;
  };
  platformSettings: {
    platformName: string;
    tagline: string;
    whatsappNumber: string;
    whatsappLink: string;
    supportEmail: string;
    defaultTimezone: string;
    maintenanceMode: boolean;
    registrationOpen: boolean;
    metaCloudApiVersion: string;
    metaPhoneId?: string;
    metaWabaId?: string;
    metaAccessToken?: string;
    metaVerifyToken?: string;
    metaAppSecret?: string;
    n8nWebhookUrl?: string;
    n8nApiKey?: string;
  };
  theme: string;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'rdx_crm.json');

class DatabaseEngine {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadDatabase();
    this.seedInitialData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.incomingWebhookLogs || !Array.isArray(parsed.incomingWebhookLogs)) parsed.incomingWebhookLogs = [];
        if (!parsed.campaigns || !Array.isArray(parsed.campaigns)) parsed.campaigns = [];
        if (!parsed.chatbots || !Array.isArray(parsed.chatbots)) parsed.chatbots = [];
        if (!parsed.appointments || !Array.isArray(parsed.appointments)) parsed.appointments = [];
        if (!parsed.supportTickets || !Array.isArray(parsed.supportTickets)) parsed.supportTickets = [];
        if (!parsed.subscriptionPlans || !Array.isArray(parsed.subscriptionPlans)) parsed.subscriptionPlans = [];
        if (!parsed.payments || !Array.isArray(parsed.payments)) parsed.payments = [];
        if (!parsed.coupons || !Array.isArray(parsed.coupons)) parsed.coupons = [];

        // Ensure root administrator roles and credentials for platform owners
        if (parsed.users && Array.isArray(parsed.users)) {
          const rootAdmin = parsed.users.find((x: any) => x.email && x.email.toLowerCase() === 'admin@rdxcrm.com');
          for (const u of parsed.users) {
            if (u.email && (u.email.toLowerCase() === 'admin@rdxcrm.com' || u.email.toLowerCase() === 'ghufrankingrdx12@gmail.com')) {
              u.role = 'Platform Super Admin';
              u.businessId = 'biz_platform_hq';
              u.businessName = 'RDX CRM HQ';
              if (rootAdmin && u.email.toLowerCase() === 'ghufrankingrdx12@gmail.com') {
                u.salt = rootAdmin.salt;
                u.passwordHash = rootAdmin.passwordHash;
                u.name = 'Ghufran King';
                u.phone = '+923138066389';
              }
            }
          }
        }

        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file, initializing clean state:', err);
    }
    return this.createEmptySchema();
  }

  private createEmptySchema(): DatabaseSchema {
    return {
      users: [],
      sessions: [],
      passwordResets: [],
      businesses: [],
      contacts: [],
      conversations: [],
      messages: [],
      deals: [],
      tasks: [],
      n8nWorkflows: [],
      workflowExecutions: [],
      campaigns: [],
      chatbots: [],
      appointments: [],
      supportTickets: [],
      subscriptionPlans: [],
      payments: [],
      coupons: [],
      auditLogs: [],
      processedWebhookMessageIds: {},
      incomingWebhookLogs: [],
      websiteContent: {
        heroHeadline: 'Manage Every Customer Conversation in One Place',
        heroSubtitle:
          'Empower your sales, support, and operations teams with an enterprise-grade WhatsApp CRM. Built for speed, team collaboration, and measurable deal velocity.',
        announcementText:
          '🚀 Official WhatsApp Cloud API integration is live! Start managing customer conversations in real-time.',
        announcementActive: true,
        aboutMission:
          'RDX CRM connects modern commerce teams to where their customers already communicate: WhatsApp. We eliminate scattered chats, unassigned leads, and delayed replies with a unified team inbox, smart pipeline tracking, and workflow automation.',
        contactPhone: '+923138066389',
        contactWhatsappLink: 'https://wa.me/923138066389',
        contactEmail: 'contact@rdxcrm.com',
        footerText:
          '© 2026 RDX CRM. All rights reserved. Smart Conversations. Better Customer Relationships.',
      },
      platformSettings: {
        platformName: 'RDX CRM',
        tagline: 'Smart Conversations. Better Customer Relationships.',
        whatsappNumber: '+923138066389',
        whatsappLink: 'https://wa.me/923138066389',
        supportEmail: 'support@rdxcrm.com',
        defaultTimezone: 'Asia/Karachi (GMT+5)',
        maintenanceMode: false,
        registrationOpen: true,
        metaCloudApiVersion: 'v20.0',
        metaPhoneId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
        metaWabaId: '',
        metaAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
        metaVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'rdx_token_meta_cloud_waba_2026',
        metaAppSecret: '',
        n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || '',
        n8nApiKey: process.env.N8N_API_KEY || '',
      },
      theme: 'premium_white',
    };
  }

  public save(): void {
    try {
      this.ensureDirectory();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE); // Atomic write
    } catch (err) {
      console.error('Failed to write database atomically:', err);
    }
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  private seedInitialData() {
    // 1. Seed Initial Super Admin if none exists
    if (this.data.users.length === 0) {
      const adminSalt = crypto.randomBytes(16).toString('hex');
      const adminHash = this.hashPassword('Admin@RDX2026!', adminSalt);

      const superAdminUser: UserRecord = {
        id: 'usr_super_admin_01',
        name: 'Ghufran King',
        email: 'admin@rdxcrm.com',
        passwordHash: adminHash,
        salt: adminSalt,
        role: 'Platform Super Admin',
        businessId: 'biz_platform_hq',
        businessName: 'RDX CRM HQ',
        status: 'active',
        phone: '+923138066389',
        createdAt: '2026-01-01T00:00:00Z',
      };

      const ghufranAdminUser: UserRecord = {
        id: 'usr_super_admin_02',
        name: 'Ghufran King',
        email: 'ghufrankingrdx12@gmail.com',
        passwordHash: adminHash,
        salt: adminSalt,
        role: 'Platform Super Admin',
        businessId: 'biz_platform_hq',
        businessName: 'RDX CRM HQ',
        status: 'active',
        phone: '+923138066389',
        createdAt: '2026-01-01T00:00:00Z',
      };

      // 2. Seed Initial Demo Business 1: TechCorp Logistics
      const biz1Salt = crypto.randomBytes(16).toString('hex');
      const biz1Hash = this.hashPassword('TechCorp2026!', biz1Salt);

      const techCorpBiz: BusinessRecord = {
        id: 'biz_01',
        name: 'TechCorp Logistics',
        ownerEmail: 'sarah@techcorp.io',
        planId: 'growth',
        status: 'active',
        connectedSince: '2026-02-10T11:20:00Z',
        metaPhoneId: 'PHONE_ID_TECHCORP_DEMO',
        metaWabaId: 'WABA_TECHCORP_DEMO',
        metaVerifyToken: 'rdx_token_meta_cloud_waba_2026',
        whatsappPhone: '+1 (555) 019-2831',
        aiSettings: {
          enabled: true,
          businessPrompt:
            'You are an expert customer service representative for TechCorp Logistics. TechCorp specializes in cold-chain, pharmaceutical freight, and bonded container shipping between Karachi, Dubai, London, and New York. Deliver accurate, professional, and courteous service.',
          tone: 'professional',
          language: 'English',
          knowledgeBase:
            'Q: What are the pallet rates for bonded warehousing?\nA: Bonded warehousing starts at $45/pallet/month with 24/7 temperature monitoring.\nQ: What is the transit time from Karachi to London Gateway?\nA: Approximately 18 to 22 sea transit days.',
          autoReplyOutsideHours: true,
          handoverKeywords: ['human', 'agent', 'urgent', 'dispute', 'speak with someone', 'manager'],
          monthlyUsageLimit: 5000,
          usageThisMonth: 120,
        },
        messagesSentThisMonth: 4210,
        messageLimit: 12000,
        agentSeatsLimit: 10,
      };

      const bizUser1: UserRecord = {
        id: 'usr_biz_01',
        name: 'Sarah Jenkins',
        email: 'sarah@techcorp.io',
        passwordHash: biz1Hash,
        salt: biz1Salt,
        role: 'Business Owner',
        businessId: 'biz_01',
        businessName: 'TechCorp Logistics',
        status: 'active',
        phone: '+1 (555) 234-5678',
        createdAt: '2026-02-10T11:20:00Z',
      };

      const agentSalt = crypto.randomBytes(16).toString('hex');
      const agentHash = this.hashPassword('Agent@2026!', agentSalt);

      const agentUser: UserRecord = {
        id: 'usr_agent_01',
        name: 'Marcus Vance',
        email: 'marcus@techcorp.io',
        passwordHash: agentHash,
        salt: agentSalt,
        role: 'Team Agent',
        businessId: 'biz_01',
        businessName: 'TechCorp Logistics',
        status: 'active',
        phone: '+1 (555) 876-5432',
        createdAt: '2026-02-15T14:00:00Z',
      };

      // 3. Seed Second Business (Apex Retail Distribution) for Tenant Isolation Testing
      const biz2Salt = crypto.randomBytes(16).toString('hex');
      const biz2Hash = this.hashPassword('ApexRetail2026!', biz2Salt);

      const apexBiz: BusinessRecord = {
        id: 'biz_02',
        name: 'Apex Retail Distribution',
        ownerEmail: 'david@apexretail.com',
        planId: 'enterprise',
        status: 'active',
        connectedSince: '2026-03-01T09:30:00Z',
        metaPhoneId: 'PHONE_ID_APEX_DEMO',
        metaWabaId: 'WABA_APEX_DEMO',
        metaVerifyToken: 'rdx_token_meta_cloud_waba_2026',
        whatsappPhone: '+44 20 7946 0912',
        aiSettings: {
          enabled: false,
          businessPrompt: 'Apex Retail customer support',
          tone: 'friendly',
          language: 'English',
          knowledgeBase: 'Fast wholesale consumer retail delivery across the UK.',
          autoReplyOutsideHours: false,
          handoverKeywords: ['agent'],
          monthlyUsageLimit: 20000,
          usageThisMonth: 0,
        },
        messagesSentThisMonth: 18450,
        messageLimit: 60000,
        agentSeatsLimit: 35,
      };

      const bizUser2: UserRecord = {
        id: 'usr_biz_02',
        name: 'David Zhao',
        email: 'david@apexretail.com',
        passwordHash: biz2Hash,
        salt: biz2Salt,
        role: 'Business Owner',
        businessId: 'biz_02',
        businessName: 'Apex Retail Distribution',
        status: 'active',
        phone: '+44 20 7946 0912',
        createdAt: '2026-03-01T09:30:00Z',
      };

      this.data.businesses.push(techCorpBiz, apexBiz);
      this.data.users.push(superAdminUser, ghufranAdminUser, bizUser1, agentUser, bizUser2);

      // Seed Contacts for TechCorp
      const c1: ContactRecord = {
        id: 'cnt_01',
        businessId: 'biz_01',
        name: 'Kamran Ashraf',
        phone: '+92 312 4567890',
        email: 'kamran@falconfreight.com',
        company: 'Falcon Freight Solutions',
        tags: ['Wholesale', 'High Priority', 'Fleet Owner'],
        leadSource: 'WhatsApp Inbound',
        leadStatus: 'Qualified',
        assignedToAgentId: 'usr_agent_01',
        assignedToAgentName: 'Marcus Vance',
        notes: [
          {
            id: 'n_01',
            authorName: 'Marcus Vance',
            text: 'Client requested automated quotation for 12 refrigerated containers per month Karachi-Dubai route.',
            timestamp: '2026-03-08T15:30:00Z',
          },
        ],
        customFields: { ContainerType: 'Reefer 40ft', Destination: 'Jebel Ali Port' },
        estimatedDealValue: 14500,
        createdAt: '2026-03-02T10:15:00Z',
        lastContactedAt: '2026-03-10T14:22:00Z',
      };

      const c2: ContactRecord = {
        id: 'cnt_02',
        businessId: 'biz_01',
        name: 'Elena Rostova',
        phone: '+44 7700 900123',
        email: 'elena@novapharma.co.uk',
        company: 'Nova Healthcare UK',
        tags: ['Medical Logistics', 'Temperature Sensitive'],
        leadSource: 'Website Form',
        leadStatus: 'Contacted',
        assignedToAgentId: 'usr_biz_01',
        assignedToAgentName: 'Sarah Jenkins',
        notes: [],
        customFields: { GDPCompliant: 'Yes' },
        estimatedDealValue: 28000,
        createdAt: '2026-03-05T09:00:00Z',
        lastContactedAt: '2026-03-10T11:45:00Z',
      };

      // Seed Contact for Apex Retail (Private to biz_02)
      const cPrivateApex: ContactRecord = {
        id: 'cnt_apex_private_01',
        businessId: 'biz_02',
        name: 'Sir Arthur Wellesley',
        phone: '+44 20 8911 2233',
        email: 'arthur@wellesleyretail.co.uk',
        company: 'Wellesley Department Stores',
        tags: ['VIP Client', 'Confidential UK Accounts'],
        leadSource: 'Direct Referral',
        leadStatus: 'Won',
        assignedToAgentId: 'usr_biz_02',
        assignedToAgentName: 'David Zhao',
        notes: [{ id: 'n_priv', authorName: 'David Zhao', text: 'Confidential £120k contract', timestamp: '2026-03-01' }],
        customFields: { CreditLimit: '£500,000' },
        estimatedDealValue: 120000,
        createdAt: '2026-03-01T10:00:00Z',
        lastContactedAt: '2026-03-01T10:00:00Z',
      };

      this.data.contacts.push(c1, c2, cPrivateApex);

      // Seed Conversations & Messages for TechCorp
      const conv1: ConversationRecord = {
        id: 'conv_01',
        businessId: 'biz_01',
        contactId: 'cnt_01',
        contactName: 'Kamran Ashraf',
        contactPhone: '+92 312 4567890',
        unreadCount: 1,
        state: 'open',
        lastMessageText: 'Can you provide the bill of lading tracking number for vessel MV Indus Star?',
        lastMessageTime: '10:42 AM',
        assignedAgentId: 'usr_agent_01',
        assignedAgentName: 'Marcus Vance',
        leadStatus: 'Qualified',
        isHandedOverToHuman: true,
      };

      const m1: MessageRecord = {
        id: 'msg_01_1',
        conversationId: 'conv_01',
        businessId: 'biz_01',
        sender: 'customer',
        text: 'Hello Sarah & Marcus, hope you are well. We are finalizing our April cargo schedule.',
        timestamp: '10:30 AM',
        status: 'read',
      };
      const m2: MessageRecord = {
        id: 'msg_01_2',
        conversationId: 'conv_01',
        businessId: 'biz_01',
        sender: 'agent',
        senderName: 'Marcus Vance',
        text: 'Hello Mr. Kamran! Great to connect. Your quote for the 12 reefer containers was sent to your email.',
        timestamp: '10:35 AM',
        status: 'read',
      };
      const m3: MessageRecord = {
        id: 'msg_01_3',
        conversationId: 'conv_01',
        businessId: 'biz_01',
        sender: 'customer',
        text: 'Can you provide the bill of lading tracking number for vessel MV Indus Star?',
        timestamp: '10:42 AM',
        status: 'delivered',
      };

      this.data.conversations.push(conv1);
      this.data.messages.push(m1, m2, m3);

      // Seed Pipeline Deals
      this.data.deals.push({
        id: 'deal_01',
        businessId: 'biz_01',
        title: 'Cold Chain Pharma Express (6 Mo)',
        contactId: 'cnt_02',
        contactName: 'Elena Rostova',
        contactPhone: '+44 7700 900123',
        stage: 'contacted',
        value: 28000,
        currency: 'USD',
        assignedAgent: 'Sarah Jenkins',
        expectedCloseDate: '2026-04-01',
        priority: 'high',
      });

      // Seed 7 n8n Workflows
      this.data.n8nWorkflows = [
        {
          id: 'n8n_wf_01',
          name: '1. Inbound WhatsApp Message Ingestion',
          triggerEvent: 'whatsapp.message.received',
          webhookUrl: 'https://n8n.rdxcrm.internal/webhook/whatsapp-inbound',
          active: true,
          description: 'Validates payload, locates business by Phone ID, verifies contact, and notifies agents.',
        },
        {
          id: 'n8n_wf_02',
          name: '2. New Lead Pipeline Synchronizer',
          triggerEvent: 'crm.lead.created',
          webhookUrl: 'https://n8n.rdxcrm.internal/webhook/new-lead-sync',
          active: true,
          description: 'Updates CRM contact, calculates preliminary score, and notifies assigned agent.',
        },
        {
          id: 'n8n_wf_03',
          name: '3. AI Intent & Triage Classifier',
          triggerEvent: 'ai.intent.classified',
          webhookUrl: 'https://n8n.rdxcrm.internal/webhook/ai-triage',
          active: true,
          description: 'Routes urgent complaints or refund requests to human supervisor; dispatches approved FAQs.',
        },
        {
          id: 'n8n_wf_04',
          name: '4. Unanswered Enquiry Auto Follow-up',
          triggerEvent: 'crm.enquiry.unanswered',
          webhookUrl: 'https://n8n.rdxcrm.internal/webhook/followup-scheduler',
          active: true,
          description: 'Creates high-priority follow-up task if lead is unaddressed for over 15 minutes.',
        },
        {
          id: 'n8n_wf_05',
          name: '5. Qualified Deal Pipeline Advance',
          triggerEvent: 'pipeline.deal.qualified',
          webhookUrl: 'https://n8n.rdxcrm.internal/webhook/deal-advance',
          active: true,
          description: 'Sends formal quotation template on WhatsApp when deal advances to Qualified or Won.',
        },
        {
          id: 'n8n_wf_06',
          name: '6. Human Agent Handover Interceptor',
          triggerEvent: 'agent.handover.requested',
          webhookUrl: 'https://n8n.rdxcrm.internal/webhook/human-handover',
          active: true,
          description: 'Disables automated bots, sets chat state to Open, and sends push alert to on-duty staff.',
        },
        {
          id: 'n8n_wf_07',
          name: '7. API Failure & Telemetry Alert',
          triggerEvent: 'api.error.failure',
          webhookUrl: 'https://n8n.rdxcrm.internal/webhook/system-alerts',
          active: true,
          description: 'Records failed WhatsApp deliveries or Meta Graph API 4xx/5xx codes to incident channel.',
        },
      ];

      this.data.auditLogs.push({
        id: 'log_seed_01',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'System Provisioning',
        role: 'system',
        action: 'INIT_SYSTEM_DATABASE',
        target: 'Multi-Tenant Database Initialized with Root Super Admin',
        ipAddress: '127.0.0.1',
        status: 'Success',
      });

      this.save();
    }

    // Seed sample webhook logs if none exist yet to aid developer debugging
    if (!this.data.incomingWebhookLogs || this.data.incomingWebhookLogs.length === 0) {
      this.data.incomingWebhookLogs = [
        {
          id: 'wh_log_01',
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          signature: 'sha256=9f8e4b7c2a1d0f5e8c3b6a9d2e1f4a7c0b3d6e9f1a2c5b8d0e3f6a9c2b5e8a1d',
          signatureValid: true,
          deliveryStatus: 'processed',
          eventType: 'messages',
          payloadSummary: 'Inbound customer inquiry from +923138066389 (1 text message)',
          senderPhone: '+923138066389',
          recipientPhoneId: '105948382718291',
          wamid: 'wamid.HBgMOTIzMTM4MDY2Mzg5FQIAEhggM0Y3NDk2NTE5RjhFMkM0OUE0RUUy',
          businessId: 'biz_01',
          rawPayloadSnippet: JSON.stringify(
            {
              object: 'whatsapp_business_account',
              entry: [
                {
                  id: '104829104928172',
                  changes: [
                    {
                      value: {
                        messaging_product: 'whatsapp',
                        metadata: {
                          display_phone_number: '+923138066389',
                          phone_number_id: '105948382718291',
                        },
                        contacts: [{ profile: { name: 'Kamran Logistics' }, wa_id: '923138066389' }],
                        messages: [
                          {
                            from: '923138066389',
                            id: 'wamid.HBgMOTIzMTM4MDY2Mzg5FQIAEhggM0Y3NDk2NTE5RjhFMkM0OUE0RUUy',
                            timestamp: '1745812920',
                            text: { body: 'Can you provide the bill of lading tracking number for vessel MV Indus Star?' },
                            type: 'text',
                          },
                        ],
                      },
                      field: 'messages',
                    },
                  ],
                },
              ],
            },
            null,
            2
          ),
          httpStatus: 200,
        },
        {
          id: 'wh_log_02',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          signature: 'sha256=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
          signatureValid: true,
          deliveryStatus: 'delivered',
          eventType: 'statuses',
          payloadSummary: 'Message delivery status update: delivered to +447700900123',
          senderPhone: '+447700900123',
          recipientPhoneId: '105948382718291',
          wamid: 'wamid.HBgNDNDc3MDA5MDAxMjMxFgIAEhggMUEyQjNDNEQ1RTZG',
          businessId: 'biz_01',
          rawPayloadSnippet: JSON.stringify(
            {
              object: 'whatsapp_business_account',
              entry: [
                {
                  id: '104829104928172',
                  changes: [
                    {
                      value: {
                        messaging_product: 'whatsapp',
                        metadata: {
                          display_phone_number: '+923138066389',
                          phone_number_id: '105948382718291',
                        },
                        statuses: [
                          {
                            id: 'wamid.HBgNDNDc3MDA5MDAxMjMxFgIAEhggMUEyQjNDNEQ1RTZG',
                            status: 'delivered',
                            timestamp: '1745812140',
                            recipient_id: '447700900123',
                          },
                        ],
                      },
                      field: 'messages',
                    },
                  ],
                },
              ],
            },
            null,
            2
          ),
          httpStatus: 200,
        },
        {
          id: 'wh_log_03',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          signature: undefined,
          signatureValid: true,
          deliveryStatus: 'delivered',
          eventType: 'verification_challenge',
          payloadSummary: 'Meta Webhook Handshake verified (hub.mode=subscribe, hub.challenge accepted)',
          rawPayloadSnippet: JSON.stringify(
            {
              'hub.mode': 'subscribe',
              'hub.verify_token': 'rdx_token_meta_cloud_waba_2026',
              'hub.challenge': '115820948293182',
            },
            null,
            2
          ),
          httpStatus: 200,
        },
      ];
    }

    // Seed Subscription Plans if none exist
    if (!this.data.subscriptionPlans || this.data.subscriptionPlans.length === 0) {
      this.data.subscriptionPlans = [
        {
          id: 'plan_trial',
          name: 'Free Trial',
          pricePKR: 0,
          priceUSD: 0,
          interval: 'monthly',
          features: ['100 WhatsApp Messages', '250 Contacts', '1 Team Agent', 'Shared Team Inbox', 'Basic Auto-Replies', '14-Day Free Evaluation'],
          maxContacts: 250,
          maxMessages: 100,
          maxAgents: 1,
          isPopular: false,
          active: true,
        },
        {
          id: 'plan_starter',
          name: 'Starter',
          pricePKR: 499,
          priceUSD: 5,
          interval: 'monthly',
          features: ['1,000 Messages / month', '1,000 Contacts', '2 Team Agents', 'Shared Team Inbox', 'Quick Replies & Templates', 'Custom Lead Tags', 'Standard Analytics'],
          maxContacts: 1000,
          maxMessages: 1000,
          maxAgents: 2,
          isPopular: false,
          active: true,
        },
        {
          id: 'plan_pro',
          name: 'Professional',
          pricePKR: 999,
          priceUSD: 10,
          interval: 'monthly',
          features: ['5,000 Messages / month', '5,000 Contacts', '5 Team Agents', 'Visual Chatbot Builder', 'Broadcast Campaigns', 'Kanban Sales Pipeline', 'CSV Import & Export', 'Priority Webhook Queue'],
          maxContacts: 5000,
          maxMessages: 5000,
          maxAgents: 5,
          isPopular: true,
          active: true,
        },
        {
          id: 'plan_biz',
          name: 'Business',
          pricePKR: 1999,
          priceUSD: 20,
          interval: 'monthly',
          features: ['25,000 Messages / month', '25,000 Contacts', '15 Team Agents', 'Full Gemini AI Assistant', 'Advanced Workflow Automations', 'Shopify & WooCommerce Sync', 'Appointments Booking', 'Custom Webhooks & API'],
          maxContacts: 25000,
          maxMessages: 25000,
          maxAgents: 15,
          isPopular: false,
          active: true,
        },
        {
          id: 'plan_enterprise',
          name: 'Enterprise',
          pricePKR: 4999,
          priceUSD: 50,
          interval: 'monthly',
          features: ['Unlimited Messages (Fair Use)', '100,000 Contacts', '50 Team Agents', 'Dedicated WhatsApp Account Manager', 'Multi-WABA Load Balancing', 'Custom SLA & 99.99% Uptime', 'White-label Custom Domain'],
          maxContacts: 100000,
          maxMessages: 100000,
          maxAgents: 50,
          isPopular: false,
          active: true,
        },
      ];
    }

    // Seed Campaigns if empty
    if (!this.data.campaigns || this.data.campaigns.length === 0) {
      this.data.campaigns = [
        {
          id: 'cmp_01',
          businessId: 'biz_01',
          name: 'Ramadan Wholesale Flash Offer',
          audienceSegment: 'Wholesale Clients',
          templateId: 'tmpl_promo_01',
          templateName: 'ramadan_special_discount',
          status: 'Completed',
          totalRecipients: 450,
          deliveredCount: 442,
          readCount: 388,
          failedCount: 8,
          createdAt: '2026-03-01T10:00:00Z',
        },
        {
          id: 'cmp_02',
          businessId: 'biz_01',
          name: 'Logistics Fleet Tracking Alert',
          audienceSegment: 'Active Shipments',
          templateId: 'tmpl_tracking_02',
          templateName: 'shipment_vessel_update',
          status: 'Sending',
          totalRecipients: 120,
          deliveredCount: 95,
          readCount: 82,
          failedCount: 0,
          createdAt: '2026-03-03T08:30:00Z',
        },
      ];
    }

    // Seed Chatbots if empty
    if (!this.data.chatbots || this.data.chatbots.length === 0) {
      this.data.chatbots = [
        {
          id: 'bot_01',
          businessId: 'biz_01',
          name: '24/7 Inbound Lead Qualifier',
          triggerKeyword: 'HI, HELLO, INFO, PRICING',
          flowJson: JSON.stringify({
            nodes: [
              { id: '1', type: 'trigger', data: { label: 'Keyword Match: HI, HELLO' } },
              { id: '2', type: 'message', data: { label: 'Welcome! How can we assist your business today?' } },
              { id: '3', type: 'buttons', data: { options: ['View Freight Rates', 'Track Shipment', 'Talk to Agent'] } },
            ],
          }),
          active: true,
          fallbackMessage: 'Thank you for messaging us. Our team will get back to you shortly.',
          workingHoursOnly: false,
          handoverToHuman: true,
          createdAt: '2026-02-15T10:00:00Z',
        },
      ];
    }

    // Seed Appointments if empty
    if (!this.data.appointments || this.data.appointments.length === 0) {
      this.data.appointments = [
        {
          id: 'apt_01',
          businessId: 'biz_01',
          contactId: 'cnt_01',
          contactName: 'Kamran Ashraf',
          contactPhone: '+92 312 4567890',
          title: 'Fleet Contract Renewal & Pricing Discussion',
          scheduledTime: '2026-03-10T14:00:00',
          status: 'Confirmed',
          notes: 'Discuss 15-container recurring weekly freight agreement.',
          createdAt: '2026-03-02T12:00:00Z',
        },
      ];
    }

    // Seed Support Tickets if empty
    if (!this.data.supportTickets || this.data.supportTickets.length === 0) {
      this.data.supportTickets = [
        {
          id: 'tkt_01',
          businessId: 'biz_01',
          businessName: 'TechCorp Logistics',
          submittedByEmail: 'sarah@techcorp.io',
          subject: 'Request assistance with Meta Cloud API Webhook token rotation',
          description: 'We are updating our Meta App secret and need verification check on our webhook listener.',
          priority: 'High',
          status: 'In Progress',
          replies: [
            {
              id: 'rep_01',
              sender: 'Super Admin',
              text: 'Hello Sarah, your webhook endpoint is verified and active. You can rotate tokens in Settings > WhatsApp Cloud API.',
              timestamp: '2026-03-02 11:30 AM',
            },
          ],
          createdAt: '2026-03-02T09:15:00Z',
          updatedAt: '2026-03-02T11:30:00Z',
        },
      ];
    }

    // Seed Coupons if empty
    if (!this.data.coupons || this.data.coupons.length === 0) {
      this.data.coupons = [
        {
          id: 'cpn_01',
          code: 'RDXPRO20',
          discountPercent: 20,
          active: true,
          expiryDate: '2026-12-31',
          usageCount: 14,
          maxUsage: 100,
        },
      ];
    }

    // Seed Payments if empty
    if (!this.data.payments || this.data.payments.length === 0) {
      this.data.payments = [
        {
          id: 'pay_01',
          businessId: 'biz_01',
          businessName: 'TechCorp Logistics',
          amount: 1999,
          currency: 'PKR',
          planName: 'Business',
          status: 'Paid',
          invoiceNumber: 'INV-2026-0041',
          paymentMethod: 'Bank Transfer / JazzCash',
          date: '2026-03-01',
        },
      ];
    }

    this.save();
  }

  // Exposed Collections Getters & Mutators
  public get raw(): DatabaseSchema {
    return this.data;
  }
}

export const db = new DatabaseEngine();
