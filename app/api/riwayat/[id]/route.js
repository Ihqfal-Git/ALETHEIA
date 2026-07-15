import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const riwayat = await prisma.riwayat.findUnique({
      where: { id: id },
      include: {
        perangkat: true,
        kerusakan: true,
      },
    });

    if (!riwayat) {
      return NextResponse.json({ success: false, error: 'Riwayat tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: riwayat });
  } catch (error) {
    console.error('Error fetching riwayat:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail riwayat.', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status, solusiType, progressLangkah } = body;

    // Bangun object data dinamis
    const dataToUpdate = {};
    if (status !== undefined) {
      dataToUpdate.status = status;
    }
    if (solusiType !== undefined) {
      dataToUpdate.solusiType = solusiType;
    }
    if (progressLangkah !== undefined) {
      dataToUpdate.progressLangkah = progressLangkah;
    }

    const updatedRiwayat = await prisma.riwayat.update({
      where: { id: id },
      data: dataToUpdate,
      include: {
        perangkat: true,
        kerusakan: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedRiwayat
    });
  } catch (error) {
    console.error('Error patching riwayat:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui data riwayat.', details: error.message },
      { status: 500 }
    );
  }
}
