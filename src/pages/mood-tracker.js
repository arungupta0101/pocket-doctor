import { renderNavbar, initNavbar } from '../components/navbar.js';

const KEY = 'pd_mood';
const MOODS = [
    { emoji: '😄', label: 'Great', color: '#10b981', value: 5 },
    { emoji: '🙂', label: 'Good', color: '#3b82f6', value: 4 },
    { emoji: '😐', label: 'Okay', color: '#f59e0b', value: 3 },
    { emoji: '😔', label: 'Low', color: '#f97316', value: 2 },
    { emoji: '😢', label: 'Bad', color: '#ef4444', value: 1 },
];

function getLogs() { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
function saveLogs(l) { localStorage.setItem(KEY, JSON.stringify(l)); }

export function renderMoodTracker() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/mood-tracker')}
      <main class="main-content">
        <div class="page-header">
          <h1>😊 Mood Tracker</h1>
          <p>Track your emotional wellbeing and spot patterns</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;">
          <!-- Log Mood -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;">How are you feeling?</h2>
            <div style="display:flex;justify-content:space-around;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
              ${MOODS.map(m => `
                <button id="mood-btn-${m.value}" onclick="selectMood(${m.value})" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;border-radius:16px;border:2px solid var(--border-color);background:transparent;cursor:pointer;transition:all 0.2s;min-width:60px;" onmouseover="this.style.borderColor='${m.color}';this.style.background='${m.color}15'" onmouseout="this.style.borderColor=selectedMood===${m.value}?'${m.color}':'var(--border-color)';this.style.background=selectedMood===${m.value}?'${m.color}15':'transparent'">
                  <span style="font-size:2rem;">${m.emoji}</span>
                  <span style="font-size:0.75rem;font-weight:600;color:var(--text-secondary);">${m.label}</span>
                </button>
              `).join('')}
            </div>
            <div class="form-group" style="margin-bottom:16px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">What's on your mind? (optional)</label>
              <textarea id="mood-note" placeholder="e.g. Feeling tired after work..." style="margin-top:6px;min-height:80px;"></textarea>
            </div>
            <div class="form-group" style="margin-bottom:20px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Tags</label>
              <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;" id="tag-row">
                ${['Work', 'Family', 'Health', 'Sleep', 'Exercise', 'Food', 'Social'].map(tag => `
                  <button onclick="toggleTag('${tag}')" id="tag-${tag}" style="padding:5px 12px;border-radius:100px;border:1.5px solid var(--border-color);font-size:0.8rem;font-weight:600;color:var(--text-secondary);background:transparent;cursor:pointer;transition:all 0.15s;">${tag}</button>
                `).join('')}
              </div>
            </div>
            <button onclick="logMood()" style="width:100%;padding:13px;background:linear-gradient(135deg,var(--accent-primary),#0d7a70);color:white;border:none;border-radius:12px;font-weight:700;cursor:pointer;">
              Log Mood
            </button>
          </div>

          <!-- Stats -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;">This Week</h2>
            <div id="mood-stats"></div>
          </div>
        </div>

        <!-- History -->
        <div class="card" style="max-width:900px;margin-top:24px;">
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">Mood History</h2>
          <div id="mood-history"></div>
        </div>
      </main>
    </div>
  `;

    initNavbar();

    let selectedMood = null;
    let selectedTags = new Set();

    window.selectMood = (val) => {
        selectedMood = val;
        MOODS.forEach(m => {
            const btn = document.getElementById(`mood-btn-${m.value}`);
            const isSel = m.value === val;
            btn.style.borderColor = isSel ? m.color : 'var(--border-color)';
            btn.style.background = isSel ? m.color + '22' : 'transparent';
            btn.style.transform = isSel ? 'scale(1.08)' : 'scale(1)';
        });
    };

    window.toggleTag = (tag) => {
        const btn = document.getElementById(`tag-${tag}`);
        if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
            btn.style.background = 'transparent';
            btn.style.color = 'var(--text-secondary)';
            btn.style.borderColor = 'var(--border-color)';
        } else {
            selectedTags.add(tag);
            btn.style.background = 'var(--accent-primary)';
            btn.style.color = 'white';
            btn.style.borderColor = 'var(--accent-primary)';
        }
    };

    window.logMood = () => {
        if (!selectedMood) return alert('Please select a mood first');
        const mood = MOODS.find(m => m.value === selectedMood);
        const note = document.getElementById('mood-note').value;
        const logs = getLogs();
        logs.unshift({ mood: mood.value, emoji: mood.emoji, label: mood.label, color: mood.color, note, tags: [...selectedTags], date: new Date().toISOString() });
        saveLogs(logs);
        document.getElementById('mood-note').value = '';
        selectedMood = null;
        selectedTags.clear();
        MOODS.forEach(m => { const b = document.getElementById(`mood-btn-${m.value}`); b.style.borderColor = 'var(--border-color)'; b.style.background = 'transparent'; b.style.transform = 'scale(1)'; });
        ['Work', 'Family', 'Health', 'Sleep', 'Exercise', 'Food', 'Social'].forEach(tag => { const b = document.getElementById(`tag-${tag}`); if (b) { b.style.background = 'transparent'; b.style.color = 'var(--text-secondary)'; b.style.borderColor = 'var(--border-color)'; } });
        renderHistory();
    };

    window.deleteEntry = (idx) => {
        const logs = getLogs(); logs.splice(idx, 1); saveLogs(logs); renderHistory();
    };

    function renderHistory() {
        const logs = getLogs();
        // Stats
        const week = logs.filter(l => new Date(l.date) > new Date(Date.now() - 7 * 24 * 3600 * 1000));
        const avg = week.length ? (week.reduce((a, l) => a + l.mood, 0) / week.length).toFixed(1) : '--';
        const best = week.length ? MOODS.find(m => m.value === Math.max(...week.map(l => l.mood))) : null;
        document.getElementById('mood-stats').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div style="background:rgba(11,148,136,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.8rem;font-weight:900;color:var(--accent-primary);">${avg}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Avg Score (7d)</div>
        </div>
        <div style="background:rgba(59,130,246,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.8rem;">${best ? best.emoji : '--'}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Most Common</div>
        </div>
        <div style="background:rgba(16,185,129,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.8rem;font-weight:900;color:#10b981;">${week.length}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Logs This Week</div>
        </div>
        <div style="background:rgba(245,158,11,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.8rem;font-weight:900;color:#f59e0b;">${logs.length}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Total Entries</div>
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:flex-end;height:60px;">
        ${week.slice(0, 7).reverse().map(l => `<div style="flex:1;background:${l.color};border-radius:4px;height:${l.mood * 20}%;opacity:0.8;" title="${l.label} — ${new Date(l.date).toLocaleDateString()}"></div>`).join('')}
        ${week.length === 0 ? '<p style="color:var(--text-muted);font-size:0.85rem;width:100%;text-align:center;">No data yet</p>' : ''}
      </div>`;
        // History
        const histEl = document.getElementById('mood-history');
        if (!logs.length) { histEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px;">No mood entries yet. Log your first mood!</p>'; return; }
        histEl.innerHTML = logs.slice(0, 30).map((l, i) => `
      <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border-color);">
        <span style="font-size:1.8rem;">${l.emoji}</span>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:700;color:${l.color};">${l.label}</span>
            <span style="font-size:0.78rem;color:var(--text-muted);">${new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          ${l.tags?.length ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">${l.tags.map(t => `<span style="font-size:0.7rem;background:rgba(11,148,136,0.1);color:var(--accent-primary);padding:2px 8px;border-radius:100px;">${t}</span>`).join('')}</div>` : ''}
          ${l.note ? `<p style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px;">${l.note}</p>` : ''}
        </div>
        <button onclick="deleteEntry(${i})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;">🗑</button>
      </div>`).join('');
    }

    renderHistory();
}
