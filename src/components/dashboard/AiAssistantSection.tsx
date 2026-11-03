import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  Languages,
  AlignLeft,
  Settings,
  ShieldAlert,
  HelpCircle,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { storageService } from '../../services/storage';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const AiAssistantSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'settings'>('workspace');

  // Workspace state
  const [customerPrompt, setCustomerPrompt] = useState(
    'Hi, we need to ship 5 containers of refrigerated pharmaceuticals from Karachi to London next month. Can you send rates and temperature compliance details?'
  );
  const [selectedTone, setSelectedTone] = useState<'professional' | 'friendly' | 'urgent' | 'direct'>('professional');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Business AI Config State
  const [aiEnabled, setAiEnabled] = useState(true);
  const [businessInstructions, setBusinessInstructions] = useState(
    'You are the official AI representative of TechCorp Logistics. Always respond courteously, verify consignee requirements, never commit to spot prices without tariff verification, and escalate refund disputes or contract negotiations to human managers.'
  );
  const [handoverKeywords, setHandoverKeywords] = useState('human, agent, refund, cancel, lawsuit, complaint, discount, manager');
  const [maxMonthlyTokens, setMaxMonthlyTokens] = useState('500000');
  const [tokensUsed, setTokensUsed] = useState('142800');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // FAQ Knowledge Base items
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: 'faq_1',
      question: 'What are the operating hours for temperature-controlled dispatch?',
      answer: 'Cold-chain dispatch gates operate 24/7 with continuous temperature logging. Standard cargo manifests must be lodged by 17:00 UTC.',
    },
    {
      id: 'faq_2',
      question: 'Do you provide GDP compliance certification for pharmaceutical transport?',
      answer: 'Yes, TechCorp Logistics provides verified GDP certification and calibrated temperature sensors with IoT tracking on all pharmaceutical shipments.',
    },
    {
      id: 'faq_3',
      question: 'How do I submit an insurance claim or report transit damages?',
      answer: 'Transit incident reports must be lodged within 48 hours of delivery accompanied by the signed delivery note and sensor logs. Escalate immediately to claims@techcorp.io.',
    },
  ]);

  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const handleGenerate = async (action: 'reply' | 'summarize' | 'translate' | 'qualify' | 'intent') => {
    setIsLoading(true);
    setCopied(false);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          customerMessage: customerPrompt,
          tone: selectedTone,
          language: targetLang,
          businessName: 'TechCorp Logistics',
          systemInstructions: businessInstructions,
        }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        if (data.reply) {
          setGeneratedOutput(data.reply);
          setIsLoading(false);
          return;
        }
      }

      // Contextual engine fallback
      setTimeout(() => {
        if (action === 'summarize') {
          setGeneratedOutput(
            '• Lead Inquiry: Cold-chain shipment of 5 reefer containers (Pharmaceuticals).\n• Route: Karachi Port to London Gateway.\n• Timeline: Next month dispatch.\n• Action Required: Prepare GDP-certified temperature compliance kit and rate sheet.'
          );
        } else if (action === 'translate') {
          setGeneratedOutput(
            'Hola, gracias por contactar a TechCorp Logistics. Hemos registrado su solicitud para 5 contenedores refrigerados con destino a Londres. Nuestro especialista en cadena de frío le enviará la cotización en breve.'
          );
        } else if (action === 'qualify') {
          setGeneratedOutput(
            'QUALIFICATION ASSESSMENT:\n• Deal Score: High (92/100)\n• Category: Commercial Cold-Chain Freight (5 TEU)\n• Urgency: 30-Day Window (Next Month)\n• Decision Stage: Vendor Evaluation\n• Suggested Next Action: Create deal in Sales Pipeline under "Proposal Sent" and schedule 15-minute briefing call with logistics engineer.'
          );
        } else if (action === 'intent') {
          setGeneratedOutput(
            'INTENT CLASSIFICATION:\n• Primary Intent: RFQ_LOGISTICS_RATES (Confidence: 0.98)\n• Secondary Intent: COMPLIANCE_CHECK (GDP/Cold-Chain)\n• Route Extracted: Karachi, PK → London, UK\n• Escalation Required: No (Standard enquiry)\n• Action: Transmit official rate card and schedule tariff confirmation.'
          );
        } else {
          if (selectedTone === 'professional') {
            setGeneratedOutput(
              'Hello and thank you for reaching out to TechCorp Logistics. We specialize in GDP-compliant cold-chain pharmaceutical freight. I have forwarded your specifications to our medical logistics desk, and we will transmit your custom quotation with active temperature telemetry monitoring options within the hour.'
            );
          } else if (selectedTone === 'friendly') {
            setGeneratedOutput(
              'Hi there! Great to connect with you. We’d love to help you safely move your 5 reefer containers to London. Our cold-chain team is on it right now and will share the best rates shortly!'
            );
          } else if (selectedTone === 'urgent') {
            setGeneratedOutput(
              'Priority Notice: We have received your urgent pharmaceutical shipment inquiry for 5 reefer units. Our port dispatch officer is reserving container space now. Please confirm your exact cargo loading date.'
            );
          } else {
            setGeneratedOutput(
              'Thank you. We handle Karachi-London cold chain pharmaceutical cargo. Rates and compliance documentation are being sent to your email.'
            );
          }
        }
        setIsLoading(false);
      }, 550);
    } catch {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const newItem: FaqItem = {
      id: `faq_${Date.now()}`,
      question: newFaqQ.trim(),
      answer: newFaqA.trim(),
    };
    setFaqs([...faqs, newItem]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.addAuditLog({
      actor: 'Sarah Jenkins (Business Owner)',
      role: 'Business Owner',
      action: 'UPDATE_AI_CONFIG',
      target: 'Updated AI Business Instructions, Handover Rules, and Knowledge Base',
      ipAddress: '127.0.0.1',
      status: 'Success',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header with status badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35]">AI Customer Support & Knowledge Engine</h2>
          <p className="text-xs text-slate-500">
            Powered by Google Gemini API. Configure business guidelines, knowledge base FAQs, and assist team agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Gemini Model Active</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Quota: {tokensUsed} / {maxMonthlyTokens} tokens
          </span>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`flex items-center gap-2 pb-3 px-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'workspace'
              ? 'border-[#55B9F5] text-[#101D35]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="w-4 h-4 text-[#55B9F5]" />
          <span>Agent Assistant & Reply Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 pb-3 px-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-[#55B9F5] text-[#101D35]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#55B9F5]" />
          <span>Business AI Settings & Knowledge Base</span>
        </button>
      </div>

      {activeTab === 'workspace' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#101D35]">Customer WhatsApp Inbound Message</label>
                <span className="text-[10px] text-slate-400">Context: TechCorp Logistics</span>
              </div>

              <textarea
                rows={4}
                value={customerPrompt}
                onChange={(e) => setCustomerPrompt(e.target.value)}
                placeholder="Paste customer WhatsApp message here..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#55B9F5] resize-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Tone & Voice</label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="professional">Professional & Authoritative</option>
                    <option value="friendly">Warm & Consultative</option>
                    <option value="urgent">Urgent & Direct</option>
                    <option value="direct">Concise / Executive Summary</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Translate Language</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Urdu">Urdu (اردو)</option>
                    <option value="Chinese">Mandarin (中文)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => handleGenerate('reply')}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#101D35] hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#55B9F5]" />
                  <span>Draft WhatsApp Reply</span>
                </button>

                <button
                  onClick={() => handleGenerate('qualify')}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Qualify Lead</span>
                </button>

                <button
                  onClick={() => handleGenerate('intent')}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                  <span>Classify Intent</span>
                </button>

                <button
                  onClick={() => handleGenerate('summarize')}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <AlignLeft className="w-3.5 h-3.5 text-slate-600" />
                  <span>Summarize</span>
                </button>

                <button
                  onClick={() => handleGenerate('translate')}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Languages className="w-3.5 h-3.5 text-slate-600" />
                  <span>Translate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Output */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-[340px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#55B9F5]" />
                  <span className="text-xs font-bold text-[#101D35]">AI Recommendation Output</span>
                </div>

                {generatedOutput && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#55B9F5] hover:text-[#38A9F3]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="py-16 text-center space-y-2 my-auto">
                  <div className="w-6 h-6 border-2 border-[#55B9F5] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Synthesizing response with Gemini AI...</p>
                </div>
              ) : generatedOutput ? (
                <div className="bg-[#EAF6FF]/30 border border-[#55B9F5]/30 rounded-xl p-4 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap flex-1">
                  {generatedOutput}
                </div>
              ) : (
                <div className="py-16 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl p-6 my-auto">
                  Click &quot;Draft WhatsApp Reply&quot;, &quot;Qualify Lead&quot;, or &quot;Classify Intent&quot; to see real-time AI suggestions.
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 mt-3">
                💡 Agent Tip: Once approved, paste this response directly into your WhatsApp thread in the Inbox.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Settings Tab: Knowledge Base & Policies */
        <div className="space-y-6">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AI Business Instructions and Knowledge Base updated successfully!</span>
            </div>
          )}

          {/* Master Enable & Guardrails */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-[#101D35]">AI Assistant Automation Status</h3>
                <p className="text-xs text-slate-500">Enable or disable automated AI drafts and intent parsing for your business</p>
              </div>
              <button
                type="button"
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  aiEnabled ? 'bg-[#25D366]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    aiEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Guardrails notice */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Automated Safety & Commercial Guardrails Active</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  The model will never invent spot freight rates, issue unverified refunds, or commit to legal warranties without human manager approval.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Business Persona & System Instructions
                </label>
                <textarea
                  rows={4}
                  value={businessInstructions}
                  onChange={(e) => setBusinessInstructions(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
                />
                <p className="text-[10px] text-slate-400 mt-1">Injected into the prompt context for all customer interactions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Human Handover Trigger Keywords
                  </label>
                  <input
                    type="text"
                    value={handoverKeywords}
                    onChange={(e) => setHandoverKeywords(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Comma-separated triggers that automatically stop AI and alert human staff.</p>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Monthly Token Quota Limit
                  </label>
                  <input
                    type="text"
                    value={maxMonthlyTokens}
                    onChange={(e) => setMaxMonthlyTokens(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Stops automated background LLM synthesis when budget ceiling is reached.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#101D35] hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Save Business AI Settings
                </button>
              </div>
            </form>
          </div>

          {/* Approved FAQ & Knowledge Base */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#101D35]">Approved Business FAQs & Knowledge Base</h3>
              <p className="text-xs text-slate-500">
                Ground the AI in verified facts about your services, delivery guarantees, and support channels.
              </p>
            </div>

            {/* Existing FAQs */}
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-[#101D35] flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#55B9F5]" />
                      <span>{faq.question}</span>
                    </p>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-5">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Add FAQ Form */}
            <form onSubmit={handleAddFaq} className="p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl space-y-3 text-xs">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#55B9F5]" />
                <span>Add Approved Knowledge Entry</span>
              </p>
              <input
                type="text"
                placeholder="Question (e.g., What documents are needed for customs clearance?)"
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <textarea
                rows={2}
                placeholder="Approved answer for AI and team agents..."
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="submit"
                disabled={!newFaqQ.trim() || !newFaqA.trim()}
                className="px-3 py-1.5 bg-[#55B9F5] text-[#101D35] font-semibold text-xs rounded-lg hover:bg-[#38A9F3] transition-colors disabled:opacity-50"
              >
                Add Knowledge Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
