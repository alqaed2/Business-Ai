import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Target, 
  BarChart3, 
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings,
  History,
  Plus,
  Trash2,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Mic,
  MicOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../components/ui/sheet";
import RichTextEditor from '../components/RichTextEditor';
import { generateAIResponse } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../components/AuthProvider';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

const INITIAL_AGENTS = [
  { 
    id: 'marketing', 
    name: 'Marketing Agent', 
    description: 'Autonomous content generation and strategy.',
    icon: Target,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    systemPrompt: `You are a world-class CMO and Digital Marketing Strategist. 
    Your expertise includes:
    - Content Strategy: Using AIDA (Attention, Interest, Desire, Action) and PAS (Problem, Agitation, Solution) frameworks.
    - SEO & SEM: Optimizing for search engines and high-intent keywords.
    - Brand Voice: Maintaining consistency across all channels.
    - Data Analysis: Interpreting marketing metrics to pivot strategies.
    
    Always provide structured, professional advice. Use Markdown tables for comparisons and bold text for key takeaways.`
  },
  { 
    id: 'operations', 
    name: 'Operations Agent', 
    description: 'Workflow optimization and data analysis.',
    icon: BarChart3,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    systemPrompt: `You are a Senior COO and Operations Excellence Expert. 
    Your expertise includes:
    - Process Optimization: Applying Lean and Six Sigma methodologies.
    - Supply Chain Management: Enhancing logistics and vendor relations.
    - Workflow Automation: Identifying bottlenecks and suggesting AI-driven solutions.
    - KPI Tracking: Defining and monitoring critical business metrics.
    
    Provide highly accurate, logical, and efficient solutions. Use bulleted lists for action items.`
  },
  { 
    id: 'support', 
    name: 'Support Agent', 
    description: 'Automated customer success and retention.',
    icon: MessageSquare,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    systemPrompt: `You are a Head of Customer Success and Support Strategy. 
    Your expertise includes:
    - Empathetic Communication: Handling difficult situations with grace.
    - Technical Support: Providing clear, step-by-step troubleshooting.
    - Retention Strategies: Identifying churn risks and implementing save-plays.
    - Knowledge Base Management: Creating clear documentation.
    
    Be helpful, accurate, and professional. Use Markdown code blocks for technical instructions.`
  },
  { 
    id: 'sales', 
    name: 'Sales Agent', 
    description: 'Lead qualification and closing deals.',
    icon: Sparkles,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    systemPrompt: `You are a High-Performance Sales Director and Negotiation Expert. 
    Your expertise includes:
    - Lead Qualification: Using BANT (Budget, Authority, Need, Timeline) and GPCT frameworks.
    - Consultative Selling: Using SPIN (Situation, Problem, Implication, Need-payoff) techniques.
    - Objection Handling: Turning "no" into "not yet" or "yes".
    - Closing Techniques: Driving urgency and value.
    
    Be persuasive, professional, and results-oriented. Use bold text for value propositions.`
  },
  { 
    id: 'customer_experience', 
    name: 'Customer Experience Agent', 
    description: 'Specialized in customer journey and satisfaction.',
    icon: MessageSquare,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    systemPrompt: `You are a world-class Customer Experience (CX) Strategist. 
    Your expertise includes:
    - Customer Journey Mapping: Identifying touchpoints and friction.
    - Sentiment Analysis: Understanding customer emotions and needs.
    - Loyalty Programs: Designing systems to increase LTV.
    - Feedback Loops: Implementing effective voice-of-customer programs.
    
    Always prioritize the customer's perspective and provide actionable CX improvements. Use Markdown for structured reports.`
  }
];

const ICON_MAP: Record<string, any> = {
  Target,
  BarChart3,
  MessageSquare,
  Sparkles,
  Zap,
  Bot
};

interface AgentSettings {
  temperature: number;
  maxOutputTokens: number;
  customSystemPrompt: string;
  language: string;
}

const DEFAULT_SETTINGS: AgentSettings = {
  temperature: 0.7,
  maxOutputTokens: 1024,
  customSystemPrompt: '',
  language: 'en'
};

const Agents = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { profile } = useAuth();
  const [agents, setAgents] = useState(() => {
    const savedAgents = localStorage.getItem('custom_agents');
    if (savedAgents) {
      try {
        const parsed = JSON.parse(savedAgents).map((a: any) => ({
          ...a,
          icon: ICON_MAP[a.iconName] || Bot
        }));
        return [...INITIAL_AGENTS, ...parsed];
      } catch (e) {
        console.error("Error parsing custom agents:", e);
        return INITIAL_AGENTS;
      }
    }
    return INITIAL_AGENTS;
  });

  const [activeAgent, setActiveAgent] = useState(() => {
    const savedActiveId = localStorage.getItem('active_agent_id');
    if (savedActiveId) {
      // We need to check both INITIAL_AGENTS and any custom agents already loaded in the state initializer above
      const savedAgents = localStorage.getItem('custom_agents');
      let allPossibleAgents = [...INITIAL_AGENTS];
      if (savedAgents) {
        try {
          const parsed = JSON.parse(savedAgents).map((a: any) => ({
            ...a,
            icon: ICON_MAP[a.iconName] || Bot
          }));
          allPossibleAgents = [...allPossibleAgents, ...parsed];
        } catch (e) {}
      }
      return allPossibleAgents.find(a => a.id === savedActiveId) || INITIAL_AGENTS[0];
    }
    return INITIAL_AGENTS[0];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{
    id?: string;
    role: 'user' | 'ai';
    content: string;
    feedback?: 'up' | 'down';
  }[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAgentForSheet, setSelectedAgentForSheet] = useState(INITIAL_AGENTS[0]);
  const [allSettings, setAllSettings] = useState<Record<string, AgentSettings>>({});
  const [history, setHistory] = useState<any[]>([]);

  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    icon: 'Bot',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  });

  // Load settings and handle initial prompt on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('agent_settings');
    if (savedSettings) {
      setAllSettings(JSON.parse(savedSettings));
    }

    // Handle initial prompt from navigation state
    if (location.state?.initialPrompt) {
      setInput(location.state.initialPrompt);
    }
  }, [location.state]);

  // Persist active agent selection
  React.useEffect(() => {
    localStorage.setItem('active_agent_id', activeAgent.id);
  }, [activeAgent.id]);

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.systemPrompt) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const id = newAgent.name.toLowerCase().replace(/\s+/g, '-');
    const agentToAdd = {
      id,
      ...newAgent,
      icon: ICON_MAP[newAgent.icon] || Bot,
      iconName: newAgent.icon // store for serialization
    };

    const updatedAgents = [...agents, agentToAdd];
    setAgents(updatedAgents);
    
    // Save custom agents to localStorage (excluding initial ones)
    const customOnly = updatedAgents.filter(a => !INITIAL_AGENTS.find(ia => ia.id === a.id));
    localStorage.setItem('custom_agents', JSON.stringify(customOnly));

    setIsAddAgentOpen(false);
    setNewAgent({
      name: '',
      description: '',
      systemPrompt: '',
      icon: 'Bot',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    });
    toast.success(t('agents.agent_created'));
  };

  const currentSettings = allSettings[activeAgent.id] || DEFAULT_SETTINGS;
  const sheetAgentSettings = allSettings[selectedAgentForSheet.id] || DEFAULT_SETTINGS;

  const updateSettings = (newSettings: AgentSettings) => {
    const updated = { ...allSettings, [activeAgent.id]: newSettings };
    setAllSettings(updated);
    localStorage.setItem('agent_settings', JSON.stringify(updated));
    toast.success(t('agents.settings_saved', 'Settings saved successfully'));
  };

  // Fetch history for active agent
  React.useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'jobs'),
      where('tenantId', '==', profile.tenantId),
      where('type', '==', activeAgent.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(jobs);
    }, (error) => {
      console.error("History Fetch Error:", error);
    });

    return () => unsubscribe();
  }, [activeAgent.id, profile?.tenantId]);

  const handleRunAgent = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    let jobDocId = '';
    try {
      // 1. Log job to Firestore
      if (profile) {
        const docRef = await addDoc(collection(db, 'jobs'), {
          tenantId: profile.tenantId,
          type: activeAgent.id,
          status: 'processing',
          input: { prompt: userMessage },
          createdAt: new Date().toISOString()
        });
        jobDocId = docRef.id;
      }

      // 2. Generate AI Response
      const systemPrompt = currentSettings.customSystemPrompt || activeAgent.systemPrompt;
      const languagePrompt = currentSettings.language === 'ar' ? "\nRespond in Arabic." : "\nRespond in English.";
      
      const response = await generateAIResponse(
        userMessage, 
        systemPrompt + languagePrompt,
        {
          temperature: currentSettings.temperature,
          maxOutputTokens: currentSettings.maxOutputTokens
        }
      );
      
      // 3. Update job in Firestore
      if (jobDocId) {
        await updateDoc(doc(db, 'jobs', jobDocId), {
          status: 'completed',
          output: { response },
          completedAt: new Date().toISOString()
        });
      }

      setMessages(prev => [...prev, { role: 'ai', content: response, id: jobDocId }]);
      toast.success(`${activeAgent.name} completed the task.`);
    } catch (error) {
      console.error("Agent Error:", error);
      if (jobDocId) {
        await updateDoc(doc(db, 'jobs', jobDocId), {
          status: 'failed',
          error: error instanceof Error ? error.message : String(error)
        });
      }
      toast.error("Failed to execute agent task.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (messageIndex: number, type: 'up' | 'down') => {
    const msg = messages[messageIndex];
    if (!msg.id) return;

    try {
      const updatedMessages = [...messages];
      updatedMessages[messageIndex].feedback = type;
      setMessages(updatedMessages);

      await updateDoc(doc(db, 'jobs', msg.id), {
        feedback: type,
        feedbackAt: serverTimestamp()
      });
      
      toast.success(t('agents.feedback_received', 'Feedback received!'));
    } catch (error) {
      console.error("Feedback Error:", error);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Speech synthesis not supported in this browser.");
    }
  };

  const handleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const formatJobDate = (date: any) => {
    if (!date) return '';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleString();
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{t('agents.title')}</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">{t('agents.subtitle')}</p>
        </div>
        <Button 
          onClick={() => setIsAddAgentOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t('agents.add_agent')}
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Agent Selection Sidebar */}
        <div className="w-full lg:w-80 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 lg:pr-2">
          {agents.map((agent) => (
            <Card 
              key={agent.id}
              className={cn(
                "cursor-pointer transition-all border-2 flex-shrink-0 w-64 lg:w-full",
                activeAgent.id === agent.id ? "border-blue-600 ring-2 ring-blue-500/10" : "border-transparent hover:border-slate-200"
              )}
              onClick={() => {
                setActiveAgent(agent);
                setSelectedAgentForSheet(agent);
                setIsSheetOpen(true);
                setMessages([]);
              }}
            >
              <CardContent className="p-3 md:p-4 flex items-start gap-3 md:gap-4">
                <div className={cn("p-2 rounded-lg", agent.bg)}>
                  <agent.icon className={cn("w-4 h-4 md:w-5 md:h-5", agent.color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">{agent.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-slate-400 hover:text-blue-600 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveAgent(agent);
                        setIsSettingsOpen(true);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 line-clamp-1">{agent.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chat / Workspace Area */}
        <Card className="flex-1 flex flex-col border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", activeAgent.bg)}>
                  <activeAgent.icon className={cn("w-6 h-6", activeAgent.color)} />
                </div>
                <div>
                  <CardTitle>{activeAgent.name}</CardTitle>
                  <CardDescription>{t('agents.status')}: <span className="text-emerald-600 font-medium">{t('agents.ready')}</span></CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-500 hover:text-red-600"
                  onClick={() => setMessages([])}
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex"
                  onClick={() => {
                    setSelectedAgentForSheet(activeAgent);
                    setIsSheetOpen(true);
                  }}
                >
                  <History className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('agents.history')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('agents.settings')}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 bg-slate-50/50">
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-20">
                    <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                      <Bot className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">How can {activeAgent.name} help today?</h2>
                    <p className="text-slate-500 mt-2">Ask for a marketing strategy, process optimization, or data analysis.</p>
                  </div>
                )}
                
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-4",
                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-2xl max-w-[80%] shadow-sm",
                        msg.role === 'user' 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : "bg-white text-slate-900 rounded-tl-none border border-slate-100"
                      )}>
                        <div className={cn(
                          "text-sm leading-relaxed",
                          msg.role === 'ai' ? "prose prose-sm max-w-none prose-slate" : "whitespace-pre-wrap"
                        )}>
                          {msg.role === 'ai' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                        
                        {msg.role === 'ai' && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={cn("h-7 w-7", msg.feedback === 'up' ? "text-emerald-600 bg-emerald-50" : "text-slate-400")}
                                onClick={() => handleFeedback(i, 'up')}
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={cn("h-7 w-7", msg.feedback === 'down' ? "text-red-600 bg-red-50" : "text-slate-400")}
                                onClick={() => handleFeedback(i, 'down')}
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleSpeak(msg.content)}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {loading && (
                  <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-slate-500">{t('agents.thinking')}</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-6 bg-white border-t border-slate-100">
              <div className="max-w-3xl mx-auto relative flex items-end gap-2">
                <div className="flex-1 relative">
                  <RichTextEditor
                    value={input}
                    onChange={setInput}
                    onSend={handleRunAgent}
                    placeholder={t('agents.placeholder', { name: activeAgent.name })}
                    disabled={loading}
                  />
                  <div className="absolute right-3 bottom-3 rtl:right-auto rtl:left-3 flex items-center gap-2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-10 w-10 rounded-xl transition-all",
                        isListening ? "text-red-600 bg-red-50 animate-pulse" : "text-slate-400 hover:text-blue-600"
                      )}
                      onClick={handleMic}
                      disabled={loading}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                    <Button 
                      onClick={handleRunAgent}
                      disabled={loading || !input.trim()}
                      className="h-10 w-10 p-0 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-widest font-bold">
                Powered by Gemini 3.1 Pro Intelligence
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Agent Dialog */}
      <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('agents.add_agent')}</DialogTitle>
            <DialogDescription>
              {t('agents.add_agent_desc')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="agentName">{t('agents.agent_name')}</Label>
              <Input 
                id="agentName" 
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                placeholder="e.g. Content Strategist"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agentDesc">{t('agents.agent_desc')}</Label>
              <Input 
                id="agentDesc" 
                value={newAgent.description}
                onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                placeholder="Briefly describe the agent's role"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agentIcon">{t('agents.agent_icon')}</Label>
              <Select 
                value={newAgent.icon} 
                onValueChange={(val) => setNewAgent({ ...newAgent, icon: val })}
              >
                <SelectTrigger id="agentIcon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ICON_MAP).map(iconName => (
                    <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agentPrompt">{t('agents.agent_prompt')}</Label>
              <textarea 
                id="agentPrompt"
                value={newAgent.systemPrompt}
                onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                placeholder="Define the agent's personality and goals..."
                className="w-full min-h-[120px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAgentOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleAddAgent} className="bg-blue-600 hover:bg-blue-700">
              {t('agents.create_agent')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{activeAgent.name} - {t('agents.settings_title', 'Agent Settings')}</DialogTitle>
            <DialogDescription>
              {t('agents.settings_desc', 'Configure performance parameters and custom instructions for this agent.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="language">{t('agents.settings_language', 'Response Language')}</Label>
              <Select 
                value={currentSettings.language} 
                onValueChange={(val) => updateSettings({ ...currentSettings, language: val })}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder={t('agents.select_language', 'Select language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature">{t('agents.settings_temperature', 'Temperature')}</Label>
                <span className="text-xs font-mono text-slate-500">{currentSettings.temperature}</span>
              </div>
              <input 
                id="temperature"
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={currentSettings.temperature}
                onChange={(e) => updateSettings({ ...currentSettings, temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{t('agents.precise', 'Precise')}</span>
                <span>{t('agents.creative', 'Creative')}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxTokens">{t('agents.settings_tokens', 'Max Output Tokens')}</Label>
              <Input 
                id="maxTokens"
                type="number" 
                value={currentSettings.maxOutputTokens}
                onChange={(e) => updateSettings({ ...currentSettings, maxOutputTokens: parseInt(e.target.value) })}
                min="1"
                max="4096"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="systemPrompt">{t('agents.settings_prompt', 'Custom System Prompt')}</Label>
              <textarea 
                id="systemPrompt"
                value={currentSettings.customSystemPrompt}
                onChange={(e) => updateSettings({ ...currentSettings, customSystemPrompt: e.target.value })}
                placeholder={activeAgent.systemPrompt}
                className="w-full min-h-[100px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <p className="text-[10px] text-slate-400 italic">
                {t('agents.prompt_hint', 'Leave empty to use the default agent personality.')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)} className="bg-blue-600 hover:bg-blue-700">
              {t('common.done', 'Done')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", selectedAgentForSheet.bg)}>
              <selectedAgentForSheet.icon className={cn("w-6 h-6", selectedAgentForSheet.color)} />
            </div>
            <SheetTitle className="text-2xl">{selectedAgentForSheet.name}</SheetTitle>
            <SheetDescription>
              {selectedAgentForSheet.description}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="overview">{t('agents.overview', 'Overview')}</TabsTrigger>
                <TabsTrigger value="history">{t('agents.history', 'History')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {t('agents.performance_metrics', 'Performance Metrics')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-50 border-none shadow-none">
                      <CardContent className="p-4">
                        <p className="text-xs text-slate-500">{t('agents.success_rate', 'Success Rate')}</p>
                        <p className="text-xl font-bold text-emerald-600">98.2%</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50 border-none shadow-none">
                      <CardContent className="p-4">
                        <p className="text-xs text-slate-500">{t('agents.avg_response', 'Avg. Response')}</p>
                        <p className="text-xl font-bold text-blue-600">1.4s</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Current Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {t('agents.current_config', 'Current Configuration')}
                  </h3>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('agents.settings_temperature', 'Temperature')}</span>
                      <span className="font-mono font-medium">{sheetAgentSettings.temperature}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('agents.settings_tokens', 'Max Tokens')}</span>
                      <span className="font-mono font-medium">{sheetAgentSettings.maxOutputTokens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('agents.settings_language', 'Language')}</span>
                      <span className="font-medium uppercase">{sheetAgentSettings.language}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-500 block mb-1">{t('agents.settings_prompt', 'System Prompt')}</span>
                      <p className="text-xs text-slate-600 line-clamp-3 italic">
                        {sheetAgentSettings.customSystemPrompt || selectedAgentForSheet.systemPrompt}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {t('agents.recent_history', 'Recent History')}
                </h3>
                
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {history.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 text-sm italic">
                        {t('agents.no_history', 'No execution history found.')}
                      </div>
                    ) : (
                      history.map((job) => (
                        <Card key={job.id} className="border-slate-100 shadow-none">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                              <Badge 
                                variant={
                                  job.status === 'completed' ? 'default' : 
                                  job.status === 'failed' ? 'destructive' : 'secondary'
                                }
                                className={cn(
                                  "text-[10px] px-1.5 py-0",
                                  job.status === 'completed' && "bg-emerald-500 hover:bg-emerald-600"
                                )}
                              >
                                {job.status}
                              </Badge>
                              <span className="text-[10px] text-slate-400">
                                {formatJobDate(job.createdAt)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-slate-700 line-clamp-1">
                                {job.input?.prompt}
                              </p>
                              {job.output?.response && (
                                <p className="text-[10px] text-slate-500 line-clamp-2 italic">
                                  {job.output.response}
                                </p>
                              )}
                              {job.error && (
                                <p className="text-[10px] text-red-500 line-clamp-2">
                                  {job.error}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          <SheetFooter className="flex-col sm:flex-col gap-3 mt-6">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11"
              onClick={() => {
                setActiveAgent(selectedAgentForSheet);
                setIsSheetOpen(false);
                // Focus input logic could go here
              }}
            >
              <Send className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('agents.run_task', 'Run Task')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-11"
              onClick={() => {
                setIsSheetOpen(false);
                setIsSettingsOpen(true);
              }}
            >
              <Settings className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('agents.edit_config', 'Edit Config')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Agents;
