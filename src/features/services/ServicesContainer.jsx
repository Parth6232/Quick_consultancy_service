import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from '../../common/Reveal.jsx'
import GradientBorderCard from '../../common/GradientBorderCard.jsx'
import Icon from '../../utils/iconMap.jsx'
import { setCategory, openService } from '../../store/redux/slices/servicesSlice.js'
import { SERVICES, SERVICE_CATEGORIES } from '../../constant/siteData.js'

const ServicesContainer = () => {
  const dispatch = useDispatch()
  const active = useSelector((s) => s.services.activeCategory)

  const visible = active === 'all' ? SERVICES : SERVICES.filter((s) => s.id === active)

  const handleCardClick = (serviceId) => {
    dispatch(openService(serviceId))
  }

  const handleKeyDown = (e, serviceId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick(serviceId)
    }
  }

  return (
    <section
      id="services"
      className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto bg-gray-50 dark:bg-slate-950 transition-colors duration-300"
      style={{ scrollMarginTop: 72 }}
    >
      <Reveal className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Our Comprehensive Services</h2>
        <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-2">
          Explore our full suite of tax, legal, IT, AI, and business growth solutions.
        </p>
      </Reveal>

      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-slate-800 mb-8 space-x-2 md:space-x-4 pb-2 no-scrollbar">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => dispatch(setCategory(cat.id))}
            className={`cursor-pointer active:scale-95 px-3 py-2 text-xs md:text-sm whitespace-nowrap rounded-full transition font-medium ${
              active === cat.id
                ? 'bg-blue-600 text-white shadow-glossy'
                : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: 1000 }}>
        <AnimatePresence mode="popLayout">
          {visible.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03, rotateX: 4, rotateY: -4, y: -6 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              onClick={() => handleCardClick(service.id)}
              onKeyDown={(e) => handleKeyDown(e, service.id)}
              tabIndex={0}
              role="button"
              className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
            >
              <GradientBorderCard rounded="rounded-xl" className="h-full shadow-sm hover:shadow-glossy-lg transition-shadow duration-300">
                <div className="group relative overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60 p-6 rounded-xl h-full flex flex-col">
                  {/* shine sweep on hover */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xl flex items-center justify-center mb-4 transition-colors relative shrink-0"
                  >
                    <Icon name={service.icon} />
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white relative">{service.title}</h3>
                  <ul className="text-xs md:text-sm text-gray-600 dark:text-gray-400 space-y-1.5 relative flex-1 mb-4">
                    {service.items.map((item, idx) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-1.5"
                      >
                        <Icon name="FaCheck" className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="relative text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center mt-auto">
                    Learn more 
                    <Icon name="FaArrowLeft" className="ml-1 text-[10px] rotate-180 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </GradientBorderCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default ServicesContainer
