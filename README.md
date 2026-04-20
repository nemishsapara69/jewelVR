# ✦ JewelVR — Virtual Jewelry Try-On

> Try on gold earrings and necklaces live on your webcam. AR-powered, open-source, no data uploaded.

![JewelVR Demo](./public/favicon.svg)

---

## 🚀 What It Does

JewelVR lets anyone try on gold jewelry virtually — like Tanishq's in-store AR mirror, but free and in-browser.

| Feature | Detail |
|---|---|
| 📷 Live Webcam | Real-time face + pose detection |
| 🖼️ Photo Upload | Try on jewelry in a static selfie |
| 💍 Earrings | Auto-positioned at ear landmarks, rotates with head |
| 📿 Necklaces | Auto-positioned at shoulder/neck midpoint |
| 📸 Screenshot | Download your look as a PNG |
| 🔒 Privacy | 100% in-browser, no data ever leaves your device |

---

## 🛠️ Tech Stack

- **React 18 + Vite** — blazing-fast dev experience
- **MediaPipe Tasks Vision** (`@mediapipe/tasks-vision`) — face + pose landmarks, runs on GPU in-browser via WASM
- **HTML5 Canvas** — 2D PNG ornament overlays with rotation & smoothing
- **Vanilla CSS** — luxury dark design system, glassmorphism, gold accents

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- A modern browser (Chrome recommended for WebGL/GPU)

### Install & Run
```bash
git clone https://github.com/nemishsapara69/jewelVR.git
cd jewelVR
npm install
npm run dev
```

Open **http://localhost:5173** in Chrome.

> ⚠️ **Camera permission required.** Allow camera access when prompted.

---

## 🖼️ Adding Your Jewelry Images

When you have the real ornament images, replace the placeholder files in:

```
public/ornaments/
├── earrings/
│   ├── gold_jhumka.png     ← replace with real image
│   ├── gold_drop.png       ← replace with real image
│   └── diamond_stud.png    ← replace with real image
└── necklaces/
    ├── gold_choker.png      ← replace with real image
    ├── pearl_strand.png     ← replace with real image
    └── layered_gold.png     ← replace with real image
```

**Image guidelines:**
- Format: **PNG with transparent background**
- Size: ~300×300px for earrings, ~600×300px for necklaces
- The ornament should be centered with natural padding on all sides

---

## 📐 How Positioning Works

| Ornament Type | Detection | Landmarks Used |
|---|---|---|
| Earrings | `FaceLandmarker` | #234 (left ear), #454 (right ear), #33/#263 (eyes for rotation) |
| Necklaces | `PoseLandmarker` | #11 (left shoulder), #12 (right shoulder) |

Landmarks are smoothed using **exponential moving average** (α=0.4) to prevent jitter.

---

## 🗂️ Project Structure

```
JewelVR/
├── public/ornaments/          # Jewelry PNG assets
├── src/
│   ├── components/
│   │   ├── ARCanvas.jsx       # Detection loop + canvas overlay
│   │   ├── CameraView.jsx     # Webcam / upload mode
│   │   ├── ControlBar.jsx     # Mode, flip, screenshot
│   │   ├── LoadingOverlay.jsx # WASM model loading spinner
│   │   └── OrnamentSelector.jsx # Jewelry picker sidebar
│   ├── hooks/
│   │   ├── useFaceDetection.js # MediaPipe FaceLandmarker hook
│   │   └── usePoseDetection.js # MediaPipe PoseLandmarker hook
│   ├── utils/
│   │   ├── drawOrnament.js    # Canvas drawing with rotation
│   │   ├── landmarkHelpers.js # Coordinate math + smoothing
│   │   └── ornamentData.js    # Jewelry catalog & offsets
│   ├── App.jsx
│   └── App.css                # Luxury design system
└── vite.config.js             # CORS headers for MediaPipe WASM
```

---

## 🔒 Security & Privacy

- **No backend** — everything runs in the browser
- **No camera data transmitted** — MediaPipe runs fully client-side via WASM
- **No API keys** — no secrets in the codebase
- Camera is only accessed when the user grants explicit browser permission

---

## 📋 License

MIT — free to use, modify, and distribute.

---

*Built as a demo for [Nemish Sapara](https://github.com/nemishsapara69)*
