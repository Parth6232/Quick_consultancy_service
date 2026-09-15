import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Wraps children in a subtle 3D tilt-on-hover effect (mouse-follow rotateX/Y
 * + slight lift + glossy sheen). Disabled gracefully on touch devices since
 * there's no hover/mousemove there — it just renders flat.
 */
const TiltCard = ({ children, className = '', maxTilt = 10 }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 20,
  })

  const handleMouseMove = (e) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ scale: 1.03, z: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default TiltCard
