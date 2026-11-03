import React from 'react';
import { OFFICIAL_WHATSAPP_LINK } from '../../../services/storage';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101D35] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Effective Date: March 10, 2026</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">1. Acceptance of Terms</h2>
          <p>
            By creating an account or accessing the RDX CRM platform, you agree to comply with and be bound by these Terms of Service and all applicable laws and regulations governing commercial electronic messaging.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">2. WhatsApp Business Policy Compliance</h2>
          <p>
            Subscribers must adhere strictly to the Meta WhatsApp Business Policy, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Obtaining verifiable customer opt-in consent prior to sending outbound marketing or notification templates.</li>
            <li>Honoring customer opt-out requests immediately upon receipt.</li>
            <li>Refraining from sending unsolicited bulk spam, fraudulent financial schemes, or prohibited goods.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">3. Account Quotas and Message Limits</h2>
          <p>
            Each subscription tier allocates specific monthly inbound and outbound message volumes and agent seat licenses. Message limits reset on the first day of each billing cycle. Overage usage is billed per designated rate or gated until plan upgrade.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">4. Uptime SLA & Service Continuity</h2>
          <p>
            RDX CRM aims to maintain a 99.9% uptime target for the core inbox and automation webhook relay engine, excluding scheduled maintenance announced 48 hours in advance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#101D35]">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, RDX CRM shall not be liable for indirect, incidental, or consequential damages resulting from third-party Meta API outages, internet carrier disruptions, or unauthorized access resulting from compromised tenant credentials.
          </p>
        </section>
      </div>
    </div>
  );
};
