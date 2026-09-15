import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'
import { TESTIMONIALS } from '../../constant/siteData.js'

const TestimonialsContainer = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Client Reviews</h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-2">What our partners say about us.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="card-glossy bg-slate-50 dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 h-full">
                <div className="flex text-yellow-400 text-sm mb-3 gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Icon key={idx} name="FaStar" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsContainer
