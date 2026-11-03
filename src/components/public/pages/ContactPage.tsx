import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, MapPin, Send, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { storageService, OFFICIAL_WHATSAPP_LINK, OFFICIAL_WHATSAPP_NUMBER } from '../../../services/storage';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate real inquiry recording into audit log
      storageService.addAuditLog({
        actor: `${formData.name} (${formData.email})`,
        role: 'contact_lead',
        action: 'SUBMIT_CONTACT_FORM',
        target: formData.company || 'Website Inquiry',
        ipAddress: '127.0.0.1',
        status: 'Success',
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">Get in Touch</span>
        <h1 className="text-4xl font-extrabold text-[#101D35] tracking-tight">Contact RDX CRM</h1>
        <p className="text-sm text-slate-600">
          Have an inquiry about WhatsApp Business Cloud API integration or need enterprise setup? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct WhatsApp & Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#101D35] text-white p-8 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#55B9F5]">Fastest Response</span>
              <h3 className="text-2xl font-bold mt-1">Chat Directly on WhatsApp</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Skip the email wait. Our product specialists and technical advisors are online to answer questions regarding deployment and pricing.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone className="w-4 h-4 text-[#25D366]" />
                <span>Official WhatsApp Support Number</span>
              </div>
              <p className="text-lg font-mono font-bold text-white">{OFFICIAL_WHATSAPP_NUMBER}</p>
            </div>

            <a
              href={OFFICIAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-4 rounded-xl font-semibold text-xs shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Launch WhatsApp Chat</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Additional channels */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-600">
            <h4 className="font-bold text-sm text-[#101D35]">Direct Contacts</h4>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] flex items-center justify-center text-[#55B9F5]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-[#101D35]">Email Inquiries</p>
                <p className="text-slate-500">support@rdxcrm.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAF6FF] flex items-center justify-center text-[#55B9F5]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-[#101D35]">Operations Hub</p>
                <p className="text-slate-500">Global Cloud Support & API Operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Web Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-[#25D366] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#101D35]">Inquiry Received</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-[#101D35]">{formData.name}</span>. Your message has been logged in our CRM queue. An agent will contact your WhatsApp or email shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-[#101D35] mb-2">Send an Inquiry</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#101D35]">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#101D35]">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#101D35]">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#101D35]">Company Name</label>
                    <input
                      type="text"
                      placeholder="Acme Global Logistics"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#101D35]">How can we help? *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your team size, expected WhatsApp message volume, or specific integration requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#55B9F5]/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#101D35] hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl text-xs shadow transition-all duration-150 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#55B9F5]" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
