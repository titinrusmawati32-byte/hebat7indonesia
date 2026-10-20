/**
 * Konfigurasi Aplikasi Jurnal Digital 7 Kebiasaan Anak Indonesia Hebat
 */
window.APP_CONFIG = {
  // Saklar Mode:
  // true = Gunakan simulasi memori lokal (untuk preview instan / testing offline tanpa backend)
  // false = Hubungkan langsung ke Cloudflare Worker API
  IS_MOCK: true,

  // Endpoint Cloudflare Worker (Diisi saat deployment Cloudflare Worker aktif)
  API_BASE_URL: 'https://jurnal-7kebiasaan-api.yourdomain.workers.dev',

  // Identitas & Pengaturan Default Sekolah
  SCHOOL_NAME: 'SD Negeri Indonesia Hebat',
  SCHOOL_TAGLINE: 'Anak Hebat Indonesia Kuat',
  DEFAULT_TIMEZONE: 'Asia/Jakarta',

  // Versi Aplikasi
  APP_VERSION: '1.0.0',

  // Batas Unggah Foto
  MAX_PHOTO_SIZE_BYTES: 2 * 1024 * 1024, // 2MB
  ALLOWED_PHOTO_TYPES: ['image/jpeg', 'image/png']
};
