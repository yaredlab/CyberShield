/* ================================================================
   darkmode.js — CyberShield Premium Dark Mode System
   Glassmorphism · Cinematic · Cyber Security Theme
   ================================================================
   Features:
   - Moon/Sun animated toggle button injected into every navbar
   - Smooth cinematic page transitions on theme switch
   - localStorage persistence across all pages
   - Glassmorphism styled pill toggle with neon glow
   - Zero inline JS — all logic lives here
   ================================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     CONSTANTS
  ────────────────────────────────────────────────────────────── */
  var STORAGE_KEY = 'cybershield-theme';  // key for localStorage
  var DARK_CLASS  = 'dark-mode';          // class added to <html>

  /* ──────────────────────────────────────────────────────────────
     STEP 1 — INJECT darkmode.css DYNAMICALLY
     Resolves the CSS path relative to this script file so it
     works no matter which HTML page loads it.
  ────────────────────────────────────────────────────────────── */
  function injectCSS() {
    // Find this script's own src attribute to derive the folder path
    var scripts = document.querySelectorAll('script[src*="darkmode.js"]');
    var cssHref = '../Style/Dark Mode/darkmode.css'; // fallback

    if (scripts.length > 0) {
      var src = scripts[scripts.length - 1].getAttribute('src');
      var dir = src.substring(0, src.lastIndexOf('/') + 1);
      cssHref = dir + '../Style/Dark Mode/darkmode.css';
    }

    // Avoid duplicate injection if script is somehow loaded twice
    if (document.querySelector('link[href*="darkmode.css"]')) return;

    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = cssHref;
    link.id   = 'dm-css-link';
    document.head.appendChild(link);
  }

  /* ──────────────────────────────────────────────────────────────
     STEP 2 — APPLY / REMOVE DARK CLASS ON <html>
     Runs immediately (before paint) to prevent theme flash.
  ────────────────────────────────────────────────────────────── */
  function applyThemeClass(isDark) {
    if (isDark) {
      document.documentElement.classList.add(DARK_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
    }
  }

  /* ──────────────────────────────────────────────────────────────
     STEP 3 — BUILD THE TOGGLE BUTTON HTML
     A glassmorphism pill: [☀] [track●] [☽]
     Sun is visible in dark mode (click → go light)
     Moon is visible in light mode (click → go dark)
  ────────────────────────────────────────────────────────────── */
  function buildToggleButton() {
    var wrap = document.createElement('div');
    wrap.className = 'dm-toggle-wrap';
    wrap.id        = 'dm-toggle-wrap';

    /* SVG moon icon */
    var moonSVG = '<svg class="dm-svg-moon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">'
      + '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
      + '</svg>';

    /* SVG sun icon */
    var sunSVG = '<svg class="dm-svg-sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      + '<circle cx="12" cy="12" r="5"/>'
      + '<line x1="12" y1="1" x2="12" y2="3"/>'
      + '<line x1="12" y1="21" x2="12" y2="23"/>'
      + '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>'
      + '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>'
      + '<line x1="1" y1="12" x2="3" y2="12"/>'
      + '<line x1="21" y1="12" x2="23" y2="12"/>'
      + '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>'
      + '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
      + '</svg>';

    /* Assemble the toggle button */
    wrap.innerHTML =
      '<button class="dm-toggle-btn" id="dm-toggle-btn" type="button" aria-label="Toggle dark mode" title="Switch dark / light mode">'
      + '<span class="dm-icon-moon">' + moonSVG + '</span>'
      + '<span class="dm-track"><span class="dm-thumb"></span></span>'
      + '<span class="dm-icon-sun">' + sunSVG + '</span>'
      + '</button>';

    return wrap;
  }

  /* ──────────────────────────────────────────────────────────────
     STEP 4 — BUILD CINEMATIC TRANSITION OVERLAY
     A brief full-screen flash that masks the theme switch moment,
     giving a premium cinematic feel.
  ────────────────────────────────────────────────────────────── */
  function buildOverlay() {
    if (document.getElementById('dm-overlay')) return;

    var overlay     = document.createElement('div');
    overlay.id      = 'dm-overlay';
    overlay.className = 'dm-overlay';
    document.body.appendChild(overlay);
  }

  /* ──────────────────────────────────────────────────────────────
     STEP 5 — TRIGGER THE CINEMATIC TRANSITION
     Flash the overlay, swap the class, dismiss the overlay.
  ────────────────────────────────────────────────────────────── */
  function runTransition(isDark) {
    var overlay = document.getElementById('dm-overlay');

    /* Phase 1: fade overlay IN */
    if (overlay) {
      overlay.classList.add('dm-overlay--in');
    }

    /* Phase 2: at peak opacity, swap theme class */
    setTimeout(function () {
      applyThemeClass(isDark);

      /* Phase 3: fade overlay OUT */
      if (overlay) {
        overlay.classList.remove('dm-overlay--in');
        overlay.classList.add('dm-overlay--out');
      }

      /* Phase 4: clean up overlay class */
      setTimeout(function () {
        if (overlay) overlay.classList.remove('dm-overlay--out');
      }, 420);

    }, 200);
  }

  /* ──────────────────────────────────────────────────────────────
     STEP 6 — SYNC BUTTON STATE
     Updates aria-pressed and the visual .dm-is-dark class.
  ────────────────────────────────────────────────────────────── */
  function syncButton(isDark) {
    var btn = document.getElementById('dm-toggle-btn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.classList.toggle('dm-is-dark', isDark);
  }

  /* ──────────────────────────────────────────────────────────────
     STEP 7 — FULL THEME SWITCH
     Called on every button click.
  ────────────────────────────────────────────────────────────── */
  function switchTheme(isDark) {
    runTransition(isDark);
    syncButton(isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  /* ──────────────────────────────────────────────────────────────
     STEP 8 — DOM-READY SETUP
     Inserts the button into the navbar and wires up the click.
  ────────────────────────────────────────────────────────────── */
  function onDOMReady(isDark) {
    /* Build the cinematic overlay */
    buildOverlay();

    /* Find the .nav-cell-cta div that holds "Get Protected" */
    var ctaCell = document.querySelector('.nav-cell-cta');
    if (!ctaCell) return; // safety guard

    /* Inject the toggle wrapper before the CTA link */
    var toggleWrap = buildToggleButton();
    ctaCell.insertBefore(toggleWrap, ctaCell.firstChild);

    /* Make .nav-cell-cta flex so toggle + CTA sit side by side */
    ctaCell.style.display    = 'flex';
    ctaCell.style.alignItems = 'center';
    ctaCell.style.gap        = '12px';

    /* Set initial button visual state */
    syncButton(isDark);

    /* Wire up click handler */
    var btn = document.getElementById('dm-toggle-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        var nowDark = !document.documentElement.classList.contains(DARK_CLASS);
        switchTheme(nowDark);
      });
    }

    /* Keyboard shortcut: Alt + D toggles dark mode */
    document.addEventListener('keydown', function (e) {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        var nowDark = !document.documentElement.classList.contains(DARK_CLASS);
        switchTheme(nowDark);
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     BOOT — Execute immediately
  ────────────────────────────────────────────────────────────── */
  (function boot() {
    /* 1. Inject CSS as early as possible */
    injectCSS();

    /* 2. Read stored preference (default = light mode) */
    var stored = localStorage.getItem(STORAGE_KEY);
    var isDark  = (stored === 'dark'); // default: light

    /* 3. Apply theme class BEFORE first paint to eliminate flash */
    applyThemeClass(isDark);

    /* 4. Wait for DOM, then mount the button */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        onDOMReady(isDark);
      });
    } else {
      /* DOM already parsed (script is deferred or at bottom) */
      onDOMReady(isDark);
    }
  })();

})();
