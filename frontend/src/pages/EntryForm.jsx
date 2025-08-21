import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { entriesApi, categoriesApi } from '../lib/api'
import { ArrowLeft, Save, Tag, Lock, Unlock } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

export default function EntryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    tags: '',
    is_private: false,
    categoryIds: []
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchEntry()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchEntry = async () => {
    try {
      const response = await entriesApi.getById(id)
      const entry = response.data.entry
      
      setFormData({
        title: entry.title,
        content: entry.content,
        mood: entry.mood || '',
        tags: entry.tags ? entry.tags.join(', ') : '',
        is_private: entry.is_private,
        categoryIds: entry.categories ? 
          categories.filter(cat => entry.categories.includes(cat.name)).map(cat => cat.id) : []
      })
    } catch (error) {
      console.error('Failed to fetch entry:', error)
      toast.error('Failed to load entry')
      navigate('/dashboard')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required')
      return
    }

    setLoading(true)

    try {
      const entryData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      }

      if (isEditing) {
        await entriesApi.update(id, entryData)
        toast.success('Entry updated successfully')
      } else {
        await entriesApi.create(entryData)
        toast.success('Entry created successfully')
      }
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to save entry:', error)
      toast.error(isEditing ? 'Failed to update entry' : 'Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Entry' : 'New Entry'}
            </h1>
            <p className="text-sm text-gray-600">
              {isEditing ? 'Update your diary entry' : 'Capture your thoughts and memories'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="card-content space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Enter entry title..."
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                value={formData.content}
                onChange={handleChange}
                className="textarea min-h-[300px]"
                placeholder="Write your thoughts, memories, or experiences..."
              />
            </div>

            {/* Mood and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
                  Mood
                </label>
                <input
                  id="mood"
                  name="mood"
                  type="text"
                  value={formData.mood}
                  onChange={handleChange}
                  className="input"
                  placeholder="How are you feeling?"
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="flex items-center space-x-2">
              <input
                id="is_private"
                name="is_private"
                type="checkbox"
                checked={formData.is_private}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_private" className="flex items-center space-x-2 text-sm text-gray-700">
                {formData.is_private ? (
                  <Lock className="w-4 h-4 text-yellow-600" />
                ) : (
                  <Unlock className="w-4 h-4 text-green-600" />
                )}
                <span>Mark as private entry</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline btn-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-md"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : (isEditing ? 'Update Entry' : 'Create Entry')}
          </button>
        </div>
      </form>
    </div>
  )
}
