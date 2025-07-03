'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Settings,
  Database,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SystemStats {
  totalUsers: number;
  totalPatients: number;
  totalAppointments: number;
  totalMessages: number;
  activeConversations: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'patient_added' | 'appointment_scheduled' | 'message_sent';
  description: string;
  timestamp: string;
  user?: string;
}

export default function AdminPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 6,
    totalPatients: 15,
    totalAppointments: 8,
    totalMessages: 24,
    activeConversations: 5,
    systemHealth: 'healthy',
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    loadAdminData();
  }, [profile, router]);

  const loadAdminData = async () => {
    try {
      // Simulate loading data without Supabase calls
      setRecentActivity([
        {
          id: '1',
          type: 'user_created',
          description: 'New admin account created for Tertiary Admin',
          timestamp: '2 hours ago',
          user: 'System',
        },
        {
          id: '2',
          type: 'patient_added',
          description: 'Patient Sarah Wilson added to the system',
          timestamp: '4 hours ago',
          user: 'Dr. Smith',
        },
        {
          id: '3',
          type: 'appointment_scheduled',
          description: 'Appointment scheduled for tomorrow at 2:00 PM',
          timestamp: '6 hours ago',
          user: 'Support Staff',
        },
        {
          id: '4',
          type: 'message_sent',
          description: 'Emergency consultation message sent',
          timestamp: '8 hours ago',
          user: 'Dr. Johnson',
        },
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_created':
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'patient_added':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'appointment_scheduled':
        return <Clock className="h-4 w-4 text-purple-600" />;
      case 'message_sent':
        return <Mail className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getHealthBadge = (health: SystemStats['systemHealth']) => {
    switch (health) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Critical</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const adminCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => router.push('/admin/users'),
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => router.push('/patients'),
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => router.push('/appointments'),
    },
    {
      title: 'System Messages',
      value: stats.totalMessages,
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => router.push('/messages'),
    },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => router.push('/admin/users'),
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      action: () => router.push('/admin/settings'),
    },
    {
      title: 'Database Management',
      description: 'Monitor and manage database',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => router.push('/admin/database'),
    },
    {
      title: 'Security & Audit',
      description: 'View security logs and audit trails',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      action: () => router.push('/admin/security'),
    },
    {
      title: 'Analytics & Reports',
      description: 'View system analytics and reports',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => router.push('/admin/analytics'),
    },
    {
      title: 'System Logs',
      description: 'Monitor system logs and errors',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => router.push('/admin/logs'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Complete system management and oversight</p>
        </div>
        <div className="flex items-center space-x-4">
          {getHealthBadge(stats.systemHealth)}
          <Button onClick={() => router.push('/admin/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminCards.map((card, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={card.action}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">Click to manage</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-gray-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-4 ${action.bgColor} rounded-lg text-left hover:opacity-80 transition-opacity`}
                >
                  <action.icon className={`h-6 w-6 ${action.color} mb-2`} />
                  <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              Recent System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      {activity.user && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">by {activity.user}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-gray-600" />
            System Health & Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <p className="text-sm text-gray-500">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">45ms</div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <p className="text-sm text-gray-500">Critical Errors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}