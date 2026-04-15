import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Database,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Languages,
  Building2,
  Key,
  RefreshCw,
  Server,
  Cpu,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { toast } from "sonner";
import { useAuth } from '../components/AuthProvider';
import { useNotifications } from '../components/NotificationProvider';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { profile, tenant } = useAuth();
  const { addNotification } = useNotifications();
  
  const [companyName, setCompanyName] = useState(tenant?.name || '');
  const [serverUrl, setServerUrl] = useState(tenant?.serverUrl || 'https://your-app.onrender.com/api/v1');
  const [apiKey, setApiKey] = useState(tenant?.apiKey || 'sk-tenant_' + Math.random().toString(36).substring(7));
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveOrganization = async () => {
    if (!tenant?.id) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'tenants', tenant.id), {
        name: companyName,
        serverUrl: serverUrl
      });
      toast.success(t('settings.saved_success', 'Organization settings saved!'));
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const regenerateKey = async () => {
    if (!tenant?.id) return;
    const newKey = 'sk-tenant_' + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
    try {
      await updateDoc(doc(db, 'tenants', tenant.id), {
        apiKey: newKey
      });
      setApiKey(newKey);
      toast.success("New API key generated successfully");
    } catch (error) {
      toast.error("Failed to regenerate key");
    }
  };

  const sendTestNotification = () => {
    addNotification({
      title: 'Test Notification',
      message: 'This is a test notification from the system settings.',
      type: 'info'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('nav.settings', 'Settings')}</h1>
        <p className="text-slate-500">{t('settings.subtitle', 'Manage your organization, account, and system configurations.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-1">
          {[
            { id: 'org', label: t('settings.organization', 'Organization'), icon: Building2 },
            { id: 'profile', label: t('settings.profile', 'Profile'), icon: User },
            { id: 'notifications', label: t('settings.notifications', 'Notifications'), icon: Bell },
            { id: 'security', label: t('settings.security', 'Security'), icon: Shield },
            { id: 'appearance', label: t('settings.appearance', 'Appearance'), icon: Moon },
            { id: 'language', label: t('settings.language_region', 'Language & Region'), icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:text-blue-600 rounded-lg transition-all"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* Organization Section (Matching Image) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-none shadow-xl bg-[#0f172a] text-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  {t('settings.organization', 'Organization')}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {t('settings.org_desc', 'Manage your business details and backend connection.')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-slate-300 text-sm font-medium">
                      {t('settings.company_name', 'Company Name')}
                    </Label>
                    <Input 
                      id="companyName" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-[#1e293b] border-slate-700 text-white focus:ring-blue-500/50 h-12"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serverUrl" className="text-slate-300 text-sm font-medium">
                      {t('settings.server_url', 'Server Link (Flask Backend)')}
                    </Label>
                    <Input 
                      id="serverUrl" 
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      className="bg-[#1e293b] border-slate-700 text-white focus:ring-blue-500/50 h-12"
                      placeholder="https://your-app.onrender.com/api/v1"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveOrganization} 
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                    {t('settings.save_changes', 'Save Changes')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Keys Section (Matching Image) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-xl bg-[#0f172a] text-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  {t('settings.api_keys', 'API Keys')}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {t('settings.api_desc', 'Use these keys to integrate with external systems.')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Input 
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="bg-[#1e293b] border-slate-700 text-white font-mono h-12 pr-12"
                    />
                    <button 
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                    {t('settings.key_hint', 'Keep this key secret. Do not share it in public repositories.')}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline"
                    onClick={regenerateKey}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-11 rounded-xl font-bold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('settings.regenerate_key', 'Regenerate Key')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Professional System Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  {t('settings.system_config', 'System Configuration')}
                </CardTitle>
                <CardDescription>{t('settings.system_desc', 'Fine-tune the AI OS behavior and performance.')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('settings.auto_enrich', 'Auto-Enrich Leads')}</Label>
                    <p className="text-sm text-slate-500">{t('settings.auto_enrich_desc', 'Automatically enrich new clients using AI.')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('settings.realtime_notif', 'Real-time Notifications')}</Label>
                    <p className="text-sm text-slate-500">{t('settings.realtime_desc', 'Receive instant alerts for critical events.')}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={sendTestNotification}>
                    {t('settings.send_test', 'Send Test')}
                  </Button>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-base">{t('settings.default_model', 'Default AI Model')}</Label>
                  <Select defaultValue="gemini-1.5-pro">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</SelectItem>
                      <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <Card className="border-red-100 bg-red-50/30 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-red-600">{t('settings.danger_zone', 'Danger Zone')}</CardTitle>
              <CardDescription>{t('settings.danger_desc', 'Irreversible actions related to your account.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700 rounded-xl font-bold">
                {t('settings.delete_account', 'Delete Account')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
