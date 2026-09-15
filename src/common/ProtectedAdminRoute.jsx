import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedAdminRoute = ({ children }) => {
  const role = useSelector((s) => s.auth.user?.role)
  return role === 'admin' ? children : <Navigate to="/admin-login" replace />
}

export default ProtectedAdminRoute
