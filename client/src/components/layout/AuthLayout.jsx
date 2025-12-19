import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthLayout = () => {
  const { user } = useSelector((state) => state.auth)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-purple-600 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}

export default AuthLayout