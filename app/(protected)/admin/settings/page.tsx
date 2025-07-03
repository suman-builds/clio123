'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Clock,
  Palette,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SystemSettings {
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

export default function AdminSettingsPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings>({
    clinicName: 'Clinical Communication Portal',
    clinicAddress: '123 Medical Center Dr, Healthcare City, HC 12345',
    clinicPhone: '+1 (555) 123-4567',
    clinicEmail: 'contact@clinic.com',
    timezone: 'America/New_York',
    workingHours: {
      start: '08:00',
      end: '18:00',
    },
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    maintenanceMode: false,
    allowRegistration: true,
    maxFileSize: 5,
    allowedFileTypes: ['pdf', 'jpg', 'png'],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    loadSettings();
  }, [profile, router]);

  const loadSettings = async () => {
    // In a real app, this would load from the database
    // For now, we'll use the default settings
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateWorkingHours = (type: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, [type]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Clinic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input
                    id="clinicName"
                    value={settings.clinicName}
                    onChange={(e) => updateSetting('clinicName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clinicEmail">Clinic Email</Label>
                  <Input
                    id="clinicEmail"
                    type="email"
                    value={settings.clinicEmail}
                    onChange={(e) => updateSetting('clinicEmail', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="clinicAddress">Clinic Address</Label>
                <Textarea
                  id="clinicAddress"
                  value={settings.clinicAddress}
                  onChange={(e) => updateSetting('clinicAddress', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clinicPhone">Phone Number</Label>
                  <Input
                    id="clinicPhone"
                    value={settings.clinicPhone}
                    onChange={(e) => updateSetting('clinicPhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => updateWorkingHours('start', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => updateWorkingHours('end', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                  <p className="text-sm text-gray-500">Automatic appointment reminders</p>
                </div>
                <Switch
                  id="appointmentReminders"
                  checked={settings.appointmentReminders}
                  onCheckedChange={(checked) => updateSetting('appointmentReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowRegistration">Allow User Registration</Label>
                  <p className="text-sm text-gray-500">Allow new users to register accounts</p>
                </div>
                <Switch
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => updateSetting('allowRegistration', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Temporarily disable access for maintenance</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                File Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <Label>Allowed File Types</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['pdf', 'jpg', 'png', 'doc', 'docx', 'txt'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Switch
                        checked={settings.allowedFileTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateSetting('allowedFileTypes', [...settings.allowedFileTypes, type]);
                          } else {
                            updateSetting('allowedFileTypes', settings.allowedFileTypes.filter(t => t !== type));
                          }
                        }}
                      />
                      <Label className="text-sm">{type.toUpperCase()}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Application Version</Label>
                  <p className="text-sm text-gray-600">v1.0.0</p>
                </div>
                <div>
                  <Label>Database Status</Label>
                  <p className="text-sm text-green-600">Connected</p>
                </div>
                <div>
                  <Label>Last Backup</Label>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <div>
                  <Label>Storage Used</Label>
                  <p className="text-sm text-gray-600">2.3 GB / 10 GB</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button variant="outline" className="mr-2">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  System Diagnostics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}