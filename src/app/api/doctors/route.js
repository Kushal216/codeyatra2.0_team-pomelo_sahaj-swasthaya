import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('department');

    const query = departmentId ? { department: departmentId, isActive: true } : { isActive: true };
    
    const doctors = await Doctor.find(query).populate('department', 'name');
    return NextResponse.json({ success: true, doctors });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}