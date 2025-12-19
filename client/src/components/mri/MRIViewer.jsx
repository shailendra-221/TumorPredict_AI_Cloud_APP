import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMRI } from '../../redux/slices/mriSlice'
import Loader from '../common/Loader'
import { formatDate, formatFileSize, getStatusColor } from '../../utils/helper'
import { ArrowLeft, Download, Play } from 'lucide-react'

const MRIViewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentMRI, isLoading } = useSelector((state) => state.mri)

  useEffect(() => {
    dispatch(getMRI(id))
  }, [id, dispatch])

  if (isLoading || !currentMRI) {
    return <Loader message="Loading MRI image..." />
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MRI Image Viewer</h1>
            <p className="text-gray-600">{currentMRI.fileName}</p>
          </div>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Display */}
        <div className="lg:col-span-2 card">
          <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-center min-h-[500px]">
            <img
              src={currentMRI.imageUrl}
              alt="MRI Scan"
              className="max-w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-6">
          {/* Image Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Image Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Scan Type</p>
                <p className="font-medium text-gray-900">{currentMRI.scanType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Scan Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(currentMRI.scanDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">File Size</p>
                <p className="font-medium text-gray-900">
                  {formatFileSize(currentMRI.fileSize)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing Status</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    currentMRI.processingStatus
                  )}`}
                >
                  {currentMRI.processingStatus}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Analysis Status</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    currentMRI.analysisCompleted
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {currentMRI.analysisCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Patient Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Patient Name</p>
                <p className="font-medium text-gray-900">
                  {currentMRI.patient?.firstName} {currentMRI.patient?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="font-medium text-gray-900">
                  {currentMRI.patient?.patientId}
                </p>
              </div>
              <button
                onClick={() => navigate(`/patients/${currentMRI.patient?._id}`)}
                className="btn btn-secondary w-full mt-2"
              >
                View Patient Profile
              </button>
            </div>
          </div>

          {/* Actions */}
          {!currentMRI.analysisCompleted && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <button
                onClick={() => navigate('/analysis/tumour')}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MRIViewer