import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'
import { useCounter } from '../../common/useCounter.js'
import { TRUST_STATS } from '../../constant/siteData.js'

const Counter = ({ target, suffix }) => {
  const [ref, value] = useCounter(target)
  return (
    <div ref={ref} className="text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
      {value}
      {suffix}
    </div>
  )
}

const StatsContainer = () => {
  return (
    <section
      id="stats-section"
      className="py-8 md:py-12 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {TRUST_STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="p-4">
            {stat.icon === 'counter' ? (
              <>
                <Counter target={stat.target} suffix={stat.suffix} />
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">
                  {stat.label}
                </div>
              </>
            ) : (
              <>
                <div className="text-xl md:text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-2 flex justify-center">
                  <Icon name={stat.icon} />
                </div>
                <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-semibold">{stat.label}</div>
              </>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default StatsContainer
