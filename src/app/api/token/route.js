import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';

export async function POST(req) {
  try {
    await connectDB();
    const { patientName, phone, userId } = await req.json();

    // Check if user already has an active token
    const activeToken = await QueueToken.findOne({ userId, status: { $ne: 'Completed' } });
    if (activeToken) return NextResponse.json({ error: 'Active token exists',  activeToken }, { status: 400 });

    const lastToken = await QueueToken.findOne().sort({ tokenNumber: -1 });
    const newTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const token = await QueueToken.create({
      userId: userId || null,
      tokenNumber: newTokenNumber,
      patientName,
      phone,
      stage: 'Registration',
      status: 'Waiting'
    });

    return NextResponse.json({ success: true,  token }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}