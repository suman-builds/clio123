'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  MessageSquare,
  Activity,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  userGrowth: {
    current: number;
    previous: number;
    change: number;
  };
  appointmentStats: {
    total: number;
    completed: number;
    cancelled: number;
    completionRate: number;
  };
  messageStats: {
    total: number;
    avgResponseTime: number;
    activeConversations: number;
  };
  systemUsage: {
    dailyActiveUsers: number;
    peakHours: string;
    avgSessionDuration: number;
  };
}

export default function AdminAnalyticsPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: {
      current: 125,
      previous: 98,
      change: 27.6,
    },
    appointmentStats: {
      total: 342,
      completed: 298,
      cancelled: 12,
      completionRate: 87.1,
    },
    messageStats: {
      total: 1247,
      avgResponseTime: 12,
      activeConversations: 45,
    },
    systemUsage: {
      dailyActiveUsers: 89,
      peakHours: '10:00 AM - 2:00 PM',
      avgSessionDuration: 24,
    },
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    loadAnalytics();
  }, [profile, router, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate loading analytics data
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would fetch from your analytics API
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      timeRange,
      generatedAt: new Date().toISOString(),
      analytics,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-2">System performance and usage analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.userGrowth.current}</div>
            <div className="flex items-center mt-1">
              {getChangeIcon(analytics.userGrowth.change)}
              <span className={`text-sm ml-1 ${getChangeColor(analytics.userGrowth.change)}`}>
                {analytics.userGrowth.change > 0 ? '+' : ''}{analytics.userGrowth.change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Appointment Completion Rate
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.appointmentStats.completionRate}%</div>
            <div className="text-sm text-gray-500 mt-1">
              {analytics.appointmentStats.completed} of {analytics.appointmentStats.total} completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Response Time
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.messageStats.avgResponseTime}m</div>
            <div className="text-sm text-gray-500 mt-1">
              {analytics.messageStats.activeConversations} active conversations
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Daily Active Users
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.systemUsage.dailyActiveUsers}</div>
            <div className="text-sm text-gray-500 mt-1">
              Peak: {analytics.systemUsage.peakHours}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              User Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-sm text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-600" />
              Appointment Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <span className="font-semibold">{analytics.appointmentStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{analytics.appointmentStats.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-semibold text-red-600">{analytics.appointmentStats.cancelled}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">No-shows</span>
                <span className="font-semibold text-yellow-600">
                  {analytics.appointmentStats.total - analytics.appointmentStats.completed - analytics.appointmentStats.cancelled}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Completion Rate</span>
                  <span>{analytics.appointmentStats.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${analytics.appointmentStats.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-purple-600" />
              Communication Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Messages</span>
                <span className="font-semibold">{analytics.messageStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Conversations</span>
                <span className="font-semibold">{analytics.messageStats.activeConversations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="font-semibold">{analytics.messageStats.avgResponseTime} minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Messages per Conversation</span>
                <span className="font-semibold">
                  {Math.round(analytics.messageStats.total / analytics.messageStats.activeConversations)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-orange-600" />
              System Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Active Users</span>
                <span className="font-semibold">{analytics.systemUsage.dailyActiveUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Hours</span>
                <span className="font-semibold">{analytics.systemUsage.peakHours}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Session Duration</span>
                <span className="font-semibold">{analytics.systemUsage.avgSessionDuration} minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Retention Rate</span>
                <span className="font-semibold text-green-600">84%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="mr-2 h-5 w-5 text-gray-600" />
            Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 mb-2 text-blue-600" />
              <span>User Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="h-6 w-6 mb-2 text-green-600" />
              <span>Appointment Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <MessageSquare className="h-6 w-6 mb-2 text-purple-600" />
              <span>Communication Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Activity className="h-6 w-6 mb-2 text-orange-600" />
              <span>System Usage Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="h-6 w-6 mb-2 text-red-600" />
              <span>Performance Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <TrendingUp className="h-6 w-6 mb-2 text-indigo-600" />
              <span>Growth Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}