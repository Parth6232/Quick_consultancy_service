// Fill these in after creating your EmailJS account (emailjs.com):
// 1. SERVICE_ID    -> Email Services tab
// 2. TEMPLATE_ID   -> Email Templates tab
// 3. PUBLIC_KEY    -> Account > General tab
//
// Until these are filled in, the contact form will fall back to opening
// the visitor's email app (mailto) instead of sending directly.

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_1j0cssi',
  TEMPLATE_ID: 'template_w2fdlzd',
  PUBLIC_KEY: 'dnCiqsYnEXpI2MX3C',
}

export const isEmailjsConfigured = () =>
  EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
  EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
