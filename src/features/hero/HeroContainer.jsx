import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Button from '../../common/Button.jsx'
import Icon from '../../utils/iconMap.jsx'
import AiCoreGraphic from '../../common/HeroShowcase.jsx'
import { CONTACT } from '../../constant/siteData.js'

const HeroContainer = () => {
  const wrapRef = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 })
  const translateX = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 })
  const translateY = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 })

  const handleMouseMove = (e) => {
    const node = wrapRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <header className="hero-glossy text-white py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      <div className="hero-top-sheen" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-4 md:space-y-6 text-center lg:text-left"
        >
          <span className="bg-white/10 border border-white/20 text-blue-100 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-2 backdrop-blur">
            Comprehensive Business Solutions
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight">
            Your Vision, Our Expertise, <span className="text-blue-400">Successful Business</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto lg:mx-0">
            You have the idea. We help you implement it. From Tax &amp; Compliance to cutting-edge AI Automation and
            Digital Transformation, we provide end-to-end services to scale your organization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-4">
            <Button as="a" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" variant="emerald">
              <Icon name="FaWhatsapp" className="text-lg" /> Chat on WhatsApp
            </Button>
            <Button as={Link} to="/services" variant="ghost">
              Explore Our Services
            </Button>
          </div>
        </motion.div>

        {/* Mouse-tracked 3D parallax wrapper around the AI core graphic */}
        <motion.div
          ref={wrapRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{ perspective: 1000 }}
          className="relative"
        >
          <motion.div style={{ rotateX, rotateY, x: translateX, y: translateY, transformStyle: 'preserve-3d' }}>
            <AiCoreGraphic />
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}

export default HeroContainer
