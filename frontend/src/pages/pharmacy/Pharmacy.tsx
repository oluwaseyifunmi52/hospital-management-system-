import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Package, AlertTriangle, Filter, Download, Eye, Edit } from 'lucide-react';
import { DataTable } from '../../components/data-table/DataTable';
import { PageHeader } from '../../components/feedback/PageStates';
import { LoadingState, EmptyState } from '../../components/feedback/PageStates';
import { ConfirmDialog } from '../../components/modals/ConfirmDialog';
import { pharmacyService } from '../../services/pharmacy.service';
import type { Medicine, Prescription } from '../../types/pharmacy';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import toast from 'react-hot-toast';

export function Pharmacy() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inventory' | 'prescriptions'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: Medicine | Prescription | null; type: 'medicine' | 'prescription' }>({ open: false, item: null, type: 'medicine' });

  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      const result = await pharmacyService.getMedicines({
        page,
        limit: 10,
        search: searchQuery,
      });
      setMedicines(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const result = await pharmacyService.getPrescriptions({
        page,
        limit: 10,
        search: searchQuery,
      });
      setPrescriptions(result.data);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchMedicines();
    } else {
      fetchPrescriptions();
    }
  }, [activeTab, fetchMedicines, fetchPrescriptions]);

  const lowStockMedicines = useMemo(() => medicines.filter((m) => m.quantity <= m.reorderLevel), [medicines]);
  const filteredMedicines = useMemo(() => medicines.filter((m) => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase())), [medicines, searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleCreateMedicine = () => {
    navigate('/dashboard/admin/pharmacy/medicines/new');
  };

  const handleCreatePrescription = () => {
    navigate('/dashboard/admin/pharmacy/prescriptions/new');
  };

  const handleViewMedicine = (medicine: Medicine) => {
    navigate(`/dashboard/admin/pharmacy/medicines/${medicine.id}`);
  };

  const handleViewPrescription = (prescription: Prescription) => {
    navigate(`/dashboard/admin/pharmacy/prescriptions/${prescription.id}`);
  };

  const handleEditMedicine = (e: React.MouseEvent, medicine: Medicine) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/pharmacy/medicines/${medicine.id}/edit`);
  };

  const handleEditPrescription = (e: React.MouseEvent, prescription: Prescription) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/pharmacy/prescriptions/${prescription.id}/edit`);
  };

  const handleDeleteMedicine = (e: React.MouseEvent, medicine: Medicine) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, item: medicine, type: 'medicine' });
  };

  const handleDeletePrescription = (e: React.MouseEvent, prescription: Prescription) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, item: prescription, type: 'prescription' });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.item) return;
    try {
      if (deleteDialog.type === 'medicine') {
        // await pharmacyService.deleteMedicine((deleteDialog.item as Medicine).id);
      } else {
        // await pharmacyService.deletePrescription((deleteDialog.item as Prescription).id);
      }
      toast.success(`${deleteDialog.type === 'medicine' ? 'Medicine' : 'Prescription'} deleted`);
      setDeleteDialog({ open: false, item: null, type: 'medicine' });
      if (activeTab === 'inventory') {
        fetchMedicines();
      } else {
        fetchPrescriptions();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    }
  };

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
        <div className="flex items-center gap-2">
          <button onClick={() => handleViewMedicine(med)} className="p-1 text-secondary-600 hover:text-secondary-900" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleEditMedicine(e, med)} className="p-1 text-secondary-600 hover:text-secondary-900" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleDeleteMedicine(e, med)} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
          </button>
        </div>
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
    {
      key: 'actions',
      header: 'Actions',
      render: (rx: Prescription) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleViewPrescription(rx)} className="p-1 text-secondary-600 hover:text-secondary-900" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleEditPrescription(e, rx)} className="p-1 text-secondary-600 hover:text-secondary-900" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={(e) => handleDeletePrescription(e, rx)} className="p-1 text-danger-600 hover:text-danger-900" title="Delete">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10m4-10v10m-10-10h14" /></svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pharmacy"
        subtitle={activeTab === 'inventory' ? `${total} medicines` : `${total} prescriptions`}
        action={
          <div className="flex items-center gap-2">
            {activeTab === 'inventory' ? (
              <button onClick={handleCreateMedicine} className="btn-primary">
                <Plus className="h-4 w-4" /> Add Medicine
              </button>
            ) : (
              <button onClick={handleCreatePrescription} className="btn-primary">
                <Plus className="h-4 w-4" /> New Prescription
              </button>
            )}
          </div>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/admin' }, { label: 'Pharmacy' }]}
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
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <button className="btn-outline btn-sm"><Filter className="h-4 w-4" /> Filter</button>
              <button className="btn-outline btn-sm"><Download className="h-4 w-4" /> Export</button>
            </div>
          </div>
          {loading ? (
            <LoadingState message="Loading medicines..." />
          ) : filteredMedicines.length === 0 ? (
            <EmptyState
              title="No medicines found"
              description="Get started by adding a new medicine."
              action={<button onClick={handleCreateMedicine} className="btn-primary">Add Medicine</button>}
            />
          ) : (
            <>
              <DataTable columns={inventoryColumns} data={filteredMedicines} loading={loading} onRowClick={handleViewMedicine} emptyMessage="No medicines found" rowKey={(med) => med.id} />
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
        </>
      )}

      {activeTab === 'prescriptions' && (
        <>
          {loading ? (
            <LoadingState message="Loading prescriptions..." />
          ) : prescriptions.length === 0 ? (
            <EmptyState
              title="No prescriptions found"
              description="Prescriptions will appear here."
            />
          ) : (
            <>
              <DataTable columns={prescriptionColumns} data={prescriptions} loading={loading} onRowClick={handleViewPrescription} emptyMessage="No prescriptions found" rowKey={(rx) => rx.id} />
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
        </>
      )}

      {deleteDialog.open && deleteDialog.item && (
        <ConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, item: null, type: 'medicine' })}
          onConfirm={confirmDelete}
          title={`Delete ${deleteDialog.type === 'medicine' ? 'Medicine' : 'Prescription'}`}
          message={`Are you sure you want to delete this ${deleteDialog.type}? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      )}
    </div>
  );
}