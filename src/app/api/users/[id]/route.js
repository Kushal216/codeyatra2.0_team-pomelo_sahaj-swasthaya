import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Try matching by _id (if valid ObjectId) or email
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const user = await User.findOne(
      isObjectId ? { $or: [{ _id: id }, { email: id }] } : { email: id },
      '-password'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
