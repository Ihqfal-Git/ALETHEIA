import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export async function GET(request) {
  try {
    const sessionCookie = cookies().get('aletheia_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { success: false, error: 'Silakan login terlebih dahulu untuk mengakses riwayat.' },
        { status: 401 }
      );
    }

    const userId = sessionCookie.value;

    const riwayatList = await prisma.riwayat.findMany({
      where: {
        userId: userId,
      },
      include: {
        perangkat: true,
        kerusakan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: riwayatList,
    });
  } catch (error) {
    console.error('Gagal mengambil riwayat:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
