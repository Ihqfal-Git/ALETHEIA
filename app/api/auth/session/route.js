import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sessionCookie = cookies().get('aletheia_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({
        success: true,
        isLoggedIn: false
      });
    }

    const username = sessionCookie.value;

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        isLoggedIn: false
      });
    }

    return NextResponse.json({
      success: true,
      isLoggedIn: true,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Session API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
