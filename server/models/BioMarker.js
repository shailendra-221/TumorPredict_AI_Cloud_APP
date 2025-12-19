const mongoose = require('mongoose');

const biomarkerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Genetic', 'Protein', 'Imaging', 'Metabolic'],
    required: true
  },
  value: mongoose.Schema.Types.Mixed,
  significance: String,
  associatedGenes: [String],
  clinicalRelevance: String,
  detectionMethod: String,
  confidence: {
    type: Number,
    min: 0,
    max: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Biomarker', biomarkerSchema);