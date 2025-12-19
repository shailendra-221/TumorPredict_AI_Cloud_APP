import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layouts
import AuthLayout from './components/layout/AuthLayout'
import MainLayout from './components/layout/MainLayout'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'

// Protected Components
import ProtectedRoute from './components/common/ProtectedRoute'
import Dashboard from './components/dashboard/Dashboard'
import PatientList from './components/patient/PatientList'
import PatientForm from './components/patient/PatientForm'
import PatientDetails from './components/patient/PatientDetails'
import MRIUpload from './components/mri/MRIUpload'
import MRIViewer from './components/mri/MRIViewer'
import MRIGallery from './components/mri/MRIGallery'
import TumourAnalysis from './components/analysis/TumourAnalysis'
import AnalysisResults from './components/analysis/AnalysisResult'
import BiomarkerDetection from './components/analysis/BiomarkerDetection'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Patient Routes */}
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/patients/:id/edit" element={<PatientForm />} />
            
            {/* MRI Routes */}
            <Route path="/mri/upload" element={<MRIUpload />} />
            <Route path="/mri/gallery/:patientId" element={<MRIGallery />} />
            <Route path="/mri/:id" element={<MRIViewer />} />
            
            {/* Analysis Routes */}
            <Route path="/analysis/tumour" element={<TumourAnalysis />} />
            <Route path="/analysis/:id" element={<AnalysisResults />} />
            <Route path="/analysis/biomarkers" element={<BiomarkerDetection />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App