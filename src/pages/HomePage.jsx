import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroContainer from '../features/hero/HeroContainer.jsx'
import StatsContainer from '../features/stats/StatsContainer.jsx'
import ReviewsContainer from '../features/reviews/ReviewsContainer.jsx'

const HomePage = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [location.hash])

  return (
    <div id="top">
      <HeroContainer />
      <StatsContainer />
      <ReviewsContainer />
    </div>
  )
}

export default HomePage
