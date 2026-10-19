/**
 * ============================================================
 *  BINARY HOVER EFFECT — Effectt.js
 *  For: Cyber Security Awareness Website
 *
 *  What it does:
 *  On hover the element text scrambles into 0s and 1s for 3s,
 *  then SNAPS cleanly back to the original text and stops.
 *
 *  ROOT-BUG FIX (v3):
 *  _originalText is saved ONCE from the real DOM text and is
 *  NEVER overwritten mid-effect. It is only cleared AFTER a
 *  full restore completes so the next hover starts from clean
 *  text. This prevents the stored "original" slowly becoming
 *  binary after repeated hovers.
 * ============================================================
 */

(function () {
  "use strict";

  /* =========================================================
   * CONFIGURATION
   * ======================================================= */
  var CONFIG = {
    /* Characters used in the scramble */
    binaryChars: ["0", "1"],

    /* How fast the binary digits flicker (ms between frames) */
    flickerIntervalMs: 60,

    /* Duration of the gradual restore on mouse-out (ms) */
    restoreDurationMs: 420,

    /* Steps in the gradual restore animation */
    restoreIterations: 10,

    /* How long binary runs before auto-stopping (ms).
       After this time text SNAPS back instantly and the effect
       is locked until the mouse leaves the element. */
    autoStopMs: 3000,

    /* CSS selectors that receive the effect */
    targets: [
      "button",
      ".nav-link",
      "a",
      ".hover-effect"
    ]
  };

  /* =========================================================
   * UTILITY: random 0 or 1
   * ======================================================= */
  function randomBit() {
    return CONFIG.binaryChars[
      Math.floor(Math.random() * CONFIG.binaryChars.length)
    ];
  }

  /* =========================================================
   * UTILITY: convert a string to random binary
   * Spaces are kept so the element width does not jump.
   * ======================================================= */
  function toBinary(str) {
    return str.split("").map(function (ch) {
      return ch === " " ? " " : randomBit();
    }).join("");
  }

  /* =========================================================
   * DOM HELPER: find the first real text node inside el
   * Walks direct childNodes then falls into child elements
   * (handles <span> inside <a>, etc.)
   * ======================================================= */
  function getTextNode(el) {
    var node, child, found, i;
    for (i = 0; i < el.childNodes.length; i++) {
      node = el.childNodes[i];
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        return node;
      }
    }
    for (i = 0; i < el.children.length; i++) {
      child = el.children[i];
      found = getTextNode(child);
      if (found) return found;
    }
    return null;
  }

  /* =========================================================
   * CLEAR ALL TIMERS on an element
   * Makes sure we never have two intervals running at once.
   * ======================================================= */
  function clearAllTimers(el) {
    if (el._flickerTimer)  { clearInterval(el._flickerTimer);  delete el._flickerTimer;  }
    if (el._restoreTimer)  { clearInterval(el._restoreTimer);  delete el._restoreTimer;  }
    if (el._autoStopTimer) { clearTimeout(el._autoStopTimer);  delete el._autoStopTimer; }
  }

  /* =========================================================
   * SNAP RESTORE
   * Instantly writes the true original text back to the DOM.
   * Called by the auto-stop timer after 3 seconds.
   * ======================================================= */
  function snapRestore(el) {
    clearAllTimers(el);

    /* Write the TRUE original back — no gradual reveal */
    if (el._textNode && el._originalText !== undefined) {
      el._textNode.textContent = el._originalText;
    }

    el._isScrambling = false;

    /* Lock the effect for this hover session.
       scrambleText() returns early until mouseleave resets this. */
    el._effectDone = true;

    /* Do NOT clear _originalText here.
       restoreText() still needs it if the mouse leaves after snap. */
  }

  /* =========================================================
   * SCRAMBLE — start the binary flicker
   *
   * THE CRITICAL FIX:
   *   _originalText is saved only when it is undefined (first
   *   hover, or after a complete restore). If it is already
   *   set we reuse it without touching it. This guarantees we
   *   NEVER overwrite the real text with binary characters,
   *   which was the root cause of the bug.
   * ======================================================= */
  function scrambleText(el) {

    /* GUARD: if the 3-second effect already finished this hover,
       do nothing. The guard is lifted on mouseleave. */
    if (el._effectDone) return;

    var textNode = getTextNode(el);
    if (!textNode) return;

    /* -- Save the TRUE original ONCE ---------------------------
       Only read from the DOM when _originalText is not yet set.
       At any later call the DOM might already show binary text,
       so reading it would corrupt the stored original. */
    if (!el._originalText) {
      var domText = textNode.textContent;
      if (!domText.trim()) return;
      el._originalText = domText;   /* saved once from clean DOM */
    }

    var original    = el._originalText;  /* always the real text */
    el._textNode    = textNode;
    el._isScrambling = true;

    /* Stop any restore animation that might still be running */
    clearAllTimers(el);

    /* -- Binary flicker loop -----------------------------------
       Replaces the full text with random 0/1 every tick.
       We always use `original` as the length reference so we
       never accidentally read the (binary) DOM text. */
    function renderBinary() {
      textNode.textContent = toBinary(original);
    }

    renderBinary();   /* instant first frame — text goes binary */
    el._flickerTimer = setInterval(renderBinary, CONFIG.flickerIntervalMs);

    /* -- Auto-stop after 3 seconds ----------------------------
       snapRestore() kills the flicker, writes original back
       instantly, and sets _effectDone so hover is locked. */
    el._autoStopTimer = setTimeout(function () {
      snapRestore(el);
    }, CONFIG.autoStopMs);
  }

  /* =========================================================
   * GRADUAL RESTORE — called on mouse-out
   * Reveals original text left-to-right over restoreDurationMs.
   * ======================================================= */
  function restoreText(el) {
    var textNode = el._textNode;
    var original  = el._originalText;

    /* Nothing to restore */
    if (!textNode || original === undefined) return;

    /* Kill flicker and auto-stop (not needed during restore) */
    clearAllTimers(el);

    /* If the auto-stop already snapped the text back, the DOM
       already shows the original. Just clean up and exit. */
    if (textNode.textContent === original) {
      el._originalText = undefined;   /* clear so next hover reads fresh DOM */
      return;
    }

    /* Gradually reveal original text, left to right */
    var step       = 0;
    var totalSteps = CONFIG.restoreIterations;
    var intervalMs = CONFIG.restoreDurationMs / totalSteps;

    el._restoreTimer = setInterval(function () {
      step++;
      var revealUpTo = (step / totalSteps) * original.length;

      textNode.textContent = original.split("").map(function (ch, i) {
        if (ch === " ") return " ";
        /* Left of threshold = restored; right = still binary */
        return i < revealUpTo ? ch : randomBit();
      }).join("");

      /* Final step: guarantee exact original and clean up */
      if (step >= totalSteps) {
        clearInterval(el._restoreTimer);
        delete el._restoreTimer;
        textNode.textContent = original;

        /* Safe to clear now. DOM is correct.
           Next hover will read fresh clean text from the DOM. */
        el._originalText = undefined;
      }
    }, intervalMs);
  }

  /* =========================================================
   * EVENT BINDING
   * Attaches mouseenter / mouseleave (+ touch) to one element.
   * A data-attribute flag prevents double-binding.
   * ======================================================= */
  function bindElement(el) {
    if (el.dataset.cyberBound) return;   /* already wired */
    el.dataset.cyberBound = "true";

    /* Mouse enters: start the 3-second binary effect */
    el.addEventListener("mouseenter", function () {
      scrambleText(el);
    });

    /* Mouse leaves: restore text + unlock for next hover */
    el.addEventListener("mouseleave", function () {
      /* Lift the session lock so the NEXT hover starts fresh */
      el._effectDone = false;
      /* Gradually restore the original text */
      restoreText(el);
    });

    /* Touch: brief binary flash then restore */
    el.addEventListener("touchstart", function () {
      scrambleText(el);
    }, { passive: true });

    el.addEventListener("touchend", function () {
      setTimeout(function () {
        el._effectDone = false;
        restoreText(el);
      }, 400);
    }, { passive: true });
  }

  /* =========================================================
   * BIND ALL matching elements (idempotent)
   * ======================================================= */
  function bindAll() {
    var selector = CONFIG.targets.join(", ");
    document.querySelectorAll(selector).forEach(bindElement);
  }

  /* =========================================================
   * MUTATION OBSERVER
   * Auto-binds elements added after page load (dark mode toggle,
   * contact form popup, etc.)
   * ======================================================= */
  function observeDynamicContent() {
    var selector = CONFIG.targets.join(", ");

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.matches && node.matches(selector)) bindElement(node);
          if (node.querySelectorAll) {
            node.querySelectorAll(selector).forEach(bindElement);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* =========================================================
   * INIT
   * ======================================================= */
  function init() {
    bindAll();
    observeDynamicContent();
    console.info("[CyberEffect] Binary hover effect ready (v3 - root bug fixed)");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
