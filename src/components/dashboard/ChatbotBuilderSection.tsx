import React, { useState, useEffect } from 'react';
import {
  Bot,
  Plus,
  Play,
  Save,
  Trash2,
  GitBranch,
  MessageSquare,
  HelpCircle,
  Clock,
  UserCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ChatbotFlow } from '../../types';

interface BotNode {
  id: string;
  type: 'trigger' | 'message' | 'buttons' | 'handover';
  title: string;
  content: string;
  options?: string[];
}

export const ChatbotBuilderSection: React.FC = () => {
  const [chatbots, setChatbots] = useState<ChatbotFlow[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>('');
  const [activeBot, setActiveBot] = useState<ChatbotFlow | null>(null);

  // Form states
  const [botName, setBotName] = useState('24/7 Inbound Lead Qualifier');
  const [triggerKeyword, setTriggerKeyword] = useState('HI, HELLO, INFO, PRICING');
  const [fallbackMessage, setFallbackMessage] = useState('Thank you for reaching out. We will connect you to an agent.');
  const [workingHoursOnly, setWorkingHoursOnly] = useState(false);
  const [handoverToHuman, setHandoverToHuman] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<string[]>([]);

  // Nodes for visual flow
  const [nodes, setNodes] = useState<BotNode[]>([
    {
      id: 'node_1',
      type: 'trigger',
      title: '1. Inbound Keyword Trigger',
      content: 'Triggers when customer sends: HI, HELLO, INFO, or PRICING',
    },
    {
      id: 'node_2',
      type: 'message',
      title: '2. Welcome Greeting',
      content: 'Welcome to RDX CRM Pro! How can our support team assist your company today?',
    },
    {
      id: 'node_3',
      type: 'buttons',
      title: '3. Interactive Quick Choice Buttons',
      content: 'Select an option to proceed:',
      options: ['Freight Rates', 'Track Container', 'Talk to Agent'],
    },
    {
      id: 'node_4',
      type: 'handover',
      title: '4. Human Agent Handover',
      content: 'Transfers chat session to available agent in shared WhatsApp inbox.',
    },
  ]);

  const fetchChatbots = async () => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/chatbots', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setChatbots(data);
        if (data.length > 0 && !selectedBotId) {
          setSelectedBotId(data[0].id);
          setActiveBot(data[0]);
          setBotName(data[0].name);
          setTriggerKeyword(data[0].triggerKeyword);
          setFallbackMessage(data[0].fallbackMessage);
          setWorkingHoursOnly(data[0].workingHoursOnly);
          setHandoverToHuman(data[0].handoverToHuman);
        }
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    fetchChatbots();
  }, []);

  const handleSaveBot = async () => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/chatbots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: botName,
          triggerKeyword,
          flowJson: JSON.stringify(nodes),
          fallbackMessage,
          workingHoursOnly,
          handoverToHuman,
        }),
      });

      if (res.ok) {
        setSaveStatus('Chatbot workflow saved & activated successfully.');
        fetchChatbots();
      }
    } catch {
      setSaveStatus('Failed to save chatbot.');
    }
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const handleSimulateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const lower = testInput.toLowerCase();
    const keywords = triggerKeyword.toLowerCase().split(',').map((k) => k.trim());
    const matched = keywords.some((k) => lower.includes(k));

    if (matched) {
      setTestOutput([
        `Customer: "${testInput}"`,
        `Bot: "Welcome to RDX CRM Pro! How can our support team assist your company today?"`,
        `Options: [1] Freight Rates, [2] Track Container, [3] Talk to Agent`,
      ]);
    } else {
      setTestOutput([
        `Customer: "${testInput}"`,
        `Bot: "${fallbackMessage}"`,
      ]);
    }
    setTestInput('');
  };

  const addNode = (type: BotNode['type']) => {
    const newNode: BotNode = {
      id: `node_${Date.now()}`,
      type,
      title: `${nodes.length + 1}. ${type.toUpperCase()} Step`,
      content: type === 'message' ? 'Custom auto reply text' : 'Select option',
      options: type === 'buttons' ? ['Option 1', 'Option 2'] : undefined,
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>Visual WhatsApp Chatbot Builder</span>
            <span className="text-xs bg-[#25D366]/10 text-[#128C7E] font-semibold px-2 py-0.5 rounded-full border border-[#25D366]/30">
              No-Code Flow Designer
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Design multi-step conversational workflows, keyword triggers, interactive button menus, and intelligent human handover.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveBot}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Workflow</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Flow Nodes Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {/* Canvas Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#101D35]">Add Flow Step:</span>
              <button
                type="button"
                onClick={() => addNode('message')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                + Message
              </button>
              <button
                type="button"
                onClick={() => addNode('buttons')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                + Buttons
              </button>
              <button
                type="button"
                onClick={() => addNode('handover')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                + Agent Handover
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">{nodes.length} Nodes in Flow</span>
          </div>

          {/* Node Flow Sequence */}
          <div className="space-y-3">
            {nodes.map((node, index) => (
              <div key={node.id} className="relative">
                {/* Node Box */}
                <div className="bg-white p-4 rounded-xl border-2 border-slate-200 hover:border-[#25D366] transition-all shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#101D35] flex items-center gap-1.5">
                      {node.type === 'trigger' && <Play className="w-3.5 h-3.5 text-blue-500" />}
                      {node.type === 'message' && <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />}
                      {node.type === 'buttons' && <Layers className="w-3.5 h-3.5 text-purple-500" />}
                      {node.type === 'handover' && <UserCheck className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{node.title}</span>
                    </span>

                    {index > 0 && (
                      <button
                        onClick={() => removeNode(node.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{node.content}</p>

                  {node.options && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {node.options.map((opt, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[11px] font-semibold"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Connector Arrow */}
                {index < nodes.length - 1 && (
                  <div className="flex justify-center my-1.5">
                    <div className="w-0.5 h-4 bg-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Settings & Live Simulator */}
        <div className="lg:col-span-4 space-y-4">
          {/* Bot Configuration Panel */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
            <h3 className="font-bold text-sm text-[#101D35]">Chatbot Settings</h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bot Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#25D366]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trigger Keywords (comma separated)</label>
              <input
                type="text"
                value={triggerKeyword}
                onChange={(e) => setTriggerKeyword(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:border-[#25D366]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fallback Message</label>
              <textarea
                rows={2}
                value={fallbackMessage}
                onChange={(e) => setFallbackMessage(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#25D366]"
              />
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={workingHoursOnly}
                  onChange={(e) => setWorkingHoursOnly(e.target.checked)}
                  className="rounded text-[#25D366]"
                />
                <span>Run only outside working hours</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={handoverToHuman}
                  onChange={(e) => setHandoverToHuman(e.target.checked)}
                  className="rounded text-[#25D366]"
                />
                <span>Enable automatic Human Agent Handover</span>
              </label>
            </div>
          </div>

          {/* Flow Simulator */}
          <div className="bg-[#111B21] text-white p-4 rounded-xl border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Test Chatbot Simulator</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Sandbox</span>
            </div>

            <div className="bg-[#0B141A] p-2.5 rounded-lg min-h-[140px] max-h-[220px] overflow-y-auto text-xs space-y-1.5">
              {testOutput.length === 0 ? (
                <p className="text-slate-500 text-[11px] italic">
                  Type a trigger message (e.g., "Hello" or "Pricing") below to test the automated flow.
                </p>
              ) : (
                testOutput.map((msg, i) => (
                  <p
                    key={i}
                    className={`p-2 rounded-lg text-[11px] leading-relaxed ${
                      msg.startsWith('Customer:')
                        ? 'bg-[#005C4B] text-white self-end text-right'
                        : 'bg-[#202C33] text-slate-200'
                    }`}
                  >
                    {msg}
                  </p>
                ))
              )}
            </div>

            <form onSubmit={handleSimulateTest} className="flex gap-2">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Test keyword (e.g. Hi)..."
                className="flex-1 px-3 py-1.5 bg-[#202C33] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#25D366]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
