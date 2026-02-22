import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    // Find active token for this user
    const token = await QueueToken.findOne({ userId, status: { $ne: 'Completed' } }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true,  token });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}