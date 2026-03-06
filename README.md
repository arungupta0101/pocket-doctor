# 🩺 Pocket Doctor

Pocket Doctor is a local-first, privacy-focused health web application that provides AI-powered medical insights, appointment booking, medical report management, and a clinic finder. Built with modern web technologies, it ensures user data remains secure and private by prioritizing local storage.

## ✨ Features

- **🤖 AI Symptom Checker:** Describe your symptoms and get instant, AI-driven health insights, possible conditions, and home remedies. Includes an "Explain in Simple Words" feature for easy understanding.
- **💬 Ask a Doctor (AI Chat):** Have a conversation with "Dr. AI", a friendly medical assistant ready to answer your health queries.
- **🏥 Nearby Clinics Finder:** Interactive map to discover hospitals, clinics, and pharmacies near your location using OpenStreetMap.
- **📅 Appointment Booking:** Schedule and manage your upcoming and past medical appointments effortlessly.
- **📄 Medical Reports Manager:** Securely upload, view, and organize your medical documents (PDFs and images) locally.
- **🔒 Privacy First:** All your health data and reports are stored locally on your device using `localStorage`. No sensitive health data is sent to external databases.
- **👤 Secure Authentication:** Powered by Firebase Authentication to keep your account safe.

## 🛠️ Technologies Used

- **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Custom Design System)
- **Backend/API:** Node.js, Express.js (for proxying AI requests securely)
- **AI Integration:** Google Gemini API (`@google/genai` SDK)
- **Mapping:** Leaflet.js, OpenStreetMap, Overpass API
- **Authentication:** Firebase Auth
- **Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A [Google Gemini API Key](https://aistudio.google.com/apikey).
- A [Firebase Project](https://console.firebase.google.com/) configured for Web Authentication.

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arungupta0101/pocket-doctor.git
   cd pocket-doctor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will concurrently start the Vite frontend and the Express backend server.

5. **Open in Browser:**
   Navigate to `http://localhost:5173` in your web browser.

## ⚠️ Disclaimer
**Pocket Doctor is for informational purposes only.** It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
