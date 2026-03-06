// Login page
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../firebase.js';
import { showToast } from '../components/toast.js';
import router from '../router.js';

export function renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
    <div class="login-page">
      <div class="login-bg"></div>
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h1>Pocket Doctor</h1>
          <p>Your AI Health Companion</p>
        </div>

        <div class="login-form">
          <button class="btn-google" id="google-signin">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div class="login-divider"><span>or</span></div>

          <div id="login-form-fields">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" placeholder="Enter your email" />
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" placeholder="Enter your password" />
            </div>
            <div class="form-group" id="name-field" style="display:none;">
              <label for="login-name">Full Name</label>
              <input type="text" id="login-name" placeholder="Enter your full name" />
            </div>
            <button class="btn btn-primary btn-lg" id="auth-btn" style="width:100%;">Sign In</button>
          </div>

          <div class="login-toggle">
            <span id="toggle-text">Don't have an account?</span>
            <a id="toggle-auth"> Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  `;

    let isSignUp = false;

    // Google sign-in
    document.getElementById('google-signin').addEventListener('click', async () => {
        const btn = document.getElementById('google-signin');
        btn.disabled = true;
        btn.textContent = 'Signing in...';
        const result = await signInWithGoogle();
        if (result.success) {
            showToast('Welcome to Pocket Doctor! 🏥', 'success');
            router.navigate('/');
        } else {
            showToast(result.error, 'error');
            btn.disabled = false;
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Continue with Google`;
        }
    });

    // Email auth
    document.getElementById('auth-btn').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const name = document.getElementById('login-name')?.value?.trim();

        if (!email || !password) {
            showToast('Please enter email and password', 'warning');
            return;
        }

        const btn = document.getElementById('auth-btn');
        btn.disabled = true;
        btn.textContent = isSignUp ? 'Creating account...' : 'Signing in...';

        let result;
        if (isSignUp) {
            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'warning');
                btn.disabled = false;
                btn.textContent = 'Sign Up';
                return;
            }
            result = await signUpWithEmail(email, password, name);
        } else {
            result = await signInWithEmail(email, password);
        }

        if (result.success) {
            showToast(isSignUp ? 'Account created successfully! 🎉' : 'Welcome back! 🏥', 'success');
            router.navigate('/');
        } else {
            showToast(result.error, 'error');
            btn.disabled = false;
            btn.textContent = isSignUp ? 'Sign Up' : 'Sign In';
        }
    });

    // Toggle sign-in/sign-up
    document.getElementById('toggle-auth').addEventListener('click', () => {
        isSignUp = !isSignUp;
        document.getElementById('name-field').style.display = isSignUp ? 'flex' : 'none';
        document.getElementById('auth-btn').textContent = isSignUp ? 'Sign Up' : 'Sign In';
        document.getElementById('toggle-text').textContent = isSignUp ? 'Already have an account?' : "Don't have an account?";
        document.getElementById('toggle-auth').textContent = isSignUp ? ' Sign In' : ' Sign Up';
    });

    // Enter key
    document.querySelectorAll('#login-form-fields input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('auth-btn').click();
        });
    });
}
