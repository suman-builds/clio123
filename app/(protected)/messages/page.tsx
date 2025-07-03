'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Users,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  avatar?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
}

export default function MessagesPage() {
  const { profile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Dr. Sarah Wilson',
      participants: ['Dr. Sarah Wilson'],
      lastMessage: 'Patient consultation scheduled for tomorrow',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      isGroup: false,
      avatar: '',
    },
    {
      id: '2',
      title: 'Emergency Team',
      participants: ['Dr. Smith', 'Nurse Johnson', 'Dr. Brown'],
      lastMessage: 'Emergency protocol updated',
      lastMessageTime: '15 min ago',
      unreadCount: 0,
      isGroup: true,
    },
    {
      id: '3',
      title: 'Patient Care Team',
      participants: ['Dr. Davis', 'Support Staff', 'Coordinator'],
      lastMessage: 'New patient intake completed',
      lastMessageTime: '1 hour ago',
      unreadCount: 1,
      isGroup: true,
    },
    {
      id: '4',
      title: 'Dr. Michael Chen',
      participants: ['Dr. Michael Chen'],
      lastMessage: 'Lab results are ready for review',
      lastMessageTime: '2 hours ago',
      unreadCount: 0,
      isGroup: false,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'other',
      senderName: 'Dr. Sarah Wilson',
      content: 'Good morning! I wanted to discuss the patient consultation scheduled for tomorrow.',
      timestamp: '10:30 AM',
      type: 'text',
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'You',
      content: 'Good morning! Yes, I have the file ready. What specific points should we cover?',
      timestamp: '10:32 AM',
      type: 'text',
    },
    {
      id: '3',
      senderId: 'other',
      senderName: 'Dr. Sarah Wilson',
      content: 'We should focus on the recent test results and discuss the treatment plan options.',
      timestamp: '10:35 AM',
      type: 'text',
    },
    {
      id: '4',
      senderId: 'me',
      senderName: 'You',
      content: 'Perfect. I\'ll prepare the comprehensive report and have it ready before our meeting.',
      timestamp: '10:37 AM',
      type: 'text',
    },
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: newMessage, lastMessageTime: 'now' }
          : conv
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={cn(
                'p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
                selectedConversation === conversation.id && 'bg-blue-50 border-blue-200'
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {conversation.isGroup ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        conversation.title.charAt(0)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                  {conversation.isGroup && (
                    <div className="flex items-center mt-1">
                      <Users className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-400">
                        {conversation.participants.length} participants
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {conversations.find(c => c.id === selectedConversation)?.isGroup ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        conversations.find(c => c.id === selectedConversation)?.title.charAt(0)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {conversations.find(c => c.id === selectedConversation)?.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {conversations.find(c => c.id === selectedConversation)?.isGroup
                        ? `${conversations.find(c => c.id === selectedConversation)?.participants.length} participants`
                        : 'Online'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.senderId === 'me' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                      message.senderId === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    )}
                  >
                    {message.senderId !== 'me' && (
                      <p className="text-xs font-medium mb-1 text-gray-600">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                      )}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm" className="mb-2">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="resize-none"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}