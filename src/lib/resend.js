import { Resend } from 'resend';

// You should set RESEND_API_KEY in your environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };