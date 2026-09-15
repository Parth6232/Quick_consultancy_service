import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from '../../common/Reveal.jsx'
import TiltCard from '../../common/TiltCard.jsx'
import Icon from '../../utils/iconMap.jsx'
import { toggleFaq } from '../../store/redux/slices/faqSlice.js'
import { FAQS } from '../../constant/siteData.js'

const FaqContainer = () => {
  const dispatch = useDispatch()
  const openIndex = useSelector((s) => s.faq.openIndex)

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-10 md:mb-12">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-sm"
          >
            <Icon name="FaCommentDots" className="text-xl" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </Reveal>
        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={faq.q} delay={i * 0.05}>
                <TiltCard maxTilt={4}>
                  <motion.div
                    animate={isOpen ? { scale: 1.01 } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`relative overflow-hidden bg-white dark:bg-slate-800 border-l-4 ${
                      isOpen ? 'border-l-blue-600 shadow-glossy-lg' : 'border-l-transparent shadow-sm'
                    } border-y border-r border-gray-200 dark:border-slate-700 rounded-lg transition-all duration-300`}
                  >
                    {isOpen && (
                      <motion.span
                        layoutId="faq-glow"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-emerald-500/5"
                      />
                    )}
                    <button
                      onClick={() => dispatch(toggleFaq(i))}
                      className="relative cursor-pointer w-full px-6 py-4 text-left flex justify-between items-center gap-4 font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition outline-none"
                    >
                      <span>{faq.q}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'
                        }`}
                      >
                        <Icon name="FaChevronDown" className="text-xs" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700"
                        >
                          <motion.div
                            initial={{ y: -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.05, duration: 0.25 }}
                            className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                          >
                            {faq.a}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FaqContainer
