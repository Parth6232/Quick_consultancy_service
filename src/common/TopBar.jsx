import Icon from '../utils/iconMap.jsx'
import { CONTACT } from '../constant/siteData.js'

const links = [
  { href: CONTACT.mapsUrl, icon: 'FaLocationDot', label: CONTACT.address, color: 'text-blue-400', showAlways: false },
]

const TopBar = () => {
  return (
    <div className="hidden sm:block topbar-glossy text-gray-300 text-xs md:text-sm py-2 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <a
          href={CONTACT.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-center sm:text-left hover:text-white transition"
        >
          <Icon name="FaLocationDot" className="text-blue-400" />
          <span className="hidden lg:inline">{CONTACT.address}</span>
        </a>
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 lg:gap-4 mt-2 sm:mt-0">
          <a href={`mailto:${CONTACT.email}`} className="hover:text-white flex items-center gap-1 transition">
            <Icon name="FaEnvelope" className="text-blue-400" />
            <span className="hidden lg:inline">{CONTACT.email}</span>
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition">
            <Icon name="FaLinkedin" className="text-blue-400" />
            <span className="hidden lg:inline">LinkedIn</span>
          </a>
          <a href={CONTACT.phoneHref} className="hover:text-white flex items-center gap-1 transition">
            <Icon name="FaPhone" className="text-blue-400" />
            <span className="hidden lg:inline">{CONTACT.phone}</span>
          </a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition">
            <Icon name="FaWhatsapp" className="text-emerald-400" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition">
            <Icon name="FaFacebook" className="text-blue-400" />
            <span className="hidden lg:inline">Facebook</span>
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition">
            <Icon name="FaInstagram" className="text-pink-500" />
            <span className="hidden lg:inline">Instagram</span>
          </a>
          <a href={CONTACT.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition">
            <Icon name="FaYoutube" className="text-red-500" />
            <span className="hidden lg:inline">YouTube</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
