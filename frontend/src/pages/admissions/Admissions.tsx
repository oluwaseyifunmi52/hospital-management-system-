import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { admissionService } from '../../services/admission.service';
import type { Admission } from '../../types/admission';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import toast from 'react-hot-toast';

export function Admissions() {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; admission: Admission | null }>({ open: false, admission: null });

  const fetchAdmissions = useCallback(async () => {
    try {
      setLoading(true);
      const result = await admissionService.getAdmissions({
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setAdmissions(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load admissions');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchAdmissions();
  }, [fetchAdmissions]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleViewAdmission = (admission: Admission) => {
    navigate(`/dashboard/admin/admissions/${admission.id}`);
  };

  const handleCreateAdmission = () => {
    navigate('/dashboard/admin/admissions/new');
  };

  const handleEditAdmission = (e: React.MouseEvent, admission: Admission) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/admissions/${admission.id}/edit`);
  };

  const handleDeleteAdmission = (e: React.MouseEvent, admission: Admission) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, admission });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.admission) return;
    try {
      // await admissionService.deleteAdmission(deleteDialog.admission.id);
      toast.success('Admission deleted');
      setDeleteDialog({ open: false, admission: null });
      fetchAdmissions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete admission');
    }
  };

  const columns = [
    { key: 'admissionNumber', header: 'Admission ID', render: (adm: Admission) => <span className="font-medium text-primary-600">{adm.admissionNumber}</span> },
    { key: 'patientId', header: 'Patient ID' },
    { key: 'doctorId', header: 'Doctor' },
    { key: 'admissionDate', header: 'Admission Date', render: (adm: Admission) => new Date(adm.admissionDate).toLocaleDateString() },
    { key: 'status', header: 'Status', render: (adm: Admission) => <StatusBadge status={adm.status} /> },
    { key: 'wardId', header: 'Ward' },
    { key: 'bedId', header: 'Bed' },
    {
      key: 'actions',
      header: 'Actions',
      render: (adm: Admission) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleViewAdmission(adm)} className="p-1 text-secondary-600 hover:text-secondary-900" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleEditAdmission(e, adm)} className="p-1 text-secondary-600 hover:text-secondary-900" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleDeleteAdmission(e, adm)} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions"
        subtitle={`${total} admissions found`}
        action={
          <button onClick={handleCreateAdmission} className="btn-primary">
            <Plus className="h-4 w-4" /> New Admission
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Admissions' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search admissions..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)} className="input w-40">
            <option value="all">All Status</option>
            <option value="admitted">Admitted</option>
            <option value="transferred">Transferred</option>
            <option value="discharged">Discharged</option>
          </select>
          <button className="btn-outline btn-sm"><Filter className="h-4 w-4" /> Filter</button>
          <button className="btn-outline btn-sm"><Download className="h-4 w-4" /> Export</button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading admissions..." />
      ) : admissions.length === 0 ? (
        <EmptyState
          title="No admissions found"
          description="Get started by creating a new admission."
          action={<button onClick={handleCreateAdmission} className="btn-primary">Create Admission</button>}
        />
      ) : (
        <>
          <DataTable columns={columns} data={admissions} loading={loading} onRowClick={handleViewAdmission} emptyMessage="No admissions found" rowKey={(adm) => adm.id} />
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary-500">Page {page} of {totalPages} ({total} total)</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline btn-sm">Previous</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline btn-sm">Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {deleteDialog.open && deleteDialog.admission && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, admission: null })}
          onConfirm={confirmDelete}
          title="Delete Admission"
          message={`Are you sure you want to delete admission ${deleteDialog.admission.admissionNumber}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}