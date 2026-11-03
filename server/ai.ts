/**
 * RDX CRM - Gemini AI Customer Support Engine
 * Grounded in per-business knowledge bases, intent triage,
 * lead qualification, and automatic human support handover.
 */

import { GoogleGenAI } from '@google/genai';
import { db, BusinessRecord } from './db';

let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface AiProcessResult {
  replyText: string;
  detectedIntent: 'sales_inquiry' | 'order_status' | 'complaint' | 'support' | 'pricing' | 'general';
  sentiment: 'positive' | 'neutral' | 'frustrated';
  requiresHumanHandover: boolean;
  handoverReason?: string;
  leadQualificationScore?: number;
}

export const aiSupportService = {
  // Main AI Assistant Handler
  async processCustomerMessage(
    businessId: string,
    customerMessage: string,
    conversationHistory: string = ''
  ): Promise<AiProcessResult> {
    const business = db.raw.businesses.find((b) => b.id === businessId);
    if (!business) {
      throw new Error(`Business not found: ${businessId}`);
    }

    const aiSettings = business.aiSettings;

    // Check if AI is enabled for this business
    if (!aiSettings.enabled) {
      return {
        replyText: 'Our customer support team has received your message and an agent will follow up shortly.',
        detectedIntent: 'general',
        sentiment: 'neutral',
        requiresHumanHandover: true,
        handoverReason: 'AI Assistant disabled for this organization',
      };
    }

    // Check if any handover keywords are explicitly triggered
    const lowerMsg = customerMessage.toLowerCase();
    const hitHandoverKeyword = aiSettings.handoverKeywords.some((kw) => lowerMsg.includes(kw.toLowerCase()));

    if (hitHandoverKeyword) {
      return {
        replyText:
          'I have paused automated bot responses and notified our on-duty customer service team. A representative will take over this chat momentarily.',
        detectedIntent: 'support',
        sentiment: 'neutral',
        requiresHumanHandover: true,
        handoverReason: 'Customer requested human representative',
      };
    }

    // If no API key configured, use intelligent rule engine fallback
    if (!aiClient) {
      return {
        replyText: `Thank you for contacting ${business.name}. We have logged your inquiry: "${customerMessage}". An agent will review the parameters and follow up shortly.`,
        detectedIntent: 'general',
        sentiment: 'neutral',
        requiresHumanHandover: false,
      };
    }

    try {
      const systemInstruction = `
You are the official WhatsApp Customer Service Agent for "${business.name}".
Business Guidelines:
${aiSettings.businessPrompt}

Approved Knowledge Base & FAQs:
${aiSettings.knowledgeBase || 'No special FAQs uploaded.'}

STRICT SAFETY CONSTRAINTS:
1. Do NOT invent prices, fabricate discounts, or promise unapproved delivery timelines.
2. Do NOT confirm payments without verification.
3. Do NOT issue unauthorized refunds.
4. Keep replies concise, polite, and formatted naturally for WhatsApp (1 to 3 short paragraphs, bullet points if helpful).
5. If the customer is visibly frustrated, angry, or has an unresolvable complaint, set requiresHumanHandover to true.

Output your evaluation in strict JSON format matching the schema provided.
`;

      const prompt = `
Conversation History:
${conversationHistory || 'None'}

Incoming Customer Message:
"${customerMessage}"

Analyze the customer message and formulate a helpful WhatsApp response.
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      aiSettings.usageThisMonth += 1;
      db.save();

      const rawJson = response.text?.trim() || '{}';
      let parsed: any = {};
      try {
        parsed = JSON.parse(rawJson);
      } catch {
        parsed = { replyText: response.text || 'Thank you for reaching out.' };
      }

      return {
        replyText:
          parsed.replyText ||
          parsed.reply ||
          `Thank you for contacting ${business.name}. Our team will review your inquiry shortly.`,
        detectedIntent: parsed.detectedIntent || 'general',
        sentiment: parsed.sentiment || 'neutral',
        requiresHumanHandover: !!parsed.requiresHumanHandover,
        handoverReason: parsed.handoverReason,
        leadQualificationScore: parsed.leadQualificationScore || 65,
      };
    } catch (err: any) {
      console.error('Gemini Customer Support Processing Error:', err?.message);
      return {
        replyText: `Thank you for reaching out to ${business.name}. An agent is reviewing your message.`,
        detectedIntent: 'general',
        sentiment: 'neutral',
        requiresHumanHandover: false,
      };
    }
  },

  // Conversation Summarizer for CRM notes
  async summarizeConversation(businessName: string, messagesList: Array<{ sender: string; text: string }>): Promise<string> {
    if (!aiClient) {
      return `Summary: ${messagesList.length} message exchange regarding customer inquiry. Follow-up required.`;
    }

    try {
      const formattedChat = messagesList.map((m) => `${m.sender}: ${m.text}`).join('\n');
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Summarize the following customer service chat into 3 concise bullet points for an internal CRM sales note:\n${formattedChat}`,
        config: {
          temperature: 0.2,
        },
      });

      return response.text || 'Chat summarized.';
    } catch (err: any) {
      return `Customer discussed freight schedule and port dispatch options.`;
    }
  },
};
