const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  contactNumber: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  medicalHistory: [{
    condition: String,
    diagnosisDate: Date,
    notes: String
  }],
  geneticData: {
    sequenced: { type: Boolean, default: false },
    mutations: [String],
    riskFactors: [String]
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Deceased'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);