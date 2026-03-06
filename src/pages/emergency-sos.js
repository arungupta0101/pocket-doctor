// Emergency SOS page
import store from '../store.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

export function renderEmergencySOS() {
    const app = document.getElementById('app');
    const contacts = store.getEmergencyContacts();

    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/emergency-sos')}
      <main class="main-content">
        <div class="page-header">
          <h1>🚨 Emergency SOS</h1>
          <p>Quick access to emergency services and contacts</p>
        </div>

        <div class="sos-container">
          <!-- Main SOS Button -->
          <button class="sos-btn-main" id="sos-main-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>SOS</span>
          </button>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Tap to call emergency services (112)</p>

          <!-- Emergency Numbers -->
          <div class="emergency-numbers">
            <div class="emergency-number-card" data-tel="108">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-danger)" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <div class="number">108</div>
              <div class="label">Ambulance</div>
            </div>
            <div class="emergency-number-card" data-tel="100">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div class="number">100</div>
              <div class="label">Police</div>
            </div>
            <div class="emergency-number-card" data-tel="101">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warning)" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              <div class="number">101</div>
              <div class="label">Fire</div>
            </div>
          </div>

          <!-- Share Location -->
          <button class="btn btn-secondary btn-lg" id="share-location-btn" style="margin-top: var(--space-md);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Share My Location
          </button>
        </div>

        <!-- Emergency Contacts -->
        <div style="margin-top: var(--space-2xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
            <h2 style="font-size: 1.1rem;">My Emergency Contacts</h2>
            <button class="btn btn-primary btn-sm" id="add-contact-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Contact
            </button>
          </div>

          ${contacts.length === 0 ? `
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <h3>No emergency contacts</h3>
              <p>Add your family members or friends for quick access during emergencies.</p>
            </div>
          ` : `
            <div class="medicine-list">
              ${contacts.map(c => `
                <div class="medicine-card">
                  <div class="medicine-icon" style="background: rgba(var(--accent-danger-rgb), 0.12); color: var(--accent-danger);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div class="medicine-info">
                    <h4>${c.name}</h4>
                    <p>${c.phone} — ${c.relation}</p>
                  </div>
                  <div class="medicine-actions">
                    <a href="tel:${c.phone}" class="btn btn-icon btn-ghost" style="color: var(--accent-primary);">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </a>
                    <button class="btn btn-icon btn-ghost delete-contact" data-id="${c.id}" style="color: var(--accent-danger);">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </main>
    </div>
  `;

    initNavbar();

    // SOS button
    document.getElementById('sos-main-btn').addEventListener('click', () => {
        window.open('tel:112');
    });

    // Emergency number cards
    document.querySelectorAll('.emergency-number-card').forEach(card => {
        card.addEventListener('click', () => {
            window.open(`tel:${card.dataset.tel}`);
        });
    });

    // Share location
    document.getElementById('share-location-btn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    if (navigator.share) {
                        navigator.share({
                            title: '🚨 Emergency - My Location',
                            text: `I need help! My current location:`,
                            url: mapsUrl
                        });
                    } else {
                        navigator.clipboard.writeText(mapsUrl);
                        showToast('Location link copied to clipboard!', 'success');
                    }
                },
                () => showToast('Could not get your location', 'error')
            );
        } else {
            showToast('Geolocation is not supported', 'error');
        }
    });

    // Add contact
    document.getElementById('add-contact-btn').addEventListener('click', () => {
        showModal({
            title: 'Add Emergency Contact',
            content: `
        <div class="form-group" style="margin-bottom: var(--space-md);">
          <label>Name</label>
          <input type="text" id="contact-name" placeholder="Contact name" />
        </div>
        <div class="form-group" style="margin-bottom: var(--space-md);">
          <label>Phone Number</label>
          <input type="tel" id="contact-phone" placeholder="Phone number" />
        </div>
        <div class="form-group">
          <label>Relation</label>
          <select id="contact-relation">
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Spouse">Spouse</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Doctor">Doctor</option>
            <option value="Other">Other</option>
          </select>
        </div>
      `,
            confirmText: 'Add Contact',
            onConfirm: () => {
                const name = document.getElementById('contact-name').value.trim();
                const phone = document.getElementById('contact-phone').value.trim();
                const relation = document.getElementById('contact-relation').value;
                if (!name || !phone) {
                    showToast('Please fill all fields', 'warning');
                    return;
                }
                store.addEmergencyContact({ name, phone, relation });
                showToast('Contact added!', 'success');
                renderEmergencySOS();
            }
        });
    });

    // Delete contact
    document.querySelectorAll('.delete-contact').forEach(btn => {
        btn.addEventListener('click', () => {
            store.deleteEmergencyContact(parseInt(btn.dataset.id));
            showToast('Contact deleted', 'info');
            renderEmergencySOS();
        });
    });
}
