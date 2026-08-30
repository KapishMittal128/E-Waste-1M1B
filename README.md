# EWaste Off — Responsible E-Waste Action & Recycler Locator

EWaste Off is a production-quality, mobile-first web application built to help citizens, households, and educational institutions identify, triage, and responsibly dispose of electronic waste. Focused on practical environmental intervention in Gwalior, Madhya Pradesh, the platform eliminates informal scrap dealer leakage and connects users directly with government-authorized recyclers.

Built by Kapish Mittal.

---

## Core Philosophy & Design

- Zero Authentication Friction: No login or signup required. All utilities, scans, and directory lookups are accessible instantly.
- High-Contrast Monochrome Aesthetic: Built using a stealth black and grey design system with glassmorphism, spotlight hover interactions, and animated segmented controls.
- Practical Action Over Generic Awareness: Every scan result maps directly to tangible local solutions, safety protocols, and verified regional facilities.

---

## Features

### 1. AI Vision Identification & Hazard Triage
- Live Camera Scanner: Accesses device cameras using the WebRTC API with dual-camera switching.
- Photo Upload: Analyzes uploaded images of electronic scrap from local files.
- Manual Search: Search for specific electronic devices, components, or brands.
- Instant Test Presets: Pre-configured test devices including smartphones, swollen lithium batteries, CRT monitors, laptops, and tangled cables.
- Material Breakdown: Displays estimated percentages of plastics, copper, aluminum, precious metals (gold, silver, palladium), and hazardous elements.
- Hazard Containment Warnings: Evaluates risk levels (low, medium, high, critical) and provides actionable safety handling steps (e.g. terminal insulation for swollen lithium batteries, lead isolation for CRT glass).
- Four-Tier Action Hierarchy: Guides users through a logical environmental hierarchy:
  1. Reuse First: Repurposing functional sub-components and hardware.
  2. Repair & Extend Life: Estimated repair costs and common component fixes in local Gwalior markets.
  3. Donate / Refurbish: Routing usable equipment to educational institutions.
  4. Authorized Recycling: Direct hand-off to compliant government-registered facilities.

### 2. Gwalior Authorized Recyclers Directory & Interactive Map
- Verified Facilities: Curated directory of MPPCB (Madhya Pradesh Pollution Control Board) authorized recyclers and CPCB (Central Pollution Control Board) registered Producer Responsibility Organizations (PROs) operating across Gwalior:
  - Karo Sambhav / Eco Recycling Ltd (Maharajpura Industrial Area)
  - Greenscape Eco Management MP Facility (Malanpur Industrial Belt)
  - Namo E-Waste Logistics & Collection Point (Lashkar)
  - Gwalior Municipal Corporation E-Waste Drop Center (Maharaj Bada)
  - Attero EPR Collection & Drop Partner (Thatipur)
  - Greeniva MP Regional Collection Unit (Morar)
- Geodesic Distance Engine: Real-time kilometer distance calculations based on the user's selected Gwalior locality.
- Interactive Dark Map: CartoDB Dark Matter tile layer powered by Leaflet with custom facility markers and popups.
- Direct Telephony Dialer: One-click phone connectivity with pre-call verification checklists.
- WhatsApp Inquiry Generator: Generates structured, pre-formatted messages detailing item condition, estimated weight, and pickup requirements.
- Recycler Verification Dossier: Transparency view displaying regulatory registration numbers, verification sources, and accepted item lists.
- Facility Inaccuracy Reporting: Feedback modal allowing users to report closed centers or out-of-date information.

### 3. School & Campus E-Waste Bin Program
- Institutional Bin Request Workflow: Allows local Gwalior schools, colleges, and coaching centers to request tamper-resistant 50kg steel collection receptacles.
- Formal Agreement & MOU Generator: Automatically drafts a complete Memorandum of Understanding and logistics request formatted for school administration and authorized recyclers.
- Destruction Certificate Tracking: Integration for obtaining formal Form-6 Green Destruction Certificates upon bulk clearance.

### 4. Safety, Health & Regulatory Trust Center
- Regulatory Verification Framework: Detailed breakdown of the four authorization tiers (MPPCB, CPCB EPR, Municipal GMC, Verified Collection Hubs).
- Formal vs. Informal Comparison: Factual analysis contrasting certified closed-loop shredding against hazardous open-air burning, crude acid leaching, and mercury discharge.
- Hazardous Materials Reference: Safety guide detailing risks associated with leaded funnel glass, lithium thermal runaway, brominated flame retardants, and cadmium.

---

## Technical Stack

- Frontend Framework: React 18, TypeScript, Vite
- Styling: Tailwind CSS, custom design tokens, dark glassmorphism
- UI & Motion: Framer Motion, Lucide Icons, Canvas Confetti
- Mapping & Geolocation: Leaflet, React-Leaflet, CartoDB Dark Matter Tiles
- Hardware APIs: HTML5 WebRTC Camera API, HTML5 Canvas 2D API
- Persistence: HTML5 LocalStorage API for local state retention without external database overhead

---

## Project Structure

```
Ewaste/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/            # Header, Bottom Navigation Dock
│   │   ├── map/               # Leaflet Dark Map Component
│   │   ├── modals/            # Camera, Pre-call, Share, Dossier, Hazard modals
│   │   ├── recyclers/         # Recycler Card, Recycler Locator, Filters
│   │   ├── scanner/           # Hero Scanner, Camera Modal, Result Card
│   │   ├── school/            # Campus Collection Bin Request & MOU Generator
│   │   ├── trust/             # MPPCB Regulatory & Toxic Safety Guide
│   │   └── ui/                # Badge, Button, Card, Dialog, Tabs
│   ├── data/
│   │   ├── recyclers.ts       # Gwalior recycler registry & localities
│   │   └── sampleItems.ts     # Electronic material signatures & triage data
│   ├── services/
│   │   ├── aiVision.ts        # Material taxonomy & triage engine
│   │   └── storage.ts         # LocalStorage persistence wrapper
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces & domain models
│   ├── App.tsx                # Main Application Shell & View Routing
│   ├── index.css              # Global styles, laser animation & theme overrides
│   └── main.tsx               # React DOM root mounting
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Local Development & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KapishMittal128/E-Waste-1M1B.git
cd E-Waste-1M1B
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

---

## License

This project is created for environmental education and direct e-waste intervention in Gwalior, Madhya Pradesh.
