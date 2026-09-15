import { useEffect } from 'react'
import AboutContainer from '../features/about/AboutContainer.jsx'

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <AboutContainer />
    </div>
  )
}

export default AboutPage
