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
  FolderOpen,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  Image,
  File,
  Upload,
  Share,
  Lock,
  Calendar,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'spreadsheet' | 'other';
  category: 'patient-records' | 'policies' | 'forms' | 'reports' | 'training' | 'other';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  isPrivate: boolean;
  tags: string[];
  patientId?: string;
  patientName?: string;
}

export default function DocumentsPage() {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [profile]);

  const loadDocuments = async () => {
    try {
      // Mock data
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Patient Consent Form - John Doe.pdf',
          type: 'pdf',
          category: 'patient-records',
          size: '2.4 MB',
          uploadedBy: 'Dr. Sarah Wilson',
          uploadedAt: '2024-01-15T10:30:00Z',
          lastModified: '2024-01-15T10:30:00Z',
          isPrivate: true,
          tags: ['consent', 'patient-records'],
          patientId: 'p1',
          patientName: 'John Doe',
        },
        {
          id: '2',
          name: 'HIPAA Privacy Policy 2024.pdf',
          type: 'pdf',
          category: 'policies',
          size: '1.8 MB',
          uploadedBy: 'Admin User',
          uploadedAt: '2024-01-10T14:20:00Z',
          lastModified: '2024-01-12T09:15:00Z',
          isPrivate: false,
          tags: ['hipaa', 'privacy', 'policy'],
        },
        {
          id: '3',
          name: 'Lab Results - Jane Smith.jpg',
          type: 'image',
          category: 'patient-records',
          size: '3.2 MB',
          uploadedBy: 'Jennifer Rodriguez',
          uploadedAt: '2024-01-14T16:45:00Z',
          lastModified: '2024-01-14T16:45:00Z',
          isPrivate: true,
          tags: ['lab-results', 'radiology'],
          patientId: 'p2',
          patientName: 'Jane Smith',
        },
        {
          id: '4',
          name: 'Monthly Report - December 2023.xlsx',
          type: 'spreadsheet',
          category: 'reports',
          size: '856 KB',
          uploadedBy: 'Admin User',
          uploadedAt: '2024-01-05T11:30:00Z',
          lastModified: '2024-01-05T11:30:00Z',
          isPrivate: false,
          tags: ['monthly-report', 'statistics'],
        },
        {
          id: '5',
          name: 'Staff Training Manual.pdf',
          type: 'pdf',
          category: 'training',
          size: '5.1 MB',
          uploadedBy: 'HR Department',
          uploadedAt: '2024-01-08T13:20:00Z',
          lastModified: '2024-01-08T13:20:00Z',
          isPrivate: false,
          tags: ['training', 'manual', 'staff'],
        },
      ];

      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: Document['type']) => {
    const typeIcons = {
      pdf: FileText,
      image: Image,
      document: FileText,
      spreadsheet: FileText,
      other: File,
    };
    return typeIcons[type] || File;
  };

  const getTypeBadge = (type: Document['type']) => {
    const typeConfig = {
      pdf: { color: 'bg-red-100 text-red-800 border-red-200' },
      image: { color: 'bg-green-100 text-green-800 border-green-200' },
      document: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      spreadsheet: { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      other: { color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = typeConfig[type];
    return (
      <Badge className={`${config.color} border`}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const getCategoryBadge = (category: Document['category']) => {
    const categoryConfig = {
      'patient-records': { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'policies': { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      'forms': { color: 'bg-green-100 text-green-800 border-green-200' },
      'reports': { color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'training': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      'other': { color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border`}>
        {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
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
            Document Management
          </h1>
          <p className="text-slate-600">Organize, store, and manage all clinical documents</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
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
                  placeholder="Search documents by name, tags, or uploader..."
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
                <SelectItem value="patient-records">Patient Records</SelectItem>
                <SelectItem value="policies">Policies</SelectItem>
                <SelectItem value="forms">Forms</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full">
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No documents found</h3>
                  <p className="text-slate-500">Try adjusting your filters or upload a new document.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredDocuments.map((doc) => {
            const TypeIcon = getTypeIcon(doc.type);
            return (
              <Card key={doc.id} className="glass-card group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-pink-100 rounded-2xl group-hover:from-blue-200 group-hover:to-pink-200 transition-all duration-300">
                        <TypeIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 truncate mb-2">{doc.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getTypeBadge(doc.type)}
                          {getCategoryBadge(doc.category)}
                          {doc.isPrivate && (
                            <Badge className="bg-red-100 text-red-800 border border-red-200">
                              <Lock className="h-3 w-3 mr-1" />
                              Private
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Uploaded by {doc.uploadedBy}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <File className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{doc.size}</span>
                    </div>
                    {doc.patientName && (
                      <div className="flex items-center text-sm text-slate-600">
                        <User className="h-4 w-4 mr-2 text-pink-500" />
                        <span>Patient: {doc.patientName}</span>
                      </div>
                    )}
                  </div>

                  {doc.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700 border border-slate-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Documents', value: '1,247', color: 'from-blue-500 to-pink-500', icon: FileText },
          { title: 'Patient Records', value: '856', color: 'from-blue-500 to-pink-500', icon: User },
          { title: 'Storage Used', value: '2.4 GB', color: 'from-blue-500 to-pink-500', icon: FolderOpen },
          { title: 'Private Files', value: '342', color: 'from-blue-500 to-pink-500', icon: Lock },
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