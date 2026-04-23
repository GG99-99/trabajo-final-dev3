import emailjs from '@emailjs/browser'

const SERVICE_ID      = import.meta.env.VITE_EMAILJS_SERVICE_ID       ?? ''
const PUBLIC_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY       ?? ''
const TPL_CHECKOUT    = import.meta.env.VITE_EMAILJS_TEMPLATE_CHECKOUT ?? ''

if (PUBLIC_KEY) emailjs.init({ publicKey: PUBLIC_KEY })

interface ContactFormData {
  user_name: string
  user_email: string
  subject: string
  message: string
}

export const emailService = {
  sendContactForm: async (data: ContactFormData) => {
    if (!SERVICE_ID || !TPL_CHECKOUT) {
      console.warn('[EmailJS] credentials not configured')
      return Promise.resolve(null)
    }
    try {
      const result = await emailjs.send(SERVICE_ID, TPL_CHECKOUT, {
        user_name:  data.user_name,
        user_email: data.user_email,
        subject:    data.subject,
        message:    data.message,
      })
      return result
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  },
}