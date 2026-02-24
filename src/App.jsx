import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Header from './components/Header'
import TicketsList from './components/TicketsList'
import { API_URL } from './config'
import { setUser, setLoading } from './store/authSlice'

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          credentials: 'include',
        })

        if (response.ok) {
          const { data: userData } = await response.json()
          dispatch(setUser(userData))
        } else {
          dispatch(setLoading(false))
        }
      } catch (error) {
        console.log('User not logged in')
        dispatch(setLoading(false))
      }
    }

    checkAuth()
  }, [dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Header user={user} />
      {user && <TicketsList user={user} />}
    </div>
  )
}

export default App
