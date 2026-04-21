import emailjs from '@emailjs/browser'

// Inicializar EmailJS con tu Public Key
emailjs.init('0Fkk6bBwwMB8oLzh8') // Reemplaza con tu clave pública

interface ContactFormData {
  user_name: string
  user_email: string
  subject: string
  message: string
}

export const emailService = {
  sendContactForm: async (data: ContactFormData) => {
    try {
      const result = await emailjs.send(
        'service_ohufsw8',    // Reemplaza con tu Service ID
        'template_rfnjrsq',   // Reemplaza con tu Template ID
        {
          user_name: data.user_name,
          user_email: data.user_email,
          subject: data.subject,
          message: data.message,
        }
      )
      return result
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }
}