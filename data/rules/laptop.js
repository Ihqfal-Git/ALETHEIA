export const laptopRules = [
  {
    "id": "L001",
    "perangkat": "laptop",
    "kerusakan": "Adapter / Charger Rusak",
    "deskripsi": "Adapter tidak mampu mengalirkan daya ke motherboard. Charger sudah rusak pada komponen kapasitor atau terputusnya kabel.",
    "gejalaIds": [
      "L01",
      "L06"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Kecerdasan Buatan",
        "penulis": "Sutojo, T., Mulyanto, E., Suhartono, V.",
        "tahun": 2011,
        "penerbit": "Andi Offset",
        "relevansi": "Metode Forward Chaining sistem pakar"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Gejala kerusakan adapter daya laptop"
      }
    ]
  },
  {
    "id": "L002",
    "perangkat": "laptop",
    "kerusakan": "Baterai Rusak / Drop",
    "deskripsi": "Sel baterai telah kehilangan kemampuannya menyimpan daya. Baterai tidak bisa dicharge dan laptop mati bila charger dicabut.",
    "gejalaIds": [
      "L02",
      "L03",
      "L04"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Decision Support Systems",
        "penulis": "Turban, E.",
        "tahun": 2005,
        "penerbit": "Prentice Hall",
        "relevansi": "Pengambilan keputusan diagnosa hardware"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Identifikasi sel baterai drop"
      }
    ]
  },
  {
    "id": "L003",
    "perangkat": "laptop",
    "kerusakan": "RAM Kotor atau Rusak",
    "deskripsi": "Pin kuningan pada RAM kotor atau modul RAM mengalami kerusakan bad block sehingga sistem gagal post atau sering blue screen.",
    "gejalaIds": [
      "L07",
      "L13"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Rule-based sistem memori"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Pembersihan dan penggantian RAM"
      }
    ]
  },
  {
    "id": "L004",
    "perangkat": "laptop",
    "kerusakan": "Overheating (Panas Berlebih)",
    "deskripsi": "Sistem pendingin tidak berjalan baik, entah karena kipas tertutup debu kotor atau thermal paste mengering. Memicu mati mendadak demi keselamatan komponen.",
    "gejalaIds": [
      "L05",
      "L15",
      "L16"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Artificial Intelligence",
        "penulis": "Kusumadewi, S.",
        "tahun": 2003,
        "penerbit": "Graha Ilmu",
        "relevansi": "Diagnosa logika perangkat"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Indikasi dan dampak thermal throttling"
      }
    ]
  },
  {
    "id": "L005",
    "perangkat": "laptop",
    "kerusakan": "Layar / LCD Rusak",
    "deskripsi": "Panel LCD atau kabel fleksibel penghubung ke motherboard rusak/terjepit. Menyebabkan gambar bergaris, blank, atau distorsi.",
    "gejalaIds": [
      "L08",
      "L09",
      "L10",
      "L11"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Kecerdasan Buatan",
        "penulis": "Sutojo, T., Mulyanto, E., Suhartono, V.",
        "tahun": 2011,
        "penerbit": "Andi Offset",
        "relevansi": "Penalaran gejala visual"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Panduan identifikasi panel layar mati"
      }
    ]
  },
  {
    "id": "L006",
    "perangkat": "laptop",
    "kerusakan": "Keyboard Rusak / Konslet",
    "deskripsi": "Jalur karbon di dalam keyboard putus atau menempel karena lembab, menyebabkan tombol tidak berfungsi atau ghosting (tertekan terus).",
    "gejalaIds": [
      "L18"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Decision Support Systems",
        "penulis": "Turban, E.",
        "tahun": 2005,
        "penerbit": "Prentice Hall",
        "relevansi": "Troubleshooting input device"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Diagnosa jalur keyboard laptop"
      }
    ]
  },
  {
    "id": "L007",
    "perangkat": "laptop",
    "kerusakan": "Hard Disk (HDD) Rusak",
    "deskripsi": "Piringan magnetis di dalam hard disk mengalami bad sector parah atau kerusakan jarum mekanis (clicking). Kinerja melambat sangat parah dan freeze.",
    "gejalaIds": [
      "L12",
      "L14",
      "L17",
      "L22"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Diagnosa kegagalan storage hardware"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Analisa gejala hard disk failure"
      }
    ]
  },
  {
    "id": "L008",
    "perangkat": "laptop",
    "kerusakan": "Modul WiFi Rusak",
    "deskripsi": "Card Wireless LAN mengalami kerusakan fisik atau kabel antena terlepas, menyebabkan laptop tidak bisa terkoneksi jaringan nirkabel.",
    "gejalaIds": [
      "L21"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Artificial Intelligence",
        "penulis": "Kusumadewi, S.",
        "tahun": 2003,
        "penerbit": "Graha Ilmu",
        "relevansi": "Diagnosa peripheral"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Cara cek modul wlan card"
      }
    ]
  },
  {
    "id": "L009",
    "perangkat": "laptop",
    "kerusakan": "Touchpad Rusak / Tidak Merespon",
    "deskripsi": "Modul touchpad mengalami kerusakan pada sensor kapasitif atau kabel fleksibel penghubung ke motherboard terlepas/putus, sehingga kursor tidak bergerak dan klik tidak berfungsi.",
    "gejalaIds": [
      "L19"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Diagnosa input device peripheral"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Panduan perbaikan touchpad laptop"
      }
    ]
  },
  {
    "id": "L010",
    "perangkat": "laptop",
    "kerusakan": "Speaker Internal Rusak",
    "deskripsi": "Membran speaker internal laptop sobek atau konektor kabel speaker ke motherboard longgar/putus, menyebabkan suara tidak keluar, pecah, atau kresek-kresek.",
    "gejalaIds": [
      "L20"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Decision Support Systems",
        "penulis": "Turban, E.",
        "tahun": 2005,
        "penerbit": "Prentice Hall",
        "relevansi": "Audio troubleshooting laptop"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Cara memeriksa dan mengganti speaker laptop"
      }
    ]
  }
];
