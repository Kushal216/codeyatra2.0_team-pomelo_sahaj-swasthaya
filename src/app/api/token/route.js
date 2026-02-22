import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';

export async function POST(req) {
  try {
    await connectDB();
    const { patientName, phone, userId, appointmentTime } = await req.json();

    if (!appointmentTime) {
      return NextResponse.json({ error: 'Appointment time required' }, { status: 400 });
    }

    const slotDate = new Date(appointmentTime);
    const hour = slotDate.getHours();

    // 1. Validate Break Time (12:00 PM - 1:00 PM)
    if (hour === 12) {
      return NextResponse.json({ error: 'Slot unavailable during break (12-1 PM)' }, { status: 400 });
    }

    // 2. Validate Slot Capacity (Max 3 per slot)
    const slotCount = await QueueToken.countDocuments({
      appointmentTime: slotDate,
      status: { $nin: ['Completed', 'Cancelled'] }
    });

    if (slotCount >= 3) {
      return NextResponse.json({ error: 'Slot full, please choose another time' }, { status: 400 });
    }

    // 3. Prevent duplicate active tokens for logged-in users
    if (userId) {
      const activeToken = await QueueToken.findOne({ userId, status: { $nin: ['Completed', 'Cancelled'] } });
      if (activeToken) return NextResponse.json({ error: 'Active token exists', token: activeToken }, { status: 400 });
    }

    // 4. Auto-increment token number
    const lastToken = await QueueToken.findOne().sort({ tokenNumber: -1 });
    const newTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const token = await QueueToken.create({
      userId: userId || null,
      tokenNumber: newTokenNumber,
      patientName,
      phone,
      appointmentTime: slotDate,
      missedCount: 0,
      isCheckedIn: false,
      stage: 'Registration',
      status: 'Waiting'
    });

    return NextResponse.json({ success: true, token }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}