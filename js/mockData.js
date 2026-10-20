/**
 * Data Simulasi Realistis (Sesuai Spesifikasi PRD & Mockup UI)
 */
window.MOCK_DATA = {
  // Pengguna Default
  users: [
    {
      userId: 'usr_student_01',
      username: 'andi123',
      fullName: 'Andi Saputra',
      role: 'STUDENT',
      studentNumber: '12345678',
      classId: 'cls_5A',
      className: 'Kelas 5A',
      email: 'andi@mail.com',
      avatar: '🎒',
      status: 'ACTIVE'
    },
    {
      userId: 'usr_teacher_01',
      username: 'guru_siti',
      fullName: 'Bu Siti Rahayu',
      role: 'TEACHER',
      employeeNumber: '198501012010012001',
      assignedClasses: ['cls_5A', 'cls_5B'],
      className: 'Kelas 5A',
      email: 'siti.rahayu@sekolah.sch.id',
      avatar: '👩‍🏫',
      status: 'ACTIVE'
    },
    {
      userId: 'usr_admin_01',
      username: 'admin',
      fullName: 'Admin Sekolah',
      role: 'ADMIN',
      email: 'admin@sekolah.sch.id',
      avatar: '🏛️',
      status: 'ACTIVE'
    }
  ],

  // Master 7 Kebiasaan
  habits: [
    {
      habitId: 'hbt_1',
      number: 1,
      name: 'Bangun Pagi',
      shortDesc: 'Bangun sebelum pukul 06.00',
      icon: '🌅',
      colorClass: 'habit-bg-1',
      checklist: [
        { id: 'chk_1_1', text: 'Bangun pagi sebelum subuh / sebelum pukul 06.00', checked: true },
        { id: 'chk_1_2', text: 'Merapikan tempat tidur sendiri', checked: true }
      ],
      material: 'Bangun pagi melatih kedisiplinan dan kesiapan mental untuk memulai hari belajar dengan penuh semangat dan keceriaan.'
    },
    {
      habitId: 'hbt_2',
      number: 2,
      name: 'Beribadah',
      shortDesc: 'Melaksanakan ibadah sesuai agama',
      icon: '🙏',
      colorClass: 'habit-bg-2',
      checklist: [
        { id: 'chk_2_1', text: 'Melaksanakan doa / ibadah tepat waktu', checked: true },
        { id: 'chk_2_2', text: 'Mendoakan orang tua, guru, dan teman', checked: true }
      ],
      material: 'Beribadah menumbuhkan rasa syukur, ketenangan batin, serta akhlak mulia dan kasih sayang kepada sesama.'
    },
    {
      habitId: 'hbt_3',
      number: 3,
      name: 'Berolahraga',
      shortDesc: 'Aktivitas fisik minimal 30 menit',
      icon: '🏃‍♂️',
      colorClass: 'habit-bg-3',
      checklist: [
        { id: 'chk_3_1', text: 'Melakukan senam pagi, lari santai, atau bersepeda min. 30 menit', checked: true },
        { id: 'chk_3_2', text: 'Minum air putih setelah berolahraga', checked: true }
      ],
      material: 'Tubuh yang bugar membuat daya tahan tubuh kuat dan pikiran lebih fokus dalam menerima pelajaran.'
    },
    {
      habitId: 'hbt_4',
      number: 4,
      name: 'Makan Sehat dan Bergizi',
      shortDesc: 'Makan makanan bergizi seimbang',
      icon: '🥗',
      colorClass: 'habit-bg-4',
      checklist: [
        { id: 'chk_4_1', text: 'Makan sarapan atau bekal 4 sehat 5 sempurna', checked: true },
        { id: 'chk_4_2', text: 'Mengonsumsi sayur dan buah hari ini', checked: true }
      ],
      material: 'Nutrisi bergizi seimbang penting untuk pertumbuhan otak, tulang, dan energi belajar siswa.'
    },
    {
      habitId: 'hbt_5',
      number: 5,
      name: 'Gemar Belajar',
      shortDesc: 'Belajar dan mengerjakan tugas',
      icon: '📚',
      colorClass: 'habit-bg-5',
      checklist: [
        { id: 'chk_5_1', text: 'Membaca buku non-pelajaran atau cerita edukasi minimal 15 menit', checked: true },
        { id: 'chk_5_2', text: 'Menyelesaikan PR dan mempersiapkan buku pelajaran esok hari', checked: true }
      ],
      material: 'Membaca adalah jendela dunia. Meluangkan waktu belajar setiap hari mengasah kecerdasan dan rasa ingin tahu.'
    },
    {
      habitId: 'hbt_6',
      number: 6,
      name: 'Bermasyarakat',
      shortDesc: 'Membantu orang lain dan menjaga lingkungan',
      icon: '🤝',
      colorClass: 'habit-bg-6',
      checklist: [
        { id: 'chk_6_1', text: 'Membantu orang tua di rumah atau teman di sekolah', checked: true },
        { id: 'chk_6_2', text: 'Membuang sampah pada tempatnya dan merawat tanaman', checked: true }
      ],
      material: 'Kepedulian sosial dan kepedulian lingkungan melatih anak Indonesia menjadi pribadi berkarakter gotong royong.'
    },
    {
      habitId: 'hbt_7',
      number: 7,
      name: 'Tidur Cepat',
      shortDesc: 'Tidur sebelum pukul 21.00',
      icon: '🌙',
      colorClass: 'habit-bg-7',
      checklist: [
        { id: 'chk_7_1', text: 'Menggosok gigi dan mencuci kaki sebelum tidur', checked: true },
        { id: 'chk_7_2', text: 'Tidur malam maksimal pukul 21.00 WIB', checked: true }
      ],
      material: 'Tidur cukup 8-9 jam di malam hari mengistirahatkan otak dan menyegarkan sel-sel tubuh untuk esok pagi.'
    }
  ],

  // Jurnal Hari Ini untuk Siswa Utama (Andi Saputra)
  studentTodayJournal: {
    journalId: 'jrn_today_andi',
    studentId: 'usr_student_01',
    studentName: 'Andi Saputra',
    className: 'Kelas 5A',
    journalDate: '12 Mei 2025',
    status: 'SUBMITTED', // SUBMITTED / DRAFT / REVISION_REQUIRED / VERIFIED
    lastUpdated: '12 Mei 2025, 07:45 WIB',
    notes: 'Hari ini saya sarapan dengan telur dan sayur bayam, lalu membantu ibu menyiram tanaman di halaman rumah.',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    verificationNote: '',
    checkedHabits: ['hbt_1', 'hbt_2', 'hbt_3', 'hbt_4', 'hbt_5', 'hbt_6', 'hbt_7']
  },

  // Antrean Verifikasi untuk Guru (Bu Siti Rahayu)
  teacherQueue: [
    {
      id: 1,
      studentId: 'usr_student_01',
      name: 'Andi Saputra',
      className: 'Kelas 5A',
      date: '12 Mei 2025',
      status: 'SUBMITTED',
      statusLabel: 'Menunggu',
      notes: 'Membantu ibu menyiram tanaman dan membaca buku dongeng Nusantara.',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      checkedHabits: ['hbt_1', 'hbt_2', 'hbt_3', 'hbt_4', 'hbt_5', 'hbt_6', 'hbt_7']
    },
    {
      id: 2,
      studentId: 'std_02',
      name: 'Budi Santoso',
      className: 'Kelas 5A',
      date: '12 Mei 2025',
      status: 'SUBMITTED',
      statusLabel: 'Menunggu',
      notes: 'Lari pagi bersama ayah di taman komplek selama 30 menit.',
      photoUrl: '',
      checkedHabits: ['hbt_1', 'hbt_2', 'hbt_3', 'hbt_4', 'hbt_7']
    },
    {
      id: 3,
      studentId: 'std_03',
      name: 'Citra Lestari',
      className: 'Kelas 5A',
      date: '12 Mei 2025',
      status: 'SUBMITTED',
      statusLabel: 'Menunggu',
      notes: 'Membaca buku ensiklopedia sains dan memakan buah pisang.',
      photoUrl: '',
      checkedHabits: ['hbt_1', 'hbt_2', 'hbt_4', 'hbt_5', 'hbt_6', 'hbt_7']
    },
    {
      id: 4,
      studentId: 'std_04',
      name: 'Dimas Pratama',
      className: 'Kelas 5A',
      date: '12 Mei 2025',
      status: 'REVISION_REQUIRED',
      statusLabel: 'Perlu Perbaikan',
      notes: 'Hanya mengisi 2 kebiasaan tanpa catatan.',
      teacherComment: 'Tolong lengkapi kegiatan beribadah dan gemar belajar ya Dimas!',
      photoUrl: '',
      checkedHabits: ['hbt_1', 'hbt_7']
    },
    {
      id: 5,
      studentId: 'std_05',
      name: 'Eka Wulandari',
      className: 'Kelas 5A',
      date: '11 Mei 2025',
      status: 'SUBMITTED',
      statusLabel: 'Menunggu',
      notes: 'Membantu adik belajar membaca dan makan sayur sop.',
      photoUrl: '',
      checkedHabits: ['hbt_1', 'hbt_2', 'hbt_4', 'hbt_5', 'hbt_6']
    },
    {
      id: 6,
      studentId: 'std_06',
      name: 'Fajar Nugroho',
      className: 'Kelas 5A',
      date: '11 Mei 2025',
      status: 'VERIFIED',
      statusLabel: 'Terverifikasi',
      notes: 'Kegiatan lengkap dan foto olahraga terlampir dengan baik.',
      teacherComment: 'Hebat Fajar! Pertahankan kedisiplinan berolahraga.',
      photoUrl: '',
      checkedHabits: ['hbt_1', 'hbt_2', 'hbt_3', 'hbt_4', 'hbt_5', 'hbt_6', 'hbt_7']
    }
  ],

  // Ringkasan KPI Admin (Sesuai Mockup UI)
  adminKpis: {
    totalStudents: 120,
    totalTeachers: 8,
    totalClasses: 6,
    journalsTodaySubmitted: 95,
    journalsTodayTotal: 120,
    submissionPercentage: 79,
    statusBreakdown: {
      draft: 2,
      submitted: 63,
      revision: 7,
      verified: 48
    },
    habitsWeeklyPercentage: [
      { id: 'hbt_1', name: 'Bangun Pagi', percent: '92%', icon: '🌅' },
      { id: 'hbt_2', name: 'Beribadah', percent: '88%', icon: '🙏' },
      { id: 'hbt_3', name: 'Berolahraga', percent: '85%', icon: '🏃‍♂️' },
      { id: 'hbt_4', name: 'Makan Sehat', percent: '78%', icon: '🥗' },
      { id: 'hbt_5', name: 'Gemar Belajar', percent: '81%', icon: '📚' },
      { id: 'hbt_6', name: 'Bermasyarakat', percent: '76%', icon: '🤝' },
      { id: 'hbt_7', name: 'Tidur Cepat', percent: '90%', icon: '🌙' }
    ]
  },

  // Rekap Laporan Harian
  rekapReports: [
    { date: '12 Mei 2025', totalStudents: 120, submitted: 95, percent: '79%' },
    { date: '11 Mei 2025', totalStudents: 120, submitted: 88, percent: '73%' },
    { date: '10 Mei 2025', totalStudents: 120, submitted: 92, percent: '77%' },
    { date: '9 Mei 2025', totalStudents: 120, submitted: 85, percent: '71%' },
    { date: '8 Mei 2025', totalStudents: 120, submitted: 90, percent: '75%' }
  ],

  // Audit Logs
  auditLogs: [
    { id: 'log_01', actor: 'Andi Saputra (Siswa)', action: 'SUBMIT_JOURNAL', target: 'Jurnal 12 Mei 2025', time: '12 Mei 2025, 07:45 WIB', status: 'SUCCESS' },
    { id: 'log_02', actor: 'Bu Siti Rahayu (Guru)', action: 'VERIFY_JOURNAL', target: 'Jurnal Fajar Nugroho', time: '11 Mei 2025, 14:20 WIB', status: 'SUCCESS' },
    { id: 'log_03', actor: 'Admin Sekolah', action: 'EXPORT_REPORT', target: 'Rekap Mingguan PDF', time: '11 Mei 2025, 09:15 WIB', status: 'SUCCESS' }
  ]
};
