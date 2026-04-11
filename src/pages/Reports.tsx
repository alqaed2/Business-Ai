import React, { useState, useMemo } from 'react';
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
  X
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
  { name: 'Marketing', value: 35, color: '#ec4899' },
  { name: 'Operations', value: 25, color: '#3b82f6' },
  { name: 'Sales', value: 20, color: '#f59e0b' },
  { name: 'Support', value: 20, color: '#10b981' },
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

const Reports = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    agent: 'all',
    status: 'all',
    taskType: 'all',
    search: '',
  });

  const taskTypes = useMemo(() => {
    const types = new Set(initialLogs.map(log => log.task));
    return Array.from(types);
  }, []);

  const filteredLogs = useMemo(() => {
    return initialLogs.filter(log => {
      const matchesAgent = filters.agent === 'all' || log.agent === filters.agent;
      const matchesStatus = filters.status === 'all' || log.status === filters.status;
      const matchesTaskType = filters.taskType === 'all' || log.task === filters.taskType;
      const matchesSearch = log.task.toLowerCase().includes(filters.search.toLowerCase()) || 
                           log.agent.toLowerCase().includes(filters.search.toLowerCase());
      return matchesAgent && matchesStatus && matchesTaskType && matchesSearch;
    });
  }, [filters]);

  const efficiencyMetrics = useMemo(() => {
    const total = initialLogs.length;
    const completed = initialLogs.filter(log => log.status === 'Completed').length;
    const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
    return { percentage, total, completed };
  }, []);

  const resetFilters = () => {
    setFilters({ agent: 'all', status: 'all', taskType: 'all', search: '' });
  };

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
                          row.agent === 'Marketing' ? "bg-pink-500" :
                          row.agent === 'Sales' ? "bg-amber-500" :
                          row.agent === 'Operations' ? "bg-blue-500" : "bg-emerald-500"
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
    </div>
  );
};

export default Reports;
