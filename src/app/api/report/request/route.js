import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MedicalReport from '@/models/MedicalReport';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
  const user = verifyToken(req, 'staff');
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { tokenNumber, department, reportType, notes } = await req.json();

    if (!tokenNumber || !department)
      return NextResponse.json(
        { error: 'tokenNumber and department are required' },
        { status: 400 }
      );

    const report = await MedicalReport.create({
      tokenNumber: Number(tokenNumber),
      department,
      reportType: reportType || '',
      notes: notes || '',
      status: 'pending',
      reportUrl: '',
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
