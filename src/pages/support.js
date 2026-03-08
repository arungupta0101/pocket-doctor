import { renderNavbar, initNavbar } from '../components/navbar.js';

export function renderSupport() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <style>
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(11,148,136,0.3); }
        50%       { box-shadow: 0 0 36px rgba(11,148,136,0.6); }
      }
      .support-page-wrap {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }
      .support-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: linear-gradient(160deg, #f0fdfa 0%, #ecfeff 100%);
      }
      .support-inner {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        overflow: hidden;
      }
      .support-container {
        width: 100%;
        max-width: 820px;
        background: white;
        border-radius: 28px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.09);
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
      }
      /* Left panel */
      .support-left {
        background: linear-gradient(155deg, #0b4f4a 0%, #0b9488 70%, #14b8a6 100%);
        padding: 32px 28px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .support-left::before {
        content: '';
        position: absolute;
        top: -60px; left: -60px;
        width: 200px; height: 200px;
        background: rgba(255,255,255,0.06);
        border-radius: 50%;
      }
      .support-left::after {
        content: '';
        position: absolute;
        bottom: -80px; right: -40px;
        width: 220px; height: 220px;
        background: rgba(255,255,255,0.05);
        border-radius: 50%;
      }
      .support-heart {
        width: 64px; height: 64px;
        background: rgba(255,255,255,0.18);
        backdrop-filter: blur(8px);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        animation: pulse-glow 3s ease-in-out infinite;
        position: relative;
        z-index: 2;
      }
      .support-left h1 {
        font-size: 1.6rem;
        font-weight: 900;
        margin: 0 0 10px;
        line-height: 1.2;
        position: relative; z-index: 2;
      }
      .support-left p {
        font-size: 0.9rem;
        opacity: 0.88;
        line-height: 1.6;
        margin: 0;
        position: relative; z-index: 2;
        max-width: 260px;
      }
      .badge-strip {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 24px;
        width: 100%;
        position: relative; z-index: 2;
      }
      .badge-item {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(255,255,255,0.14);
        backdrop-filter: blur(6px);
        border-radius: 12px;
        padding: 8px 14px;
        font-size: 0.88rem;
        font-weight: 600;
      }
      /* Right panel */
      .support-right {
        padding: 28px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 18px;
      }
      .support-right h2 {
        font-size: 1.1rem;
        color: #111827;
        font-weight: 800;
        margin: 0;
        text-align: center;
      }
      .support-right p {
        font-size: 0.85rem;
        color: #6b7280;
        margin: -10px 0 0;
        text-align: center;
      }
      .qr-box {
        position: relative;
        background: #f9fafb;
        border: 1.5px dashed #a7f3d0;
        border-radius: 18px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      .qr-c { position: absolute; width: 18px; height: 18px; border-color: #0b9488; border-style: solid; }
      .pay-icons-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
      }
      .pay-icon-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: default;
        transition: transform 0.2s;
      }
      .pay-icon-wrap:hover { transform: translateY(-3px); }
      .pay-icon-wrap img {
        width: 52px;
        height: 52px;
        object-fit: contain;
        border-radius: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.10);
        background: white;
        padding: 6px;
      }
      .pay-icon-wrap span {
        font-size: 0.72rem;
        font-weight: 600;
        color: #374151;
      }
      .btn-support {
        width: 100%;
        padding: 13px;
        background: linear-gradient(135deg, #0b9488, #14b8a6);
        color: white;
        font-weight: 700;
        font-size: 0.97rem;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        letter-spacing: 0.3px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 16px rgba(11,148,136,0.32);
      }
      .btn-support:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(11,148,136,0.42);
      }
      @media (max-width: 620px) {
        .support-container { grid-template-columns: 1fr; }
        .support-left { padding: 24px 20px; }
        .badge-strip { display: none; }
      }
    </style>

    <div class="app-layout support-page-wrap">
      ${renderNavbar('/support')}
      <main class="support-main">
        <div class="support-inner">
          <div class="support-container">

            <!-- LEFT: Info -->
            <div class="support-left">
              <div class="support-heart">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <h1>Support the<br/>Developer ☕</h1>
              <p>Pocket Doctor is completely free and privacy‑first. Your contribution keeps it alive and ad‑free!</p>

              <div class="badge-strip">
                <div class="badge-item">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2v2h-2zm0-8h2v6h-2z"/></svg>
                  100% Ad-Free
                </div>
                <div class="badge-item">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 1L3 5v6a13 13 0 0 0 9 12 13 13 0 0 0 9-12V5z"/></svg>
                  Privacy-First Health AI
                </div>
                <div class="badge-item">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                  Open Source & Free
                </div>
              </div>
            </div>

            <!-- RIGHT: QR + Pay -->
            <div class="support-right">
              <h2>Scan & Pay with UPI 📲</h2>
              <p>Open any UPI app and scan to pay any amount you like!</p>

              <!-- QR -->
              <div class="qr-box">
                <div class="qr-c" style="top:10px;left:10px;border-top-width:2.5px;border-left-width:2.5px;border-right:none;border-bottom:none;border-radius:5px 0 0 0;"></div>
                <div class="qr-c" style="top:10px;right:10px;border-top-width:2.5px;border-right-width:2.5px;border-left:none;border-bottom:none;border-radius:0 5px 0 0;"></div>
                <div class="qr-c" style="bottom:10px;left:10px;border-bottom-width:2.5px;border-left-width:2.5px;border-right:none;border-top:none;border-radius:0 0 0 5px;"></div>
                <div class="qr-c" style="bottom:10px;right:10px;border-bottom-width:2.5px;border-right-width:2.5px;border-left:none;border-top:none;border-radius:0 0 5px 0;"></div>
                <img src="/qr.jpg" alt="UPI QR Code"
                  style="width:180px; height:180px; object-fit:contain; border-radius:10px; display:block;"
                  onerror="this.style.background='#f3f4f6'; this.alt='Add qr.jpg to public folder';"
                />
                <span style="font-size:0.8rem; font-weight:700; color:#0b9488; letter-spacing:0.8px; text-transform:uppercase;">Scan To Pay</span>
              </div>

              <!-- Payment App Icons from online -->
              <div>
                <p style="font-size:0.78rem; color:#9ca3af; text-align:center; margin:0 0 10px;">Accepted UPI Apps</p>
                <div class="pay-icons-row">
                  <div class="pay-icon-wrap">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png"
                      alt="Google Pay"
                      onerror="this.src='https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlepay.svg';"
                    />
                    <span>GPay</span>
                  </div>
                  <div class="pay-icon-wrap">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png"
                      alt="PhonePe"
                      onerror="this.onerror=null; this.src='https://via.placeholder.com/52?text=Pe';"
                    />
                    <span>PhonePe</span>
                  </div>
                  <div class="pay-icon-wrap">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png"
                      alt="Paytm"
                      onerror="this.onerror=null; this.src='https://via.placeholder.com/52?text=Ptm';"
                    />
                    <span>Paytm</span>
                  </div>
                  <div class="pay-icon-wrap">
                    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/bhim-upi-icon.png"
                      alt="BHIM UPI"
                      style="width:52px;height:52px;object-fit:contain;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,0.10);background:white;padding:4px;"
                      onerror="this.onerror=null; this.src='https://via.placeholder.com/52?text=UPI';"
                    />
                    <span>BHIM UPI</span>
                  </div>
                  <div class="pay-icon-wrap">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f7/Navi_New_Logo.png"
                      alt="Navi"
                      style="width:52px;height:52px;object-fit:contain;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,0.10);background:white;padding:4px;"
                      onerror="this.onerror=null; this.style.background='#1a1a2e'; this.style.content='N'; this.src='https://via.placeholder.com/52/1a1a2e/ffffff?text=N';"
                    />
                    <span>Navi</span>
                  </div>
                </div>
              </div>

              <!-- CTA -->
              <button class="btn-support">
                ❤️ &nbsp; Support Now
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  `;

  initNavbar();
}
