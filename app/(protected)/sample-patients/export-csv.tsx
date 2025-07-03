'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/lib/csv-export';

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
    relationship: string;
    phone: string;
  };
  insuranceProvider: string;
  lastVisit?: string;
  nextAppointment?: string;
  notes?: string;
}

interface ExportCSVButtonProps {
  patients: SamplePatient[];
}

export function ExportCSVButton({ patients }: ExportCSVButtonProps) {
  const handleExport = () => {
    // Prepare data for CSV export with flattened structure
    const exportData = patients.map(patient => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      address: patient.address,
      medicalConditions: patient.medicalConditions.join('; '),
      allergies: patient.allergies.join('; '),
      medications: patient.medications.join('; '),
      emergencyContactName: patient.emergencyContact.name,
      emergencyContactRelationship: patient.emergencyContact.relationship,
      emergencyContactPhone: patient.emergencyContact.phone,
      insuranceProvider: patient.insuranceProvider,
      lastVisit: patient.lastVisit || '',
      nextAppointment: patient.nextAppointment || '',
      notes: patient.notes || ''
    }));

    // Define custom headers for better readability
    const headers = [
      'id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
      'address',
      'medicalConditions',
      'allergies',
      'medications',
      'emergencyContactName',
      'emergencyContactRelationship',
      'emergencyContactPhone',
      'insuranceProvider',
      'lastVisit',
      'nextAppointment',
      'notes'
    ];

    // Export to CSV
    exportToCSV(exportData, 'sample-patients.csv', headers);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport} 
      className="border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl"
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}