import { useState } from 'react'
import './LoginModal.css'
import { API_URL } from '../config'

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          password: password,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Invalid username or password')
      }

      // Get user data from /me endpoint
      const meResponse = await fetch(`${API_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!meResponse.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await meResponse.json()
      const { data: userDataPayload } = userData
      onLoginSuccess(userDataPayload)
      
      setUsername('')
      setPassword('')
      onClose()
    } catch (error) {
      setError(error.message || 'An error occurred during login')
      console.error('Login error:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Login</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal

