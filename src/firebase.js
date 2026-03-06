// Firebase configuration and auth functions
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyChXn-C44yQ5ky1ggkotOBjR-axcMhV3CI",
    authDomain: "pocket-doctor-3680d.firebaseapp.com",
    projectId: "pocket-doctor-3680d",
    storageBucket: "pocket-doctor-3680d.firebasestorage.app",
    messagingSenderId: "394163332470",
    appId: "1:394163332470:web:838511b2cbbbf5410c4657",
    measurementId: "G-QC44068RH9"
};

let app;
let auth;
let initialized = false;

function ensureInit() {
    if (!initialized) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        initialized = true;
    }
}

// Google sign-in
export async function signInWithGoogle() {
    ensureInit();
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Email/password sign-in
export async function signInWithEmail(email, password) {
    ensureInit();
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Email/password sign-up
export async function signUpWithEmail(email, password, displayName) {
    ensureInit();
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
            await updateProfile(result.user, { displayName });
        }
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign out
export async function logOut() {
    ensureInit();
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get current user
export function getCurrentUser() {
    ensureInit();
    return auth.currentUser;
}

// Listen to auth state changes
export function onAuthChange(callback) {
    ensureInit();
    return onAuthStateChanged(auth, callback);
}
