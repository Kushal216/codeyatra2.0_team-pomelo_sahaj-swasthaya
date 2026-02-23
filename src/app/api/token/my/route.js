import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId)
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );

    // Resolve to a MongoDB ObjectId — accept either an _id or an email
    let resolvedId;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      resolvedId = userId;
    } else {
      const user = await User.findOne({ email: userId }, '_id');
      if (!user)
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      resolvedId = user._id;
    }

    const token = await QueueToken.findOne({
      userId: resolvedId,
      status: { $nin: ['Completed', 'Cancelled'] },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
