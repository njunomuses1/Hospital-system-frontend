import type { Patient, Appointment, Prescription, Doctor, DashboardStats } from '@/types';

// Mock data for development when backend is not available
export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    contact: '+1234567890',
    address: '123 Main St, City, State',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 28,
    gender: 'Female',
    contact: '+1234567891',
    address: '456 Oak Ave, City, State',
    medicalHistory: 'Asthma',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    age: 52,
    gender: 'Male',
    contact: '+1234567892',
    address: '789 Pine Rd, City, State',
    medicalHistory: 'Heart Disease, High Cholesterol',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    name: 'Emily Davis',
    age: 41,
    gender: 'Female',
    contact: '+1234567893',
    address: '321 Elm St, City, State',
    medicalHistory: 'Migraine, Anxiety',
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Williams',
    specialization: 'Cardiology',
    contact: '+1234560001',
    email: 'sarah.williams@hospital.com',
  },
  {
    id: '2',
    name: 'Dr. Michael Brown',
    specialization: 'General Medicine',
    contact: '+1234560002',
    email: 'michael.brown@hospital.com',
  },
  {
    id: '3',
    name: 'Dr. Lisa Anderson',
    specialization: 'Neurology',
    contact: '+1234560003',
    email: 'lisa.anderson@hospital.com',
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialization: 'Orthopedics',
    contact: '+1234560004',
    email: 'james.wilson@hospital.com',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '1',
    doctorName: 'Dr. Sarah Williams',
    date: '2024-10-25',
    time: '10:00',
    reason: 'Regular checkup for hypertension',
    status: 'Scheduled',
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Smith',
    doctorId: '2',
    doctorName: 'Dr. Michael Brown',
    date: '2024-10-24',
    time: '14:30',
    reason: 'Asthma follow-up',
    status: 'Scheduled',
    createdAt: '2024-01-21T09:30:00Z',
    updatedAt: '2024-01-21T09:30:00Z',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Robert Johnson',
    doctorId: '1',
    doctorName: 'Dr. Sarah Williams',
    date: '2024-10-20',
    time: '11:00',
    reason: 'Cardiac consultation',
    status: 'Completed',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T11:30:00Z',
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Emily Davis',
    doctorId: '3',
    doctorName: 'Dr. Lisa Anderson',
    date: '2024-10-26',
    time: '15:00',
    reason: 'Migraine treatment',
    status: 'Scheduled',
    createdAt: '2024-01-22T12:00:00Z',
    updatedAt: '2024-01-22T12:00:00Z',
  },
];

export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '1',
    doctorName: 'Dr. Sarah Williams',
    diagnosis: 'Hypertension',
    medications: 'Lisinopril 10mg - Once daily, Amlodipine 5mg - Once daily',
    instructions: 'Take medications with food. Monitor blood pressure daily.',
    date: '2024-10-20',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Smith',
    doctorId: '2',
    doctorName: 'Dr. Michael Brown',
    diagnosis: 'Acute Asthma Exacerbation',
    medications: 'Albuterol inhaler - As needed, Fluticasone 250mcg - Twice daily',
    instructions: 'Use rescue inhaler for breathing difficulty. Avoid allergens.',
    date: '2024-10-18',
    createdAt: '2024-01-18T15:00:00Z',
    updatedAt: '2024-01-18T15:00:00Z',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Robert Johnson',
    doctorId: '1',
    doctorName: 'Dr. Sarah Williams',
    diagnosis: 'High Cholesterol',
    medications: 'Atorvastatin 20mg - Once daily at bedtime',
    instructions: 'Follow low-cholesterol diet. Exercise regularly. Recheck lipids in 3 months.',
    date: '2024-10-20',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: 124,
  totalAppointments: 48,
  activePrescriptions: 87,
  todayAppointments: 12,
};






