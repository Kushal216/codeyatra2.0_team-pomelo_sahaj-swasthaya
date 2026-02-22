import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Department from '@/models/Department';

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find();
    return NextResponse.json({ success: true, departments });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}