import { motion } from 'framer-motion'
import Reveal from '../../common/Reveal.jsx'
import FlipCard from '../../common/FlipCard.jsx'
import TiltCard from '../../common/TiltCard.jsx'
import Icon from '../../utils/iconMap.jsx'
import { WHY_CHOOSE_US } from '../../constant/siteData.js'

const cardBase =
  'glossy-surface p-6 rounded-xl shadow-sm border h-full flex flex-col items-center justify-center text-center'

const MISSION_STATS = [
  { value: '7+', label: 'Service Verticals' },
  { value: '100%', label: 'Transparent Pricing' },
  { value: 'Pan-India', label: 'Client Support' },
]

const AboutContainer = () => {
  return (
    <section
      id="about"
      className="py-12 md:py-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
      style={{ scrollMarginTop: 72 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center mb-16 md:mb-20">
          <Reveal className="lg:col-span-3">
            <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3 inline-block">
              Who We Are
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
              One partner for tax, tech, and everything <span className="text-blue-600 dark:text-blue-400">in between.</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
              Quick Consulting Services was built on a simple idea — businesses shouldn&apos;t need five
              different vendors for compliance, technology, and growth. We bring tax &amp; legal expertise,
              IT and AI automation, and digital growth strategy under one roof, so you can focus on running
              your business while we handle the rest.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
              {MISSION_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <TiltCard maxTilt={14} className="h-full">
                    <div className="glossy-surface h-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-4 text-center shadow-sm hover:shadow-glossy-lg transition-shadow duration-300">
                      <div className="text-lg md:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                        {stat.value}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                        {stat.label}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-2">
            <TiltCard maxTilt={12} className="max-w-sm mx-auto block">
              <div className="relative aspect-square" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-500 opacity-90" />
                <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
                <div className="relative h-full w-full flex flex-col items-center justify-center text-white p-8 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="relative mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full bg-white/40 blur-md"
                      />
                      <Icon name="FaHandshakeAngle" className="relative text-5xl drop-shadow" />
                    </div>
                  </motion.div>
                  <p className="text-lg md:text-xl font-bold leading-snug">
                    &ldquo;Your Vision + Our Expertise = Successful Business&rdquo;
                  </p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>

        <Reveal className="text-center mb-10 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Why Choose Us?</h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-2">
            Partner with industry experts dedicated to your growth. Hover a card to see more.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <TiltCard maxTilt={8}>
                <FlipCard
                  height={220}
                  front={
                    <div className={`${cardBase} bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700`}>
                      <div className="text-blue-600 dark:text-blue-400 text-3xl mb-4">
                        <Icon name={item.icon} />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                      <span className="mt-3 text-[10px] uppercase tracking-wide text-blue-500 dark:text-blue-400 font-semibold">
                        Hover to reveal
                      </span>
                    </div>
                  }
                  back={
                    <div className={`${cardBase} bg-blue-600 border-blue-500 text-white shadow-glossy-lg`}>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-xs text-blue-50 leading-relaxed">{item.detail}</p>
                    </div>
                  }
                />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutContainer
