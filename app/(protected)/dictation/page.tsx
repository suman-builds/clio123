'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Plus,
  Search,
  Calendar,
  User,
  Clock,
  Download,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface Dictation {
  id: string;
  title: string;
  patientId?: string;
  patientName?: string;
  transcript: string;
  duration: number; // in seconds
  status: 'recording' | 'completed' | 'transcribing';
  authorId: string;
  authorName: string;
  createdAt: string;
  audioUrl?: string;
}

export default function DictationPage() {
  const { profile } = useAuth();
  const [dictations, setDictations] = useState<Dictation[]>([
    {
      id: '1',
      title: 'Patient Consultation - John Doe',
      patientId: 'p1',
      patientName: 'John Doe',
      transcript: 'Patient presents with chest pain radiating to left arm. Vital signs stable. Blood pressure 120/80. Heart rate 72 BPM. Recommended ECG and cardiac enzymes.',
      duration: 180,
      status: 'completed',
      authorId: 'dr1',
      authorName: 'Dr. Smith',
      createdAt: '2024-01-15T10:30:00Z',
      audioUrl: '/audio/dictation-1.mp3',
    },
    {
      id: '2',
      title: 'Follow-up Notes - Jane Smith',
      patientId: 'p2',
      patientName: 'Jane Smith',
      transcript: 'Patient showing improvement in blood pressure control. Current medication regimen effective. Continue ACE inhibitor. Schedule follow-up in 3 months.',
      duration: 120,
      status: 'completed',
      authorId: 'dr1',
      authorName: 'Dr. Smith',
      createdAt: '2024-01-14T14:15:00Z',
      audioUrl: '/audio/dictation-2.mp3',
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDictation, setNewDictation] = useState({
    title: '',
    patientId: '',
    transcript: '',
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    toast.success('Recording started');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success('Recording stopped');
    
    // Simulate creating a new dictation
    const dictation: Dictation = {
      id: Date.now().toString(),
      title: `Dictation ${new Date().toLocaleString()}`,
      transcript: 'Transcription in progress...',
      duration: recordingTime,
      status: 'transcribing',
      authorId: profile?.id || '',
      authorName: profile?.full_name || 'Unknown',
      createdAt: new Date().toISOString(),
    };
    
    setDictations(prev => [dictation, ...prev]);
    setRecordingTime(0);
    
    // Simulate transcription completion
    setTimeout(() => {
      setDictations(prev => prev.map(d => 
        d.id === dictation.id 
          ? { ...d, status: 'completed' as const, transcript: 'Sample transcribed text from the recording.' }
          : d
      ));
      toast.success('Transcription completed');
    }, 3000);
  };

  const handleCreateDictation = async () => {
    if (!newDictation.title || !newDictation.transcript) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      const dictation: Dictation = {
        id: Date.now().toString(),
        title: newDictation.title,
        patientId: newDictation.patientId || undefined,
        patientName: getPatientName(newDictation.patientId),
        transcript: newDictation.transcript,
        duration: 0,
        status: 'completed',
        authorId: profile?.id || '',
        authorName: profile?.full_name || 'Unknown',
        createdAt: new Date().toISOString(),
      };

      setDictations(prev => [dictation, ...prev]);
      setIsCreateDialogOpen(false);
      setNewDictation({
        title: '',
        patientId: '',
        transcript: '',
      });
      toast.success('Dictation created successfully');
    } catch (error) {
      console.error('Error creating dictation:', error);
      toast.error('Failed to create dictation');
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
    return patientNames[patientId] || undefined;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: Dictation['status']) => {
    const statusConfig = {
      recording: { color: 'bg-red-100 text-red-800', text: 'Recording' },
      transcribing: { color: 'bg-yellow-100 text-yellow-800', text: 'Transcribing' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const handleDeleteDictation = (dictationId: string) => {
    if (!confirm('Are you sure you want to delete this dictation?')) return;
    
    setDictations(prev => prev.filter(d => d.id !== dictationId));
    toast.success('Dictation deleted');
  };

  const filteredDictations = dictations.filter(dictation =>
    dictation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dictation.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dictation.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dictation</h1>
          <p className="text-gray-600 mt-2">Record and manage voice dictations with transcription</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Manual Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Manual Dictation</DialogTitle>
                <DialogDescription>
                  Create a dictation entry manually without recording.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newDictation.title}
                    onChange={(e) => setNewDictation({ ...newDictation, title: e.target.value })}
                    placeholder="Enter dictation title"
                  />
                </div>
                <div>
                  <Label htmlFor="patientId">Patient (Optional)</Label>
                  <Select 
                    value={newDictation.patientId} 
                    onValueChange={(value) => setNewDictation({ ...newDictation, patientId: value })}
                  >
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
                  <Label htmlFor="transcript">Content *</Label>
                  <Textarea
                    id="transcript"
                    value={newDictation.transcript}
                    onChange={(e) => setNewDictation({ ...newDictation, transcript: e.target.value })}
                    placeholder="Enter dictation content..."
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDictation}>Create Dictation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Recording Controls */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="mr-2 h-5 w-5 text-blue-600" />
            Voice Recording
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
                {formatDuration(recordingTime)}
              </div>
              <p className="text-sm text-gray-500">Recording Time</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <Button
                  onClick={handleStartRecording}
                  className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Mic className="h-6 w-6 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={handleStopRecording}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Square className="h-6 w-6 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>
            
            {isRecording && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-medium">Recording...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search dictations by title, content, or patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 glass-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dictations List */}
      <div className="space-y-4">
        {filteredDictations.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Mic className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No dictations found</h3>
                <p className="text-slate-500">Start recording or create a manual entry to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDictations.map((dictation) => (
            <Card key={dictation.id} className="glass-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{dictation.title}</h3>
                      {getStatusBadge(dictation.status)}
                      {dictation.patientName && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 border border-blue-200">
                          {dictation.patientName}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{dictation.transcript}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{dictation.authorName}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-pink-500" />
                        <span>Duration: {formatDuration(dictation.duration)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{new Date(dictation.createdAt).toLocaleDateString()}</span>
                      </div>
                      {dictation.audioUrl && (
                        <div className="flex items-center">
                          <Play className="h-4 w-4 mr-2 text-pink-500" />
                          <span>Audio available</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {dictation.audioUrl && (
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <Play className="h-4 w-4 text-blue-600" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      <Download className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDictation(dictation.id)}
                      className="text-red-600 hover:text-red-700 rounded-xl"
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