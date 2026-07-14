export const hpRules = [
  {
    "id": "H001",
    "perangkat": "hp",
    "kerusakan": "Baterai Rusak / Kembung",
    "deskripsi": "Baterai HP sudah usang, mengalami penurunan cycle secara drastis, atau kembung. Persentase baterai sangat tidak stabil (sering loncat).",
    "gejalaIds": [
      "H02",
      "H04"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Kecerdasan Buatan",
        "penulis": "Sutojo, T. et al.",
        "tahun": 2011,
        "penerbit": "Andi Offset",
        "relevansi": "Analisis baterai ponsel"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Tanda-tanda baterai lithium kembung"
      }
    ]
  },
  {
    "id": "H002",
    "perangkat": "hp",
    "kerusakan": "LCD Rusak",
    "deskripsi": "Panel penampil gambar pada layar mengalami kerusakan karena benturan atau tekanan, menimbulkan blank hitam, dead pixel, atau garis.",
    "gejalaIds": [
      "H06",
      "H09"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Visual check display"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Pemecahan masalah LCD HP"
      }
    ]
  },
  {
    "id": "H003",
    "perangkat": "hp",
    "kerusakan": "IC Power Rusak",
    "deskripsi": "Sirkuit pembagi daya (IC Power) konslet atau terbakar. Mengakibatkan HP mati total dan terasa panas karena arus pendek di mainboard.",
    "gejalaIds": [
      "H01",
      "H05"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Decision Support Systems",
        "penulis": "Turban, E.",
        "tahun": 2005,
        "penerbit": "Prentice Hall",
        "relevansi": "Diagnosa tingkat lanjut mesin HP"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Penanganan short circuit IC"
      }
    ]
  },
  {
    "id": "H004",
    "perangkat": "hp",
    "kerusakan": "Touchscreen Rusak",
    "deskripsi": "Digitizer kaca sentuh tidak membaca tekanan/gestur jari pengguna, atau terjadi short sehingga merespon sendiri (ghost touch).",
    "gejalaIds": [
      "H07",
      "H08"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Artificial Intelligence",
        "penulis": "Kusumadewi, S.",
        "tahun": 2003,
        "penerbit": "Graha Ilmu",
        "relevansi": "Diagnosa sistem interaktif"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Deteksi masalah digitizer touchscreen"
      }
    ]
  },
  {
    "id": "H005",
    "perangkat": "hp",
    "kerusakan": "Modul Kamera Rusak",
    "deskripsi": "Lensa retak, konektor kamera terlepas, atau sensor CMOS rusak. Aplikasi kamera tidak bisa menangkap gambar dengan baik atau error.",
    "gejalaIds": [
      "H16"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Kecerdasan Buatan",
        "penulis": "Sutojo, T. et al.",
        "tahun": 2011,
        "penerbit": "Andi Offset",
        "relevansi": "Analisis kegagalan hardware sekunder"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Panduan perbaikan modul kamera HP"
      }
    ]
  },
  {
    "id": "H006",
    "perangkat": "hp",
    "kerusakan": "Speaker / Loudspeaker Rusak",
    "deskripsi": "Membran speaker sobek atau kemasukan air/debu, sehingga suara yang keluar sember, pecah, sangat kecil atau mati total.",
    "gejalaIds": [
      "H17",
      "H21"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Audio troubleshooting"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Cara memeriksa earpiece dan speaker"
      }
    ]
  },
  {
    "id": "H007",
    "perangkat": "hp",
    "kerusakan": "IC Sinyal / Antena Lemah",
    "deskripsi": "Kabel antena putus atau IC WTR/Sinyal pada motherboard bermasalah, sehingga tidak bisa menangkap sinyal dari BTS atau koneksi terputus.",
    "gejalaIds": [
      "H18",
      "H19"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Decision Support Systems",
        "penulis": "Turban, E.",
        "tahun": 2005,
        "penerbit": "Prentice Hall",
        "relevansi": "Pemecahan masalah konektivitas"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Pemeriksaan receiver dan antena"
      }
    ]
  },
  {
    "id": "H008",
    "perangkat": "hp",
    "kerusakan": "Port Charger (Konektor) Rusak",
    "deskripsi": "Pin pada port Type-C atau Micro USB patah, bengkok, atau berkarat. Harus ditekuk agar bisa mengecas, atau tidak mengecas sama sekali.",
    "gejalaIds": [
      "H03",
      "H20"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Artificial Intelligence",
        "penulis": "Kusumadewi, S.",
        "tahun": 2003,
        "penerbit": "Graha Ilmu",
        "relevansi": "Analisis input daya"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Pemeriksaan pin charging board"
      }
    ]
  },
  {
    "id": "H009",
    "perangkat": "hp",
    "kerusakan": "Sensor Proximity / Ambient Light Rusak",
    "deskripsi": "Sensor proximity atau ambient light pada bagian atas layar HP mengalami kerusakan fisik atau tertutup debu/kotoran, menyebabkan brightness tidak bisa diatur otomatis dan sensor cahaya tidak merespon.",
    "gejalaIds": [
      "H10"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Kecerdasan Buatan",
        "penulis": "Sutojo, T. et al.",
        "tahun": 2011,
        "penerbit": "Andi Offset",
        "relevansi": "Analisis sensor perangkat mobile"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Diagnosa sensor proximity dan ambient light HP"
      }
    ]
  },
  {
    "id": "H010",
    "perangkat": "hp",
    "kerusakan": "eMMC Rusak / Software Corrupt",
    "deskripsi": "Chip penyimpanan internal (eMMC) mengalami bad block atau sistem operasi Android/iOS mengalami kerusakan data. Menyebabkan bootloop, lag parah, aplikasi force close, penyimpanan terdeteksi penuh, dan hang total.",
    "gejalaIds": [
      "H11",
      "H12",
      "H13",
      "H14",
      "H15"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Diagnosa kegagalan storage mobile"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Identifikasi kerusakan eMMC dan software corruption pada smartphone"
      }
    ]
  }
];
