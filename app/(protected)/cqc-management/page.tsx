'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  Users,
  Activity,
  TrendingUp,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';

interface CQCStandard {
  id: string;
  title: string;
  category: 'safe' | 'effective' | 'caring' | 'responsive' | 'well-led';
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  lastAssessment: string;
  nextReview: string;
  evidence: string[];
  actionItems: string[];
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface CQCInspection {
  id: string;
  date: string;
  type: 'routine' | 'focused' | 'responsive' | 'follow-up';
  status: 'scheduled' | 'in-progress' | 'completed' | 'report-pending';
  inspector: string;
  areas: string[];
  findings: string[];
  rating?: 'outstanding' | 'good' | 'requires-improvement' | 'inadequate';
}

export default function CQCManagementPage() {
  const { profile } = useAuth();
  const [standards, setStandards] = useState<CQCStandard[]>([]);
  const [inspections, setInspections] = useState<CQCInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadCQCData();
  }, [profile]);

  const loadCQCData = async () => {
    try {
      // Mock data
      const mockStandards: CQCStandard[] = [
        {
          id: '1',
          title: 'Infection Prevention and Control',
          category: 'safe',
          description: 'Systems and processes to prevent and control infections',
          status: 'compliant',
          lastAssessment: '2024-01-10',
          nextReview: '2024-04-10',
          evidence: ['IPC Policy', 'Training Records', 'Audit Results'],
          actionItems: [],
          assignedTo: 'Jennifer Rodriguez',
          priority: 'high',
        },
        {
          id: '2',
          title: 'Medicines Management',
          category: 'safe',
          description: 'Safe storage, administration and disposal of medicines',
          status: 'partial',
          lastAssessment: '2024-01-05',
          nextReview: '2024-02-05',
          evidence: ['Medicine Policy', 'Storage Audit'],
          actionItems: ['Update controlled drugs register', 'Staff training on new protocols'],
          assignedTo: 'Dr. Sarah Wilson',
          priority: 'medium',
        },
        {
          id: '3',
          title: 'Person-Centered Care',
          category: 'caring',
          description: 'Care that is responsive to individual patient needs',
          status: 'compliant',
          lastAssessment: '2024-01-12',
          nextReview: '2024-07-12',
          evidence: ['Patient Feedback', 'Care Plans', 'Staff Training'],
          actionItems: [],
          assignedTo: 'Dr. Michael Chen',
          priority: 'low',
        },
        {
          id: '4',
          title: 'Governance and Leadership',
          category: 'well-led',
          description: 'Effective leadership and governance structures',
          status: 'non-compliant',
          lastAssessment: '2023-12-20',
          nextReview: '2024-02-20',
          evidence: ['Board Minutes', 'Risk Register'],
          actionItems: ['Implement new governance framework', 'Update risk management policy'],
          assignedTo: 'Admin User',
          priority: 'critical',
        },
      ];

      const mockInspections: CQCInspection[] = [
        {
          id: '1',
          date: '2024-03-15',
          type: 'routine',
          status: 'scheduled',
          inspector: 'CQC Inspector Team A',
          areas: ['Safe', 'Effective', 'Caring'],
          findings: [],
        },
        {
          id: '2',
          date: '2023-09-20',
          type: 'routine',
          status: 'completed',
          inspector: 'CQC Inspector Team B',
          areas: ['Safe', 'Effective', 'Caring', 'Responsive', 'Well-led'],
          findings: ['Minor documentation gaps', 'Excellent patient feedback'],
          rating: 'good',
        },
      ];

      setStandards(mockStandards);
      setInspections(mockInspections);
    } catch (error) {
      console.error('Error loading CQC data:', error);
      toast.error('Failed to load CQC data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: CQCStandard['status']) => {
    const statusConfig = {
      compliant: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      partial: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      'non-compliant': { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
      'not-assessed': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FileText },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getCategoryBadge = (category: CQCStandard['category']) => {
    const categoryConfig = {
      safe: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      effective: { color: 'bg-green-100 text-green-800 border-green-200' },
      caring: { color: 'bg-purple-100 text-purple-800 border-purple-200' },
      responsive: { color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'well-led': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    };

    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border`}>
        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getRatingBadge = (rating: CQCInspection['rating']) => {
    if (!rating) return null;
    
    const ratingConfig = {
      outstanding: { color: 'bg-green-100 text-green-800 border-green-200', icon: Award },
      good: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      'requires-improvement': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: TrendingUp },
      inadequate: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
    };

    const config = ratingConfig[rating];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {rating.charAt(0).toUpperCase() + rating.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getCompliancePercentage = () => {
    const compliant = standards.filter(s => s.status === 'compliant').length;
    return Math.round((compliant / standards.length) * 100);
  };

  const filteredStandards = standards.filter(standard => {
    const matchesSearch = standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || standard.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || standard.status === statusFilter;
    
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
            CQC Management
          </h1>
          <p className="text-slate-600">Monitor compliance with Care Quality Commission standards</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Standard
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Overall Compliance', value: `${getCompliancePercentage()}%`, color: 'from-blue-500 to-green-500', icon: CheckCircle },
          { title: 'Standards Tracked', value: standards.length.toString(), color: 'from-blue-500 to-pink-500', icon: FileText },
          { title: 'Action Items', value: standards.reduce((acc, s) => acc + s.actionItems.length, 0).toString(), color: 'from-blue-500 to-red-500', icon: AlertTriangle },
          { title: 'Next Inspection', value: '45 days', color: 'from-blue-500 to-purple-500', icon: Calendar },
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

      {/* Compliance Progress */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-pink-600/10 border-b border-blue-100">
          <CardTitle className="flex items-center text-slate-800">
            <TrendingUp className="mr-3 h-6 w-6 text-blue-600" />
            Compliance Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-slate-900">Overall Compliance Rate</span>
              <span className="text-2xl font-bold text-blue-600">{getCompliancePercentage()}%</span>
            </div>
            <Progress value={getCompliancePercentage()} className="h-3 bg-slate-200" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
              {['safe', 'effective', 'caring', 'responsive', 'well-led'].map(category => {
                const categoryStandards = standards.filter(s => s.category === category);
                const compliant = categoryStandards.filter(s => s.status === 'compliant').length;
                const percentage = categoryStandards.length > 0 ? Math.round((compliant / categoryStandards.length) * 100) : 0;
                
                return (
                  <div key={category} className="text-center p-4 bg-white/80 rounded-2xl border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-2 capitalize">{category.replace('-', ' ')}</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{percentage}%</div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search standards by title or description..."
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
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="effective">Effective</SelectItem>
                <SelectItem value="caring">Caring</SelectItem>
                <SelectItem value="responsive">Responsive</SelectItem>
                <SelectItem value="well-led">Well-led</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="non-compliant">Non-compliant</SelectItem>
                <SelectItem value="not-assessed">Not Assessed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Standards List */}
      <div className="space-y-4">
        {filteredStandards.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <CheckSquare className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No standards found</h3>
                <p className="text-slate-500">Try adjusting your filters or add a new standard.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredStandards.map((standard) => (
            <Card key={standard.id} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">{standard.title}</h3>
                      {getStatusBadge(standard.status)}
                      {getCategoryBadge(standard.category)}
                    </div>
                    <p className="text-slate-600 mb-4">{standard.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Last assessed: {new Date(standard.lastAssessment).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-pink-500" />
                        <span>Next review: {new Date(standard.nextReview).toLocaleDateString()}</span>
                      </div>
                      {standard.assignedTo && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Assigned to: {standard.assignedTo}</span>
                        </div>
                      )}
                    </div>

                    {standard.evidence.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-slate-900 mb-2">Evidence:</h4>
                        <div className="flex flex-wrap gap-2">
                          {standard.evidence.map((evidence, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 border border-blue-200">
                              {evidence}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {standard.actionItems.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-slate-900 mb-2">Action Items:</h4>
                        <ul className="space-y-1">
                          {standard.actionItems.map((item, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-start">
                              <AlertTriangle className="h-4 w-4 mr-2 text-pink-500 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                      <Activity className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                      <FileText className="h-4 w-4 mr-1" />
                      Evidence
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Inspections */}
      <Card className="glass-card">
        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-pink-600/10 border-b border-blue-100">
          <CardTitle className="flex items-center text-slate-800">
            <Shield className="mr-3 h-6 w-6 text-pink-600" />
            CQC Inspections
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {inspection.type.charAt(0).toUpperCase() + inspection.type.slice(1)} Inspection
                      </h3>
                      <Badge className={`${inspection.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200'} border`}>
                        {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1).replace('-', ' ')}
                      </Badge>
                      {inspection.rating && getRatingBadge(inspection.rating)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{new Date(inspection.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-pink-500" />
                        <span>{inspection.inspector}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckSquare className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{inspection.areas.join(', ')}</span>
                      </div>
                    </div>

                    {inspection.findings.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Key Findings:</h4>
                        <ul className="space-y-1">
                          {inspection.findings.map((finding, index) => (
                            <li key={index} className="text-sm text-slate-600">• {finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}