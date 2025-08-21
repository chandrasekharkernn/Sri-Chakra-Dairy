import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-16">
        {/* Content Area */}
        <div className="pt-24 p-8">
          {/* Welcome Message - Green text only */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-green-600">
              Hello, Welcome {user.username || 'User'} !!
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
