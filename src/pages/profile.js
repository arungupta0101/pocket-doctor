// Profile page
import store from '../store.js';
import { getCurrentUser, logOut } from '../firebase.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';
import router from '../router.js';

export function renderProfile() {
    const app = document.getElementById('app');
    const user = getCurrentUser();
    const profile = store.getProfile();
    const apiKey = store.getApiKey();
    const initials = user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/profile')}
      <main class="main-content">
        <div class="page-header">
          <h1>👤 Profile & Settings</h1>
          <p>Manage your profile, API key, and data</p>
        </div>

        <!-- User Info -->
        <div class="card" style="margin-bottom: var(--space-xl);">
          <div class="profile-header">
            <div class="profile-avatar-large">
              ${user?.photoURL ? `<img src="${user.photoURL}" alt="avatar" />` : initials}
            </div>
            <div>
              <h2 style="font-size: 1.3rem;">${user?.displayName || 'User'}</h2>
              <p style="color: var(--text-muted);">${user?.email || ''}</p>
            </div>
          </div>
        </div>

        <!-- Health Profile -->
        <div class="card" style="margin-bottom: var(--space-xl);">
          <h3 style="margin-bottom: var(--space-lg);">🏥 Health Profile</h3>
          <form id="profile-form">
            <div class="form-row" style="margin-bottom: var(--space-md);">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="prof-name" value="${profile.name || user?.displayName || ''}" placeholder="Your full name" />
              </div>
              <div class="form-group">
                <label>Age</label>
                <input type="number" id="prof-age" value="${profile.age || ''}" placeholder="Your age" min="1" max="120" />
              </div>
            </div>
            <div class="form-row" style="margin-bottom: var(--space-md);">
              <div class="form-group">
                <label>Blood Group</label>
                <select id="prof-blood">
                  <option value="">Select</option>
                  ${['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg =>
        `<option value="${bg}" ${profile.bloodGroup === bg ? 'selected' : ''}>${bg}</option>`
    ).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="prof-phone" value="${profile.phone || ''}" placeholder="Phone number" />
              </div>
            </div>
            <div class="form-group" style="margin-bottom: var(--space-md);">
              <label>Known Allergies</label>
              <input type="text" id="prof-allergies" value="${profile.allergies || ''}" placeholder="e.g., Penicillin, Peanuts" />
            </div>
            <div class="form-group" style="margin-bottom: var(--space-lg);">
              <label>Existing Conditions</label>
              <input type="text" id="prof-conditions" value="${profile.conditions || ''}" placeholder="e.g., Diabetes, Asthma" />
            </div>
            <button type="submit" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Profile
            </button>
          </form>
        </div>

        <!-- Gemini API Key -->
        <div class="card" style="margin-bottom: var(--space-xl);">
          <h3 style="margin-bottom: var(--space-md);">🔑 Gemini API Key</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--space-md);">
            Required for AI Symptom Checker and Ask a Doctor features. 
            Get your free API key from <a href="https://aistudio.google.com/apikey" target="_blank">Google AI Studio</a>.
          </p>
          <div class="form-group" style="margin-bottom: var(--space-md);">
            <label>API Key</label>
            <input type="password" id="api-key-input" value="${apiKey}" placeholder="Enter your Gemini API key" />
          </div>
          <button class="btn btn-primary btn-sm" id="save-api-key">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save Key
          </button>
          ${apiKey ? '<span class="badge badge-success" style="margin-left: var(--space-md);">✓ Key saved</span>' : '<span class="badge badge-warning" style="margin-left: var(--space-md);">Not set</span>'}
        </div>

        <!-- Data Management -->
        <div class="card" style="margin-bottom: var(--space-xl);">
          <h3 style="margin-bottom: var(--space-md);">💾 Data Management</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: var(--space-lg);">
            All your data is stored locally on this device. You can export a backup or import data from another device.
          </p>
          <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
            <button class="btn btn-secondary" id="export-data-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Data
            </button>
            <button class="btn btn-secondary" id="import-data-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Import Data
            </button>
            <input type="file" id="import-file" accept=".json" style="display: none;" />
          </div>
        </div>

        <!-- Logout -->
        <div class="card" style="border-color: rgba(var(--accent-danger-rgb), 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="color: var(--accent-danger);">Logout</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem;">Sign out of your Pocket Doctor account</p>
            </div>
            <button class="btn btn-danger" id="logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  `;

    initNavbar();

    // Save profile
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        store.setProfile({
            name: document.getElementById('prof-name').value.trim(),
            age: document.getElementById('prof-age').value,
            bloodGroup: document.getElementById('prof-blood').value,
            phone: document.getElementById('prof-phone').value.trim(),
            allergies: document.getElementById('prof-allergies').value.trim(),
            conditions: document.getElementById('prof-conditions').value.trim()
        });
        showToast('Profile saved! ✅', 'success');
    });

    // Save API key
    document.getElementById('save-api-key').addEventListener('click', () => {
        const key = document.getElementById('api-key-input').value.trim();
        store.setApiKey(key);
        showToast(key ? 'API key saved! 🔑' : 'API key removed', key ? 'success' : 'info');
        renderProfile();
    });

    // Export data
    document.getElementById('export-data-btn').addEventListener('click', () => {
        const data = store.exportAll();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pocket-doctor-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Data exported! 📁', 'success');
    });

    // Import data
    const importFile = document.getElementById('import-file');
    document.getElementById('import-data-btn').addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', () => {
        const file = importFile.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const success = store.importAll(reader.result);
            if (success) {
                showToast('Data imported successfully! 🎉', 'success');
                renderProfile();
            } else {
                showToast('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        const result = await logOut();
        if (result.success) {
            showToast('Logged out', 'info');
            router.navigate('/login');
        } else {
            showToast(result.error, 'error');
        }
    });
}
