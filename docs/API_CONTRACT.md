# Kontrak API: Jurnal Digital 7 Kebiasaan Anak Indonesia Hebat
**Versi:** 1.0.0  
**Protokol:** HTTPS JSON API  
**Arsitektur:** Client (Browser) <---> Cloudflare Worker (Proxy & API Gateway) <---> Google Apps Script (Web App Backend)

---

## 1. Standar Header & Keamanan

### 1.1 Client ke Cloudflare Worker
- `Content-Type: application/json`
- `Authorization: Bearer <sessionToken>` (untuk semua endpoint terotentikasi)
- `X-Client-Version: 1.0.0`

### 1.2 Cloudflare Worker ke Google Apps Script
- `X-Worker-Signature: <HMAC-SHA256(payload, WORKER_SECRET)>`
- `X-Worker-Timestamp: <UnixEpochMillis>`
- `X-Forwarded-For: <ClientIP>`
- `Authorization: Bearer <sessionToken>`

Setiap request dari Worker ke GAS diverifikasi menggunakan shared secret. Panggilan langsung ke GAS tanpa signature yang valid akan ditolak dengan HTTP 403.

---

## 2. Format Standar Respons

### 2.1 Respons Berhasil
```json
{
  "success": true,
  "code": 200,
  "message": "Operasi berhasil",
  "data": {},
  "meta": {
    "timestamp": "2026-10-20T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

### 2.2 Respons Gagal
```json
{
  "success": false,
  "code": 400,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Checklist kebiasaan wajib diisi minimal satu",
    "details": []
  },
  "meta": {
    "timestamp": "2026-10-20T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## 3. Daftar Endpoint

### 3.1 Autentikasi (`/api/auth/*`)
- `POST /api/auth/login`: Verifikasi username & kata sandi, mengembalikan user info dan session token.
- `POST /api/auth/logout`: Mencabut sesi aktif dari penyimpanan backend.
- `GET /api/auth/me`: Mengambil data profil dan izin pengguna berdasarkan bearer token aktif.
- `POST /api/auth/change-password`: Mengubah kata sandi (wajib saat login pertama jika `mustChangePassword=true`).

### 3.2 Siswa (`/api/student/*`)
- `GET /api/student/dashboard`: Ringkasan dashboard siswa, status jurnal hari ini, materi singkat, dan pesan harian.
- `GET /api/student/journal/today`: Mengambil status dan draf/isian jurnal hari ini berdasarkan zona waktu sekolah.
- `POST /api/student/journal/save-draft`: Menyimpan draf isian 7 kebiasaan dan catatan tanpa mengubah status ke `SUBMITTED`.
- `POST /api/student/journal/submit`: Mengirim jurnal harian untuk masuk antrean verifikasi guru (`SUBMITTED`). Idempotent berdasarkan `studentId + journalDate`.
- `GET /api/student/journal/history`: Mengambil riwayat pengisian jurnal dengan pagination dan filter status.
- `GET /api/student/habits`: Mengambil data 7 kebiasaan dan daftar checklist aktif saat ini.
- `POST /api/student/journal/upload-photo`: Mengunggah foto bukti kegiatan (Base64 JPEG/PNG, max 2MB) ke Google Drive privat via GAS.

### 3.3 Guru (`/api/teacher/*`)
- `GET /api/teacher/dashboard`: Ringkasan antrean verifikasi jurnal siswa di kelas yang ditugaskan.
- `GET /api/teacher/queue`: Daftar antrean verifikasi dengan filter status (`SUBMITTED`, `REVISION_REQUIRED`, `VERIFIED`), pagination, dan pencarian siswa.
- `GET /api/teacher/journal/:journalId`: Detail lengkap isian jurnal siswa, foto bukti, dan riwayat verifikasi sebelumnya.
- `POST /api/teacher/journal/:journalId/verify`: Memberikan keputusan verifikasi:
  - `action`: `"APPROVE"` (status menjadi `VERIFIED`)
  - `action`: `"REVISE"` (status menjadi `REVISION_REQUIRED`, `comment` wajib diisi).
- `GET /api/teacher/classes`: Daftar kelas dan siswa yang berada di bawah penugasan guru.

### 3.4 Admin (`/api/admin/*`)
- `GET /api/admin/dashboard`: Statistik ringkasan seluruh sekolah (total siswa, guru, kelas, persentase keterisian hari ini, rekap mingguan 7 kebiasaan).
- `GET /api/admin/users`: Daftar pengguna sistem dengan filter peran (`student`, `teacher`, `admin`) dan status.
- `POST /api/admin/users`: Tambah akun baru (guru/siswa).
- `PUT /api/admin/users/:userId`: Edit data akun, status aktif/nonaktif, atau reset password.
- `POST /api/admin/students/import`: Impor massal siswa dari berkas Excel/JSON hasil parsing.
- `GET /api/admin/classes`: Kelola daftar kelas dan tahun ajaran.
- `POST /api/admin/teacher-assignments`: Menetapkan penugasan guru ke kelas.
- `GET /api/admin/habits`: Kelola master 7 kebiasaan, teks panduan, dan checklist.
- `POST /api/admin/habits/:habitId/checklists`: Tambah/perbarui checklist dengan pembuatan versi baru (snapshot versioning).
- `GET /api/admin/audit-logs`: Mengambil riwayat log audit administratif.
- `GET /api/admin/settings`: Mengambil konfigurasi sekolah.
- `PUT /api/admin/settings`: Memperbarui konfigurasi sekolah.

### 3.5 Laporan & Ekspor (`/api/reports/*`)
- `GET /api/reports/rekap`: Mengambil data agregasi rekap (Harian, Bulanan, Per Siswa, Per Kelas, Per Kebiasaan) sesuai wewenang.
- `POST /api/reports/export-log`: Mencatat jejak audit saat pengguna mengunduh berkas laporan sensitif.
