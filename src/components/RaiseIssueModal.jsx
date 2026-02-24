import { useState } from 'react'
import './RaiseIssueModal.css'
import { API_URL } from '../config'
import Toast from './Toast'

function RaiseIssueModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to create ticket')
      }

      setTitle('')
      setDescription('')
      setShowToast(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      setError(error.message || 'An error occurred while creating the ticket')
      console.error('Ticket creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Raise Issue</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="issue-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter issue title"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter issue description"
                rows="5"
                disabled={loading}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
      <Toast 
        isOpen={showToast} 
        message="Issue created successfully!" 
        type="success"
        onClose={() => setShowToast(false)}
      />
    </>
  )
}

export default RaiseIssueModal
