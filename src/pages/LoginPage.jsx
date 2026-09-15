import { useEffect } from 'react'
import LoginContainer from '../features/auth/LoginContainer.jsx'

const LoginPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <LoginContainer />
    </div>
  )
}

export default LoginPage
