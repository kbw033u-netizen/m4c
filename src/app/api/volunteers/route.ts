import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { fullName, phoneNumber, county, interest, email } = body;

    if (!fullName || !phoneNumber || !county || !interest) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log volunteer data (replace with actual database insertion)
    console.log('New volunteer registration:', {
      fullName,
      phoneNumber,
      county,
      interest,
      email,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with database or WhatsApp API here
    // For now, just acknowledge the submission

    return NextResponse.json(
      {
        message: '✓ Thank you! Welcome to M4C. Check your WhatsApp for next steps!',
        data: {
          fullName,
          phoneNumber,
          county,
          interest,
          email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing volunteer registration:', error);
    return NextResponse.json(
      { message: 'Failed to register. Please try again.' },
      { status: 500 }
    );
  }
}
