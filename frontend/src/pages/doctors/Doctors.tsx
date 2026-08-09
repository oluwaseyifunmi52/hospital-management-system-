import { useState, useMemo } from 'react';
import { Plus, Search, Star } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import type { DoctorProfile } from '../../types/doctor';

interface DoctorsProps {
  onCreateDoctor: () => void;
  onViewDoctor: (doctor: DoctorProfile) => void;
}

export function Doctors({ onCreateDoctor, onViewDoctor }: DoctorsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [loading] = useState(false);

  const mockDoctors = useMemo<DoctorProfile[]>(
    () => [
      {
        id: '1',
        userId: '1',
        firstName: 'James',
        lastName: 'Smith',
        email: 'dr.smith@hospital.com',
        phone: '+234 801 111 1111',
        title: 'Dr.',
        specialty: 'Cardiology',
        department: 'Cardiology',
        licenseNumber: 'MD-12345',
        yearsExperience: 15,
        qualifications: ['MBBS', 'MD Cardiology'],
        certifications: ['Board Certified Cardiologist'],
        expertise: ['Heart Failure', 'Hypertension'],
        languages: ['English', 'Spanish'],
        bio: 'Experienced cardiologist with 15 years of practice.',
        services: [{ id: '1', name: 'Consultation', fee: 15000, duration: 30, isActive: true }],
        consultationFee: 15000,
        inPersonConsultation: true,
        videoConsultation: true,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: { start: '08:00', end: '17:00' },
        availabilityStatus: 'available',
        rating: 4.8,
        reviewCount: 120,
        isProfileComplete: true,
        isActive: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      },
      {
        id: '2',
        userId: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'dr.johnson@hospital.com',
        phone: '+234 802 222 2222',
        title: 'Dr.',
        specialty: 'Pediatrics',
        department: 'Pediatrics',
        licenseNumber: 'MD-67890',
        yearsExperience: 10,
        qualifications: ['MBBS', 'MD Pediatrics'],
        certifications: ['Board Certified Pediatrician'],
        expertise: ['Child Care', 'Vaccination'],
        languages: ['English', 'French'],
        bio: 'Dedicated pediatrician specializing in child healthcare.',
        services: [{ id: '2', name: 'Consultation', fee: 12000, duration: 30, isActive: true }],
        consultationFee: 12000,
        inPersonConsultation: true,
        videoConsultation: false,
        workingDays: ['Monday', 'Wednesday', 'Friday'],
        workingHours: { start: '09:00', end: '16:00' },
        availabilityStatus: 'busy',
        rating: 4.9,
        reviewCount: 85,
        isProfileComplete: true,
        isActive: true,
        createdAt: '2024-02-20',
        updatedAt: '2024-02-20',
      },
    ],
    []
  );

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      !searchQuery ||
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || doctor.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const columns = [
    {
      key: 'name',
      header: 'Doctor',
      render: (doctor: DoctorProfile) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
            {doctor.firstName[0]}{doctor.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-secondary-900">{doctor.title} {doctor.firstName} {doctor.lastName}</p>
            <p className="text-sm text-secondary-500">{doctor.specialty}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', header: 'Department' },
    {
      key: 'rating',
      header: 'Rating',
      render: (doctor: DoctorProfile) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">{doctor.rating}</span>
          <span className="text-sm text-secondary-500">({doctor.reviewCount})</span>
        </div>
      ),
    },
    {
      key: 'availabilityStatus',
      header: 'Status',
      render: (doctor: DoctorProfile) => <StatusBadge status={doctor.availabilityStatus} />,
    },
    {
      key: 'consultationFee',
      header: 'Fee',
      render: (doctor: DoctorProfile) => `₦${(doctor.consultationFee ?? 0).toLocaleString()}`,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (doctor: DoctorProfile) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDoctor(doctor);
          }}
          className="text-secondary-600 hover:text-secondary-900 text-sm font-medium"
        >
          View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        subtitle={`${filteredDoctors.length} doctors found`}
        action={
          <button onClick={onCreateDoctor} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Doctor
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Doctors' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="input w-48">
            <option value="all">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredDoctors}
        loading={loading}
        onRowClick={onViewDoctor}
        emptyMessage="No doctors found"
        rowKey={(doctor) => doctor.id}
      />
    </div>
  );
}
