import React from 'react';
import { ShieldCheck, Lock, Database, RefreshCw } from 'lucide-react';
import { OFFICIAL_WHATSAPP_LINK } from '../../../services/storage';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">Compliance & Legal</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101D35] tracking-tight">
          RDX CRM Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Last updated: March 10, 2026 · Version 2.4</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">1. Overview & Scope</h2>
          <p>
            RDX CRM (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;) operates a multi-tenant customer relationship management system integrating with the official Meta WhatsApp Business Cloud API. This Privacy Policy outlines how customer information, business messages, contact data, and operational logs are collected, processed, and secured.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">2. WhatsApp Message Data & Meta Cloud API Compliance</h2>
          <p>
            When you connect your WhatsApp Business Account (WABA) to RDX CRM:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Inbound and outbound messages transit through official Meta Cloud API infrastructure using TLS 1.3 transport encryption.</li>
            <li>Messages are ingested into your organization&apos;s isolated tenant space for display to authorized team agents.</li>
            <li>We do not sell, rent, or cross-monetize customer contact phone numbers or message content with any third-party advertisers.</li>
            <li>Customer opted-in consent rules mandated by WhatsApp Business Messaging Policy apply to all marketing templates.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">3. Tenant Data Isolation & Confidentiality</h2>
          <p>
            RDX CRM enforces strict organizational boundary separation. Business tenants cannot view, search, or query other organizations&apos; contacts, pipeline deals, internal notes, or message records.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">4. Artificial Intelligence Processing</h2>
          <p>
            When using the AI Assistant powered by Gemini API, message text submitted for reply suggestions or summarization is processed strictly to generate responses for your agents. Customer conversational data is not used to train global public foundational models.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">5. Data Retention & Erasure Requests</h2>
          <p>
            Organizations retain full ownership of their customer databases. You may export your entire contact and conversation history as JSON/CSV or submit a complete data erasure request at any time by contacting{' '}
            <a href="mailto:support@rdxcrm.com" className="text-[#55B9F5] underline">
              support@rdxcrm.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
