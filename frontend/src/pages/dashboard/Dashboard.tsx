import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Calendar, DollarSign, TrendingUp, TrendingDown, Bed, Pill, FlaskConical, Download, Filter } from 'lucide-react';
import { PageHeader } from '../../components/feedback/PageStates';
import type { User } from '../../types/common';

const revenueData = [
  { name: 'Jan', revenue: 4000000, expenses: 2400000 },
  { name: 'Feb', revenue: 3000000, expenses: 1398000 },
  { name: 'Mar', revenue: 2000000, expenses: 980000 },
  { name: 'Apr', revenue: 2780000, expenses: 1908000 },
  { name: 'May', revenue: 1890000, expenses: 1300000 },
  { name: 'Jun', revenue: 2390000, expenses: 1600000 },
];

const patientData = [
  { name: 'Jan', patients: 120, newPatients: 40 },
  { name: 'Feb', patients: 150, newPatients: 50 },
  { name: 'Mar', patients: 180, newPatients: 60 },
  { name: 'Apr', patients: 220, newPatients: 80 },
  { name: 'May', patients: 260, newPatients: 90 },
  { name: 'Jun', patients: 300, newPatients: 100 },
];

const departmentData = [
  { name: 'Cardiology', value: 4500000 },
  { name: 'Neurology', value: 3200000 },
  { name: 'Pediatrics', value: 2800000 },
  { name: 'Orthopedics', value: 2100000 },
  { name: 'Pharmacy', value: 1800000 },
];

const appointmentData = [
  { name: 'Mon', scheduled: 45, completed: 38, cancelled: 3 },
  { name: 'Tue', scheduled: 52, completed: 45, cancelled: 2 },
  { name: 'Wed', scheduled: 48, completed: 42, cancelled: 4 },
  { name: 'Thu', scheduled: 55, completed: 48, cancelled: 1 },
  { name: 'Fri', scheduled: 60, completed: 52, cancelled: 3 },
  { name: 'Sat', scheduled: 30, completed: 25, cancelled: 2 },
];

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

interface DashboardProps {
  user: User | null;
}

export function Dashboard({ user }: DashboardProps) {
  const [dateRange, setDateRange] = useState('month');
  const [branchFilter, setBranchFilter] = useState('all');

  const kpis = useMemo(
    () => [
      { label: 'Total Patients', value: '3,456', change: '+12%', trend: 'up', icon: Users, color: 'bg-blue-50 text-blue-600' },
      { label: "Today's Appointments", value: '48', change: '+8%', trend: 'up', icon: Calendar, color: 'bg-primary-50 text-primary-600' },
      { label: 'Monthly Revenue', value: '₦24.5M', change: '+15%', trend: 'up', icon: DollarSign, color: 'bg-green-50 text-green-600' },
      { label: 'Bed Occupancy', value: '87%', change: '+3%', trend: 'up', icon: Bed, color: 'bg-purple-50 text-purple-600' },
      { label: 'Pending Lab Tests', value: '23', change: '-5%', trend: 'down', icon: FlaskConical, color: 'bg-yellow-50 text-yellow-600' },
      { label: 'Low Stock Items', value: '8', change: '+2', trend: 'up', icon: Pill, color: 'bg-red-50 text-red-600' },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle={`Welcome back, ${user?.firstName}`}
        action={
          <div className="flex items-center gap-2">
            <button className="btn-outline btn-sm">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="btn-outline btn-sm">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        }
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="label text-xs">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input w-40"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div>
          <label className="label text-xs">Branch</label>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Branches</option>
            <option value="main">Main Hospital</option>
            <option value="clinic">City Clinic</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <div className="flex items-center justify-between">
              <div className={`h-10 w-10 rounded-lg ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <span className={`flex items-center text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-secondary-900 mt-2">{kpi.value}</p>
            <p className="text-sm text-secondary-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Patient Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="patients" fill="#16a34a" name="Total Patients" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newPatients" fill="#3b82f6" name="New Patients" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Revenue by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Appointment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="scheduled" fill="#3b82f6" name="Scheduled" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#16a34a" name="Completed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {[
              { action: 'New patient registered', user: 'Receptionist', time: '2 min ago', icon: Users },
              { action: 'Appointment completed', user: 'Dr. Smith', time: '15 min ago', icon: Calendar },
              { action: 'Invoice #INV-001 paid', user: 'Patient', time: '1 hour ago', icon: DollarSign },
              { action: 'Lab result ready', user: 'Lab Tech', time: '2 hours ago', icon: FlaskConical },
              { action: 'Low stock alert: Paracetamol', user: 'System', time: '3 hours ago', icon: Pill },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0">
                  <activity.icon className="h-4 w-4 text-secondary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">{activity.action}</p>
                  <p className="text-xs text-secondary-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
