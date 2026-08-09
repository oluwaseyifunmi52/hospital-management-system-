import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Patient } from '../../types/patient';

const patientSchema = z.object({
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

type PatientForm = z.infer<typeof patientSchema>;

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientForm) => void;
  patient?: Patient | null;
  loading?: boolean;
}

export function PatientForm({ isOpen, onClose, onSubmit, patient, loading }: PatientFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
    if (patient) {
      reset({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email || '',
        address: patient.address || '',
        emergencyContact: patient.emergencyContact || '',
        emergencyPhone: patient.emergencyPhone || '',
        bloodGroup: patient.bloodGroup || '',
        genotype: patient.genotype || '',
        allergies: patient.allergies?.join(', ') || '',
        medicalHistory: patient.medicalHistory || '',
        insuranceProvider: patient.insuranceProvider || '',
        insurancePolicyNumber: patient.insurancePolicyNumber || '',
        nextOfKin: patient.nextOfKin || '',
        nextOfKinPhone: patient.nextOfKinPhone || '',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        phone: '',
        email: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        bloodGroup: '',
        genotype: '',
        allergies: '',
        medicalHistory: '',
        insuranceProvider: '',
        insurancePolicyNumber: '',
        nextOfKin: '',
        nextOfKinPhone: '',
      });
    }
  }, [patient, reset]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">{patient ? 'Edit Patient' : 'New Patient'}</h3>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input {...register('firstName')} className={`input ${errors.firstName ? 'input-error' : ''}`} />
              {errors.firstName && <p className="mt-1 text-sm text-danger-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="label">Last Name</label>
              <input {...register('lastName')} className={`input ${errors.lastName ? 'input-error' : ''}`} />
              {errors.lastName && <p className="mt-1 text-sm text-danger-600">{errors.lastName.message}</p>}
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input type="date" {...register('dateOfBirth')} className={`input ${errors.dateOfBirth ? 'input-error' : ''}`} />
              {errors.dateOfBirth && <p className="mt-1 text-sm text-danger-600">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <label className="label">Gender</label>
              <select {...register('gender')} className={`input ${errors.gender ? 'input-error' : ''}`}>
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-sm text-danger-600">{errors.gender.message}</p>}
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" {...register('phone')} className={`input ${errors.phone ? 'input-error' : ''}`} />
              {errors.phone && <p className="mt-1 text-sm text-danger-600">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" {...register('email')} className={`input ${errors.email ? 'input-error' : ''}`} />
              {errors.email && <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Address</label>
              <input {...register('address')} className="input" />
            </div>
            <div>
              <label className="label">Emergency Contact</label>
              <input {...register('emergencyContact')} className="input" />
            </div>
            <div>
              <label className="label">Emergency Phone</label>
              <input type="tel" {...register('emergencyPhone')} className="input" />
            </div>
            <div>
              <label className="label">Blood Group</label>
              <select {...register('bloodGroup')} className="input">
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="label">Genotype</label>
              <select {...register('genotype')} className="input">
                <option value="">Select...</option>
                <option value="AA">AA</option>
                <option value="AS">AS</option>
                <option value="SS">SS</option>
                <option value="AC">AC</option>
                <option value="SC">SC</option>
              </select>
            </div>
            <div>
              <label className="label">Allergies (comma-separated)</label>
              <input {...register('allergies')} className="input" placeholder="Penicillin, Peanuts" />
            </div>
            <div>
              <label className="label">Medical History</label>
              <input {...register('medicalHistory')} className="input" />
            </div>
            <div>
              <label className="label">Insurance Provider</label>
              <input {...register('insuranceProvider')} className="input" />
            </div>
            <div>
              <label className="label">Insurance Policy Number</label>
              <input {...register('insurancePolicyNumber')} className="input" />
            </div>
            <div>
              <label className="label">Next of Kin</label>
              <input {...register('nextOfKin')} className="input" />
            </div>
            <div>
              <label className="label">Next of Kin Phone</label>
              <input type="tel" {...register('nextOfKinPhone')} className="input" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-secondary-200">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : patient ? 'Update Patient' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
