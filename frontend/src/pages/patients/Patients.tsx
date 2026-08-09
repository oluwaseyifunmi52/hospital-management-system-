import { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, Edit, Archive, UserPlus } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import type { Patient } from '../../types/patient';

interface PatientsProps {
  onViewPatient: (patient: Patient) => void;
  onCreatePatient: () => void;
}

export function Patients({ onViewPatient, onCreatePatient }: PatientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading] = useState(false);

  const mockPatients = useMemo<Patient[]>(
    () => [
      { id: '1', patientId: 'PAT-001', firstName: 'John', lastName: 'Doe', dateOfBirth: '1985-03-15', gender: 'male', phone: '+234 801 234 5678', bloodGroup: 'O+', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
      { id: '2', patientId: 'PAT-002', firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1990-07-22', gender: 'female', phone: '+234 802 345 6789', bloodGroup: 'A+', isActive: true, createdAt: '2024-02-20', updatedAt: '2024-02-20' },
      { id: '3', patientId: 'PAT-003', firstName: 'Ahmed', lastName: 'Ibrahim', dateOfBirth: '1978-11-05', gender: 'male', phone: '+234 803 456 7890', bloodGroup: 'B+', isActive: true, createdAt: '2024-03-10', updatedAt: '2024-03-10' },
      { id: '4', patientId: 'PAT-004', firstName: 'Fatima', lastName: 'Mohammed', dateOfBirth: '1995-05-30', gender: 'female', phone: '+234 804 567 8901', bloodGroup: 'AB+', isActive: true, createdAt: '2024-04-05', updatedAt: '2024-04-05' },
      { id: '5', patientId: 'PAT-005', firstName: 'Oluwaseun', lastName: 'Adeyemi', dateOfBirth: '1982-09-12', gender: 'male', phone: '+234 805 678 9012', bloodGroup: 'O-', isActive: false, createdAt: '2024-05-18', updatedAt: '2024-05-18' },
    ],
    []
  );

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      !searchQuery ||
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? patient.isActive : !patient.isActive);
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'patientId', header: 'Patient ID', sortable: true },
    { key: 'firstName', header: 'Name', render: (patient: Patient) => `${patient.firstName} ${patient.lastName}` },
    { key: 'gender', header: 'Gender' },
    { key: 'phone', header: 'Phone' },
    { key: 'bloodGroup', header: 'Blood Group' },
    {
      key: 'isActive',
      header: 'Status',
      render: (patient: Patient) => (
        <StatusBadge status={patient.isActive ? 'active' : 'inactive'} />
      ),
    },
    {
      key: 'createdAt',
      header: 'Registered',
      render: (patient: Patient) => new Date(patient.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (patient: Patient) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewPatient(patient);
            }}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="Archive"
          >
            <Archive className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        subtitle={`${filteredPatients.length} patients found`}
        action={
          <button onClick={onCreatePatient} className="btn-primary">
            <UserPlus className="h-4 w-4" /> New Patient
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Patients' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search patients by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn-outline btn-sm">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="btn-outline btn-sm">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredPatients}
        loading={loading}
        onRowClick={onViewPatient}
        emptyMessage="No patients found"
        rowKey={(patient) => patient.id}
      />
    </div>
  );
}
