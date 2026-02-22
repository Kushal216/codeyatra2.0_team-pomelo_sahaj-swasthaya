import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const user = verifyToken(req, 'admin');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const doctors = await Doctor.find().populate('department', 'name');
    return NextResponse.json({ success: true, doctors });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const user = verifyToken(req, 'admin');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { name, department, specialization } = await req.json();
    const doctor = await Doctor.create({ name, department, specialization });
    return NextResponse.json({ success: true, doctor: doctor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}