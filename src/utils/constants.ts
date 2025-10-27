export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;

export const APPOINTMENT_STATUS = ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'] as const;

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

export const ROUTES = {
  DASHBOARD: '/',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
  PRESCRIPTIONS: '/prescriptions',
} as const;






