# FarmSaarthi (BRICS Agri-Intelligence Platform)

> **Validated Knowledge. Local Advice.**

FarmSaarthi is a production-quality, open-source React web application built for smallholder farmers, agronomists, and extension officers across BRICS countries. It delivers real-time weather forecasts, AI-assisted crop health diagnostics, cross-border knowledge validation ("Context Passport"), and an immutable field memory log.

---

## 🌟 Features & Capability Matrix

1. **Authentication (Firebase Auth)**:
   - Email/password Sign In & Sign Up with automated Firestore user profile provisioning (`users` collection).
   - One-click Google Sign-In support.
   - Protected Routing wrapping all inner pages with auto-redirection to `/login`.

2. **Theme System (Light / Dark / System)**:
   - Full 3-way Theme Switcher (`Sun`, `Moon`, `Monitor`) integrated into the header.
   - Detects `window.matchMedia('(prefers-color-scheme: dark)')` when set to `system`.
   - Persists user choice in `localStorage`.
   - Smooth 200ms transitions adapting all cards, text, inputs, and borders.

3. **Live Weather Engine (Open-Meteo API)**:
   - Fetches live hourly & 7-day meteorological data without API keys.
   - "Use My Location" real GPS geolocation flow with fallback to Dharwad, Karnataka (`15.3647, 75.124`).
   - Hourly temperature and relative humidity progression graph powered by **Recharts**.

4. **Crop Health Vision Diagnostics**:
   - Working drag-and-drop file upload, file validation (JPG/PNG/WebP, <10MB), and mobile camera capture (`capture="environment"`).
   - Simulated AI vision diagnostic engine returning confidence score (with progress bar) and cited evidence list (ICAR, Google AMED API).
   - "Switch to Low Confidence Scenario" toggle demonstrating fallback handling ("Insufficient Evidence" state & "Contact Expert" toast notification).
   - Automated save of high-confidence diagnoses to Firestore `fieldMemory` collection.

5. **Context Passport (Cross-Border Knowledge Validation)**:
   - Compares agronomic assertions from source countries (e.g. India) with target field conditions (e.g. Brazil).
   - Sequential checkmark matching animation across crop type, growth stage, climate, and geography.
   - Interactive 3-outcome switcher (`ACCEPT`, `LOCAL REVIEW REQUIRED`, `REJECT`) for interactive demonstration.

6. **Field Memory Log**:
   - Chronological vertical timeline with distinct iconography (`Eye`, `MessageSquare`, `CheckCircle`, `TrendingUp`).
   - Real-time fetching and saving to Firestore `fieldMemory` collection.
   - Modal form for creating new observation, advisory, action, or outcome records.

7. **Responsive iOS-Style UI/UX**:
   - Desktop (>1024px): Fixed left sidebar with icons and text labels.
   - Tablet (768px - 1024px): Collapsible header drawer menu.
   - Mobile (<768px): iOS bottom tab bar with touch targets ≥ 44px.
   - Glassmorphic backdrop blur cards, modern typography (Inter), curated deep green, sky blue, and amber color palettes.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18.0.0+
- npm or pnpm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/farmsaarthi/farmsaarthi-brics.git
cd farmsaarthi-brics

# Install dependencies
npm install

# Run dev server
npm run dev
```

---

## 🔑 Firebase Configuration (`src/firebase.js`)

Replace the placeholder values in `src/firebase.js` with your active Firebase project configuration from the [Firebase Console](https://console.firebase.google.com/):

```js
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "farmsaarthi-demo.firebaseapp.com",
  projectId: "farmsaarthi-demo",
  storageBucket: "farmsaarthi-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

> **Note**: If placeholder keys are detected, FarmSaarthi automatically falls back to an offline Demo Mode session so you can test all UI flows instantly.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 5, TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS custom properties, Glassmorphism
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM v6
- **Auth & DB**: Firebase Authentication & Cloud Firestore
- **Weather API**: Open-Meteo REST API

---

## ⚠️ Prototype Limitations & Disclaimer

1. **Simulated AI Diagnosis**: Crop disease diagnostics are simulated for prototype demonstration. Cited references include ICAR Geoportal & Google AMED API.
2. **Weather Data**: Weather forecasts use real live Open-Meteo APIs.
3. **Context Passport**: Demonstrative governance framework for cross-border knowledge sharing.
4. **Official Status**: FarmSaarthi is a research prototype and not an officially endorsed BRICS intergovernmental standard.
5. **No Guarantees**: No claims are made regarding yield accuracy, financial impact, or agronomic outcomes.
