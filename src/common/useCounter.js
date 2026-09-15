import { useEffect, useRef, useState } from 'react'

export const useCounter = (target, duration = 1200) => {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1)
              setValue(Math.floor(progress * target))
              if (progress < 1) requestAnimationFrame(step)
              else setValue(target)
            }
            requestAnimationFrame(step)
          }
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration])

  return [ref, value]
}
