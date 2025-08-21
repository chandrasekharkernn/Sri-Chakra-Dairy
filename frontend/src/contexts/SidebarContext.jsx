import React, { createContext, useContext, useState } from 'react'

const SidebarContext = createContext()

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const value = {
    isExpanded,
    setIsExpanded,
    toggleSidebar
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}
