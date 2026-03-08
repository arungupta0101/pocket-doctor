import { renderNavbar, initNavbar } from '../components/navbar.js';

const KEY = 'pd_emergency_contacts';
function getContacts() { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
function saveContacts(c) { localStorage.setItem(KEY, JSON.stringify(c)); }

const RELATIONS = ['Doctor', 'Family', 'Friend', 'Neighbor', 'Colleague', 'Emergency', 'Other'];
const RELATION_COLORS = { Doctor: '#ef4444', Family: '#3b82f6', Friend: '#10b981', Neighbor: '#f59e0b', Colleague: '#a855f7', Emergency: '#ef4444', Other: '#6b7280' };

export function renderEmergencyContacts() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/emergency-contacts')}
      <main class="main-content">
        <div class="page-header">
          <h1>📞 Emergency Contacts</h1>
          <p>Store important contacts for quick access in emergencies</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;">
          <!-- Add Contact -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;">Add Contact</h2>
            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Full Name</label>
              <input type="text" id="contact-name" placeholder="e.g. Dr. Rahul Sharma" style="margin-top:6px;"/>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Phone Number</label>
              <input type="tel" id="contact-phone" placeholder="e.g. +91 98765 43210" style="margin-top:6px;"/>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Relation</label>
              <select id="contact-relation" style="margin-top:6px;">
                ${RELATIONS.map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Speciality / Notes</label>
              <input type="text" id="contact-notes" placeholder="e.g. Cardiologist, Apollo Hospital" style="margin-top:6px;"/>
            </div>
            <button onclick="addContact()" style="width:100%;padding:13px;background:linear-gradient(135deg,var(--accent-primary),#0d7a70);color:white;border:none;border-radius:12px;font-weight:700;cursor:pointer;">
              + Save Contact
            </button>
          </div>

          <!-- Quick Dials -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;">🚨 National Helplines</h2>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${[
            { name: 'Ambulance (108)', number: '108', color: '#ef4444' },
            { name: 'Police', number: '100', color: '#3b82f6' },
            { name: 'Fire', number: '101', color: '#f97316' },
            { name: 'Women Helpline', number: '1091', color: '#a855f7' },
            { name: 'Child Line', number: '1098', color: '#10b981' },
            { name: 'Senior Citizen', number: '14567', color: '#f59e0b' },
            { name: 'Mental Health (Vandrevala)', number: '1860-2662-345', color: '#06b6d4' },
        ].map(h => `
                <a href="tel:${h.number}" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:${h.color}10;border:1.5px solid ${h.color}30;border-radius:12px;text-decoration:none;transition:all 0.2s;" onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform='translateX(0)'">
                  <span style="font-weight:600;color:var(--text-primary);">${h.name}</span>
                  <span style="font-weight:800;color:${h.color};font-size:1.05rem;">📞 ${h.number}</span>
                </a>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Saved Contacts -->
        <div class="card" style="max-width:900px;margin-top:24px;">
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">My Emergency Contacts</h2>
          <div id="contacts-list"></div>
        </div>
      </main>
    </div>
  `;

    initNavbar();
    renderContacts();

    window.addContact = () => {
        const name = document.getElementById('contact-name').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const relation = document.getElementById('contact-relation').value;
        const notes = document.getElementById('contact-notes').value.trim();
        if (!name || !phone) return alert('Please enter name and phone');
        const contacts = getContacts();
        contacts.push({ id: Date.now(), name, phone, relation, notes });
        saveContacts(contacts);
        ['contact-name', 'contact-phone', 'contact-notes'].forEach(id => document.getElementById(id).value = '');
        renderContacts();
    };

    window.deleteContact = (id) => {
        saveContacts(getContacts().filter(c => c.id !== id));
        renderContacts();
    };

    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    function renderContacts() {
        const contacts = getContacts();
        const el = document.getElementById('contacts-list');
        if (!contacts.length) { el.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px;">No contacts saved yet.</p>'; return; }
        el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;">
      ${contacts.map(c => {
            const color = RELATION_COLORS[c.relation] || '#6b7280';
            return `
          <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;padding:16px;display:flex;gap:12px;align-items:flex-start;">
            <div style="width:46px;height:46px;border-radius:14px;background:${color}20;color:${color};font-weight:800;font-size:1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${getInitials(c.name)}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
              <div style="font-size:0.78rem;background:${color}15;color:${color};padding:1px 8px;border-radius:100px;display:inline-block;margin:3px 0;font-weight:600;">${c.relation}</div>
              ${c.notes ? `<div style="font-size:0.78rem;color:var(--text-muted);">${c.notes}</div>` : ''}
              <a href="tel:${c.phone}" style="display:flex;align-items:center;gap:4px;margin-top:8px;padding:6px 12px;background:${color};color:white;border-radius:8px;font-size:0.82rem;font-weight:700;text-decoration:none;width:fit-content;">
                📞 ${c.phone}
              </a>
            </div>
            <button onclick="deleteContact(${c.id})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;flex-shrink:0;">🗑</button>
          </div>`;
        }).join('')}
    </div>`;
    }
}
