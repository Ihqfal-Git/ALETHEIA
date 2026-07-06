import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { success: false, error: 'Username atau Password salah.' },
        { status: 401 }
      );
    }

    // Set cookie sesi
    cookies().set('aletheia_session', user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
      path: '/'
    });

    return NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      username: user.username
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
