import { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import type { Staff } from '../../types/staff';

interface StaffProps {
  onCreateStaff: () => void;
  onViewStaff: (staff: Staff) => void;
}

export function StaffPage({ onCreateStaff, onViewStaff }: StaffProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading] = useState(false);

  const mockStaff = useMemo<Staff[]>(
    () => [
      {
        id: '1',
        email: 'nurse.ade@hospital.com',
        firstName: 'Adebayo',
        lastName: 'Okafor',
        phone: '+234 801 111 1111',
        role: 'nurse',
        status: 'active',
        departmentId: '1',
        position: 'Senior Nurse',
        dateOfJoining: '2022-03-15',
        isVerified: true,
        isActive: true,
        createdAt: '2022-03-15',
        updatedAt: '2022-03-15',
      },
      {
        id: '2',
        email: 'pharm.bello@hospital.com',
        firstName: 'Fatima',
        lastName: 'Bello',
        phone: '+234 802 222 2222',
        role: 'pharmacist',
        status: 'active',
        departmentId: '2',
        position: 'Chief Pharmacist',
        dateOfJoining: '2021-07-20',
        isVerified: true,
        isActive: true,
        createdAt: '2021-07-20',
        updatedAt: '2021-07-20',
      },
      {
        id: '3',
        email: 'lab.tech@hospital.com',
        firstName: 'Emeka',
        lastName: 'Nnamdi',
        phone: '+234 803 333 3333',
        role: 'lab_technician',
        status: 'on_leave',
        departmentId: '3',
        position: 'Lab Technician',
        dateOfJoining: '2023-01-10',
        isVerified: true,
        isActive: true,
        createdAt: '2023-01-10',
        updatedAt: '2023-01-10',
      },
      {
        id: '4',
        email: 'receptionist@hospital.com',
        firstName: 'Chidinma',
        lastName: 'Eze',
        phone: '+234 804 444 4444',
        role: 'receptionist',
        status: 'active',
        position: 'Senior Receptionist',
        dateOfJoining: '2022-09-05',
        isVerified: true,
        isActive: true,
        createdAt: '2022-09-05',
        updatedAt: '2022-09-05',
      },
    ],
    []
  );

  const filteredStaff = mockStaff.filter((staff) => {
    const matchesSearch =
      !searchQuery ||
      `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (staff: Staff) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
            {staff.firstName[0]}{staff.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-secondary-900">{staff.firstName} {staff.lastName}</p>
            <p className="text-sm text-secondary-500">{staff.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (staff: Staff) => <span className="capitalize">{staff.role.replace('_', ' ')}</span>,
    },
    { key: 'position', header: 'Position' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'status',
      header: 'Status',
      render: (staff: Staff) => <StatusBadge status={staff.status} />,
    },
    {
      key: 'dateOfJoining',
      header: 'Joined',
      render: (staff: Staff) => (staff.dateOfJoining ? new Date(staff.dateOfJoining).toLocaleDateString() : 'N/A'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (staff: Staff) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewStaff(staff);
          }}
          className="text-secondary-600 hover:text-secondary-900 text-sm font-medium"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        subtitle={`${filteredStaff.length} staff members`}
        action={
          <button onClick={onCreateStaff} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Staff
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Staff' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input w-40">
            <option value="all">All Roles</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="lab_technician">Lab Technician</option>
            <option value="radiologist">Radiologist</option>
            <option value="accountant">Accountant</option>
            <option value="receptionist">Receptionist</option>
            <option value="hr">HR</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredStaff}
        loading={loading}
        onRowClick={onViewStaff}
        emptyMessage="No staff found"
        rowKey={(staff) => staff.id}
      />
    </div>
  );
}
