import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPatientMRIs } from '../../redux/slices/mriSlice'
import Loader from '../common/Loader'
import { formatDate } from '../../utils/helper'
import { ArrowLeft, Eye } from 'lucide-react'

const MRIGallery = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { mriImages, isLoading } = useSelector((state) => state.mri)

  useEffect(() => {
    dispatch(getPatientMRIs(patientId))
  }, [patientId, dispatch])

  if (isLoading) {
    return <Loader message="Loading MRI images..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          MRI Image Gallery ({mriImages.length})
        </h1>
      </div>

      {mriImages.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No MRI images found for this patient.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mriImages.map((mri) => (
            <div
              key={mri._id}
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/mri/${mri._id}`)}
            >
              <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-900">
                <img
                  src={mri.imageUrl}
                  alt={mri.fileName}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 truncate">
                {mri.fileName}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Type: {mri.scanType}</p>
                <p>Date: {formatDate(mri.scanDate)}</p>
                <p>
                  Analysis:{' '}
                  {mri.analysisCompleted ? (
                    <span className="text-green-600 font-medium">Completed</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MRIGallery
