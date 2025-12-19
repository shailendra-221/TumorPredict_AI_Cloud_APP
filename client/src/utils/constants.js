export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const MAX_FILE_SIZE = import.meta.env.VITE_MAX_FILE_SIZE || 50

export const SCAN_TYPES = [
  { value: 'T1', label: 'T1-weighted' },
  { value: 'T2', label: 'T2-weighted' },
  { value: 'FLAIR', label: 'FLAIR' },
  { value: 'DWI', label: 'DWI' },
  { value: 'Contrast', label: 'Contrast-enhanced' },
]

export const PATIENT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DECEASED: 'Deceased',
}

export const ANALYSIS_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
}

export const USER_ROLES = {
  DOCTOR: 'doctor',
  RESEARCHER: 'researcher',
  ADMIN: 'admin',
}