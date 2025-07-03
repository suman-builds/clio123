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
  BookOpen,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  FileText,
  Calendar,
  Tag,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  title: string;
  content: string;
  category: 'patient-care' | 'procedure' | 'medication' | 'incident' | 'training' | 'other';
  patientId?: string;
  patientName?: string;
  authorId: string;
  authorName: string;
  tags: string[];
  timestamp: string;
  lastModified: string;
  isPrivate: boolean;
}

export default function LogbookPage() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    category: 'patient-care' as const,
    patientId: '',
    patientName: '',
    tags: '',
    isPrivate: false,
  });

  useEffect(() => {
    loadLogEntries();
  }, [profile]);

  const loadLogEntries = async () => {
    try {
      // Simulate loading log entries
      const mockEntries: LogEntry[] = [
        {
          id: '1',
          title: 'Patient Consultation - Follow-up',
          content: 'Patient showed significant improvement in symptoms. Adjusted medication dosage as discussed. Next appointment scheduled for 2 weeks.',
          category: 'patient-care',
          patientId: 'p1',
          patientName: 'John Doe',
          authorId: profile?.id || '',
          authorName: profile?.full_name || 'Doctor',
          tags: ['follow-up', 'medication', 'improvement'],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isPrivate: false,
        },
        {
          id: '2',
          title: 'New Procedure Protocol',
          content: 'Implemented new sterilization protocol for surgical instruments. All staff trained and documentation updated.',
          category: 'procedure',
          authorId: profile?.id || '',
          authorName: profile?.full_name || 'Doctor',
          tags: ['protocol', 'sterilization', 'training'],
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isPrivate: false,
        },
        {
          id: '3',
          title: 'Medication Inventory Update',
          content: 'Received new shipment of antibiotics. Updated inventory system and checked expiration dates. All medications properly stored.',
          category: 'medication',
          authorId: profile?.id || '',
          authorName: profile?.full_name || 'Doctor',
          tags: ['inventory', 'antibiotics', 'storage'],
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isPrivate: false,
        },
        {
          id: '4',
          title: 'Staff Training Session',
          content: 'Conducted training session on new patient management system. All staff members attended and completed certification.',
          category: 'training',
          authorId: profile?.id || '',
          authorName: profile?.full_name || 'Doctor',
          tags: ['training', 'certification', 'staff'],
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          isPrivate: false,
        },
      ];

      setEntries(mockEntries);
    } catch (error) {
      console.error('Error loading log entries:', error);
      toast.error('Failed to load log entries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async () => {
    if (!newEntry.title || !newEntry.content) {
      toast.error('Please fill in the title and content');
      return;
    }

    try {
      const entry: LogEntry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        category: newEntry.category,
        patientId: newEntry.patientId || undefined,
        patientName: newEntry.patientName || undefined,
        authorId: profile?.id || '',
        authorName: profile?.full_name || 'User',
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        timestamp: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        isPrivate: newEntry.isPrivate,
      };

      setEntries(prev => [entry, ...prev]);
      setIsCreateDialogOpen(false);
      setNewEntry({
        title: '',
        content: '',
        category: 'patient-care',
        patientId: '',
        patientName: '',
        tags: '',
        isPrivate: false,
      });
      toast.success('Log entry created successfully');
    } catch (error) {
      console.error('Error creating entry:', error);
      toast.error('Failed to create log entry');
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
    toast.success('Log entry deleted');
  };

  const getCategoryBadge = (category: LogEntry['category']) => {
    const categoryConfig = {
      'patient-care': { color: 'bg-blue-100 text-blue-800', label: 'Patient Care' },
      'procedure': { color: 'bg-green-100 text-green-800', label: 'Procedure' },
      'medication': { color: 'bg-purple-100 text-purple-800', label: 'Medication' },
      'incident': { color: 'bg-red-100 text-red-800', label: 'Incident' },
      'training': { color: 'bg-orange-100 text-orange-800', label: 'Training' },
      'other': { color: 'bg-gray-100 text-gray-800', label: 'Other' },
    };

    const config = categoryConfig[category];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
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
          <h1 className="text-3xl font-bold text-gray-900">Logbook</h1>
          <p className="text-gray-600 mt-2">Record and track clinical activities and observations</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Log Entry</DialogTitle>
              <DialogDescription>
                Record a new clinical activity or observation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="Brief description of the activity"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newEntry.category} onValueChange={(value: any) => setNewEntry({ ...newEntry, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient-care">Patient Care</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    value={newEntry.patientId}
                    onChange={(e) => setNewEntry({ ...newEntry, patientId: e.target.value })}
                    placeholder="Optional patient ID"
                  />
                </div>
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={newEntry.patientName}
                    onChange={(e) => setNewEntry({ ...newEntry, patientName: e.target.value })}
                    placeholder="Optional patient name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Detailed description of the activity or observation..."
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={newEntry.tags}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                  placeholder="Comma-separated tags (e.g., follow-up, medication, training)"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newEntry.isPrivate}
                  onChange={(e) => setNewEntry({ ...newEntry, isPrivate: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isPrivate">Private entry (only visible to you)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEntry}>Create Entry</Button>
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
                  placeholder="Search entries by title, content, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="patient-care">Patient Care</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No log entries found</h3>
                <p className="text-gray-500">Try adjusting your filters or create a new entry.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                      {getCategoryBadge(entry.category)}
                      {entry.isPrivate && (
                        <Badge variant="secondary" className="text-xs">
                          Private
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{entry.authorName}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      {entry.patientName && (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>Patient: {entry.patientName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                </div>

                {entry.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {entry.lastModified !== entry.timestamp && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Last modified: {new Date(entry.lastModified).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}