import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Building2,
  Globe,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  MessageSquare,
  Loader2,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "../components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "../components/ui/sheet";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { 
  History, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Pencil,
  Trash2,
  Sparkles
} from 'lucide-react';
import { generateAIResponse } from '../lib/gemini';

const Clients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<{ summary: string; nextAction: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async (client: any) => {
    setIsGenerating(true);
    setAiInsights(null);
    try {
      const prompt = `Generate a brief AI-driven insight for the following client:
      Name: ${client.name}
      Industry: ${client.industry}
      Status: ${client.status}
      Sentiment: ${client.sentiment}
      Location: ${client.location}
      Joined: ${client.joined}
      
      Provide two parts:
      1. Interaction Summary: A brief summary of recent interactions, sentiment, and key points.
      2. Next Best Action: A specific, actionable suggestion for the next step.
      
      Format the response as JSON:
      {
        "summary": "...",
        "nextAction": "..."
      }`;

      const response = await generateAIResponse(prompt, "You are a senior CRM AI Analyst. Respond ONLY with valid JSON.");
      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanedResponse);
      setAiInsights(data);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      setAiInsights({
        summary: "Unable to generate summary at this time.",
        nextAction: "Review client history manually."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const [clients, setClients] = useState([
    { id: 1, name: 'Acme Corp', industry: 'Manufacturing', status: 'Active', sentiment: 'Positive', email: 'contact@acme.com', phone: '+1 (555) 123-4567', location: 'New York, USA', joined: 'Oct 2023' },
    { id: 2, name: 'Global Tech', industry: 'Software', status: 'Pending', sentiment: 'Neutral', email: 'hello@globaltech.io', phone: '+44 20 7123 4567', location: 'London, UK', joined: 'Jan 2024' },
    { id: 3, name: 'Starlight Media', industry: 'Entertainment', status: 'Active', sentiment: 'Positive', email: 'media@starlight.com', phone: '+1 (555) 987-6543', location: 'Los Angeles, USA', joined: 'Dec 2023' },
    { id: 4, name: 'Nexus Logistics', industry: 'Supply Chain', status: 'Inactive', sentiment: 'At Risk', email: 'ops@nexus.log', phone: '+49 30 12345678', location: 'Berlin, Germany', joined: 'Mar 2023' },
    { id: 5, name: 'Horizon Bank', industry: 'Finance', status: 'Active', sentiment: 'Positive', email: 'support@horizon.bank', phone: '+1 (555) 456-7890', location: 'Chicago, USA', joined: 'Feb 2024' },
  ]);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newClient = {
      id: clients.length + 1,
      name: formData.get('name') as string,
      industry: formData.get('industry') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: 'Active',
      sentiment: 'Neutral',
      location: 'Remote',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setClients([newClient, ...clients]);
    toast.success(t('clients.added_success', 'Client added successfully!'));
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {t('nav.clients', 'Client Management')}
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            {t('clients.subtitle', 'Manage your business relationships and AI-driven CRM data.')}
          </p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <UserPlus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t('clients.add_client', 'Add Client')}
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              <Filter className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">Export CSV</Button>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">AI Sentiment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr 
                    key={client.id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedClient(client);
                      setIsDetailsOpen(true);
                      handleGenerateInsights(client);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs">
                            {client.name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{client.name}</p>
                          <p className="text-xs text-slate-500">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client.industry}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                        client.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                        client.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      )}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          client.sentiment === 'Positive' ? 'bg-emerald-500' : 
                          client.sentiment === 'Neutral' ? 'bg-amber-400' : 'bg-red-500'
                        )}></div>
                        <span className={cn(
                          "text-sm font-medium",
                          client.sentiment === 'Positive' ? 'text-emerald-700' : 
                          client.sentiment === 'Neutral' ? 'text-amber-700' : 'text-red-700'
                        )}>
                          {client.sentiment}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <div className="px-2 py-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {t('common.actions', 'Actions')}
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toast.info(t('clients.messaging', 'Opening messenger...'))}>
                            <MessageSquare className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {t('clients.send_message', 'Message')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(t('clients.opening_crm', 'Redirecting to CRM...'))}>
                            <ExternalLink className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {t('clients.view_crm', 'View CRM')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
                            <Pencil className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {t('common.edit', 'Edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => toast.error(t('common.delete_confirm', 'Delete action initiated'))}>
                            <Trash2 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {t('common.delete', 'Delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddClient}>
            <DialogHeader>
              <DialogTitle>{t('clients.add_client', 'Add New Client')}</DialogTitle>
              <DialogDescription>
                {t('clients.add_desc', 'Enter the details of the new business relationship.')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('clients.name', 'Company Name')}</Label>
                  <Input id="name" placeholder="Acme Inc." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">{t('clients.industry', 'Industry')}</Label>
                  <Select name="industry" defaultValue="technology">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('clients.email', 'Email Address')}</Label>
                <Input id="email" name="email" type="email" placeholder="contact@company.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('clients.phone', 'Phone Number')}</Label>
                <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {t('clients.create', 'Create Client')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Client Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedClient && (
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xl">
                    {selectedClient.name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle className="text-2xl">{selectedClient.name}</SheetTitle>
                  <Badge variant="outline" className="mt-1">{selectedClient.industry}</Badge>
                </div>
              </div>
              <SheetDescription>
                {t('clients.details_desc', 'Comprehensive view of client relationship and AI insights.')}
              </SheetDescription>
            </SheetHeader>

            <div className="py-6 space-y-8">
              {/* Status & Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {t('clients.client_status', 'Client Status')}
                  </h3>
                  <Badge className={cn(
                    "font-bold",
                    selectedClient.status === 'Active' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                    selectedClient.status === 'Pending' ? 'bg-amber-400 hover:bg-amber-500' : 'bg-slate-500 hover:bg-slate-600'
                  )}>
                    {selectedClient.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t('clients.last_contact', 'Last Contact')}</p>
                    <p className="text-xs font-medium text-slate-900">2 days ago</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">{t('clients.next_followup', 'Next Follow-up')}</p>
                    <p className="text-xs font-medium text-blue-600">Tomorrow</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('clients.lifetime_value', 'LTV')}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">$12,450</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('clients.growth', 'Growth')}</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-600">+15.4%</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {t('clients.contact_info', 'Contact Information')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {selectedClient.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {selectedClient.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {selectedClient.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {t('clients.joined', 'Joined')}: {selectedClient.joined}
                  </div>
                </div>
              </div>

              <Separator />

              {/* AI Insights */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {t('clients.ai_insights', 'AI Insights')}
                </h3>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-none overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-2">
                    <Badge variant="secondary" className="bg-white/50 backdrop-blur-sm text-[10px]">AI Generated</Badge>
                  </div>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">{t('clients.sentiment_score', 'Sentiment Score')}</span>
                      <Badge className={cn(
                        "font-bold",
                        selectedClient.sentiment === 'Positive' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                        selectedClient.sentiment === 'Neutral' ? 'bg-amber-400 hover:bg-amber-500' : 'bg-red-500 hover:bg-red-600'
                      )}>
                        {selectedClient.sentiment}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">{t('clients.engagement', 'Engagement Level')}</span>
                        <span className="text-blue-600 font-bold">85%</span>
                      </div>
                      <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-blue-600" 
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/20">
                      {isGenerating ? (
                        <div className="flex items-center justify-center py-4 gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-xs text-slate-500">Analyzing client data...</span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-700 leading-relaxed italic">
                          {aiInsights?.summary || "Select a client to see AI-generated interaction summary."}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-[10px] text-slate-500">
                        <span className="block font-bold text-slate-700 uppercase tracking-tighter mb-1">Next Best Action</span>
                        <div className="p-2 bg-blue-600/10 rounded border border-blue-600/20 text-blue-700 font-medium">
                          {isGenerating ? "Calculating..." : (aiInsights?.nextAction || "Pending analysis")}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-slate-500">
                          <span className="block font-bold text-slate-700 uppercase tracking-tighter">Churn Risk</span>
                          Very Low
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2"
                          onClick={() => navigate('/agents', { state: { initialPrompt: `I need help with client ${selectedClient.name}. Here is the context: ${aiInsights?.summary}` } })}
                        >
                          <Bot className="w-4 h-4" />
                          Consult Agent
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Recent Activity */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  {t('clients.recent_activity', 'Recent Activity')}
                </h3>
                <div className="space-y-4">
                  {[
                    { action: 'Contract Signed', date: '2 days ago', icon: Activity },
                    { action: 'Support Ticket Resolved', date: '1 week ago', icon: MessageSquare },
                    { action: 'New Lead Enrichment', date: '2 weeks ago', icon: Users },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.action}</p>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message History */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  {t('clients.message_history', 'Message History')}
                </h3>
                <div className="space-y-3">
                  {[
                    { role: 'ai', content: 'Hello! I noticed your recent interest in our AI agents. Would you like a demo?', time: '2 days ago' },
                    { role: 'user', content: 'Yes, that would be great. Can we schedule it for next week?', time: '2 days ago' },
                    { role: 'ai', content: 'Perfect. I will have our Sales Agent reach out to finalize the time.', time: '1 day ago' },
                  ].map((msg, i) => (
                    <div key={i} className={cn(
                      "flex flex-col gap-1 max-w-[90%]",
                      msg.role === 'user' ? "ml-auto items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "p-3 rounded-2xl text-xs leading-relaxed",
                        msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-900 rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {t('clients.quick_actions', 'Quick Actions')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t('clients.send_message', 'Message')}
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('clients.view_crm', 'CRM Link')}
                  </Button>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                {t('clients.edit_client', 'Edit Client Profile')}
              </Button>
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
};

export default Clients;
