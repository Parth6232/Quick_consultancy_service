import { useEffect } from 'react'
import BlogListContainer from '../features/blog/BlogListContainer.jsx'

const BlogPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div>
      <BlogListContainer />
    </div>
  )
}

export default BlogPage
