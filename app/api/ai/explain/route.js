import { NextResponse } from 'next/server';
import genAI from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();

    // Mendukung format input dari spesifikasi Phase 4 DAN format frontend existing
    const perangkat = body.perangkat || '';
    const kerusakan = body.kerusakan || body.namaKerusakan || '';
    const deskripsi = body.deskripsi || body.deskripsiKerusakan || '';
    const gejalaCocok = body.gejalaCocok || body.gejalaList || [];
    const riwayatId = body.riwayatId || null;

    // Validasi input
    if (!kerusakan) {
      return NextResponse.json(
        { success: false, error: 'Parameter kerusakan wajib diisi.' },
        { status: 400 }
      );
    }

    const gejalaFormatted = gejalaCocok.length > 0
      ? gejalaCocok.map(g => `- ${g}`).join('\n')
      : 'Gejala tidak disebutkan secara spesifik.';

    // System + User prompt sesuai spesifikasi Phase 4
    const systemInstruction = `Kamu adalah teknisi elektronik berpengalaman. Jelaskan penyebab kerusakan secara teknis tapi mudah dipahami orang awam. Gunakan Bahasa Indonesia. Maksimal 3 paragraf. Jangan bertele-tele.`;

    const userPrompt = `Perangkat: ${perangkat || 'Elektronik'}
Kerusakan: ${kerusakan}
${deskripsi ? `Deskripsi: ${deskripsi}` : ''}
Gejala yang dialami:
${gejalaFormatted}

Jelaskan kenapa kerusakan ini bisa terjadi.`;

    let penjelasan = '';

    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('xxxx')) {
        throw new Error('API_KEY_PLACEHOLDER');
      }

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: systemInstruction
      });

      const result = await model.generateContent(userPrompt);
      penjelasan = result.response.text();
    } catch (aiError) {
      console.warn('AI Explain generation gagal, menggunakan fallback:', aiError.message);

      // Fallback simulasi jika API key belum dikonfigurasi
      penjelasan = `### Analisis Teknis: ${kerusakan}

Kerusakan "${kerusakan}" pada ${perangkat || 'perangkat elektronik'} umumnya disebabkan oleh degradasi komponen internal akibat pemakaian jangka panjang atau faktor eksternal seperti lonjakan tegangan listrik (power surge). Ketika komponen regulator daya atau sirkuit terintegrasi (IC) mengalami penurunan performa, aliran arus menjadi tidak stabil sehingga memicu gejala-gejala yang Anda alami.

Secara teknis, solder joint (titik sambungan timah) pada PCB (Printed Circuit Board) bisa mengalami retak mikro akibat siklus pemanasan-pendinginan berulang (thermal cycling). Hal ini menyebabkan koneksi listrik terputus-putus yang berdampak pada kinerja perangkat secara keseluruhan — mulai dari mati mendadak hingga kegagalan boot.

Disarankan untuk segera melakukan pemeriksaan menggunakan multimeter pada jalur tegangan utama, atau membawa perangkat ke teknisi profesional untuk diagnosa lebih lanjut sebelum kerusakan menyebar ke komponen lain yang masih berfungsi normal.`;
    }

    // Update riwayat di database jika riwayatId tersedia
    if (riwayatId) {
      try {
        await prisma.riwayat.update({
          where: { id: parseInt(riwayatId) },
          data: { hasilAI: penjelasan }
        });
      } catch (dbError) {
        console.warn('Gagal update riwayat:', dbError.message);
      }
    }

    return NextResponse.json({
      success: true,
      penjelasan: penjelasan,
      explanation: penjelasan  // backward compat dengan HasilDiagnosa.jsx
    });

  } catch (error) {
    console.error('AI Explain API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
