/**
 * Views untuk Peran Siswa (Mobile-First)
 */
window.studentView = {
  // 1. Dashboard Siswa
  renderDashboard(data, user) {
    const journal = data.todayJournal;
    const habits = data.habits;

    const statusPillClass = journal.status === 'VERIFIED' ? 'verified' :
      journal.status === 'SUBMITTED' ? 'submitted' :
      journal.status === 'REVISION_REQUIRED' ? 'revision' : 'draft';

    const statusText = journal.status === 'VERIFIED' ? 'Terverifikasi' :
      journal.status === 'SUBMITTED' ? 'Sudah Dikirim' :
      journal.status === 'REVISION_REQUIRED' ? 'Perlu Perbaikan' : 'Draf';

    return `
      <div class="page-container">
        <!-- Welcome Banner -->
        <div class="student-welcome-banner">
          <div class="welcome-text">
            <h2>Selamat datang, ${user.fullName}!</h2>
            <p>Mari biasakan 7 kebiasaan baik setiap hari!</p>
          </div>
          <div style="font-size: 42px;">🌟</div>
        </div>

        <!-- 7 Habit Badges Row -->
        <div class="habits-row">
          ${habits.map(h => `
            <div class="habit-badge-card" onclick="window.location.hash='#student/materi'">
              <div class="habit-circle-icon ${h.colorClass}">${h.icon}</div>
              <span class="habit-name">${h.name}</span>
            </div>
          `).join('')}
        </div>

        <!-- Status Jurnal Hari Ini Card -->
        <div class="journal-status-card">
          <div class="journal-status-meta">
            <h3>Status Jurnal Hari Ini</h3>
            <div class="journal-status-info">
              <span class="status-pill ${statusPillClass}">● ${statusText}</span>
              <span class="journal-timestamp">Terakhir diperbarui, ${journal.lastUpdated}</span>
            </div>
          </div>
          <div>
            <a href="#student/journal" class="btn btn-primary">Lihat Detail</a>
          </div>
        </div>

        <!-- Pesan Hari Ini (Mascot Card) -->
        <div class="mascot-quote-card">
          <div class="mascot-avatar">🐼</div>
          <div class="mascot-quote-text">
            <h4>Pesan Hari Ini</h4>
            <p>"Kebiasaan baik hari ini, masa depan hebat esok hari!"</p>
          </div>
        </div>
      </div>
    `;
  },

  // 2. Formulir Jurnal Harian 7 Kebiasaan
  renderJournalForm(data, user) {
    const journal = data.todayJournal;
    const habits = data.habits;

    return `
      <div class="page-container">
        <div class="form-card-header" style="margin-bottom: 24px;">
          <h2>Form Jurnal Harian (Siswa)</h2>
          <p style="color: var(--color-slate-medium);">Isi checklist, catatan, dan unggah foto jika diperlukan.</p>
        </div>

        <form id="journal-form" onsubmit="window.app.handleJournalSubmit(event)">
          <div class="journal-form-grid">
            <!-- Kolom Kiri: 7 Kebiasaan Checklist -->
            <div class="form-card">
              <div class="form-card-header">
                <h2>Jurnal Harian — 12 Mei 2025</h2>
                <p>Centang kebiasaan yang sudah kamu laksanakan hari ini:</p>
              </div>

              <div class="checklist-list">
                ${habits.map(h => {
                  const isChecked = journal.checkedHabits?.includes(h.habitId);
                  return `
                    <div class="checklist-item ${isChecked ? 'checked' : ''}" data-habit-id="${h.habitId}" onclick="window.studentView.toggleChecklist(this)">
                      <div class="habit-number-badge ${h.colorClass}">${h.number}</div>
                      <div class="checklist-label-content">
                        <strong>${h.name}</strong>
                        <span>${h.shortDesc}</span>
                      </div>
                      <div class="custom-checkbox">
                        ${isChecked ? '✓' : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Catatan Tambahan -->
              <div class="form-group" style="margin-top: 16px;">
                <label class="form-label" for="journal-notes">Catatan Tambahan (opsional)</label>
                <textarea id="journal-notes" class="form-control" rows="3" placeholder="Tuliskan cerita atau pengalaman kebiasaan baikmu hari ini...">${journal.notes || ''}</textarea>
              </div>
            </div>

            <!-- Kolom Kanan: Upload Foto & Tindakan -->
            <div>
              <div class="form-card">
                <div class="form-card-header">
                  <h2>Upload Foto (opsional)</h2>
                  <p>Unggah foto kegiatan kebiasaanmu (maksimal 2MB, format JPG/PNG)</p>
                </div>

                <!-- Dropzone -->
                <div id="photo-dropzone" class="photo-dropzone" onclick="document.getElementById('file-input').click()">
                  <input type="file" id="file-input" accept="image/jpeg,image/png" style="display: none;" onchange="window.studentView.handleFileSelect(event)">
                  <div class="dropzone-icon">📷</div>
                  <div class="dropzone-text">
                    <strong>Klik untuk mengunggah atau drag & drop</strong>
                    <span>Format: JPG, PNG | Maks: 2MB</span>
                  </div>
                </div>

                <!-- Photo Preview Box -->
                <div id="photo-preview-container" class="photo-preview-box" style="${journal.photoUrl ? 'display: block;' : 'display: none;'}">
                  <img id="photo-preview-img" src="${journal.photoUrl || ''}" alt="Foto Bukti Kegiatan">
                  <button type="button" class="btn-remove-photo" onclick="window.studentView.removePhoto(event)">&times;</button>
                </div>
              </div>

              <!-- Form Actions Row -->
              <div class="form-actions-row">
                <button type="button" class="btn btn-secondary" onclick="window.app.handleJournalDraft()">Simpan Draf</button>
                <button type="submit" class="btn btn-primary btn-lg">Kirim Jurnal</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  // Toggle checklist UI
  toggleChecklist(el) {
    el.classList.toggle('checked');
    const checkbox = el.querySelector('.custom-checkbox');
    checkbox.textContent = el.classList.contains('checked') ? '✓' : '';
  },

  // Handle file select
  handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > window.APP_CONFIG.MAX_PHOTO_SIZE_BYTES) {
      window.app.showToast('Ukuran foto melebihi batas 2MB!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
      document.getElementById('photo-preview-img').src = evt.target.result;
      document.getElementById('photo-preview-container').style.display = 'block';
      window.app.showToast('Foto berhasil dimuat!', 'success');
    };
    reader.readAsDataURL(file);
  },

  // Remove photo
  removePhoto(e) {
    e.stopPropagation();
    document.getElementById('file-input').value = '';
    document.getElementById('photo-preview-img').src = '';
    document.getElementById('photo-preview-container').style.display = 'none';
  },

  // 3. Materi Kebiasaan
  renderMaterials(habits) {
    return `
      <div class="page-container">
        <div class="form-card-header" style="margin-bottom: 24px;">
          <h2>Materi 7 Kebiasaan Anak Indonesia Hebat</h2>
          <p style="color: var(--color-slate-medium);">Pelajari panduan dan manfaat setiap kebiasaan positif untuk masa depanmu:</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${habits.map(h => `
            <div class="form-card" style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="habit-circle-icon ${h.colorClass}" style="width: 48px; height: 48px; font-size: 22px;">
                  ${h.icon}
                </div>
                <div>
                  <h3 style="font-size: 16px;">${h.number}. ${h.name}</h3>
                  <span style="font-size: 12px; color: var(--color-slate-medium); font-weight: 600;">${h.shortDesc}</span>
                </div>
              </div>
              <p style="font-size: 13.5px; color: var(--color-navy); line-height: 1.6; flex: 1;">
                ${h.material}
              </p>
              <div style="background: var(--color-primary-soft); padding: 10px 12px; border-radius: var(--radius-md);">
                <strong style="font-size: 12px; color: var(--color-primary-dark); display: block; margin-bottom: 4px;">Target Checklist:</strong>
                <ul style="padding-left: 18px; font-size: 12px; color: var(--color-slate-dark);">
                  ${h.checklist.map(c => `<li>${c.text}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 4. Profil Siswa
  renderProfile(user) {
    return `
      <div class="page-container">
        <div class="form-card-header" style="margin-bottom: 24px;">
          <h2>Profil Siswa</h2>
          <p style="color: var(--color-slate-medium);">Informasi akun dan data sekolah Anda</p>
        </div>

        <div class="form-card" style="max-width: 600px;">
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--color-border);">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: #dbeafe; display: flex; align-items: center; justify-content: center; font-size: 36px;">
              ${user.avatar || '🎒'}
            </div>
            <div>
              <h3 style="font-size: 18px;">${user.fullName}</h3>
              <p style="font-size: 13px; color: var(--color-slate-medium);">${user.className || 'Siswa'} — NISN: ${user.studentNumber || '-'}</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; font-size: 13.5px;">
              <span style="color: var(--color-slate-medium);">Username</span>
              <strong>${user.username}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13.5px;">
              <span style="color: var(--color-slate-medium);">Kelas</span>
              <strong>${user.className}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13.5px;">
              <span style="color: var(--color-slate-medium);">Email</span>
              <strong>${user.email || '-'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13.5px;">
              <span style="color: var(--color-slate-medium);">Peran</span>
              <strong style="color: var(--color-primary);">Siswa</strong>
            </div>
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn btn-primary" onclick="window.app.showToast('Fitur perubahan profil tersimpan!', 'success')">Ubah Profil</button>
          </div>
        </div>
      </div>
    `;
  }
};
