'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Mail,
  Plus,
  Search,
  Filter,
  Send,
  Reply,
  Archive,
  Star,
  Clock,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

interface PatientMessage {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'replied' | 'archived';
  category: 'appointment' | 'prescription' | 'results' | 'billing' | 'general' | 'emergency';
  sentAt: string;
  repliedAt?: string;
  repliedBy?: string;
  isStarred: boolean;
  attachments?: string[];
}

export default function PatientMessagesPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<PatientMessage | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadPatientMessages();
  }, [profile]);

  const loadPatientMessages = async () => {
    try {
      // Mock data
      const mockMessages: PatientMessage[] = [
        {
          id: '1',
          patientId: 'p1',
          patientName: 'John Doe',
          patientEmail: 'john.doe@email.com',
          subject: 'Question about upcoming appointment',
          content: 'Hi, I wanted to confirm my appointment scheduled for next Tuesday at 2 PM. Also, should I bring any specific documents or prepare anything beforehand?',
          priority: 'medium',
          status: 'unread',
          category: 'appointment',
          sentAt: '2024-01-15T10:30:00Z',
          isStarred: false,
        },
        {
          id: '2',
          patientId: 'p2',
          patientName: 'Jane Smith',
          patientEmail: 'jane.smith@email.com',
          subject: 'Prescription refill request',
          content: 'Hello, I need to refill my blood pressure medication. My current prescription is running low and I have about 3 days left. Can you please process a refill?',
          priority: 'high',
          status: 'read',
          category: 'prescription',
          sentAt: '2024-01-15T09:15:00Z',
          isStarred: true,
        },
        {
          id: '3',
          patientId: 'p3',
          patientName: 'Robert Johnson',
          patientEmail: 'robert.j@email.com',
          subject: 'Lab results inquiry',
          content: 'I received a notification that my lab results are ready. Could you please explain what the results mean? I\'m particularly concerned about the cholesterol levels.',
          priority: 'medium',
          status: 'replied',
          category: 'results',
          sentAt: '2024-01-14T16:45:00Z',
          repliedAt: '2024-01-14T18:30:00Z',
          repliedBy: 'Dr. Sarah Wilson',
          isStarred: false,
        },
        {
          id: '4',
          patientId: 'p4',
          patientName: 'Emily Davis',
          patientEmail: 'emily.davis@email.com',
          subject: 'Billing question',
          content: 'I received my bill for last month\'s visit and I notice there\'s a charge I don\'t understand. Could someone please review this with me?',
          priority: 'low',
          status: 'unread',
          category: 'billing',
          sentAt: '2024-01-14T14:20:00Z',
          isStarred: false,
        },
        {
          id: '5',
          patientId: 'p5',
          patientName: 'Michael Brown',
          patientEmail: 'michael.brown@email.com',
          subject: 'URGENT: Severe chest pain',
          content: 'I\'m experiencing severe chest pain that started about an hour ago. It\'s getting worse and I\'m having trouble breathing. Should I come to the clinic or go to the emergency room?',
          priority: 'urgent',
          status: 'unread',
          category: 'emergency',
          sentAt: '2024-01-15T11:45:00Z',
          isStarred: true,
        },
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading patient messages:', error);
      toast.error('Failed to load patient messages');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyToMessage = async () => {
    if (!selectedMessage || !replyContent.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      // Update message status
      setMessages(prev =>
        prev.map(msg =>
          msg.id === selectedMessage.id
            ? {
                ...msg,
                status: 'replied' as const,
                repliedAt: new Date().toISOString(),
                repliedBy: profile?.full_name || 'Staff',
              }
            : msg
        )
      );

      setIsReplyDialogOpen(false);
      setReplyContent('');
      setSelectedMessage(null);
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId && msg.status === 'unread'
          ? { ...msg, status: 'read' as const }
          : msg
      )
    );
  };

  const handleToggleStar = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isStarred: !msg.isStarred }
          : msg
      )
    );
  };

  const handleArchiveMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, status: 'archived' as const }
          : msg
      )
    );
    toast.success('Message archived');
  };

  const getPriorityBadge = (priority: PatientMessage['priority']) => {
    const priorityConfig = {
      low: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      medium: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
      high: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertCircle },
      urgent: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
    };

    const config = priorityConfig[priority];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: PatientMessage['status']) => {
    const statusConfig = {
      unread: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      read: { color: 'bg-gray-100 text-gray-800 border-gray-200' },
      replied: { color: 'bg-green-100 text-green-800 border-green-200' },
      archived: { color: 'bg-purple-100 text-purple-800 border-purple-200' },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: PatientMessage['category']) => {
    const categoryConfig = {
      appointment: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      prescription: { color: 'bg-green-100 text-green-800 border-green-200' },
      results: { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      billing: { color: 'bg-orange-100 text-orange-800 border-orange-200' },
      general: { color: 'bg-gray-100 text-gray-800 border-gray-200' },
      emergency: { color: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || message.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/60 rounded-2xl w-1/3"></div>
            <div className="h-4 bg-white/40 rounded-xl w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Patient Messages
            </h1>
            <p className="text-slate-600 text-lg">Manage patient communications and inquiries</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Unread Messages', value: messages.filter(m => m.status === 'unread').length.toString(), color: 'from-blue-500 to-indigo-500', icon: Mail },
            { title: 'Urgent Messages', value: messages.filter(m => m.priority === 'urgent').length.toString(), color: 'from-red-500 to-pink-500', icon: AlertCircle },
            { title: 'Starred Messages', value: messages.filter(m => m.isStarred).length.toString(), color: 'from-yellow-500 to-orange-500', icon: Star },
            { title: 'Replied Today', value: messages.filter(m => m.status === 'replied').length.toString(), color: 'from-green-500 to-emerald-500', icon: Reply },
          ].map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
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
        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search messages by patient, subject, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-white/80 border-slate-200 rounded-2xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/80 border-slate-200 rounded-2xl h-12">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="bg-white/80 border-slate-200 rounded-2xl h-12">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white/80 border-slate-200 rounded-2xl h-12">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="results">Results</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No messages found</h3>
                  <p className="text-slate-500">Try adjusting your filters to see more messages.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card 
                key={message.id} 
                className={`bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                  message.status === 'unread' ? 'ring-2 ring-blue-200' : ''
                }`}
                onClick={() => handleMarkAsRead(message.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                          {message.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`text-lg font-semibold ${message.status === 'unread' ? 'text-slate-900' : 'text-slate-700'}`}>
                            {message.patientName}
                          </h3>
                          {getPriorityBadge(message.priority)}
                          {getStatusBadge(message.status)}
                          {getCategoryBadge(message.category)}
                          {message.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <h4 className={`text-md font-medium mb-2 ${message.status === 'unread' ? 'text-slate-900' : 'text-slate-700'}`}>
                          {message.subject}
                        </h4>
                        
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">{message.content}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(message.sentAt).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{message.patientEmail}</span>
                          </div>
                          {message.repliedAt && (
                            <div className="flex items-center">
                              <Reply className="h-3 w-3 mr-1" />
                              <span>Replied by {message.repliedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(message.id);
                        }}
                        className="rounded-xl"
                      >
                        <Star className={`h-4 w-4 ${message.isStarred ? 'text-yellow-500 fill-current' : 'text-slate-400'}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMessage(message);
                          setIsReplyDialogOpen(true);
                        }}
                        className="border-slate-200 hover:bg-slate-50 rounded-xl"
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchiveMessage(message.id);
                        }}
                        className="border-slate-200 hover:bg-slate-50 rounded-xl"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reply to {selectedMessage?.patientName}</DialogTitle>
              <DialogDescription>
                Subject: {selectedMessage?.subject}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h4 className="font-medium text-slate-900 mb-2">Original Message:</h4>
                <p className="text-sm text-slate-600">{selectedMessage?.content}</p>
              </div>
              <div>
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea
                  id="reply"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReplyToMessage}>
                <Send className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}