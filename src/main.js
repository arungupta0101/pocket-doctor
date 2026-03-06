// Main app entry point
import router from './router.js';
import { onAuthChange, getCurrentUser } from './firebase.js';

// Page imports
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderSymptomChecker } from './pages/symptom-checker.js';
import { renderEmergencySOS } from './pages/emergency-sos.js';
import { renderHealthTips } from './pages/health-tips.js';
import { renderMedicineReminder } from './pages/medicine-reminder.js';
import { renderBookAppointment } from './pages/book-appointment.js';
import { renderAskDoctor } from './pages/ask-doctor.js';
import { renderMedicalReports } from './pages/medical-reports.js';
import { renderNearbyClinics } from './pages/nearby-clinics.js';
import { renderProfile } from './pages/profile.js';

// Register routes
router
    .addRoute('/login', renderLogin)
    .addRoute('/', renderDashboard)
    .addRoute('/symptom-checker', renderSymptomChecker)
    .addRoute('/emergency-sos', renderEmergencySOS)
    .addRoute('/health-tips', renderHealthTips)
    .addRoute('/medicine-reminder', renderMedicineReminder)
    .addRoute('/book-appointment', renderBookAppointment)
    .addRoute('/ask-doctor', renderAskDoctor)
    .addRoute('/medical-reports', renderMedicalReports)
    .addRoute('/nearby-clinics', renderNearbyClinics)
    .addRoute('/profile', renderProfile);

// Auth guard
router.setAuthGuard(() => {
    return new Promise((resolve) => {
        const user = getCurrentUser();
        if (user !== undefined && user !== null) {
            resolve(true);
            return;
        }
        // Wait for auth state to initialize
        const unsubscribe = onAuthChange((user) => {
            unsubscribe();
            resolve(!!user);
        });
    });
});

// Initialize app
function init() {
    // Listen for auth state changes
    onAuthChange((user) => {
        const currentRoute = router.getCurrentRoute();
        if (user) {
            // User is signed in
            if (currentRoute === '/login') {
                router.navigate('/');
            } else {
                router.resolve();
            }
        } else {
            // User is signed out
            router.navigate('/login');
        }
    });
}

// Start
init();
