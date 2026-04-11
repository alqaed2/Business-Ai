import React from 'react';
import { 
  CreditCard, 
  Check, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  History,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from '../components/AuthProvider';
import { cn } from '../lib/utils';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const plans = [
  {
    name: 'Starter',
    price: '$99',
    description: 'Perfect for small businesses starting with AI.',
    features: ['3 AI Agents', '100 Operations/mo', 'Basic Workflows', 'Email Support'],
    current: true
  },
  {
    name: 'Pro',
    price: '$299',
    description: 'For growing teams scaling their operations.',
    features: ['10 AI Agents', '1,000 Operations/mo', 'Advanced Workflows', 'Priority Support', 'Custom Integrations'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale autonomous business infrastructure.',
    features: ['Unlimited Agents', 'Unlimited Operations', 'Dedicated Orchestrator', '24/7 Support', 'SLA Guarantee'],
  }
];

const Billing = () => {
  const { tenant } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Subscription & Billing</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Scale your business intelligence with our flexible, usage-based plans.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn(
            "relative border-2 transition-all",
            plan.popular ? "border-blue-600 shadow-xl shadow-blue-600/10 scale-105 z-10" : "border-transparent shadow-sm hover:shadow-md",
            tenant?.plan === plan.name.toLowerCase() ? "border-emerald-500" : ""
          )}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-slate-500 ml-1">/mo</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className={cn(
                  "w-full h-12 text-lg font-semibold",
                  plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"
                )}
                variant={tenant?.plan === plan.name.toLowerCase() ? "outline" : "default"}
                onClick={() => {
                  if (tenant?.plan !== plan.name.toLowerCase()) {
                    toast.success(`${t('billing.upgrading', 'Upgrading to')} ${plan.name}...`);
                  }
                }}
              >
                {tenant?.plan === plan.name.toLowerCase() ? t('billing.current_plan', 'Current Plan') : t('billing.upgrade_now', 'Upgrade Now')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-12">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                    <th className="px-4 py-4">Invoice ID</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: 'INV-2024-001', date: 'Oct 1, 2024', amount: '$99.00', status: 'Paid' },
                    { id: 'INV-2024-002', date: 'Sep 1, 2024', amount: '$99.00', status: 'Paid' },
                    { id: 'INV-2024-003', date: 'Aug 1, 2024', amount: '$99.00', status: 'Paid' },
                  ].map((inv) => (
                    <tr key={inv.id} className="text-sm">
                      <td className="px-4 py-4 font-medium text-slate-900">{inv.id}</td>
                      <td className="px-4 py-4 text-slate-600">{inv.date}</td>
                      <td className="px-4 py-4 text-slate-900 font-semibold">{inv.amount}</td>
                      <td className="px-4 py-4">
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600"
                          onClick={() => toast.success(t('billing.downloading', 'Downloading invoice...'))}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
