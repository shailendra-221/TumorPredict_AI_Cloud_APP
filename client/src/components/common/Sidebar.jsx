import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Upload,
  Brain,
  Activity,
  X,
} from 'lucide-react'

const Sidebar = ({ isOpen }) => {
  const location = useLocation()

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/patients',
      label: 'Patients',
      icon: Users,
    },
    {
      path: '/mri/upload',
      label: 'Upload MRI',
      icon: Upload,
    },
    {
      path: '/analysis/tumour',
      label: 'Tumour Analysis',
      icon: Brain,
    },
    {
      path: '/analysis/biomarkers',
      label: 'Biomarkers',
      icon: Activity,
    },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar