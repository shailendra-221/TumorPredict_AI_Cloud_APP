import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Users, Brain, Activity, Clock, Plus, Eye } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const stats = [
    {
      title: 'Total Patients',
      value: '156',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'MRI Scans',
      value: '432',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Analyses Completed',
      value: '389',
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending Analyses',
      value: '12',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
  ]

  const monthlyData = [
    { month: 'Jan', patients: 12, analyses: 45 },
    { month: 'Feb', patients: 19, analyses: 52 },
    { month: 'Mar', patients: 15, analyses: 48 },
    { month: 'Apr', patients: 22, analyses: 61 },
    { month: 'May', patients: 18, analyses: 55 },
    { month: 'Jun', patients: 25, analyses: 67 },
  ]

  const tumourTypes = [
    { type: 'Glioblastoma', count: 45 },
    { type: 'Astrocytoma', count: 32 },
    { type: 'Meningioma', count: 28 },
    { type: 'Oligodendroglioma', count: 15 },
    { type: 'Other', count: 23 },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your patients today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Monthly Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#667eea"
                strokeWidth={2}
                name="Patients"
              />
              <Line
                type="monotone"
                dataKey="analyses"
                stroke="#10b981"
                strokeWidth={2}
                name="Analyses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Tumour Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tumourTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/patients/new')}
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <Plus className="w-6 h-6 text-primary-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add New Patient</p>
              <p className="text-sm text-gray-600">Register a new patient</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/mri/upload')}
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <Brain className="w-6 h-6 text-primary-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Upload MRI Scan</p>
              <p className="text-sm text-gray-600">Upload and analyze</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/patients')}
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <Eye className="w-6 h-6 text-primary-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View All Patients</p>
              <p className="text-sm text-gray-600">Browse patient records</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard