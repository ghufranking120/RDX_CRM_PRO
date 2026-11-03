import React from 'react';
import { ShieldCheck, MessageSquare, Zap, Cpu, ArrowRight } from 'lucide-react';
import { PublicPageId } from '../PublicNavbar';
import { storageService, OFFICIAL_WHATSAPP_LINK, OFFICIAL_WHATSAPP_NUMBER } from '../../../services/storage';

interface AboutPageProps {
  onNavigate: (page: PublicPageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const websiteContent = storageService.getWebsiteContent();

  const values = [
    {
      icon: MessageSquare,
      title: 'Customer-First Communication',
      desc: 'We believe modern business relationships belong in real-time chat, where customers already live, not buried in unanswered email inboxes.',
    },
    {
      icon: ShieldCheck,
      title: 'Official Compliance & Integrity',
      desc: 'We strictly utilize the official Meta WhatsApp Business Cloud API. We never use unofficial scrapers, reverse-engineered protocols, or brittle hacks.',
    },
    {
      icon: Cpu,
      title: 'Intelligent Human Assistance',
      desc: 'AI should empower customer service agents rather than replace them clumsily. Our assistants summarize, suggest, and translate while keeping humans in full control.',
    },
    {
      icon: Zap,
      title: 'Operational Velocity',
      desc: 'Every millisecond counts when a lead is waiting. Our shared inbox and workflow automations are engineered for instantaneous response.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">
          About RDX CRM
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#101D35] tracking-tight">
          Smart Conversations. Better Customer Relationships.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {websiteContent.aboutMission}
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((val, idx) => {
          const Icon = val.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF6FF] text-[#101D35] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#55B9F5]" />
              </div>
              <h3 className="text-base font-bold text-[#101D35]">{val.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Platform Architecture & Official Standard */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">Engineering Standard</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#101D35]">Built Exclusively on Meta Cloud API</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike legacy software that mimics web sessions or risks account restrictions, RDX CRM connects directly via authorized Meta Graph endpoints with end-to-end transport encryption, webhook redundancy, and high-concurrency throughput.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div>
            <h4 className="text-xs font-bold text-[#101D35] uppercase tracking-wide">Direct Cloud Webhooks</h4>
            <p className="text-xs text-slate-500 mt-1">Instant notification delivery within 150ms of customer transmit.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#101D35] uppercase tracking-wide">Multi-Agent Concurrency</h4>
            <p className="text-xs text-slate-500 mt-1">Handle hundreds of simultaneous conversations on a single business number.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#101D35] uppercase tracking-wide">Official Template Approval</h4>
            <p className="text-xs text-slate-500 mt-1">Meta-compliant template synchronization for outbound broadcasts.</p>
          </div>
        </div>
      </div>

      {/* Contact & Direct Support */}
      <div className="text-center space-y-4 max-w-xl mx-auto pt-6">
        <h3 className="text-xl font-bold text-[#101D35]">Connect Directly with Our Product Team</h3>
        <p className="text-xs text-slate-600">
          We welcome direct conversations regarding integrations, enterprise deployment, and partner programs.
        </p>
        <div className="pt-2">
          <a
            href={OFFICIAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3.5 rounded-xl text-xs transition-colors shadow-md"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp: {OFFICIAL_WHATSAPP_NUMBER}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
