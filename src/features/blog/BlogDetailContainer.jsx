import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useGetBlogByIdQuery, useLikeBlogMutation, useAddCommentMutation, useDeleteBlogMutation } from '../../store/redux/apiSlice'
import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'
import Button from '../../common/Button.jsx'

// ── Like Particle Burst ────────────────────────────────────────────────────
const HeartParticle = ({ i }) => {
  const angle = (i / 8) * 360
  const rad = (angle * Math.PI) / 180
  const tx = Math.cos(rad) * 32
  const ty = Math.sin(rad) * 32
  return (
    <motion.span
      className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 pointer-events-none"
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: 0, x: tx, y: ty, scale: 0.5 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      style={{ left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }}
    />
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-8" />
    <div className="h-72 bg-gray-200 dark:bg-slate-700 rounded-2xl mb-8" />
    <div className="space-y-3 mb-6">
      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 dark:bg-slate-700 rounded" style={{ width: `${80 + Math.random() * 20}%` }} />
      ))}
    </div>
  </div>
)

const BlogDetailContainer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: post, isLoading, isError } = useGetBlogByIdQuery(id)
  const [likeBlog] = useLikeBlogMutation()
  const [addComment] = useAddCommentMutation()
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()
  const token = useSelector((s) => s.auth.token)
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin')

  const [burst, setBurst] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Server hi batata hai ki current user ne like kiya hai ya nahi (post.likedByUser)
  const liked = !!post?.likedByUser

  const handleLike = async () => {
    // Bina login ke like nahi kar sakte
    if (!token) {
      navigate('/login')
      return
    }
    if (!liked) {
      setBurst(true)
      setTimeout(() => setBurst(false), 600)
    }
    await likeBlog(id) // toggle: like ho to unlike, na ho to like
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    await addComment({ id, text: commentText })
    setCommentText('')
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  // Sirf admin — delete se pehle confirm zaroor le
  const handleDelete = async () => {
    if (!window.confirm('Kya aap sach me is post ko delete karna chahte hain?')) return
    await deleteBlog(id)
    navigate('/blog')
  }

  if (isLoading) return <Skeleton />

  if (isError || !post) {
    return (
      <div className="text-center py-32">
        <Icon name="FaXmark" className="text-5xl text-red-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400">Post not found or failed to load.</p>
        <Link to="/blog" className="mt-4 inline-block text-blue-600 dark:text-blue-400 text-sm underline">← Back to Blog</Link>
      </div>
    )
  }

  const formatted = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14 min-h-screen">
      {/* Back + Admin actions */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition group"
        >
          <motion.span whileHover={{ x: -3 }} className="inline-block">
            <Icon name="FaArrowLeft" />
          </motion.span>
          Back to Blog
        </Link>

        {/* Sirf admin ko Edit/Delete dikhega, baaki kisi ko nahi */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link
              to={`/blog/edit/${post._id}`}
              className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition"
            >
              <Icon name="FaPenToSquare" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition"
            >
              <Icon name="FaTrash" /> {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* Cover Image */}
      <Reveal>
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8 shadow-glossy-lg"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950 mb-8">
            <Icon name="FaNewspaper" className="text-6xl text-blue-300 dark:text-blue-700" />
          </div>
        )}
      </Reveal>

      {/* Meta */}
      <Reveal delay={0.05}>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Icon name="FaUser" className="text-blue-400" />
            {post.author || 'QCS Team'}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="FaCalendarDays" className="text-emerald-400" />
            {formatted}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="FaHeart" className="text-rose-400" />
            {post.likes ?? 0} likes
          </span>
          <span className="flex items-center gap-1">
            <Icon name="FaCommentDots" className="text-blue-400" />
            {post.comments?.length ?? 0} comments
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
          {post.title}
        </h1>
      </Reveal>

      {/* Content */}
      <Reveal delay={0.15}>
        <div className="prose prose-gray dark:prose-invert max-w-none text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-10">
          {post.content}
        </div>
      </Reveal>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-slate-700 mb-8" />

      {/* Like Button — login required, toggle (like/unlike) */}
      <Reveal delay={0.2}>
        <div className="flex items-center gap-4 mb-12">
          <div className="relative inline-flex">
            <motion.button
              id="like-button"
              onClick={handleLike}
              whileTap={{ scale: 0.85 }}
              animate={liked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              title={token ? undefined : 'Log in to like'}
              className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95
                ${liked
                  ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30'
                }`}
            >
              <motion.span
                animate={liked ? { rotate: [0, -20, 20, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Icon name="FaHeart" />
              </motion.span>
              {liked ? 'Liked!' : 'Like this post'}
              <span className="font-bold">({post.likes ?? 0})</span>
            </motion.button>

            {/* Particle burst */}
            <AnimatePresence>
              {burst && Array.from({ length: 8 }).map((_, i) => <HeartParticle key={i} i={i} />)}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      {/* Comments */}
      <Reveal delay={0.25}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Icon name="FaCommentDots" className="text-blue-500" />
          Comments ({post.comments?.length ?? 0})
        </h2>
      </Reveal>

      {/* Existing comments */}
      <div className="space-y-4 mb-10">
        {post.comments?.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No comments yet — be the first!</p>
        )}
        {post.comments?.map((c, i) => (
          <Reveal key={c._id} delay={i * 0.06}>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  {c.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">{c.name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 pl-9">{c.text}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>

      {/* Add Comment form / Login prompt */}
      <Reveal delay={0.3}>
        {!token ? (
          // Not logged in — show login prompt
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-6 text-center">
            <Icon name="FaCommentDots" className="text-3xl text-blue-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-900 dark:text-white mb-1">Want to join the conversation?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Log in to leave a comment.</p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition active:scale-95"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-slate-700 dark:text-gray-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition active:scale-95 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          // Logged in — show comment form (name-free, comes from JWT)
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-base">Leave a Comment</h3>
            <form onSubmit={handleComment} className="space-y-4">
              <div>
                <label htmlFor="comment-text" className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                  Your Comment
                </label>
                <textarea
                  id="comment-text"
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" className="px-6 py-2.5 text-sm rounded-xl" disabled={submitting}>
                  {submitting ? 'Posting…' : 'Post Comment'}
                  <Icon name="FaPaperPlane" className="text-xs" />
                </Button>
                <AnimatePresence>
                  {submitted && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-emerald-500 font-medium flex items-center gap-1"
                    >
                      <Icon name="FaCheck" /> Comment posted!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        )}
      </Reveal>
    </article>
  )
}

export default BlogDetailContainer