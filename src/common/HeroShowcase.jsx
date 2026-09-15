import { motion } from 'framer-motion'
import Icon from '../utils/iconMap.jsx'

/**
 * Orbit-style hero graphic — a central pulsing "AI core" hub with the seven
 * service categories orbiting around it on a slow rotating ring, plus a
 * floating growth stat badge and a trust/rating chip. Fully responsive:
 * scales down cleanly on mobile via Tailwind's aspect-square + max-w.
 */
const ORBIT_ICONS = [
  { icon: 'FaFileInvoiceDollar', label: 'Tax', angle: 0 },
  { icon: 'FaBuilding', label: 'Registration', angle: 60 },
  { icon: 'FaCalculator', label: 'Accounting', angle: 120 },
  { icon: 'FaNetworkWired', label: 'IT', angle: 180 },
  { icon: 'FaRobot', label: 'AI', angle: 240 },
  { icon: 'FaGlobe', label: 'Web', angle: 300 },
]

const HeroShowcase = () => {
  return (
    <div className="relative w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md mx-auto aspect-square select-none">
      {/* ambient drifting glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-6 sm:inset-10 rounded-full bg-blue-500/15 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 12, 0], y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute inset-10 sm:inset-16 rounded-full bg-emerald-400/10 blur-3xl"
      />

      {/* dashed orbit rings (static, purely decorative) */}
      <div className="absolute inset-[8%] rounded-full border border-dashed border-blue-400/25 pointer-events-none" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-emerald-400/20 pointer-events-none" />

      {/* rotating ring carrying the 6 service icons */}
      <motion.div
        className="absolute inset-[8%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {ORBIT_ICONS.map((item, i) => (
          <div
            key={item.label}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${item.angle}deg) translate(clamp(88px, 40%, 150px)) rotate(-${item.angle}deg)` }}
          >
            {/* counter-rotate so the icon stays upright while the ring spins */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
              className="-translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                whileHover={{ scale: 1.15 }}
                className="glassy-panel w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-xl"
                title={item.label}
              >
                <Icon name={item.icon} className="text-white text-base sm:text-lg" />
              </motion.div>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* central AI core hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 blur-xl opacity-60"
          />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 shadow-2xl flex flex-col items-center justify-center text-white">
            <Icon name="FaHandshakeAngle" className="text-xl sm:text-2xl mb-0.5" />
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide">Your Growth</span>
          </div>
        </motion.div>
      </div>

      {/* floating growth stat badge — top-right */}
      <motion.div
        initial={{ opacity: 0, x: 16, y: -16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        className="absolute -right-1 top-0 sm:right-1 sm:top-2 z-20"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="glassy-panel rounded-xl px-3 py-2 shadow-xl flex items-center gap-2"
        >
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-emerald-400 text-xs font-bold flex items-center gap-1"
          >
            <Icon name="FaChartLine" /> +38% Growth
          </motion.span>
        </motion.div>
      </motion.div>

      {/* trust / rating chip — bottom */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 sm:bottom-1 z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className="glassy-panel rounded-full px-3 py-1.5 shadow-xl flex items-center gap-1.5 whitespace-nowrap"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="FaStar" className="text-yellow-400 text-[10px]" />
          ))}
          <span className="text-[10px] text-white font-semibold ml-1">500+ Clients</span>
        </motion.div>
      </motion.div>

      {/* floating particles */}
      {[
        { top: '2%', left: '4%', delay: 0 },
        { top: '52%', left: '2%', delay: 1.2 },
        { top: '92%', left: '85%', delay: 0.6 },
      ].map((p, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
          style={{ top: p.top, left: p.left }}
          animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default HeroShowcase
