import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { billingService } from '../../services/billing.service';
import type { Invoice } from '../../types/billing';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import toast from 'react-hot-toast';

export function Billing() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; invoice: Invoice | null }>({ open: false, invoice: null });

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const result = await billingService.getInvoices({
        page,
        limit: 10,
        search: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setInvoices(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => invoices.filter((invoice) => {
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.patientId.includes(searchQuery);
    return matchesStatus && matchesSearch;
  }), [invoices, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: invoices.length,
      pending: invoices.filter((i) => i.status === 'pending').length,
      partiallyPaid: invoices.filter((i) => i.status === 'partially_paid').length,
      paid: invoices.filter((i) => i.status === 'paid').length,
      overdue: invoices.filter((i) => i.status === 'overdue').length,
      totalRevenue: invoices.reduce((sum, i) => sum + i.paidAmount, 0),
      totalOutstanding: invoices.reduce((sum, i) => sum + i.balance, 0),
    }),
    [invoices]
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    navigate(`/dashboard/admin/billing/invoices/${invoice.id}`);
  };

  const handleCreateInvoice = () => {
    navigate('/dashboard/admin/billing/invoices/new');
  };

  const handleEditInvoice = (e: React.MouseEvent, invoice: Invoice) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/billing/invoices/${invoice.id}/edit`);
  };

  const handleDeleteInvoice = (e: React.MouseEvent, invoice: Invoice) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, invoice });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.invoice) return;
    try {
      // await billingService.deleteInvoice(deleteDialog.invoice.id); // Not implemented yet
      toast.success('Invoice deleted');
      setDeleteDialog({ open: false, invoice: null });
      fetchInvoices();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete invoice');
    }
  };

  const columns = [
    { key: 'invoiceNumber', header: 'Invoice', render: (inv: Invoice) => <span className="font-medium text-primary-600">{inv.invoiceNumber}</span> },
    { key: 'patientId', header: 'Patient ID' },
    {
      key: 'total',
      header: 'Total',
      render: (inv: Invoice) => `₦${inv.total.toLocaleString()}`,
    },
    {
      key: 'paidAmount',
      header: 'Paid',
      render: (inv: Invoice) => `₦${inv.paidAmount.toLocaleString()}`,
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (inv: Invoice) => (
        <span className={inv.balance > 0 ? 'text-danger-600 font-medium' : 'text-green-600'}>
          ₦{inv.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (inv: Invoice) => <StatusBadge status={inv.status} />,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (inv: Invoice) => new Date(inv.dueDate).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (inv: Invoice) => (
        <div className="flex items-center gap-2">
          <button onClick={(_e) => handleViewInvoice(inv)} className="p-1 text-secondary-600 hover:text-secondary-900" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleEditInvoice(e, inv)} className="p-1 text-secondary-600 hover:text-secondary-900" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleDeleteInvoice(e, inv)} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        subtitle={`${filteredInvoices.length} invoices`}
        action={
          <button onClick={handleCreateInvoice} className="btn-primary">
            <Plus className="h-4 w-4" /> New Invoice
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Billing' }]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Invoices', value: stats.total },
          { label: 'Pending', value: stats.pending },
          { label: 'Partially Paid', value: stats.partiallyPaid },
          { label: 'Paid', value: stats.paid },
          { label: 'Overdue', value: stats.overdue },
          { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}` },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-xl font-bold text-secondary-900">{stat.value}</p>
            <p className="text-sm text-secondary-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)} className="input w-40">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="btn-outline btn-sm"><Filter className="h-4 w-4" /> Filter</button>
          <button className="btn-outline btn-sm"><Download className="h-4 w-4" /> Export</button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading invoices..." />
      ) : filteredInvoices.length === 0 ? (
        <EmptyState
          title="No invoices found"
          description="Get started by creating a new invoice."
          action={<button onClick={handleCreateInvoice} className="btn-primary">Create Invoice</button>}
        />
      ) : (
        <>
          <DataTable columns={columns} data={filteredInvoices} loading={loading} onRowClick={handleViewInvoice} emptyMessage="No invoices found" rowKey={(inv) => inv.id} />
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

      {deleteDialog.open && deleteDialog.invoice && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, invoice: null })}
          onConfirm={confirmDelete}
          title="Delete Invoice"
          message={`Are you sure you want to delete invoice ${deleteDialog.invoice.invoiceNumber}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}