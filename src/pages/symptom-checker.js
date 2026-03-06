// Symptom Checker page
import store from '../store.js';
import { callGemini, buildSymptomPrompt } from '../gemini.js';
import { showToast } from '../components/toast.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Cold', 'Body Pain', 'Fatigue',
  'Nausea', 'Stomach Ache', 'Dizziness', 'Sore Throat', 'Back Pain',
  'Chest Pain', 'Shortness of Breath', 'Joint Pain', 'Skin Rash'
];

export function renderSymptomChecker() {
  const app = document.getElementById('app');
  const history = store.getSymptomHistory();

  app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/symptom-checker')}
      <main class="main-content">
        <div class="page-header">
          <h1>🩺 Symptom Checker</h1>
          <p>Describe your symptoms and get AI-powered health insights</p>
        </div>

        <div class="disclaimer-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>This is for informational purposes only. Always consult a licensed medical professional for diagnosis.</span>
        </div>

        <div class="card" style="margin-bottom: var(--space-xl);">
          <h3 style="font-size: 1rem; margin-bottom: var(--space-md);">Describe your symptoms</h3>
          <div class="symptom-input-area">
            <textarea id="symptom-input" placeholder="E.g., I have a headache since morning, mild fever, and feeling tired. Also have a runny nose..."></textarea>
          </div>
          
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-md); margin-bottom: var(--space-sm);">Or click to add common symptoms:</p>
          <div class="symptom-tags" id="symptom-tags">
            ${commonSymptoms.map(s => `<button class="symptom-tag" data-symptom="${s}">${s}</button>`).join('')}
          </div>

          <div style="margin-top: var(--space-lg); display: flex; gap: var(--space-md);">
            <button class="btn btn-primary btn-lg" id="analyze-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Analyze Symptoms
            </button>
            <button class="btn btn-secondary" id="clear-btn">Clear</button>
          </div>
        </div>

        <!-- Results -->
        <div id="analysis-result"></div>

        <!-- History -->
        ${history.length > 0 ? `
        <div style="margin-top: var(--space-xl);">
          <h2 style="font-size: 1.1rem; margin-bottom: var(--space-md); color: var(--text-secondary);">Previous Checks</h2>
          <div id="symptom-history">
            ${history.map(entry => `
              <div class="card" style="margin-bottom: var(--space-md);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">${new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <p style="font-size: 0.9rem; margin-top: 4px; color: var(--text-secondary);">${entry.symptoms.length > 100 ? entry.symptoms.substring(0, 100) + '...' : entry.symptoms}</p>
                  </div>
                  <button class="btn btn-ghost btn-sm delete-history" data-id="${entry.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </main>
    </div>
  `;

  initNavbar();

  const selectedSymptoms = new Set();

  // Tag clicks
  document.querySelectorAll('.symptom-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const symptom = tag.dataset.symptom;
      if (selectedSymptoms.has(symptom)) {
        selectedSymptoms.delete(symptom);
        tag.classList.remove('active');
      } else {
        selectedSymptoms.add(symptom);
        tag.classList.add('active');
      }
      updateTextarea();
    });
  });

  function updateTextarea() {
    const textarea = document.getElementById('symptom-input');
    const currentText = textarea.value;
    const tagText = Array.from(selectedSymptoms).join(', ');
    if (tagText && !currentText.includes(tagText)) {
      textarea.value = currentText ? `${currentText}, ${tagText}` : tagText;
    }
  }

  // Analyze
  document.getElementById('analyze-btn').addEventListener('click', async () => {
    const symptoms = document.getElementById('symptom-input').value.trim();
    if (!symptoms) {
      showToast('Please describe your symptoms first', 'warning');
      return;
    }

    const btn = document.getElementById('analyze-btn');
    const resultDiv = document.getElementById('analysis-result');
    btn.disabled = true;
    btn.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span> Analyzing...';

    resultDiv.innerHTML = `
      <div class="card" style="text-align: center; padding: var(--space-2xl);">
        <div class="typing-indicator" style="justify-content: center;"><span></span><span></span><span></span></div>
        <p style="color: var(--text-muted); margin-top: var(--space-md);">AI is analyzing your symptoms...</p>
      </div>
    `;

    try {
      const profile = store.getProfile();
      const prompt = buildSymptomPrompt(symptoms, profile);
      const response = await callGemini(prompt);

      let data;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        data = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      } catch {
        data = { raw: response };
      }

      // Save to history
      store.addSymptomEntry({ symptoms, result: data });

      // Render results
      if (data.possibleConditions) {
        resultDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
            <h2 style="font-size: 1.1rem;">Analysis Results</h2>
            <button class="btn btn-secondary btn-sm" id="simplify-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Explain in Simple Words
            </button>
          </div>
          
          <div id="simple-summary-container" style="display: none; margin-bottom: var(--space-lg);"></div>

          ${data.possibleConditions.map(cond => {
          const severityClass = cond.severity === 'severe' ? 'high' : cond.severity === 'moderate' ? 'medium' : 'low';
          const probability = cond.probability === 'High' ? 85 : cond.probability === 'Medium' ? 55 : 25;
          return `
              <div class="condition-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <h3>${cond.name}</h3>
                  <span class="badge badge-${severityClass === 'high' ? 'danger' : severityClass === 'medium' ? 'warning' : 'success'}">${cond.probability} probability</span>
                </div>
                <p>${cond.description}</p>
                <div class="severity-bar"><div class="severity-fill severity-${severityClass}" style="width: ${probability}%"></div></div>
              </div>
            `;
        }).join('')}

          ${data.recommendations ? `
            <div class="card" style="margin-top: var(--space-md);">
              <h3 style="margin-bottom: var(--space-sm);">📋 Recommendations</h3>
              <ul style="padding-left: var(--space-lg); color: var(--text-secondary);">
                ${data.recommendations.map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${data.homeRemedies ? `
            <div class="card" style="margin-top: var(--space-md);">
              <h3 style="margin-bottom: var(--space-sm);">🏠 Home Remedies</h3>
              <ul style="padding-left: var(--space-lg); color: var(--text-secondary);">
                ${data.homeRemedies.map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${data.whenToSeeDoctor ? `
            <div class="card" style="margin-top: var(--space-md); border-left: 3px solid var(--accent-danger);">
              <h3 style="margin-bottom: var(--space-sm); color: var(--accent-danger);">⚠️ When to See a Doctor</h3>
              <p style="color: var(--text-secondary);">${data.whenToSeeDoctor}</p>
            </div>
          ` : ''}

          <div class="disclaimer-banner" style="margin-top: var(--space-md);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>${data.disclaimer || 'This is not medical advice. Please consult a healthcare professional for proper diagnosis.'}</span>
          </div>
        `;

        // Add Simplify Action
        document.getElementById('simplify-btn')?.addEventListener('click', async () => {
          const simplifyBtn = document.getElementById('simplify-btn');
          const summaryContainer = document.getElementById('simple-summary-container');

          simplifyBtn.disabled = true;
          simplifyBtn.innerHTML = '<span class="typing-indicator" style="display:inline-flex; width:20px; height:10px;"><span></span><span></span><span></span></span> Explaining...';
          summaryContainer.style.display = 'block';
          summaryContainer.innerHTML = '<div class="card" style="background: var(--bg-secondary);"><span class="typing-indicator"><span></span><span></span><span></span></span> Generating easy summary...</div>';

          try {
            const rawAnalysisInfo = JSON.stringify(data);
            const prompt = `Translate this complex medical analysis into a very simple, 2-3 sentence summary that a 10-year old could understand. Tell them what it likely is, if they should worry, and what to do next in plain English or Hindi (if the input implies so). Here is the data: ${rawAnalysisInfo}`;

            const summaryText = await callGemini(prompt, 'You simplify medical text into easy, comforting language.');

            summaryContainer.innerHTML = `
              <div class="card" style="background: var(--bg-hover); border: 1px solid var(--primary-main); border-radius: var(--radius-lg);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="font-size: 1.2rem;">✨</span>
                  <h3 style="color: var(--primary-main); font-size: 1rem; margin: 0;">Easy Summary</h3>
                </div>
                <p style="color: var(--text-primary); line-height: 1.6; font-size: 0.95rem;">${summaryText}</p>
              </div>
            `;
            simplifyBtn.style.display = 'none'; // hide after success
          } catch (err) {
            summaryContainer.innerHTML = `<div class="card" style="border-left: 3px solid var(--accent-danger);"><p style="color: var(--accent-danger);">❌ Could not generate summary. ${err.message}</p></div>`;
            simplifyBtn.disabled = false;
            simplifyBtn.innerHTML = 'Explain in Simple Words';
          }
        });

      } else if (data.raw) {
        resultDiv.innerHTML = `<div class="card"><div style="white-space: pre-wrap; color: var(--text-secondary); line-height: 1.7;">${data.raw}</div></div>`;
      }
    } catch (err) {
      resultDiv.innerHTML = `<div class="card" style="border-left: 3px solid var(--accent-danger);"><p style="color: var(--accent-danger);">❌ ${err.message}</p></div>`;
      showToast(err.message, 'error');
    }

    btn.disabled = false;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Analyze Symptoms';
  });

  // Clear
  document.getElementById('clear-btn')?.addEventListener('click', () => {
    document.getElementById('symptom-input').value = '';
    selectedSymptoms.clear();
    document.querySelectorAll('.symptom-tag').forEach(t => t.classList.remove('active'));
    document.getElementById('analysis-result').innerHTML = '';
  });

  // Delete history
  document.querySelectorAll('.delete-history').forEach(btn => {
    btn.addEventListener('click', () => {
      store.deleteSymptomEntry(parseInt(btn.dataset.id));
      showToast('Entry deleted', 'info');
      renderSymptomChecker();
    });
  });
}
