export const hpRules = [
  {
    id: 'H001',
    perangkat: 'hp',
    kerusakan: 'IC WIFI',
    deskripsi: 'Kerusakan pada IC pengontrol WiFi pada mainboard smartphone, menyebabkan fitur WiFi dan Bluetooth tidak dapat aktif atau terdeteksi.',
    gejalaIds: ['H01', 'H02'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis kerusakan chip IC Wifi dan Bluetooth',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H002',
    perangkat: 'hp',
    kerusakan: 'IC WTR',
    deskripsi: 'Kerusakan pada IC transceiver WTR yang mengatur penerimaan dan pengiriman sinyal frekuensi radio seluler.',
    gejalaIds: ['H10', 'H12'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis kegagalan tangkapan sinyal manual dan indikator silang pada IC WTR',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H003',
    perangkat: 'hp',
    kerusakan: 'IC CHARGING',
    deskripsi: 'Kerusakan sirkuit daya pengisian baterai (IC Charger), membuat sasis tidak mendeteksi tegangan masuk atau terjadi fake charging.',
    gejalaIds: ['H04', 'H05', 'H06'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis kegagalan pengisian daya baterai dan overheat IC Charger',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H004',
    perangkat: 'hp',
    kerusakan: 'IC FAST CHARGING',
    deskripsi: 'Kerusakan pada sirkuit sekunder pengatur tegangan tinggi fast charging, sehingga smartphone hanya mengisi daya dalam mode lambat standar.',
    gejalaIds: ['H07'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan pengujian fungsionalitas fitur pengisian daya cepat',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H005',
    perangkat: 'hp',
    kerusakan: 'IC CPU',
    deskripsi: 'Kerusakan pada chip prosesor utama (CPU) akibat overheat parah atau retaknya kaki solder BGA chip. Mengakibatkan perangkat mati total.',
    gejalaIds: ['H03'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis mati total akibat kerusakan unit pemroses utama CPU',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H006',
    perangkat: 'hp',
    kerusakan: 'IC EMMC',
    deskripsi: 'Kerusakan chip flash storage (eMMC/UFS), mengakibatkan firmware sistem operasi gagal booting dan performa melambat parah.',
    gejalaIds: ['H08', 'H09'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis bootloop dan penurunan performa memori eMMC',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H007',
    perangkat: 'hp',
    kerusakan: 'IC PA',
    deskripsi: 'Kerusakan chip Power Amplifier penguat sinyal pemancar, menyebabkan kartu SIM terdeteksi namun tidak mendapat pancaran sinyal seluler.',
    gejalaIds: ['H10', 'H11'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis kegagalan pancaran sinyal seluler pada IC PA',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H008',
    perangkat: 'hp',
    kerusakan: 'IC POWER',
    deskripsi: 'Kerusakan pada chip Power Management (PMIC) utama yang membagi tegangan ke sirkuit sistem, menyebabkan kegagalan daya total pada WiFi/Bluetooth.',
    gejalaIds: ['H01', 'H02'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan penelusuran kegagalan modul pendukung akibat fluktuasi PMIC',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H009',
    perangkat: 'hp',
    kerusakan: 'IC RAM',
    deskripsi: 'Modul Dynamic RAM mengalami kegagalan akses memori sementara, memicu HP mati mendadak saat ditekan power atau restart berulang.',
    gejalaIds: ['H03', 'H13'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis memori sementara RAM bermasalah',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H010',
    perangkat: 'hp',
    kerusakan: 'IC AUDIO',
    deskripsi: 'Kerusakan pada chip audio controller/decoder, mematikan seluruh alur input dan output audio (speaker dan mic mati sekaligus).',
    gejalaIds: ['H20'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosa kegagalan terpusat codec suara IC Audio',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H011',
    perangkat: 'hp',
    kerusakan: 'TOUCHSCREEN',
    deskripsi: 'Kerusakan digitizer kaca sentuh eksternal atau konektor kabel fleksibel sentuh yang sobek/longgar.',
    gejalaIds: ['H15'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis kegagalan sensitivitas panel sentuh',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H012',
    perangkat: 'hp',
    kerusakan: 'KAMERA',
    deskripsi: 'Kerusakan pada modul kamera utama/depan, sirkuit autofocus goyang, atau sensor lensa retak sehingga blank/blur.',
    gejalaIds: ['H16', 'H17', 'H18', 'H19'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan komprehensif diagnosis modul lensa dan sensor kamera',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H013',
    perangkat: 'hp',
    kerusakan: 'BATERAI',
    deskripsi: 'Penurunan kualitas sel baterai litium secara kimiawi, menyebabkan sel menggelembung dan tidak stabil menahan daya.',
    gejalaIds: ['H13', 'H14'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan identifikasi baterai menggembung dan penurunan voltase',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H014',
    perangkat: 'hp',
    kerusakan: 'SPEAKER',
    deskripsi: 'Kerusakan fisik modul speaker utama (buzzer/loudspeaker), membran sobek atau kemasukan air/kotoran.',
    gejalaIds: ['H21', 'H22'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan pengujian kualitas output suara speaker utama',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H015',
    perangkat: 'hp',
    kerusakan: 'MICROPHONE',
    deskripsi: 'Kerusakan pada mikrofon internal bawah, menyebabkan sirkuit tidak merekam input getaran suara pengguna.',
    gejalaIds: ['H23'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan pengujian fungsionalitas perekaman suara mic telepon',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H016',
    perangkat: 'hp',
    kerusakan: 'LCD',
    deskripsi: 'Kerusakan pada panel display LCD/OLED internal, mengakibatkan ketiadaan output visual gambar ke layar.',
    gejalaIds: ['H24'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis blank screen pada panel display LCD',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H017',
    perangkat: 'hp',
    kerusakan: 'SYSTEM OPERASI',
    deskripsi: 'Kerusakan pada file partisi system OS Android/iOS (bootloop), akibat gagal update atau data korup.',
    gejalaIds: ['H08', 'H13'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis kegagalan sistem operasi memuat berkas booting',
        url: 'https://jurnal-itsi.org'
      }
    ]
  },
  {
    id: 'H018',
    perangkat: 'hp',
    kerusakan: 'IMEI',
    deskripsi: 'Kerusakan partisi EFS/NVRAM yang menampung nomor IMEI atau pemblokiran IMEI secara nasional di server database.',
    gejalaIds: ['H11'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Diagnosa Kerusakan Smartphone Menggunakan Metode Certainty Factor',
        penulis: 'Ilham Agus Pratama, Aldo Erianda, Ardi Syawaldipa',
        tahun: 2026,
        penerbit: 'JITSI: Jurnal Ilmiah Teknologi Sistem Informasi',
        relevansi: 'Aturan diagnosis nomor identifikasi modem IMEI tidak terdaftar',
        url: 'https://jurnal-itsi.org'
      }
    ]
  }
];
