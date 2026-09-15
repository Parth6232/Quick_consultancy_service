import Reveal from '../../common/Reveal.jsx'
import Icon from '../../utils/iconMap.jsx'
import ConsultationForm from './ConsultationForm.jsx'
import { CONTACT } from '../../constant/siteData.js'

const contactLinks = [
  { icon: 'FaLocationDot', title: 'Office Address', value: CONTACT.address, href: CONTACT.mapsUrl, bg: 'bg-blue-600' },
  { icon: 'FaPhone', title: 'Direct Phone', value: CONTACT.phone, href: CONTACT.phoneHref, bg: 'bg-blue-600' },
  { icon: 'FaEnvelope', title: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, bg: 'bg-blue-600' },
  { icon: 'FaLinkedin', title: 'LinkedIn', value: 'LinkedIn', href: CONTACT.linkedin, bg: 'bg-blue-600' },
  { icon: 'FaFacebook', title: 'Facebook', value: 'facebook.com/QuickConsultingServices', href: CONTACT.facebook, bg: 'bg-blue-600' },
  { icon: 'FaInstagram', title: 'Instagram', value: '@quick_consulting_services', href: CONTACT.instagram, bg: 'bg-pink-600' },
  { icon: 'FaYoutube', title: 'YouTube', value: '@quick_consulting', href: CONTACT.youtube, bg: 'bg-red-600' },
]

const ContactContainer = () => {
  return (
    <section
      id="contact"
      className="bg-slate-950 py-20 md:py-28 px-4 md:px-6 relative overflow-x-clip transition-colors duration-300"
      style={{ scrollMarginTop: 72 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative z-10">
        <Reveal className="space-y-6">
          <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Get in Touch</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Visit Our Office or Schedule a Consultation</h2>
          <p className="text-gray-400 text-xs md:text-sm">
            Have questions about registration, tax compliance, or implementing AI in your business? Speak with our
            specialists today.
          </p>

          <div className="space-y-4">
            {contactLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-start gap-4 transition-colors"
              >
                <div className={`${link.bg} text-white p-3 rounded-lg shrink-0`}>
                  <Icon name={link.icon} />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm md:text-base group-hover:text-blue-400 transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400 group-hover:text-blue-300 transition-colors">
                    {link.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="ring-wrapper flex justify-center items-center mt-10 lg:mt-0 p-4 sm:p-8">
          <div className="glow-orbit" />
          <ConsultationForm />
        </Reveal>
      </div>
    </section>
  )
}

export default ContactContainer
