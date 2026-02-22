import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
  const user = verifyToken(req, 'staff');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { tokenId } = await req.json();

    const token = await QueueToken.findByIdAndUpdate(
      tokenId, 
      { isCheckedIn: true }, 
      { new: true }
    );

    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}