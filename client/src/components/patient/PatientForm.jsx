import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  createPatient,
  updatePatient,
  getPatient,
} from '../../redux/slices/patientSlice'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'
import { ArrowLeft, Save } from 'lucide-react'

const PatientForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentPatient, isLoading } = useSelector((state) => state.patient)

  const [formData, setFormData] = useState({
    patientId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    contactNumber: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  })

  useEffect(() => {
    if (id) {
      dispatch(getPatient(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (id && currentPatient) {
      setFormData({
        patientId: currentPatient.patientId || '',
        firstName: currentPatient.firstName || '',
        lastName: currentPatient.lastName || '',
        dateOfBirth: currentPatient.dateOfBirth?.split('T')[0] || '',
        gender: currentPatient.gender || 'Male',
        contactNumber: currentPatient.contactNumber || '',
        email: currentPatient.email || '',
        address: currentPatient.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
      })
    }
  }, [id, currentPatient])

  const onChange = (e) => {
    const { name, value } = e.target
    if (name.includes('address.')) {
      const addressField = name.split('.')[1]
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      if (id) {
        await dispatch(updatePatient({ id, patientData: formData })).unwrap()
        toast.success('Patient updated successfully')
      } else {
        await dispatch(createPatient(formData)).unwrap()
        toast.success('Patient created successfully')
      }
      navigate('/patients')
    } catch (error) {
      toast.error(error)
    }
  }

  if (isLoading && id) {
    return <Loader message="Loading patient data..." />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/patients')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Patient' : 'Add New Patient'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="card space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID *
              </label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={onChange}
                className="input"
                required
                disabled={!!id}
              />
            </div>

            <div className="md:col-span-2"></div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={onChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={onChange}
                className="input"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={onChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={onChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={onChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={onChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={onChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={onChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {id ? 'Update Patient' : 'Create Patient'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default PatientForm