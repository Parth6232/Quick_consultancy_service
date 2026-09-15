import { motion } from 'framer-motion'

const Reveal = ({ children, delay = 0, y = 24, className = '', as = 'div' }) => {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
