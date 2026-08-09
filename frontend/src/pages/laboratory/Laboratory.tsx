import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import type { LabTest } from '../../types/laboratory';

interface LaboratoryProps {
  onCreateTest: () => void;
  onViewTest: (test: LabTest) => void;
}

export function Laboratory({ onCreateTest, onViewTest }: LaboratoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading] = useState(false);

  const mockTests = useMemo<LabTest[]>(
    () => [
      { id: '1', testNumber: 'LAB-001', patientId: '1', doctorId: '1', testType: 'Complete Blood Count', category: 'Hematology', requestedAt: '2024-06-15', status: 'pending', createdAt: '2024-06-15', updatedAt: '2024-06-15' },
      { id: '2', testNumber: 'LAB-002', patientId: '2', doctorId: '1', testType: 'Blood Glucose', category: 'Biochemistry', requestedAt: '2024-06-15', sampleCollectedAt: '2024-06-15', status: 'sample_collected', createdAt: '2024-06-15', updatedAt: '2024-06-15' },
      { id: '3', testNumber: 'LAB-003', patientId: '3', doctorId: '2', testType: 'Urinalysis', category: 'Urine', requestedAt: '2024-06-14', sampleCollectedAt: '2024-06-14', status: 'processing', createdAt: '2024-06-14', updatedAt: '2024-06-14' },
      { id: '4', testNumber: 'LAB-004', patientId: '1', doctorId: '2', testType: 'X-Ray Chest', category: 'Radiology', requestedAt: '2024-06-13', status: 'completed', results: 'Normal', createdAt: '2024-06-13', updatedAt: '2024-06-13' },
      { id: '5', testNumber: 'LAB-005', patientId: '4', doctorId: '1', testType: 'Lipid Profile', category: 'Biochemistry', requestedAt: '2024-06-12', sampleCollectedAt: '2024-06-12', status: 'reviewed', results: 'Elevated cholesterol', createdAt: '2024-06-12', updatedAt: '2024-06-12' },
    ],
    []
  );

  const filteredTests = mockTests.filter((test) => {
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      test.testNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.patientId.includes(searchQuery) ||
      test.testType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = useMemo(
    () => ({
      total: mockTests.length,
      pending: mockTests.filter((t) => t.status === 'pending').length,
      processing: mockTests.filter((t) => t.status === 'processing' || t.status === 'sample_collected').length,
      completed: mockTests.filter((t) => t.status === 'completed' || t.status === 'reviewed').length,
    }),
    [mockTests]
  );

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
        <button onClick={(e) => { e.stopPropagation(); onViewTest(test); }} className="text-secondary-600 hover:text-secondary-900 text-sm font-medium">
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laboratory"
        subtitle={`${filteredTests.length} tests found`}
        action={
          <button onClick={onCreateTest} className="btn-primary">
            <Plus className="h-4 w-4" /> New Test Request
          </button>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Laboratory' }]}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sample_collected">Sample Collected</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="reviewed">Reviewed</option>
          </select>
          <button className="btn-outline btn-sm"><Filter className="h-4 w-4" /> Filter</button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredTests} loading={loading} onRowClick={onViewTest} emptyMessage="No tests found" rowKey={(test) => test.id} />
    </div>
  );
}
