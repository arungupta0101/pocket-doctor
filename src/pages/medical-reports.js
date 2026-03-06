// Medical Reports page
import store from '../store.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

const reportTypes = [
    { value: 'Blood Test', icon: '🩸', color: 'red' },
    { value: 'X-Ray', icon: '🦴', color: 'blue' },
    { value: 'MRI/CT Scan', icon: '🧠', color: 'purple' },
    { value: 'Prescription', icon: '📝', color: 'green' },
    { value: 'ECG', icon: '❤️', color: 'red' },
    { value: 'Ultrasound', icon: '📡', color: 'cyan' },
    { value: 'Eye Test', icon: '👁️', color: 'blue' },
    { value: 'Other', icon: '📄', color: 'yellow' },
];

export function renderMedicalReports() {
    const app = document.getElementById('app');
    const reports = store.getReports();

    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/medical-reports')}
      <main class="main-content">
        <div class="page-header">
          <h1>📋 Medical Reports</h1>
          <p>Upload and manage your medical documents securely on your device</p>
        </div>

        <!-- Upload Area -->
        <div class="upload-area" id="upload-area">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <h3>Upload Medical Report</h3>
          <p>Click or drag & drop — PDF, JPG, PNG (Max 5MB)</p>
          <input type="file" id="file-input" accept=".pdf,.jpg,.jpeg,.png,.webp" style="display: none;" />
        </div>

        <!-- Reports List -->
        ${reports.length > 0 ? `
          <div style="margin-top: var(--space-xl);">
            <h2 style="font-size: 1.1rem; margin-bottom: var(--space-md);">My Reports (${reports.length})</h2>
            <div class="reports-grid">
              ${reports.map(r => {
        const type = reportTypes.find(t => t.value === r.type) || reportTypes[reportTypes.length - 1];
        return `
                  <div class="report-card" data-id="${r.id}">
                    <div class="report-card-icon action-icon ${type.color}">
                      <span style="font-size: 1.3rem;">${type.icon}</span>
                    </div>
                    <h4>${r.name}</h4>
                    <p>${r.type} • ${new Date(r.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-md);">
                      <button class="btn btn-sm btn-secondary view-report" data-id="${r.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        View
                      </button>
                      <button class="btn btn-sm btn-ghost delete-report" data-id="${r.id}" style="color: var(--accent-danger);">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                `;
    }).join('')}
            </div>
          </div>
        ` : ''}

        <div class="disclaimer-banner" style="margin-top: var(--space-xl);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>All reports are stored securely on your device only. Nothing is uploaded to any server.</span>
        </div>
      </main>
    </div>
  `;

    initNavbar();

    // Upload click
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--accent-primary)'; });
    uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) handleFile(fileInput.files[0]);
    });

    function handleFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            showToast('File size must be less than 5MB', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            showModal({
                title: 'Save Report',
                content: `
          <div class="form-group" style="margin-bottom: var(--space-md);">
            <label>Report Name</label>
            <input type="text" id="report-name" value="${file.name.replace(/\.[^/.]+$/, '')}" />
          </div>
          <div class="form-group">
            <label>Report Type</label>
            <select id="report-type">
              ${reportTypes.map(t => `<option value="${t.value}">${t.icon} ${t.value}</option>`).join('')}
            </select>
          </div>
        `,
                confirmText: 'Save',
                onConfirm: () => {
                    const name = document.getElementById('report-name').value.trim() || file.name;
                    const type = document.getElementById('report-type').value;
                    try {
                        store.addReport({ name, type, fileName: file.name, fileType: file.type, data: base64 });
                        showToast('Report saved! 📋', 'success');
                        renderMedicalReports();
                    } catch (e) {
                        showToast('File too large for local storage. Try a smaller file.', 'error');
                    }
                }
            });
        };
        reader.readAsDataURL(file);
    }

    // View report
    document.querySelectorAll('.view-report').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const report = reports.find(r => r.id === parseInt(btn.dataset.id));
            if (report?.data) {
                if (report.fileType === 'application/pdf') {
                    const win = window.open();
                    win.document.write(`<iframe src="${report.data}" style="width:100%;height:100%;border:none;"></iframe>`);
                } else {
                    showModal({
                        title: report.name,
                        content: `<img src="${report.data}" style="width:100%; border-radius: 8px;" alt="${report.name}" />`,
                        confirmText: 'Close',
                        showCancel: false,
                        onConfirm: () => { }
                    });
                }
            }
        });
    });

    // Delete report
    document.querySelectorAll('.delete-report').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            store.deleteReport(parseInt(btn.dataset.id));
            showToast('Report deleted', 'info');
            renderMedicalReports();
        });
    });
}
