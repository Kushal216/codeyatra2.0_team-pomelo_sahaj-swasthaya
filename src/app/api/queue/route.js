// gets all active queue
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const user = verifyToken(req, 'staff');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    // Fetch active tokens, populate user info for insurance status
    const queue = await QueueToken.find({ status: { $ne: 'Completed' } })
      .populate('userId', 'name insurance')
      .sort({ createdAt: 1 });
      
    return NextResponse.json({ success: true, queue });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
