/**
 * Abstraksi API Client
 * Menjembatani panggilan frontend ke Cloudflare Worker API
 * atau ke Data Simulasi saat APP_CONFIG.IS_MOCK = true.
 */
window.api = {
  // Ambil token sesi aktif
  getToken() {
    return localStorage.getItem('kaih_session_token') || '';
  },

  // Simpan token sesi
  setToken(token) {
    if (token) localStorage.setItem('kaih_session_token', token);
    else localStorage.removeItem('kaih_session_token');
  },

  // Helper request umum
  async request(endpoint, options = {}) {
    if (window.APP_CONFIG.IS_MOCK) {
      // Simulasi delay jaringan realistis 150ms
      await new Promise(r => setTimeout(r, 150));
      return this.handleMockRequest(endpoint, options);
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Version': window.APP_CONFIG.APP_VERSION,
      ...(this.getToken() ? { 'Authorization': `Bearer ${this.getToken()}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Terjadi kesalahan pada server');
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Penanganan request simulasi
  async handleMockRequest(endpoint, options) {
    const method = options.method || 'GET';

    // 1. Auth: Login
    if (endpoint === '/api/auth/login' && method === 'POST') {
      const { username } = JSON.parse(options.body || '{}');
      const user = window.MOCK_DATA.users.find(u => u.username.toLowerCase() === (username || '').toLowerCase()) 
        || window.MOCK_DATA.users[0]; // fallback default ke Andi Saputra
      this.setToken(`mock_token_${user.userId}`);
      return { success: true, data: { user, token: `mock_token_${user.userId}` } };
    }

    // 2. Auth: Me
    if (endpoint === '/api/auth/me') {
      const currentUser = window.auth.getCurrentUser() || window.MOCK_DATA.users[0];
      return { success: true, data: { user: currentUser } };
    }

    // 3. Siswa: Dashboard
    if (endpoint === '/api/student/dashboard') {
      return {
        success: true,
        data: {
          todayJournal: window.MOCK_DATA.studentTodayJournal,
          habits: window.MOCK_DATA.habits
        }
      };
    }

    // 4. Siswa: Kirim / Simpan Jurnal
    if (endpoint === '/api/student/journal/submit' && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      window.MOCK_DATA.studentTodayJournal = {
        ...window.MOCK_DATA.studentTodayJournal,
        ...body,
        status: 'SUBMITTED',
        lastUpdated: '12 Mei 2025, 07:45 WIB'
      };
      return { success: true, message: 'Jurnal harian berhasil dikirim ke guru!', data: window.MOCK_DATA.studentTodayJournal };
    }

    if (endpoint === '/api/student/journal/save-draft' && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      window.MOCK_DATA.studentTodayJournal = {
        ...window.MOCK_DATA.studentTodayJournal,
        ...body,
        status: 'DRAFT'
      };
      return { success: true, message: 'Draf jurnal berhasil disimpan', data: window.MOCK_DATA.studentTodayJournal };
    }

    // 5. Guru: Antrean Verifikasi
    if (endpoint.startsWith('/api/teacher/queue')) {
      return {
        success: true,
        data: {
          queue: window.MOCK_DATA.teacherQueue
        }
      };
    }

    // 6. Guru: Putusan Verifikasi
    if (endpoint.startsWith('/api/teacher/journal/') && endpoint.endsWith('/verify') && method === 'POST') {
      const body = JSON.parse(options.body || '{}');
      const parts = endpoint.split('/');
      const queueId = parseInt(parts[4], 10);
      const item = window.MOCK_DATA.teacherQueue.find(q => q.id === queueId);
      if (item) {
        item.status = body.action === 'APPROVE' ? 'VERIFIED' : 'REVISION_REQUIRED';
        item.statusLabel = body.action === 'APPROVE' ? 'Terverifikasi' : 'Perlu Perbaikan';
        item.teacherComment = body.comment || '';
      }
      return { success: true, message: 'Keputusan verifikasi berhasil disimpan!' };
    }

    // 7. Admin: Dashboard
    if (endpoint === '/api/admin/dashboard') {
      return {
        success: true,
        data: {
          kpis: window.MOCK_DATA.adminKpis,
          auditLogs: window.MOCK_DATA.auditLogs
        }
      };
    }

    // 8. Laporan: Rekap
    if (endpoint.startsWith('/api/reports/rekap')) {
      return {
        success: true,
        data: {
          reports: window.MOCK_DATA.rekapReports
        }
      };
    }

    return { success: true, data: {} };
  }
};
