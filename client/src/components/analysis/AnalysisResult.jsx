 

import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAnalysis, detectBiomarkers } from '../../redux/slices/analysisSlice'
import Loader from '../common/Loader'
import { formatDate } from '../../utils/helper'
import {
  ArrowLeft,
  Brain,
  AlertCircle,
  TrendingUp,
  Dna,
  Download,
  Share2,
  FileText,
  Activity,
  Target,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'react-toastify'

const AnalysisResults = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentAnalysis, biomarkers, isLoading } = useSelector(
    (state) => state.analysis
  )

  useEffect(() => {
    if (id) {
      dispatch(getAnalysis(id))
    }
  }, [id, dispatch])

  const handleDetectBiomarkers = async () => {
    try {
      await dispatch(detectBiomarkers(id)).unwrap()
      toast.success('Biomarkers detected successfully')
    } catch (error) {
      toast.error('Failed to detect biomarkers')
    }
  }

  const handleExportReport = () => {
    toast.info('Export functionality coming soon')
  }

  const handleShareResults = () => {
    toast.info('Share functionality coming soon')
  }

  if (isLoading || !currentAnalysis) {
    return <Loader message="Loading analysis results..." />
  }

  const getRiskColor = (risk) => {
    const colors = {
      Low: 'text-green-600 bg-green-50 border-green-200',
      Moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      High: 'text-red-600 bg-red-50 border-red-200',
    }
    return colors[risk] || 'text-gray-600 bg-gray-50 border-gray-200'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analysis Results
            </h1>
            <p className="text-gray-600 mt-1">
              Analysis Date: {formatDate(currentAnalysis.analysisDate)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportReport}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
          <button
            onClick={handleShareResults}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>
      </div>

      {/* Patient & MRI Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            Patient Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">
                {currentAnalysis.patient?.firstName}{' '}
                {currentAnalysis.patient?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Patient ID:</span>
              <span className="font-medium">
                {currentAnalysis.patient?.patientId}
              </span>
            </div>
            <button
              onClick={() =>
                navigate(`/patients/${currentAnalysis.patient?._id}`)
              }
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
            >
              View Patient Profile →
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-500" />
            MRI Scan Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Scan Type:</span>
              <span className="font-medium">
                {currentAnalysis.mriImage?.scanType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Scan Date:</span>
              <span className="font-medium">
                {formatDate(currentAnalysis.mriImage?.scanDate)}
              </span>
            </div>
            <button
              onClick={() => navigate(`/mri/${currentAnalysis.mriImage?._id}`)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
            >
              View MRI Image →
            </button>
          </div>
        </div>
      </div>

      {/* Detection Summary */}
      <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            {currentAnalysis.detectionResults?.tumourDetected ? (
              <AlertTriangle className="w-8 h-8 text-red-500" />
            ) : (
              <Target className="w-8 h-8 text-green-500" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Detection Summary
            </h3>
            <p className="text-gray-700 text-lg">
              {currentAnalysis.detectionResults?.tumourDetected ? (
                <>
                  <span className="font-semibold text-red-600">
                    Tumour Detected
                  </span>{' '}
                  with{' '}
                  <span className="font-semibold">
                    {(
                      currentAnalysis.detectionResults.confidence * 100
                    ).toFixed(1)}
                    %
                  </span>{' '}
                  confidence
                </>
              ) : (
                <span className="font-semibold text-green-600">
                  No Tumour Detected
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Detection Results */}
      {currentAnalysis.detectionResults?.tumourDetected && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-primary-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              Detection Results
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Confidence */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-1 font-medium">
                Detection Confidence
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {(currentAnalysis.detectionResults.confidence * 100).toFixed(1)}
                %
              </p>
            </div>

            {/* Volume */}
            {currentAnalysis.detectionResults.size && (
              <>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1 font-medium">
                    Tumour Volume
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {currentAnalysis.detectionResults.size.volume.toFixed(0)}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">mm³</p>
                </div>

                {/* Dimensions */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-700 mb-1 font-medium">
                    Dimensions (L×W×H)
                  </p>
                  <p className="text-lg font-bold text-green-900">
                    {currentAnalysis.detectionResults.size.dimensions.length.toFixed(
                      1
                    )}{' '}
                    ×{' '}
                    {currentAnalysis.detectionResults.size.dimensions.width.toFixed(
                      1
                    )}{' '}
                    ×{' '}
                    {currentAnalysis.detectionResults.size.dimensions.height.toFixed(
                      1
                    )}
                  </p>
                  <p className="text-xs text-green-600 mt-1">millimeters</p>
                </div>

                {/* Location */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-orange-700 mb-1 font-medium">
                    Location (X, Y, Z)
                  </p>
                  <p className="text-lg font-bold text-orange-900">
                    ({currentAnalysis.detectionResults.location.x},{' '}
                    {currentAnalysis.detectionResults.location.y},{' '}
                    {currentAnalysis.detectionResults.location.z})
                  </p>
                  <p className="text-xs text-orange-600 mt-1">coordinates</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Phenotype Characteristics */}
      {currentAnalysis.phenotypeCharacteristics && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              Phenotype Characteristics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-2 font-medium">Shape</p>
              <p className="text-xl font-bold text-blue-900">
                {currentAnalysis.phenotypeCharacteristics.shape}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-2 font-medium">Texture</p>
              <p className="text-xl font-bold text-blue-900">
                {currentAnalysis.phenotypeCharacteristics.texture}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-2 font-medium">
                Enhancement Pattern
              </p>
              <p className="text-xl font-bold text-blue-900">
                {currentAnalysis.phenotypeCharacteristics.enhancement}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-2 font-medium">
                Heterogeneity
              </p>
              <p className="text-xl font-bold text-blue-900">
                {(
                  currentAnalysis.phenotypeCharacteristics.heterogeneity * 100
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Classification */}
      {currentAnalysis.classification && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              Classification
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
              <p className="text-sm text-purple-700 mb-2 font-medium">
                Tumour Type
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {currentAnalysis.classification.type}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
              <p className="text-sm text-purple-700 mb-2 font-medium">Grade</p>
              <p className="text-2xl font-bold text-purple-900">
                {currentAnalysis.classification.grade}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
              <p className="text-sm text-purple-700 mb-2 font-medium">
                Malignancy Assessment
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {currentAnalysis.classification.malignancy}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      {currentAnalysis.riskAssessment && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              Risk Assessment
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`rounded-lg p-5 border-2 ${getRiskColor(
                currentAnalysis.riskAssessment.progressionRisk
              )}`}
            >
              <p className="text-sm mb-2 font-medium opacity-80">
                Progression Risk
              </p>
              <p className="text-2xl font-bold">
                {currentAnalysis.riskAssessment.progressionRisk}
              </p>
            </div>

            <div
              className={`rounded-lg p-5 border-2 ${getRiskColor(
                currentAnalysis.riskAssessment.recurrenceRisk
              )}`}
            >
              <p className="text-sm mb-2 font-medium opacity-80">
                Recurrence Risk
              </p>
              <p className="text-2xl font-bold">
                {currentAnalysis.riskAssessment.recurrenceRisk}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200">
              <p className="text-sm text-gray-700 mb-2 font-medium">
                Overall Risk Score
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">
                  {currentAnalysis.riskAssessment.score.toFixed(1)}
                </p>
                <p className="text-gray-600">/ 100</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Biomarkers */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Dna className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold text-gray-900">
              Imaging Biomarkers
            </h3>
          </div>
          {(!biomarkers || biomarkers.length === 0) && (
            <button
              onClick={handleDetectBiomarkers}
              className="btn btn-primary flex items-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Detect Biomarkers
            </button>
          )}
        </div>

        {biomarkers && biomarkers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {biomarkers.map((biomarker, index) => (
              <div
                key={index}
                className="border-2 border-green-200 rounded-lg p-4 bg-green-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {biomarker.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {biomarker.category}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-medium rounded-full">
                    {(biomarker.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-t border-green-200">
                    <span className="text-gray-700">Value:</span>
                    <span className="font-medium text-gray-900">
                      {typeof biomarker.value === 'boolean'
                        ? biomarker.value
                          ? 'Present'
                          : 'Absent'
                        : biomarker.value}
                    </span>
                  </div>

                  {biomarker.associatedGenes.length > 0 && (
                    <div className="py-2 border-t border-green-200">
                      <span className="text-gray-700 block mb-2">
                        Associated Genes:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {biomarker.associatedGenes.map((gene) => (
                          <span
                            key={gene}
                            className="px-2 py-1 bg-white text-green-800 text-xs font-medium rounded border border-green-300"
                          >
                            {gene}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="py-2 border-t border-green-200">
                    <p className="text-gray-700 italic">
                      {biomarker.clinicalRelevance}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Dna className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No biomarkers detected yet. Click the button to analyze.</p>
          </div>
        )}
      </div>

      {/* Analysis Metadata */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Analysis Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Analysis ID:</span>
            <span className="font-mono text-gray-900">{currentAnalysis._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date Performed:</span>
            <span className="font-medium text-gray-900">
              {formatDate(currentAnalysis.analysisDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Analyzed By:</span>
            <span className="font-medium text-gray-900">
              {currentAnalysis.analyzedBy?.name || 'System'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Analysis Type:</span>
            <span className="font-medium text-gray-900">
              Automated AI Detection
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisResults