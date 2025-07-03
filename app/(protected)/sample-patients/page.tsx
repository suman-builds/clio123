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
import {
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Heart,
  Activity,
  User,
  Shuffle,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { ExportCSVButton } from './export-csv';

interface SamplePatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalConditions: string[];
  allergies: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insuranceProvider: string;
  lastVisit?: string;
  nextAppointment?: string;
  notes?: string;
}

export default function SamplePatientsPage() {
  const { profile } = useAuth();
  const [patients, setPatients] = useState<SamplePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateCount, setGenerateCount] = useState(10);

  useEffect(() => {
    loadSamplePatients();
  }, [profile]);

  const loadSamplePatients = async () => {
    try {
      // Mock sample patient data
      const mockPatients: SamplePatient[] = [
        {
          id: '1',
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice.johnson@email.com',
          phone: '+1-555-0201',
          dateOfBirth: '1985-03-15',
          gender: 'Female',
          address: '123 Maple Street, Springfield, IL 62701',
          medicalConditions: ['Hypertension', 'Type 2 Diabetes'],
          allergies: ['Penicillin', 'Shellfish'],
          medications: ['Metformin 500mg', 'Lisinopril 10mg'],
          emergencyContact: {
            name: 'Robert Johnson',
            phone: '+1-555-0301',
            relationship: 'Spouse',
          },
          insuranceProvider: 'Blue Cross Blue Shield',
          lastVisit: '2024-01-10',
          nextAppointment: '2024-02-15',
          notes: 'Patient is compliant with medication regimen. Blood sugar levels well controlled.',
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@email.com',
          phone: '+1-555-0202',
          dateOfBirth: '1978-11-22',
          gender: 'Male',
          address: '456 Oak Avenue, Chicago, IL 60601',
          medicalConditions: ['Asthma', 'Seasonal Allergies'],
          allergies: ['Pollen', 'Dust mites'],
          medications: ['Albuterol inhaler', 'Claritin 10mg'],
          emergencyContact: {
            name: 'Lisa Chen',
            phone: '+1-555-0302',
            relationship: 'Wife',
          },
          insuranceProvider: 'Aetna',
          lastVisit: '2024-01-08',
          nextAppointment: '2024-03-01',
          notes: 'Asthma well controlled with current medication. Recommend annual flu vaccination.',
        },
        {
          id: '3',
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@email.com',
          phone: '+1-555-0203',
          dateOfBirth: '1992-07-08',
          gender: 'Female',
          address: '789 Pine Road, Milwaukee, WI 53201',
          medicalConditions: ['Migraine', 'Anxiety'],
          allergies: ['Latex'],
          medications: ['Sumatriptan 50mg', 'Sertraline 25mg'],
          emergencyContact: {
            name: 'David Williams',
            phone: '+1-555-0303',
            relationship: 'Brother',
          },
          insuranceProvider: 'Cigna',
          lastVisit: '2024-01-12',
          notes: 'Migraine frequency has decreased with current treatment plan.',
        },
        {
          id: '4',
          firstName: 'James',
          lastName: 'Rodriguez',
          email: 'james.rodriguez@email.com',
          phone: '+1-555-0204',
          dateOfBirth: '1965-12-03',
          gender: 'Male',
          address: '321 Elm Street, Detroit, MI 48201',
          medicalConditions: ['Coronary Artery Disease', 'High Cholesterol'],
          allergies: ['Aspirin'],
          medications: ['Atorvastatin 20mg', 'Clopidogrel 75mg'],
          emergencyContact: {
            name: 'Maria Rodriguez',
            phone: '+1-555-0304',
            relationship: 'Wife',
          },
          insuranceProvider: 'Medicare',
          lastVisit: '2024-01-05',
          nextAppointment: '2024-02-05',
          notes: 'Cardiac function stable. Continue current medication regimen.',
        },
        {
          id: '5',
          firstName: 'Emma',
          lastName: 'Thompson',
          email: 'emma.thompson@email.com',
          phone: '+1-555-0205',
          dateOfBirth: '1988-09-18',
          gender: 'Female',
          address: '654 Birch Lane, Minneapolis, MN 55401',
          medicalConditions: ['Hypothyroidism'],
          allergies: ['Iodine'],
          medications: ['Levothyroxine 75mcg'],
          emergencyContact: {
            name: 'John Thompson',
            phone: '+1-555-0305',
            relationship: 'Husband',
          },
          insuranceProvider: 'UnitedHealthcare',
          lastVisit: '2024-01-14',
          nextAppointment: '2024-04-14',
          notes: 'Thyroid levels within normal range. Continue current dosage.',
        },
      ];

      setPatients(mockPatients);
    } catch (error) {
      console.error('Error loading sample patients:', error);
      toast.error('Failed to load sample patients');
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPatients = async () => {
    try {
      const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
      const conditions = ['Hypertension', 'Diabetes', 'Asthma', 'Arthritis', 'Depression', 'Anxiety', 'Migraine', 'COPD'];
      const allergies = ['Penicillin', 'Pollen', 'Shellfish', 'Nuts', 'Latex', 'Dust mites', 'Pet dander'];
      const insuranceProviders = ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Medicare', 'Medicaid'];

      const newPatients: SamplePatient[] = [];

      for (let i = 0; i < generateCount; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const gender = Math.random() > 0.5 ? 'Male' : 'Female';
        
        const patient: SamplePatient = {
          id: `generated-${Date.now()}-${i}`,
          firstName,
          lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          dateOfBirth: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
          gender,
          address: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'Maple'][Math.floor(Math.random() * 5)]} Street, City, State 12345`,
          medicalConditions: conditions.slice(0, Math.floor(Math.random() * 3) + 1),
          allergies: allergies.slice(0, Math.floor(Math.random() * 2) + 1),
          medications: [`Medication ${i + 1}`, `Medication ${i + 2}`],
          emergencyContact: {
            name: `Emergency Contact ${i + 1}`,
            phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
            relationship: ['Spouse', 'Parent', 'Sibling', 'Child'][Math.floor(Math.random() * 4)],
          },
          insuranceProvider: insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)],
          notes: `Generated sample patient for testing purposes.`,
        };

        newPatients.push(patient);
      }

      setPatients(prev => [...newPatients, ...prev]);
      setIsGenerateDialogOpen(false);
      toast.success(`Generated ${generateCount} sample patients`);
    } catch (error) {
      console.error('Error generating patients:', error);
      toast.error('Failed to generate sample patients');
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;
    
    return matchesSearch && matchesGender;
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
            Sample Patients
          </h1>
          <p className="text-slate-600">Demo patient data for testing and development</p>
        </div>
        <div className="flex items-center space-x-4">
          <ExportCSVButton patients={patients} />
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Patients
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Sample Patients</DialogTitle>
                <DialogDescription>
                  Generate random sample patient data for testing purposes.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="count">Number of Patients</Label>
                  <Select value={generateCount.toString()} onValueChange={(value) => setGenerateCount(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 patients</SelectItem>
                      <SelectItem value="10">10 patients</SelectItem>
                      <SelectItem value="25">25 patients</SelectItem>
                      <SelectItem value="50">50 patients</SelectItem>
                      <SelectItem value="100">100 patients</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={generateRandomPatients}>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Patients', value: patients.length.toString(), color: 'from-blue-500 to-pink-500', icon: Users },
          { title: 'Male Patients', value: patients.filter(p => p.gender === 'Male').length.toString(), color: 'from-blue-500 to-pink-500', icon: User },
          { title: 'Female Patients', value: patients.filter(p => p.gender === 'Female').length.toString(), color: 'from-blue-500 to-pink-500', icon: User },
          { title: 'Avg Age', value: Math.round(patients.reduce((sum, p) => sum + calculateAge(p.dateOfBirth), 0) / patients.length || 0).toString(), color: 'from-blue-500 to-pink-500', icon: Calendar },
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
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 glass-input"
                />
              </div>
            </div>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full sm:w-48 glass-input">
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full">
            <Card className="glass-card">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Users className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No patients found</h3>
                  <p className="text-slate-500">Try adjusting your filters or generate sample patients.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="glass-card group">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-pink-500 text-white">
                      {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                        {patient.gender}
                      </Badge>
                      <Badge className="bg-pink-100 text-pink-800 border border-pink-200">
                        Age {calculateAge(patient.dateOfBirth)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-4 w-4 mr-2 text-pink-500" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{patient.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-pink-500" />
                    <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                </div>

                {patient.medicalConditions.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-sm font-medium text-slate-700">Medical Conditions</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {patient.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-red-100 text-red-800 border border-red-200">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {patient.allergies.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
                      <span className="text-sm font-medium text-slate-700">Allergies</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-2xl p-4 border border-blue-200">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Insurance:</span>
                      <span className="font-medium text-slate-900">{patient.insuranceProvider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Emergency Contact:</span>
                      <span className="font-medium text-slate-900">{patient.emergencyContact.name}</span>
                    </div>
                    {patient.lastVisit && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Visit:</span>
                        <span className="font-medium text-slate-900">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {patient.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                    <p className="text-sm text-blue-800">{patient.notes}</p>
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