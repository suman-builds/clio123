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
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  Heart,
  Activity,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  status: 'active' | 'inactive';
  tags: string[];
  lastVisit?: string;
  nextAppointment?: string;
  medicalNotes?: string;
  avatar?: string;
}

export default function PatientsPage() {
  const { profile } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    assignedDoctorId: '',
    medicalNotes: '',
  });

  useEffect(() => {
    loadPatients();
  }, [profile]);

  const loadPatients = async () => {
    try {
      // Simulate loading patients data
      const mockPatients: Patient[] = [
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.j@email.com',
          phone: '+1-555-0101',
          dateOfBirth: '1988-05-12',
          gender: 'Female',
          address: '123 Main St, City, State 12345',
          assignedDoctorId: 'd1',
          assignedDoctorName: 'Dr. Smith',
          status: 'active',
          tags: ['diabetes', 'hypertension'],
          lastVisit: '2024-01-15',
          nextAppointment: '2024-02-15',
          medicalNotes: 'Patient has well-controlled diabetes and hypertension.',
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.b@email.com',
          phone: '+1-555-0102',
          dateOfBirth: '1975-09-30',
          gender: 'Male',
          address: '456 Oak Ave, City, State 12345',
          assignedDoctorId: 'd1',
          assignedDoctorName: 'Dr. Smith',
          status: 'active',
          tags: ['cardiology'],
          lastVisit: '2024-01-10',
          nextAppointment: '2024-02-10',
          medicalNotes: 'Regular cardiology follow-up required.',
        },
        {
          id: '3',
          firstName: 'Emma',
          lastName: 'Wilson',
          email: 'emma.w@email.com',
          phone: '+1-555-0103',
          dateOfBirth: '1992-12-18',
          gender: 'Female',
          address: '789 Pine St, City, State 12345',
          assignedDoctorId: 'd1',
          assignedDoctorName: 'Dr. Smith',
          status: 'active',
          tags: ['pregnancy'],
          lastVisit: '2024-01-20',
          nextAppointment: '2024-02-05',
          medicalNotes: 'Prenatal care - second trimester.',
        },
        {
          id: '4',
          firstName: 'David',
          lastName: 'Lee',
          email: 'david.l@email.com',
          phone: '+1-555-0104',
          dateOfBirth: '1965-03-25',
          gender: 'Male',
          address: '321 Elm St, City, State 12345',
          assignedDoctorId: 'd1',
          assignedDoctorName: 'Dr. Smith',
          status: 'inactive',
          tags: ['orthopedics'],
          lastVisit: '2023-12-15',
          medicalNotes: 'Post-surgery recovery completed.',
        },
        {
          id: '5',
          firstName: 'Lisa',
          lastName: 'Anderson',
          email: 'lisa.a@email.com',
          phone: '+1-555-0105',
          dateOfBirth: '1980-07-08',
          gender: 'Female',
          address: '654 Maple Dr, City, State 12345',
          assignedDoctorId: 'd1',
          assignedDoctorName: 'Dr. Smith',
          status: 'active',
          tags: ['dermatology', 'allergies'],
          lastVisit: '2024-01-25',
          nextAppointment: '2024-03-01',
          medicalNotes: 'Seasonal allergies and skin condition monitoring.',
        },
      ];

      setPatients(mockPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async () => {
    if (!newPatient.firstName || !newPatient.lastName) {
      toast.error('Please fill in the required fields (First Name and Last Name)');
      return;
    }

    try {
      const patient: Patient = {
        id: Date.now().toString(),
        firstName: newPatient.firstName,
        lastName: newPatient.lastName,
        email: newPatient.email,
        phone: newPatient.phone,
        dateOfBirth: newPatient.dateOfBirth,
        gender: newPatient.gender,
        address: newPatient.address,
        assignedDoctorId: newPatient.assignedDoctorId || 'd1',
        assignedDoctorName: 'Dr. Smith',
        status: 'active',
        tags: [],
        medicalNotes: newPatient.medicalNotes,
      };

      setPatients(prev => [patient, ...prev]);
      setIsCreateDialogOpen(false);
      setNewPatient({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        assignedDoctorId: '',
        medicalNotes: '',
      });
      toast.success('Patient added successfully');
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to add patient');
    }
  };

  const handleUpdateStatus = (patientId: string, newStatus: Patient['status']) => {
    setPatients(prev =>
      prev.map(patient =>
        patient.id === patientId ? { ...patient, status: newStatus } : patient
      )
    );
    toast.success('Patient status updated');
  };

  const handleDeletePatient = (patientId: string) => {
    if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) return;
    
    setPatients(prev => prev.filter(patient => patient.id !== patientId));
    toast.success('Patient deleted');
  };

  const getStatusBadge = (status: Patient['status']) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">
        <Activity className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">
        <User className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesDoctor = doctorFilter === 'all' || patient.assignedDoctorId === doctorFilter;
    
    return matchesSearch && matchesStatus && matchesDoctor;
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
              <div className="bg-gray-200 rounded h-48"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-2">Manage patient records and information</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Enter patient information to create a new record.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newPatient.firstName}
                  onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newPatient.lastName}
                  onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  placeholder="john@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  placeholder="+1-555-0123"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={newPatient.dateOfBirth}
                  onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={newPatient.gender} onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="medicalNotes">Medical Notes</Label>
                <Textarea
                  id="medicalNotes"
                  value={newPatient.medicalNotes}
                  onChange={(e) => setNewPatient({ ...newPatient, medicalNotes: e.target.value })}
                  placeholder="Any relevant medical information..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePatient}>Add Patient</Button>
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
                  placeholder="Search patients by name, email, or phone..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                <SelectItem value="d1">Dr. Smith</SelectItem>
                <SelectItem value="d2">Dr. Johnson</SelectItem>
                <SelectItem value="d3">Dr. Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                  <p className="text-gray-500">Try adjusting your filters or add a new patient.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-pink-500 text-white">
                        {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(patient.status)}
                        {patient.dateOfBirth && (
                          <span className="text-sm text-gray-500">
                            Age {calculateAge(patient.dateOfBirth)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {patient.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{patient.email}</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  {patient.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{patient.address}</span>
                    </div>
                  )}
                  {patient.assignedDoctorName && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>Assigned to {patient.assignedDoctorName}</span>
                    </div>
                  )}
                </div>

                {patient.tags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {patient.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {patient.medicalNotes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-sm text-blue-800">{patient.medicalNotes}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {patient.lastVisit && (
                      <div>
                        <span className="text-gray-500">Last Visit:</span>
                        <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                      </div>
                    )}
                    {patient.nextAppointment && (
                      <div>
                        <span className="text-gray-500">Next Appointment:</span>
                        <p className="font-medium">{new Date(patient.nextAppointment).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Records
                  </Button>
                  {patient.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(patient.id, 'inactive')}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(patient.id, 'active')}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}