export const pcRules = [
  {
    "id": "P001",
    "perangkat": "pc",
    "kerusakan": "Power Supply Unit (PSU) Rusak",
    "deskripsi": "PSU tidak bisa menyalurkan tegangan listrik 12V/5V/3V ke motherboard karena komponen di dalamnya mati atau fuse putus. PC mati total.",
    "gejalaIds": [
      "P01",
      "P06",
      "P21"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Kecerdasan Buatan",
        "penulis": "Sutojo, T. et al.",
        "tahun": 2011,
        "penerbit": "Andi Offset",
        "relevansi": "Analisis power supply system"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Cara test PSU mati total"
      }
    ]
  },
  {
    "id": "P002",
    "perangkat": "pc",
    "kerusakan": "RAM Kotor atau Mati",
    "deskripsi": "Sistem tidak bisa memuat data ke memori. Seringkali PC tidak mau POST, atau mengalami Blue Screen dengan kode Memory Management.",
    "gejalaIds": [
      "P03",
      "P11"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Analisis beep code POST"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Cara reseat memori PC"
      }
    ]
  },
  {
    "id": "P003",
    "perangkat": "pc",
    "kerusakan": "VGA / Kartu Grafis Rusak",
    "deskripsi": "VGA card overheating, VRAM rusak, atau tidak terdeteksi. Menimbulkan artefak aneh, resolusi drop, atau bahkan no signal ke monitor.",
    "gejalaIds": [
      "P07",
      "P08",
      "P09"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Decision Support Systems",
        "penulis": "Turban, E.",
        "tahun": 2005,
        "penerbit": "Prentice Hall",
        "relevansi": "Diagnosa GPU hardware"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Gejala VRAM artifact pada VGA"
      }
    ]
  },
  {
    "id": "P004",
    "perangkat": "pc",
    "kerusakan": "Hard Disk (HDD) / Sistem Penyimpanan Rusak",
    "deskripsi": "Head mekanis HDD menabrak piringan (clicking noise) atau SSD mengalami kegagalan baca/tulis. PC sangat lambat dan disk usage 100%.",
    "gejalaIds": [
      "P12",
      "P13",
      "P18"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Artificial Intelligence",
        "penulis": "Kusumadewi, S.",
        "tahun": 2003,
        "penerbit": "Graha Ilmu",
        "relevansi": "Deteksi storage bottleneck"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Cek kesehatan S.M.A.R.T hardisk"
      }
    ]
  },
  {
    "id": "P005",
    "perangkat": "pc",
    "kerusakan": "Motherboard Bermasalah",
    "deskripsi": "Sirkuit chipset motherboard mengalami korosi, short, atau bios chip corrupt. Komputer hidup (kipas muter) tapi tidak tampil sama sekali dan tidak beep.",
    "gejalaIds": [
      "P04",
      "P19"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Kecerdasan Buatan",
        "penulis": "Sutojo, T. et al.",
        "tahun": 2011,
        "penerbit": "Andi Offset",
        "relevansi": "Diagnosa papan sirkuit utama"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Inspeksi kapasitor motherboard"
      }
    ]
  },
  {
    "id": "P006",
    "perangkat": "pc",
    "kerusakan": "CPU Overheat / Panas Berlebih",
    "deskripsi": "Pasta prosesor sudah sangat kering atau kipas pendingin macet. CPU memaksa fan berputar sangat cepat dan mematikan PC jika beban terlalu berat.",
    "gejalaIds": [
      "P15",
      "P16"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Suhu dan logika thermal"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Cara mengganti thermal paste"
      }
    ]
  },
  {
    "id": "P007",
    "perangkat": "pc",
    "kerusakan": "OS Windows Corrupt / Bervirus",
    "deskripsi": "File penting di Windows System32 hilang, korup, atau terserang malware. Aplikasi tidak mau merespon, freeze, dan sering muncul BSOD.",
    "gejalaIds": [
      "P11",
      "P14"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Decision Support Systems",
        "penulis": "Turban, E.",
        "tahun": 2005,
        "penerbit": "Prentice Hall",
        "relevansi": "Pemisahan gejala hardware dan software"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Troubleshooting registry Windows"
      }
    ]
  },
  {
    "id": "P008",
    "perangkat": "pc",
    "kerusakan": "Baterai CMOS Habis",
    "deskripsi": "Baterai kancing (CR2032) pada motherboard sudah lemah atau habis dayanya, sehingga pengaturan BIOS dan jam sering reset kembali ke default.",
    "gejalaIds": [
      "P05"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Artificial Intelligence",
        "penulis": "Kusumadewi, S.",
        "tahun": 2003,
        "penerbit": "Graha Ilmu",
        "relevansi": "Diagnosa logika waktu"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Penggantian baterai CMOS PC"
      }
    ]
  },
  {
    "id": "P009",
    "perangkat": "pc",
    "kerusakan": "PSU / Motherboard Tidak Stabil",
    "deskripsi": "PSU tidak mampu menyuplai daya stabil atau motherboard mengalami short circuit ringan, menyebabkan PC menyala sebentar lalu mati dan restart berulang-ulang (looping).",
    "gejalaIds": [
      "P02"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Kecerdasan Buatan",
        "penulis": "Sutojo, T. et al.",
        "tahun": 2011,
        "penerbit": "Andi Offset",
        "relevansi": "Analisis power cycling system"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Diagnosa restart looping pada PC desktop"
      }
    ]
  },
  {
    "id": "P010",
    "perangkat": "pc",
    "kerusakan": "Kabel VGA / Monitor Bermasalah",
    "deskripsi": "Kabel penghubung VGA/HDMI/DP ke monitor mengalami patah internal, konektor longgar, atau monitor itu sendiri mengalami kerusakan panel sehingga warna tampil tidak wajar, berbayang, atau terdistorsi.",
    "gejalaIds": [
      "P10"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Decision Support Systems",
        "penulis": "Turban, E.",
        "tahun": 2005,
        "penerbit": "Prentice Hall",
        "relevansi": "Troubleshooting display output"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Pemeriksaan kabel display dan panel monitor"
      }
    ]
  },
  {
    "id": "P011",
    "perangkat": "pc",
    "kerusakan": "Sound Card / Driver Audio Rusak",
    "deskripsi": "Chipset audio onboard pada motherboard rusak, driver audio corrupt, atau sound card diskret mengalami kegagalan. Speaker terhubung namun tidak mengeluarkan suara sama sekali.",
    "gejalaIds": [
      "P17"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Artificial Intelligence",
        "penulis": "Kusumadewi, S.",
        "tahun": 2003,
        "penerbit": "Graha Ilmu",
        "relevansi": "Diagnosa peripheral audio"
      },
      {
        "judul": "Tom's Hardware Troubleshooting Guide",
        "penulis": "Tom's Hardware",
        "tahun": 2022,
        "penerbit": "Purch",
        "relevansi": "Troubleshooting audio device Windows"
      }
    ]
  },
  {
    "id": "P012",
    "perangkat": "pc",
    "kerusakan": "NIC / Port Ethernet Rusak",
    "deskripsi": "Chipset LAN onboard pada motherboard rusak atau port RJ-45 mengalami kerusakan fisik (pin patah), sehingga koneksi internet kabel tidak terdeteksi meskipun kabel LAN sudah terpasang dengan benar.",
    "gejalaIds": [
      "P20"
    ],
    "certaintyFactor": 0.98,
    "referensiStatis": [
      {
        "judul": "Expert Systems: Principles and Programming",
        "penulis": "Giarratano, J. & Riley, G.",
        "tahun": 2005,
        "penerbit": "Thomson",
        "relevansi": "Diagnosa konektivitas jaringan"
      },
      {
        "judul": "iFixit Repair Guides",
        "penulis": "iFixit",
        "tahun": 2023,
        "penerbit": "iFixit",
        "relevansi": "Pemeriksaan NIC dan port ethernet PC"
      }
    ]
  }
];
