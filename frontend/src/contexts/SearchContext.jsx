import React, { createContext, useContext, useState } from 'react'

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Define searchable items based on user role
  const getSearchableItems = (userRole) => {
    const baseItems = [
      {
        id: 'home',
        title: 'Home',
        description: 'Go to dashboard',
        path: userRole === 'super_admin' ? '/super-admin/dashboard' : '/home',
        icon: '🏠',
        category: 'Navigation'
      }
    ]

    if (userRole === 'super_admin' || userRole === 'admin') {
      baseItems.push(
        {
          id: 'employees',
          title: 'Employees',
          description: 'Manage employees and view statistics',
          path: '/super-admin/employees',
          icon: '👥',
          category: 'Management'
        },
        {
          id: 'create-employee',
          title: 'Create Employee',
          description: 'Add new employee to the system',
          path: '/super-admin/create-employee',
          icon: '➕',
          category: 'Management'
        },
        {
          id: 'manage-employees',
          title: 'Manage Employees',
          description: 'View, edit, and manage existing employees',
          path: '/super-admin/manage-employees',
          icon: '⚙️',
          category: 'Management'
        },
        {
          id: 'daily-reports',
          title: 'Daily Reports',
          description: 'View and manage daily reports',
          path: '/super-admin/reports',
          icon: '📊',
          category: 'Reports'
        },
        {
          id: 'procurement',
          title: 'Procurement',
          description: 'Procurement dashboard',
          path: '/super-admin/procurement',
          icon: '🛒',
          category: 'Procurement'
        },
        {
          id: 'production',
          title: 'Production',
          description: 'Production dashboard and entries',
          path: '/super-admin/production',
          icon: '🏭',
          category: 'Production'
        },
        { id: 'sales', title: 'Sales', description: 'Sales entry', path: '/production/sales', icon: '💳', category: 'Production' },
        { id: 'other-dairy-sales', title: 'Other Dairy Sales', description: 'Other dairy sales entry', path: '/production/other-dairy-sales', icon: '🥛', category: 'Production' },
        { id: 'products', title: 'Products', description: 'Products entry', path: '/production/products', icon: '📦', category: 'Production' },
        { id: 'silo-closing', title: 'Silo Closing Balance', description: 'Silo closing balance entry', path: '/production/silo-closing-balance', icon: '🛢️', category: 'Production' },
        { id: 'products-closing', title: 'Products Closing Stock', description: 'Products closing stock entry', path: '/production/products-closing-stock', icon: '📦', category: 'Production' },
        { id: 'waiting-tanker', title: 'Waiting Tanker', description: 'Waiting tanker entry', path: '/production/waiting-tanker', icon: '🚚', category: 'Production' },
        { id: 'third-party', title: '3rd Party Procurement', description: 'Third party procurement entry', path: '/procurement/third-party', icon: '🤝', category: 'Procurement' },
        { id: 'opening-stock', title: 'Opening Stock', description: 'Opening stock entry', path: '/opening-stock', icon: '📈', category: 'Procurement' }
      )
    } else {
      baseItems.push(
        {
          id: 'daily-reports',
          title: 'Daily Reports',
          description: 'View and manage daily reports',
          path: '/reports',
          icon: '📊',
          category: 'Reports'
        },
        { id: 'procurement', title: 'Procurement', description: 'Procurement dashboard', path: '/procurement', icon: '🛒', category: 'Procurement' },
        { id: 'production', title: 'Production', description: 'Production dashboard and entries', path: '/production', icon: '🏭', category: 'Production' },
        { id: 'opening-stock', title: 'Opening Stock', description: 'Opening stock entry', path: '/opening-stock', icon: '📈', category: 'Procurement' }
      )
    }

    return baseItems
  }

  const performSearch = (query, userRole, filters) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const searchableItems = getSearchableItems(userRole)
    const filtered = filters ? filterBySections(searchableItems, filters) : searchableItems

    const results = filtered.filter(item => {
      const searchTerm = query.toLowerCase()
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      )
    })

    setSearchResults(results)
    setIsSearching(false)
  }

  const filterBySections = (items, filters) => {
    const enabled = filters?.sections || {}
    return items.filter((it) => {
      if (it.id === 'opening-stock') return enabled.openingStock
      if (it.id === 'third-party') return enabled.thirdParty
      if (it.id === 'sales') return enabled.sales
      if (it.id === 'other-dairy-sales') return enabled.otherDairySales
      if (it.id === 'products') return enabled.products
      if (it.id === 'silo-closing') return enabled.siloClosing
      if (it.id === 'products-closing') return enabled.productsClosing
      if (it.id === 'waiting-tanker') return enabled.waitingTanker
      if (it.id === 'procurement') return enabled.ownProcurement || enabled.thirdParty || enabled.openingStock
      if (it.id === 'production') return enabled.sales || enabled.products || enabled.siloClosing || enabled.productsClosing || enabled.waitingTanker || enabled.otherDairySales
      return true
    })
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}
