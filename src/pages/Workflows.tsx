import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Workflow, 
  Plus, 
  Play, 
  Clock, 
  CheckCircle2, 
  Settings2,
  GitBranch,
  AlertCircle,
  Zap,
  ArrowRight,
  History,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { cn } from '../lib/utils';

const Workflows = () => {
  const { t } = useTranslation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('workflows.created_success', 'Workflow created successfully!'));
    setIsCreateOpen(false);
  };

  const workflows = [
    { id: 1, name: 'Lead Enrichment Pipeline', status: 'Active', triggers: 'New Lead', agents: 2, lastRun: '10m ago', successRate: '98%', avgTime: '45s' },
    { id: 2, name: 'Weekly Content Calendar', status: 'Scheduled', triggers: 'Every Monday', agents: 3, lastRun: '4d ago', successRate: '100%', avgTime: '12m' },
    { id: 3, name: 'Customer Sentiment Monitor', status: 'Active', triggers: 'New Review', agents: 1, lastRun: '1h ago', successRate: '95%', avgTime: '5s' },
    { id: 4, name: 'Revenue Anomaly Detection', status: 'Paused', triggers: 'Hourly', agents: 2, lastRun: '2d ago', successRate: '92%', avgTime: '1.2m' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {t('nav.workflows', 'Workflow Engine')}
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            {t('workflows.subtitle', 'Automate complex business processes with multi-agent chains.')}
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {t('workflows.create_workflow', 'Create Workflow')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {workflows.map((wf) => (
          <Card 
            key={wf.id} 
            className="border-none shadow-sm hover:shadow-md transition-all group cursor-pointer"
            onClick={() => {
              setSelectedWorkflow(wf);
              setIsDetailsOpen(true);
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                </div>
                <Badge variant={wf.status === 'Active' ? 'default' : 'secondary'} className={
                  wf.status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''
                }>
                  {wf.status}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">{wf.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400 uppercase font-bold tracking-wider">{t('workflows.trigger', 'Trigger')}</p>
                  <p className="text-slate-900 font-semibold">{wf.triggers}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 uppercase font-bold tracking-wider">{t('nav.agents', 'Agents')}</p>
                  <p className="text-slate-900 font-semibold">{wf.agents} Active</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {t('workflows.last_run', 'Last run')}: {wf.lastRun}
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    onClick={() => toast.success(`${t('workflows.running', 'Running')} ${wf.name}...`)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleCreateWorkflow}>
            <DialogHeader>
              <DialogTitle>{t('workflows.create_workflow', 'Create New Workflow')}</DialogTitle>
              <DialogDescription>
                {t('workflows.create_desc', 'Design a multi-agent process to automate your business tasks.')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="wf-name">{t('workflows.name', 'Workflow Name')}</Label>
                <Input id="wf-name" placeholder="e.g. Daily Sales Report" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger">{t('workflows.trigger', 'Trigger Type')}</Label>
                  <Select defaultValue="webhook">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="event">System Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">{t('workflows.priority', 'Priority')}</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('workflows.select_agents', 'Select Agents')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Marketing', 'Sales', 'Operations', 'Support'].map(agent => (
                    <div key={agent} className="flex items-center space-x-2 p-2 rounded border border-slate-100 hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" id={`agent-${agent}`} className="rounded border-slate-300" />
                      <label htmlFor={`agent-${agent}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {agent}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {t('workflows.create', 'Create Workflow')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Workflow Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedWorkflow && (
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <GitBranch className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <SheetTitle className="text-2xl">{selectedWorkflow.name}</SheetTitle>
                  <Badge variant="outline" className="mt-1">{selectedWorkflow.status}</Badge>
                </div>
              </div>
              <SheetDescription>
                {t('workflows.details_desc', 'Detailed execution metrics and configuration for this workflow.')}
              </SheetDescription>
            </SheetHeader>

            <div className="py-6 space-y-8">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-50 border-none shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Activity className="w-3 h-3" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">{t('reports.success_rate', 'Success Rate')}</span>
                    </div>
                    <p className="text-xl font-bold text-emerald-600">{selectedWorkflow.successRate}</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50 border-none shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">{t('reports.avg_response', 'Avg. Time')}</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">{selectedWorkflow.avgTime}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {t('workflows.steps', 'Workflow Steps')}
                </h3>
                <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {[
                    { title: 'Trigger: ' + selectedWorkflow.triggers, desc: 'Initial entry point for the workflow.', icon: Zap, color: 'text-amber-500' },
                    { title: 'Agent Processing', desc: 'Marketing agent analyzes incoming data.', icon: Activity, color: 'text-blue-500' },
                    { title: 'Data Enrichment', desc: 'Operations agent validates and stores results.', icon: CheckCircle2, color: 'text-emerald-500' },
                  ].map((step, i) => (
                    <div key={i} className="relative pl-10">
                      <div className={cn(
                        "absolute left-2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 flex items-center justify-center z-10",
                        i === 0 ? "border-amber-500" : "border-slate-200"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-amber-500" : "bg-slate-200")} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">{step.title}</p>
                        <p className="text-xs text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {t('reports.recent_logs', 'Recent History')}
                  </h3>
                  <Button variant="link" size="sm" className="text-xs h-auto p-0">View All</Button>
                </div>
                <div className="space-y-2">
                  {[
                    { time: '10m ago', status: 'Success' },
                    { time: '1h ago', status: 'Success' },
                    { time: '3h ago', status: 'Failed' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                      <span className="text-slate-600">{log.time}</span>
                      <Badge variant={log.status === 'Success' ? 'default' : 'destructive'} className="text-[8px] h-4 px-1.5">
                        {log.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter className="mt-6 flex flex-col gap-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-2" />
                {t('workflows.run_now', 'Run Workflow Now')}
              </Button>
              <Button variant="outline" className="w-full">
                <Settings2 className="w-4 h-4 mr-2" />
                {t('workflows.edit_config', 'Edit Configuration')}
              </Button>
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
};

export default Workflows;
