import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { doctorService } from '../../services/doctor.service';
import type { DoctorProfile, AvailabilityStatus } from '../../types/doctor';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import toast from 'react-hot-toast';

export function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AvailabilityStatus>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; doctor: DoctorProfile | null }>({ open: false, doctor: null });

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const result = await doctorService.getDoctors({
        page,
        limit: 10,
        search: searchQuery,
        department: departmentFilter === 'all' ? undefined : departmentFilter,
        status: statusFilter === 'all' ? undefined : statusFilter as AvailabilityStatus,
      });
      setDoctors(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, departmentFilter, statusFilter]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value: 'all' | AvailabilityStatus) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleViewDoctor = (doctor: DoctorProfile) => {
    navigate(`/dashboard/admin/doctors/${doctor.id}`);
  };

  const handleCreateDoctor = () => {
    navigate('/dashboard/admin/doctors/new');
  };

  const handleEditDoctor = (e: React.MouseEvent, doctor: DoctorProfile) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/doctors/${doctor.id}/edit`);
  };

  const handleDeleteDoctor = (e: React.MouseEvent, doctor: DoctorProfile) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, doctor });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.doctor) return;
    try {
      // await doctorService.deleteDoctor(deleteDialog.doctor.id); // Not implemented yet
      toast.success('Doctor deleted');
      setDeleteDialog({ open: false, doctor: null });
      fetchDoctors();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete doctor');
    }
  };

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
          <svg className="h-4 w-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDoctor(doctor)}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleEditDoctor(e, doctor)}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleDeleteDoctor(e, doctor)}
            className="p-1 text-danger-600 hover:text-danger-900"
            title="Delete"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        subtitle={`${total} doctors found`}
        action={
          <button onClick={handleCreateDoctor} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Doctor
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Doctors' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={departmentFilter} onChange={(e) => handleDepartmentChange(e.target.value)} className="input w-48">
            <option value="all">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Emergency Medicine">Emergency Medicine</option>
            <option value="Internal Medicine">Internal Medicine</option>
          </select>
          <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value as 'all' | AvailabilityStatus)} className="input w-40">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="off_duty">Off Duty</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading doctors..." />
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="Get started by adding a new doctor."
          action={<button onClick={handleCreateDoctor} className="btn-primary">Add Doctor</button>}
        />
      ) : (
        <DataTable
          columns={columns}
          data={doctors}
          loading={loading}
          onRowClick={handleViewDoctor}
          emptyMessage="No doctors found"
          rowKey={(doctor) => doctor.id}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline btn-sm"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {deleteDialog.open && deleteDialog.doctor && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, doctor: null })}
          onConfirm={confirmDelete}
          title="Delete Doctor"
          message={`Are you sure you want to delete Dr. ${deleteDialog.doctor.firstName} ${deleteDialog.doctor.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}