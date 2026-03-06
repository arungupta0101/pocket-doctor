// Ask a Doctor - AI Chat page
import store from '../store.js';
import { callGemini, DOCTOR_SYSTEM_PROMPT } from '../gemini.js';
import { showToast } from '../components/toast.js';
import { getCurrentUser } from '../firebase.js';
import { renderNavbar, initNavbar } from '../components/navbar.js';

export function renderAskDoctor() {
  const app = document.getElementById('app');
  const chatHistory = store.getChatHistory();
  const user = getCurrentUser();
  const initials = user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  app.innerHTML = `
    <div class="app-layout">
      ${renderNavbar('/ask-doctor')}
      <main class="main-content" style="padding-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
          <div>
            <h1 style="font-size: 1.4rem; font-weight: 700;">🩺 Ask a Doctor</h1>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">Chat with Dr. AI — your medical assistant</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="clear-chat-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Clear Chat
          </button>
        </div>

        <div class="disclaimer-banner" style="font-size: 0.78rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>Dr. AI provides health information only, not medical diagnosis. Always consult a real doctor for medical issues.</span>
        </div>

        <div class="chat-container">
          <div class="chat-messages" id="chat-messages">
            ${chatHistory.length === 0 ? `
              <div class="chat-message assistant">
                <div class="chat-avatar">Dr</div>
                <div class="chat-bubble">
                  Hello! 👋 I'm Dr. AI, your medical assistant. I can help you with:
                  <br><br>
                  • General health questions<br>
                  • Understanding symptoms<br>
                  • Medication information<br>
                  • Diet & nutrition advice<br>
                  • First aid guidance<br>
                  <br>
                  How can I help you today?
                </div>
              </div>
            ` : chatHistory.map(msg => `
              <div class="chat-message ${msg.role}">
                <div class="chat-avatar">${msg.role === 'assistant' ? 'Dr' : initials}</div>
                <div class="chat-bubble">${formatMessage(msg.content)}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Type your health question..." />
            <button class="btn btn-primary" id="send-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  `;

  initNavbar();

  // Scroll to bottom
  const chatBox = document.getElementById('chat-messages');
  chatBox.scrollTop = chatBox.scrollHeight;

  // Send message
  const sendMessage = async () => {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    store.addChatMessage({ role: 'user', content: message });
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user';
    userDiv.innerHTML = `
      <div class="chat-avatar">${initials}</div>
      <div class="chat-bubble">${escapeHtml(message)}</div>
    `;
    chatBox.appendChild(userDiv);
    input.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message assistant';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="chat-avatar">Dr</div>
      <div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Disable input
    input.disabled = true;
    document.getElementById('send-btn').disabled = true;

    try {
      // Build context from recent chat history
      const recentHistory = store.getChatHistory().slice(-10);
      const contextPrompt = recentHistory.map(m => `${m.role === 'user' ? 'Patient' : 'Doctor'}: ${m.content}`).join('\n\n');
      const fullPrompt = contextPrompt ? `${contextPrompt}\n\nPatient: ${message}\n\nDoctor:` : `Patient: ${message}\n\nDoctor:`;

      const response = await callGemini(fullPrompt, DOCTOR_SYSTEM_PROMPT);

      // Remove typing indicator and add response
      document.getElementById('typing-indicator')?.remove();
      store.addChatMessage({ role: 'assistant', content: response });

      const assistantDiv = document.createElement('div');
      assistantDiv.className = 'chat-message assistant';
      assistantDiv.innerHTML = `
        <div class="chat-avatar">Dr</div>
        <div class="chat-bubble">${formatMessage(response)}</div>
      `;
      chatBox.appendChild(assistantDiv);
    } catch (err) {
      document.getElementById('typing-indicator')?.remove();
      const errorDiv = document.createElement('div');
      errorDiv.className = 'chat-message assistant';
      errorDiv.innerHTML = `
        <div class="chat-avatar">Dr</div>
        <div class="chat-bubble" style="color: var(--accent-danger);">❌ Error: ${err.message}</div>
      `;
      chatBox.appendChild(errorDiv);
      showToast(err.message, 'error');
    }

    input.disabled = false;
    document.getElementById('send-btn').disabled = false;
    input.focus();
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  document.getElementById('send-btn').addEventListener('click', sendMessage);
  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Clear chat
  document.getElementById('clear-chat-btn').addEventListener('click', () => {
    store.clearChatHistory();
    showToast('Chat cleared', 'info');
    renderAskDoctor();
  });
}

function formatMessage(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '• ');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
