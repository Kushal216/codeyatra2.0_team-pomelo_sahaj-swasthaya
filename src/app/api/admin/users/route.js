import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  const user = verifyToken(req, 'admin');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const users = await User.find({}, '-password'); // Exclude passwords
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = verifyToken(req, 'admin');
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, email, password, phone, role, Insurance } = await req.json();

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'name, email, password and phone are required' },
        { status: 400 }
      );
    }

    // Validate role
    const allowedRoles = ['patient', 'staff', 'admin'];
    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: `role must be one of: ${allowedRoles.join(', ')}` },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'patient',
      Insurance: Insurance || '',
    });

    const { password: _, ...userData } = newUser.toObject();
    return NextResponse.json({ success: true, user: userData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
