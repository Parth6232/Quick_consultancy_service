import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Reveal from '../../common/Reveal.jsx'
import TiltCard from '../../common/TiltCard.jsx'
import Icon from '../../utils/iconMap.jsx'
import { useGetReviewsQuery } from '../../store/redux/apiSlice'
import { TESTIMONIALS } from '../../constant/siteData.js'

const SkeletonCard = () => (
  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 h-full animate-pulse">
    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-4" />
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
    </div>
    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700" />
  </div>
)

const ReviewCard = ({ name, role, quote, rating = 5, index = 0 }) => (
  <Reveal delay={index * 0.1}>
    <TiltCard maxTilt={10} className="h-full">
      <div className="card-glossy bg-slate-50 dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-full hover:shadow-glossy-lg transition-shadow duration-300">
        <div className="flex text-yellow-400 text-sm mb-3 gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Icon key={idx} name="FaStar" className={idx < rating ? '' : 'text-gray-300 dark:text-slate-600'} />
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">&ldquo;{quote}&rdquo;</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
            {name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{name}</h4>
            {role && <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>}
          </div>
        </div>
      </div>
    </TiltCard>
  </Reveal>
)

const ReviewsContainer = () => {
  const { data: reviews, isLoading } = useGetReviewsQuery()
  const token = useSelector((s) => s.auth.token)

  // Real reviews first; if none submitted yet, show the seed testimonials so the section never looks empty
  const hasRealReviews = reviews && reviews.length > 0
  const items = hasRealReviews
    ? reviews.map((r) => ({ name: r.name, role: r.role, quote: r.quote, rating: r.rating }))
    : TESTIMONIALS.map((t) => ({ name: t.name, role: t.role, quote: t.quote, rating: 5 }))

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Client Reviews</h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-2">
            {hasRealReviews ? 'Real feedback from our clients.' : 'What our partners say about us.'}
          </p>
        </Reveal>

        <div className="flex justify-center mb-10">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to={token ? '/reviews/write' : '/login'}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 px-5 py-2.5 rounded-xl shadow-glossy transition active:scale-95"
            >
              <Icon name="FaStar" className="text-xs" />
              {token ? 'Write a Review' : 'Log In to Write a Review'}
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.slice(0, 6).map((r, i) => (
              <ReviewCard key={r.name + i} {...r} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewsContainer
