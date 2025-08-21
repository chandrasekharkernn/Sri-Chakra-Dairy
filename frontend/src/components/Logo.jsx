import React from 'react'

const Logo = ({ className = '', showText = true, size = 'xlarge' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    default: 'h-12 w-12',
    large: 'h-16 w-16',
    xlarge: 'h-32 w-32'
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/sri chakra logo.png" 
        alt="Sri Chakra Dairy Logo"
        className={`${sizeClasses[size]} object-contain`}
        style={{ 
          background: 'transparent',
          border: 'none',
          outline: 'none',
          boxShadow: 'none'
        }}
      />
      {showText && (
        <div className="ml-3">
          <div className="text-xl font-bold text-gray-900">Sri Chakra</div>
          <div className="text-base text-gray-600">Dairy</div>
        </div>
      )}
    </div>
  )
}

export default Logo
