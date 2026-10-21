# CyberShield — Cyber Safety Awareness Platform

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-00f2fe?style=for-the-badge)](https://lenis.darkroom.engineering/)

CyberShield is a cinematic, award-winning educational web platform dedicated to cybersecurity literacy, proactive digital defense, threat mitigation, and online safety practices.

---

## 🌟 Core Highlights

- **Award-Winning Scroll Architecture**: Powered by **GSAP (GreenSock)**, **ScrollTrigger**, and **Lenis** smooth momentum scrolling for a butter-smooth 60fps/120fps experience.
- **Top HUD Progress Bar**: Precision laser progress line tracking page scroll depth in real time.
- **Live Stat Counters**: Animated counters that dynamically calculate threat mitigation metrics upon entering the viewport.
- **3D Card Perspective & Parallax**: Robotic security assets and threat cards react to mouse trajectory with realistic depth.
- **Magnetic Buttons & Cyber Cursor**: Custom dual-layer luminous trailing cursor with magnetic pull micro-interactions.
- **Adaptive Dual Theme**: Seamless White Mode and Dark Mode with glassmorphic reflections and neon accents.
- **Interactive Daily Checklist**: Client-side interactive checklist with automated progress feedback.
- **Binary Scramble FX**: Cyberpunk-style text hover scramble effect simulating encrypted data streams.

---

## 📁 Project Architecture

```text
CyberShield/
├── fonts/               # Offline Poppins typography (Regular, Medium, SemiBold, Bold)
├── Image/               # High-fidelity 3D renders, infographics, and threat illustrations
├── Index/               # Semantic HTML5 pages
│   ├── index.html       # Landing page with interactive hero, stats, & modules
│   ├── threats.html     # Deep dive into phishing, ransomware, malware, & hacking
│   ├── explore.html     # Interactive exploration modules with embedded media
│   ├── tips.html        # Everyday defense checklist, 2FA guides, and habits
│   ├── about.html       # Project background, team roster, and academic credits
│   └── contact.html     # Glassmorphism inquiry form with validation feedback
├── Java Script/         # Application scripts & animation engines
│   ├── vendor/          # Vendored GSAP, ScrollTrigger, & Lenis libraries
│   ├── award-scroll.js  # Master GSAP animation and scroll controller
│   ├── darkmode.js      # Zero-flash persistent theme switcher
│   ├── Effectt.js       # Binary text scramble hover engine
│   └── contactform.js   # Client-side form validator & feedback modal
├── Style/               # Modular CSS architecture
│   ├── White Mode/      # Light theme rulesets and layouts
│   ├── Dark Mode/       # High-contrast dark cyber theme overrides
│   └── award-scroll.css # HUD, cursor, 3D perspective, & animation styles
└── Video/               # Educational media demonstrations
```

---

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yaredlab/CyberShield.git
   cd CyberShield
   ```
2. **Launch locally**:
   - Simply double-click [`Index/index.html`](Index/index.html) in your browser.
   - Or run with a local development server (e.g., Live Server in VS Code or `npx serve`).

---

## 👥 Authors & Academic Credits

Developed as part of the **Internet Programming** assignment.
- **Course Instructor**: Mr. Gulelat Yohannes
- **Team**:
  - Yared Defaru (UUR01162/17)
  - Natnael Demsew (UUR00955/17)
  - Fikreselassie G/Wold (UUR02415/17)
  - Muusa Kadir (UUR00704/17)
  - Natanim Chala (UUR01397/17)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
