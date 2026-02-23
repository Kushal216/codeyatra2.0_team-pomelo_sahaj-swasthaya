import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MedicalReport from '@/models/MedicalReport';
import QueueToken from '@/models/QueueToken';
import { verifyToken } from '@/lib/auth';
import { resend } from '@/lib/resend';

export async function GET() {
  try {
    await connectDB();
    const reports = await MedicalReport.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const user = verifyToken(req, 'staff');
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { tokenNumber, reportUrl, department } = await req.json();

    // 1. Save Report
    const report = await MedicalReport.create({
      tokenNumber,
      reportUrl,
      department,
    });

    // 2. Find Patient Email via Token
    const queueToken = await QueueToken.findOne({ tokenNumber }).populate(
      'userId'
    );

    // 3. Send Email Notification
    if (queueToken && queueToken.userId && queueToken.userId.email) {
      await resend.emails.send({
        from: 'Sahaj Swasthya <onboarding@resend.dev>',
        to: queueToken.userId.email,
        subject: `Lab Report Ready: Token #${tokenNumber}`,
        html: `
          <p>Hello ${queueToken.userId.name},</p>
          <p>Your lab report for <strong>${department}</strong> is ready.</p>
          <p><a href="${reportUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Download Report</a></p>
          <p>Thank you for using Sahaj Swasthya.</p>
        `,
      });
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
