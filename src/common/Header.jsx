import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../store/redux/slices/themeSlice.js'
import { logout } from '../store/redux/slices/authSlice.js'
import Icon from '../utils/iconMap.jsx'
import UserAvatar from './UserAvatar.jsx'
import logo from '../assets/logo.jpeg'
import { CONTACT } from '../constant/siteData.js'
import MobileSidebar from './MobileSidebar.jsx'

// ─── Dropdown animation variants ─────────────────────────────────────────────
const dropdownVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: -6 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.15, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.1 } },
}

// ─── User dropdown ────────────────────────────────────────────────────────────
const UserDropdown = ({ user, onClose }) => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const isAdmin   = user?.role === 'admin'

  const handleLogout = () => {
    onClose()
    dispatch(logout())
    navigate('/')
  }

  const handleNav = (to) => {
    onClose()
    navigate(to)
  }

  return (
    <motion.div
      variants={dropdownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute right-0 top-full mt-2.5 w-64 rounded-xl shadow-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 overflow-hidden z-50 origin-top-right"
    >
      {/* Profile header */}
      <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 dark:bg-slate-900/60 border-b border-gray-100 dark:border-slate-700">
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
          <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            isAdmin
              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
              : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
          }`}>
            {isAdmin ? '👑 Admin' : 'User'}
          </span>
        </div>
      </div>

      {/* Admin quick-actions */}
      {isAdmin && (
        <div className="py-1 border-b border-gray-100 dark:border-slate-700">
          <button
            onClick={() => handleNav('/blog/create')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition cursor-pointer text-left"
          >
            <Icon name="FaNewspaper" className="text-blue-500 text-xs shrink-0" />
            Add Blog Post
          </button>
          <button
            onClick={() => handleNav('/portfolio/add')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition cursor-pointer text-left"
          >
            <Icon name="FaBriefcase" className="text-blue-500 text-xs shrink-0" />
            Add Portfolio
          </button>
        </div>
      )}

      {/* Logout */}
      <div className="py-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer text-left"
        >
          <Icon name="FaRightFromBracket" className="text-xs shrink-0" />
          Logout
        </button>
      </div>
    </motion.div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = () => {
  const dispatch  = useDispatch()
  const location  = useLocation()
  const mode      = useSelector((s) => s.theme.mode)
  const user      = useSelector((s) => s.auth.user)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isAdmin = user?.role === 'admin'
  const isUser  = user?.role === 'user'

  const closeDropdown = useCallback(() => setDropdownOpen(false), [])

  // Close on route change
  useEffect(() => { closeDropdown() }, [location.pathname, closeDropdown])

  // Close on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) closeDropdown()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen, closeDropdown])

  // Close on Escape
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => { if (e.key === 'Escape') closeDropdown() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [dropdownOpen, closeDropdown])

  return (
    <nav className="sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm z-50 transition-colors duration-300 border-b border-gray-100/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">

        {/* ── Left: hamburger + logo ───────────────────────────────────── */}
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

        {/* ── Center: desktop nav links ────────────────────────────────── */}
        <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-700 dark:text-gray-300">
          <Link to="/"          className="nav-link cursor-pointer">Home</Link>
          <Link to="/about"     className="nav-link cursor-pointer">About</Link>
          <Link to="/services"  className="nav-link cursor-pointer">Services</Link>
          <Link to="/blog"      className="nav-link cursor-pointer">Blog</Link>
          <Link to="/portfolio" className="nav-link cursor-pointer">Portfolio</Link>
          <Link to="/contact"   className="nav-link cursor-pointer">Contact</Link>
        </div>

        {/* ── Right: theme + user/login + CTA ─────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
            className="cursor-pointer text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 active:scale-95"
          >
            <Icon name={mode === 'dark' ? 'FaSun' : 'FaMoon'} className={mode === 'dark' ? 'text-yellow-400' : ''} />
          </button>

          {/* Avatar + dropdown (logged in) */}
          {(isUser || isAdmin) && (
            <div ref={dropdownRef} className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="Account menu"
                className="cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-95 transition"
              >
                <UserAvatar name={user.name} size="sm" isAdmin={isAdmin} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <UserDropdown user={user} onClose={closeDropdown} />
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Login link (logged out) */}
          {!user && (
            <Link
              to="/login"
              className="hidden md:inline-flex cursor-pointer text-sm font-semibold text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition items-center gap-1"
            >
              <Icon name="FaUser" className="text-xs" />
              Login
            </Link>
          )}

          {/* Get a Quote CTA */}
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
