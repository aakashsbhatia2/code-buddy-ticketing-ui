import { useEffect, useState } from 'react'
import './TicketsList.css'
import { API_URL } from '../config'
import TicketDetailModal from './TicketDetailModal'

function TicketsList({ user }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return

      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/tickets/list`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch tickets')
        }

        const { data: ticketsData } = await response.json()
        setTickets(ticketsData || [])
      } catch (error) {
        setError(error.message || 'An error occurred while fetching tickets')
        console.error('Fetch tickets error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [user])

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  if (loading) {
    return <div className="tickets-container"><div className="loading">Loading tickets...</div></div>
  }

  if (error) {
    return <div className="tickets-container"><div className="error">{error}</div></div>
  }

  return (
    <div className="tickets-container">
      <h2>My Tickets</h2>
      {tickets.length === 0 ? (
        <p className="no-tickets">No tickets yet</p>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card" onClick={() => handleTicketClick(ticket)}>
              <div className="ticket-header">
                <h3 className="ticket-title">{ticket.title}</h3>
                <span className={`ticket-status ticket-status-${ticket.status?.toLowerCase() || 'open'}`}>
                  {ticket.status || 'Open'}
                </span>
              </div>
              <p className="ticket-description">{ticket.description}</p>
              <div className="ticket-footer">
                <span className="ticket-number">No. {ticket.number}</span>
                <span className="ticket-date">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <TicketDetailModal 
        isOpen={isModalOpen} 
        ticket={selectedTicket}
        user={user}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default TicketsList
