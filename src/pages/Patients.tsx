import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Select from '@/components/UI/Select';
import Textarea from '@/components/UI/Textarea';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Table from '@/components/UI/Table';
import { patientApi, handleApiError } from '@/services/api';
import { mockPatients } from '@/services/mockData';
import { GENDER_OPTIONS } from '@/utils/constants';
import { formatDate, validatePhone } from '@/utils/helpers';
import toast from 'react-hot-toast';
import type { Patient, CreatePatientDTO } from '@/types';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [useMockData] = useState(true); // Toggle for backend availability

  const [formData, setFormData] = useState<CreatePatientDTO>({
    name: '',
    age: 0,
    gender: 'Male',
    contact: '',
    address: '',
    medicalHistory: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      if (useMockData) {
        setPatients(mockPatients);
      } else {
        const data = await patientApi.getAll();
        setPatients(data);
      }
    } catch (error) {
      toast.error(handleApiError(error));
      setPatients(mockPatients); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.contact.includes(query) ||
        patient.address.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  };

  const openModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        contact: patient.contact,
        address: patient.address,
        medicalHistory: patient.medicalHistory,
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: '',
        age: 0,
        gender: 'Male',
        contact: '',
        address: '',
        medicalHistory: '',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
    setFormData({
      name: '',
      age: 0,
      gender: 'Male',
      contact: '',
      address: '',
      medicalHistory: '',
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.age || formData.age <= 0) {
      errors.age = 'Valid age is required';
    }

    if (!formData.contact.trim()) {
      errors.contact = 'Contact is required';
    } else if (!validatePhone(formData.contact)) {
      errors.contact = 'Invalid phone number';
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
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
        // Mock implementation
        if (editingPatient) {
          const updated = {
            ...editingPatient,
            ...formData,
            updatedAt: new Date().toISOString(),
          };
          setPatients(patients.map((p) => (p.id === editingPatient.id ? updated : p)));
          toast.success('Patient updated successfully');
        } else {
          const newPatient: Patient = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setPatients([newPatient, ...patients]);
          toast.success('Patient added successfully');
        }
      } else {
        // Real API
        if (editingPatient) {
          await patientApi.update(editingPatient.id, formData);
          toast.success('Patient updated successfully');
        } else {
          await patientApi.create(formData);
          toast.success('Patient added successfully');
        }
        await loadPatients();
      }

      closeModal();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (patient: Patient) => {
    if (!confirm(`Are you sure you want to delete ${patient.name}?`)) {
      return;
    }

    try {
      if (useMockData) {
        setPatients(patients.filter((p) => p.id !== patient.id));
        toast.success('Patient deleted successfully');
      } else {
        await patientApi.delete(patient.id);
        toast.success('Patient deleted successfully');
        await loadPatients();
      }
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'age',
      header: 'Age',
      render: (patient: Patient) => `${patient.age} years`,
    },
    { key: 'gender', header: 'Gender' },
    { key: 'contact', header: 'Contact' },
    { key: 'address', header: 'Address' },
    {
      key: 'createdAt',
      header: 'Registered On',
      render: (patient: Patient) => formatDate(patient.createdAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (patient: Patient) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openModal(patient)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(patient)}
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
    return <LoadingSpinner size="lg" text="Loading patients..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage patient records and information
          </p>
        </div>
        <Button onClick={() => openModal()} className="mt-4 sm:mt-0">
          <Plus size={18} className="mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex items-center space-x-2">
          <Search size={20} className="text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, contact, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      {/* Patients Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredPatients}
          keyExtractor={(patient) => patient.id}
          emptyMessage="No patients found. Add your first patient to get started."
        />
      </Card>

      {/* Add/Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
              placeholder="John Doe"
            />

            <Input
              label="Age"
              type="number"
              required
              value={formData.age || ''}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              error={formErrors.age}
              placeholder="30"
              min="0"
            />

            <Select
              label="Gender"
              required
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })
              }
              options={GENDER_OPTIONS.map((g) => ({ value: g, label: g }))}
              error={formErrors.gender}
            />

            <Input
              label="Contact Number"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              error={formErrors.contact}
              placeholder="+1234567890"
            />
          </div>

          <Input
            label="Address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={formErrors.address}
            placeholder="123 Main St, City, State"
          />

          <Textarea
            label="Medical History"
            value={formData.medicalHistory}
            onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            error={formErrors.medicalHistory}
            placeholder="Enter medical history, allergies, chronic conditions, etc."
            rows={4}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingPatient ? 'Update Patient' : 'Add Patient'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Patients;






