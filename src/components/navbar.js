// Sidebar navigation component
import router from '../router.js';
import { getCurrentUser, logOut } from '../firebase.js';
import { showToast } from './toast.js';

const navItems = [
    { label: 'Main', type: 'section' },
    { path: '/', icon: 'layout-dashboard', label: 'Dashboard' },
    { path: '/symptom-checker', icon: 'stethoscope', label: 'Symptom Checker' },
    { path: '/ask-doctor', icon: 'message-circle-heart', label: 'Ask a Doctor' },
    { label: 'Health Tools', type: 'section' },
    { path: '/medicine-reminder', icon: 'pill', label: 'Medicine Reminder' },
    { path: '/health-tips', icon: 'heart-pulse', label: 'Health Tips' },
    { path: '/medical-reports', icon: 'file-text', label: 'Medical Reports' },
    { path: '/book-appointment', icon: 'calendar-check', label: 'Book Appointment' },
    { label: 'Emergency', type: 'section' },
    { path: '/emergency-sos', icon: 'siren', label: 'Emergency SOS', className: 'sos-item' },
    { path: '/nearby-clinics', icon: 'map-pin', label: 'Nearby Clinics' },
];

export function renderNavbar(currentPath) {
    const user = getCurrentUser();
    const initials = user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : user?.email?.[0]?.toUpperCase() || 'U';

    return `
    <!-- Mobile Header -->
    <div class="mobile-header">
      <button class="hamburger-btn" id="hamburger-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <span class="mobile-brand">Pocket Doctor</span>
    </div>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <!-- Sidebar -->
    <nav class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div class="sidebar-brand">
          <h1>Pocket Doctor</h1>
          <p>AI Health Companion</p>
        </div>
      </div>

      <div class="sidebar-nav">
        ${navItems.map(item => {
        if (item.type === 'section') {
            return `<div class="nav-section-label">${item.label}</div>`;
        }
        const isActive = currentPath === item.path;
        return `
            <div class="nav-item ${isActive ? 'active' : ''} ${item.className || ''}" data-route="${item.path}">
              <i data-lucide="${item.icon}" class="nav-icon"></i>
              <span>${item.label}</span>
            </div>
          `;
    }).join('')}
      </div>

      <div class="sidebar-footer">
        <div class="sidebar-user" data-route="/profile">
          <div class="sidebar-user-avatar">
            ${user?.photoURL ? `<img src="${user.photoURL}" alt="avatar" />` : initials}
          </div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${user?.displayName || 'User'}</div>
            <div class="sidebar-user-email">${user?.email || ''}</div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function initNavbar() {
    // Nav item clicks
    document.querySelectorAll('.nav-item[data-route]').forEach(item => {
        item.addEventListener('click', () => {
            const route = item.dataset.route;
            router.navigate(route);
            closeSidebar();
        });
    });

    // Profile click
    document.querySelector('.sidebar-user[data-route]')?.addEventListener('click', () => {
        router.navigate('/profile');
        closeSidebar();
    });

    // Mobile hamburger
    document.getElementById('hamburger-btn')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebar-overlay')?.classList.toggle('active');
}

function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-overlay')?.classList.remove('active');
}
