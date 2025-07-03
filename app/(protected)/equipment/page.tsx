'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Wrench,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Edit,
  Trash2,
  Activity,
  MapPin,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  category: 'diagnostic' | 'surgical' | 'monitoring' | 'laboratory' | 'imaging' | 'other';
  status: 'operational' | 'maintenance' | 'out-of-service' | 'repair';
  location: string;
  purchaseDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  assignedTo?: string;
  notes?: string;
  warrantyExpiry?: string;
  manufacturer: string;
}

export default function EquipmentPage() {
  const { profile } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    model: '',
    serialNumber: '',
    category: 'diagnostic' as const,
    location: '',
    purchaseDate: '',
    manufacturer: '',
    assignedTo: '',
    notes: '',
  });

  useEffect(() => {
    loadEquipment();
  }, [profile]);

  const loadEquipment = async () => {
    try {
      // Mock data
      const mockEquipment: Equipment[] = [
        {
          id: '1',
          name: 'Digital X-Ray Machine',
          model: 'DR-7500',
          serialNumber: 'XR-2024-001',
          category: 'imaging',
          status: 'operational',
          location: 'Radiology Room A',
          purchaseDate: '2023-06-15',
          lastMaintenance: '2024-01-10',
          nextMaintenance: '2024-04-10',
          assignedTo: 'David Thompson',
          manufacturer: 'MedTech Solutions',
          warrantyExpiry: '2026-06-15',
          notes: 'Regular calibration required monthly',
        },
        {
          id: '2',
          name: 'Patient Monitor',
          model: 'PM-3000',
          serialNumber: 'PM-2024-002',
          category: 'monitoring',
          status: 'maintenance',
          location: 'ICU Room 3',
          purchaseDate: '2023-03-20',
          lastMaintenance: '2024-01-15',
          nextMaintenance: '2024-02-15',
          assignedTo: 'Jennifer Rodriguez',
          manufacturer: 'HealthCare Devices',
          warrantyExpiry: '2025-03-20',
          notes: 'Screen replacement scheduled',
        },
        {
          id: '3',
          name: 'Ultrasound Scanner',
          model: 'US-Pro 2000',
          serialNumber: 'US-2024-003',
          category: 'diagnostic',
          status: 'operational',
          location: 'Examination Room 2',
          purchaseDate: '2023-09-10',
          lastMaintenance: '2024-01-05',
          nextMaintenance: '2024-07-05',
          assignedTo: 'Dr. Sarah Wilson',
          manufacturer: 'UltraSound Inc',
          warrantyExpiry: '2025-09-10',
        },
        {
          id: '4',
          name: 'Surgical Laser',
          model: 'SL-4000',
          serialNumber: 'SL-2024-004',
          category: 'surgical',
          status: 'out-of-service',
          location: 'Operating Room 1',
          purchaseDate: '2022-11-30',
          lastMaintenance: '2023-12-20',
          nextMaintenance: '2024-03-20',
          assignedTo: 'Dr. Michael Chen',
          manufacturer: 'Precision Medical',
          warrantyExpiry: '2024-11-30',
          notes: 'Awaiting replacement parts',
        },
        {
          id: '5',
          name: 'Blood Analyzer',
          model: 'BA-1500',
          serialNumber: 'BA-2024-005',
          category: 'laboratory',
          status: 'operational',
          location: 'Laboratory',
          purchaseDate: '2023-08-05',
          lastMaintenance: '2024-01-12',
          nextMaintenance: '2024-04-12',
          manufacturer: 'Lab Systems Pro',
          warrantyExpiry: '2025-08-05',
          notes: 'Requires daily quality control checks',
        },
      ];

      setEquipment(mockEquipment);
    } catch (error) {
      console.error('Error loading equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEquipment = async () => {
    if (!newEquipment.name || !newEquipment.model || !newEquipment.serialNumber) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      const equipment: Equipment = {
        id: Date.now().toString(),
        name: newEquipment.name,
        model: newEquipment.model,
        serialNumber: newEquipment.serialNumber,
        category: newEquipment.category,
        status: 'operational',
        location: newEquipment.location,
        purchaseDate: newEquipment.purchaseDate,
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedTo: newEquipment.assignedTo,
        manufacturer: newEquipment.manufacturer,
        notes: newEquipment.notes,
      };

      setEquipment(prev => [equipment, ...prev]);
      setIsCreateDialogOpen(false);
      setNewEquipment({
        name: '',
        model: '',
        serialNumber: '',
        category: 'diagnostic',
        location: '',
        purchaseDate: '',
        manufacturer: '',
        assignedTo: '',
        notes: '',
      });
      toast.success('Equipment added successfully');
    } catch (error) {
      console.error('Error creating equipment:', error);
      toast.error('Failed to add equipment');
    }
  };

  const getStatusBadge = (status: Equipment['status']) => {
    const statusConfig = {
      operational: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      maintenance: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      'out-of-service': { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
      repair: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Wrench },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getCategoryBadge = (category: Equipment['category']) => {
    const categoryConfig = {
      diagnostic: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      surgical: { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      monitoring: { color: 'bg-green-100 text-green-800 border-green-200' },
      laboratory: { color: 'bg-orange-100 text-orange-800 border-orange-200' },
      imaging: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      other: { color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    const dueDate = new Date(nextMaintenance);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7;
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
            Equipment Management
          </h1>
          <p className="text-slate-600">Track, maintain, and manage medical equipment inventory</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>
                Enter equipment information to add to inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  placeholder="Digital X-Ray Machine"
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={newEquipment.model}
                  onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                  placeholder="DR-7500"
                />
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  value={newEquipment.serialNumber}
                  onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
                  placeholder="XR-2024-001"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newEquipment.category} onValueChange={(value: any) => setNewEquipment({ ...newEquipment, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diagnostic">Diagnostic</SelectItem>
                    <SelectItem value="surgical">Surgical</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEquipment.location}
                  onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                  placeholder="Radiology Room A"
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={newEquipment.purchaseDate}
                  onChange={(e) => setNewEquipment({ ...newEquipment, purchaseDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={newEquipment.manufacturer}
                  onChange={(e) => setNewEquipment({ ...newEquipment, manufacturer: e.target.value })}
                  placeholder="MedTech Solutions"
                />
              </div>
              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={newEquipment.assignedTo}
                  onChange={(e) => setNewEquipment({ ...newEquipment, assignedTo: e.target.value })}
                  placeholder="Dr. Smith"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEquipment.notes}
                  onChange={(e) => setNewEquipment({ ...newEquipment, notes: e.target.value })}
                  placeholder="Additional notes about the equipment..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEquipment}>Add Equipment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search equipment by name, model, serial number, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 glass-input"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out-of-service">Out of Service</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="diagnostic">Diagnostic</SelectItem>
                <SelectItem value="surgical">Surgical</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="laboratory">Laboratory</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEquipment.length === 0 ? (
          <div className="col-span-full">
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Wrench className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No equipment found</h3>
                  <p className="text-slate-500">Try adjusting your filters or add new equipment.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredEquipment.map((item) => (
            <Card key={item.id} className="glass-card group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">{item.name}</h3>
                      {getStatusBadge(item.status)}
                      {getCategoryBadge(item.category)}
                      {isMaintenanceDue(item.nextMaintenance) && (
                        <Badge className="bg-red-100 text-red-800 border border-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Maintenance Due
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600 mb-2">{item.model} • {item.serialNumber}</p>
                    <p className="text-sm text-slate-500">{item.manufacturer}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 rounded-xl">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{item.location}</span>
                  </div>
                  {item.assignedTo && (
                    <div className="flex items-center text-sm text-slate-600">
                      <User className="h-4 w-4 mr-2 text-pink-500" />
                      <span>Assigned to {item.assignedTo}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Settings className="h-4 w-4 mr-2 text-pink-500" />
                    <span>Last maintenance: {new Date(item.lastMaintenance).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Next maintenance: {new Date(item.nextMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>

                {item.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                    <p className="text-sm text-blue-800">{item.notes}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                    <Activity className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                    <Settings className="h-4 w-4 mr-1" />
                    Maintain
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Equipment', value: '47', color: 'from-blue-500 to-pink-500', icon: Wrench },
          { title: 'Operational', value: '42', color: 'from-blue-500 to-green-500', icon: CheckCircle },
          { title: 'In Maintenance', value: '3', color: 'from-blue-500 to-yellow-500', icon: Clock },
          { title: 'Due for Service', value: '8', color: 'from-blue-500 to-red-500', icon: AlertTriangle },
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