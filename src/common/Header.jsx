import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../store/redux/slices/themeSlice.js'
import { logout } from '../store/redux/slices/authSlice.js'
import Icon from '../utils/iconMap.jsx'
import logo from '../assets/logo.jpeg'
import { CONTACT } from '../constant/siteData.js'
import MobileSidebar from './MobileSidebar.jsx'

const Header = () => {
  const dispatch = useDispatch()
  const mode = useSelector((s) => s.theme.mode)
  const user = useSelector((s) => s.auth.user)
  const [menuOpen, setMenuOpen] = useState(false)

  const isAdmin = user?.role === 'admin'
  const isUser = user?.role === 'user'

  return (
    <nav className="sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm z-50 transition-colors duration-300 border-b border-gray-100/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden cursor-pointer w-9 h-9 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 active:scale-95 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 md:gap-3 cursor-pointer"
          >
            <motion.img
              whileHover={{ scale: 1.08, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 300 }}
              src={logo}
              alt="Quick Consulting Services Logo"
              className="h-9 md:h-10 w-auto object-contain rounded-lg ring-2 ring-transparent group-hover:ring-blue-400/40 transition-shadow"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                QUICK
                <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  CONSULTING
                </span>
              </span>
              <span className="text-[0.65rem] md:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                Find the Problem. Fix the Problem. Grow the Business.
              </span>
            </div>
          </a>
        </div>

        <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-700 dark:text-gray-300">
          <Link to="/" className="nav-link cursor-pointer">Home</Link>
          <Link to="/about" className="nav-link cursor-pointer">About</Link>
          <Link to="/services" className="nav-link cursor-pointer">Services</Link>
          <Link to="/blog" className="nav-link cursor-pointer">Blog</Link>
          <Link to="/portfolio" className="nav-link cursor-pointer">Portfolio</Link>
          <Link to="/contact" className="nav-link cursor-pointer">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            className="cursor-pointer text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 active:scale-95"
          >
            <Icon name={mode === 'dark' ? 'FaSun' : 'FaMoon'} className={mode === 'dark' ? 'text-yellow-400' : ''} />
          </button>

          {isUser && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 max-w-[90px] truncate">
                {user.name}
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="cursor-pointer text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"
              >
                Logout
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Admin</span>
              <button
                onClick={() => dispatch(logout())}
                className="cursor-pointer text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"
              >
                Logout
              </button>
            </div>
          )}

          {!user && (
            <Link
              to="/login"
              className="hidden md:inline-flex cursor-pointer text-sm font-semibold text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition items-center gap-1"
            >
              <Icon name="FaUser" className="text-xs" />
              Login
            </Link>
          )}

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/contact"
              className="cursor-pointer btn-glossy bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs md:text-sm font-semibold px-4 md:px-5 py-2 rounded-lg shadow-glossy transition flex items-center gap-1.5"
            >
              Get a Quote
              <Icon name="FaPaperPlane" className="text-[10px]" />
            </Link>
          </motion.div>
        </div>
      </div>

      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  )
}

export default Header
