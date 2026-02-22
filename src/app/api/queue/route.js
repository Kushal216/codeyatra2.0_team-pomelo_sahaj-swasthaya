import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';
import { verifyToken } from '@/lib/auth';
import { processPenalties } from '@/lib/queueLogic';

export async function GET(req) {
  const user = verifyToken(req, 'staff');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    
    // 1. Run Penalty Logic
    await processPenalties();

    // 2. Fetch Active Queue (Populate Dept & Doctor)
    const queue = await QueueToken.find({ status: { $nin: ['Completed', 'Cancelled'] } })
      .populate('userId', 'name insured')
      .populate('department', 'name')
      .populate('doctor', 'name')
      .sort({ appointmentTime: 1 });
      
    return NextResponse.json({ success: true, queue });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}