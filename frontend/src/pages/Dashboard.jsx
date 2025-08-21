import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { entriesApi, categoriesApi } from '../lib/api'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  BookOpen
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  const [entries, setEntries] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [searchTerm, selectedCategory, sortBy, sortOrder, pagination.currentPage])

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.currentPage,
        limit: 10,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        sort: sortBy,
        order: sortOrder
      }

      const response = await entriesApi.getAll(params)
      setEntries(response.data.entries)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Failed to fetch entries:', error)
      toast.error('Failed to load entries')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return
    }

    try {
      await entriesApi.delete(id)
      toast.success('Entry deleted successfully')
      fetchEntries()
    } catch (error) {
      console.error('Failed to delete entry:', error)
      toast.error('Failed to delete entry')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSortBy('created_at')
    setSortOrder('desc')
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Diary</h1>
          <p className="mt-1 text-sm text-gray-600">
            Capture your thoughts and memories
          </p>
        </div>
        <Link
          to="/entries/new"
          className="btn btn-primary btn-md mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-content">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field)
                    setSortOrder(order)
                  }}
                  className="input"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="updated_at-desc">Recently Updated</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button type="submit" className="btn btn-primary btn-sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
              
              {(searchTerm || selectedCategory || sortBy !== 'created_at' || sortOrder !== 'desc') && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-outline btn-sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="card">
          <div className="card-content text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No entries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first diary entry'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <div className="mt-6">
                <Link to="/entries/new" className="btn btn-primary btn-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Entry
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <Link 
                          to={`/entries/${entry.id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {entry.title}
                        </Link>
                      </h3>
                      {entry.is_private && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Private
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {entry.content.substring(0, 150)}
                      {entry.content.length > 150 && '...'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
                      </div>
                      
                      {entry.mood && (
                        <div className="flex items-center space-x-1">
                          <span>😊</span>
                          <span>{entry.mood}</span>
                        </div>
                      )}
                      
                      {entry.categories && entry.categories.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{entry.categories.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/entries/${entry.id}`}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View entry"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/entries/${entry.id}/edit`}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit entry"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalEntries} total entries)
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="btn btn-outline btn-sm disabled:opacity-50"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="btn btn-outline btn-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
