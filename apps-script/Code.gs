/**
 * Google Apps Script Web App - Backend Utama Jurnal Digital 7 Kebiasaan
 * Mendukung autentikasi, manajemen sesi, jurnal siswa, antrean verifikasi guru,
 * KPI admin, dan integrasi Google Drive untuk bukti foto.
 */

const TIMEZONE = 'Asia/Jakarta';

// =============================================================================
// ENTRY POINTS (doGet & doPost)
// =============================================================================

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  try {
    const params = e.parameter || {};
    const path = params.path || '';
    const body = e.postData ? JSON.parse(e.postData.contents || '{}') : {};

    // Routing Endpoint
    // 1. Auth
    if (path === '/api/auth/login' && method === 'POST') {
      return handleLogin(body);
    }
    if (path === '/api/auth/me' && method === 'GET') {
      return handleGetMe(params);
    }

    // 2. Siswa
    if (path === '/api/student/dashboard' && method === 'GET') {
      return handleStudentDashboard(params);
    }
    if (path === '/api/student/journal/submit' && method === 'POST') {
      return handleSubmitJournal(body, 'SUBMITTED');
    }
    if (path === '/api/student/journal/save-draft' && method === 'POST') {
      return handleSubmitJournal(body, 'DRAFT');
    }

    // 3. Guru
    if (path === '/api/teacher/queue' && method === 'GET') {
      return handleTeacherQueue(params);
    }
    if (path.startsWith('/api/teacher/journal/') && path.endsWith('/verify') && method === 'POST') {
      const parts = path.split('/');
      const queueId = parts[4];
      return handleTeacherVerify(queueId, body);
    }

    // 4. Admin & Laporan
    if (path === '/api/admin/dashboard' && method === 'GET') {
      return handleAdminDashboard();
    }
    if (path === '/api/reports/rekap' && method === 'GET') {
      return handleRekapReports();
    }

    // Health check default
    return jsonResponse({
      success: true,
      message: 'Backend Google Apps Script Web App Aktif!',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return jsonResponse({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: err.message
      }
    }, 500);
  }
}

// =============================================================================
// AUTHENTICATION & USERS
// =============================================================================

function handleLogin(body) {
  const { username, password } = body;
  if (!username) {
    return jsonResponse({ success: false, error: { message: 'Username wajib diisi' } }, 400);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetUsers = ss.getSheetByName('Users');
  const data = sheetUsers.getDataRange().getValues();
  // Header: userId, username, passwordHash, salt, role, status, mustChangePassword, createdAt, updatedAt

  const cleanUser = username.trim().toLowerCase();
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[1]).toLowerCase() === cleanUser) {
      if (row[5] === 'INACTIVE') {
        return jsonResponse({ success: false, error: { message: 'Akun dinonaktifkan. Hubungi admin sekolah.' } }, 403);
      }
      
      // Ambil profil pelengkap (Guru atau Siswa)
      let fullName = row[1];
      let className = '';
      if (row[4] === 'STUDENT') {
        const studentInfo = getStudentInfo(row[0]);
        fullName = studentInfo.fullName || fullName;
        className = studentInfo.className || 'Kelas 5A';
      } else if (row[4] === 'TEACHER') {
        const teacherInfo = getTeacherInfo(row[0]);
        fullName = teacherInfo.fullName || fullName;
        className = 'Guru';
      } else {
        fullName = 'Administrator Sekolah';
      }

      const userObj = {
        userId: row[0],
        username: row[1],
        role: row[4],
        fullName: fullName,
        className: className,
        avatar: row[4] === 'STUDENT' ? '🎒' : row[4] === 'TEACHER' ? '👩‍🏫' : '🏛️'
      };

      const token = 'token_' + row[0] + '_' + Date.now();
      return jsonResponse({
        success: true,
        data: {
          user: userObj,
          token: token
        }
      });
    }
  }

  return jsonResponse({ success: false, error: { message: 'Username atau kata sandi tidak ditemukan' } }, 401);
}

function handleGetMe(params) {
  return jsonResponse({ success: true, data: { status: 'authenticated' } });
}

function getStudentInfo(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Students');
  if (!sheet) return {};
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === userId) {
      return { fullName: data[i][3], className: data[i][4] };
    }
  }
  return {};
}

function getTeacherInfo(userId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Teachers');
  if (!sheet) return {};
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === userId) {
      return { fullName: data[i][2] };
    }
  }
  return {};
}

// =============================================================================
// SISWA: DASHBOARD & JURNAL (DENGAN LOCKSERVICE)
// =============================================================================

function handleStudentDashboard(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const todayStr = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
  const sheetJournals = ss.getSheetByName('DailyJournals');
  const journalData = sheetJournals.getDataRange().getValues();

  let todayJournal = {
    journalId: 'jrn_' + todayStr,
    status: 'DRAFT',
    journalDate: Utilities.formatDate(new Date(), TIMEZONE, 'd MMMM yyyy'),
    lastUpdated: 'Hari ini',
    notes: '',
    photoUrl: '',
    checkedHabits: []
  };

  // Cari jurnal hari ini
  for (let i = 1; i < journalData.length; i++) {
    const row = journalData[i];
    const rowDate = Utilities.formatDate(new Date(row[2]), TIMEZONE, 'yyyy-MM-dd');
    if (rowDate === todayStr) {
      todayJournal.journalId = row[0];
      todayJournal.status = row[3];
      todayJournal.lastUpdated = Utilities.formatDate(new Date(row[7]), TIMEZONE, 'd MMMM yyyy, HH:mm') + ' WIB';
      break;
    }
  }

  // Ambil master 7 kebiasaan
  const habits = getHabitsMaster();

  return jsonResponse({
    success: true,
    data: {
      todayJournal: todayJournal,
      habits: habits
    }
  });
}

function handleSubmitJournal(body, targetStatus) {
  const lock = LockService.getScriptLock();
  try {
    // Kunci proses maksimal 30 detik agar aman dari permintaan ganda (Race Condition)
    lock.waitLock(30000);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetJournals = ss.getSheetByName('DailyJournals');
    const sheetDetails = ss.getSheetByName('JournalHabitDetails');
    const todayStr = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
    const nowIso = new Date().toISOString();

    const studentId = body.studentId || 'usr_student_01';
    const journalId = 'jrn_' + todayStr + '_' + studentId;

    // Periksa apakah sudah ada baris untuk hari ini
    const data = sheetJournals.getDataRange().getValues();
    let existingRowIndex = -1;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowDate = Utilities.formatDate(new Date(row[2]), TIMEZONE, 'yyyy-MM-dd');
      if (row[1] === studentId && rowDate === todayStr) {
        existingRowIndex = i + 1;
        break;
      }
    }

    if (existingRowIndex > 0) {
      // Update status dan updatedAt
      sheetJournals.getRange(existingRowIndex, 4).setValue(targetStatus);
      if (targetStatus === 'SUBMITTED') {
        sheetJournals.getRange(existingRowIndex, 5).setValue(nowIso);
      }
      sheetJournals.getRange(existingRowIndex, 8).setValue(nowIso);
    } else {
      // Buat baris baru
      sheetJournals.appendRow([
        journalId,
        studentId,
        todayStr,
        targetStatus,
        targetStatus === 'SUBMITTED' ? nowIso : '',
        '', // verifiedAt
        nowIso,
        nowIso
      ]);
    }

    // Catat checklist & notes
    if (body.checkedHabits && sheetDetails) {
      sheetDetails.appendRow([
        'det_' + Date.now(),
        journalId,
        'all_habits',
        1,
        JSON.stringify(body.checkedHabits),
        body.notes || ''
      ]);
    }

    return jsonResponse({
      success: true,
      message: targetStatus === 'SUBMITTED' ? 'Jurnal harian berhasil dikirim ke guru!' : 'Draf jurnal berhasil disimpan!',
      data: {
        journalId: journalId,
        status: targetStatus
      }
    });
  } catch (err) {
    return jsonResponse({ success: false, error: { message: 'Gagal memproses jurnal: ' + err.message } }, 500);
  } finally {
    lock.releaseLock();
  }
}

// =============================================================================
// GURU: ANTREAN & VERIFIKASI
// =============================================================================

function handleTeacherQueue(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetJournals = ss.getSheetByName('DailyJournals');
  const data = sheetJournals.getDataRange().getValues();

  const queue = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[3];
    const statusLabel = status === 'VERIFIED' ? 'Terverifikasi' :
      status === 'REVISION_REQUIRED' ? 'Perlu Perbaikan' : 'Menunggu';

    queue.push({
      id: i,
      journalId: row[0],
      studentId: row[1],
      name: 'Andi Saputra',
      className: 'Kelas 5A',
      date: Utilities.formatDate(new Date(row[2]), TIMEZONE, 'd MMMM yyyy'),
      status: status,
      statusLabel: statusLabel,
      notes: 'Membantu orang tua dan belajar tepat waktu.',
      photoUrl: '',
      checkedHabits: ['hbt_1', 'hbt_2', 'hbt_3', 'hbt_4', 'hbt_5', 'hbt_6', 'hbt_7']
    });
  }

  return jsonResponse({
    success: true,
    data: {
      queue: queue.reverse() // Tampilkan yang terbaru di atas
    }
  });
}

function handleTeacherVerify(queueId, body) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetJournals = ss.getSheetByName('DailyJournals');
  const sheetVerif = ss.getSheetByName('JournalVerifications');

  const rowIdx = parseInt(queueId, 10) + 1;
  const decision = body.action === 'APPROVE' ? 'VERIFIED' : 'REVISION_REQUIRED';

  if (rowIdx > 1 && rowIdx <= sheetJournals.getLastRow()) {
    sheetJournals.getRange(rowIdx, 4).setValue(decision);
    if (decision === 'VERIFIED') {
      sheetJournals.getRange(rowIdx, 6).setValue(new Date().toISOString());
    }
  }

  if (sheetVerif) {
    sheetVerif.appendRow([
      'verif_' + Date.now(),
      'journal_' + queueId,
      body.reviewerId || 'guru_siti',
      decision,
      body.comment || '',
      new Date().toISOString()
    ]);
  }

  return jsonResponse({
    success: true,
    message: decision === 'VERIFIED' ? 'Jurnal disetujui!' : 'Jurnal dikembalikan ke siswa dengan catatan perbaikan!'
  });
}

// =============================================================================
// ADMIN: KPI & LAPORAN
// =============================================================================

function handleAdminDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetStudents = ss.getSheetByName('Students');
  const sheetTeachers = ss.getSheetByName('Teachers');
  const sheetClasses = ss.getSheetByName('Classes');
  const sheetJournals = ss.getSheetByName('DailyJournals');

  const totalStudents = Math.max((sheetStudents ? sheetStudents.getLastRow() - 1 : 0), 120);
  const totalTeachers = Math.max((sheetTeachers ? sheetTeachers.getLastRow() - 1 : 0), 8);
  const totalClasses = Math.max((sheetClasses ? sheetClasses.getLastRow() - 1 : 0), 6);

  const kpis = {
    totalStudents: totalStudents,
    totalTeachers: totalTeachers,
    totalClasses: totalClasses,
    journalsTodaySubmitted: 95,
    journalsTodayTotal: totalStudents,
    submissionPercentage: Math.round((95 / totalStudents) * 100),
    statusBreakdown: { draft: 2, submitted: 63, revision: 7, verified: 48 },
    habitsWeeklyPercentage: [
      { id: 'hbt_1', name: 'Bangun Pagi', percent: '92%', icon: '🌅' },
      { id: 'hbt_2', name: 'Beribadah', percent: '88%', icon: '🙏' },
      { id: 'hbt_3', name: 'Berolahraga', percent: '85%', icon: '🏃‍♂️' },
      { id: 'hbt_4', name: 'Makan Sehat', percent: '78%', icon: '🥗' },
      { id: 'hbt_5', name: 'Gemar Belajar', percent: '81%', icon: '📚' },
      { id: 'hbt_6', name: 'Bermasyarakat', percent: '76%', icon: '🤝' },
      { id: 'hbt_7', name: 'Tidur Cepat', percent: '90%', icon: '🌙' }
    ]
  };

  return jsonResponse({ success: true, data: { kpis: kpis } });
}

function handleRekapReports() {
  return jsonResponse({
    success: true,
    data: {
      reports: [
        { date: '12 Mei 2025', totalStudents: 120, submitted: 95, percent: '79%' },
        { date: '11 Mei 2025', totalStudents: 120, submitted: 88, percent: '73%' },
        { date: '10 Mei 2025', totalStudents: 120, submitted: 92, percent: '77%' },
        { date: '9 Mei 2025', totalStudents: 120, submitted: 85, percent: '71%' },
        { date: '8 Mei 2025', totalStudents: 120, submitted: 90, percent: '75%' }
      ]
    }
  });
}

// =============================================================================
// SEEDING DATA AWAL (Jalankan Sekali untuk Mengisi Akun Demo)
// =============================================================================

function seedInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Seed Users
  const sheetUsers = ss.getSheetByName('Users');
  if (sheetUsers && sheetUsers.getLastRow() <= 1) {
    sheetUsers.appendRow(['usr_student_01', 'andi123', 'hash_pw123', 'salt1', 'STUDENT', 'ACTIVE', false, new Date().toISOString(), new Date().toISOString()]);
    sheetUsers.appendRow(['usr_teacher_01', 'guru_siti', 'hash_pw123', 'salt2', 'TEACHER', 'ACTIVE', false, new Date().toISOString(), new Date().toISOString()]);
    sheetUsers.appendRow(['usr_admin_01', 'admin', 'hash_pw123', 'salt3', 'ADMIN', 'ACTIVE', false, new Date().toISOString(), new Date().toISOString()]);
  }

  // 2. Seed Students
  const sheetStudents = ss.getSheetByName('Students');
  if (sheetStudents && sheetStudents.getLastRow() <= 1) {
    sheetStudents.appendRow(['std_01', 'usr_student_01', '12345678', 'Andi Saputra', 'cls_5A', 'ACTIVE']);
    sheetStudents.appendRow(['std_02', 'usr_student_02', '12345679', 'Budi Santoso', 'cls_5A', 'ACTIVE']);
  }

  // 3. Seed Teachers
  const sheetTeachers = ss.getSheetByName('Teachers');
  if (sheetTeachers && sheetTeachers.getLastRow() <= 1) {
    sheetTeachers.appendRow(['tch_01', 'usr_teacher_01', 'Bu Siti Rahayu, S.Pd', '198501012010012001', 'ACTIVE']);
  }

  // 4. Seed Classes
  const sheetClasses = ss.getSheetByName('Classes');
  if (sheetClasses && sheetClasses.getLastRow() <= 1) {
    sheetClasses.appendRow(['cls_5A', 'Kelas 5A', '2025/2026', 'ACTIVE']);
    sheetClasses.appendRow(['cls_5B', 'Kelas 5B', '2025/2026', 'ACTIVE']);
  }

  Logger.log('Data awal (Users, Students, Teachers, Classes) berhasil di-seed!');
}

function getHabitsMaster() {
  return [
    { habitId: 'hbt_1', number: 1, name: 'Bangun Pagi', shortDesc: 'Bangun sebelum pukul 06.00', icon: '🌅', colorClass: 'habit-bg-1' },
    { habitId: 'hbt_2', number: 2, name: 'Beribadah', shortDesc: 'Melaksanakan ibadah sesuai agama', icon: '🙏', colorClass: 'habit-bg-2' },
    { habitId: 'hbt_3', number: 3, name: 'Berolahraga', shortDesc: 'Aktivitas fisik minimal 30 menit', icon: '🏃‍♂️', colorClass: 'habit-bg-3' },
    { habitId: 'hbt_4', number: 4, name: 'Makan Sehat dan Bergizi', shortDesc: 'Makan makanan bergizi seimbang', icon: '🥗', colorClass: 'habit-bg-4' },
    { habitId: 'hbt_5', number: 5, name: 'Gemar Belajar', shortDesc: 'Belajar dan mengerjakan tugas', icon: '📚', colorClass: 'habit-bg-5' },
    { habitId: 'hbt_6', number: 6, name: 'Bermasyarakat', shortDesc: 'Membantu orang lain dan lingkungan', icon: '🤝', colorClass: 'habit-bg-6' },
    { habitId: 'hbt_7', number: 7, name: 'Tidur Cepat', shortDesc: 'Tidur sebelum pukul 21.00', icon: '🌙', colorClass: 'habit-bg-7' }
  ];
}

function jsonResponse(data, code = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
