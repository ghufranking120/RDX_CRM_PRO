import React from 'react';
import { RdxLogo } from '../common/RdxLogo';
import { MessageSquare, ArrowUpRight, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { PublicPageId } from './PublicNavbar';
import { OFFICIAL_WHATSAPP_LINK, OFFICIAL_WHATSAPP_NUMBER } from '../../services/storage';

interface PublicFooterProps {
  onNavigate: (page: PublicPageId) => void;
  onNavigateToAdmin?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, onNavigateToAdmin }) => {
  return (
    <footer className="bg-[#101D35] text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <RdxLogo size="md" variant="dark" showTagline={true} />
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed mt-3">
              RDX CRM PRO empowers modern businesses to manage every customer conversation in one place. Streamline multi-agent WhatsApp shared inboxes, automate lead routing, and launch official Meta Cloud API campaigns.
            </p>

            <div className="pt-2">
              <a
                href={OFFICIAL_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp: {OFFICIAL_WHATSAPP_NUMBER}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Product Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#25D366]">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="hover:text-white transition-colors"
                >
                  Features & Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors"
                >
                  Pricing Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#25D366]">Company</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About RDX CRM PRO
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#25D366]">Direct Support</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span className="font-mono text-white">{OFFICIAL_WHATSAPP_NUMBER}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span>support@rdxcrm.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span>Enterprise Suite, Global Cloud Operations</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="text-xs font-bold text-slate-950 bg-[#25D366] hover:bg-[#20bd5a] px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Free Trial
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 RDX CRM PRO. All rights reserved. Smart Conversations. Better Customer Relationships.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-white">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-white">
              Terms of Service
            </button>
            <span>·</span>
            {/* Secure direct portal link for staff with server-side authentication gate */}
            <button
              onClick={() => {
                if (onNavigateToAdmin) {
                  onNavigateToAdmin();
                } else {
                  window.location.hash = '#admin';
                }
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
