import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import emailjs from '@emailjs/browser'
import Icon from '../../utils/iconMap.jsx'
import { CONTACT, SERVICE_OPTIONS } from '../../constant/siteData.js'
import { EMAILJS_CONFIG, isEmailjsConfigured } from '../../constant/emailjsConfig.js'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  service: z.string(),
})

const ConsultationForm = () => {
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [sending, setSending] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', service: SERVICE_OPTIONS[0] },
  })

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setErrorMsg('')
    setTimeout(() => setSuccessMsg(''), 6000)
  }

  const showError = (msg) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(''), 6000)
  }

  const onSubmitEmail = async (data) => {
    const phone = '+91' + data.phone

    // Once EmailJS keys are added to src/constant/emailjsConfig.js, this
    // sends the request straight to your inbox. Until then, it falls back
    // to opening the visitor's email app (mailto).
    if (isEmailjsConfigured()) {
      setSending(true)
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            from_name: data.name,
            phone,
            service: data.service,
            to_email: CONTACT.email,
          },
          { publicKey: EMAILJS_CONFIG.PUBLIC_KEY },
        )
        showSuccess('Thank you! Your request has been sent — we will contact you shortly.')
        reset()
      } catch (err) {
        console.error('EmailJS error:', err)
        showError('Could not send right now. Please try WhatsApp or Call instead.')
      } finally {
        setSending(false)
      }
      return
    }

    const subject = encodeURIComponent(`New Consultation Request from ${data.name}`)
    const body = encodeURIComponent(
      `Hello,\n\nI would like to request a consultation.\n\nDetails:\nName: ${data.name}\nPhone: ${phone}\nService Required: ${data.service}\n\nThank you.`,
    )
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
    showSuccess('Opening your email app — please hit Send to complete your request!')
    setTimeout(() => reset(), 1000)
  }

  const onSubmitWhatsapp = () => {
    const name = watch('name') || 'A new visitor'
    const phoneRaw = watch('phone')
    const phone = /^[0-9]{10}$/.test(phoneRaw) ? '+91' + phoneRaw : 'Not provided'
    const service = watch('service')
    const text = encodeURIComponent(
      `Hello, I would like to request a consultation.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Service:* ${service}`,
    )
    window.open(`${CONTACT.whatsapp}?text=${text}`, '_blank')
    showSuccess('Opening WhatsApp...')
  }

  return (
    <div
      id="consultation-form"
      className="form-float-card glassy-panel relative z-[15] w-full rounded-2xl p-7 md:p-9 shadow-glossy-lg"
      style={{ scrollMarginTop: 96 }}
    >
      <h3 className="text-lg md:text-xl font-bold mb-5 text-white">Request a Consultation</h3>
      <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-5" noValidate>
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 text-sm border border-slate-600/50 bg-slate-800/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-colors"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Phone Number</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm font-medium text-gray-400 select-none pointer-events-none">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              {...register('phone', {
                onChange: (e) => setValue('phone', e.target.value.replace(/[^0-9]/g, '')),
              })}
              className="w-full pl-[42px] pr-3 py-2 text-sm border border-slate-600/50 bg-slate-800/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-colors"
            />
          </div>
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Service Required</label>
          <select
            {...register('service')}
            className="w-full px-3 py-2 text-sm border border-slate-600/50 bg-slate-800/60 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-colors appearance-none"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} className="bg-slate-800 text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {successMsg && (
          <p className="text-emerald-400 text-xs font-semibold mt-2 text-center">{successMsg}</p>
        )}
        {errorMsg && <p className="text-red-400 text-xs font-semibold mt-2 text-center">{errorMsg}</p>}

        <div className="flex flex-col gap-2 mt-4 pt-2">
          <button
            type="submit"
            disabled={sending}
            className="cursor-pointer active:scale-95 btn-glossy w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] text-sm font-medium py-2.5 rounded-lg transition"
          >
            {sending ? 'Sending...' : 'Submit Request'}
          </button>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onSubmitWhatsapp}
              className="flex-1 cursor-pointer active:scale-95 btn-glossy bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <Icon name="FaWhatsapp" /> Send via WhatsApp
            </button>
            <a
              href={CONTACT.phoneHref}
              className="flex-1 text-center cursor-pointer active:scale-95 btn-glossy bg-transparent border border-gray-400/50 hover:bg-white/10 text-gray-200 text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <Icon name="FaPhone" /> Call Us Instead
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ConsultationForm
