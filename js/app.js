/**
 * Controller Utama & Router Aplikasi
 */
window.app = {
  async init() {
    // Tampilkan mode badge jika IS_MOCK aktif
    const badge = document.getElementById('app-badge');
    if (badge && window.APP_CONFIG.IS_MOCK) {
      badge.style.display = 'flex';
    }

    // Pasang event listener modal switch demo user
    this.setupDemoModalListeners();

    // Pastikan user default ada jika belum pernah login
    if (!window.auth.isAuthenticated()) {
      // Default awal adalah Siswa Andi Saputra
      window.auth.setCurrentUser(window.MOCK_DATA.users[0]);
      window.api.setToken('mock_token_usr_student_01');
    }

    // Dengarkan perubahan hash router
    window.addEventListener('hashchange', () => this.handleRouting());

    // Tentukan route awal jika kosong
    if (!window.location.hash || window.location.hash === '#') {
      const role = window.auth.getRole();
      if (role === 'TEACHER') window.location.hash = '#teacher/queue';
      else if (role === 'ADMIN') window.location.hash = '#admin/dashboard';
      else window.location.hash = '#student/dashboard';
    } else {
      this.handleRouting();
    }
  },

  setupDemoModalListeners() {
    const btnOpen = document.getElementById('btn-toggle-demo-users');
    const btnClose = document.getElementById('btn-close-demo-modal');
    const modal = document.getElementById('demo-user-modal');

    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    // Role switcher cards
    document.querySelectorAll('.role-select-card').forEach(card => {
      card.addEventListener('click', () => {
        const role = card.getAttribute('data-role');
        modal.style.display = 'none';
        window.auth.switchRole(role);
      });
    });
  },

  // Router
  async handleRouting() {
    const hash = window.location.hash || '#student/dashboard';
    const user = window.auth.getCurrentUser();
    const appEl = document.getElementById('app');

    // 1. Landing Page
    if (hash === '#landing') {
      appEl.innerHTML = this.renderLandingPage();
      return;
    }

    // 2. Login Page
    if (hash === '#login') {
      appEl.innerHTML = this.renderLoginPage();
      return;
    }

    // Jika belum login, redirect ke login
    if (!user) {
      window.location.hash = '#login';
      return;
    }

    // Render Shell (Sidebar + TopBar + Main Container)
    appEl.innerHTML = this.renderAppShell(user, hash);
    this.renderCurrentView();
  },

  renderAppShell(user, currentHash) {
    const role = user.role;
    const roleLabel = role === 'ADMIN' ? 'Administrator' :
      role === 'TEACHER' ? user.className || 'Guru' : user.className || 'Siswa';

    // Menu berdasarkan peran
    let navItems = [];
    if (role === 'STUDENT') {
      navItems = [
        { label: 'Beranda', hash: '#student/dashboard', icon: '🏠' },
        { label: 'Jurnal Hari Ini', hash: '#student/journal', icon: '📝' },
        { label: 'Materi Kebiasaan', hash: '#student/materi', icon: '📚' },
        { label: 'Profil', hash: '#student/profile', icon: '👤' }
      ];
    } else if (role === 'TEACHER') {
      navItems = [
        { label: 'Antrean Verifikasi', hash: '#teacher/queue', icon: '📋' },
        { label: 'Laporan & Rekap', hash: '#teacher/reports', icon: '📊' }
      ];
    } else if (role === 'ADMIN') {
      navItems = [
        { label: 'Dashboard', hash: '#admin/dashboard', icon: '📊' },
        { label: 'Laporan & Rekap', hash: '#admin/reports', icon: '📑' },
        { label: 'Materi Kebiasaan', hash: '#student/materi', icon: '📚' }
      ];
    }

    return `
      <div class="app-layout">
        <!-- Desktop Sidebar -->
        <aside class="app-sidebar">
          <div class="sidebar-header">
            <div class="brand-logo-circle">🇮🇩</div>
            <div class="brand-meta">
              <h2>Jurnal Digital</h2>
              <span>7 Kebiasaan Anak Indonesia Hebat</span>
            </div>
          </div>

          <!-- User Card -->
          <div class="sidebar-user">
            <div class="user-avatar-sm">${user.avatar || '👤'}</div>
            <div class="user-meta-sm">
              <strong>${user.fullName}</strong>
              <span>${roleLabel}</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="sidebar-nav">
            ${navItems.map(item => `
              <a href="${item.hash}" class="nav-item ${currentHash.startsWith(item.hash) ? 'active' : ''}">
                <span class="nav-icon">${item.icon}</span>
                <span>${item.label}</span>
              </a>
            `).join('')}
          </nav>

          <!-- Sidebar Footer -->
          <div class="sidebar-footer">
            <button class="btn-logout" onclick="window.auth.logout()">
              <span>🚪</span>
              <span>Keluar</span>
            </button>
          </div>
        </aside>

        <!-- Main Workspace Area -->
        <main class="app-main">
          <!-- Top App Bar -->
          <header class="top-app-bar">
            <div class="bar-title-section">
              <h1>${this.getPageTitle(currentHash)}</h1>
            </div>
            <div class="bar-date-section">
              <span class="date-pill">📅 Senin, 12 Mei 2025</span>
              <div style="font-size: 20px; cursor: pointer;" title="Notifikasi">🔔</div>
            </div>
          </header>

          <!-- Dynamic View Container -->
          <div id="view-content" class="view-content">
            <div class="app-loader">
              <div class="spinner"></div>
            </div>
          </div>
        </main>
      </div>

      <!-- Mobile Floating Bottom Nav -->
      <nav class="mobile-bottom-nav">
        <div class="mobile-nav-inner">
          ${navItems.map(item => `
            <a href="${item.hash}" class="mobile-nav-item ${currentHash.startsWith(item.hash) ? 'active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `).join('')}
          <a href="javascript:void(0)" class="mobile-nav-item" onclick="window.auth.logout()">
            <span class="nav-icon">🚪</span>
            <span>Keluar</span>
          </a>
        </div>
      </nav>
    `;
  },

  getPageTitle(hash) {
    if (hash.includes('dashboard')) return 'Beranda';
    if (hash.includes('journal')) return 'Form Jurnal Harian';
    if (hash.includes('queue')) return 'Antrean Verifikasi Guru';
    if (hash.includes('reports')) return 'Laporan & Rekap';
    if (hash.includes('materi')) return 'Materi 7 Kebiasaan';
    if (hash.includes('profile')) return 'Profil Pengguna';
    return 'Jurnal Digital';
  },

  async renderCurrentView() {
    const hash = window.location.hash || '#student/dashboard';
    const container = document.getElementById('view-content');
    if (!container) return;
    const user = window.auth.getCurrentUser();

    if (hash === '#student/dashboard') {
      const res = await window.api.request('/api/student/dashboard');
      container.innerHTML = window.studentView.renderDashboard(res.data, user);
    } else if (hash === '#student/journal') {
      const res = await window.api.request('/api/student/dashboard');
      container.innerHTML = window.studentView.renderJournalForm(res.data, user);
    } else if (hash === '#student/materi') {
      container.innerHTML = window.studentView.renderMaterials(window.MOCK_DATA.habits);
    } else if (hash === '#student/profile') {
      container.innerHTML = window.studentView.renderProfile(user);
    } else if (hash === '#teacher/queue') {
      const res = await window.api.request('/api/teacher/queue');
      container.innerHTML = window.teacherView.renderQueue(res.data.queue, user);
    } else if (hash === '#teacher/reports' || hash === '#admin/reports') {
      const res = await window.api.request('/api/reports/rekap');
      container.innerHTML = window.adminView.renderReports(res.data.reports);
    } else if (hash === '#admin/dashboard') {
      const res = await window.api.request('/api/admin/dashboard');
      container.innerHTML = window.adminView.renderDashboard(res.data);
    }
  },

  // Event Handler Form Siswa
  async handleJournalSubmit(e) {
    e.preventDefault();
    const checkedHabits = [];
    document.querySelectorAll('.checklist-item.checked').forEach(el => {
      checkedHabits.push(el.getAttribute('data-habit-id'));
    });

    const notes = document.getElementById('journal-notes')?.value || '';
    const photoUrl = document.getElementById('photo-preview-img')?.src || '';

    try {
      await window.api.request('/api/student/journal/submit', {
        method: 'POST',
        body: JSON.stringify({ checkedHabits, notes, photoUrl })
      });
      this.showToast('Jurnal harian berhasil dikirim ke guru!', 'success');
      window.location.hash = '#student/dashboard';
    } catch (err) {
      this.showToast('Gagal mengirim jurnal', 'error');
    }
  },

  async handleJournalDraft() {
    const checkedHabits = [];
    document.querySelectorAll('.checklist-item.checked').forEach(el => {
      checkedHabits.push(el.getAttribute('data-habit-id'));
    });
    const notes = document.getElementById('journal-notes')?.value || '';
    const photoUrl = document.getElementById('photo-preview-img')?.src || '';

    try {
      await window.api.request('/api/student/journal/save-draft', {
        method: 'POST',
        body: JSON.stringify({ checkedHabits, notes, photoUrl })
      });
      this.showToast('Draf jurnal tersimpan!', 'success');
    } catch (err) {
      this.showToast('Gagal menyimpan draf', 'error');
    }
  },

  // Toast System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Landing Page Template
  renderLandingPage() {
    return `
      <div class="landing-page">
        <header class="landing-header">
          <div class="landing-brand">
            <span style="font-size: 32px;">🇮🇩</span>
            <div>
              <h2 style="font-size: 18px;">Jurnal Digital 7 Kebiasaan</h2>
              <span style="font-size: 12px; color: var(--color-slate-medium);">Anak Hebat Indonesia Kuat</span>
            </div>
          </div>
          <div>
            <a href="#login" class="btn btn-primary">Masuk</a>
          </div>
        </header>

        <main class="landing-hero">
          <div class="landing-hero-illustration">
            <div class="landing-tagline">Membentuk Karakter Generasi Emas Sejak Dini</div>
          </div>

          <h1 style="font-size: 32px; font-weight: 900; color: #1e3a8a; margin-bottom: 12px;">
            7 Kebiasaan Anak Indonesia Hebat
          </h1>
          <p style="font-size: 16px; color: var(--color-slate-dark); max-width: 640px; margin-bottom: 24px;">
            Aplikasi pemantauan kebiasaan positif harian siswa sekolah dasar. Bangun pagi, beribadah, olahraga, makan sehat, belajar, gotong royong, dan tidur teratur.
          </p>

          <div class="landing-cta-row">
            <a href="#login" class="btn btn-primary btn-lg">Masuk ke Akun</a>
            <button class="btn btn-secondary btn-lg" onclick="window.app.showToast('Silakan hubungi admin sekolah untuk pendaftaran siswa baru', 'info')">
              Petunjuk Pendaftaran
            </button>
          </div>
        </main>
      </div>
    `;
  },

  // Login Page Template
  renderLoginPage() {
    return `
      <div class="login-page-wrapper">
        <div class="login-card">
          <div class="login-brand-header">
            <div style="font-size: 42px; margin-bottom: 8px;">🇮🇩</div>
            <h2>Jurnal Digital</h2>
            <p>7 Kebiasaan Anak Indonesia Hebat</p>
          </div>

          <form onsubmit="window.app.handleLoginForm(event)">
            <div class="form-group" style="text-align: left;">
              <label class="form-label">Username</label>
              <input type="text" id="login-username" class="form-control" placeholder="Masukkan username..." value="andi123" required>
            </div>

            <div class="form-group" style="text-align: left;">
              <label class="form-label">Kata Sandi</label>
              <div class="password-input-group">
                <input type="password" id="login-password" class="form-control" placeholder="Masukkan kata sandi..." value="password123" required>
                <span class="btn-toggle-eye" onclick="window.app.togglePasswordVisibility()">👁️</span>
              </div>
            </div>

            <div class="login-helpers">
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" checked> Ingat saya
              </label>
              <a href="javascript:void(0)" onclick="window.app.showToast('Silakan hubungi admin sekolah untuk reset password Anda', 'info')">Lupa kata sandi?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-bottom: 16px;">
              Masuk
            </button>

            <div style="font-size: 13px; color: var(--color-slate-medium);">
              Belum punya akun? <a href="javascript:void(0)" onclick="window.app.showToast('Kredensial diberikan oleh wali kelas/admin sekolah', 'info')">Hubungi admin sekolah</a>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  togglePasswordVisibility() {
    const input = document.getElementById('login-password');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  },

  async handleLoginForm(e) {
    e.preventDefault();
    const username = document.getElementById('login-username')?.value;
    const password = document.getElementById('login-password')?.value;
    try {
      const user = await window.auth.login(username, password);
      this.showToast(`Selamat datang, ${user.fullName}!`, 'success');
      if (user.role === 'TEACHER') window.location.hash = '#teacher/queue';
      else if (user.role === 'ADMIN') window.location.hash = '#admin/dashboard';
      else window.location.hash = '#student/dashboard';
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
