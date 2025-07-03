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
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  services: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  notes?: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'cash' | 'card' | 'bank-transfer' | 'insurance';
  reference: string;
  processedAt: string;
  processedBy: string;
}

export default function BillingPage() {
  const { profile } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');

  useEffect(() => {
    loadBillingData();
  }, [profile]);

  const loadBillingData = async () => {
    try {
      // Mock data
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          patientId: 'p1',
          patientName: 'John Doe',
          patientEmail: 'john.doe@email.com',
          amount: 250.00,
          status: 'paid',
          dueDate: '2024-01-30',
          issuedDate: '2024-01-15',
          paidDate: '2024-01-20',
          services: [
            { description: 'General Consultation', quantity: 1, unitPrice: 150.00, total: 150.00 },
            { description: 'Blood Test', quantity: 1, unitPrice: 100.00, total: 100.00 },
          ],
          notes: 'Annual checkup and routine blood work',
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          patientId: 'p2',
          patientName: 'Jane Smith',
          patientEmail: 'jane.smith@email.com',
          amount: 180.00,
          status: 'sent',
          dueDate: '2024-02-15',
          issuedDate: '2024-01-16',
          services: [
            { description: 'Follow-up Consultation', quantity: 1, unitPrice: 120.00, total: 120.00 },
            { description: 'Prescription Review', quantity: 1, unitPrice: 60.00, total: 60.00 },
          ],
        },
        {
          id: '3',
          invoiceNumber: 'INV-2024-003',
          patientId: 'p3',
          patientName: 'Robert Johnson',
          patientEmail: 'robert.j@email.com',
          amount: 320.00,
          status: 'overdue',
          dueDate: '2024-01-10',
          issuedDate: '2023-12-26',
          services: [
            { description: 'Specialist Consultation', quantity: 1, unitPrice: 200.00, total: 200.00 },
            { description: 'X-Ray Examination', quantity: 1, unitPrice: 120.00, total: 120.00 },
          ],
          notes: 'Orthopedic consultation and imaging',
        },
        {
          id: '4',
          invoiceNumber: 'INV-2024-004',
          patientId: 'p4',
          patientName: 'Emily Davis',
          patientEmail: 'emily.davis@email.com',
          amount: 95.00,
          status: 'draft',
          dueDate: '2024-02-20',
          issuedDate: '2024-01-17',
          services: [
            { description: 'Routine Checkup', quantity: 1, unitPrice: 95.00, total: 95.00 },
          ],
        },
      ];

      const mockPayments: Payment[] = [
        {
          id: '1',
          invoiceId: '1',
          amount: 250.00,
          method: 'card',
          reference: 'TXN-20240120-001',
          processedAt: '2024-01-20T14:30:00Z',
          processedBy: 'Reception Staff',
        },
        {
          id: '2',
          invoiceId: '5',
          amount: 150.00,
          method: 'insurance',
          reference: 'INS-20240118-002',
          processedAt: '2024-01-18T10:15:00Z',
          processedBy: 'Billing Department',
        },
      ];

      setInvoices(mockInvoices);
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FileText },
      sent: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
      paid: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      overdue: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
      cancelled: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FileText },
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

  const getMethodBadge = (method: Payment['method']) => {
    const methodConfig = {
      cash: { color: 'bg-green-100 text-green-800 border-green-200' },
      card: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'bank-transfer': { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      insurance: { color: 'bg-orange-100 text-orange-800 border-orange-200' },
    };

    const config = methodConfig[method];
    return (
      <Badge className={`${config.color} border`}>
        {method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const getTotalRevenue = () => {
    return invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getOutstandingAmount = () => {
    return invoices
      .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredPayments = payments.filter(payment => {
    const invoice = invoices.find(inv => inv.id === payment.invoiceId);
    const matchesSearch = invoice?.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
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
            Billing & Payments
          </h1>
          <p className="text-slate-600">Manage invoices, payments, and financial records</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: `$${getTotalRevenue().toFixed(2)}`, color: 'from-blue-500 to-green-500', icon: DollarSign },
          { title: 'Outstanding', value: `$${getOutstandingAmount().toFixed(2)}`, color: 'from-blue-500 to-red-500', icon: Clock },
          { title: 'Paid Invoices', value: invoices.filter(i => i.status === 'paid').length.toString(), color: 'from-blue-500 to-pink-500', icon: CheckCircle },
          { title: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length.toString(), color: 'from-blue-500 to-pink-500', icon: AlertTriangle },
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/70 backdrop-blur-xl rounded-2xl p-1 border-0 shadow-lg">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'invoices'
              ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'payments'
              ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Payments
        </button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder={`Search ${activeTab === 'invoices' ? 'invoices' : 'payments'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 glass-input"
                />
              </div>
            </div>
            {activeTab === 'invoices' && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 glass-input">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 'invoices' ? (
        <div className="space-y-4">
          {filteredInvoices.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <CreditCard className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No invoices found</h3>
                  <p className="text-slate-500">Try adjusting your filters or create a new invoice.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{invoice.invoiceNumber}</h3>
                        {getStatusBadge(invoice.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{invoice.patientName}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-pink-500" />
                          <span>${invoice.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-pink-500" />
                          <span>Issued: {new Date(invoice.issuedDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-4 border border-blue-200">
                        <h4 className="font-medium text-slate-900 mb-2">Services:</h4>
                        <div className="space-y-1">
                          {invoice.services.map((service, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-700">{service.description} (x{service.quantity})</span>
                              <span className="font-medium text-slate-900">${service.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {invoice.notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                          <p className="text-sm text-blue-800">{invoice.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <CreditCard className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No payments found</h3>
                  <p className="text-slate-500">No payment records match your search criteria.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => {
              const invoice = invoices.find(inv => inv.id === payment.invoiceId);
              return (
                <Card key={payment.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">{payment.reference}</h3>
                          {getMethodBadge(payment.method)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{invoice?.patientName}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-pink-500" />
                            <span>${payment.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{new Date(payment.processedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-pink-500" />
                            <span>By: {payment.processedBy}</span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-4 border border-blue-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-700">Invoice: {invoice?.invoiceNumber}</span>
                            <span className="font-medium text-green-800">Payment Confirmed</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                          <Eye className="h-4 w-4 mr-1" />
                          View Receipt
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}