/* ================================================================
   contactform.js — CyberShield Contact Form Handler
   Contact page only — shows a glassmorphism popup on submit.
   ================================================================

   HOW IT WORKS (beginner guide):
   ─────────────────────────────
   1. We wait for the page to fully load (DOMContentLoaded).
   2. We find the "Send Message" button and listen for a click.
   3. When clicked:
        a. We validate the form (all fields must be filled in).
        b. If invalid → we shake the empty fields and stop.
        c. If valid   → we build the popup HTML and add it to
                        the page, then fade it in.
   4. A 5-second countdown runs via the progress bar animation.
   5. After 5 seconds the popup fades out and is removed.
   6. The user can also close early with the ✕ button.
   7. The form fields are cleared after a successful send.

   ================================================================ */


/* ================================================================
   STEP 1 — Wait for the page HTML to be fully loaded
   before we try to find any elements on it.
   ================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────────────────────
     GRAB ELEMENTS WE NEED
     document.getElementById() finds an element by its id="..."
     document.querySelector() finds one element by CSS selector.
  ────────────────────────────────────────────────────────────── */
  var sendBtn  = document.querySelector('.btn-submit');    // The "Send Message" button
  var nameInput    = document.getElementById('contact-name');    // Full Name field
  var emailInput   = document.getElementById('contact-email');   // Email field
  var messageInput = document.getElementById('contact-message'); // Message textarea
  var charCounter  = document.getElementById('char-counter');

  /* Safety check — only run on the contact page */
  if (!sendBtn || !nameInput || !emailInput || !messageInput) return;

  /* Live message character counter */
  if (charCounter) {
    messageInput.addEventListener('input', function () {
      var len = messageInput.value.length;
      charCounter.textContent = len + ' / 500 characters';
    });
  }

  /* ──────────────────────────────────────────────────────────────
     STEP 2 — LISTEN FOR THE SEND BUTTON CLICK
     addEventListener('click', ...) runs our function every time
     the button is clicked.
  ────────────────────────────────────────────────────────────── */
  sendBtn.addEventListener('click', function () {

    /* ── STEP 3a: Validate — make sure all fields have content ── */
    var isValid = validateForm(nameInput, emailInput, messageInput);

    /* If validation failed, stop here. Error highlights are shown. */
    if (!isValid) return;

    /* ── STEP 3b: Show loading state on the button ── */
    sendBtn.classList.add('cf-sending');
    sendBtn.textContent = 'Sending…';

    /* ── STEP 3c: Simulate a small send delay (feels more real) ──
       In a real project you would send data to a server here
       using fetch() or XMLHttpRequest. For now we wait 800ms. */
    setTimeout(function () {

      /* Reset the button back to normal */
      sendBtn.classList.remove('cf-sending');
      sendBtn.textContent = 'Send Message';

      /* ── STEP 4: Build and show the success popup ── */
      showSuccessPopup();

      /* ── STEP 5: Clear the form fields after sending ── */
      clearForm(nameInput, emailInput, messageInput);

    }, 800); /* 800 milliseconds = 0.8 seconds */

  }); /* end click listener */


  /* ================================================================
     FUNCTION: validateForm
     Checks that name, email, and message fields are not empty.
     Returns true if everything is OK, false if something is missing.
     Adds a red highlight shake animation to empty fields.
  ================================================================ */
  function validateForm(name, email, message) {

    var valid = true; /* assume all good to start */

    /* Check each field — trim() removes spaces from start/end */
    if (name.value.trim() === '') {
      highlightError(name);    /* shake + red border */
      valid = false;
    }

    if (email.value.trim() === '') {
      highlightError(email);
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      /* Extra check: make sure the email looks like an email */
      highlightError(email);
      valid = false;
    }

    if (message.value.trim() === '') {
      highlightError(message);
      valid = false;
    }

    return valid;
  }


  /* ================================================================
     FUNCTION: isValidEmail
     Uses a simple pattern to check an email address looks correct.
     (e.g. "user@example.com" passes, "hello" does not)
  ================================================================ */
  function isValidEmail(emailStr) {
    /* Regular expression: must have characters, @, more characters, dot, domain */
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(emailStr);
  }


  /* ================================================================
     FUNCTION: highlightError
     Adds a red-shake animation to an invalid input field.
     The animation is defined in contactform.css.
  ================================================================ */
  function highlightError(field) {
    /* Add the error class */
    field.style.borderColor = 'rgba(220, 60, 60, 0.70)';
    field.style.boxShadow   = '0 0 0 3px rgba(220, 60, 60, 0.15)';

    /* Shake animation using CSS keyframes triggered by a class */
    field.style.animation = 'cf-shake 0.40s ease';

    /* Clear the error style when the user starts typing again */
    field.addEventListener('input', function clearError() {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
      field.style.animation   = '';
      /* Remove listener so it only fires once */
      field.removeEventListener('input', clearError);
    });

    /* Remove the shake animation class after it finishes */
    setTimeout(function () {
      field.style.animation = '';
    }, 450);
  }


  /* ================================================================
     FUNCTION: clearForm
     Empties all form fields after a successful submission.
  ================================================================ */
  function clearForm(name, email, message) {
    name.value    = '';
    email.value   = '';
    message.value = '';
  }


  /* ================================================================
     FUNCTION: showSuccessPopup
     Builds the popup HTML structure, adds it to the page,
     then fades it in. Sets a 5-second timer to auto-close.
  ================================================================ */
  function showSuccessPopup() {

    /* ── Build the backdrop element (dark blurred overlay) ──── */
    var backdrop = document.createElement('div');
    backdrop.className = 'cf-backdrop';
    backdrop.id        = 'cf-backdrop';   /* unique id for easy lookup */

    /* ── Build the popup card HTML string ───────────────────── */
    /* This is the inner card with icon, text, progress bar, and
       close button. We write it as an HTML string and then
       set it as the card's innerHTML (inner content). */
    var popupHTML =
      '<div class="cf-popup" id="cf-popup" role="dialog" aria-live="polite" aria-label="Message sent confirmation">'

        /* Close button — top-right ✕ */
      + '<button class="cf-close-btn" id="cf-close-btn" aria-label="Close notification" title="Close">✕</button>'

        /* Success icon — glowing circle with animated checkmark */
      + '<div class="cf-icon-wrap">'
      +   '<div class="cf-icon-circle">'
      +     '<svg class="cf-check-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
      +       '<path class="cf-check-path" d="M7 16.5 L13 22.5 L25 10"/>'
      +     '</svg>'
      +   '</div>'
      + '</div>'

        /* Heading text */
      + '<h2 class="cf-title">Message Sent Successfully!</h2>'

        /* Subtext */
      + '<p class="cf-subtitle">Thank you for your feedback.<br>'
      + '<span>We\'ll get back to you as soon as possible.</span></p>'

        /* Progress bar — shows 5-second countdown */
      + '<div class="cf-progress-track">'
      +   '<div class="cf-progress-bar" id="cf-progress-bar"></div>'
      + '</div>'

      + '</div>'; /* end .cf-popup */

    /* Put the popup card inside the backdrop */
    backdrop.innerHTML = popupHTML;

    /* ── Add the backdrop (with popup inside) to the page ───── */
    document.body.appendChild(backdrop);

    /* ── STEP: Trigger the fade-in (tiny delay lets CSS load) ── */
    /* requestAnimationFrame waits for the browser to paint once,
       then we add the .cf-visible class to start the animation. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        backdrop.classList.add('cf-visible');   /* fade in backdrop */

        /* Start the progress bar countdown animation */
        var bar = document.getElementById('cf-progress-bar');
        if (bar) {
          bar.classList.add('cf-running');       /* triggers CSS animation */
        }
      });
    });

    /* ── STEP: Wire up the close button ─────────────────────── */
    /* Find the close button we just created and add a click listener */
    var closeBtn = document.getElementById('cf-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        hidePopup(backdrop);   /* fade out and remove */
      });
    }

    /* ── STEP: Also close if user clicks the backdrop itself ─── */
    backdrop.addEventListener('click', function (event) {
      /* Only close if the click was on the backdrop, not the popup card */
      if (event.target === backdrop) {
        hidePopup(backdrop);
      }
    });

    /* ── STEP: Auto-dismiss after 5000ms (5 seconds) ─────────── */
    var autoCloseTimer = setTimeout(function () {
      hidePopup(backdrop);
    }, 5000); /* 5000 milliseconds = 5 seconds */

    /* If user closes manually, cancel the auto-dismiss timer */
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        clearTimeout(autoCloseTimer);
      });
    }

    /* Also cancel auto-dismiss if backdrop click closes it */
    backdrop.addEventListener('click', function () {
      clearTimeout(autoCloseTimer);
    });

  } /* end showSuccessPopup */


  /* ================================================================
     FUNCTION: hidePopup
     Fades the popup out smoothly, then removes it from the page.
     We add .cf-hiding to trigger the CSS fade-out, then wait for
     the animation to finish before deleting the element.
  ================================================================ */
  function hidePopup(backdrop) {

    /* Add hiding class → triggers CSS scale-down + fade-out */
    backdrop.classList.add('cf-hiding');
    backdrop.classList.remove('cf-visible');

    /* Wait for the animation to complete (400ms), then remove the element */
    setTimeout(function () {
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
        /* removeChild() deletes the element from the DOM entirely */
      }
    }, 450); /* matches the CSS transition duration */

  } /* end hidePopup */


}); /* end DOMContentLoaded */


/* ================================================================
   GLOBAL CSS KEYFRAME — shake animation for invalid fields
   Injected via a <style> tag so it stays in this JS file only.
   ================================================================ */
(function injectShakeKeyframe() {
  /* Create a <style> element and add it to the document <head> */
  var style = document.createElement('style');
  style.textContent =
    /* Shake: quickly nudge the element left and right */
    '@keyframes cf-shake {'
    + '0%,100% { transform: translateX(0);   }'
    + '18%      { transform: translateX(-7px); }'
    + '36%      { transform: translateX(6px);  }'
    + '54%      { transform: translateX(-5px); }'
    + '72%      { transform: translateX(4px);  }'
    + '90%      { transform: translateX(-2px); }'
    + '}';
  document.head.appendChild(style);
})();
