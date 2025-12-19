// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { detectBiomarkers } from '../../redux/slices/analysisSlice'
// import { toast } from 'react-toastify'
// import Loader from '../common/Loader'
// import { Activity, Play, Dna } from 'lucide-react'

// const BiomarkerDetection = () => {
//   const dispatch = useDispatch()
//   const { biomarkers, isAnalyzing } = useSelector((state) => state.analysis)
//   const [analysisId, setAnalysisId] = useState('')

//   // const handleDetection = async () => {
//   //   if (!analysisId) {
//   //     toast.error('Please enter an analysis ID')
//   //     return
//   //   }

//   //   try {
//   //     await dispatch(detectBiomarkers(analysisId)).unwrap()
//   //     toast.success('Biomarkers detected successfully')
//   //   } catch (error) {
//   //     toast.error('Biomarker detection failed: ' + error)
//   //   }
//   // }

//   const handleDetection = async () => {
//   if (!analysisId) {
//     toast.error('Analysis ID is required')
//     return
//   }

//   if (!isValidObjectId(analysisId)) {
//     toast.error('Invalid Analysis ID format')
//     return
//   }

//   try {
//     await dispatch(detectBiomarkers({ analysisId })).unwrap()
//     toast.success('Biomarkers detected successfully')
//   } catch (error) {
//     toast.error(error || 'Biomarker detection failed')
//   }
// }


//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold text-gray-900">
//         Imaging Biomarker Detection
//       </h1>

//       {/* Controls */}
//       <div className="card space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Analysis ID *
//           </label>
//           <input
//             type="text"
//             value={analysisId}
//             onChange={(e) => setAnalysisId(e.target.value)}
//             className="input"
//             placeholder="Enter analysis ID"
//           />
//         </div>

//         <button
//           onClick={handleDetection}
//           disabled={isAnalyzing || !analysisId}
//           className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <Play className="w-5 h-5" />
//           {isAnalyzing ? 'Detecting...' : 'Detect Biomarkers'}
//         </button>
//       </div>

//       {/* Loading */}
//       {isAnalyzing && (
//         <div className="card">
//           <Loader message="Detecting biomarkers..." />
//         </div>
//       )}

//       {/* Results */}
//       {biomarkers.length > 0 && !isAnalyzing && (
//         <div className="space-y-6">
//           <h2 className="text-2xl font-bold text-gray-900">
//             Detected Biomarkers ({biomarkers.length})
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {biomarkers.map((biomarker, index) => (
//               <div key={index} className="card border-l-4 border-primary-500">
//                 <div className="flex items-start gap-3 mb-4">
//                   <div className="p-2 bg-primary-50 rounded-lg">
//                     <Dna className="w-6 h-6 text-primary-600" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {biomarker.name}
//                     </h3>
//                     <p className="text-sm text-gray-600">{biomarker.category}</p>
//                   </div>
//                   <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
//                     {(biomarker.confidence * 100).toFixed(0)}%
//                   </span>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center py-2 border-t border-gray-100">
//                     <span className="text-sm text-gray-600">Value:</span>
//                     <span className="font-medium text-gray-900">
//                       {typeof biomarker.value === 'boolean'
//                         ? biomarker.value
//                           ? 'Present'
//                           : 'Absent'
//                         : biomarker.value}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center py-2 border-t border-gray-100">
//                     <span className="text-sm text-gray-600">Detection Method:</span>
//                     <span className="font-medium text-gray-900">
//                       {biomarker.detectionMethod}
//                     </span>
//                   </div>
//                   {biomarker.associatedGenes.length > 0 && (
//                     <div className="py-2 border-t border-gray-100">
//                       <span className="text-sm text-gray-600">Associated Genes:</span>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {biomarker.associatedGenes.map((gene) => (
//                           <span
//                             key={gene}
//                             className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
//                           >
//                             {gene}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   <div className="py-2 border-t border-gray-100">
//                     <span className="text-sm text-gray-600 block mb-2">
//                       Clinical Relevance:
//                     </span>
//                     <p className="text-sm text-gray-900">
//                       {biomarker.clinicalRelevance}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default BiomarkerDetection
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { detectBiomarkers } from '../../redux/slices/analysisSlice'
import { toast } from 'react-toastify'
import Loader from '../common/Loader'
import { Play, Dna } from 'lucide-react'

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id)

const BiomarkerDetection = () => {
  const dispatch = useDispatch()

  const {
    biomarkers = [],
    isAnalyzing,
    currentAnalysisId
  } = useSelector((state) => state.analysis)

  const handleDetection = async () => {
    if (!currentAnalysisId) {
      toast.error('Please perform tumour detection first')
      return
    }

    if (!isValidObjectId(currentAnalysisId)) {
      toast.error('Invalid analysis reference')
      return
    }

    try {
      await dispatch(
        detectBiomarkers({ analysisId: currentAnalysisId })
      ).unwrap()

      toast.success('Biomarkers detected successfully')
    } catch (error) {
      toast.error(error || 'Biomarker detection failed')
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Imaging Biomarker Detection
      </h1>

      {/* Controls */}
      <div className="card space-y-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Analysis ID:</span>{' '}
          {currentAnalysisId || 'Not generated yet'}
        </div>

        <button
          onClick={handleDetection}
          disabled={isAnalyzing || !currentAnalysisId}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          {isAnalyzing ? 'Detecting...' : 'Detect Biomarkers'}
        </button>
      </div>

      {/* Loading */}
      {isAnalyzing && (
        <div className="card">
          <Loader message="Detecting biomarkers..." />
        </div>
      )}

      {/* Results */}
      {!isAnalyzing && biomarkers.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Detected Biomarkers ({biomarkers.length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {biomarkers.map((biomarker) => (
              <div
                key={biomarker._id}
                className="card border-l-4 border-primary-500"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Dna className="w-6 h-6 text-primary-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {biomarker.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {biomarker.category}
                    </p>
                  </div>

                  {typeof biomarker.confidence === 'number' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {(biomarker.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Value:</span>
                    <span className="font-medium text-gray-900">
                      {typeof biomarker.value === 'boolean'
                        ? biomarker.value
                          ? 'Present'
                          : 'Absent'
                        : biomarker.value ?? 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600">
                      Detection Method:
                    </span>
                    <span className="font-medium text-gray-900">
                      {biomarker.detectionMethod || 'Imaging Analysis'}
                    </span>
                  </div>

                  {biomarker.associatedGenes?.length > 0 && (
                    <div className="py-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">
                        Associated Genes:
                      </span>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {biomarker.associatedGenes.map((gene) => (
                          <span
                            key={gene}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                          >
                            {gene}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {biomarker.clinicalRelevance && (
                    <div className="py-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600 block mb-1">
                        Clinical Relevance:
                      </span>
                      <p className="text-sm text-gray-900">
                        {biomarker.clinicalRelevance}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BiomarkerDetection
