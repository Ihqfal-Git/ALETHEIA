import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

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
