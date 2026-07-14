import { NextResponse } from 'next/server';
import genAI from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();

    const kerusakanId = body.kerusakanId || '';
    const kerusakan = body.kerusakan || body.namaKerusakan || '';
    const perangkat = body.perangkat || '';

    // Validasi input
    if (!kerusakanId || !kerusakan) {
      return NextResponse.json(
        { success: false, error: 'Parameter kerusakanId dan kerusakan/namaKerusakan wajib diisi.' },
        { status: 400 }
      );
    }

    // ========== STEP 1: Cek database — sudah ada referensi? ==========
    let existingRefs = [];
    try {
      existingRefs = await prisma.referensi.findMany({
        where: { kerusakanId: kerusakanId }
      });
    } catch (dbError) {
      console.warn('Gagal mengambil referensi dari DB:', dbError.message);
    }

    // Jika sudah ada di database → langsung return tanpa panggil AI
    if (existingRefs.length > 0) {
      return NextResponse.json({
        success: true,
        referensi: existingRefs,
        sumber: 'database'
      });
    }

    // ========== STEP 2: Tidak ada di DB → panggil Gemini ==========
    let referensiAI = [];

    const systemInstruction = `Kamu adalah pustakawan akademik dan teknisi elektronik. Carikan referensi yang relevan untuk kerusakan perangkat elektronik. Prioritaskan: jurnal sistem pakar, buku AI/expert system, atau panduan teknis resmi. Jawab HANYA dengan JSON array.`;

    const userPrompt = `Carikan 3 referensi akademik atau teknis yang relevan untuk kerusakan '${kerusakan}' pada '${perangkat || 'perangkat elektronik'}'.
Format JSON:
[
  {
    "judul": "...",
    "penulis": "...",
    "tahun": 2024,
    "url": "https://...",
    "relevansi": "..."
  }
]`;

    let isFallbackUsed = false;

    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('xxxx')) {
        throw new Error('API_KEY_PLACEHOLDER');
      }

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        generationConfig: { responseMimeType: 'application/json' }
      });

      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();

      // Parse JSON
      try {
        const cleanJson = responseText
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        referensiAI = JSON.parse(cleanJson);

        // Pastikan hasilnya array
        if (!Array.isArray(referensiAI)) {
          referensiAI = [referensiAI];
        }
      } catch (parseError) {
        console.warn('Gagal parse JSON referensi dari Gemini:', parseError.message);
      }
    } catch (aiError) {
      console.warn('AI Referensi generation gagal, menggunakan fallback:', aiError.message);
      isFallbackUsed = true;
    }

    // Fallback jika AI gagal
    if (referensiAI.length === 0) {
      referensiAI = [
        {
          judul: 'Kecerdasan Buatan (Teknik & Aplikasinya)',
          penulis: 'Sutojo, T., Mulyanto, E., Suhartono, V.',
          tahun: 2011,
          url: 'https://opac.perpusnas.go.id',
          relevansi: `Metode forward chaining dan certainty factor untuk diagnosa ${kerusakan}`
        },
        {
          judul: `iFixit Troubleshooting Guide: ${kerusakan}`,
          penulis: 'iFixit Community',
          tahun: 2024,
          url: 'https://www.ifixit.com',
          relevansi: `Panduan visual dan langkah-langkah perbaikan ${kerusakan}`
        },
        {
          judul: 'Expert Systems: Principles and Programming',
          penulis: 'Giarratano, J. & Riley, G.',
          tahun: 2005,
          url: 'https://www.cengage.com',
          relevansi: 'Arsitektur rule-based expert system dan knowledge base'
        }
      ];
    }

    // ========== STEP 3: Simpan hasil AI ke database ==========
    if (!isFallbackUsed) {
      try {
        const dataToInsert = referensiAI.map(ref => ({
          kerusakanId: kerusakanId,
          judul: ref.judul || 'Referensi',
          penulis: ref.penulis || null,
          tahun: ref.tahun || null,
          url: ref.url || null,
          sumber: 'ai'
        }));

        await prisma.referensi.createMany({ data: dataToInsert });
      } catch (dbError) {
        console.warn('Gagal menyimpan referensi AI ke DB:', dbError.message);
        // Tetap lanjutkan — user masih mendapat data meski tidak tersimpan
      }
    }


    // ========== STEP 4: Return referensi ==========
    // Format output agar konsisten dengan frontend (tambahkan sumber: 'ai')
    const formattedRefs = referensiAI.map(ref => ({
      judul: ref.judul,
      penulis: ref.penulis,
      tahun: ref.tahun,
      url: ref.url,
      relevansi: ref.relevansi || '',
      sumber: 'ai'
    }));

    return NextResponse.json({
      success: true,
      referensi: formattedRefs,
      sumber: 'ai'
    });

  } catch (error) {
    console.error('AI Referensi API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
