/**
 * Views untuk Peran Guru
 */
window.teacherView = {
  activeTab: 'ALL', // 'ALL', 'SUBMITTED', 'REVISION_REQUIRED', 'VERIFIED'

  renderQueue(queue, user) {
    const pendingCount = queue.filter(q => q.status === 'SUBMITTED').length;
    const revisionCount = queue.filter(q => q.status === 'REVISION_REQUIRED').length;
    const verifiedCount = queue.filter(q => q.status === 'VERIFIED').length;

    const filtered = this.activeTab === 'ALL' ? queue :
      queue.filter(q => q.status === this.activeTab);

    return `
      <div class="page-container">
        <div class="form-card-header" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h2>Antrean Verifikasi Jurnal</h2>
            <p style="color: var(--color-slate-medium);">Periksa isian 7 kebiasaan siswa dan berikan persetujuan atau arahan perbaikan.</p>
          </div>
          <span class="status-pill submitted">Total Antrean: ${queue.length}</span>
        </div>

        <div class="table-card">
          <!-- Sub-tabs Nav -->
          <div class="sub-tabs-nav">
            <button class="sub-tab-btn ${this.activeTab === 'ALL' ? 'active' : ''}" onclick="window.teacherView.setTab('ALL')">
              Semua (${queue.length})
            </button>
            <button class="sub-tab-btn ${this.activeTab === 'SUBMITTED' ? 'active' : ''}" onclick="window.teacherView.setTab('SUBMITTED')">
              Menunggu (${pendingCount})
            </button>
            <button class="sub-tab-btn ${this.activeTab === 'REVISION_REQUIRED' ? 'active' : ''}" onclick="window.teacherView.setTab('REVISION_REQUIRED')">
              Perlu Perbaikan (${revisionCount})
            </button>
            <button class="sub-tab-btn ${this.activeTab === 'VERIFIED' ? 'active' : ''}" onclick="window.teacherView.setTab('VERIFIED')">
              Terverifikasi (${verifiedCount})
            </button>
          </div>

          <!-- Data Table -->
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 60px;">No</th>
                  <th>Nama Siswa</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th style="text-align: right;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.length === 0 ? `
                  <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: var(--color-slate-medium);">
                      Tidak ada data jurnal pada kategori ini.
                    </td>
                  </tr>
                ` : filtered.map((item, idx) => {
                  const statusClass = item.status === 'VERIFIED' ? 'verified' :
                    item.status === 'REVISION_REQUIRED' ? 'revision' : 'submitted';
                  return `
                    <tr>
                      <td><strong>${idx + 1}</strong></td>
                      <td>
                        <strong>${item.name}</strong>
                        <span style="display: block; font-size: 11.5px; color: var(--color-slate-medium);">${item.className}</span>
                      </td>
                      <td>${item.date}</td>
                      <td>
                        <span class="status-pill ${statusClass}">● ${item.statusLabel}</span>
                      </td>
                      <td style="text-align: right;">
                        <button class="btn btn-primary btn-sm" onclick="window.teacherView.openVerificationModal(${item.id})">
                          Verifikasi
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Table Pagination -->
          <div class="table-pagination">
            <button class="page-btn">&lt;</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn">&gt;</button>
          </div>
        </div>
      </div>

      <!-- Modal Verifikasi Jurnal -->
      <div id="verification-modal" class="modal-backdrop" style="display: none;">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="verif-modal-title">Pemeriksaan Jurnal Siswa</h3>
            <button class="btn-close-modal" onclick="window.teacherView.closeVerificationModal()">&times;</button>
          </div>
          <div class="modal-body" id="verif-modal-body">
            <!-- Isi modal dinamis dimuat via JS -->
          </div>
          <div class="modal-footer" id="verif-modal-footer">
            <!-- Tombol keputusan -->
          </div>
        </div>
      </div>
    `;
  },

  setTab(tab) {
    this.activeTab = tab;
    window.app.renderCurrentView();
  },

  openVerificationModal(id) {
    const item = window.MOCK_DATA.teacherQueue.find(q => q.id === id);
    if (!item) return;

    const modal = document.getElementById('verification-modal');
    const body = document.getElementById('verif-modal-body');
    const footer = document.getElementById('verif-modal-footer');

    body.innerHTML = `
      <div style="margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--color-border);">
        <h4 style="font-size: 16px; margin-bottom: 4px;">${item.name} (${item.className})</h4>
        <span style="font-size: 12.5px; color: var(--color-slate-medium);">Tanggal Jurnal: ${item.date}</span>
      </div>

      <div style="margin-bottom: 16px;">
        <strong style="font-size: 13px; display: block; margin-bottom: 8px;">Kebiasaan yang Terlaksana (${item.checkedHabits?.length || 0} / 7):</strong>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${window.MOCK_DATA.habits.map(h => {
            const isDone = item.checkedHabits?.includes(h.habitId);
            return `
              <span class="status-pill ${isDone ? 'verified' : 'draft'}" style="font-size: 11px;">
                ${isDone ? '✓' : '✗'} ${h.name}
              </span>
            `;
          }).join('')}
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <strong style="font-size: 13px; display: block; margin-bottom: 6px;">Catatan Siswa:</strong>
        <p style="font-size: 13.5px; background: #f8fafc; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
          ${item.notes || '<em>Tidak ada catatan tambahan.</em>'}
        </p>
      </div>

      ${item.photoUrl ? `
        <div style="margin-bottom: 16px;">
          <strong style="font-size: 13px; display: block; margin-bottom: 6px;">Bukti Foto Kegiatan:</strong>
          <img src="${item.photoUrl}" alt="Bukti Foto" style="max-height: 180px; border-radius: var(--radius-md); border: 1px solid var(--color-border); width: 100%; object-fit: cover;">
        </div>
      ` : ''}

      <div style="margin-bottom: 8px;">
        <label class="form-label" for="verif-comment">Catatan Guru / Arahan Perbaikan (Wajib jika dikembalikan):</label>
        <textarea id="verif-comment" class="form-control" rows="2" placeholder="Tuliskan apresiasi atau bagian yang perlu diperbaiki...">${item.teacherComment || ''}</textarea>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-secondary" onclick="window.teacherView.closeVerificationModal()">Batal</button>
      <button class="btn btn-danger" onclick="window.teacherView.submitDecision(${item.id}, 'REVISE')">Kembalikan untuk Perbaikan</button>
      <button class="btn btn-success" onclick="window.teacherView.submitDecision(${item.id}, 'APPROVE')">Setujui Jurnal</button>
    `;

    modal.style.display = 'flex';
  },

  closeVerificationModal() {
    const modal = document.getElementById('verification-modal');
    if (modal) modal.style.display = 'none';
  },

  async submitDecision(id, action) {
    const comment = document.getElementById('verif-comment')?.value || '';
    if (action === 'REVISE' && !comment.trim()) {
      window.app.showToast('Wajib memberikan catatan alasan pengembalian jurnal!', 'error');
      return;
    }

    try {
      await window.api.request(`/api/teacher/journal/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify({ action, comment })
      });
      this.closeVerificationModal();
      window.app.showToast(action === 'APPROVE' ? 'Jurnal berhasil disetujui!' : 'Jurnal dikembalikan ke siswa dengan catatan!', 'success');
      window.app.renderCurrentView();
    } catch (err) {
      window.app.showToast('Gagal memproses verifikasi', 'error');
    }
  }
};
