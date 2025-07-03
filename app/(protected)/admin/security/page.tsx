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
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  User,
  Clock,
  MapPin,
  Smartphone,
  Search,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'permission_change' | 'data_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  description: string;
  ipAddress: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'resolved' | 'investigating' | 'open';
}

interface SecurityMetrics {
  totalEvents: number;
  criticalAlerts: number;
  failedLogins: number;
  activeThreats: number;
  lastScan: string;
  systemStatus: 'secure' | 'warning' | 'critical';
}

export default function AdminSecurityPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      severity: 'low',
      user: 'admin@clinic.com',
      description: 'Successful login from new device',
      ipAddress: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on Windows',
      timestamp: '2024-01-15 14:30:00',
      status: 'resolved',
    },
    {
      id: '2',
      type: 'failed_login',
      severity: 'medium',
      user: 'doctor@clinic.com',
      description: 'Multiple failed login attempts',
      ipAddress: '203.0.113.45',
      location: 'Unknown',
      device: 'Unknown',
      timestamp: '2024-01-15 13:45:00',
      status: 'investigating',
    },
    {
      id: '3',
      type: 'data_access',
      severity: 'high',
      user: 'support@clinic.com',
      description: 'Accessed patient records outside normal hours',
      ipAddress: '192.168.1.105',
      location: 'New York, NY',
      device: 'Firefox on macOS',
      timestamp: '2024-01-15 02:15:00',
      status: 'open',
    },
    {
      id: '4',
      type: 'permission_change',
      severity: 'high',
      user: 'admin@clinic.com',
      description: 'User role changed from support to admin',
      ipAddress: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on Windows',
      timestamp: '2024-01-15 11:20:00',
      status: 'resolved',
    },
    {
      id: '5',
      type: 'password_change',
      severity: 'low',
      user: 'doctor@clinic.com',
      description: 'Password changed successfully',
      ipAddress: '192.168.1.102',
      location: 'New York, NY',
      device: 'Safari on iOS',
      timestamp: '2024-01-15 09:30:00',
      status: 'resolved',
    },
  ]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 127,
    criticalAlerts: 2,
    failedLogins: 8,
    activeThreats: 1,
    lastScan: '2024-01-15 12:00:00',
    systemStatus: 'warning',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [profile, router]);

  const handleRefreshEvents = async () => {
    setLoading(true);
    try {
      // Simulate refreshing security events
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Security events refreshed');
    } catch (error) {
      console.error('Error refreshing events:', error);
      toast.error('Failed to refresh security events');
    } finally {
      setLoading(false);
    }
  };

  const handleRunSecurityScan = async () => {
    setLoading(true);
    try {
      // Simulate security scan
      await new Promise(resolve => setTimeout(resolve, 3000));
      setMetrics(prev => ({
        ...prev,
        lastScan: new Date().toISOString().replace('T', ' ').split('.')[0],
      }));
      toast.success('Security scan completed');
    } catch (error) {
      console.error('Error running security scan:', error);
      toast.error('Failed to run security scan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEventStatus = (eventId: string, newStatus: SecurityEvent['status']) => {
    setSecurityEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );
    toast.success('Event status updated');
  };

  const getSeverityBadge = (severity: SecurityEvent['severity']) => {
    const severityConfig = {
      low: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      high: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
      critical: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = severityConfig[severity];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: SecurityEvent['status']) => {
    const statusConfig = {
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      investigating: { color: 'bg-yellow-100 text-yellow-800', icon: Eye },
      open: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSystemStatusBadge = (status: SecurityMetrics['systemStatus']) => {
    const statusConfig = {
      secure: { color: 'bg-green-100 text-green-800', icon: Shield },
      warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      critical: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getEventTypeIcon = (type: SecurityEvent['type']) => {
    const typeIcons = {
      login: User,
      logout: User,
      failed_login: XCircle,
      password_change: Lock,
      permission_change: Shield,
      data_access: Eye,
    };

    const Icon = typeIcons[type];
    return <Icon className="h-4 w-4" />;
  };

  const filteredEvents = securityEvents.filter(event => {
    const matchesSearch = event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.ipAddress.includes(searchTerm);
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security & Audit</h1>
          <p className="text-gray-600 mt-2">Monitor security events and system audit logs</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleRefreshEvents} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleRunSecurityScan} disabled={loading}>
            <Shield className="h-4 w-4 mr-2" />
            Run Security Scan
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              System Status
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getSystemStatusBadge(metrics.systemStatus)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Last scan: {new Date(metrics.lastScan).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Events
            </CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalEvents}</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Critical Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.criticalAlerts}</div>
            <p className="text-xs text-gray-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Failed Logins
            </CardTitle>
            <XCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.failedLogins}</div>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Threats
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.activeThreats}</div>
            <p className="text-xs text-gray-500 mt-1">Being monitored</p>
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
                  placeholder="Search events by user, description, or IP address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5 text-gray-600" />
            Security Events ({filteredEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more events.</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getEventTypeIcon(event.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">{event.description}</h3>
                          {getSeverityBadge(event.severity)}
                          {getStatusBadge(event.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>{event.user}</span>
                          </div>
                          <div className="flex items-center">
                            <Smartphone className="h-3 w-3 mr-1" />
                            <span>{event.ipAddress}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-1">Device: {event.device}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {event.status === 'open' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateEventStatus(event.id, 'investigating')}
                        >
                          Investigate
                        </Button>
                      )}
                      {event.status === 'investigating' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateEventStatus(event.id, 'resolved')}
                        >
                          Resolve
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-gray-600" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Enable Two-Factor Authentication</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Some users haven't enabled 2FA. Consider enforcing it for all admin accounts.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded border border-blue-200">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Regular Security Audits</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Schedule monthly security audits to review access logs and permissions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Password Policy Compliance</h4>
                <p className="text-sm text-green-700 mt-1">
                  All users are following the strong password policy. Good job!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}