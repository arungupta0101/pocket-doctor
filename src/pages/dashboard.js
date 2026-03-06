// Dashboard page
import { getCurrentUser } from '../firebase.js';
import store from '../store.js';
import router from '../router.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

const healthTipOfDay = [
    "💧 Drink at least 8 glasses of water daily to stay hydrated and improve digestion.",
    "🚶 Walk for 30 minutes every day — it reduces heart disease risk by 35%.",
    "😴 Get 7-8 hours of sleep. Poor sleep weakens immunity and affects mood.",
    "🍎 Eat 5 servings of fruits and vegetables daily for essential vitamins.",
    "🧘 Practice deep breathing for 5 minutes to reduce stress and anxiety.",
    "☀️ Get 15 minutes of morning sunlight for natural Vitamin D.",
    "🦷 Brush twice daily and floss once — oral health affects heart health.",
    "📱 Take a 20-second break every 20 minutes from screens (20-20-20 rule).",
    "🥗 Include fiber-rich foods to improve gut health and prevent constipation.",
    "💪 Stretch every morning — it improves flexibility and reduces injury risk."
];

export function renderDashboard() {
    const app = document.getElementById('app');
    const user = getCurrentUser();
    const greeting = getGreeting();
    const medicines = store.getMedicines();
    const appointments = store.getAppointments();
    const symptomHistory = store.getSymptomHistory();
    const tip = healthTipOfDay[new Date().getDate() % healthTipOfDay.length];

    const todayMeds = medicines.filter(m => {
        const now = new Date();
        const hours = now.getHours();
        const medHour = parseInt(m.time?.split(':')[0] || 0);
        return medHour >= hours;
    });

    const upcomingApts = appointments.filter(a => new Date(a.date) >= new Date()).slice(0, 3);

    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/')}
      <main class="main-content">
        <div class="page-header">
          <h1>${greeting}, ${user?.displayName?.split(' ')[0] || 'there'}! 👋</h1>
          <p>Here's your health overview for today</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-4" style="margin-bottom: var(--space-xl);">
          <div class="stat-card">
            <div class="stat-icon green" style="background: rgba(var(--accent-primary-rgb), 0.12); color: var(--accent-primary);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <div class="stat-value">${symptomHistory.length}</div>
              <div class="stat-label">Symptom Checks</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue" style="background: rgba(var(--accent-secondary-rgb), 0.12); color: var(--accent-secondary);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <div class="stat-value">${appointments.length}</div>
              <div class="stat-label">Appointments</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple" style="background: rgba(168, 85, 247, 0.12); color: var(--accent-purple);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
            </div>
            <div>
              <div class="stat-value">${medicines.length}</div>
              <div class="stat-label">Medicines</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon cyan" style="background: rgba(6, 182, 212, 0.12); color: var(--accent-info);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <div class="stat-value">${store.getReports().length}</div>
              <div class="stat-label">Reports</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <h2 style="font-size: 1.1rem; margin-bottom: var(--space-md); color: var(--text-secondary);">Quick Actions</h2>
        <div class="quick-actions" style="margin-bottom: var(--space-xl);">
          <div class="quick-action-card" data-route="/symptom-checker">
            <div class="action-icon green"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg></div>
            <h3>Check Symptoms</h3>
            <p>AI-powered analysis</p>
          </div>
          <div class="quick-action-card" data-route="/ask-doctor">
            <div class="action-icon blue"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
            <h3>Ask Doctor</h3>
            <p>Chat with AI Doctor</p>
          </div>
          <div class="quick-action-card" data-route="/medicine-reminder">
            <div class="action-icon purple"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg></div>
            <h3>Medicines</h3>
            <p>Set reminders</p>
          </div>
          <div class="quick-action-card" data-route="/emergency-sos">
            <div class="action-icon red"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
            <h3>Emergency SOS</h3>
            <p>Quick emergency help</p>
          </div>
          <div class="quick-action-card" data-route="/book-appointment">
            <div class="action-icon yellow"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg></div>
            <h3>Appointments</h3>
            <p>Book & manage</p>
          </div>
          <div class="quick-action-card" data-route="/nearby-clinics">
            <div class="action-icon cyan"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <h3>Nearby Clinics</h3>
            <p>Find hospitals</p>
          </div>
        </div>

        <!-- Tip of the day -->
        <div class="card" style="margin-bottom: var(--space-xl); border-left: 3px solid var(--accent-primary);">
          <h3 style="font-size: 0.9rem; color: var(--accent-primary); margin-bottom: var(--space-sm);">💡 Health Tip of the Day</h3>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7;">${tip}</p>
        </div>

        <!-- Today's Medicines -->
        ${todayMeds.length > 0 ? `
        <div class="card" style="margin-bottom: var(--space-xl);">
          <h3 style="font-size: 1rem; margin-bottom: var(--space-md);">💊 Upcoming Medicines Today</h3>
          <div class="medicine-list">
            ${todayMeds.slice(0, 3).map(m => `
              <div class="medicine-card">
                <div class="medicine-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg></div>
                <div class="medicine-info">
                  <h4>${m.name}</h4>
                  <p>${m.dosage} — ${m.time} (${m.frequency})</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Upcoming Appointments -->
        ${upcomingApts.length > 0 ? `
        <div class="card">
          <h3 style="font-size: 1rem; margin-bottom: var(--space-md);">📅 Upcoming Appointments</h3>
          <div class="appointment-list">
            ${upcomingApts.map(a => {
        const d = new Date(a.date);
        return `
                <div class="appointment-card">
                  <div class="appointment-date">
                    <span class="day">${d.getDate()}</span>
                    <span class="month">${d.toLocaleString('en', { month: 'short' })}</span>
                  </div>
                  <div class="appointment-info">
                    <h4>Dr. ${a.doctorName}</h4>
                    <p>${a.specialty} — ${a.time} @ ${a.location}</p>
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>
        ` : ''}
      </main>
    </div>
  `;

    initNavbar();

    // Quick action routing
    document.querySelectorAll('.quick-action-card[data-route]').forEach(card => {
        card.addEventListener('click', () => router.navigate(card.dataset.route));
    });
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
}
