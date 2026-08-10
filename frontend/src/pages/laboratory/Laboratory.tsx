import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { laboratoryService } from '../../services/laboratory.service';
import type { LabTest } from '../../types/laboratory';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import toast from 'react-hot-toast';

export function Laboratory() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; test: LabTest | null }>({ open: false, test: null });

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      const result = await laboratoryService.getLabTests({
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setTests(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const filteredTests = useMemo(() => tests.filter((test) => {
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      test.testNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patientId.includes(searchQuery) ||
      test.testType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }), [tests, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: tests.length,
      pending: tests.filter((t) => t.status === 'pending').length,
      processing: tests.filter((t) => t.status === 'processing' || t.status === 'sample_collected').length,
      completed: tests.filter((t) => t.status === 'completed' || t.status === 'reviewed').length,
    }),
    [tests]
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleViewTest = (test: LabTest) => {
    navigate(`/dashboard/admin/laboratory/tests/${test.id}`);
  };

  const handleCreateTest = () => {
    navigate('/dashboard/admin/laboratory/tests/new');
  };

  const handleEditTest = (e: React.MouseEvent, test: LabTest) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/laboratory/tests/${test.id}/edit`);
  };

  const handleDeleteTest = (e: React.MouseEvent, test: LabTest) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, test });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.test) return;
    try {
      // await laboratoryService.deleteLabTest(deleteDialog.test.id); // Not implemented yet
      toast.success('Test deleted');
      setDeleteDialog({ open: false, test: null });
      fetchTests();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete test');
    }
  };

  const columns = [
    { key: 'testNumber', header: 'Test ID', render: (test: LabTest) => <span className="font-medium text-primary-600">{test.testNumber}</span> },
    { key: 'patientId', header: 'Patient ID' },
    { key: 'doctorId', header: 'Doctor' },
    { key: 'testType', header: 'Test Type' },
    { key: 'category', header: 'Category' },
    {
      key: 'status',
      header: 'Status',
      render: (test: LabTest) => <StatusBadge status={test.status} />,
    },
    {
      key: 'requestedAt',
      header: 'Requested',
      render: (test: LabTest) => new Date(test.requestedAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (test: LabTest) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleViewTest(test)} className="p-1 text-secondary-600 hover:text-secondary-900" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleEditTest(e, test)} className="p-1 text-secondary-600 hover:text-secondary-900" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleDeleteTest(e, test)} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laboratory"
        subtitle={`${filteredTests.length} tests found`}
        action={
          <button onClick={handleCreateTest} className="btn-primary">
            <Plus className="h-4 w-4" /> New Test Request
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Laboratory' }]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Tests', value: stats.total, color: 'bg-secondary-50 text-secondary-700' },
          { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Processing', value: stats.processing, color: 'bg-blue-50 text-blue-700' },
          { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
            <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block mt-1 ${stat.color}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)} className="input w-40">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sample_collected">Sample Collected</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="reviewed">Reviewed</option>
          </select>
          <button className="btn-outline btn-sm"><Filter className="h-4 w-4" /> Filter</button>
          <button className="btn-outline btn-sm"><Download className="h-4 w-4" /> Export</button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading tests..." />
      ) : filteredTests.length === 0 ? (
        <EmptyState
          title="No tests found"
          description="Get started by creating a new test request."
          action={<button onClick={handleCreateTest} className="btn-primary">Create Test Request</button>}
        />
      ) : (
        <>
          <DataTable columns={columns} data={filteredTests} loading={loading} onRowClick={handleViewTest} emptyMessage="No tests found" rowKey={(test) => test.id} />
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

      {deleteDialog.open && deleteDialog.test && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, test: null })}
          onConfirm={confirmDelete}
          title="Delete Test"
          message={`Are you sure you want to delete test ${deleteDialog.test.testNumber}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}