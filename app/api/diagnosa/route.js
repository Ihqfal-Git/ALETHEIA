import { NextResponse } from 'next/server';
import { diagnosa } from '@/lib/ruleEngine';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const perangkat = body.perangkat || body.perangkatSlug;
    const gejalaIds = body.gejalaIds || body.selectedGejalaIds;
    const gejalaTambahan = body.gejalaTambahan;
    const userId = body.userId;

    // Validasi input dasar
    if (!perangkat || !gejalaIds || !Array.isArray(gejalaIds)) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', received: body },
        { status: 400 }
      );
    }

    // Jalankan sistem pakar / rule engine
    const hasilDiagnosa = diagnosa(perangkat, gejalaIds);

    // Ambil record perangkat dari database untuk properti relasi
    let perangkatRecord = null;
    try {
      perangkatRecord = await prisma.perangkat.findUnique({
        where: { slug: perangkat },
      });
    } catch (dbError) {
      console.error("Gagal membaca dari DB:", dbError);
    }

    // Lanjutkan meski DB error agar core logic tetap jalan (fallback)
    if (!perangkatRecord) {
      console.warn("Perangkat tidak ditemukan atau DB error, melanjutkan tanpa menyimpan id perangkat asli.");
      perangkatRecord = { id: 0 }; // dummy id agar tidak error saat create riwayat, meskipun create riwayat juga di try/catch
    }

    // Jika ada diagnosa yang cocok, ambil kerusakan tertinggi
    // (Misal rule ID = L001, maka kerusakan ID = K-L001 seperti format di seed.js)
    let kerusakanId = null;
    if (hasilDiagnosa.length > 0) {
      kerusakanId = `K-${hasilDiagnosa[0].ruleId}`;
    }

    // 3. Simpan riwayat ke database dengan status default 'proses'
    let riwayatId = null;
    try {
      const riwayat = await prisma.riwayat.create({
        data: {
          userId: userId,
          perangkatId: perangkatRecord.id,
          kerusakanId: kerusakanId,
          gejalaIds: JSON.stringify(gejalaIds), // Simpan array ID menjadi string JSON
          status: 'proses',
          hasilAI: gejalaTambahan ? `Keluhan tambahan: ${gejalaTambahan}` : null
        },
      });
      riwayatId = riwayat.id;
    } catch (dbError) {
      console.error("Gagal menyimpan riwayat ke DB (pastikan kredensial benar):", dbError);
      // Lanjutkan saja tanpa error agar user tetap mendapat hasil diagnosa
    }

    // Jika tidak ada diagnosa yang lolos threshold (CF > 0.3)
    if (hasilDiagnosa.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Tidak ditemukan kerusakan yang cocok dengan gejala tersebut.',
        riwayatId: riwayatId
      });
    }

    // Return response suskes dengan array diagnosa terurut
    // Mengembalikan 'diagnosa' sesuai spesifikasi, dan 'hasil' sesuai dengan apa yang diharapkan Frontend
    return NextResponse.json({
      success: true,
      diagnosa: hasilDiagnosa,
      hasil: hasilDiagnosa, // <-- Tambahan agar kompatibel dengan frontend
      totalGejala: gejalaIds.length,
      perangkat: perangkat,
      riwayatId: riwayatId
    });
  } catch (error) {
    console.error('Error in Diagnosa Route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
