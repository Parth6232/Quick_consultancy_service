import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { useGetBlogsQuery, useLikeBlogMutation, useDeleteBlogMutation } from '../../store/redux/apiSlice'
import TiltCard from '../../common/TiltCard.jsx'
import GradientBorderCard from '../../common/GradientBorderCard.jsx'
import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'

// ── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-slate-700" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
      <div className="flex items-center gap-3 pt-2">
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16" />
        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16" />
      </div>
    </div>
  </div>
)

// ── Blog Card ──────────────────────────────────────────────────────────────
const BlogCard = ({ post, index, isAdmin }) => {
  const excerpt = post.content?.length > 120 ? post.content.slice(0, 120) + '…' : post.content
  const [likeBlog] = useLikeBlogMutation()
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()
  const token = useSelector((s) => s.auth.token)
  const navigate = useNavigate()
  const liked = !!post.likedByUser

  const handleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Bina login ke like nahi kar sakte — login page par bhej do.
    if (!token) {
      navigate('/login')
      return
    }
    await likeBlog(post._id)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Kya aap sach me is post ko delete karna chahte hain?')) return
    await deleteBlog(post._id)
  }

  return (
    <Reveal delay={index * 0.07}>
      <div className="relative h-full">
        {/* Sirf admin ko Edit/Delete dikhega, baaki kisi user ko nahi */}
        {isAdmin && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <Link
              to={`/blog/edit/${post._id}`}
              onClick={(e) => e.stopPropagation()}
              title="Edit post"
              className="cursor-pointer w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white dark:hover:bg-slate-900 transition"
            >
              <Icon name="FaPenToSquare" className="text-xs" />
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete post"
              className="cursor-pointer w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-red-600 dark:text-red-400 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white dark:hover:bg-slate-900 transition"
            >
              <Icon name="FaTrash" className="text-xs" />
            </button>
          </div>
        )}

        <TiltCard maxTilt={8} className="h-full">
          <GradientBorderCard rounded="rounded-xl" className="shadow-sm hover:shadow-glossy-lg transition-shadow duration-300 h-full">
            <div className="group relative overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 rounded-xl h-full flex flex-col">
              {/* Shine sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

              {/* Image */}
              <div className="relative overflow-hidden h-48 shrink-0 bg-gray-100 dark:bg-slate-700">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="FaNewspaper" className="text-4xl text-gray-300 dark:text-slate-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
                  {excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {/* Inline Like Button — toggle: click se like, dobara click se unlike */}
                    <motion.button
                      onClick={handleLike}
                      whileTap={{ scale: 1.4 }}
                      className={`cursor-pointer flex items-center gap-1 transition-colors ${liked ? 'text-rose-500' : 'hover:text-rose-400'
                        }`}
                      title={token ? 'Like this post' : 'Log in to like'}
                    >
                      <Icon name="FaHeart" className={liked ? 'text-rose-500' : 'text-rose-400'} />
                      <span>{post.likes ?? 0}</span>
                    </motion.button>
                    <span className="mx-1">·</span>
                    <Icon name="FaCommentDots" className="text-blue-400" />
                    <span>{post.comments?.length ?? 0}</span>
                  </div>
                  <Link
                    to={`/blog/${post._id}`}
                    className="cursor-pointer text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    Read More
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </div>
            </div>
          </GradientBorderCard>
        </TiltCard>
      </div>
    </Reveal>
  )
}

// ── Main Container ─────────────────────────────────────────────────────────
const BlogListContainer = () => {
  const { data: blogs, isLoading, isError } = useGetBlogsQuery()
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin')

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <Reveal className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-blue-100 dark:border-blue-500/20">
          <Icon name="FaNewspaper" />
          Our Blog
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Insights &{' '}
          <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            Expert Advice
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          Stay informed with our latest articles on tax, legal, business strategy, and more.
        </p>
        {isAdmin && (
          <div className="mt-4">
            <Link
              to="/blog/create"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 px-5 py-2.5 rounded-xl shadow-glossy transition active:scale-95"
            >
              <Icon name="FaPlus" className="text-xs" />
              Write a Post
            </Link>
          </div>
        )}
      </Reveal>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-20">
          <Icon name="FaXmark" className="text-4xl text-red-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Failed to load blog posts. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && blogs?.length === 0 && (
        <div className="text-center py-20">
          <Icon name="FaNewspaper" className="text-5xl text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-700 dark:text-gray-300 font-semibold text-lg mb-1">No posts yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Be the first to share an insight!</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && blogs?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: 1000 }}>
          <AnimatePresence mode="popLayout">
            {blogs.map((post, i) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
              >
                <BlogCard post={post} index={i} isAdmin={isAdmin} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

export default BlogListContainer