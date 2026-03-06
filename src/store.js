// LocalStorage-based data store for Pocket Doctor
const STORE_PREFIX = 'pd_';

const store = {
    // Core get/set
    get(key) {
        try {
            const data = localStorage.getItem(STORE_PREFIX + key);
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    },

    set(key, value) {
        try {
            localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));
            return true;
        } catch { return false; }
    },

    remove(key) {
        localStorage.removeItem(STORE_PREFIX + key);
    },

    // --- User Profile ---
    getProfile() {
        return this.get('profile') || { name: '', age: '', bloodGroup: '', allergies: '', conditions: '', phone: '' };
    },
    setProfile(profile) { this.set('profile', profile); },

    // --- Gemini API Key ---
    getApiKey() { return this.get('gemini_key') || ''; },
    setApiKey(key) { this.set('gemini_key', key); },

    // --- Symptom History ---
    getSymptomHistory() { return this.get('symptom_history') || []; },
    addSymptomEntry(entry) {
        const hist = this.getSymptomHistory();
        hist.unshift({ ...entry, id: Date.now(), date: new Date().toISOString() });
        this.set('symptom_history', hist);
    },
    deleteSymptomEntry(id) {
        const hist = this.getSymptomHistory().filter(e => e.id !== id);
        this.set('symptom_history', hist);
    },

    // --- Medicines ---
    getMedicines() { return this.get('medicines') || []; },
    addMedicine(med) {
        const meds = this.getMedicines();
        meds.push({ ...med, id: Date.now(), createdAt: new Date().toISOString() });
        this.set('medicines', meds);
    },
    updateMedicine(id, updates) {
        const meds = this.getMedicines().map(m => m.id === id ? { ...m, ...updates } : m);
        this.set('medicines', meds);
    },
    deleteMedicine(id) {
        const meds = this.getMedicines().filter(m => m.id !== id);
        this.set('medicines', meds);
    },

    // --- Medicine Logs ---
    getMedicineLogs() { return this.get('medicine_logs') || []; },
    addMedicineLog(log) {
        const logs = this.getMedicineLogs();
        logs.unshift({ ...log, id: Date.now(), date: new Date().toISOString() });
        this.set('medicine_logs', logs);
    },

    // --- Appointments ---
    getAppointments() { return this.get('appointments') || []; },
    addAppointment(apt) {
        const apts = this.getAppointments();
        apts.push({ ...apt, id: Date.now(), createdAt: new Date().toISOString() });
        this.set('appointments', apts);
    },
    updateAppointment(id, updates) {
        const apts = this.getAppointments().map(a => a.id === id ? { ...a, ...updates } : a);
        this.set('appointments', apts);
    },
    deleteAppointment(id) {
        const apts = this.getAppointments().filter(a => a.id !== id);
        this.set('appointments', apts);
    },

    // --- Chat History (Ask Doctor) ---
    getChatHistory() { return this.get('chat_history') || []; },
    addChatMessage(msg) {
        const hist = this.getChatHistory();
        hist.push({ ...msg, id: Date.now(), timestamp: new Date().toISOString() });
        this.set('chat_history', hist);
    },
    clearChatHistory() { this.set('chat_history', []); },

    // --- Medical Reports ---
    getReports() { return this.get('reports') || []; },
    addReport(report) {
        const reps = this.getReports();
        reps.unshift({ ...report, id: Date.now(), uploadedAt: new Date().toISOString() });
        this.set('reports', reps);
    },
    deleteReport(id) {
        const reps = this.getReports().filter(r => r.id !== id);
        this.set('reports', reps);
    },

    // --- Emergency Contacts ---
    getEmergencyContacts() { return this.get('emergency_contacts') || []; },
    addEmergencyContact(contact) {
        const contacts = this.getEmergencyContacts();
        contacts.push({ ...contact, id: Date.now() });
        this.set('emergency_contacts', contacts);
    },
    deleteEmergencyContact(id) {
        const contacts = this.getEmergencyContacts().filter(c => c.id !== id);
        this.set('emergency_contacts', contacts);
    },

    // --- Saved Health Tips ---
    getSavedTips() { return this.get('saved_tips') || []; },
    toggleSaveTip(tipId) {
        let saved = this.getSavedTips();
        if (saved.includes(tipId)) {
            saved = saved.filter(id => id !== tipId);
        } else {
            saved.push(tipId);
        }
        this.set('saved_tips', saved);
        return saved.includes(tipId);
    },

    // --- Export/Import ---
    exportAll() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(STORE_PREFIX)) {
                data[key] = localStorage.getItem(key);
            }
        }
        return JSON.stringify(data, null, 2);
    },

    importAll(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(data).forEach(([key, value]) => {
                if (key.startsWith(STORE_PREFIX)) {
                    localStorage.setItem(key, value);
                }
            });
            return true;
        } catch { return false; }
    }
};

export default store;
