import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, FileText, Users, ShoppingCart, Factory } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const { isExpanded, setIsExpanded } = useSidebar()

  const handleMouseEnter = () => { setIsExpanded(true) }
  const handleMouseLeave = () => { setIsExpanded(false) }
  const handleMenuItemClick = (path) => { navigate(path) }
  const handleIconClick = () => { setIsExpanded(!isExpanded) }

  const menuItems = (user.role === 'super_admin' || user.role === 'admin')
    ? [
        { title: 'Home', path: '/super-admin/dashboard', icon: Home },
        { title: 'Employees', path: '/super-admin/employees', icon: Users },
        { title: 'Daily Reports', path: '/super-admin/daily-reports', icon: FileText },
        { title: 'Procurement', path: '/super-admin/procurement', icon: ShoppingCart },
        { title: 'Production', path: '/super-admin/production', icon: Factory }
      ]
    : [
        { title: 'Home', path: '/home', icon: Home },
        { title: 'Daily Reports', path: '/reports', icon: FileText },
        { title: 'Procurement', path: '/procurement', icon: ShoppingCart },
        { title: 'Production', path: '/production', icon: Factory }
      ]

  return (
    <div className={`bg-gray-800 h-screen fixed left-0 top-16 shadow-lg transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-16'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <nav className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={item.title}>
                <button
                  onClick={() => {
                    handleMenuItemClick(item.path)
                    handleIconClick()
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={!isExpanded ? item.title : ''}
                >
                  <Icon className="h-5 w-5" />
                  {isExpanded && (
                    <span className="ml-3">{item.title}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
