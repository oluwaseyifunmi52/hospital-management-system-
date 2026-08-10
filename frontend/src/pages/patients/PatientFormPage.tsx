import { useState } from 'react';
import { PatientForm } from './PatientForm';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patient.service';
import type { Patient } from '../../types/patient';
import { z } from 'zod';
import toast from 'react-hot-toast';

const patientFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  bloodGroup: z.string().optional(),
  genotype: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  nextOfKin: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

export function PatientFormPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/dashboard/admin/patients');
  };

  const handleSubmit = async (data: PatientFormData) => {
    setLoading(true);
    try {
      const patientData: Partial<Patient> = {
        ...data,
        allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()) : [],
      };
      await patientService.createPatient(patientData);
      toast.success('Patient created successfully');
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientForm
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}