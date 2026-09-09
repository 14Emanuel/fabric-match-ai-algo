# FabricMatch AI 👗✨

> **Garment & Fabric Preference Matching Engine**  
> Eliminating online shopping detective work by evaluating real textile specifications, daylight opacity ratings, lining coverage, sensory tolerances, and mobility dimensions against personal shopper profiles.

---

## 🌟 Overview

Online fashion shopping is plagued by high return rates because critical garment details are routinely obscured or omitted by fast-fashion retailers:
- **Missing Rear & Lining Views**: Photos rarely show the back of the dress or whether the garment is actually lined.
- **Sheerness / Opacity Uncertainty**: Shoppers cannot tell if fabric will be completely sheer in natural sunlight without wearing an extra slip.
- **Unreliable Fabric Compositions**: Blends with high synthetic ratios cause excessive sweating, static cling, or sensory irritation.
- **Mobility & Stride Constraints**: Tight pencil or unyielding cuts restrict walking and sitting.

**FabricMatch AI** acts as an algorithmic personal shopper that computes an instant match score (0–100%) and answers the 5 essential garment questions before a customer checks out:
1. **Daylight Opacity**: Is the garment sheer under outdoor sunlight?
2. **Lining & Coverage**: Is it fully lined, bodice-only, or completely unlined?
3. **Fiber & Breathability**: Natural vs. synthetic ratios, fabric weight in GSM, and thermal regulation.
4. **Multi-Angle Verification**: Authentic front, rear (zipper/backline), and macro textile close-ups.
5. **Mobility & Fit Freedom**: Ease of sitting, walking stride, and functional pocket availability.

---

## 🚀 Key Features

- **⚡ 3-Second Match Fit Simulation**: Computes personalized compatibility scores in milliseconds across multiple distinct shopper profiles (e.g., Natural Fibers Purist, Modest & Opaque Dresser, High-Mobility Commuter).
- **☀️ Daylight Sheerness Simulator**: Interactive visual slider testing fabric light transmittance from indoor ambient lighting to direct midday sun.
- **📸 360° Multi-Angle Textile Inspector**: Verified photography showcasing the exact same garment from front silhouette, rear closure/backline, and close-up fabric weave.
- **🔬 Granular Textile Spec Engine**:
  - Fiber composition breakdown (Cotton, Linen, Silk, Viscose, Polyester, Spandex, etc.)
  - Fabric weight classification (Lightweight <120 GSM, Midweight 120–220 GSM, Heavyweight >220 GSM)
  - Weave taxonomy (Poplin, Batiste, Jacquard, Chiffon, Linen Slub, etc.)
  - Stretch level (None, Mechanical, 2-Way, 4-Way)
  - Care requirements & wrinkle resistance ratings
- **🔍 Custom Garment URL & Text Scanner**: Paste any product page URL or fabric description to extract textile specs on the fly.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Motion (animations), Lucide React (icons)
- **Backend**: Express.js server (`server.ts`) with custom Vite development middleware and health checks
- **Build System**: Vite 6, esbuild CommonJS bundle (`dist/server.cjs`), TypeScript type checking (`tsc --noEmit`)
- **Version Control**: Atomic, granular Git history following the Conventional Commits specification

---

## 📁 Repository Structure

```
├── .env.example              # Environment variable declaration template
├── .gitignore                # Ignored build artifacts and dependencies
├── index.html                # Main HTML entry point
├── metadata.json             # Applet metadata and capabilities
├── package.json              # Project dependencies and lifecycle scripts
├── server.ts                 # Full-stack Express server with Vite middleware
├── tsconfig.json             # TypeScript compiler configuration
├── vite.config.ts            # Vite build configuration and Tailwind plugin
├── public/                   # Static assets and icons
└── src/
    ├── App.tsx               # Primary dashboard and interactive views
    ├── index.css             # Tailwind CSS directives
    ├── main.tsx              # React DOM mounting entry point
    ├── types.ts              # TypeScript interfaces for garments & personas
    ├── components/
    │   ├── Header.tsx                # App navigation & brand badges
    │   ├── PersonaSelector.tsx       # Shopper persona switcher & filters
    │   ├── GarmentCard.tsx           # Garment comparison card with match badges
    │   ├── FabricInspectorModal.tsx  # Deep fabric inspection & daylight test modal
    │   └── AlgorithmExplainer.tsx    # Transparent explanation of scoring logic
    ├── data/
    │   ├── sampleGarments.ts         # Verified garment catalog with multi-angle photography
    │   └── samplePersonas.ts         # Shopper preference profiles
    └── utils/
        └── matchingEngine.ts         # Scoring algorithm & compatibility evaluator
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm or yarn

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd fabricmatch-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

4. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

---

## 🧪 Verification & Quality Control

- Run type checking and linter:
  ```bash
  npm run lint
  ```
- Run full application build:
  ```bash
  npm run build
  ```

---

## 📄 License

MIT License. Open source and built for transparent, sustainable fashion shopping.
