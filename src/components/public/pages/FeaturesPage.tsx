import React from 'react';
import {
  MessageSquare,
  Users,
  Bot,
  UserCheck,
  CalendarCheck,
  BarChart3,
  GitBranch,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';
import { PublicPageId } from '../PublicNavbar';
import { OFFICIAL_WHATSAPP_LINK } from '../../../services/storage';

interface FeaturesPageProps {
  onNavigate: (page: PublicPageId) => void;
  onOpenDashboard: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate, onOpenDashboard }) => {
  const deepFeatures = [
    {
      icon: MessageSquare,
      title: 'Official WhatsApp Business Cloud API Inbox',
      summary: 'Centralize every incoming and outgoing message with official Meta API compliance.',
      bullets: [
        'Direct connection to WhatsApp Business Platform — zero risk of phone number disconnection or ban.',
        'Supports rich media including images, documents, PDF proposals, voice notes, and location pins.',
        'Real-time delivery status checkmarks (Sent, Delivered, Read).',
        'Open, Pending, and Closed conversation lifecycle states for zero lost inquiries.',
      ],
    },
    {
      icon: Users,
      title: 'Customer Data Platform & Contact Management',
      summary: 'Keep complete customer context at your agents’ fingertips in real time.',
      bullets: [
        'Automatic contact creation on first WhatsApp message with phone number validation.',
        'Dynamic tags: Wholesale, VIP, Urgent, Inactive, Customs, or Custom categories.',
        'Private internal notes shared between agents without customer visibility.',
        'Lead status tracking: New, Contacted, Qualified, Won, and Lost.',
      ],
    },
    {
      icon: Bot,
      title: 'AI Smart Replies & Conversation Assistant',
      summary: 'Equip your team with intelligent Gemini-powered suggestions to accelerate response times.',
      bullets: [
        'Context-aware answer generation trained on previous inquiries and business guidelines.',
        'One-click conversation summarization into concise CRM notes.',
        'Tone shifter: rephrase replies into Professional, Warm & Friendly, or Direct formats.',
        'Instant multilingual translation for cross-border commerce.',
      ],
    },
    {
      icon: UserCheck,
      title: 'Multi-Agent Routing & Human Handover',
      summary: 'Scale customer service across 5 to 50+ representatives seamlessly.',
      bullets: [
        'Automated round-robin or agent-specific assignment of new customer chats.',
        'One-click Human Support Handover switch to disable bot responses and assign a specialist.',
        'Agent activity tracking and assigned conversation limits.',
        'Role-based permissions (Super Admin, Business Admin, Support Agent).',
      ],
    },
    {
      icon: GitBranch,
      title: 'Interactive Sales Pipeline Kanban',
      summary: 'Turn casual chats into predictable closed deals.',
      bullets: [
        'Visual 5-stage drag-and-move pipeline: New, Contacted, Qualified, Proposal, Won/Lost.',
        'Estimated deal value sum calculation per pipeline column.',
        'Expected close dates and deal priority indicators.',
        'Instant WhatsApp chat launch from any deal card.',
      ],
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics & Operational Metrics',
      summary: 'Make data-backed decisions with complete visibility into response speed and conversions.',
      bullets: [
        'First-response time (FRT) and mean time to resolution (MTTR) monitoring.',
        'Inbound vs Outbound message volume charts over 7, 30, and 90 days.',
        'Lead-to-deal conversion funnel tracking.',
        'Individual agent output and resolution metrics.',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">
          Full Platform Architecture
        </span>
        <h1 className="text-4xl font-extrabold text-[#101D35] tracking-tight">
          Every Tool You Need to Scale WhatsApp Operations
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          RDX CRM bridges enterprise CRM capabilities with the immediacy of WhatsApp, enabling fast response times and measurable revenue growth.
        </p>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {deepFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#101D35] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#101D35]">{feat.title}</h3>
                  <p className="text-xs text-slate-500">{feat.summary}</p>
                </div>
              </div>

              <ul className="space-y-3 pt-2">
                {feat.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Security & Compliance callout */}
      <div className="bg-[#101D35] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-[#55B9F5] text-xs font-semibold">
            <Lock className="w-4 h-4" />
            <span>Enterprise Security & Data Isolation</span>
          </div>
          <h4 className="text-xl font-bold">Multi-tenant Architecture with Strict Data Boundaries</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every business account operates in isolated virtual tenancy. Messages, customer profiles, and internal notes are never accessible across organizations. Encrypted in transit with TLS 1.3.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenDashboard}
            className="bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35] font-semibold px-5 py-3 rounded-xl text-xs transition-colors"
          >
            Launch Interactive Dashboard
          </button>
          <a
            href={OFFICIAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-5 py-3 rounded-xl text-xs transition-colors"
          >
            Ask a Technical Question
          </a>
        </div>
      </div>
    </div>
  );
};
