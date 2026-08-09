import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, Pill, FlaskConical, DollarSign } from 'lucide-react';
import { PageHeader, Tabs } from '../../components/feedback/PageStates';
import type { Tab } from '../../components/feedback/PageStates';
import type { Patient, PatientTimelineEvent } from '../../types/patient';

const mockPatient: Patient = {
  id: '1',
  patientId: 'PAT-001',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1985-03-15',
  gender: 'male',
  phone: '+234 801 234 5678',
  email: 'john.doe@example.com',
  address: '123 Main Street, Lagos',
  emergencyContact: 'Mary Doe',
  emergencyPhone: '+234 801 234 5679',
  bloodGroup: 'O+',
  genotype: 'AA',
  allergies: ['Penicillin', 'Peanuts'],
  medicalHistory: 'Hypertension, Type 2 Diabetes',
  insuranceProvider: 'HealthPlus Insurance',
  insurancePolicyNumber: 'HPI-123456',
  nextOfKin: 'Mary Doe',
  nextOfKinPhone: '+234 801 234 5679',
  isActive: true,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
};

const mockTimeline: PatientTimelineEvent[] = [
  { id: '1', patientId: '1', type: 'appointment', title: 'Consultation with Dr. Smith', date: '2024-06-15', description: 'Routine checkup' },
  { id: '2', patientId: '1', type: 'lab', title: 'Blood Test', date: '2024-06-10', description: 'Complete blood count' },
  { id: '3', patientId: '1', type: 'prescription', title: 'Prescription issued', date: '2024-06-10', description: 'Amoxicillin 500mg' },
  { id: '4', patientId: '1', type: 'payment', title: 'Payment received', date: '2024-06-15', description: '₦15,000 via card' },
  { id: '5', patientId: '1', type: 'appointment', title: 'Follow-up appointment', date: '2024-05-20', description: 'Post-treatment review' },
];

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const patient = id === '1' ? mockPatient : mockPatient;

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'records', label: 'Medical Records' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'lab-results', label: 'Lab Results' },
    { id: 'invoices', label: 'Invoices & Payments' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        subtitle={`Patient ID: ${patient.patientId}`}
        action={
          <div className="flex items-center gap-2">
            <Link to="/dashboard/patients" className="btn-outline btn-sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <button className="btn-primary btn-sm">Edit Patient</button>
          </div>
        }
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Patients', href: '/dashboard/patients' }, { label: 'Patient Details' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {patient.firstName} {patient.lastName}
                </h3>
                <p className="text-sm text-secondary-500">{patient.patientId}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <Phone className="h-4 w-4" /> {patient.phone}
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Mail className="h-4 w-4" /> {patient.email}
                </div>
              )}
              {patient.address && (
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <MapPin className="h-4 w-4" /> {patient.address}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <Calendar className="h-4 w-4" /> {new Date(patient.dateOfBirth).toLocaleDateString()} ({new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} yrs)
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="text-sm font-semibold text-secondary-900 mb-3">Medical Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-500">Blood Group</span>
                <span className="font-medium text-secondary-900">{patient.bloodGroup || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Genotype</span>
                <span className="font-medium text-secondary-900">{patient.genotype || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Allergies</span>
                <span className="font-medium text-secondary-900">{patient.allergies?.join(', ') || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Medical History</span>
                <span className="font-medium text-secondary-900">{patient.medicalHistory || 'None'}</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="text-sm font-semibold text-secondary-900 mb-3">Emergency Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-500">Name</span>
                <span className="font-medium text-secondary-900">{patient.emergencyContact || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Phone</span>
                <span className="font-medium text-secondary-900">{patient.emergencyPhone || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <div className="card">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Patient Timeline</h4>
                    <div className="space-y-4">
                      {mockTimeline.map((event) => (
                        <div key={event.id} className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                            {event.type === 'appointment' && <Calendar className="h-5 w-5 text-primary-600" />}
                            {event.type === 'lab' && <FlaskConical className="h-5 w-5 text-primary-600" />}
                            {event.type === 'prescription' && <Pill className="h-5 w-5 text-primary-600" />}
                            {event.type === 'payment' && <DollarSign className="h-5 w-5 text-primary-600" />}
                            {event.type === 'medical_record' && <FileText className="h-5 w-5 text-primary-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-secondary-900">{event.title}</p>
                            {event.description && <p className="text-sm text-secondary-500">{event.description}</p>}
                            <p className="text-xs text-secondary-400 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Appointments</h4>
                  <p className="text-secondary-500">Appointment history will be displayed here.</p>
                </div>
              )}

              {activeTab === 'records' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Medical Records</h4>
                  <p className="text-secondary-500">Medical records will be displayed here.</p>
                </div>
              )}

              {activeTab === 'prescriptions' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Prescriptions</h4>
                  <p className="text-secondary-500">Prescriptions will be displayed here.</p>
                </div>
              )}

              {activeTab === 'lab-results' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Lab Results</h4>
                  <p className="text-secondary-500">Lab results will be displayed here.</p>
                </div>
              )}

              {activeTab === 'invoices' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Invoices & Payments</h4>
                  <p className="text-secondary-500">Invoices and payments will be displayed here.</p>
                </div>
              )}

              {activeTab === 'insurance' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Insurance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Provider</span>
                      <span className="font-medium text-secondary-900">{patient.insuranceProvider || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Policy Number</span>
                      <span className="font-medium text-secondary-900">{patient.insurancePolicyNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Documents</h4>
                  <p className="text-secondary-500">Documents will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
