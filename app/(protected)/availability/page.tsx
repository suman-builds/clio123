'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Clock,
  Plus,
  Calendar,
  User,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Coffee,
  Plane,
} from 'lucide-react';
import { toast } from 'sonner';

interface AvailabilitySlot {
  id: string;
  staffId: string;
  staffName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  type: 'regular' | 'overtime' | 'on-call';
  notes?: string;
}

interface TimeOffRequest {
  id: string;
  staffId: string;
  staffName: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  requestedAt: string;
}

export default function AvailabilityPage() {
  const { profile } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTimeOffDialogOpen, setIsTimeOffDialogOpen] = useState(false);

  useEffect(() => {
    loadAvailabilityData();
  }, [profile]);

  const loadAvailabilityData = async () => {
    try {
      // Mock data
      const mockAvailability: AvailabilitySlot[] = [
        {
          id: '1',
          staffId: 'dr1',
          staffName: 'Dr. Sarah Wilson',
          dayOfWeek: 'Monday',
          startTime: '08:00',
          endTime: '17:00',
          isAvailable: true,
          type: 'regular',
        },
        {
          id: '2',
          staffId: 'dr1',
          staffName: 'Dr. Sarah Wilson',
          dayOfWeek: 'Tuesday',
          startTime: '08:00',
          endTime: '17:00',
          isAvailable: true,
          type: 'regular',
        },
        {
          id: '3',
          staffId: 'nurse1',
          staffName: 'Jennifer Rodriguez',
          dayOfWeek: 'Monday',
          startTime: '07:00',
          endTime: '19:00',
          isAvailable: true,
          type: 'regular',
        },
      ];

      const mockTimeOff: TimeOffRequest[] = [
        {
          id: '1',
          staffId: 'dr1',
          staffName: 'Dr. Sarah Wilson',
          startDate: '2024-02-15',
          endDate: '2024-02-20',
          type: 'vacation',
          status: 'pending',
          reason: 'Family vacation',
          requestedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          staffId: 'nurse1',
          staffName: 'Jennifer Rodriguez',
          startDate: '2024-01-25',
          endDate: '2024-01-25',
          type: 'sick',
          status: 'approved',
          reason: 'Medical appointment',
          requestedAt: '2024-01-20T14:30:00Z',
        },
      ];

      setAvailability(mockAvailability);
      setTimeOffRequests(mockTimeOff);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast.error('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: TimeOffRequest['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      denied: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: TimeOffRequest['type']) => {
    const typeConfig = {
      vacation: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Plane },
      sick: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
      personal: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: User },
      emergency: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded-xl w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded-xl w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 rounded-3xl h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Staff Availability
          </h1>
          <p className="text-slate-600">Manage schedules, availability, and time-off requests</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Set Availability
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isTimeOffDialogOpen} onOpenChange={setIsTimeOffDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl">
                <Coffee className="h-4 w-4 mr-2" />
                Request Time Off
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-pink-600/10 border-b border-blue-100">
          <CardTitle className="flex items-center text-slate-800">
            <Calendar className="mr-3 h-6 w-6 text-blue-600" />
            Weekly Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-8 gap-4">
            {/* Header Row */}
            <div className="font-semibold text-slate-700 text-center py-3">Staff</div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="font-semibold text-slate-700 text-center py-3 bg-gradient-to-b from-blue-50 to-pink-50 rounded-xl">
                {day}
              </div>
            ))}
            
            {/* Staff Rows */}
            {['Dr. Sarah Wilson', 'Jennifer Rodriguez', 'Michael Chen'].map(staff => (
              <div key={staff} className="contents">
                <div className="font-medium text-slate-800 py-4 px-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-pink-500 rounded-full mr-3"></div>
                  {staff}
                </div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={`${staff}-${day}`} className="p-3">
                    <div className="bg-gradient-to-br from-blue-100 to-pink-100 border border-blue-200 rounded-xl p-3 text-center hover:shadow-md transition-all duration-300">
                      <div className="text-sm font-medium text-slate-800">8:00 - 17:00</div>
                      <div className="text-xs text-slate-600 mt-1">Available</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Off Requests */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-pink-600/10 border-b border-blue-100">
          <CardTitle className="flex items-center text-slate-800">
            <Coffee className="mr-3 h-6 w-6 text-pink-600" />
            Time Off Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {timeOffRequests.map((request) => (
              <div key={request.id} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">{request.staffName}</h3>
                      {getStatusBadge(request.status)}
                      {getTypeBadge(request.type)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-pink-500" />
                        <span>Requested: {new Date(request.requestedAt).toLocaleDateString()}</span>
                      </div>
                      {request.reason && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{request.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                        <XCircle className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Available Today', value: '12', color: 'from-blue-500 to-green-500', icon: CheckCircle },
          { title: 'On Leave', value: '3', color: 'from-pink-500 to-red-500', icon: Coffee },
          { title: 'Pending Requests', value: '5', color: 'from-blue-500 to-yellow-500', icon: Clock },
          { title: 'Coverage Rate', value: '94%', color: 'from-blue-500 to-pink-500', icon: Calendar },
        ].map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}