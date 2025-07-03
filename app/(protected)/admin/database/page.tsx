'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Database,
  Server,
  HardDrive,
  Activity,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface DatabaseStats {
  status: 'healthy' | 'warning' | 'critical';
  totalSize: string;
  usedSpace: string;
  freeSpace: string;
  connections: number;
  maxConnections: number;
  uptime: string;
  lastBackup: string;
  version: string;
}

interface TableInfo {
  name: string;
  rows: number;
  size: string;
  lastModified: string;
  status: 'healthy' | 'warning';
}

export default function AdminDatabasePage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    status: 'healthy',
    totalSize: '2.4 GB',
    usedSpace: '1.8 GB',
    freeSpace: '600 MB',
    connections: 12,
    maxConnections: 100,
    uptime: '15 days, 8 hours',
    lastBackup: '2024-01-15 03:00:00',
    version: 'PostgreSQL 15.4',
  });
  const [tables, setTables] = useState<TableInfo[]>([
    {
      name: 'profiles',
      rows: 125,
      size: '45 MB',
      lastModified: '2024-01-15 14:30:00',
      status: 'healthy',
    },
    {
      name: 'patients',
      rows: 342,
      size: '128 MB',
      lastModified: '2024-01-15 16:45:00',
      status: 'healthy',
    },
    {
      name: 'appointments',
      rows: 1247,
      size: '89 MB',
      lastModified: '2024-01-15 17:20:00',
      status: 'healthy',
    },
    {
      name: 'messages',
      rows: 5632,
      size: '234 MB',
      lastModified: '2024-01-15 17:55:00',
      status: 'healthy',
    },
    {
      name: 'conversations',
      rows: 89,
      size: '12 MB',
      lastModified: '2024-01-15 16:10:00',
      status: 'healthy',
    },
    {
      name: 'patient_files',
      rows: 456,
      size: '1.2 GB',
      lastModified: '2024-01-15 15:30:00',
      status: 'warning',
    },
    {
      name: 'medical_notes',
      rows: 789,
      size: '67 MB',
      lastModified: '2024-01-15 14:15:00',
      status: 'healthy',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(false);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    checkDatabaseConnection();
  }, [profile, router]);

  const checkDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').single();
      if (error) {
        console.error('Database connection error:', error);
        setDatabaseConnected(false);
        toast.error('Failed to connect to database');
      } else {
        setDatabaseConnected(true);
        toast.success('Connected to Supabase database');
      }
    } catch (error) {
      console.error('Error checking database connection:', error);
      setDatabaseConnected(false);
    }
  };

  const handleRefreshStats = async () => {
    setLoading(true);
    try {
      // Simulate refreshing database stats
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Database statistics refreshed');
    } catch (error) {
      console.error('Error refreshing stats:', error);
      toast.error('Failed to refresh statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    setLoading(true);
    try {
      // Simulate database backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      setDbStats(prev => ({
        ...prev,
        lastBackup: new Date().toISOString().replace('T', ' ').split('.')[0],
      }));
      toast.success('Database backup completed successfully');
    } catch (error) {
      console.error('Error backing up database:', error);
      toast.error('Failed to backup database');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeTable = async (tableName: string) => {
    setLoading(true);
    try {
      // Simulate table optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Table ${tableName} optimized successfully`);
    } catch (error) {
      console.error('Error optimizing table:', error);
      toast.error(`Failed to optimize table ${tableName}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'critical') => {
    const statusConfig = {
      healthy: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      critical: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
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

  const calculateUsagePercentage = () => {
    const used = parseFloat(dbStats.usedSpace.replace(' GB', ''));
    const total = parseFloat(dbStats.totalSize.replace(' GB', ''));
    return Math.round((used / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage database performance and health</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleRefreshStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleBackupDatabase} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Backup Now
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-pink-50 border border-blue-100">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${databaseConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                <Database className={`h-6 w-6 ${databaseConnected ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Supabase Connection</h3>
                <p className="text-sm text-gray-600">
                  {databaseConnected 
                    ? 'Successfully connected to Supabase database' 
                    : 'Not connected to Supabase database'}
                </p>
              </div>
            </div>
            <Button 
              onClick={checkDatabaseConnection} 
              variant={databaseConnected ? "outline" : "default"}
              className={databaseConnected ? "border-green-200 text-green-700" : ""}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {databaseConnected ? 'Check Connection' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Database Status
            </CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusBadge(dbStats.status)}
            </div>
            <p className="text-xs text-gray-500 mt-1">{dbStats.version}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Storage Usage
            </CardTitle>
            <HardDrive className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{calculateUsagePercentage()}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {dbStats.usedSpace} of {dbStats.totalSize} used
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${calculateUsagePercentage()}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Connections
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{dbStats.connections}</div>
            <p className="text-xs text-gray-500 mt-1">
              of {dbStats.maxConnections} max connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Uptime
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-900">{dbStats.uptime}</div>
            <p className="text-xs text-gray-500 mt-1">
              Last backup: {new Date(dbStats.lastBackup).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Database Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5 text-gray-600" />
            Database Tables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Table Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rows</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Modified</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{table.name}</td>
                    <td className="py-3 px-4 text-gray-600">{table.rows.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">{table.size}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(table.lastModified).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(table.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOptimizeTable(table.name)}
                          disabled={loading}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Database Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5 text-gray-600" />
              Maintenance Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start" disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Analyze Database
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}>
                <Settings className="h-4 w-4 mr-2" />
                Optimize All Tables
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clean Up Logs
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={loading}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Check Integrity
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5 text-gray-600" />
              Backup & Restore
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Last Backup</p>
                    <p className="text-sm text-blue-700">{dbStats.lastBackup}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              
              <Button 
                onClick={handleBackupDatabase} 
                disabled={loading}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
              
              <Button variant="outline" className="w-full" disabled={loading}>
                <Upload className="h-4 w-4 mr-2" />
                Restore from Backup
              </Button>
              
              <Button variant="outline" className="w-full" disabled={loading}>
                <Settings className="h-4 w-4 mr-2" />
                Schedule Automatic Backups
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-gray-600" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <p className="text-sm text-gray-500">Query Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">45ms</div>
              <p className="text-sm text-gray-500">Avg Query Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1,247</div>
              <p className="text-sm text-gray-500">Queries/Hour</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}