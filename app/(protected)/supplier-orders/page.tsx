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
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Edit,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface SupplierOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: 'draft' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  createdBy: string;
}

export default function SupplierOrdersPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadSupplierOrders();
  }, [profile]);

  const loadSupplierOrders = async () => {
    try {
      // Mock data
      const mockOrders: SupplierOrder[] = [
        {
          id: '1',
          orderNumber: 'PO-2024-001',
          supplierId: '1',
          supplierName: 'MedSupply Pro',
          status: 'delivered',
          orderDate: '2024-01-10',
          expectedDelivery: '2024-01-13',
          actualDelivery: '2024-01-12',
          items: [
            {
              productId: '1',
              productName: 'Disposable Syringes 10ml',
              sku: 'SYR-10ML-001',
              quantity: 1000,
              unitPrice: 0.85,
              totalPrice: 850.00,
            },
            {
              productId: '4',
              productName: 'Latex Examination Gloves',
              sku: 'GLV-LAT-001',
              quantity: 50,
              unitPrice: 8.75,
              totalPrice: 437.50,
            },
          ],
          subtotal: 1287.50,
          tax: 103.00,
          shipping: 25.00,
          total: 1415.50,
          notes: 'Urgent order for restocking',
          trackingNumber: 'TRK123456789',
          createdBy: 'Admin User',
        },
        {
          id: '2',
          orderNumber: 'PO-2024-002',
          supplierId: '2',
          supplierName: 'PharmaCorp Solutions',
          status: 'shipped',
          orderDate: '2024-01-12',
          expectedDelivery: '2024-01-15',
          items: [
            {
              productId: '2',
              productName: 'Ibuprofen 200mg Tablets',
              sku: 'IBU-200-001',
              quantity: 100,
              unitPrice: 12.50,
              totalPrice: 1250.00,
            },
          ],
          subtotal: 1250.00,
          tax: 100.00,
          shipping: 15.00,
          total: 1365.00,
          trackingNumber: 'TRK987654321',
          createdBy: 'Dr. Sarah Wilson',
        },
        {
          id: '3',
          orderNumber: 'PO-2024-003',
          supplierId: '3',
          supplierName: 'TechMed Equipment',
          status: 'confirmed',
          orderDate: '2024-01-14',
          expectedDelivery: '2024-01-21',
          items: [
            {
              productId: '3',
              productName: 'Digital Blood Pressure Monitor',
              sku: 'BPM-DIG-001',
              quantity: 5,
              unitPrice: 89.99,
              totalPrice: 449.95,
            },
          ],
          subtotal: 449.95,
          tax: 36.00,
          shipping: 50.00,
          total: 535.95,
          notes: 'Equipment for new examination room',
          createdBy: 'Admin User',
        },
        {
          id: '4',
          orderNumber: 'PO-2024-004',
          supplierId: '4',
          supplierName: 'Office Plus Supplies',
          status: 'pending',
          orderDate: '2024-01-15',
          expectedDelivery: '2024-01-20',
          items: [
            {
              productId: '5',
              productName: 'A4 Copy Paper',
              sku: 'PPR-A4-001',
              quantity: 25,
              unitPrice: 4.25,
              totalPrice: 106.25,
            },
          ],
          subtotal: 106.25,
          tax: 8.50,
          shipping: 10.00,
          total: 124.75,
          createdBy: 'Support Staff',
        },
        {
          id: '5',
          orderNumber: 'PO-2024-005',
          supplierId: '1',
          supplierName: 'MedSupply Pro',
          status: 'draft',
          orderDate: '2024-01-16',
          items: [
            {
              productId: '6',
              productName: 'Alcohol Prep Pads',
              sku: 'ALC-PAD-001',
              quantity: 30,
              unitPrice: 6.50,
              totalPrice: 195.00,
            },
          ],
          subtotal: 195.00,
          tax: 15.60,
          shipping: 12.00,
          total: 222.60,
          notes: 'Draft order - pending approval',
          createdBy: 'Admin User',
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading supplier orders:', error);
      toast.error('Failed to load supplier orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: SupplierOrder['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Edit },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      shipped: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck },
      delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSupplier = supplierFilter === 'all' || order.supplierId === supplierFilter;
    
    return matchesSearch && matchesStatus && matchesSupplier;
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
            Supplier Orders
          </h1>
          <p className="text-slate-600">Manage purchase orders and supplier relationships</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Orders', value: orders.length.toString(), color: 'from-blue-500 to-pink-500', icon: ShoppingCart },
          { title: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length.toString(), color: 'from-blue-500 to-yellow-500', icon: Clock },
          { title: 'In Transit', value: orders.filter(o => o.status === 'shipped').length.toString(), color: 'from-blue-500 to-pink-500', icon: Truck },
          { title: 'Total Value', value: `$${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`, color: 'from-blue-500 to-green-500', icon: DollarSign },
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
                  placeholder="Search orders by number, supplier, or product..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="1">MedSupply Pro</SelectItem>
                <SelectItem value="2">PharmaCorp Solutions</SelectItem>
                <SelectItem value="3">TechMed Equipment</SelectItem>
                <SelectItem value="4">Office Plus Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
                <p className="text-slate-500">Try adjusting your filters or create a new order.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="glass-card">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">{order.orderNumber}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{order.supplierName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                        <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Total: ${order.total.toFixed(2)}</span>
                      </div>
                      {order.expectedDelivery && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-pink-500" />
                          <span>Expected: {new Date(order.expectedDelivery).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {order.trackingNumber && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-800">
                            Tracking: {order.trackingNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                      <Download className="h-4 w-4" />
                    </Button>
                    {order.status === 'draft' && (
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="font-semibold text-slate-900 mb-4">Order Items ({order.items.length})</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-xl p-3 border border-blue-100">
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900">{item.productName}</h5>
                          <p className="text-sm text-slate-600">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">{item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                          <p className="text-sm text-slate-600">${item.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-medium text-slate-900">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax:</span>
                        <span className="font-medium text-slate-900">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Shipping:</span>
                        <span className="font-medium text-slate-900">${order.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span className="font-semibold text-slate-900">Total:</span>
                        <span className="font-bold text-lg text-blue-600">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                    <p className="text-sm text-blue-800">{order.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Created by {order.createdBy}</span>
                  {order.actualDelivery && (
                    <span>Delivered on {new Date(order.actualDelivery).toLocaleDateString()}</span>
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