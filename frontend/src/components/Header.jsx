import React, { useState, useEffect, useRef } from 'react'
import { Search, User, LogOut, ChevronDown, X, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useSearch } from '../contexts/SearchContext'

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching, 
    performSearch, 
    clearSearch 
  } = useSearch()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    sections: {
      openingStock: true,
      tanker: true,
      ownProcurement: true,
      thirdParty: true,
      sales: true,
      otherDairySales: true,
      products: true,
      siloClosing: true,
      productsClosing: true,
      waitingTanker: true
    }
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim()) {
      performSearch(query, user.role, filters)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  const handleSearchResultClick = (path) => {
    navigate(path)
    setShowSearchResults(false)
    clearSearch()
  }

  const handleClearSearch = () => {
    clearSearch()
    setShowSearchResults(false)
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get first letter of first name and last name
  const getInitials = () => {
    if (!user.username) return 'U'
    
    const nameParts = user.username.split(' ')
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
    } else {
      return user.username.charAt(0).toUpperCase()
    }
  }

  return (
    <div className="bg-gray-800 shadow-sm border-b border-gray-700 h-16 fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center h-full">
        {/* Fixed left side space with Logo */}
        <div className="flex items-center justify-center w-16">
          <Logo size="default" showText={false} />
        </div>

        {/* Main header content */}
        <div className="flex items-center justify-between flex-1 px-6">
          {/* Sri Chakra Diary Card */}
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <span className="font-medium">Sri Chakra Diary</span>
          </div>

          {/* Center: Large empty space */}
          <div className="flex-1"></div>

          {/* Right side: Search, Filters and User Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search pages, features..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchResultClick(result.path)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{result.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{result.title}</div>
                              <div className="text-sm text-gray-500">{result.description}</div>
                              <div className="text-xs text-blue-600 font-medium">{result.category}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filters toggle */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 text-white bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-2"
              >
                <Filter className="h-4 w-4" /> Filters
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-3 z-50">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Search in sections</div>
                  {Object.entries(filters.sections).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 py-1 text-sm">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          const updated = { ...filters, sections: { ...filters.sections, [key]: e.target.checked } }
                          setFilters(updated)
                          if (searchQuery.trim()) {
                            performSearch(searchQuery, user.role, updated)
                          }
                        }}
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-white hover:bg-gray-700 rounded-lg p-2 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {getInitials()}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                                          <button
                        onClick={() => {
                          setShowDropdown(false)
                          navigate('/profile')
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false)
                        handleLogout()
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}

export default Header
