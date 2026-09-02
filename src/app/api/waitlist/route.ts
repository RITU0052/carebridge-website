import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, userType, featureInterest, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    // In a production backend, this data will be stored in Supabase, Firebase, or PostgreSQL.
    console.log('[CareBridge Waitlist Entry Received]', {
      timestamp: new Date().toISOString(),
      name,
      email,
      userType: userType || 'Caregiver',
      featureInterest: featureInterest || 'General',
      notes: notes || '',
    });

    return NextResponse.json({
      success: true,
      message: 'Waitlist entry registered successfully.',
    });
  } catch (error) {
    console.error('[Waitlist API Error]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing waitlist.' },
      { status: 500 }
    );
  }
}
