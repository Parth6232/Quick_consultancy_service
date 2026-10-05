// src/common/UserAvatar.jsx
// Reusable Gmail-style letter avatar with consistent per-name color.
// Admin users get a gold crown badge at the bottom-right corner.

import Icon from '../utils/iconMap.jsx'

// Eight vivid accessible colors — consistent in light & dark (white letter always readable)
const PALETTE = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-rose-600',
  'bg-amber-500',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-orange-500',
]

/** Simple string hash → 0..N-1 */
const nameHash = (name = '') => {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return h % PALETTE.length
}

const SIZES = {
  sm: { outer: 'w-9 h-9',   text: 'text-base',  badge: 'w-3.5 h-3.5 text-[7px]' },
  lg: { outer: 'w-11 h-11', text: 'text-lg',    badge: 'w-4   h-4   text-[8px]'  },
}

/**
 * UserAvatar
 * @param {string}  name       – display name (first letter shown)
 * @param {'sm'|'lg'} size     – 'sm' = 36px, 'lg' = 44px
 * @param {boolean} isAdmin    – shows gold crown badge
 * @param {string}  className  – extra wrapper classes
 */
const UserAvatar = ({ name = '?', size = 'sm', isAdmin = false, className = '' }) => {
  const letter = (name[0] ?? '?').toUpperCase()
  const color  = PALETTE[nameHash(name)]
  const s      = SIZES[size] ?? SIZES.sm

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {/* Circle */}
      <div
        className={`${s.outer} ${color} rounded-full flex items-center justify-center font-bold text-white select-none ring-2 ring-white/30 dark:ring-slate-700/60`}
      >
        <span className={s.text}>{letter}</span>
      </div>

      {/* Admin crown badge */}
      {isAdmin && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${s.badge} rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center ring-1 ring-white dark:ring-slate-900`}
          aria-label="Administrator"
        >
          <Icon name="FaCrown" className="text-white" />
        </span>
      )}
    </div>
  )
}

export default UserAvatar
