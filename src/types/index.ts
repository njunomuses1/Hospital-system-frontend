export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address: string;
  medicalHistory: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contact: string;
  email: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  date: string;
  time: string;
  reason: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  diagnosis: string;
  medications: string;
  instructions: string;
  date: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  activePrescriptions: number;
  todayAppointments: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export type CreatePatientDTO = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePatientDTO = Partial<CreatePatientDTO>;

export type CreateAppointmentDTO = Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'patientName' | 'doctorName'>;
export type UpdateAppointmentDTO = Partial<CreateAppointmentDTO>;

export type CreatePrescriptionDTO = Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'patientName' | 'doctorName'>;
export type UpdatePrescriptionDTO = Partial<CreatePrescriptionDTO>;






