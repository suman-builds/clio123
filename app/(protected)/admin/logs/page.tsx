'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Search,
  Download,
  RefreshCw,
  Filter,
  Clock,
  Server,
  Database,
  Globe,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  source: 'application' | 'database' | 'server' | 'security';
  message: string;
  details?: string;
  userId?: string;
  ipAddress?: string;
}

export default function AdminLogsPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-15 17:45:23',
      level: 'info',
      source: 'application',
      message: 'User login successful',
      details: 'User admin@clinic.com logged in successfully',
      userId: 'admin@clinic.com',
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      timestamp: '2024-01-15 17:44:15',
      level: 'warning',
      source: 'security',
      message: 'Multiple failed login attempts detected',
      details: 'IP address 203.0.113.45 attempted to login 5 times with invalid credentials',
      ipAddress: '203.0.113.45',
    },
    {
      id: '3',
      timestamp: '2024-01-15 17:43:02',
      level: 'error',
      source: 'database',
      message: 'Database connection timeout',
      details: 'Connection to primary database timed out after 30 seconds',
    },
    {
      id: '4',
      timestamp: '2024-01-15 17:42:18',
      level: 'info',
      source: 'application',
      message: 'Appointment created',
      details: 'New appointment scheduled for patient ID: p123',
      userId: 'doctor@clinic.com',
      ipAddress: '192.168.1.102',
    },
    {
      id: '5',
      timestamp: '2024-01-15 17:41:45',
      level: 'debug',
      source: 'server',
      message: 'Cache cleared',
      details: 'Application cache cleared successfully',
    },
    {
      id: '6',
      timestamp: '2024-01-15 17:40:33',
      level: 'warning',
      source: 'application',
      message: 'High memory usage detected',
      details: 'Memory usage reached 85% of available capacity',
    },
    {
      id: '7',
      timestamp: '2024-01-15 17:39:21',
      level: 'error',
      source: 'application',
      message: 'Failed to send email notification',
      details: 'SMTP server connection failed for appointment reminder',
    },
    {
      id: '8',
      timestamp: '2024-01-15 17:38:07',
      level: 'info',
      source: 'security',
      message: 'Password changed',
      details: 'User doctor@clinic.com changed password successfully',
      userId: 'doctor@clinic.com',
      ipAddress: '192.168.1.102',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [profile, router]);

  const handleRefreshLogs = async () => {
    setLoading(true);
    try {
      // Simulate refreshing logs
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Logs refreshed');
    } catch (error) {
      console.error('Error refreshing logs:', error);
      toast.error('Failed to refresh logs');
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = () => {
    const filteredLogs = getFilteredLogs();
    const data = {
      exportDate: new Date().toISOString(),
      totalEntries: filteredLogs.length,
      filters: { searchTerm, levelFilter, sourceFilter },
      logs: filteredLogs,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Logs exported successfully');
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    const levelConfig = {
      info: { color: 'bg-blue-100 text-blue-800', icon: Info },
      warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      error: { color: 'bg-red-100 text-red-800', icon: XCircle },
      debug: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
    };

    const config = levelConfig[level];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const getSourceIcon = (source: LogEntry['source']) => {
    const sourceIcons = {
      application: Globe,
      database: Database,
      server: Server,
      security: AlertTriangle,
    };

    const Icon = sourceIcons[source];
    return <Icon className="h-4 w-4" />;
  };

  const getFilteredLogs = () => {
    return logs.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.ipAddress?.includes(searchTerm);
      const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
      const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;
      
      return matchesSearch && matchesLevel && matchesSource;
    });
  };

  const filteredLogs = getFilteredLogs();

  const getLogStats = () => {
    const stats = {
      total: logs.length,
      info: logs.filter(log => log.level === 'info').length,
      warning: logs.filter(log => log.level === 'warning').length,
      error: logs.filter(log => log.level === 'error').length,
      debug: logs.filter(log => log.level === 'debug').length,
    };
    return stats;
  };

  const stats = getLogStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-2">Monitor system activity and troubleshoot issues</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleRefreshLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Entries
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Info
            </CardTitle>
            <Info className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
            <p className="text-xs text-gray-500 mt-1">Informational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Warnings
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
            <p className="text-xs text-gray-500 mt-1">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Errors
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.error}</div>
            <p className="text-xs text-gray-500 mt-1">Critical issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Debug
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.debug}</div>
            <p className="text-xs text-gray-500 mt-1">Debug info</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs by message, user, or IP address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-gray-600" />
            Log Entries ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more log entries.</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getSourceIcon(log.source)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">{log.message}</h3>
                          {getLevelBadge(log.level)}
                          <Badge variant="secondary" className="text-xs">
                            {log.source}
                          </Badge>
                        </div>
                        
                        {log.details && (
                          <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{log.timestamp}</span>
                          </div>
                          {log.userId && (
                            <div className="flex items-center">
                              <span>User: {log.userId}</span>
                            </div>
                          )}
                          {log.ipAddress && (
                            <div className="flex items-center">
                              <span>IP: {log.ipAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}