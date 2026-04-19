import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST   ?? 'smtp.gmail.com',
    port:   Number(process.env.MAIL_PORT ?? 587),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
    },
})

export type MailOptions = {
    to:      string | string[]
    subject: string
    html:    string
    text?:   string
}

export const mailer = {
    send: async (opts: MailOptions) => {
        return transporter.sendMail({
            from:    process.env.MAIL_FROM ?? `"Obsidian Archive" <${process.env.MAIL_USER}>`,
            to:      Array.isArray(opts.to) ? opts.to.join(', ') : opts.to,
            subject: opts.subject,
            html:    opts.html,
            text:    opts.text,
        })
    },

    /** Appointment confirmation email */
    sendAppointmentConfirmation: (to: string, data: {
        clientName:  string
        workerName:  string
        tattooName:  string
        date:        string
        start:       string
        end:         string
    }) => mailer.send({
        to,
        subject: 'Appointment Confirmed — Obsidian Archive',
        html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;color:#e8e0d8;padding:40px 32px;border-radius:4px">
                <h1 style="font-size:32px;font-weight:300;color:#ff5a66;margin:0 0 8px">You're booked.</h1>
                <p style="color:#a09890;font-size:13px;margin:0 0 32px">Your session at Obsidian Archive has been confirmed.</p>
                <table style="width:100%;border-collapse:collapse">
                    ${[
                        ['Client',  data.clientName],
                        ['Artist',  data.workerName],
                        ['Design',  data.tattooName],
                        ['Date',    data.date],
                        ['Time',    `${data.start} – ${data.end}`],
                    ].map(([k, v]) => `
                        <tr>
                            <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#a09890;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;width:100px">${k}</td>
                            <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#e8e0d8;font-size:13px">${v}</td>
                        </tr>
                    `).join('')}
                </table>
                <p style="margin:32px 0 0;color:#a09890;font-size:11px">
                    Permanence. Precision. The digital sanctuary for high-end somatic art.
                </p>
            </div>
        `,
        text: `Appointment confirmed at Obsidian Archive.\n\nClient: ${data.clientName}\nArtist: ${data.workerName}\nDesign: ${data.tattooName}\nDate: ${data.date}\nTime: ${data.start} – ${data.end}`,
    }),
}
