import { useState, useMemo } from 'react';
import { Plus, Search, Package, AlertTriangle, Filter, Download } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import type { Medicine, Prescription } from '../../types/pharmacy';

interface PharmacyProps {
  onCreateMedicine: () => void;
  onViewMedicine: (medicine: Medicine) => void;
  onCreatePrescription: () => void;
}

export function Pharmacy({ onCreateMedicine, onViewMedicine, onCreatePrescription }: PharmacyProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'prescriptions'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading] = useState(false);

  const mockMedicines = useMemo<Medicine[]>(
    () => [
      { id: '1', name: 'Paracetamol', genericName: 'Acetaminophen', brand: 'Panadol', category: 'Pain Relief', dosageForm: 'Tablet', strength: '500mg', unit: 'pack', price: 500, costPrice: 300, reorderLevel: 100, quantity: 250, isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
      { id: '2', name: 'Amoxicillin', genericName: 'Amoxicillin', brand: 'Amoxil', category: 'Antibiotic', dosageForm: 'Capsule', strength: '500mg', unit: 'pack', price: 1200, costPrice: 800, reorderLevel: 50, quantity: 120, isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
      { id: '3', name: 'Metformin', genericName: 'Metformin', brand: 'Glucophage', category: 'Antidiabetic', dosageForm: 'Tablet', strength: '850mg', unit: 'pack', price: 1500, costPrice: 1000, reorderLevel: 30, quantity: 15, isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
      { id: '4', name: 'Lisinopril', genericName: 'Lisinopril', brand: 'Zestril', category: 'Antihypertensive', dosageForm: 'Tablet', strength: '10mg', unit: 'pack', price: 2000, costPrice: 1400, reorderLevel: 20, quantity: 0, isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    ],
    []
  );

  const mockPrescriptions = useMemo<Prescription[]>(
    () => [
      { id: '1', prescriptionNumber: 'RX-001', patientId: '1', doctorId: '1', date: '2024-06-15', medications: [], status: 'pending', createdAt: '2024-06-15' },
      { id: '2', prescriptionNumber: 'RX-002', patientId: '2', doctorId: '1', date: '2024-06-14', medications: [], status: 'dispensed', dispensedAt: '2024-06-14', createdAt: '2024-06-14' },
      { id: '3', prescriptionNumber: 'RX-003', patientId: '3', doctorId: '2', date: '2024-06-13', medications: [], status: 'approved', createdAt: '2024-06-13' },
    ],
    []
  );

  const lowStockMedicines = mockMedicines.filter((m) => m.quantity <= m.reorderLevel);
  const filteredMedicines = mockMedicines.filter((m) => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const inventoryColumns = [
    {
      key: 'name',
      header: 'Medicine',
      render: (med: Medicine) => (
        <div>
          <p className="font-medium text-secondary-900">{med.name}</p>
          <p className="text-sm text-secondary-500">{med.genericName} • {med.brand}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category' },
    { key: 'dosageForm', header: 'Form' },
    { key: 'strength', header: 'Strength' },
    {
      key: 'quantity',
      header: 'Stock',
      render: (med: Medicine) => (
        <div className="flex items-center gap-2">
          <span className={med.quantity <= med.reorderLevel ? 'text-danger-600 font-medium' : ''}>{med.quantity}</span>
          {med.quantity <= med.reorderLevel && <AlertTriangle className="h-4 w-4 text-danger-500" />}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (med: Medicine) => `₦${med.price.toLocaleString()}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (med: Medicine) => <StatusBadge status={med.isActive ? 'active' : 'inactive'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (med: Medicine) => (
        <button onClick={(e) => { e.stopPropagation(); onViewMedicine(med); }} className="text-secondary-600 hover:text-secondary-900 text-sm font-medium">
          View
        </button>
      ),
    },
  ];

  const prescriptionColumns = [
    { key: 'prescriptionNumber', header: 'RX Number', render: (rx: Prescription) => <span className="font-medium text-primary-600">{rx.prescriptionNumber}</span> },
    { key: 'patientId', header: 'Patient ID' },
    { key: 'doctorId', header: 'Doctor' },
    {
      key: 'date',
      header: 'Date',
      render: (rx: Prescription) => new Date(rx.date).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (rx: Prescription) => <StatusBadge status={rx.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pharmacy"
        subtitle={activeTab === 'inventory' ? `${filteredMedicines.length} medicines` : `${mockPrescriptions.length} prescriptions`}
        action={
          <div className="flex items-center gap-2">
            {activeTab === 'inventory' ? (
              <button onClick={onCreateMedicine} className="btn-primary">
                <Plus className="h-4 w-4" /> Add Medicine
              </button>
            ) : (
              <button onClick={onCreatePrescription} className="btn-primary">
                <Plus className="h-4 w-4" /> New Prescription
              </button>
            )}
          </div>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Pharmacy' }]}
      />

      {lowStockMedicines.length > 0 && activeTab === 'inventory' && (
        <div className="card p-4 border-l-4 border-l-danger-500 bg-danger-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-danger-600" />
            <p className="text-sm font-medium text-danger-800">
              {lowStockMedicines.length} medicine(s) are low in stock and need restocking.
            </p>
          </div>
        </div>
      )}

      <div className="flex rounded-lg border border-secondary-300 overflow-hidden w-fit">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'inventory' ? 'bg-primary-50 text-primary-700' : 'bg-white text-secondary-600'}`}
        >
          <Package className="h-4 w-4 inline mr-2" /> Inventory
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'prescriptions' ? 'bg-primary-50 text-primary-700' : 'bg-white text-secondary-600'}`}
        >
          Prescriptions
        </button>
      </div>

      {activeTab === 'inventory' && (
        <>
          <div className="card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <button className="btn-outline btn-sm"><Filter className="h-4 w-4" /> Filter</button>
              <button className="btn-outline btn-sm"><Download className="h-4 w-4" /> Export</button>
            </div>
          </div>
          <DataTable columns={inventoryColumns} data={filteredMedicines} loading={loading} onRowClick={onViewMedicine} emptyMessage="No medicines found" rowKey={(med) => med.id} />
        </>
      )}

      {activeTab === 'prescriptions' && (
        <DataTable columns={prescriptionColumns} data={mockPrescriptions} loading={loading} emptyMessage="No prescriptions found" rowKey={(rx) => rx.id} />
      )}
    </div>
  );
}
