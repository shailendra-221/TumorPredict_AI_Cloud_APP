import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPatients } from '../../redux/slices/patientSlice'
import { getPatientMRIs } from '../../redux/slices/mriSlice'
import { detectTumour } from '../../redux/slices/analysisSlice'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'
import { Play, Brain, AlertCircle, TrendingUp } from 'lucide-react'

const TumourAnalysis = () => {
  const dispatch = useDispatch()
  const { patients } = useSelector((state) => state.patient)
  const { mriImages } = useSelector((state) => state.mri)
  const { currentAnalysis, isAnalyzing } = useSelector((state) => state.analysis)

  const [selectedPatient, setSelectedPatient] = useState('')
  const [selectedMRI, setSelectedMRI] = useState('')

  useEffect(() => {
    dispatch(getPatients({ limit: 1000 }))
  }, [dispatch])

  useEffect(() => {
    if (selectedPatient) {
      dispatch(getPatientMRIs(selectedPatient))
    }
  }, [selectedPatient, dispatch])

  const handleAnalysis = async () => {
    if (!selectedMRI) {
      toast.error('Please select an MRI image')
      return
    }

    try {
      await dispatch(detectTumour(selectedMRI)).unwrap()
      toast.success('Tumour analysis completed successfully')
    } catch (error) {
      toast.error('Analysis failed: ' + error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Tumour Detection & Analysis
      </h1>

      {/* Controls */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient *
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => {
                setSelectedPatient(e.target.value)
                setSelectedMRI('')
              }}
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

          {selectedPatient && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select MRI Image *
              </label>
              <select
                value={selectedMRI}
                onChange={(e) => setSelectedMRI(e.target.value)}
                className="input"
              >
                <option value="">-- Select MRI --</option>
                {mriImages.map((mri) => (
                  <option key={mri._id} value={mri._id}>
                    {mri.fileName} - {mri.scanType} ({formatDate(mri.scanDate)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleAnalysis}
          disabled={isAnalyzing || !selectedMRI}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
        </button>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="card">
          <Loader message="Analyzing MRI image. This may take a few moments..." />
        </div>
      )}

      {/* Results */}
      {currentAnalysis && !isAnalyzing && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>

          {/* Detection Results */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Detection Results
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Tumour Detected</p>
                <p
                  className={`text-xl font-bold ${
                    currentAnalysis.detectionResults.tumourDetected
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {currentAnalysis.detectionResults.tumourDetected ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Confidence</p>
                <p className="text-xl font-bold text-gray-900">
                  {(currentAnalysis.detectionResults.confidence * 100).toFixed(1)}%
                </p>
              </div>
              {currentAnalysis.detectionResults.size && (
                <>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Volume</p>
                    <p className="text-xl font-bold text-gray-900">
                      {currentAnalysis.detectionResults.size.volume.toFixed(0)} mm³
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-sm font-medium text-gray-900">
                      ({currentAnalysis.detectionResults.location.x},
                      {currentAnalysis.detectionResults.location.y},
                      {currentAnalysis.detectionResults.location.z})
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Phenotype */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Phenotype Characteristics
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-1">Shape</p>
                <p className="font-semibold text-blue-900">
                  {currentAnalysis.phenotypeCharacteristics.shape}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-1">Texture</p>
                <p className="font-semibold text-blue-900">
                  {currentAnalysis.phenotypeCharacteristics.texture}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-1">Enhancement</p>
                <p className="font-semibold text-blue-900">
                  {currentAnalysis.phenotypeCharacteristics.enhancement}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-1">Heterogeneity</p>
                <p className="font-semibold text-blue-900">
                  {(currentAnalysis.phenotypeCharacteristics.heterogeneity * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Classification & Risk Assessment
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 mb-1">Type</p>
                <p className="font-semibold text-purple-900">
                  {currentAnalysis.classification.type}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 mb-1">Grade</p>
                <p className="font-semibold text-purple-900">
                  {currentAnalysis.classification.grade}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 mb-1">Malignancy</p>
                <p className="font-semibold text-purple-900">
                  {currentAnalysis.classification.malignancy}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-700 mb-1">Progression Risk</p>
                <p className="font-semibold text-yellow-900">
                  {currentAnalysis.riskAssessment.progressionRisk}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-700 mb-1">Recurrence Risk</p>
                <p className="font-semibold text-yellow-900">
                  {currentAnalysis.riskAssessment.recurrenceRisk}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-700 mb-1">Risk Score</p>
                <p className="font-semibold text-yellow-900">
                  {currentAnalysis.riskAssessment.score.toFixed(1)}/100
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

export default TumourAnalysis