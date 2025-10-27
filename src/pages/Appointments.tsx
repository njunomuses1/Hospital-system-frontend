import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Select from '@/components/UI/Select';
import Textarea from '@/components/UI/Textarea';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Table from '@/components/UI/Table';
import { appointmentApi, patientApi, doctorApi, handleApiError } from '@/services/api';
import { mockAppointments, mockPatients, mockDoctors } from '@/services/mockData';
import { APPOINTMENT_STATUS, TIME_SLOTS } from '@/utils/constants';
import { formatDate, formatTime, getStatusColor } from '@/utils/helpers';
import toast from 'react-hot-toast';
import type { Appointment, CreateAppointmentDTO, Patient, Doctor } from '@/types';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [useMockData] = useState(true);

  const [formData, setFormData] = useState<CreateAppointmentDTO>({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    status: 'Scheduled',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchQuery, statusFilter, appointments]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (useMockData) {
        setAppointments(mockAppointments);
        setPatients(mockPatients);
        setDoctors(mockDoctors);
      } else {
        const [appointmentsData, patientsData, doctorsData] = await Promise.all([
          appointmentApi.getAll(),
          patientApi.getAll(),
          doctorApi.getAll(),
        ]);
        setAppointments(appointmentsData);
        setPatients(patientsData);
        setDoctors(doctorsData);
      }
    } catch (error) {
      toast.error(handleApiError(error));
      setAppointments(mockAppointments);
      setPatients(mockPatients);
      setDoctors(mockDoctors);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patientName?.toLowerCase().includes(query) ||
          apt.doctorName?.toLowerCase().includes(query) ||
          apt.reason.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const openModal = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time,
        reason: appointment.reason,
        status: appointment.status,
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        status: 'Scheduled',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      status: 'Scheduled',
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.patientId) {
      errors.patientId = 'Patient is required';
    }

    if (!formData.doctorId) {
      errors.doctorId = 'Doctor is required';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (!formData.time) {
      errors.time = 'Time is required';
    }

    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required';
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

        if (editingAppointment) {
          const updated: Appointment = {
            ...editingAppointment,
            ...formData,
            patientName: patient?.name,
            doctorName: doctor?.name,
            updatedAt: new Date().toISOString(),
          };
          setAppointments(appointments.map((a) => (a.id === editingAppointment.id ? updated : a)));
          toast.success('Appointment updated successfully');
        } else {
          const newAppointment: Appointment = {
            id: Date.now().toString(),
            ...formData,
            patientName: patient?.name,
            doctorName: doctor?.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setAppointments([newAppointment, ...appointments]);
          toast.success('Appointment scheduled successfully');
        }
      } else {
        if (editingAppointment) {
          await appointmentApi.update(editingAppointment.id, formData);
          toast.success('Appointment updated successfully');
        } else {
          await appointmentApi.create(formData);
          toast.success('Appointment scheduled successfully');
        }
        await loadData();
      }

      closeModal();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    if (!confirm(`Are you sure you want to cancel this appointment?`)) {
      return;
    }

    try {
      if (useMockData) {
        setAppointments(appointments.filter((a) => a.id !== appointment.id));
        toast.success('Appointment cancelled successfully');
      } else {
        await appointmentApi.delete(appointment.id);
        toast.success('Appointment cancelled successfully');
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
      render: (apt: Appointment) => (
        <div>
          <p className="font-medium">{apt.patientName}</p>
        </div>
      ),
    },
    {
      key: 'doctorName',
      header: 'Doctor',
      render: (apt: Appointment) => <p className="text-gray-600">Dr. {apt.doctorName}</p>,
    },
    {
      key: 'date',
      header: 'Date & Time',
      render: (apt: Appointment) => (
        <div>
          <p>{formatDate(apt.date)}</p>
          <p className="text-sm text-gray-500">{formatTime(apt.time)}</p>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (apt: Appointment) => (
        <p className="max-w-xs truncate" title={apt.reason}>
          {apt.reason}
        </p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (apt: Appointment) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
          {apt.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (apt: Appointment) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openModal(apt)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(apt)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Cancel"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading appointments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">Schedule and manage appointments</p>
        </div>
        <Button onClick={() => openModal()} className="mt-4 sm:mt-0">
          <Plus size={18} className="mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 flex items-center space-x-2">
            <Search size={20} className="text-gray-400" />
            <Input
              type="text"
              placeholder="Search by patient, doctor, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={APPOINTMENT_STATUS.map((status) => ({ value: status, label: status }))}
              className="flex-1"
            />
          </div>
        </div>
      </Card>

      {/* Appointments Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredAppointments}
          keyExtractor={(apt) => apt.id}
          emptyMessage="No appointments found. Schedule your first appointment to get started."
        />
      </Card>

      {/* Add/Edit Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Patient"
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              options={patients.map((p) => ({ value: p.id, label: p.name }))}
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
              min={new Date().toISOString().split('T')[0]}
            />

            <Select
              label="Time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              options={TIME_SLOTS.map((time) => ({ value: time, label: formatTime(time) }))}
              error={formErrors.time}
            />

            {editingAppointment && (
              <Select
                label="Status"
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as typeof APPOINTMENT_STATUS[number],
                  })
                }
                options={APPOINTMENT_STATUS.map((status) => ({ value: status, label: status }))}
              />
            )}
          </div>

          <Textarea
            label="Reason for Visit"
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            error={formErrors.reason}
            placeholder="Brief description of the reason for this appointment"
            rows={4}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;






