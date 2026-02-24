import { useEffect } from 'react'
import './Toast.css'

function Toast({ message, type = 'success', isOpen, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, duration])

  if (!isOpen) return null

  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  )
}

export default Toast
