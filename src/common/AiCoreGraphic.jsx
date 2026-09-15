import { motion } from 'framer-motion'
import Icon from '../utils/iconMap.jsx'

/**
 * A self-contained animated "AI core" graphic — pulsing glowing orb,
 * rotating orbit rings with nodes, a scanning sweep line, and floating
 * particles. Pure CSS/SVG + a little framer-motion, no heavy 3D libs.
 * Inspired by the "digital core" motif on modern AI/agency sites.
 */
const AiCoreGraphic = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-square max-w-sm mx-auto select-none ${className}`}>
      {/* outer soft glow */}
      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl animate-pulse-slow" />

      {/* rotating dashed orbit rings */}
      <div className="absolute inset-[6%] rounded-full border border-dashed border-blue-400/30 animate-spin-slower" />
      <div className="absolute inset-[16%] rounded-full border border-dashed border-emerald-400/30 animate-spin-reverse" />
      <div className="absolute inset-[28%] rounded-full border border-blue-400/20 animate-spin-slower" />

      {/* orbit nodes */}
      <div className="absolute inset-[6%] animate-spin-slower">
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_3px_rgba(59,130,246,0.7)]" />
      </div>
      <div className="absolute inset-[16%] animate-spin-reverse">
        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_3px_rgba(16,185,129,0.7)]" />
      </div>

      {/* scanning sweep */}
      <div className="absolute inset-[6%] rounded-full overflow-hidden">
        <div className="absolute inset-0 animate-spin-slow origin-center">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-blue-400/25" />
        </div>
      </div>

      {/* core */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-[32%] rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-400/40 shadow-[0_0_40px_10px_rgba(59,130,246,0.35)] flex items-center justify-center"
      >
        <Icon name="FaRobot" className="text-blue-300 text-4xl md:text-5xl drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
      </motion.div>

      {/* floating particles */}
      {[
        { top: '10%', left: '15%', delay: 0 },
        { top: '20%', left: '80%', delay: 0.6 },
        { top: '78%', left: '20%', delay: 1.1 },
        { top: '85%', left: '72%', delay: 1.6 },
      ].map((p, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
          style={{ top: p.top, left: p.left }}
          animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* small stat chips, docdril-style */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute -left-2 sm:left-0 top-2 glassy-panel rounded-lg px-3 py-1.5 text-[10px] font-semibold text-blue-200 shadow-lg"
      >
        AI AUTOMATION <span className="text-emerald-400">24/7</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute -right-2 sm:right-0 bottom-4 glassy-panel rounded-lg px-3 py-1.5 text-[10px] font-semibold text-blue-200 shadow-lg"
      >
        RESPONSE <span className="text-emerald-400">0.2ms</span>
      </motion.div>
    </div>
  )
}

export default AiCoreGraphic
