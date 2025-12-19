
 

const MRIImage = require('../models/MriImage');

class AnalysisService {
  // Simulated AI-based tumour detection
  async detectTumour(mriImageId) {
    try {
      console.log('AnalysisService: Starting detection for MRI:', mriImageId);

      const mriImage = await MRIImage.findById(mriImageId).populate('patient');
      
      if (!mriImage) {
        throw new Error('MRI image not found');
      }

      console.log('MRI Image found:', mriImage._id);

      // Update MRI processing status
      await MRIImage.findByIdAndUpdate(mriImageId, { 
        processingStatus: 'Processing' 
      });

      // Simulate processing time (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate simulated results
      const tumourDetected = Math.random() > 0.3; // 70% chance of detection
      
      console.log('Tumour detected:', tumourDetected);

      const results = {
        patientId: mriImage.patient._id,
        detection: {
          tumourDetected,
          confidence: tumourDetected ? (Math.random() * 0.4 + 0.6) : (Math.random() * 0.3 + 0.1),
          location: tumourDetected ? {
            x: Math.floor(Math.random() * 512),
            y: Math.floor(Math.random() * 512),
            z: Math.floor(Math.random() * 100)
          } : undefined,
          size: tumourDetected ? {
            volume: Math.random() * 50000 + 1000,
            dimensions: {
              length: Math.random() * 50 + 10,
              width: Math.random() * 50 + 10,
              height: Math.random() * 50 + 10
            }
          } : undefined
        }
      };

      // Only add these fields if tumour is detected
      if (tumourDetected) {
        results.phenotype = {
          shape: this.getRandomShape(),
          texture: this.getRandomTexture(),
          intensity: Math.random(),
          heterogeneity: Math.random(),
          enhancement: this.getRandomEnhancement()
        };

        results.classification = {
          type: this.getTumourType(),
          grade: this.getTumourGrade(),
          malignancy: this.getMalignancy()
        };

        results.risk = {
          progressionRisk: this.getRiskLevel(),
          recurrenceRisk: this.getRiskLevel(),
          score: Math.random() * 70 + 30 // 30-100 for detected tumours
        };
      } else {
        // Low risk if no tumour detected
        results.risk = {
          progressionRisk: 'Low',
          recurrenceRisk: 'Low',
          score: Math.random() * 20 // 0-20 for no tumour
        };
      }

      // Update MRI status
      await MRIImage.findByIdAndUpdate(mriImageId, { 
        processingStatus: 'Completed',
        analysisCompleted: true
      });

      console.log('Analysis completed successfully');

      return results;
    } catch (error) {
      console.error('AnalysisService error:', error);
      // Update MRI status to failed
      await MRIImage.findByIdAndUpdate(mriImageId, { 
        processingStatus: 'Failed'
      });
      throw error;
    }
  }

  async detectBiomarkers(analysisId) {
    try {
      console.log('AnalysisService: Detecting biomarkers for analysis:', analysisId);

      // Simulate biomarker detection processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const biomarkers = [
        {
          name: 'IDH1 mutation',
          category: 'Genetic',
          value: Math.random() > 0.5,
          significance: 'Prognostic marker for gliomas',
          associatedGenes: ['IDH1'],
          clinicalRelevance: 'Better prognosis in IDH1-mutant tumours',
          detectionMethod: 'Imaging-based inference',
          confidence: Math.random() * 0.3 + 0.7
        },
        {
          name: 'MGMT methylation',
          category: 'Genetic',
          value: Math.random() > 0.5,
          significance: 'Predictive marker for temozolomide response',
          associatedGenes: ['MGMT'],
          clinicalRelevance: 'Predicts response to alkylating agents',
          detectionMethod: 'Radiogenomic analysis',
          confidence: Math.random() * 0.3 + 0.7
        },
        {
          name: 'EGFR amplification',
          category: 'Genetic',
          value: Math.random() > 0.6,
          significance: 'Common in glioblastoma',
          associatedGenes: ['EGFR'],
          clinicalRelevance: 'Potential therapeutic target',
          detectionMethod: 'Texture and enhancement patterns',
          confidence: Math.random() * 0.3 + 0.7
        },
        {
          name: 'Perfusion index',
          category: 'Imaging',
          value: parseFloat((Math.random() * 100).toFixed(2)),
          significance: 'Indicates tumour vascularity',
          associatedGenes: [],
          clinicalRelevance: 'Higher values suggest more aggressive tumours',
          detectionMethod: 'DSC-MRI analysis',
          confidence: Math.random() * 0.2 + 0.8
        },
        {
          name: 'Ki-67 index',
          category: 'Protein',
          value: parseFloat((Math.random() * 40).toFixed(1)),
          significance: 'Cell proliferation marker',
          associatedGenes: ['MKI67'],
          clinicalRelevance: 'Higher values indicate faster growing tumours',
          detectionMethod: 'Texture analysis',
          confidence: Math.random() * 0.25 + 0.7
        }
      ];

      console.log('Biomarkers detected:', biomarkers.length);

      return biomarkers;
    } catch (error) {
      console.error('Biomarker detection error:', error);
      throw error;
    }
  }

  // Helper methods for generating random values
  getRandomShape() {
    const shapes = ['Irregular', 'Spherical', 'Lobulated', 'Infiltrative'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  getRandomTexture() {
    const textures = ['Heterogeneous', 'Homogeneous', 'Mixed', 'Necrotic'];
    return textures[Math.floor(Math.random() * textures.length)];
  }

  getRandomEnhancement() {
    const enhancements = ['Ring-enhancing', 'Nodular', 'Homogeneous', 'None'];
    return enhancements[Math.floor(Math.random() * enhancements.length)];
  }

  getTumourType() {
    const types = [
      'Glioblastoma',
      'Astrocytoma',
      'Oligodendroglioma',
      'Meningioma',
      'Metastasis'
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  getTumourGrade() {
    const grades = ['Grade I', 'Grade II', 'Grade III', 'Grade IV'];
    return grades[Math.floor(Math.random() * grades.length)];
  }

  getMalignancy() {
    const malignancies = [
      'Benign',
      'Low-grade malignant',
      'High-grade malignant'
    ];
    return malignancies[Math.floor(Math.random() * malignancies.length)];
  }

  getRiskLevel() {
    const levels = ['Low', 'Moderate', 'High'];
    const random = Math.random();
    if (random < 0.33) return 'Low';
    if (random < 0.66) return 'Moderate';
    return 'High';
  }
}

module.exports = new AnalysisService();
// const MRIImage = require('../models/MriImage');


// class AnalysisService {
//   // Simulated AI-based tumour detection
//   async detectTumour(mriImageId) {
//     const mriImage = await MRIImage.findById(mriImageId).populate('patient');
    
//     if (!mriImage) {
//       throw new Error('MRI image not found');
//     }

//     // Update MRI processing status
//     await MRIImage.findByIdAndUpdate(mriImageId, { 
//       processingStatus: 'Processing' 
//     });

//     // Simulate processing time (2 seconds)
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     // Generate simulated results (In production, call actual ML model)
//     const tumourDetected = Math.random() > 0.3; // 70% chance
    
//     const results = {
//       patientId: mriImage.patient._id,
//       detection: {
//         tumourDetected,
//         confidence: Math.random() * 0.4 + 0.6, // 60-100%
//         location: tumourDetected ? {
//           x: Math.floor(Math.random() * 512),
//           y: Math.floor(Math.random() * 512),
//           z: Math.floor(Math.random() * 100)
//         } : null,
//         size: tumourDetected ? {
//           volume: Math.random() * 50000 + 1000,
//           dimensions: {
//             length: Math.random() * 50 + 10,
//             width: Math.random() * 50 + 10,
//             height: Math.random() * 50 + 10
//           }
//         } : null
//       },
//       phenotype: tumourDetected ? {
//         shape: this.getRandomShape(),
//         texture: this.getRandomTexture(),
//         intensity: Math.random(),
//         heterogeneity: Math.random(),
//         enhancement: this.getRandomEnhancement()
//       } : null,
//       classification: tumourDetected ? {
//         type: this.getTumourType(),
//         grade: this.getTumourGrade(),
//         malignancy: this.getMalignancy()
//       } : null,
//       risk: tumourDetected ? {
//         progressionRisk: this.getRiskLevel(),
//         recurrenceRisk: this.getRiskLevel(),
//         score: Math.random() * 100
//       } : {
//         progressionRisk: 'Low',
//         recurrenceRisk: 'Low',
//         score: Math.random() * 30
//       }
//     };

//     // Update MRI status
//     await MRIImage.findByIdAndUpdate(mriImageId, { 
//       processingStatus: 'Completed',
//       analysisCompleted: true
//     });

//     return results;
//   }

//   async detectBiomarkers(analysisId) {
//     // Simulate biomarker detection
//     await new Promise(resolve => setTimeout(resolve, 1500));

//     const biomarkers = [
//       {
//         name: 'IDH1 mutation',
//         category: 'Genetic',
//         value: Math.random() > 0.5,
//         significance: 'Prognostic marker for gliomas',
//         associatedGenes: ['IDH1'],
//         clinicalRelevance: 'Better prognosis in IDH1-mutant tumours',
//         detectionMethod: 'Imaging-based inference',
//         confidence: Math.random() * 0.3 + 0.7
//       },
//       {
//         name: 'MGMT methylation',
//         category: 'Genetic',
//         value: Math.random() > 0.5,
//         significance: 'Predictive marker for temozolomide response',
//         associatedGenes: ['MGMT'],
//         clinicalRelevance: 'Predicts response to alkylating agents',
//         detectionMethod: 'Radiogenomic analysis',
//         confidence: Math.random() * 0.3 + 0.7
//       },
//       {
//         name: 'EGFR amplification',
//         category: 'Genetic',
//         value: Math.random() > 0.6,
//         significance: 'Common in glioblastoma',
//         associatedGenes: ['EGFR'],
//         clinicalRelevance: 'Potential therapeutic target',
//         detectionMethod: 'Texture and enhancement patterns',
//         confidence: Math.random() * 0.3 + 0.7
//       },
//       {
//         name: 'Perfusion index',
//         category: 'Imaging',
//         value: Math.random() * 100,
//         significance: 'Indicates tumour vascularity',
//         associatedGenes: [],
//         clinicalRelevance: 'Higher values suggest more aggressive tumours',
//         detectionMethod: 'DSC-MRI analysis',
//         confidence: Math.random() * 0.2 + 0.8
//       }
//     ];

//     return biomarkers;
//   }

//   // Helper methods
//   getRandomShape() {
//     const shapes = ['Irregular', 'Spherical', 'Lobulated', 'Infiltrative'];
//     return shapes[Math.floor(Math.random() * shapes.length)];
//   }

//   getRandomTexture() {
//     const textures = ['Heterogeneous', 'Homogeneous', 'Mixed', 'Necrotic'];
//     return textures[Math.floor(Math.random() * textures.length)];
//   }

//   getRandomEnhancement() {
//     const enhancements = ['Ring-enhancing', 'Nodular', 'Homogeneous', 'None'];
//     return enhancements[Math.floor(Math.random() * enhancements.length)];
//   }

//   getTumourType() {
//     const types = [
//       'Glioblastoma',
//       'Astrocytoma',
//       'Oligodendroglioma',
//       'Meningioma',
//       'Metastasis'
//     ];
//     return types[Math.floor(Math.random() * types.length)];
//   }

//   getTumourGrade() {
//     const grades = ['Grade I', 'Grade II', 'Grade III', 'Grade IV'];
//     return grades[Math.floor(Math.random() * grades.length)];
//   }

//   getMalignancy() {
//     const malignancies = [
//       'Benign',
//       'Low-grade malignant',
//       'High-grade malignant'
//     ];
//     return malignancies[Math.floor(Math.random() * malignancies.length)];
//   }

//   getRiskLevel() {
//     const levels = ['Low', 'Moderate', 'High'];
//     return levels[Math.floor(Math.random() * levels.length)];
//   }
// }

// module.exports = new AnalysisService();

