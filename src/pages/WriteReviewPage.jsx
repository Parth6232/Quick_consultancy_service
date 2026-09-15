import { useEffect } from 'react'
import AddReviewContainer from '../features/reviews/AddReviewContainer.jsx'

const WriteReviewPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div>
      <AddReviewContainer />
    </div>
  )
}

export default WriteReviewPage
