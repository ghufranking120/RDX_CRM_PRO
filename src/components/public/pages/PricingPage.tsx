import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { PublicPageId } from '../PublicNavbar';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../../services/storage';

interface PricingPageProps {
  onNavigate: (page: PublicPageId) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const plans = storageService.getPlans();

  const comparisonRows = [
    { feature: 'Official Meta Cloud API Connection', starter: 'Included', growth: 'Included', enterprise: 'Included' },
    { feature: 'Monthly Inbound/Outbound Messages', starter: '2,500', growth: '12,000', enterprise: '60,000+' },
    { feature: 'Included Agent Seats', starter: '3 Seats', growth: '10 Seats', enterprise: '35 Seats' },
    { feature: 'Shared Collaborative Team Inbox', starter: 'Yes', growth: 'Yes', enterprise: 'Yes' },
    { feature: 'Interactive Sales Kanban Pipeline', starter: 'Basic', growth: 'Full', enterprise: 'Custom Stages' },
    { feature: 'AI Smart Replies & Summarizer', starter: '—', growth: 'Yes (Gemini)', enterprise: 'Dedicated Model' },
    { feature: 'Automated Workflows & Triggers', starter: '1 Active', growth: '10 Active', enterprise: 'Unlimited' },
    { feature: 'Meta Approved Message Templates', starter: 'Up to 5', growth: 'Up to 25', enterprise: 'Unlimited' },
    { feature: 'Webhook & n8n Automation', starter: '—', growth: 'Yes', enterprise: 'Yes (Dedicated)' },
    { feature: 'Support SLA', starter: 'Standard (48h)', growth: 'Priority (12h)', enterprise: '1-Hour SLA + WhatsApp VIP' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">
          Transparent Pricing
        </span>
        <h1 className="text-4xl font-extrabold text-[#101D35] tracking-tight">
          Simple, Predictable Plans for Every Stage
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Choose the right plan for your conversation volume. Upgrade, downgrade, or cancel at any time with no lock-in contracts.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-[#101D35] font-bold' : 'text-slate-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-13 h-7 bg-[#101D35] rounded-full p-1 transition-colors relative"
            aria-label="Toggle annual pricing"
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#55B9F5] transition-transform duration-200 ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-[#101D35] font-bold' : 'text-slate-500'}`}>
            Annual <span className="text-[#25D366] text-xs font-bold ml-1">(20% Savings)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = isAnnual ? plan.priceYearly : plan.priceMonthly;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-200 relative ${
                plan.popular
                  ? 'bg-[#101D35] text-white shadow-xl border-2 border-[#55B9F5]'
                  : 'bg-white text-[#101D35] border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#55B9F5] text-[#101D35] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow">
                  Most Popular for Growing Teams
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-5xl font-extrabold tracking-tight font-mono tabular-nums">
                    ${price}
                  </span>
                  <span className={`text-xs ml-1 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                    / month {isAnnual ? '(billed annually)' : ''}
                  </span>
                </div>

                <div
                  className={`text-xs py-2.5 px-3.5 rounded-xl font-mono ${
                    plan.popular ? 'bg-slate-800 text-[#55B9F5]' : 'bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="font-bold">{plan.messageLimit.toLocaleString()}</span> msgs/mo ·{' '}
                  <span className="font-bold">{plan.agentLimit}</span> agent seats
                </div>

                <ul className="space-y-3 pt-3 text-xs">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.popular ? 'text-[#55B9F5]' : 'text-[#25D366]'
                        }`}
                      />
                      <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 space-y-3">
                <button
                  onClick={() => onNavigate('register')}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all ${
                    plan.popular
                      ? 'bg-[#55B9F5] hover:bg-[#38A9F3] text-[#101D35]'
                      : 'bg-[#101D35] hover:bg-slate-900 text-white'
                  }`}
                >
                  Get Started with {plan.name}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Instant account setup · No card needed for preview
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-bold text-[#101D35]">Detailed Feature Comparison</h3>
          <p className="text-xs text-slate-500">Comprehensive breakdown of quota allocations and technical capabilities.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/60 text-[#101D35] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Feature</th>
                <th className="py-3.5 px-6">Starter</th>
                <th className="py-3.5 px-6 bg-[#EAF6FF]/50 text-[#101D35]">Growth</th>
                <th className="py-3.5 px-6">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-6 font-medium text-slate-800">{row.feature}</td>
                  <td className="py-3 px-6 text-slate-600">{row.starter}</td>
                  <td className="py-3 px-6 font-semibold text-[#101D35] bg-[#EAF6FF]/30">{row.growth}</td>
                  <td className="py-3 px-6 text-slate-600">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Custom Inquiry Box */}
      <div className="bg-[#EAF6FF] border border-[#55B9F5]/30 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-[#101D35]">Need a Custom Message Tier or Enterprise Onboarding?</h4>
          <p className="text-xs text-slate-600">
            For telecom routing, custom data residency, or high volume (100k+ messages/month), talk directly to our solutions engineer.
          </p>
        </div>

        <a
          href={OFFICIAL_WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl text-xs font-semibold shrink-0 shadow-sm transition-colors"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
