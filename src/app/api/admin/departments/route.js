import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Department from '@/models/Department';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  const user = verifyToken(req, 'admin');
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const departments = await Department.find();
    return NextResponse.json({ success: true, departments });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const user = verifyToken(req, 'admin');
  if (!user) return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });

  try {
    await connectDB();
    const { name, description } = await req.json();
    const dept = await Department.create({ name, description });
    return NextResponse.json({ success: true, department: dept }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}