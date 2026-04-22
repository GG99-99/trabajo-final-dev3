// ── EmailJS REST API (Node.js — requires "Allow non-browser requests" enabled) ─
// Dashboard: https://dashboard.emailjs.com/admin/account/security
const EMAILJS_SERVICE_ID  = process.env.VITE_EMAILJS_SERVICE_ID       ?? ''
const EMAILJS_PUBLIC_KEY  = process.env.VITE_EMAILJS_PUBLIC_KEY        ?? ''
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY            ?? ''
const TPL_OTP             = process.env.VITE_EMAILJS_TEMPLATE_CHECKOUT ?? ''
const TPL_CONFIRM         = process.env.VITE_EMAILJS_TEMPLATE_CONTACT  ?? ''

async function emailjsSend(templateId: string, templateParams: Record<string, string>) {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            service_id:      EMAILJS_SERVICE_ID,
            template_id:     templateId,
            user_id:         EMAILJS_PUBLIC_KEY,
            accessToken:     EMAILJS_PRIVATE_KEY,
            template_params: templateParams,
        }),
    })
    if (!res.ok) {
        const body = await res.text()
        throw new Error(`EmailJS error ${res.status}: ${body}`)
    }
    return res
}

export const mailer = {
    /** Send a 6-digit OTP code — uses VITE_EMAILJS_TEMPLATE_CHECKOUT
     *  Template variables: {{user_name}}, {{message}}, {{otp_code}}, {{user_email}}
     */
    sendOtp: (to: string, code: string) =>
        emailjsSend(TPL_OTP, {
            user_name:  to.split('@')[0],
            message:    'Tu código de verificación de Obsidian Tattoo Studio es:',
            otp_code:   code,
            user_email: to,
        }),

    /** Send appointment confirmation — uses VITE_EMAILJS_TEMPLATE_CHECKOUT */
    sendAppointmentConfirmation: (to: string, data: {
        clientName:  string
        workerName:  string
        tattooName:  string
        date:        string
        start:       string
        end:         string
        apptNumber?: string
    }) =>
        emailjsSend(TPL_OTP, {
            user_name:  data.clientName,
            message:    `Tu cita ha sido confirmada en Obsidian Tattoo Studio.\n\n` +
                        `👤 Artista : ${data.workerName}\n` +
                        `🎨 Servicio: ${data.tattooName}\n` +
                        `📅 Fecha   : ${data.date}\n` +
                        `🕐 Horario : ${data.start} – ${data.end}` +
                        (data.apptNumber ? `\n📋 Ref.     : ${data.apptNumber}` : ''),
            otp_code:   data.apptNumber ?? '—',
            to_email:   to,
            user_email: to,
        }),
}
