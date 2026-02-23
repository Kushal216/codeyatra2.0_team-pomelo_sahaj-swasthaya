import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function PUT(req, { params }) {
  const user = verifyToken(req, 'admin');
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;
    const { role, name, email } = await req.json();
    const updates = {};
    if (role) updates.role = role;
    if (name) updates.name = name;
    if (email) updates.email = email;
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select('-password');
    if (!updatedUser)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const user = verifyToken(req, 'admin');
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { id } = await params;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
