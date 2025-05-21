import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, guess, message } = await request.json();

    const response = await fetch('http://localhost:3001/api/guesses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, guess, message }),
    });

    const stats = await response.json();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save guess' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch('http://localhost:3001/api/guesses');
    const stats = await response.json();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}