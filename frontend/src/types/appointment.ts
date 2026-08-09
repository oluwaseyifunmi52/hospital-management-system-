import type { AppointmentStatus } from './common';

export type { AppointmentStatus };

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  doctorId: string;
  departmentId?: string;
  branchId?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'consultation' | 'follow_up' | 'emergency' | 'checkup';
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface AppointmentFilter {
  date?: string;
  doctorId?: string;
  patientId?: string;
  departmentId?: string;
  status?: AppointmentStatus | 'all';
  type?: string;
  search?: string;
}
