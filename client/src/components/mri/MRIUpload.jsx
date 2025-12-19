import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { uploadMRI, reset } from '../../redux/slices/mriSlice'
import { getPatients } from '../../redux/slices/patientSlice'
import { toast } from 'react-toastify'
import { Upload, FileImage, X, CheckCircle } from 'lucide-react'
import { SCAN_TYPES } from '../../utils/Constants'

const MRIUpload = () => {
  const dispatch = useDispatch()
  const { patients } = useSelector((state) => state.patient)
  const { uploadProgress, isUploading } = useSelector((state) => state.mri)

  const [selectedPatient, setSelectedPatient] = useState('')
  const [scanType, setScanType] = useState('T1')
  const [files, setFiles] = useState([])

  useEffect(() => {
    dispatch(getPatients({ limit: 1000 }))
  }, [dispatch])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/dicom': ['.dcm'],
    },
    maxSize: 50 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
  })

  const handleUpload = async () => {
    if (!selectedPatient) {
      toast.error('Please select a patient')
      return
    }

    if (files.length === 0) {
      toast.error('Please select files to upload')
      return
    }

    for (const file of files) {
      const formData = new FormData()
      formData.append('mriImage', file)
      formData.append('patientId', selectedPatient)
      formData.append('scanType', scanType)

      try {
        await dispatch(uploadMRI(formData)).unwrap()
        toast.success(`${file.name} uploaded successfully`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}: ${error}`)
      }
    }

    setFiles([])
    dispatch(reset())
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Upload MRI Images</h1>

      <div className="card space-y-6">
        {/* Patient Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Patient *
          </label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="input"
          >
            <option value="">-- Select Patient --</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.patientId} - {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Scan Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scan Type *
          </label>
          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            className="input"
          >
            {SCAN_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dropzone */}
        <div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-500 bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-primary-600 font-medium">
                Drop the files here...
              </p>
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-2">
                  Drag & drop MRI images here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: JPEG, PNG, DICOM (Max 50MB per file)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <FileImage className="w-8 h-8 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading || files.length === 0 || !selectedPatient}
          className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>Uploading...</>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Upload All Files
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default MRIUpload