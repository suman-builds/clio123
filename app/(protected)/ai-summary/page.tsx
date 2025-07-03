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
  Bot,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  TrendingUp,
  Brain,
  Sparkles,
  Clock,
  Download,
  Share,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface AISummary {
  id: string;
  title: string;
  type: 'patient-summary' | 'clinical-insights' | 'trend-analysis' | 'risk-assessment' | 'operational-summary';
  content: string;
  keyInsights: string[];
  recommendations: string[];
  confidence: number;
  generatedAt: string;
  generatedBy: string;
  patientId?: string;
  patientName?: string;
  timeframe?: string;
  status: 'generated' | 'reviewed' | 'approved' | 'archived';
}

export default function AISummaryPage() {
  const { profile } = useAuth();
  const [summaries, setSummaries] = useState<AISummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [newSummary, setNewSummary] = useState({
    type: 'patient-summary' as const,
    patientId: '',
    timeframe: '30-days',
    focus: '',
  });

  useEffect(() => {
    loadAISummaries();
  }, [profile]);

  const loadAISummaries = async () => {
    try {
      // Mock data
      const mockSummaries: AISummary[] = [
        {
          id: '1',
          title: 'Patient Health Summary - John Doe',
          type: 'patient-summary',
          content: 'Based on recent medical data, John Doe shows significant improvement in cardiovascular health. Blood pressure readings have stabilized within normal ranges over the past 30 days. Medication adherence appears excellent with no missed doses recorded.',
          keyInsights: [
            'Blood pressure normalized (avg 125/80)',
            'Medication adherence: 100%',
            'Weight loss: 5 lbs in 30 days',
            'Exercise frequency increased by 40%'
          ],
          recommendations: [
            'Continue current medication regimen',
            'Schedule follow-up in 3 months',
            'Consider reducing medication if trends continue',
            'Maintain current exercise routine'
          ],
          confidence: 92,
          generatedAt: '2024-01-15T10:30:00Z',
          generatedBy: 'AI Clinical Assistant',
          patientId: 'p1',
          patientName: 'John Doe',
          timeframe: '30 days',
          status: 'reviewed',
        },
        {
          id: '2',
          title: 'Clinical Trends Analysis - January 2024',
          type: 'trend-analysis',
          content: 'Analysis of clinical data for January 2024 reveals several important trends. Patient satisfaction scores have increased by 15% compared to December. Average appointment duration has decreased by 8 minutes while maintaining quality metrics.',
          keyInsights: [
            'Patient satisfaction up 15%',
            'Appointment efficiency improved',
            'Reduced wait times by 12 minutes',
            'Medication errors decreased by 30%'
          ],
          recommendations: [
            'Implement successful practices clinic-wide',
            'Investigate factors contributing to efficiency gains',
            'Consider staff recognition program',
            'Monitor trends for sustainability'
          ],
          confidence: 88,
          generatedAt: '2024-01-14T16:45:00Z',
          generatedBy: 'AI Analytics Engine',
          timeframe: 'January 2024',
          status: 'approved',
        },
        {
          id: '3',
          title: 'Risk Assessment - High-Risk Patients',
          type: 'risk-assessment',
          content: 'Current analysis identifies 12 patients at elevated risk for cardiovascular events based on recent lab results, medication adherence patterns, and lifestyle factors. Immediate intervention recommended for 3 patients.',
          keyInsights: [
            '12 patients identified as high-risk',
            '3 require immediate intervention',
            'Common risk factors: hypertension, diabetes',
            'Medication non-adherence in 25% of cases'
          ],
          recommendations: [
            'Schedule urgent consultations for 3 critical patients',
            'Implement medication adherence monitoring',
            'Increase follow-up frequency for high-risk group',
            'Consider lifestyle intervention programs'
          ],
          confidence: 95,
          generatedAt: '2024-01-13T09:15:00Z',
          generatedBy: 'AI Risk Assessment Tool',
          status: 'generated',
        },
      ];

      setSummaries(mockSummaries);
    } catch (error) {
      console.error('Error loading AI summaries:', error);
      toast.error('Failed to load AI summaries');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!newSummary.type) {
      toast.error('Please select a summary type');
      return;
    }

    setGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const summary: AISummary = {
        id: Date.now().toString(),
        title: `AI Generated ${newSummary.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        type: newSummary.type,
        content: 'AI-generated summary content based on the selected parameters and available data...',
        keyInsights: [
          'Key insight 1 from AI analysis',
          'Key insight 2 from AI analysis',
          'Key insight 3 from AI analysis',
        ],
        recommendations: [
          'AI recommendation 1',
          'AI recommendation 2',
          'AI recommendation 3',
        ],
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        generatedAt: new Date().toISOString(),
        generatedBy: 'AI Clinical Assistant',
        timeframe: newSummary.timeframe,
        status: 'generated',
      };

      setSummaries(prev => [summary, ...prev]);
      setIsGenerateDialogOpen(false);
      setNewSummary({
        type: 'patient-summary',
        patientId: '',
        timeframe: '30-days',
        focus: '',
      });
      toast.success('AI summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate AI summary');
    } finally {
      setGenerating(false);
    }
  };

  const getTypeBadge = (type: AISummary['type']) => {
    const typeConfig = {
      'patient-summary': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: User },
      'clinical-insights': { color: 'bg-green-100 text-green-800 border-green-200', icon: Brain },
      'trend-analysis': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: TrendingUp },
      'risk-assessment': { color: 'bg-red-100 text-red-800 border-red-200', icon: FileText },
      'operational-summary': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Bot },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const getStatusBadge = (status: AISummary['status']) => {
    const statusConfig = {
      generated: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      reviewed: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
      approved: { color: 'bg-green-100 text-green-800 border-green-200' },
      archived: { color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredSummaries = summaries.filter(summary => {
    const matchesSearch = summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.keyInsights.some(insight => insight.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || summary.type === typeFilter;
    
    return matchesSearch && matchesType;
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
            AI Clinical Summaries
          </h1>
          <p className="text-slate-600">AI-powered insights and analysis for clinical decision making</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={loadAISummaries} className="border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Summary
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate AI Summary</DialogTitle>
                <DialogDescription>
                  Configure parameters for AI-generated clinical summary.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Summary Type</Label>
                  <Select value={newSummary.type} onValueChange={(value: any) => setNewSummary({ ...newSummary, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient-summary">Patient Summary</SelectItem>
                      <SelectItem value="clinical-insights">Clinical Insights</SelectItem>
                      <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
                      <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                      <SelectItem value="operational-summary">Operational Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select value={newSummary.timeframe} onValueChange={(value) => setNewSummary({ ...newSummary, timeframe: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7-days">Last 7 days</SelectItem>
                      <SelectItem value="30-days">Last 30 days</SelectItem>
                      <SelectItem value="90-days">Last 90 days</SelectItem>
                      <SelectItem value="6-months">Last 6 months</SelectItem>
                      <SelectItem value="1-year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="focus">Focus Area (Optional)</Label>
                  <Textarea
                    id="focus"
                    value={newSummary.focus}
                    onChange={(e) => setNewSummary({ ...newSummary, focus: e.target.value })}
                    placeholder="Specific areas to focus on in the analysis..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateSummary} disabled={generating}>
                  {generating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Summaries', value: summaries.length.toString(), color: 'from-blue-500 to-pink-500', icon: Bot },
          { title: 'Avg Confidence', value: `${Math.round(summaries.reduce((acc, s) => acc + s.confidence, 0) / summaries.length)}%`, color: 'from-blue-500 to-pink-500', icon: Brain },
          { title: 'Pending Review', value: summaries.filter(s => s.status === 'generated').length.toString(), color: 'from-blue-500 to-yellow-500', icon: Clock },
          { title: 'Approved', value: summaries.filter(s => s.status === 'approved').length.toString(), color: 'from-blue-500 to-green-500', icon: Sparkles },
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
                  placeholder="Search summaries by title, content, or insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 glass-input"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="patient-summary">Patient Summary</SelectItem>
                <SelectItem value="clinical-insights">Clinical Insights</SelectItem>
                <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
                <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                <SelectItem value="operational-summary">Operational Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summaries List */}
      <div className="space-y-6">
        {filteredSummaries.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Bot className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No AI summaries found</h3>
                <p className="text-slate-500">Try adjusting your filters or generate a new summary.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredSummaries.map((summary) => (
            <Card key={summary.id} className="glass-card">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">{summary.title}</h3>
                      {getTypeBadge(summary.type)}
                      {getStatusBadge(summary.status)}
                      <Badge className="bg-gradient-to-r from-blue-100 to-pink-100 text-blue-800 border border-blue-200">
                        <Brain className="h-3 w-3 mr-1" />
                        {summary.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{new Date(summary.generatedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Bot className="h-4 w-4 mr-2 text-pink-500" />
                        <span>{summary.generatedBy}</span>
                      </div>
                      {summary.timeframe && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{summary.timeframe}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-xl">
                      <FileText className="h-4 w-4 mr-1" />
                      View Full
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50 rounded-xl">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-slate-700 leading-relaxed">{summary.content}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                      Key Insights
                    </h4>
                    <ul className="space-y-2">
                      {summary.keyInsights.map((insight, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-pink-600" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {summary.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
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