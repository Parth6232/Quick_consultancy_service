import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../../utils/iconMap'

const ModalPanel = ({ job, onClose }) => {
  const closeButtonRef = useRef(null)
  const previousActiveElementRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/careers/${job._id}`
  const text = `We're hiring: ${job.title}${job.location ? ' – ' + job.location : ''} at Quick Consulting Services. Apply here:`
  const subtitle = [job.department, job.location].filter(Boolean).join(' · ')
  const canNativeShare = typeof navigator !== 'undefined' && Boolean(navigator.share)

  // Lock page scroll & restore focus on unmount
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 50)

    return () => {
      clearTimeout(focusTimer)
      document.body.style.overflow = originalOverflow
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === 'function'
      ) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [])

  // Close on Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Clear copy timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    let success = false
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(url)
        success = true
      } catch {
        success = false
      }
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        success = document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch (err) {
        console.error('Fallback copy failed:', err)
      }
    }

    if (success) {
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  const handleShareClick = (platformUrl) => {
    window.open(platformUrl, '_blank', 'noopener,noreferrer')
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text,
          url,
        })
      } catch (err) {
        if (err && err.name === 'AbortError') {
          return
        }
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-job-modal-title"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-gray-100 dark:border-slate-700 p-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <h2
              id="share-job-modal-title"
              className="text-lg font-bold text-slate-900 dark:text-white leading-tight"
            >
              Share this job
            </h2>
            <p
              className="text-sm font-medium text-slate-700 dark:text-gray-200 truncate mt-1"
              title={job.title}
            >
              {job.title}
            </p>
            {subtitle ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Icon name="FaXmark" className="text-sm" />
          </button>
        </div>

        {/* Link row */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-200 dark:border-slate-700 mb-5">
          <input
            type="text"
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-700 dark:text-gray-200 focus:outline-none select-all truncate font-mono"
            aria-label="Job URL"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <Icon name="FaCheck" className="text-xs" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Icon name="FaLink" className="text-xs" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Share buttons (grid of 5) */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={() =>
              handleShareClick(
                `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
              )
            }
            aria-label="Share on WhatsApp"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
              <Icon name="FaWhatsapp" className="text-lg" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300 mt-1.5 truncate max-w-full">
              WhatsApp
            </span>
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={() =>
              handleShareClick(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  url
                )}`
              )
            }
            aria-label="Share on LinkedIn"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#0A66C2] hover:bg-[#095196] text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
              <Icon name="FaLinkedinIn" className="text-base" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300 mt-1.5 truncate max-w-full">
              LinkedIn
            </span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() =>
              handleShareClick(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  url
                )}`
              )
            }
            aria-label="Share on Facebook"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-[#1877F2] hover:bg-[#0d65d9] text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
              <Icon name="FaFacebookF" className="text-base" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300 mt-1.5 truncate max-w-full">
              Facebook
            </span>
          </button>

          {/* X */}
          <button
            type="button"
            onClick={() =>
              handleShareClick(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  text
                )}&url=${encodeURIComponent(url)}`
              )
            }
            aria-label="Share on X"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
              <Icon name="FaXTwitter" className="text-base" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300 mt-1.5 truncate max-w-full">
              X
            </span>
          </button>

          {/* Email */}
          <a
            href={`mailto:?subject=${encodeURIComponent(
              'Job opening: ' + job.title
            )}&body=${encodeURIComponent(text + '\n\n' + url)}`}
            aria-label="Share via Email"
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-slate-600 hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-transform">
              <Icon name="FaEnvelope" className="text-base" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300 mt-1.5 truncate max-w-full">
              Email
            </span>
          </a>
        </div>

        {/* More options (native share) */}
        {canNativeShare && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700">
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Icon name="FaShareNodes" className="text-xs" />
              <span>More options…</span>
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

const ShareJobModal = ({ job, onClose }) => {
  if (typeof document === 'undefined') return null

  return ReactDOM.createPortal(
    <AnimatePresence>
      {job && <ModalPanel key={job._id || 'share-job-modal'} job={job} onClose={onClose} />}
    </AnimatePresence>,
    document.body
  )
}

export default ShareJobModal
