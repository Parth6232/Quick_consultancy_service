import { useEffect } from 'react'
import AdminLoginContainer from '../features/auth/AdminLoginContainer.jsx'

const AdminLoginPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <AdminLoginContainer />
    </div>
  )
}

export default AdminLoginPage
