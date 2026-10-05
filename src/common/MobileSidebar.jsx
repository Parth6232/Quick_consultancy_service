import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/redux/slices/authSlice.js'
import Icon from '../utils/iconMap.jsx'
import logo from '../assets/logo.jpeg'
import UserAvatar from './UserAvatar.jsx'

const BASE_NAV_LINKS = [
  { label: 'Home', to: '/', icon: 'FaHouse' },
  { label: 'About', to: '/about', icon: 'FaUserTie' },
  { label: 'Services', to: '/services', icon: 'FaChartLine' },
  { label: 'Blog', to: '/blog', icon: 'FaNewspaper' },
  { label: 'Portfolio', to: '/portfolio', icon: 'FaBriefcase' },
  { label: 'Contact', to: '/contact', icon: 'FaEnvelope' },
]

const MobileSidebar = ({ open, onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [open])

  const handleNav = (to) => {
    onClose()
    setTimeout(() => navigate(to), 150)
  }

  const handleLogout = () => {
    onClose()
    dispatch(logout())
  }

  const navLinks = BASE_NAV_LINKS

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
            className="fixed top-0 left-0 h-full w-64 max-w-[80vw] bg-white dark:bg-slate-900 z-[101] shadow-2xl flex flex-col border-r border-gray-100 dark:border-slate-800"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Quick Consulting Services" className="h-7 w-auto object-contain rounded" />
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  QUICK<span className="text-blue-600">CONSULTING</span>
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-300 transition"
              >
                <Icon name="FaXmark" />
              </button>
            </div>

            <nav className="flex flex-col px-3 py-4 gap-1 text-sm font-semibold text-slate-700 dark:text-gray-200 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.to)}
                  className="flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <Icon name={link.icon} className="text-blue-600 dark:text-blue-400" />
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Auth footer */}
            <div className="px-3 py-4 border-t border-gray-100 dark:border-slate-800">
              {user ? (
                <div className="flex flex-col gap-4 px-2">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={user.name} size="lg" isAdmin={isAdmin} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      {isAdmin ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                      ) : (
                        user.email && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        )
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition cursor-pointer"
                  >
                    <Icon name="FaRightFromBracket" className="text-xs shrink-0" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition text-sm font-semibold text-slate-700 dark:text-gray-200"
                >
                  <Icon name="FaUser" className="text-blue-600 dark:text-blue-400" />
                  Login
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default MobileSidebar
