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
  Truck,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Edit,
  Trash2,
  Package,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: 'medical-supplies' | 'pharmaceuticals' | 'equipment' | 'office-supplies' | 'services' | 'other';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  rating: number; // 1-5 stars
  contractStart?: string;
  contractEnd?: string;
  paymentTerms: string;
  deliveryTime: string; // e.g., "2-3 business days"
  minimumOrder?: number;
  notes?: string;
  productsSupplied: string[];
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
}

export default function SuppliersPage() {
  const { profile } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: 'medical-supplies' as const,
    paymentTerms: '',
    deliveryTime: '',
    notes: '',
  });

  useEffect(() => {
    loadSuppliers();
  }, [profile]);

  const loadSuppliers = async () => {
    try {
      // Mock data
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'MedSupply Pro',
          contactPerson: 'John Anderson',
          email: 'john@medsupplypro.com',
          phone: '+1-555-0301',
          address: '123 Medical Drive, Healthcare City, HC 12345',
          category: 'medical-supplies',
          status: 'active',
          rating: 4.8,
          contractStart: '2023-01-01',
          contractEnd: '2024-12-31',
          paymentTerms: 'Net 30',
          deliveryTime: '2-3 business days',
          minimumOrder: 500,
          notes: 'Reliable supplier with excellent customer service',
          productsSupplied: ['Syringes', 'Bandages', 'Gloves', 'Masks'],
          lastOrderDate: '2024-01-10',
          totalOrders: 45,
          totalSpent: 25000,
        },
        {
          id: '2',
          name: 'PharmaCorp Solutions',
          contactPerson: 'Sarah Mitchell',
          email: 'sarah@pharmacorp.com',
          phone: '+1-555-0302',
          address: '456 Pharma Boulevard, Medicine Town, MT 67890',
          category: 'pharmaceuticals',
          status: 'active',
          rating: 4.5,
          contractStart: '2023-06-01',
          contractEnd: '2025-05-31',
          paymentTerms: 'Net 15',
          deliveryTime: '1-2 business days',
          minimumOrder: 1000,
          notes: 'Specialized in prescription medications',
          productsSupplied: ['Antibiotics', 'Pain Relievers', 'Insulin', 'Blood Pressure Medications'],
          lastOrderDate: '2024-01-12',
          totalOrders: 32,
          totalSpent: 45000,
        },
        {
          id: '3',
          name: 'TechMed Equipment',
          contactPerson: 'Robert Chen',
          email: 'robert@techmed.com',
          phone: '+1-555-0303',
          address: '789 Technology Park, Innovation City, IC 54321',
          category: 'equipment',
          status: 'active',
          rating: 4.2,
          contractStart: '2023-03-15',
          contractEnd: '2024-03-14',
          paymentTerms: 'Net 45',
          deliveryTime: '5-7 business days',
          minimumOrder: 2000,
          notes: 'High-quality medical equipment and maintenance services',
          productsSupplied: ['X-Ray Machines', 'Ultrasound Equipment', 'Patient Monitors'],
          lastOrderDate: '2023-12-20',
          totalOrders: 8,
          totalSpent: 120000,
        },
        {
          id: '4',
          name: 'Office Plus Supplies',
          contactPerson: 'Lisa Rodriguez',
          email: 'lisa@officeplus.com',
          phone: '+1-555-0304',
          address: '321 Business Street, Commerce City, CC 98765',
          category: 'office-supplies',
          status: 'active',
          rating: 4.0,
          paymentTerms: 'Net 30',
          deliveryTime: '3-5 business days',
          minimumOrder: 100,
          notes: 'General office supplies and stationery',
          productsSupplied: ['Paper', 'Pens', 'Folders', 'Printer Cartridges'],
          lastOrderDate: '2024-01-08',
          totalOrders: 28,
          totalSpent: 8500,
        },
        {
          id: '5',
          name: 'CleanCare Services',
          contactPerson: 'Michael Thompson',
          email: 'michael@cleancare.com',
          phone: '+1-555-0305',
          address: '654 Service Avenue, Maintenance City, MC 13579',
          category: 'services',
          status: 'pending',
          rating: 0,
          paymentTerms: 'Net 30',
          deliveryTime: 'On-demand',
          notes: 'Cleaning and maintenance services - pending contract approval',
          productsSupplied: ['Cleaning Services', 'Maintenance', 'Waste Management'],
          totalOrders: 0,
          totalSpent: 0,
        },
      ];

      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async () => {
    if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.email) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      const supplier: Supplier = {
        id: Date.now().toString(),
        name: newSupplier.name,
        contactPerson: newSupplier.contactPerson,
        email: newSupplier.email,
        phone: newSupplier.phone,
        address: newSupplier.address,
        category: newSupplier.category,
        status: 'pending',
        rating: 0,
        paymentTerms: newSupplier.paymentTerms,
        deliveryTime: newSupplier.deliveryTime,
        notes: newSupplier.notes,
        productsSupplied: [],
        totalOrders: 0,
        totalSpent: 0,
      };

      setSuppliers(prev => [supplier, ...prev]);
      setIsCreateDialogOpen(false);
      setNewSupplier({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        category: 'medical-supplies',
        paymentTerms: '',
        deliveryTime: '',
        notes: '',
      });
      toast.success('Supplier added successfully');
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast.error('Failed to add supplier');
    }
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId));
    toast.success('Supplier deleted');
  };

  const getStatusBadge = (status: Supplier['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      suspended: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
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

  const getCategoryBadge = (category: Supplier['category']) => {
    const categoryConfig = {
      'medical-supplies': { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'pharmaceuticals': { color: 'bg-green-100 text-green-800 border-green-200' },
      'equipment': { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      'office-supplies': { color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'services': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      'other': { color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border`}>
        {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-slate-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
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
            Supplier Management
          </h1>
          <p className="text-slate-600">Manage vendor relationships and procurement</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter supplier information to add to your vendor database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="MedSupply Pro"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={newSupplier.contactPerson}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                  placeholder="John Anderson"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  placeholder="john@medsupplypro.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  placeholder="+1-555-0123"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  placeholder="123 Business Street, City, State 12345"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newSupplier.category} onValueChange={(value: any) => setNewSupplier({ ...newSupplier, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical-supplies">Medical Supplies</SelectItem>
                    <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="office-supplies">Office Supplies</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={newSupplier.paymentTerms}
                  onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: e.target.value })}
                  placeholder="Net 30"
                />
              </div>
              <div>
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <Input
                  id="deliveryTime"
                  value={newSupplier.deliveryTime}
                  onChange={(e) => setNewSupplier({ ...newSupplier, deliveryTime: e.target.value })}
                  placeholder="2-3 business days"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newSupplier.notes}
                  onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                  placeholder="Additional notes about the supplier..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSupplier}>Add Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Suppliers', value: suppliers.length.toString(), color: 'from-blue-500 to-pink-500', icon: Truck },
          { title: 'Active Suppliers', value: suppliers.filter(s => s.status === 'active').length.toString(), color: 'from-blue-500 to-green-500', icon: CheckCircle },
          { title: 'Total Spent', value: `$${suppliers.reduce((sum, s) => sum + s.totalSpent, 0).toLocaleString()}`, color: 'from-blue-500 to-pink-500', icon: DollarSign },
          { title: 'Total Orders', value: suppliers.reduce((sum, s) => sum + s.totalOrders, 0).toString(), color: 'from-blue-500 to-pink-500', icon: Package },
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

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search suppliers by name, contact person, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 glass-input"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="medical-supplies">Medical Supplies</SelectItem>
                <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="office-supplies">Office Supplies</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full">
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Truck className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No suppliers found</h3>
                  <p className="text-slate-500">Try adjusting your filters or add a new supplier.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="glass-card group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">{supplier.name}</h3>
                      {getStatusBadge(supplier.status)}
                      {getCategoryBadge(supplier.category)}
                    </div>
                    <p className="text-slate-600 mb-2">Contact: {supplier.contactPerson}</p>
                    {supplier.rating > 0 && renderStars(supplier.rating)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      className="text-red-600 hover:text-red-700 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{supplier.email}</span>
                  </div>
                  {supplier.phone && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="h-4 w-4 mr-2 text-pink-500" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{supplier.address}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="h-4 w-4 mr-2 text-pink-500" />
                    <span>Delivery: {supplier.deliveryTime}</span>
                  </div>
                </div>

                {supplier.productsSupplied.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-slate-900 mb-2">Products/Services:</h4>
                    <div className="flex flex-wrap gap-1">
                      {supplier.productsSupplied.slice(0, 3).map((product, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800 border border-blue-200">
                          {product}
                        </Badge>
                      ))}
                      {supplier.productsSupplied.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                          +{supplier.productsSupplied.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-4 border border-blue-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Total Orders:</span>
                      <p className="font-medium text-slate-900">{supplier.totalOrders}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Total Spent:</span>
                      <p className="font-medium text-slate-900">${supplier.totalSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Payment Terms:</span>
                      <p className="font-medium text-slate-900">{supplier.paymentTerms}</p>
                    </div>
                    {supplier.lastOrderDate && (
                      <div>
                        <span className="text-slate-600">Last Order:</span>
                        <p className="font-medium text-slate-900">{new Date(supplier.lastOrderDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {supplier.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                    <p className="text-sm text-blue-800">{supplier.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                    <Package className="h-4 w-4 mr-1" />
                    View Orders
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-200 hover:bg-slate-50 rounded-xl">
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}