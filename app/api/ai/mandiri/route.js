import { NextResponse } from 'next/server';
import genAI from '@/lib/gemini';
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
    const cacheHash = generateCacheHash('mandiri', perangkatSlug, kerusakanId, sortedGejalaIds);

    // Cek cache
    const cachedResponse = await getCachedAIResponse(cacheHash);
    if (cachedResponse) {
      if (riwayatId) {
        try {
          await prisma.riwayat.update({
            where: { id: parseInt(riwayatId) },
            data: { solusiType: 'mandiri', hasilAI: cachedResponse.guide }
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
    const systemInstruction = `Kamu adalah teknisi elektronik. Berikan panduan perbaikan mandiri dalam format JSON valid. Gunakan web search untuk harga sparepart terkini di Indonesia. Jawab HANYA dengan JSON.`;

    const userPrompt = `Perangkat: ${perangkat || 'Elektronik'}, Kerusakan: ${kerusakan}
Berikan dalam format JSON:
{
  "alat": [{ "nama": "...", "fungsi": "..." }],
  "bahan": [{ "nama": "...", "estimasiHarga": "..." }],
  "langkah": [{ "nomor": 1, "judul": "...", "detail": "..." }],
  "estimasiBiayaTotal": { "min": 0, "max": 0, "satuan": "Rp" },
  "estimasiWaktu": "...",
  "tingkatKesulitan": "Mudah | Menengah | Sulit",
  "peringatan": ["..."]
}`;

    let mandiriData = null;
    let guideMarkdown = '';
    let isFallbackUsed = false;

    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('xxxx')) {
        throw new Error('API_KEY_PLACEHOLDER');
      }

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }]
      });

      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();

      // Coba parse JSON dari respons
      try {
        const cleanJson = responseText
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        mandiriData = JSON.parse(cleanJson);
      } catch (parseError) {
        console.warn('Gagal parse JSON dari Gemini, menggunakan teks mentah:', parseError.message);
        guideMarkdown = responseText;
      }
    } catch (aiError) {
      console.warn('AI Mandiri generation gagal, menggunakan fallback:', aiError.message);
      isFallbackUsed = true;
    }

    // Fallback data jika AI gagal atau belum dikonfigurasi
    if (!mandiriData && !guideMarkdown) {
      mandiriData = {
        alat: [
          { nama: 'Obeng presisi set (Phillips #0, #1)', fungsi: 'Membuka sekrup casing dan komponen internal' },
          { nama: 'Spudger plastik / opening tool', fungsi: 'Mencongkel dan melepas konektor tanpa merusak PCB' },
          { nama: 'Multimeter digital', fungsi: 'Mengukur tegangan dan kontinuitas jalur sirkuit' },
          { nama: 'Kuas anti-statis halus', fungsi: 'Membersihkan debu pada komponen sensitif' },
          { nama: 'ESD wrist strap (gelang anti-statis)', fungsi: 'Mencegah kerusakan komponen akibat listrik statis tubuh' }
        ],
        bahan: [
          { nama: 'Isopropyl Alcohol (IPA) 90%+', estimasiHarga: 'Rp 15.000 - Rp 35.000' },
          { nama: 'Thermal paste (Arctic MX-4 atau sejenis)', estimasiHarga: 'Rp 25.000 - Rp 85.000' },
          { nama: 'Kain microfiber bersih', estimasiHarga: 'Rp 5.000 - Rp 15.000' },
          { nama: 'Penghapus pensil putih (untuk pin RAM/kontak)', estimasiHarga: 'Rp 3.000 - Rp 5.000' }
        ],
        langkah: [
          { nomor: 1, judul: 'Matikan dan Lepas Semua Sumber Daya', detail: 'Matikan perangkat sepenuhnya. Cabut charger/kabel power dan lepas baterai (jika bisa dilepas). Tekan tombol power selama 15 detik untuk mengosongkan sisa muatan listrik.' },
          { nomor: 2, judul: 'Buka Casing dengan Hati-hati', detail: 'Gunakan obeng presisi untuk melepas sekrup casing. Gunakan spudger plastik untuk mencongkel clip pengunci casing. Jangan gunakan alat logam yang bisa merusak atau menyebabkan short circuit.' },
          { nomor: 3, judul: 'Identifikasi Komponen Bermasalah', detail: 'Periksa visual terlebih dahulu — cari tanda hangus, kapasitor kembung, kabel putus, atau korosi. Gunakan multimeter untuk mengecek tegangan pada titik-titik kritis sesuai skema servis.' },
          { nomor: 4, judul: 'Bersihkan Komponen Kontak', detail: 'Lepas modul RAM, kartu WiFi, atau konektor yang bisa dilepas. Bersihkan pin kontak menggunakan penghapus pensil putih, lalu lap dengan kain microfiber yang diberi sedikit IPA.' },
          { nomor: 5, judul: 'Rakit Kembali dan Uji Coba', detail: 'Pasang kembali semua komponen dengan posisi yang benar hingga terkunci sempurna. Pasang baterai dan casing. Sambungkan to power dan nyalakan perangkat untuk menguji hasil perbaikan.' }
        ],
        estimasiBiayaTotal: { min: 20000, max: 150000, satuan: 'Rp' },
        estimasiWaktu: '30 menit - 2 jam',
        tingkatKesulitan: 'Menengah',
        peringatan: [
          'JANGAN buka perangkat jika masih dalam garansi resmi — garansi bisa hangus',
          'Jika tercium bau terbakar atau terlihat cairan baterai bocor, HENTIKAN dan bawa ke teknisi profesional',
          'Selalu gunakan gelang anti-statis (ESD strap) saat menyentuh PCB/motherboard',
          'Jangan paksa membuka konektor — jika macet, cari sudut yang benar terlebih dahulu'
        ]
      };

      guideMarkdown = `> [!WARNING]
> **PERINGATAN KESELAMATAN**: Pastikan semua sumber daya sudah dilepas sebelum menyentuh komponen internal. Gunakan gelang anti-statis (ESD wrist strap) untuk mencegah kerusakan akibat listrik statis.

### Panduan Perbaikan Mandiri: ${kerusakan}

*Instruksi Agen AI ALETHEIA (Simulasi):*

**Tingkat Kesulitan**: ${mandiriData.tingkatKesulitan}
**Estimasi Waktu**: ${mandiriData.estimasiWaktu}
**Estimasi Biaya Material**: Rp ${mandiriData.estimasiBiayaTotal.min.toLocaleString('id-ID')} – Rp ${mandiriData.estimasiBiayaTotal.max.toLocaleString('id-ID')}

#### Peralatan yang Dibutuhkan:
${mandiriData.alat.map(a => `- **${a.nama}** — ${a.fungsi}`).join('\n')}

#### Bahan yang Diperlukan:
${mandiriData.bahan.map(b => `- **${b.nama}** (${b.estimasiHarga})`).join('\n')}

#### Langkah-langkah Perbaikan:
${mandiriData.langkah.map(l => `${l.nomor}. **${l.judul}**: ${l.detail}`).join('\n')}

#### ⚠️ Peringatan Penting:
${mandiriData.peringatan.map(p => `- ${p}`).join('\n')}`;
    }

    // Jika berhasil parse JSON tapi belum ada guideMarkdown, buat dari data
    if (mandiriData && !guideMarkdown) {
      guideMarkdown = `### Panduan Perbaikan Mandiri: ${kerusakan}

**Tingkat Kesulitan**: ${mandiriData.tingkatKesulitan}
**Estimasi Waktu**: ${mandiriData.estimasiWaktu}
**Estimasi Biaya Material**: ${mandiriData.estimasiBiayaTotal.satuan} ${mandiriData.estimasiBiayaTotal.min.toLocaleString('id-ID')} – ${mandiriData.estimasiBiayaTotal.satuan} ${mandiriData.estimasiBiayaTotal.max.toLocaleString('id-ID')}

#### Peralatan:
${mandiriData.alat.map(a => `- **${a.nama}** — ${a.fungsi}`).join('\n')}

#### Bahan:
${mandiriData.bahan.map(b => `- **${b.nama}** (${b.estimasiHarga})`).join('\n')}

#### Langkah Perbaikan:
${mandiriData.langkah.map(l => `${l.nomor}. **${l.judul}**: ${l.detail}`).join('\n')}

#### Peringatan:
${mandiriData.peringatan.map(p => `- ⚠️ ${p}`).join('\n')}`;
    }

    // Update riwayat di database
    if (riwayatId) {
      try {
        await prisma.riwayat.update({
          where: { id: parseInt(riwayatId) },
          data: { solusiType: 'mandiri', hasilAI: guideMarkdown }
        });
      } catch (dbError) {
        console.warn('Gagal update riwayat:', dbError.message);
      }
    }

    const responseObj = {
      data: mandiriData,
      guide: guideMarkdown
    };

    // HANYA simpan ke cache jika tidak menggunakan fallback simulasi
    if (!isFallbackUsed) {
      await setCachedAIResponse(cacheHash, 'mandiri', perangkatSlug, responseObj);
    }

    return NextResponse.json({
      success: true,
      ...responseObj
    });

  } catch (error) {
    console.error('AI Mandiri API error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}

