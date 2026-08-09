import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, UseFormRegister, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { doctorService } from '../../services/doctor.service';
import { Steps } from '../../components/ui/Steps';
import { DEPARTMENTS, MEDICAL_TITLES, COMMON_LANGUAGES, WORKING_DAYS } from '../../types/doctor';
import { Loader2, Camera, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  profilePhoto: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  title: z.string().min(1, 'Title is required'),
  specialty: z.string().min(2, 'Specialty is required'),
  department: z.string().min(1, 'Department is required'),
  licenseNumber: z.string().min(3, 'License number is required'),
  yearsExperience: z.number().min(0).max(60),
  qualifications: z.array(z.string()).min(1, 'Add at least one qualification'),
  certifications: z.array(z.string()),
  expertise: z.array(z.string()).min(1, 'Add at least one area of expertise'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  bio: z.string().max(500),
  consultationFee: z.number().min(0),
  inPersonConsultation: z.boolean(),
  videoConsultation: z.boolean(),
  workingDays: z.array(z.string()).min(1, 'Select at least one working day'),
  workingHoursStart: z.string().min(1),
  workingHoursEnd: z.string().min(1),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface PersonalStepProps {
  formValues: ProfileForm;
  register: UseFormRegister<ProfileForm>;
  errors: FieldErrors<ProfileForm>;
}

interface ProfessionalStepProps {
  formValues: ProfileForm;
  register: UseFormRegister<ProfileForm>;
  errors: FieldErrors<ProfileForm>;
  newQualification: string;
  setNewQualification: (value: string) => void;
  newCertification: string;
  setNewCertification: (value: string) => void;
  newExpertise: string;
  setNewExpertise: (value: string) => void;
  addListItem: (field: 'qualifications' | 'certifications' | 'expertise', value: string, setter: (v: string) => void) => void;
  removeListItem: (field: 'qualifications' | 'certifications' | 'expertise', index: number) => void;
  toggleLanguage: (lang: string) => void;
}

interface TagInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  items: string[];
  field: 'qualifications' | 'certifications' | 'expertise';
  addListItem: (field: 'qualifications' | 'certifications' | 'expertise', value: string, setter: (v: string) => void) => void;
  removeListItem: (field: 'qualifications' | 'certifications' | 'expertise', index: number) => void;
  error?: string;
  variant?: 'primary' | 'secondary' | 'info';
}

interface ServicesStepProps {
  register: UseFormRegister<ProfileForm>;
}

interface AvailabilityStepProps {
  formValues: ProfileForm;
  register: UseFormRegister<ProfileForm>;
  toggleWorkingDay: (day: string) => void;
}

const STEPS = [
  { label: 'Personal', description: 'Basic info' },
  { label: 'Professional', description: 'Credentials' },
  { label: 'Services', description: 'Fees & types' },
  { label: 'Availability', description: 'Schedule' },
];

export function ProfileSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newQualification, setNewQualification] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newExpertise, setNewExpertise] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      email: user?.email || '',
      title: '',
      specialty: '',
      department: '',
      licenseNumber: '',
      yearsExperience: 0,
      qualifications: [],
      certifications: [],
      expertise: [],
      languages: ['English'],
      bio: '',
      consultationFee: 0,
      inPersonConsultation: true,
      videoConsultation: false,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await doctorService.getProfile();
        if (profile) {
          reset({
            firstName: profile.firstName || user?.firstName || '',
            lastName: profile.lastName || user?.lastName || '',
            phone: profile.phone || user?.phone || '',
            email: profile.email || user?.email || '',
            title: profile.title || '',
            specialty: profile.specialty || '',
            department: profile.department || '',
            licenseNumber: profile.licenseNumber || '',
            yearsExperience: profile.yearsExperience || 0,
            qualifications: profile.qualifications || [],
            certifications: profile.certifications || [],
            expertise: profile.expertise || [],
            languages: profile.languages || ['English'],
            bio: profile.bio || '',
            consultationFee: profile.consultationFee || 0,
            inPersonConsultation: profile.inPersonConsultation ?? true,
            videoConsultation: profile.videoConsultation ?? false,
            workingDays: profile.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            workingHoursStart: profile.workingHours?.start || '09:00',
            workingHoursEnd: profile.workingHours?.end || '17:00',
          });
        }
      } catch {
        // no profile yet, use defaults
      }
    }
    loadProfile();
  }, [user, reset]);

  const formValues = watch();

  const addListItem = (field: 'qualifications' | 'certifications' | 'expertise', value: string, setter: (v: string) => void) => {
    if (value.trim() && !formValues[field].includes(value.trim())) {
      setValue(field, [...formValues[field], value.trim()]);
      setter('');
    }
  };

  const removeListItem = (field: 'qualifications' | 'certifications' | 'expertise', index: number) => {
    setValue(field, formValues[field].filter((_: string, i: number) => i !== index));
  };

  const toggleLanguage = (lang: string) => {
    const current = formValues.languages;
    if (current.includes(lang)) {
      setValue('languages', current.filter(l => l !== lang));
    } else {
      setValue('languages', [...current, lang]);
    }
  };

  const toggleWorkingDay = (day: string) => {
    const current = formValues.workingDays;
    if (current.includes(day)) {
      setValue('workingDays', current.filter(d => d !== day));
    } else {
      setValue('workingDays', [...current, day]);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof ProfileForm> = [];
    if (currentStep === 0) fieldsToValidate = ['firstName', 'lastName', 'phone', 'email'];
    if (currentStep === 1) fieldsToValidate = ['title', 'specialty', 'department', 'licenseNumber', 'yearsExperience', 'qualifications', 'expertise', 'languages'];
    if (currentStep === 2) fieldsToValidate = ['consultationFee'];
    if (currentStep === 3) fieldsToValidate = ['workingDays', 'workingHoursStart', 'workingHoursEnd'];

    const valid = await trigger(fieldsToValidate);
    if (valid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await doctorService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        title: data.title,
        specialty: data.specialty,
        department: data.department,
        licenseNumber: data.licenseNumber,
        yearsExperience: data.yearsExperience,
        qualifications: data.qualifications,
        certifications: data.certifications,
        expertise: data.expertise,
        languages: data.languages,
        bio: data.bio,
        consultationFee: data.consultationFee,
        inPersonConsultation: data.inPersonConsultation,
        videoConsultation: data.videoConsultation,
        workingDays: data.workingDays,
        workingHours: { start: data.workingHoursStart, end: data.workingHoursEnd },
      });
      toast.success('Profile setup complete!');
      navigate('/dashboard/doctor');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">Complete Your Professional Profile</h1>
          <p className="mt-1 text-secondary-500">Set up your profile to start receiving patients</p>
        </div>
        <div className="mb-8">
          <Steps steps={STEPS} currentStep={currentStep} />
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 0 && <PersonalStep formValues={formValues} register={register} errors={errors} />}
            {currentStep === 1 && (
              <ProfessionalStep
                formValues={formValues}
                register={register}
                errors={errors}
                newQualification={newQualification}
                setNewQualification={setNewQualification}
                newCertification={newCertification}
                setNewCertification={setNewCertification}
                newExpertise={newExpertise}
                setNewExpertise={setNewExpertise}
                addListItem={addListItem}
                removeListItem={removeListItem}
                toggleLanguage={toggleLanguage}
              />
            )}
            {currentStep === 2 && <ServicesStep register={register} />}
            {currentStep === 3 && (
              <AvailabilityStep
                formValues={formValues}
                register={register}
                toggleWorkingDay={toggleWorkingDay}
              />
            )}
            <div className="flex justify-between mt-8 pt-6 border-t border-secondary-200">
              {currentStep > 0 ? (
                <button type="button" onClick={prevStep} className="btn-outline">Previous</button>
              ) : <div />}
              {currentStep < STEPS.length - 1 ? (
                <button type="button" onClick={nextStep} className="btn-primary">Next</button>
              ) : (
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Saving...</span>
                  ) : 'Complete Setup'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function PersonalStep({ formValues, register, errors }: PersonalStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-medium">
            {formValues.firstName?.[0]}{formValues.lastName?.[0]}
          </div>
          <button type="button" className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <p className="font-medium text-secondary-900">Profile Photo</p>
          <p className="text-sm text-secondary-500">Upload a professional photo</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      <div>
        <label className="label">Email</label>
        <input {...register('email')} type="email" className={`input ${errors.email ? 'input-error' : ''}`} />
        {errors.email && <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="label">Phone</label>
        <input {...register('phone')} type="tel" className={`input ${errors.phone ? 'input-error' : ''}`} />
        {errors.phone && <p className="mt-1 text-sm text-danger-600">{errors.phone.message}</p>}
      </div>
    </div>
  );
}

function ProfessionalStep({ formValues, register, errors, newQualification, setNewQualification, newCertification, setNewCertification, newExpertise, setNewExpertise, addListItem, removeListItem, toggleLanguage }: ProfessionalStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Title</label>
          <select {...register('title')} className={`input ${errors.title ? 'input-error' : ''}`}>
            <option value="">Select...</option>
            {MEDICAL_TITLES.map((t: string) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.title && <p className="mt-1 text-sm text-danger-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="label">Specialty</label>
          <input {...register('specialty')} placeholder="e.g. Cardiology" className={`input ${errors.specialty ? 'input-error' : ''}`} />
          {errors.specialty && <p className="mt-1 text-sm text-danger-600">{errors.specialty.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Department</label>
          <select {...register('department')} className={`input ${errors.department ? 'input-error' : ''}`}>
            <option value="">Select...</option>
            {DEPARTMENTS.map((d: string) => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.department && <p className="mt-1 text-sm text-danger-600">{errors.department.message}</p>}
        </div>
        <div>
          <label className="label">Medical License Number</label>
          <input {...register('licenseNumber')} placeholder="e.g. MD-12345" className={`input ${errors.licenseNumber ? 'input-error' : ''}`} />
          {errors.licenseNumber && <p className="mt-1 text-sm text-danger-600">{errors.licenseNumber.message}</p>}
        </div>
      </div>
      <div>
        <label className="label">Years of Experience</label>
        <input {...register('yearsExperience', { valueAsNumber: true })} type="number" min={0} max={60} className={`input w-32 ${errors.yearsExperience ? 'input-error' : ''}`} />
      </div>
      <TagInput label="Qualifications" placeholder="e.g. MBBS, MD" value={newQualification} onChange={setNewQualification} items={formValues.qualifications} field="qualifications" addListItem={addListItem} removeListItem={removeListItem} error={errors.qualifications?.message} />
      <TagInput label="Certifications (optional)" placeholder="e.g. Board Certified Cardiologist" value={newCertification} onChange={setNewCertification} items={formValues.certifications} field="certifications" addListItem={addListItem} removeListItem={removeListItem} variant="secondary" />
      <TagInput label="Areas of Expertise" placeholder="e.g. Heart failure management" value={newExpertise} onChange={setNewExpertise} items={formValues.expertise} field="expertise" addListItem={addListItem} removeListItem={removeListItem} error={errors.expertise?.message} variant="info" />
      <div>
        <label className="label">Languages</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_LANGUAGES.map((lang: string) => (
            <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${formValues.languages.includes(lang) ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-secondary-200 text-secondary-600 hover:bg-secondary-50'}`}>
              {lang}
            </button>
          ))}
        </div>
        {errors.languages && <p className="mt-1 text-sm text-danger-600">{errors.languages.message}</p>}
      </div>
      <div>
        <label className="label">About / Biography</label>
        <textarea {...register('bio')} rows={4} placeholder="Tell patients about your experience and approach to care..." className="input resize-none" />
        <p className="mt-1 text-xs text-secondary-400">{formValues.bio?.length || 0}/500 characters</p>
      </div>
    </div>
  );
}

function TagInput({ label, placeholder, value, onChange, items, field, addListItem, removeListItem, error, variant = 'primary' }: TagInputProps) {
  const badgeClass = variant === 'secondary' ? 'badge-secondary' : variant === 'info' ? 'badge-info' : 'badge-primary';
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input flex-1"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addListItem(field, value, onChange); } }} />
        <button type="button" onClick={() => addListItem(field, value, onChange)} className="btn-outline"><Plus className="h-4 w-4" /></button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item: string, i: number) => (
          <span key={i} className={`${badgeClass} gap-1`}>
            {item}
            <button type="button" onClick={() => removeListItem(field, i)}><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  );
}

function ServicesStep({ register }: ServicesStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="label">Consultation Fee</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">$</span>
          <input {...register('consultationFee', { valueAsNumber: true })} type="number" min={0} className="input pl-8 w-48" />
        </div>
      </div>
      <div className="space-y-3">
        <label className="label">Consultation Types</label>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-secondary-200 cursor-pointer hover:bg-secondary-50">
          <input type="checkbox" {...register('inPersonConsultation')} className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
          <div>
            <p className="text-sm font-medium text-secondary-900">In-Person Consultation</p>
            <p className="text-xs text-secondary-500">See patients at the hospital/clinic</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-secondary-200 cursor-pointer hover:bg-secondary-50">
          <input type="checkbox" {...register('videoConsultation')} className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
          <div>
            <p className="text-sm font-medium text-secondary-900">Video Consultation</p>
            <p className="text-xs text-secondary-500">Consult with patients via video call</p>
          </div>
        </label>
      </div>
    </div>
  );
}

function AvailabilityStep({ formValues, register, toggleWorkingDay }: AvailabilityStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="label">Working Days</label>
        <div className="flex flex-wrap gap-2">
          {WORKING_DAYS.map((day: string) => (
            <button key={day} type="button" onClick={() => toggleWorkingDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${formValues.workingDays.includes(day) ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-secondary-200 text-secondary-600 hover:bg-secondary-50'}`}>
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
        {formValues.workingDays.length === 0 && <p className="mt-1 text-sm text-danger-600">Select at least one working day</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Start Time</label>
          <input {...register('workingHoursStart')} type="time" className="input" />
        </div>
        <div>
          <label className="label">End Time</label>
          <input {...register('workingHoursEnd')} type="time" className="input" />
        </div>
      </div>
      <div className="p-4 rounded-lg bg-secondary-50 border border-secondary-200">
        <p className="text-sm font-medium text-secondary-700 mb-1">Availability Status</p>
        <p className="text-sm text-secondary-500">Your initial status will be set to &quot;Available&quot;. You can change this anytime from your profile.</p>
      </div>
    </div>
  );
}
