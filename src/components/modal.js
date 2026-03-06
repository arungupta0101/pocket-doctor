// Reusable modal component

export function showModal({ title, content, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', showCancel = true }) {
    // Remove existing modals
    document.querySelectorAll('.modal-overlay').forEach(m => m.remove());

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>${title}</h2>
        <button class="btn btn-icon btn-ghost modal-close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">${content}</div>
      <div class="modal-footer">
        ${showCancel ? `<button class="btn btn-secondary modal-cancel-btn">${cancelText}</button>` : ''}
        <button class="btn btn-primary modal-confirm-btn">${confirmText}</button>
      </div>
    </div>
  `;

    const close = () => {
        overlay.style.animation = 'fade-in 0.2s ease reverse';
        setTimeout(() => overlay.remove(), 200);
    };

    overlay.querySelector('.modal-close-btn').addEventListener('click', close);
    if (showCancel) overlay.querySelector('.modal-cancel-btn').addEventListener('click', close);
    overlay.querySelector('.modal-confirm-btn').addEventListener('click', () => {
        if (onConfirm) onConfirm(overlay);
        close();
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    document.body.appendChild(overlay);
    return { close, overlay };
}
