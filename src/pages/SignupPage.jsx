import { useEffect } from 'react'
import SignupContainer from '../features/auth/SignupContainer.jsx'

const SignupPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <SignupContainer />
    </div>
  )
}

export default SignupPage
