import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';
import MedicalReport from '@/models/MedicalReport';

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const allowed = ['status', 'stage', 'isCheckedIn'];
    const update = Object.fromEntries(
      Object.entries(body).filter(([k]) => allowed.includes(k))
    );
    if (Object.keys(update).length === 0)
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    const token = await QueueToken.findByIdAndUpdate(id, update, { new: true });
    if (!token)
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const token = await QueueToken.findById(id);
    if (!token) return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    await MedicalReport.deleteMany({ tokenNumber: token.tokenNumber });
    await QueueToken.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
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
