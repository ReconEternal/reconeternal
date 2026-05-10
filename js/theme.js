/* ============================================================
   THEME.JS — Dark / Light theme toggle logic
   Persists preference in localStorage for cross-page consistency
   ============================================================ */

(function () {
  'use strict';

  /* ── Constants ── */
  const STORAGE_KEY = 'recon-theme';
  const LIGHT       = 'light';
  const DARK        = 'dark';

  /* ── Apply theme to <html> element ── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === LIGHT ? LIGHT : '');
    /* Update all toggle button icons on the page */
    updateToggleIcons(theme);
  }

  /* ── Update the sun/moon icon inside the toggle button ── */
  function updateToggleIcons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(function (btn) {
      /* Sun icon for dark mode (clicking will go to light) */
      /* Moon icon for light mode (clicking will go to dark) */
      btn.setAttribute('aria-label', theme === LIGHT ? 'Switch to dark theme' : 'Switch to light theme');
      btn.innerHTML = theme === LIGHT ? getSunIcon() : getMoonIcon();
    });
  }

  /* ── Moon SVG icon (shown in light theme) ── */
  function getMoonIcon() {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" ' +
      'fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ── Sun SVG icon (shown in dark theme) ── */
  function getSunIcon() {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* ── Read saved preference or default to dark ── */
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DARK;
    } catch (e) {
      /* localStorage may be blocked (private browsing etc.) */
      return DARK;
    }
  }

  /* ── Save theme preference ── */
  function saveTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
  }

  /* ── Toggle between dark and light ── */
  function toggleTheme() {
    var current = getSavedTheme();
    var next    = current === DARK ? LIGHT : DARK;
    saveTheme(next);
    applyTheme(next);
  }

  /* ── Attach click listener to all toggle buttons ── */
  function attachListeners() {
    var buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
  }

  /* ── Initialise on DOM ready ── */
  function init() {
    var saved = getSavedTheme();
    applyTheme(saved);
    attachListeners();
  }

  /* Run before paint to prevent flash of wrong theme */
  if (document.readyState === 'loading') {
    /* Apply colours immediately to avoid FOUT */
    var savedEarly = getSavedTheme();
    document.documentElement.setAttribute('data-theme', savedEarly === LIGHT ? LIGHT : '');
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
