import { useState } from 'react';
import { PatientForm } from './PatientForm';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patient.service';
import toast from 'react-hot-toast';

export function PatientFormPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/dashboard/admin/patients');
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await patientService.createPatient(data);
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