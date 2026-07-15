import { rules } from '@/data/rules/index';

export function diagnosa(perangkat, gejalaInputIds) {
  // 1. Filter rules berdasarkan perangkat
  const filteredRules = rules.filter((r) => r.perangkat === perangkat);

  const hasilDiagnosa = [];

  // 2. Hitung CF untuk setiap rule
  for (const rule of filteredRules) {
    // Cari irisan antara input pengguna dengan aturan gejala
    const gejalaCocok = rule.gejalaIds.filter((id) => gejalaInputIds.includes(id));

    if (gejalaCocok.length > 0) {
      // Hitung proporsi kecocokan gejala dengan softer penalty (square root)
      // CF = certaintyFactor * √(jumlah gejala cocok / total gejala rule)
      // Square root membuat kecocokan parsial tetap mendapat bobot tinggi
      const proporsi = gejalaCocok.length / rule.gejalaIds.length;
      const cfAkhir = rule.certaintyFactor * Math.sqrt(proporsi);

      // 3. Filter rules dengan CF > 0.3
      if (cfAkhir > 0.3) {
        hasilDiagnosa.push({
          ruleId: rule.id,
          // Format nested object agar kompatibel dengan komponen HasilDiagnosa.jsx
          kerusakan: {
            id: rule.id,
            nama: rule.kerusakan,
            deskripsi: rule.deskripsi
          },
          certaintyFactor: parseFloat(cfAkhir.toFixed(3)),
          persentase: Math.round(cfAkhir * 100),
          gejalaCocok: gejalaCocok,
          referensiStatis: rule.referensiStatis || []
        });
      }
    }
  }

  // 4. Sort by CF descending (dari yang paling yakin/tinggi)
  hasilDiagnosa.sort((a, b) => b.certaintyFactor - a.certaintyFactor);

  // 5. Return array hasil diagnosa
  return hasilDiagnosa;
}
