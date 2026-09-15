import { motion } from 'framer-motion'
import Reveal from '../../common/Reveal.jsx'
import { PROCESS_STEPS } from '../../constant/siteData.js'

const ProcessContainer = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Our Process</h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-2">
            A simple 5-step journey to business success.
          </p>
        </Reveal>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-4 relative" style={{ perspective: 1000 }}>
          {/* animated "drawing" connecting line */}
          <svg
            className="hidden md:block absolute top-6 left-12 right-12 -z-10 w-[calc(100%-6rem)] h-0.5"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1"
              className="text-blue-300 dark:text-slate-700"
              vectorEffect="non-scaling-stroke"
            />
            <motion.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-blue-500 dark:text-blue-400"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
            {/* traveling glow dot that runs along the completed line, on loop */}
            <motion.circle
              r="1.4"
              fill="currentColor"
              className="text-emerald-400"
              initial={{ opacity: 0 }}
              animate={{ cx: [0, 100], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', delay: 1.6 }}
              cy="0.5"
            />
          </svg>

          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.15} className="flex-1 text-center max-w-[200px] relative z-10">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                className="inline-block"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotateY: 15, rotateX: -8, y: -4 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative w-16 h-16 mx-auto mb-4"
                >
                  {/* continuously rotating dashed orbit ring */}
                  <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-blue-400/50 dark:border-blue-400/40 animate-spin-slower" />
                  {/* pulsing glow */}
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.1, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-blue-500/40"
                  />
                  <div className="relative w-14 h-14 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/40 ring-4 ring-blue-100 dark:ring-slate-800">
                    {s.step}
                  </div>
                </motion.div>
              </motion.div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{s.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProcessContainer
