import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { entriesApi } from '../lib/api'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Tag, 
  Lock, 
  Unlock,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

export default function EntryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntry()
  }, [id])

  const fetchEntry = async () => {
    try {
      const response = await entriesApi.getById(id)
      setEntry(response.data.entry)
    } catch (error) {
      console.error('Failed to fetch entry:', error)
      toast.error('Failed to load entry')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return
    }

    try {
      await entriesApi.delete(id)
      toast.success('Entry deleted successfully')
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to delete entry:', error)
      toast.error('Failed to delete entry')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Entry not found</h2>
        <p className="text-gray-600 mt-2">The entry you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn btn-primary btn-md mt-4">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{entry.title}</h1>
            <p className="text-sm text-gray-600">
              {entry.is_private ? 'Private entry' : 'Public entry'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/entries/${id}/edit`}
            className="btn btn-primary btn-sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-outline btn-sm text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Entry Content */}
      <div className="card">
        <div className="card-content">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created: {format(new Date(entry.created_at), 'MMM d, yyyy \'at\' h:mm a')}</span>
            </div>
            
            {entry.updated_at !== entry.created_at && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Updated: {format(new Date(entry.updated_at), 'MMM d, yyyy \'at\' h:mm a')}</span>
              </div>
            )}
            
            {entry.mood && (
              <div className="flex items-center space-x-1">
                <span>😊</span>
                <span>Mood: {entry.mood}</span>
              </div>
            )}
            
            {entry.is_private ? (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Lock className="w-4 h-4" />
                <span>Private</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-green-600">
                <Unlock className="w-4 h-4" />
                <span>Public</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {entry.categories && entry.categories.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Categories:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {entry.content}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline btn-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center space-x-2">
          <Link
            to="/entries/new"
            className="btn btn-primary btn-sm"
          >
            Create New Entry
          </Link>
        </div>
      </div>
    </div>
  )
}
