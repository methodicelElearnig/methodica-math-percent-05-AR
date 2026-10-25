/* =====================================================================
   methodica-math-percent-05 — unit logic (screens 0-66 = slides 3-83, the whole deck).
   Runs on the shared 720-core; chrome is the approved vendored set.

   The learn-mode choice on S4 branches: read → S5 (the scroll), watch → S6
   (the video). Both paths converge on S7, the נועם/עינת question.
   ===================================================================== */

'use strict';

const TOTAL_SCREENS = 67;

/* ── Companion character — canonical storage contract ── */
const CHARACTER_STORAGE_KEY = 'percent05_selectedCharacter';
const CHARACTER_IDS = ['character-1', 'character-2'];
const DEFAULT_CHARACTER = 'character-1';
/* character-1 = pink; character-2 = wheelchair. The wheelchair pose
   variants are PLACEHOLDERS (base still) until the producer supplies the
   pair for each appearance (720 workflow: two assets per pose). */
const CHARACTER_ASSETS = {
  'character-1': {
    base:      'assets/img/character-pink.png',
    demo:      'assets/img/character-1-demo.png',
    secret:    'assets/img/character-1-secret.png',
    right:     'assets/img/character-1-right.png',
    shock:     'assets/img/character-1-shock.png',
    despair:   'assets/img/character-1-despair.png',
    snack:     'assets/img/character-1-snack.png',
    chocolate: 'assets/img/character-1-chocolate.png',
    pointing:  'assets/img/character-1-pointing.png',
    selection: 'assets/img/character-1-selection.png',
    music:     'assets/img/character-1-music.png',
    happy:     'assets/img/character-1-happy.png',
    whisper:   'assets/img/character-1-whisper.png',
    popcorn:   'assets/img/character-1-popcorn.png',
    reading:   'assets/img/character-1-reading.png',
  },
  'character-2': {
    base:      'assets/img/character-wheelchair.png',
    demo:      'assets/img/character-2-demo.png',
    secret:    'assets/img/character-2-secret.png',
    right:     'assets/img/character-2-right.png',
    shock:     'assets/img/character-2-shock.png',
    despair:   'assets/img/character-2-despair.png',
    snack:     'assets/img/character-2-snack.png',
    chocolate: 'assets/img/character-2-chocolate.png',
    pointing:  'assets/img/character-2-pointing.png',
    selection: 'assets/img/character-2-selection.png',
    music:     'assets/img/character-2-music.png',
    happy:     'assets/img/character-2-happy-placeholder.png',
    whisper:   'assets/img/character-2-whisper-placeholder.png',
    popcorn:   'assets/img/character-2-popcorn.png',
    reading:   'assets/img/character-2-reading.png',
  },
};

window.lomdaState = window.lomdaState || { selectedCharacter: null, songPick: '', learnMode: '' };

function getStoredCharacter() {
  try {
    const v = localStorage.getItem(CHARACTER_STORAGE_KEY);
    return CHARACTER_IDS.includes(v) ? v : null;
  } catch (e) { return null; }
}
window.lomdaState.selectedCharacter = getStoredCharacter();

function characterAsset(pose) {
  const id = CHARACTER_IDS.includes(window.lomdaState.selectedCharacter)
    ? window.lomdaState.selectedCharacter : DEFAULT_CHARACTER;
  return CHARACTER_ASSETS[id][pose];
}
/* every <img data-char-pose="…"> follows the chosen character */
/* Which companions the producer has actually supplied a clip for. A screen may
   carry a `[data-char-clip]` video AND a `[data-char-pose]` image: the video
   plays for the companions listed here, and the image stands in for the rest —
   the standing rule for a monster with no art yet. A clip absent from this map
   is assumed available for every companion. */
const CLIP_AVAILABLE = {
  /* empty = every clip exists for both companions. Add `clip: ['character-N']`
     the moment one arrives for only one of them, and the screen's still image
     beside it carries the other. */
};
function clipHas(clip, id) {
  const list = CLIP_AVAILABLE[clip];
  return !list || list.includes(id);
}

function applyCharacter() {
  document.querySelectorAll('img[data-char-pose]').forEach(img => {
    img.src = characterAsset(img.dataset.charPose);
  });
  /* companion CLIPS follow the same rule — media/<character>-<clip>.mp4.
     The producer supplies one clip per monster for every appearance. */
  const id = CHARACTER_IDS.includes(window.lomdaState.selectedCharacter)
    ? window.lomdaState.selectedCharacter : DEFAULT_CHARACTER;
  document.querySelectorAll('video[data-char-clip]').forEach(vid => {
    const fallback = vid.parentElement
      && vid.parentElement.querySelector('img[data-char-pose]');
    if (!clipHas(vid.dataset.charClip, id)) {
      /* no clip for this companion: drop the src so nothing 404s, and let the
         still image beside it carry the screen */
      vid.hidden = true;
      vid.removeAttribute('src');
      if (fallback) fallback.hidden = false;
      return;
    }
    vid.hidden = false;
    if (fallback) fallback.hidden = true;
    const want = `media/${id}-${vid.dataset.charClip}.mp4`;
    if (vid.getAttribute('src') === want) return;
    vid.setAttribute('src', want);
    vid.load();
    const play = vid.play();
    if (play && play.catch) play.catch(() => {});
  });
}

/* ── S0 — TwoOptionSelection (approved template logic, vendored) ── */
function selectOption(cardEl) {
  document.querySelectorAll('#s0 .option-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });
  cardEl.classList.add('selected');
  cardEl.setAttribute('aria-checked', 'true');
  window.lomdaState.selectedCharacter = cardEl.dataset.value;
  try { localStorage.setItem(CHARACTER_STORAGE_KEY, cardEl.dataset.value); } catch (e) {}
  applyCharacter();
  const cont = document.getElementById('s0-continue');
  if (cont) cont.disabled = false;
}
function s0Enter() {
  const saved = window.lomdaState.selectedCharacter;
  document.querySelectorAll('#s0 .option-card').forEach(card => {
    const isSel = !!saved && card.dataset.value === saved;
    card.classList.toggle('selected', isSel);
    card.setAttribute('aria-checked', isSel ? 'true' : 'false');
  });
  const cont = document.getElementById('s0-continue');
  if (cont) cont.disabled = !saved;
}

/* ── S1 — hook song pick (no right answer; continue gates on a pick) ── */
function songPick(el) {
  document.querySelectorAll('#s1 .song-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });
  el.classList.add('selected');
  el.setAttribute('aria-checked', 'true');
  window.lomdaState.songPick = el.dataset.value;
  document.getElementById('s1-continue').disabled = false;
}

/* ── S1 enter: a click-hint over the first song card, dismissed on pick ── */
const s1Hint = { placed: false };
function s1Enter() {
  if (s1Hint.placed || window.lomdaState.songPick) return;
  const cards = document.querySelector('#s1 .song-cards');
  const firstCard = document.querySelector('#s1 .song-card[data-value="dream"]');
  if (!cards || !firstCard || !firstCard.offsetWidth) return;
  s1Hint.placed = true;
  /* ratio-01-02 s3 pattern, verbatim: anchored to the card's lower third so
     the ripple/cursor never cover the content (producer 13.08) */
  cards.style.position = 'relative';
  const hint = makeClickHint('s1-hint-pick');
  cards.appendChild(hint);
  const place = () => {
    if (!firstCard.offsetWidth) return;
    hint.style.left = (firstCard.offsetLeft + firstCard.offsetWidth / 2 - 150) + 'px';
    hint.style.top  = (firstCard.offsetTop  + firstCard.offsetHeight * 0.78 - 150) + 'px';
  };
  place();
  window.addEventListener('resize', place);
  document.querySelectorAll('#s1 .song-card').forEach(c =>
    c.addEventListener('click', () => hint.classList.add('hidden'), { once: true }));
}

/* ── S4 — learn-mode choice: read → the scroll (S5); video → slide 17's
   screen (not in this range yet — routed to the scroll and FLAGGED) ── */
function learnPick(el) {
  document.querySelectorAll('#s4 .option-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });
  el.classList.add('selected');
  el.setAttribute('aria-checked', 'true');
  window.lomdaState.learnMode = el.dataset.value;
  document.getElementById('s4-continue').disabled = false;
}
function learnGo() {
  goTo(window.lomdaState.learnMode === 'video' ? 6 : 5);
}

/* ── S6 — the video screen (deck slide 17) ──
   The producer's clip is a YouTube embed, not a local file (01.09). המשך opens
   when the player reports ENDED, matching the deck, which draws it disabled.

   Fallback, because a school network may block YouTube or its API and a learner
   must never be stranded: if the API has not loaded after a grace period, open
   המשך anyway. The mode switch to the reading path is live throughout.
   ── */
const s6State = { watched: false, wired: false };
function watchGate() {
  const btn = document.getElementById('s6-continue');
  if (btn) btn.disabled = !s6State.watched;
}
function watchDone() { s6State.watched = true; watchGate(); }

const S6_VIDEO_URL = 'https://www.youtube.com/watch?v=BpGGIwaJEYQ';

/* ── S6 video — the YouTube IFrame Player API pattern ported verbatim from
   methodica-math-percent-02-01's #s7 (VideoPathViewer). The API script loads
   lazily on first entry and builds the player inside #s6-youtube-player;
   המשך unlocks on ENDED, and on onError too so a blocked embed never strands
   the learner. Leaving the screen pauses; re-entering before finishing halts
   and rewinds, so the clip is watched through — re-entering after finishing
   leaves המשך open, no forced re-watch. ── */
const S6_YT_VIDEO_ID = 'BpGGIwaJEYQ';  /* producer 06.10 — replaces o-J1o_EJO3I */
let s6YtPlayer = null, s6YtApiLoading = false;

function loadYouTubeApi(cb) {
  if (window.YT && window.YT.Player) { cb(); return; }
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = function () { if (typeof prev === 'function') prev(); cb(); };
  if (!s6YtApiLoading) {
    s6YtApiLoading = true;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
}

/* YouTube rejects an embed whose origin/referrer signals are broken (error 153):
   over file:// the origin is "null" and no Referer is sent, so pass those params
   only when actually served over http(s). Preview this screen over http(s). */
function ytEmbedPlayerVars() {
  const vars = { rel: 0, modestbranding: 1, playsinline: 1, hl: 'iw', cc_lang_pref: 'iw', cc_load_policy: 1 };
  if (/^https?:$/.test(location.protocol)) {
    vars.origin = location.origin;
    vars.widget_referrer = location.href;
  }
  return vars;
}

function initS6Player() {
  if (s6YtPlayer) return;
  /* local preview: a file:// page can never load the player, so show the way in
     rather than YouTube's own error card */
  if (location.protocol === 'file:') {
    const frame = document.getElementById('s6-video-wrap');
    if (frame) {
      frame.innerHTML = `<div class="video-fallback">
        <p><strong>العرض المحلي:</strong> مشغّل يوتيوب محظور عند فتح ملف من الحاسوب.</p>
        <p>للتشغيل: انقروا مرتين على <strong>serve.command</strong> في مجلد الوحدة،<br>أو افتحوا الفيديو مباشرةً:</p>
        <a class="video-fallback-link" href="${S6_VIDEO_URL}" target="_blank" rel="noopener">مشاهدة الفيديو على يوتيوب</a>
      </div>`;
    }
    watchDone();
    return;
  }
  loadYouTubeApi(function () {
    if (s6YtPlayer) return;
    s6YtPlayer = new YT.Player('s6-youtube-player', {
      videoId: S6_YT_VIDEO_ID,
      host: 'https://www.youtube-nocookie.com',
      playerVars: ytEmbedPlayerVars(),
      events: {
        onStateChange: function (e) { if (e.data === YT.PlayerState.ENDED) watchDone(); },
        onError: function () { watchDone(); },
      },
    });
  });
}

function pauseS6Video() {
  if (s6YtPlayer && typeof s6YtPlayer.pauseVideo === 'function') s6YtPlayer.pauseVideo();
}

function s6Enter() {
  watchGate();
  if (s6State.watched) return;   // finished once — no forced re-watch
  if (s6YtPlayer && typeof s6YtPlayer.stopVideo === 'function') s6YtPlayer.stopVideo();
  else initS6Player();
}



/* ── S5 — the reading scroll (slides 8-16): continue opens only at the end ── */
const s5State = { scrolledEnd: false, wired: false };
function s5Gate() {
  const box = document.getElementById('s5-scroll');
  if (box && box.scrollTop + box.clientHeight >= box.scrollHeight - 24) s5State.scrolledEnd = true;
  const btn = document.getElementById('s5-continue');
  if (btn) btn.disabled = !s5State.scrolledEnd;
}
/* S5's reading scroll (producer 05.10, three notes):
     1. the next section is revealed only once the learner starts scrolling
     2. ONE sticky picture replaces the nine stacked copies
     3. it swaps ONLY when the incoming block's art differs from what is shown

   Driven by the scroller's own scroll handler, NOT IntersectionObserver: the
   observer never fired for the later blocks here, and the same class of
   callback is unreliable whenever the compositor is idle (a backgrounded tab,
   a headless capture). A position test on scroll is deterministic, and this
   screen already has a scroll listener for the continue gate.             */
const s5Scroll = { wired: false, art: null };

function s5ScrollSync() {
  const box = document.getElementById('s5-scroll');
  const fig = document.getElementById('s5-figure');
  if (!box || !fig) return;
  const blocks = [...box.querySelectorAll('.read-block')];
  if (!blocks.length) return;
  const boxTop = box.getBoundingClientRect().top;
  const h = box.clientHeight;

  let lead = null;
  blocks.forEach(b => {
    const r = b.getBoundingClientRect();
    const top = r.top - boxTop;
    /* revealed once any part of the block has entered the lower edge */
    if (top < h - 40) b.classList.add('is-in');
    /* The LEAD block is the DEEPEST one that has crossed the 55% line. A
       middle-band test looked right but never selected the last blocks: at
       the bottom of the scroller their top sits below that band, so the
       picture froze two images early. This rule is monotonic and ends on the
       final block. */
    if (top < h * 0.55) lead = b;
  });
  /* at the very top the first block owns the picture, whatever the band says —
     otherwise entering the screen already showed the SECOND block's art */
  if (box.scrollTop <= 2 || !lead) lead = blocks[0];

  const want = lead.dataset.art;
  if (want && want !== s5Scroll.art) {       /* only where it needs to change */
    s5Scroll.art = want;
    const wrap = fig.parentElement;
    wrap.classList.add('is-swapping');
    setTimeout(() => {
      fig.setAttribute('src', want);
      fig.setAttribute('alt', lead.dataset.alt || '');
      wrap.classList.remove('is-swapping');
    }, 160);
  }
}

function s5WireScroll() {
  const box = document.getElementById('s5-scroll');
  const fig = document.getElementById('s5-figure');
  if (!box || !fig) return;
  if (!s5Scroll.wired) {
    s5Scroll.wired = true;
    s5Scroll.art = fig.getAttribute('src');
    box.classList.add('is-revealing');
    ['scroll', 'wheel', 'touchmove', 'keydown'].forEach(ev =>
      box.addEventListener(ev, s5ScrollSync, { passive: true }));
  }
  s5ScrollSync();                             /* first paint: reveal what is visible */
}

function s5Enter() {
  const box = document.getElementById('s5-scroll');
  if (!box) return;
  s5Gate();
  s5WireScroll();
  if (s5State.wired) return;
  s5State.wired = true;
  ['scroll', 'scrollend', 'wheel', 'touchmove', 'keyup'].forEach(ev =>
    box.addEventListener(ev, s5Gate, { passive: true }));
  // scrollbar click-hint (approved ratio placement), dismissed on first scroll
  if (box.scrollHeight <= box.clientHeight + 8) return;
  const hint = makeClickHint('s5-hint-scroll');
  document.getElementById('s5').appendChild(hint);
  box.addEventListener('scroll', () => hint.classList.add('hidden'), { once: true });
}

/* Click-gesture hint — vendored VERBATIM from ratio-01-02 (approved) */
const SPARK_DIRS = [
  [0, -80], [56.57, -56.57], [80, 0], [56.57, 56.57],
  [0, 80], [-56.57, 56.57], [-80, 0], [-56.57, -56.57],
];
function makeClickHint(id) {
  const el = document.createElement('div');
  el.className = 'click-hint';
  el.id = id;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="click-hint__ripple1"><img src="assets/img/hint/ripple-ring-1.svg" alt=""></div>' +
    '<div class="click-hint__ripple2"><img src="assets/img/hint/ripple-ring-2.svg" alt=""></div>' +
    SPARK_DIRS.map(([dx, dy], i) =>
      `<div class="click-hint__spark" style="--dx:${dx}px; --dy:${dy}px; --d:${i * 3}ms"><img src="assets/img/hint/spark.svg" alt=""></div>`
    ).join('') +
    '<div class="click-hint__cursor"><img src="assets/img/hint/cursor.svg" alt=""></div>';
  return el;
}

/* ═══════════════════════════════════════════════════════════════════════
   S10-S17 — the guided exercise (deck slides 23-30).

   ONE SCREEN PER DECK SLIDE, the way the approved Guided Instruction Flow
   does it (ratio-01-01 S6-S10, percent-04 S10-S20): the exercise card repeats
   on every screen and only the step callout changes. Generated here rather
   than hand-written eight times.
   ═══════════════════════════════════════════════════════════════════════ */
/* Guided Instruction Flow card parts — vendored verbatim from ratio-01-01 */
const G_BULB = `<svg class="s19-bulb" viewBox="0 0 20.997 27.9988" fill="none" aria-hidden="true"><path d="M17.4818 2.65764C15.2512 0.668476 12.2563 -0.275357 9.25683 0.0699765C4.59833 0.60431 0.748334 4.35748 0.103168 8.99148C-0.387999 12.5078 0.894168 16.0031 3.532 18.34C4.99267 19.6338 5.83033 21.5191 5.83033 23.5095V23.9155C5.83033 26.1671 7.662 27.9988 9.91367 27.9988H11.0803C13.332 27.9988 15.1637 26.1671 15.1637 23.9155V23.5036C15.1637 21.5366 16.041 19.6431 17.6347 18.1708C19.7708 16.1945 20.997 13.398 20.997 10.4988C20.997 7.50864 19.716 4.65031 17.4818 2.65764ZM13.997 23.9143C13.997 25.522 12.6892 26.831 11.0803 26.831H9.91367C8.30483 26.831 6.997 25.522 6.997 23.9143V23.5083C6.997 23.0545 6.9585 22.6041 6.88617 22.1643H14.1137C14.0367 22.6041 13.997 23.051 13.997 23.5025V23.9143ZM16.8425 17.3133C15.691 18.3773 14.865 19.6385 14.4077 20.9976H11.0792V12.1986C12.7323 11.9198 13.9958 10.479 13.9958 8.74764C13.9958 8.42564 13.7345 8.16431 13.4125 8.16431C13.0905 8.16431 12.8292 8.42564 12.8292 8.74764C12.8292 10.0345 11.7827 11.081 10.4958 11.081C9.209 11.081 8.1625 10.0345 8.1625 8.74764C8.1625 8.42564 7.90117 8.16431 7.57917 8.16431C7.25717 8.16431 6.99583 8.42564 6.99583 8.74764C6.99583 10.479 8.25933 11.9198 9.9125 12.1986V20.9976H6.60267C6.16633 19.6431 5.38 18.4193 4.3055 17.4661C1.9605 15.3895 0.821834 12.2815 1.25817 9.15248C1.831 5.03648 5.2505 1.70448 9.38867 1.22848C9.7655 1.18531 10.14 1.16431 10.511 1.16431C12.807 1.16431 14.9735 1.98448 16.7072 3.52914C18.6917 5.30014 19.8315 7.83998 19.8315 10.4976C19.8315 13.111 18.771 15.5318 16.8437 17.3133H16.8425Z" fill="white"/></svg>`;
const G_TICK = `<span class="s19-opt-badge s19-badge-correct" aria-hidden="true"><svg viewBox="0 0 10.4133 7.51728" fill="none"><path d="M3.36229 7.51715C3.06671 7.51727 2.78322 7.39978 2.57439 7.1906L0.192279 4.80937C-0.0640367 4.55298 -0.0640367 4.13736 0.192279 3.88096C0.448678 3.62464 0.864299 3.62464 1.1207 3.88096L3.36229 6.12255L9.29261 0.192237C9.54901 -0.064079 9.96463 -0.064079 10.221 0.192237C10.4773 0.448635 10.4773 0.864256 10.221 1.12065L4.1502 7.1906C3.94136 7.39978 3.65788 7.51727 3.36229 7.51715Z" fill="white"/></svg></span>`;
const G_CROSS = `<span class="s19-opt-badge s19-badge-incorrect" aria-hidden="true"><svg viewBox="0 0 10 10" fill="none"><path d="M9.76736 0.232637C9.61836 0.0836796 9.4163 0 9.20561 0C8.99492 0 8.79286 0.0836796 8.64386 0.232637L5 3.87649L1.35615 0.232637C1.20714 0.0836796 1.00508 0 0.794391 0C0.583702 0 0.381639 0.0836796 0.232637 0.232637C0.0836796 0.381639 0 0.583702 0 0.794391C0 1.00508 0.0836796 1.20714 0.232637 1.35615L3.87649 5L0.232637 8.64386C0.0836796 8.79286 0 8.99492 0 9.20561C0 9.4163 0.0836796 9.61836 0.232637 9.76736C0.381639 9.91632 0.583702 10 0.794391 10C1.00508 10 1.20714 9.91632 1.35615 9.76736L5 6.12351L8.64386 9.76736C8.79286 9.91632 8.99492 10 9.20561 10C9.4163 10 9.61836 9.91632 9.76736 9.76736C9.91632 9.61836 10 9.4163 10 9.20561C10 8.99492 9.91632 8.79286 9.76736 8.64386L6.12351 5L9.76736 1.35615C9.91632 1.20714 10 1.00508 10 0.794391C10 0.583702 9.91632 0.381639 9.76736 0.232637Z" fill="white"/></svg></span>`;

const G_FIRST = 10;                       /* deck slide 23 */
const FR = (n, d) => `<span class="fraction"><span class="frac-top">${n}</span>` +
                     `<span class="frac-bottom">${d}</span></span>`;

const G_STEPS = [
  { slide: 23, kind: 'bubble', pose: 'chocolate',
    text: 'من المُهين قليلًا المقارنة بين هذه العلب...' },
  { slide: 24, kind: 'ask',
    text: 'أولًا، دعونا نتحقق:<br>هل أنتج المصنعان الكمية نفسها من المثلجات؟',
    opts: ['نعم', 'لا'], correct: 1, mark: ['made'] },
  { slide: 25, kind: 'say',
    /* producer 05.10; reworded 15.10 (Elad) */
    text: 'لنتحقق مما إذا كانت شهد محقة، سنقارن بين المصنعين من خلال حساب نسبة المثلجات المعيبة المئوية من مجموع المثلجات التي أُنتجت في المصنع.' },
  { slide: 26, kind: 'eq', mark: ['made', 'bad'],
    /* the deck writes the second one as 20/500 = 40/100, which its own table
       contradicts two slides later (20 = 4%). Built as 4/100 and flagged. */
    eqs: [`<span dir="ltr">${FR(40, '1,000')} = ${FR(4, 100)} = 4%</span>`,
          `<span dir="ltr">${FR(20, 500)} = ${FR(4, 100)} = 4%</span>`] },
  { slide: 27, kind: 'ask',
    text: 'أي مصنع وصل إلى نسبة مئوية أعلى من المثلجات المعيبة؟',
    opts: ['كاكاو بوتيك', 'شوكو-لاند', 'لدى المصنعين النسبة المئوية نفسها'], correct: 2,
    /* three long options do not fit side by side */
    stack: true },
  { slide: 28, kind: 'say', cells: true,
    text: 'فعلى الرغم من أنّ عدد المثلّجات التي أُلقيت في القمامة في مصنع "كاكاو بوتيك" كان أكبر (40 مقابل 20)، ' +
          'عند مقارنة المعطيات بصورة عادلة، يتبيّن أن نسبة المثلجات ' +
          'المعيبة متساوية في المصنعين.' },
  { slide: 29, kind: 'say', cells: true, pick: 'b',
    text: "الإجابة هي ب:<br>استنتاج شهد خاطئ، فالعمل في شوكو-لاند ليس أفضل، لأن النسبة المئوية للمثلجات المعيبة متساوية في المصنعين." },
  { slide: 30, kind: 'art', cells: true, pick: 'b', pose: 'demo' },
];

const gAnswered = {};

/* the exercise card — identical on every screen of the flow */
function gExerciseHTML(n, st) {
  const pct = v => `<span dir="ltr"><span class="cell-pct">4%</span> = ${v}</span>`;
  const lit = g => (st.mark || []).includes(g) ? ' is-lit' : '';
  return `<div class="g-exercise">
      <p>شركة المثلجات "متوك-لي" تنتج مثلجتها المشهورة في مصنعين مختلفين.<br> شهد، مديرة مراقبة الجودة في الشركة، تريد أن تعرف في أي مصنع توجد مثلجات معيبة أكثر.<br> إليكم معطيات يوم واحد من الفحوصات:</p>
      <table class="g-table">
        <thead><tr><th>مصنع</th><th>مثلجات</th><th>مثلجات معيبة</th></tr></thead>
        <tbody>
          <tr><td>كاكاو بوتيك</td><td class="g-cell${lit('made')}">1,000</td><td class="g-cell${lit('bad')}" data-bad="a">${st.cells ? pct(40) : '40'}</td></tr>
          <tr><td>شوكو-لاند</td><td class="g-cell${lit('made')}">500</td><td class="g-cell${lit('bad')}" data-bad="b">${st.cells ? pct(20) : '20'}</td></tr>
        </tbody>
      </table>
      <p>استنتاج شهد:<br> "في شوكو-لاند يعملون بشكل أفضل!<br> في كاكاو بوتيك 40 مثلجة معيبة وفي شوكو-لاند 20 فقط.<br> إذًا الماكينات في شوكو-لاند تنتج مثلجات بعيوب أقل!"</p>
      <p class="g-ask"><strong>هل استنتاج شهد صحيح؟</strong><br>
        <span${st.pick === 'a' ? ' class="is-lit"' : ''}>أ. نعم</span><br>
        <span${st.pick === 'b' ? ' class="is-lit"' : ''}>ب. لا</span></p>
    </div>`;
}

/* the step callout — the approved Guided Instruction Flow card */
function gSideHTML(n, st) {
  if (st.kind === 'bubble') return '';
  if (st.kind === 'art') {
    return `<img class="g-art" data-char-pose="${st.pose}" src="" alt="الشخصية المرافقة تحمل لافتة: العدل للمصانع! نقارن بالنسب المئوية!">`;
  }
  if (st.kind === 'eq') {
    return st.eqs.map(e => `<div class="g-card--eq">${e}</div>`).join('');
  }
  const opts = st.kind !== 'ask' ? '' :
    `<div class="s19-options${st.stack ? ' s19-options--stack' : ''}" role="radiogroup" aria-label="اختاروا إجابة">${st.opts.map((o, k) =>
      `<button type="button" class="s19-opt" data-id="${k}" role="radio" aria-checked="false"
               onclick="gPick(${n}, ${k})">${G_TICK}${G_CROSS}<span class="s19-opt-text">${o}</span></button>`
      ).join('')}</div>`;
  const line = st.kind === 'ask' ? 's19-question-line' : 's19-elaboration';
  return `<div class="s19-guided-card">${G_BULB}
      <div class="s19-twxt"><div class="s19-per3">
        <p class="${line}">${st.text}</p>${opts}
      </div></div>
    </div>`;
}

function buildGuidedScreens() {
  /* the guided flow lives in one component; the others share this file but must
     not grow its screens */
  if (window.PART_CONFIG &&
      (G_FIRST < window.PART_CONFIG.start || G_FIRST > window.PART_CONFIG.end)) return;
  const app = document.getElementById('app');
  const before = document.getElementById('s18');
  G_STEPS.forEach((st, i) => {
    const n = G_FIRST + i;
    const sec = document.createElement('section');
    sec.className = 'screen';
    sec.id = 's' + n;
    sec.dataset.screen = n;
    /* producer 05.10: only the FIRST guided screen carries a title, and it is
       the new instruction copy; screens 11-17 carry none. */
    const title = i === 0
      ? `<h1 class="g-title g-title--intro">تأملوا التمرين التالي. لا تحلوه، فقط انظروا إلى المعطيات وفكروا هل لديكم اتجاه للحل.</h1>`
      : '';
    sec.innerHTML = `
      ${title}
      <div class="g-cols" id="s${n}-cols">
        ${gExerciseHTML(n, st)}
        <div class="g-side">${gSideHTML(n, st)}</div>
        ${st.kind !== 'bubble' ? '' : `<div class="g-widget g-widget--above">
          <div class="rs-bubble rs-bubble--above g-widget-bubble"><svg class="rs-bubble-shape" viewBox="0 0 216 89" preserveAspectRatio="none" aria-hidden="true"><use href="#bubble-tail-down"/></svg><span class="rs-bubble-text">${st.text}</span></div>
          <img data-char-pose="${st.pose || 'base'}" src="" alt="الشخصية المرافقة">
        </div>`}
      </div>
      <button class="btn-continue" id="s${n}-continue" ${st.kind === 'ask' ? 'disabled' : ''} onclick="goTo(${n + 1})">متابعة</button>
      <button class="btn-back" onclick="goTo(${n - 1})">رجوع</button>`;
    app.insertBefore(sec, before);
  });
}

/* The deck links each equation card to the cell it explains with an arrow.
   Drawn as an SVG overlay because the two ends live in different columns and
   only layout knows where they land. */
function gDrawArrows(n) {
  const cols = document.getElementById(`s${n}-cols`);
  if (!cols) return;
  const old = cols.querySelector('.g-arrows');
  if (old) old.remove();
  const cards = [...cols.querySelectorAll('.g-card--eq')];
  if (!cards.length) return;
  const cells = ['a', 'b'].map(k => cols.querySelector(`[data-bad="${k}"]`));
  const box = cols.getBoundingClientRect();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'g-arrows');
  svg.setAttribute('viewBox', `0 0 ${Math.round(box.width)} ${Math.round(box.height)}`);
  svg.innerHTML = '<defs><marker id="g-arrowhead" viewBox="0 0 10 10" refX="9" refY="5" ' +
    'markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
    '<path d="M0 0 L10 5 L0 10 z" fill="var(--subject-500)"/></marker></defs>';
  cards.forEach((card, i) => {
    const cell = cells[i];
    if (!cell) return;
    const c = card.getBoundingClientRect(), t = cell.getBoundingClientRect();
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', t.left - box.left);
    line.setAttribute('y1', t.top + t.height / 2 - box.top);
    line.setAttribute('x2', c.right - box.left + 4);
    line.setAttribute('y2', c.top + c.height / 2 - box.top);
    line.setAttribute('marker-end', 'url(#g-arrowhead)');
    svg.appendChild(line);
  });
  cols.appendChild(svg);
}

/* vendored from ratio-01-01 gstepSelect(): correct turns green, the learner's
   wrong pick turns red, every option locks, Continue unlocks */
function gPick(n, k) {
  const st = G_STEPS[n - G_FIRST];
  if (!st || gAnswered[n]) return;
  document.querySelectorAll(`#s${n} .s19-opt`).forEach(o => {
    const id = Number(o.dataset.id);
    if (id === st.correct) o.classList.add('correct');
    else if (id === k) o.classList.add('incorrect');
    o.setAttribute('aria-checked', id === k ? 'true' : 'false');
    o.disabled = true;
  });
  gAnswered[n] = true;
  const btn = document.getElementById(`s${n}-continue`);
  if (btn) btn.disabled = false;
}

function gEnter(n) {
  gDrawArrows(n);
  const st = G_STEPS[n - G_FIRST];
  const btn = document.getElementById(`s${n}-continue`);
  if (btn && st) btn.disabled = st.kind === 'ask' && !gAnswered[n];
}


/* ── S19 — the comparison game (deck slide 32) ──
   The producer supplied the real applet on 01.09; it replaces the six rounds
   that had been built from the deck's single mock-up frame. Self-contained
   single HTML file, embedded in an iframe like any other יישומון. ── */
function s19Enter() {
  const host = document.getElementById('s19-applet');
  if (!host || host.dataset.loaded) return;
  host.dataset.loaded = '1';
  host.innerHTML = appletEmbed('applets/comparison-game.html', 'لعبة مقارنة النسب المئوية');
  s19WatchApplet();
}

/* המשך opens only when the game reaches its results panel (producer 01.09).
   The applet is served from this unit, so it is same-origin and its DOM can be
   read directly — it emits no completion event of its own. Its finished state
   renders one of three result titles plus "N מתוך M תשובות נכונות".

   Same-origin reads are blocked under file://, so if the document cannot be
   read the gate opens after a grace period rather than stranding the learner
   (preview over http — see serve.command — to get the real gate). */
const S19_DONE = /إجابات صحيحة|بطل النسب المئوية|أحسنت|نواصل التدرّب/;
function s19WatchApplet() {
  const btn = document.getElementById('s19-continue');
  if (btn) btn.disabled = true;
  const frame = document.querySelector('#s19-applet iframe');
  if (!frame) return;
  let readable = false;
  const tick = () => {
    let done = false;
    try {
      const doc = frame.contentDocument;
      if (doc && doc.body) {
        readable = true;
        done = S19_DONE.test(doc.body.innerText || '');
      }
    } catch (e) { /* cross-origin — leave `readable` false */ }
    if (done) {
      if (btn) btn.disabled = false;
      clearInterval(timer);
    }
  };
  const timer = setInterval(tick, 600);
  tick();
  setTimeout(() => {
    if (!readable) { if (btn) btn.disabled = false; clearInterval(timer); }
  }, 8000);
}

/* ── story screens (slides 61, 63): two answers, neither wrong — the point is
   what MOST people say, revealed on the next screen. Continue opens on a pick. ── */
function storyPick(el, n) {
  el.closest('.story-picks').querySelectorAll('.story-pick').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  const btn = document.getElementById('s' + n + '-continue');
  if (btn) btn.disabled = false;
}

/* ── applet modal — opened by a "?" badge next to a term (producer 01.09) ── */
function openApplet(src, title) {
  const m = document.getElementById('applet-modal');
  if (!m) return;
  m.querySelector('.applet-modal-title').textContent = title || 'تطبيق';
  const body = document.getElementById('applet-modal-body');
  if (body.dataset.src !== src) {
    body.dataset.src = src;
    body.innerHTML = `<iframe src="${src}" title="${title || 'تطبيق'}" loading="lazy"></iframe>`;
  }
  m.classList.remove('hidden');
}
function closeApplet() {
  const m = document.getElementById('applet-modal');
  if (m) m.classList.add('hidden');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeApplet(); });

/* ── screen enter hooks ── */
function resetScreenState(n) {
  /* every value input is sized to its question's longest answer (05.10) */
  if (typeof quizFitInputs === 'function') quizFitInputs(n);
  applyCharacter();
  if (n === 0) s0Enter();
  if (n === 1) s1Enter();
  if (n === 5) s5Enter();
  if (n === 6) s6Enter(); else pauseS6Video();
  if (n >= G_FIRST && n < G_FIRST + G_STEPS.length) gEnter(n);
  if (n === 19) s19Enter();
  if (typeof quizStepperUpdate === 'function') quizStepperUpdate(n);
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'DEV_SCREEN', screen: n }, '*');
  }
}


/* ══════════════════════════════════════════════════════════════════
   DEV/QA — companion asset audit.
   Walks every screen for `data-char-pose` (images) and `data-char-clip`
   (videos), and for BOTH companions reports what is not really there:
     · missing   — the pose has no entry in CHARACTER_ASSETS, so the screen
                   silently renders the default image; or the file 404s.
     · חלופי     — the file exists but is a knowing stand-in, listed in
                   PLACEHOLDER_ASSETS below until the producer sends the real
                   one. Keep that list honest: it is what the audit reports.
   Answers the dev bar's DEV_SCAN_ASSETS message with DEV_ASSETS.
   ══════════════════════════════════════════════════════════════════ */
const PLACEHOLDER_ASSETS = {
  /* empty = nothing is standing in. Add `'<url>': '<why>'` the moment a file
     goes in as a stand-in, and delete the line when the real one lands. */
};
/* screens whose pose is deliberately the default image until art arrives */
const PLACEHOLDER_POSES = { base: 'صورة افتراضية كعنصر نائب — لم يتم بعد استلام وضعية مخصصة' };
const PLACEHOLDER_POSE_SCREENS = [61];

function devProbe(url) {
  return new Promise(resolve => {
    if (/\.mp4$/i.test(url)) {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => resolve(true);
      v.onerror = () => resolve(false);
      v.src = url;
      return;
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function devScanCharacterAssets() {
  const rows = [];
  const seen = new Set();
  const screenOf = el => {
    const s = el.closest('.screen');
    return s ? Number(s.dataset.screen) : null;
  };

  for (const el of document.querySelectorAll('img[data-char-pose]')) {
    const pose = el.dataset.charPose;
    const screen = screenOf(el);
    for (const id of CHARACTER_IDS) {
      const url = (CHARACTER_ASSETS[id] || {})[pose];
      const key = screen + '|' + id + '|pose|' + pose;
      if (seen.has(key)) continue;
      seen.add(key);
      /* a still beside a clip is only this companion's asset when it has no
         clip — otherwise the video is what plays and the still is dead weight */
      const twin = el.parentElement && el.parentElement.querySelector('video[data-char-clip]');
      if (twin && clipHas(twin.dataset.charClip, id)) continue;
      if (!url) {
        rows.push({ screen, kind: 'صورة', who: id, name: pose,
                    state: 'missing', note: 'لا توجد وضعية كهذه — تعرض الشاشة الصورة الافتراضية' });
        continue;
      }
      const ok = await devProbe(url);
      if (!ok) rows.push({ screen, kind: 'صورة', who: id, name: pose, state: 'missing',
                           note: 'الملف غير موجود: ' + url });
      else if (pose in PLACEHOLDER_POSES && PLACEHOLDER_POSE_SCREENS.includes(screen))
        rows.push({ screen, kind: 'صورة', who: id, name: pose, state: 'placeholder',
                    note: PLACEHOLDER_POSES[pose] });
    }
  }

  for (const el of document.querySelectorAll('video[data-char-clip]')) {
    const clip = el.dataset.charClip;
    const screen = screenOf(el);
    for (const id of CHARACTER_IDS) {
      const url = `media/${id}-${clip}.mp4`;
      const key = screen + '|' + id + '|clip|' + clip;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!clipHas(clip, id)) {
        rows.push({ screen, kind: 'فيديو', who: id, name: clip, state: 'missing',
                    note: 'لم يتم توفير المقطع لهذه الشخصية — تظهر الشاشة مكانه صورة' });
        continue;
      }
      const ok = await devProbe(url);
      if (!ok) rows.push({ screen, kind: 'فيديو', who: id, name: clip, state: 'missing',
                           note: 'الملف غير موجود: ' + url });
      else if (PLACEHOLDER_ASSETS[url])
        rows.push({ screen, kind: 'فيديو', who: id, name: clip, state: 'placeholder',
                    note: PLACEHOLDER_ASSETS[url] });
    }
  }

  rows.sort((a, b) => a.screen - b.screen || a.who.localeCompare(b.who));
  const checked = seen.size;
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'DEV_ASSETS', rows, checked }, '*');
  }
  return rows;
}

/* ── DEV harness bridge (yellow bar protocol) ── */
window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'DEV_GOTO' && typeof e.data.screen === 'number') {
    goTo(e.data.screen);
  }
  if (e.data && e.data.type === 'DEV_SCAN_ASSETS') devScanCharacterAssets();
});
document.addEventListener('DOMContentLoaded', () => {
  buildGuidedScreens();
  applyCharacter();
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'DEV_READY', total: TOTAL_SCREENS }, '*');
  }
});
