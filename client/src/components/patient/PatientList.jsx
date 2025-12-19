import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPatients, deletePatient } from '../../redux/slices/patientSlice'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'
import { formatDate, getStatusColor } from '../../utils/helper'
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const PatientList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { patients, isLoading, pagination } = useSelector((state) => state.patient)

  useEffect(() => {
    dispatch(getPatients({ page: currentPage, limit: 10, search: searchTerm }))
  }, [dispatch, currentPage, searchTerm])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      dispatch(deletePatient(id))
        .unwrap()
        .then(() => {
          toast.success('Patient deleted successfully')
          dispatch(getPatients({ page: currentPage, limit: 10, search: searchTerm }))
        })
        .catch((error) => {
          toast.error(error)
        })
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  if (isLoading) {
    return <Loader message="Loading patients..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <button
          onClick={() => navigate('/patients/new')}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No patients found
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.patientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(patient.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.contactNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          patient.status
                        )}`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/patients/${patient._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/patients/${patient._id}/edit`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="btn btn-secondary btn-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientList