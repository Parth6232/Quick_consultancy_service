import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { useGetPortfolioQuery, useDeletePortfolioMutation } from '../../store/redux/apiSlice'
import TiltCard from '../../common/TiltCard.jsx'
import FlipCard from '../../common/FlipCard.jsx'
import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'

// ── Skeleton Card ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 animate-pulse" style={{ height: 320 }}>
    <div className="h-full bg-gray-200 dark:bg-slate-700" />
  </div>
)

// ── Flip Card Front ────────────────────────────────────────────────────────
const CardFront = ({ item }) => {
  const cover = item.images?.[0] || item.image
  const imgCount = item.images?.length || (item.image ? 1 : 0)
  const vidCount = item.videos?.length || 0
  return (
  <div className="w-full h-full relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 shadow-sm">
    {cover ? (
      <img src={cover} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950">
        <Icon name="FaBriefcase" className="text-5xl text-blue-300 dark:text-blue-700" />
      </div>
    )}
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
    {/* Category badge */}
    {item.category && (
      <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
        {item.category}
      </span>
    )}
    {/* Media counts */}
    {(imgCount > 1 || vidCount > 0) && (
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {imgCount > 1 && (
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            <Icon name="FaImage" className="text-[9px]" />{imgCount}
          </span>
        )}
        {vidCount > 0 && (
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            <Icon name="FaVideo" className="text-[9px]" />{vidCount}
          </span>
        )}
      </div>
    )}
    {/* Title */}
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="text-white font-bold text-base leading-snug">{item.title}</h3>
      <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
        <Icon name="FaLayerGroup" className="text-[10px]" />
        Hover to explore
      </p>
    </div>
  </div>
  )
}

// ── Flip Card Back ─────────────────────────────────────────────────────────
const CardBack = ({ item }) => (
  <div className="w-full h-full flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-800 dark:to-slate-950 border border-slate-700 p-5 shadow-glossy-lg">
    {/* Accent lines */}
    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, #3b82f6 0%, transparent 60%)' }} />

    <div>
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-white font-bold text-base leading-snug">{item.title}</h3>
        {item.category && (
          <span className="shrink-0 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            {item.category}
          </span>
        )}
      </div>
      <p className="text-slate-300 text-xs leading-relaxed line-clamp-5">{item.description}</p>
    </div>

    <div className="space-y-2">
      {item.client && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <Icon name="FaUser" className="text-blue-400" />
          <span className="font-medium text-slate-300">{item.client}</span>
        </p>
      )}
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 mt-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition active:scale-95 shadow-glossy"
        >
          <Icon name="FaLink" className="text-[10px]" />
          Visit Project
        </a>
      )}
      <Link
        to={`/portfolio/${item._id}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-2 mt-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition active:scale-95 border border-white/20"
      >
        <Icon name="FaExpand" className="text-[10px]" />
        View Details
      </Link>
    </div>
  </div>
)

// ── Portfolio Card (with admin actions) ─────────────────────────────────────
const PortfolioCard = ({ item, isAdmin }) => {
  const [deletePortfolio, { isLoading: isDeleting }] = useDeletePortfolioMutation()

  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Kya aap sach me is project ko delete karna chahte hain?')) return
    await deletePortfolio(item._id)
  }

  return (
    <div className="relative">
      {/* Sirf admin ko Edit/Delete dikhega, baaki kisi user ko nahi.
          Yeh buttons FlipCard ke bahar (sibling) hain isliye click se card flip nahi hota. */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
          <Link
            to={`/portfolio/edit/${item._id}`}
            onClick={(e) => e.stopPropagation()}
            title="Edit project"
            className="cursor-pointer w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white dark:hover:bg-slate-900 transition"
          >
            <Icon name="FaPenToSquare" className="text-xs" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete project"
            className="cursor-pointer w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-red-600 dark:text-red-400 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white dark:hover:bg-slate-900 transition"
          >
            <Icon name="FaTrash" className="text-xs" />
          </button>
        </div>
      )}

      <TiltCard maxTilt={6}>
        <FlipCard
          height={320}
          front={<CardFront item={item} />}
          back={<CardBack item={item} />}
        />
      </TiltCard>
    </div>
  )
}

// ── Main Container ─────────────────────────────────────────────────────────
const PortfolioListContainer = () => {
  const { data: items, isLoading, isError } = useGetPortfolioQuery()
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin')

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <Reveal className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-emerald-100 dark:border-emerald-500/20">
          <Icon name="FaBriefcase" />
          Portfolio
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
          Our{' '}
          <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            Work & Projects
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          Hover over a card to explore each project. Click to flip on mobile.
        </p>
        {isAdmin && (
          <div className="mt-4">
            <Link
              to="/portfolio/add"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 px-5 py-2.5 rounded-xl shadow-glossy transition active:scale-95"
            >
              <Icon name="FaPlus" className="text-xs" />
              Add Project
            </Link>
          </div>
        )}
      </Reveal>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-20">
          <Icon name="FaXmark" className="text-4xl text-red-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Failed to load portfolio. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && items?.length === 0 && (
        <div className="text-center py-20">
          <Icon name="FaBriefcase" className="text-5xl text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-700 dark:text-gray-300 font-semibold text-lg mb-1">No projects yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Add your first project to showcase your work.</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && items?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: 1200 }}>
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <Reveal key={item._id} delay={i * 0.07}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
                >
                  <PortfolioCard item={item} isAdmin={isAdmin} />
                </motion.div>
              </Reveal>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

export default PortfolioListContainer