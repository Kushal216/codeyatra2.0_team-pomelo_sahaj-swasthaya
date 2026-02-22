import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';
import Doctor from '@/models/Doctor';

export async function POST(req) {
  try {
    await connectDB();
    const { patientName, phone, userId, appointmentTime, department, doctor } = await req.json();

    if (!appointmentTime || !department || !doctor) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate Doctor exists and is active
    const doctorDoc = await Doctor.findOne({ _id: doctor, isActive: true });
    if (!doctorDoc) return NextResponse.json({ error: 'Invalid doctor' }, { status: 400 });

    const slotDate = new Date(appointmentTime);
    const hour = slotDate.getHours();

    // Validate Break Time
    if (hour === 12) {
      return NextResponse.json({ error: 'Slot unavailable during break (12-1 PM)' }, { status: 400 });
    }

    // Validate Slot Capacity (Max 3 per DOCTOR per slot)
    const slotCount = await QueueToken.countDocuments({
      doctor: doctor,
      appointmentTime: slotDate,
      status: { $nin: ['Completed', 'Cancelled'] }
    });

    if (slotCount >= 3) {
      return NextResponse.json({ error: 'Slot full, please choose another time' }, { status: 400 });
    }

    // Prevent duplicate active tokens
    if (userId) {
      const activeToken = await QueueToken.findOne({ userId, status: { $nin: ['Completed', 'Cancelled'] } });
      if (activeToken) return NextResponse.json({ error: 'Active token exists', token: activeToken }, { status: 400 });
    }

    const lastToken = await QueueToken.findOne().sort({ tokenNumber: -1 });
    const newTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const token = await QueueToken.create({
      userId: userId || null,
      tokenNumber: newTokenNumber,
      patientName,
      phone,
      department,
      doctor,
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