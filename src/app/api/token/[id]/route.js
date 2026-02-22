import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const token = await QueueToken.findById(id);

    if (!token) return NextResponse.json({ error: 'Token not found' }, { status: 404 });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}