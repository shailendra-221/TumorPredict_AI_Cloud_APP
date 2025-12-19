const express = require('express');
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatient)
  .put(updatePatient)
  .delete(authorize('admin', 'doctor'), deletePatient);

module.exports = router;