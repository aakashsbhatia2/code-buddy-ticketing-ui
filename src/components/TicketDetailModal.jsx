import { useEffect, useState } from 'react'
import './TicketDetailModal.css'
import { API_URL } from '../config'

function TicketDetailModal({ isOpen, ticket, onClose, user }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && ticket) {
      fetchComments()
    }
  }, [isOpen, ticket])

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/ticket/${ticket.id}/comments`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }

      const { data: commentsData } = await response.json()
      setComments(commentsData || [])
    } catch (err) {
      console.error('Fetch comments error:', err)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/ticket/${ticket.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: user.id,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to add comment')
      }

      setNewComment('')
      await fetchComments()
    } catch (err) {
      setError(err.message || 'An error occurred while adding the comment')
      console.error('Add comment error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !ticket) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{ticket.title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <div className="modal-field">
            <label>Status:</label>
            <span className={`ticket-status ticket-status-${ticket.status?.toLowerCase() || 'open'}`}>
              {ticket.status || 'Open'}
            </span>
          </div>
          <div className="modal-field">
            <label>Ticket Number:</label>
            <span>No. {ticket.number}</span>
          </div>
          <div className="modal-field">
            <label>Created:</label>
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="modal-field full-width">
            <label>Description:</label>
            <p className="description">{ticket.description}</p>
          </div>
          
          <div className="comments-section">
            <h3>Comments</h3>
            {error && <div className="error-message">{error}</div>}
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.user?.userName || 'Unknown'}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt || comment.date).toLocaleString()}
                    </span>
                  </div>
                  <p>{comment.content || comment.text}</p>
                </div>
              ))}
            </div>
            <div className="comment-input-container">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
                disabled={loading}
              />
              <button onClick={handleAddComment} className="comment-btn" disabled={loading}>
                {loading ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetailModal
