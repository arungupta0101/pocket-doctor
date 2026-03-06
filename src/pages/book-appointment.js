// Book Appointment page
import store from '../store.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

export function renderBookAppointment() {
    const app = document.getElementById('app');
    const appointments = store.getAppointments();
    const now = new Date();
    const upcoming = appointments.filter(a => new Date(a.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
    const past = appointments.filter(a => new Date(a.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/book-appointment')}
      <main class="main-content">
        <div class="page-header">
          <h1>📅 Book Appointment</h1>
          <p>Schedule and manage your doctor appointments</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
          <h2 style="font-size: 1.1rem;">Upcoming Appointments</h2>
          <button class="btn btn-primary" id="add-appointment-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Appointment
          </button>
        </div>

        ${upcoming.length === 0 ? `
          <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <h3>No upcoming appointments</h3>
            <p>Book an appointment with your doctor to stay on top of your health.</p>
          </div>
        ` : `
          <div class="appointment-list">
            ${upcoming.map(a => renderAppointmentCard(a)).join('')}
          </div>
        `}

        ${past.length > 0 ? `
          <div style="margin-top: var(--space-2xl);">
            <h2 style="font-size: 1.1rem; margin-bottom: var(--space-md); color: var(--text-secondary);">Past Appointments</h2>
            <div class="appointment-list">
              ${past.slice(0, 5).map(a => renderAppointmentCard(a, true)).join('')}
            </div>
          </div>
        ` : ''}
      </main>
    </div>
  `;

    initNavbar();

    document.getElementById('add-appointment-btn').addEventListener('click', () => showAppointmentForm());

    document.querySelectorAll('.edit-appointment').forEach(btn => {
        btn.addEventListener('click', () => {
            const apt = appointments.find(a => a.id === parseInt(btn.dataset.id));
            if (apt) showAppointmentForm(apt);
        });
    });

    document.querySelectorAll('.delete-appointment').forEach(btn => {
        btn.addEventListener('click', () => {
            store.deleteAppointment(parseInt(btn.dataset.id));
            showToast('Appointment deleted', 'info');
            renderBookAppointment();
        });
    });
}

function renderAppointmentCard(a, isPast = false) {
    const d = new Date(a.date);
    return `
    <div class="appointment-card" style="${isPast ? 'opacity: 0.6;' : ''}">
      <div class="appointment-date">
        <span class="day">${d.getDate()}</span>
        <span class="month">${d.toLocaleString('en', { month: 'short' })}</span>
      </div>
      <div class="appointment-info">
        <h4>Dr. ${a.doctorName}</h4>
        <p>${a.specialty} — ${a.time} — ${a.location}</p>
        ${a.notes ? `<p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${a.notes}</p>` : ''}
      </div>
      <div style="display: flex; gap: var(--space-sm);">
        <button class="btn btn-icon btn-ghost edit-appointment" data-id="${a.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn btn-icon btn-ghost delete-appointment" data-id="${a.id}" style="color: var(--accent-danger);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `;
}

function showAppointmentForm(existing = null) {
    showModal({
        title: existing ? 'Edit Appointment' : 'New Appointment',
        content: `
      <div class="form-group" style="margin-bottom: var(--space-md);">
        <label>Doctor Name</label>
        <input type="text" id="apt-doctor" value="${existing?.doctorName || ''}" placeholder="Doctor's name" />
      </div>
      <div class="form-group" style="margin-bottom: var(--space-md);">
        <label>Specialty</label>
        <select id="apt-specialty">
          ${['General Physician', 'Dentist', 'Dermatologist', 'Orthopedic', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Gynecologist', 'ENT', 'Ophthalmologist', 'Psychiatrist', 'Other'].map(s =>
            `<option value="${s}" ${existing?.specialty === s ? 'selected' : ''}>${s}</option>`
        ).join('')}
        </select>
      </div>
      <div class="form-row" style="margin-bottom: var(--space-md);">
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="apt-date" value="${existing?.date || ''}" />
        </div>
        <div class="form-group">
          <label>Time</label>
          <input type="time" id="apt-time" value="${existing?.time || ''}" />
        </div>
      </div>
      <div class="form-group" style="margin-bottom: var(--space-md);">
        <label>Location / Clinic</label>
        <input type="text" id="apt-location" value="${existing?.location || ''}" placeholder="Hospital or clinic name" />
      </div>
      <div class="form-group">
        <label>Notes (optional)</label>
        <input type="text" id="apt-notes" value="${existing?.notes || ''}" placeholder="e.g., Bring previous reports" />
      </div>
    `,
        confirmText: existing ? 'Update' : 'Book Appointment',
        onConfirm: () => {
            const doctorName = document.getElementById('apt-doctor').value.trim();
            const specialty = document.getElementById('apt-specialty').value;
            const date = document.getElementById('apt-date').value;
            const time = document.getElementById('apt-time').value;
            const location = document.getElementById('apt-location').value.trim();
            const notes = document.getElementById('apt-notes').value.trim();

            if (!doctorName || !date || !time) {
                showToast('Please fill doctor name, date, and time', 'warning');
                return;
            }

            if (existing) {
                store.updateAppointment(existing.id, { doctorName, specialty, date, time, location, notes });
                showToast('Appointment updated!', 'success');
            } else {
                store.addAppointment({ doctorName, specialty, date, time, location, notes });
                showToast('Appointment booked! 📅', 'success');
            }
            renderBookAppointment();
        }
    });
}
