import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { medicalRecordService } from '../../services/medical-record.service';
import type { MedicalRecord } from '../../types/medical-record';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function MedicalRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; record: MedicalRecord | null }>({ open: false, record: null });

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const result = await medicalRecordService.getMedicalRecords({
        page,
        limit: 10,
        search: searchQuery,
      });
      setRecords(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load medical records');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleViewRecord = (record: MedicalRecord) => {
    navigate(`/dashboard/admin/medical-records/${record.id}`);
  };

  const handleCreateRecord = () => {
    navigate('/dashboard/admin/medical-records/new');
  };

  const handleEditRecord = (e: React.MouseEvent, record: MedicalRecord) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/medical-records/${record.id}/edit`);
  };

  const handleDeleteRecord = (e: React.MouseEvent, record: MedicalRecord) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, record });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.record) return;
    try {
      // await medicalRecordService.deleteMedicalRecord(deleteDialog.record.id);
      toast.success('Medical record deleted');
      setDeleteDialog({ open: false, record: null });
      fetchRecords();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete record');
    }
  };

  const columns = [
    { key: 'recordNumber', header: 'Record ID', render: (rec: MedicalRecord) => <span className="font-medium text-primary-600">{rec.recordNumber}</span> },
    { key: 'patientId', header: 'Patient ID' },
    { key: 'doctorId', header: 'Doctor' },
    { key: 'date', header: 'Date', render: (rec: MedicalRecord) => new Date(rec.date).toLocaleDateString() },
    {
      key: 'diagnosis',
      header: 'Diagnosis',
      render: (rec: MedicalRecord) => rec.diagnosis?.join(', ') || 'N/A',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (rec: MedicalRecord) => (
        <div className="flex items-center gap-2">
          <button onClick={(_e) => handleViewRecord(rec)} className="p-1 text-secondary-600 hover:text-secondary-900" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleEditRecord(e, rec)} className="p-1 text-secondary-600 hover:text-secondary-900" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleDeleteRecord(e, rec)} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical Records"
        subtitle={`${total} records found`}
        action={
          <button onClick={handleCreateRecord} className="btn-primary">
            <Plus className="h-4 w-4" /> New Record
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Medical Records' }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search medical records..."
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
        <LoadingState message="Loading medical records..." />
      ) : records.length === 0 ? (
        <EmptyState
          title="No medical records found"
          description="Get started by creating a new medical record."
          action={<button onClick={handleCreateRecord} className="btn-primary">Create Record</button>}
        />
      ) : (
        <>
          <DataTable columns={columns} data={records} loading={loading} onRowClick={handleViewRecord} emptyMessage="No medical records found" rowKey={(rec) => rec.id} />
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

      {deleteDialog.open && deleteDialog.record && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, record: null })}
          onConfirm={confirmDelete}
          title="Delete Medical Record"
          message={`Are you sure you want to delete record ${deleteDialog.record.recordNumber}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}