import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, ArrowRight } from 'lucide-react';
import { OFFICIAL_WHATSAPP_LINK } from '../../../services/storage';

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true });

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'api', label: 'WhatsApp API' },
    { id: 'inbox', label: 'Team Inbox' },
    { id: 'ai', label: 'AI & Automations' },
    { id: 'billing', label: 'Pricing & Limits' },
    { id: 'security', label: 'Security & Compliance' },
  ];

  const allFaqs = [
    {
      category: 'api',
      q: 'What is required to connect to the WhatsApp Business Cloud API?',
      a: 'To connect, you need a verified Meta Business Account, a clean phone number that is not currently registered to a standard mobile WhatsApp app, and a credit card linked to your Meta developer account for Meta conversation fees (the first 1,000 service conversations each month are free from Meta).',
    },
    {
      category: 'api',
      q: 'Will our existing WhatsApp number be safe from bans?',
      a: 'Yes! RDX CRM uses Meta’s official Cloud API infrastructure. Because communications pass through authorized Meta endpoints with cryptographic verification, there is zero risk of account ban from unofficial third-party modded clients.',
    },
    {
      category: 'inbox',
      q: 'How many agents can use the same phone number at the same time?',
      a: 'Depending on your subscription plan, you can invite from 3 up to 35+ customer service agents simultaneously. Every agent can claim, reply, add internal notes, and transfer chats without colliding.',
    },
    {
      category: 'inbox',
      q: 'Can we send rich media attachments such as PDFs and images?',
      a: 'Yes. The shared inbox supports photos, videos, audio notes, PDF quotations, and documents. Agents can also trigger pre-approved template messages with dynamic customer variable placeholders.',
    },
    {
      category: 'ai',
      q: 'How does the Gemini AI Assistant work within the CRM?',
      a: 'The AI Assistant operates right beside the active conversation thread. It analyzes customer inquiries to generate reply drafts, rephrases responses to professional or friendly tones, translates incoming multilingual texts, and synthesizes lengthy chat histories into concise CRM summaries.',
    },
    {
      category: 'ai',
      q: 'Can we automate replies outside business working hours?',
      a: 'Yes. With Workflow Automations, you can set rules such as "When message arrives after 6 PM -> send out-of-hours greeting with catalog link and assign to morning queue".',
    },
    {
      category: 'billing',
      q: 'What happens if we reach our monthly message limit?',
      a: 'You will receive an automatic alert when you reach 80% and 95% of your quota. You can instantly upgrade your tier from the Billing panel or purchase an overage pack. Incoming messages are never dropped.',
    },
    {
      category: 'security',
      q: 'Is customer data shared between different businesses on RDX CRM?',
      a: 'Never. RDX CRM implements strict tenant isolation at the data access layer. Each organization has its own scoped database collections, webhooks, and agent permission boundaries.',
    },
  ];

  const filteredFaqs = allFaqs.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">Documentation & Help</span>
        <h1 className="text-4xl font-extrabold text-[#101D35] tracking-tight">Frequently Asked Questions</h1>
        <p className="text-sm text-slate-600">
          Find technical specifications and operational details regarding the RDX CRM platform.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords (e.g. Meta API, agent seats, quotas)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#101D35] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500">No questions matched your search query.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = !!openItems[idx];
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#101D35] hover:text-[#55B9F5] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-[#55B9F5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support box */}
      <div className="bg-[#101D35] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div>
          <h4 className="font-bold text-base">Still have questions?</h4>
          <p className="text-xs text-slate-300 mt-0.5">Chat with our technical engineering desk on WhatsApp directly.</p>
        </div>

        <a
          href={OFFICIAL_WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-colors"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Ask on WhatsApp</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
