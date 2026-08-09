import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download, Bed, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { admissionService } from '../../services/admission.service';
import type { Ward } from '../../types/admission';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import toast from 'react-hot-toast';

export function Wards() {
  const navigate = useNavigate();
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; ward: Ward | null }>({ open: false, ward: null });

  const fetchWards = useCallback(async () => {
    try {
      setLoading(true);
      const result = await admissionService.getWards({
        page,
        limit: 10,
        search: searchQuery,
      });
      setWards(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load wards');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleViewWard = (ward: Ward) => {
    navigate(`/dashboard/admin/wards/${ward.id}`);
  };

  const handleCreateWard = () => {
    navigate('/dashboard/admin/wards/new');
  };

  const handleEditWard = (e: React.MouseEvent, ward: Ward) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/wards/${ward.id}/edit`);
  };

  const handleDeleteWard = (e: React.MouseEvent, ward: Ward) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, ward });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.ward) return;
    try {
      // await admissionService.deleteWard(deleteDialog.ward.id);
      toast.success('Ward deleted');
      setDeleteDialog({ open: false, ward: null });
      fetchWards();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete ward');
    }
  };

  const columns = [
    { key: 'name', header: 'Ward Name' },
    { key: 'code', header: 'Code' },
    { key: 'floor', header: 'Floor' },
    { key: 'departmentId', header: 'Department' },
    {
      key: 'beds',
      header: 'Beds',
      render: (ward: Ward) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">{ward.availableBeds}</span>
            <span className="text-secondary-400">/</span>
            <span className="font-medium text-secondary-900">{ward.totalBeds}</span>
          </div>
          <span className="text-sm text-secondary-500">({ward.totalRooms} rooms)</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (ward: Ward) => <StatusBadge status={ward.isActive ? 'active' : 'inactive'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (ward: Ward) => (
        <div className="flex items-center gap-2">
          <button onClick={(_e) => handleViewWard(ward)} className="p-1 text-secondary-600 hover:text-secondary-900" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleEditWard(e, ward)} className="p-1 text-secondary-600 hover:text-secondary-900" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleDeleteWard(e, ward)} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wards"
        subtitle={`${total} wards found`}
        action={
          <button onClick={handleCreateWard} className="btn-primary">
            <Plus className="h-4 w-4" /> New Ward
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Wards' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search wards..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button className="btn-outline btn-sm"><Filter className="h-4 w-4" /> Filter</button>
          <button className="btn-outline btn-sm"><Download className="h-4 w-4" /> Export</button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading wards..." />
      ) : wards.length === 0 ? (
        <EmptyState
          title="No wards found"
          description="Get started by creating a new ward."
          action={<button onClick={handleCreateWard} className="btn-primary">Create Ward</button>}
        />
      ) : (
        <>
          <DataTable columns={columns} data={wards} loading={loading} onRowClick={handleViewWard} emptyMessage="No wards found" rowKey={(ward) => ward.id} />
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

      {deleteDialog.open && deleteDialog.ward && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, ward: null })}
          onConfirm={confirmDelete}
          title="Delete Ward"
          message={`Are you sure you want to delete ${deleteDialog.ward.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}