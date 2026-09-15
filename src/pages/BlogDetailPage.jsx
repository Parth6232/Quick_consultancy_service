import { useEffect } from 'react'
import BlogDetailContainer from '../features/blog/BlogDetailContainer.jsx'

const BlogDetailPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <BlogDetailContainer />
    </div>
  )
}

export default BlogDetailPage
