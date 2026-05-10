/* ============================================================
   NAV.JS — Mobile navigation drawer & active link highlighting
   ============================================================ */

(function () {
  'use strict';

  /* ── Mark the current page's nav link as active ── */
  function setActiveLink() {
    var path  = window.location.pathname;
    var links = document.querySelectorAll('.nav-links a, .nav-drawer a');

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      /* Normalise: remove leading ./ and trailing / */
      var normHref = href.replace(/^\.\//, '').replace(/\/$/, '');
      var normPath = path.split('/').pop().replace(/\/$/, '');

      /* Home page: match empty path or index.html */
      var isHome = (normPath === '' || normPath === 'index.html');
      var linkIsHome = (normHref === '' || normHref === 'index.html');

      if (isHome && linkIsHome) {
        link.classList.add('active');
      } else if (!isHome && normPath && normHref.includes(normPath)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }

      /* Never mark the CTA pill as "active" */
      if (link.classList.contains('nav-cta')) {
        link.classList.remove('active');
      }
    });
  }

  /* ── Mobile hamburger toggle ── */
  function initMobileNav() {
    var hamburger = document.querySelector('.nav-hamburger');
    var drawer    = document.querySelector('.nav-drawer');

    if (!hamburger || !drawer) return;

    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('open');
      drawer.classList.toggle('open', isOpen);
      /* Prevent body scroll when drawer is open */
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close drawer when a drawer link is clicked */
    var drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    /* Close drawer on outside click */
    document.addEventListener('click', function (e) {
      if (drawer.classList.contains('open') &&
          !drawer.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Scroll-shadow on nav ── */
  function initNavShadow() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.style.boxShadow = 'var(--shadow)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ── Initialise ── */
  document.addEventListener('DOMContentLoaded', function () {
    setActiveLink();
    initMobileNav();
    initNavShadow();
  });

}());
