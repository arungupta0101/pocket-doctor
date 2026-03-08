import { renderNavbar, initNavbar } from '../components/navbar.js';

const FIRST_AID = [
    {
        id: 'cpr', emoji: '❤️', title: 'CPR (Adult)', color: '#ef4444',
        steps: [
            'Call 108 (Ambulance) immediately or ask someone to call',
            'Place the person on their back on a firm, flat surface',
            'Kneel beside them and place the heel of your hand on the center of their chest',
            'Press down hard and fast — at least 2 inches deep, 100–120 times per minute',
            'After 30 compressions, tilt head back, lift chin, and give 2 rescue breaths',
            'Continue 30:2 cycles until help arrives or the person starts breathing',
        ]
    },
    {
        id: 'choking', emoji: '😮‍💨', title: 'Choking (Adult)', color: '#f97316',
        steps: [
            'Ask "Are you choking?" — if they cannot speak, cough, or breathe, act immediately',
            'Stand behind the person and lean them slightly forward',
            'Give 5 firm back blows with the heel of your hand between shoulder blades',
            'If blows don\'t work, give 5 abdominal thrusts (Heimlich maneuver)',
            'Place fist above navel, cover with other hand, thrust inward and upward sharply',
            'Alternate back blows and abdominal thrusts until object is dislodged',
            'If person becomes unconscious, call 108 and start CPR',
        ]
    },
    {
        id: 'burns', emoji: '🔥', title: 'Burns', color: '#f59e0b',
        steps: [
            'Remove the person from the source of the burn immediately',
            'Cool the burn with cool (not cold/ice) running water for 20 minutes',
            'Never apply ice, butter, toothpaste, or any home remedies',
            'Remove jewelry or tight items near the burn area before swelling starts',
            'Cover loosely with a clean, non-fluffy material (cling wrap works well)',
            'For severe burns, chemical burns, or burns on face/hands/joints — call 108',
            'Do NOT break blisters as this increases infection risk',
        ]
    },
    {
        id: 'bleeding', emoji: '🩸', title: 'Severe Bleeding', color: '#dc2626',
        steps: [
            'Call 108 if bleeding is severe or doesn\'t stop',
            'Wear gloves if available to protect yourself',
            'Apply firm, direct pressure with a clean cloth or bandage',
            'Do NOT remove the cloth — if soaked, add more on top',
            'Keep pressure continuous for at least 10–15 minutes',
            'Elevate the injured limb above heart level if possible',
            'If a tourniquet is needed, apply 2 inches above the wound and note the time',
        ]
    },
    {
        id: 'fracture', emoji: '🦴', title: 'Fracture / Broken Bone', color: '#8b5cf6',
        steps: [
            'Do NOT try to straighten the bone or move the injured limb',
            'If skin is broken, cover with a clean bandage to prevent infection',
            'Immobilize the area using a splint — rigid material on each side wrapped with bandage',
            'Apply ice pack wrapped in cloth to reduce swelling (20 mins on, 20 mins off)',
            'Keep the person still and calm',
            'Call 108 for upper leg, hip, pelvis, spine, or rib fractures — these are emergencies',
            'Transport the person carefully to the nearest hospital',
        ]
    },
    {
        id: 'seizure', emoji: '⚡', title: 'Seizure', color: '#7c3aed',
        steps: [
            'Stay calm and keep others away to give space',
            'Note the time — if seizure lasts more than 5 minutes, call 108',
            'Guide the person away from sharp or hard objects',
            'Place something soft under their head',
            'Turn them gently on their side to prevent choking',
            'Do NOT restrain them or put anything in their mouth',
            'Stay with them until they are fully conscious and aware',
        ]
    },
    {
        id: 'heatstroke', emoji: '☀️', title: 'Heat Stroke', color: '#d97706',
        steps: [
            'Call 108 — heat stroke is a medical emergency',
            'Move the person to a cool, shaded area immediately',
            'Remove excess clothing to cool them down',
            'Cool rapidly — use water, fan, ice packs on neck/armpits/groin',
            'Give cool water to drink only if the person is conscious',
            'Do NOT give aspirin or paracetamol for heat stroke fever',
            'Monitor breathing and keep them lying down until help arrives',
        ]
    },
    {
        id: 'allergic', emoji: '🤧', title: 'Severe Allergic Reaction', color: '#06b6d4',
        steps: [
            'Call 108 immediately — anaphylaxis can be fatal within minutes',
            'If an epinephrine auto-injector (EpiPen) is available, use it on outer thigh immediately',
            'Lay the person down and elevate legs (unless breathing is difficult)',
            'If breathing is difficult, let them sit up slightly',
            'A second EpiPen dose can be given after 5–15 minutes if available',
            'Do NOT give antihistamines as a substitute for epinephrine in severe reactions',
            'Even if symptoms improve after EpiPen, they must go to hospital',
        ]
    },
];

export function renderFirstAid() {
    const app = document.getElementById('app');
    let selected = null;

    app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/first-aid')}
      <main class="main-content">
        <div class="page-header">
          <h1>🩺 First Aid Guide</h1>
          <p>Quick offline first aid instructions for common emergencies</p>
        </div>

        <div style="background:rgba(239,68,68,0.08);border:1.5px solid rgba(239,68,68,0.2);border-radius:14px;padding:14px 18px;margin-bottom:24px;max-width:900px;display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:1.3rem;">⚠️</span>
          <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.5;margin:0;"><strong style="color:#ef4444;">Disclaimer:</strong> This guide provides general first aid information only. Always call <strong>108</strong> in a life-threatening emergency. This app does not replace professional medical advice.</p>
        </div>

        <div style="display:grid;grid-template-columns:280px 1fr;gap:24px;max-width:900px;" id="first-aid-layout">
          <!-- List -->
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${FIRST_AID.map(item => `
              <button id="fa-btn-${item.id}" onclick="selectFA('${item.id}')" style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;border:2px solid var(--border-color);background:var(--bg-card);cursor:pointer;text-align:left;transition:all 0.2s;">
                <span style="font-size:1.6rem;">${item.emoji}</span>
                <span style="font-weight:600;color:var(--text-primary);font-size:0.92rem;">${item.title}</span>
              </button>
            `).join('')}
          </div>

          <!-- Steps Panel -->
          <div class="card" id="fa-panel" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:300px;">
            <span style="font-size:3rem;">🩺</span>
            <h3 style="margin-top:12px;color:var(--text-secondary);font-weight:500;">Select a topic from the left</h3>
          </div>
        </div>
      </main>
    </div>
  `;

    initNavbar();

    window.selectFA = (id) => {
        const item = FIRST_AID.find(f => f.id === id);
        if (!item) return;
        // Highlight selected
        FIRST_AID.forEach(f => {
            const btn = document.getElementById(`fa-btn-${f.id}`);
            btn.style.borderColor = f.id === id ? item.color : 'var(--border-color)';
            btn.style.background = f.id === id ? item.color + '15' : 'var(--bg-card)';
        });
        document.getElementById('fa-panel').innerHTML = `
      <div style="text-align:left;width:100%;">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border-color);">
          <span style="font-size:2.5rem;">${item.emoji}</span>
          <div>
            <h2 style="font-size:1.3rem;font-weight:800;color:${item.color};">${item.title}</h2>
            <p style="font-size:0.82rem;color:var(--text-muted);">Follow these steps carefully</p>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;">
          ${item.steps.map((step, i) => `
            <div style="display:flex;gap:14px;align-items:flex-start;">
              <div style="width:28px;height:28px;border-radius:50%;background:${item.color};color:white;font-weight:800;font-size:0.85rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i + 1}</div>
              <p style="font-size:0.92rem;color:var(--text-primary);line-height:1.6;margin:0;padding-top:3px;">${step}</p>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border-color);display:flex;gap:10px;">
          <a href="tel:108" style="display:flex;align-items:center;gap:6px;padding:10px 20px;background:#ef4444;color:white;border-radius:10px;font-weight:700;text-decoration:none;font-size:0.9rem;">📞 Call 108</a>
          <a href="tel:100" style="display:flex;align-items:center;gap:6px;padding:10px 20px;background:#3b82f6;color:white;border-radius:10px;font-weight:700;text-decoration:none;font-size:0.9rem;">🚓 Police 100</a>
        </div>
      </div>
    `;
        document.getElementById('fa-panel').style.textAlign = 'left';
        document.getElementById('fa-panel').style.alignItems = 'flex-start';
        document.getElementById('fa-panel').style.justifyContent = 'flex-start';
    };
}
