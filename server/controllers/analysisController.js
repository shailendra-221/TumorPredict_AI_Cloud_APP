// const TumourAnalysis = require('../models/TumourAnalysis');
// const Biomarker = require('../models/Biomarker');
// const MRIImage = require('../models/MriImage');
// const analysisService = require('../services/analysisService');
// const ApiResponse = require('../utils/apiResponse');

// // @desc    Perform tumour detection
// // @route   POST /api/analysis/tumour-detection
// // @access  Private
// exports.detectTumour = async (req, res) => {
//   try {
//     const { mriImageId } = req.body;

//     // Validate MRI Image exists
//     const mriImage = await MRIImage.findById(mriImageId);
//     if (!mriImage) {
//       return ApiResponse.error(res, 'MRI image not found', 404);
//     }

//     // Perform AI-based tumour detection
//     const detectionResults = await analysisService.detectTumour(mriImageId);

//     // Create analysis record
//     const analysis = await TumourAnalysis.create({
//       mriImage: mriImageId,
//       patient: detectionResults.patientId,
//       detectionResults: detectionResults.detection,
//       phenotypeCharacteristics: detectionResults.phenotype,
//       classification: detectionResults.classification,
//       riskAssessment: detectionResults.risk,
//       analyzedBy: req.user.id
//     });

//     // Populate relationships
//     await analysis.populate(['mriImage', 'patient']);

//     ApiResponse.success(res, analysis, 'Tumour detection completed', 201);
//   } catch (error) {
//     console.error('Tumour detection error:', error);
//     ApiResponse.error(res, error.message, 500);
//   }
// };

// // @desc    Detect biomarkers
// // @route   POST /api/analysis/biomarker-detection
// // @access  Private
// exports.detectBiomarkers = async (req, res) => {
//   try {
//     const { analysisId } = req.body;

//     // Validate analysis exists
//     const analysis = await TumourAnalysis.findById(analysisId);
//     if (!analysis) {
//       return ApiResponse.error(res, 'Analysis not found', 404);
//     }

//     // Detect biomarkers
//     const biomarkers = await analysisService.detectBiomarkers(analysisId);

//     // Create biomarker records
//     const createdBiomarkers = await Biomarker.insertMany(biomarkers);

//     // Update analysis with biomarker references
//     await TumourAnalysis.findByIdAndUpdate(analysisId, {
//       $push: { biomarkers: { $each: createdBiomarkers.map(b => b._id) } }
//     });

//     ApiResponse.success(
//       res,
//       createdBiomarkers,
//       'Biomarkers detected successfully',
//       201
//     );
//   } catch (error) {
//     console.error('Biomarker detection error:', error);
//     ApiResponse.error(res, error.message, 500);
//   }
// };

// // @desc    Get analysis by ID
// // @route   GET /api/analysis/:id
// // @access  Private
// exports.getAnalysis = async (req, res) => {
//   try {
//     const analysis = await TumourAnalysis.findById(req.params.id)
//       .populate('mriImage')
//       .populate('patient')
//       .populate('biomarkers')
//       .populate('analyzedBy', 'name email');

//     if (!analysis) {
//       return ApiResponse.error(res, 'Analysis not found', 404);
//     }

//     ApiResponse.success(res, analysis);
//   } catch (error) {
//     console.error('Get analysis error:', error);
//     ApiResponse.error(res, error.message, 500);
//   }
// };

// // @desc    Get all analyses for a patient
// // @route   GET /api/analysis/patient/:patientId
// // @access  Private
// exports.getPatientAnalyses = async (req, res) => {
//   try {
//     const analyses = await TumourAnalysis.find({
//       patient: req.params.patientId
//     })
//       .populate('mriImage', 'fileName scanType scanDate')
//       .populate('biomarkers')
//       .sort('-createdAt');

//     ApiResponse.success(res, analyses);
//   } catch (error) {
//     console.error('Get patient analyses error:', error);
//     ApiResponse.error(res, error.message, 500);
//   }
// };
// ============================================
// SERVER/CONTROLLERS/ANALYSISCONTROLLER.JS - FIXED VERSION
// ============================================

const TumourAnalysis = require('../models/TumourAnalysis');
const Biomarker = require('../models/BioMarker');
const MRIImage = require('../models/MriImage');
const analysisService = require('../services/analysisService');
const ApiResponse = require('../utils/apiResponse');

// @desc    Perform tumour detection
// @route   POST /api/analysis/tumour-detection
// @access  Private
exports.detectTumour = async (req, res) => {
  try {
    const { mriImageId } = req.body;

    // Validate input
    if (!mriImageId) {
      return ApiResponse.error(res, 'MRI Image ID is required', 400);
    }

    // Validate MRI Image exists
    const mriImage = await MRIImage.findById(mriImageId).populate('patient');
    if (!mriImage) {
      return ApiResponse.error(res, 'MRI image not found', 404);
    }

    console.log('Starting tumour detection for MRI:', mriImageId);

    // Perform AI-based tumour detection
    const detectionResults = await analysisService.detectTumour(mriImageId);

    console.log('Detection results:', JSON.stringify(detectionResults, null, 2));

    // Validate detection results structure
    if (!detectionResults || !detectionResults.detection) {
      throw new Error('Invalid detection results from analysis service');
    }

    // Create analysis record with proper data structure
    const analysisData = {
      mriImage: mriImageId,
      patient: mriImage.patient._id,
      detectionResults: detectionResults.detection,
      analyzedBy: req.user.id,
      analysisDate: new Date()
    };

    // Only add optional fields if tumour was detected
    if (detectionResults.detection.tumourDetected) {
      if (detectionResults.phenotype) {
        analysisData.phenotypeCharacteristics = detectionResults.phenotype;
      }
      if (detectionResults.classification) {
        analysisData.classification = detectionResults.classification;
      }
      if (detectionResults.risk) {
        analysisData.riskAssessment = detectionResults.risk;
      }
    }

    console.log('Creating analysis with data:', JSON.stringify(analysisData, null, 2));

    const analysis = await TumourAnalysis.create(analysisData);

    // Populate relationships
    await analysis.populate([
      { path: 'mriImage', select: 'fileName scanType scanDate' },
      { path: 'patient', select: 'firstName lastName patientId' },
      { path: 'analyzedBy', select: 'name email' }
    ]);

    console.log('Analysis created successfully:', analysis._id);

    ApiResponse.success(res, analysis, 'Tumour detection completed', 201);
  } catch (error) {
    console.error('Tumour detection error:', error);
    console.error('Error stack:', error.stack);
    ApiResponse.error(res, error.message || 'Analysis failed', 500);
  }
};

// @desc    Detect biomarkers
// @route   POST /api/analysis/biomarker-detection
// @access  Private
const mongoose = require('mongoose');

exports.detectBiomarkers = async (req, res) => {
  try {
    const { analysisId } = req.body;

    // 1. Validate presence
    if (!analysisId) {
      return ApiResponse.error(res, 'Analysis ID is required', 400);
    }

    // 2. Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      return ApiResponse.error(res, 'Invalid Analysis ID format', 400);
    }

    // 3. Check analysis exists
    const analysis = await TumourAnalysis.findById(analysisId);
    if (!analysis) {
      return ApiResponse.error(res, 'Analysis not found', 404);
    }

    // 4. Detect biomarkers
    const biomarkers = await analysisService.detectBiomarkers(analysisId);

    if (!biomarkers || biomarkers.length === 0) {
      return ApiResponse.success(res, [], 'No biomarkers detected');
    }

    // 5. Save biomarkers
    const createdBiomarkers = await Biomarker.insertMany(biomarkers);

    // 6. Link biomarkers to analysis
    await TumourAnalysis.findByIdAndUpdate(
      analysisId,
      { $push: { biomarkers: { $each: createdBiomarkers.map(b => b._id) } } }
    );

    return ApiResponse.success(
      res,
      createdBiomarkers,
      'Biomarkers detected successfully',
      201
    );

  } catch (error) {
    console.error('Biomarker detection error:', error);
    return ApiResponse.error(res, 'Biomarker detection failed', 500);
  }
};

// exports.detectBiomarkers = async (req, res) => {
//   try {
//     const { analysisId } = req.body;

//     // Validate input
//     if (!analysisId) {
//       return ApiResponse.error(res, 'Analysis ID is required', 400);
//     }

//     // Validate analysis exists
//     const analysis = await TumourAnalysis.findById(analysisId);
//     if (!analysis) {
//       return ApiResponse.error(res, 'Analysis not found', 404);
//     }

//     console.log('Starting biomarker detection for analysis:', analysisId);

//     // Detect biomarkers
//     const biomarkers = await analysisService.detectBiomarkers(analysisId);

//     if (!biomarkers || biomarkers.length === 0) {
//       return ApiResponse.success(res, [], 'No biomarkers detected');
//     }

//     // Create biomarker records
//     const createdBiomarkers = await Biomarker.insertMany(biomarkers);

//     // Update analysis with biomarker references
//     await TumourAnalysis.findByIdAndUpdate(
//       analysisId,
//       { $push: { biomarkers: { $each: createdBiomarkers.map(b => b._id) } } },
//       { new: true }
//     );

//     console.log('Biomarkers detected successfully:', createdBiomarkers.length);

//     ApiResponse.success(
//       res,
//       createdBiomarkers,
//       'Biomarkers detected successfully',
//       201
//     );
//   } catch (error) {
//     console.error('Biomarker detection error:', error);
//     console.error('Error stack:', error.stack);
//     ApiResponse.error(res, error.message || 'Biomarker detection failed', 500);
//   }
// };
// exports.detectBiomarkers = async (req, res) => {
//   try {
//     const { analysisId } = req.body;

//     if (!analysisId) {
//       return ApiResponse.error(res, 'Analysis ID is required', 400);
//     }

//     if (!mongoose.Types.ObjectId.isValid(analysisId)) {
//       return ApiResponse.error(res, 'Invalid Analysis ID format', 400);
//     }

//     const analysis = await TumourAnalysis.findById(analysisId);
//     if (!analysis) {
//       return ApiResponse.error(res, 'Analysis not found', 404);
//     }

//     console.log('Starting biomarker detection for analysis:', analysisId);

//     // Detect biomarkers
//     const biomarkers = await analysisService.detectBiomarkers(analysisId);

//     if (!biomarkers || biomarkers.length === 0) {
//       return ApiResponse.success(res, [], 'No biomarkers detected');
//     }

//     // Create biomarker records
//     const createdBiomarkers = await Biomarker.insertMany(biomarkers);

//     // Update analysis with biomarker references
//     await TumourAnalysis.findByIdAndUpdate(
//       analysisId,
//       { $push: { biomarkers: { $each: createdBiomarkers.map(b => b._id) } } },
//       { new: true }
//     );

//     console.log('Biomarkers detected successfully:', createdBiomarkers.length);

//     ApiResponse.success(
//       res,
//       createdBiomarkers,
//       'Biomarkers detected successfully',
//       201
//     );
//   } catch (error) {
//     console.error('Biomarker detection error:', error);
//     console.error('Error stack:', error.stack);
//     ApiResponse.error(res, error.message || 'Biomarker detection failed', 500);
//   }
// };

// @desc    Get analysis by ID
// @route   GET /api/analysis/:id
// @access  Private
exports.getAnalysis = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await TumourAnalysis.findById(id)
      .populate('mriImage')
      .populate('patient')
      .populate('biomarkers')
      .populate('analyzedBy', 'name email');

    if (!analysis) {
      return ApiResponse.error(res, 'Analysis not found', 404);
    }

    ApiResponse.success(res, analysis);
  } catch (error) {
    console.error('Get analysis error:', error);
    ApiResponse.error(res, error.message || 'Failed to fetch analysis', 500);
  }
};

// @desc    Get all analyses for a patient
// @route   GET /api/analysis/patient/:patientId
// @access  Private
exports.getPatientAnalyses = async (req, res) => {
  try {
    const { patientId } = req.params;

    const analyses = await TumourAnalysis.find({ patient: patientId })
      .populate('mriImage', 'fileName scanType scanDate')
      .populate('biomarkers')
      .populate('analyzedBy', 'name email')
      .sort('-createdAt');

    ApiResponse.success(res, analyses);
  } catch (error) {
    console.error('Get patient analyses error:', error);
    ApiResponse.error(res, error.message || 'Failed to fetch analyses', 500);
  }
};