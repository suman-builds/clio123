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
  Clock,
  Shield,
  UserCheck,
  UserX,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  qualifications?: string[];
  schedule?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export default function StaffPage() {
  const { profile } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'support',
    department: 'general',
    position: '',
    hireDate: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });

  useEffect(() => {
    loadStaff();
  }, [profile]);

  const loadStaff = async () => {
    try {
      // Simulate loading staff data
      const mockStaff: StaffMember[] = [
        {
          id: '1',
          firstName: 'Dr. Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@clinic.com',
          phone: '+1-555-0201',
          role: 'doctor',
          department: 'cardiology',
          position: 'Senior Cardiologist',
          hireDate: '2020-03-15',
          status: 'active',
          avatar: '',
          address: '123 Medical Dr, City, State 12345',
          emergencyContact: {
            name: 'John Wilson',
            phone: '+1-555-0301',
            relationship: 'Spouse',
          },
          qualifications: ['MD', 'Board Certified Cardiologist', 'Fellowship in Interventional Cardiology'],
          schedule: {
            monday: '8:00 AM - 6:00 PM',
            tuesday: '8:00 AM - 6:00 PM',
            wednesday: '8:00 AM - 6:00 PM',
            thursday: '8:00 AM - 6:00 PM',
            friday: '8:00 AM - 4:00 PM',
            saturday: 'Off',
            sunday: 'Off',
          },
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@clinic.com',
          phone: '+1-555-0202',
          role: 'doctor',
          department: 'emergency',
          position: 'Emergency Medicine Physician',
          hireDate: '2019-08-20',
          status: 'active',
          avatar: '',
          address: '456 Health Ave, City, State 12345',
          emergencyContact: {
            name: 'Lisa Chen',
            phone: '+1-555-0302',
            relationship: 'Spouse',
          },
          qualifications: ['MD', 'Board Certified Emergency Medicine', 'ACLS Certified'],
          schedule: {
            monday: '12:00 PM - 12:00 AM',
            tuesday: 'Off',
            wednesday: '12:00 PM - 12:00 AM',
            thursday: 'Off',
            friday: '12:00 PM - 12:00 AM',
            saturday: '12:00 PM - 12:00 AM',
            sunday: 'Off',
          },
        },
        {
          id: '3',
          firstName: 'Jennifer',
          lastName: 'Rodriguez',
          email: 'jennifer.rodriguez@clinic.com',
          phone: '+1-555-0203',
          role: 'nurse',
          department: 'general',
          position: 'Registered Nurse',
          hireDate: '2021-01-10',
          status: 'active',
          avatar: '',
          address: '789 Care St, City, State 12345',
          emergencyContact: {
            name: 'Maria Rodriguez',
            phone: '+1-555-0303',
            relationship: 'Mother',
          },
          qualifications: ['RN', 'BSN', 'BLS Certified'],
          schedule: {
            monday: '7:00 AM - 7:00 PM',
            tuesday: '7:00 AM - 7:00 PM',
            wednesday: '7:00 AM - 7:00 PM',
            thursday: 'Off',
            friday: 'Off',
            saturday: 'Off',
            sunday: '7:00 AM - 7:00 PM',
          },
        },
        {
          id: '4',
          firstName: 'David',
          lastName: 'Thompson',
          email: 'david.thompson@clinic.com',
          phone: '+1-555-0204',
          role: 'technician',
          department: 'radiology',
          position: 'Radiology Technician',
          hireDate: '2022-05-15',
          status: 'active',
          avatar: '',
          address: '321 Tech Blvd, City, State 12345',
          emergencyContact: {
            name: 'Sarah Thompson',
            phone: '+1-555-0304',
            relationship: 'Sister',
          },
          qualifications: ['RT(R)', 'ARRT Certified', 'CT Certified'],
          schedule: {
            monday: '6:00 AM - 2:00 PM',
            tuesday: '6:00 AM - 2:00 PM',
            wednesday: '6:00 AM - 2:00 PM',
            thursday: '6:00 AM - 2:00 PM',
            friday: '6:00 AM - 2:00 PM',
            saturday: 'Off',
            sunday: 'Off',
          },
        },
        {
          id: '5',
          firstName: 'Amanda',
          lastName: 'Foster',
          email: 'amanda.foster@clinic.com',
          phone: '+1-555-0205',
          role: 'admin',
          department: 'administration',
          position: 'Office Manager',
          hireDate: '2018-11-30',
          status: 'on-leave',
          avatar: '',
          address: '654 Admin Way, City, State 12345',
          emergencyContact: {
            name: 'Robert Foster',
            phone: '+1-555-0305',
            relationship: 'Husband',
          },
          qualifications: ['MBA', 'Healthcare Administration Certificate'],
          schedule: {
            monday: '8:00 AM - 5:00 PM',
            tuesday: '8:00 AM - 5:00 PM',
            wednesday: '8:00 AM - 5:00 PM',
            thursday: '8:00 AM - 5:00 PM',
            friday: '8:00 AM - 5:00 PM',
            saturday: 'Off',
            sunday: 'Off',
          },
        },
      ];

      setStaff(mockStaff);
    } catch (error) {
      console.error('Error loading staff:', error);
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async () => {
    if (!newStaff.firstName || !newStaff.lastName || !newStaff.email) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      const staffMember: StaffMember = {
        id: Date.now().toString(),
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        department: newStaff.department,
        position: newStaff.position,
        hireDate: newStaff.hireDate,
        status: 'active',
        address: newStaff.address,
        emergencyContact: {
          name: newStaff.emergencyContactName,
          phone: newStaff.emergencyContactPhone,
          relationship: newStaff.emergencyContactRelationship,
        },
        qualifications: [],
      };

      setStaff(prev => [staffMember, ...prev]);
      setIsCreateDialogOpen(false);
      setNewStaff({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'support',
        department: 'general',
        position: '',
        hireDate: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
      });
      toast.success('Staff member added successfully');
    } catch (error) {
      console.error('Error creating staff member:', error);
      toast.error('Failed to add staff member');
    }
  };

  const handleUpdateStatus = (staffId: string, newStatus: StaffMember['status']) => {
    setStaff(prev =>
      prev.map(member =>
        member.id === staffId ? { ...member, status: newStatus } : member
      )
    );
    toast.success('Staff status updated');
  };

  const handleDeleteStaff = (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) return;
    
    setStaff(prev => prev.filter(member => member.id !== staffId));
    toast.success('Staff member deleted');
  };

  const getStatusBadge = (status: StaffMember['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: UserCheck },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: UserX },
      'on-leave': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      doctor: 'bg-blue-100 text-blue-800',
      nurse: 'bg-purple-100 text-purple-800',
      technician: 'bg-orange-100 text-orange-800',
      admin: 'bg-red-100 text-red-800',
      support: 'bg-green-100 text-green-800',
    };

    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const filteredStaff = staff.filter(member => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
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
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage staff members, schedules, and information</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Enter staff member information to create a new record.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newStaff.firstName}
                  onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newStaff.lastName}
                  onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="john@clinic.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="+1-555-0123"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newStaff.role} onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="support">Support Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={newStaff.department} onValueChange={(value) => setNewStaff({ ...newStaff, department: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="radiology">Radiology</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={newStaff.position}
                  onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                  placeholder="Senior Nurse"
                />
              </div>
              <div>
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={newStaff.hireDate}
                  onChange={(e) => setNewStaff({ ...newStaff, hireDate: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newStaff.address}
                  onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={newStaff.emergencyContactName}
                  onChange={(e) => setNewStaff({ ...newStaff, emergencyContactName: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  value={newStaff.emergencyContactPhone}
                  onChange={(e) => setNewStaff({ ...newStaff, emergencyContactPhone: e.target.value })}
                  placeholder="+1-555-0456"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateStaff}>Add Staff Member</Button>
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
                  placeholder="Search staff by name, email, or position..."
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
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="radiology">Radiology</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
                  <p className="text-gray-500">Try adjusting your filters or add a new staff member.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredStaff.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(member.status)}
                        {getRoleBadge(member.role)}
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
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{member.department.charAt(0).toUpperCase() + member.department.slice(1)} Department</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Hired: {new Date(member.hireDate).toLocaleDateString()}</span>
                  </div>
                  {member.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{member.address}</span>
                    </div>
                  )}
                </div>

                {member.qualifications && member.qualifications.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center mb-2">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Qualifications</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.qualifications.map((qual, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {member.emergencyContact && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-start">
                      <Shield className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Emergency Contact</p>
                        <p className="text-sm text-blue-800">
                          {member.emergencyContact.name} ({member.emergencyContact.relationship})
                        </p>
                        <p className="text-sm text-blue-800">{member.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Clock className="h-4 w-4 mr-2" />
                    Time Off
                  </Button>
                  {member.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(member.id, 'inactive')}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(member.id, 'active')}
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