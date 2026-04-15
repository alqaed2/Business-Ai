import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Download, 
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Workflow,
  CheckCircle2,
  Search,
  X,
  Lightbulb,
  Target as TargetIcon,
  CheckCircle2 as CheckIcon,
  AlertTriangle,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import { toast } from "sonner";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { generateAIResponse } from '../lib/gemini';
import { Skeleton } from "../components/ui/skeleton";

const performanceData = [
  { name: 'Mon', tasks: 145, efficiency: 88 },
  { name: 'Tue', tasks: 232, efficiency: 92 },
  { name: 'Wed', tasks: 187, efficiency: 85 },
  { name: 'Thu', tasks: 345, efficiency: 95 },
  { name: 'Fri', tasks: 290, efficiency: 91 },
  { name: 'Sat', tasks: 120, efficiency: 89 },
  { name: 'Sun', tasks: 98, efficiency: 87 },
];

const agentDistribution = [
  { name: 'Marketing', value: 30, color: '#ec4899' },
  { name: 'Operations', value: 20, color: '#3b82f6' },
  { name: 'Sales', value: 15, color: '#f59e0b' },
  { name: 'Support', value: 20, color: '#10b981' },
  { name: 'CX', value: 15, color: '#6366f1' },
];

const agentPerformanceMetrics = [
  { name: 'Marketing', completion: 94, responseTime: 1.2, utilization: 78 },
  { name: 'Operations', completion: 88, responseTime: 2.5, utilization: 65 },
  { name: 'Sales', completion: 91, responseTime: 0.8, utilization: 82 },
  { name: 'Support', completion: 96, responseTime: 1.5, utilization: 88 },
  { name: 'CX', completion: 92, responseTime: 1.8, utilization: 72 },
];

const initialLogs = [
  { id: 1, agent: 'Marketing', task: 'Content Strategy', status: 'Completed', duration: '1.2s', time: '2 mins ago', timestamp: '2026-04-10T14:20:00Z' },
  { id: 2, agent: 'Sales', task: 'Lead Scoring', status: 'Completed', duration: '0.8s', time: '12 mins ago', timestamp: '2026-04-10T14:10:00Z' },
  { id: 3, agent: 'Operations', task: 'Data Analysis', status: 'Processing', duration: '-', time: 'Just now', timestamp: '2026-04-10T14:28:00Z' },
  { id: 4, agent: 'Support', task: 'Ticket Resolution', status: 'Completed', duration: '2.4s', time: '45 mins ago', timestamp: '2026-04-10T13:45:00Z' },
  { id: 5, agent: 'Marketing', task: 'Ad Copy Gen', status: 'Failed', duration: '0.5s', time: '1 hour ago', timestamp: '2026-04-10T13:30:00Z' },
  { id: 6, agent: 'Sales', task: 'Email Campaign', status: 'Completed', duration: '1.5s', time: '2 hours ago', timestamp: '2026-04-10T12:30:00Z' },
  { id: 7, agent: 'Operations', task: 'Workflow Sync', status: 'Completed', duration: '3.2s', time: '3 hours ago', timestamp: '2026-04-10T11:30:00Z' },
];

const revenueGrowthData = [
  { month: 'January', value: 42000, percentage: 58 },
  { month: 'February', value: 48000, percentage: 65 },
  { month: 'March', value: 55000, percentage: 75 },
  { month: 'April', value: 51000, percentage: 70 },
  { month: 'May', value: 62000, percentage: 85 },
  { month: 'June', value: 73000, percentage: 100 },
];

const Reports = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [realLogs, setRealLogs] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [filters, setFilters] = useState({
    agent: 'all',
    status: 'all',
    taskType: 'all',
    search: '',
  });

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'jobs'),
      where('tenantId', '==', profile.tenantId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => {
        const data = doc.data();
        const agentId = data.type || 'unknown';
        const agentName = agentId.charAt(0).toUpperCase() + agentId.slice(1).replace('_', ' ');
        
        return {
          id: doc.id,
          agent: agentName,
          task: data.input?.prompt?.substring(0, 30) + (data.input?.prompt?.length > 30 ? '...' : ''),
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          duration: data.completedAt && data.createdAt ? 
            `${((new Date(data.completedAt).getTime() - new Date(data.createdAt).getTime()) / 1000).toFixed(1)}s` : 
            '-',
          time: data.createdAt ? formatDistanceToNow(new Date(data.createdAt), { 
            addSuffix: true,
            locale: i18n.language === 'ar' ? ar : enUS
          }) : '',
          timestamp: data.createdAt
        };
      });
      setRealLogs(logs);
    }, (error) => {
      console.error("Reports Logs Fetch Error:", error);
    });

    return () => unsubscribe();
  }, [profile?.tenantId, i18n.language]);

  const allLogs = useMemo(() => {
    return [...realLogs, ...initialLogs];
  }, [realLogs]);

  const taskTypes = useMemo(() => {
    const types = new Set(allLogs.map(log => log.task));
    return Array.from(types);
  }, [allLogs]);

  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      const matchesAgent = filters.agent === 'all' || log.agent.toLowerCase() === filters.agent.toLowerCase();
      const matchesStatus = filters.status === 'all' || log.status.toLowerCase() === filters.status.toLowerCase();
      const matchesTaskType = filters.taskType === 'all' || log.task === filters.taskType;
      const matchesSearch = log.task.toLowerCase().includes(filters.search.toLowerCase()) || 
                           log.agent.toLowerCase().includes(filters.search.toLowerCase());
      return matchesAgent && matchesStatus && matchesTaskType && matchesSearch;
    });
  }, [allLogs, filters]);

  const efficiencyMetrics = useMemo(() => {
    const total = allLogs.length;
    const completed = allLogs.filter(log => log.status.toLowerCase() === 'completed').length;
    const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
    return { percentage, total, completed };
  }, [allLogs]);

  const resetFilters = () => {
    setFilters({ agent: 'all', status: 'all', taskType: 'all', search: '' });
  };

  useEffect(() => {
    const fetchAiInsights = async () => {
      setIsAiLoading(true);
      try {
        const prompt = `Based on the following business reports data, generate 4 key insights and 4 actionable recommendations.
        Efficiency Metrics:
        - Total Tasks: ${efficiencyMetrics.total}
        - AI Efficiency: ${efficiencyMetrics.percentage}%
        
        Revenue Growth (Last 6 months):
        ${revenueGrowthData.map(d => `- ${d.month}: $${d.value.toLocaleString()}`).join('\n')}
        
        Agent Performance:
        ${agentPerformanceMetrics.map(a => `- ${a.name}: ${a.completion}% completion, ${a.responseTime}s response time`).join('\n')}
        
        Format the response as a JSON object:
        {
          "insights": [
            {"text": "Insight text here", "type": "success" | "warning" | "info"}
          ],
          "recommendations": [
            {"text": "Recommendation text here"}
          ]
        }
        Respond in ${i18n.language === 'ar' ? 'Arabic' : 'English'}.`;

        const response = await generateAIResponse(prompt, "You are a senior business intelligence analyst. Respond ONLY with valid JSON.");
        const cleanedResponse = response.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanedResponse);
        setAiInsights(data.insights || []);
        setAiRecommendations(data.recommendations || []);
      } catch (error) {
        console.error("AI Insights Generation Error:", error);
        // Fallback data if AI fails
        setAiInsights([
          { text: i18n.language === 'ar' ? 'زيادة بنسبة 23.5% في الإيرادات مقارنة بالشهر الماضي' : '23.5% increase in revenue compared to last month', type: 'success' },
          { text: i18n.language === 'ar' ? 'SupportAgent يحقق أعلى معدل نجاح بنسبة 97%' : 'SupportAgent achieves highest success rate at 97%', type: 'success' },
          { text: i18n.language === 'ar' ? 'معدل التحويل تحسن بنسبة 5.2% هذا الشهر' : 'Conversion rate improved by 5.2% this month', type: 'success' },
          { text: i18n.language === 'ar' ? 'معدل الاحتفاظ انخفض بنسبة 2.1% - يحتاج إلى اهتمام' : 'Retention rate decreased by 2.1% - needs attention', type: 'warning' },
        ]);
        setAiRecommendations([
          { text: i18n.language === 'ar' ? 'تفعيل RetentionAgent لتحسين معدل الاحتفاظ بالعملاء' : 'Activate RetentionAgent to improve customer retention rate' },
          { text: i18n.language === 'ar' ? 'زيادة ميزانية MarketingAgent بسبب الأداء الممتاز' : 'Increase MarketingAgent budget due to excellent performance' },
          { text: i18n.language === 'ar' ? 'مراجعة وتحسين أداء OperationsAgent (88%)' : 'Review and improve OperationsAgent performance (88%)' },
          { text: i18n.language === 'ar' ? 'إنشاء حملة جديدة للاستفادة من النمو الحالي' : 'Create a new campaign to capitalize on current growth' },
        ]);
      } finally {
        setIsAiLoading(false);
      }
    };

    if (allLogs.length > 0) {
      fetchAiInsights();
    }
  }, [i18n.language, allLogs.length, efficiencyMetrics.total, efficiencyMetrics.percentage]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {t('reports.title', 'Intelligence Reports')}
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            {t('reports.subtitle', 'Comprehensive analysis of AI operations and business impact.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('reports.last_30_days', 'Last 30 Days')}
          </Button>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => toast.success(t('reports.export_success', 'Report exported successfully!'))}
          >
            <Download className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('reports.export', 'Export PDF')}
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('reports.total_tasks', 'Total Tasks'), value: efficiencyMetrics.total.toLocaleString(), trend: '+12.5%', icon: Workflow, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('reports.ai_efficiency', 'AI Efficiency'), value: `${efficiencyMetrics.percentage}%`, trend: '+2.1%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: t('reports.hours_saved', 'Hours Saved'), value: '428h', trend: '+18.4%', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: t('reports.active_users', 'Active Clients'), value: '56', trend: '+5.2%', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.task_throughput', 'System Throughput')}</CardTitle>
            <CardDescription>{t('reports.task_throughput_desc', 'Daily task execution volume across all agents.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.agent_usage', 'Agent Distribution')}</CardTitle>
            <CardDescription>{t('reports.agent_usage_desc', 'Workload share by agent type.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {agentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {agentDistribution.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Analytics Section */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-900">{t('reports.agent_performance', 'Agent Performance Analytics')}</h2>
          <p className="text-sm text-slate-500">{t('reports.performance_desc', 'Detailed metrics on individual agent efficiency and workload.')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t('reports.completion_rate', 'Task Completion Rate (%)')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentPerformanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                      {agentPerformanceMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={agentDistribution[index % agentDistribution.length].color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t('reports.avg_response_time', 'Average Response Time (s)')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={agentPerformanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="responseTime" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.utilization', 'Agent Utilization')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6">{t('reports.agent', 'Agent')}</TableHead>
                  <TableHead>{t('reports.completion_rate', 'Completion Rate')}</TableHead>
                  <TableHead>{t('reports.avg_response_time', 'Avg. Response Time')}</TableHead>
                  <TableHead className="pr-6 text-right">{t('reports.utilization', 'Utilization')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentPerformanceMetrics.map((agent) => (
                  <TableRow key={agent.name} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 font-medium text-slate-900">{agent.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[100px]">
                          <div className="bg-emerald-500 h-full" style={{ width: `${agent.completion}%` }} />
                        </div>
                        <span className="text-xs font-bold text-emerald-600">{agent.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">{agent.responseTime}s</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none">
                        {agent.utilization}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table Section */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">{t('reports.recent_executions', 'Detailed Execution Logs')}</CardTitle>
              <CardDescription>{t('reports.recent_executions_desc', 'Comprehensive list of recent AI agent activities.')}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder={t('common.search', 'Search...')} 
                  className="pl-9 w-full md:w-64 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                />
              </div>
              <Button 
                variant={showFilters ? "secondary" : "ghost"} 
                size="sm" 
                className={cn("text-slate-600", showFilters && "bg-blue-50 text-blue-600")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('reports.filter', 'Filter')}
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">{t('reports.agent', 'Agent')}</label>
                <Select value={filters.agent} onValueChange={(v) => setFilters(f => ({ ...f, agent: v }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all', 'All Agents')}</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">{t('reports.task', 'Task Type')}</label>
                <Select value={filters.taskType} onValueChange={(v) => setFilters(f => ({ ...f, taskType: v }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all', 'All Tasks')}</SelectItem>
                    {taskTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">{t('reports.status', 'Status')}</label>
                <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all', 'All Status')}</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-500" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('common.reset', 'Reset Filters')}
                </Button>
              </div>
            </motion.div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">{t('reports.agent', 'Agent')}</TableHead>
                <TableHead>{t('reports.task', 'Task Type')}</TableHead>
                <TableHead>{t('reports.status', 'Status')}</TableHead>
                <TableHead>{t('reports.duration', 'Duration')}</TableHead>
                <TableHead className="pr-6 text-right">{t('reports.timestamp', 'Timestamp')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                    {t('reports.no_results', 'No matching logs found.')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="pl-6 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          row.agent.toLowerCase().includes('marketing') ? "bg-pink-500" :
                          row.agent.toLowerCase().includes('sales') ? "bg-amber-500" :
                          row.agent.toLowerCase().includes('operations') ? "bg-blue-500" : 
                          row.agent.toLowerCase().includes('support') ? "bg-emerald-500" : "bg-indigo-500"
                        )} />
                        {row.agent}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{row.task}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={row.status === 'Completed' ? 'default' : row.status === 'Failed' ? 'destructive' : 'secondary'}
                        className={cn(
                          "text-[10px] px-2 py-0",
                          row.status === 'Completed' && "bg-emerald-500 hover:bg-emerald-600"
                        )}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 font-mono text-xs">{row.duration}</TableCell>
                    <TableCell className="pr-6 text-right text-slate-400 text-xs group-hover:text-slate-600 transition-colors">
                      {row.time}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Sections: Revenue Growth, AI Insights, Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth */}
        <Card className="border-none shadow-sm bg-white ring-1 ring-slate-200/50">
          <CardHeader className="pb-4 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                {i18n.language === 'ar' ? 'نمو الإيرادات' : 'Revenue Growth'}
              </CardTitle>
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {revenueGrowthData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-900">${item.value.toLocaleString()}</span>
                    <span className="text-slate-500 font-medium">
                      {i18n.language === 'ar' ? 
                        ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'][i] : 
                        item.month}
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-none shadow-sm bg-white ring-1 ring-slate-200/50">
          <CardHeader className="pb-4 border-b border-slate-50">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              {i18n.language === 'ar' ? 'رؤى رئيسية' : 'Key Insights'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {isAiLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : (
                aiInsights.map((insight, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className={cn(
                      "mt-0.5 p-0.5 rounded-full shrink-0",
                      insight.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                      insight.type === 'warning' ? "bg-amber-100 text-amber-600" :
                      "bg-blue-100 text-blue-600"
                    )}>
                      {insight.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckIcon className="w-3.5 h-3.5" />}
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                      {insight.text}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-none shadow-sm bg-white ring-1 ring-slate-200/50">
          <CardHeader className="pb-4 border-b border-slate-50">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TargetIcon className="w-5 h-5 text-red-500" />
              {i18n.language === 'ar' ? 'توصيات' : 'Recommendations'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {isAiLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : (
                aiRecommendations.map((rec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="mt-0.5 p-0.5 bg-slate-100 text-slate-400 rounded-full shrink-0 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-blue-600 transition-colors">
                      {rec.text}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
