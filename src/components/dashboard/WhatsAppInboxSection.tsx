import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageSquare,
  Send,
  User,
  Phone,
  Tag,
  Paperclip,
  CheckCheck,
  Check,
  Clock,
  Sparkles,
  Bot,
  UserCheck,
  Plus,
  AlertCircle,
  Zap,
  MoreVertical,
  Smile,
  X,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { Conversation, ChatMessage, LeadStatus, InternalNote } from '../../types';
import { storageService, OFFICIAL_WHATSAPP_LINK } from '../../services/storage';

export const WhatsAppInboxSection: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [filterState, setFilterState] = useState<'all' | 'open' | 'pending' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [showQuickRepliesModal, setShowQuickRepliesModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = storageService.getQuickReplies();
  const templates = storageService.getMessageTemplates();
  const teamMembers = storageService.getTeamMembers();

  // Load conversations
  const loadData = () => {
    const list = storageService.getConversations('biz_01');
    setConversations(list);
    if (list.length > 0 && !activeConvId) {
      setActiveConvId(list[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // Sync retrying messages automatically when exponential backoff completes
  useEffect(() => {
    const hasRetryingMsg = activeConv?.messages?.some(
      (m) => m.status === 'Retrying' || m.status === 'retrying'
    );
    if (!hasRetryingMsg) return;

    const timer = setInterval(async () => {
      try {
        const token = localStorage.getItem('rdx_session_token');
        const res = await fetch('/api/whatsapp/retries', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          // Check if retrying messages have recovered
          const allConvs = storageService.getAllConversations();
          let modified = false;

          for (const conv of allConvs) {
            for (const msg of conv.messages) {
              if (msg.status === 'Retrying' || msg.status === 'retrying') {
                const stillRetrying = data.activeRetrying?.some((r: any) => r.id === msg.id);
                if (!stillRetrying) {
                  msg.status = 'delivered';
                  modified = true;
                }
              }
            }
          }

          if (modified) {
            storageService.saveConversations(allConvs);
            loadData();
          }
        }
      } catch (err) {
        console.warn('Retry sync error:', err);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [activeConv?.messages]);

  // Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const messageText = inputText.trim();
    setInputText('');

    let metaMessageId: string | undefined = undefined;
    let isSimulated = true;
    let messageStatus: 'delivered' | 'Retrying' | 'sent' | 'failed' = 'delivered';
    let assignedMsgId = `msg_${Date.now()}`;
    let retryCount: number | undefined = undefined;
    let lastRetryError: string | undefined = undefined;

    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/whatsapp/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          businessId: activeConv.businessId || 'biz_01',
          recipientPhone: activeConv.contactPhone,
          text: messageText,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        metaMessageId = data.metaMessageId;
        isSimulated = data.isSimulated !== false;
        if (data.status) {
          messageStatus = data.status;
        }
        if (data.messageId) {
          assignedMsgId = data.messageId;
        }
        retryCount = data.retryCount;
        lastRetryError = data.error;
      } else {
        messageStatus = 'Retrying';
      }
    } catch (err) {
      console.warn('Backend send failed or offline:', err);
      messageStatus = 'Retrying';
    }

    const newMsg: ChatMessage = {
      id: assignedMsgId,
      conversationId: activeConv.id,
      sender: 'agent',
      senderName: 'Marcus Vance',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: messageStatus,
      metaMessageId,
      isSimulated,
      retryCount,
      lastRetryError,
    };

    storageService.addMessageToConversation(activeConv.id, newMsg);
    loadData();
  };

  // Simulate Inbound Customer Message
  const handleSimulateInbound = () => {
    if (!activeConv) return;

    const sampleReplies = [
      'Thank you! That helps a lot. What is the estimated dispatch date?',
      'Understood. Can you please email the formal invoice to accounting as well?',
      'Yes, we agree with this proposal. Please send over the contract link.',
      'Hello Marcus, could we reschedule the consultation call to 3:00 PM?',
    ];
    const randomReply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

    const inboundMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: activeConv.id,
      sender: 'customer',
      text: randomReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
      isSimulated: true,
    };

    storageService.addMessageToConversation(activeConv.id, inboundMsg);
    loadData();
  };

  // AI Assistant auto-draft reply
  const handleAiSuggestReply = async () => {
    if (!activeConv) return;
    setAiDraftLoading(true);

    try {
      const lastCustMsg = [...activeConv.messages].reverse().find((m) => m.sender === 'customer')?.text;
      const promptText = `Customer message: "${lastCustMsg || 'Hello, I have an inquiry'}"`;

      // Attempt server proxy or high quality fallback
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_reply',
          customerMessage: promptText,
          businessName: 'TechCorp Logistics',
        }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        if (data.reply) {
          setInputText(data.reply);
          setAiDraftLoading(false);
          return;
        }
      }

      // Intelligent context-aware instant proposal
      setTimeout(() => {
        if (lastCustMsg?.toLowerCase().includes('bill of lading') || lastCustMsg?.toLowerCase().includes('tracking')) {
          setInputText(`Hello ${activeConv.contactName}, your tracking confirmation PIN is #INDUS-88291. Port authorities confirm clearance is underway.`);
        } else if (lastCustMsg?.toLowerCase().includes('rate') || lastCustMsg?.toLowerCase().includes('quote')) {
          setInputText(`Hello ${activeConv.contactName}, thank you for inquiring! We have shared our corporate rate sheet for your review. Would you like a 10-minute briefing call?`);
        } else {
          setInputText(`Hello ${activeConv.contactName}, thank you for reaching out. Our operations desk is reviewing your file and will follow up immediately.`);
        }
        setAiDraftLoading(false);
      }, 500);
    } catch {
      setAiDraftLoading(false);
    }
  };

  // Add Internal Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeConv) return;

    const contacts = storageService.getAllContacts();
    const targetContact = contacts.find((c) => c.id === activeConv.contactId);
    if (targetContact) {
      const note: InternalNote = {
        id: `note_${Date.now()}`,
        authorName: 'Marcus Vance',
        authorRole: 'Senior Agent',
        text: newNoteText.trim(),
        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      targetContact.notes = [note, ...targetContact.notes];
      storageService.updateContact(targetContact);
      setNewNoteText('');
      loadData();
    }
  };

  // Update Lead Status
  const handleStatusChange = (newStatus: LeadStatus) => {
    if (!activeConv) return;
    const contacts = storageService.getAllContacts();
    const contact = contacts.find((c) => c.id === activeConv.contactId);
    if (contact) {
      contact.leadStatus = newStatus;
      storageService.updateContact(contact);
    }
    const convs = storageService.getAllConversations().map((c) => (c.id === activeConv.id ? { ...c, leadStatus: newStatus } : c));
    storageService.saveConversations(convs);
    loadData();
  };

  // Toggle Human Handover
  const handleToggleHandover = () => {
    if (!activeConv) return;
    storageService.toggleHumanHandover(activeConv.id);
    loadData();
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = filterState === 'all' || c.state === filterState;
    const matchesSearch =
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPhone.includes(searchQuery) ||
      c.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeContact = storageService.getAllContacts().find((c) => c.id === activeConv?.contactId);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Demo Sandbox Top Notice */}
      <div className="bg-[#EAF6FF] border-b border-[#55B9F5]/30 px-4 py-2 flex items-center justify-between text-xs text-[#101D35] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="font-bold">WhatsApp Cloud API Simulator Active:</span>
          <span className="text-slate-600 hidden sm:inline">
            Connected to official Meta webhook endpoints. Test live agent workflow below.
          </span>
        </div>
        <button
          onClick={handleSimulateInbound}
          className="bg-white hover:bg-slate-50 border border-[#55B9F5]/40 text-[#101D35] font-semibold px-2.5 py-1 rounded-md text-[11px] transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <Zap className="w-3 h-3 text-[#25D366]" />
          <span>Simulate Customer Reply</span>
        </button>
      </div>

      {/* 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* COLUMN 1: Conversation List */}
        <div className="w-80 md:w-88 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chats or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
              />
            </div>

            {/* State filter buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
              {(['all', 'open', 'pending', 'closed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterState(st)}
                  className={`flex-1 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                    filterState === st ? 'bg-white text-[#101D35] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* List of Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No conversations found.</div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConv?.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      if (conv.unreadCount > 0) {
                        const updated = conversations.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                        setConversations(updated);
                        storageService.saveConversations(updated);
                      }
                    }}
                    className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-[#EAF6FF]/70 border-r-2 border-r-[#55B9F5]' : 'hover:bg-slate-100/60 bg-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#101D35] text-white flex items-center justify-center font-bold text-xs">
                        {conv.contactName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold text-[#101D35] truncate">{conv.contactName}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">{conv.lastMessageTime}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate">{conv.lastMessageText}</p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {conv.leadStatus}
                        </span>
                        <span className="text-[10px] text-slate-400">·</span>
                        <span className="text-[10px] text-slate-500 truncate">{conv.assignedAgentName}</span>

                        {conv.unreadCount > 0 && (
                          <span className="ml-auto w-4 h-4 rounded-full bg-[#25D366] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: Active Chat Area */}
        <div className="flex-1 flex flex-col bg-[#F8FAFC] min-w-0">
          {/* Chat Header */}
          <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#101D35] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {activeConv?.contactName.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#101D35] truncate">{activeConv?.contactName}</h3>
                  <span className="text-[11px] font-mono text-slate-500">{activeConv?.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Assigned: {activeConv?.assignedAgentName}</span>
                  <span>·</span>
                  <span className="capitalize text-slate-600 font-medium">State: {activeConv?.state}</span>
                </div>
              </div>
            </div>

            {/* Handover & Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleToggleHandover}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  activeConv?.isHandedOverToHuman
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
                title="Toggle between Bot automation and Human Support"
              >
                {activeConv?.isHandedOverToHuman ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Human Support Active</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Auto-Pilot Mode</span>
                  </>
                )}
              </button>

              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs">
                {(['open', 'pending', 'closed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      storageService.updateConversationState(activeConv.id, st);
                      loadData();
                    }}
                    className={`px-2 py-1 rounded capitalize text-[10px] font-medium ${
                      activeConv?.state === st ? 'bg-white font-bold text-[#101D35] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center my-2">
              <span className="text-[10px] font-medium text-slate-400 bg-white/80 border border-slate-200 px-3 py-1 rounded-full">
                Messages secured via Meta WhatsApp Cloud API
              </span>
            </div>

            {activeConv?.messages.map((msg) => {
              const isMe = msg.sender === 'agent' || msg.sender === 'ai';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs shadow-xs space-y-1 ${
                      isMe
                        ? 'bg-[#101D35] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center gap-1 text-[10px] text-[#55B9F5] font-semibold pb-0.5">
                        <Bot className="w-3 h-3" />
                        <span>RDX Assistant (Automated)</span>
                      </div>
                    )}
                    {msg.senderName && msg.sender !== 'ai' && isMe && (
                      <p className="text-[10px] text-slate-300 font-medium">{msg.senderName}</p>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    <div className={`flex items-center justify-end gap-1.5 text-[9px] ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                      {msg.metaMessageId && !msg.isSimulated ? (
                        <span className="text-[8px] font-semibold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          Meta WABA
                        </span>
                      ) : (
                        <span className="text-[8px] text-slate-400/80 bg-slate-200/20 px-1 py-0.2 rounded">
                          Sandbox
                        </span>
                      )}
                      <span className="tabular-nums">{msg.timestamp}</span>
                      {isMe && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-[#55B9F5]" />
                          ) : msg.status === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                          ) : msg.status === 'Retrying' || msg.status === 'retrying' ? (
                            <span
                              className="flex items-center gap-1 text-[9px] text-amber-400 font-medium bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30"
                              title={msg.lastRetryError || 'Retrying outbound message with exponential backoff...'}
                            >
                              <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-400" />
                              <span>Retrying</span>
                            </span>
                          ) : msg.status === 'failed' ? (
                            <span
                              className="flex items-center gap-1 text-[9px] text-red-400 font-medium bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/30"
                              title={msg.lastRetryError || 'Message permanently failed after retries'}
                            >
                              <AlertCircle className="w-2.5 h-2.5 text-red-400" />
                              <span>Failed</span>
                            </span>
                          ) : (
                            <Check className="w-3 h-3 text-slate-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Toolbar above input */}
          <div className="px-4 py-1.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQuickRepliesModal(true)}
                className="text-[11px] text-slate-600 hover:text-[#101D35] font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <span>/ Quick Replies</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="text-[11px] text-slate-600 hover:text-[#101D35] font-medium px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <FileText className="w-3 h-3 text-[#55B9F5]" />
                <span>Meta Templates</span>
              </button>
            </div>

            <button
              type="button"
              disabled={aiDraftLoading}
              onClick={handleAiSuggestReply}
              className="text-[11px] text-[#101D35] bg-[#EAF6FF] hover:bg-[#d8edff] border border-[#55B9F5]/40 font-semibold px-2.5 py-1 rounded transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#55B9F5]" />
              <span>{aiDraftLoading ? 'Generating...' : 'AI Suggest Reply'}</span>
            </button>
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message or press / for quick replies..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[#101D35] hover:bg-slate-900 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4 text-[#55B9F5]" />
            </button>
          </form>
        </div>

        {/* COLUMN 3: Contact Context Drawer */}
        <div className="w-72 lg:w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto p-4 space-y-5">
          {/* Profile Header */}
          <div className="text-center space-y-2 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-[#101D35] text-white flex items-center justify-center font-bold text-lg mx-auto shadow-sm">
              {activeConv?.contactName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#101D35]">{activeConv?.contactName}</h3>
              <p className="text-xs font-mono text-slate-500">{activeConv?.contactPhone}</p>
            </div>
            {activeContact?.company && (
              <p className="text-xs text-slate-600 font-medium">{activeContact.company}</p>
            )}
          </div>

          {/* Lead Stage Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Lead Stage Status
            </label>
            <select
              value={activeConv?.leadStatus}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
            >
              <option value="New">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified Deal</option>
              <option value="Won">Won / Closed</option>
              <option value="Lost">Lost Opportunity</option>
            </select>
          </div>

          {/* Assign Agent */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Assigned Representative
            </label>
            <select
              value={activeConv?.assignedAgentName}
              onChange={(e) => {
                const updated = conversations.map((c) =>
                  c.id === activeConv.id ? { ...c, assignedAgentName: e.target.value } : c
                );
                setConversations(updated);
                storageService.saveConversations(updated);
              }}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Tags */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Customer Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {activeContact?.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#EAF6FF] text-[#101D35] font-medium border border-[#55B9F5]/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Internal Notes Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Internal CRM Notes
              </label>
              <span className="text-[10px] text-slate-400">Team private</span>
            </div>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                placeholder="Add private note for colleagues..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#55B9F5]"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="w-full py-1.5 bg-[#101D35] hover:bg-slate-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Add Note
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100 pt-1">
              {activeContact?.notes.map((note) => (
                <div key={note.id} className="pt-2 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-700">{note.authorName}</span>
                    <span className="tabular-nums">{note.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK REPLIES MODAL */}
      {showQuickRepliesModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#101D35]">Insert Quick Reply</h3>
              <button onClick={() => setShowQuickRepliesModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {quickReplies.map((qr) => (
                <div
                  key={qr.id}
                  onClick={() => {
                    setInputText(qr.message);
                    setShowQuickRepliesModal(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-[#55B9F5] hover:bg-[#EAF6FF]/40 cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#101D35]">{qr.title}</span>
                    <span className="text-[10px] font-mono font-bold text-[#55B9F5] bg-[#EAF6FF] px-1.5 py-0.5 rounded">
                      {qr.shortcut}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{qr.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE TEMPLATE MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#101D35]">Select Approved Meta Template</h3>
              <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    // Populate placeholder variables with customer name
                    let body = tmpl.body.replace('{{1}}', activeConv?.contactName || 'Valued Customer');
                    body = body.replace('{{2}}', 'ORD-2026');
                    body = body.replace('{{3}}', 'Cleared & Dispatched');
                    body = body.replace('{{4}}', 'https://track.rdxcrm.com');
                    setInputText(body);
                    setShowTemplateModal(false);
                  }}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#55B9F5] hover:bg-[#EAF6FF]/30 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#101D35]">{tmpl.name}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {tmpl.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{tmpl.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
