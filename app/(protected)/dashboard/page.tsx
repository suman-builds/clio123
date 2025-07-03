'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Calendar,
  MessageSquare,
  Activity,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalPatients: number;
  todayAppointments: number;
  unreadMessages: number;
  activeConversations: number;
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 5,
    totalPatients: 12,
    todayAppointments: 3,
    unreadMessages: 2,
    activeConversations: 4,
  });

  console.log(profile, "testsss")
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setRecentActivity([
        {
          id: 1,
          type: 'user',
          title: 'New admin account created',
          time: '5 minutes ago',
          description: 'Tertiary Admin account was successfully created',
        },
        {
          id: 2,
          type: 'system',
          title: 'System initialized',
          time: '10 minutes ago',
          description: 'Clio is now ready for use',
        },
        {
          id: 3,
          type: 'patient',
          title: 'Sample patients loaded',
          time: '15 minutes ago',
          description: 'Demo patient data has been populated',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [profile]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded-xl w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded-xl w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 rounded-3xl h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '3 admin accounts active',
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      change: 'Demo data loaded',
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: 'Sample appointments',
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: Activity,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      change: 'All systems operational',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {getGreeting()}, {profile?.full_name || 'Admin'}!
        </h1>
        <p className="text-slate-600 mt-2">
          Welcome to Clio. You are logged in as an administrator with full system access.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-slate-600">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-800">
              <TrendingUp className="mr-2 h-5 w-5 text-pink-600" />
              Admin Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition-colors card-hover">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-slate-900">Manage Users</p>
                <p className="text-sm text-slate-600">Add, edit, or remove users</p>
              </button>
              <button className="p-4 bg-pink-50 rounded-xl text-left hover:bg-pink-100 transition-colors card-hover">
                <Calendar className="h-6 w-6 text-pink-600 mb-2" />
                <p className="font-medium text-slate-900">View Appointments</p>
                <p className="text-sm text-slate-600">Manage scheduling</p>
              </button>
              <button className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition-colors card-hover">
                <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-slate-900">Messages</p>
                <p className="text-sm text-slate-600">View communications</p>
              </button>
              <button className="p-4 bg-pink-50 rounded-xl text-left hover:bg-pink-100 transition-colors card-hover">
                <Activity className="h-6 w-6 text-pink-600 mb-2" />
                <p className="font-medium text-slate-900">System Settings</p>
                <p className="text-sm text-slate-600">Configure portal</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Notice */}
      <Card className="border-blue-200 bg-blue-50 rounded-3xl shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Demo Mode Active</h3>
              <p className="text-sm text-blue-700 mt-1">
                You are currently using Clio in demo mode. Three admin accounts have been created:
                Primary Admin, Secondary Admin, and Tertiary Admin. All authentication has been bypassed for demonstration purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}