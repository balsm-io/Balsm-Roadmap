/**
 * P001 Prototype shell controller.
 * Vanilla JS, no frameworks. Loads flow graph + i18n + screen metadata,
 * wires toolbar toggles, screen routing, notes panel.
 */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const html = document.documentElement;
  const stateKey = 'balsm-proto-state';
  const state = loadState() || { screen: 'auth-country', theme: 'light', locale: 'en', frame: 'ios' };

  function loadState() {
    try { return JSON.parse(localStorage.getItem(stateKey)); } catch { return null; }
  }
  function saveState() {
    try { localStorage.setItem(stateKey, JSON.stringify(state)); } catch {}
  }

  // ───────────────────────── i18n catalog ─────────────────────────
  let catalog = null;
  let flows = null;
  let metaCatalog = null;

  Promise.all([
    fetch('assets/data.json').then(r => r.json()).catch(() => ({})),
    fetch('flows.json').then(r => r.json()).catch(() => ({})),
  ]).then(([data, flowsJson]) => {
    catalog = data.i18n || {};
    metaCatalog = data.meta || {};
    flows = flowsJson;
    applyState();
    setStatus('Ready');
  }).catch(err => {
    setStatus('Failed to load data');
    console.error(err);
    applyState();
  });

  function setStatus(text) {
    const el = $('#status');
    if (el) el.textContent = text;
  }

  // ───────────────────────── apply state ──────────────────────────
  function applyState() {
    // Theme
    html.setAttribute('data-theme', state.theme);
    $$('[data-theme-btn]').forEach(b => {
      b.classList.toggle('proto-toolbar__toggle--active', b.dataset.themeBtn === state.theme);
    });

    // Locale + direction
    const rtl = state.locale.startsWith('ar');
    html.setAttribute('lang', state.locale);
    html.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    html.setAttribute('data-locale', state.locale);
    const select = $('#locale-select');
    if (select) select.value = state.locale;

    // Frame
    const deviceEl = $('#device');
    const isWeb = state.frame === 'web';
    deviceEl.classList.toggle('device--web', isWeb);
    $$('[data-frame-btn]').forEach(b => {
      b.classList.toggle('proto-toolbar__toggle--active', b.dataset.frameBtn === state.frame);
    });

    // Active screen
    setScreen(state.screen);

    // Apply translations
    applyI18n();

    saveState();
  }

  function setScreen(id) {
    // Some screens force a specific frame (web public routes)
    const target = $(`section.screen[data-screen="${id}"]`);
    if (!target) return;
    const forcedFrame = target.dataset.frame;
    if (forcedFrame && forcedFrame !== state.frame) {
      state.frame = forcedFrame;
      const deviceEl = $('#device');
      deviceEl.classList.toggle('device--web', forcedFrame === 'web');
      $$('[data-frame-btn]').forEach(b => {
        b.classList.toggle('proto-toolbar__toggle--active', b.dataset.frameBtn === forcedFrame);
      });
    }

    $$('.screen').forEach(s => s.classList.toggle('screen--active', s.dataset.screen === id));
    $$('.proto-rail__item').forEach(b => b.classList.toggle('proto-rail__item--active', b.dataset.screen === id));
    state.screen = id;

    // Reset scroll
    const viewport = $('#viewport');
    if (viewport) viewport.scrollTop = 0;

    // Update notes panel
    updateNotes(id);
    saveState();
  }

  function updateNotes(id) {
    const meta = (metaCatalog && metaCatalog[id]) || {};
    const set = (sel, text) => { const el = $(sel); if (el && text != null) el.textContent = text; };
    set('#notes-id', id);
    set('#notes-title', meta.title || id);
    set('#notes-us', meta.us || '—');
    set('#notes-fr', meta.fr || '—');
    set('#notes-sc', meta.sc || '—');
    const rules = $('#notes-rules');
    if (rules && meta.rules) {
      rules.innerHTML = meta.rules.map(r => `<li>${r}</li>`).join('');
    }
    // Layout/A11y/RTL rows: meta.layout / meta.a11y / meta.rtl
    const rows = $$('.proto-notes__row');
    if (rows[3] && meta.layout) rows[3].querySelector('dd').textContent = meta.layout;
    if (rows[4] && meta.a11y) rows[4].querySelector('dd').textContent = meta.a11y;
    if (rows[5] && meta.rtl) rows[5].querySelector('dd').textContent = meta.rtl;
  }

  function applyI18n() {
    if (!catalog) return;
    const dict = catalog[state.locale] || catalog['en'] || {};
    const fallback = catalog['en'] || {};
    $$('[data-t]').forEach(el => {
      const key = el.dataset.t;
      const val = dict[key] || fallback[key];
      if (val != null) el.textContent = val;
    });
    $$('[data-t-placeholder]').forEach(el => {
      const key = el.dataset.tPlaceholder;
      const val = dict[key] || fallback[key];
      if (val != null) el.setAttribute('placeholder', val);
    });
    $$('[data-t-aria]').forEach(el => {
      const key = el.dataset.tAria;
      const val = dict[key] || fallback[key];
      if (val != null) el.setAttribute('aria-label', val);
    });
    // Flip back-chevron icons for RTL using transform via CSS
    const rtl = state.locale.startsWith('ar');
    $$('.appbar__back-icon').forEach(svg => {
      svg.style.transform = rtl ? 'scaleX(-1)' : '';
    });
  }

  // ───────────────────────── event wiring ──────────────────────────
  $('#locale-select')?.addEventListener('change', e => {
    state.locale = e.target.value;
    applyState();
  });
  $$('[data-theme-btn]').forEach(b => {
    b.addEventListener('click', () => {
      state.theme = b.dataset.themeBtn;
      applyState();
    });
  });
  $$('[data-frame-btn]').forEach(b => {
    b.addEventListener('click', () => {
      state.frame = b.dataset.frameBtn;
      applyState();
    });
  });
  $$('.proto-rail__item').forEach(b => {
    b.addEventListener('click', () => setScreen(b.dataset.screen));
  });

  // Keyboard nav: arrow up/down through rail
  window.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea, select')) return;
    const items = $$('.proto-rail__item');
    const idx = items.findIndex(i => i.dataset.screen === state.screen);
    if (e.key === 'ArrowDown' && idx >= 0 && idx < items.length - 1) {
      e.preventDefault();
      items[idx + 1].click();
      items[idx + 1].focus();
    } else if (e.key === 'ArrowUp' && idx > 0) {
      e.preventDefault();
      items[idx - 1].click();
      items[idx - 1].focus();
    }
  });

  // Initial paint before async
  applyState();
})();
