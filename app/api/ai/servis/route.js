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

    // Generate hash cache
    const cacheHash = generateCacheHash('servis', perangkatSlug, kerusakanId, sortedGejalaIds);

    // Cek cache
    const cachedResponse = await getCachedAIResponse(cacheHash);
    if (cachedResponse) {
      if (riwayatId) {
        try {
          await prisma.riwayat.update({
            where: { id: parseInt(riwayatId) },
            data: { solusiType: 'servis', hasilAI: cachedResponse.guide }
          });
        } catch (dbError) {
          console.warn('Gagal update riwayat dengan data cache:', dbError.message);
        }
      }

      return NextResponse.json({
        success: true,
        data: cachedResponse.data,
        guide: cachedResponse.guide,
        cached: true
      });
    }

    // System + User prompt sesuai spesifikasi Phase 4
    const systemInstruction = `Kamu adalah teknisi elektronik. Berikan informasi servis dalam format JSON valid. Gunakan web search untuk harga terkini di Indonesia tahun 2024-2025. Jawab HANYA dengan JSON.`;

    const userPrompt = `Perangkat: ${perangkat || 'Elektronik'}, Kerusakan: ${kerusakan}
Berikan dalam format JSON:
{
  "estimasiBiaya": { "min": 0, "max": 0, "satuan": "Rp" },
  "komponenDiperiksa": ["..."],
  "tipsCariServis": ["..."],
  "estimasiWaktu": "..."
}`;

    let servisData = null;
    let guideMarkdown = '';
    let isFallbackUsed = false;

    try {
      const customKey = request.headers.get('x-gemini-api-key') || null;
      const activeKey = customKey || process.env.GEMINI_API_KEY || '';

      if (!activeKey || activeKey.includes('xxxx')) {
        throw new Error('API_KEY_PLACEHOLDER');
      }

      const genAIInstance = getGenAI(customKey);
      const model = genAIInstance.getGenerativeModel({
        model: 'gemini-flash-latest',
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }]
      });

      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();

      // Coba parse JSON dari respons
      try {
        // Bersihkan markdown code fence jika ada
        const cleanJson = responseText
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        servisData = JSON.parse(cleanJson);
      } catch (parseError) {
        console.warn('Gagal parse JSON dari Gemini, menggunakan teks mentah:', parseError.message);
        // Jika gagal parse, simpan sebagai markdown guide
        guideMarkdown = responseText;
      }
    } catch (aiError) {
      console.warn('AI Servis generation gagal, menggunakan fallback:', aiError.message);
      isFallbackUsed = true;
    }

    // Fallback data jika AI gagal atau belum dikonfigurasi
    if (!servisData && !guideMarkdown) {
      servisData = {
        estimasiBiaya: { min: 150000, max: 800000, satuan: 'Rp' },
        komponenDiperiksa: [
          'Komponen utama terkait kerusakan',
          'Konektor dan jalur solder pada motherboard/PCB',
          'Tegangan input/output menggunakan multimeter',
          'Kondisi fisik kapasitor dan IC regulator'
        ],
        tipsCariServis: [
          'Pilih servis yang bersedia mendiagnosa di depan Anda',
          'Minta garansi tertulis minimal 1 bulan untuk komponen yang diganti',
          'Bandingkan estimasi harga dari minimal 2 tempat servis berbeda',
          'Tanyakan apakah bisa perbaikan micro-soldering sebelum ganti total mainboard',
          'Bawa charger/adaptor original agar teknisi bisa mengecek sumber masalah'
        ],
        estimasiWaktu: '1-3 hari kerja (tergantung ketersediaan sparepart)'
      };

      guideMarkdown = `### Panduan Membawa ke Pusat Servis: ${kerusakan}

*Rekomendasi Agen AI ALETHEIA (Simulasi):*

1. **Estimasi Biaya Perbaikan**:
   - Kisaran biaya: **Rp ${servisData.estimasiBiaya.min.toLocaleString('id-ID')} – Rp ${servisData.estimasiBiaya.max.toLocaleString('id-ID')}**
   - Harga bervariasi tergantung merek, tipe perangkat, dan tingkat kerusakan.

2. **Komponen yang Akan Diperiksa Teknisi**:
${servisData.komponenDiperiksa.map(k => `   - ${k}`).join('\n')}

3. **Tips Memilih Servis Terpercaya**:
${servisData.tipsCariServis.map(t => `   - ${t}`).join('\n')}

4. **Estimasi Waktu Pengerjaan**: ${servisData.estimasiWaktu}

5. **Kelengkapan yang Harus Dibawa**:
   - Unit utama perangkat
   - Charger/adaptor original
   - Kartu garansi (jika masih berlaku)
   - Backup data penting sebelum diservis`;
    }

    // Jika berhasil parse JSON tapi belum ada guideMarkdown, buat dari data
    if (servisData && !guideMarkdown) {
      guideMarkdown = `### Panduan Servis: ${kerusakan}

**Estimasi Biaya**: ${servisData.estimasiBiaya.satuan} ${servisData.estimasiBiaya.min.toLocaleString('id-ID')} – ${servisData.estimasiBiaya.satuan} ${servisData.estimasiBiaya.max.toLocaleString('id-ID')}

**Komponen yang Diperiksa**:
${servisData.komponenDiperiksa.map(k => `- ${k}`).join('\n')}

**Tips Mencari Servis**:
${servisData.tipsCariServis.map(t => `- ${t}`).join('\n')}

**Estimasi Waktu**: ${servisData.estimasiWaktu}`;
    }

    // Update riwayat di database
    if (riwayatId) {
      try {
        await prisma.riwayat.update({
          where: { id: parseInt(riwayatId) },
          data: { solusiType: 'servis', hasilAI: guideMarkdown }
        });
      } catch (dbError) {
        console.warn('Gagal update riwayat:', dbError.message);
      }
    }

    const responseObj = {
      data: servisData,
      guide: guideMarkdown
    };

    // HANYA simpan ke cache jika tidak menggunakan fallback simulasi
    if (!isFallbackUsed) {
      await setCachedAIResponse(cacheHash, 'servis', perangkatSlug, responseObj);
    }

    return NextResponse.json({
      success: true,
      ...responseObj,
      fallback: isFallbackUsed
    });

  } catch (error) {
    console.error('AI Servis API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}

