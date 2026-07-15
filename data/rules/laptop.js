export const laptopRules = [
  {
    id: 'L001',
    perangkat: 'laptop',
    kerusakan: 'Power Supply',
    deskripsi: 'Sirkuit pembagi daya atau unit penyuplai daya mengalami kegagalan fungsi. Komponen sirkuit terbakar, sekring putus, atau kapasitor bocor menyebabkan laptop mati total.',
    gejalaIds: ['L01', 'L02', 'L03'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Deteksi Kerusakan Laptop dengan Metode Forward Chaining',
        penulis: 'Teguh Muhammad Ilham',
        tahun: 2022,
        penerbit: 'UPI YPTK Padang (JCSITECH)',
        relevansi: 'Basis aturan identifikasi kelistrikan dan power supply laptop',
        url: 'https://jcsitech-upiyptk.org/ojs'
      }
    ]
  },
  {
    id: 'L002',
    perangkat: 'laptop',
    kerusakan: 'Memory',
    deskripsi: 'Kegagalan modul memori RAM akibat pin kuningan kotor, teroksidasi, atau kerusakan chip memori. Menyebabkan laptop gagal menampilkan gambar, bersuara bip berulang kali, atau tidak merespon.',
    gejalaIds: ['L04', 'L05', 'L06', 'L07'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Deteksi Kerusakan Laptop dengan Metode Forward Chaining',
        penulis: 'Teguh Muhammad Ilham',
        tahun: 2022,
        penerbit: 'UPI YPTK Padang (JCSITECH)',
        relevansi: 'Basis aturan pengujian memori RAM dan kode bunyi (beep) BIOS',
        url: 'https://jcsitech-upiyptk.org/ojs'
      }
    ]
  },
  {
    id: 'L003',
    perangkat: 'laptop',
    kerusakan: 'Monitor',
    deskripsi: 'Gangguan pada panel layar LCD, lampu latar, sirkuit T-Con, atau kabel fleksibel eDP. Menyebabkan layar mati, blank, berkedip-kedip, atau distorsi warna.',
    gejalaIds: ['L08', 'L09', 'L10'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Deteksi Kerusakan Laptop dengan Metode Forward Chaining',
        penulis: 'Teguh Muhammad Ilham',
        tahun: 2022,
        penerbit: 'UPI YPTK Padang (JCSITECH)',
        relevansi: 'Basis aturan diagnosa kegagalan layar visual monitor laptop',
        url: 'https://jcsitech-upiyptk.org/ojs'
      }
    ]
  },
  {
    id: 'L004',
    perangkat: 'laptop',
    kerusakan: 'VGA',
    deskripsi: 'Kerusakan pada chip grafis (VGA Card/GPU) akibat retakan solder bola BGA karena panas tinggi. Mengakibatkan loading lama, freeze, program crash, atau tidak mau masuk BIOS.',
    gejalaIds: ['L11', 'L12', 'L13'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Deteksi Kerusakan Laptop dengan Metode Forward Chaining',
        penulis: 'Teguh Muhammad Ilham',
        tahun: 2022,
        penerbit: 'UPI YPTK Padang (JCSITECH)',
        relevansi: 'Basis aturan pengujian chip VGA grafis dan akses BIOS',
        url: 'https://jcsitech-upiyptk.org/ojs'
      }
    ]
  },
  {
    id: 'L005',
    perangkat: 'laptop',
    kerusakan: 'Harddisk',
    deskripsi: 'Kerusakan mekanis pada piringan magnetik (platter) atau jarum pembaca (head) hard disk. Mengakibatkan laptop lemot, loading lama, gagal booting cepat, atau file sistem tidak terdeteksi.',
    gejalaIds: ['L14', 'L15', 'L16'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Deteksi Kerusakan Laptop dengan Metode Forward Chaining',
        penulis: 'Teguh Muhammad Ilham',
        tahun: 2022,
        penerbit: 'UPI YPTK Padang (JCSITECH)',
        relevansi: 'Basis aturan deteksi penyimpanan harddisk bad sector dan boot system failure',
        url: 'https://jcsitech-upiyptk.org/ojs'
      }
    ]
  },
  {
    id: 'L006',
    perangkat: 'laptop',
    kerusakan: 'Optical Drive',
    deskripsi: 'Kerusakan pada lensa optik atau motor pemutar kaset DVD-RW, sehingga piringan kaset tidak dapat dibaca, ditulis, diedit, atau dihapus.',
    gejalaIds: ['L17', 'L18'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Deteksi Kerusakan Laptop dengan Metode Forward Chaining',
        penulis: 'Teguh Muhammad Ilham',
        tahun: 2022,
        penerbit: 'UPI YPTK Padang (JCSITECH)',
        relevansi: 'Basis aturan diagnosa optical drive / DVD-RW error',
        url: 'https://jcsitech-upiyptk.org/ojs'
      }
    ]
  },
  {
    id: 'L007',
    perangkat: 'laptop',
    kerusakan: 'Motherboard',
    deskripsi: 'Kerusakan sirkuit utama mainboard akibat overheating, short circuit ringan, atau kegagalan baterai CMOS. Menyebabkan laptop lambat, cepat panas, gagal shutdown, atau selalu meminta setup CMOS.',
    gejalaIds: ['L19', 'L20', 'L21', 'L22'],
    certaintyFactor: 0.98,
    referensiStatis: [
      {
        judul: 'Sistem Pakar Deteksi Kerusakan Laptop dengan Metode Forward Chaining',
        penulis: 'Teguh Muhammad Ilham',
        tahun: 2022,
        penerbit: 'UPI YPTK Padang (JCSITECH)',
        relevansi: 'Basis aturan pengujian sirkuit induk motherboard dan setting CMOS',
        url: 'https://jcsitech-upiyptk.org/ojs'
      }
    ]
  }
];
