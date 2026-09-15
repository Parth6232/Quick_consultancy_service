import { useEffect } from 'react'
import FaqContainer from '../features/faq/FaqContainer.jsx'
import ContactContainer from '../features/contact/ContactContainer.jsx'

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div>
      <FaqContainer />
      <ContactContainer />
    </div>
  )
}

export default ContactPage
