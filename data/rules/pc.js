export const pcRules = [
  {
    id: 'P001',
    perangkat: 'pc',
    kerusakan: 'Monitor Rusak',
    deskripsi: 'Kerusakan pada unit penampil gambar (monitor/layar LCD) akibat rusaknya panel layar atau terputusnya kabel data eksternal monitor.',
    gejalaIds: ['P01', 'P02'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan identifikasi kerusakan monitor visual komputer',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P002',
    perangkat: 'pc',
    kerusakan: 'Memori Rusak',
    deskripsi: 'Kegagalan modul memori RAM akibat kaki pin kuningan kotor, teroksidasi, atau IC DRAM mati. Komputer gagal boot, bersuara beep berulang, atau restart looping.',
    gejalaIds: ['P03', 'P04', 'P05', 'P11', 'P12'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan pengujian memori RAM dan kode suara BIOS',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P003',
    perangkat: 'pc',
    kerusakan: 'HDD Rusak',
    deskripsi: 'Kerusakan komponen mekanis jarum (head/motor) atau bad sector fisik pada piringan hard disk. Mengakibatkan disk tidak terdeteksi BIOS, bad sectors, atau loading Windows lambat.',
    gejalaIds: ['P06', 'P07', 'P08', 'P10', 'P21', 'P22'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan deteksi kegagalan piringan magnetik harddisk',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P004',
    perangkat: 'pc',
    kerusakan: 'VGA Rusak',
    deskripsi: 'Kerusakan sirkuit daya VRM atau retaknya solder bola BGA di bawah chip grafis GPU. Menyebabkan gambar monitor mati, tidak ada BIOS screen, atau error grafis/game.',
    gejalaIds: ['P01', 'P03', 'P05', 'P09', 'P10', 'P12', 'P13'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan diagnosa kegagalan output kartu grafis VGA komputer',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P005',
    perangkat: 'pc',
    kerusakan: 'Sound Card Rusak',
    deskripsi: 'Kerusakan pada chipset audio onboard di motherboard atau audio controller card. Mengakibatkan speaker tidak mengeluarkan suara atau muncul error saat memutar audio.',
    gejalaIds: ['P10', 'P13', 'P14'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan diagnosa kegagalan suara/sound card komputer',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P006',
    perangkat: 'pc',
    kerusakan: 'OS Bermasalah',
    deskripsi: 'Kerusakan pada file sistem operasi Windows akibat virus, kegagalan partisi, atau shutdown tidak normal. Menyebabkan BSOD konstan atau error loading OS saat boot.',
    gejalaIds: ['P11', 'P12', 'P15'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan pemecahan masalah file booting sistem operasi Windows',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P007',
    perangkat: 'pc',
    kerusakan: 'Aplikasi Rusak',
    deskripsi: 'Kerusakan pada file instalasi aplikasi software (registry corrupt atau corrupt files), menyebabkan aplikasi crash, hang, atau langsung memicu layar biru BSOD.',
    gejalaIds: ['P07', 'P12'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan diagnosa crash aplikasi pihak ketiga',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P008',
    perangkat: 'pc',
    kerusakan: 'Power Supply Rusak',
    deskripsi: 'Kegagalan sirkuit regulator daya di dalam PSU (kapasitor melembung, fuse terputus). Kipas pendingin casing tidak berputar, dan komputer mati total secara tiba-tiba.',
    gejalaIds: ['P16', 'P17'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan diagnosa sirkuit daya Power Supply Unit (PSU)',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P009',
    perangkat: 'pc',
    kerusakan: 'Prosesor Rusak',
    deskripsi: 'Kerusakan pada chip Central Processing Unit (CPU) akibat panas berlebih (overheating) ekstrem atau lonjakan tegangan (short circuit). Menyebabkan PC no display, no POST BIOS, dan alarm BIOS berbunyi.',
    gejalaIds: ['P01', 'P03', 'P04', 'P05'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan kegagalan unit pengolah utama Prosesor (CPU)',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P010',
    perangkat: 'pc',
    kerusakan: 'Memory Kurang',
    deskripsi: 'Kapasitas RAM fisik tidak mencukupi kebutuhan beban kerja sistem operasi/aplikasi. Menyebabkan virtual memory menipis, aplikasi lambat, dan respon PC melambat parah.',
    gejalaIds: ['P18', 'P19'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan analisis performa RAM fisik dan alokasi virtual memory',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P011',
    perangkat: 'pc',
    kerusakan: 'Memory VGA Kurang',
    deskripsi: 'Kapasitas memori video (VRAM) pada kartu grafis terlalu kecil untuk memproses data game atau aplikasi rendering gambar/3D yang berat.',
    gejalaIds: ['P20'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan pengujian beban memori grafis (VRAM) VGA',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P012',
    perangkat: 'pc',
    kerusakan: 'Clock Prosesor Kurang Tinggi',
    deskripsi: 'Frekuensi clock rate (GHz) prosesor tidak memenuhi syarat minimum aplikasi berat, menyebabkan komputasi program berat berjalan sangat lambat atau error.',
    gejalaIds: ['P09', 'P19'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan identifikasi batas minimum clock rate CPU',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P013',
    perangkat: 'pc',
    kerusakan: 'Kabel IDE/SATA/ATA Rusak',
    deskripsi: 'Kerusakan pada kabel data penghubung hard disk/SSD ke motherboard (IDE/SATA) yang terputus di dalam atau berkarat, sehingga storage tidak terdeteksi BIOS.',
    gejalaIds: ['P21'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan diagnosa kegagalan jalur kabel bus data storage',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P014',
    perangkat: 'pc',
    kerusakan: 'Kurang Daya Pada PSU',
    deskripsi: 'Daya watt maksimum PSU menurun atau tidak memadai untuk menyuplai konsumsi daya seluruh komponen hardware PC secara penuh. Komputer berbunyi bip alarm dan hanya sebagian kipas yang berputar.',
    gejalaIds: ['P05', 'P23'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan analisis penurunan performa suplai Watt PSU',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P015',
    perangkat: 'pc',
    kerusakan: 'Perangkat USB Rusak',
    deskripsi: 'Kerusakan fisik port USB atau sirkuit driver USB hub di motherboard. Mengakibatkan perangkat luar (flashdisk, mouse, keyboard) tidak terdeteksi meski driver normal.',
    gejalaIds: ['P10'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan kegagalan kontroler USB hub motherboard',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P016',
    perangkat: 'pc',
    kerusakan: 'Keyboard Rusak',
    deskripsi: 'Kerusakan pada sirkuit tembaga keyboard atau modul konektor USB, menyebabkan sasis tidak terdeteksi dan tombol-tombol input tidak berfungsi saat ditekan.',
    gejalaIds: ['P10', 'P24'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan pengujian sirkuit input device keyboard',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  },
  {
    id: 'P017',
    perangkat: 'pc',
    kerusakan: 'Mouse Rusak',
    deskripsi: 'Kerusakan pada sensor optik mouse, tombol microswitch klik, atau kabel USB mouse. Pointer kursor tidak merespon gerakan fisik mouse di monitor.',
    gejalaIds: ['P10', 'P25'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Untuk Mendeteksi Kerusakan Komputer Dengan Metode Forward Chaining',
        penulis: 'Kusmayanti Solecha, Jefi, Hendri, Enoh Badri, Ali Haidir',
        tahun: 2021,
        penerbit: 'Jurnal Infortech (BSI)',
        relevansi: 'Basis aturan pengujian sensor dan tombol klik mouse',
        url: 'http://ejournal.bsi.ac.id/ejurnal/index.php/infortech'
      }
    ]
  }
];
