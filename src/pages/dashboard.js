// Dashboard page
import { getCurrentUser } from '../firebase.js';
import store from '../store.js';
import router from '../router.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

const healthTips = [
  "💧 Drink at least 8 glasses of water daily to stay hydrated.",
  "🚶 Walk 30 minutes every day — reduces heart disease risk by 35%.",
  "😴 Get 7-8 hours of sleep. Poor sleep weakens immunity.",
  "🍎 Eat 5 servings of fruits and vegetables daily.",
  "🧘 Practice deep breathing for 5 minutes to reduce stress.",
  "☀️ Get 15 minutes of morning sunlight for natural Vitamin D.",
  "🦷 Brush twice daily — oral health affects heart health.",
  "📱 20-20-20 rule: every 20 mins, look 20ft away for 20 secs.",
  "🥗 Eat fiber-rich foods to improve gut health.",
  "💪 Stretch every morning to reduce injury risk."
];

const ALL_FEATURES = [
  { route: '/symptom-checker', emoji: '🩺', label: 'Symptom Checker', desc: 'AI-powered diagnosis', grad: 'linear-gradient(135deg,#0b9488,#14b8a6)' },
  { route: '/ask-doctor', emoji: '💬', label: 'Ask Doctor', desc: 'Chat with AI doctor', grad: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
  { route: '/medicine-reminder', emoji: '💊', label: 'Medicines', desc: 'Set reminders', grad: 'linear-gradient(135deg,#a855f7,#c084fc)' },
  { route: '/bmi-calculator', emoji: '⚖️', label: 'BMI Calc', desc: 'Check your BMI', grad: 'linear-gradient(135deg,#10b981,#34d399)' },
  { route: '/health-log', emoji: '📊', label: 'Health Log', desc: 'BP & Sugar log', grad: 'linear-gradient(135deg,#ef4444,#f87171)' },
  { route: '/water-tracker', emoji: '💧', label: 'Hydration', desc: 'Daily water goal', grad: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
  { route: '/health-goals', emoji: '🎯', label: 'Goals', desc: 'Track progress', grad: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
  { route: '/mood-tracker', emoji: '😊', label: 'Mood Log', desc: 'Emotional wellbeing', grad: 'linear-gradient(135deg,#ec4899,#f472b6)' },
  { route: '/book-appointment', emoji: '📅', label: 'Appointments', desc: 'Book & manage', grad: 'linear-gradient(135deg,#6366f1,#818cf8)' },
  { route: '/medical-reports', emoji: '📋', label: 'Reports', desc: 'Medical records', grad: 'linear-gradient(135deg,#06b6d4,#22d3ee)' },
  { route: '/emergency-contacts', emoji: '📞', label: 'Emergency', desc: 'Quick contacts', grad: 'linear-gradient(135deg,#ef4444,#dc2626)' },
  { route: '/first-aid', emoji: '🩹', label: 'First Aid', desc: 'Emergency guide', grad: 'linear-gradient(135deg,#f97316,#fb923c)' },
  { route: '/nearby-clinics', emoji: '📍', label: 'Nearby Clinics', desc: 'Find hospitals', grad: 'linear-gradient(135deg,#14b8a6,#2dd4bf)' },
  { route: '/health-tips', emoji: '✨', label: 'Health Tips', desc: 'Daily wellness', grad: 'linear-gradient(135deg,#84cc16,#a3e635)' },
];

export function renderDashboard() {
  const app = document.getElementById('app');
  const user = getCurrentUser();
  const greeting = getGreeting();
  const greetEmoji = getGreetEmoji();
  const medicines = store.getMedicines();
  const appointments = store.getAppointments();
  const symptomHistory = store.getSymptomHistory();
  const tip = healthTips[new Date().getDate() % healthTips.length];
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const todayMeds = medicines.filter(m => {
    const hours = new Date().getHours();
    const medHour = parseInt(m.time?.split(':')[0] || 0);
    return medHour >= hours;
  });
  const upcomingApts = appointments.filter(a => new Date(a.date) >= new Date()).slice(0, 3);

  app.innerHTML = `
    <style>
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      .dash-hero {
        background: linear-gradient(135deg, #0b4f4a 0%, #0b9488 55%, #14b8a6 100%);
        border-radius: 24px;
        padding: 32px 36px;
        color: white;
        position: relative;
        overflow: hidden;
        margin-bottom: 28px;
        animation: slideInUp 0.4s ease both;
      }
      .dash-hero::before {
        content: '';
        position: absolute;
        width: 280px; height: 280px;
        border-radius: 50%;
        background: rgba(255,255,255,0.07);
        top: -100px; right: -60px;
      }
      .dash-hero::after {
        content: '';
        position: absolute;
        width: 180px; height: 180px;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);
        bottom: -80px; left: 20px;
      }
      .stat-pill {
        background: white;
        border-radius: 20px;
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        animation: slideInUp 0.4s ease both;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
      }
      .stat-pill:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.1);
      }
      .stat-pill-icon {
        width: 52px; height: 52px;
        border-radius: 16px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
        font-size: 1.5rem;
      }
      .feat-card {
        background: white;
        border-radius: 20px;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        border: 1.5px solid rgba(0,0,0,0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        text-align: center;
        animation: slideInUp 0.4s ease both;
      }
      .feat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 14px 36px rgba(0,0,0,0.10);
        border-color: transparent;
      }
      .feat-icon {
        width: 54px; height: 54px;
        border-radius: 18px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.6rem;
        flex-shrink: 0;
      }
      .tip-banner {
        background: linear-gradient(135deg, #f0fdf4, #ecfeff);
        border: 1.5px solid #a7f3d0;
        border-radius: 20px;
        padding: 20px 24px;
        display: flex;
        gap: 16px;
        align-items: center;
        animation: slideInUp 0.4s ease both;
      }
      .med-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 0;
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }
      .med-item:last-child { border-bottom: none; }
      .apt-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 0;
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }
      .apt-item:last-child { border-bottom: none; }
      .section-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-secondary);
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 0.75rem;
      }
    </style>

    <div class="app-layout">
      ${renderNavbar('/')}
      <main class="main-content" style="background:#f0f4f8;min-height:100vh;">

        <!-- Hero Banner -->
        <div class="dash-hero">
          <div style="position:relative;z-index:2;">
            <p style="font-size:0.9rem;opacity:0.75;margin-bottom:6px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;">${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <h1 style="font-size:2rem;font-weight:900;margin-bottom:8px;letter-spacing:-0.5px;">${greetEmoji} ${greeting}, ${firstName}!</h1>
            <p style="font-size:1rem;opacity:0.88;line-height:1.6;max-width:480px;">Your personal health companion is ready. Stay healthy, stay informed.</p>
            <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
              <button onclick="navigate('/symptom-checker')" style="padding:10px 20px;background:white;color:#0b9488;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.9rem;box-shadow:0 2px 10px rgba(0,0,0,0.1);transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                🩺 Check Symptoms
              </button>
              <button onclick="navigate('/ask-doctor')" style="padding:10px 20px;background:rgba(255,255,255,0.18);color:white;border:2px solid rgba(255,255,255,0.5);border-radius:10px;font-weight:700;cursor:pointer;font-size:0.9rem;backdrop-filter:blur(8px);transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                💬 Ask Doctor
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Row -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;">
          <div class="stat-pill" style="animation-delay:0.05s;" onclick="navigate('/symptom-checker')">
            <div class="stat-pill-icon" style="background:linear-gradient(135deg,#0b9488,#14b8a6);">🩺</div>
            <div>
              <div style="font-size:1.8rem;font-weight:900;color:#111827;line-height:1;">${symptomHistory.length}</div>
              <div style="font-size:0.78rem;color:#9ca3af;font-weight:500;margin-top:2px;">Symptom Checks</div>
            </div>
          </div>
          <div class="stat-pill" style="animation-delay:0.1s;" onclick="navigate('/book-appointment')">
            <div class="stat-pill-icon" style="background:linear-gradient(135deg,#3b82f6,#60a5fa);">📅</div>
            <div>
              <div style="font-size:1.8rem;font-weight:900;color:#111827;line-height:1;">${appointments.length}</div>
              <div style="font-size:0.78rem;color:#9ca3af;font-weight:500;margin-top:2px;">Appointments</div>
            </div>
          </div>
          <div class="stat-pill" style="animation-delay:0.15s;" onclick="navigate('/medicine-reminder')">
            <div class="stat-pill-icon" style="background:linear-gradient(135deg,#a855f7,#c084fc);">💊</div>
            <div>
              <div style="font-size:1.8rem;font-weight:900;color:#111827;line-height:1;">${medicines.length}</div>
              <div style="font-size:0.78rem;color:#9ca3af;font-weight:500;margin-top:2px;">Medicines</div>
            </div>
          </div>
          <div class="stat-pill" style="animation-delay:0.2s;" onclick="navigate('/medical-reports')">
            <div class="stat-pill-icon" style="background:linear-gradient(135deg,#06b6d4,#22d3ee);">📋</div>
            <div>
              <div style="font-size:1.8rem;font-weight:900;color:#111827;line-height:1;">${store.getReports().length}</div>
              <div style="font-size:0.78rem;color:#9ca3af;font-weight:500;margin-top:2px;">Reports</div>
            </div>
          </div>
        </div>

        <!-- Two column layout: features + sidebar -->
        <div style="display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start;">

          <!-- Left: Feature Grid -->
          <div>
            <div class="section-title">⚡ All Features</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;">
              ${ALL_FEATURES.map((f, i) => `
                <div class="feat-card" data-route="${f.route}" style="animation-delay:${0.05 * i}s;">
                  <div class="feat-icon" style="background:${f.grad};">${f.emoji}</div>
                  <div>
                    <div style="font-weight:700;color:#111827;font-size:0.88rem;">${f.label}</div>
                    <div style="font-size:0.75rem;color:#9ca3af;margin-top:2px;">${f.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right Sidebar -->
          <div style="display:flex;flex-direction:column;gap:16px;">

            <!-- Tip of the Day -->
            <div class="tip-banner">
              <div style="font-size:2rem;flex-shrink:0;">💡</div>
              <div>
                <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#0b9488;margin-bottom:4px;">Health Tip</div>
                <p style="font-size:0.88rem;color:#374151;line-height:1.6;margin:0;">${tip}</p>
              </div>
            </div>

            <!-- Today's Medicines -->
            ${todayMeds.length > 0 ? `
            <div style="background:white;border-radius:20px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.05);">
              <div class="section-title">💊 Medicines Today</div>
              ${todayMeds.slice(0, 3).map(m => `
                <div class="med-item">
                  <div style="width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#a855f7,#c084fc);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">💊</div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:0.88rem;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.name}</div>
                    <div style="font-size:0.75rem;color:#9ca3af;">${m.dosage} · ${m.time}</div>
                  </div>
                  <span style="background:rgba(168,85,247,0.1);color:#a855f7;font-size:0.7rem;font-weight:700;padding:3px 8px;border-radius:100px;white-space:nowrap;">${m.frequency}</span>
                </div>
              `).join('')}
              <button onclick="navigate('/medicine-reminder')" style="width:100%;margin-top:10px;padding:8px;background:#f8f9fa;border:none;border-radius:10px;color:#6b7280;font-weight:600;font-size:0.82rem;cursor:pointer;">View All →</button>
            </div>
            ` : `
            <div style="background:white;border-radius:20px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.05);text-align:center;">
              <div style="font-size:2rem;margin-bottom:8px;">💊</div>
              <p style="color:#9ca3af;font-size:0.85rem;margin:0 0 12px;">No medicines scheduled</p>
              <button onclick="navigate('/medicine-reminder')" style="padding:7px 16px;background:linear-gradient(135deg,#a855f7,#c084fc);color:white;border:none;border-radius:8px;font-size:0.8rem;font-weight:700;cursor:pointer;">Add Medicine</button>
            </div>
            `}

            <!-- Upcoming Appointments -->
            ${upcomingApts.length > 0 ? `
            <div style="background:white;border-radius:20px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.05);">
              <div class="section-title">📅 Upcoming</div>
              ${upcomingApts.map(a => {
    const d = new Date(a.date);
    return `
                <div class="apt-item">
                  <div style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#3b82f6,#60a5fa);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">
                    <span style="font-size:1rem;font-weight:800;color:white;line-height:1;">${d.getDate()}</span>
                    <span style="font-size:0.6rem;color:rgba(255,255,255,0.9);text-transform:uppercase;">${d.toLocaleString('en', { month: 'short' })}</span>
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-weight:700;font-size:0.88rem;color:#111827;">Dr. ${a.doctorName}</div>
                    <div style="font-size:0.75rem;color:#9ca3af;">${a.specialty} · ${a.time}</div>
                  </div>
                </div>`;
  }).join('')}
              <button onclick="navigate('/book-appointment')" style="width:100%;margin-top:10px;padding:8px;background:#f8f9fa;border:none;border-radius:10px;color:#6b7280;font-weight:600;font-size:0.82rem;cursor:pointer;">View All →</button>
            </div>
            ` : ''}

            <!-- Emergency SOS Banner -->
            <div onclick="navigate('/emergency-sos')" style="background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:20px;padding:20px;cursor:pointer;transition:transform 0.2s;box-shadow:0 4px 20px rgba(239,68,68,0.25);" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="font-size:2rem;">🚨</div>
                <div>
                  <div style="font-weight:800;color:white;font-size:1rem;">Emergency SOS</div>
                  <div style="font-size:0.8rem;color:rgba(255,255,255,0.8);">Tap for quick help · Call 108</div>
                </div>
                <svg style="margin-left:auto;color:white;opacity:0.7;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>

            <!-- Support Banner -->
            <div onclick="navigate('/support')" style="background:linear-gradient(135deg,#fdf4ff,#fce7f3);border:1.5px solid #f0abfc;border-radius:20px;padding:18px;cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:1.6rem;">☕</span>
                <div>
                  <div style="font-weight:700;color:#7c3aed;font-size:0.9rem;">Support the Developer</div>
                  <div style="font-size:0.78rem;color:#a78bfa;">Buy me a coffee — keep this free!</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  `;

  initNavbar();

  window.navigate = (route) => router.navigate(route);

  document.querySelectorAll('.feat-card[data-route]').forEach(card => {
    card.addEventListener('click', () => router.navigate(card.dataset.route));
  });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getGreetEmoji() {
  const h = new Date().getHours();
  if (h < 12) return '🌅';
  if (h < 17) return '☀️';
  return '🌙';
}
