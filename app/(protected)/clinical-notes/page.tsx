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
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Edit,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ClinicalNote {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ClinicalNotesPage() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<ClinicalNote[]>([
    {
      id: '1',
      patientId: 'p1',
      patientName: 'John Doe',
      title: 'Initial Consultation',
      content: 'Patient presents with chest pain. Vital signs stable. Recommended ECG and blood work.',
      authorId: 'dr1',
      authorName: 'Dr. Smith',
      tags: ['consultation', 'chest-pain'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      patientId: 'p2',
      patientName: 'Jane Smith',
      title: 'Follow-up Visit',
      content: 'Patient showing improvement. Blood pressure normalized. Continue current medication.',
      authorId: 'dr1',
      authorName: 'Dr. Smith',
      tags: ['follow-up', 'hypertension'],
      createdAt: '2024-01-14T14:15:00Z',
      updatedAt: '2024-01-14T14:15:00Z',
    },
    {
      id: '3',
      patientId: 'p3',
      patientName: 'Robert Johnson',
      title: 'Lab Results Review',
      content: 'Lab results show elevated cholesterol. Discussed dietary changes and exercise plan.',
      authorId: 'dr1',
      authorName: 'Dr. Smith',
      tags: ['lab-results', 'cholesterol'],
      createdAt: '2024-01-13T09:45:00Z',
      updatedAt: '2024-01-13T09:45:00Z',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientFilter, setPatientFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    patientId: '',
    title: '',
    content: '',
    tags: '',
  });

  const handleCreateNote = async () => {
    if (!newNote.patientId || !newNote.title || !newNote.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const note: ClinicalNote = {
        id: Date.now().toString(),
        patientId: newNote.patientId,
        patientName: getPatientName(newNote.patientId),
        title: newNote.title,
        content: newNote.content,
        authorId: profile?.id || '',
        authorName: profile?.full_name || 'Unknown',
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes(prev => [note, ...prev]);
      setIsCreateDialogOpen(false);
      setNewNote({
        patientId: '',
        title: '',
        content: '',
        tags: '',
      });
      toast.success('Clinical note created successfully');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create clinical note');
    }
  };

  const getPatientName = (patientId: string) => {
    const patientNames: { [key: string]: string } = {
      'p1': 'John Doe',
      'p2': 'Jane Smith',
      'p3': 'Robert Johnson',
      'p4': 'Alice Johnson',
      'p5': 'Michael Brown',
    };
    return patientNames[patientId] || 'Unknown Patient';
  };

  const handleDeleteNote = (noteId: string) => {
    if (!confirm('Are you sure you want to delete this clinical note?')) return;
    
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast.success('Clinical note deleted');
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPatient = patientFilter === 'all' || note.patientId === patientFilter;
    
    return matchesSearch && matchesPatient;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Notes</h1>
          <p className="text-gray-600 mt-2">Manage patient clinical notes and documentation</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Clinical Note</DialogTitle>
              <DialogDescription>
                Create a new clinical note for a patient.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patientId">Patient *</Label>
                <Select value={newNote.patientId} onValueChange={(value) => setNewNote({ ...newNote, patientId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">John Doe</SelectItem>
                    <SelectItem value="p2">Jane Smith</SelectItem>
                    <SelectItem value="p3">Robert Johnson</SelectItem>
                    <SelectItem value="p4">Alice Johnson</SelectItem>
                    <SelectItem value="p5">Michael Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Note Title *</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <Label htmlFor="content">Note Content *</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Enter clinical note content..."
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  placeholder="consultation, follow-up, lab-results"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNote}>Create Note</Button>
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
                  placeholder="Search notes by title, content, patient, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="p1">John Doe</SelectItem>
                <SelectItem value="p2">Jane Smith</SelectItem>
                <SelectItem value="p3">Robert Johnson</SelectItem>
                <SelectItem value="p4">Alice Johnson</SelectItem>
                <SelectItem value="p5">Michael Brown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clinical notes found</h3>
                <p className="text-gray-500">Try adjusting your filters or create a new note.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                      <Badge variant="secondary">{note.patientName}</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{note.content}</p>
                    
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{note.authorName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      {note.updatedAt !== note.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}