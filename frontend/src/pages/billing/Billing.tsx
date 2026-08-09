import { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import type { Invoice } from '../../types/billing';

interface BillingProps {
  onCreateInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export function Billing({ onCreateInvoice, onViewInvoice }: BillingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading] = useState(false);

  const mockInvoices = useMemo<Invoice[]>(
    () => [
      { id: '1', invoiceNumber: 'INV-001', patientId: '1', issueDate: '2024-06-15', dueDate: '2024-06-30', subtotal: 50000, tax: 7500, discount: 0, total: 57500, paidAmount: 57500, balance: 0, status: 'paid', items: [], createdBy: '1', createdAt: '2024-06-15', updatedAt: '2024-06-15' },
      { id: '2', invoiceNumber: 'INV-002', patientId: '2', issueDate: '2024-06-14', dueDate: '2024-06-29', subtotal: 35000, tax: 5250, discount: 2000, total: 38250, paidAmount: 20000, balance: 18250, status: 'partially_paid', items: [], createdBy: '1', createdAt: '2024-06-14', updatedAt: '2024-06-14' },
      { id: '3', invoiceNumber: 'INV-003', patientId: '3', issueDate: '2024-06-13', dueDate: '2024-06-28', subtotal: 120000, tax: 18000, discount: 0, total: 138000, paidAmount: 0, balance: 138000, status: 'pending', items: [], createdBy: '2', createdAt: '2024-06-13', updatedAt: '2024-06-13' },
      { id: '4', invoiceNumber: 'INV-004', patientId: '4', issueDate: '2024-06-10', dueDate: '2024-06-25', subtotal: 45000, tax: 6750, discount: 5000, total: 46750, paidAmount: 0, balance: 46750, status: 'overdue', items: [], createdBy: '1', createdAt: '2024-06-10', updatedAt: '2024-06-10' },
    ],
    []
  );

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.patientId.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const stats = useMemo(
    () => ({
      total: mockInvoices.length,
      pending: mockInvoices.filter((i) => i.status === 'pending').length,
      partiallyPaid: mockInvoices.filter((i) => i.status === 'partially_paid').length,
      paid: mockInvoices.filter((i) => i.status === 'paid').length,
      overdue: mockInvoices.filter((i) => i.status === 'overdue').length,
      totalRevenue: mockInvoices.reduce((sum, i) => sum + i.paidAmount, 0),
      totalOutstanding: mockInvoices.reduce((sum, i) => sum + i.balance, 0),
    }),
    [mockInvoices]
  );

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
        <button onClick={(e) => { e.stopPropagation(); onViewInvoice(inv); }} className="text-secondary-600 hover:text-secondary-900 text-sm font-medium">
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing"
        subtitle={`${filteredInvoices.length} invoices`}
        action={
          <button onClick={onCreateInvoice} className="btn-primary">
            <Plus className="h-4 w-4" /> New Invoice
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Billing' }]}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
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

      <DataTable columns={columns} data={filteredInvoices} loading={loading} onRowClick={onViewInvoice} emptyMessage="No invoices found" rowKey={(inv) => inv.id} />
    </div>
  );
}
