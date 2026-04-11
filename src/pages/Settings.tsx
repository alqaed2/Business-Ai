import React from 'react';
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
  Languages
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

import { useNotifications } from '../components/NotificationProvider';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { addNotification } = useNotifications();

  const handleSave = () => {
    toast.success(t('settings.saved_success', 'Settings saved successfully!'));
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
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('nav.settings', 'Settings')}</h1>
        <p className="text-slate-500 mt-1">{t('settings.subtitle', 'Manage your account, preferences, and system configurations.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-1">
          {[
            { id: 'profile', label: t('settings.profile', 'Profile'), icon: User },
            { id: 'notifications', label: t('settings.notifications', 'Notifications'), icon: Bell },
            { id: 'security', label: t('settings.security', 'Security'), icon: Shield },
            { id: 'appearance', label: t('settings.appearance', 'Appearance'), icon: Moon },
            { id: 'language', label: t('settings.language_region', 'Language & Region'), icon: Globe },
            { id: 'data', label: t('settings.data_privacy', 'Data & Privacy'), icon: Database },
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
        <div className="md:col-span-2 space-y-6">
          {/* Profile Section */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t('settings.profile_info', 'Profile Information')}</CardTitle>
              <CardDescription>{t('settings.profile_desc', 'Update your personal details and how others see you.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('settings.first_name', 'First Name')}</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('settings.last_name', 'Last Name')}</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('settings.email', 'Email Address')}</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">{t('settings.bio', 'Bio')}</Label>
                <textarea 
                  id="bio" 
                  className="w-full min-h-[100px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder={t('settings.bio_placeholder', 'Tell us about yourself...')}
                />
              </div>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                {t('settings.save_changes', 'Save Changes')}
              </Button>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t('settings.preferences', 'System Preferences')}</CardTitle>
              <CardDescription>{t('settings.preferences_desc', 'Configure how the AI OS interacts with you.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('settings.email_notif', 'Email Notifications')}</Label>
                  <p className="text-sm text-slate-500">{t('settings.email_notif_desc', 'Receive weekly summaries of AI operations.')}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">System Notifications</Label>
                  <p className="text-sm text-slate-500">Test the real-time notification system.</p>
                </div>
                <Button variant="outline" size="sm" onClick={sendTestNotification}>
                  Send Test
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('settings.dark_mode', 'Dark Mode')}</Label>
                  <p className="text-sm text-slate-500">{t('settings.dark_mode_desc', 'Switch between light and dark themes.')}</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-base">{t('settings.system_language', 'System Language')}</Label>
                <Select 
                  value={i18n.language} 
                  onValueChange={(val) => i18n.changeLanguage(val)}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-100 bg-red-50/30 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-red-600">{t('settings.danger_zone', 'Danger Zone')}</CardTitle>
              <CardDescription>{t('settings.danger_desc', 'Irreversible actions related to your account.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
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
