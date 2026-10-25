/* =====================================================================
   720-core — config-driven question engine (shared; vendored per unit)
   Question types: single | multi | dual-select | value-input
   Hint policies per _question-template-defaults.md:
     'always' (default) | 'after-wrong' (hidden until first incorrect attempt)

   The unit must define BEFORE this file runs (js/questions.js):
     QUESTIONS — array of question configs (see unit questions.js for shape)
   Requires in index.html: #quiz-hint-overlay (shared hint popup, outside screens).
   ===================================================================== */

'use strict';

/* Applet (יישומון) embed — iframe + fullscreen-zoom button.
   Zoom expands the SAME iframe in place (CSS class), never a second
   instance — learner input inside the applet persists across zoom.
   Toggle handler is delegated in engine.js. */
function appletEmbed(src, title) {
  return `<div class="applet-embed">
    <button class="applet-zoom-btn" type="button" data-applet-toggle="open"
      aria-label="تكبير التطبيق إلى ملء الشاشة"><svg width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" stroke-width="2"/><line x1="13.5" y1="13.5" x2="19" y2="19" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg></button>
    <button class="applet-zoom-btn applet-close-btn" type="button" data-applet-toggle="close"
      aria-label="إغلاق الشاشة الكاملة"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><line x1="2" y1="2" x2="13" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="13" y1="2" x2="2" y2="13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>
    <iframe src="${src}" title="${title || 'تطبيق'}" loading="lazy"></iframe>
  </div>`;
}


/* Question progress stepper (סרגל שאלה) — q.step = {group, index, total}.
   States derive from sibling questions in the same group. */
/* the approved hint-button icon (outline lamp), vendored from percent-04 */
const HINT_ICON = `<svg class="scq-hint-icon" viewBox="0 0 25.9999 22.2883" fill="none" aria-hidden="true"><path d="M17.7925 2.76345C16.3676 1.37911 14.5057 0.68776 12.5488 0.815545C9.07995 1.04163 6.27286 3.9168 6.01796 7.50134C5.85646 9.77363 6.7035 11.9443 8.34374 13.4548C9.23036 14.2723 9.74016 15.465 9.74016 16.7265H11.2284H14.7733H16.2615C16.2615 15.4847 16.7919 14.2707 17.7181 13.3959C19.17 12.0263 20.0012 10.0751 20.0012 8.04361C20.0012 6.01215 19.1953 4.12486 17.7909 2.76018L17.7925 2.76345ZM13.0001 5.54524C11.6701 5.54524 10.5856 6.66582 10.5856 8.04525C10.5856 8.46956 10.2515 8.81524 9.84149 8.81524C9.43143 8.81524 9.09736 8.46956 9.09736 8.04525C9.09736 5.8172 10.8484 4.00527 13.0001 4.00527C13.4133 4.00527 13.7473 4.35094 13.7473 4.77525C13.7473 5.19957 13.4133 5.54524 13.0001 5.54524Z" fill="currentColor"/><path d="M9.73858 19.6245C9.73858 20.3289 9.99823 20.9908 10.478 21.4904L10.4938 21.5068C10.9783 22.0098 11.6242 22.2883 12.3114 22.2883H13.6888C14.3775 22.2883 15.025 22.0114 15.5111 21.5052C15.9956 21.0039 16.2631 20.3355 16.2631 19.6277V17.9895H9.73858V19.6245ZM11.2268 19.5294H14.7717V19.6277C14.7717 19.9243 14.6609 20.2077 14.4566 20.419C14.254 20.6254 13.9753 20.7483 13.6888 20.7483H12.3114C12.028 20.7483 11.7588 20.6336 11.5561 20.4305L11.5451 20.4174C11.3424 20.211 11.2268 19.9226 11.2268 19.6261V19.5311V19.5294Z" fill="currentColor"/><path d="M25.2558 7.27531H22.607C22.1954 7.27531 21.8629 7.62099 21.8629 8.0453C21.8629 8.46961 22.197 8.81529 22.607 8.81529H25.2558C25.6674 8.81529 25.9999 8.46961 25.9999 8.0453C25.9999 7.62099 25.6658 7.27531 25.2558 7.27531Z" fill="currentColor"/><path d="M4.1386 8.0453C4.1386 7.61935 3.80453 7.27531 3.39447 7.27531H0.744124C0.332481 7.27531 0 7.62099 0 8.0453C0 8.46961 0.334064 8.81529 0.744124 8.81529H3.39289C3.80453 8.81529 4.13701 8.46961 4.13701 8.0453H4.1386Z" fill="currentColor"/><path d="M20.8702 3.11398C21.0175 3.11398 21.1663 3.06811 21.2961 2.97472L23.4667 1.40198C23.804 1.15788 23.8847 0.677863 23.6488 0.328911C23.4129 -0.0200418 22.949 -0.105232 22.6118 0.140509L20.4412 1.71325C20.1039 1.95736 20.0232 2.43737 20.2591 2.78632C20.4032 3.00094 20.6343 3.11562 20.8702 3.11562V3.11398Z" fill="currentColor"/><path d="M4.70372 13.1172L2.53309 14.69C2.19586 14.9341 2.11512 15.4141 2.35102 15.763C2.49509 15.9777 2.72625 16.0923 2.96215 16.0923C3.10939 16.0923 3.25822 16.0465 3.38804 15.9531L5.55867 14.3803C5.8959 14.1362 5.97665 13.6562 5.74074 13.3073C5.50484 12.9583 5.04095 12.8731 4.70372 13.1189V13.1172Z" fill="currentColor"/><path d="M23.4668 14.6884L21.2961 13.1157C20.9589 12.8716 20.495 12.9567 20.2591 13.3041C20.0232 13.653 20.1055 14.133 20.4412 14.3771L22.6118 15.9499C22.7416 16.0449 22.8904 16.0891 23.0377 16.0891C23.272 16.0891 23.5032 15.9744 23.6488 15.7598C23.8847 15.4109 23.8024 14.9309 23.4668 14.6868V14.6884Z" fill="currentColor"/><path d="M5.55869 1.71322L3.38806 0.140478C3.05083 -0.103625 2.58694 -0.0184349 2.35104 0.328879C2.11513 0.677832 2.19746 1.15785 2.53311 1.40195L4.70374 2.97469C4.83356 3.06971 4.98239 3.11395 5.12963 3.11395C5.36395 3.11395 5.5951 2.99927 5.74076 2.78465C5.97666 2.4357 5.89434 1.95569 5.55869 1.71158V1.71322Z" fill="currentColor"/></svg>`;

const QP_TICK = '<svg class="qp-tick" viewBox="0 0 12 12" fill="none"><path d="M1.5 6.2l3 3 6-6.4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const QP_X = '<svg class="qp-x" viewBox="0 0 12 12" fill="none"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';

/* The APPROVED practice strip (percent-04 / ratio-01-01 `qprog`), not the
   core's plainer `.qstepper`: stations carry the learner's real result as a
   ✓/✕ badge. `.qprog` is direction:rtl, so the first child is the RIGHTMOST
   station and station 1 comes first. */
function quizStepperHTML(q) {
  const parts = [];
  for (let i = 1; i <= q.step.total; i++) {
    const label = (q.step.labels && q.step.labels[i - 1]) || `سؤال ${i}`;
    parts.push(`<div class="qprog-station" data-step="${i}">` +
      `<span class="qprog-dot">${QP_TICK}${QP_X}</span>` +
      `<span class="qprog-label">${label}</span></div>`);
    if (i < q.step.total) parts.push('<span class="qprog-line"></span>');
  }
  return `<div class="qprog" data-group="${q.step.group}" aria-hidden="true">${parts.join('')}</div>`;
}

function quizStepperUpdate(screen) {
  const q = QUESTIONS.find(x => x.screen === screen);
  if (!q || !q.step) return;
  const group = QUESTIONS.filter(x => x.step && x.step.group === q.step.group);
  const bar = document.querySelector(`#q${screen} .qprog`);
  if (!bar) return;
  bar.querySelectorAll('.qprog-station').forEach(el => {
    const i = Number(el.dataset.step);
    /* a step may span several screens (sub-questions א/ב) — aggregate them:
       done only when all parts are done, correct only when all parts correct */
    const sibs = group.filter(x => x.step.index === i);
    const sts = sibs.map(x => quizState[x.screen]).filter(Boolean);
    const allDone = sts.length === sibs.length && sts.every(st => st.done);
    const allCorrect = allDone && sts.every(st => st.wasCorrect);
    el.classList.toggle('is-current', i === q.step.index);
    el.classList.toggle('is-correct', allDone && allCorrect);
    el.classList.toggle('is-wrong', allDone && !allCorrect);
  });
  bar.querySelectorAll('.qprog-line').forEach((ln, k) => {
    const sibs = group.filter(x => x.step.index === k + 1);
    const sts = sibs.map(x => quizState[x.screen]).filter(Boolean);
    ln.classList.toggle('is-done', sts.length === sibs.length && sts.every(st => st.done));
  });
}

/* Per-question runtime state, keyed by screen number — survives navigation */
const quizState = {};

function quizBuildScreens() {
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay'); // insert screens before overlay
  QUESTIONS.forEach(q => {
    /* one shared questions.js for the whole unit: a component builds only the
       screens inside its own range */
    if (window.PART_CONFIG &&
        (q.screen < window.PART_CONFIG.start || q.screen > window.PART_CONFIG.end)) return;
    quizState[q.screen] = { attempts: 0, done: false, hintUsed: false, selected: null, selectedSet: [] };
    const sec = document.createElement('section');
    /* `dense` tightens a screen that carries a lot (long options + a table).
       A CLASS, not `#qNN` — question numbers shift whenever a screen is
       inserted, and number-keyed CSS silently stops matching. */
    sec.className = 'screen quiz-screen' + (q.dense ? ' is-dense' : '') + (q.noZoom ? ' is-nozoom' : '');
    sec.dataset.screen = q.screen;
    sec.id = `q${q.screen}`;
    sec.innerHTML = `
      ${q.step ? quizStepperHTML(q) : (q.label ? `<div class="scq-progress">${q.label}</div>` : '')}
      <div class="quiz-cols">
        <div class="quiz-main" data-reveal="1">
          <div class="quiz-stem">${q.stem}</div>
          ${q.popup ? `<button class="popup-trigger" type="button"
            onclick="document.getElementById('q${q.screen}-note-popup').classList.remove('hidden')">${q.popup.trigger}</button>` : ''}
          ${quizInteractionHTML(q)}
        </div>
        ${q.content ? `<div class="quiz-content" data-reveal="2"${q.content.includes('applet-embed') ? ' data-reveal-fade' : ''}>${q.content}</div>` : ''}
      </div>
      ${q.popup ? `<div class="note-popup m-popup hidden" id="q${q.screen}-note-popup" role="dialog" aria-modal="true" aria-label="${q.popup.title}">
        <div class="note-popup-panel">
          <button class="popup-x" type="button" aria-label="إغلاق"
            onclick="document.getElementById('q${q.screen}-note-popup').classList.add('hidden')"></button>
          <h3>${q.popup.title}</h3>
          <div class="note-popup-body">${q.popup.body}</div>
          <button class="hint-close-btn" type="button"
            onclick="document.getElementById('q${q.screen}-note-popup').classList.add('hidden')">رجوع</button>
        </div>
      </div>` : ''}
      <div class="quiz-feedbox" id="q${q.screen}-feedbox"></div>
      <div class="scq-bar">
        <button class="quiz-check" id="q${q.screen}-check" disabled onclick="quizCheck(${q.screen})">هل أصبت؟</button>
        ${!q.hint ? '' : `<button class="scq-hint" id="q${q.screen}-hint" type="button" onclick="quizOpenHint(${q.screen})"
          ${q.hintPolicy === 'after-wrong' ? 'style="visibility:hidden"' : ''}><span class="nav-label" data-label="هل يمكنني الحصول على تلميح؟"><span>هل يمكنني الحصول على تلميح؟</span></span>${HINT_ICON}</button>`}
        <button class="quiz-back" onclick="goTo(${q.screen - 1})">رجوع</button>
      </div>`;
    app.insertBefore(sec, backRef);
  });
}

function quizInteractionHTML(q) {
  if (q.type === 'single' || q.type === 'multi') {
    const role = q.type === 'multi' ? 'checkbox' : 'radio';
    return `<div class="scq-answers" role="${q.type === 'multi' ? 'group' : 'radiogroup'}" aria-label="خيارات الإجابة">
      ${q.options.map(o => `
        <div class="scq-opt ${q.type === 'multi' ? 'is-multi' : ''}" role="${role}" aria-checked="false" tabindex="0"
             data-id="${o.id}" onclick="quizSelect(${q.screen}, this)"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();quizSelect(${q.screen}, this);}">
          <span class="scq-radio ${q.type === 'multi' ? 'is-box' : ''}"></span>
          <span class="scq-opt-text">${o.html}</span>
        </div>`).join('')}
    </div>`;
  }
  if (q.type === 'rank') {
    /* tiles are placed into ranked slots. A slot may hold several tiles (the
       deck's rank 2 holds three players on equal percentages). Click a tile,
       then a slot — no drag, so it works on a touch board too. */
    return `<div class="rank-wrap">
      <div class="rank-slots">${q.slots.map((sl, i) => `
        <div class="rank-slot" data-slot="${i}" onclick="quizRankDrop(${q.screen}, ${i})"
             ondragover="event.preventDefault(); this.classList.add('is-over')"
             ondragleave="this.classList.remove('is-over')"
             ondrop="event.preventDefault(); this.classList.remove('is-over'); quizRankDropEvent(event, ${q.screen}, ${i})">
          <span class="rank-num">${i + 1}</span>
          <span class="rank-drop" id="q${q.screen}-slot-${i}"></span>
        </div>`).join('')}</div>
      <div class="rank-pool" id="q${q.screen}-pool">${q.tiles.map((t, i) => `
        <button type="button" class="rank-tile" data-tile="${i}" draggable="true"
                ondragstart="quizRankDragStart(event, ${q.screen}, ${i})"
                onclick="quizRankPick(${q.screen}, ${i})">${t}</button>`).join('')}</div>
    </div>`;
  }
  if (q.type === 'hotspot') {
    /* markers sit ON the art at percentage coordinates, so they track the
       image at any scale (deck slide 38) */
    return `<div class="hotspot-wrap">
      <img class="hotspot-img" src="${q.image}" alt="${q.imageAlt || ''}">
      ${q.spots.map((sp, i) => `<button type="button" class="hotspot-dot" data-id="${i}"
        style="left:${sp.x}%; top:${sp.y}%" aria-label="${sp.label}"
        onclick="quizSelect(${q.screen}, this)"></button>`).join('')}
    </div>`;
  }
  if (q.type === 'dropdown') {
    // sentence: array of text parts; blanks: [{pool, correct}] — blank i renders between parts[i] and parts[i+1]
    let html = '<div class="dd-sentence">';
    q.sentence.forEach((part, i) => {
      html += part;
      if (i < q.blanks.length) {
        const opts = q.blanks[i].pool.map(v => `<option value="${v}">${v}</option>`).join('');
        html += `<select class="dd-select" data-slot="${i}" onchange="quizDropdownChange(${q.screen})">
          <option value="">اختاروا</option>${opts}</select>`;
      }
    });
    return html + '</div>';
  }
  if (q.type === 'statement') {
    return `<div class="stmt-list">` + q.statements.map((s, i) => `
      <div class="stmt-row" data-row="${i}">
        <span class="stmt-text">${s.text}</span> <span class="stmt-pills"> <button type="button" class="stmt-pill" data-val="true" onclick="quizStatementPick(${q.screen}, ${i}, this)">صحيح</button> <button type="button" class="stmt-pill" data-val="false" onclick="quizStatementPick(${q.screen}, ${i}, this)">غير صحيح</button> </span>
      </div>`).join('') + `</div>`;
  }
  if (q.type === 'dual-select') {
    const opts = q.pool.map(y => `<option value="${y}">${y}</option>`).join('');
    return `<div class="dual-select-sentence">
      ${q.sentence.before}
      <select class="year-select" data-slot="0" onchange="quizDualChange(${q.screen})"><option value="">اختاروا سنة</option>${opts}</select>
      ${q.sentence.middle}
      <select class="year-select" data-slot="1" onchange="quizDualChange(${q.screen})"><option value="">اختاروا سنة</option>${opts}</select>
      ${q.sentence.after}
    </div>`;
  }
  if (q.type === 'value-input') {
    let slot = 0;
    const input = (label, free) => `<input type="text" inputmode="${free ? 'text' : 'numeric'}" class="vi-input"${free ? ' data-free="1"' : ''} data-slot="${slot++}" aria-label="${label || ''}" oninput="quizInputChange(${q.screen})">`;
    /* a table cell is one input, a percent (input then %, LTR so the sign sits
       RIGHT of the box per the unit law), or a ratio (two inputs and a colon) */
    const cellInput = (c) => {
      if (c.ratio) return `<span class="vi-cell-ratio">${input(c.label + ' — يسار')}` +
        `<span class="vi-colon-sep">:</span>${input(c.label + ' — يمين')}</span>`;
      if (c.pct) return `<span class="vi-cell-pct">${input(c.label)}<span class="vi-colon-sep">%</span></span>`;
      /* currency: the deck prints ₪ to the LEFT of the box (RTL run), the
         mirror of the % cell above — deck slide 59 */
      if (c.nis) return `<span class="vi-cell-pct vi-cell-nis">${input(c.label)}<span class="vi-colon-sep">₪</span></span>`;
      return `${c.prefix || ''}${input(c.label, c.free)}${c.suffix || ''}`;
    };
    if (q.panels) {
      /* the deck's own artwork IS the interaction here: each panel carries its
         label and its input sits directly beneath it (producer 01.09) */
      return `<div class="box-panels">` + q.panels.map(p2 =>
        `<figure class="box-panel">
           <span class="box-panel-art"><img src="${p2.img}" alt="" style="width:${p2.w}px"><strong class="box-panel-name">${p2.name}</strong></span>
           <figcaption>${p2.lines.map(l => `<span>${l}</span>`).join('')}</figcaption>
           <span class="vi-cell-pct">${input('نسبة التالف في' + p2.name)}<span class="vi-colon-sep">%</span></span>
         </figure>`).join('') + `</div>`;
    }
    if (q.imageInputs) {
      /* the answers are typed straight INTO the picture (deck slide 53): the
         board image is the table, and each input sits over its cell, placed by
         percentages of the image box so it follows any scale (producer QA 08.10) */
      const im = q.imageInputs;
      /* optional crop {x,y,w,h, ar} (% of the picture; ar = natural w/h): the
         box shows only that window, and the cells re-map into it (QA 19.10) */
      const k = im.crop || { x: 0, y: 0, w: 100, h: 100 };
      const box = im.crop
        ? `width:${im.w}px;aspect-ratio:${(k.w * k.ar / k.h).toFixed(4)};overflow:hidden`
        : `width:${im.w}px`;
      const img = im.crop
        ? `<img src="${im.src}" alt="${im.alt || ''}" style="position:absolute;max-width:none;width:${(10000 / k.w).toFixed(3)}%;left:${(-k.x * 100 / k.w).toFixed(3)}%;top:${(-k.y * 100 / k.h).toFixed(3)}%;border-radius:0">`
        : `<img src="${im.src}" alt="${im.alt || ''}">`;
      return `<div class="vi-image${im.crop ? ' vi-image--crop' : ''}" style="${box}">${img}` +
        im.cells.map(c => `<span class="vi-image-cell" style="left:${((c.x - k.x) * 100 / k.w).toFixed(3)}%;top:${((c.y - k.y) * 100 / k.h).toFixed(3)}%;width:${(c.w * 100 / k.w).toFixed(3)}%;height:${(c.h * 100 / k.h).toFixed(3)}%">${input(c.label)}</span>`).join('') +
        `</div>`;
    }
    if (q.tableRows) {
      /* the deck's table with input cells (deck slide 40): each row supplies
         fixed cells and one or more inputs */
      return `<table class="vi-table"><thead><tr>${q.tableHead.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>` +
        q.tableRows.map(row => `<tr>${row.map(c =>
          (c && typeof c === 'object' && (c.input || c.ratio || c.pct || c.nis))
            ? `<td class="vi-cell">${cellInput(c)}</td>`
            : `<td>${c}</td>`).join('')}</tr>`).join('') +
        `</tbody></table>`;
    }
    if (q.single) {
      /* one box with the deck's unit word beside it — RTL run, so the box
         renders right and the word left (deck slide 76) */
      return `<div class="vi-single">${input(q.single.label)}<span class="vi-unit">${q.single.unit}</span></div>`;
    }
    if (q.ratioRows) {
      // rows of "label — [input] : [input]" (e.g. reduced-ratio answers)
      return `<div class="ratio-rows">` + q.ratioRows.map(row => {
        const cells = Array.from({ length: row.parts || 2 }, () => input(row.label));
        return `<div class="ratio-row"><span class="ratio-row-label">${row.label}</span><span class="ratio-row-cells" dir="ltr">${cells.join('<span class="vi-colon">:</span>')}</span></div>`;
      }).join('') + `</div>`;
    }
    // equation of two fractions; each cell is a fixed string or {input:true,label}
    const cell = (c) => (c && typeof c === 'object' && c.input) ? input(c.label) : c;
    const frac = (side) => `<span class="fraction vi-frac"><span class="frac-top">${cell(side.top)}</span><span class="frac-bottom">${cell(side.bottom)}</span></span>`;
    return `<div class="vi-equation" dir="ltr">${frac(q.equation.left)}<span class="vi-eq">=</span>${frac(q.equation.right)}</div>`;
  }
  return '';
}

/* ---------- ranking (deck slide 54) ---------- */
function quizRankPick(screen, tile) {
  const st = quizState[screen];
  if (st.done) return;
  st.heldTile = st.heldTile === tile ? null : tile;
  document.querySelectorAll(`#q${screen} .rank-tile`).forEach(t =>
    t.classList.toggle('is-held', Number(t.dataset.tile) === st.heldTile));
}
function quizRankDrop(screen, slot) {
  const st = quizState[screen];
  const q = QUESTIONS.find(x => x.screen === screen);
  if (st.done || st.heldTile === null || st.heldTile === undefined) return;
  st.placed = st.placed || {};
  /* a tile lives in one slot at a time */
  Object.keys(st.placed).forEach(k => {
    st.placed[k] = st.placed[k].filter(t => t !== st.heldTile);
  });
  (st.placed[slot] = st.placed[slot] || []).push(st.heldTile);
  st.heldTile = null;
  quizRankRender(screen, q);
}
/* per-slot verdict: a rank is right when it holds exactly the tiles the key says */
/* some ranks right, not all — drives the "partial" wording (Elad 19.10, dslide 40) */
function quizRankPartial(q, placed) {
  return q.slots.some((want, i) => {
    const got = (placed[i] || []).slice().sort((a, b) => a - b);
    return got.length === want.length && want.slice().sort((a, b) => a - b).every((v, k) => v === got[k]);
  });
}
function quizRankMark(screen, q, placed) {
  q.slots.forEach((want, i) => {
    const got = (placed[i] || []).slice().sort((a, b) => a - b);
    const ok = got.length === want.length && want.slice().sort((a, b) => a - b).every((v, k) => v === got[k]);
    const slot = document.querySelector(`#q${screen} .rank-slot[data-slot="${i}"]`);
    if (slot) { slot.classList.toggle('is-right', ok); slot.classList.toggle('is-wrong', !ok); }
  });
}
/* render an arrangement read-only (answered state): the key, or the learner's own */
function quizRankShow(screen, q, placed, markMine) {
  q.slots.forEach((_, i) => {
    const box = document.getElementById(`q${screen}-slot-${i}`);
    if (box) box.innerHTML = (placed[i] || []).map(t =>
      `<button type="button" class="rank-tile is-placed" data-tile="${t}" disabled>${q.tiles[t]}</button>`).join('');
  });
  const used = new Set(Object.values(placed).flat());
  document.querySelectorAll(`#q${screen} .rank-pool .rank-tile`).forEach(t => {
    t.style.display = used.has(Number(t.dataset.tile)) ? 'none' : ''; t.disabled = true;
  });
  if (markMine) quizRankMark(screen, q, placed);
  else document.querySelectorAll(`#q${screen} .rank-slot`).forEach(sl => { sl.classList.add('is-right'); sl.classList.remove('is-wrong'); });
}
function quizRankRender(screen, q) {
  const st = quizState[screen];
  const placed = st.placed || {};
  document.querySelectorAll(`#q${screen} .rank-slot`).forEach(sl => sl.classList.remove('is-right', 'is-wrong'));
  const used = new Set(Object.values(placed).flat());
  q.slots.forEach((_, i) => {
    const box = document.getElementById(`q${screen}-slot-${i}`);
    if (box) box.innerHTML = (placed[i] || []).map(t =>
      `<button type="button" class="rank-tile is-placed" data-tile="${t}" draggable="true"
               ondragstart="quizRankDragStart(event, ${screen}, ${t})"
               onclick="quizRankPick(${screen}, ${t})">${q.tiles[t]}</button>`).join('');
  });
  document.querySelectorAll(`#q${screen} .rank-pool .rank-tile`).forEach(t => {
    t.style.display = used.has(Number(t.dataset.tile)) ? 'none' : '';
    t.classList.remove('is-held');
  });
  const total = q.slots.reduce((n, s2) => n + s2.length, 0);
  const chk = document.getElementById(`q${screen}-check`);
  if (chk) chk.disabled = used.size < total;
}

/* Drag is the primary gesture (producer 01.09); the click-then-slot path stays
   as a fallback for touch boards and keyboards. Both funnel into quizRankDrop. */
function quizRankDragStart(ev, screen, tile) {
  const st = quizState[screen];
  if (st.done) { ev.preventDefault(); return; }
  st.heldTile = tile;
  ev.dataTransfer.effectAllowed = 'move';
  try { ev.dataTransfer.setData('text/plain', String(tile)); } catch (e) {}
}
function quizRankDropEvent(ev, screen, slot) {
  const st = quizState[screen];
  let tile = st.heldTile;
  try {
    const raw = ev.dataTransfer.getData('text/plain');
    if (raw !== '') tile = Number(raw);
  } catch (e) {}
  if (tile === null || tile === undefined || Number.isNaN(tile)) return;
  st.heldTile = tile;
  quizRankDrop(screen, slot);
}

/* ---------- selection handlers ---------- */
function quizSelect(screen, el) {
  const st = quizState[screen];
  const q = QUESTIONS.find(x => x.screen === screen);
  if (st.done) return;
  const opts = document.querySelectorAll(`#q${screen} .scq-opt`);
  // A new selection after a wrong attempt clears the wrong marks
  opts.forEach(o => o.classList.remove('wrong'));
  quizHideFeedback(screen);

  if (q.type === 'multi') {
    el.classList.remove('correct');      /* a retry's green mark leaves with the pick */
    el.classList.toggle('selected');
    el.setAttribute('aria-checked', el.classList.contains('selected'));
    st.selectedSet = [...opts].filter(o => o.classList.contains('selected')).map(o => o.dataset.id);
    document.getElementById(`q${screen}-check`).disabled = st.selectedSet.length === 0;
  } else {
    opts.forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-checked', 'false'); });
    el.classList.add('selected');
    el.setAttribute('aria-checked', 'true');
    st.selected = el.dataset.id;
    document.getElementById(`q${screen}-check`).disabled = false;
  }
}

function quizDualChange(screen) {
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  const sels = [...document.querySelectorAll(`#q${screen} .year-select`)];
  sels.forEach(s => s.classList.remove('wrong'));
  st.selectedSet = sels.map(s => s.value);
  document.getElementById(`q${screen}-check`).disabled = st.selectedSet.some(v => !v);
}

function quizInputChange(screen) {
  document.querySelectorAll(`#q${screen} .vi-input`).forEach(i => {
    /* a `free` cell holds a ratio (digits, colon, spaces); the rest stay numeric */
    const clean = i.dataset.free ? i.value.replace(/[^0-9:\s]/g, '') : i.value.replace(/[^0-9.,]/g, '');
    if (clean !== i.value) i.value = clean;
  });
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  const inputs = [...document.querySelectorAll(`#q${screen} .vi-input`)];
  inputs.forEach(i => i.classList.remove('wrong'));
  /* a retry's green mark stays on the untouched fields, leaves the edited one */
  const ed = document.activeElement;
  if (ed && ed.classList && ed.classList.contains('vi-input')) ed.classList.remove('correct', 'mark-ok');
  st.selectedSet = inputs.map(i => i.value.trim());
  document.getElementById(`q${screen}-check`).disabled = st.selectedSet.some(v => !v);
}

function quizDropdownChange(screen) {
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  const sels = [...document.querySelectorAll(`#q${screen} .dd-select`)];
  sels.forEach(s => s.classList.remove('wrong'));
  /* a retry's ✓ leaves the blank the learner just changed */
  const ed = document.activeElement;
  if (ed && ed.classList && ed.classList.contains('dd-select')) ed.classList.remove('correct');
  st.selectedSet = sels.map(s => s.value);
  document.getElementById(`q${screen}-check`).disabled = st.selectedSet.some(v => !v);
}

function quizStatementPick(screen, row, el) {
  const st = quizState[screen];
  if (st.done) return;
  quizHideFeedback(screen);
  const rowEl = el.closest('.stmt-row');
  rowEl.classList.remove('wrong');
  rowEl.querySelectorAll('.stmt-pill').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
  st.selectedSet = [...document.querySelectorAll(`#q${screen} .stmt-row`)].map(r =>
    r.querySelector('.stmt-pill.selected')?.dataset.val || '');
  document.getElementById(`q${screen}-check`).disabled = st.selectedSet.some(v => !v);
}

/* ---------- check / feedback ---------- */
function quizIsCorrect(q, st) {
  if (q.type === 'single') return st.selected === q.correct;
  if (q.type === 'multi') {
    return q.correctSet.length === st.selectedSet.length &&
      q.correctSet.every(id => st.selectedSet.includes(id));
  }
  if (q.type === 'dual-select') {
    const pair = [...st.selectedSet].sort();
    return JSON.stringify(pair) === JSON.stringify([...q.correctPair].sort()) &&
      st.selectedSet[0] !== st.selectedSet[1];
  }
  if (q.type === 'hotspot') return st.selected === q.correct;
  if (q.type === 'rank') {
    const placed = st.placed || {};
    return q.slots.every((want, i) => {
      const got = (placed[i] || []).slice().sort((a, b) => a - b);
      return got.length === want.length && want.slice().sort((a, b) => a - b).every((v, k) => v === got[k]);
    });
  }
  if (q.type === 'dropdown') {
    return st.selectedSet.every((v, i) => v === q.blanks[i].correct);
  }
  if (q.type === 'statement') {
    return st.selectedSet.every((v, i) => v === String(q.statements[i].correct));
  }
  if (q.type === 'value-input') {
    /* spacing is the learner's choice: "18:25" and "18 : 25" are the same answer */
    const norm = v => String(v).replace(/\s+/g, '');
    const matches = (arr) => st.selectedSet.length === arr.length &&
      st.selectedSet.every((v, i) => norm(v) === norm(arr[i]));
    return matches(q.correctInputs) || (q.altInputs || []).some(matches);
  }
  return false;
}

function quizCheck(screen) {
  const st = quizState[screen];
  const q = QUESTIONS.find(x => x.screen === screen);
  if (st.done) { goTo(screen + 1); return; }

  st.attempts += 1;
  const correct = quizIsCorrect(q, st);

  st.wasCorrect = correct;
  if (correct) {
    const hintBtn = document.getElementById(`q${screen}-hint`);
    if (hintBtn) hintBtn.style.display = 'none';
    quizMarkOutcome(screen, q, true);
    quizShowFeedback(screen, 'correct', q.fb.correct);
    quizFinish(screen);
  } else if (st.attempts >= q.maxAttempts) {
    const hintBtn = document.getElementById(`q${screen}-hint`);
    if (hintBtn) hintBtn.style.display = 'none';
    quizMarkOutcome(screen, q, false);
    const fb = { ...q.fb.wrong };
    if (q.type === 'value-input' && st.slotOk && st.slotOk.some(Boolean)) {
      fb.title = 'تقريباً! بعض الإجابات صحيحة';
    }
    /* multi-select: some right picks = a partial answer, same title (Elad 15.10, dslide 38) */
    if (q.type === 'multi' && (st.selectedSet || []).some(id => q.correctSet.includes(id))) {
      fb.title = 'تقريباً! بعض الإجابات صحيحة';
    }
    if (q.type === 'rank' && q.fb.partial && quizRankPartial(q, st.placed || {})) fb.title = q.fb.partial;
    /* dropdown: some blanks right = partial (QA 20.10.26, dslide 43) */
    if (q.type === 'dropdown' && q.fb.partial && q.blanks.some((b, i) => st.selectedSet[i] === b.correct)) fb.title = q.fb.partial;
    quizShowFeedback(screen, 'wrong', fb);
    if (q.type === 'value-input' || q.type === 'rank' || q.type === 'dropdown') quizAnswerToggleAdd(screen, q);
    quizFinish(screen);
  } else {
    quizMarkRetry(screen, q);
    const partialRetry = q.type === 'rank' && q.fb.partialRetry && quizRankPartial(q, st.placed || {});
    quizShowFeedback(screen, 'wrong', { title: partialRetry ? q.fb.partialRetry : q.fb.retry, body: '' });
    /* the "try again" popup is not the detailed feedback: answer-only parts
       (`.col-pct`, `.later-val`) wait for the final verdict (Elad 15.10, dslide 30) */
    document.getElementById(`q${screen}`).classList.remove('is-answered');
    if (q.hintPolicy === 'after-wrong') {
      const hb = document.getElementById(`q${screen}-hint`);
      if (hb) hb.style.visibility = 'visible';
    }
    document.getElementById(`q${screen}-check`).disabled = true; // until a new selection
  }
}

function quizMarkRetry(screen, q) {
  if (q.type === 'rank') {
    /* first miss: show which ranks are right so far; cleared on the next move */
    quizRankMark(screen, q, quizState[screen].placed || {});
    return;
  }
  if (q.type === 'hotspot') {
    document.querySelectorAll(`#q${screen} .hotspot-dot`).forEach(d => d.classList.remove('selected', 'wrong', 'correct'));
    return;
  }
  if (q.type === 'single' || q.type === 'multi') {
    /* multi: a RIGHT pick stays picked and turns green; only the wrong picks
       go red and are cleared (Elad 15.10, dslide 35) */
    const keep = q.type === 'multi' ? q.correctSet : [];
    document.querySelectorAll(`#q${screen} .scq-opt.selected`).forEach(o => {
      if (keep.includes(o.dataset.id)) { o.classList.add('correct'); return; }
      o.classList.remove('selected');
      o.classList.add('wrong');
      o.setAttribute('aria-checked', 'false');
    });
    quizState[screen].selected = null;
    quizState[screen].selectedSet = (quizState[screen].selectedSet || []).filter(id => keep.includes(id));
  } else if (q.type === 'dual-select') {
    document.querySelectorAll(`#q${screen} .year-select`).forEach(s => s.classList.add('wrong'));
  } else if (q.type === 'value-input') {
    /* per field: a right value turns green, only the wrong ones go red
       (Elad 15.10, dslide 34) — scored against the closest accepted set */
    const sel = quizState[screen].selectedSet || [];
    const hits = arr => arr.filter((v, i) => (sel[i] || '') === v).length;
    const best = [q.correctInputs, ...(q.altInputs || [])].reduce((a, b) => hits(b) > hits(a) ? b : a);
    /* a right field also shows the ✓ (Elad 19.10, dslide 39, unit-wide) */
    document.querySelectorAll(`#q${screen} .vi-input`).forEach((inp, i) => {
      if ((sel[i] || '') === best[i]) inp.classList.add('correct', 'mark-ok');
      else inp.classList.add('wrong');
    });
  } else if (q.type === 'dropdown') {
    const sels = [...document.querySelectorAll(`#q${screen} .dd-select`)];
    /* a right blank shows the ✓, a wrong one the ✗ (Elad 19.10, unit-wide) */
    sels.forEach((s, i) => s.classList.add(s.value === q.blanks[i].correct ? 'correct' : 'wrong'));
  } else if (q.type === 'statement') {
    [...document.querySelectorAll(`#q${screen} .stmt-row`)].forEach((r, i) => {
      const pick = r.querySelector('.stmt-pill.selected');
      if (pick && pick.dataset.val !== String(q.statements[i].correct)) r.classList.add('wrong');
    });
  }
}

function quizMarkOutcome(screen, q, isCorrect) {
  if (q.type === 'rank') {
    /* remember both arrangements, show the KEY (all green) and let the
       feedback's toggle bring the learner's own back (producer QA 08.10) */
    const st = quizState[screen];
    st.userPlaced = JSON.parse(JSON.stringify(st.placed || {}));
    st.answerKey = Object.fromEntries(q.slots.map((sl, i) => [i, sl.slice()]));
    quizRankShow(screen, q, st.answerKey, false);
    return;
  }
  if (q.type === 'hotspot') {
    document.querySelectorAll(`#q${screen} .hotspot-dot`).forEach(d => {
      const id = d.dataset.id;
      if (id === q.correct) d.classList.add('correct');
      else if (id === quizState[screen].selected) d.classList.add('wrong');
      d.disabled = true;
    });
    return;
  }
  if (q.type === 'single' || q.type === 'multi') {
    const correctIds = q.type === 'multi' ? q.correctSet : [q.correct];
    document.querySelectorAll(`#q${screen} .scq-opt`).forEach(o => {
      const inCorrect = correctIds.includes(o.dataset.id);
      const wasChosen = o.classList.contains('selected');
      o.classList.remove('selected');
      if (inCorrect) o.classList.add('correct');
      else if (wasChosen && !isCorrect) o.classList.add('wrong');
    });
  } else if (q.type === 'dual-select') {
    const sels = [...document.querySelectorAll(`#q${screen} .year-select`)];
    if (!isCorrect) sels.forEach((s, i) => { s.value = q.correctPair[i]; });
    sels.forEach(s => { s.classList.remove('wrong'); s.classList.add('correct'); s.disabled = true; });
  } else if (q.type === 'value-input') {
    const inputs = [...document.querySelectorAll(`#q${screen} .vi-input`)];
    const st = quizState[screen];
    // per-field verdict (partial answers get per-input V/X, notes 50/63)
    const altSets = [q.correctInputs, ...(q.altInputs || [])];
    const best = altSets.find(arr => arr.every((v, i) => (st.selectedSet[i] || '') === v)) ||
      altSets.reduce((a, b) =>
        b.filter((v, i) => (st.selectedSet[i] || '') === v).length >
        a.filter((v, i) => (st.selectedSet[i] || '') === v).length ? b : a, q.correctInputs);
    st.userInputs = inputs.map(i => i.value);
    st.answerKey = best;
    st.slotOk = best.map((v, i) => (st.selectedSet[i] || '') === v);
    inputs.forEach((inp, i) => {
      inp.classList.remove('wrong', 'correct');
      inp.classList.add(st.slotOk[i] ? 'mark-ok' : 'mark-bad');
      inp.classList.add(st.slotOk[i] ? 'correct' : 'wrong');
      inp.disabled = true;
    });
  } else if (q.type === 'dropdown') {
    const sels = [...document.querySelectorAll(`#q${screen} .dd-select`)];
    const stD = quizState[screen];
    stD.userInputs = sels.map(s => s.value);          /* for the התשובה שלי toggle */
    stD.answerKey = q.blanks.map(b2 => b2.correct);
    stD.slotOk = sels.map((s, i) => s.value === q.blanks[i].correct);
    /* the verdict shows the KEY, all green; the feedback's toggle brings the
       learner's own picks back with their red/green marks (producer QA 08.10) */
    sels.forEach((s, i) => {
      s.value = q.blanks[i].correct;
      s.classList.remove('wrong'); s.classList.add('correct');
      s.disabled = true;
    });
  } else if (q.type === 'statement') {
    [...document.querySelectorAll(`#q${screen} .stmt-row`)].forEach((r, i) => {
      const correctVal = String(q.statements[i].correct);
      r.querySelectorAll('.stmt-pill').forEach(p => {
        p.disabled = true;
        const picked = p.classList.contains('selected');
        if (p.dataset.val === correctVal) p.classList.add('correct');
        else if (picked && !isCorrect) p.classList.add('wrong');
      });
    });
  }
}

/* magnifier zoom for content images (note 67, גורף) */
function quizImageZoomInit(scope) {
  (scope || document).querySelectorAll('.quiz-content img, .explain-content img, .vi-image img').forEach(img => {
    /* the companion is a character, not slide art — never zoomable */
    if (img.closest('.img-zoom-wrap') || img.closest('.character-widget') ||
        img.closest('.g-widget') || img.closest('.cheese') ||
        img.closest('.is-nozoom')) return;
    /* not decoded yet (cold load / prod): its width reads 0 — try again once it
       loads instead of dropping the magnifier for good (QA 19.10, dslide 63) */
    if (!img.complete || !img.naturalWidth) {
      img.addEventListener('load', () => quizImageZoomInit(img.parentNode), { once: true });
      return;
    }
    if (img.width < 120 && img.naturalWidth < 120) return;
    const wrap = document.createElement('span');
    wrap.className = 'img-zoom-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'applet-zoom-btn img-zoom-btn';
    btn.setAttribute('aria-label', 'تكبير الصورة');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7.5 10.5h6M10.5 7.5v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    btn.onclick = () => quizImageZoomOpen(img.src, img.alt);
    wrap.appendChild(btn);
  });
}
function quizImageZoomOpen(src, alt) {
  let ov = document.getElementById('img-zoom-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'img-zoom-overlay';
    ov.innerHTML = '<button type="button" class="applet-zoom-btn applet-close-btn" aria-label="إغلاق" onclick="quizImageZoomClose()">' +
      '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 2 L16 16 M16 2 L2 16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>' +
      '<img alt="">';
    document.getElementById('app').appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) quizImageZoomClose(); });
  }
  ov.querySelector('img').src = src;
  ov.querySelector('img').alt = alt || '';
  ov.style.display = 'grid';
}
function quizImageZoomClose() {
  const ov = document.getElementById('img-zoom-overlay');
  if (ov) ov.style.display = 'none';
}
document.addEventListener('DOMContentLoaded', () => setTimeout(() => quizImageZoomInit(), 50));
window.addEventListener('load', () => quizImageZoomInit());

/* show-correct-answer / my-answer toggle inside the feedback box (note 63) */
function quizAnswerToggleAdd(screen, q) {
  const box = document.getElementById(`q${screen}-feedbox`);
  const st = quizState[screen];
  if (!box || !st.answerKey) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fb-answer-toggle';
  btn.dataset.mode = 'correct';
  btn.textContent = 'إجابتي';
  btn.onclick = () => {
    const showMine = btn.dataset.mode === 'correct';
    if (q.type === 'rank') {
      quizRankShow(screen, q, showMine ? st.userPlaced : st.answerKey, showMine);
      btn.dataset.mode = showMine ? 'mine' : 'correct';
      btn.textContent = showMine ? 'الإجابة الصحيحة' : 'إجابتي';
      return;
    }
    if (q.type === 'dropdown') {
      [...document.querySelectorAll(`#q${screen} .dd-select`)].forEach((sel, i) => {
        sel.value = showMine ? (st.userInputs[i] || '') : st.answerKey[i];
        sel.classList.toggle('correct', !showMine || st.slotOk[i]);
        sel.classList.toggle('wrong', showMine && !st.slotOk[i]);
      });
      btn.dataset.mode = showMine ? 'mine' : 'correct';
      btn.textContent = showMine ? 'الإجابة الصحيحة' : 'إجابتي';
      return;
    }
    const inputs = [...document.querySelectorAll(`#q${screen} .vi-input`)];
    inputs.forEach((inp, i) => {
      inp.value = showMine ? (st.userInputs[i] || '') : st.answerKey[i];
      inp.classList.toggle('mark-ok', !showMine || st.slotOk[i]);
      inp.classList.toggle('mark-bad', showMine && !st.slotOk[i]);
      inp.classList.toggle('correct', !showMine || st.slotOk[i]);
      inp.classList.toggle('wrong', showMine && !st.slotOk[i]);
    });
    btn.dataset.mode = showMine ? 'mine' : 'correct';
    btn.textContent = showMine ? 'الإجابة الصحيحة' : 'إجابتي';
  };
  box.appendChild(btn);
  if (q.type === 'rank' || q.type === 'dropdown') return;   /* quizMarkOutcome already shows the key */
  // start by showing the correct answer (template default)
  const inputs = [...document.querySelectorAll(`#q${screen} .vi-input`)];
  inputs.forEach((inp, i) => {
    inp.value = st.answerKey[i];
    inp.classList.add('mark-ok', 'correct');
    inp.classList.remove('mark-bad', 'wrong');
  });
}

/* feedback boxes are draggable so they never hide the question (notes 38/58) */
function quizFeedboxDrag(box) {
  if (box.dataset.dragWired) return;
  box.dataset.dragWired = '1';
  let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
  box.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, input, select')) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    const t = (box.style.transform.match(/translate\((-?[\d.]+)px, (-?[\d.]+)px\)/) || [0, 0, 0]);
    ox = parseFloat(t[1]) || 0; oy = parseFloat(t[2]) || 0;
    box.setPointerCapture(e.pointerId);
    box.style.cursor = 'grabbing';
  });
  box.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    box.style.transform = `translate(${ox + e.clientX - sx}px, ${oy + e.clientY - sy}px)`;
  });
  const stop = () => { dragging = false; box.style.cursor = ''; };
  box.addEventListener('pointerup', stop);
  box.addEventListener('pointercancel', stop);
}

function quizFinish(screen) {
  const st = quizState[screen];
  st.done = true;
  quizStepperUpdate(screen);
  document.querySelectorAll(`#q${screen} .scq-opt`).forEach(o => o.classList.add('locked'));
  const check = document.getElementById(`q${screen}-check`);
  check.textContent = 'هل نتابع؟';
  check.disabled = false;
  /* a screen the deck gives no רמז renders no hint button at all */
  const hint = document.getElementById(`q${screen}-hint`);
  if (hint) hint.disabled = true;
}

function quizShowFeedback(screen, kind, fb) {
  /* a column marked `.col-pct` is part of the ANSWER — the deck only shows it
     with the feedback (slide 44's production note) */
  const sec = document.getElementById(`q${screen}`);
  if (sec) sec.classList.add('is-answered');
  const box = document.getElementById(`q${screen}-feedbox`);
  box.className = `quiz-feedbox ${kind === 'correct' ? 'is-correct' : 'is-wrong'}`;
  box.style.transform = '';
  quizFeedboxDrag(box);
  box.innerHTML = `
    <div class="scq-fb-title">${fb.title}</div>${fb.body ? `<div class="fb-body">${fb.body}</div>` : ''}`;
}

function quizHideFeedback(screen) {
  const sec0 = document.getElementById(`q${screen}`);
  if (sec0 && !quizState[screen].done) sec0.classList.remove('is-answered');
  const box = document.getElementById(`q${screen}-feedbox`);
  box.className = 'quiz-feedbox';
  box.innerHTML = '';
}

/* ---------- hint (shared overlay, populated per question) ---------- */
function quizOpenHint(screen) {
  const st = quizState[screen];
  const q = QUESTIONS.find(x => x.screen === screen);
  /* a hint reopens as often as the learner wants — closing it used to latch
     `hintUsed` and disable the button for good (producer 01.09) */
  if (st.done) return;
  const overlay = document.getElementById('quiz-hint-overlay');
  overlay.dataset.forScreen = screen;
  /* `hint` is a plain string; the older {body} shape is still accepted */
  const text = typeof q.hint === 'string' ? q.hint : (q.hint && q.hint.body) || '';
  overlay.querySelector('.scq-hint-body').innerHTML = `<p>${text}</p>`;
  overlay.classList.remove('hidden');
}

function quizCloseHint() {
  const overlay = document.getElementById('quiz-hint-overlay');
  if (!overlay || overlay.classList.contains('hidden')) return;
  const screen = Number(overlay.dataset.forScreen);
  overlay.classList.add('hidden');
  if (quizState[screen]) quizState[screen].hintUsed = true;   /* recorded, not a lock */
}

/* resetScreenState hook — completed questions stay locked (resume-state) */
/* ANSWER WIDTH — every value input in a question is as wide as that question's
   LONGEST accepted answer, never wider (standing client rule; producer 05.10).
   Measured rather than guessed: the answer strings live in the question data,
   so the width is computed from a hidden span rendered in the input's own
   font. All inputs in one question share the widest result, so a row of boxes
   stays even. */
function quizFitInputs(screen) {
  const q = (typeof QUESTIONS !== 'undefined') && QUESTIONS.find(x => x.screen === screen);
  const inputs = [...document.querySelectorAll(`#q${screen} .vi-input`)];
  if (!q || !inputs.length) return;
  const answers = [].concat(q.correctInputs || [], ...(q.altInputs || []));
  if (!answers.length) return;
  const probe = document.createElement('span');
  const cs = getComputedStyle(inputs[0]);
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;' +
    `font:${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`;
  document.body.appendChild(probe);
  let widest = 0;
  answers.forEach(a2 => { probe.textContent = String(a2); widest = Math.max(widest, probe.offsetWidth); });
  probe.remove();
  /* the box still has to hold its padding and the ✓/✗ mark */
  const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + 4;
  const w = Math.max(72, Math.ceil(widest + pad));
  inputs.forEach(i => { i.style.width = w + 'px'; });
}

function quizResetScreenState(screen) {
  quizStepperUpdate(screen);
  const st = quizState[screen];
  if (!st || st.done) return;
  // in-progress state is left as-is on return navigation
}
