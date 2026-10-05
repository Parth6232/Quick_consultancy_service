import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'
import { useGetReviewsQuery, useDeleteReviewMutation } from '../../store/redux/apiSlice'
import timeAgo from '../../utils/timeAgo.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRatingLabel = (avg) => {
  if (avg >= 4.5) return 'Excellent'
  if (avg >= 4) return 'Very Good'
  if (avg >= 3) return 'Good'
  return 'Average'
}

const barColor = (star) => {
  if (star >= 4) return 'bg-emerald-500'
  if (star === 3) return 'bg-yellow-400'
  return 'bg-red-400'
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-5 animate-pulse">
    <div className="flex gap-2 mb-3">
      <div className="h-5 w-10 bg-gray-200 dark:bg-slate-700 rounded-full" />
      <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
    </div>
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700" />
      <div className="space-y-1">
        <div className="h-2.5 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-2 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  </div>
)

// ─── Rating Bar ───────────────────────────────────────────────────────────────
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right text-gray-600 dark:text-gray-400 font-medium">{star}</span>
      <Icon name="FaStar" className="text-yellow-400 text-[10px] shrink-0" />
      <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor(star)}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <span className="w-5 text-gray-500 dark:text-gray-400">{count}</span>
    </div>
  )
}

// ─── Single Review Row ────────────────────────────────────────────────────────
const ReviewRow = ({ review, index, isAdmin }) => {
  const { name, role, title, quote, rating = 5, createdAt } = review
  const ago = createdAt ? timeAgo(createdAt) : ''
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation()

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this review?')) return
    try {
      await deleteReview(review._id).unwrap()
    } catch (err) {
      alert(err.data?.message || 'Failed to delete review')
    }
  }

  return (
    <Reveal delay={Math.min(index * 0.04, 0.4)}>
      <div className="relative bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-5 hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow duration-300">
        {/* Admin delete button */}
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete review"
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-red-600 dark:text-red-400 shadow flex items-center justify-center cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="FaTrash" className="text-[11px]" />
          </button>
        )}

        {/* Top: rating badge + title */}
        <div className="flex items-start gap-3 mb-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full text-white shrink-0 ${
            rating >= 4 ? 'bg-emerald-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {rating} <Icon name="FaStar" className="text-[9px]" />
          </span>
          {title && (
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pr-10">{title}</h3>
          )}
        </div>

        {/* Quote */}
        <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">&ldquo;{quote}&rdquo;</p>

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xs">
              {name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
              {role && <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <Icon name="FaCheck" className="text-[8px]" />
              Verified Client
            </span>
            {ago && <span className="text-[10px] text-gray-400 dark:text-slate-500">{ago}</span>}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const AllReviewsContainer = () => {
  const [page, setPage] = useState(1)
  const [accumulated, setAccumulated] = useState([])
  const seenIds = useRef(new Set())

  const token = useSelector((s) => s.auth.token)
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin')

  const { data, isLoading, isFetching } = useGetReviewsQuery({ page, limit: 10 })

  const pages = data?.pages ?? 1
  const total = data?.total ?? 0
  const avgRaw = data?.average ?? 0
  const avg = Math.round(avgRaw * 10) / 10
  const breakdown = data?.breakdown ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  // Append newly fetched reviews (deduplicate by _id)
  useEffect(() => {
    if (!data?.reviews) return
    const newOnes = data.reviews.filter((r) => !seenIds.current.has(r._id))
    if (newOnes.length === 0) return
    newOnes.forEach((r) => seenIds.current.add(r._id))
    setAccumulated((prev) => [...prev, ...newOnes])
  }, [data])

  // When RTK Query invalidates (after a delete), clear and re-accumulate from page 1
  useEffect(() => {
    if (!data?.reviews) return
    // If the fresh data for page 1 has fewer items than we expect,
    // it means a delete happened — reset our accumulated list to match the server.
    if (page === 1) {
      seenIds.current = new Set(data.reviews.map((r) => r._id))
      setAccumulated(data.reviews)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.total])

  const hasMore = page < pages

  return (
    <div className="max-w-4xl mx-auto">
      {/* Rating summary */}
      {total > 0 && !isLoading && (
        <Reveal>
          <div className="flex flex-col sm:flex-row gap-6 mb-10 bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col items-center justify-center gap-1 shrink-0 min-w-[100px]">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{avg}</span>
              <div className="flex gap-0.5 text-emerald-500">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="FaStar" className={i < Math.round(avg) ? '' : 'text-gray-300 dark:text-slate-600'} />
                ))}
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{getRatingLabel(avg)}</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 text-center">based on {total} ratings</span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5 justify-center">
              {[5, 4, 3, 2, 1].map((star) => (
                <RatingBar key={star} star={star} count={breakdown[star] ?? 0} total={total} />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Review list */}
      {isLoading && page === 1 ? (
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : accumulated.length === 0 ? (
        <Reveal>
          <div className="text-center py-16">
            <Icon name="FaStar" className="text-4xl text-gray-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews yet</p>
          </div>
        </Reveal>
      ) : (
        <div className="flex flex-col gap-4">
          {accumulated.map((r, i) => (
            <ReviewRow key={r._id} review={r} index={i} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            className="cursor-pointer btn-glossy bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-glossy transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isFetching ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Load more
              </span>
            ) : 'Load more'}
          </motion.button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-10 pt-8 border-t border-gray-100 dark:border-slate-700">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <Icon name="FaArrowLeft" className="text-xs" />
          Back to home
        </Link>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            to={token ? '/reviews/write' : '/login'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 px-5 py-2.5 rounded-xl shadow-glossy transition active:scale-95 btn-glossy"
          >
            <Icon name="FaStar" className="text-xs" />
            {token ? 'Write a Review' : 'Log In to Write a Review'}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default AllReviewsContainer
