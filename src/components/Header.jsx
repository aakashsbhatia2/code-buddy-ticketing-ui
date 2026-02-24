import { useState } from 'react'
import { useDispatch } from 'react-redux'
import './Header.css'
import LoginModal from './LoginModal'
import RaiseIssueModal from './RaiseIssueModal'
import { API_URL } from '../config'
import { setUser, logout } from '../store/authSlice'

function Header({ user }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRaiseIssueModalOpen, setIsRaiseIssueModalOpen] = useState(false)
  const dispatch = useDispatch()

  const handleLoginSuccess = (userData) => {
    dispatch(setUser(userData))
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      
      dispatch(logout())
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1 className="app-name">Support Buddy</h1>
          {user && (
            <button className="raise-issue-btn" onClick={() => setIsRaiseIssueModalOpen(true)}>
              Raise Issue
            </button>
          )}
        </div>
        <div className="header-right">
          {user ? (
            <div className="user-section">
              <span className="welcome-text">Welcome {user.userName}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </button>
          )}
        </div>
      </header>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <RaiseIssueModal
        isOpen={isRaiseIssueModalOpen}
        onClose={() => setIsRaiseIssueModalOpen(false)}
      />
    </>
  )
}

export default Header
