import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Sidebar from '../common/Sidebar'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        } pt-16`}>
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout