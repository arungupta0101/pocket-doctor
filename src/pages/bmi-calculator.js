import { renderNavbar, initNavbar } from '../components/navbar.js';

export function renderBMICalculator() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/bmi-calculator')}
      <main class="main-content">
        <div class="page-header">
          <h1>⚖️ BMI Calculator</h1>
          <p>Calculate your Body Mass Index and understand your health status</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;">
          <!-- Calculator Card -->
          <div class="card">
            <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:20px;color:var(--text-primary);">Enter Your Details</h2>
            <div style="display:flex;gap:12px;margin-bottom:16px;">
              <button id="btn-metric" onclick="setUnit('metric')" style="flex:1;padding:10px;border-radius:10px;border:2px solid var(--accent-primary);background:var(--accent-primary);color:white;font-weight:600;cursor:pointer;">Metric (kg/cm)</button>
              <button id="btn-imperial" onclick="setUnit('imperial')" style="flex:1;padding:10px;border-radius:10px;border:2px solid var(--border-color);background:transparent;color:var(--text-secondary);font-weight:600;cursor:pointer;">Imperial (lb/ft)</button>
            </div>
            <div class="form-group" style="margin-bottom:16px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Weight (<span id="weight-unit">kg</span>)</label>
              <input type="number" id="weight-input" placeholder="e.g. 70" min="1" max="500" style="margin-top:6px;"/>
            </div>
            <div class="form-group" id="height-metric-group" style="margin-bottom:16px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Height (cm)</label>
              <input type="number" id="height-cm" placeholder="e.g. 170" min="50" max="300" style="margin-top:6px;"/>
            </div>
            <div class="form-group" id="height-imperial-group" style="margin-bottom:16px;display:none;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Height</label>
              <div style="display:flex;gap:8px;margin-top:6px;">
                <input type="number" id="height-ft" placeholder="ft" min="1" max="10" style="flex:1;"/>
                <input type="number" id="height-in" placeholder="in" min="0" max="11" style="flex:1;"/>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:20px;">
              <label style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);">Age</label>
              <input type="number" id="age-input" placeholder="e.g. 25" min="1" max="120" style="margin-top:6px;"/>
            </div>
            <button onclick="calculateBMI()" style="width:100%;padding:13px;background:linear-gradient(135deg,var(--accent-primary),#0d7a70);color:white;border:none;border-radius:12px;font-weight:700;font-size:1rem;cursor:pointer;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
              Calculate BMI
            </button>
          </div>

          <!-- Result Card -->
          <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;" id="result-card">
            <div id="bmi-result-content">
              <div style="width:140px;height:140px;border-radius:50%;border:8px solid var(--border-color);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 20px;">
                <span style="font-size:2.2rem;font-weight:900;color:var(--text-muted);">--</span>
                <span style="font-size:0.75rem;color:var(--text-muted);">BMI</span>
              </div>
              <p style="color:var(--text-muted);">Enter your details and click Calculate</p>
            </div>
          </div>
        </div>

        <!-- BMI Scale -->
        <div class="card" style="max-width:900px;margin-top:24px;">
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:16px;">BMI Scale</h2>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
            ${[
            { label: 'Underweight', range: '< 18.5', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Normal', range: '18.5 – 24.9', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Overweight', range: '25 – 29.9', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Obese', range: '≥ 30', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
        ].map(c => `
              <div style="background:${c.bg};border-radius:12px;padding:16px;text-align:center;border:2px solid ${c.color}22;">
                <div style="font-size:1.5rem;font-weight:800;color:${c.color};">${c.range}</div>
                <div style="font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-top:4px;">${c.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </main>
    </div>
  `;

    initNavbar();

    let unit = 'metric';
    window.setUnit = (u) => {
        unit = u;
        document.getElementById('height-metric-group').style.display = u === 'metric' ? 'block' : 'none';
        document.getElementById('height-imperial-group').style.display = u === 'imperial' ? 'block' : 'none';
        document.getElementById('weight-unit').textContent = u === 'metric' ? 'kg' : 'lb';
        document.getElementById('btn-metric').style.background = u === 'metric' ? 'var(--accent-primary)' : 'transparent';
        document.getElementById('btn-metric').style.color = u === 'metric' ? 'white' : 'var(--text-secondary)';
        document.getElementById('btn-imperial').style.background = u === 'imperial' ? 'var(--accent-primary)' : 'transparent';
        document.getElementById('btn-imperial').style.color = u === 'imperial' ? 'white' : 'var(--text-secondary)';
    };

    window.calculateBMI = () => {
        let weight = parseFloat(document.getElementById('weight-input').value);
        let heightM;
        if (unit === 'metric') {
            const cm = parseFloat(document.getElementById('height-cm').value);
            heightM = cm / 100;
        } else {
            const ft = parseFloat(document.getElementById('height-ft').value) || 0;
            const inch = parseFloat(document.getElementById('height-in').value) || 0;
            heightM = ((ft * 12) + inch) * 0.0254;
            weight = weight * 0.453592;
        }
        if (!weight || !heightM) return;
        const bmi = weight / (heightM * heightM);
        const bmiRounded = bmi.toFixed(1);
        let category, color, emoji, advice;
        if (bmi < 18.5) { category = 'Underweight'; color = '#3b82f6'; emoji = '🔵'; advice = 'Consider a balanced diet with more calories and consult a nutritionist.'; }
        else if (bmi < 25) { category = 'Normal Weight'; color = '#10b981'; emoji = '🟢'; advice = 'Great! Maintain your healthy lifestyle with regular exercise and balanced diet.'; }
        else if (bmi < 30) { category = 'Overweight'; color = '#f59e0b'; emoji = '🟡'; advice = 'Consider increasing physical activity and reducing calorie intake.'; }
        else { category = 'Obese'; color = '#ef4444'; emoji = '🔴'; advice = 'Please consult a healthcare professional for a personalized weight management plan.'; }

        document.getElementById('bmi-result-content').innerHTML = `
      <div style="width:150px;height:150px;border-radius:50%;border:8px solid ${color};display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 20px;background:${color}15;">
        <span style="font-size:2.5rem;font-weight:900;color:${color};">${bmiRounded}</span>
        <span style="font-size:0.75rem;color:var(--text-muted);">BMI</span>
      </div>
      <div style="font-size:1.2rem;font-weight:800;color:${color};margin-bottom:8px;">${emoji} ${category}</div>
      <p style="color:var(--text-secondary);font-size:0.88rem;line-height:1.5;max-width:220px;margin:0 auto;">${advice}</p>
    `;
    };
}
