import React, { useEffect, useState } from 'react';
import { Plus, Eye, Trash2, Search, FileText } from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Select from '@/components/UI/Select';
import Textarea from '@/components/UI/Textarea';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Table from '@/components/UI/Table';
import { prescriptionApi, patientApi, doctorApi, handleApiError } from '@/services/api';
import { mockPrescriptions, mockPatients, mockDoctors } from '@/services/mockData';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';
import type { Prescription, CreatePrescriptionDTO, Patient, Doctor } from '@/types';

const Prescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [useMockData] = useState(true);

  const [formData, setFormData] = useState<CreatePrescriptionDTO>({
    patientId: '',
    doctorId: '',
    diagnosis: '',
    medications: '',
    instructions: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [searchQuery, prescriptions]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (useMockData) {
        setPrescriptions(mockPrescriptions);
        setPatients(mockPatients);
        setDoctors(mockDoctors);
      } else {
        const [prescriptionsData, patientsData, doctorsData] = await Promise.all([
          prescriptionApi.getAll(),
          patientApi.getAll(),
          doctorApi.getAll(),
        ]);
        setPrescriptions(prescriptionsData);
        setPatients(patientsData);
        setDoctors(doctorsData);
      }
    } catch (error) {
      toast.error(handleApiError(error));
      setPrescriptions(mockPrescriptions);
      setPatients(mockPatients);
      setDoctors(mockDoctors);
    } finally {
      setLoading(false);
    }
  };

  const filterPrescriptions = () => {
    if (!searchQuery.trim()) {
      setFilteredPrescriptions(prescriptions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = prescriptions.filter(
      (rx) =>
        rx.patientName?.toLowerCase().includes(query) ||
        rx.doctorName?.toLowerCase().includes(query) ||
        rx.diagnosis.toLowerCase().includes(query) ||
        rx.medications.toLowerCase().includes(query)
    );
    setFilteredPrescriptions(filtered);
  };

  const openModal = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      diagnosis: '',
      medications: '',
      instructions: '',
      date: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      patientId: '',
      doctorId: '',
      diagnosis: '',
      medications: '',
      instructions: '',
      date: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
  };

  const openViewModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedPrescription(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.patientId) {
      errors.patientId = 'Patient is required';
    }

    if (!formData.doctorId) {
      errors.doctorId = 'Doctor is required';
    }

    if (!formData.diagnosis.trim()) {
      errors.diagnosis = 'Diagnosis is required';
    }

    if (!formData.medications.trim()) {
      errors.medications = 'Medications are required';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      if (useMockData) {
        const patient = patients.find((p) => p.id === formData.patientId);
        const doctor = doctors.find((d) => d.id === formData.doctorId);

        const newPrescription: Prescription = {
          id: Date.now().toString(),
          ...formData,
          patientName: patient?.name,
          doctorName: doctor?.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPrescriptions([newPrescription, ...prescriptions]);
        toast.success('Prescription created successfully');
      } else {
        await prescriptionApi.create(formData);
        toast.success('Prescription created successfully');
        await loadData();
      }

      closeModal();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (prescription: Prescription) => {
    if (!confirm('Are you sure you want to delete this prescription?')) {
      return;
    }

    try {
      if (useMockData) {
        setPrescriptions(prescriptions.filter((rx) => rx.id !== prescription.id));
        toast.success('Prescription deleted successfully');
      } else {
        await prescriptionApi.delete(prescription.id);
        toast.success('Prescription deleted successfully');
        await loadData();
      }
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const columns = [
    {
      key: 'patientName',
      header: 'Patient',
      render: (rx: Prescription) => <p className="font-medium">{rx.patientName}</p>,
    },
    {
      key: 'doctorName',
      header: 'Doctor',
      render: (rx: Prescription) => <p className="text-gray-600">Dr. {rx.doctorName}</p>,
    },
    {
      key: 'diagnosis',
      header: 'Diagnosis',
      render: (rx: Prescription) => (
        <p className="max-w-xs truncate" title={rx.diagnosis}>
          {rx.diagnosis}
        </p>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (rx: Prescription) => formatDate(rx.date),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (rx: Prescription) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openViewModal(rx)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDelete(rx)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading prescriptions..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="mt-1 text-sm text-gray-500">Create and manage medical prescriptions</p>
        </div>
        <Button onClick={openModal} className="mt-4 sm:mt-0">
          <Plus size={18} className="mr-2" />
          Create Prescription
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center space-x-2">
          <Search size={20} className="text-gray-400" />
          <Input
            type="text"
            placeholder="Search by patient, doctor, diagnosis, or medication..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      {/* Prescriptions Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredPrescriptions}
          keyExtractor={(rx) => rx.id}
          emptyMessage="No prescriptions found. Create your first prescription to get started."
        />
      </Card>

      {/* Create Prescription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create New Prescription"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Patient"
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              options={patients.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.age}y, ${p.gender})`,
              }))}
              error={formErrors.patientId}
            />

            <Select
              label="Doctor"
              required
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              options={doctors.map((d) => ({
                value: d.id,
                label: `Dr. ${d.name} (${d.specialization})`,
              }))}
              error={formErrors.doctorId}
            />

            <Input
              label="Date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              error={formErrors.date}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <Input
            label="Diagnosis"
            required
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            error={formErrors.diagnosis}
            placeholder="e.g., Acute Bronchitis"
          />

          <Textarea
            label="Medications"
            required
            value={formData.medications}
            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
            error={formErrors.medications}
            placeholder="List all medications with dosage and frequency (e.g., Amoxicillin 500mg - 3 times daily for 7 days)"
            rows={4}
          />

          <Textarea
            label="Instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            error={formErrors.instructions}
            placeholder="Special instructions for the patient (e.g., Take with food, avoid alcohol)"
            rows={3}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create Prescription
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Prescription Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Medical Prescription</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Prescription ID: {selectedPrescription.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">{formatDate(selectedPrescription.date)}</p>
                </div>
              </div>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-2">Patient Information</p>
                <p className="font-semibold text-gray-900">{selectedPrescription.patientName}</p>
                <p className="text-sm text-gray-600 mt-1">Patient ID: {selectedPrescription.patientId}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium mb-2">Prescribed By</p>
                <p className="font-semibold text-gray-900">Dr. {selectedPrescription.doctorName}</p>
                <p className="text-sm text-gray-600 mt-1">Doctor ID: {selectedPrescription.doctorId}</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <div className="flex items-center mb-2">
                <FileText size={18} className="text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Diagnosis</h3>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-900">{selectedPrescription.diagnosis}</p>
              </div>
            </div>

            {/* Medications */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Medications</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-line">{selectedPrescription.medications}</p>
              </div>
            </div>

            {/* Instructions */}
            {selectedPrescription.instructions && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-gray-900 whitespace-pre-line">{selectedPrescription.instructions}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-4 flex justify-end">
              <Button variant="secondary" onClick={closeViewModal}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Prescriptions;






