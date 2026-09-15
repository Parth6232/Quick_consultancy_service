import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../utils/iconMap.jsx'
import logo from '../assets/logo.jpeg'
import { CONTACT, SERVICE_CATEGORIES } from '../constant/siteData.js'

const COMPANY_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Services', to: '/services' },
  { label: 'Get a Quote', to: '/contact' },
  { label: 'FAQs', to: '/contact' },
]

const SOCIALS = [
  { icon: 'FaLinkedin', href: CONTACT.linkedin, hover: 'hover:bg-blue-600' },
  { icon: 'FaFacebook', href: CONTACT.facebook, hover: 'hover:bg-blue-600' },
  { icon: 'FaInstagram', href: CONTACT.instagram, hover: 'hover:bg-pink-600' },
  { icon: 'FaYoutube', href: CONTACT.youtube, hover: 'hover:bg-red-600' },
  { icon: 'FaWhatsapp', href: CONTACT.whatsapp, hover: 'hover:bg-emerald-600' },
]

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="bg-slate-950 text-gray-400 relative overflow-hidden transition-colors duration-300">
      {/* soft glow accents to match the site's glossy language */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-12 sm:pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-10 sm:gap-y-12 gap-x-10 lg:gap-x-8 divide-y divide-slate-800/70 sm:divide-y-0">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4 text-center sm:text-left pb-8 sm:pb-0">
            <Link to="/" className="flex items-center gap-3 cursor-pointer w-fit mx-auto sm:mx-0">
              <img src={logo} alt="Quick Consulting Services" className="h-10 w-auto object-contain rounded" />
              <span className="text-xl font-extrabold text-white tracking-tight">
                QUICK<span className="text-blue-400">CONSULTING</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm mx-auto sm:mx-0">
              Comprehensive tax, registration, accounting, IT, AI automation and digital growth solutions —
              your vision, our expertise, successful business.
            </p>
            <div className="flex gap-2 pt-1 justify-center sm:justify-start">
              {SOCIALS.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-300 hover:text-white ${s.hover} transition-colors`}
                >
                  <Icon name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="text-center sm:text-left pt-8 sm:pt-0">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-blue-400 transition-colors cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left pt-8 sm:pt-0">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <li key={cat.id}>
                  <Link to="/services" className="hover:text-blue-400 transition-colors cursor-pointer">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="space-y-6 text-center sm:text-left pt-8 sm:pt-0">
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Contact Us</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2 justify-center sm:justify-start">
                  <Icon name="FaLocationDot" className="text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-left">{CONTACT.address}</span>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <Icon name="FaPhone" className="text-blue-400 shrink-0" />
                  <a href={CONTACT.phoneHref} className="hover:text-blue-400 transition-colors">
                    {CONTACT.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <Icon name="FaEnvelope" className="text-blue-400 shrink-0" />
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-blue-400 transition-colors">
                    {CONTACT.email}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-3">Stay Updated</h4>
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-xs mx-auto sm:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="btn-glossy shrink-0 w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition active:scale-95"
                >
                  <Icon name="FaPaperPlane" className="text-xs" />
                </button>
              </form>
              {subscribed && <p className="text-emerald-400 text-xs mt-2">Thanks for subscribing!</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-slate-800 text-gray-500 py-5 px-5 sm:px-6 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Quick Consulting Services. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
