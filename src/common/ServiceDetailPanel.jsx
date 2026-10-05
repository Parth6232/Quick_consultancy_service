import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SERVICES, SERVICE_DETAILS, CONTACT } from '../constant/siteData.js'
import Icon from '../utils/iconMap.jsx'

const ServiceDetailPanel = ({ serviceId, onClose }) => {
  const navigate = useNavigate()
  const panelRef = useRef(null)
  
  // Find data
  const baseService = SERVICES.find((s) => s.id === serviceId)
  const details = SERVICE_DETAILS[serviceId]
  const [openFaq, setOpenFaq] = useState(null)

  // Lock body scroll
  useEffect(() => {
    if (serviceId) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [serviceId])

  // Focus trap & Escape
  useEffect(() => {
    if (!serviceId) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    // focus the panel
    if (panelRef.current) {
      panelRef.current.focus()
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [serviceId, onClose])

  if (!baseService || !details) return null

  const handleConsultationClick = () => {
    onClose()
    setTimeout(() => {
      navigate(`/contact?service=${serviceId}`)
    }, 300)
  }

  const handleWhatsappClick = () => {
    window.open(CONTACT.whatsapp, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {serviceId && (
        <div className="fixed inset-0 z-[100] flex justify-end md:justify-end sm:justify-center items-end md:items-stretch">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-panel-title"
            tabIndex={-1}
            initial={{ y: '100%', md: { x: '100%', y: 0 } }}
            animate={{ y: 0, md: { x: 0, y: 0 } }}
            exit={{ y: '100%', md: { x: '100%', y: 0 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full md:w-full md:max-w-xl bg-white dark:bg-slate-900 h-[90vh] md:h-full rounded-t-3xl md:rounded-none flex flex-col shadow-2xl focus:outline-none"
          >
            {/* Mobile Drag Handle */}
            <div className="md:hidden flex justify-center py-3" onClick={onClose} style={{ cursor: 'pointer' }}>
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Close Button (Desktop) */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-4 right-4 w-8 h-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
              aria-label="Close"
            >
              <Icon name="FaXmark" />
            </button>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 md:py-8 no-scrollbar">
              
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl">
                  <Icon name={baseService.icon} />
                </div>
                <div>
                  <h2 id="service-panel-title" className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {baseService.title}
                  </h2>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {details.tagline}
                  </p>
                </div>
              </div>

              {/* Overview */}
              <div className="mb-8">
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {details.overview}
                </p>
              </div>

              {/* What We Do */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">What We Do</h3>
                <div className="space-y-4">
                  {details.offerings.map((offering, idx) => (
                    <div key={idx} className="flex gap-3 border border-gray-100 dark:border-slate-800 rounded-xl p-4 bg-gray-50/50 dark:bg-slate-800/30">
                      <div className="mt-0.5 shrink-0 text-blue-500">
                        <Icon name="FaCheck" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                          {offering.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {offering.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How We Work (Stepper) */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">How We Work</h3>
                <div className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-3.5 space-y-6">
                  {details.steps.map((step, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold border-4 border-white dark:border-slate-900">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal For */}
              {details.idealFor && details.idealFor.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Ideal For</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.idealFor.map((chip, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {details.documents && details.documents.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Documents You May Need</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {details.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Icon name="FaCheck" className="text-emerald-500 text-xs shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FAQs */}
              {details.faqs && details.faqs.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {details.faqs.map((faq, idx) => {
                      const isOpen = openFaq === idx
                      return (
                        <div key={idx} className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                            className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                          >
                            <span className="font-semibold text-sm text-slate-900 dark:text-white pr-4">{faq.q}</span>
                            <Icon name="FaChevronDown" className={`text-gray-500 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-4 py-3 bg-white dark:bg-slate-900"
                              >
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Sticky CTA */}
            <div className="p-4 md:p-6 border-t border-gray-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleConsultationClick}
                  className="flex-1 btn-glossy bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-semibold py-3 rounded-xl shadow-glossy transition flex items-center justify-center gap-2"
                >
                  Get Free Consultation <Icon name="FaArrowLeft" className="rotate-135 text-xs" />
                </button>
                <button
                  onClick={handleWhatsappClick}
                  className="sm:w-auto w-full btn-glossy bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-6 rounded-xl shadow-glossy transition flex items-center justify-center gap-2"
                >
                  <Icon name="FaWhatsapp" className="text-lg" /> Chat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ServiceDetailPanel
