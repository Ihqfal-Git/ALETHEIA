const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Fungsi pembantu untuk mem-bypass Node module system
// Membaca file javascript yang berisi "export const [name]" menjadi sebuah object array
function loadData(filename, varName) {
  const filePath = path.join(__dirname, '..', 'data', filename);
  const content = fs.readFileSync(filePath, 'utf8');
  // Hapus baris komentar dan gunakan regex fleksibel
  const code = content.replace(new RegExp(`export\\s+const\\s+${varName}\\s*=\\s*`), 'return ');
  return new Function(code)();
}

async function main() {
  console.log('Membaca data dari folder data/ ...');
  
  const gejalaLaptop = loadData('gejalaLaptop.js', 'gejalaLaptop');
  const gejalaHP = loadData('gejalaHP.js', 'gejalaHP');
  const gejalaPC = loadData('gejalaPC.js', 'gejalaPC');
  const rules = loadData('rules.js', 'rules');

  console.log('Berhasil membaca file-file statis!');

  console.log('Menghapus data lama di database...');
  await prisma.riwayat.deleteMany();
  await prisma.referensi.deleteMany();
  await prisma.ruleGejala.deleteMany();
  await prisma.rule.deleteMany();
  await prisma.gejala.deleteMany();
  await prisma.kerusakan.deleteMany();
  await prisma.perangkat.deleteMany();

  console.log('Seeding Perangkat...');
  const perangkatMap = {
    'laptop': await prisma.perangkat.create({ data: { id: 1, nama: 'Laptop', slug: 'laptop', icon: 'Laptop' } }),
    'hp': await prisma.perangkat.create({ data: { id: 2, nama: 'Handphone (HP)', slug: 'hp', icon: 'Smartphone' } }),
    'pc': await prisma.perangkat.create({ data: { id: 3, nama: 'Desktop PC', slug: 'pc', icon: 'Monitor' } })
  };

  console.log('Seeding Gejala...');
  const allGejala = [
    ...gejalaLaptop.map(g => ({ ...g, perangkatId: perangkatMap['laptop'].id })),
    ...gejalaHP.map(g => ({ ...g, perangkatId: perangkatMap['hp'].id })),
    ...gejalaPC.map(g => ({ ...g, perangkatId: perangkatMap['pc'].id }))
  ];

  for (const g of allGejala) {
    await prisma.gejala.create({
      data: {
        id: g.id,
        perangkatId: g.perangkatId,
        deskripsi: g.deskripsi,
        kategori: g.kategori
      }
    });
  }

  console.log(`Seeding Kerusakan, Rules, dan Referensi (${rules.length} rules) ...`);
  for (const r of rules) {
    const pId = perangkatMap[r.perangkat].id;
    const kerusakanId = `K-${r.id}`; // misal K-L001

    // 1. Buat Kerusakan
    await prisma.kerusakan.create({
      data: {
        id: kerusakanId,
        perangkatId: pId,
        nama: r.kerusakan,
        deskripsi: r.deskripsi
      }
    });

    // 2. Buat Rule
    const createdRule = await prisma.rule.create({
      data: {
        kerusakanId: kerusakanId,
        certaintyFactor: r.certaintyFactor
      }
    });

    // 3. Buat RuleGejala
    for (const gId of r.gejalaIds) {
      await prisma.ruleGejala.create({
        data: {
          ruleId: createdRule.id,
          gejalaId: gId
        }
      });
    }

    // 4. Buat Referensi
    if (r.referensiStatis && r.referensiStatis.length > 0) {
      for (const ref of r.referensiStatis) {
        // Karena di prisma schema referensi hanya punya: judul, penulis, tahun, url, sumber
        // kita gabungkan atribut yang tidak ada di schema namun di-request
        const urlKombinasi = ref.penerbit ? `Penerbit: ${ref.penerbit} | Relevansi: ${ref.relevansi}` : ref.url || '';
        
        await prisma.referensi.create({
          data: {
            kerusakanId: kerusakanId,
            judul: ref.judul,
            penulis: ref.penulis || null,
            tahun: ref.tahun || null,
            url: urlKombinasi,
            sumber: 'statis'
          }
        });
      }
    }
  }

  console.log('Seeding selesai! Database siap digunakan.');
}

main()
  .catch((e) => {
    console.error('Terjadi error saat seeding: ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
