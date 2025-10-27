import axios, { AxiosError } from 'axios';
import type {
  Patient,
  CreatePatientDTO,
  UpdatePatientDTO,
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  Prescription,
  CreatePrescriptionDTO,
  UpdatePrescriptionDTO,
  Doctor,
  DashboardStats,
  ApiResponse,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    return axiosError.response?.data?.detail || axiosError.response?.data?.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

// Patient API
export const patientApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<ApiResponse<Patient[]>>('/patients');
    return response.data.data;
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  },

  create: async (data: CreatePatientDTO): Promise<Patient> => {
    const response = await api.post<ApiResponse<Patient>>('/patients', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdatePatientDTO): Promise<Patient> => {
    const response = await api.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};

// Appointment API
export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments');
    return response.data.data;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data.data;
  },

  create: async (data: CreateAppointmentDTO): Promise<Appointment> => {
    const response = await api.post<ApiResponse<Appointment>>('/appointments', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateAppointmentDTO): Promise<Appointment> => {
    const response = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};

// Prescription API
export const prescriptionApi = {
  getAll: async (): Promise<Prescription[]> => {
    const response = await api.get<ApiResponse<Prescription[]>>('/prescriptions');
    return response.data.data;
  },

  getById: async (id: string): Promise<Prescription> => {
    const response = await api.get<ApiResponse<Prescription>>(`/prescriptions/${id}`);
    return response.data.data;
  },

  getByPatient: async (patientId: string): Promise<Prescription[]> => {
    const response = await api.get<ApiResponse<Prescription[]>>(`/prescriptions/patient/${patientId}`);
    return response.data.data;
  },

  create: async (data: CreatePrescriptionDTO): Promise<Prescription> => {
    const response = await api.post<ApiResponse<Prescription>>('/prescriptions', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdatePrescriptionDTO): Promise<Prescription> => {
    const response = await api.put<ApiResponse<Prescription>>(`/prescriptions/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/prescriptions/${id}`);
  },
};

// Doctor API
export const doctorApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await api.get<ApiResponse<Doctor[]>>('/doctors');
    return response.data.data;
  },

  getById: async (id: string): Promise<Doctor> => {
    const response = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return response.data.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  },
};

export default api;






