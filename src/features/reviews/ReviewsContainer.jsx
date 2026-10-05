import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Reveal from '../../common/Reveal.jsx'
import TiltCard from '../../common/TiltCard.jsx'
import Icon from '../../utils/iconMap.jsx'
import { useGetReviewsQuery, useDeleteReviewMutation } from '../../store/redux/apiSlice'
import { TESTIMONIALS } from '../../constant/siteData.js'
import timeAgo from '../../utils/timeAgo.js'

// ─── Rating label helper ──────────────────────────────────────────────────────
const getRatingLabel = (avg) => {
  if (avg >= 4.5) return 'Excellent'
  if (avg >= 4) return 'Very Good'
  if (avg >= 3) return 'Good'
  return 'Average'
}

// ─── Bar color helper (green 4-5, yellow 3, orange/red 1-2) ──────────────────
const barColor = (star) => {
  if (star >= 4) return 'bg-emerald-500'
  if (star === 3) return 'bg-yellow-400'
  return 'bg-red-400'
}

// ─── Skeleton card ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 h-full animate-pulse">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-3 w-3 rounded bg-gray-200 dark:bg-slate-700" />
      ))}
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-4/6" />
    </div>
    <div className="flex items-center gap-3 mt-4">
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700" />
      <div className="space-y-1.5">
        <div className="h-2.5 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-2 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  </div>
)

// ─── Review Card (live API data) ──────────────────────────────────────────────
const ReviewCard = ({ review, index, isAdmin }) => {
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
    <Reveal delay={index * 0.08}>
      <TiltCard maxTilt={8} className="h-full">
        <div className="relative card-glossy bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-full hover:shadow-glossy-lg transition-shadow duration-300 flex flex-col gap-3">
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

          {/* Rating badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full text-white ${
              rating >= 4 ? 'bg-emerald-500' : rating === 3 ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {rating} <Icon name="FaStar" className="text-[9px]" />
            </span>
            {title && (
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate pr-8">{title}</p>
            )}
          </div>

          {/* Quote */}
          <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-3 flex-1">
            &ldquo;{quote}&rdquo;
          </p>

          {/* Reviewer info */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                {name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{name}</h4>
                {role && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{role}</p>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <Icon name="FaCheck" className="text-[8px]" />
                Verified Client
              </span>
              {ago && <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{ago}</p>}
            </div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  )
}

// ─── Seed testimonial card (fallback when no real reviews) ────────────────────
const SeedCard = ({ item, index }) => (
  <Reveal delay={index * 0.08}>
    <TiltCard maxTilt={8} className="h-full">
      <div className="card-glossy bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-full hover:shadow-glossy-lg transition-shadow duration-300 flex flex-col gap-3">
        <div className="flex text-yellow-400 text-sm gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => <Icon key={i} name="FaStar" />)}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-3 flex-1">
          &ldquo;{item.quote}&rdquo;
        </p>
        <div className="flex items-center gap-2.5 mt-auto">
          <div className="w-9 h-9 shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
            {item.initial || item.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h4>
            {item.role && <p className="text-xs text-gray-500 dark:text-gray-400">{item.role}</p>}
          </div>
        </div>
      </div>
    </TiltCard>
  </Reveal>
)

// ─── Rating distribution bar row ─────────────────────────────────────────────
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

// ─── Main section ─────────────────────────────────────────────────────────────
const ReviewsContainer = () => {
  const { data, isLoading } = useGetReviewsQuery({ page: 1, limit: 6 })
  const token = useSelector((s) => s.auth.token)
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin')

  const reviews = data?.reviews ?? []
  const total = data?.total ?? 0
  const avgRaw = data?.average ?? 0
  const avg = Math.round(avgRaw * 10) / 10
  const breakdown = data?.breakdown ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  const hasRealReviews = reviews.length > 0
  const displayReviews = reviews.slice(0, 6)
  const showViewAll = hasRealReviews && total > displayReviews.length

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <Reveal>
          <div className="flex items-center justify-between mb-8 gap-2 flex-wrap">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white shrink-0">
              Ratings and reviews
            </h2>
            {showViewAll && (
              <Link
                to="/reviews"
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition whitespace-nowrap"
              >
                View all reviews &rsaquo;
              </Link>
            )}
          </div>
        </Reveal>

        {/* Rating summary (only when real reviews exist) */}
        {!isLoading && hasRealReviews && (
          <Reveal delay={0.05}>
            <div className="flex flex-col sm:flex-row gap-6 mb-10 bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
              {/* Big average */}
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
              {/* Distribution bars */}
              <div className="flex-1 flex flex-col gap-1.5 justify-center">
                {[5, 4, 3, 2, 1].map((star) => (
                  <RatingBar key={star} star={star} count={breakdown[star] ?? 0} total={total} />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Write a Review button */}
        <div className="flex justify-end mb-8">
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

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : hasRealReviews ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayReviews.map((r, i) => (
              <ReviewCard key={r._id} review={r} index={i} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          /* Fallback: show seed testimonials, hide rating summary */
          <>
            <Reveal>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">
                What our partners say about us.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TESTIMONIALS.map((item, i) => (
                <SeedCard key={item.name} item={item} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ReviewsContainer
