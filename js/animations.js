/* ============================================================
   ANIMATIONS.JS — Scroll reveal, counter animation, network graph
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     SCROLL REVEAL — IntersectionObserver
     Adds .in-view to .reveal elements when they enter the viewport
     ───────────────────────────────────────── */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    /* Use IntersectionObserver for performance */
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          /* Stop observing once revealed */
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,      /* Trigger when 12% visible */
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ─────────────────────────────────────────
     COUNTER ANIMATION — Animates numeric values
     Triggered when element enters viewport
     ───────────────────────────────────────── */
  function animateCounter(el, target, duration, suffix) {
    var start     = 0;
    var startTime = null;
    var isDecimal = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* Ease-out cubic */
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      /* Format: decimal or integer */
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el      = entry.target;
          var target  = parseFloat(el.getAttribute('data-counter'));
          var suffix  = el.getAttribute('data-suffix') || '';
          var dur     = parseInt(el.getAttribute('data-duration') || '1800', 10);
          animateCounter(el, target, dur, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ─────────────────────────────────────────
     NETWORK GRAPH — Canvas animation for hero
     Renders animated nodes connected by edges
     ───────────────────────────────────────── */
  function initNetworkGraph() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    var ctx    = canvas.getContext('2d');
    var W, H;
    var nodes  = [];
    var raf;

    /* Node count and connection distance */
    var NODE_COUNT    = 42;
    var CONNECT_DIST  = 140;
    var NODE_SPEED    = 0.35;

    /* Read accent colour from CSS variable */
    function getAccent() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--accent').trim() || '#00e5ff';
    }
    function getTextDim() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--text-3').trim() || '#4b5563';
    }

    /* Resize canvas to fill container */
    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width  = rect.width  || 520;
      H = canvas.height = rect.height || 400;
    }

    /* Create nodes with random position and velocity */
    function createNodes() {
      nodes = [];
      for (var i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: (Math.random() - 0.5) * NODE_SPEED,
          vy: (Math.random() - 0.5) * NODE_SPEED,
          r:  Math.random() * 2 + 1  /* radius 1–3px */
        });
      }
    }

    /* Move nodes, bounce off walls */
    function updateNodes() {
      nodes.forEach(function (n) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
    }

    /* Draw everything each frame */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var accent = getAccent();
      var dim    = getTextDim();

      /* Draw edges between close nodes */
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx   = nodes[i].x - nodes[j].x;
          var dy   = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            /* Opacity fades with distance */
            var alpha = (1 - dist / CONNECT_DIST) * 0.45;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = accent;
            ctx.globalAlpha = alpha;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }

      /* Draw nodes */
      nodes.forEach(function (n) {
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
    }

    /* Animation loop */
    function loop() {
      updateNodes();
      draw();
      raf = requestAnimationFrame(loop);
    }

    /* Stop animation when canvas is hidden (performance) */
    function setupVisibility() {
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          cancelAnimationFrame(raf);
        } else {
          loop();
        }
      });
    }

    /* Init */
    resize();
    createNodes();
    loop();
    setupVisibility();

    /* Re-initialise on window resize */
    window.addEventListener('resize', function () {
      resize();
      createNodes();
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     TICKER — Duplicate ticker content for seamless loop
     ───────────────────────────────────────── */
  function initTicker() {
    var inner = document.querySelector('.ticker-inner');
    if (!inner) return;

    /* Clone content so the animation loops seamlessly */
    var clone = inner.cloneNode(true);
    inner.parentElement.appendChild(clone);
  }

  /* ─────────────────────────────────────────
     CONTACT FORM — Simple submit handler
     (Static site: uses mailto fallback; swap with Formspree endpoint)
     ───────────────────────────────────────── */
  function initContactForm() {
    var form    = document.getElementById('contact-form');
    var success = document.getElementById('form-success');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Collect form data */
      var data = new FormData(form);

      /* Formspree endpoint — replace YOUR_ID with actual Formspree form ID */
      var endpoint = form.getAttribute('data-action') || '#';

      /* If no real endpoint, show success state as demo */
      if (endpoint === '#') {
        showSuccess();
        return;
      }

      /* Submit to Formspree (or any endpoint) */
      fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          showSuccess();
        } else {
          alert('Something went wrong. Please email us directly.');
        }
      })
      .catch(function () {
        alert('Network error. Please email us directly.');
      });
    });

    /* Show success message, hide form */
    function showSuccess() {
      form.style.display = 'none';
      if (success) success.classList.add('visible');
    }
  }

  /* ─────────────────────────────────────────
     INIT — Run all modules on DOM ready
     ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initCounters();
    initNetworkGraph();
    initTicker();
    initContactForm();
  });

}());
