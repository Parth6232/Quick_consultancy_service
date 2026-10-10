import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useGetPortfolioByIdQuery, useDeletePortfolioMutation } from '../../store/redux/apiSlice'
import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'

// ── Build unified media list ───────────────────────────────────────────────
const buildMediaList = (item) => {
  const list = []
  if (!item) return list
  const images = item.images?.length ? item.images : (item.image ? [item.image] : [])
  images.forEach(src => list.push({ type: 'image', src }))
  if (item.videos?.length) {
    item.videos.forEach(src => list.push({ type: 'video', src }))
  }
  return list
}

// ── Skeleton ──────────────────────────────────────────────────────────────
const Skeleton = () => (
  <section className="min-h-screen py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto animate-pulse">
    <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-8" />
    <div className="grid lg:grid-cols-[3fr_2fr] gap-8">
      <div className="space-y-4">
        <div className="aspect-[4/3] rounded-2xl bg-gray-200 dark:bg-slate-700" />
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-20 h-16 rounded-xl bg-gray-200 dark:bg-slate-700 shrink-0" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded-full" />
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl" />
      </div>
    </div>
  </section>
)

// ── Video Thumbnail with play overlay ────────────────────────────────────
const VideoThumb = ({ src, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`relative shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
      isActive
        ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105'
        : 'border-transparent hover:border-white/40'
    }`}
    aria-label="Video thumbnail"
  >
    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
      <video src={src} preload="metadata" muted className="w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
          <Icon name="FaPlay" className="text-[10px] text-slate-900 ml-0.5" />
        </div>
      </div>
    </div>
  </button>
)

// ── Lightbox ──────────────────────────────────────────────────────────────
const Lightbox = ({ media, activeIndex, onClose, onPrev, onNext }) => {
  const current = media[activeIndex]
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
          aria-label="Close lightbox"
        >
          <Icon name="FaXmark" className="text-lg" />
        </button>

        {media.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
              aria-label="Previous media"
            >
              <Icon name="FaChevronLeft" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10"
              aria-label="Next media"
            >
              <Icon name="FaChevronRight" />
            </button>
          </>
        )}

        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {current.type === 'image' ? (
            <img
              src={current.src}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          ) : (
            <video
              src={current.src}
              controls
              playsInline
              autoPlay
              className="max-w-full max-h-[85vh] rounded-xl"
            />
          )}
        </motion.div>

        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            {activeIndex + 1} / {media.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ── Main Container ─────────────────────────────────────────────────────────
const PortfolioDetailContainer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAdmin = useSelector((s) => s.auth.user?.role === 'admin')

  const { data: item, isLoading, isError } = useGetPortfolioByIdQuery(id)
  const [deletePortfolio, { isLoading: isDeleting }] = useDeletePortfolioMutation()

  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const mainVideoRef = useRef(null)

  // Touch/swipe support
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const mediaList = buildMediaList(item)
  const current = mediaList[activeIndex]
  const hasMultiple = mediaList.length > 1

  const goTo = useCallback((index) => {
    setActiveIndex(index)
    setZoom(false)
    // Pause any playing video
    if (mainVideoRef.current) {
      mainVideoRef.current.pause()
    }
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex(i => (i - 1 + mediaList.length) % mediaList.length)
    setZoom(false)
  }, [mediaList.length])

  const goNext = useCallback(() => {
    setActiveIndex(i => (i + 1) % mediaList.length)
    setZoom(false)
  }, [mediaList.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxOpen) return
    const handler = (e) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, goPrev, goNext])

  // Pause video on index change
  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.pause()
    }
  }, [activeIndex])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40 && hasMultiple) {
      dx < 0 ? goNext() : goPrev()
    }
    touchStartX.current = null
  }

  const handleMouseMove = (e) => {
    if (!zoom) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    await deletePortfolio(id)
    navigate('/portfolio')
  }

  if (isLoading) return <Skeleton />
  if (isError || !item) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-4">
        <Icon name="FaBriefcase" className="text-5xl text-gray-300 dark:text-slate-600" />
        <p className="text-lg font-semibold text-slate-800 dark:text-white">Project not found</p>
        <Link to="/portfolio" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
          <Icon name="FaArrowLeft" /> Back to Portfolio
        </Link>
      </section>
    )
  }

  const noMedia = mediaList.length === 0

  return (
    <>
      {lightboxOpen && (
        <Lightbox
          media={mediaList}
          activeIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      <section className="min-h-screen py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition mb-8 group"
        >
          <motion.span whileHover={{ x: -3 }} className="inline-block">
            <Icon name="FaArrowLeft" />
          </motion.span>
          Back to Portfolio
        </Link>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start">
          {/* ── Left: Gallery ── */}
          <Reveal>
            <div className="space-y-4">
              {/* Main viewer */}
              {noMedia ? (
                <div className="aspect-[4/3] rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950 border border-gray-100 dark:border-slate-700">
                  <Icon name="FaBriefcase" className="text-6xl text-blue-300 dark:text-blue-700" />
                </div>
              ) : (
                <div
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 select-none"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full"
                    >
                      {current.type === 'image' ? (
                        <div
                          className={`w-full h-full overflow-hidden ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                          onClick={() => { if (zoom) { setZoom(false) } else { setZoom(true) } }}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={() => setZoom(false)}
                        >
                          <img
                            src={current.src}
                            alt={item.title}
                            className="w-full h-full object-contain transition-transform duration-200"
                            style={zoom ? {
                              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                              transform: 'scale(2.2)'
                            } : {}}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <video
                          ref={mainVideoRef}
                          src={current.src}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Counter */}
                  {hasMultiple && (
                    <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                      {activeIndex + 1} / {mediaList.length}
                    </div>
                  )}

                  {/* Expand button (opens lightbox) */}
                  {current.type === 'image' && !zoom && (
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition backdrop-blur-sm"
                      aria-label="Open fullscreen"
                    >
                      <Icon name="FaExpand" className="text-xs" />
                    </button>
                  )}

                  {/* Prev/Next arrows */}
                  {hasMultiple && (
                    <>
                      <button
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-sm"
                        aria-label="Previous"
                      >
                        <Icon name="FaChevronLeft" className="text-sm" />
                      </button>
                      <button
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition backdrop-blur-sm"
                        aria-label="Next"
                      >
                        <Icon name="FaChevronRight" className="text-sm" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Thumbnail strip */}
              {hasMultiple && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {mediaList.map((media, i) => (
                    media.type === 'image' ? (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`relative shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          i === activeIndex
                            ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100 hover:border-white/40'
                        }`}
                        aria-label={`Image ${i + 1}`}
                      >
                        <img src={media.src} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ) : (
                      <VideoThumb
                        key={i}
                        src={media.src}
                        isActive={i === activeIndex}
                        onClick={() => goTo(i)}
                      />
                    )
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* ── Right: Details ── */}
          <Reveal delay={0.1}>
            <div className="space-y-5">
              {item.category && (
                <span className="inline-block bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-500/20 uppercase tracking-wide">
                  {item.category}
                </span>
              )}

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {item.title}
              </h1>

              {item.client && (
                <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Icon name="FaUser" className="text-blue-500 shrink-0" />
                  <span className="font-medium text-slate-700 dark:text-gray-300">{item.client}</span>
                </p>
              )}

              {item.description ? (
                <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No description provided.</p>
              )}

              {/* Media counts */}
              {(mediaList.filter(m => m.type === 'image').length > 0 || mediaList.filter(m => m.type === 'video').length > 0) && (
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  {mediaList.filter(m => m.type === 'image').length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Icon name="FaImage" className="text-blue-400" />
                      {mediaList.filter(m => m.type === 'image').length} image{mediaList.filter(m => m.type === 'image').length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {mediaList.filter(m => m.type === 'video').length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Icon name="FaVideo" className="text-emerald-400" />
                      {mediaList.filter(m => m.type === 'video').length} video{mediaList.filter(m => m.type === 'video').length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  <Icon name="FaLink" />
                  Visit Project
                  <Icon name="FaArrowRight" className="text-xs" />
                </a>
              )}

              {/* Admin controls */}
              {isAdmin && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <Link
                    to={`/portfolio/edit/${id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-3 py-2 rounded-lg transition"
                  >
                    <Icon name="FaPenToSquare" /> Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    <Icon name="FaTrash" /> {isDeleting ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default PortfolioDetailContainer
