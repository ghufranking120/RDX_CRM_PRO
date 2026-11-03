import React, { useState } from 'react';
import { MessageSquare, X, Send, ArrowUpRight } from 'lucide-react';
import { OFFICIAL_WHATSAPP_LINK, OFFICIAL_WHATSAPP_NUMBER } from '../../services/storage';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(
      userQuery.trim() || 'Hello RDX CRM Team! I am interested in setting up WhatsApp CRM for my business.'
    );
    window.open(`${OFFICIAL_WHATSAPP_LINK}?text=${encoded}`, '_blank');
    setIsOpen(false);
    setUserQuery('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Quick Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Card Header in Navy */}
          <div className="bg-[#101D35] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center font-bold text-white shadow">
                  <MessageSquare className="w-5 h-5 fill-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#101D35]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">RDX CRM Support</h4>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <span>Available on WhatsApp</span>
                  <span>·</span>
                  <span className="text-[#55B9F5] font-mono text-[11px]">{OFFICIAL_WHATSAPP_NUMBER}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body Simulation */}
          <div className="p-4 bg-[#F8FAFC] space-y-3 max-h-60 overflow-y-auto">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 text-xs text-slate-700 max-w-[85%] leading-relaxed">
              <p className="font-medium text-[#101D35] mb-1">Welcome to RDX CRM 👋</p>
              <p>
                Have questions about pricing, WhatsApp Business Cloud API setup, or multi-agent onboarding? Chat directly with our product team.
              </p>
              <span className="text-[10px] text-slate-400 block mt-1">Official Support Desk</span>
            </div>
          </div>

          {/* Action Input Form */}
          <form onSubmit={handleStartChat} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
            />
            <button
              type="submit"
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center shrink-0"
              title="Open WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="bg-slate-50 px-3 py-2 text-center border-t border-slate-100">
            <a
              href={OFFICIAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#101D35] hover:text-[#55B9F5] font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Instant Chat on WhatsApp</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Floating WhatsApp Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border-2 border-white"
        aria-label="Contact on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.176.2-.351.226-.652.075-.301-.151-1.27-.468-2.42-1.493-.894-.799-1.498-1.786-1.674-2.087-.175-.301-.019-.464.132-.614.135-.135.301-.35.451-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.628-.925-2.228-.244-.585-.492-.505-.675-.515-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.026-1.05 2.502 0 1.476 1.075 2.902 1.225 3.102.15.2 2.114 3.228 5.122 4.528.716.31 1.275.495 1.71.633.72.228 1.375.196 1.892.119.578-.087 1.78-.727 2.03-1.428.25-.701.25-1.302.175-1.428-.075-.126-.275-.201-.576-.351zM12.04 2C6.524 2 2.046 6.478 2.046 12c0 1.99.585 3.844 1.597 5.41L2 22l4.75-1.55c1.51.87 3.25 1.37 5.09 1.37 5.516 0 9.994-4.478 9.994-10S17.556 2 12.04 2z" />
        </svg>
        <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">
          WhatsApp Us
        </span>
      </button>
    </div>
  );
};
