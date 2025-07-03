'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Shield,
  UserCog,
  ClipboardList,
  FileText,
  Mic,
  BookOpen,
  UserCheck,
  Clock,
  FolderOpen,
  Wrench,
  CheckSquare,
  Bot,
  Workflow,
  Mail,
  CreditCard,
  Package,
  Truck,
  ShoppingCart,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'doctor', 'support'] },
  { name: 'Patients', href: '/patients', icon: Users, roles: ['admin', 'doctor', 'support'] },
  { name: 'Appointments', href: '/appointments', icon: Calendar, roles: ['admin', 'doctor', 'support'] },
  { name: 'Tasks', href: '/tasks', icon: ClipboardList, roles: ['admin', 'doctor', 'support'] },
  { name: 'Clinical Notes', href: '/clinical-notes', icon: FileText, roles: ['admin', 'doctor', 'support'] },
  { name: 'Dictation', href: '/dictation', icon: Mic, roles: ['admin', 'doctor', 'support'] },
  { name: 'Logbook', href: '/logbook', icon: BookOpen, roles: ['admin', 'doctor', 'support'] },
  { name: 'Staff', href: '/staff', icon: UserCheck, roles: ['admin', 'doctor', 'support'] },
  { name: 'Availability', href: '/availability', icon: Clock, roles: ['admin', 'doctor', 'support'] },
  { name: 'Documents', href: '/documents', icon: FolderOpen, roles: ['admin', 'doctor', 'support'] },
  { name: 'Equipment', href: '/equipment', icon: Wrench, roles: ['admin', 'doctor', 'support'] },
  { name: 'CQC Management', href: '/cqc-management', icon: CheckSquare, roles: ['admin', 'doctor', 'support'] },
  { name: 'AI Summary', href: '/ai-summary', icon: Bot, roles: ['admin', 'doctor', 'support'] },
  { name: 'Workflows', href: '/workflows', icon: Workflow, roles: ['admin', 'doctor', 'support'] },
  { name: 'Messages', href: '/messages', icon: MessageSquare, roles: ['admin', 'doctor', 'support'] },
  { name: 'Patient Messages', href: '/patient-messages', icon: Mail, roles: ['admin', 'doctor', 'support'] },
  { name: 'Billing', href: '/billing', icon: CreditCard, roles: ['admin', 'doctor', 'support'] },
  { name: 'Sample Patients', href: '/sample-patients', icon: Users, roles: ['admin', 'doctor', 'support'] },
  { name: 'Suppliers', href: '/suppliers', icon: Truck, roles: ['admin', 'doctor', 'support'] },
  { name: 'Products', href: '/products', icon: Package, roles: ['admin', 'doctor', 'support'] },
  { name: 'Supplier Orders', href: '/supplier-orders', icon: ShoppingCart, roles: ['admin', 'doctor', 'support'] },
  { name: 'Admin Panel', href: '/admin', icon: Shield, roles: ['admin'] },
  { name: 'User Management', href: '/admin/users', icon: UserCog, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'doctor', 'support'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useStore();

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(profile?.role || 'support')
  );

  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white/80 backdrop-blur-md border-r border-slate-200 transition-all duration-200 ease-in-out overflow-y-auto',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-pink-600 p-2 rounded-xl">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">Clio</h1>
                <p className="text-xs text-slate-500">Medical Platform</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 p-0 rounded-full"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-grow" style={{ height: 'calc(100% - 140px)' }}>
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href !== '/dashboard' && pathname.startsWith(item.href)) ||
                            (item.href === '/admin' && pathname.startsWith('/admin'));
            
            const NavLink = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-pink-50 text-blue-700 border border-blue-100 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-slate-500"
                )} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {NavLink}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.name}>{NavLink}</div>;
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {profile?.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}