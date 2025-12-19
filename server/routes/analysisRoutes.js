const express = require('express');
const {
  detectTumour,
  detectBiomarkers,
  getAnalysis,
  getPatientAnalyses
} = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// POST /api/analysis/tumour-detection
router.post('/tumour-detection', detectTumour);

// POST /api/analysis/biomarker-detection
router.post('/biomarker-detection', detectBiomarkers);

// GET /api/analysis/:id
router.get('/:id', getAnalysis);

// GET /api/analysis/patient/:patientId
router.get('/patient/:patientId', getPatientAnalyses);

module.exports = router;