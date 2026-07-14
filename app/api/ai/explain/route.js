import { NextResponse } from 'next/server';
import genAI, { getGenAI } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';
import { generateCacheHash, getCachedAIResponse, setCachedAIResponse } from '@/lib/aiCache';

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

    // Resolusi kunci cache yang konsisten
    let perangkatSlug = perangkat;
    let kerusakanId = body.kerusakanId || '';
    let sortedGejalaIds = [];

    if (riwayatId) {
      try {
        const riwayat = await prisma.riwayat.findUnique({
          where: { id: parseInt(riwayatId) },
          include: { perangkat: true }
        });
        if (riwayat) {
          if (riwayat.perangkat) perangkatSlug = riwayat.perangkat.slug;
          if (riwayat.kerusakanId) kerusakanId = riwayat.kerusakanId;
          if (riwayat.gejalaIds) {
            try {
              sortedGejalaIds = JSON.parse(riwayat.gejalaIds);
            } catch (e) {
              console.warn('Gagal parse gejalaIds dari riwayat:', e.message);
            }
          }
        }
      } catch (dbError) {
        console.warn('Gagal mengambil data riwayat untuk cache:', dbError.message);
      }
    }

    // Fallback jika tidak ada/gagal dari riwayat
    if (!perangkatSlug && perangkat) perangkatSlug = perangkat;
    if (!kerusakanId) kerusakanId = kerusakan;
    if (sortedGejalaIds.length === 0 && gejalaCocok.length > 0) {
      sortedGejalaIds = gejalaCocok;
    }

    // Generate hash cache
    const cacheHash = generateCacheHash('explain', perangkatSlug, kerusakanId, sortedGejalaIds);

    // Cek cache
    const cachedResponse = await getCachedAIResponse(cacheHash);
    if (cachedResponse) {
      if (riwayatId) {
        try {
          await prisma.riwayat.update({
            where: { id: parseInt(riwayatId) },
            data: { hasilAI: cachedResponse.penjelasan }
          });
        } catch (dbError) {
          console.warn('Gagal update riwayat dengan data cache:', dbError.message);
        }
      }

      return NextResponse.json({
        success: true,
        penjelasan: cachedResponse.penjelasan,
        explanation: cachedResponse.explanation,
        cached: true
      });
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
    let isFallbackUsed = false;

    try {
      const customKey = request.headers.get('x-gemini-api-key') || null;
      const activeKey = customKey || process.env.GEMINI_API_KEY || '';

      console.log('[AI Explain] Menggunakan API Key:', activeKey ? `${activeKey.substring(0, 8)}...` : 'KOSONG');

      if (!activeKey || activeKey.includes('xxxx')) {
        throw new Error('API_KEY_PLACEHOLDER');
      }

      const genAIInstance = getGenAI(customKey);
      const model = genAIInstance.getGenerativeModel({
        model: 'gemini-flash-latest',
        systemInstruction: systemInstruction
      });

      const result = await model.generateContent(userPrompt);
      penjelasan = result.response.text();
      console.log('[AI Explain] Sukses mendapatkan respon dari Gemini!');
    } catch (aiError) {
      console.error('[AI Explain] Gagal melakukan generate:', aiError);
      isFallbackUsed = true;

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

    const responseObj = {
      penjelasan: penjelasan,
      explanation: penjelasan
    };

    // HANYA simpan ke cache jika tidak menggunakan fallback simulasi
    if (!isFallbackUsed) {
      await setCachedAIResponse(cacheHash, 'explain', perangkatSlug, responseObj);
    }

    return NextResponse.json({
      success: true,
      ...responseObj,
      fallback: isFallbackUsed
    });

  } catch (error) {
    console.error('AI Explain API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}

