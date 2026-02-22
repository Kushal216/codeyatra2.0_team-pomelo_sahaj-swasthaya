import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const email = searchParams.get('email');

    const filter = {};
    if (role) filter.role = role;
    if (email) filter.email = email;

    const users = await User.find(filter).select('-password');

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
