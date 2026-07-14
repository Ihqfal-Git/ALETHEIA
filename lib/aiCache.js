import { prisma } from './prisma';
import crypto from 'crypto';

/**
 * Membuat SHA-256 hash dari data input untuk dijadikan kunci cache unik.
 * Mengurutkan gejalaIds agar urutan pemilihan gejala tidak memengaruhi hit rate cache.
 * 
 * @param {string} type - Tipe request ('explain', 'mandiri', 'servis')
 * @param {string} perangkat - Nama atau slug perangkat (e.g. 'hp')
 * @param {string} kerusakanId - ID Kerusakan (e.g. 'K-L001')
 * @param {Array<string>} gejalaIds - Array ID gejala
 * @returns {string} SHA-256 hash (64 karakter hex)
 */
export function generateCacheHash(type, perangkat, kerusakanId, gejalaIds) {
  const cleanType = (type || '').trim().toLowerCase();
  const cleanPerangkat = (perangkat || '').trim().toLowerCase();
  const cleanKerusakanId = (kerusakanId || '').trim();
  const sortedGejala = Array.isArray(gejalaIds) ? [...gejalaIds].sort() : [];

  const inputStr = `${cleanType}:${cleanPerangkat}:${cleanKerusakanId}:${JSON.stringify(sortedGejala)}`;
  return crypto.createHash('sha256').update(inputStr).digest('hex');
}

/**
 * Mencari data cache di database berdasarkan hash.
 * 
 * @param {string} hash - SHA-256 hash
 * @returns {Promise<any|null>} Respon yang di-cache (ter-parse) atau null jika miss
 */
export async function getCachedAIResponse(hash) {
  try {
    const cacheEntry = await prisma.aICache.findUnique({
      where: { hash }
    });
    if (cacheEntry) {
      console.log(`[AICache] HIT untuk hash ${hash}`);
      return JSON.parse(cacheEntry.response);
    }
  } catch (error) {
    console.warn(`[AICache] Gagal membaca cache dari DB untuk hash ${hash}:`, error.message);
  }
  return null;
}

/**
 * Menyimpan respon AI ke cache database.
 * 
 * @param {string} hash - SHA-256 hash
 * @param {string} type - Tipe request ('explain', 'mandiri', 'servis')
 * @param {string} perangkat - Nama atau slug perangkat
 * @param {any} responseObj - Objek respon yang akan disimpan (akan di-stringify)
 */
export async function setCachedAIResponse(hash, type, perangkat, responseObj) {
  try {
    const cleanType = (type || '').trim().toLowerCase();
    const cleanPerangkat = (perangkat || '').trim().toLowerCase();

    await prisma.aICache.upsert({
      where: { hash },
      update: {
        response: JSON.stringify(responseObj),
        createdAt: new Date()
      },
      create: {
        hash,
        type: cleanType,
        perangkat: cleanPerangkat,
        response: JSON.stringify(responseObj)
      }
    });
    console.log(`[AICache] SAVED untuk hash ${hash} (${type})`);
  } catch (error) {
    console.warn(`[AICache] Gagal menyimpan cache ke DB untuk hash ${hash}:`, error.message);
  }
}
