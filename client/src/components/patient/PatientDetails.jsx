import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPatient } from '../../redux/slices/patientSlice'
import { getPatientMRIs } from '../../redux/slices/mriSlice'
import Loader from '../common/Loader'
import { formatDate, calculateAge } from '../../utils/helper'
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, User } from 'lucide-react'

const PatientDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentPatient, isLoading } = useSelector((state) => state.patient)
  const { mriImages } = useSelector((state) => state.mri)

  useEffect(() => {
    dispatch(getPatient(id))
    dispatch(getPatientMRIs(id))
  }, [id, dispatch])

  if (isLoading || !currentPatient) {
    return <Loader message="Loading patient details..." />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/patients')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentPatient.firstName} {currentPatient.lastName}
            </h1>
            <p className="text-gray-600">ID: {currentPatient.patientId}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/patients/${id}/edit`)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Edit Patient
        </button>
      </div>

      {/* Patient Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{currentPatient.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">
                  {formatDate(currentPatient.dateOfBirth)} (Age:{' '}
                  {calculateAge(currentPatient.dateOfBirth)})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">
                  {currentPatient.contactNumber || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{currentPatient.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium">
                {currentPatient.address?.street || 'N/A'}
              </p>
              <p className="text-gray-600">
                {currentPatient.address?.city}, {currentPatient.address?.state}{' '}
                {currentPatient.address?.zipCode}
              </p>
              <p className="text-gray-600">{currentPatient.address?.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MRI Scans */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          MRI Scans ({mriImages.length})
        </h2>
        {mriImages.length === 0 ? (
          <p className="text-gray-600">No MRI scans uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mriImages.map((mri) => (
              <div
                key={mri._id}
                onClick={() => navigate(`/mri/${mri._id}`)}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <p className="font-medium text-gray-900 mb-2">{mri.fileName}</p>
                <p className="text-sm text-gray-600">Type: {mri.scanType}</p>
                <p className="text-sm text-gray-600">
                  Date: {formatDate(mri.scanDate)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientDetails