import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { patientService } from '../../services/patient.service';
import type { Patient } from '../../types/patient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; patient: Patient | null }>({ open: false, patient: null });

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const result = await patientService.getPatients({
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setPatients(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: 'all' | 'active' | 'inactive') => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleViewPatient = (patient: Patient) => {
    navigate(`/dashboard/admin/patients/${patient.id}`);
  };

  const handleCreatePatient = () => {
    navigate('/dashboard/admin/patients/new');
  };

  const handleEditPatient = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/patients/${patient.id}/edit`);
  };

  const handleDeletePatient = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, patient });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.patient) return;
    try {
      await patientService.deletePatient(deleteDialog.patient.id);
      toast.success('Patient deleted');
      setDeleteDialog({ open: false, patient: null });
      fetchPatients();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete patient');
    }
  };

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
        <span className={`badge ${patient.isActive ? 'badge-success' : 'badge-danger'}`}>
          {patient.isActive ? 'Active' : 'Inactive'}
        </span>
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
            onClick={(_e) => handleViewPatient(patient)}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleEditPatient(e, patient)}
            className="p-1 text-secondary-600 hover:text-secondary-900"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleDeletePatient(e, patient)}
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
        title="Patients"
        subtitle={`${total} patients found`}
        action={
          <button onClick={handleCreatePatient} className="btn-primary">
            <Plus className="h-4 w-4" /> New Patient
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Patients' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search patients by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value as 'all' | 'active' | 'inactive')} className="input w-40">
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

      {loading ? (
        <LoadingState message="Loading patients..." />
      ) : patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="Get started by adding a new patient."
          action={<button onClick={handleCreatePatient} className="btn-primary">Add Patient</button>}
        />
      ) : (
        <DataTable
          columns={columns}
          data={patients}
          loading={loading}
          onRowClick={handleViewPatient}
          emptyMessage="No patients found"
          rowKey={(patient) => patient.id}
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

      {deleteDialog.open && deleteDialog.patient && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, patient: null })}
          onConfirm={confirmDelete}
          title="Delete Patient"
          message={`Are you sure you want to delete ${deleteDialog.patient.firstName} ${deleteDialog.patient.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}