import { useEffect } from 'react'
import PortfolioDetailContainer from '../features/portfolio/PortfolioDetailContainer.jsx'

const PortfolioDetailPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <PortfolioDetailContainer />
    </div>
  )
}

export default PortfolioDetailPage
