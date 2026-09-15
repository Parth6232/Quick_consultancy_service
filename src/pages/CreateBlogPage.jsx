import { useEffect } from 'react'
import CreateBlogContainer from '../features/blog/CreateBlogContainer.jsx'

const CreateBlogPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <CreateBlogContainer />
    </div>
  )
}

export default CreateBlogPage
