'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  MapPin,
  Phone,
  Mail,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  doctor: {
    id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  location: string;
  notes?: string;
}

export default function AppointmentsPage() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '30',
    type: 'consultation' as const,
    location: 'Room 101',
  });

  useEffect(() => {
    loadAppointments();
  }, [profile]);

  const loadAppointments = async () => {
    try {
      // Simulate loading appointments data
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patient: {
            id: 'p1',
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+1-555-0101',
            avatar: '',
          },
          doctor: {
            id: 'd1',
            name: 'Dr. Smith',
            avatar: '',
          },
          title: 'Annual Physical Examination',
          description: 'Routine annual checkup and health screening',
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
          status: 'scheduled',
          type: 'routine',
          location: 'Room 101',
          notes: 'Patient has no known allergies',
        },
        {
          id: '2',
          patient: {
            id: 'p2',
            name: 'Michael Brown',
            email: 'michael.b@email.com',
            phone: '+1-555-0102',
            avatar: '',
          },
          doctor: {
            id: 'd1',
            name: 'Dr. Smith',
            avatar: '',
          },
          title: 'Follow-up Consultation',
          description: 'Follow-up for previous treatment plan',
          startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
          endTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(), // 4.5 hours from now
          status: 'scheduled',
          type: 'follow-up',
          location: 'Room 102',
        },
        {
          id: '3',
          patient: {
            id: 'p3',
            name: 'Emma Wilson',
            email: 'emma.w@email.com',
            phone: '+1-555-0103',
            avatar: '',
          },
          doctor: {
            id: 'd1',
            name: 'Dr. Smith',
            avatar: '',
          },
          title: 'Emergency Consultation',
          description: 'Urgent medical consultation',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          status: 'completed',
          type: 'emergency',
          location: 'Emergency Room',
          notes: 'Patient responded well to treatment',
        },
        {
          id: '4',
          patient: {
            id: 'p4',
            name: 'David Lee',
            email: 'david.l@email.com',
            phone: '+1-555-0104',
            avatar: '',
          },
          doctor: {
            id: 'd1',
            name: 'Dr. Smith',
            avatar: '',
          },
          title: 'Consultation',
          description: 'General health consultation',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // Tomorrow + 45 min
          status: 'scheduled',
          type: 'consultation',
          location: 'Room 103',
        },
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (!newAppointment.patientName || !newAppointment.title || !newAppointment.date || !newAppointment.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const startTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
      const endTime = new Date(startTime.getTime() + parseInt(newAppointment.duration) * 60 * 1000);

      const appointment: Appointment = {
        id: Date.now().toString(),
        patient: {
          id: Date.now().toString(),
          name: newAppointment.patientName,
          email: newAppointment.patientEmail,
          phone: newAppointment.patientPhone,
        },
        doctor: {
          id: profile?.id || '',
          name: profile?.full_name || 'Doctor',
        },
        title: newAppointment.title,
        description: newAppointment.description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: 'scheduled',
        type: newAppointment.type,
        location: newAppointment.location,
      };

      setAppointments(prev => [appointment, ...prev]);
      setIsCreateDialogOpen(false);
      setNewAppointment({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        title: '',
        description: '',
        date: '',
        time: '',
        duration: '30',
        type: 'consultation',
        location: 'Room 101',
      });
      toast.success('Appointment created successfully');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
    }
  };

  const handleUpdateStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
    toast.success('Appointment status updated');
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    toast.success('Appointment deleted');
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
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

  const getTypeBadge = (type: Appointment['type']) => {
    const typeColors = {
      consultation: 'bg-purple-100 text-purple-800',
      'follow-up': 'bg-blue-100 text-blue-800',
      emergency: 'bg-red-100 text-red-800',
      routine: 'bg-green-100 text-green-800',
    };

    return (
      <Badge className={typeColors[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      matchesDate = new Date(appointment.startTime).toDateString() === today;
    } else if (dateFilter === 'upcoming') {
      matchesDate = new Date(appointment.startTime) > new Date();
    } else if (dateFilter === 'past') {
      matchesDate = new Date(appointment.startTime) < new Date();
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage patient appointments and scheduling</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Create a new appointment for a patient.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="patientEmail">Patient Email</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    value={newAppointment.patientEmail}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientEmail: e.target.value })}
                    placeholder="john@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="patientPhone">Patient Phone</Label>
                  <Input
                    id="patientPhone"
                    value={newAppointment.patientPhone}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientPhone: e.target.value })}
                    placeholder="+1-555-0123"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select value={newAppointment.type} onValueChange={(value: any) => setNewAppointment({ ...newAppointment, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Appointment Title *</Label>
                  <Input
                    id="title"
                    value={newAppointment.title}
                    onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                    placeholder="Annual Checkup"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={newAppointment.duration} onValueChange={(value) => setNewAppointment({ ...newAppointment, duration: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newAppointment.location}
                    onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                    placeholder="Room 101"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAppointment.description}
                    onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                    placeholder="Additional notes about the appointment..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAppointment}>Create Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search appointments by patient name or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-500">Try adjusting your filters or create a new appointment.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.startTime);
            const { time: endTime } = formatDateTime(appointment.endTime);
            
            return (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={appointment.patient.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-pink-500 text-white">
                          {appointment.patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.title}</h3>
                          {getStatusBadge(appointment.status)}
                          {getTypeBadge(appointment.type)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span className="font-medium">{appointment.patient.name}</span>
                            </div>
                            {appointment.patient.email && (
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                <span>{appointment.patient.email}</span>
                              </div>
                            )}
                            {appointment.patient.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                <span>{appointment.patient.phone}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{time} - {endTime}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        {appointment.description && (
                          <p className="text-sm text-gray-600 mt-2">{appointment.description}</p>
                        )}
                        
                        {appointment.notes && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(appointment.id, 'in-progress')}
                          >
                            Start
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                          >
                            Complete
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'in-progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}