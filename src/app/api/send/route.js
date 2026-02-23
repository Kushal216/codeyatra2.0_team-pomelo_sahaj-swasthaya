'use server';

import { Resend } from 'resend';
import ReactDOMServer from 'react-dom/server';
import EmailTemplate from '@/components/EmailTamplete';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        // Example patient data, replace with real request data if needed
        const patient = {
            name: 'John Doe',
            reportDate: '2026-02-23',
            doctorName: 'Dr. Anish Sharma',
            reportLink: 'https://example.com/report.pdf',
            email: 'delivered@resend.dev',
        };

        // Render React component to HTML string
        const html = ReactDOMServer.renderToStaticMarkup(
            <EmailTemplate
                patientName={patient.name}
                reportDate={patient.reportDate}
                doctorName={patient.doctorName}
                downloadLink={patient.reportLink}
            />
        );

        // Send email using Resend
        const data = await resend.emails.send({
            from: 'Sahaj Swasthya <reports@sahajswasthya.com>',
            to: [patient.email],
            subject: 'Your Medical Report is Ready',
            html,
        });

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Email send error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}