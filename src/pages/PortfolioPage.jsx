import { useEffect } from 'react'
import PortfolioListContainer from '../features/portfolio/PortfolioListContainer.jsx'

const PortfolioPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <PortfolioListContainer />
    </div>
  )
}

export default PortfolioPage
