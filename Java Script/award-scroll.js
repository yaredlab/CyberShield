/* ==========================================================================
   AWARD-WINNING GSAP & SCROLL ENGINE — CyberShield
   Lenis Smooth Scroll · ScrollTrigger Orchestration · Cyber Interactions
   ========================================================================== */

(function () {
  'use strict';

  // Wait for DOM and required libraries
  document.addEventListener('DOMContentLoaded', function () {
    initAwardExperience();
  });

  function initAwardExperience() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      console.warn('[CyberShield] GSAP not detected, running standard mode.');
      return;
    }

    // Register ScrollTrigger plugin if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Initialize Lenis Smooth Scroll
    var lenis = initSmoothScroll();

    // 2. Initialize Top Scroll Progress HUD
    initScrollProgressBar();

    // 3. Initialize Interactive Cyber Cursor Follower
    initCyberCursor();

    // 4. Hero Section Entrance Animation
    initHeroAnimations();

    // 5. Scroll-Triggered Stat Counters
    initStatCounters();

    // 6. 3D Card Hover & Scroll-Reveal Orchestration
    initScrollReveals();

    // 7. Parallax Image Scrubbers
    initParallaxScrubbers();

    // 8. Magnetic Buttons Micro-Interactions
    initMagneticButtons();

    // 9. Smooth Scroll-Down Cue Action
    initScrollCue(lenis);

    // 10. Interactive Floating Back to Top Button
    initBackToTop(lenis);

    // 11. Daily Safety Checklist Interactive Tracker
    initChecklistTracker();

    // 12. Interactive Topic Search Filter
    initTopicSearch();
  }

  /* ──────────────────────────────────────────────────────────────
     1. LENIS SMOOTH MOMENTUM SCROLL
  ────────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return null;

    try {
      var lenis = new Lenis({
        duration: 1.25,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        wheelMultiplier: 1.05,
        touchMultiplier: 1.8
      });

      // Synchronize Lenis with GSAP ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      }

      return lenis;
    } catch (e) {
      console.warn('[CyberShield] Lenis init skipped:', e);
      return null;
    }
  }

  /* ──────────────────────────────────────────────────────────────
     2. TOP SCROLL PROGRESS BAR
  ────────────────────────────────────────────────────────────── */
  function initScrollProgressBar() {
    var hud = document.querySelector('.scroll-progress-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.className = 'scroll-progress-hud';
      hud.innerHTML = '<div class="scroll-progress-bar"></div>';
      document.body.prepend(hud);
    }

    var bar = hud.querySelector('.scroll-progress-bar');
    if (!bar || typeof ScrollTrigger === 'undefined') return;

    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     3. CYBERNETIC CURSOR FOLLOWER
  ────────────────────────────────────────────────────────────── */
  function initCyberCursor() {
    // Only on pointer devices that support hover
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var dot = document.createElement('div');
    dot.className = 'cyber-cursor-dot';

    var ring = document.createElement('div');
    ring.className = 'cyber-cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var setDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    var setDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });

    var setRingX = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power3' });
    var setRingY = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power3' });

    window.addEventListener('mousemove', function (e) {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    });

    // Expand cursor on interactive targets
    var targets = document.querySelectorAll('a, button, .card, .cyber-show-card, .cyber-stat-card, .scroll-cue, input, textarea');
    targets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cyber-cursor-active');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cyber-cursor-active');
      });
    });
  }

  /* ──────────────────────────────────────────────────────────────
     4. HERO ENTRANCE & LEVITATION
  ────────────────────────────────────────────────────────────── */
  function initHeroAnimations() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var badge = hero.querySelector('.cyber-badge');
    var h1 = hero.querySelector('h1');
    var mediaImg = hero.querySelector('.hero-media img');
    var sub = hero.querySelector('.hero-sub');
    var actions = hero.querySelector('.hero-actions');
    var cue = hero.querySelector('.scroll-cue');

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (badge) {
      tl.from(badge, { y: -24, opacity: 0, duration: 0.8 }, 0.1);
    }

    if (h1) {
      tl.from(h1, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        filter: 'blur(8px)'
      }, 0.2);
    }

    if (mediaImg) {
      tl.from(mediaImg, {
        scale: 0.88,
        opacity: 0,
        duration: 1.2,
        ease: 'back.out(1.4)'
      }, 0.3);

      // Continuous gentle levitation
      gsap.to(mediaImg, {
        y: -14,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // 3D Parallax tilt on mousemove
      hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(mediaImg, {
          rotateY: x * 14,
          rotateX: -y * 14,
          duration: 0.6,
          ease: 'power2.out',
          transformPerspective: 900
        });
      });

      hero.addEventListener('mouseleave', function () {
        gsap.to(mediaImg, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    }

    if (sub) {
      tl.from(sub, { y: 24, opacity: 0, duration: 0.9 }, 0.5);
    }

    if (actions) {
      tl.from(actions.children, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12
      }, 0.65);
    }

    if (cue) {
      tl.from(cue, { y: 20, opacity: 0, duration: 0.8 }, 0.9);
    }
  }

  /* ──────────────────────────────────────────────────────────────
     5. SCROLL-TRIGGERED STAT COUNTERS
  ────────────────────────────────────────────────────────────── */
  function initStatCounters() {
    if (typeof ScrollTrigger === 'undefined') return;

    var statCards = document.querySelectorAll('.cyber-stat-card');
    if (!statCards.length) return;

    // Stagger in cards on scroll
    gsap.from(statCards, {
      y: 45,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cyber-stats-grid',
        start: 'top 85%'
      }
    });

    // Count up animation
    statCards.forEach(function (card) {
      var numEl = card.querySelector('.cyber-stat-number');
      if (!numEl) return;

      var targetVal = parseFloat(numEl.getAttribute('data-target') || '0');
      var suffix = numEl.getAttribute('data-suffix') || '';
      var decimals = parseInt(numEl.getAttribute('data-decimals') || '0', 10);

      var counter = { val: 0 };

      gsap.to(counter, {
        val: targetVal,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true
        },
        onUpdate: function () {
          numEl.innerHTML = (decimals > 0 ? counter.val.toFixed(decimals) : Math.round(counter.val)) + '<em>' + suffix + '</em>';
        }
      });
    });
  }

  /* ──────────────────────────────────────────────────────────────
     6. 3D CARD HOVER & SCROLL-REVEAL ORCHESTRATION
  ────────────────────────────────────────────────────────────── */
  function initScrollReveals() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Reveal banners and sections smoothly
    var sections = document.querySelectorAll('.banner-sub, .cyber-features-section, .about-section, .threats-section, .tips-details, .contact-section');
    sections.forEach(function (sec) {
      gsap.from(sec, {
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%'
        }
      });
    });

    // Stagger reveal for feature cards
    var trioCards = document.querySelectorAll('.cyber-show-card');
    if (trioCards.length) {
      gsap.from(trioCards, {
        y: 60,
        opacity: 0,
        duration: 1.0,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cyber-cards-trio',
          start: 'top 82%'
        }
      });

      // 3D perspective tilt on hover
      trioCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotateY: x * 10,
            rotateX: -y * 10,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 1000
          });
        });

        card.addEventListener('mouseleave', function () {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: 'power2.out'
          });
        });
      });
    }

    // General cards reveal
    var genericCards = document.querySelectorAll('.threat-card, .services .card, .checklist');
    if (genericCards.length) {
      gsap.from(genericCards, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: genericCards[0],
          start: 'top 85%'
        }
      });
    }
  }

  /* ──────────────────────────────────────────────────────────────
     7. PARALLAX IMAGE SCRUBBERS
  ────────────────────────────────────────────────────────────── */
  function initParallaxScrubbers() {
    if (typeof ScrollTrigger === 'undefined') return;

    var container = document.querySelector('.image-container');
    if (!container) return;

    var img = container.querySelector('img');
    var overlay = container.querySelector('.text-overlay');

    if (img) {
      gsap.fromTo(img, 
        { scale: 1.18, y: -40 },
        {
          scale: 1.0,
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      );
    }

    if (overlay) {
      gsap.fromTo(overlay,
        { opacity: 0.8, y: 30 },
        {
          opacity: 1,
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top center',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );
    }
  }

  /* ──────────────────────────────────────────────────────────────
     8. MAGNETIC BUTTONS MICRO-INTERACTIONS
  ────────────────────────────────────────────────────────────── */
  function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var magnets = document.querySelectorAll('.nav-cta, .btn, .nav-logo');
    magnets.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }

  /* ──────────────────────────────────────────────────────────────
     9. SMOOTH SCROLL CUE ACTION
  ────────────────────────────────────────────────────────────── */
  function initScrollCue(lenis) {
    var cue = document.querySelector('.scroll-cue');
    if (!cue) return;

    cue.addEventListener('click', function () {
      var nextTarget = document.querySelector('#stats-overview') || document.querySelector('.banner-sub') || 600;
      if (lenis) {
        lenis.scrollTo(nextTarget, { offset: -60, duration: 1.4 });
      } else {
        if (typeof nextTarget === 'number') {
          window.scrollTo({ top: nextTarget, behavior: 'smooth' });
        } else {
          nextTarget.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     10. FLOATING BACK TO TOP BUTTON
  ────────────────────────────────────────────────────────────── */
  function initBackToTop(lenis) {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 380) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     11. DAILY SAFETY CHECKLIST INTERACTIVE TRACKER
  ────────────────────────────────────────────────────────────── */
  function initChecklistTracker() {
    var checkboxes = document.querySelectorAll('.checklist-items input[type="checkbox"]');
    var countText = document.getElementById('checklist-count-text');
    var pctText = document.getElementById('checklist-pct-text');
    var fillBar = document.getElementById('checklist-progress-fill');

    if (!checkboxes.length || !countText || !fillBar) return;

    var total = checkboxes.length;

    // Load saved states from localStorage
    checkboxes.forEach(function (cb, idx) {
      var saved = localStorage.getItem('cybershield-check-' + idx);
      if (saved === 'true') {
        cb.checked = true;
      }
      cb.addEventListener('change', function () {
        localStorage.setItem('cybershield-check-' + idx, cb.checked);
        updateProgress();
      });
    });

    function updateProgress() {
      var checkedCount = 0;
      checkboxes.forEach(function (cb) {
        if (cb.checked) checkedCount++;
      });

      var pct = Math.round((checkedCount / total) * 100);
      countText.textContent = checkedCount + ' of ' + total + ' habits completed';
      if (pctText) pctText.textContent = pct + '%';
      fillBar.style.width = pct + '%';

      if (pct === 100) {
        countText.textContent = '🎉 All habits verified! Outstanding protection.';
      }
    }

    updateProgress();
  }

  /* ──────────────────────────────────────────────────────────────
     12. TOPIC SEARCH FILTER (Explore page)
  ────────────────────────────────────────────────────────────── */
  function initTopicSearch() {
    var input = document.getElementById('topic-search-input');
    var sections = document.querySelectorAll('.explore-section');
    if (!input || !sections.length) return;

    input.addEventListener('input', function () {
      var query = input.value.toLowerCase().trim();

      sections.forEach(function (sec) {
        var text = sec.textContent.toLowerCase();
        if (!query || text.indexOf(query) !== -1) {
          sec.style.display = '';
          sec.style.opacity = '1';
          sec.style.transform = 'none';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  }

})();
