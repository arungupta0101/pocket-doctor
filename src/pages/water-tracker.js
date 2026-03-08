import { renderNavbar, initNavbar } from '../components/navbar.js';

const KEY = 'pd_water';

function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

function getData() {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    const today = getTodayKey();
    if (!raw[today]) raw[today] = { ml: 0, goal: 2500, cups: [] };
    return { raw, today };
}

export function renderWaterTracker() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/water-tracker')}
      <main class="main-content">
        <div class="page-header">
          <h1>💧 Water Intake Tracker</h1>
          <p>Stay hydrated — track your daily water consumption</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;">
          <!-- Main tracker -->
          <div class="card" style="text-align:center;">
            <div style="position:relative;width:180px;height:180px;margin:0 auto 24px;border-radius:50%;border:12px solid var(--border-color);display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;">
              <div id="water-fill" style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(180deg,rgba(59,130,246,0.6),rgba(37,99,235,0.8));transition:height 0.5s ease;height:0%;border-radius:0 0 100px 100px;"></div>
              <div style="position:relative;z-index:2;">
                <div id="water-ml" style="font-size:1.8rem;font-weight:900;color:var(--text-primary);">0</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">ml of <span id="goal-display">2500</span></div>
              </div>
            </div>

            <div id="water-percent" style="font-size:1.1rem;font-weight:700;color:#3b82f6;margin-bottom:16px;">0% of daily goal</div>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">
              ${[150, 250, 350, 500, 750].map(ml => `
                <button onclick="addWater(${ml})" style="padding:10px;background:rgba(59,130,246,0.1);border:1.5px solid rgba(59,130,246,0.2);border-radius:12px;font-weight:700;color:#3b82f6;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='#3b82f6';this.style.color='white'" onmouseout="this.style.background='rgba(59,130,246,0.1)';this.style.color='#3b82f6'">
                  +${ml}ml
                </button>
              `).join('')}
              <button onclick="addWater(parseInt(document.getElementById('custom-ml').value)||0)" style="padding:10px;background:rgba(11,148,136,0.1);border:1.5px solid rgba(11,148,136,0.2);border-radius:12px;font-weight:700;color:var(--accent-primary);cursor:pointer;">Custom</button>
            </div>
            <input type="number" id="custom-ml" placeholder="Custom ml" min="50" max="2000" style="width:100%;margin-bottom:12px;"/>
            <button onclick="resetToday()" style="padding:8px 20px;background:rgba(239,68,68,0.08);color:#ef4444;border:1px solid rgba(239,68,68,0.2);border-radius:8px;font-size:0.85rem;cursor:pointer;">Reset Today</button>
          </div>

          <!-- Settings & History -->
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div class="card">
              <h2 style="font-size:1rem;font-weight:700;margin-bottom:14px;">Today's Log</h2>
              <div id="cups-log" style="display:flex;flex-wrap:wrap;gap:8px;max-height:120px;overflow-y:auto;"></div>
            </div>
            <div class="card">
              <h2 style="font-size:1rem;font-weight:700;margin-bottom:14px;">⚙️ Daily Goal</h2>
              <div style="display:flex;gap:10px;align-items:center;">
                <input type="number" id="goal-input" placeholder="2500" min="500" max="6000" style="flex:1;"/>
                <button onclick="setGoal()" style="padding:10px 16px;background:var(--accent-primary);color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;">Set</button>
              </div>
            </div>
            <div class="card">
              <h2 style="font-size:1rem;font-weight:700;margin-bottom:14px;">💡 Hydration Tips</h2>
              <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
                ${['Drink a glass of water as soon as you wake up', 'Keep a water bottle at your desk', 'Drink before each meal', 'Set hourly reminders', 'Add lemon or mint for flavor'].map(tip => `
                  <li style="font-size:0.85rem;color:var(--text-secondary);display:flex;gap:8px;align-items:flex-start;"><span style="color:#3b82f6;">💧</span>${tip}</li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

    initNavbar();
    updateUI();

    window.addWater = (ml) => {
        if (!ml || ml <= 0) return;
        const { raw, today } = getData();
        raw[today].ml += ml;
        raw[today].cups.push({ ml, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) });
        localStorage.setItem(KEY, JSON.stringify(raw));
        updateUI();
    };

    window.resetToday = () => {
        const { raw, today } = getData();
        raw[today].ml = 0;
        raw[today].cups = [];
        localStorage.setItem(KEY, JSON.stringify(raw));
        updateUI();
    };

    window.setGoal = () => {
        const goal = parseInt(document.getElementById('goal-input').value);
        if (!goal || goal < 500) return;
        const { raw, today } = getData();
        raw[today].goal = goal;
        localStorage.setItem(KEY, JSON.stringify(raw));
        updateUI();
    };

    function updateUI() {
        const { raw, today } = getData();
        const { ml, goal, cups } = raw[today];
        const pct = Math.min(100, Math.round((ml / goal) * 100));
        document.getElementById('water-ml').textContent = ml;
        document.getElementById('goal-display').textContent = goal;
        document.getElementById('water-fill').style.height = pct + '%';
        document.getElementById('water-percent').textContent = `${pct}% of daily goal`;
        document.getElementById('water-percent').style.color = pct >= 100 ? '#10b981' : '#3b82f6';
        document.getElementById('cups-log').innerHTML = cups.length
            ? cups.map(c => `<div style="background:rgba(59,130,246,0.1);border-radius:8px;padding:4px 10px;font-size:0.8rem;color:#3b82f6;font-weight:600;">💧 ${c.ml}ml <span style="color:var(--text-muted);font-weight:400;">${c.time}</span></div>`).join('')
            : '<p style="color:var(--text-muted);font-size:0.85rem;">No drinks logged yet</p>';
    }
}
