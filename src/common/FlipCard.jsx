import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * A 3D flip card: shows `front` by default, flips to reveal `back` on
 * hover (desktop) or tap (touch devices), inspired by docdril.com's
 * "tap to reveal" cards.
 */
const FlipCard = ({ front, back, className = '', height = 220 }) => {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`group [perspective:1200px] cursor-pointer ${className}`}
      style={{ height }}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}

export default FlipCard
