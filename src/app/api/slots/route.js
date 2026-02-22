import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) return NextResponse.json({ error: 'Doctor ID required' }, { status: 400 });

    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59`);

    const slots = [];
    const startHour = 10;
    const endHour = 17;

    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 12) continue; // Skip break

        const slotTime = new Date(`${dateStr}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`);
        
        // Count bookings for THIS DOCTOR at this time
        const count = await QueueToken.countDocuments({
          doctor: doctorId,
          appointmentTime: slotTime,
          status: { $nin: ['Completed', 'Cancelled'] }
        });

        slots.push({
          time: slotTime.toISOString(),
          display: `${h > 12 ? h - 12 : h}:${m === 0 ? '00' : m} ${h >= 12 ? 'PM' : 'AM'}`,
          available: count < 3,
          booked: count
        });
      }
    }

    return NextResponse.json({ success: true, slots });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}