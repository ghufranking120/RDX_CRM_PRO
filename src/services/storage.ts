/**
 * RDX CRM - Persistent Storage & Mock Data Engine
 * Manages realistic CRM state, synced to localStorage with export/backup support.
 */

import {
  User,
  BusinessTenant,
  Contact,
  Conversation,
  ChatMessage,
  PipelineDeal,
  FollowUpTask,
  QuickReply,
  MessageTemplate,
  AutomationWorkflow,
  TeamMember,
  PlanConfig,
  WebsiteContent,
  PlatformSettings,
  AuditLog,
  MediaItem,
  ThemeId,
} from '../types';

export const OFFICIAL_WHATSAPP_NUMBER = '+923138066389';
export const OFFICIAL_WHATSAPP_LINK = 'https://wa.me/923138066389';

const STORAGE_KEYS = {
  CURRENT_USER: 'rdx_crm_current_user',
  ACTIVE_THEME: 'rdx_crm_theme',
  USERS: 'rdx_crm_users',
  BUSINESSES: 'rdx_crm_businesses',
  CONTACTS: 'rdx_crm_contacts',
  CONVERSATIONS: 'rdx_crm_conversations',
  PIPELINE_DEALS: 'rdx_crm_pipeline_deals',
  FOLLOWUP_TASKS: 'rdx_crm_followup_tasks',
  QUICK_REPLIES: 'rdx_crm_quick_replies',
  MESSAGE_TEMPLATES: 'rdx_crm_message_templates',
  AUTOMATIONS: 'rdx_crm_automations',
  TEAM_MEMBERS: 'rdx_crm_team_members',
  PLANS: 'rdx_crm_plans',
  WEBSITE_CONTENT: 'rdx_crm_website_content',
  PLATFORM_SETTINGS: 'rdx_crm_platform_settings',
  AUDIT_LOGS: 'rdx_crm_audit_logs',
  MEDIA_ITEMS: 'rdx_crm_media_items',
};

// Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_01',
    name: 'Ghufran King',
    email: 'admin@rdxcrm.com',
    role: 'super_admin',
    businessId: 'biz_rdx_platform',
    businessName: 'RDX CRM HQ',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: OFFICIAL_WHATSAPP_NUMBER,
    createdAt: '2025-01-15T08:00:00Z',
    lastActive: 'Just now',
  },
  {
    id: 'user_biz_01',
    name: 'Sarah Jenkins',
    email: 'sarah@techcorp.io',
    role: 'business_admin',
    businessId: 'biz_01',
    businessName: 'TechCorp Logistics',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '+1 (555) 234-5678',
    createdAt: '2025-02-10T11:20:00Z',
    lastActive: '5 mins ago',
  },
  {
    id: 'user_agent_01',
    name: 'Marcus Vance',
    email: 'marcus@techcorp.io',
    role: 'agent',
    businessId: 'biz_01',
    businessName: 'TechCorp Logistics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '+1 (555) 876-5432',
    createdAt: '2025-02-15T14:00:00Z',
    lastActive: '12 mins ago',
  },
  {
    id: 'user_biz_02',
    name: 'David Zhao',
    email: 'david@apexretail.com',
    role: 'business_admin',
    businessId: 'biz_02',
    businessName: 'Apex Retail Distribution',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    phone: '+44 20 7946 0912',
    createdAt: '2025-03-01T09:30:00Z',
    lastActive: '1 hour ago',
  },
];

// Seed Businesses
const INITIAL_BUSINESSES: BusinessTenant[] = [
  {
    id: 'biz_01',
    name: 'TechCorp Logistics',
    whatsappPhone: '+1 (555) 019-2831',
    whatsappAccountId: 'waba_techcorp_88291',
    ownerEmail: 'sarah@techcorp.io',
    planId: 'growth',
    status: 'active',
    connectedSince: '2025-02-10T11:20:00Z',
    messagesSentThisMonth: 4210,
    messageLimit: 10000,
    agentSeatsUsed: 4,
    agentSeatsLimit: 10,
    features: {
      aiReplies: true,
      pipeline: true,
      webhooks: true,
      customTemplates: true,
    },
  },
  {
    id: 'biz_02',
    name: 'Apex Retail Distribution',
    whatsappPhone: '+44 20 7946 0912',
    whatsappAccountId: 'waba_apex_19284',
    ownerEmail: 'david@apexretail.com',
    planId: 'enterprise',
    status: 'active',
    connectedSince: '2025-03-01T09:30:00Z',
    messagesSentThisMonth: 18450,
    messageLimit: 50000,
    agentSeatsUsed: 12,
    agentSeatsLimit: 30,
    features: {
      aiReplies: true,
      pipeline: true,
      webhooks: true,
      customTemplates: true,
    },
  },
  {
    id: 'biz_03',
    name: 'Boutique Flora & Co',
    whatsappPhone: '+92 300 1234567',
    ownerEmail: 'sales@flora.pk',
    planId: 'starter',
    status: 'active',
    connectedSince: '2025-04-12T16:00:00Z',
    messagesSentThisMonth: 620,
    messageLimit: 1500,
    agentSeatsUsed: 2,
    agentSeatsLimit: 2,
    features: {
      aiReplies: false,
      pipeline: true,
      webhooks: false,
      customTemplates: false,
    },
  },
];

// Seed Contacts for TechCorp Logistics
const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt_01',
    businessId: 'biz_01',
    name: 'Kamran Ashraf',
    phone: '+92 312 4567890',
    email: 'kamran@falconfreight.com',
    company: 'Falcon Freight Solutions',
    tags: ['Wholesale', 'High Priority', 'Fleet Owner'],
    leadSource: 'WhatsApp Inbound',
    leadStatus: 'Qualified',
    assignedToAgentId: 'user_agent_01',
    assignedToAgentName: 'Marcus Vance',
    estimatedDealValue: 14500,
    createdAt: '2026-03-02T10:15:00Z',
    lastContactedAt: '2026-03-10T14:22:00Z',
    notes: [
      {
        id: 'n_01',
        authorName: 'Marcus Vance',
        authorRole: 'Senior Agent',
        text: 'Client requested automated quotation for 12 refrigerated containers per month Karachi-Dubai route.',
        timestamp: '2026-03-08T15:30:00Z',
      },
    ],
  },
  {
    id: 'cnt_02',
    businessId: 'biz_01',
    name: 'Elena Rostova',
    phone: '+44 7700 900123',
    email: 'elena@novapharma.co.uk',
    company: 'Nova Healthcare UK',
    tags: ['Medical Logistics', 'Temperature Sensitive'],
    leadSource: 'Website Form',
    leadStatus: 'Contacted',
    assignedToAgentId: 'user_biz_01',
    assignedToAgentName: 'Sarah Jenkins',
    estimatedDealValue: 28000,
    createdAt: '2026-03-05T09:00:00Z',
    lastContactedAt: '2026-03-10T11:45:00Z',
    notes: [],
  },
  {
    id: 'cnt_03',
    businessId: 'biz_01',
    name: 'Tariq Mehmood',
    phone: '+92 300 8899221',
    email: 'tariq@mehmoodtextiles.com',
    company: 'Mehmood Export Mills',
    tags: ['Enterprise', 'Ready to Sign'],
    leadSource: 'Referral',
    leadStatus: 'Won',
    assignedToAgentId: 'user_agent_01',
    assignedToAgentName: 'Marcus Vance',
    estimatedDealValue: 52000,
    createdAt: '2026-02-18T14:00:00Z',
    lastContactedAt: '2026-03-09T18:10:00Z',
    notes: [
      {
        id: 'n_02',
        authorName: 'Sarah Jenkins',
        authorRole: 'Manager',
        text: 'Contract finalized and signed via DocuSign. First shipment departs next Monday.',
        timestamp: '2026-03-09T18:15:00Z',
      },
    ],
  },
  {
    id: 'cnt_04',
    businessId: 'biz_01',
    name: 'Omar Farooq',
    phone: '+971 50 123 4567',
    email: 'omar@gulfbuilders.ae',
    company: 'Gulf Horizon Engineering',
    tags: ['Inbound Lead', 'New'],
    leadSource: 'Meta Ad',
    leadStatus: 'New',
    assignedToAgentId: 'user_biz_01',
    assignedToAgentName: 'Sarah Jenkins',
    estimatedDealValue: 9200,
    createdAt: '2026-03-10T08:12:00Z',
    lastContactedAt: '2026-03-10T08:12:00Z',
    notes: [],
  },
  {
    id: 'cnt_05',
    businessId: 'biz_01',
    name: 'Sophia Chen',
    phone: '+1 415 555 9012',
    email: 'sophia@baytechdevices.com',
    company: 'BayTech Hardware',
    tags: ['Customs Clearance', 'Follow-up Required'],
    leadSource: 'WhatsApp Inbound',
    leadStatus: 'Contacted',
    assignedToAgentId: 'user_agent_01',
    assignedToAgentName: 'Marcus Vance',
    estimatedDealValue: 18000,
    createdAt: '2026-03-07T12:00:00Z',
    lastContactedAt: '2026-03-10T16:04:00Z',
    notes: [],
  },
];

// Seed Conversations
const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_01',
    businessId: 'biz_01',
    contactId: 'cnt_01',
    contactName: 'Kamran Ashraf',
    contactPhone: '+92 312 4567890',
    unreadCount: 1,
    state: 'open',
    lastMessageText: 'Can you provide the bill of lading tracking number for vessel MV Indus Star?',
    lastMessageTime: '10:42 AM',
    assignedAgentId: 'user_agent_01',
    assignedAgentName: 'Marcus Vance',
    leadStatus: 'Qualified',
    isHandedOverToHuman: true,
    messages: [
      {
        id: 'msg_01_1',
        conversationId: 'conv_01',
        sender: 'customer',
        text: 'Hello Sarah & Marcus, hope you are well. We are finalizing our April cargo schedule.',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: 'msg_01_2',
        conversationId: 'conv_01',
        sender: 'agent',
        senderName: 'Marcus Vance',
        text: 'Hello Mr. Kamran! Great to connect. Your quote for the 12 reefer containers was sent to your email with preferred port dispatch rates.',
        timestamp: '10:35 AM',
        status: 'read',
      },
      {
        id: 'msg_01_3',
        conversationId: 'conv_01',
        sender: 'customer',
        text: 'Can you provide the bill of lading tracking number for vessel MV Indus Star?',
        timestamp: '10:42 AM',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'conv_02',
    businessId: 'biz_01',
    contactId: 'cnt_04',
    contactName: 'Omar Farooq',
    contactPhone: '+971 50 123 4567',
    unreadCount: 0,
    state: 'pending',
    lastMessageText: 'Thank you for reaching out! One of our shipping managers will review your cargo specs.',
    lastMessageTime: '08:14 AM',
    assignedAgentId: 'user_biz_01',
    assignedAgentName: 'Sarah Jenkins',
    leadStatus: 'New',
    isHandedOverToHuman: false,
    messages: [
      {
        id: 'msg_02_1',
        conversationId: 'conv_02',
        sender: 'customer',
        text: 'Hi, I saw your ad on Meta about bonded warehousing in Jebel Ali. What are your monthly pallet rates?',
        timestamp: '08:12 AM',
        status: 'read',
      },
      {
        id: 'msg_02_2',
        conversationId: 'conv_02',
        sender: 'ai',
        senderName: 'RDX AI Assistant',
        text: 'Thank you for reaching out! One of our shipping managers will review your cargo specs shortly. In the meantime, you can review our standard rates brochure here: https://rdxcrm.com/warehousing',
        timestamp: '08:14 AM',
        status: 'read',
        isAiGenerated: true,
      },
    ],
  },
  {
    id: 'conv_03',
    businessId: 'biz_01',
    contactId: 'cnt_05',
    contactName: 'Sophia Chen',
    contactPhone: '+1 415 555 9012',
    unreadCount: 0,
    state: 'closed',
    lastMessageText: 'Perfect, the customs clearance document has been approved.',
    lastMessageTime: 'Yesterday',
    assignedAgentId: 'user_agent_01',
    assignedAgentName: 'Marcus Vance',
    leadStatus: 'Contacted',
    isHandedOverToHuman: true,
    messages: [
      {
        id: 'msg_03_1',
        conversationId: 'conv_03',
        sender: 'customer',
        text: 'Did customs release the HS-8471 shipment from Port of Long Beach?',
        timestamp: 'Yesterday 3:15 PM',
        status: 'read',
      },
      {
        id: 'msg_03_2',
        conversationId: 'conv_03',
        sender: 'agent',
        senderName: 'Marcus Vance',
        text: 'Perfect, the customs clearance document has been approved. The gate pass is issued and carrier is en route.',
        timestamp: 'Yesterday 3:45 PM',
        status: 'read',
      },
    ],
  },
];

// Seed Pipeline Deals
const INITIAL_PIPELINE_DEALS: PipelineDeal[] = [
  {
    id: 'deal_01',
    title: 'Bonded Warehouse Storage - Q2',
    contactId: 'cnt_04',
    contactName: 'Omar Farooq',
    contactPhone: '+971 50 123 4567',
    stage: 'new',
    value: 9200,
    currency: 'USD',
    assignedAgent: 'Sarah Jenkins',
    expectedCloseDate: '2026-04-15',
    priority: 'medium',
  },
  {
    id: 'deal_02',
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
  },
  {
    id: 'deal_03',
    title: '12x Reefer Monthly Sea Freight',
    contactId: 'cnt_01',
    contactName: 'Kamran Ashraf',
    contactPhone: '+92 312 4567890',
    stage: 'qualified',
    value: 14500,
    currency: 'USD',
    assignedAgent: 'Marcus Vance',
    expectedCloseDate: '2026-03-25',
    priority: 'high',
  },
  {
    id: 'deal_04',
    title: 'Trans-Pacific Electronic Freight',
    contactId: 'cnt_05',
    contactName: 'Sophia Chen',
    contactPhone: '+1 415 555 9012',
    stage: 'proposal',
    value: 18000,
    currency: 'USD',
    assignedAgent: 'Marcus Vance',
    expectedCloseDate: '2026-03-20',
    priority: 'medium',
  },
  {
    id: 'deal_05',
    title: 'Annual Textile Export Logistics',
    contactId: 'cnt_03',
    contactName: 'Tariq Mehmood',
    contactPhone: '+92 300 8899221',
    stage: 'won',
    value: 52000,
    currency: 'USD',
    assignedAgent: 'Marcus Vance',
    expectedCloseDate: '2026-03-09',
    priority: 'high',
  },
];

// Seed Follow-up Tasks
const INITIAL_FOLLOWUP_TASKS: FollowUpTask[] = [
  {
    id: 'task_01',
    contactId: 'cnt_01',
    contactName: 'Kamran Ashraf',
    contactPhone: '+92 312 4567890',
    title: 'Send Bill of Lading tracking PIN and ETA verification to client',
    dueTime: 'Today, 2:00 PM',
    priority: 'urgent',
    completed: false,
    assignedTo: 'Marcus Vance',
    notes: 'Verify transshipment schedule via shipping line portal first.',
  },
  {
    id: 'task_02',
    contactId: 'cnt_02',
    contactName: 'Elena Rostova',
    contactPhone: '+44 7700 900123',
    title: 'Follow up on Pharma cold-chain compliance certificate approval',
    dueTime: 'Tomorrow, 11:00 AM',
    priority: 'normal',
    completed: false,
    assignedTo: 'Sarah Jenkins',
    notes: 'Elena will discuss with their regulatory officer on Wednesday.',
  },
  {
    id: 'task_03',
    contactId: 'cnt_04',
    contactName: 'Omar Farooq',
    contactPhone: '+971 50 123 4567',
    title: 'Call prospect regarding warehouse pallet dimensions and hazard grade',
    dueTime: 'Mar 22, 10:00 AM',
    priority: 'normal',
    completed: false,
    assignedTo: 'Sarah Jenkins',
  },
  {
    id: 'task_04',
    contactId: 'cnt_03',
    contactName: 'Tariq Mehmood',
    contactPhone: '+92 300 8899221',
    title: 'Send initial dispatch invoice and welcome onboarding kit',
    dueTime: 'Completed yesterday',
    priority: 'normal',
    completed: true,
    assignedTo: 'Marcus Vance',
  },
];

// Seed Quick Replies
const INITIAL_QUICK_REPLIES: QuickReply[] = [
  {
    id: 'qr_01',
    shortcut: '/welcome',
    title: 'Standard Greeting',
    message: 'Hello! Thank you for contacting RDX CRM support. How can our team assist you today?',
    category: 'General',
  },
  {
    id: 'qr_02',
    shortcut: '/pricing',
    title: 'Pricing & Plans Overview',
    message: 'We offer flexible tiers starting from $29/month with official Meta WhatsApp Cloud API connectivity. View full plans at: https://rdxcrm.com/pricing',
    category: 'Sales',
  },
  {
    id: 'qr_03',
    shortcut: '/support',
    title: 'Direct WhatsApp Support',
    message: 'For urgent assistance, reach our senior team directly on WhatsApp: +923138066389 (https://wa.me/923138066389)',
    category: 'Support',
  },
  {
    id: 'qr_04',
    shortcut: '/hours',
    title: 'Business Hours',
    message: 'Our offices are open Monday to Friday, 9:00 AM to 6:00 PM (GMT+5). Emergency WhatsApp monitoring is active 24/7.',
    category: 'General',
  },
  {
    id: 'qr_05',
    shortcut: '/bank',
    title: 'Payment & Wire Details',
    message: 'Payment can be made via credit card, Stripe, or direct corporate bank wire. We will generate your official proforma invoice.',
    category: 'Sales',
  },
];

// Seed Message Templates (Meta Cloud API style)
const INITIAL_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tmpl_01',
    name: 'order_status_update',
    language: 'en_US',
    category: 'UTILITY',
    status: 'APPROVED',
    body: 'Hello {{1}}, your order #{{2}} is now confirmed with status: {{3}}. Track delivery here: {{4}}',
    headerText: 'Order Update',
    footerText: 'RDX CRM Automated Notifications',
    variables: ['Customer Name', 'Order ID', 'Status', 'Tracking URL'],
    lastUpdated: '2026-02-15',
  },
  {
    id: 'tmpl_02',
    name: 'meeting_reminder_v1',
    language: 'en_US',
    category: 'UTILITY',
    status: 'APPROVED',
    body: 'Hi {{1}}, this is a friendly reminder for our scheduled meeting on {{2}} at {{3}}. Please reply YES to confirm.',
    headerText: 'Meeting Reminder',
    footerText: 'Reply STOP to unsubscribe',
    variables: ['Name', 'Date', 'Time'],
    lastUpdated: '2026-02-28',
  },
  {
    id: 'tmpl_03',
    name: 'promotional_offer_spring',
    language: 'en_US',
    category: 'MARKETING',
    status: 'PENDING',
    body: 'Exclusive Offer for {{1}}! Get 25% discount on all freight consignments booked before {{2}}. Use code: {{3}}',
    headerText: 'Special Announcement',
    variables: ['Name', 'Expiry Date', 'Voucher Code'],
    lastUpdated: '2026-03-08',
  },
];

// Seed Automations
const INITIAL_AUTOMATIONS: AutomationWorkflow[] = [
  {
    id: 'wf_01',
    name: 'Out of Hours Auto-Responder',
    trigger: 'Inbound message received outside 9 AM - 6 PM',
    action: 'Send quick reply "/hours" and assign to queue',
    active: true,
    executionsCount: 384,
    lastTriggered: 'Last night at 11:40 PM',
  },
  {
    id: 'wf_02',
    name: 'New Lead Auto-Tag & Notification',
    trigger: 'Contact created via WhatsApp Inbound',
    action: 'Set status to "New", tag with "WhatsApp Inbound", notify on-duty agent',
    active: true,
    executionsCount: 89,
    lastTriggered: 'Today at 08:12 AM',
  },
  {
    id: 'wf_03',
    name: 'Deal Won Onboarding Sequence',
    trigger: 'Pipeline deal moved to "Won"',
    action: 'Send approved WhatsApp template "order_status_update" and notify billing',
    active: true,
    executionsCount: 42,
    lastTriggered: 'Yesterday at 6:15 PM',
  },
  {
    id: 'wf_04',
    name: 'Dormant Lead Re-engagement',
    trigger: 'No contact for 14 days on qualified leads',
    action: 'Create follow-up task for assigned agent',
    active: false,
    executionsCount: 15,
  },
];

// Seed Team Members
const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm_01',
    name: 'Sarah Jenkins',
    email: 'sarah@techcorp.io',
    role: 'Owner',
    phone: '+1 (555) 234-5678',
    status: 'active',
    assignedChatsCount: 8,
  },
  {
    id: 'tm_02',
    name: 'Marcus Vance',
    email: 'marcus@techcorp.io',
    role: 'Admin',
    phone: '+1 (555) 876-5432',
    status: 'active',
    assignedChatsCount: 14,
  },
  {
    id: 'tm_03',
    name: 'Aisha Siddiqui',
    email: 'aisha@techcorp.io',
    role: 'Agent',
    phone: '+92 301 9988776',
    status: 'active',
    assignedChatsCount: 6,
  },
  {
    id: 'tm_04',
    name: 'Leo Martin',
    email: 'leo@techcorp.io',
    role: 'Agent',
    phone: '+44 7911 123456',
    status: 'invited',
    assignedChatsCount: 0,
  },
];

// Seed Plans
const INITIAL_PLANS: PlanConfig[] = [
  {
    id: 'starter',
    name: 'Starter Tier',
    description: 'Designed for small businesses launching WhatsApp customer engagement.',
    priceMonthly: 29,
    priceYearly: 24,
    messageLimit: 2500,
    agentLimit: 3,
    features: [
      'Official WhatsApp Cloud API connection',
      'Shared Team Inbox (up to 3 agents)',
      'Basic CRM Contact Management',
      'Pre-approved Message Templates',
      'Quick Replies & Tagging',
      'Email Support (48h SLA)',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Professional',
    description: 'Ideal for scaling businesses managing active sales pipelines and multi-agent support.',
    priceMonthly: 79,
    priceYearly: 65,
    messageLimit: 12000,
    agentLimit: 10,
    popular: true,
    features: [
      'Everything in Starter',
      'Interactive Sales Pipeline Kanban',
      'AI Smart Reply Assistant & Tone Tuning',
      'Automated Workflow Rules & Drip sequences',
      'Follow-up Tasks & Agent Reminders',
      'Comprehensive Message & Conversion Analytics',
      'n8n & Webhook Integrations',
      'Priority WhatsApp Support (+923138066389)',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    description: 'For high-volume operations requiring custom quotas, compliance and dedicated SLA.',
    priceMonthly: 199,
    priceYearly: 165,
    messageLimit: 60000,
    agentLimit: 35,
    features: [
      'Everything in Growth',
      'Unlimited Automated Workflows',
      'Custom LLM Fine-tuning & Knowledge Base',
      'Multi-Business Tenant Routing',
      'Audit Logging & Security Controls',
      'Dedicated Account Manager on WhatsApp',
      'Custom SLAs (99.9% uptime guarantee)',
    ],
  },
];

// Seed Website Content (Editable via Super Admin!)
const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  heroHeadline: 'Manage Every Customer Conversation in One Place',
  heroSubtitle: 'Empower your sales, support, and operations teams with an enterprise-grade WhatsApp CRM. Built for speed, team collaboration, and measurable deal velocity.',
  announcementText: '🚀 Official WhatsApp Cloud API integration is live! Start managing customer conversations in real-time.',
  announcementActive: true,
  aboutMission: 'RDX CRM connects modern commerce teams to where their customers already communicate: WhatsApp. We eliminate scattered chats, unassigned leads, and delayed replies with a unified team inbox, smart pipeline tracking, and workflow automation.',
  contactPhone: OFFICIAL_WHATSAPP_NUMBER,
  contactWhatsappLink: OFFICIAL_WHATSAPP_LINK,
  contactEmail: 'contact@rdxcrm.com',
  footerText: '© 2026 RDX CRM. All rights reserved. Smart Conversations. Better Customer Relationships.',
};

// Seed Platform Settings
const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  platformName: 'RDX CRM',
  tagline: 'Smart Conversations. Better Customer Relationships.',
  whatsappNumber: OFFICIAL_WHATSAPP_NUMBER,
  whatsappLink: OFFICIAL_WHATSAPP_LINK,
  supportEmail: 'support@rdxcrm.com',
  defaultTimezone: 'Asia/Karachi (GMT+5)',
  maintenanceMode: false,
  registrationOpen: true,
  metaCloudApiVersion: 'v20.0',
};

// Seed Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: '2026-03-10 10:14:22',
    actor: 'Ghufran King (admin@rdxcrm.com)',
    role: 'super_admin',
    action: 'UPDATE_PLATFORM_CONFIG',
    target: 'WhatsApp Cloud API Webhook Verified',
    ipAddress: '182.180.142.12',
    status: 'Success',
  },
  {
    id: 'log_02',
    timestamp: '2026-03-10 09:45:00',
    actor: 'Sarah Jenkins (sarah@techcorp.io)',
    role: 'business_admin',
    action: 'EXPORT_CONTACTS',
    target: 'techcorp_contacts_export.csv',
    ipAddress: '72.134.20.91',
    status: 'Success',
  },
  {
    id: 'log_03',
    timestamp: '2026-03-09 18:15:30',
    actor: 'Marcus Vance (marcus@techcorp.io)',
    role: 'agent',
    action: 'STAGE_CHANGE_WON',
    target: 'Deal #deal_05 ($52,000)',
    ipAddress: '72.134.20.94',
    status: 'Success',
  },
  {
    id: 'log_04',
    timestamp: '2026-03-09 14:02:11',
    actor: 'System Automation',
    role: 'system',
    action: 'TRIGGER_WORKFLOW',
    target: 'Out of Hours Auto-Responder (wf_01)',
    ipAddress: '127.0.0.1',
    status: 'Success',
  },
];

// Seed Media Items
const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med_01',
    name: 'RDX CRM Primary Logo Mark',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    altText: 'RDX CRM Official Vector Logo in Dark Navy & Sky Blue',
    type: 'image/png',
    sizeBytes: 84200,
    category: 'logo',
    uploadedAt: '2026-01-10',
  },
  {
    id: 'med_02',
    name: 'WhatsApp CRM Dashboard Hero Showcase',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    altText: 'SaaS multi-channel conversation inbox interface preview',
    type: 'image/jpeg',
    sizeBytes: 420800,
    category: 'banner',
    uploadedAt: '2026-02-01',
  },
  {
    id: 'med_03',
    name: 'Sales Pipeline Kanban Preview',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    altText: 'Kanban sales pipeline deal stages interface',
    type: 'image/jpeg',
    sizeBytes: 312000,
    category: 'feature',
    uploadedAt: '2026-02-14',
  },
];

// Helper to safely get from localStorage
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage:`, err);
    return fallback;
  }
}

// Helper to safely set to localStorage
function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing key ${key} to localStorage:`, err);
  }
}

// Global Storage Manager Object
export const storageService = {
  // Current User
  getCurrentUser(): User {
    return getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },
  setCurrentUser(user: User): void {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Active Theme
  getTheme(): ThemeId {
    return getStored<ThemeId>(STORAGE_KEYS.ACTIVE_THEME, 'premium_white');
  },
  setTheme(theme: ThemeId): void {
    setStored(STORAGE_KEYS.ACTIVE_THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  // Users
  getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  saveUsers(users: User[]): void {
    setStored(STORAGE_KEYS.USERS, users);
  },
  updateUser(updated: User): void {
    const list = this.getUsers().map((u) => (u.id === updated.id ? updated : u));
    this.saveUsers(list);
  },

  // Businesses
  getBusinesses(): BusinessTenant[] {
    return getStored<BusinessTenant[]>(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
  },
  saveBusinesses(list: BusinessTenant[]): void {
    setStored(STORAGE_KEYS.BUSINESSES, list);
  },
  updateBusiness(updated: BusinessTenant): void {
    const list = this.getBusinesses().map((b) => (b.id === updated.id ? updated : b));
    this.saveBusinesses(list);
  },

  // Contacts
  getContacts(businessId = 'biz_01'): Contact[] {
    const all = getStored<Contact[]>(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
    return all.filter((c) => c.businessId === businessId);
  },
  getAllContacts(): Contact[] {
    return getStored<Contact[]>(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
  },
  saveContacts(contacts: Contact[]): void {
    setStored(STORAGE_KEYS.CONTACTS, contacts);
  },
  addContact(contact: Contact): void {
    const all = this.getAllContacts();
    this.saveContacts([contact, ...all]);
  },
  updateContact(updated: Contact): void {
    const all = this.getAllContacts().map((c) => (c.id === updated.id ? updated : c));
    this.saveContacts(all);
  },
  deleteContact(id: string): void {
    const all = this.getAllContacts().filter((c) => c.id !== id);
    this.saveContacts(all);
  },

  // Conversations
  getConversations(businessId = 'biz_01'): Conversation[] {
    const all = getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
    return all.filter((c) => c.businessId === businessId);
  },
  getAllConversations(): Conversation[] {
    return getStored<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  },
  saveConversations(conversations: Conversation[]): void {
    setStored(STORAGE_KEYS.CONVERSATIONS, conversations);
  },
  addMessageToConversation(conversationId: string, message: ChatMessage): void {
    const all = this.getAllConversations().map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessageText: message.text,
          lastMessageTime: message.timestamp,
          messages: [...conv.messages, message],
        };
      }
      return conv;
    });
    this.saveConversations(all);
  },
  updateConversationState(conversationId: string, state: 'open' | 'pending' | 'closed'): void {
    const all = this.getAllConversations().map((conv) => {
      if (conv.id === conversationId) {
        return { ...conv, state };
      }
      return conv;
    });
    this.saveConversations(all);
  },
  toggleHumanHandover(conversationId: string): void {
    const all = this.getAllConversations().map((conv) => {
      if (conv.id === conversationId) {
        return { ...conv, isHandedOverToHuman: !conv.isHandedOverToHuman };
      }
      return conv;
    });
    this.saveConversations(all);
  },

  // Pipeline Deals
  getPipelineDeals(): PipelineDeal[] {
    return getStored<PipelineDeal[]>(STORAGE_KEYS.PIPELINE_DEALS, INITIAL_PIPELINE_DEALS);
  },
  savePipelineDeals(deals: PipelineDeal[]): void {
    setStored(STORAGE_KEYS.PIPELINE_DEALS, deals);
  },
  updateDealStage(dealId: string, stage: PipelineDeal['stage']): void {
    const deals = this.getPipelineDeals().map((d) => (d.id === dealId ? { ...d, stage } : d));
    this.savePipelineDeals(deals);
  },
  addDeal(deal: PipelineDeal): void {
    const deals = this.getPipelineDeals();
    this.savePipelineDeals([deal, ...deals]);
  },

  // Follow-up Tasks
  getFollowUpTasks(): FollowUpTask[] {
    return getStored<FollowUpTask[]>(STORAGE_KEYS.FOLLOWUP_TASKS, INITIAL_FOLLOWUP_TASKS);
  },
  saveFollowUpTasks(tasks: FollowUpTask[]): void {
    setStored(STORAGE_KEYS.FOLLOWUP_TASKS, tasks);
  },
  toggleTaskCompleted(taskId: string): void {
    const tasks = this.getFollowUpTasks().map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    this.saveFollowUpTasks(tasks);
  },
  addTask(task: FollowUpTask): void {
    const tasks = this.getFollowUpTasks();
    this.saveFollowUpTasks([task, ...tasks]);
  },

  // Quick Replies
  getQuickReplies(): QuickReply[] {
    return getStored<QuickReply[]>(STORAGE_KEYS.QUICK_REPLIES, INITIAL_QUICK_REPLIES);
  },
  saveQuickReplies(list: QuickReply[]): void {
    setStored(STORAGE_KEYS.QUICK_REPLIES, list);
  },
  addQuickReply(item: QuickReply): void {
    const list = this.getQuickReplies();
    this.saveQuickReplies([item, ...list]);
  },
  deleteQuickReply(id: string): void {
    const list = this.getQuickReplies().filter((q) => q.id !== id);
    this.saveQuickReplies(list);
  },

  // Message Templates
  getMessageTemplates(): MessageTemplate[] {
    return getStored<MessageTemplate[]>(STORAGE_KEYS.MESSAGE_TEMPLATES, INITIAL_MESSAGE_TEMPLATES);
  },
  saveMessageTemplates(list: MessageTemplate[]): void {
    setStored(STORAGE_KEYS.MESSAGE_TEMPLATES, list);
  },
  addMessageTemplate(tmpl: MessageTemplate): void {
    const list = this.getMessageTemplates();
    this.saveMessageTemplates([tmpl, ...list]);
  },

  // Automation Workflows
  getAutomations(): AutomationWorkflow[] {
    return getStored<AutomationWorkflow[]>(STORAGE_KEYS.AUTOMATIONS, INITIAL_AUTOMATIONS);
  },
  saveAutomations(list: AutomationWorkflow[]): void {
    setStored(STORAGE_KEYS.AUTOMATIONS, list);
  },
  toggleAutomation(id: string): void {
    const list = this.getAutomations().map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    this.saveAutomations(list);
  },
  updateAutomation(updated: AutomationWorkflow): void {
    const list = this.getAutomations().map((a) => (a.id === updated.id ? updated : a));
    this.saveAutomations(list);
  },
  addAutomation(item: AutomationWorkflow): void {
    const list = this.getAutomations();
    this.saveAutomations([item, ...list]);
  },

  // Team Members
  getTeamMembers(): TeamMember[] {
    return getStored<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS, INITIAL_TEAM_MEMBERS);
  },
  saveTeamMembers(list: TeamMember[]): void {
    setStored(STORAGE_KEYS.TEAM_MEMBERS, list);
  },
  addTeamMember(member: TeamMember): void {
    const list = this.getTeamMembers();
    this.saveTeamMembers([...list, member]);
  },

  // Plans & Billing
  getPlans(): PlanConfig[] {
    return getStored<PlanConfig[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  },
  savePlans(plans: PlanConfig[]): void {
    setStored(STORAGE_KEYS.PLANS, plans);
  },
  updatePlan(updated: PlanConfig): void {
    const plans = this.getPlans().map((p) => (p.id === updated.id ? updated : p));
    this.savePlans(plans);
  },

  // Website Content
  getWebsiteContent(): WebsiteContent {
    return getStored<WebsiteContent>(STORAGE_KEYS.WEBSITE_CONTENT, INITIAL_WEBSITE_CONTENT);
  },
  saveWebsiteContent(content: WebsiteContent): void {
    setStored(STORAGE_KEYS.WEBSITE_CONTENT, content);
  },

  // Platform Settings
  getPlatformSettings(): PlatformSettings {
    return getStored<PlatformSettings>(STORAGE_KEYS.PLATFORM_SETTINGS, INITIAL_PLATFORM_SETTINGS);
  },
  savePlatformSettings(settings: PlatformSettings): void {
    setStored(STORAGE_KEYS.PLATFORM_SETTINGS, settings);
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const newEntry: AuditLog = {
      ...entry,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    const list = this.getAuditLogs();
    setStored(STORAGE_KEYS.AUDIT_LOGS, [newEntry, ...list]);
  },

  // Media Items
  getMediaItems(): MediaItem[] {
    return getStored<MediaItem[]>(STORAGE_KEYS.MEDIA_ITEMS, INITIAL_MEDIA_ITEMS);
  },
  saveMediaItems(items: MediaItem[]): void {
    setStored(STORAGE_KEYS.MEDIA_ITEMS, items);
  },
  addMediaItem(item: MediaItem): void {
    const list = this.getMediaItems();
    this.saveMediaItems([item, ...list]);
  },
  deleteMediaItem(id: string): void {
    const list = this.getMediaItems().filter((m) => m.id !== id);
    this.saveMediaItems(list);
  },

  // Full System Export (Backup)
  exportFullBackup(): string {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      platform: 'RDX CRM',
      version: '1.0.0',
      data: {
        users: this.getUsers(),
        businesses: this.getBusinesses(),
        contacts: this.getAllContacts(),
        conversations: this.getAllConversations(),
        deals: this.getPipelineDeals(),
        tasks: this.getFollowUpTasks(),
        quickReplies: this.getQuickReplies(),
        templates: this.getMessageTemplates(),
        automations: this.getAutomations(),
        team: this.getTeamMembers(),
        plans: this.getPlans(),
        website: this.getWebsiteContent(),
        settings: this.getPlatformSettings(),
        auditLogs: this.getAuditLogs(),
        media: this.getMediaItems(),
        theme: this.getTheme(),
      },
    };
    return JSON.stringify(snapshot, null, 2);
  },

  // Full System Restore
  restoreFromBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) return false;
      const d = parsed.data;
      if (d.users) this.saveUsers(d.users);
      if (d.businesses) this.saveBusinesses(d.businesses);
      if (d.contacts) this.saveContacts(d.contacts);
      if (d.conversations) this.saveConversations(d.conversations);
      if (d.deals) this.savePipelineDeals(d.deals);
      if (d.tasks) this.saveFollowUpTasks(d.tasks);
      if (d.quickReplies) this.saveQuickReplies(d.quickReplies);
      if (d.templates) this.saveMessageTemplates(d.templates);
      if (d.automations) this.saveAutomations(d.automations);
      if (d.team) this.saveTeamMembers(d.team);
      if (d.plans) this.savePlans(d.plans);
      if (d.website) this.saveWebsiteContent(d.website);
      if (d.settings) this.savePlatformSettings(d.settings);
      if (d.auditLogs) setStored(STORAGE_KEYS.AUDIT_LOGS, d.auditLogs);
      if (d.media) this.saveMediaItems(d.media);
      if (d.theme) this.setTheme(d.theme);

      this.addAuditLog({
        actor: 'Admin Console',
        role: 'super_admin',
        action: 'RESTORE_DATABASE',
        target: 'System state restored from external backup JSON',
        ipAddress: '127.0.0.1',
        status: 'Success',
      });
      return true;
    } catch (err) {
      console.error('Failed to parse backup JSON:', err);
      return false;
    }
  },

  // Reset to Factory Defaults
  resetDefaults(): void {
    localStorage.clear();
    this.setTheme('premium_white');
  },
};
