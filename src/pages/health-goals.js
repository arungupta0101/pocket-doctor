import { renderNavbar, initNavbar } from '../components/navbar.js';

const KEY = 'pd_goals';
function getGoals() { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
function saveGoals(g) { localStorage.setItem(KEY, JSON.stringify(g)); }

const ICONS = { exercise: '🏋️', sleep: '😴', diet: '🥗', water: '💧', meditation: '🧘', steps: '👟', custom: '⭐' };

export function renderHealthGoals() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/health-goals')}
      <main class="main-content">
        <div class="page-header">
          <h1>🎯 Health Goals</h1>
          <p>Set and track your personal health goals</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;">
          <!-- Add Goal -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;">Add New Goal</h2>
            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Category</label>
              <select id="goal-category" style="margin-top:6px;">
                <option value="exercise">🏋️ Exercise</option>
                <option value="sleep">😴 Sleep</option>
                <option value="diet">🥗 Diet</option>
                <option value="water">💧 Water</option>
                <option value="meditation">🧘 Meditation</option>
                <option value="steps">👟 Steps</option>
                <option value="custom">⭐ Custom</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Goal Title</label>
              <input type="text" id="goal-title" placeholder="e.g. Walk 30 minutes daily" style="margin-top:6px;"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
              <div class="form-group">
                <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Target</label>
                <input type="number" id="goal-target" placeholder="e.g. 30" min="1" style="margin-top:6px;"/>
              </div>
              <div class="form-group">
                <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Unit</label>
                <input type="text" id="goal-unit" placeholder="e.g. mins, steps" style="margin-top:6px;"/>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:20px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Frequency</label>
              <select id="goal-freq" style="margin-top:6px;">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <button onclick="addGoal()" style="width:100%;padding:13px;background:linear-gradient(135deg,var(--accent-primary),#0d7a70);color:white;border:none;border-radius:12px;font-weight:700;cursor:pointer;">
              + Add Goal
            </button>
          </div>

          <!-- Stats -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;">Overview</h2>
            <div id="goals-stats"></div>
          </div>
        </div>

        <!-- Goals List -->
        <div class="card" style="max-width:900px;margin-top:24px;">
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">My Goals</h2>
          <div id="goals-list"></div>
        </div>
      </main>
    </div>
  `;

    initNavbar();
    renderGoals();

    window.addGoal = () => {
        const title = document.getElementById('goal-title').value.trim();
        const target = parseInt(document.getElementById('goal-target').value);
        const unit = document.getElementById('goal-unit').value.trim();
        const category = document.getElementById('goal-category').value;
        const freq = document.getElementById('goal-freq').value;
        if (!title || !target) return alert('Please fill in title and target');
        const goals = getGoals();
        goals.push({ id: Date.now(), title, target, unit, category, freq, progress: 0, completed: false, createdAt: new Date().toISOString() });
        saveGoals(goals);
        renderGoals();
    };

    window.updateProgress = (id, delta) => {
        const goals = getGoals();
        const g = goals.find(g => g.id === id);
        if (!g) return;
        g.progress = Math.min(g.target, Math.max(0, g.progress + delta));
        g.completed = g.progress >= g.target;
        saveGoals(goals);
        renderGoals();
    };

    window.deleteGoal = (id) => {
        saveGoals(getGoals().filter(g => g.id !== id));
        renderGoals();
    };

    window.resetGoal = (id) => {
        const goals = getGoals();
        const g = goals.find(g => g.id === id);
        if (g) { g.progress = 0; g.completed = false; }
        saveGoals(goals);
        renderGoals();
    };

    function renderGoals() {
        const goals = getGoals();
        const listEl = document.getElementById('goals-list');
        const statsEl = document.getElementById('goals-stats');
        const total = goals.length;
        const done = goals.filter(g => g.completed).length;
        statsEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:rgba(11,148,136,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.8rem;font-weight:900;color:var(--accent-primary);">${total}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Total Goals</div>
        </div>
        <div style="background:rgba(16,185,129,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.8rem;font-weight:900;color:#10b981;">${done}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Completed</div>
        </div>
        <div style="background:rgba(59,130,246,0.08);border-radius:12px;padding:14px;text-align:center;grid-column:1/-1;">
          <div style="font-size:1.4rem;font-weight:900;color:#3b82f6;">${total ? Math.round(done / total * 100) : 0}%</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Completion Rate</div>
        </div>
      </div>`;
        if (!goals.length) { listEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px;">No goals yet. Add your first goal!</p>'; return; }
        listEl.innerHTML = goals.map(g => {
            const pct = Math.round((g.progress / g.target) * 100);
            const icon = ICONS[g.category] || '⭐';
            return `
        <div style="padding:16px 0;border-bottom:1px solid var(--border-color);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
            <div>
              <span style="font-size:1.2rem;">${icon}</span>
              <span style="font-weight:700;color:var(--text-primary);margin-left:8px;">${g.title}</span>
              ${g.completed ? '<span style="margin-left:8px;font-size:0.75rem;background:#10b98115;color:#10b981;padding:2px 8px;border-radius:100px;font-weight:600;">✓ Done</span>' : ''}
              <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">${g.freq} · ${g.progress}/${g.target} ${g.unit}</div>
            </div>
            <div style="display:flex;gap:6px;">
              <button onclick="updateProgress(${g.id},-1)" style="padding:4px 10px;background:rgba(239,68,68,0.1);color:#ef4444;border:none;border-radius:8px;cursor:pointer;font-weight:700;">−</button>
              <button onclick="updateProgress(${g.id},1)" style="padding:4px 10px;background:rgba(11,148,136,0.1);color:var(--accent-primary);border:none;border-radius:8px;cursor:pointer;font-weight:700;">+</button>
              <button onclick="resetGoal(${g.id})" style="padding:4px 10px;background:rgba(245,158,11,0.1);color:#f59e0b;border:none;border-radius:8px;cursor:pointer;font-size:0.8rem;">↺</button>
              <button onclick="deleteGoal(${g.id})" style="padding:4px 10px;background:rgba(239,68,68,0.08);color:#ef4444;border:none;border-radius:8px;cursor:pointer;">🗑</button>
            </div>
          </div>
          <div style="background:var(--bg-input);border-radius:100px;height:8px;overflow:hidden;">
            <div style="height:100%;background:${g.completed ? '#10b981' : 'var(--accent-primary)'};border-radius:100px;width:${pct}%;transition:width 0.3s;"></div>
          </div>
        </div>`;
        }).join('');
    }
}
