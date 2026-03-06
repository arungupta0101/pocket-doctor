// Medicine Reminder page
import store from '../store.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

export function renderMedicineReminder() {
    const app = document.getElementById('app');
    const medicines = store.getMedicines();
    const logs = store.getMedicineLogs();

    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/medicine-reminder')}
      <main class="main-content">
        <div class="page-header">
          <h1>💊 Medicine Reminder</h1>
          <p>Never miss a dose — set reminders for your medications</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
          <h2 style="font-size: 1.1rem;">My Medicines</h2>
          <button class="btn btn-primary" id="add-medicine-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Medicine
          </button>
        </div>

        ${medicines.length === 0 ? `
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            <h3>No medicines added</h3>
            <p>Add your medicines to set reminders and track your medication schedule.</p>
          </div>
        ` : `
          <div class="medicine-list">
            ${medicines.map(m => `
              <div class="medicine-card">
                <div class="medicine-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                </div>
                <div class="medicine-info" style="flex: 1;">
                  <h4>${m.name}</h4>
                  <p>${m.dosage} — ${m.time} — ${m.frequency} ${m.notes ? '— ' + m.notes : ''}</p>
                </div>
                <div class="medicine-actions">
                  <button class="btn btn-sm btn-primary take-medicine" data-id="${m.id}" data-name="${m.name}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Taken
                  </button>
                  <button class="btn btn-icon btn-ghost edit-medicine" data-id="${m.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="btn btn-icon btn-ghost delete-medicine" data-id="${m.id}" style="color: var(--accent-danger);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Recent Logs -->
        ${logs.length > 0 ? `
          <div style="margin-top: var(--space-2xl);">
            <h2 style="font-size: 1.1rem; margin-bottom: var(--space-md); color: var(--text-secondary);">Recent Activity</h2>
            ${logs.slice(0, 10).map(log => `
              <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm) 0; border-bottom: 1px solid var(--border-color);">
                <span class="badge badge-${log.action === 'taken' ? 'success' : 'warning'}">${log.action === 'taken' ? '✓ Taken' : '⏭ Skipped'}</span>
                <span style="font-size: 0.9rem;">${log.medicineName}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: auto;">${new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </main>
    </div>
  `;

    initNavbar();
    setupMedicineNotifications(medicines);

    // Add medicine
    document.getElementById('add-medicine-btn').addEventListener('click', () => showMedicineForm());

    // Take medicine
    document.querySelectorAll('.take-medicine').forEach(btn => {
        btn.addEventListener('click', () => {
            store.addMedicineLog({ medicineName: btn.dataset.name, action: 'taken' });
            showToast(`✅ ${btn.dataset.name} marked as taken!`, 'success');
            renderMedicineReminder();
        });
    });

    // Edit
    document.querySelectorAll('.edit-medicine').forEach(btn => {
        btn.addEventListener('click', () => {
            const med = medicines.find(m => m.id === parseInt(btn.dataset.id));
            if (med) showMedicineForm(med);
        });
    });

    // Delete
    document.querySelectorAll('.delete-medicine').forEach(btn => {
        btn.addEventListener('click', () => {
            store.deleteMedicine(parseInt(btn.dataset.id));
            showToast('Medicine deleted', 'info');
            renderMedicineReminder();
        });
    });
}

function showMedicineForm(existingMed = null) {
    showModal({
        title: existingMed ? 'Edit Medicine' : 'Add Medicine',
        content: `
      <div class="form-group" style="margin-bottom: var(--space-md);">
        <label>Medicine Name</label>
        <input type="text" id="med-name" value="${existingMed?.name || ''}" placeholder="e.g., Paracetamol" />
      </div>
      <div class="form-row" style="margin-bottom: var(--space-md);">
        <div class="form-group">
          <label>Dosage</label>
          <input type="text" id="med-dosage" value="${existingMed?.dosage || ''}" placeholder="e.g., 500mg" />
        </div>
        <div class="form-group">
          <label>Time</label>
          <input type="time" id="med-time" value="${existingMed?.time || ''}" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: var(--space-md);">
        <label>Frequency</label>
        <select id="med-frequency">
          <option value="Once daily" ${existingMed?.frequency === 'Once daily' ? 'selected' : ''}>Once daily</option>
          <option value="Twice daily" ${existingMed?.frequency === 'Twice daily' ? 'selected' : ''}>Twice daily</option>
          <option value="Three times daily" ${existingMed?.frequency === 'Three times daily' ? 'selected' : ''}>Three times daily</option>
          <option value="Before meals" ${existingMed?.frequency === 'Before meals' ? 'selected' : ''}>Before meals</option>
          <option value="After meals" ${existingMed?.frequency === 'After meals' ? 'selected' : ''}>After meals</option>
          <option value="As needed" ${existingMed?.frequency === 'As needed' ? 'selected' : ''}>As needed</option>
        </select>
      </div>
      <div class="form-group">
        <label>Notes (optional)</label>
        <input type="text" id="med-notes" value="${existingMed?.notes || ''}" placeholder="e.g., Take with water" />
      </div>
    `,
        confirmText: existingMed ? 'Update' : 'Add Medicine',
        onConfirm: () => {
            const name = document.getElementById('med-name').value.trim();
            const dosage = document.getElementById('med-dosage').value.trim();
            const time = document.getElementById('med-time').value;
            const frequency = document.getElementById('med-frequency').value;
            const notes = document.getElementById('med-notes').value.trim();

            if (!name || !dosage || !time) {
                showToast('Please fill name, dosage, and time', 'warning');
                return;
            }

            if (existingMed) {
                store.updateMedicine(existingMed.id, { name, dosage, time, frequency, notes });
                showToast('Medicine updated!', 'success');
            } else {
                store.addMedicine({ name, dosage, time, frequency, notes });
                showToast('Medicine added! Reminder set.', 'success');
            }
            renderMedicineReminder();
        }
    });
}

function setupMedicineNotifications(medicines) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Check every minute
    setInterval(() => {
        if (Notification.permission !== 'granted') return;
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        medicines.forEach(med => {
            if (med.time === currentTime) {
                new Notification('💊 Medicine Reminder', {
                    body: `Time to take ${med.name} (${med.dosage})`,
                    icon: '/favicon.ico',
                    tag: `med-${med.id}`
                });
            }
        });
    }, 60000);
}
