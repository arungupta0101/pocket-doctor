// Health Tips page
import store from '../store.js';
import { showToast } from '../components/toast.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

const healthTips = [
    { id: 1, category: 'Nutrition', title: 'Eat a Rainbow Diet', content: 'Include fruits and vegetables of different colors in your daily diet. Each color provides unique nutrients: red (lycopene), orange (beta-carotene), green (folate), purple (anthocyanins). Aim for at least 5 servings per day.', emoji: '🥗' },
    { id: 2, category: 'Nutrition', title: 'Stay Hydrated', content: 'Drink at least 8 glasses (2 liters) of water daily. Dehydration causes fatigue, headaches, and reduced concentration. Start your day with a warm glass of water with lemon for better digestion.', emoji: '💧' },
    { id: 3, category: 'Nutrition', title: 'Limit Sugar Intake', content: 'Reduce added sugars to less than 25g per day. Excess sugar leads to obesity, diabetes, and heart disease. Read food labels carefully — sugar hides in many packaged foods.', emoji: '🍬' },
    { id: 4, category: 'Nutrition', title: 'Power of Protein', content: 'Include protein in every meal — dal, eggs, paneer, chicken, or fish. Protein helps build muscles, repair tissues, and keeps you full longer. Adults need about 0.8g per kg of body weight daily.', emoji: '🥚' },
    { id: 5, category: 'Exercise', title: 'Walk 10,000 Steps Daily', content: 'Walking is the simplest exercise. It reduces heart disease risk by 35%, improves mood, and helps maintain healthy weight. Start with 5,000 steps and gradually increase.', emoji: '🚶' },
    { id: 6, category: 'Exercise', title: 'Stretch Every Morning', content: 'Just 10 minutes of stretching improves flexibility, reduces muscle tension, and prevents injuries. Focus on neck, shoulders, back, and legs — especially if you sit for long hours.', emoji: '🤸' },
    { id: 7, category: 'Exercise', title: 'Yoga for Beginners', content: 'Start with basic poses: Tadasana (Mountain Pose), Vrikshasana (Tree Pose), and Shavasana (Corpse Pose). Even 15 minutes of yoga daily improves flexibility, strength, and mental clarity.', emoji: '🧘' },
    { id: 8, category: 'Exercise', title: 'Strength Training', content: 'Include resistance exercises 2-3 times a week. Use bodyweight exercises like push-ups, squats, and planks. Strength training builds muscle, boosts metabolism, and strengthens bones.', emoji: '💪' },
    { id: 9, category: 'Mental Health', title: 'Practice Deep Breathing', content: 'Try the 4-7-8 technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. This activates your parasympathetic nervous system, reducing stress and anxiety instantly.', emoji: '🫁' },
    { id: 10, category: 'Mental Health', title: 'Digital Detox', content: 'Spend at least 1 hour daily without screens. Excessive phone use increases anxiety, disrupts sleep, and reduces real-world connections. Try reading, walking, or talking to family instead.', emoji: '📵' },
    { id: 11, category: 'Mental Health', title: 'Practice Gratitude', content: 'Write down 3 things you are grateful for every night. Studies show gratitude journaling improves mood, reduces depression, and enhances overall well-being within just 2 weeks.', emoji: '🙏' },
    { id: 12, category: 'Mental Health', title: 'Talk About Your Feelings', content: 'Don\'t suppress emotions. Talking to friends, family, or a therapist helps process feelings. Mental health is as important as physical health — seeking help is a sign of strength, not weakness.', emoji: '💬' },
    { id: 13, category: 'Sleep', title: 'Follow a Sleep Schedule', content: 'Go to bed and wake up at the same time every day, even on weekends. Consistent sleep schedules improve sleep quality and help you fall asleep faster. Aim for 7-8 hours.', emoji: '⏰' },
    { id: 14, category: 'Sleep', title: 'Create a Sleep-Friendly Room', content: 'Keep your bedroom dark, cool (18-22°C), and quiet. Avoid screens 1 hour before bed. The blue light from phones suppresses melatonin, making it harder to fall asleep.', emoji: '🌙' },
    { id: 15, category: 'Sleep', title: 'Avoid Late-Night Eating', content: 'Stop eating 2-3 hours before bedtime. Late meals cause acid reflux and disrupt sleep quality. If hungry, have a small handful of nuts or warm milk.', emoji: '🍽️' },
    { id: 16, category: 'Hygiene', title: 'Wash Hands Frequently', content: 'Wash hands with soap for at least 20 seconds — before eating, after using the bathroom, and after touching public surfaces. It prevents 80% of common infections.', emoji: '🧼' },
    { id: 17, category: 'Hygiene', title: 'Oral Health Matters', content: 'Brush twice daily for 2 minutes. Use fluoride toothpaste and floss once daily. Poor oral health is linked to heart disease, diabetes, and respiratory infections.', emoji: '🦷' },
    { id: 18, category: 'Hygiene', title: 'Skin Care Basics', content: 'Cleanse, moisturize, and apply sunscreen daily (even on cloudy days). SPF 30+ protects against skin cancer and premature aging. Drink water for naturally glowing skin.', emoji: '🧴' },
    { id: 19, category: 'First Aid', title: 'Burns - What to Do', content: 'Run cool (not cold) water over the burn for 10-20 minutes. Cover with a clean, non-fluffy cloth. Do NOT apply ice, butter, or toothpaste on burns. Seek medical help for severe burns.', emoji: '🔥' },
    { id: 20, category: 'First Aid', title: 'Choking Response', content: 'For adults: Stand behind the person, make a fist above the navel, and perform upward abdominal thrusts (Heimlich maneuver). For infants: Support face-down on your forearm and give 5 back blows.', emoji: '🫱' },
];

const categories = ['All', ...new Set(healthTips.map(t => t.category))];

export function renderHealthTips() {
    const app = document.getElementById('app');
    const savedTips = store.getSavedTips();
    let activeCategory = 'All';

    function render() {
        const filtered = activeCategory === 'All' ? healthTips : healthTips.filter(t => t.category === activeCategory);

        app.innerHTML = `
      <div class="app-layout">
        ${renderNavbar('/health-tips')}
        <main class="main-content">
          <div class="page-header">
            <h1>💡 Health Tips</h1>
            <p>Evidence-based health tips to improve your daily life</p>
          </div>

          <div class="tips-categories">
            ${categories.map(cat => `
              <button class="tip-category ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">${cat}</button>
            `).join('')}
          </div>

          <div id="tips-list">
            ${filtered.map(tip => `
              <div class="tip-card">
                <div style="display: flex; align-items: start; gap: var(--space-md);">
                  <span style="font-size: 1.5rem;">${tip.emoji}</span>
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <h3>${tip.title}</h3>
                      <span class="badge badge-info">${tip.category}</span>
                    </div>
                    <p style="margin-top: var(--space-sm);">${tip.content}</p>
                  </div>
                </div>
                <div class="tip-card-footer">
                  <button class="btn btn-ghost btn-sm bookmark-tip ${savedTips.includes(tip.id) ? 'bookmarked' : ''}" data-id="${tip.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="${savedTips.includes(tip.id) ? 'var(--accent-warning)' : 'none'}" stroke="${savedTips.includes(tip.id) ? 'var(--accent-warning)' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    ${savedTips.includes(tip.id) ? 'Saved' : 'Save'}
                  </button>
                  <button class="btn btn-ghost btn-sm share-tip" data-title="${tip.title}" data-content="${tip.content}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    Share
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </main>
      </div>
    `;

        initNavbar();
        attachEvents();
    }

    function attachEvents() {
        // Category filter
        document.querySelectorAll('.tip-category').forEach(btn => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.category;
                render();
            });
        });

        // Bookmark
        document.querySelectorAll('.bookmark-tip').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const isSaved = store.toggleSaveTip(id);
                showToast(isSaved ? 'Tip saved!' : 'Tip removed from saved', 'success');
                render();
            });
        });

        // Share
        document.querySelectorAll('.share-tip').forEach(btn => {
            btn.addEventListener('click', () => {
                const title = btn.dataset.title;
                const content = btn.dataset.content;
                if (navigator.share) {
                    navigator.share({ title: `Health Tip: ${title}`, text: content });
                } else {
                    navigator.clipboard.writeText(`💡 ${title}\n\n${content}\n\n— Pocket Doctor`);
                    showToast('Tip copied to clipboard!', 'success');
                }
            });
        });
    }

    render();
}
