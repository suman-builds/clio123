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
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Truck,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'medical-supplies' | 'pharmaceuticals' | 'equipment' | 'office-supplies' | 'consumables' | 'other';
  description: string;
  supplier: string;
  supplierId: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string; // e.g., 'pieces', 'boxes', 'bottles'
  status: 'active' | 'discontinued' | 'out-of-stock' | 'low-stock';
  lastOrderDate?: string;
  lastOrderQuantity?: number;
  expiryDate?: string;
  batchNumber?: string;
  location: string; // storage location
  notes?: string;
}

export default function ProductsPage() {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'medical-supplies' as const,
    description: '',
    supplier: '',
    unitPrice: '',
    currentStock: '',
    minimumStock: '',
    maximumStock: '',
    unit: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    loadProducts();
  }, [profile]);

  const loadProducts = async () => {
    try {
      // Mock data
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Disposable Syringes 10ml',
          sku: 'SYR-10ML-001',
          category: 'medical-supplies',
          description: 'Sterile disposable syringes with Luer lock, 10ml capacity',
          supplier: 'MedSupply Pro',
          supplierId: '1',
          unitPrice: 0.85,
          currentStock: 2500,
          minimumStock: 500,
          maximumStock: 5000,
          unit: 'pieces',
          status: 'active',
          lastOrderDate: '2024-01-10',
          lastOrderQuantity: 1000,
          location: 'Storage Room A, Shelf 3',
          notes: 'High-demand item, monitor stock levels closely',
        },
        {
          id: '2',
          name: 'Ibuprofen 200mg Tablets',
          sku: 'IBU-200-001',
          category: 'pharmaceuticals',
          description: 'Pain relief medication, 200mg tablets, bottle of 100',
          supplier: 'PharmaCorp Solutions',
          supplierId: '2',
          unitPrice: 12.50,
          currentStock: 150,
          minimumStock: 50,
          maximumStock: 300,
          unit: 'bottles',
          status: 'low-stock',
          lastOrderDate: '2024-01-05',
          lastOrderQuantity: 100,
          expiryDate: '2025-12-31',
          batchNumber: 'IBU2024001',
          location: 'Pharmacy, Cabinet B',
          notes: 'Check expiry dates regularly',
        },
        {
          id: '3',
          name: 'Digital Blood Pressure Monitor',
          sku: 'BPM-DIG-001',
          category: 'equipment',
          description: 'Automatic digital blood pressure monitor with large display',
          supplier: 'TechMed Equipment',
          supplierId: '3',
          unitPrice: 89.99,
          currentStock: 12,
          minimumStock: 5,
          maximumStock: 25,
          unit: 'units',
          status: 'active',
          lastOrderDate: '2023-12-15',
          lastOrderQuantity: 10,
          location: 'Equipment Room, Shelf 1',
          notes: 'Requires calibration every 6 months',
        },
        {
          id: '4',
          name: 'Latex Examination Gloves',
          sku: 'GLV-LAT-001',
          category: 'medical-supplies',
          description: 'Powder-free latex examination gloves, size M, box of 100',
          supplier: 'MedSupply Pro',
          supplierId: '1',
          unitPrice: 8.75,
          currentStock: 0,
          minimumStock: 20,
          maximumStock: 100,
          unit: 'boxes',
          status: 'out-of-stock',
          lastOrderDate: '2023-12-20',
          lastOrderQuantity: 50,
          location: 'Storage Room A, Shelf 1',
          notes: 'URGENT: Reorder immediately',
        },
        {
          id: '5',
          name: 'A4 Copy Paper',
          sku: 'PPR-A4-001',
          category: 'office-supplies',
          description: 'White A4 copy paper, 80gsm, ream of 500 sheets',
          supplier: 'Office Plus Supplies',
          supplierId: '4',
          unitPrice: 4.25,
          currentStock: 45,
          minimumStock: 10,
          maximumStock: 100,
          unit: 'reams',
          status: 'active',
          lastOrderDate: '2024-01-08',
          lastOrderQuantity: 25,
          location: 'Office Storage, Shelf 2',
        },
        {
          id: '6',
          name: 'Alcohol Prep Pads',
          sku: 'ALC-PAD-001',
          category: 'consumables',
          description: '70% isopropyl alcohol prep pads, sterile, box of 200',
          supplier: 'MedSupply Pro',
          supplierId: '1',
          unitPrice: 6.50,
          currentStock: 35,
          minimumStock: 15,
          maximumStock: 75,
          unit: 'boxes',
          status: 'low-stock',
          lastOrderDate: '2024-01-12',
          lastOrderQuantity: 30,
          location: 'Storage Room A, Shelf 2',
        },
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.supplier) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        sku: newProduct.sku,
        category: newProduct.category,
        description: newProduct.description,
        supplier: newProduct.supplier,
        supplierId: '1', // Mock supplier ID
        unitPrice: parseFloat(newProduct.unitPrice) || 0,
        currentStock: parseInt(newProduct.currentStock) || 0,
        minimumStock: parseInt(newProduct.minimumStock) || 0,
        maximumStock: parseInt(newProduct.maximumStock) || 0,
        unit: newProduct.unit,
        status: 'active',
        location: newProduct.location,
        notes: newProduct.notes,
      };

      setProducts(prev => [product, ...prev]);
      setIsCreateDialogOpen(false);
      setNewProduct({
        name: '',
        sku: '',
        category: 'medical-supplies',
        description: '',
        supplier: '',
        unitPrice: '',
        currentStock: '',
        minimumStock: '',
        maximumStock: '',
        unit: '',
        location: '',
        notes: '',
      });
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setProducts(prev => prev.filter(product => product.id !== productId));
    toast.success('Product deleted');
  };

  const getStatusBadge = (status: Product['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      discontinued: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock },
      'out-of-stock': { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
      'low-stock': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const getCategoryBadge = (category: Product['category']) => {
    const categoryConfig = {
      'medical-supplies': { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'pharmaceuticals': { color: 'bg-green-100 text-green-800 border-green-200' },
      'equipment': { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      'office-supplies': { color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'consumables': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      'other': { color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border`}>
        {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const getStockLevel = (product: Product) => {
    if (product.currentStock === 0) return 'out-of-stock';
    if (product.currentStock <= product.minimumStock) return 'low-stock';
    return 'normal';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
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
            Product Catalog
          </h1>
          <p className="text-slate-600">Manage inventory and product information</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter product information to add to your catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Disposable Syringes 10ml"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="SYR-10ML-001"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newProduct.category} onValueChange={(value: any) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical-supplies">Medical Supplies</SelectItem>
                    <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="office-supplies">Office Supplies</SelectItem>
                    <SelectItem value="consumables">Consumables</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  value={newProduct.supplier}
                  onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                  placeholder="MedSupply Pro"
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">Unit Price</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={newProduct.unitPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
                  placeholder="0.85"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  placeholder="pieces, boxes, bottles"
                />
              </div>
              <div>
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={newProduct.currentStock}
                  onChange={(e) => setNewProduct({ ...newProduct, currentStock: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="minimumStock">Minimum Stock</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  value={newProduct.minimumStock}
                  onChange={(e) => setNewProduct({ ...newProduct, minimumStock: e.target.value })}
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="maximumStock">Maximum Stock</Label>
                <Input
                  id="maximumStock"
                  type="number"
                  value={newProduct.maximumStock}
                  onChange={(e) => setNewProduct({ ...newProduct, maximumStock: e.target.value })}
                  placeholder="500"
                />
              </div>
              <div>
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                  placeholder="Storage Room A, Shelf 1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newProduct.notes}
                  onChange={(e) => setNewProduct({ ...newProduct, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Products', value: products.length.toString(), color: 'from-blue-500 to-pink-500', icon: Package },
          { title: 'Low Stock Items', value: products.filter(p => getStockLevel(p) === 'low-stock').length.toString(), color: 'from-blue-500 to-yellow-500', icon: AlertTriangle },
          { title: 'Out of Stock', value: products.filter(p => p.status === 'out-of-stock').length.toString(), color: 'from-blue-500 to-red-500', icon: AlertTriangle },
          { title: 'Total Value', value: `$${products.reduce((sum, p) => sum + (p.unitPrice * p.currentStock), 0).toLocaleString()}`, color: 'from-blue-500 to-green-500', icon: DollarSign },
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
                  placeholder="Search products by name, SKU, or supplier..."
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
                <SelectItem value="consumables">Consumables</SelectItem>
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
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full">
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Package className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                  <p className="text-slate-500">Try adjusting your filters or add a new product.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="glass-card group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                      {getStatusBadge(product.status)}
                      {getCategoryBadge(product.category)}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">SKU: {product.sku}</p>
                    <p className="text-sm text-slate-600">{product.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{product.supplier}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-pink-500" />
                    <span>${product.unitPrice.toFixed(2)} per {product.unit}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{product.location}</span>
                  </div>
                  {product.lastOrderDate && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-pink-500" />
                      <span>Last order: {new Date(product.lastOrderDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Stock Level Indicator */}
                <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-4 border border-blue-200 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">Stock Level</span>
                    <span className="text-lg font-bold text-blue-600">{product.currentStock} {product.unit}</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 border border-blue-200">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getStockLevel(product) === 'out-of-stock' ? 'bg-red-500' :
                        getStockLevel(product) === 'low-stock' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min((product.currentStock / product.maximumStock) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Min: {product.minimumStock}</span>
                    <span>Max: {product.maximumStock}</span>
                  </div>
                </div>

                {product.expiryDate && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-2xl border border-yellow-200">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        Expires: {new Date(product.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                    {product.batchNumber && (
                      <p className="text-xs text-yellow-700 mt-1">Batch: {product.batchNumber}</p>
                    )}
                  </div>
                )}

                {product.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                    <p className="text-sm text-blue-800">{product.notes}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-200 hover:bg-slate-50 rounded-xl">
                    <Package className="h-4 w-4 mr-1" />
                    Reorder
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