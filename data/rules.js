export const rules = [
  // ================= LAPTOP =================
  {
    id: 'L001',
    perangkat: 'laptop',
    kerusakan: 'Adapter / Charger Rusak',
    deskripsi: 'Adapter tidak mampu mengalirkan daya ke motherboard. Charger sudah rusak pada komponen kapasitor atau terputusnya kabel.',
    gejalaIds: ['L01', 'L06'],
    certaintyFactor: 0.85,
    referensiStatis: [
      { judul: 'Kecerdasan Buatan', penulis: 'Sutojo, T., Mulyanto, E., Suhartono, V.', tahun: 2011, penerbit: 'Andi Offset', relevansi: 'Metode Forward Chaining sistem pakar' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Gejala kerusakan adapter daya laptop' }
    ]
  },
  {
    id: 'L002',
    perangkat: 'laptop',
    kerusakan: 'Baterai Rusak / Drop',
    deskripsi: 'Sel baterai telah kehilangan kemampuannya menyimpan daya. Baterai tidak bisa dicharge dan laptop mati bila charger dicabut.',
    gejalaIds: ['L02', 'L03', 'L04'],
    certaintyFactor: 0.90,
    referensiStatis: [
      { judul: 'Decision Support Systems', penulis: 'Turban, E.', tahun: 2005, penerbit: 'Prentice Hall', relevansi: 'Pengambilan keputusan diagnosa hardware' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Identifikasi sel baterai drop' }
    ]
  },
  {
    id: 'L003',
    perangkat: 'laptop',
    kerusakan: 'RAM Kotor atau Rusak',
    deskripsi: 'Pin kuningan pada RAM kotor atau modul RAM mengalami kerusakan bad block sehingga sistem gagal post atau sering blue screen.',
    gejalaIds: ['L07', 'L13'],
    certaintyFactor: 0.80,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Rule-based sistem memori' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Pembersihan dan penggantian RAM' }
    ]
  },
  {
    id: 'L004',
    perangkat: 'laptop',
    kerusakan: 'Overheating (Panas Berlebih)',
    deskripsi: 'Sistem pendingin tidak berjalan baik, entah karena kipas tertutup debu kotor atau thermal paste mengering. Memicu mati mendadak demi keselamatan komponen.',
    gejalaIds: ['L05', 'L15', 'L16'],
    certaintyFactor: 0.95,
    referensiStatis: [
      { judul: 'Artificial Intelligence', penulis: 'Kusumadewi, S.', tahun: 2003, penerbit: 'Graha Ilmu', relevansi: 'Diagnosa logika perangkat' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Indikasi dan dampak thermal throttling' }
    ]
  },
  {
    id: 'L005',
    perangkat: 'laptop',
    kerusakan: 'Layar / LCD Rusak',
    deskripsi: 'Panel LCD atau kabel fleksibel penghubung ke motherboard rusak/terjepit. Menyebabkan gambar bergaris, blank, atau distorsi.',
    gejalaIds: ['L08', 'L09', 'L10', 'L11'],
    certaintyFactor: 0.90,
    referensiStatis: [
      { judul: 'Kecerdasan Buatan', penulis: 'Sutojo, T., Mulyanto, E., Suhartono, V.', tahun: 2011, penerbit: 'Andi Offset', relevansi: 'Penalaran gejala visual' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Panduan identifikasi panel layar mati' }
    ]
  },
  {
    id: 'L006',
    perangkat: 'laptop',
    kerusakan: 'Keyboard Rusak / Konslet',
    deskripsi: 'Jalur karbon di dalam keyboard putus atau menempel karena lembab, menyebabkan tombol tidak berfungsi atau ghosting (tertekan terus).',
    gejalaIds: ['L18'],
    certaintyFactor: 0.85,
    referensiStatis: [
      { judul: 'Decision Support Systems', penulis: 'Turban, E.', tahun: 2005, penerbit: 'Prentice Hall', relevansi: 'Troubleshooting input device' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Diagnosa jalur keyboard laptop' }
    ]
  },
  {
    id: 'L007',
    perangkat: 'laptop',
    kerusakan: 'Hard Disk (HDD) Rusak',
    deskripsi: 'Piringan magnetis di dalam hard disk mengalami bad sector parah atau kerusakan jarum mekanis (clicking). Kinerja melambat sangat parah dan freeze.',
    gejalaIds: ['L12', 'L14', 'L17', 'L22'],
    certaintyFactor: 0.92,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Diagnosa kegagalan storage hardware' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Analisa gejala hard disk failure' }
    ]
  },
  {
    id: 'L008',
    perangkat: 'laptop',
    kerusakan: 'Modul WiFi Rusak',
    deskripsi: 'Card Wireless LAN mengalami kerusakan fisik atau kabel antena terlepas, menyebabkan laptop tidak bisa terkoneksi jaringan nirkabel.',
    gejalaIds: ['L21'],
    certaintyFactor: 0.75,
    referensiStatis: [
      { judul: 'Artificial Intelligence', penulis: 'Kusumadewi, S.', tahun: 2003, penerbit: 'Graha Ilmu', relevansi: 'Diagnosa peripheral' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Cara cek modul wlan card' }
    ]
  },

  // ================= HP (SMARTPHONE) =================
  {
    id: 'H001',
    perangkat: 'hp',
    kerusakan: 'Baterai Rusak / Kembung',
    deskripsi: 'Baterai HP sudah usang, mengalami penurunan cycle secara drastis, atau kembung. Persentase baterai sangat tidak stabil (sering loncat).',
    gejalaIds: ['H02', 'H04'],
    certaintyFactor: 0.90,
    referensiStatis: [
      { judul: 'Kecerdasan Buatan', penulis: 'Sutojo, T. et al.', tahun: 2011, penerbit: 'Andi Offset', relevansi: 'Analisis baterai ponsel' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Tanda-tanda baterai lithium kembung' }
    ]
  },
  {
    id: 'H002',
    perangkat: 'hp',
    kerusakan: 'LCD Rusak',
    deskripsi: 'Panel penampil gambar pada layar mengalami kerusakan karena benturan atau tekanan, menimbulkan blank hitam, dead pixel, atau garis.',
    gejalaIds: ['H06', 'H09'],
    certaintyFactor: 0.95,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Visual check display' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Pemecahan masalah LCD HP' }
    ]
  },
  {
    id: 'H003',
    perangkat: 'hp',
    kerusakan: 'IC Power Rusak',
    deskripsi: 'Sirkuit pembagi daya (IC Power) konslet atau terbakar. Mengakibatkan HP mati total dan terasa panas karena arus pendek di mainboard.',
    gejalaIds: ['H01', 'H05'],
    certaintyFactor: 0.88,
    referensiStatis: [
      { judul: 'Decision Support Systems', penulis: 'Turban, E.', tahun: 2005, penerbit: 'Prentice Hall', relevansi: 'Diagnosa tingkat lanjut mesin HP' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Penanganan short circuit IC' }
    ]
  },
  {
    id: 'H004',
    perangkat: 'hp',
    kerusakan: 'Touchscreen Rusak',
    deskripsi: 'Digitizer kaca sentuh tidak membaca tekanan/gestur jari pengguna, atau terjadi short sehingga merespon sendiri (ghost touch).',
    gejalaIds: ['H07', 'H08'],
    certaintyFactor: 0.90,
    referensiStatis: [
      { judul: 'Artificial Intelligence', penulis: 'Kusumadewi, S.', tahun: 2003, penerbit: 'Graha Ilmu', relevansi: 'Diagnosa sistem interaktif' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Deteksi masalah digitizer touchscreen' }
    ]
  },
  {
    id: 'H005',
    perangkat: 'hp',
    kerusakan: 'Modul Kamera Rusak',
    deskripsi: 'Lensa retak, konektor kamera terlepas, atau sensor CMOS rusak. Aplikasi kamera tidak bisa menangkap gambar dengan baik atau error.',
    gejalaIds: ['H16'],
    certaintyFactor: 0.85,
    referensiStatis: [
      { judul: 'Kecerdasan Buatan', penulis: 'Sutojo, T. et al.', tahun: 2011, penerbit: 'Andi Offset', relevansi: 'Analisis kegagalan hardware sekunder' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Panduan perbaikan modul kamera HP' }
    ]
  },
  {
    id: 'H006',
    perangkat: 'hp',
    kerusakan: 'Speaker / Loudspeaker Rusak',
    deskripsi: 'Membran speaker sobek atau kemasukan air/debu, sehingga suara yang keluar sember, pecah, sangat kecil atau mati total.',
    gejalaIds: ['H17', 'H21'],
    certaintyFactor: 0.80,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Audio troubleshooting' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Cara memeriksa earpiece dan speaker' }
    ]
  },
  {
    id: 'H007',
    perangkat: 'hp',
    kerusakan: 'IC Sinyal / Antena Lemah',
    deskripsi: 'Kabel antena putus atau IC WTR/Sinyal pada motherboard bermasalah, sehingga tidak bisa menangkap sinyal dari BTS atau koneksi terputus.',
    gejalaIds: ['H18', 'H19'],
    certaintyFactor: 0.85,
    referensiStatis: [
      { judul: 'Decision Support Systems', penulis: 'Turban, E.', tahun: 2005, penerbit: 'Prentice Hall', relevansi: 'Pemecahan masalah konektivitas' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Pemeriksaan receiver dan antena' }
    ]
  },
  {
    id: 'H008',
    perangkat: 'hp',
    kerusakan: 'Port Charger (Konektor) Rusak',
    deskripsi: 'Pin pada port Type-C atau Micro USB patah, bengkok, atau berkarat. Harus ditekuk agar bisa mengecas, atau tidak mengecas sama sekali.',
    gejalaIds: ['H03', 'H20'],
    certaintyFactor: 0.95,
    referensiStatis: [
      { judul: 'Artificial Intelligence', penulis: 'Kusumadewi, S.', tahun: 2003, penerbit: 'Graha Ilmu', relevansi: 'Analisis input daya' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Pemeriksaan pin charging board' }
    ]
  },

  // ================= PC (DESKTOP) =================
  {
    id: 'P001',
    perangkat: 'pc',
    kerusakan: 'Power Supply Unit (PSU) Rusak',
    deskripsi: 'PSU tidak bisa menyalurkan tegangan listrik 12V/5V/3V ke motherboard karena komponen di dalamnya mati atau fuse putus. PC mati total.',
    gejalaIds: ['P01', 'P06', 'P21'],
    certaintyFactor: 0.92,
    referensiStatis: [
      { judul: 'Kecerdasan Buatan', penulis: 'Sutojo, T. et al.', tahun: 2011, penerbit: 'Andi Offset', relevansi: 'Analisis power supply system' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Cara test PSU mati total' }
    ]
  },
  {
    id: 'P002',
    perangkat: 'pc',
    kerusakan: 'RAM Kotor atau Mati',
    deskripsi: 'Sistem tidak bisa memuat data ke memori. Seringkali PC tidak mau POST, atau mengalami Blue Screen dengan kode Memory Management.',
    gejalaIds: ['P03', 'P11'],
    certaintyFactor: 0.88,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Analisis beep code POST' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Cara reseat memori PC' }
    ]
  },
  {
    id: 'P003',
    perangkat: 'pc',
    kerusakan: 'VGA / Kartu Grafis Rusak',
    deskripsi: 'VGA card overheating, VRAM rusak, atau tidak terdeteksi. Menimbulkan artefak aneh, resolusi drop, atau bahkan no signal ke monitor.',
    gejalaIds: ['P07', 'P08', 'P09'],
    certaintyFactor: 0.95,
    referensiStatis: [
      { judul: 'Decision Support Systems', penulis: 'Turban, E.', tahun: 2005, penerbit: 'Prentice Hall', relevansi: 'Diagnosa GPU hardware' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Gejala VRAM artifact pada VGA' }
    ]
  },
  {
    id: 'P004',
    perangkat: 'pc',
    kerusakan: 'Hard Disk (HDD) / Sistem Penyimpanan Rusak',
    deskripsi: 'Head mekanis HDD menabrak piringan (clicking noise) atau SSD mengalami kegagalan baca/tulis. PC sangat lambat dan disk usage 100%.',
    gejalaIds: ['P12', 'P13', 'P18'],
    certaintyFactor: 0.90,
    referensiStatis: [
      { judul: 'Artificial Intelligence', penulis: 'Kusumadewi, S.', tahun: 2003, penerbit: 'Graha Ilmu', relevansi: 'Deteksi storage bottleneck' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Cek kesehatan S.M.A.R.T hardisk' }
    ]
  },
  {
    id: 'P005',
    perangkat: 'pc',
    kerusakan: 'Motherboard Bermasalah',
    deskripsi: 'Sirkuit chipset motherboard mengalami korosi, short, atau bios chip corrupt. Komputer hidup (kipas muter) tapi tidak tampil sama sekali dan tidak beep.',
    gejalaIds: ['P04', 'P19'],
    certaintyFactor: 0.85,
    referensiStatis: [
      { judul: 'Kecerdasan Buatan', penulis: 'Sutojo, T. et al.', tahun: 2011, penerbit: 'Andi Offset', relevansi: 'Diagnosa papan sirkuit utama' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Inspeksi kapasitor motherboard' }
    ]
  },
  {
    id: 'P006',
    perangkat: 'pc',
    kerusakan: 'CPU Overheat / Panas Berlebih',
    deskripsi: 'Pasta prosesor sudah sangat kering atau kipas pendingin macet. CPU memaksa fan berputar sangat cepat dan mematikan PC jika beban terlalu berat.',
    gejalaIds: ['P15', 'P16'],
    certaintyFactor: 0.90,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Suhu dan logika thermal' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Cara mengganti thermal paste' }
    ]
  },
  {
    id: 'P007',
    perangkat: 'pc',
    kerusakan: 'OS Windows Corrupt / Bervirus',
    deskripsi: 'File penting di Windows System32 hilang, korup, atau terserang malware. Aplikasi tidak mau merespon, freeze, dan sering muncul BSOD.',
    gejalaIds: ['P11', 'P14'],
    certaintyFactor: 0.80,
    referensiStatis: [
      { judul: 'Decision Support Systems', penulis: 'Turban, E.', tahun: 2005, penerbit: 'Prentice Hall', relevansi: 'Pemisahan gejala hardware dan software' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Troubleshooting registry Windows' }
    ]
  },
  {
    id: 'P008',
    perangkat: 'pc',
    kerusakan: 'Baterai CMOS Habis',
    deskripsi: 'Baterai kancing (CR2032) pada motherboard sudah lemah atau habis dayanya, sehingga pengaturan BIOS dan jam sering reset kembali ke default.',
    gejalaIds: ['P05'],
    certaintyFactor: 0.98,
    referensiStatis: [
      { judul: 'Artificial Intelligence', penulis: 'Kusumadewi, S.', tahun: 2003, penerbit: 'Graha Ilmu', relevansi: 'Diagnosa logika waktu' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Penggantian baterai CMOS PC' }
    ]
  },

  // ================= TAMBAHAN LAPTOP =================
  {
    id: 'L009',
    perangkat: 'laptop',
    kerusakan: 'Touchpad Rusak / Tidak Merespon',
    deskripsi: 'Modul touchpad mengalami kerusakan pada sensor kapasitif atau kabel fleksibel penghubung ke motherboard terlepas/putus, sehingga kursor tidak bergerak dan klik tidak berfungsi.',
    gejalaIds: ['L19'],
    certaintyFactor: 0.85,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Diagnosa input device peripheral' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Panduan perbaikan touchpad laptop' }
    ]
  },
  {
    id: 'L010',
    perangkat: 'laptop',
    kerusakan: 'Speaker Internal Rusak',
    deskripsi: 'Membran speaker internal laptop sobek atau konektor kabel speaker ke motherboard longgar/putus, menyebabkan suara tidak keluar, pecah, atau kresek-kresek.',
    gejalaIds: ['L20'],
    certaintyFactor: 0.80,
    referensiStatis: [
      { judul: 'Decision Support Systems', penulis: 'Turban, E.', tahun: 2005, penerbit: 'Prentice Hall', relevansi: 'Audio troubleshooting laptop' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Cara memeriksa dan mengganti speaker laptop' }
    ]
  },

  // ================= TAMBAHAN HP (SMARTPHONE) =================
  {
    id: 'H009',
    perangkat: 'hp',
    kerusakan: 'Sensor Proximity / Ambient Light Rusak',
    deskripsi: 'Sensor proximity atau ambient light pada bagian atas layar HP mengalami kerusakan fisik atau tertutup debu/kotoran, menyebabkan brightness tidak bisa diatur otomatis dan sensor cahaya tidak merespon.',
    gejalaIds: ['H10'],
    certaintyFactor: 0.80,
    referensiStatis: [
      { judul: 'Kecerdasan Buatan', penulis: 'Sutojo, T. et al.', tahun: 2011, penerbit: 'Andi Offset', relevansi: 'Analisis sensor perangkat mobile' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Diagnosa sensor proximity dan ambient light HP' }
    ]
  },
  {
    id: 'H010',
    perangkat: 'hp',
    kerusakan: 'eMMC Rusak / Software Corrupt',
    deskripsi: 'Chip penyimpanan internal (eMMC) mengalami bad block atau sistem operasi Android/iOS mengalami kerusakan data. Menyebabkan bootloop, lag parah, aplikasi force close, penyimpanan terdeteksi penuh, dan hang total.',
    gejalaIds: ['H11', 'H12', 'H13', 'H14', 'H15'],
    certaintyFactor: 0.85,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Diagnosa kegagalan storage mobile' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Identifikasi kerusakan eMMC dan software corruption pada smartphone' }
    ]
  },

  // ================= TAMBAHAN PC (DESKTOP) =================
  {
    id: 'P009',
    perangkat: 'pc',
    kerusakan: 'PSU / Motherboard Tidak Stabil',
    deskripsi: 'PSU tidak mampu menyuplai daya stabil atau motherboard mengalami short circuit ringan, menyebabkan PC menyala sebentar lalu mati dan restart berulang-ulang (looping).',
    gejalaIds: ['P02'],
    certaintyFactor: 0.85,
    referensiStatis: [
      { judul: 'Kecerdasan Buatan', penulis: 'Sutojo, T. et al.', tahun: 2011, penerbit: 'Andi Offset', relevansi: 'Analisis power cycling system' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Diagnosa restart looping pada PC desktop' }
    ]
  },
  {
    id: 'P010',
    perangkat: 'pc',
    kerusakan: 'Kabel VGA / Monitor Bermasalah',
    deskripsi: 'Kabel penghubung VGA/HDMI/DP ke monitor mengalami patah internal, konektor longgar, atau monitor itu sendiri mengalami kerusakan panel sehingga warna tampil tidak wajar, berbayang, atau terdistorsi.',
    gejalaIds: ['P10'],
    certaintyFactor: 0.80,
    referensiStatis: [
      { judul: 'Decision Support Systems', penulis: 'Turban, E.', tahun: 2005, penerbit: 'Prentice Hall', relevansi: 'Troubleshooting display output' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Pemeriksaan kabel display dan panel monitor' }
    ]
  },
  {
    id: 'P011',
    perangkat: 'pc',
    kerusakan: 'Sound Card / Driver Audio Rusak',
    deskripsi: 'Chipset audio onboard pada motherboard rusak, driver audio corrupt, atau sound card diskret mengalami kegagalan. Speaker terhubung namun tidak mengeluarkan suara sama sekali.',
    gejalaIds: ['P17'],
    certaintyFactor: 0.78,
    referensiStatis: [
      { judul: 'Artificial Intelligence', penulis: 'Kusumadewi, S.', tahun: 2003, penerbit: 'Graha Ilmu', relevansi: 'Diagnosa peripheral audio' },
      { judul: 'Tom\'s Hardware Troubleshooting Guide', penulis: 'Tom\'s Hardware', tahun: 2022, penerbit: 'Purch', relevansi: 'Troubleshooting audio device Windows' }
    ]
  },
  {
    id: 'P012',
    perangkat: 'pc',
    kerusakan: 'NIC / Port Ethernet Rusak',
    deskripsi: 'Chipset LAN onboard pada motherboard rusak atau port RJ-45 mengalami kerusakan fisik (pin patah), sehingga koneksi internet kabel tidak terdeteksi meskipun kabel LAN sudah terpasang dengan benar.',
    gejalaIds: ['P20'],
    certaintyFactor: 0.80,
    referensiStatis: [
      { judul: 'Expert Systems: Principles and Programming', penulis: 'Giarratano, J. & Riley, G.', tahun: 2005, penerbit: 'Thomson', relevansi: 'Diagnosa konektivitas jaringan' },
      { judul: 'iFixit Repair Guides', penulis: 'iFixit', tahun: 2023, penerbit: 'iFixit', relevansi: 'Pemeriksaan NIC dan port ethernet PC' }
    ]
  }
];
