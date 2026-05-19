# SultanDSP V.X — Frontend (Beta / Prototype)

**Repository:** [`sultandsp-vx`](https://github.com/palaarda/sultandsp-vx)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

<p align="center">
  <strong>Premium guitar amp &amp; effects suite — UI prototype</strong>
</p>

**Lisans / License:** [GNU General Public License v3.0](LICENSE) (GPL-3.0-or-later)

```bash
git clone https://github.com/palaarda/sultandsp-vx.git
cd sultandsp-vx
```

> **⚠️ BETA — PROTOTİP SÜRÜMÜ**  
> Bu depo yalnızca **prototipleme ve yatırımcı/demo gösterimi** için hazırlanmıştır.  


> **⚠️ BETA — PROTOTYPE BUILD**  
> This repository is for **prototyping and investor/demo purposes only**.  


---

## 🇹🇷 Türkçe

### Nedir?

**Sultan V.X**, masaüstü/VST tarzı bir gitar işleme uygulamasının **frontend prototipidir**. Amaç; Neural DSP / Quad Cortex seviyesinde premium bir arayüz dilini göstermek, kullanıcı akışlarını test etmek ve backend (C++/JUCE veya benzeri) bağlanmadan önce ürün vizyonunu somutlaştırmaktır.

Bu sürümde tüm veriler ve sahne mantığı **mock / yerel** çalışır. Firebase kimlik doğrulama entegre edilmiştir; ses işleme ilk commitlerde yoktur.

### Bu beta sürümde neler var?

| Modül | Açıklama |
|--------|-----------|
| **Virtual Stage** | Sonsuz pan/zoom canvas üzerinde sinyal zinciri (Input → cihazlar → Output) |
| **Components** | Pedal, amfi ve kabin kataloğu; görsel destekli cihaz kartları |
| **Presets** | Preset listesi, sürükle-bırak sıralama (mock) |
| **Market** | “Coming Soon” placeholder |
| **Ayarlar / Profil** | UI ve mock engine ayarları |
| **Cihaz görselleri** | PNG + yüzde konumlu knob / rocker / LED overlay |
| **Kimlik doğrulama** | Firebase Auth ile giriş |

### Teknoloji

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS 4**
- **Zustand** (durum yönetimi)
- **Framer Motion** (animasyonlar)
- **Firebase** (Auth / Firestore altyapısı hazır, çoğu veri henüz mock)

### Kurulum

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

`.env` dosyasını kendi Firebase projenizin değerleriyle doldurun (aşağıdaki tablo). **`.env` repoya yüklenmez** — yalnızca `.env.example` şablon olarak commit edilir.

```bash
npm run dev
```

Tarayıcıda Vite’ın verdiği adresi açın (genelde `http://localhost:5173`).

#### Ortam değişkenleri (`.env`)

Değerleri almak için: [Firebase Console](https://console.firebase.google.com/) → projeniz → **Project settings** (dişli) → **Your apps** → Web uygulaması → **Firebase SDK snippet** → *Config*.

| Değişken | Firebase config alanı | Zorunlu |
|----------|------------------------|---------|
| `VITE_FIREBASE_API_KEY` | `apiKey` | Evet |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` | Evet |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` | Evet |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` | Evet |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` | Evet |
| `VITE_FIREBASE_APP_ID` | `appId` | Evet |
| `VITE_FIREBASE_MEASUREMENT_ID` | `measurementId` | Hayır (Analytics) |

Örnek `.env` (gerçek anahtarları buraya yazmayın; kendi değerlerinizi kullanın):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
# VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Vite yalnızca `VITE_` ile başlayan değişkenleri istemciye aktarır. `firebase.ts` bu değişkenleri okur.

```bash
npm run build    # production build
npm run preview  # build önizleme
```

**Gereksinimler:** Node.js 20+ önerilir.

### Proje yapısı

```
src/
├── assets/devices/       # Pedal / amp PNG görselleri (pedals/, amps/, cabs/)
├── components/
│   ├── audio/            # Knob, RockerSwitch, Fader, VuMeter
│   ├── auth/             # Login
│   ├── fx/               # Components kütüphanesi UI
│   ├── layout/           # Navbar, Dashboard
│   ├── scene/            # Virtual Stage, zincir, sonsuz canvas
│   └── visuals/          # ImageBackedDevice, PedalVisual, AmpVisual
├── hooks/                # useCanvasViewport, useAuth
├── lib/
│   ├── data/             # fxLibrary.ts, deviceLayouts.ts
│   ├── services/         # Backend’e bağlanacak servis katmanı (şu an mock)
│   └── types.ts          # Paylaşılan TypeScript tipleri
├── pages/                # VirtualStage, FxLibrary, Presets, Market, Settings
└── stores/               # Zustand store’ları
```

### Backend entegrasyonu (fork / geliştirici notu)

Backend geliştirmesi için kritik nokta: **UI doğrudan mock servislere değil, `src/lib/services/` arayüzlerine bağlanmalı.**

| Servis | Dosya | Arayüz (`types.ts`) |
|--------|--------|---------------------|
| FX kataloğu | `fxService.ts` | `IFxService` |
| Sahne / zincir | `sceneService.ts` | `ISceneService` |
| Favoriler | `favoritesService.ts` | `IFavoritesService` |
| Ayarlar | `settingsService.ts` | — |

`sceneService` şu an bellek içi mock zincir tutar. JUCE / native backend hazır olduğunda:

1. Aynı arayüzleri implement eden yeni bir servis sınıfı yazın (ör. `NativeSceneService`).
2. Store’larda (`sceneStore.ts` vb.) import’u bu implementasyona yönlendirin.
3. Parametre değişikliklerini backend’e iletin (`updateNodeParams`, `toggleNode`, …).

Cihaz parametreleri `SceneNode.params: Record<string, number>` formatındadır; `fxLibrary.ts` içindeki `DeviceParam` tanımları referanstır.

### Yeni cihaz görseli ekleme

1. PNG’yi `src/assets/devices/pedals/` veya `amps/` altına koyun (`deviceId.png`).
2. `src/lib/data/fxLibrary.ts` içine cihaz tanımını ekleyin.
3. `src/lib/data/deviceLayouts.ts` içinde knob / toggle konumlarını kalibre edin.

Detay: `src/assets/devices/README.md`

### Bilinçli olarak eksik (beta)

- Gerçek ses işleme / VST plugin host
- Gerçek NAM profili import (UI kartı hazır, mock file picker)
- Cloud senkronize preset / sahne (Firestore iskeleti var, veri mock)
- Mixer, kablo routing, serbest cihaz yerleşimi (sadece lineer zincir + sonsuz canvas pan/zoom)
- Market mağazası

### Lisans

Bu proje **[GNU Genel Kamu Lisansı sürüm 3](LICENSE)** (GPL-3.0-or-later) ile lisanslanmıştır.

- Kaynak kodu kullanabilir, inceleyebilir, değiştirebilir ve dağıtabilirsiniz.
- Dağıttığınız veya yayınladığınız türev çalışmalar da **aynı GPL-3.0** koşulları altında olmalıdır (kaynak paylaşımı dahil).
- Garanti verilmez; ayrıntılar için `LICENSE` dosyasına bakın.

Beta / prototip olması lisansı değiştirmez; depoyu fork’layan veya dağıtan herkes GPL koşullarına uymalıdır.

---

## 🇬🇧 English

### What is it?

**Sultan V.X** is the **frontend prototype** of a desktop / VST-style guitar processing application. The goal is to demonstrate a premium UI language (Neural DSP / Quad Cortex level), validate user flows, and materialize the product vision **before** connecting a real DSP backend (C++/JUCE or similar).

All data and scene logic run **locally / mocked** in this build. Firebase authentication is wired; there is **no audio processing**.

### What’s in this beta?

| Module | Description |
|--------|-------------|
| **Virtual Stage** | Signal chain on an infinite pan/zoom canvas (Input → devices → Output) |
| **Components** | Pedal, amp, and cab catalog with image-backed device cards |
| **Presets** | Preset list with drag-and-drop reorder (mock) |
| **Market** | “Coming Soon” placeholder |
| **Settings / Profile** | UI and mock engine settings |
| **Device visuals** | PNG backgrounds with percentage-positioned knobs / rockers / LEDs |
| **Authentication** | Sign-in via Firebase Auth |

### Tech stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS 4**
- **Zustand** (state)
- **Framer Motion** (motion)
- **Firebase** (Auth / Firestore scaffolding; most data is still mock)

### Getting started

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

Fill `.env` with your Firebase project values (table below). **`.env` is not committed** — only `.env.example` is tracked as a template.

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

#### Environment variables (`.env`)

Get values from: [Firebase Console](https://console.firebase.google.com/) → your project → **Project settings** → **Your apps** → Web app → **Firebase SDK snippet** → *Config*.

| Variable | Firebase config field | Required |
|----------|----------------------|----------|
| `VITE_FIREBASE_API_KEY` | `apiKey` | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` | Yes |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` | Yes |
| `VITE_FIREBASE_APP_ID` | `appId` | Yes |
| `VITE_FIREBASE_MEASUREMENT_ID` | `measurementId` | No (Analytics) |

Example `.env` (do not commit real keys; use your own values):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
# VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Vite only exposes variables prefixed with `VITE_`. `firebase.ts` reads these at build/dev time.

```bash
npm run build    # production build
npm run preview  # preview production build
```

**Requirements:** Node.js 20+ recommended.

### Project structure

```
src/
├── assets/devices/       # Pedal / amp PNGs (pedals/, amps/, cabs/)
├── components/
│   ├── audio/            # Knob, RockerSwitch, Fader, VuMeter
│   ├── auth/             # Login
│   ├── fx/               # Components library UI
│   ├── layout/           # Navbar, Dashboard
│   ├── scene/            # Virtual Stage, chain, infinite canvas
│   └── visuals/          # ImageBackedDevice, PedalVisual, AmpVisual
├── hooks/                # useCanvasViewport, useAuth
├── lib/
│   ├── data/             # fxLibrary.ts, deviceLayouts.ts
│   ├── services/         # Service layer for future backend (mock today)
│   └── types.ts          # Shared TypeScript types
├── pages/                # VirtualStage, FxLibrary, Presets, Market, Settings
└── stores/               # Zustand stores
```

### Backend integration (fork / developer notes)

For backend work, the critical rule is: **wire the UI through `src/lib/services/` interfaces, not ad-hoc API calls from components.**

| Service | File | Interface (`types.ts`) |
|--------|--------|------------------------|
| FX catalog | `fxService.ts` | `IFxService` |
| Scene / chain | `sceneService.ts` | `ISceneService` |
| Favorites | `favoritesService.ts` | `IFavoritesService` |
| Settings | `settingsService.ts` | — |

`sceneService` currently keeps an in-memory mock chain. When the JUCE / native backend is ready:

1. Implement the same interfaces (e.g. `NativeSceneService`).
2. Point stores (`sceneStore.ts`, etc.) at that implementation.
3. Forward parameter changes to the engine (`updateNodeParams`, `toggleNode`, …).

Device parameters use `SceneNode.params: Record<string, number>`; see `DeviceParam` in `fxLibrary.ts`.

### Adding a new device visual

1. Add PNG under `src/assets/devices/pedals/` or `amps/` (`deviceId.png`).
2. Register the device in `src/lib/data/fxLibrary.ts`.
3. Calibrate knob / toggle positions in `src/lib/data/deviceLayouts.ts`.

Details: `src/assets/devices/README.md`

### Intentionally out of scope (beta)

- Real audio processing / VST plugin host
- Real NAM profile import (UI card ready, mock file picker only)
- Cloud-synced presets / scenes (Firestore skeleton only)
- Mixer, cable routing, free node graph (linear chain + infinite canvas pan/zoom only)
- Market storefront

### License

This project is licensed under the **[GNU General Public License v3.0](LICENSE)** (GPL-3.0-or-later).

- You may use, study, modify, and distribute the source code.
- Derivative works you distribute must also be released under **GPL-3.0** (including source availability).
- There is no warranty; see the `LICENSE` file for details.

Being a beta / prototype does not change the license; anyone who forks or redistributes this repo must comply with the GPL.

---

## Contributing / Fork workflow

1. Fork this repository.
2. Create a feature branch (`feature/backend-bridge`, etc.).
3. Keep UI changes aligned with the existing design system (dark theme, `sultan-*` tokens).
4. Prefer extending **services** and **types** rather than coupling components to native APIs.

For questions about UI behavior or device layout calibration, coordinate with the frontend owner of this prototype.

---

<p align="center">
  <sub>Sultan V.X · Beta Prototype · Frontend only · GPL-3.0</sub>
</p>
