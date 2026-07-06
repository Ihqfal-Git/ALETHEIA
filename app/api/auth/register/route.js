import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username minimal 3 karakter.' },
        { status: 400 }
      );
    }

    // Periksa apakah username sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username sudah digunakan.' },
        { status: 400 }
      );
    }

    // Hash password & simpan user baru
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        password: hashedPassword
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil. Silakan login.',
      user: { id: user.id, username: user.username }
    });

  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
