const express = require('express');
const {
  uploadMRI,
  getPatientMRIs,
  getMRI,
  deleteMRI
} = require('../controllers/mriController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('mriImage'), uploadMRI);
router.get('/patient/:patientId', getPatientMRIs);
router.route('/:id')
  .get(getMRI)
  .delete(deleteMRI);

module.exports = router;