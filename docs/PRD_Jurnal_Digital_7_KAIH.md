# Product Requirements Document (PRD)
# Jurnal Digital Pemantauan 7 Kebiasaan Anak Indonesia Hebat

**Versi:** 1.0  
**Status:** Spesifikasi final untuk persetujuan sebelum implementasi  
**Cakupan:** Satu sekolah  
**Target awal:** Sekitar 100–300 siswa  
**Bahasa antarmuka:** Bahasa Indonesia  
**Zona waktu awal:** Asia/Jakarta (dapat dikonfigurasi)

---

## 1. Ringkasan Produk

Jurnal Digital 7 Kebiasaan Anak Indonesia Hebat adalah aplikasi web responsif untuk membantu sekolah mencatat, memantau, memverifikasi, dan melaporkan pelaksanaan tujuh kebiasaan positif siswa. Siswa mengisi satu jurnal harian yang berisi tujuh kebiasaan. Guru memeriksa jurnal siswa sesuai penugasannya, sedangkan Admin mengelola pengguna, kelas, materi, checklist, konfigurasi, serta laporan.

Aplikasi dirancang untuk penggunaan melalui HP, tablet, dan laptop. Antarmuka siswa menggunakan bahasa sederhana, ilustrasi ramah anak, warna ceria, dan animasi ringan. Antarmuka administrasi mengutamakan keterbacaan, konsistensi, akses cepat, dan data yang mudah dipahami.

### 1.1 Tujuan utama

- Memudahkan siswa mencatat kegiatan harian terkait tujuh kebiasaan.
- Memungkinkan guru memverifikasi jurnal dan memberikan arahan perbaikan.
- Memudahkan Admin mengelola akun, kelas, materi, checklist, dan konfigurasi sekolah.
- Menyediakan rekap dan laporan PDF serta Excel.
- Menyimpan riwayat perubahan dan keputusan verifikasi.
- Melindungi data pribadi siswa dan foto yang diunggah.

### 1.2 Prinsip produk

1. Mobile-first dan mudah digunakan siswa SD.
2. Hak akses ditegakkan di backend, bukan hanya pada tampilan.
3. Data historis tidak berubah ketika Admin memperbarui materi/checklist.
4. Setiap perubahan status penting memiliki jejak audit.
5. Data produksi dan data uji dipisahkan dengan jelas.
6. Tidak ada klaim fitur lulus atau deployment selesai sebelum benar-benar diuji.

---

## 2. Tujuan, Batasan, dan Indikator Keberhasilan

### 2.1 Tujuan tahap pertama

- Satu sekolah menggunakan aplikasi dengan peran Admin, Guru, dan Siswa.
- Siswa dapat membuat, mengirim, melihat status, dan memperbaiki jurnal yang dikembalikan.
- Guru dapat memeriksa jurnal siswa yang ditugaskan.
- Admin dapat mengelola data dasar dan materi.
- Laporan dapat difilter dan diekspor.
- Sistem tetap dapat digunakan pada layar kecil.

### 2.2 Di luar cakupan tahap pertama

- Aplikasi Android/iOS native.
- Pengelolaan banyak sekolah dalam satu instalasi.
- Pembayaran atau sistem langganan.
- Penilaian otomatis foto menggunakan AI.
- Integrasi otomatis dengan Dapodik, kecuali ditetapkan sebagai proyek lanjutan.
- Pengiriman pesan WhatsApp/SMS otomatis.
- Analitik prediktif atau pemeringkatan siswa berdasarkan kebiasaan.

### 2.3 Indikator keberhasilan

- Alur jurnal dari pengisian sampai keputusan guru berhasil diuji dari ujung ke ujung.
- Tidak ada akses lintas siswa atau lintas kelas yang tidak berwenang dalam pengujian keamanan.
- Foto hanya dapat diakses pengguna yang berwenang.
- Laporan sesuai dengan filter dan data sumber.
- Pengujian dasar pada HP, tablet, dan desktop selesai.
- Pengujian penggunaan bersamaan, kuota, dan pemulihan data terdokumentasi.

---

## 3. Pengguna dan Hak Akses

### 3.1 Peran

#### Admin
- Mengelola akun Guru dan Siswa.
- Mengimpor data siswa melalui template Excel.
- Mengelola kelas, status siswa, dan penugasan guru.
- Mengelola tujuh kebiasaan, materi, checklist, dan pengaturan.
- Melihat jurnal lintas kelas.
- Memeriksa atau mengembalikan jurnal hanya jika izin verifikasi Admin diaktifkan.
- Melihat rekap dan mengunduh laporan.
- Melihat log aktivitas dan mengelola pencadangan sesuai prosedur.

#### Guru
- Melihat kelas dan siswa yang ditugaskan.
- Melihat jurnal siswa dalam lingkup penugasannya.
- Menyetujui jurnal atau mengembalikannya untuk diperbaiki.
- Menulis catatan verifikasi.
- Melihat riwayat verifikasi dan rekap kelas.
- Mengunduh laporan sesuai hak akses.

#### Siswa
- Melihat dashboard dan status jurnal sendiri.
- Mengisi jurnal hari ini.
- Menambahkan checklist, catatan, dan foto opsional.
- Menyimpan draf dan mengirim jurnal.
- Memperbaiki jurnal yang dikembalikan.
- Melihat riwayat jurnal sendiri dan materi kebiasaan.
- Mengelola informasi profil terbatas yang diizinkan.

### 3.2 Matriks hak akses

| Fitur | Admin | Guru | Siswa |
|---|---|---|---|
| Dashboard | Semua data sekolah | Data penugasan | Data pribadi |
| Kelola akun | Ya | Tidak | Tidak |
| Impor siswa | Ya | Tidak | Tidak |
| Kelola kelas | Ya | Tidak | Tidak |
| Penugasan guru | Ya | Tidak | Tidak |
| Materi dan checklist | Ya | Lihat jika diizinkan | Lihat |
| Isi jurnal | Tidak secara default | Tidak secara default | Jurnal sendiri |
| Verifikasi jurnal | Opsional sesuai izin | Jurnal dalam penugasan | Tidak |
| Rekap | Semua data sekolah | Data penugasan | Status sendiri |
| Ekspor laporan | Semua data sesuai kebijakan | Data penugasan | Tidak |
| Audit log | Ya, sesuai kebijakan | Riwayat yang relevan | Tidak |

Semua hak akses harus diperiksa pada setiap permintaan backend. Menyembunyikan menu pada frontend tidak dianggap sebagai kontrol keamanan.

---

## 4. Tujuh Kebiasaan yang Dipantau

Setiap kebiasaan memiliki nama, deskripsi, ilustrasi, materi panduan, daftar checklist yang dikelola Admin, dan opsi catatan/foto.

1. **Bangun Pagi**
2. **Beribadah**
3. **Berolahraga**
4. **Makan Sehat dan Bergizi**
5. **Gemar Belajar**
6. **Bermasyarakat**
7. **Tidur Cepat**

Konten dan checklist dapat disesuaikan Admin. Perubahan berlaku untuk jurnal baru; detail jurnal yang telah dibuat harus mempertahankan versi checklist atau snapshot yang digunakan pada saat itu.

### 4.1 Interaksi kebiasaan

- Setiap kartu menampilkan ilustrasi unik.
- Animasi CSS/SVG sederhana digunakan sebagai penguat pengalaman belajar.
- Animasi tidak boleh menghalangi pengisian atau menyebabkan aplikasi lambat.
- Hormati pengaturan sistem `prefers-reduced-motion`.
- Sediakan label teks yang jelas; jangan mengandalkan warna atau animasi saja untuk menyampaikan status.
- Foto bersifat opsional kecuali sekolah secara eksplisit menetapkan kebijakan lain.

---

## 5. Alur Jurnal dan Aturan Bisnis

### 5.1 Alur siswa

1. Siswa login dengan username dan kata sandi.
2. Sistem menentukan tanggal jurnal berdasarkan zona waktu sekolah.
3. Siswa membuka jurnal hari ini.
4. Siswa mengisi checklist untuk tujuh kebiasaan, menambahkan catatan bila diperlukan, dan mengunggah foto opsional.
5. Siswa menyimpan draf atau mengirim jurnal.
6. Setelah dikirim, jurnal masuk antrean verifikasi.
7. Siswa melihat status dan komentar guru.
8. Jika dikembalikan, siswa memperbaiki dan mengirim ulang.

### 5.2 Alur guru

1. Guru login.
2. Sistem memuat kelas sesuai penugasan.
3. Guru membuka antrean jurnal menunggu verifikasi.
4. Guru memeriksa isian, catatan, dan foto jika tersedia.
5. Guru menyetujui jurnal atau mengembalikannya dengan alasan yang jelas.
6. Sistem mencatat identitas pemeriksa, waktu, keputusan, dan catatan.
7. Guru dapat melihat riwayat keputusan sebelumnya.

### 5.3 Status jurnal

| Status | Kode | Makna |
|---|---|---|
| Draf | `DRAFT` | Belum dikirim siswa |
| Menunggu Verifikasi | `SUBMITTED` | Sudah dikirim dan menunggu pemeriksaan |
| Perlu Perbaikan | `REVISION_REQUIRED` | Dikembalikan kepada siswa |
| Terverifikasi | `VERIFIED` | Disetujui pemeriksa |

### 5.4 Aturan bisnis wajib

- Satu siswa hanya memiliki satu jurnal utama untuk satu tanggal sekolah.
- Gunakan kombinasi ID siswa + tanggal jurnal sebagai kunci unik logis; backend harus mencegah duplikasi saat permintaan bersamaan.
- Tanggal ditetapkan backend berdasarkan zona waktu sekolah, bukan hanya jam perangkat siswa.
- Jurnal draf dapat diedit oleh pemiliknya.
- Jurnal yang sudah dikirim tidak boleh diedit secara langsung sampai dikembalikan atau dibuka kembali melalui tindakan berizin.
- Jurnal terverifikasi terkunci untuk siswa. Pembukaan kembali oleh petugas berwenang harus memiliki alasan dan tercatat.
- Perbaikan tidak memiliki batas waktu, sesuai kebijakan proyek.
- Catatan guru wajib diisi saat mengembalikan jurnal.
- Riwayat pengiriman, perbaikan, dan keputusan lama tidak boleh ditimpa.
- Permintaan berulang akibat jaringan lambat harus aman dari pengiriman ganda.
- Sistem tidak boleh menganggap jurnal belum dikirim sebagai jurnal terverifikasi.
- Perhitungan rekap harus menggunakan siswa aktif dan tanggal yang relevan.

---

## 6. Kebutuhan Fungsional

### FR-01 — Autentikasi
- Login menggunakan username dan kata sandi.
- Logout mengakhiri sesi aktif.
- Sesi memiliki masa berlaku dan dapat dicabut.
- Akun nonaktif tidak dapat login.
- Pembatasan percobaan login dan pencatatan percobaan gagal tersedia.
- Kata sandi disimpan menggunakan algoritma hashing kata sandi yang sesuai, bukan teks biasa.
- Pemulihan/reset kata sandi dilakukan melalui alur yang dikendalikan Admin dan tidak menampilkan kata sandi lama.

### FR-02 — Pengelolaan pengguna
- Admin membuat, mengubah, menonaktifkan, dan mengatur ulang akun.
- Username harus unik.
- Peran akun ditentukan oleh backend dan tidak dapat diubah pengguna melalui permintaan biasa.
- Perubahan status akun dicatat dalam audit log.

### FR-03 — Impor siswa
- Admin mengunduh template `.xlsx`.
- Template memuat kolom yang terdokumentasi.
- Sistem memvalidasi file, kolom wajib, tipe data, duplikasi, dan kelas.
- Tampilkan preview dan ringkasan baris valid/tidak valid sebelum impor.
- Impor harus bersifat aman terhadap kegagalan parsial dan menghasilkan laporan kesalahan.
- Kredensial awal dibuat secara aman; pengguna diminta mengganti kata sandi saat login pertama jika kebijakan tersebut diaktifkan.
- Jangan menampilkan daftar kata sandi dalam log atau ekspor umum.

### FR-04 — Pengelolaan kelas dan penugasan
- Admin mengelola kelas dan status aktif.
- Admin menetapkan guru ke satu atau beberapa kelas.
- Guru hanya melihat kelas yang ditugaskan.
- Riwayat perpindahan kelas siswa dipertahankan.
- Perubahan penugasan berlaku untuk akses saat ini tanpa menghapus riwayat lama.

### FR-05 — Materi dan checklist
- Admin mengelola nama, deskripsi, ilustrasi, materi, urutan, checklist, dan status aktif.
- Materi dapat berisi teks dan tautan yang tervalidasi.
- Konten baru tidak mengubah snapshot jurnal lama.
- Konten yang tidak aktif tidak ditawarkan pada jurnal baru, tetapi tetap tersedia untuk menampilkan riwayat lama.

### FR-06 — Jurnal siswa
- Sistem menyediakan satu jurnal harian yang mencakup tujuh kebiasaan.
- Setiap kebiasaan memiliki checklist.
- Catatan dan foto bersifat opsional sesuai kebijakan sekolah.
- Draf dapat disimpan dan dilanjutkan.
- UI menampilkan indikator penyimpanan dan pesan error yang dapat dipahami.
- Siswa hanya dapat membaca dan mengubah jurnal miliknya sesuai status.

### FR-07 — Foto
- Foto diunggah melalui backend, bukan dengan memberikan akses publik ke folder Drive.
- Validasi tipe file, ukuran, dan nama file dilakukan di server.
- Simpan metadata file, ID Drive, pemilik jurnal, kebiasaan terkait, waktu unggah, dan status.
- Akses foto harus melalui alur yang memeriksa izin pengguna.
- Hapus foto yang tidak lagi digunakan sesuai prosedur retensi dan audit.
- Uji batas ukuran request pada Worker dan Apps Script sebelum menentukan batas final.

### FR-08 — Verifikasi
- Guru melihat antrean sesuai penugasan.
- Guru dapat membuka detail jurnal dan bukti pendukung.
- Guru dapat menyetujui atau mengembalikan jurnal.
- Catatan wajib untuk pengembalian.
- Keputusan menyimpan pemeriksa, waktu, status, dan komentar.
- Siswa menerima status terbaru saat membuka aplikasi.
- Notifikasi eksternal tidak termasuk cakupan awal.

### FR-09 — Dashboard
- Dashboard menampilkan ringkasan sesuai peran.
- Admin melihat total siswa/guru/kelas dan ringkasan status jurnal.
- Guru melihat antrean dan ringkasan kelas yang ditugaskan.
- Siswa melihat progres dan status jurnal sendiri.
- Grafik harus memiliki label, nilai, dan tampilan yang dapat dipahami tanpa warna saja.

### FR-10 — Rekap dan laporan
- Filter periode, kelas, siswa, status, dan kebiasaan.
- Rekap harian, bulanan, per siswa, per kelas, per kebiasaan, dan riwayat verifikasi.
- Ekspor PDF siap cetak.
- Ekspor Excel `.xlsx`.
- Laporan hanya memuat data yang boleh diakses pengguna.
- Catat ekspor data sensitif pada audit log.
- Rumus persentase harus terdokumentasi dan konsisten.

### FR-11 — Audit dan pengaturan
- Catat login penting, kegagalan login, perubahan akun, impor, perubahan status jurnal, verifikasi, ekspor, dan tindakan administratif penting.
- Audit log tidak boleh dapat diubah melalui fitur pengguna biasa.
- Admin mengatur nama sekolah, logo, zona waktu, periode, batas file, dan kebijakan yang disepakati.
- Retensi data mengikuti kebijakan sekolah dan ketentuan yang berlaku.

---

## 7. Kebutuhan UI/UX

### 7.1 Gaya visual

- Ramah anak, ceria, bersih, dan tidak terlalu ramai.
- Warna dasar: biru langit, biru tua untuk teks/navigasi, putih, dan aksen warna berbeda untuk tujuh kebiasaan.
- Ilustrasi kartun edukatif yang konsisten.
- Sudut kartu membulat, jarak antarkomponen lega, dan tombol besar.
- Font sans-serif yang mudah dibaca.
- Dashboard admin/guru lebih padat informasi tetapi tetap ramah dan rapi.
- Hindari penggunaan warna sebagai satu-satunya indikator status.

### 7.2 Responsivitas

- Mobile-first untuk halaman siswa.
- Navigasi mobile menggunakan menu ringkas yang mudah dijangkau.
- Tabel admin/guru berubah menjadi daftar/kartu pada layar kecil.
- Formulir memiliki target sentuh yang memadai.
- Tidak ada konten penting yang terpotong pada layar HP.
- Uji minimal pada viewport ponsel kecil, tablet, dan desktop.

### 7.3 Aksesibilitas dan performa

- Label input jelas dan terkait dengan kontrol.
- Fokus keyboard terlihat.
- Kontras teks memadai.
- Status dibaca dengan teks dan ikon.
- Animasi menghormati `prefers-reduced-motion`.
- Ilustrasi dikompresi dan dimuat secara efisien.
- Tampilkan loading, empty state, error state, dan konfirmasi tindakan penting.

---

## 8. Arsitektur dan Tumpukan Teknologi

### 8.1 Teknologi yang dipilih

| Lapisan | Teknologi | Tanggung jawab |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Antarmuka dan interaksi browser |
| Repositori | GitHub | Versi kode, kolaborasi, dokumentasi |
| Hosting frontend | Vercel | Build dan penyajian frontend |
| Domain/DNS | Cloudflare | DNS dan pengelolaan domain |
| Proxy API | Cloudflare Workers | Pintu masuk API, pembatasan permintaan, routing/proxy |
| Backend | Google Apps Script Web App | Aturan bisnis, validasi, otorisasi |
| Database awal | Google Sheets | Data terstruktur |
| File | Google Drive | Foto dan berkas yang aksesnya dibatasi |

---

## 9. Rancangan Database Google Sheets

Setiap entitas menggunakan ID unik yang stabil. Nomor baris bukan ID permanen.

| Sheet | Kolom/isi inti |
|---|---|
| `Users` | `userId`, `username`, `passwordHash`, `role`, `status`, `createdAt`, `updatedAt`, `mustChangePassword` |
| `Teachers` | `teacherId`, `userId`, `fullName`, `employeeNumber` bila diperlukan, `status` |
| `Students` | `studentId`, `userId`, `studentNumber` bila diperlukan, `fullName`, `classId`, `status` |
| `Classes` | `classId`, `className`, `schoolYear`, `status` |
| `TeacherAssignments` | `assignmentId`, `teacherId`, `classId`, `startDate`, `endDate`, `status` |
| `StudentClassHistory` | `historyId`, `studentId`, `classId`, `startDate`, `endDate` |
| `Habits` | `habitId`, `name`, `description`, `illustrationRef`, `sortOrder`, `active`, `version` |
| `HabitChecklists` | `checklistId`, `habitId`, `version`, `label`, `sortOrder`, `active` |
| `Materials` | `materialId`, `habitId`, `title`, `contentType`, `contentRef`, `active`, `version` |
| `DailyJournals` | `journalId`, `studentId`, `journalDate`, `status`, `submittedAt`, `verifiedAt`, `createdAt`, `updatedAt` |
| `JournalHabitDetails` | `detailId`, `journalId`, `habitId`, `habitVersion`, `checklistSnapshot`, `notes` |
| `JournalPhotos` | `photoId`, `journalId`, `detailId`, `driveFileId`, `mimeType`, `sizeBytes`, `uploadedAt`, `status` |
| `JournalVerifications` | `verificationId`, `journalId`, `reviewerId`, `decision`, `comment`, `createdAt` |
| `JournalHistory` | `historyId`, `journalId`, `actorId`, `action`, `oldStatus`, `newStatus`, `note`, `createdAt` |
| `AuditLogs` | `logId`, `actorId`, `action`, `targetType`, `targetId`, `timestamp`, `result`, `metadataSafe` |
| `AppSettings` | `settingKey`, `settingValue`, `updatedBy`, `updatedAt` |
