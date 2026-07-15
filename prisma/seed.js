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

// Data spesifik resolusi tinggi untuk 32 Jenis Kerusakan (Untuk UAS)
// Disusun dalam 3 paragraf dipisahkan oleh \n\n agar dibaca sebagai 3 dropdown
const specificData = {
  // ================= LAPTOP =================
  'L001': {
    explain: "### Analisis Kerusakan\nKerusakan power supply/charger disebabkan oleh kegagalan sirkuit Switching Mode Power Supply (SMPS) atau kerusakan fisik pada kabel DC. Kapasitor filter pada sirkuit sekunder sering mengalami kebocoran (leakage), menyebabkan output tegangan menjadi tidak stabil atau drop ketika laptop meminta beban daya tinggi.\n\n### Mekanisme & Dampak Teknis\nKegagalan ini biasanya diawali oleh kebocoran kapasitor filter sekunder yang membuat regulasi tegangan DC output berfluktuasi atau drop saat dibebani arus tinggi.\n\n### Rekomendasi Tindakan\nDisarankan untuk segera mengganti adaptor dengan spesifikasi voltase (V) dan ampere (A) yang identik untuk mencegah kerusakan sirkuit charging motherboard.",
    biaya: { min: 150000, max: 350000 },
    komponen: ["Kabel Jack DC Adapter", "Kapasitor Elektrolit Utama", "Transistor MOSFET Power", "Sekring (Fuse Input)"],
    tips: ["Bandingkan spesifikasi voltase (V) dan ampere (A) adaptor pengganti dengan yang lama.", "Hindari menggunakan adaptor universal tanpa sertifikasi keamanan."],
    waktu: "1-2 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "30-60 menit",
    biayaMandiri: { min: 25000, max: 80000 },
    alat: [{ nama: "Solder & Desoldering Pump", fungsi: "Melepas dan menyolder komponen rusak" }, { nama: "Multimeter Digital", fungsi: "Mengukur tegangan DC output" }],
    bahan: [{ nama: "Kabel DC Laptop Baru", estimasiHarga: "Rp 35.000" }, { nama: "Kapasitor Pengganti", estimasiHarga: "Rp 10.000" }],
    langkah: [
      { nomor: 1, judul: "Pengukuran Awal", detail: "Ukur tegangan output adapter menggunakan multimeter pada skala DC Volt." },
      { nomor: 2, judul: "Pembongkaran Casing", detail: "Gunakan pembuka casing plastik untuk membelah sambungan lem casing adapter secara hati-hati." },
      { nomor: 3, judul: "Penggantian Komponen", detail: "Solder ulang sambungan kabel yang putus atau ganti kapasitor yang kembung." }
    ],
    peringatan: ["Jangan menyentuh kapasitor tegangan tinggi (400V) sebelum dayanya dikosongkan.", "Pastikan polaritas kapasitor polar tidak terbalik."]
  },
  'L002': {
    explain: "### Analisis Kerusakan\nKegagalan RAM umumnya disebabkan oleh oksidasi pada pin kuningan konektor akibat kelembapan, atau kerusakan fisik pada IC DRAM (bad block).\n\n### Mekanisme & Dampak Teknis\nOksidasi ini menghambat aliran data biner dinamis, memicu kegagalan pembacaan data memori (parity error) saat sistem operasi melakukan POST atau mengalokasikan ruang memori dinamis.\n\n### Rekomendasi Tindakan\nBersihkan pin RAM menggunakan penghapus pensil terlebih dahulu. Jika tetap error saat diuji MemTest86, gantilah dengan modul memori baru.",
    biaya: { min: 250000, max: 700000 },
    komponen: ["Keping Memori RAM", "Slot RAM Motherboard", "Jalur Bus Memori", "IC Kontroler Memori"],
    tips: ["Pastikan kapasitas, tipe (DDR3/DDR4/DDR5), dan kecepatan (MHz) RAM baru didukung oleh prosesor Anda.", "Minta teknisi menjalankan tes Windows Memory Diagnostic di depan Anda."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "15 menit",
    biayaMandiri: { min: 5000, max: 20000 },
    alat: [{ nama: "Penghapus Karet", fungsi: "Membersihkan pin kuningan RAM dari oksidasi" }, { nama: "Cairan Kontak Pembersih", fungsi: "Membersihkan debu pada slot RAM" }],
    bahan: [{ nama: "Cotton Bud / Kain Microfiber", estimasiHarga: "Rp 5.000" }],
    langkah: [
      { nomor: 1, judul: "Akses RAM", detail: "Buka casing laptop atau penutup kompartemen RAM di bagian bawah." },
      { nomor: 2, judul: "Pelepasan", detail: "Tekan klip pengunci logam di kedua sisi RAM hingga RAM terangkat miring, lalu tarik keluar." },
      { nomor: 3, judul: "Pembersihan", detail: "Gosok perlahan bagian pin kuningan RAM menggunakan penghapus karet hingga mengkilap, lalu bersihkan slot RAM." }
    ],
    peringatan: ["Sentuh benda logam besar terlebih dahulu untuk membuang listrik statis tubuh sebelum memegang RAM.", "Jangan memasang RAM dengan posisi terbalik, perhatikan lekukan pada RAM dan slot."]
  },
  'L003': {
    explain: "### Analisis Kerusakan\nKerusakan LCD diakibatkan oleh keretakan panel matriks kaca cair (liquid crystal), putusnya jalur sirkuit COF (Chip on Film), atau kerusakan kabel eDP (embedded DisplayPort).\n\n### Mekanisme & Dampak Teknis\nKabel fleksibel eDP sering mengalami keausan/gesekan di area engsel karena aktivitas membuka-tutup layar laptop yang konstan.\n\n### Rekomendasi Tindakan\nGanti panel LCD secara utuh. Hindari menutup layar laptop dengan hanya menekan satu sisi bezel saja untuk mencegah tekanan asimetris.",
    biaya: { min: 800000, max: 1800000 },
    komponen: ["Panel Layar LCD/LED", "Kabel Fleksibel eDP", "Sirkuit T-Con Board", "Backlight Inverter"],
    tips: ["Mintalah panel layar baru dengan garansi bebas 'Dead Pixel' minimal 3 bulan.", "Pastikan resolusi dan tipe konektor (30-pin atau 40-pin) sesuai dengan spesifikasi aslinya."],
    waktu: "2-4 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "45 menit",
    biayaMandiri: { min: 700000, max: 1400000 },
    alat: [{ nama: "Opening Pick / Prying Tool", fungsi: "Membuka bezel plastik pembungkus layar" }, { nama: "Obeng Presisi", fungsi: "Membuka baut pengikat bracket LCD" }],
    bahan: [{ nama: "Panel LCD Baru", estimasiHarga: "Rp 850.000" }, { nama: "Isolasi Perekat LCD", estimasiHarga: "Rp 20.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas Bezel", detail: "Gunakan opening pick untuk mencongkil bezel layar secara perlahan mulai dari bagian atas." },
      { nomor: 2, judul: "Buka Baut", detail: "Lepaskan baut pengunci LCD di sudut bezel, lalu rebahkan layar di atas keyboard secara perlahan." },
      { nomor: 3, judul: "Konektor Layar", detail: "Buka pengunci logam konektor eDP 30/40 pin, cabut kabelnya, ganti LCD, dan pasang kembali." }
    ],
    peringatan: ["Selalu lepaskan baterai laptop sebelum mengganti LCD untuk mencegah korsleting pada jalur backlight tegangan tinggi.", "Jangan menekan permukaan panel LCD baru terlalu keras."]
  },
  'L004': {
    explain: "### Analisis Kerusakan\nKerusakan chip grafis VGA (GPU) di laptop biasanya diakibatkan oleh pecahnya bola solder BGA (lead-free solder fatigue) di bawah chip GPU akibat pemuaian thermal stress karena panas tinggi.\n\n### Mekanisme & Dampak Teknis\nRetakan solder bola BGA ini mengganggu interkoneksi data PCIe grafis ke motherboard, membuat laptop no display, freeze secara acak, atau gagal memproses bootloader BIOS.\n\n### Rekomendasi Tindakan\nLakukan pembersihan sistem pendingin secara berkala. Jika kartu grafis rusak parah, perbaikan reflow/reball atau penggantian motherboard diperlukan.",
    biaya: { min: 500000, max: 1500000 },
    komponen: ["Chip GPU BGA", "VRAM Video Memory", "Thermal System & Heatsink", "Motherboard BGA Tracks"],
    tips: ["Pekerjaan perbaikan reballing chip VGA membutuhkan mesin inframerah BGA rework station khusus. Cari teknisi spesialis mesin.", "Pastikan sirkulasi udara laptop tidak terhambat debu."],
    waktu: "1-3 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Perbaikan mandiri untuk kerusakan VGA laptop sangat tidak disarankan karena membutuhkan keahlian solder BGA tingkat tinggi dan peralatan rework station khusus."]
  },
  'L005': {
    explain: "### Analisis Kerusakan\nKerusakan Hard Disk disebabkan oleh ausnya komponen mekanis (platter magnetik dan actuator arm) atau terjadinya bad sector fisik akibat guncangan saat piringan berputar kencang.\n\n### Mekanisme & Dampak Teknis\nGoncangan fisik saat piringan berputar kencang memicu head pembaca membentur platter, merusak sektor penyimpanan berkas sistem operasi sehingga boot fail.\n\n### Rekomendasi Tindakan\nSangat disarankan mengganti penyimpanan lama dengan SSD (Solid State Drive) untuk ketahanan guncangan dan kecepatan baca-tulis yang jauh lebih tinggi.",
    biaya: { min: 300000, max: 900000 },
    komponen: ["Platter Magnetik", "Head Actuator Arm", "Motor Spindle", "SATA/NVMe Interface Controller"],
    tips: ["Sangat disarankan melakukan upgrade ke SSD karena tidak memiliki komponen mekanis dan jauh lebih cepat.", "Minta teknisi melakukan kloning data agar sistem operasi dan aplikasi lama Anda tidak hilang."],
    waktu: "2-3 jam",
    kesulitan: "Mudah",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 250000, max: 600000 },
    alat: [{ nama: "Obeng Phillips & Spudger", fungsi: "Membuka penutup bawah laptop dan bracket hardisk" }],
    bahan: [{ nama: "SSD SATA / NVMe M.2 Baru", estimasiHarga: "Rp 350.000" }],
    langkah: [
      { nomor: 1, judul: "Buka Penutup", detail: "Buka casing laptop untuk mengakses kompartemen penyimpanan 2.5 inci atau slot M.2." },
      { nomor: 2, judul: "Lepas Bracket", detail: "Lepaskan baut pengunci bracket hardisk lama, geser konektor SATA secara perlahan, lalu keluarkan hardisk." },
      { nomor: 3, judul: "Pasang SSD", detail: "Pasang SSD baru pada bracket, sambungkan ke konektor SATA/M.2, kencangkan baut pengunci, lalu pasang casing." }
    ],
    peringatan: ["Jangan menggoyang atau memindahkan laptop saat hardisk mekanis lama sedang melakukan proses pemindahan/salin data.", "Gunakan sekrup bawaan yang pas agar tidak menusuk sel baterai."]
  },
  'L006': {
    explain: "### Analisis Kerusakan\nOptical Drive (DVD-RW) mengalami kerusakan akibat lemahnya dioda laser pembaca piringan kaset atau keausan pada dinamo/motor mekanis pemutar disk.\n\n### Mekanisme & Dampak Teknis\nDioda laser yang melemah kehilangan intensitas cahaya untuk membaca track mikroskopis kaset, menyebabkan disk tidak terbaca (disk error) atau proses burn gagal.\n\n### Rekomendasi Tindakan\nGanti optical drive internal yang baru atau beralih menggunakan DVD-RW eksternal berbasis USB yang lebih praktis dan kompatibel dengan banyak perangkat.",
    biaya: { min: 150000, max: 350000 },
    komponen: ["Laser Diode Reader", "Spindle Motor", "Mekanik Tray Gear", "Kabel Fleksibel SATA OD"],
    tips: ["Lebih disarankan menggunakan DVD-RW USB Eksternal karena tidak memakan ruang internal laptop dan mudah dipindahkan.", "Sebagai opsi lain, slot DVD internal kosong dapat diubah menjadi slot penyimpanan tambahan menggunakan HDD Caddy."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "15 menit",
    biayaMandiri: { min: 100000, max: 200000 },
    alat: [{ nama: "Obeng Phillips Presisi", fungsi: "Membuka baut pengunci optical drive di bagian bawah laptop" }],
    bahan: [{ nama: "Optical Drive Baru / DVD-RW Eksternal USB", estimasiHarga: "Rp 150.000" }],
    langkah: [
      { nomor: 1, judul: "Pelepasan Baut", detail: "Matikan laptop, temukan satu baut berlabel khusus optical drive di bagian bawah casing laptop, lalu buka baut tersebut." },
      { nomor: 2, judul: "Tarik Drive", detail: "Gunakan pinset atau kuku untuk menarik bezel laci optical drive secara perlahan lurus keluar dari slot laptop." },
      { nomor: 3, judul: "Pasang Baru / Eksternal", detail: "Masukkan optical drive pengganti yang baru ke dalam slot hingga konektor SATA terhubung pas, lalu pasang kembali baut penguncinya." }
    ],
    peringatan: ["Jangan menyentuh lensa optik pembaca laser dengan tangan karena kotoran lemak jari dapat merusak daya baca laser.", "Jangan menarik tray optical drive terlalu keras saat laci sedang macet."]
  },
  'L007': {
    explain: "### Analisis Kerusakan\nMotherboard bermasalah akibat sirkuit pintas (short) pada jalur kelistrikan, kegagalan IC regulator tegangan, penumpukan panas berlebih pada chipset, atau baterai CMOS yang habis dayanya.\n\n### Mekanisme & Dampak Teknis\nKorsleting pada kapasitor filter SMD atau rusaknya IC power management memicu sirkuit proteksi daya mematikan sistem secara otomatis atau membatasi kinerja laptop secara ekstrem.\n\n### Rekomendasi Tindakan\nLakukan pemeliharaan thermal paste chipset dan pembersihan debu. Jika terjadi korsleting mesin, bawa ke spesialis reparasi motherboard laptop untuk pengerjaan micro-soldering.",
    biaya: { min: 600000, max: 2500000 },
    komponen: ["Chipset Motherboard (PCH)", "Kapasitor SMD & Resistor", "IC Power Management (PWM)", "Soket Baterai CMOS"],
    tips: ["Mintalah garansi servis minimal 1 bulan jika melakukan reparasi sirkuit motherboard.", "Gunakan stabilizer listrik saat mengisi daya laptop di rumah untuk menghindari korsleting akibat tegangan tidak stabil."],
    waktu: "2-4 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Perbaikan sirkuit motherboard laptop membutuhkan keahlian skematik sirkuit dan alat micro-soldering/rework station. Sangat tidak disarankan memperbaikinya sendiri."]
  },

  // ================= HP =================
  'H001': {
    explain: "### Analisis Kerusakan\nKerusakan pada IC WIFI disebabkan oleh kegagalan daya tegangan input ke chip sirkuit transceiver WiFi, atau retaknya solder bola BGA di bawah IC akibat getaran/benturan.\n\n### Mekanisme & Dampak Teknis\nTidak adanya tegangan penyuplai daya ke IC WIFI menghentikan operasi transceiver nirkabel, sehingga tombol switch WiFi dan Bluetooth di pengaturan HP berwarna abu-abu (greyed out) dan tidak bisa diaktifkan.\n\n### Rekomendasi Tindakan\nBawa HP ke teknisi spesialis mesin untuk melakukan proses reballing (solder ulang kaki-kaki IC) atau penggantian chip IC WIFI yang baru.",
    biaya: { min: 250000, max: 600000 },
    komponen: ["Chip IC WIFI/Bluetooth Transceiver", "Kapasitor Filter Input Tegangan", "Motherboard HP"],
    tips: ["Hindari menggunakan HP di tempat yang sangat lembab untuk mencegah korosi sirkuit mainboard.", "Pastikan garansi servis mesin minimal 1 bulan setelah penggantian chip."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Perbaikan IC WIFI membutuhkan keahlian solder mikro BGA tingkat lanjut dan alat solder uap panas (blower), tidak disarankan dikerjakan mandiri."]
  },
  'H002': {
    explain: "### Analisis Kerusakan\nIC Transceiver WTR mengalami kerusakan akibat korosi cairan atau kejutan tegangan yang merusak sirkuit pemrosesan frekuensi radio (RF).\n\n### Mekanisme & Dampak Teknis\nKerusakan chip transceiver WTR menghentikan pemrosesan modulasi sinyal seluler. Akibatnya, HP tidak bisa menangkap sinyal seluler sama sekali, memunculkan tanda sinyal silang, dan tidak bisa mencari jaringan secara manual.\n\n### Rekomendasi Tindakan\nBawa HP ke pusat reparasi hardware profesional untuk mengganti chip IC WTR yang rusak dengan chip yang baru dan kompatibel.",
    biaya: { min: 300000, max: 700000 },
    komponen: ["Chip IC WTR (Transceiver)", "Kondensator Filter RF", "Konektor Kabel Antena"],
    tips: ["Gunakan casing pelindung tebal untuk meredam getaran benturan langsung ke area mainboard.", "Periksa nomor IMEI Anda terlebih dahulu, pastikan tidak terblokir sebelum mengganti IC WTR."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Penggantian chip IC WTR membutuhkan blower udara panas dengan suhu terkontrol tinggi agar tidak merusak sirkuit tetangganya."]
  },
  'H003': {
    explain: "### Analisis Kerusakan\nKerusakan pada sirkuit IC Charging disebabkan oleh penggunaan adaptor charger non-original berkualitas rendah yang menyuplai tegangan berfluktuasi tidak stabil ke HP.\n\n### Mekanisme & Dampak Teknis\nLonjakan tegangan merusak sirkuit regulator daya internal chip pengisian, memicu gejala baterai tidak bertambah meski logo petir menyala (fake charging) dan area IC terasa sangat panas.\n\n### Rekomendasi Tindakan\nGanti chip IC Charging pada motherboard. Selalu gunakan charger dan kabel data original berkualitas tinggi yang mendukung regulasi tegangan aman.",
    biaya: { min: 250000, max: 550000 },
    komponen: ["Chip IC Charging (PMIC Charger)", "Dioda Proteksi Tegangan (OVP)", "Port USB Connector"],
    tips: ["Gunakan kabel charger berkualitas yang sudah bersertifikat standar (misal MFi untuk Apple).", "Jangan biarkan HP dicharge semalaman (overnight charging) jika sirkuit OVP Anda bermasalah."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Kerusakan IC Charger dapat menyebar ke chip daya utama (PMIC) jika dibiarkan korsleting terus-menerus tanpa perbaikan."]
  },
  'H004': {
    explain: "### Analisis Kerusakan\nSirkuit IC Fast Charging mengalami kerusakan akibat panas berlebih (overheating) saat pengisian daya tinggi konstan, atau sirkuit protokol negosiasi daya rusak.\n\n### Mekanisme & Dampak Teknis\nKerusakan pada sirkuit negosiasi daya menggagalkan deteksi protokol pengisian daya cepat (seperti VOOC/QC/PD), membatasi arus masuk ke mode pengisian lambat standar.\n\n### Rekomendasi Tindakan\nGanti chip IC Fast Charging yang rusak. Bersihkan debu pada port Type-C yang dapat menghambat koneksi pin data fast charging.",
    biaya: { min: 200000, max: 500000 },
    komponen: ["Chip Protokol Fast Charging", "Kabel Fleksibel Sub-Board ke Mainboard"],
    tips: ["Selalu bersihkan lubang port charger secara berkala dari serat benang pakaian menggunakan jarum tipis.", "Gunakan charger bawaan HP untuk kestabilan negosiasi daya."],
    waktu: "2-3 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 50000, max: 150000 },
    alat: [{ nama: "Obeng Set HP", fungsi: "Membuka baut casing belakang" }, { nama: "Pinset Presisi", fungsi: "Mencabut konektor kabel fleksibel daya" }],
    bahan: [{ nama: "Modul Papan Charger Bawah Baru", estimasiHarga: "Rp 70.000" }],
    langkah: [
      { nomor: 1, judul: "Buka Sub-board", detail: "Buka casing belakang, lepaskan sekrup penutup plastik mesin bawah." },
      { nomor: 2, judul: "Ganti Papan Charger", detail: "Cabut kabel fleksibel utama dan kabel antena koaksial dari sub-board, angkat papan lama, lalu pasang papan charger baru." },
      { nomor: 3, judul: "Pasang Kembali", detail: "Hubungkan kembali kabel fleksibel dan antena, pasang sekrup penutup, lalu uji pengisian daya cepat." }
    ],
    peringatan: ["Pastikan kabel antena koaksial terpasang rapat hingga klik agar sinyal HP tidak drop setelah pembongkaran."]
  },
  'H005': {
    explain: "### Analisis Kerusakan\nKerusakan pada Central Processing Unit (CPU) HP disebabkan oleh panas berlebih ekstrem (thermal throttling konstan) akibat penggunaan game berat sambil dicharge, atau korsleting internal.\n\n### Mekanisme & Dampak Teknis\nKorsleting pada sirkuit silikon CPU atau retaknya solder bola BGA di bawah chip memutus seluruh jalur distribusi instruksi sistem, menyebabkan HP mati total dan tidak merespon tombol power.\n\n### Rekomendasi Tindakan\nBawa HP ke teknisi spesialis mesin tingkat lanjut untuk melakukan proses reballing CPU (angkat, cetak ulang kaki solder, pasang kembali) atau ganti motherboard baru.",
    biaya: { min: 500000, max: 1500000 },
    komponen: ["Chip CPU (Central Processing Unit)", "Solder Ball BGA CPU", "Motherboard Utama"],
    tips: ["Jangan memaksakan bermain game berat pada kondisi suhu HP sangat panas atau saat sedang dicharge.", "Gunakan phone cooler eksternal untuk membantu membuang panas berlebih saat beban kerja tinggi."],
    waktu: "2-4 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Proses reballing CPU memiliki tingkat risiko kegagalan permanen yang tinggi, pastikan dikerjakan oleh teknisi spesialis berpengalaman."]
  },
  'H006': {
    explain: "### Analisis Kerusakan\nChip penyimpanan eMMC/UFS mengalami bad sector fisik akibat usia pakai siklus tulis-baca memori flash yang habis, atau korupsi partisi GPT internal.\n\n### Mekanisme & Dampak Teknis\nKerusakan sel memori flash pada sektor partisi bootloader mencegah sistem memuat kernel OS Android/iOS, mengakibatkan HP stuck di logo (bootloop) dan kinerja melambat parah.\n\n### Rekomendasi Tindakan\nLakukan flashing firmware resmi menggunakan komputer. Jika chip eMMC terdeteksi 'read-only' atau mati total, diperlukan penggantian chip eMMC baru.",
    biaya: { min: 350000, max: 850000 },
    komponen: ["Chip IC eMMC / UFS Storage", "Motherboard Utama"],
    tips: ["Selalu lakukan backup data foto dan kontak penting ke akun Google Drive/iCloud Anda secara berkala.", "Jangan mematikan HP secara paksa saat proses update sistem sedang berlangsung."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Penggantian IC eMMC memerlukan pemrograman ulang partisi IMEI dan enkripsi keamanan agar HP tidak terkunci (brick)."]
  },
  'H007': {
    explain: "### Analisis Kerusakan\nIC Power Amplifier (PA) rusak akibat fluktuasi daya atau beban transmisi sinyal maksimum yang konstan saat berada di area minim sinyal.\n\n### Mekanisme & Dampak Teknis\nKerusakan IC PA menghentikan proses penguatan daya transmisi sinyal radio seluler. Akibatnya, kartu SIM terdeteksi namun sinyal seluler bertanda silang (no service).\n\n### Rekomendasi Tindakan\nBawa HP ke teknisi spesialis mesin untuk penggantian chip IC PA yang sesuai dengan skema tipe mesin HP Anda.",
    biaya: { min: 250000, max: 600000 },
    komponen: ["Chip IC PA (Power Amplifier)", "Kondensator Filter Sinyal"],
    tips: ["Hindari memaksakan menggunakan koneksi data internet seluler saat berada di daerah yang sangat minim jangkauan sinyal.", "Gunakan koneksi WiFi jika sinyal seluler di rumah Anda tidak stabil."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Perbaikan IC PA membutuhkan penggantian chip dengan nomor seri komponen yang identik agar frekuensi sinyal kembali normal."]
  },
  'H008': {
    explain: "### Analisis Kerusakan\nKerusakan pada chip Power Management utama (PMIC) yang membagi tegangan daya rendah ke komponen periferal seperti modul WiFi dan Bluetooth.\n\n### Mekanisme & Dampak Teknis\nTerputusnya salah satu jalur output daya LDO (Low Dropout Regulator) pada PMIC menghentikan suplai daya ke sirkuit WiFi, menyebabkan modul WiFi mati meski chip WiFi normal.\n\n### Rekomendasi Tindakan\nGanti chip PMIC utama yang rusak pada motherboard. Pastikan kelistrikan HP diuji menggunakan power supply DC bench sebelum perakitan.",
    biaya: { min: 300000, max: 800000 },
    komponen: ["Chip PMIC (Power Management IC)", "Kapasitor Jalur Output LDO"],
    tips: ["Selalu gunakan adaptor charger original bawaan pabrik untuk menghindari fluktuasi arus PMIC.", "Jangan menggunakan powerbank abal-abal yang tidak memiliki fitur pengaman arus voltase."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Mengganti chip PMIC membutuhkan ketelitian tinggi karena posisinya sangat dekat dengan chip RAM/CPU yang rentan mati jika kepanasan."]
  },
  'H009': {
    explain: "### Analisis Kerusakan\nModul memori RAM mengalami kegagalan fungsi internal atau retak kaki solder timbal akibat panas berlebih (thermal stress) yang konstan.\n\n### Mekanisme & Dampak Teknis\nKegagalan akses data sementara pada memori RAM mengganggu proses eksekusi kernel, menyebabkan HP tiba-tiba mati total saat dinyalakan atau restart berulang.\n\n### Rekomendasi Tindakan\nBawa HP ke teknisi spesialis untuk melakukan teknik reballing/reflow RAM, atau ganti motherboard baru.",
    biaya: { min: 400000, max: 1000000 },
    komponen: ["Chip RAM LPDDR", "Motherboard Utama"],
    tips: ["Jangan menumpuk terlalu banyak aplikasi aktif di latar belakang (background apps) untuk meringankan kinerja RAM.", "Bersihkan file cache sistem secara rutin melalui menu pemeliharaan perangkat."],
    waktu: "2-3 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Banyak HP modern menumpuk chip RAM di atas chip CPU (double-decker). Pembongkaran RAM membutuhkan blower presisi tinggi agar chip CPU di bawahnya tidak rusak."]
  },
  'H010': {
    explain: "### Analisis Kerusakan\nKerusakan pada IC Audio decoder/codec akibat short sirkuit atau terkena rembesan air di dekat jalur jack audio atau speaker.\n\n### Mekanisme & Dampak Teknis\nKorsleting pada sirkuit codec audio mengunci kontrol audio sistem, sehingga semua fungsi suara (baik suara telepon, musik, mic panggilan) mati total secara terpusat.\n\n### Rekomendasi Tindakan\nGanti chip IC Audio pada motherboard. Pastikan area jalur sirkuit audio dibersihkan dari korosi sisa air.",
    biaya: { min: 250000, max: 600000 },
    komponen: ["Chip IC Audio Codec", "Filter Kapasitor Audio", "Jalur Kelistrikan Audio"],
    tips: ["Jika HP terkena air, segera matikan perangkat dan jangan mencoba menyalakannya sebelum dikeringkan total.", "Gunakan earphone bluetooth sebagai solusi sementara untuk panggilan."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Jangan menyemprotkan cairan pembersih langsung ke lubang speaker atau microphone HP Anda."]
  },
  'H011': {
    explain: "### Analisis Kerusakan\nKerusakan pada panel kaca sentuh (Touchscreen digitizer) akibat tekanan keras, benturan, atau kabel fleksibel sentuh yang robek/retak sirkuitnya.\n\n### Mekanisme & Dampak Teknis\nPutusnya sirkuit matriks tembaga pada digitizer menghentikan pengiriman koordinat sentuhan jari ke pengontrol layar, menyebabkan layar tidak merespon sama sekali.\n\n### Rekomendasi Tindakan\nGanti modul kaca sentuh (Touchscreen) atau satu set LCD assembly jika panel layar sentuh menyatu secara permanen (laminated display).",
    biaya: { min: 250000, max: 800000 },
    komponen: ["Digitizer Touchscreen", "Kabel Fleksibel Touchscreen", "IC Touch Controller"],
    tips: ["Gunakan tempered glass berkualitas dengan ketebalan minimal 0.3mm untuk meredam benturan layar.", "Gunakan mouse USB dengan adaptor OTG sebagai solusi darurat mengontrol HP yang layarnya tidak bisa disentuh."],
    waktu: "2 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "45 menit",
    biayaMandiri: { min: 150000, max: 500000 },
    alat: [{ nama: "Prying Tool & Suction Cup", fungsi: "Melepas layar dari frame" }, { nama: "Obeng Phillips Set", fungsi: "Membuka baut penutup mesin dalam" }],
    bahan: [{ nama: "Modul Touchscreen Baru", estimasiHarga: "Rp 150.000" }, { nama: "Lem LCD B7000 / T7000", estimasiHarga: "Rp 25.000" }],
    langkah: [
      { nomor: 1, judul: "Bongkar HP", detail: "Buka casing belakang, lepaskan konektor baterai, cabut konektor fleksibel touchscreen dari motherboard." },
      { nomor: 2, judul: "Lepas Layar", detail: "Panaskan sekeliling pinggiran layar dengan hairdryer, gunakan suction cup dan prying pick untuk memisahkan layar dari frame." },
      { nomor: 3, judul: "Pasang Baru", detail: "Bersihkan sisa lem di frame, oleskan lem baru, pasang touchscreen baru, sambungkan konektor, lalu jepit hingga lem kering." }
    ],
    peringatan: ["Jangan menekan layar LCD terlalu keras saat membersihkan sisa lem lama agar tidak memicu noda LCD bocor (dead pixel)."]
  },
  'H012': {
    explain: "### Analisis Kerusakan\nModul kamera HP rusak akibat retaknya elemen optik lensa, putusnya kumparan penstabil gambar (OIS/VCM), atau kerusakan sensor gambar CMOS.\n\n### Mekanisme & Dampak Teknis\nKerusakan kumparan OIS/VCM memicu lensa bergetar tanpa kendala (goyang), sedangkan kegagalan sensor CMOS menyebabkan layar kamera blank hitam atau gambar memblur.\n\n### Rekomendasi Tindakan\nGanti modul kamera internal HP yang rusak. Selalu gunakan penutup pelindung lensa luar agar kaca kamera tidak tergores.",
    biaya: { min: 200000, max: 900000 },
    komponen: ["Modul Kamera Utama / Depan", "Voice Coil Motor (VCM/OIS)", "Konektor Fleksibel Kamera"],
    tips: ["Hindari memasang HP di stang sepeda motor yang memiliki getaran tinggi karena dapat merusak stabilizer OIS kamera.", "Bersihkan kaca luar pelindung kamera menggunakan kain mikrofiber halus secara rutin."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 120000, max: 500000 },
    alat: [{ nama: "Obeng Phillips HP", fungsi: "Membuka baut pelindung modul motherboard" }, { nama: "Pinset Presisi", fungsi: "Melepas modul kamera dari soket motherboard" }],
    bahan: [{ nama: "Modul Kamera Baru", estimasiHarga: "Rp 200.000" }],
    langkah: [
      { nomor: 1, judul: "Bongkar Mesin Atas", detail: "Buka casing belakang, cabut konektor baterai, lalu buka sekrup penutup motherboard atas." },
      { nomor: 2, judul: "Lepas Kamera Lama", detail: "Gunakan spudger plastik untuk mencungkil konektor fleksibel kamera lama ke atas, lalu angkat modul kamera." },
      { nomor: 3, judul: "Pasang Modul Baru", detail: "Tempatkan modul kamera baru ke dalam dudukannya, tekan konektor fleksibelnya ke soket motherboard hingga klik." }
    ],
    peringatan: ["Jangan menyentuh kaca sensor kamera baru dengan jari telanjang agar tidak meninggalkan noda minyak sidik jari permanen."]
  },
  'H013': {
    explain: "### Analisis Kerusakan\nBaterai lithium mengalami penurunan kapasitas sel (degradasi sel kimia) akibat usia pakai atau panas berlebih saat pengisian daya, memicu gas kimia keluar dan membuat fisik menggembung.\n\n### Mekanisme & Dampak Teknis\nSel baterai yang rusak kehilangan kestabilan tegangan output. Hal ini memicu HP mati secara tiba-tiba saat sasis membutuhkan arus tinggi atau melakukan restart otomatis.\n\n### Rekomendasi Tindakan\nSegera lakukan penggantian baterai HP yang baru. Jangan menusuk baterai kembung karena dapat memicu percikan api ledakan kimia.",
    biaya: { min: 150000, max: 450000 },
    komponen: ["Sel Baterai Lithium Polymer", "Sirkuit Pengaman PCM Baterai", "Double Tape Baterai"],
    tips: ["Jangan membiasakan menggunakan HP hingga persentase baterai 0% karena mempercepat degradasi sel baterai.", "Gunakan pengisi daya resmi dengan output Watt yang sesuai rekomendasi pabrikan."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 100000, max: 300000 },
    alat: [{ nama: "Obeng Phillips & Spudger", fungsi: "Buka casing belakang dan penutup sasis baterai" }, { nama: "Hairdryer", fungsi: "Melunakkan lem perekat di bawah baterai" }],
    bahan: [{ nama: "Baterai HP Baru", estimasiHarga: "Rp 150.000" }, { nama: "Double Tape Perekat", estimasiHarga: "Rp 10.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas Perekat", detail: "Buka casing belakang, cabut konektor baterai, tarik pita perekat baterai (pull tabs) di bawah baterai secara horizontal." },
      { nomor: 2, judul: "Angkat Baterai", detail: "Gunakan spudger plastik layar lebar untuk mengangkat baterai lama secara perlahan dari sasis HP." },
      { nomor: 3, judul: "Pasang Baru", detail: "Tempelkan perekat baru di sasis, posisikan baterai baru, tekan perlahan, sambungkan konektor baterai, lalu rakit kembali." }
    ],
    peringatan: ["Jangan mencungkil baterai menggunakan obeng logam tajam karena resiko menusuk sel baterai dan memicu kebakaran kimia."]
  },
  'H014': {
    explain: "### Analisis Kerusakan\nSpeaker utama (buzzer/loudspeaker) mengalami kerusakan akibat masuknya partikel debu besi magnetik ke dalam rongga membran, atau sobeknya membran speaker akibat volume suara terlalu keras.\n\n### Mekanisme & Dampak Teknis\nPenumpukan kotoran menyumbat getaran membran speaker, menyebabkan suara terdengar pecah (sember) atau mati total karena sirkuit kumparan voice coil terputus.\n\n### Rekomendasi Tindakan\nBersihkan saringan lubang speaker menggunakan sikat berbulu halus. Jika suara tetap sember/mati, lakukan penggantian modul loudspeaker baru.",
    biaya: { min: 100000, max: 250000 },
    komponen: ["Modul Loudspeaker (Buzzer)", "Saringan Debu Casing"],
    tips: ["Gunakan sikat gigi bekas yang kering untuk menyikat debu halus di lubang speaker luar HP Anda.", "Hindari memutar musik dengan volume maksimal 100% secara terus-menerus."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "20 menit",
    biayaMandiri: { min: 40000, max: 100000 },
    alat: [{ nama: "Obeng Phillips HP", fungsi: "Buka sekrup penutup modul speaker bawah" }, { nama: "Spudger Plastik", fungsi: "Mencungkil modul speaker dari frame" }],
    bahan: [{ nama: "Modul Speaker Baru", estimasiHarga: "Rp 50.000" }],
    langkah: [
      { nomor: 1, judul: "Akses Speaker", detail: "Buka casing belakang, lepaskan sekrup penutup plastik mesin bagian bawah tempat speaker berada." },
      { nomor: 2, judul: "Ganti Modul", detail: "Angkat modul speaker lama yang biasanya menyatu dengan sasis penutup bawah, letakkan modul baru pada posisinya." },
      { nomor: 3, judul: "Tutup & Sekrup", detail: "Kencangkan sekrup kembali, rakit casing belakang, lalu tes suara nada dering." }
    ],
    peringatan: ["Pastikan pin kontak logam kuningan speaker sejajar dengan pin kontak pada papan sirkuit sebelum menyekrupnya."]
  },
  'H015': {
    explain: "### Analisis Kerusakan\nMicrophone internal HP mengalami kerusakan akibat tersumbat kotoran lilin saku celana, terkena cairan korosif, atau putusnya sirkuit mic pada papan charger sub-board.\n\n### Mekanisme & Dampak Teknis\nTersumbatnya lubang mic menghalangi getaran suara masuk ke membran mic, menyebabkan lawan bicara tidak bisa mendengar suara kita saat melakukan panggilan.\n\n### Rekomendasi Tindakan\nBersihkan lubang mic menggunakan jarum tipis secara hati-hati. Jika sirkuit mic mati, ganti papan sasis sub-board charger bawah yang memuat mic internal.",
    biaya: { min: 100000, max: 300000 },
    komponen: ["Microphone Sensor (MEMS)", "Papan Charger Bawah (Sub-board)", "Karet Pelindung Mic"],
    tips: ["Gunakan headset berkabel atau bluetooth sebagai solusi darurat jika mic telepon Anda mati total.", "Jangan menusuk lubang mic terlalu dalam menggunakan jarum karena dapat merusak membran sensor."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 50000, max: 150000 },
    alat: [{ nama: "Obeng Phillips HP", fungsi: "Membuka baut pelindung sub-board bawah" }, { nama: "Pinset Presisi", fungsi: "Melepas konektor fleksibel utama dan antena" }],
    bahan: [{ nama: "Papan Charger Sub-board Baru (dengan Mic)", estimasiHarga: "Rp 70.000" }],
    langkah: [
      { nomor: 1, judul: "Buka Sub-board", detail: "Buka casing belakang, lepaskan sekrup penutup bawah, cabut kabel fleksibel utama dan antena koaksial." },
      { nomor: 2, judul: "Ganti Sub-board", detail: "Angkat papan charger lama, pastikan karet pelindung mic bawaan dipindahkan ke papan baru, lalu pasang papan baru." },
      { nomor: 3, judul: "Rakit Kembali", detail: "Pasang kembali kabel fleksibel dan antena, sekrup penutup bawah, lalu uji microphone dengan aplikasi perekam suara." }
    ],
    peringatan: ["Karet pelindung mic (gasket) harus dipasang kembali agar suara rekaman tidak mendengung atau gema."]
  },
  'H016': {
    explain: "### Analisis Kerusakan\nLayar LCD/OLED rusak akibat benturan fisik keras yang memecahkan lapisan kaca panel liquid crystal internal, atau putusnya jalur sirkuit fleksibel display.\n\n### Mekanisme & Dampak Teknis\nKeretakan sirkuit display internal menghentikan transfer visual dari GPU ke matriks piksel LCD, menyebabkan layar blank hitam total meskipun mesin HP menyala (ada getar/suara).\n\n### Rekomendasi Tindakan\nGanti modul LCD assembly secara utuh. Pasangkan pelindung tempered glass setelah penggantian layar selesai.",
    biaya: { min: 350000, max: 2500000 },
    komponen: ["Layar LCD / OLED Panel", "Kabel Fleksibel Konektor Layar", "IC Display Driver"],
    tips: ["Untuk layar tipe OLED/AMOLED, harga komponen jauh lebih mahal dibanding layar IPS biasa. Pastikan menguji fungsi layar sebelum direkatkan.", "Gunakan pelindung casing flip cover jika HP sering terjatuh."],
    waktu: "2 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "60 menit",
    biayaMandiri: { min: 250000, max: 1500000 },
    alat: [{ nama: "Prying Tool & Suction Cup", fungsi: "Melepas modul layar lama dari frame" }, { nama: "Klem Penjepit LCD", fungsi: "Menekan LCD ke frame saat pengeleman" }],
    bahan: [{ nama: "LCD Assembly Baru", estimasiHarga: "Rp 350.000" }, { nama: "Lem LCD T7000 / B7000", estimasiHarga: "Rp 25.000" }],
    langkah: [
      { nomor: 1, judul: "Bongkar HP", detail: "Buka casing belakang, cabut konektor baterai dan konektor fleksibel LCD lama." },
      { nomor: 2, judul: "Lepas LCD Lama", detail: "Panaskan keliling pinggiran layar LCD dengan hairdryer, congkil perlahan menggunakan prying pick, bersihkan frame dari lem lama." },
      { nomor: 3, judul: "Pasang LCD Baru", detail: "Uji coba layar baru tanpa lem terlebih dahulu. Jika normal, oleskan lem LCD pada frame, pasang LCD baru, lalu jepit dengan klem selama 1 jam." }
    ],
    peringatan: ["Selalu uji fungsi sentuh dan kecerahan LCD baru sebelum memasang lem permanen, karena garansi komponen biasanya hangus jika sudah dilem."]
  },
  'H017': {
    explain: "### Analisis Kerusakan\nKerusakan sirkuit perangkat lunak (System Operasi) disebabkan oleh kegagalan sistem saat melakukan proses pembaruan firmware (OTA update), infeksi malware, atau data sistem korup.\n\n### Mekanisme & Dampak Teknis\nKorupsi pada file partisi system/boot mencegah kernel OS dimuat oleh bootloader, menyebabkan sistem mengalami bootloop (stuck di logo) atau restart berulang saat dinyalakan.\n\n### Rekomendasi Tindakan\nLakukan flashing ulang firmware resmi (Stock ROM) menggunakan komputer dan software flash tool resmi (seperti Odin, Mi Flash, atau iTunes).",
    biaya: { min: 100000, max: 250000 },
    komponen: ["Firmware System Operasi", "Partisi Recovery / Bootloader"],
    tips: ["Pastikan daya baterai minimal 50% sebelum memulai proses flashing firmware menggunakan komputer.", "Gunakan kabel data berkualitas baik saat menghubungkan HP ke komputer agar transfer firmware tidak terputus."],
    waktu: "1-2 jam",
    kesulitan: "Sedang",
    waktuMandiri: "45 menit",
    biayaMandiri: { min: 0, max: 0 },
    alat: [{ nama: "Kabel Data USB Original", fungsi: "Menghubungkan HP ke komputer/laptop" }, { nama: "Komputer / Laptop", fungsi: "Menjalankan aplikasi flashing firmware" }],
    bahan: [{ nama: "Stock ROM Resmi Firmware", estimasiHarga: "Gratis (Unduh dari situs resmi)" }],
    langkah: [
      { nomor: 1, judul: "Unduh Firmware", detail: "Unduh file firmware stock ROM yang sesuai persis dengan model tipe HP Anda di komputer." },
      { nomor: 2, judul: "Masuk Download Mode", detail: "Matikan HP, tekan tombol kombinasi (misal Power + Volume Bawah) untuk masuk ke Recovery/Download/Fastboot mode, lalu hubungkan ke PC." },
      { nomor: 3, judul: "Jalankan Flash", detail: "Buka aplikasi flash tool di PC, pilih file firmware yang diunduh, lalu klik tombol Flash/Restore dan tunggu hingga selesai." }
    ],
    peringatan: ["Proses flashing ulang firmware akan menghapus seluruh data internal HP. Pastikan Anda menyetujui konsekuensi hilangnya data."]
  },
  'H018': {
    explain: "### Analisis Kerusakan\nNomor identitas modem (IMEI) terhapus/korup di partisi EFS/NVRAM akibat kegagalan flash firmware, atau nomor IMEI diblokir secara nasional karena perangkat tidak terdaftar resmi.\n\n### Mekanisme & Dampak Teknis\nHilangnya data nomor IMEI mencegah modem mendaftarkan jaringan ke operator seluler nasional, memicu status kartu SIM terdeteksi namun tidak ada jaringan.\n\n### Rekomendasi Tindakan\nLakukan registrasi IMEI resmi Bea Cukai jika HP dibeli dari luar negeri. Jika karena kerusakan data EFS, lakukan restore data partisi EFS/NVRAM menggunakan box flasher.",
    biaya: { min: 150000, max: 500000 },
    komponen: ["Partisi NVRAM / EFS IMEI", "Modem Baseband Firmware"],
    tips: ["Periksa status IMEI Anda terlebih dahulu di situs resmi Bea Cukai atau Kemenperin untuk memastikan status blokir.", "Selalu backup partisi EFS menggunakan TWRP sebelum melakukan modifikasi sistem operasi (Custom ROM)."],
    waktu: "1-2 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 0, max: 0 },
    alat: [{ nama: "Komputer / Laptop", fungsi: "Menjalankan tool bypass/repair IMEI" }],
    bahan: [],
    langkah: [
      { nomor: 1, judul: "Cek IMEI", detail: "Tekan *#06# pada dialer HP. Jika IMEI null atau 0, berarti partisi NVRAM/EFS rusak secara software." },
      { nomor: 2, judul: "Write EFS", detail: "Hubungkan HP ke PC dalam mode diag port, gunakan aplikasi flasher (seperti QPST/QFIL) untuk menulis ulang berkas NVRAM/EFS bawaan." },
      { nomor: 3, judul: "Uji Jaringan", detail: "Nyalakan HP, masukkan kartu SIM, pastikan nomor IMEI kembali muncul dan sinyal terdeteksi." }
    ],
    peringatan: ["Melakukan pengubahan nomor IMEI selain nomor bawaan perangkat adalah tindakan melanggar hukum di beberapa negara."]
  },

  // ================= PC =================
  'P001': {
    explain: "### Analisis Kerusakan\nKerusakan pada unit monitor disebabkan oleh kerusakan panel LCD backlight, modul inverter tegangan tinggi, atau kerusakan sirkuit T-Con board. Hal ini menghalangi transmisi visual dari kartu grafis PC ke panel layar.\n\n### Mekanisme & Dampak Teknis\nKerusakan panel LCD backlight menghentikan pencahayaan layar, sedangkan kerusakan T-Con board mengacaukan pemrosesan piksel grafis, menyebabkan tampilan blank hitam atau bergaris.\n\n### Rekomendasi Tindakan\nPastikan koneksi kabel data (HDMI/VGA) terhubung dengan kencang di kedua sisi. Jika panel LCD pecah atau bergaris permanen, disarankan untuk mengganti panel layar monitor yang baru.",
    biaya: { min: 400000, max: 1500000 },
    komponen: ["Panel LCD Monitor", "T-Con Board", "Backlight LED/CCFL", "Kabel Konektor LVDS"],
    tips: ["Gunakan kabel display berkualitas tinggi (seperti DisplayPort atau HDMI) dengan pelindung nilon.", "Selalu matikan monitor sebelum melepas/memasang kabel data."],
    waktu: "2-4 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 350000, max: 1200000 },
    alat: [{ nama: "Obeng Set Presisi", fungsi: "Membuka casing luar monitor" }, { nama: "Prying Tool Plastik", fungsi: "Mencongkil bezel monitor tanpa merusak plastik" }],
    bahan: [{ nama: "Panel LCD Pengganti", estimasiHarga: "Rp 500.000" }],
    langkah: [
      { nomor: 1, judul: "Buka Bezel", detail: "Gunakan prying tool plastik untuk mencungkil bezel plastik monitor di sekeliling layar secara perlahan." },
      { nomor: 2, judul: "Lepas Panel", detail: "Buka baut penyangga bracket layar, rebahkan panel, lalu cabut kabel LVDS/eDP dari belakang panel." },
      { nomor: 3, judul: "Pasang Baru", detail: "Hubungkan kabel data to panel baru, posisikan panel pada bracket casing, kencangkan baut, lalu pasang kembali bezel." }
    ],
    peringatan: ["Jangan menyentuh papan sirkuit power supply internal monitor karena terdapat kapasitor bertegangan tinggi (400V) yang berbahaya.", "Jangan menekan bagian tengah panel LCD baru."]
  },
  'P002': {
    explain: "### Analisis Kerusakan\nKegagalan memori RAM umumnya disebabkan oleh tumpukan debu konduktif atau oksidasi pada kaki pin emas RAM akibat kelembapan tinggi, yang mengganggu kontak slot DIMM.\n\n### Mekanisme & Dampak Teknis\nTerputusnya kontak jalur bus memori menggagalkan proses Power-On Self-Test (POST) BIOS saat komputer dinyalakan, memicu bunyi beep berulang dan layar blank (no display).\n\n### Rekomendasi Tindakan\nCabut modul RAM dan gosok pin kuningan emas menggunakan penghapus karet pensil hingga bersih mengkilap, lalu bersihkan slot RAM dengan contact cleaner.",
    biaya: { min: 150000, max: 800000 },
    komponen: ["Modul RAM DDR3/DDR4/DDR5", "Slot Memori DIMM Motherboard"],
    tips: ["Bersihkan pin RAM secara searah secara lembut dengan penghapus karet.", "Gunakan slot memori dual channel (biasanya slot 2 dan 4) untuk memaksimalkan performa transfer data."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "15 menit",
    biayaMandiri: { min: 5000, max: 15000 },
    alat: [{ nama: "Penghapus Karet Pensil", fungsi: "Mengikis kotoran oksidasi pada pin RAM" }, { nama: "Semprotan Contact Cleaner", fungsi: "Membersihkan debu di dalam celah slot memori" }],
    bahan: [{ nama: "Kuas Kecil / Cotton Bud", estimasiHarga: "Rp 5.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas RAM", detail: "Matikan PC, buka penutup casing samping, tekan tuas pengunci slot RAM di motherboard, lalu tarik modul RAM lurus ke atas." },
      { nomor: 2, judul: "Pembersihan", detail: "Gosok kaki pin kuningan RAM secara lembut dengan penghapus karet di kedua sisi hingga mengkilap. Kuas debu di slot RAM." },
      { nomor: 3, judul: "Pasang Kembali", detail: "Masukkan RAM ke slotnya secara merata lurus ke bawah hingga kedua klip pengunci berbunyi klik dan mengunci otomatis." }
    ],
    peringatan: ["Sentuh bagian luar casing PC berbahan logam untuk membuang listrik statis tubuh sebelum menyentuh komponen RAM.", "Jangan memasang RAM terbalik, perhatikan lekukan pembatas slot."]
  },
  'P003': {
    explain: "### Analisis Kerusakan\nKerusakan mekanis Hard Disk disebabkan oleh ausnya dinamo pemutar (spindle motor), kemacetan jarum pembaca (head crash), atau kerusakan bad sector fisik pada piringan magnetik.\n\n### Mekanisme & Dampak Teknis\nKemacetan head pembaca (clicking noise) atau rusaknya sektor sektor partisi MBR mencegah sistem operasi memproses sistem booting, sehingga PC stuck di BIOS atau bootloop.\n\n### Rekomendasi Tindakan\nSegera backup data penting jika hard disk masih terdeteksi. Sangat disarankan mengganti hard disk dengan SSD SATA atau M.2 NVMe untuk kecepatan dan ketahanan guncangan yang jauh lebih tinggi.",
    biaya: { min: 300000, max: 900000 },
    komponen: ["Platter Magnetik HDD", "Head Actuator Arm", "Motor Spindle", "Sektor Partisi MBR/GPT"],
    tips: ["Gantilah hard disk mekanik Anda dengan Solid State Drive (SSD) karena tidak memiliki komponen bergerak dan 10x lipat lebih cepat.", "Gunakan software CrystalDiskInfo untuk memantau kesehatan sektor hard disk."],
    waktu: "1-2 jam",
    kesulitan: "Mudah",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 250000, max: 600000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka sasis casing samping PC dan sekrup hardisk" }],
    bahan: [{ nama: "SSD SATA / M.2 NVMe Baru", estimasiHarga: "Rp 350.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas HDD Lama", detail: "Buka bracket hard disk di dalam casing PC, lepaskan kabel data SATA dan kabel power SATA dari belakang hard disk." },
      { nomor: 2, judul: "Pasang Baru", detail: "Pasang SSD baru ke bracket, sambungkan kabel data SATA ke motherboard dan kabel power SATA dari PSU." },
      { nomor: 3, judul: "Instal Sistem", detail: "Nyalakan komputer, masuk to media installer OS Windows (flashdisk) untuk melakukan instalasi sistem operasi baru pada SSD." }
    ],
    peringatan: ["Jangan memindahkan, menggoyang, atau membenturkan PC saat hard disk mekanis sedang beroperasi (menyala) karena rawan merusak piringan.", "Pastikan sekrup pengunci storage terpasang kokoh."]
  },
  'P004': {
    explain: "### Analisis Kerusakan\nKerusakan kartu grafis VGA umumnya disebabkan oleh retaknya bola-bola solder BGA (lead-free solder joints) di bawah chip GPU akibat panas berlebih (overheat) berulang.\n\n### Mekanisme & Dampak Teknis\nRetaknya interkoneksi solder mikro ini memutus jalur transmisi sinyal data piksel gambar dari GPU ke motherboard, memicu gejala layar blank hitam, artefak garis berwarna, atau no signal ke monitor.\n\n### Rekomendasi Tindakan\nLakukan pemeliharaan kipas pendingin VGA dan bersihkan sisa thermal paste kering. Jika chip GPU rusak permanen, diperlukan penggantian unit VGA Card baru.",
    biaya: { min: 400000, max: 3000000 },
    komponen: ["Chip GPU Core", "VRAM Video Memory", "Sirkuit VRM GPU", "Cooling Fan VGA"],
    tips: ["Jangan membeli VGA bekas mining (tambang kripto) tanpa jaminan garansi fisik yang jelas.", "Selalu perbarui driver kartu grafis ke versi terbaru dari website resmi NVIDIA / AMD."],
    waktu: "1-2 hari",
    kesulitan: "Tinggi",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 300000, max: 2000000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka sekrup bracket VGA di casing belakang" }],
    bahan: [{ nama: "VGA Card Pengganti Baru", estimasiHarga: "Rp 1.200.000" }],
    langkah: [
      { nomor: 1, judul: "Pelepasan Kabel", detail: "Buka sekrup bracket VGA di belakang casing, tekan tuas pengunci slot PCIe ke bawah, lalu lepaskan kabel daya tambahan PCIe 6/8-pin." },
      { nomor: 2, judul: "Tarik VGA", detail: "Tarik VGA card lurus secara vertikal ke atas dari slot PCIe motherboard secara perlahan." },
      { nomor: 3, judul: "Pasang Baru", detail: "Tancapkan VGA baru ke slot PCIe utama, tekan hingga tuas berbunyi klik, pasang sekrup bracket, lalu colokkan kabel daya PCIe." }
    ],
    peringatan: ["Selalu matikan PC dan cabut kabel power PSU dari stopkontak sebelum melepas atau memasang kartu grafis VGA.", "Jangan menyentuh pin emas PCIe dengan tangan berminyak."]
  },
  'P005': {
    explain: "### Analisis Kerusakan\nKerusakan chip audio controller onboard atau kerusakan fisik port jack audio 3.5mm di motherboard. Sering dipicu oleh korosi atau lonjakan tegangan statis pada headphone.\n\n### Mekanisme & Dampak Teknis\nKorsleting pada sirkuit output audio onboard mengganggu regulasi daya audio sehingga sistem operasi mendeteksi driver audio silang merah dan audio mati total.\n\n### Rekomendasi Tindakan\nPerbarui driver audio Realtek terlebih dahulu. Jika kerusakan sirkuit terbukti secara fisik, gunakan USB Sound Card eksternal yang murah dan praktis.",
    biaya: { min: 100000, max: 350000 },
    komponen: ["Chip Audio Realtek Onboard", "Port Jack Audio 3.5mm", "Kondensator Filter Audio"],
    tips: ["Membeli sound card USB eksternal jauh lebih praktis dan murah daripada melakukan reparasi sirkuit onboard motherboard.", "Pastikan pengaturan output audio default di Windows sudah diarahkan ke port yang benar."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "10 menit",
    biayaMandiri: { min: 30000, max: 120000 },
    alat: [],
    bahan: [{ nama: "USB Sound Card Eksternal", estimasiHarga: "Rp 35.000" }],
    langkah: [
      { nomor: 1, judul: "Pasang Alat", detail: "Tancapkan USB Sound Card eksternal ke port USB PC Anda yang masih normal." },
      { nomor: 2, judul: "Colok Speaker", detail: "Hubungkan kabel jack 3.5mm dari speaker/headset ke lubang hijau (audio out) pada USB Sound Card tersebut." },
      { nomor: 3, judul: "Atur Default", detail: "Buka pengaturan suara di OS Windows, ubah default playback device ke 'USB Audio Device'." }
    ],
    peringatan: ["Gunakan port USB di bagian belakang motherboard (I/O shield) jika port USB casing depan kurang stabil.", "Pastikan volume speaker eksternal sudah diputar menyala."]
  },
  'P006': {
    explain: "### Analisis Kerusakan\nKerusakan pada sirkuit OS (Sistem Operasi) disebabkan oleh korupsi berkas inti sistem (system files) akibat infeksi virus/malware, bad sector drive penyimpanan, atau listrik mati mendadak saat update.\n\n### Mekanisme & Dampak Teknis\nHilangnya file pustaka dinamis (DLL) atau kerusakan bootloader (BCD) mencegah kernel Windows dimuat, sehingga sistem mengalami Blue Screen (BSOD) secara terus menerus.\n\n### Rekomendasi Tindakan\nLakukan perbaikan startup (Startup Repair). Jika tidak berhasil, lakukan instalasi ulang sistem operasi Windows secara bersih menggunakan media USB bootable.",
    biaya: { min: 100000, max: 250000 },
    komponen: ["Sistem Operasi Windows", "File Registry Windows", "Bootloader (BCD)"],
    tips: ["Mintalah instalasi Windows original versi resmi Microsoft, hindari versi modifikasi bajakan yang rawan disisipi malware.", "Selalu aktifkan fitur System Restore Point untuk pemulihan darurat."],
    waktu: "1-2 jam",
    kesulitan: "Sedang",
    waktuMandiri: "60 menit",
    biayaMandiri: { min: 0, max: 50000 },
    alat: [{ nama: "Flashdisk Minimal 8GB", fungsi: "Menjadi media installer Windows bootable" }, { nama: "PC Lain", fungsi: "Mengunduh file ISO resmi dan membuat bootable flashdisk" }],
    bahan: [{ nama: "Lisensi Key Windows 10/11", estimasiHarga: "Rp 250.000" }],
    langkah: [
      { nomor: 1, judul: "Buat Media Boot", detail: "Gunakan Windows Media Creation Tool pada PC lain untuk membuat flashdisk bootable Windows." },
      { nomor: 2, judul: "Pilih Boot Device", detail: "Tancapkan flashdisk ke PC bermasalah, hidupkan PC, tekan tombol Boot Menu (F12/F13), lalu pilih flashdisk." },
      { nomor: 3, judul: "Jalankan Instalasi", detail: "Ikuti instruksi instalasi, pilih partisi Drive C lama, format partisi tersebut, lalu instal ulang Windows di sana." }
    ],
    peringatan: ["Proses instalasi ulang akan menghapus semua data di Drive C. Pastikan file penting di desktop/documents sudah dibackup jika memungkinkan.", "Jangan mematikan PC di tengah proses instalasi."]
  },
  'P007': {
    explain: "### Analisis Kerusakan\nKerusakan file aplikasi software disebabkan oleh konflik file pustaka (conflict DLLs), kegagalan penulisan registry aplikasi, atau sisa file instalasi lama yang korup.\n\n### Mekanisme & Dampak Teknis\nSaat aplikasi dijalankan, instruksi prosesor tidak dapat diproses secara wajar karena data pustaka hilang, memicu status crash / Not Responding.\n\n### Rekomendasi Tindakan\nLakukan instalasi ulang (*reinstall*) aplikasi tersebut secara menyeluruh. Pastikan file instalasi lama dihapus bersih menggunakan Revo Uninstaller.",
    biaya: { min: 50000, max: 150000 },
    komponen: ["Registry Aplikasi", "File Eksekusi Software (.exe)"],
    tips: ["Gunakan perangkat lunak Revo Uninstaller untuk membersihkan seluruh sisa file dan registry aplikasi lama secara bersih.", "Pastikan spesifikasi minimum PC Anda memenuhi syarat aplikasi tersebut."],
    waktu: "1 jam",
    kesulitan: "Mudah",
    waktuMandiri: "20 menit",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [
      { nomor: 1, judul: "Uninstall Bersih", detail: "Buka Control Panel, pilih uninstall program, lalu pilih aplikasi yang bermasalah untuk dihapus." },
      { nomor: 2, judul: "Hapus File Sisa", detail: "Hapus folder instalasi aplikasi di dalam direktori C:\\Program Files atau AppData secara manual jika masih ada." },
      { nomor: 3, judul: "Instal Kembali", detail: "Jalankan file setup installer aplikasi yang baru, ikuti panduan instalasi hingga selesai, lalu restart komputer." }
    ],
    peringatan: ["Pastikan Anda mengunduh aplikasi dari sumber resmi terpercaya untuk menghindari sisipan program jahat.", "Tutup aplikasi background lain saat melakukan penginstalan."]
  },
  'P008': {
    explain: "### Analisis Kerusakan\nKerusakan Power Supply Unit (PSU) disebabkan oleh matinya transistor switching utama atau kerusakan kapasitor elektrolit filter primer akibat lonjakan tegangan listrik.\n\n### Mekanisme & Dampak Teknis\nTerputusnya sekring input (fuse) atau kerusakan kapasitor primer memutus total distribusi daya listrik AC 220V ke tegangan output DC 12V/5V/3.3V, menyebabkan PC mati total dan kipas mati.\n\n### Rekomendasi Tindakan\nGantilah PSU PC dengan unit baru yang berkualitas tinggi (minimal bersertifikasi 80 Plus Bronze). Jangan mencoba membongkar casing PSU karena berisiko sengatan listrik tegangan tinggi.",
    biaya: { min: 250000, max: 1200000 },
    komponen: ["Power Supply Unit (PSU)", "Kapasitor Utama PSU", "Fuse Proteksi Input"],
    tips: ["Jangan gunakan PSU bawaan casing yang murah tanpa rating keamanan bersertifikasi 80 Plus.", "Gunakan stabilizer listrik (AVR) atau UPS untuk melindungi komponen PC Anda dari fluktuasi listrik rumah."],
    waktu: "1 jam",
    kesulitan: "Mudah",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 200000, max: 950000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Buka baut sasis casing PC dan PSU" }, { nama: "Cable Ties (Pengikat)", fungsi: "Merapikan kabel-kabel PSU di dalam casing" }],
    bahan: [{ nama: "Power Supply Baru (e.g. 500W 80 Plus)", estimasiHarga: "Rp 500.000" }],
    langkah: [
      { nomor: 1, judul: "Cabut Kabel Daya", detail: "Matikan PC, cabut kabel stopkontak utama, buka penutup casing samping, lepaskan seluruh konektor kabel PSU dari motherboard (24-pin dan 8-pin), GPU, serta storage." },
      { nomor: 2, judul: "Lepas PSU Lama", detail: "Buka 4 sekrup pengunci PSU di bagian belakang casing PC, lalu keluarkan PSU secara hati-hati." },
      { nomor: 3, judul: "Pasang Baru", detail: "Masukkan PSU baru to dudukan casing, kencangkan 4 sekrup belakang, pasang kabel 24-pin ke motherboard, 8-pin ke CPU, dan daya ke komponen lainnya." }
    ],
    peringatan: ["Jangan pernah membuka penutup besi bagian dalam PSU, karena kapasitor utama di dalamnya tetap menyimpan muatan listrik tegangan tinggi yang mematikan meskipun kabel sudah dicabut.", "Pastikan arah kipas PSU menghadap ke sirkulasi udara luar yang benar."]
  },
  'P009': {
    explain: "### Analisis Kerusakan\nKerusakan pada unit prosesor (CPU) disebabkan oleh panas tinggi (overheating) ekstrem yang konstan atau kerusakan sirkuit silikon mikro internal chip (degradasi silikon) akibat lonjakan daya.\n\n### Mekanisme & Dampak Teknis\nDegradasi silikon mengganggu pengolahan instruksi biner mikro prosesor, memicu komputer no display (kipas berputar namun tidak POST BIOS) dan alarm BIOS berbunyi.\n\n### Rekomendasi Tindakan\nBawa PC ke teknisi untuk memastikan apakah kerusakan terjadi pada motherboard atau unit prosesor. Jika prosesor rusak, diperlukan penggantian unit prosesor baru yang kompatibel dengan soket motherboard Anda.",
    biaya: { min: 600000, max: 4000000 },
    komponen: ["CPU Processor Chip", "Soket CPU Motherboard", "Thermal Paste", "CPU Cooler Fan"],
    tips: ["Ganti thermal paste CPU setidaknya setahun sekali untuk menjaga suhu tetap rendah di bawah 80 derajat Celcius.", "Gunakan CPU cooler pihak ketiga yang lebih baik daripada cooler bawaan standar."],
    waktu: "1-2 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 500000, max: 3500000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka kipas cooler CPU" }, { nama: "Tisu & Alkohol Isopropil 99%", fungsi: "Membersihkan thermal paste lama" }],
    bahan: [{ nama: "Processor Baru", estimasiHarga: "Rp 1.500.000" }, { nama: "Thermal Paste Premium", estimasiHarga: "Rp 50.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas Cooler CPU", detail: "Buka sekrup atau klip pengunci cooler CPU, cabut kabel kipas, lalu angkat cooler secara perlahan." },
      { nomor: 2, judul: "Buka Pengunci Soket", detail: "Tekan tuas logam pengunci soket CPU di motherboard ke samping dan angkat ke atas, lalu angkat chip processor lama secara vertikal." },
      { nomor: 3, judul: "Pasang Baru", detail: "Posisikan processor baru di soket dengan memperhatikan tanda segitiga di sudut processor dan soket, turunkan tuas pengunci, oleskan thermal paste, lalu pasang kembali cooler." }
    ],
    peringatan: ["Kaki-kaki pin soket processor di motherboard sangat rapuh dan mudah bengkok. Jangan menyentuhnya dengan jari atau menjatuhkan benda di atasnya.", "Pastikan orientasi processor terpasang dengan benar."]
  },
  'P010': {
    explain: "### Analisis Kerusakan\nKapasitas memori RAM fisik tidak mencukupi untuk menampung seluruh proses data aktif aplikasi dan sistem operasi, memaksa Windows menggunakan memori virtual (Pagefile) di hard disk secara berlebihan.\n\n### Mekanisme & Dampak Teknis\nKarena kecepatan baca-tulis hard disk jauh lebih lambat daripada RAM, perpindahan data ke virtual memori (thrashing) menyebabkan performa sistem melambat secara ekstrem dan respon aplikasi macet.\n\n### Rekomendasi Tindakan\nLakukan penambahan kapasitas memori RAM fisik (upgrade RAM) dengan tipe (DDR3/DDR4/DDR5) dan frekuensi kecepatan (MHz) yang cocok dengan RAM lama Anda.",
    biaya: { min: 200000, max: 700000 },
    komponen: ["Modul RAM", "Sistem Virtual Memory (Pagefile)"],
    tips: ["Gunakan memori RAM berpasangan (dual channel) dengan kapasitas dan merk yang sama agar stabilitas performa sistem terjaga.", "Untuk komputasi Windows modern, kapasitas RAM minimal 8GB atau 16GB sangat direkomendasikan."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "15 menit",
    biayaMandiri: { min: 180000, max: 600000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka casing PC" }],
    bahan: [{ nama: "Keping RAM Baru (e.g. DDR4 8GB)", estimasiHarga: "Rp 300.000" }],
    langkah: [
      { nomor: 1, judul: "Buka Slot Kosong", detail: "Buka casing PC, temukan slot memori DIMM yang masih kosong di sebelah RAM lama." },
      { nomor: 2, judul: "Pasang Modul Baru", detail: "Posisikan lekukan pin RAM baru sejajar dengan tonjolan di slot memori motherboard." },
      { nomor: 3, judul: "Kunci RAM", detail: "Tekan RAM baru lurus ke bawah secara merata hingga kedua tuas pengunci slot naik dan berbunyi klik." }
    ],
    peringatan: ["Selalu matikan komputer dan cabut kabel power sebelum memasang modul RAM baru.", "Jangan memegang bagian kuningan emas RAM dengan tangan langsung."]
  },
  'P011': {
    explain: "### Analisis Kerusakan\nKapasitas memori video (VRAM) pada kartu grafis VGA terlalu kecil untuk menampung tekstur grafis resolusi tinggi dari game modern atau aplikasi rendering 3D.\n\n### Mekanisme & Dampak Teknis\nKeterbatasan kapasitas VRAM memaksa sistem mengalokasikan sebagian RAM utama sistem untuk membantu rendering grafis, sehingga frame rate (FPS) game turun drastis dan patah-patah (stuttering).\n\n### Rekomendasi Tindakan\nTurunkan pengaturan kualitas grafis, resolusi game, dan kualitas tekstur di dalam menu opsi game Anda. Solusi jangka panjang adalah dengan melakukan upgrade kartu grafis VGA yang memiliki kapasitas VRAM lebih besar.",
    biaya: { min: 500000, max: 3000000 },
    komponen: ["VRAM Video Memory VGA", "Resolusi Tekstur Grafis"],
    tips: ["Untuk kebutuhan game modern resolusi Full HD (1080p), kartu grafis dengan kapasitas VRAM minimal 4GB hingga 8GB sangat disarankan.", "Matikan fitur grafis berat seperti Ray Tracing jika VRAM Anda terbatas."],
    waktu: "1-2 jam",
    kesulitan: "Mudah",
    waktuMandiri: "10 menit",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [
      { nomor: 1, judul: "Buka Pengaturan Game", detail: "Masuk ke menu pengaturan display/grafis di dalam game yang sedang Anda mainkan." },
      { nomor: 2, judul: "Turunkan Tekstur", detail: "Ubah opsi Texture Quality dari High/Ultra menjadi Medium atau Low untuk meminimalkan beban VRAM." },
      { nomor: 3, judul: "Turunkan Resolusi", detail: "Turunkan resolusi display game (misal dari 4K ke 1080p) untuk meringankan pemrosesan grafis." }
    ],
    peringatan: ["Melakukan overclock pada VRAM yang terbatas tanpa sistem pendinginan yang memadai justru dapat merusak chip memori VGA secara permanen."]
  },
  'P012': {
    explain: "### Analisis Kerusakan\nFrekuensi clock rate (kecepatan kerja prosesor dalam GHz) prosesor terlalu rendah untuk memproses kalkulasi data instruksi aplikasi modern yang berat.\n\n### Mekanisme & Dampak Teknis\nKecepatan clock rate yang rendah menyebabkan antrean eksekusi instruksi di CPU menumpuk, menyebabkan utilisasi CPU (CPU Usage) melonjak cepat menjadi 100% dan kinerja sistem menjadi sangat lambat.\n\n### Rekomendasi Tindakan\nBatasi jumlah aplikasi background yang berjalan secara bersamaan dengan mematikannya lewat Task Manager. Solusi jangka panjang adalah dengan melakukan upgrade ke model prosesor yang memiliki clock rate dan jumlah core yang lebih tinggi.",
    biaya: { min: 500000, max: 4000000 },
    komponen: ["CPU Clock Speed (GHz)", "CPU Usage Task Manager"],
    tips: ["Gunakan fitur Task Manager (Ctrl + Shift + Esc) untuk mematikan aplikasi startup yang tidak penting untuk meringankan beban kerja prosesor.", "Hindari membuka terlalu banyak tab di browser internet secara bersamaan."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "5 menit",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [
      { nomor: 1, judul: "Buka Task Manager", detail: "Tekan tombol Ctrl + Shift + Esc pada keyboard untuk membuka jendela Task Manager Windows." },
      { nomor: 2, judul: "Matikan Proses Berat", detail: "Pilih tab Processes, cari aplikasi background yang menggunakan CPU tinggi, klik kanan lalu pilih End Task." },
      { nomor: 3, judul: "Atur Startup Apps", detail: "Masuk ke tab Startup, pilih aplikasi-aplikasi yang tidak penting, lalu ubah statusnya menjadi Disabled." }
    ],
    peringatan: ["Jangan mematikan proses sistem Windows (seperti System atau Svchost) karena dapat menyebabkan komputer crash atau BSOD mendadak."]
  },
  'P013': {
    explain: "### Analisis Kerusakan\nKerusakan pada kabel data bus penyimpanan (kabel SATA/IDE) disebabkan oleh serat tembaga internal yang putus akibat ditekuk secara ekstrem atau adanya korosi pada konektor logam akibat kelembapan casing.\n\n### Mekanisme & Dampak Teknis\nTerputusnya jalur transmisi data SATA/IDE menghentikan aliran sinyal komunikasi antara pengontrol motherboard dengan hard disk/SSD, sehingga penyimpanan tidak terdeteksi oleh BIOS saat menyala.\n\n### Rekomendasi Tindakan\nGantilah kabel data SATA dengan kabel baru yang tebal dan memiliki pelindung logam pengunci (metal latch). Hindari menekuk kabel secara tajam.",
    biaya: { min: 25000, max: 100000 },
    komponen: ["Kabel Data SATA", "Port SATA Motherboard", "Port SATA Harddisk/SSD"],
    tips: ["Pilihlah kabel SATA yang dilengkapi klip logam pengunci di kedua ujung konektornya agar tidak mudah longgar saat tergeser di dalam casing.", "Gunakan port SATA 1 atau 0 di motherboard untuk drive utama sistem operasi."],
    waktu: "30 menit",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "10 menit",
    biayaMandiri: { min: 10000, max: 35000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka penutup casing samping PC" }],
    bahan: [{ nama: "Kabel Data SATA Baru", estimasiHarga: "Rp 15.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas Kabel Lama", detail: "Buka penutup casing PC, tekan klip pengunci logam kabel SATA lama, lalu cabut kabel dari port motherboard dan hard disk." },
      { nomor: 2, judul: "Pasang Baru", detail: "Tancapkan salah satu ujung kabel data SATA baru ke port SATA di motherboard, lalu hubungkan ujung satunya ke hard disk/SSD." },
      { nomor: 3, judul: "Tes Booting", detail: "Pasang kembali penutup casing, nyalakan komputer, masuk ke menu BIOS (tekan Del/F2 saat menyala) untuk memastikan penyimpanan sudah terdeteksi." }
    ],
    peringatan: ["Pastikan kabel tidak terjepit oleh komponen kipas casing atau tertekan keras oleh kabel daya lainnya.", "Jangan mencolokkan kabel SATA saat PC sedang menyala."]
  },
  'P014': {
    explain: "### Analisis Kerusakan\nPenurunan kapasitas keluaran daya maksimum (daya Watt) pada PSU disebabkan oleh ausnya kapasitor elektrolit filter sekunder. PSU tidak mampu lagi menyuplai kebutuhan daya puncak komponen komputer secara stabil.\n\n### Mekanisme & Dampak Teknis\nSaat PC membutuhkan beban daya tinggi (seperti menyalakan GPU/Prosesor secara bersamaan saat boot), regulasi tegangan DC drop di bawah batas toleransi, memicu alarm bunyi bip BIOS dan hanya sebagian kipas yang berputar.\n\n### Rekomendasi Tindakan\nGantilah Power Supply Unit (PSU) Anda dengan unit baru yang memiliki kapasitas daya (Watt) lebih besar (misal 500W-650W) untuk memberikan ruang daya yang aman bagi seluruh komponen hardware Anda.",
    biaya: { min: 250000, max: 1200000 },
    komponen: ["Kapasitor Filter Sekunder PSU", "Regulator Tegangan Output", "Konektor Daya 12V EPS/PCIe"],
    tips: ["Hitung total konsumsi daya komponen PC Anda menggunakan web kalkulator daya online sebelum membeli PSU baru.", "Gunakan PSU dengan efisiensi bersertifikasi minimal 80 Plus Bronze."],
    waktu: "1 jam",
    kesulitan: "Mudah",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 250000, max: 950000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka baut sasis casing PC dan PSU" }],
    bahan: [{ nama: "Power Supply Baru dengan Watt Lebih Tinggi", estimasiHarga: "Rp 600.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas Kabel Lama", detail: "Matikan PC, cabut kabel stopkontak utama, lepaskan seluruh konektor kabel PSU dari motherboard (24-pin dan 8-pin), GPU, serta storage." },
      { nomor: 2, judul: "Lepas PSU Lama", detail: "Buka 4 sekrup pengunci PSU di bagian belakang casing PC, lalu keluarkan PSU secara hati-hati." },
      { nomor: 3, judul: "Pasang Baru", detail: "Masukkan PSU baru to dudukan casing, kencangkan 4 sekrup belakang, pasang kabel 24-pin ke motherboard, 8-pin ke CPU, dan daya ke komponen lainnya." }
    ],
    peringatan: ["Jangan pernah memodifikasi komponen dalam PSU secara mandiri.", "Pastikan kabel modular PSU terpasang sesuai portnya."]
  },
  'P015': {
    explain: "### Analisis Kerusakan\nKerusakan pada sirkuit port USB fisik atau kegagalan chip pengontrol USB Hub di motherboard disebabkan oleh korsleting arus mikro pada perangkat eksternal yang terhubung, atau korosi akibat kelembapan.\n\n### Mekanisme & Dampak Teknis\nKorsleting pada jalur kelistrikan data port USB memicu pengontrol motherboard menonaktifkan sirkuit USB Hub demi perlindungan sistem, menyebabkan port USB tidak mendeteksi perangkat eksternal sama sekali.\n\n### Rekomendasi Tindakan\nCoba hubungkan perangkat eksternal ke port USB di bagian belakang motherboard (I/O shield). Jika sirkuit USB onboard rusak permanen, Anda dapat memasang kartu ekspansi PCIe to USB Controller Card di slot PCIe kosong motherboard Anda.",
    biaya: { min: 100000, max: 350000 },
    komponen: ["Sirkuit Port USB Onboard", "Chip Pengontrol USB Hub Motherboard", "Kartu Ekspansi PCIe to USB"],
    tips: ["Hindari menggunakan USB Hub pasif tanpa adaptor daya tambahan jika menghubungkan banyak perangkat berat seperti hard disk eksternal.", "Bersihkan debu pada lubang port USB menggunakan udara bertekanan secara berkala."],
    waktu: "1 jam",
    kesulitan: "Mudah",
    waktuMandiri: "20 menit",
    biayaMandiri: { min: 80000, max: 180000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka casing PC dan sekrup bracket PCIe" }],
    bahan: [{ nama: "PCIe USB Expansion Card Baru", estimasiHarga: "Rp 120.000" }],
    langkah: [
      { nomor: 1, judul: "Pasang Kartu PCIe", detail: "Matikan PC, buka penutup casing samping, cari slot PCIe x1 yang kosong pada motherboard, lepaskan penutup metal casing belakang." },
      { nomor: 2, judul: "Tancapkan Kartu", detail: "Masukkan kartu ekspansi PCIe USB ke dalam slot PCIe secara perlahan lurus ke bawah, lalu sekrup bracket logamnya ke casing." },
      { nomor: 3, judul: "Tes Koneksi", detail: "Pasang casing kembali, hidupkan PC, pasang kabel mouse/flashdisk ke port USB baru untuk memastikan driver terpasang otomatis dan berfungsi." }
    ],
    peringatan: ["Jangan menyentuh bagian sirkuit emas kartu PCIe USB dengan tangan kotor/berminyak.", "Pastikan PC dalam kondisi mati total saat memasang."]
  },
  'P016': {
    explain: "### Analisis Kerusakan\nKerusakan pada keyboard disebabkan oleh terputusnya jalur matriks sirkuit karbon fleksibel akibat tumpahan air korosif, penumpukan debu tebal di bawah tombol, atau kegagalan kabel konektor USB.\n\n### Mekanisme & Dampak Teknis\nPutusnya sirkuit matriks karbon menghalangi pengiriman sinyal tombol keyboard ke sistem, menyebabkan karakter tombol tidak berfungsi saat ditekan.\n\n### Rekomendasi Tindakan\nBersihkan sela-sela tombol keyboard menggunakan kuas kering. Jika sirkuit karbon di dalam keyboard terbukti putus secara fisik, disarankan untuk mengganti keyboard dengan unit baru.",
    biaya: { min: 50000, max: 300000 },
    komponen: ["Matriks Sirkuit Karbon Keyboard", "Kabel Konektor USB Keyboard", "Kubah Karet Tombol (Rubber Dome)"],
    tips: ["Gunakan pelindung keyboard silikon untuk menghindari masuknya debu dan tumpahan cairan secara langsung.", "Simpan keyboard cadangan murah untuk keperluan pengetesan darurat."],
    waktu: "30 menit",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "5 menit",
    biayaMandiri: { min: 45000, max: 200000 },
    alat: [],
    bahan: [{ nama: "Keyboard USB Baru", estimasiHarga: "Rp 50.000" }],
    langkah: [
      { nomor: 1, judul: "Cabut Keyboard", detail: "Cabut konektor kabel USB keyboard lama dari port USB komputer Anda." },
      { nomor: 2, judul: "Pasang Baru", detail: "Hubungkan konektor USB keyboard baru ke port USB kosong komputer Anda secara presisi." },
      { nomor: 3, judul: "Uji Fungsi", detail: "Buka aplikasi Notepad di Windows, coba ketikkan seluruh karakter huruf dan angka untuk memastikan respon ketikan normal." }
    ],
    peringatan: ["Jangan menarik kabel USB keyboard secara paksa dari port komputer.", "Hindari menumpahkan cairan apapun di atas permukaan keyboard."]
  },
  'P017': {
    explain: "### Analisis Kerusakan\nKerusakan pada mouse disebabkan oleh melemahnya intensitas sensor dioda optik merah/inframerah, kerusakan mekanis sakelar klik tombol (microswitch clicker), atau kabel USB yang putus internal.\n\n### Mekanisme & Dampak Teknis\nLemahnya pemancar sensor optik mengganggu pembacaan pantulan cahaya sensor di atas permukaan pad, menyebabkan pointer kursor monitor macet atau tidak bergerak sama sekali.\n\n### Rekomendasi Tindakan\nPastikan permukaan mouse pad bersih dan tidak mengkilap. Jika sensor optik mati total atau tombol klik mengalami double-click konstan, disarankan untuk mengganti mouse dengan unit baru.",
    biaya: { min: 30000, max: 250000 },
    komponen: ["Sensor Optik Dioda Mouse", "Sakelar Klik (Microswitch)", "Kabel Konektor USB Mouse"],
    tips: ["Gunakan mousepad bertekstur kain gelap untuk mengoptimalkan keakuratan pembacaan sensor optik mouse.", "Hindari membenturkan mouse ke meja secara keras saat bermain game."],
    waktu: "30 menit",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "5 menit",
    biayaMandiri: { min: 25000, max: 150000 },
    alat: [],
    bahan: [{ nama: "Mouse USB Baru", estimasiHarga: "Rp 35.000" }],
    langkah: [
      { nomor: 1, judul: "Cabut Mouse Lama", detail: "Lepaskan konektor kabel USB mouse lama dari port USB komputer Anda." },
      { nomor: 2, judul: "Hubungkan Baru", detail: "Tancapkan konektor USB mouse baru to port USB kosong yang masih normal." },
      { nomor: 3, judul: "Uji Gerakan", detail: "Gerakkan mouse baru di atas mousepad, pastikan pointer kursor di layar merespon dengan lancar dan klik kiri/kanan normal." }
    ],
    peringatan: ["Jangan menekuk kabel USB mouse di dekat pangkal mouse terlalu tajam karena kawat tembaga halus di dalamnya mudah putus internal."]
  },
};

async function main() {
  console.log('Membaca data dari folder data/ ...');
  
  const gejalaLaptop = loadData('gejala/laptop.js', 'gejalaLaptop');
  const gejalaHP = loadData('gejala/hp.js', 'gejalaHP');
  const gejalaPC = loadData('gejala/pc.js', 'gejalaPC');
  
  const laptopRules = loadData('rules/laptop.js', 'laptopRules');
  const hpRules = loadData('rules/hp.js', 'hpRules');
  const pcRules = loadData('rules/pc.js', 'pcRules');
  const rules = [...laptopRules, ...hpRules, ...pcRules];

  console.log('Berhasil membaca file-file statis!');

  console.log('Menghapus data lama di database... ');
  await prisma.riwayat.deleteMany();
  await prisma.referensi.deleteMany();
  await prisma.ruleGejala.deleteMany();
  await prisma.rule.deleteMany();
  await prisma.gejala.deleteMany();
  await prisma.kerusakan.deleteMany();
  await prisma.perangkat.deleteMany();
  await prisma.aICache.deleteMany();

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
    const kerusakanId = `K-${r.id}`;

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
        // Gabungkan penerbit ke penulis jika ada agar tampil di UI
        const penulisFinal = ref.penerbit ? `${ref.penulis} - ${ref.penerbit}` : ref.penulis || null;
        // Gabungkan url dan relevansi dengan pemisah |||
        const urlKombinasi = ref.url && ref.relevansi ? `${ref.url}|||${ref.relevansi}` : ref.url || '';
        
        await prisma.referensi.create({
          data: {
            kerusakanId: kerusakanId,
            judul: ref.judul,
            penulis: penulisFinal,
            tahun: ref.tahun || null,
            url: urlKombinasi,
            sumber: 'statis'
          }
        });
      }
    }
  }

  console.log('Seeding AI Cache untuk semua kombinasi gejala (ukuran 1 s/d 4) ...');
  const crypto = require('crypto');

  // Helper untuk generate cache hash
  function generateCacheHash(type, perangkat, kerusakanId, gejalaIds) {
    const cleanType = (type || '').trim().toLowerCase();
    const cleanPerangkat = (perangkat || '').trim().toLowerCase();
    const cleanKerusakanId = (kerusakanId || '').trim();
    const sortedGejala = Array.isArray(gejalaIds) ? [...gejalaIds].sort() : [];
    const inputStr = `${cleanType}:${cleanPerangkat}:${cleanKerusakanId}:${JSON.stringify(sortedGejala)}`;
    return crypto.createHash('sha256').update(inputStr).digest('hex');
  }

  // Helper untuk generate kombinasi ukuran 1 s/d 4
  function getCombinations(array, maxLen) {
    const result = [];
    function helper(start, combo) {
      if (combo.length > 0) {
        result.push([...combo]);
      }
      if (combo.length === maxLen) {
        return;
      }
      for (let i = start; i < array.length; i++) {
        combo.push(array[i]);
        helper(i + 1, combo);
        combo.pop();
      }
    }
    helper(0, []);
    return result;
  }

  // Simulasi Rule Engine Sistem Pakar
  function diagnosaSim(perangkat, gejalaInputIds, rulesList) {
    const filteredRules = rulesList.filter((r) => r.perangkat === perangkat);
    const hasilDiagnosa = [];
    for (const rule of filteredRules) {
      const gejalaCocok = rule.gejalaIds.filter((id) => gejalaInputIds.includes(id));
      if (gejalaCocok.length > 0) {
        const proporsi = gejalaCocok.length / rule.gejalaIds.length;
        const cfAkhir = rule.certaintyFactor * Math.sqrt(proporsi);
        if (cfAkhir > 0.3) {
          hasilDiagnosa.push({
            ruleId: rule.id,
            kerusakan: {
              id: rule.id,
              nama: rule.kerusakan,
              deskripsi: rule.deskripsi
            },
            certaintyFactor: cfAkhir
          });
        }
      }
    }
    hasilDiagnosa.sort((a, b) => b.certaintyFactor - a.certaintyFactor);
    return hasilDiagnosa;
  }

  // Ambil list gejala unik per perangkat
  const uniqueGejalaIds = {
    laptop: [...new Set(gejalaLaptop.map(g => g.id))],
    hp: [...new Set(gejalaHP.map(g => g.id))],
    pc: [...new Set(gejalaPC.map(g => g.id))]
  };

  const cacheRecords = [];
  const processedHashes = new Set();

  for (const perangkat of ['laptop', 'hp', 'pc']) {
    const pGejalaIds = uniqueGejalaIds[perangkat];
    console.log(`Menghitung kombinasi gejala untuk perangkat: ${perangkat}...`);
    const combos = getCombinations(pGejalaIds, 4);
    console.log(`Ditemukan ${combos.length} kombinasi gejala untuk ${perangkat}. Memproses pencocokan sistem pakar...`);

    for (const combo of combos) {
      const hasil = diagnosaSim(perangkat, combo, rules);
      if (hasil.length > 0) {
        const primary = hasil[0];
        const rId = primary.ruleId;
        const kerusakanId = `K-${rId}`;
        const sortedGejala = [...combo].sort();
        const data = specificData[rId];

        if (!data) continue;

        // 1. AI Explain Cache
        const hashExplain = generateCacheHash('explain', perangkat, kerusakanId, sortedGejala);
        if (!processedHashes.has(hashExplain)) {
          processedHashes.add(hashExplain);
          const explanationObj = {
            penjelasan: data.explain,
            explanation: data.explain
          };
          cacheRecords.push({
            hash: hashExplain,
            type: 'explain',
            perangkat: perangkat,
            response: JSON.stringify(explanationObj)
          });
        }

        // 2. AI Servis Cache
        const hashServis = generateCacheHash('servis', perangkat, kerusakanId, sortedGejala);
        if (!processedHashes.has(hashServis)) {
          processedHashes.add(hashServis);
          const servisData = {
            estimasiBiaya: data.biaya,
            komponenDiperiksa: data.komponen,
            tipsCariServis: data.tips,
            estimasiWaktu: data.waktu
          };
          const servisObj = {
            data: servisData,
            guide: `### Panduan Membawa ke Pusat Servis: ${primary.kerusakan.nama}\n\n*Rekomendasi Diagnosa ALETHEIA:*\n\n1. **Estimasi Biaya Perbaikan**:\n   - Kisaran biaya: **Rp ${servisData.estimasiBiaya.min.toLocaleString('id-ID')} – Rp ${servisData.estimasiBiaya.max.toLocaleString('id-ID')}**\n   - Biaya bervariasi tergantung tipe sparepart asli.\n\n2. **Komponen yang Akan Diperiksa Teknisi**:\n${servisData.komponenDiperiksa.map(k => `   - ${k}`).join('\n')}\n\n3. **Tips Memilih Servis Terpercaya**:\n${servisData.tipsCariServis.map(t => `   - ${t}`).join('\n')}\n\n4. **Estimasi Waktu Pengerjaan**: ${servisData.estimasiWaktu}\n\n5. **Kelengkapan yang Harus Dibawa**:\n   - Unit utama perangkat\n   - Adaptor/charger original\n   - Backup data penting jika perangkat masih bisa menyala`
          };
          cacheRecords.push({
            hash: hashServis,
            type: 'servis',
            perangkat: perangkat,
            response: JSON.stringify(servisObj)
          });
        }

        // 3. AI Mandiri Cache
        const hashMandiri = generateCacheHash('mandiri', perangkat, kerusakanId, sortedGejala);
        if (!processedHashes.has(hashMandiri)) {
          processedHashes.add(hashMandiri);
          const mandiriData = {
            tingkatKesulitan: data.kesulitan,
            estimasiWaktu: data.waktuMandiri,
            estimasiBiayaTotal: data.biayaMandiri,
            alat: data.alat,
            bahan: data.bahan,
            langkah: data.langkah,
            peringatan: data.peringatan
          };
          const mandiriObj = {
            data: mandiriData,
            guide: data.kesulitan === 'Tidak Disarankan'
              ? `### Panduan Perbaikan Mandiri: ${primary.kerusakan.nama}\n\n**Tingkat Kesulitan**: Tidak Disarankan\n\n⚠️ **Peringatan Penting**:\nPerbaikan mandiri untuk jenis kerusakan ini sangat tidak disarankan karena membutuhkan keahlian solder mikro BGA tingkat lanjut dan alat hot air station presisi. Sangat disarankan membawa perangkat Anda langsung ke pusat servis tepercaya agar tidak merusak motherboard secara permanen.`
              : `### Panduan ${primary.ruleId === 'P007' || primary.ruleId === 'P008' || primary.ruleId === 'P010' || primary.ruleId === 'P011' || primary.ruleId === 'P012' ? 'Instalasi & Pengaturan' : 'Perbaikan'} Mandiri: ${primary.kerusakan.nama}\n\n**Tingkat Kesulitan**: ${mandiriData.tingkatKesulitan}\n**Estimasi Waktu**: ${mandiriData.estimasiWaktu}\n**Estimasi Biaya Material**: Rp ${mandiriData.estimasiBiayaTotal.min.toLocaleString('id-ID')} – Rp ${mandiriData.estimasiBiayaTotal.max.toLocaleString('id-ID')}\n\n**Alat yang Diperlukan**:\n${mandiriData.alat.map(a => `- **${a.nama}** — ${a.fungsi}`).join('\n')}\n\n**Bahan yang Diperlukan**:\n${mandiriData.bahan.map(b => `- **${b.nama}** (${b.estimasiHarga})`).join('\n')}\n\n**Langkah Pengerjaan**:\n${mandiriData.langkah.map(l => `${l.nomor}. **${l.judul}**: ${l.detail}`).join('\n')}\n\n**Peringatan**:\n${mandiriData.peringatan.map(p => `- ⚠️ ${p}`).join('\n')}`
          };
          cacheRecords.push({
            hash: hashMandiri,
            type: 'mandiri',
            perangkat: perangkat,
            response: JSON.stringify(mandiriObj)
          });
        }
      }
    }
  }

  console.log(`Memasukkan ${cacheRecords.length} record AI Cache ke database dalam beberapa batch...`);
  const chunkSize = 500;
  for (let i = 0; i < cacheRecords.length; i += chunkSize) {
    const chunk = cacheRecords.slice(i, i + chunkSize);
    console.log(`Memasukkan batch ${Math.floor(i / chunkSize) + 1} (${chunk.length} records)...`);
    await prisma.aICache.createMany({
      data: chunk,
      skipDuplicates: true
    });
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
