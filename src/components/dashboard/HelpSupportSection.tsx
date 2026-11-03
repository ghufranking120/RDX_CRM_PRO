import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  BookOpen,
  ArrowUpRight,
  Send,
  CheckCircle2,
  FileQuestion,
  Headphones,
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_LINK, OFFICIAL_WHATSAPP_NUMBER } from '../../services/storage';

export const HelpSupportSection: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketBody) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicketSubject('');
      setTicketBody('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#101D35]">Help & Customer Support Desk</h2>
        <p className="text-xs text-slate-500">
          Get real-time assistance with Meta WhatsApp Business Cloud API verification and troubleshooting.
        </p>
      </div>

      {/* Official WhatsApp Support Hero Card */}
      <div className="bg-[#101D35] text-white p-7 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2 text-[#55B9F5] text-xs font-bold">
            <Headphones className="w-4 h-4" />
            <span>Priority WhatsApp Technical Desk</span>
          </div>
          <h3 className="text-2xl font-bold">Need Immediate Engineering Help?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Message our core engineering and support specialists directly on WhatsApp for real-time diagnostics, webhook verification, and account tier adjustments.
          </p>
          <div className="text-xs font-mono font-bold text-white pt-1">
            WhatsApp Hotline: {OFFICIAL_WHATSAPP_NUMBER}
          </div>
        </div>

        <a
          href={OFFICIAL_WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3.5 rounded-xl text-xs flex items-center gap-2 shrink-0 transition-colors shadow-lg"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Launch WhatsApp Chat</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Knowledge base guides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <BookOpen className="w-5 h-5 text-[#55B9F5]" />
          <h4 className="text-xs font-bold text-[#101D35]">Cloud API Quickstart</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Step-by-step instructions to create your Meta System User token and verify your business phone number.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <FileQuestion className="w-5 h-5 text-[#55B9F5]" />
          <h4 className="text-xs font-bold text-[#101D35]">Template Guidelines</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Best practices to prevent Meta template rejection and achieve 100% template approval rates.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <HelpCircle className="w-5 h-5 text-[#55B9F5]" />
          <h4 className="text-xs font-bold text-[#101D35]">Multi-Agent Onboarding</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            How to configure conversation round-robin assignment and manage human support handovers.
          </p>
        </div>
      </div>

      {/* Submit Support Ticket Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#101D35]">Submit an Internal Support Ticket</h3>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Support ticket #TICK-8849 logged. Our technical team will reply to your account email shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Ticket Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Question regarding Meta Cloud API webhook signature verification"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Detailed Description *</label>
              <textarea
                rows={4}
                required
                placeholder="Describe what occurred, any error messages, or assistance needed..."
                value={ticketBody}
                onChange={(e) => setTicketBody(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#101D35] hover:bg-slate-900 text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#55B9F5]" />
              <span>Submit Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
