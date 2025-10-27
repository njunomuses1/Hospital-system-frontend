import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, Activity, Plus, ArrowRight } from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { dashboardApi, appointmentApi, handleApiError } from '@/services/api';
import { mockDashboardStats, mockAppointments } from '@/services/mockData';
import { formatDate, formatTime, getStatusColor } from '@/utils/helpers';
import { ROUTES } from '@/utils/constants';
import toast from 'react-hot-toast';
import type { DashboardStats, Appointment } from '@/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData] = useState(true); // Toggle this based on backend availability

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (useMockData) {
        // Use mock data
        setStats(mockDashboardStats);
        setRecentAppointments(mockAppointments.slice(0, 5));
      } else {
        // Use real API
        const [statsData, appointmentsData] = await Promise.all([
          dashboardApi.getStats(),
          appointmentApi.getAll(),
        ]);
        setStats(statsData);
        setRecentAppointments(appointmentsData.slice(0, 5));
      }
    } catch (error) {
      toast.error(handleApiError(error));
      // Fallback to mock data on error
      setStats(mockDashboardStats);
      setRecentAppointments(mockAppointments.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'bg-blue-500',
      route: ROUTES.PATIENTS,
    },
    {
      title: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      color: 'bg-green-500',
      route: ROUTES.APPOINTMENTS,
    },
    {
      title: 'Active Prescriptions',
      value: stats?.activePrescriptions || 0,
      icon: FileText,
      color: 'bg-purple-500',
      route: ROUTES.PRESCRIPTIONS,
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: Activity,
      color: 'bg-orange-500',
      route: ROUTES.APPOINTMENTS,
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome to Hospital Management System</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button onClick={() => navigate(ROUTES.PATIENTS)}>
            <Plus size={18} className="mr-2" />
            New Patient
          </Button>
          <Button onClick={() => navigate(ROUTES.APPOINTMENTS)} variant="secondary">
            <Calendar size={18} className="mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="stat-card cursor-pointer"
            onClick={() => navigate(stat.route)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate(ROUTES.PATIENTS)}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="ml-4 flex-1 text-left">
              <h4 className="font-semibold text-gray-900">Manage Patients</h4>
              <p className="text-sm text-gray-500">View and manage patient records</p>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-primary-600" />
          </button>

          <button
            onClick={() => navigate(ROUTES.APPOINTMENTS)}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200">
              <Calendar size={24} className="text-green-600" />
            </div>
            <div className="ml-4 flex-1 text-left">
              <h4 className="font-semibold text-gray-900">Appointments</h4>
              <p className="text-sm text-gray-500">Schedule and manage appointments</p>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-primary-600" />
          </button>

          <button
            onClick={() => navigate(ROUTES.PRESCRIPTIONS)}
            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200">
              <FileText size={24} className="text-purple-600" />
            </div>
            <div className="ml-4 flex-1 text-left">
              <h4 className="font-semibold text-gray-900">Prescriptions</h4>
              <p className="text-sm text-gray-500">Create and view prescriptions</p>
            </div>
            <ArrowRight size={20} className="text-gray-400 group-hover:text-primary-600" />
          </button>
        </div>
      </Card>

      {/* Recent Appointments */}
      <Card
        title="Recent Appointments"
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(ROUTES.APPOINTMENTS)}
          >
            View All
          </Button>
        }
      >
        {recentAppointments.length > 0 ? (
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Dr. {appointment.doctorName} • {formatDate(appointment.date)} at{' '}
                    {formatTime(appointment.time)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{appointment.reason}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No recent appointments</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;






