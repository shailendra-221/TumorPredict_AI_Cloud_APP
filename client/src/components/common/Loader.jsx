import React from 'react'
import { Loader2 } from 'lucide-react'

const Loader = ({ message = 'Loading...', size = 'large' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Loader2 className={`${sizeClasses[size]} text-primary-500 animate-spin`} />
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  )
}

export default Loader