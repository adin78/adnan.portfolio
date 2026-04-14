/* ═══════════════════════════════════════════════════════
   KEYWORD GAP FINDER — tools/keyword-gap-finder.js
   ──────────────────────────────────────────────────────
   Standalone ASO tool. Zero external dependencies.
   Can be dropped into any page that has the matching
   HTML structure (#keywordGapTool), or imported as a
   module. Safe to remove entirely without breaking
   the rest of the portfolio.
   ═══════════════════════════════════════════════════════ */

(function KeywordGapFinderModule() {
  'use strict';

  // ── Priority scoring heuristics ─────────────────────
  // Weights are illustrative / mock (no live API).
  const PRIORITY_LABELS = ['Low', 'Medium', 'High', 'Very High'];

  function scorePriority(kw) {
    let score = 0;
    const len = kw.length;
    // Longer, more specific phrases score higher
    if (len > 20) score += 3;
    else if (len > 12) score += 2;
    else if (len > 6) score += 1;
    // Common high-value ASO signals
    const highValueWords = ['best', 'free', 'app', 'game', 'pro', 'top', 'fast', 'easy', 'tracker', 'tool', 'guide', 'ai', 'offline', 'workout', 'meditation', 'budget', 'learn', 'study', 'sleep', 'music'];
    const words = kw.toLowerCase().split(/\s+/);
    words.forEach(w => { if (highValueWords.includes(w)) score += 1; });
    // Multi-word = long-tail = higher intent
    if (words.length >= 3) score += 2;
    else if (words.length === 2) score += 1;
    return Math.min(score, 3);
  }

  // ── Parse comma/newline-separated keyword list ───────
  function parseKeywords(raw, filterShort = true) {
    return raw
      .split(/[,\n]+/)
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0)
      .filter(k => filterShort ? k.length >= 3 : true)
      .reduce((acc, k) => { if (!acc.includes(k)) acc.push(k); return acc; }, []);
  }

  // ── Core gap analysis ────────────────────────────────
  function analyzeGaps(myKws, compKws) {
    const mySet   = new Set(myKws);
    const compSet = new Set(compKws);

    const gaps    = compKws.filter(k => !mySet.has(k));
    const shared  = myKws.filter(k => compSet.has(k));
    const unique  = myKws.filter(k => !compSet.has(k));

    return { gaps, shared, unique };
  }

  // ── Render keyword chips ─────────────────────────────
  function renderChips(container, keywords, cls, showPriority) {
    if (keywords.length === 0) {
      container.innerHTML = `<p style="color:var(--text-faint);font-size:0.82rem;font-family:var(--font-mono);padding:0.5rem 0;">No keywords in this category.</p>`;
      return;
    }
    const grid = document.createElement('div');
    grid.className = 'keyword-grid';
    keywords.forEach(kw => {
      const tag = document.createElement('span');
      tag.className = `kw-tag ${cls}`;
      tag.textContent = kw;
      if (showPriority) {
        const score = scorePriority(kw);
        const badge = document.createElement('span');
        badge.className = 'kw-priority';
        badge.textContent = PRIORITY_LABELS[score];
        tag.appendChild(badge);
      }
      tag.title = kw;
      grid.appendChild(tag);
    });
    container.innerHTML = '';
    container.appendChild(grid);
  }

  // ── CSV Export ────────────────────────────────────────
  function exportCSV(data) {
    const rows = [
      ['Type', 'Keyword', 'Priority'],
      ...data.gaps.map(k => ['Gap (Missing)', k, PRIORITY_LABELS[scorePriority(k)]]),
      ...data.shared.map(k => ['Shared', k, '-']),
      ...data.unique.map(k => ['Your Exclusive', k, '-']),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'keyword-gap-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Init ─────────────────────────────────────────────
  function init() {
    const toolEl  = document.getElementById('keywordGapTool');
    if (!toolEl) return; // tool not present on this page — silent exit

    const myInput   = document.getElementById('myKeywords');
    const compInput = document.getElementById('competitorKeywords');
    const runBtn    = document.getElementById('runGapFinder');
    const results   = document.getElementById('gapResults');
    const metaEl    = document.getElementById('resultsMeta');
    const gapsPane  = document.getElementById('gapsPane');
    const sharedPane= document.getElementById('sharedPane');
    const uniquePane= document.getElementById('uniquePane');
    const tabs      = document.querySelectorAll('.rtab');
    const exportBtn = document.getElementById('exportResults');
    const clearBtn  = document.getElementById('clearTool');
    const filterChk = document.getElementById('filterShort');
    const prioChk   = document.getElementById('priorityMode');

    let lastData = null;

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        gapsPane.classList.toggle('hidden',   target !== 'gaps');
        sharedPane.classList.toggle('hidden', target !== 'shared');
        uniquePane.classList.toggle('hidden', target !== 'unique');
      });
    });

    // Run analysis
    runBtn.addEventListener('click', () => {
      const filterShort = filterChk.checked;
      const showPrio    = prioChk.checked;

      const myRaw   = myInput.value.trim();
      const compRaw = compInput.value.trim();

      if (!myRaw && !compRaw) {
        shakeEl(myInput);
        return;
      }

      const myKws   = parseKeywords(myRaw,   filterShort);
      const compKws = parseKeywords(compRaw, filterShort);

      const data = analyzeGaps(myKws, compKws);
      lastData = data;

      // Update meta
      metaEl.textContent = `${data.gaps.length} gaps · ${data.shared.length} shared · ${data.unique.length} exclusive · analyzed ${myKws.length + compKws.length} total keywords`;

      // Render panes
      renderChips(gapsPane,   data.gaps,   'gap-kw',    showPrio);
      renderChips(sharedPane, data.shared, 'shared-kw', false);
      renderChips(uniquePane, data.unique, 'unique-kw', false);

      // Reset to first tab
      tabs.forEach(t => t.classList.remove('active'));
      tabs[0].classList.add('active');
      gapsPane.classList.remove('hidden');
      sharedPane.classList.add('hidden');
      uniquePane.classList.add('hidden');

      // Show results panel
      results.classList.remove('hidden');
      results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Export
    exportBtn.addEventListener('click', () => {
      if (lastData) exportCSV(lastData);
    });

    // Clear
    clearBtn.addEventListener('click', () => {
      myInput.value = '';
      compInput.value = '';
      results.classList.add('hidden');
      lastData = null;
    });

    // Re-render on priority toggle (if results visible)
    prioChk.addEventListener('change', () => {
      if (!lastData) return;
      renderChips(gapsPane, lastData.gaps, 'gap-kw', prioChk.checked);
    });
  }

  // ── Boot after DOM ready ──────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Tiny shake helper for empty input ────────────────
  function shakeEl(el) {
    el.style.transition = 'transform 0.1s';
    const shake = [8, -8, 6, -6, 4, -4, 0];
    let i = 0;
    const next = () => {
      if (i >= shake.length) { el.style.transform = ''; return; }
      el.style.transform = `translateX(${shake[i++]}px)`;
      setTimeout(next, 60);
    };
    next();
    el.focus();
  }

  // ── Public API (if consumed as module) ───────────────
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseKeywords, analyzeGaps, scorePriority, exportCSV };
  }

})();
