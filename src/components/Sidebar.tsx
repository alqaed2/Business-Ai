import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthProvider';
import { 
  LayoutDashboard, 
  Bot, 
  Workflow, 
  Users, 
  CreditCard, 
  Settings,
  BrainCircuit,
  ChevronRight,
  X,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: t('nav.dashboard'), path: '/dashboard', roles: ['admin', 'manager', 'user'] },
    { icon: Bot, label: t('nav.agents'), path: '/agents', roles: ['admin', 'manager', 'user'] },
    { icon: Workflow, label: t('nav.workflows'), path: '/workflows', roles: ['admin', 'manager', 'user'] },
    { icon: BarChart3, label: t('nav.reports'), path: '/reports', roles: ['admin', 'manager'] },
    { icon: Users, label: t('nav.clients'), path: '/clients', roles: ['admin', 'manager', 'user'] },
    { icon: CreditCard, label: t('nav.billing'), path: '/billing', roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r rtl:border-r-0 rtl:border-l border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">AI OS</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose?.();
              }}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium flex-1">{item.label}</span>
              <ChevronRight className={cn(
                "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180",
                "group-[.active]:opacity-100"
              )} />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          {profile && (profile.role === 'admin' || profile.role === 'manager') && (
            <NavLink
              to="/settings"
              onClick={() => {
                if (window.innerWidth < 1024) onClose?.();
              }}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-slate-800 text-white shadow-lg" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">{t('nav.settings')}</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
