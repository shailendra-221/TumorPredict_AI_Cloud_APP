import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import { Brain, Menu, LogOut, User } from 'lucide-react'

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Brain MRI Platform
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 font-medium">{user?.name}</span>
            <span className="text-gray-500">•</span>
            <span className="text-primary-600 capitalize">{user?.role}</span>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar