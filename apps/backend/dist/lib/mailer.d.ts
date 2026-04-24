export declare const mailer: {
    /** Send a 6-digit OTP code — uses VITE_EMAILJS_TEMPLATE_CHECKOUT
     *  Template variables: {{user_name}}, {{message}}, {{otp_code}}, {{user_email}}
     */
    sendOtp: (to: string, code: string) => Promise<Response>;
    /** Send appointment confirmation — uses VITE_EMAILJS_TEMPLATE_CHECKOUT */
    sendAppointmentConfirmation: (to: string, data: {
        clientName: string;
        workerName: string;
        tattooName: string;
        date: string;
        start: string;
        end: string;
        apptNumber?: string;
    }) => Promise<Response>;
};
//# sourceMappingURL=mailer.d.ts.map