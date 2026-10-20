/**
 * Modul Autentikasi & Sesi
 */
window.auth = {
  // Ambil data user yang tersimpan
  getCurrentUser() {
    const raw = localStorage.getItem('kaih_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Simpan data user
  setCurrentUser(user) {
    if (user) localStorage.setItem('kaih_user', JSON.stringify(user));
    else localStorage.removeItem('kaih_user');
  },

  // Periksa apakah sudah login
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  // Dapatkan peran pengguna saat ini: 'STUDENT', 'TEACHER', 'ADMIN'
  getRole() {
    return this.getCurrentUser()?.role || null;
  },

  // Login
  async login(username, password) {
    const res = await window.api.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.success && res.data.user) {
      this.setCurrentUser(res.data.user);
      return res.data.user;
    }
    throw new Error('Username atau kata sandi tidak sesuai.');
  },

  // Logout
  async logout() {
    window.api.setToken(null);
    this.setCurrentUser(null);
    window.location.hash = '#login';
  },

  // Beralih Peran Cepat (Fitur preview/demo sesuai spesifikasi PRD)
  switchRole(roleName) {
    const targetUser = window.MOCK_DATA.users.find(u => u.role === roleName);
    if (targetUser) {
      this.setCurrentUser(targetUser);
      window.api.setToken(`mock_token_${targetUser.userId}`);
      if (roleName === 'STUDENT') window.location.hash = '#student/dashboard';
      else if (roleName === 'TEACHER') window.location.hash = '#teacher/queue';
      else if (roleName === 'ADMIN') window.location.hash = '#admin/dashboard';
      window.location.reload();
    }
  }
};
