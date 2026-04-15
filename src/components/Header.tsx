import React from 'react';
import { useAuth } from './AuthProvider';
import { useNotifications } from './NotificationProvider';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  Search, 
  LogOut,
  User as UserIcon,
  Languages,
  Menu,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { profile, tenant, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    try {
      // Handle Firestore Timestamp
      const d = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(d.getTime())) return '';
      return formatDistanceToNow(d, { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-slate-500"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </Button>
        <div className="relative w-full max-w-[150px] sm:max-w-xs md:max-w-md">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('header.search')} 
            className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <div className="hidden sm:flex flex-col items-end mr-2 rtl:mr-0 rtl:ml-2">
          <span className="text-sm font-semibold text-slate-900">{tenant?.name}</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider py-0 px-1.5 h-4 border-blue-200 bg-blue-50 text-blue-600">
              {profile ? t(`common.roles.${profile.role}`) : ''}
            </Badge>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{tenant?.plan} {t('header.plan')}</span>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleLanguage}
          className="text-slate-500 hover:text-blue-600"
          title={i18n.language === 'en' ? 'العربية' : 'English'}
        >
          <Languages className="w-5 h-5" />
        </Button>

        <Popover>
          <PopoverTrigger className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors hidden xs:flex outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 rtl:right-auto rtl:left-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm">{t('header.notifications')}</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-[10px]">{unreadCount} New</Badge>
              )}
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3",
                        !n.read && "bg-blue-50/30"
                      )}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="mt-0.5">{getIcon(n.type)}</div>
                      <div className="flex-1">
                        <p className={cn("text-sm text-slate-900", !n.read ? "font-bold" : "font-medium")}>{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatDate(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-sm text-slate-400">No notifications yet</p>
                </div>
              )}
            </ScrollArea>
            {unreadCount > 0 && (
              <div className="p-2 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  className="w-full text-xs text-blue-600 hover:text-blue-700 h-8"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-0 hover:bg-transparent outline-none cursor-pointer rounded-full">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-slate-100">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                {profile?.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{profile?.displayName}</span>
                <span className="text-xs font-normal text-slate-500">{profile?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <UserIcon className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
              <span>{t('header.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Bell className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
              <span>{t('nav.settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              <LogOut className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
              <span>{t('header.signout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
