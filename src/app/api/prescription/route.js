import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Prescription from '@/models/Prescription';
import QueueToken from '@/models/QueueToken';
import { verifyToken } from '@/lib/auth';

// GET /api/prescription?userId=<id>   → patient's prescription history
// GET /api/prescription?tokenNumber=<n> → prescriptions for a specific visit
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const tokenNumber = searchParams.get('tokenNumber');

        const filter = {};
        if (userId) filter.userId = userId;
        if (tokenNumber) filter.tokenNumber = Number(tokenNumber);

        if (!userId && !tokenNumber) {
            return NextResponse.json(
                { error: 'Provide userId or tokenNumber' },
                { status: 400 }
            );
        }

        const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, prescriptions });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST /api/prescription  → staff creates a prescription
export async function POST(req) {
    const staffUser = verifyToken(req, 'staff');
    if (!staffUser)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const body = await req.json();
        const { tokenNumber, doctorName, department, diagnosis, medicines, advice, followUpDate } = body;

        if (!tokenNumber || !doctorName || !department || !diagnosis) {
            return NextResponse.json(
                { error: 'tokenNumber, doctorName, department and diagnosis are required' },
                { status: 400 }
            );
        }

        // Resolve userId from the token
        const queueToken = await QueueToken.findOne({ tokenNumber });
        if (!queueToken) {
            return NextResponse.json({ error: 'Token not found' }, { status: 404 });
        }

        const prescription = await Prescription.create({
            tokenNumber,
            userId: queueToken.userId,
            doctorName,
            department,
            diagnosis,
            medicines: medicines || [],
            advice: advice || '',
            followUpDate: followUpDate || null,
        });

        return NextResponse.json({ success: true, prescription }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
