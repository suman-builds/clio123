'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Workflow,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Settings,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Users,
  Calendar,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'manual' | 'automated' | 'approval' | 'notification';
  assignedTo?: string;
  estimatedDuration: number; // in minutes
  dependencies: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'patient-care' | 'administrative' | 'clinical' | 'compliance' | 'emergency';
  status: 'active' | 'inactive' | 'draft';
  steps: WorkflowStep[];
  triggers: string[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
  executionCount: number;
  averageCompletionTime: number; // in minutes
}

interface WorkflowExecution {
  id: string;
  templateId: string;
  templateName: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  currentStep: number;
  startedAt: string;
  completedAt?: string;
  startedBy: string;
  progress: number; // percentage
}

export default function WorkflowsPage() {
  const { profile } = useAuth();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'executions'>('templates');

  useEffect(() => {
    loadWorkflowData();
  }, [profile]);

  const loadWorkflowData = async () => {
    try {
      // Mock data
      const mockTemplates: WorkflowTemplate[] = [
        {
          id: '1',
          name: 'Patient Admission Workflow',
          description: 'Complete workflow for admitting new patients to the clinic',
          category: 'patient-care',
          status: 'active',
          steps: [
            { id: 's1', name: 'Patient Registration', type: 'manual', assignedTo: 'Reception', estimatedDuration: 15, dependencies: [] },
            { id: 's2', name: 'Insurance Verification', type: 'automated', estimatedDuration: 5, dependencies: ['s1'] },
            { id: 's3', name: 'Medical History Review', type: 'manual', assignedTo: 'Nurse', estimatedDuration: 20, dependencies: ['s1'] },
            { id: 's4', name: 'Doctor Assignment', type: 'automated', estimatedDuration: 2, dependencies: ['s2', 's3'] },
            { id: 's5', name: 'Initial Consultation', type: 'manual', assignedTo: 'Doctor', estimatedDuration: 30, dependencies: ['s4'] },
          ],
          triggers: ['New patient registration', 'Emergency admission'],
          createdBy: 'Admin User',
          createdAt: '2024-01-01T00:00:00Z',
          lastModified: '2024-01-10T14:30:00Z',
          executionCount: 45,
          averageCompletionTime: 72,
        },
        {
          id: '2',
          name: 'Medication Prescription Workflow',
          description: 'Workflow for prescribing and dispensing medications',
          category: 'clinical',
          status: 'active',
          steps: [
            { id: 's1', name: 'Prescription Creation', type: 'manual', assignedTo: 'Doctor', estimatedDuration: 10, dependencies: [] },
            { id: 's2', name: 'Drug Interaction Check', type: 'automated', estimatedDuration: 2, dependencies: ['s1'] },
            { id: 's3', name: 'Pharmacy Review', type: 'manual', assignedTo: 'Pharmacist', estimatedDuration: 15, dependencies: ['s2'] },
            { id: 's4', name: 'Patient Notification', type: 'notification', estimatedDuration: 1, dependencies: ['s3'] },
          ],
          triggers: ['Doctor prescribes medication', 'Medication refill request'],
          createdBy: 'Dr. Sarah Wilson',
          createdAt: '2024-01-05T00:00:00Z',
          lastModified: '2024-01-12T10:15:00Z',
          executionCount: 128,
          averageCompletionTime: 28,
        },
        {
          id: '3',
          name: 'Emergency Response Protocol',
          description: 'Critical workflow for handling medical emergencies',
          category: 'emergency',
          status: 'active',
          steps: [
            { id: 's1', name: 'Emergency Alert', type: 'notification', estimatedDuration: 1, dependencies: [] },
            { id: 's2', name: 'Staff Mobilization', type: 'automated', estimatedDuration: 2, dependencies: ['s1'] },
            { id: 's3', name: 'Patient Assessment', type: 'manual', assignedTo: 'Emergency Team', estimatedDuration: 5, dependencies: ['s2'] },
            { id: 's4', name: 'Treatment Initiation', type: 'manual', assignedTo: 'Doctor', estimatedDuration: 10, dependencies: ['s3'] },
            { id: 's5', name: 'Family Notification', type: 'manual', assignedTo: 'Support Staff', estimatedDuration: 5, dependencies: ['s3'] },
          ],
          triggers: ['Emergency button pressed', 'Critical vital signs'],
          createdBy: 'Dr. Michael Chen',
          createdAt: '2023-12-20T00:00:00Z',
          lastModified: '2024-01-08T16:45:00Z',
          executionCount: 12,
          averageCompletionTime: 23,
        },
      ];

      const mockExecutions: WorkflowExecution[] = [
        {
          id: '1',
          templateId: '1',
          templateName: 'Patient Admission Workflow',
          status: 'running',
          currentStep: 3,
          startedAt: '2024-01-15T14:30:00Z',
          startedBy: 'Reception Staff',
          progress: 60,
        },
        {
          id: '2',
          templateId: '2',
          templateName: 'Medication Prescription Workflow',
          status: 'completed',
          currentStep: 4,
          startedAt: '2024-01-15T13:15:00Z',
          completedAt: '2024-01-15T13:43:00Z',
          startedBy: 'Dr. Sarah Wilson',
          progress: 100,
        },
        {
          id: '3',
          templateId: '1',
          templateName: 'Patient Admission Workflow',
          status: 'paused',
          currentStep: 2,
          startedAt: '2024-01-15T12:00:00Z',
          startedBy: 'Reception Staff',
          progress: 40,
        },
      ];

      setTemplates(mockTemplates);
      setExecutions(mockExecutions);
    } catch (error) {
      console.error('Error loading workflow data:', error);
      toast.error('Failed to load workflow data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: WorkflowTemplate['status'] | WorkflowExecution['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Pause },
      draft: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Edit },
      running: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Play },
      completed: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
      paused: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Pause },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: WorkflowTemplate['category']) => {
    const categoryConfig = {
      'patient-care': { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'administrative': { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      'clinical': { color: 'bg-green-100 text-green-800 border-green-200' },
      'compliance': { color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'emergency': { color: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border`}>
        {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = execution.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.startedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || execution.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
            Workflow Management
          </h1>
          <p className="text-slate-600">Design, automate, and monitor clinical workflows</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Workflows', value: templates.filter(t => t.status === 'active').length.toString(), color: 'from-blue-500 to-pink-500', icon: Workflow },
          { title: 'Running Executions', value: executions.filter(e => e.status === 'running').length.toString(), color: 'from-blue-500 to-pink-500', icon: Play },
          { title: 'Completed Today', value: executions.filter(e => e.status === 'completed').length.toString(), color: 'from-blue-500 to-green-500', icon: CheckCircle },
          { title: 'Avg Completion', value: '45 min', color: 'from-blue-500 to-pink-500', icon: Clock },
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
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'templates'
              ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Workflow Templates
        </button>
        <button
          onClick={() => setActiveTab('executions')}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'executions'
              ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg'
              : 'text-slate-600 hover:bg-white/50'
          }`}
        >
          Active Executions
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
                  placeholder={`Search ${activeTab === 'templates' ? 'templates' : 'executions'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 glass-input"
                />
              </div>
            </div>
            {activeTab === 'templates' && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48 glass-input">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="patient-care">Patient Care</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="clinical">Clinical</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {activeTab === 'templates' ? (
                  <>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 'templates' ? (
        <div className="space-y-6">
          {filteredTemplates.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Workflow className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No workflow templates found</h3>
                  <p className="text-slate-500">Try adjusting your filters or create a new workflow template.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="glass-card">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-slate-900">{template.name}</h3>
                        {getStatusBadge(template.status)}
                        {getCategoryBadge(template.category)}
                      </div>
                      <p className="text-slate-600 mb-4">{template.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{template.steps.length} steps</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-pink-500" />
                          <span>~{template.averageCompletionTime} min avg</span>
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{template.executionCount} executions</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                          <span>Modified {new Date(template.lastModified).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Workflow Steps Preview */}
                      <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-4 border border-blue-200">
                        <h4 className="font-medium text-slate-900 mb-3">Workflow Steps:</h4>
                        <div className="flex items-center space-x-2 overflow-x-auto">
                          {template.steps.map((step, index) => (
                            <div key={step.id} className="flex items-center space-x-2 flex-shrink-0">
                              <div className="bg-white rounded-xl px-3 py-2 border border-blue-200 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">{step.name}</div>
                                <div className="text-xs text-slate-500">{step.estimatedDuration}m</div>
                              </div>
                              {index < template.steps.length - 1 && (
                                <ArrowRight className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                        <Play className="h-4 w-4 mr-1" />
                        Execute
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExecutions.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Activity className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No workflow executions found</h3>
                  <p className="text-slate-500">Try adjusting your filters or start a new workflow execution.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredExecutions.map((execution) => (
              <Card key={execution.id} className="glass-card">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-slate-900">{execution.templateName}</h3>
                        {getStatusBadge(execution.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Started by {execution.startedBy}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                          <span>{new Date(execution.startedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Step {execution.currentStep} of {templates.find(t => t.id === execution.templateId)?.steps.length || 0}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900">Progress</span>
                          <span className="text-sm font-bold text-blue-600">{execution.progress}%</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-3 border border-blue-200">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-pink-500 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${execution.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {execution.status === 'running' && (
                        <Button variant="outline" size="sm" className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 rounded-xl">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      {execution.status === 'paused' && (
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                          <Play className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}