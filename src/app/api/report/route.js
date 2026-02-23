import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MedicalReport from '@/models/MedicalReport';
import Prescription from '@/models/Prescription';
import QueueToken from '@/models/QueueToken';

/**
 * GET /api/report?userId=<id>
 * Returns a unified list of MedicalReports + Prescriptions for a patient,
 * normalised to { _id, type, title, date, status, department, reportUrl? }
 */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query param is required' },
        { status: 400 }
      );
    }

    // 1. Find all token numbers that belong to this user
    const userTokens = await QueueToken.find({ userId })
      .select('tokenNumber')
      .lean();
    const tokenNumbers = userTokens.map((t) => t.tokenNumber);

    // 2. Fetch MedicalReports linked to those tokens
    const rawReports = tokenNumbers.length
      ? await MedicalReport.find({ tokenNumber: { $in: tokenNumbers } })
          .sort({ createdAt: -1 })
          .lean()
      : [];

    // 3. Fetch Prescriptions directly (they store userId)
    const rawPrescriptions = await Prescription.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // 4. Normalise MedicalReports
    const reports = rawReports.map((r) => ({
      _id: r._id,
      type: r.reportType || 'Lab',
      title: r.department ? `${r.department} Report` : 'Medical Report',
      date: r.createdAt,
      status:
        r.status === 'uploaded' || r.status === 'reviewed'
          ? 'Available'
          : 'Pending',
      department: r.department,
      notes: r.notes || '',
      reportUrl: r.reportUrl || null,
    }));

    // 5. Normalise Prescriptions
    const prescriptions = rawPrescriptions.map((p) => ({
      _id: p._id,
      type: 'Prescription',
      title: p.diagnosis || `${p.department} Prescription`,
      date: p.createdAt,
      status: 'Available',
      department: p.department,
      doctorName: p.doctorName,
      medicines: p.medicines,
      advice: p.advice,
      followUpDate: p.followUpDate,
      diagnosis: p.diagnosis,
    }));

    return NextResponse.json({
      success: true,
      reports: [...prescriptions, ...reports],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
