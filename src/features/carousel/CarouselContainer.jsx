import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import Reveal from '../../common/Reveal.jsx'
import TiltCard from '../../common/TiltCard.jsx'
import GradientBorderCard from '../../common/GradientBorderCard.jsx'
import Icon from '../../utils/iconMap.jsx'
import { APPROACH_CARDS } from '../../constant/siteData.js'

const Card = ({ icon, title, desc, serviceId, onClick }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <TiltCard maxTilt={12} className="w-60 md:w-72 shrink-0">
      <GradientBorderCard
        className="h-full shadow-xl hover:shadow-glossy-lg transition-shadow duration-300"
        innerClassName="h-full"
      >
        <div 
          onClick={onClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl group h-full bg-gradient-to-br from-slate-800 to-slate-800/60 border border-slate-700/60 p-6 flex flex-col items-start text-left"
        >
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/25 text-blue-400 text-xl flex items-center justify-center mb-4 transition-colors"
          >
            <Icon name={icon} />
          </motion.div>
          <h4 className="font-bold text-base md:text-lg mb-1.5 text-white">{title}</h4>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 flex-1">{desc}</p>
          
          <div className="text-xs font-semibold text-blue-400 flex items-center mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
            Learn more 
            <Icon name="FaArrowLeft" className="ml-1 text-[10px] rotate-180 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </GradientBorderCard>
    </TiltCard>
  )
}

const CarouselContainer = () => {
  const cards = [...APPROACH_CARDS, ...APPROACH_CARDS]
  const [searchParams, setSearchParams] = useSearchParams()
  const activeServiceId = useSelector((s) => s.services.activeServiceId)

  const handleCardClick = (serviceId) => {
    if (!serviceId) return
    const newParams = new URLSearchParams(searchParams)
    newParams.set('service', serviceId)
    setSearchParams(newParams, { replace: true })
  }

  const isPanelOpen = !!activeServiceId

  return (
    <section className="py-14 md:py-20 bg-slate-900 dark:bg-black text-white overflow-hidden relative transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      <Reveal className="text-center mb-10 md:mb-14 px-4 relative">
        <span className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3 inline-block">
          How We Work
        </span>
        <h2 className="text-2xl md:text-3xl font-bold">
          Our Approach <span className="text-blue-400">in Action</span>
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mt-2">
          Delivering excellence across every business domain — <em>Your Vision + Our Expertise.</em>
        </p>
      </Reveal>

      <div className="relative w-full h-[220px] md:h-[240px] flex items-center">
        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-slate-900 dark:from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-slate-900 dark:from-black to-transparent z-20 pointer-events-none" />

        <div 
          className={`flex gap-6 px-6 animate-marquee ${isPanelOpen ? 'paused' : ''}`} 
          style={{ perspective: 1000 }}
        >
          {cards.map((c, i) => (
            <Card 
              key={`${c.title}-${i}`} 
              icon={c.icon} 
              title={c.title} 
              desc={c.desc} 
              serviceId={c.serviceId}
              onClick={() => handleCardClick(c.serviceId)}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee.paused {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

export default CarouselContainer
