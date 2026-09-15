import { useEffect } from 'react'
import AddPortfolioContainer from '../features/portfolio/AddPortfolioContainer.jsx'

const AddPortfolioPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <AddPortfolioContainer />
    </div>
  )
}

export default AddPortfolioPage
