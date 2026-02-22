import { connectDB } from '@/lib/db';
import QueueToken from '@/models/QueueToken';
import User from '@/models/User';
import { resend } from '@/lib/resend';

// Helper: Add minutes to date
function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

// Helper: Skip break time (12 PM - 1 PM)
function skipBreakTime(date) {
  const hour = date.getHours();
  if (hour === 12) return addMinutes(date, 60); // Skip to 1 PM
  return date;
}

// Helper: Find next valid slot (15 min increment)
function getNextSlot(currentTime) {
  let nextTime = addMinutes(currentTime, 15);
  nextTime = skipBreakTime(nextTime);
  return nextTime;
}

export async function processPenalties() {
  try {
    await connectDB();
    const now = new Date();
    const gracePeriod = 2; // minutes

    // Find expired tokens not checked in
    const expiredTokens = await QueueToken.find({
      appointmentTime: { $lte: addMinutes(now, -gracePeriod) },
      isCheckedIn: false,
      status: { $nin: ['Completed', 'Cancelled'] }
    }).populate('userId');

    const updates = [];

    for (const token of expiredTokens) {
      const newMissedCount = token.missedCount + 1;
      let updateData = { missedCount: newMissedCount };

      if (newMissedCount >= 3) {
        // Expel
        updateData.status = 'Cancelled';
        updates.push({ id: token._id, ...updateData });
        await sendEmail(token.userId, 'Token Cancelled', 'You missed 3 appointments. Token cancelled.');
      } else {
        // Shift to next slot
        const newTime = getNextSlot(token.appointmentTime);
        updateData.appointmentTime = newTime;
        updates.push({ id: token._id, ...updateData });
        await sendEmail(
          token.userId, 
          'Appointment Shifted', 
          `You missed your slot. Shifted to ${newTime.toLocaleTimeString()}. Strike: ${newMissedCount}/3.`
        );
      }
    }

    // Bulk update
    for (const u of updates) {
      const { id, ...data } = u;
      await QueueToken.findByIdAndUpdate(id, data);
    }

    return updates;
  } catch (error) {
    console.error('Penalty Process Error:', error);
    return [];
  }
}

export async function checkInToken(tokenId) {
  await connectDB();
  return await QueueToken.findByIdAndUpdate(tokenId, { isCheckedIn: true }, { new: true });
}

async function sendEmail(user, subject, text) {
  if (user && user.email) {
    try {
      await resend.emails.send({
        from: 'Sahaj Swasthya <onboarding@resend.dev>',
        to: user.email,
        subject,
        html: `<p>${text}</p>`
      });
    } catch (e) { console.error('Email fail', e); }
  }
}