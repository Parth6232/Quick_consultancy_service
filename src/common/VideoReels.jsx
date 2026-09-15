import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../common/Reveal.jsx'
import TiltCard from '../common/TiltCard.jsx'
import GradientBorderCard from '../common/GradientBorderCard.jsx'
import Icon from '../utils/iconMap.jsx'

const VIDEOS = [
  { title: 'Voice AI Assistance', src: '/videos/voice-ai-assistance.mp4' },
  { title: 'Quick Consulting Services', src: '/videos/reel-1.mp4' },
]

// ── Fullscreen Modal Player (native controls, jaise YouTube) ───────────────
const VideoModal = ({ video, onClose }) => {
  const modalVideoRef = useRef(null)

  useEffect(() => {
    const el = modalVideoRef.current
    if (!el) return

    // autoplay + native browser fullscreen (sab controls: play/pause, seek, volume, fullscreen)
    el.play().catch(() => { })
    const requestFs = async () => {
      try {
        if (el.requestFullscreen) await el.requestFullscreen()
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
        else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen() // iOS Safari video
      } catch {
        // fullscreen request fail ho sakta hai (browser policy) — modal to phir bhi dikhega
      }
    }
    requestFs()

    const handleFullscreenChange = () => {
      // user ne native fullscreen se Esc/back dabaya to modal bhi band ho jaye
      if (!document.fullscreenElement) {
        onClose()
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => { })
    }
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      onClick={handleClose}
    >
      <button
        onClick={handleClose}
        aria-label="Close video"
        className="cursor-pointer absolute top-4 right-4 z-[101] w-10 h-10 rounded-full bg-white/10 text-white backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition"
      >
        <Icon name="FaXmark" />
      </button>
      <video
        ref={modalVideoRef}
        src={video.src}
        controls
        autoPlay
        playsInline
        className="w-full h-full max-h-screen object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  )
}

const VideoCard = ({ video, index, onExpand }) => {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const el = videoRef.current
    if (!el || prefersReducedMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => { })
        } else {
          el.pause()
        }
      },
      { root: null, rootMargin: '50px', threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  const toggleMute = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  return (
    <Reveal delay={index * 0.1}>
      <TiltCard maxTilt={8} className="w-full max-w-[280px] sm:max-w-none mx-auto">
        <GradientBorderCard
          rounded="rounded-2xl"
          className="shadow-xl hover:shadow-glossy-lg transition-shadow duration-300"
          innerClassName="h-full"
        >
          <div className="group h-full rounded-2xl overflow-hidden bg-black">
            <div
              className="relative w-full h-[180px] md:h-[210px] lg:h-[230px] bg-slate-900 cursor-pointer"
              onClick={() => onExpand(video)}
              role="button"
              aria-label={`Play ${video.title} in fullscreen`}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
                src={video.src + '#t=0.001'}
              />
              {/* Play icon overlay — click par fullscreen khulega */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                  <Icon name="FaPlay" className="text-white text-lg ml-0.5" />
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
                aria-label="Toggle mute"
                className="cursor-pointer absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition"
              >
                <Icon name={muted ? 'FaVolumeXmark' : 'FaVolumeHigh'} />
              </motion.button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 border-t border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white text-center">
                {video.title}
              </h3>
            </div>
          </div>
        </GradientBorderCard>
      </TiltCard>
    </Reveal>
  )
}

const VideoReels = () => {
  const [expandedVideo, setExpandedVideo] = useState(null)

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-10 md:mb-12">
          <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3 inline-block">
            See Us In Action
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Our Work, In Motion</h2>
        </Reveal>

        <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none no-scrollbar gap-4 sm:gap-6 px-4 sm:px-0 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto justify-items-center">
          {VIDEOS.map((v, i) => (
            <div key={v.title} className="flex-none w-[85%] snap-center sm:w-full">
              <VideoCard video={v} index={i} onExpand={setExpandedVideo} />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {expandedVideo && (
          <VideoModal video={expandedVideo} onClose={() => setExpandedVideo(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default VideoReels