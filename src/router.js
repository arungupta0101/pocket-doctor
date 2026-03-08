// Simple hash-based SPA router
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.authGuard = null;
        this.onRouteChange = null;
        window.addEventListener('hashchange', () => this.resolve());
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
        return this;
    }

    setAuthGuard(guardFn) {
        this.authGuard = guardFn;
    }

    navigate(path) {
        window.location.hash = path;
    }

    getCurrentRoute() {
        return window.location.hash.slice(1) || '/';
    }

    async resolve() {
        const path = this.getCurrentRoute();
        const protectedRoutes = ['/', '/symptom-checker', '/emergency-sos', '/health-tips',
            '/medicine-reminder', '/book-appointment', '/ask-doctor', '/medical-reports',
            '/nearby-clinics', '/profile', '/support',
            '/bmi-calculator', '/health-log', '/water-tracker', '/health-goals',
            '/mood-tracker', '/emergency-contacts', '/first-aid'];

        // Auth guard
        if (this.authGuard && protectedRoutes.includes(path)) {
            const isAuth = await this.authGuard();
            if (!isAuth) {
                this.navigate('/login');
                return;
            }
        }

        // If logged in and on login page, redirect to dashboard
        if (path === '/login' && this.authGuard) {
            const isAuth = await this.authGuard();
            if (isAuth) {
                this.navigate('/');
                return;
            }
        }

        const handler = this.routes[path];
        if (handler) {
            this.currentRoute = path;
            if (this.onRouteChange) this.onRouteChange(path);
            await handler();
        } else {
            this.navigate('/');
        }
    }

    start() {
        if (!window.location.hash) {
            window.location.hash = '/';
        }
        this.resolve();
    }
}

export default new Router();
