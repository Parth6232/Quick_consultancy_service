/**
 * A rotating gradient "glow ring" border that shows on hover, built with
 * plain nested divs + overflow:hidden (no CSS mask-composite tricks,
 * which render inconsistently across browsers). The outer layer clips an
 * oversized spinning conic-gradient square down to the rounded card
 * shape; the inner solid card covers everything except a thin ring.
 */
const GradientBorderCard = ({ children, className = '', innerClassName = '', rounded = 'rounded-2xl' }) => {
  return (
    <div className={`group/glow relative ${rounded} overflow-hidden ${className}`}>
      <div
        className={`absolute -inset-[60%] opacity-0 group-hover/glow:opacity-100 transition-opacity duration-300 animate-spin-slow`}
        style={{
          background:
            'conic-gradient(from 0deg, #3b82f6, #6366f1, #10b981, #3b82f6)',
        }}
      />
      <div className={`relative m-[1.5px] ${rounded} ${innerClassName}`}>{children}</div>
    </div>
  )
}

export default GradientBorderCard
