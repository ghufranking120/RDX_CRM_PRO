/**
 * RDX CRM - Comprehensive TypeScript Type Definitions
 */

export type UserRole =
  | 'Platform Super Admin'
  | 'Business Owner'
  | 'Business Admin'
  | 'Team Agent'
  | 'Read-only Manager'
  | 'super_admin'
  | 'business_admin'
  | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId: string;
  businessName: string;
  avatar?: string;
  status: 'active' | 'suspended' | 'pending';
  phone?: string;
  createdAt: string;
  lastActive: string;
}

export interface BusinessTenant {
  id: string;
  name: string;
  whatsappPhone: string;
  whatsappAccountId?: string;
  ownerEmail: string;
  planId: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'suspended';
  connectedSince: string;
  messagesSentThisMonth: number;
  messageLimit: number;
  agentSeatsUsed: number;
  agentSeatsLimit: number;
  features: {
    aiReplies: boolean;
    pipeline: boolean;
    webhooks: boolean;
    customTemplates: boolean;
  };
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Won' | 'Lost';
export type LeadSource = 'WhatsApp Inbound' | 'Website Form' | 'Meta Ad' | 'Referral' | 'Direct Import';

export interface InternalNote {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  timestamp: string;
}

export interface Contact {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  tags: string[];
  leadSource: LeadSource;
  leadStatus: LeadStatus;
  assignedToAgentId: string;
  assignedToAgentName: string;
  notes: InternalNote[];
  estimatedDealValue?: number;
  createdAt: string;
  lastContactedAt: string;
}

export type ConversationState = 'open' | 'pending' | 'closed';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'customer' | 'agent' | 'system' | 'ai';
  senderName?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'Retrying' | 'retrying';
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'document';
  isAiGenerated?: boolean;
  metaMessageId?: string;
  isSimulated?: boolean;
  retryCount?: number;
  maxRetries?: number;
  nextRetryAt?: string;
  lastRetryError?: string;
}

export interface Conversation {
  id: string;
  businessId: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactAvatar?: string;
  unreadCount: number;
  state: ConversationState;
  lastMessageText: string;
  lastMessageTime: string;
  assignedAgentId: string;
  assignedAgentName: string;
  leadStatus: LeadStatus;
  isHandedOverToHuman: boolean;
  messages: ChatMessage[];
}

export type PipelineStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export interface PipelineDeal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  stage: PipelineStage;
  value: number;
  currency: string;
  assignedAgent: string;
  expectedCloseDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface FollowUpTask {
  id: string;
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

export interface QuickReply {
  id: string;
  shortcut: string; // e.g. /welcome
  title: string;
  message: string;
  category: 'General' | 'Sales' | 'Support' | 'Onboarding';
}

export interface MessageTemplate {
  id: string;
  name: string;
  language: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  body: string;
  headerText?: string;
  footerText?: string;
  variables: string[];
  lastUpdated: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  executionsCount: number;
  lastTriggered?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Agent';
  phone: string;
  status: 'active' | 'invited' | 'offline';
  assignedChatsCount: number;
}

export interface PlanConfig {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  messageLimit: number;
  agentLimit: number;
  features: string[];
  popular?: boolean;
}

export type ThemeId =
  | 'premium_white'
  | 'dark_professional'
  | 'ocean_blue'
  | 'midnight'
  | 'royal_purple'
  | 'sunset'
  | 'minimal_bw';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  primaryColor: string;
  bgPreview: string;
  cardPreview: string;
  textColor: string;
  description: string;
}

export interface WebsiteContent {
  heroHeadline: string;
  heroSubtitle: string;
  announcementText: string;
  announcementActive: boolean;
  aboutMission: string;
  contactPhone: string;
  contactWhatsappLink: string;
  contactEmail: string;
  footerText: string;
}

export interface PlatformSettings {
  platformName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappLink: string;
  supportEmail: string;
  defaultTimezone: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  metaCloudApiVersion: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Error';
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  altText: string;
  type: string;
  sizeBytes: number;
  category: 'logo' | 'banner' | 'feature' | 'avatar';
  uploadedAt: string;
}

export interface Campaign {
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

export interface ChatbotFlow {
  id: string;
  businessId: string;
  name: string;
  triggerKeyword: string;
  flowJson: string;
  active: boolean;
  fallbackMessage: string;
  workingHoursOnly: boolean;
  handoverToHuman: boolean;
  createdAt: string;
}

export interface Appointment {
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

export interface SupportTicket {
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

export interface SubscriptionPlan {
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

export interface PaymentInvoice {
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

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  expiryDate: string;
  usageCount: number;
  maxUsage?: number;
}

