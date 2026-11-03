import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  Bot,
  UserCheck,
  CalendarCheck,
  BarChart3,
  GitBranch,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Radio,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PublicPageId } from '../PublicNavbar';
import { storageService, OFFICIAL_WHATSAPP_LINK, OFFICIAL_WHATSAPP_NUMBER } from '../../../services/storage';

interface HomePageProps {
  onNavigate: (page: PublicPageId) => void;
  onOpenDashboard: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenDashboard }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [previewTab, setPreviewTab] = useState<'inbox' | 'chatbot' | 'campaigns'>('inbox');

  const featuresList = [
    {
      icon: MessageSquare,
      title: 'WhatsApp Team Inbox',
      description:
        'Unified collaborative inbox connected to your official WhatsApp Business phone number. Assign conversations, filter unread inquiries, and resolve customer queries.',
    },
    {
      icon: Users,
      title: 'Customer Contact Management',
      description:
        'Detailed customer directory with tags, custom metadata, internal agent notes, and full conversation timeline histories in one central hub.',
    },
    {
      icon: Bot,
      title: 'Visual Chatbot Builder',
      description:
        'Design automated 24/7 conversational flows with keyword triggers, quick interactive button menus, and smooth human agent handover.',
    },
    {
      icon: Sparkles,
      title: 'AI Customer Support',
      description:
        'Gemini AI-powered smart replies, automatic conversation summaries, and contextual suggestions trained on your business knowledge base.',
    },
    {
      icon: Send,
      title: 'Campaigns & Broadcasts',
      description:
        'Send scheduled broadcasts and marketing announcements to targeted audience segments using official, pre-approved Meta message templates.',
    },
    {
      icon: GitBranch,
      title: 'Sales Pipeline & Deals',
      description:
        'Kanban sales pipeline to track prospect deal stages, forecast monthly revenue, and close deals directly inside WhatsApp.',
    },
    {
      icon: CalendarCheck,
      title: 'Follow-ups & Appointments',
      description:
        'Coordinate customer appointments with automated WhatsApp reminders, priority task flags, and agent due-date notifications.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description:
        'Track message delivery volumes, average first-response times, agent workloads, and lead conversion rates in real time.',
    },
  ];

  const pricingPlans = [
    {
      id: 'trial',
      name: 'Free Trial',
      price: 'Rs 0',
      period: '14 Days Free',
      description: 'Test all features with zero commitment.',
      features: [
        '100 WhatsApp Messages',
        '250 Contacts',
        '1 Team Agent Seat',
        'Shared Team Inbox',
        'Basic Auto-Replies',
      ],
      popular: false,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 'Rs 499',
      period: 'per month',
      description: 'Ideal for small retail shops and sole traders.',
      features: [
        '1,000 Messages / month',
        '1,000 Contacts',
        '2 Team Agent Seats',
        'Quick Replies & Templates',
        'Custom Lead Tags',
        'Standard Analytics',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 'Rs 999',
      period: 'per month',
      description: 'Our most popular plan for growing businesses.',
      features: [
        '5,000 Messages / month',
        '5,000 Contacts',
        '5 Team Agent Seats',
        'Visual Chatbot Builder',
        'Broadcast Campaigns',
        'Kanban Sales Pipeline',
        'Priority Webhook Queue',
      ],
      popular: true,
    },
    {
      id: 'biz',
      name: 'Business',
      price: 'Rs 1,999',
      period: 'per month',
      description: 'For scaling companies with high conversation volume.',
      features: [
        '25,000 Messages / month',
        '25,000 Contacts',
        '15 Team Agent Seats',
        'Full Gemini AI Assistant',
        'Advanced Workflow Automations',
        'Appointments Booking',
        'Custom Webhooks & REST API',
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'Does RDX CRM PRO use the official WhatsApp Business Platform?',
      a: 'Yes. RDX CRM PRO connects exclusively via the official Meta WhatsApp Business Cloud API. This guarantees 100% policy compliance, green badge verification readiness, and zero risk of unofficial client number bans.',
    },
    {
      q: 'Can multiple agents respond from the same WhatsApp phone number?',
      a: 'Yes, absolutely. RDX CRM PRO converts your single verified business WhatsApp number into a multi-agent collaborative workspace where team members claim, transfer, and reply to chats simultaneously.',
    },
    {
      q: 'How does the Visual Chatbot Builder work?',
      a: 'The Chatbot Builder features a no-code visual workflow canvas. You configure inbound keyword triggers (such as "Pricing" or "Hi"), design interactive button menus, and set automatic human handover rules.',
    },
    {
      q: 'Can I import and export my customer contacts?',
      a: 'Yes! RDX CRM PRO provides one-click CSV contact imports and exports, complete with custom fields, company tags, and lead qualification statuses.',
    },
    {
      q: 'How can I get started or test the platform?',
      a: 'You can start an instant 14-Day Free Trial by clicking "Start Free Trial", or reach our setup specialists directly on WhatsApp at +923138066389.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 antialiased selection:bg-[#25D366]/20">
      {/* ========================================================
          HERO SECTION
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>Official WhatsApp Business Cloud API Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101D35] tracking-tight leading-[1.12]">
              Manage Every Customer Conversation in One Powerful Platform
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Automate WhatsApp conversations, manage leads, launch campaigns and grow your business with RDX CRM PRO.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-150 text-sm"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('features')}
                className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#101D35] font-bold px-5 py-3.5 rounded-xl border border-slate-200 transition-all duration-150 text-sm shadow-xs"
              >
                <span>Explore Features</span>
              </button>

              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#101D35] font-semibold px-5 py-3.5 rounded-xl transition-all duration-150 text-sm"
              >
                <span>Login</span>
              </button>
            </div>

            {/* WhatsApp Direct Link */}
            <div className="pt-2">
              <a
                href={OFFICIAL_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#25D366] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <MessageSquare className="w-3 h-3 fill-white" />
                </div>
                <span>Direct WhatsApp Consultation: {OFFICIAL_WHATSAPP_NUMBER}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span>Meta Cloud API Official</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span>Shared Team Inbox</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span>No Code Chatbots</span>
              </div>
            </div>
          </div>

          {/* Right: Clean Real Interactive Product Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-200 relative overflow-hidden">
              {/* Header clearly marked per instructions */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="font-semibold text-slate-700 ml-1.5">RDX CRM PRO Workspace</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Sample Preview — Not Connected to WhatsApp
                </span>
              </div>

              {/* Preview Tabs */}
              <div className="flex items-center gap-1 pt-3 pb-2 text-xs border-b border-slate-100">
                <button
                  onClick={() => setPreviewTab('inbox')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    previewTab === 'inbox'
                      ? 'bg-[#25D366]/15 text-[#128C7E]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Shared Inbox
                </button>
                <button
                  onClick={() => setPreviewTab('chatbot')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    previewTab === 'chatbot'
                      ? 'bg-[#25D366]/15 text-[#128C7E]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Chatbot Flow
                </button>
                <button
                  onClick={() => setPreviewTab('campaigns')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    previewTab === 'campaigns'
                      ? 'bg-[#25D366]/15 text-[#128C7E]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Campaigns
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="py-4 min-h-[220px]">
                {previewTab === 'inbox' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#101D35] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        C
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-bold text-[#101D35]">Customer Inquiry #1084</span>
                          <span className="text-[10px] text-slate-400">10:42 AM</span>
                        </div>
                        <p className="text-slate-600">
                          "Hello, could you share the wholesale commercial pricing and catalog?"
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#25D366]/10 rounded-xl border border-[#25D366]/30 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        A
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-bold text-[#128C7E]">Agent Marcus (RDX Workspace)</span>
                          <span className="text-[10px] text-emerald-700">Delivered</span>
                        </div>
                        <p className="text-slate-700">
                          "Catalog sent! Our team has assigned this chat to your dedicated account manager."
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {previewTab === 'chatbot' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-mono text-blue-600 font-bold block">TRIGGER STEP</span>
                      <span className="font-semibold text-slate-800">Inbound Match: "HELLO, PRICING, SUPPORT"</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold block">AUTO-REPLY STEP</span>
                      <span className="font-semibold text-slate-800">Send Welcome Menu with Quick Action Buttons</span>
                    </div>
                    <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="text-[10px] font-mono text-purple-700 font-bold block">HUMAN HANDOVER</span>
                      <span className="font-semibold text-slate-800">Route complex inquiries to WhatsApp Shared Inbox</span>
                    </div>
                  </div>
                )}

                {previewTab === 'campaigns' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#101D35] block">Quarterly Product Announcement</span>
                        <span className="text-[10px] text-slate-400">Template: product_catalog_v2</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        98% Delivered
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#101D35] block">VIP Client Follow-up Broadcast</span>
                        <span className="text-[10px] text-slate-400">Template: vip_loyalty_offer</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Active Queue
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Ready for real customer engagement</span>
                <button
                  onClick={() => onNavigate('register')}
                  className="font-bold text-[#128C7E] hover:underline flex items-center gap-1"
                >
                  <span>Launch Free Trial</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURES GRID
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#25D366]">
            Full WhatsApp Platform Stack
          </span>
          <h2 className="text-3xl font-extrabold text-[#101D35] tracking-tight">
            Engineered For Modern High-Volume Business
          </h2>
          <p className="text-sm text-slate-600">
            Empower your sales, marketing, and support teams to convert more inquiries into revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#25D366]/60 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#128C7E] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <h3 className="font-bold text-sm text-[#101D35]">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          PRICING PLANS
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#25D366]">
            Transparent & Affordable
          </span>
          <h2 className="text-3xl font-extrabold text-[#101D35] tracking-tight">
            Plans Built for Every Business Size
          </h2>
          <p className="text-sm text-slate-600">
            Start with our 14-day free trial. Upgrade or cancel anytime as your team scales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-6 border flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'border-[#25D366] shadow-lg ring-2 ring-[#25D366]/20'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#25D366] text-white shadow-xs">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-base text-[#101D35]">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-[#101D35]">{plan.price}</span>
                  <span className="text-xs text-slate-500 ml-1">/ {plan.period}</span>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  {plan.features.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('register')}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    plan.popular
                      ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#101D35]'
                  }`}
                >
                  {plan.id === 'trial' ? 'Start Free Trial' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          FREQUENTLY ASKED QUESTIONS
          ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#25D366]">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101D35]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs text-[#101D35] hover:bg-slate-50/50"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          BOTTOM CTA
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#101D35] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to upgrade your business customer conversations on WhatsApp?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join growing companies using RDX CRM PRO to coordinate shared team inboxes, launch automated broadcasts, and capture leads 24/7.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-md transition-colors text-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={OFFICIAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
