# 🌱 FarmSaarthi

**Validated Knowledge. Local Advice.**

FarmSaarthi is an open-source agricultural intelligence platform helping smallholder farmers access climate-resilient, context-aware guidance — built as a Digital Public Good for BRICS cooperation.

## 🔗 Links

- **Live Demo:** []
- **Demo Video:** []

## 🎯 The Problem

Small and marginal farmers across emerging economies lack access to data-driven agricultural guidance. They rely on district-level forecasts that don't fit their field, and institutions cannot easily share validated knowledge across borders.

FarmSaarthi addresses two gaps:
1. Farmers get advice that doesn't fit their field
2. Institutions cannot share what they learn across borders

## 💡 Our Approach

**Local data stays local. Validated knowledge moves. Farmers get advice they can use — and know when to seek a human.**

Three pillars:

- **Intelligence** — AI crop analysis + real weather data + local context
- **Cooperation** — Cross-border knowledge validation via Context Passport
- **Inclusion** — Voice-first, offline-capable, multi-channel access

## 🚀 Key Features

- **Real Weather Data** — Live forecasts from Open-Meteo based on your location
- **Crop Health Diagnostics** — Upload a photo, get a diagnosis with confidence score
- **Context Passport** — Cross-border assertion validation (India ↔ Brazil)
- **Safety Abstention** — System says "Insufficient Evidence" when unsure
- **Field Memory** — Timeline of observations, advisories, actions, and outcomes
- **Dark / Light / System Themes** — Full theme support
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Firebase Authentication** — Real login with email/password and Google

## 🛠️ Technology Stack

| Layer | Choice |
|---|---|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Weather API | Open-Meteo (no key required) |
| Authentication | Firebase Auth |
| Database | Firebase Firestore |
| Hosting | Netlify |

## ⚠️ Prototype Limitations

This is a 72-hour prototype. Please note:

- The AI diagnosis is **simulated** with demo data. It is not a validated diagnostic model.
- Weather data is **real** (Open-Meteo).
- The Context Passport logic is **demonstrative** — not a production protocol.
- This is **not** an official BRICS standard.
- No accuracy, yield, or impact claims are made.

## 🏃 Run Locally

```bash
git clone https://github.com/your-username/farmsaarthi.git
cd farmsaarthi
npm install
npm run dev
