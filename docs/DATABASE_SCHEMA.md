# Spesifikasi Skema Database Google Sheets
**Sistem:** Jurnal Digital 7 Kebiasaan Anak Indonesia Hebat  
**Penyimpanan:** Google Sheets (1 Spreadsheet utama)  
**Total Sheet:** 16 Sheet

---

## 1. `Users` (Pengguna Sistem)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `userId` | String (UUID/KUID) | Kunci primer unik pengguna (contoh: `usr_123456`) |
| `username` | String | Username unik login (case-insensitive normalized) |
| `passwordHash` | String | Hash password dengan salt (PBKDF2/HMAC) |
| `salt` | String | Salt acak unik per pengguna |
| `role` | String | Peran: `ADMIN`, `TEACHER`, `STUDENT` |
| `status` | String | Status akun: `ACTIVE`, `INACTIVE` |
| `mustChangePassword` | Boolean | `TRUE` jika harus ganti sandi saat login awal |
| `createdAt` | ISO DateTime | Waktu pembuatan akun |
| `updatedAt` | ISO DateTime | Waktu pembaruan akun terakhir |

---

## 2. `Teachers` (Profil Guru)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `teacherId` | String | Kunci primer guru (contoh: `tch_123456`) |
| `userId` | String | Relasi ke `Users.userId` |
| `fullName` | String | Nama lengkap guru beserta gelar |
| `employeeNumber`| String | NIP / NUPTK guru (opsional) |
| `status` | String | Status: `ACTIVE`, `INACTIVE` |

---

## 3. `Students` (Profil Siswa)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `studentId` | String | Kunci primer siswa (contoh: `std_123456`) |
| `userId` | String | Relasi ke `Users.userId` |
| `fullName` | String | Nama lengkap siswa |
| `studentNumber` | String | NISN / NIS siswa |
| `classId` | String | Relasi ke `Classes.classId` saat ini |
| `status` | String | Status: `ACTIVE`, `INACTIVE`, `GRADUATED` |

---

## 4. `Classes` (Daftar Kelas)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `classId` | String | Kunci primer kelas (contoh: `cls_5A`) |
| `className` | String | Nama kelas (contoh: `Kelas 5A`) |
| `schoolYear` | String | Tahun ajaran (contoh: `2025/2026`) |
| `status` | String | Status: `ACTIVE`, `ARCHIVED` |

---

## 5. `TeacherAssignments` (Penugasan Guru ke Kelas)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `assignmentId` | String | Kunci primer penugasan |
| `teacherId` | String | Relasi ke `Teachers.teacherId` |
| `classId` | String | Relasi ke `Classes.classId` |
| `startDate` | ISO Date | Tanggal mulai penugasan |
| `endDate` | ISO Date | Tanggal selesai penugasan (opsional) |
| `status` | String | Status: `ACTIVE`, `INACTIVE` |

---

## 6. `StudentClassHistory` (Riwayat Kelas Siswa)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `historyId` | String | Kunci primer riwayat kelas |
| `studentId` | String | Relasi ke `Students.studentId` |
| `classId` | String | Relasi ke `Classes.classId` |
| `startDate` | ISO Date | Tanggal penempatan |
| `endDate` | ISO Date | Tanggal selesai/pindah |

---

## 7. `Habits` (Master 7 Kebiasaan)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `habitId` | String | ID kebiasaan (contoh: `hbt_1` s/d `hbt_7`) |
| `name` | String | Nama kebiasaan (contoh: `Bangun Pagi`) |
| `description` | String | Penjelasan singkat indikator kebiasaan |
| `illustrationRef` | String | Kunci/referensi aset ilustrasi |
| `sortOrder` | Integer | Urutan tampil (1 s.d. 7) |
| `active` | Boolean | `TRUE` jika aktif |
| `version` | Integer | Nomor versi definisi materi |

---

## 8. `HabitChecklists` (Item Checklist Kebiasaan)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `checklistId` | String | ID item checklist (contoh: `chk_01`) |
| `habitId` | String | Relasi ke `Habits.habitId` |
| `version` | Integer | Nomor versi checklist |
| `label` | String | Teks tugas checklist (contoh: `Bangun sebelum pukul 06.00`) |
| `sortOrder` | Integer | Urutan checklist dalam satu kebiasaan |
| `active` | Boolean | `TRUE` jika item aktif untuk jurnal baru |

---

## 9. `Materials` (Materi Edukasi Kebiasaan)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `materialId` | String | ID materi edukasi |
| `habitId` | String | Relasi ke `Habits.habitId` |
| `title` | String | Judul materi/panduan |
| `contentType` | String | Tipe: `TEXT`, `URL`, `EMBED` |
| `contentRef` | String | Isi teks panduan atau link materi edukasi |
| `active` | Boolean | `TRUE` jika aktif |
| `version` | Integer | Versi materi |

---

## 10. `DailyJournals` (Jurnal Harian Siswa)
*Kunci Logis Unik:* `studentId + journalDate` (dijamin dengan LockService)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `journalId` | String | ID unik jurnal (contoh: `jrn_20261020_std123`) |
| `studentId` | String | Relasi ke `Students.studentId` |
| `journalDate` | ISO Date | Tanggal jurnal sekolah (`YYYY-MM-DD`) |
| `status` | String | `DRAFT`, `SUBMITTED`, `REVISION_REQUIRED`, `VERIFIED` |
| `submittedAt` | ISO DateTime | Waktu pengiriman pertama kali |
| `verifiedAt` | ISO DateTime | Waktu verifikasi oleh guru (jika selesai) |
| `createdAt` | ISO DateTime | Waktu draf pertama dibuat |
| `updatedAt` | ISO DateTime | Waktu perubahan terakhir |

---

## 11. `JournalHabitDetails` (Detail Checklist Isian per Kebiasaan)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `detailId` | String | ID detail isian |
| `journalId` | String | Relasi ke `DailyJournals.journalId` |
| `habitId` | String | Relasi ke `Habits.habitId` |
| `habitVersion`| Integer | Versi snapshot kebiasaan saat diisi |
| `checklistSnapshot` | JSON String | Array checklist & status centang `[{"checklistId":"chk_01","checked":true}]` |
| `notes` | String | Catatan tambahan siswa untuk kebiasaan ini |

---

## 12. `JournalPhotos` (Metadata Foto Kegiatan)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `photoId` | String | ID foto unik |
| `journalId` | String | Relasi ke `DailyJournals.journalId` |
| `detailId` | String | Relasi ke `JournalHabitDetails.detailId` (opsional) |
| `driveFileId` | String | ID file di Google Drive privat sekolah |
| `mimeType` | String | Tipe MIME (`image/jpeg`, `image/png`) |
| `sizeBytes` | Integer | Ukuran file dalam bytes |
| `uploadedAt` | ISO DateTime | Waktu unggah |
| `status` | String | `ACTIVE`, `ORPHAN`, `DELETED` |

---

## 13. `JournalVerifications` (Keputusan & Catatan Guru)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `verificationId`| String | ID keputusan verifikasi |
| `journalId` | String | Relasi ke `DailyJournals.journalId` |
| `reviewerId` | String | ID user guru/admin yang memeriksa |
| `decision` | String | `APPROVED`, `REVISION_REQUIRED` |
| `comment` | String | Catatan instruksi/arahan dari guru |
| `createdAt` | ISO DateTime | Waktu keputusan dibuat |

---

## 14. `JournalHistory` (Jejak Riwayat Status Jurnal)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `historyId` | String | ID jejak status |
| `journalId` | String | Relasi ke `DailyJournals.journalId` |
| `actorId` | String | ID pengguna yang melakukan aksi |
| `action` | String | `CREATED_DRAFT`, `SUBMITTED`, `REVISED`, `VERIFIED`, `REOPENED` |
| `oldStatus` | String | Status sebelum aksi |
| `newStatus` | String | Status setelah aksi |
| `note` | String | Catatan perubahan |
| `createdAt` | ISO DateTime | Waktu kejadian |

---

## 15. `AuditLogs` (Audit Log Sistem & Keamanan)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `logId` | String | ID log audit unik |
| `actorId` | String | ID user atau `SYSTEM` / `ANONYMOUS` |
| `action` | String | `LOGIN_SUCCESS`, `LOGIN_FAILED`, `IMPORT_STUDENTS`, `EXPORT_REPORT`, dll. |
| `targetType` | String | Objek yang disentuh: `USER`, `JOURNAL`, `CLASS`, `SETTING` |
| `targetId` | String | ID target |
| `timestamp` | ISO DateTime | Waktu pencatatan |
| `result` | String | `SUCCESS`, `FAILURE` |
| `metadataSafe` | JSON String | Metadata bebas kredensial/password |

---

## 16. `AppSettings` (Konfigurasi Aplikasi)
| Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `settingKey` | String | Kunci: `SCHOOL_NAME`, `SCHOOL_LOGO`, `TIMEZONE`, `ADMIN_VERIFY_ENABLED`, `MAX_PHOTO_MB` |
| `settingValue`| String | Nilai konfigurasi |
| `updatedBy` | String | User terakhir yang mengubah |
| `updatedAt` | ISO DateTime | Waktu perubahan terakhir |
