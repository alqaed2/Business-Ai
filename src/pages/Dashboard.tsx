import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  LayoutGrid,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  ShieldCheck,
  Cpu,
  Globe,
  Server
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { cn } from '../lib/utils';

const data = [
  { name: 'Mon', value: 400, active: 240 },
  { name: 'Tue', value: 300, active: 139 },
  { name: 'Wed', value: 600, active: 980 },
  { name: 'Thu', value: 800, active: 390 },
  { name: 'Fri', value: 500, active: 480 },
  { name: 'Sat', value: 900, active: 380 },
  { name: 'Sun', value: 1100, active: 430 },
];

const agentData = [
  { name: 'Marketing', value: 35, color: '#ec4899' },
  { name: 'Operations', value: 25, color: '#2563eb' },
  { name: 'Support', value: 20, color: '#10b981' },
  { name: 'Sales', value: 20, color: '#f59e0b' },
];

const healthData = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  status: Math.random() > 0.1 ? 'healthy' : Math.random() > 0.5 ? 'warning' : 'error'
}));

const Dashboard = () => {
  const { t } = useTranslation();

  const stats = [
    { 
      label: t('dashboard.stats.ops'), 
      value: '12,482', 
      change: '+12.5%', 
      isPositive: true,
      icon: Zap, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      description: 'Total AI operations executed'
    },
    { 
      label: t('dashboard.stats.agents'), 
      value: '8', 
      change: '+2', 
      isPositive: true,
      icon: Activity, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      description: 'Active autonomous agents'
    },
    { 
      label: t('dashboard.stats.roi'), 
      value: '$42.5k', 
      change: '+18.2%', 
      isPositive: true,
      icon: TrendingUp, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      description: 'Estimated business value'
    },
    { 
      label: t('dashboard.stats.saved'), 
      value: '142h', 
      change: '-5.1%', 
      isPositive: false,
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      description: 'Human hours automated'
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 rtl:mr-0 rtl:ml-1.5"></span>
              Live System Status: Optimal
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-slate-500 max-w-2xl">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            Last 7 Days
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
            <Zap className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            Deploy Agent
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 hover:bg-slate-50 transition-colors group cursor-default"
          >
            <div className="flex items-start justify-between">
              <div className={cn("p-2.5 rounded-xl transition-all group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                stat.isPositive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
              )}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{stat.value}</h3>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Throughput Chart */}
        <Card className="lg:col-span-8 border-none shadow-sm bg-white overflow-hidden ring-1 ring-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                {t('dashboard.charts.throughput')}
              </CardTitle>
              <CardDescription className="text-xs">System-wide AI operation volume over time</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-4 mr-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Total</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Active</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #f1f5f9', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                      padding: '12px',
                      fontSize: '12px'
                    }}
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                  />
                  <Area 
                    type="step" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                  <Area 
                    type="step" 
                    dataKey="active" 
                    stroke="#10b981" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#colorActive)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Workload & Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* Agent Distribution */}
          <Card className="border-none shadow-sm bg-white ring-1 ring-slate-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-600" />
                Agent Workload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {agentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-900 font-mono">100%</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Load</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {agentData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 font-mono">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health Dot Matrix */}
          <Card className="border-none shadow-sm bg-white ring-1 ring-slate-200/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  System Health
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-100">
                  99.9%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-1">
                  {healthData.map((dot) => (
                    <div 
                      key={dot.id}
                      className={cn(
                        "aspect-square rounded-[2px] transition-all hover:scale-125 cursor-help",
                        dot.status === 'healthy' ? "bg-emerald-400" : 
                        dot.status === 'warning' ? "bg-amber-400" : "bg-red-400"
                      )}
                      title={`Status: ${dot.status}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span>48h ago</span>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      <span>OK</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                      <span>WARN</span>
                    </div>
                  </div>
                  <span>Now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Jobs */}
        <Card className="lg:col-span-12 border-none shadow-sm bg-white ring-1 ring-slate-200/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6 bg-slate-50/30">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
                {t('dashboard.jobs.title')}
              </CardTitle>
              <CardDescription className="text-xs">Real-time execution log of autonomous tasks</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs font-bold h-8">
              {t('dashboard.jobs.viewAll')}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.jobs.task_name')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.jobs.agent')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.jobs.status')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.jobs.duration')}</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t('dashboard.jobs.time')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Marketing Analysis', agent: 'Marketing', status: 'Completed', duration: '1.2s', time: '2m ago', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { name: 'Sales Outreach', agent: 'Sales', status: 'Processing', duration: '-', time: 'Just now', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { name: 'Customer Support', agent: 'Support', status: 'Pending', duration: '-', time: '5m ago', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
                    { name: 'Revenue Forecast', agent: 'Operations', status: 'Completed', duration: '0.8s', time: '12m ago', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { name: 'Churn Prediction', agent: 'Operations', status: 'Failed', duration: '2.4s', time: '20m ago', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                  ].map((job, i) => (
                    <tr key={i} className="group hover:bg-slate-50/80 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-1 h-8 rounded-full", job.bg.replace('bg-', 'bg-').replace('-50', '-500'))}></div>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 font-bold text-[10px] uppercase tracking-tighter">
                          {job.agent}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border", job.bg, job.color, job.border)}>
                          <span className={cn("w-1 h-1 rounded-full animate-pulse", job.color.replace('text', 'bg'))}></span>
                          {job.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-mono font-medium">{job.duration}</td>
                      <td className="px-6 py-4 text-xs text-slate-400 text-right font-medium">{job.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Insights Section */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: t('dashboard.insights.efficiency'), value: '94%', desc: 'AI accuracy rate', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: t('dashboard.insights.uptime'), value: '99.99%', desc: 'System availability', icon: Server, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: t('dashboard.insights.active_sessions'), value: '124', desc: 'Concurrent agent tasks', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((insight, i) => (
            <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center gap-5">
                <div className={cn("p-4 rounded-2xl transition-all group-hover:rotate-12", insight.bg, insight.color)}>
                  <insight.icon className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{insight.title}</p>
                  <h4 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{insight.value}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{insight.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
