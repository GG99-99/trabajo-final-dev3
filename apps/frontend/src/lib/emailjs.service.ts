import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  ?? ''
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  ?? ''
const TPL_CONTACT = import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT ?? ''

if (PUBLIC_KEY) emailjs.init({ publicKey: PUBLIC_KEY })

export const emailService = {
  /**
   * Send contact form using template_xdoriho.
   * Template variables: {{user_name}}, {{user_email}}, {{subject}}, {{message}}
   */
  sendContactForm: (data: {
    user_name:  string
    user_email: string
    subject:    string
    message:    string
  }) => {
    if (!SERVICE_ID || !TPL_CONTACT) {
      console.warn('[EmailJS] credentials not configured')
      return Promise.resolve(null)
    }
    return emailjs.send(SERVICE_ID, TPL_CONTACT, data)
  },
}
