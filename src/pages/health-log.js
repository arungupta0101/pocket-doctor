import { renderNavbar, initNavbar } from '../components/navbar.js';

const STORE_KEY = 'pd_health_log';

function getLogs() {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
}
function saveLogs(logs) {
    localStorage.setItem(STORE_KEY, JSON.stringify(logs));
}

export function renderHealthLog() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/health-log')}
      <main class="main-content">
        <div class="page-header">
          <h1>📊 Health Log</h1>
          <p>Track your blood pressure and blood sugar readings over time</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;">
          <!-- Add Entry -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;">Add New Reading</h2>
            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Type</label>
              <select id="log-type" style="margin-top:6px;">
                <option value="bp">Blood Pressure</option>
                <option value="sugar">Blood Sugar</option>
              </select>
            </div>
            <div id="bp-fields">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
                <div class="form-group">
                  <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Systolic (mmHg)</label>
                  <input type="number" id="systolic" placeholder="120" min="60" max="200" style="margin-top:6px;"/>
                </div>
                <div class="form-group">
                  <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Diastolic (mmHg)</label>
                  <input type="number" id="diastolic" placeholder="80" min="40" max="140" style="margin-top:6px;"/>
                </div>
              </div>
            </div>
            <div id="sugar-fields" style="display:none;margin-bottom:14px;">
              <div class="form-group">
                <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Blood Sugar (mg/dL)</label>
                <input type="number" id="sugar-val" placeholder="100" min="20" max="600" style="margin-top:6px;"/>
              </div>
              <div class="form-group" style="margin-top:12px;">
                <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Timing</label>
                <select id="sugar-timing" style="margin-top:6px;">
                  <option value="fasting">Fasting</option>
                  <option value="2hr-after-meal">2hr After Meal</option>
                  <option value="random">Random</option>
                </select>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:20px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Notes (optional)</label>
              <textarea id="log-notes" placeholder="Any notes..." style="margin-top:6px;min-height:60px;"></textarea>
            </div>
            <button onclick="addLogEntry()" style="width:100%;padding:13px;background:linear-gradient(135deg,var(--accent-primary),#0d7a70);color:white;border:none;border-radius:12px;font-weight:700;cursor:pointer;">
              + Add Reading
            </button>
          </div>

          <!-- Stats -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;">Recent Stats</h2>
            <div id="log-stats">
              <p style="color:var(--text-muted);text-align:center;padding:40px 0;">No readings yet. Add your first one!</p>
            </div>
          </div>
        </div>

        <!-- Log List -->
        <div class="card" style="max-width:900px;margin-top:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="font-size:1.1rem;font-weight:700;">History</h2>
            <button onclick="clearAllLogs()" style="padding:6px 14px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer;">Clear All</button>
          </div>
          <div id="log-list"></div>
        </div>
      </main>
    </div>
  `;

    initNavbar();

    document.getElementById('log-type').addEventListener('change', function () {
        document.getElementById('bp-fields').style.display = this.value === 'bp' ? 'block' : 'none';
        document.getElementById('sugar-fields').style.display = this.value === 'sugar' ? 'block' : 'none';
    });

    renderLogList();

    window.addLogEntry = () => {
        const type = document.getElementById('log-type').value;
        const notes = document.getElementById('log-notes').value;
        let entry = { type, date: new Date().toISOString(), notes };
        if (type === 'bp') {
            const sys = parseInt(document.getElementById('systolic').value);
            const dia = parseInt(document.getElementById('diastolic').value);
            if (!sys || !dia) return alert('Please enter both systolic and diastolic values');
            entry.systolic = sys;
            entry.diastolic = dia;
        } else {
            const sugar = parseInt(document.getElementById('sugar-val').value);
            if (!sugar) return alert('Please enter blood sugar value');
            entry.sugar = sugar;
            entry.timing = document.getElementById('sugar-timing').value;
        }
        const logs = getLogs();
        logs.unshift(entry);
        saveLogs(logs);
        renderLogList();
    };

    window.deleteLogEntry = (idx) => {
        const logs = getLogs();
        logs.splice(idx, 1);
        saveLogs(logs);
        renderLogList();
    };

    window.clearAllLogs = () => {
        if (confirm('Delete all health log entries?')) {
            saveLogs([]);
            renderLogList();
        }
    };

    function getBPStatus(sys, dia) {
        if (sys < 120 && dia < 80) return { label: 'Normal', color: '#10b981' };
        if (sys < 130 && dia < 80) return { label: 'Elevated', color: '#f59e0b' };
        if (sys < 180 || dia < 120) return { label: 'High', color: '#ef4444' };
        return { label: 'Crisis', color: '#7f1d1d' };
    }

    function getSugarStatus(val, timing) {
        if (timing === 'fasting') return val < 100 ? { label: 'Normal', color: '#10b981' } : val < 126 ? { label: 'Pre-diabetic', color: '#f59e0b' } : { label: 'Diabetic Range', color: '#ef4444' };
        if (timing === '2hr-after-meal') return val < 140 ? { label: 'Normal', color: '#10b981' } : val < 200 ? { label: 'Pre-diabetic', color: '#f59e0b' } : { label: 'Diabetic Range', color: '#ef4444' };
        return val < 140 ? { label: 'Normal', color: '#10b981' } : { label: 'Elevated', color: '#f59e0b' };
    }

    function renderLogList() {
        const logs = getLogs();
        const listEl = document.getElementById('log-list');
        const statsEl = document.getElementById('log-stats');
        if (!logs.length) {
            listEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px;">No entries yet.</p>';
            statsEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0;">No readings yet.</p>';
            return;
        }
        listEl.innerHTML = logs.slice(0, 20).map((e, i) => {
            const date = new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            if (e.type === 'bp') {
                const s = getBPStatus(e.systolic, e.diastolic);
                return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border-color);">
          <div>
            <div style="font-weight:700;color:var(--text-primary);">🩸 ${e.systolic}/${e.diastolic} <span style="font-size:0.78rem;color:${s.color};background:${s.color}15;padding:2px 8px;border-radius:100px;font-weight:600;">${s.label}</span></div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${date}${e.notes ? ' · ' + e.notes : ''}</div>
          </div>
          <button onclick="deleteLogEntry(${i})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem;">🗑</button>
        </div>`;
            } else {
                const s = getSugarStatus(e.sugar, e.timing);
                return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border-color);">
          <div>
            <div style="font-weight:700;color:var(--text-primary);">🍬 ${e.sugar} mg/dL <span style="font-size:0.78rem;color:${s.color};background:${s.color}15;padding:2px 8px;border-radius:100px;font-weight:600;">${s.label}</span> <span style="font-size:0.78rem;color:var(--text-muted);">(${e.timing})</span></div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${date}${e.notes ? ' · ' + e.notes : ''}</div>
          </div>
          <button onclick="deleteLogEntry(${i})" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem;">🗑</button>
        </div>`;
            }
        }).join('');

        const bpLogs = logs.filter(l => l.type === 'bp');
        const sugarLogs = logs.filter(l => l.type === 'sugar');
        statsEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:rgba(239,68,68,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#ef4444;">${bpLogs.length ? bpLogs[0].systolic + '/' + bpLogs[0].diastolic : '--'}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Latest BP (mmHg)</div>
        </div>
        <div style="background:rgba(245,158,11,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#f59e0b;">${sugarLogs.length ? sugarLogs[0].sugar : '--'}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Latest Sugar (mg/dL)</div>
        </div>
        <div style="background:rgba(11,148,136,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:var(--accent-primary);">${bpLogs.length}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">BP Readings</div>
        </div>
        <div style="background:rgba(59,130,246,0.08);border-radius:12px;padding:14px;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#3b82f6;">${sugarLogs.length}</div>
          <div style="font-size:0.78rem;color:var(--text-muted);">Sugar Readings</div>
        </div>
      </div>`;
    }
}
