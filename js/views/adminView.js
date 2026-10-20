/**
 * Views untuk Peran Admin
 */
window.adminView = {
  renderDashboard(data) {
    const kpis = data.kpis;

    return `
      <div class="page-container">
        <div class="form-card-header" style="margin-bottom: 24px;">
          <h2>Dashboard Administrator</h2>
          <p style="color: var(--color-slate-medium);">Ringkasan statistik dan pemantauan 7 kebiasaan seluruh sekolah.</p>
        </div>

        <!-- 4 KPI Cards Grid -->
        <div class="kpi-grid">
          <div class="kpi-card blue">
            <span>Total Siswa</span>
            <strong>${kpis.totalStudents}</strong>
          </div>
          <div class="kpi-card purple">
            <span>Total Guru</span>
            <strong>${kpis.totalTeachers}</strong>
          </div>
          <div class="kpi-card green">
            <span>Kelas Aktif</span>
            <strong>${kpis.totalClasses}</strong>
          </div>
          <div class="kpi-card amber">
            <span>Jurnal Hari Ini</span>
            <strong>${kpis.journalsTodaySubmitted} / ${kpis.journalsTodayTotal}</strong>
          </div>
        </div>

        <!-- Analytics Grid (Donut & Status Breakdown) -->
        <div class="admin-analytics-grid">
          <!-- Donut Card -->
          <div class="form-card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div class="form-card-header">
              <h3>Persentase Pengisian Jurnal</h3>
              <p>Rasio pengisian jurnal siswa hari ini</p>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 32px; padding: 20px 0;">
              <!-- Donut Visual SVG -->
              <div style="position: relative; width: 140px; height: 140px;">
                <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" stroke-width="3.8"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" stroke-width="3.8" stroke-dasharray="${kpis.submissionPercentage}, 100"/>
                </svg>
                <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <strong style="font-size: 26px; font-weight: 900; color: var(--color-navy);">${kpis.submissionPercentage}%</strong>
                  <span style="font-size: 11px; color: var(--color-slate-medium); font-weight: 700;">Terisi</span>
                </div>
              </div>
              <!-- Legend -->
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
                  <span style="width: 12px; height: 12px; border-radius: 3px; background: #2563eb;"></span>
                  <span>Sudah Isi: <strong>${kpis.journalsTodaySubmitted}</strong></span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
                  <span style="width: 12px; height: 12px; border-radius: 3px; background: #e2e8f0;"></span>
                  <span>Belum Isi: <strong>${kpis.journalsTodayTotal - kpis.journalsTodaySubmitted}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Breakdown Card -->
          <div class="form-card">
            <div class="form-card-header">
              <h3>Status Jurnal Hari Ini</h3>
              <p>Rincian status verifikasi jurnal hari ini</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--status-draft-bg); border-radius: var(--radius-md);">
                <span style="font-weight: 700; color: var(--status-draft); font-size: 13px;">● Draf</span>
                <strong style="font-size: 16px;">${kpis.statusBreakdown.draft}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--status-submitted-bg); border-radius: var(--radius-md);">
                <span style="font-weight: 700; color: var(--status-submitted); font-size: 13px;">● Submitted (Menunggu)</span>
                <strong style="font-size: 16px;">${kpis.statusBreakdown.submitted}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--status-revision-bg); border-radius: var(--radius-md);">
                <span style="font-weight: 700; color: var(--status-revision); font-size: 13px;">● Perlu Perbaikan</span>
                <strong style="font-size: 16px;">${kpis.statusBreakdown.revision}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--status-verified-bg); border-radius: var(--radius-md);">
                <span style="font-weight: 700; color: var(--status-verified); font-size: 13px;">● Terverifikasi</span>
                <strong style="font-size: 16px;">${kpis.statusBreakdown.verified}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Rekap Kebiasaan (Minggu Ini) -->
        <div class="form-card">
          <div class="form-card-header">
            <h3>Rekap Kebiasaan (Minggu Ini)</h3>
            <p>Tingkat ketercapaian masing-masing dari 7 kebiasaan di sekolah</p>
          </div>
          <div class="rekap-habits-grid">
            ${kpis.habitsWeeklyPercentage.map(h => `
              <div class="rekap-habit-item">
                <div style="font-size: 26px; margin-bottom: 4px;">${h.icon}</div>
                <span style="font-size: 11px; font-weight: 700; color: var(--color-slate-dark); height: 28px; display: flex; align-items: center; justify-content: center;">
                  ${h.name}
                </span>
                <span class="percent">${h.percent}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // Modul Laporan & Ekspor
  renderReports(reports) {
    return `
      <div class="page-container">
        <div class="form-card-header" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2>Laporan & Rekapitulasi Jurnal</h2>
            <p style="color: var(--color-slate-medium);">Unduh dan tinjau rekapitulasi data 7 kebiasaan siswa.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-danger btn-sm" onclick="window.adminView.exportPDF()">
              📄 Export PDF
            </button>
            <button class="btn btn-success btn-sm" onclick="window.adminView.exportExcel()">
              📊 Export Excel
            </button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="form-card" style="margin-bottom: 20px; padding: 16px;">
          <div class="filter-bar-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; align-items: flex-end;">
            <div>
              <label class="form-label">Periode</label>
              <select class="form-control">
                <option>Mei 2025</option>
                <option>April 2025</option>
              </select>
            </div>
            <div>
              <label class="form-label">Kelas</label>
              <select class="form-control">
                <option>Semua Kelas</option>
                <option>Kelas 5A</option>
                <option>Kelas 5B</option>
              </select>
            </div>
            <div>
              <label class="form-label">Status</label>
              <select class="form-control">
                <option>Semua Status</option>
                <option>Terverifikasi</option>
                <option>Menunggu</option>
              </select>
            </div>
            <div>
              <button class="btn btn-primary" style="width: 100%;">Tampilkan</button>
            </div>
          </div>
        </div>

        <!-- Table Rekap -->
        <div class="table-card">
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Total Siswa</th>
                  <th>Sudah Isi</th>
                  <th>Persentase Ketercapaian</th>
                  <th>Status Rata-rata</th>
                </tr>
              </thead>
              <tbody>
                ${reports.map(r => `
                  <tr>
                    <td><strong>${r.date}</strong></td>
                    <td>${r.totalStudents}</td>
                    <td>${r.submitted}</td>
                    <td>
                      <span class="status-pill verified">● ${r.percent}</span>
                    </td>
                    <td><span style="font-size: 12px; color: var(--color-status-verified); font-weight: 700;">↗ Baik</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // Export handlers
  exportPDF() {
    window.print();
  },

  exportExcel() {
    // Generate CSV data client-side
    const rows = [
      ['Tanggal', 'Total Siswa', 'Sudah Mengisi', 'Persentase'],
      ...window.MOCK_DATA.rekapReports.map(r => [r.date, r.totalStudents, r.submitted, r.percent])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Rekap_7_Kebiasaan_Indonesia_Hebat.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.app.showToast('Laporan Excel (CSV) berhasil diunduh!', 'success');
  }
};
