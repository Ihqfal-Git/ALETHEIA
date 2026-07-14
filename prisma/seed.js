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
    explain: "### Analisis Kerusakan\nKerusakan adapter disebabkan oleh kegagalan sirkuit Switching Mode Power Supply (SMPS) atau kerusakan fisik pada kabel DC. Kapasitor filter pada sirkuit sekunder sering mengalami kebocoran (leakage), menyebabkan output tegangan menjadi tidak stabil atau drop ketika laptop meminta beban daya tinggi.\n\n### Mekanisme & Dampak Teknis\nKegagalan ini biasanya diawali oleh kebocoran kapasitor filter sekunder yang membuat regulasi tegangan DC output berfluktuasi atau drop saat dibebani arus tinggi.\n\n### Rekomendasi Tindakan\nDisarankan untuk segera mengganti adaptor dengan spesifikasi voltase (V) dan ampere (A) yang identik untuk mencegah kerusakan sirkuit charging motherboard.",
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
    explain: "### Analisis Kerusakan\nBaterai laptop kehilangan kapasitas karena degradasi kimia sel Lithium-Ion akibat siklus pengisian (charge cycles) yang tinggi atau panas berlebih.\n\n### Mekanisme & Dampak Teknis\nPenurunan kesehatan baterai membuat Battery Management System (BMS) mengunci sirkuit pengisian untuk keamanan jika mendeteksi adanya sel baterai yang tidak seimbang (imbalance).\n\n### Rekomendasi Tindakan\nPenggantian sel baterai utuh direkomendasikan. Hindari menggunakan laptop tanpa baterai langsung ke charger karena rawan mati mendadak saat listrik padam.",
    biaya: { min: 350000, max: 950000 },
    komponen: ["Sel Baterai Li-Ion", "BMS Chip Controller", "Konektor Baterai Motherboard", "Thermal Sensor Baterai"],
    tips: ["Belilah baterai original atau OEM berkualitas tinggi bergaransi resmi.", "Gunakan aplikasi BatteryInfoView untuk memeriksa Battery Health sebelum membeli."],
    waktu: "1 hari",
    kesulitan: "Sedang",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 300000, max: 750000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka baut casing bawah laptop" }, { nama: "Spudger Plastik", fungsi: "Melepas konektor baterai dari motherboard" }],
    bahan: [{ nama: "Baterai Laptop Pengganti", estimasiHarga: "Rp 450.000" }],
    langkah: [
      { nomor: 1, judul: "Buka Casing", detail: "Matikan laptop, buka seluruh baut casing bawah, dan lepaskan casing bawah menggunakan spudger." },
      { nomor: 2, judul: "Putus Daya", detail: "Lepaskan konektor kabel baterai dari motherboard sebelum menyentuh komponen lain." },
      { nomor: 3, judul: "Ganti Baterai", detail: "Buka baut pengunci baterai lama, angkat baterai, lalu pasang baterai baru dan pasang kembali bautnya." }
    ],
    peringatan: ["Jangan menusuk atau membengkokkan baterai karena dapat memicu hubungan singkat dan kebakaran.", "Gunakan alat berbahan plastik (bukan logam) saat melepas konektor baterai."]
  },
  'L003': {
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
  'L004': {
    explain: "### Analisis Kerusakan\nOverheating terjadi karena thermal paste (media penghantar panas antara CPU/GPU ke heatsink) telah mengering sehingga transfer panas terhambat.\n\n### Mekanisme & Dampak Teknis\nAkumulasi kotoran debu yang menyumbat sirip heatsink tembaga dan kipas yang macet membuat sirkulasi udara dingin dari luar terhenti.\n\n### Rekomendasi Tindakan\nLakukan pembersihan debu secara rutin dan ganti thermal paste dengan kualitas premium (seperti Arctic MX-4) minimal setahun sekali.",
    biaya: { min: 100000, max: 250000 },
    komponen: ["Kipas Pendingin (Fan)", "Sirip Heatsink Tembaga", "Thermal Paste", "Sensor Termal CPU/GPU"],
    tips: ["Mintalah penggantian thermal paste berkualitas tinggi seperti Arctic MX-4 atau Noctua NT-H1.", "Pastikan kipas dibersihkan secara menyeluruh, bukan hanya disemprot angin."],
    waktu: "1-2 jam",
    kesulitan: "Sedang",
    waktuMandiri: "45-60 menit",
    biayaMandiri: { min: 45000, max: 120000 },
    alat: [{ nama: "Obeng Set & Spudger", fungsi: "Membuka casing dan melepas heatsink" }, { nama: "Kuas Kecil & Blower", fungsi: "Membersihkan debu tebal pada kipas" }],
    bahan: [{ nama: "Thermal Paste Berkualitas", estimasiHarga: "Rp 65.000" }, { nama: "Alkohol Isopropil 99%", estimasiHarga: "Rp 15.000" }],
    langkah: [
      { nomor: 1, judul: "Pelepasan Heatsink", detail: "Buka baut heatsink sesuai nomor urut yang tertera pada logam pelat pendingin CPU." },
      { nomor: 2, judul: "Pembersihan Sisa Paste", detail: "Bersihkan sisa thermal paste kering di atas CPU dan heatsink menggunakan alkohol dan cotton bud." },
      { nomor: 3, judul: "Pengaplikasian Baru", detail: "Oleskan thermal paste baru seukuran biji kacang di tengah CPU, lalu pasang kembali heatsink secara merata." }
    ],
    peringatan: ["Jangan mengoleskan thermal paste terlalu tebal karena justru akan menghambat pelepasan panas.", "Hati-hati saat melepas konektor kabel kipas agar jalurnya tidak putus."]
  },
  'L005': {
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
  'L006': {
    explain: "### Analisis Kerusakan\nKeyboard laptop rusak biasanya terjadi karena cairan yang tumpah korosif terhadap jalur sirkuit matriks karbon fleksibel.\n\n### Mekanisme & Dampak Teknis\nHal ini menyebabkan sirkuit tombol terputus atau terjadi hubungan singkat (short circuit) yang membuat tombol mengetik sendiri secara acak.\n\n### Rekomendasi Tindakan\nGanti modul keyboard baru. Jika terkena tumpahan air, segera matikan laptop, balikkan posisinya, dan lepaskan baterai.",
    biaya: { min: 200000, max: 550000 },
    komponen: ["Matriks Sirkuit Keyboard", "Kubah Karet (Rubber Dome)", "Kabel Fleksibel Ribbon", "Konektor ZIF Keyboard"],
    tips: ["Untuk laptop modern yang keyboard-nya menyatu dengan palmrest, penggantian membutuhkan waktu lebih lama.", "Pastikan layout tombol (US/UK) sesuai dengan kenyamanan mengetik Anda."],
    waktu: "1-3 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "60-90 menit",
    biayaMandiri: { min: 120000, max: 300000 },
    alat: [{ nama: "Obeng Set Lengkap", fungsi: "Membuka seluruh komponen laptop" }, { nama: "Prying Tool & Solder Plastik", fungsi: "Melepas rivet plastik penahan keyboard" }],
    bahan: [{ nama: "Keyboard Laptop Baru", estimasiHarga: "Rp 150.000" }],
    langkah: [
      { nomor: 1, judul: "Bongkar Total", detail: "Karena keyboard seringkali dipasang dari dalam, Anda perlu melepas motherboard dan baterai terlebih dahulu." },
      { nomor: 2, judul: "Lepas Keyboard Lama", detail: "Patahkan rivet plastik penahan keyboard secara hati-hati atau lepas baut penahan pelat seng keyboard." },
      { nomor: 3, judul: "Pasang Baru", detail: "Tempatkan keyboard baru, kencangkan menggunakan baut/solder rivet plastik, lalu pasang kembali motherboard." }
    ],
    peringatan: ["Kabel fleksibel keyboard sangat tipis dan mudah sobek, pasang konektor dengan sangat hati-hati.", "Gunakan isolator pelindung bawaan agar sirkuit keyboard tidak menyentuh motherboard."]
  },
  'L007': {
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
  'L008': {
    explain: "### Analisis Kerusakan\nModul WiFi (WLAN Card) rusak akibat lonjakan arus mikro atau korosi pada kontak pin PCIe akibat paparan kelembapan.\n\n### Mekanisme & Dampak Teknis\nHal ini memutus jalur komunikasi frekuensi radio nirkabel antara antena internal laptop dan adapter jaringan motherboard.\n\n### Rekomendasi Tindakan\nGantilah modul WiFi PCIe card. Sebagai alternatif cepat, Anda dapat menggunakan USB WiFi adapter eksternal yang murah dan praktis.",
    biaya: { min: 150000, max: 350000 },
    komponen: ["WiFi/Bluetooth Combo Card", "Kabel Antena Koaksial", "Slot M.2/PCIe Mini Motherboard"],
    tips: ["Pertimbangkan membeli modul yang mendukung standar WiFi 6 (Intel AX200) untuk konektivitas modern.", "Pastikan kedua kabel antena koaksial terpasang dengan kuat pada terminalnya."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "20 menit",
    biayaMandiri: { min: 80000, max: 180000 },
    alat: [{ nama: "Obeng Presisi & Pinset", fungsi: "Membuka baut pengunci WiFi card dan menjepit konektor antena" }],
    bahan: [{ nama: "Card WiFi Intel / Realtek Baru", estimasiHarga: "Rp 120.000" }],
    langkah: [
      { nomor: 1, judul: "Lokalisasi Modul", detail: "Buka casing bawah laptop dan temukan modul WiFi kecil dengan dua kabel koaksial tipis terhubung." },
      { nomor: 2, judul: "Lepas Antena", detail: "Gunakan pinset untuk mencungkil konektor logam bulat emas antena koaksial secara tegak lurus ke atas." },
      { nomor: 3, judul: "Ganti Modul", detail: "Buka baut pengunci modul WiFi, tarik modul keluar dari slot M.2, masukkan modul baru, pasang baut, dan pasang kembali kabel antena." }
    ],
    peringatan: ["Konektor kabel antena koaksial sangat rapuh, jangan dipaksa ditekan jika posisinya belum lurus dengan pin terminal.", "Pastikan nomor kabel antena terpasang ke terminal yang benar (Main / Aux)."]
  },
  'L009': {
    explain: "### Analisis Kerusakan\nTouchpad tidak merespon karena ausnya sensor kapasitif pada pelat touchpad, korosi pada jalur kabel fleksibel, atau tekanan dari baterai laptop yang kembung di bawah touchpad.\n\n### Mekanisme & Dampak Teknis\nBaterai yang kembung tepat di bawah touchpad akan mendesak pelat sentuh ke atas, mengunci microswitch klik fisik sehingga tidak bisa ditekan.\n\n### Rekomendasi Tindakan\nBuka casing bawah untuk memeriksa apakah baterai kembung. Jika baterai aman, lakukan pembersihan konektor kabel FFC atau ganti pelat touchpad.",
    biaya: { min: 150000, max: 400000 },
    komponen: ["Pelat Touchpad Kapasitif", "Kabel Fleksibel Ribbon FFC", "Tombol Klik Fisik (Microswitch)"],
    tips: ["Pastikan kerusakan bukan karena touchpad dinonaktifkan melalui tombol shortcut keyboard (Fn).", "Periksa apakah ada baterai kembung di bawah touchpad sebelum membeli suku cadang pengganti."],
    waktu: "1-2 jam",
    kesulitan: "Sedang",
    waktuMandiri: "45 menit",
    biayaMandiri: { min: 80000, max: 200000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka casing bawah dan sekrup pengunci touchpad" }, { nama: "Spudger Plastik", fungsi: "Membuka klip kabel fleksibel" }],
    bahan: [{ nama: "Touchpad Laptop Pengganti", estimasiHarga: "Rp 110.000" }],
    langkah: [
      { nomor: 1, judul: "Akses Area", detail: "Buka casing bawah, lepaskan baterai utama terlebih dahulu karena touchpad berada langsung di bawah baterai." },
      { nomor: 2, judul: "Buka Pengunci", detail: "Lepaskan kabel fleksibel touchpad dari konektor ZIF motherboard, lalu buka baut penyangga pelat touchpad." },
      { nomor: 3, judul: "Penggantian", detail: "Angkat touchpad lama, tempatkan touchpad baru, kencangkan baut pengunci dengan tingkat kerapatan yang pas, lalu pasang kembali baterai." }
    ],
    peringatan: ["Jangan menyekrup touchpad terlalu kencang karena dapat membuat tombol klik fisik tertekan terus-menerus.", "Gunakan spudger plastik saat mencungkil kabel fleksibel."]
  },
  'L010': {
    explain: "### Analisis Kerusakan\nKerusakan speaker disebabkan oleh robeknya membran kerucut speaker akibat volume tinggi terus-menerus, masuknya kotoran besi magnetik, atau putusnya kumparan suara (voice coil).\n\n### Mekanisme & Dampak Teknis\nRobeknya membran atau putusnya kumparan suara (voice coil) memicu timbulnya suara pecah, bergetar kencang, atau mati total.\n\n### Rekomendasi Tindakan\nGanti speaker sebagai satu set (kiri dan kanan) agar output suara seimbang kembali. Hindari mengatur volume maksimal dalam jangka panjang.",
    biaya: { min: 100000, max: 300000 },
    komponen: ["Membran Speaker", "Kumparan Suara (Voice Coil)", "Magnet Neodymium", "Kabel Konektor Audio"],
    tips: ["Ganti speaker sebagai satu set (kiri dan kanan) agar output suara seimbang.", "Uji speaker baru dengan memutar audio berfrekuensi rendah (bass) untuk memastikan suara tidak pecah."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 50000, max: 150000 },
    alat: [{ nama: "Obeng Presisi Set", fungsi: "Membuka casing laptop and sekrup speaker" }, { nama: "Spudger Plastik", fungsi: "Melepas jalur kabel speaker dari pemandu casing" }],
    bahan: [{ nama: "Set Speaker Laptop Baru", estimasiHarga: "Rp 75.000" }],
    langkah: [
      { nomor: 1, judul: "Lokalisasi", detail: "Buka casing bawah laptop dan temukan modul speaker di sisi kiri dan kanan bawah." },
      { nomor: 2, judul: "Lepas Jalur", detail: "Lepaskan konektor kabel speaker dari motherboard, lalu keluarkan kabel dari jalur rute casing secara perlahan." },
      { nomor: 3, judul: "Pemasangan", detail: "Lepaskan speaker lama, pasang set speaker baru pada posisinya, rute kabel sesuai jalur bawaan, pasang konektor motherboard." }
    ],
    peringatan: ["Rute kabel speaker harus rapi dan masuk ke jalurnya agar kabel tidak terjepit atau tertekan saat casing bawah ditutup.", "Jangan menekan membran speaker yang rapuh."]
  },

  // ================= HP =================
  'H001': {
    explain: "### Analisis Kerusakan\nBaterai handphone kembung akibat penumpukan gas sisa reaksi kimia elektrolit lithium-ion yang terdegradasi.\n\n### Mekanisme & Dampak Teknis\nSecara teknis, penumpukan gas ini terjadi karena sirkuit pembatas pengisian daya di dalam baterai (PCM) gagal mendeteksi batas tegangan atas (overvoltage), memicu pemanasan berlebih pada sel baterai dan dekomposisi cairan elektrolit menjadi gas hidrogen/karbon dioksida.\n\n### Rekomendasi Tindakan\nSegera ganti baterai untuk menghindari risiko meledak atau merusak panel LCD dari dalam akibat tekanan fisik baterai kembung.",
    biaya: { min: 150000, max: 450000 },
    komponen: ["Sel Baterai Li-Po", "Sirkuit PCM Baterai", "Konektor Flex Baterai", "Double Tape Perekat Baterai"],
    tips: ["Gunakan baterai bersertifikasi resmi dan hindari bermain HP saat sedang dicharge.", "Mintalah perekat baterai khusus saat penggantian agar baterai tidak bergeser di dalam casing."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30-45 menit",
    biayaMandiri: { min: 100000, max: 300000 },
    alat: [{ nama: "Obeng Pentalobe/Phillips & Spudger", fungsi: "Membuka casing HP" }, { nama: "Suction Cup & Hairdryer", fungsi: "Melunakkan lem perekat casing belakang" }],
    bahan: [{ nama: "Baterai HP Baru", estimasiHarga: "Rp 150.000" }, { nama: "Perekat Baterai (Adhesive)", estimasiHarga: "Rp 10.000" }],
    langkah: [
      { nomor: 1, judul: "Panaskan Casing", detail: "Panaskan casing belakang menggunakan hairdryer selama 3 menit untuk melunakkan lem." },
      { nomor: 2, judul: "Buka Casing", detail: "Tempelkan suction cup, tarik perlahan, masukkan prying pick plastik ke sela casing, dan geser memutar." },
      { nomor: 3, judul: "Ganti Baterai", detail: "Lepaskan pelindung konektor baterai, cabut konektor, tarik pita perekat baterai (pull tabs), angkat baterai lama, dan pasang yang baru." }
    ],
    peringatan: ["Jangan mencungkil baterai menggunakan alat logam tajam karena dapat memicu ledakan kimia jika bocor.", "Gunakan alkohol isopropil untuk membantu melunakkan perekat baterai."]
  },
  'H002': {
    explain: "### Analisis Kerusakan\nKerusakan LCD HP umumnya disebabkan oleh keretakan fisik pada lapisan kaca panel AMOLED/IPS akibat benturan, atau putusnya jalur kabel fleksibel layar.\n\n### Mekanisme & Dampak Teknis\nKeretakan jalur sirkuit eDP mikro di dalam panel menghentikan distribusi sinyal gambar, menyebabkan layar blank hitam atau muncul garis warna.\n\n### Rekomendasi Tindakan\nGanti modul LCD assembly secara utuh. Pasang pelindung layar tempered glass untuk perlindungan benturan di masa mendatang.",
    biaya: { min: 350000, max: 2500000 },
    komponen: ["LCD/AMOLED Assembly", "IC Display Controller", "Kabel Fleksibel Konektor Layar", "Double Tape Frame"],
    tips: ["Untuk layar AMOLED, harga komponen jauh lebih mahal dibanding IPS. Pastikan garansi pengetesan sebelum layar dilem.", "Gunakan pelindung layar tempered glass berkualitas setelah perbaikan selesai."],
    waktu: "2-3 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "60 menit",
    biayaMandiri: { min: 250000, max: 1500000 },
    alat: [{ nama: "Prying Tool & Suction Cup", fungsi: "Melepas layar lama dari frame" }, { nama: "Klem Penjepit LCD", fungsi: "Menekan layar saat proses pengeleman" }],
    bahan: [{ nama: "LCD Assembly Baru", estimasiHarga: "Rp 350.000" }, { nama: "Lem LCD T7000 / B7000", estimasiHarga: "Rp 25.000" }],
    langkah: [
      { nomor: 1, judul: "Bongkar Casing", detail: "Bongkar casing HP dan lepaskan konektor baterai serta konektor fleksibel LCD lama." },
      { nomor: 2, judul: "Lepas LCD Lama", detail: "Panaskan pinggiran layar LCD, congkil menggunakan prying pick, bersihkan sisa lem lama pada frame logam." },
      { nomor: 3, judul: "Pengeleman Baru", detail: "Oleskan lem LCD secara merata pada frame, pasang konektor LCD baru, rekatkan LCD ke frame, lalu jepit menggunakan klem selama 1 jam." }
    ],
    peringatan: ["Selalu tes fungsi layar (sentuh dan kecerahan) secara menyeluruh sebelum mengaplikasikan lem permanen.", "Jangan menekan bagian tengah layar LCD dengan keras."]
  },
  'H003': {
    explain: "### Analisis Kerusakan\nIC Power (PMIC) mengalami kerusakan akibat arus pendek karena tegangan charger yang melonjak tidak stabil, atau panas berlebih pada sirkuit internal IC.\n\n### Mekanisme & Dampak Teknis\nKerusakan pada sirkuit internal PMIC memutus suplai tegangan utama (seperti VPH_PWR) ke prosesor dan memori sehingga HP mati total.\n\n### Rekomendasi Tindakan\nBawa ke teknisi ahli micro-soldering untuk penggantian chip IC Power. Selalu gunakan kepala charger original berkualitas tinggi.",
    biaya: { min: 300000, max: 800000 },
    komponen: ["Chip PMIC (IC Power)", "Kapasitor VPH_PWR Rail", "Induktor Power", "Motherboard"],
    tips: ["Kerusakan IC Power membutuhkan keahlian micro-soldering BGA. Mintalah teknisi yang berpengalaman di bidang mesin.", "Selalu gunakan charger original untuk melindungi chip daya handphone."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi (Hanya untuk profesional)",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Perbaikan mandiri untuk kerusakan IC Power sangat tidak disarankan karena membutuhkan mesin blower udara panas khusus dan mikroskop servis."]
  },
  'H004': {
    explain: "### Analisis Kerusakan\nTouchscreen rusak akibat retaknya jalur konduktor transparan indium tin oxide (ITO) pada lapisan digitizer kaca depan.\n\n### Mekanisme & Dampak Teknis\nGangguan pada sirkuit digitizer ini memutus deteksi muatan statis jari tangan, memicu ghost touch atau mati total di sebagian area layar.\n\n### Rekomendasi Tindakan\nJika kaca depan terpisah, Anda bisa mengganti glass digitizer-nya saja. Namun, ganti satu set LCD lebih disarankan demi kerapian.",
    biaya: { min: 250000, max: 700000 },
    komponen: ["Digitizer Kaca Sentuh", "IC Touchscreen Controller", "Kabel Fleksibel Touchscreen"],
    tips: ["Bandingkan biaya penggantian touchscreen saja dengan penggantian satu set LCD utuh. Seringkali satu set LCD lebih direkomendasikan.", "Mintalah pengujian ghost touch sebelum menandatangani bukti penyerahan barang."],
    waktu: "2-3 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "60 menit",
    biayaMandiri: { min: 100000, max: 400000 },
    alat: [{ nama: "Prying Tool & Suction Cup", fungsi: "Melepas layar lama dari frame" }, { nama: "Klem Penjepit LCD", fungsi: "Menekan layar saat proses pengeleman" }],
    bahan: [{ nama: "Touchscreen / LCD Baru", estimasiHarga: "Rp 180.000" }, { nama: "Lem LCD T7000 / B7000", estimasiHarga: "Rp 25.000" }],
    langkah: [
      { nomor: 1, judul: "Bongkar HP", detail: "Buka casing belakang, lepaskan konektor baterai, dan lepaskan modul layar dari frame logam." },
      { nomor: 2, judul: "Uji Layar Baru", detail: "Hubungkan kabel fleksibel layar baru ke motherboard tanpa mengelemnya terlebih dahulu, lalu hidupkan HP dan tes ketikan layar." },
      { nomor: 3, judul: "Pemasangan", detail: "Oleskan lem LCD di sekeliling bezel frame, tempelkan layar baru dengan presisi, jepit dengan klem hingga kering." }
    ],
    peringatan: ["Gunakan lem secukupnya agar tidak meluber ke dalam backlight LCD yang dapat menyebabkan bercak putih.", "Matikan HP sebelum memasang konektor."]
  },
  'H005': {
    explain: "### Analisis Kerusakan\nModul kamera rusak akibat putusnya kumparan voice coil motor (VCM) autofocus karena guncangan keras, atau lensa luar yang retak.\n\n### Mekanisme & Dampak Teknis\nKerusakan pada VCM membuat lensa kamera tidak bisa bergeser fokus, menyebabkan hasil foto buram, tidak fokus, atau kamera blank hitam.\n\n### Rekomendasi Tindakan\nGanti modul kamera internal yang sesuai dengan tipe HP Anda. Jaga lensa luar agar tetap bersih.",
    biaya: { min: 200000, max: 750000 },
    komponen: ["Modul Kamera Belakang/Depan", "Konektor Flex Kamera", "Kaca Pelindung Lensa Belakang"],
    tips: ["Pastikan lensa pelindung luar dibersihkan secara menyeluruh sebelum memasang modul kamera baru.", "Minta teknisi menunjukkan hasil jepretan kamera baru pada kondisi minim cahaya."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 100000, max: 400000 },
    alat: [{ nama: "Obeng Phillips HP", fungsi: "Membuka baut penutup motherboard" }, { nama: "Pinset Presisi", fungsi: "Melepas modul kamera dari soketnya" }],
    bahan: [{ nama: "Modul Kamera Pengganti", estimasiHarga: "Rp 220.000" }],
    langkah: [
      { nomor: 1, judul: "Akses Mesin", detail: "Buka casing belakang dan lepaskan penutup plastik mesin utama yang menutupi soket kamera." },
      { nomor: 2, judul: "Lepas Kamera", detail: "Gunakan spudger plastik untuk mencungkil konektor fleksibel kamera lama ke atas, lalu angkat kamera." },
      { nomor: 3, judul: "Pasang Baru", detail: "Tempatkan modul kamera baru ke dalam dudukannya, tekan konektor koaksialnya ke soket motherboard hingga berbunyi klik." }
    ],
    peringatan: ["Jangan pernah menyentuh lensa kaca kamera baru dengan jari telanjang karena sidik jari akan meninggalkan noda permanen.", "Gunakan pinset dengan sangat hati-hati agar tidak merusak komponen kecil di sekitar soket."]
  },
  'H006': {
    explain: "### Analisis Kerusakan\nSpeaker HP rusak umumnya disebabkan oleh membran sobek akibat volume suara terlalu kencang, atau kotoran besi magnetik yang mengunci getaran membran.\n\n### Mekanisme & Dampak Teknis\nSerpihan logam magnetik mengunci getaran membran speaker, menyebabkan suara terdengar pecah, sangat pelan, atau mati total.\n\n### Rekomendasi Tindakan\nBersihkan lubang speaker menggunakan kuas halus terlebih dahulu. Jika membran terbukti sobek, lakukan penggantian modul speaker.",
    biaya: { min: 100000, max: 250000 },
    komponen: ["Modul Loudspeaker", "Kabel Konektor Audio", "Pin Kontak Motherboard"],
    tips: ["Pastikan kerusakan bukan karena lubang speaker tersumbat oleh debu tebal. Kadang pembersihan dengan sikat gigi kering sudah cukup.", "Ganti modul speaker original agar kualitas audio kembali jernih."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "25 menit",
    biayaMandiri: { min: 40000, max: 120000 },
    alat: [{ nama: "Obeng Phillips HP", fungsi: "Membuka sekrup modul speaker di bagian bawah HP" }, { nama: "Spudger Plastik", fungsi: "Mencungkil modul speaker dari casing" }],
    bahan: [{ nama: "Modul Speaker HP Baru", estimasiHarga: "Rp 60.000" }],
    langkah: [
      { nomor: 1, judul: "Bongkar Bawah", detail: "Buka casing belakang, lalu buka baut penutup papan charger (sub-board) di bagian bawah HP tempat speaker berada." },
      { nomor: 2, judul: "Ganti Speaker", detail: "Angkat modul speaker lama yang biasanya menyatu dengan plastik penutup bawah, lalu pasang modul speaker baru." },
      { nomor: 3, judul: "Tutup Kembali", detail: "Kencangkan sekrup penutup bawah, pasang casing belakang, dan tes suara menggunakan nada dering." }
    ],
    peringatan: ["Pastikan pin kontak logam pada speaker sejajar dengan pin kontak pada papan sirkuit sebelum sekrup dikencangkan.", "Jangan menggunakan cairan pembersih berlebihan di dekat jalur sirkuit."]
  },
  'H007': {
    explain: "### Analisis Kerusakan\nKelemahan penangkapan sinyal disebabkan oleh terputusnya kabel antena koaksial internal HP atau kerusakan sirkuit IC RF Transceiver.\n\n### Mekanisme & Dampak Teknis\nKerusakan pada IC RF mengganggu modulasi dan amplifikasi frekuensi radio seluler, memicu status sinyal 'No Service' atau 'Panggilan Darurat'.\n\n### Rekomendasi Tindakan\nMintalah teknisi memeriksa sambungan kabel antena koaksial internal terlebih dahulu sebelum memutuskan mengganti IC RF utama.",
    biaya: { min: 250000, max: 650000 },
    komponen: ["IC RF Transceiver", "Kabel Antena Koaksial", "Lempengan Kontak Antena Casing"],
    tips: ["Mintalah teknisi memeriksa kabel antena koaksial internal terlebih dahulu sebelum memutuskan mengganti IC RF.", "Pastikan IMEI HP terdaftar di Kemenperin jika sinyal tiba-tiba hilang total setelah update software."],
    waktu: "1-2 hari",
    kesulitan: "Sangat Tinggi (Hanya untuk profesional)",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Kerusakan IC RF membutuhkan keahlian solder BGA tingkat lanjut dan alat hot air station presisi, tidak disarankan untuk perbaikan mandiri."]
  },
  'H008': {
    explain: "### Analisis Kerusakan\nPort Charger rusak akibat patahnya lidah pin kuningan di dalam port Type-C/Micro USB karena colokan charger yang dipaksa masuk terbalik.\n\n### Mekanisme & Dampak Teknis\nKorosi akibat cairan di saku celana juga dapat menghambat aliran arus pengisian daya dan memutuskan jalur transfer data ke PC.\n\n### Rekomendasi Tindakan\nGantilah satu set papan sasis sub-board charger bawah. Pengeleman casing belakang harus rapat setelah proses perbaikan selesai.",
    biaya: { min: 150000, max: 350000 },
    komponen: ["Port USB Type-C / Micro USB", "Papan Charger (Sub-board)", "Konektor Flex Utama", "Microphone Internal Sub-board"],
    tips: ["Lebih baik mengganti satu set papan charger (sub-board) daripada hanya menyolder ulang port USB-nya saja, karena pengerjaan jauh lebih cepat dan minim resiko.", "Gunakan kabel charger yang masih presisi setelah perbaikan agar port baru awet."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 50000, max: 150000 },
    alat: [{ nama: "Obeng Phillips HP", fungsi: "Membuka penutup bawah casing" }, { nama: "Pinset & Spudger", fungsi: "Melepas kabel fleksibel utama dan antena dari sub-board" }],
    bahan: [{ nama: "Papan Charger Baru (Sub-board)", estimasiHarga: "Rp 70.000" }],
    langkah: [
      { nomor: 1, judul: "Buka Sub-board", detail: "Buka sekrup penutup bawah HP, cabut kabel fleksibel utama dan kabel antena koaksial dari sub-board." },
      { nomor: 2, judul: "Ganti Board", detail: "Angkat sub-board lama secara perlahan, pasang sub-board baru pada posisi yang pas di dalam sasis." },
      { nomor: 3, judul: "Hubungkan Kembali", detail: "Pasang kembali kabel fleksibel utama dan tekan kabel antena ke soketnya hingga mengunci, lalu rakit kembali casing." }
    ],
    peringatan: ["Sub-board biasanya juga berisi microphone utama. Pastikan karet pelindung mic bawaan dipindahkan ke sub-board baru agar suara telpon tidak mendengung.", "Jangan menarik kabel antena secara paksa."]
  },
  'H009': {
    explain: "### Analisis Kerusakan\nSensor proximity rusak akibat tertutupnya kaca sensor oleh debu halus di dalam sasis, pergeseran karet sil, atau kerusakan sirkuit inframerah.\n\n### Mekanisme & Dampak Teknis\nHal ini membuat sensor inframerah tidak bisa membedakan jarak objek dengan akurat, sehingga layar tidak mati saat HP ditempelkan ke telinga.\n\n### Rekomendasi Tindakan\nBersihkan area sensor dari kotoran atau ganti kabel fleksibel sensor atas yang baru bila chip pemancar inframerahnya rusak.",
    biaya: { min: 150000, max: 300000 },
    komponen: ["Sensor Proximity / Ambient Light Module", "Karet Sil Sensor (Gasket)", "Kabel Fleksibel Sensor Atas"],
    tips: ["Seringkali masalah terjadi hanya karena tempered glass yang menutupi sensor di atas layar. Coba lepas tempered glass terlebih dahulu.", "Pastikan karet sil sensor terpasang dengan pas untuk mencegah kebocoran cahaya latar."],
    waktu: "1-2 jam",
    kesulitan: "Tinggi",
    waktuMandiri: "45 menit",
    biayaMandiri: { min: 50000, max: 150000 },
    alat: [{ nama: "Obeng Phillips HP", fungsi: "Membuka penutup mesin atas" }, { nama: "Pinset & Prying Pick", fungsi: "Membuka casing belakang dan melepas baterai" }],
    bahan: [{ nama: "Kabel Fleksibel Sensor Baru", estimasiHarga: "Rp 65.000" }],
    langkah: [
      { nomor: 1, judul: "Bongkar Mesin Atas", detail: "Buka casing belakang, lepaskan konektor baterai, buka penutup atas motherboard untuk mengakses area earpiece." },
      { nomor: 2, judul: "Ganti Sensor", detail: "Cari kabel fleksibel sensor dekat earpiece, gunakan pinset untuk mencungkilnya secara perlahan dari perekat layar." },
      { nomor: 3, judul: "Pasang Baru", detail: "Rekatkan sensor baru, pastikan karet sil terpasang melingkari mata sensor inframerah dengan presisi, lalu pasang konektor." }
    ],
    peringatan: ["Jika karet sil sensor tidak dipasang kembali, sensor proximity tidak akan bekerja (layar tetap mati saat menelepon).", "Jangan membersihkan sensor inframerah menggunakan alkohol berlebihan."]
  },
  'H010': {
    explain: "### Analisis Kerusakan\nChip memori eMMC/UFS mengalami bad sector parah akibat panas berlebih (thermal stress) atau umur pakai siklus tulis-baca sel memori yang habis (worn out).\n\n### Mekanisme & Dampak Teknis\nBerkas sistem operasi Android yang korup di dalam partisi memori menyebabkan prosesor gagal memuat kernel, memicu bootloop parah.\n\n### Rekomendasi Tindakan\nLakukan penulisan ulang firmware menggunakan box pemrogram (flashing). Jika chip mati total, diperlukan penggantian chip eMMC baru.",
    biaya: { min: 400000, max: 950000 },
    komponen: ["Chip IC eMMC / UFS Memory", "IC CPU / Processor (Reballing)", "Motherboard Mainboard"],
    tips: ["Penggantian eMMC/UFS membutuhkan penulisan ulang firmware (flashing partitions) menggunakan box sifter UFI. Cari spesialis software HP.", "Selalu lakukan backup data secara berkala ke cloud sebelum chip memori terkunci total (brick)."],
    waktu: "2-3 hari",
    kesulitan: "Sangat Tinggi (Hanya untuk profesional)",
    waktuMandiri: "Tidak Disarankan",
    biayaMandiri: { min: 0, max: 0 },
    alat: [],
    bahan: [],
    langkah: [],
    peringatan: ["Perbaikan mandiri untuk kerusakan eMMC tidak disarankan karena membutuhkan alat pemrogram partisi chip (UFI Box) dan keahlian soldering BGA."]
  },

  // ================= PC =================
  'P001': {
    explain: "### Analisis Kerusakan\nPower Supply Unit (PSU) rusak disebabkan oleh jebolnya kapasitor primer besar (leaking capacitor) akibat lonjakan tegangan listrik PLN, atau matinya sirkuit pengatur tegangan PWM.\n\n### Mekanisme & Dampak Teknis\nKerusakan ini memutus jalur distribusi daya utama 12V, 5V, dan 3.3V ke motherboard, membuat PC tidak mau menyala sama sekali.\n\n### Rekomendasi Tindakan\nGantilah PSU dengan unit baru bersertifikasi minimal 80 Plus. Jangan mencoba memperbaiki PSU secara mandiri karena berisiko sengatan listrik tinggi.",
    biaya: { min: 250000, max: 1200000 },
    komponen: ["Power Supply Unit (PSU)", "Kabel Daya Utama 24-Pin", "Kapasitor Elektrolit Utama PSU", "Kipas Pendingin PSU"],
    tips: ["Hindari membeli PSU murah tanpa sertifikasi efisiensi 80 Plus. PSU buruk dapat merusak motherboard dan kartu grafis Anda.", "Gunakan UPS (Uninterruptible Power Supply) untuk mencegah kerusakan akibat mati lampu mendadak."],
    waktu: "1 jam",
    kesulitan: "Mudah",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 200000, max: 900000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka baut pengunci PSU ke sasis casing PC" }, { nama: "Pengikat Kabel (Cable Ties)", fungsi: "Merapikan kabel PSU baru di dalam casing" }],
    bahan: [{ nama: "PSU Baru (e.g. 500W 80 Plus)", estimasiHarga: "Rp 550.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas Kabel", detail: "Matikan PC, cabut kabel daya stopkontak, buka penutup casing samping PC, lalu lepaskan semua konektor kabel PSU dari motherboard, GPU, dan storage." },
      { nomor: 2, judul: "Lepas PSU", detail: "Buka 4 sekrup pengunci PSU di bagian belakang casing PC, lalu tarik PSU keluar secara perlahan." },
      { nomor: 3, judul: "Pasang Baru", detail: "Masukkan PSU baru, kencangkan 4 sekrup belakang, hubungkan konektor 24-pin ke motherboard, konektor 8-pin ke CPU, dan konektor daya GPU/SATA." }
    ],
    peringatan: ["Jangan pernah membuka casing PSU internal karena di dalamnya tersimpan muatan listrik tegangan tinggi berbahaya meskipun kabel sudah dicabut.", "Pastikan semua konektor kabel terpasang dengan erat dan klik."]
  },
  'P002': {
    explain: "### Analisis Kerusakan\nRAM kotor disebabkan oleh penumpukan debu halus yang menghambat pin konduktor memori, atau sirkuit logika modul memori mati akibat lonjakan listrik dinamis.\n\n### Mekanisme & Dampak Teknis\nPenumpukan debu memutus kontak jalur bus data memori dengan slot DIMM motherboard, menggagalkan proses POST sistem (PC berbunyi bip).\n\n### Rekomendasi Tindakan\nBersihkan pin kuningan RAM menggunakan penghapus pensil hingga mengkilap, lalu bersihkan slot DIMM di motherboard dengan semprotan contact cleaner.",
    biaya: { min: 200000, max: 800000 },
    komponen: ["Modul Memori RAM (DDR4/DDR5)", "Slot DIMM Motherboard"],
    tips: ["Bersihkan pin kuningan RAM menggunakan penghapus pensil secara searah hingga mengkilap sebelum memutuskan membelinya.", "Gunakan slot memori nomor 2 dan 4 (dual channel) untuk performa optimal pada motherboard dual slot."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "15 menit",
    biayaMandiri: { min: 5000, max: 15005 },
    alat: [{ nama: "Penghapus Karet Pensil", fungsi: "Mengikis oksidasi pada kaki pin RAM" }, { nama: "Cairan Pembersih Kontak (Contact Cleaner)", fungsi: "Membersihkan debu di dalam slot DIMM motherboard" }],
    bahan: [{ nama: "Kuas Halus", estimasiHarga: "Rp 5.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas RAM", detail: "Matikan PC, buka penutup samping casing, tekan klip pengunci slot RAM di motherboard ke bawah, lalu tarik RAM ke atas." },
      { nomor: 2, judul: "Pembersihan", detail: "Gosok pin kuningan RAM menggunakan penghapus karet secara perlahan di kedua sisi. Semprot slot RAM dengan contact cleaner." },
      { nomor: 3, judul: "Pemasangan", detail: "Masukkan RAM kembali ke slotnya secara merata, lalu tekan ke bawah hingga klip pengunci berbunyi klik dan mengunci otomatis." }
    ],
    peringatan: ["Sentuh bagian luar casing PC logam sebelum memegang RAM untuk menetralisir listrik statis tubuh Anda.", "Pastikan tonjolan slot sejajar dengan lekukan pada pin RAM."]
  },
  'P003': {
    explain: "### Analisis Kerusakan\nKerusakan VGA (GPU) umumnya diakibatkan oleh pecahnya solder ball (retak solder mikro) di bawah chip GPU akibat panas berlebih yang konstan.\n\n### Mekanisme & Dampak Teknis\nHal ini menyebabkan output gambar ke monitor terganggu (muncul artefak garis) atau PC crash saat menjalankan game berat.\n\n### Rekomendasi Tindakan\nLakukan penggantian thermal paste VGA secara berkala. Jika kartu grafis rusak parah, lakukan penggantian kartu grafis baru.",
    biaya: { min: 400000, max: 3000000 },
    komponen: ["Chip GPU Core (BGA)", "Chip VRAM Memori", "Sirkuit VRM GPU", "Kipas Pendingin GPU (Cooling Fan)"],
    tips: ["Hindari membeli VGA bekas pertambangan kripto (crypto mining) tanpa garansi yang jelas.", "Pastikan driver kartu grafis selalu diperbarui untuk mencegah crash software."],
    waktu: "1-2 hari",
    kesulitan: "Tinggi",
    waktuMandiri: "30 menit",
    biayaMandiri: { min: 350000, max: 2000000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka sekrup bracket VGA di casing" }],
    bahan: [{ nama: "VGA Card Pengganti Baru", estimasiHarga: "Rp 1.500.000" }],
    langkah: [
      { nomor: 1, judul: "Pelepasan Kabel GPU", detail: "Buka baut pengunci VGA di bracket belakang casing, tekan tuas pengunci PCIe slot ke bawah, lepaskan kabel power PCIe 6/8-pin." },
      { nomor: 2, judul: "Lepas VGA", detail: "Tarik kartu grafis secara perlahan lurus ke atas keluar dari motherboard." },
      { nomor: 3, judul: "Pasang Baru", detail: "Tancapkan kartu grafis baru ke slot PCIe utama, dorong hingga tuas mengunci, pasang sekrup bracket, lalu colok kabel power PCIe." }
    ],
    peringatan: ["Jangan mencabut kartu grafis saat PC sedang menyala.", "Pastikan power supply PC memiliki daya yang cukup untuk menyuplai kartu grafis baru."]
  },
  'P004': {
    explain: "### Analisis Kerusakan\nHDD/SSD mengalami kegagalan fungsi akibat habisnya batas siklus penulisan data (TBW) pada chip memori Flash NAND SSD, atau ausnya head pembaca piringan mekanik HDD.\n\n### Mekanisme & Dampak Teknis\nHal ini mengacaukan pembacaan tabel partisi master boot record (MBR) sistem operasi Windows, menyebabkan sistem booting sangat lambat atau error.\n\n### Rekomendasi Tindakan\nPindahkan file sistem operasi Anda ke SSD M.2 NVMe baru untuk mempercepat booting dan transfer data secara signifikan.",
    biaya: { min: 250000, max: 900000 },
    komponen: ["Flash NAND Controller SSD", "Platter Mekanik HDD", "Kabel Data SATA", "Kabel Daya SATA PSU"],
    tips: ["Pindahkan file sistem operasi Windows ke SSD M.2 NVMe untuk mempercepat waktu booting hingga 10 kali lipat.", "Selalu periksa kesehatan penyimpanan berkala menggunakan software Hard Disk Sentinel."],
    waktu: "2 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "25 menit",
    biayaMandiri: { min: 200000, max: 700000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka sasis casing samping dan melepas sekrup storage" }],
    bahan: [{ nama: "SSD M.2 NVMe Baru", estimasiHarga: "Rp 380.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas Storage Lama", detail: "Buka sekrup bracket penyimpanan pada casing, lepaskan kabel data dan kabel power SATA dari hardisk lama." },
      { nomor: 2, judul: "Pasang Baru", detail: "Pasang SSD/Hardisk baru pada bracket sasis, hubungkan kabel data SATA ke motherboard dan kabel power SATA dari PSU." },
      { nomor: 3, judul: "Jika M.2 NVMe", detail: "Jika menggunakan slot NVMe, masukkan chip SSD M.2 langsung ke slot motherboard dengan kemiringan 30 derajat, tekan ke bawah, lalu kencangkan sekrup pengunci kecilnya." }
    ],
    peringatan: ["Jangan menyentuh bagian pin konektor emas SSD M.2 dengan jari kotor.", "Kencangkan sekrup M.2 secukupnya agar papan sirkuit SSD tidak melengkung."]
  },
  'P005': {
    explain: "### Analisis Kerusakan\nMotherboard bermasalah akibat sirkuit pintas pada jalur tembaga PCB karena debu konduktif lembab, meledaknya kapasitor VRM, atau korosi pada socket pin processor.\n\n### Mekanisme & Dampak Teknis\nKerusakan VRM mengganggu regulasi suplai tegangan ke prosesor (VCORE), mengakibatkan PC tiba-tiba mati atau hang konstan.\n\n### Rekomendasi Tindakan\nGantilah motherboard dengan socket prosesor dan tipe memori (DDR4/DDR5) yang sesuai dengan komponen lama Anda.",
    biaya: { min: 500000, max: 2000000 },
    komponen: ["Papan Motherboard Utama (PCB)", "Socket CPU LGA / AM4", "Chipset Utama", "VRM Circuit & Capacitor"],
    tips: ["Pastikan chipset dan tipe socket CPU didukung penuh oleh processor lama Anda agar tidak perlu membeli processor baru.", "Gunakan pasta pendingin processor baru saat memindahkan CPU ke motherboard baru."],
    waktu: "1-2 hari",
    kesulitan: "Tinggi",
    waktuMandiri: "90-120 menit",
    biayaMandiri: { min: 500000, max: 1500000 },
    alat: [{ nama: "Obeng Phillips Magnetik", fungsi: "Membuka baut motherboard di dalam casing" }, { nama: "Pinset & Spudger", fungsi: "Mengatur kabel header casing depan" }],
    bahan: [{ nama: "Motherboard Baru", estimasiHarga: "Rp 850.000" }, { nama: "Thermal Paste CPU", estimasiHarga: "Rp 50.000" }],
    langkah: [
      { nomor: 1, judul: "Pembongkaran Total", detail: "Cabut semua komponen yang melekat pada motherboard lama: RAM, VGA, CPU, HSF, dan kabel PSU." },
      { nomor: 2, judul: "Lepas Motherboard", detail: "Buka semua sekrup motherboard ke standoff casing, angkat motherboard keluar secara perlahan." },
      { nomor: 3, judul: "Pemasangan Baru", detail: "Pasang I/O shield di belakang casing, letakkan motherboard baru di atas standoff, pasang sekrup pengikat, lalu rakit kembali CPU." }
    ],
    peringatan: ["Perhatikan posisi pin panel depan (Front Panel Header) agar tombol power menyala dengan benar.", "Pastikan sekrup standoff casing terpasang agar tidak korsleting."]
  },
  'P006': {
    explain: "### Analisis Kerusakan\nOverheat CPU disebabkan oleh thermal paste yang mengering, sehingga tidak ada media konduksi panas antara processor dengan heatsink tembaga kipas pendingin.\n\n### Mekanisme & Dampak Teknis\nAkibatnya, suhu CPU melonjak cepat melewati batas aman (thermal throttling), memicu motherboard mematikan daya PC secara mendadak.\n\n### Rekomendasi Tindakan\nBersihkan sisa pasta kering dengan alkohol, oleskan thermal paste baru secara merata, dan pastikan kipas pendingin berputar normal.",
    biaya: { min: 100000, max: 350000 },
    komponen: ["Kipas Pendingin CPU (HSF/AIO)", "Thermal Paste", "Pelat Tembaga Heatsink"],
    tips: ["Uji kinerja kipas pendingin CPU Anda di program BIOS. Pastikan kecepatan rotasi (RPM) berputar normal di atas 1500 RPM.", "Bersihkan sirip radiator heatsink menggunakan hembusan angin kompresor atau kuas."],
    waktu: "1 jam",
    kesulitan: "Sedang",
    waktuMandiri: "30-45 menit",
    biayaMandiri: { min: 50000, max: 150000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka pengunci kipas HSF dari motherboard" }, { nama: "Kuas & Tisu Kering", fungsi: "Membersihkan sisa pasta kering" }],
    bahan: [{ nama: "Thermal Paste Premium", estimasiHarga: "Rp 65.000" }, { nama: "Cairan Isopropil Alkohol", estimasiHarga: "Rp 15.000" }],
    langkah: [
      { nomor: 1, judul: "Lepas HSF", detail: "Matikan PC, buka sekrup atau klip pemutar pengunci HSF di motherboard, cabut kabel fan header, angkat kipas." },
      { nomor: 2, judul: "Bersihkan Pasta", detail: "Teteskan alkohol pada tisu, gosok permukaan CPU dan dasar tembaga HSF hingga mengkilap tanpa sisa pasta lama." },
      { nomor: 3, judul: "Oleskan Baru", detail: "Teteskan thermal paste baru di tengah permukaan CPU, pasang kembali HSF secara lurus agar pasta merata." }
    ],
    peringatan: ["Jangan menggores permukaan logam CPU saat membersihkan pasta kering.", "Pastikan kipas HSF terpasang rata dan menyentuh CPU dengan kencang."]
  },
  'P007': {
    explain: "### Analisis Kerusakan\nKerusakan sistem operasi Windows terjadi karena hilangnya berkas sistem akibat pemadaman listrik tiba-tiba saat registrasi sistem diperbarui, file system32 korup oleh virus, atau bad sector pada sektor partisi bootloader.\n\n### Mekanisme & Dampak Teknis\nHal ini membuat bootloader Windows gagal memuat konfigurasi driver, memicu pesan error layar biru (BSOD) secara terus-menerus.\n\n### Rekomendasi Tindakan\nLakukan perbaikan sistem (startup repair) atau instal ulang Windows versi resmi dari media installer flashdisk bootable.",
    biaya: { min: 100000, max: 250000 },
    komponen: ["Sistem Operasi Windows (Registry)", "Tabel Partisi Bootloader", "Driver Perangkat Keras"],
    tips: ["Mintalah instalasi Windows versi original dengan lisensi resmi, bukan versi modifikasi yang rawan malware.", "Always aktifkan Windows Defender untuk perlindungan berkala."],
    waktu: "1-2 jam",
    kesulitan: "Sedang",
    waktuMandiri: "60 menit",
    biayaMandiri: { min: 0, max: 50000 },
    alat: [{ nama: "Flashdisk Minimal 8GB", fungsi: "Menjadi media installer Windows bootable" }, { nama: "PC / Laptop Lain", fungsi: "Membuat installer menggunakan Windows Media Creation Tool" }],
    bahan: [{ nama: "Lisensi Windows Key Resmi", estimasiHarga: "Rp 250.000" }],
    langkah: [
      { nomor: 1, judul: "Buat Installer", detail: "Unduh file ISO Windows resmi dari Microsoft, gunakan Rufus untuk membakar file tersebut ke flashdisk." },
      { nomor: 2, judul: "Boot ke Flashdisk", detail: "Tancapkan flashdisk ke PC, nyalakan PC, tekan tombol Boot Menu (F12/F11/F8), lalu pilih flashdisk." },
      { nomor: 3, judul: "Instalasi", detail: "Ikuti panduan di layar, format partisi sistem lama (biasanya Drive C), pilih partisi kosong tersebut, lalu jalankan instalasi." }
    ],
    peringatan: ["Instalasi ulang akan menghapus semua file di Drive C. Pastikan Anda melakukan backup data.", "Jangan mencabut flashdisk saat proses instalasi sedang berjalan."]
  },
  'P008': {
    explain: "### Analisis Kerusakan\nBaterai CMOS kehabisan tegangan akibat usia pakai baterai kimia lithium yang habis (biasanya 3-5 tahun).\n\n### Mekanisme & Dampak Teknis\nKetiadaan tegangan penyokong memori CMOS membuat chip RAM BIOS kehilangan pengaturan waktu dan konfigurasi boot drive setiap kali PC mati.\n\n### Rekomendasi Tindakan\nGantilah baterai kancing CMOS dengan tipe CR2032 yang baru. Atur ulang waktu dan urutan boot drive di menu BIOS.",
    biaya: { min: 25000, max: 75000 },
    komponen: ["Baterai CMOS CR2032", "Soket Baterai Motherboard", "Chip BIOS ROM"],
    tips: ["Gunakan baterai kancing tipe CR2032 tepercaya seperti Panasonic untuk keawetan jangka panjang.", "Setelah diganti, pastikan Anda masuk ke BIOS untuk mengatur ulang jam dan urutan boot drive."],
    waktu: "15 menit",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "10 menit",
    biayaMandiri: { min: 5000, max: 15000 },
    alat: [{ nama: "Pinset / Obeng Minus Kecil", fungsi: "Menekan klip pengunci baterai CMOS di motherboard" }],
    bahan: [{ nama: "Baterai Kancing CR2032 Baru", estimasiHarga: "Rp 7.000" }],
    langkah: [
      { nomor: 1, judul: "Temukan Baterai", detail: "Buka casing samping PC, cari baterai kancing bulat perak berkilau di atas motherboard." },
      { nomor: 2, judul: "Pelepasan", detail: "Gunakan obeng minus kecil untuk menekan klip penahan logam kecil di sisi soket baterai hingga baterai keluar." },
      { nomor: 3, judul: "Pemasangan", detail: "Tekan baterai baru ke dalam soket hingga berbunyi klik." }
    ],
    peringatan: ["Matikan PC dan cabut kabel stopkontak sebelum menyentuh baterai CMOS.", "Jangan gunakan alat tajam yang dapat menusuk jalur motherboard."]
  },
  'P009': {
    explain: "### Analisis Kerusakan\nKetidakstabilan kelistrikan terjadi akibat ausnya sirkuit transistor pada PSU atau terjadinya kebocoran sirkuit VRM pada motherboard.\n\n### Mekanisme & Dampak Teknis\nHal ini membuat tegangan rail 12V berfluktuasi melewati batas toleransi sasis motherboard, memaksa PC melakukan restart otomatis.\n\n### Rekomendasi Tindakan\nGunakan stabilizer tegangan (AVR) atau UPS untuk menyuplai daya PC dengan aman. Periksa kondisi kelistrikan rumah Anda.",
    biaya: { min: 300000, max: 1500000 },
    komponen: ["Power Supply Unit (PSU)", "Sirkuit VRM Motherboard", "Kapasitor Motherboard"],
    tips: ["Gunakan stabilizer tegangan (AVR) atau UPS untuk melindungi PC Anda jika listrik rumah sering naik-turun.", "Minta teknisi mengukur tegangan output PSU menggunakan tester PSU khusus."],
    waktu: "1-2 hari",
    kesulitan: "Tinggi",
    waktuMandiri: "60 menit",
    biayaMandiri: { min: 250000, max: 800000 },
    alat: [{ nama: "Obeng Phillips Set", fungsi: "Membuka baut penutup casing PC dan PSU" }, { nama: "Multimeter Digital", fungsi: "Menguji kestabilan arus kelistrikan" }],
    bahan: [{ nama: "Power Supply Unit Berkualitas Baru", estimasiHarga: "Rp 600.000" }],
    langkah: [
      { nomor: 1, judul: "Deteksi Awal", detail: "Gunakan PSU cadangan yang normal untuk mencoba menyalakan PC. Jika normal, berarti masalah ada pada PSU lama." },
      { nomor: 2, judul: "Penggantian PSU", detail: "Lepaskan semua kabel daya PSU lama, buka sekrup casing belakang, keluarkan PSU." },
      { nomor: 3, judul: "Instalasi Baru", detail: "Masukkan PSU baru, kencangkan baut belakang, hubungkan semua kabel daya ke motherboard." }
    ],
    peringatan: ["Jangan mencoba memperbaiki sirkuit bagian dalam PSU secara mandiri.", "Gunakan kabel bawaan PSU baru, jangan mencampur kabel modular PSU lain."]
  },
  'P010': {
    explain: "### Analisis Kerusakan\nKabel VGA/HDMI bermasalah karena putusnya serat tembaga halus di dalam kabel akibat ditekuk berlebihan, atau rusaknya pin konektor.\n\n### Mekanisme & Dampak Teknis\nKabel yang terputus menghentikan transmisi sinyal data piksel gambar dari GPU ke monitor, memicu pesan error 'No Signal'.\n\n### Rekomendasi Tindakan\nGantilah dengan kabel HDMI atau DisplayPort berkualitas yang memiliki pelindung nilon kepang. Hindari menekuk kabel berlebihan.",
    biaya: { min: 50000, max: 300000 },
    komponen: ["Kabel HDMI / VGA / DisplayPort", "Konektor Port Motherboard/GPU", "Konektor Port Monitor"],
    tips: ["Belilah kabel HDMI dengan pelindung nilon anyam (braided cable) agar awet.", "Pastikan sekrup pengencang kabel VGA terpasang rapat pada monitor jika kabel sering goyang."],
    waktu: "15 menit",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "5 menit",
    biayaMandiri: { min: 35000, max: 150000 },
    alat: [],
    bahan: [{ nama: "Kabel HDMI / DisplayPort Baru", estimasiHarga: "Rp 50.000" }],
    langkah: [
      { nomor: 1, judul: "Pelepasan Kabel", detail: "Cabut kabel display lama dari port belakang monitor dan port belakang VGA/GPU di PC." },
      { nomor: 2, judul: "Pemasangan", detail: "Tancapkan ujung kabel baru ke port GPU PC secara presisi, lalu colok ujung satunya ke monitor." },
      { nomor: 3, judul: "Pengaturan", detail: "Nyalakan PC dan monitor, pastikan input source di monitor diatur ke port yang sesuai (misal HDMI 1)." }
    ],
    peringatan: ["Jangan mencolokkan kabel display ke port motherboard jika PC Anda menggunakan VGA/GPU diskret.", "Jangan menekuk kabel secara tajam."]
  },
  'P011': {
    explain: "### Analisis Kerusakan\nKegagalan audio PC terjadi karena chip kode audio di motherboard mengalami kerusakan short sirkuit, rusaknya port jack audio 3.5mm akibat aus, atau korupnya berkas driver audio.\n\n### Mekanisme & Dampak Teknis\nHal ini membuat Windows tidak mendeteksi perangkat output speaker, menyebabkan ikon suara bertanda silang merah dan audio mati total.\n\n### Rekomendasi Tindakan\nInstal ulang driver audio Realtek resmi. Jika chip onboard rusak, Anda dapat menggunakan USB Sound Card eksternal yang murah.",
    biaya: { min: 100000, max: 400000 },
    komponen: ["Chip Audio Realtek Onboard", "Port Jack Audio 3.5mm", "Driver Audio Realtek HD", "Sound Card PCIe / USB"],
    tips: ["Membeli Sound Card USB eksternal murah jauh lebih praktis dan murah daripada mengganti chip audio onboard.", "Pastikan driver audio diperbarui di device manager jika perangkat tidak terdeteksi."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "15 menit",
    biayaMandiri: { min: 30000, max: 120000 },
    alat: [],
    bahan: [{ nama: "Soundcard USB Eksternal", estimasiHarga: "Rp 35.000" }],
    langkah: [
      { nomor: 1, judul: "Pemasangan Alat", detail: "Tancapkan soundcard USB eksternal ke port USB PC yang kosong." },
      { nomor: 2, judul: "Hubungkan Speaker", detail: "Colokkan kabel jack 3.5mm speaker ke lubang hijau (audio out) di soundcard USB tersebut." },
      { nomor: 3, judul: "Atur Output", detail: "Ubah output audio utama ke perangkat USB Audio Device di pengaturan Windows." }
    ],
    peringatan: ["Pastikan volume speaker eksternal sudah dinyalakan sebelum melakukan pengetesan.", "Gunakan port USB yang stabil."]
  },
  'P012': {
    explain: "### Analisis Kerusakan\nPort ethernet rusak akibat sambaran petir tidak langsung melalui kabel jaringan LAN, patahnya pin tembaga di dalam port RJ-45, atau rusaknya chip kontroler LAN.\n\n### Mekanisme & Dampak Teknis\nKerusakan ini memutus sambungan sinyal ethernet fisik dari modem/router, sehingga PC tidak dapat terhubung ke internet menggunakan kabel.\n\n### Rekomendasi Tindakan\nPasang PCIe LAN Card eksternal pada motherboard atau gunakan USB to RJ-45 LAN Adapter sebagai solusi praktis yang murah.",
    biaya: { min: 100000, max: 350000 },
    komponen: ["Port RJ-45 Ethernet Onboard", "LAN Controller Chip", "LAN Card PCIe / USB"],
    tips: ["Menggunakan USB to LAN Adapter atau PCIe LAN Card eksternal adalah solusi terbaik jika port bawaan motherboard rusak.", "Pastikan kabel LAN Anda dipasang dengan konektor RJ-45 yang kokoh."],
    waktu: "1 jam",
    kesulitan: "Sangat Mudah",
    waktuMandiri: "15 menit",
    biayaMandiri: { min: 50000, max: 150000 },
    alat: [],
    bahan: [{ nama: "LAN Card USB / PCIe Baru", estimasiHarga: "Rp 75.000" }],
    langkah: [
      { nomor: 1, judul: "Sambungkan Alat", detail: "Pasang LAN Card USB ke port USB kosong PC Anda." },
      { nomor: 2, judul: "Colok Kabel LAN", detail: "Tancapkan kabel internet LAN RJ-45 ke lubang port baru hingga berbunyi klik." },
      { nomor: 3, judul: "Cek Indikator", detail: "Pastikan lampu indikator port baru berkedip menandakan adanya transfer data." }
    ],
    peringatan: ["Selalu cabut kabel LAN dari PC saat terjadi badai petir besar.", "Gunakan driver bawaan jika adapter tidak langsung terdeteksi."]
  }
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

  console.log(`Memasukkan ${cacheRecords.length} record AI Cache ke database...`);
  await prisma.aICache.createMany({
    data: cacheRecords,
    skipDuplicates: true
  });

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
