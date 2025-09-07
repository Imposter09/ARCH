import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const client = await clientPromise;
    const db = client.db('data');
    const users = db.collection('user_admin');

    // Find user with matching username and password
    const user = await users.findOne({ username, password });

    if (user) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}