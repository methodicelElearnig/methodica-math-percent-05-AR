# methodica-math-percent-05 — אחוזים כבסיס להשוואה הוגנת (יעד 4.5)

The approved unit (delivered 02.09.26), recreated in the client's
multi-component structure — the layout of `methodica-math-ratio-01-main`,
which is the reference for everything here.

## Layout

- `index.html` — redirects to component 01, carrying the query string.
- `methodica-math-percent-05-01 … -06/` — six component apps
  (`index.html` + `script.js` + `styles.css` + `assets/` + `media/` +
  `index_dev.html`). **Component boundaries come from the deck itself:** every
  slide carries a מספר פריט, and its middle field is the component.
  - **01** — screens 0–21 (slides 3–34): פתיחה, הוק, הקנייה, מודרך, משחקון, חימום
  - **02** — screens 22–28 (slides 35–41): תרגול — 5 שאלות (moved from 01, 15.10)
  - **03** — screens 29–40 (slides 43–54): תרגול בסיסי, 6 שאלות (split out of 02, 20.10)
  - **04** — screens 41–53 (slides 56–68): תרגול מתקדם + מודעות לאחוזים
  - **05** — screens 54–60 (slides 70–76): משימת שיא 1 — מצעד השוקו
  - **06** — screens 61–66 (slides 78–83): משימת שיא 2 — ההופעות בשכונות
- `unit-js/` — the shared layer: the whole approved engine, one copy, identical
  in all six components. Each `script.js` holds **only** that component's
  `PART_CONFIG` and xAPI identity.
- `metadata/` — unit + per-component JSONs, `subContent` generated from the
  deck's own item numbers. **informationToBot texts are drafts** (marked
  inline) pending the מפתחת; the MOE subTopic/learningObjective codes and
  estimatedTimeInMinutes are drafts too.
- `_test/` — verbatim from the client example.

## Deviations from the ratio reference (deliberate)

1. **The approved engine moves in whole.** ratio-01-main split its logic into
   ten `unit-js/NN-*.js` files against a hook contract; percent-05 keeps its
   own `engine.js` / `quiz-engine.js` / `unit.js` / `questions.js`, shared the
   same way. Rewriting a 67-screen build onto a second navigation layer would
   have risked behaviour the client already signed off. The seams that the
   split actually needs are three lines, all guarded so the original
   single-app build still runs unchanged:
   - `engine.js` — open on `PART_CONFIG.start`, and `goToNextPart()` on exit.
   - `quiz-engine.js` — build only the questions inside this part's range.
   - `unit.js` — build the guided flow only in the component that owns it.
2. **Screens keep the unit's global numbering** (0–66) instead of restarting
   each component at 0 — same convention as ratio-01-main.
3. **M1/M2 staging:** navigation, gates, chrome and the part chain are wired
   now (M1). xAPI statements and resume payloads are **M2** — `script.js`
   carries `XAPI_COMP_SLUG`/`XAPI_COMP_ID` ready for them.

The original single-app build stays untouched at
`units/methodica-math-percent-05/`.

## Verified

Each component boots on its own first screen with exactly its own screens, no
console errors and no 404s, across every screen for both companions. The seam
hands over 01→02→03→04→05 carrying the query string, component 05 stops at the
end, and the companion choice survives every hop.

## QA rounds

- **08.10.26 — dslides 27-28 (deck 40-41).** Feedback ratios read as the deck's
  rendered order (`15 : 20 = 3 : 4`, original ratio left, reduced right — the
  deck's RTL text box reverses its logical `4 : 3 = 20 : 15`); comma after the
  first במבחן in the stem; hint ends "…במבחן, והפכו אותו לאחוזים."; the "?"
  applet badge on היחס המצומצם removed (the applet itself stays in
  `applets/`, now unreferenced); hint hidden until the first wrong attempt on
  both screens (`hintPolicy: 'after-wrong'`); the screen 27 table capped at
  580px with wrapped headers so the 560px feedback popup no longer covers
  its "% הצלחה" column. **The `styles.css` files are one file — edit component
  01 and copy to the rest.**
- **08.10.26 — dslides 29-33 (deck 43-47).** Screen 29 copy replaced per the
  producer (אין כמו תרגול… / 4 שאלות / וכבר בהתחלה יש רמז! ענו נכון על 3…);
  screen 30: the `.col-pct` column is `display:none` until the verdict (a blank
  column read as a loading error), the feedback carries the deck's full four
  pages (the 9/12 note with its parenthesis, the תנ"ך note), לשון/תנ"ך
  equations inline after their colon as the deck sets them, 5px line rhythm +
  a scoped 518px scroll fallback so it stays inside the stage; set-2 stepper is
  4 stations (30-35), the harder pair (37-40) got its own 2-station group
  `p2b` — the engine has no pass gate, "3 ומעלה" is copy only; screen 33:
  feedback opens with "גילי קרא 15 עמודים…", first-mistake message is
  "זה לא מדויק, ננסה שוב?".
- **08.10.26 — dslides 34-36 (deck 48-50).** Screen 34: the factory name is a
  label ON the box (`.box-panel-name`, engine markup changed in
  `quiz-engine.js` panels branch), captions beneath at 22px, `%` at 20px
  (the global `.screen .vi-colon-sep { font-size: revert }` rendered it at
  16px here), popup 400px wide so the boxes stay visible, `1,000` in the
  feedback. Screen 35: the manager's bubble moved from above her photo into the
  text column right under "ואומרת:" (`.say-after-colon`, CSS-drawn — the
  sprite squashes its tail at column width — spanning the column and reaching
  left across the gutter so the tail lands ON the photo; `#q35 .quiz-main`
  is overflow:visible + z-index 2 for that), red title "זו טעות, בואו נבין למה:". Screen 36 heading
  "הנה עוד 2 תרגילים ברמת קושי גבוהה יותר" (no period — as the producer typed it).
- **08.10.26 — dslides 37-39 (deck 51-53).** Screen 37: new question + answer
  set (single-choice now — only answer 2 is true), header "מספר השאלות הנכונות
  מתוך מספר השאלות שעליהן ענו" on the shared contest table, table fills its
  column at 20px and hugs the text, hint gated. Screen 38: same table, "סמנו
  את כל התשובות הנכונות." appended, red title "זו טעות, …". Screen 39: rebuilt
  as the deck has it — answers typed INTO the board picture via the new engine
  branch `q.imageInputs` (cells as % of the image box), single-column layout,
  verdict = coloured border (cells too small for the glyph), hint gated.
  Screens 37-40 are their own 2-station stepper (`p2b`).
- **08.10.26 — dslides 39-40 (deck 53-54), second pass.** Screen 39: board
  enlarged to 636px (single-column layout gives it the room), zoom chip on it —
  `quizImageZoomInit` now also takes `.vi-image img`; the overlay's close is
  the approved 44px chip (both classes — it was a bare 22px X unit-wide).
  Screen 40: note "ניתן לשבץ יותר משחקן אחד לכל דירוג." under the question,
  hint gated, and the התשובה שלי / התשובה הנכונה toggle for the rank type.
  Fixing that exposed a vendored bug: `quizMarkRetry` and `quizMarkOutcome`
  carried copy-pasted rank RENDER blocks that returned markup and marked
  nothing — the `.rank-slot.is-right/.is-wrong` CSS had never fired. Now the
  first miss marks each rank, the final verdict shows the key (all green) and
  the toggle brings the learner's arrangement back with per-rank marks.
- **08.10.26 — dslides 41-45 (deck 56-60).** Screen 41: title 40px; the two
  boxing clips were SWAPPED on disk (character-1 file held the wheelchair,
  character-2 the pink one) — renamed, so the chosen companion boxes. Screen 42
  (the producer wrote "41"): hint gated, feedback carries the deck's second
  sentence "…, לכן זמן המשחק הוא הבסיס להשוואה." with the lead on its own line.
  Screen 43: stepper stays on question 1 (part ב), Gaia 44-45 are question 2
  of the same strip (`p3`, was `p4`); certificate widened to 820px so it reads
  in two lines; hint gated; התשובה שלי toggle for the dropdown type (verdict
  shows the key in green, toggle brings the learner's picks back red/green);
  `1,000` in the feedback. Thousands sweep (new maven rule §1f): Gaia's
  1,600 / 1,200 / 2,300 / 1,720 in screens 44-45.
- **08.10.26 — dslides 44-48 (deck 59-63).** Screen 44: popup 525px so the
  whole table stays visible beside it (compare התשובה שלי with the key), hint
  gated, `1,600` inside the fraction. Screen 45: one attempt (two options),
  claim right-aligned, `2,300` in the fraction; plain-number equation runs now
  sit on the text BASELINE (`.fb-line > span[dir=ltr]:not(:has(.fraction))`) —
  `vertical-align: middle` is for runs with a stacked fraction and had lifted
  the ש"ח off its line (unit-wide rule, every plain run benefits). Screens
  46/48: the two story answer cards share the row equally (`flex: 1 1 0`,
  stretch) so they are one size. Sweep also fixed `1,500` in HOOD_B_FB.
- **08.10.26 — dslide 51 (deck 66).** The two case arrows curled upward; they
  are now level curves whose head points AT the row's text (right for the
  bottle row, mirrored left for the laptop row). Markup lives in component 03's
  `index.html`, not in the engine.
- **08.10.26 — dslides 54-60 (deck 70-76).** 54: new copy. 55: paragraph gap
  0 so the card reads in one rhythm. 56: 20px throughout, new recipe-book art
  (`q-choco-book.jpg`, re-encoded 1000px from the producer's שוקו.png), hint
  gated, "לשוקו של רימון" in the closing line. 57: one new sentence (the extra
  cup). 58: REBUILT from the producer's screenshot — table after the extra cup
  (23/50, 10/20) with the % column revealed by the feedback, question "האם טעם
  השוקולד התחזק בשני הסירים באותה מידה?", options כן/לא/לא ניתן לדעת (key לא),
  the two girls' new bubbles. **Its feedback is DRAFT copy** (46% / 50% and the
  "same cup, different effect" conclusion) — no feedback text came with the
  screenshot. 60: hint gated; feedback rebuilt from the producer's screenshot
  (כמות column right, x/120 = 45/100, 5x = 270, x = 54, the מסקנה line); the
  old PROPORTION_TABLE const removed (unused).
- **08.10.26 — dslides 51 + 58, second pass.** 51: arrowhead is a filled
  notched triangle on the shaft's end (the open chevron read as detached).
  58: the % column is on the table from the start, grey and empty, and its
  values appear with the verdict (`.col-later` / `.later-val` — `.col-pct`
  stays the "absent until verdict" variant used on 30); hint gated; feedback
  replaced with the producer's text (was/after for each tribe, 5% vs 2%).
- **08.10.26 — dslide 60, second version.** Feedback per the producer's later
  screenshot: table (כמות right), ONE line `120/100% · 45% = 54` with the
  stacked fraction, then the conclusion — the proportion-equation version is gone.
- **08.10.26 — dslide 54 (producer wrote "51"): the wheelchair's start-line
  clip is the producer's ORIGINAL** (`_source-originals/character-2-start.mp4`
  from the flat unit), not the white-keyed one — the fill chopped the track's
  edges. The pink companion keeps its keyed clip.
- **08.10.26 — dslide 60, FINAL:** the 14:22 screenshot is authoritative — table
  (כמות right), x/120 = 45/100, 5x = 270, x = 54, the מסקנה line. The 13:58
  one-line version was a mix-up.
- **08.10.26 — dslide 54: new wheelchair start clip** from the producer
  (`Monster_racing_in_wheelchair_20261008145519.mp4`, archived as
  `…percent-05/media/_source-originals/character-2-start-v2.mp4`), used AS SUPPLIED — producer: do not remove its background (the clip has
  audio; the tag is muted). 1280x720 @ 24fps, plays at the shared 300px clip
  height beside the pink one.
- **08.10.26 — dslide 54: the supplied wheelchair clip has a 1px near-black
  column at x=1279** (its own encode). Clipped in CSS (`#s54 .story-char--clip
  { clip-path: inset(0 3px 0 0) }`), pixels untouched per the producer's
  "do not remove the background".
- **08.10.26 — component 05 (dslides 62-66).** Scene cards (62, 64 — and 55
  before them) lost the 14px paragraph gap: `.scene-card { gap: 0 }` is now the
  rule for every scene screen. 63: new neighbourhoods art from the producer
  (`q-neighbourhoods.jpg`, 1000px from שכונות.png), zoom chip confirmed on it.
  Hints on 63, 65, 66 gated to the first wrong attempt (the whole component).
- **08.10.26 — dslide 65.** Table gains "שטח הפארק (אחוז)" (grey from the
  start, 12% / 15% arrive with the verdict — the `.col-later` pattern);
  feedback: "מוקצים לפארק. לכן:" on the תמר line too, and "זהו אחוז גבוה
  יותר…" starts its own line.
- **08.10.26 — dslide 66.** Feedback carries every element of deck slide 83:
  the proportion table INSIDE the popup (שטח right, אחוז left), then
  `600/100% · 15% = 90` with the stacked fraction, then "יש צורך ב-90 דונמים.";
  the on-screen helper table's columns reordered to match (שטח right).
- **08.10.26 — dslides 61 + 66, second pass.** 66: the on-screen helper table
  is gone; the feedback keeps the deck's table and its formula is ONE stacked
  fraction, `(15% · 600) / 100% = 90` (producer screenshot 15:41). 61: a copy
  of 54's layout — the companion's "הזנקה לריצה" clip (both `*-start.mp4` now
  also in component 05's `media/`) with the same 3px right-edge clip, AND 54's text
  and title verbatim — the producer wants the two screens identical.
- **15.10.26 — type scale raised unit-wide (Elad):** running text 22px, feedback
  20px (was 20/18). The 05.10 TYPE SCALE block was raised in place; a closing
  pass at the END of styles.css catches the rules declared after it or ID-scoped
  (answer pills, dropdowns, dense layout, bubble variants, #q37/38/56/34).
  Kept at their own size: screen titles, buttons, stepper labels (18), ranking
  slot numbers (40), the purple equation card on 13, learn-card / reveal labels.
  Height won back on 25, 28, 32, 35, 39, 43, 45 and the 30 feedback so nothing
  sits under the bottom bar (rendered overflow diff vs the pre-change build).
- **15.10.26 — dslide 1:** no hover / focus highlight on the song cards; only
  the picked card is highlighted (purple border + tint). Scoped `#s1` rule at
  the end of styles.css.
- **15.10.26 — dslide 6:** the title is subject purple like slide 5's (the
  `.watch-head .read-title` dark override removed). **dslides 10-17:** the
  question reads "האם המסקנה של שקד נכונה?" (one shared template in unit.js).
- **15.10.26 — dslides 12, 16, 18, 19.** 12: callout reworded ("כדי לבדוק אם
  שקד צודקת נשווה…"). 16: callout "התשובה היא ב':" + "המסקנה של שקד שגויה, …"
  (the note's reversed-paste "דשק" / "בוטר תוי" read as שקד / טוב יותר).
  18: the two lines under the title at 28px. 19: the applet magnifier sits
  below the report flag (`#s19 .applet-zoom-btn { top: 66px }`).
- **15.10.26 — dslides 25, 26, 28:** the answers no longer sit on the bottom
  bar (≥26px of air now). 25: cheese art 112px; 26: answer column full width so
  three answers fit on one line; 28: tighter table rows.
- **15.10.26 — dslide 29:** speech bubble removed (the companion stays).
  **dslide 30:** the grey "% הצלחה" column is part of the detailed feedback —
  it no longer shows with the first-wrong "ננסה שוב?" popup, only after the
  correct answer or the second wrong one. Fixed in quizCheck's retry branch
  (quiz-engine.js), so `.later-val` on 58 / 65 follows the same rule.
- **15.10.26 — dslides 34, 35, 38: partial answers on the retry.** The first
  wrong check no longer paints every answer red: value inputs are marked per
  field (right = green, wrong = red; a green mark leaves only the field that is
  edited), and in multi-select the right picks stay picked and turn green while
  only the wrong ones go red and clear. The final red feedback of a multi-select
  with some right picks is titled "כמעט! חלק מהתשובות נכונות" (as value-input
  already was). All in quiz-engine.js (quizMarkRetry / quizSelect / the value
  handler / quizCheck), so every multi and value-input screen gets it.
- **15.10.26 — dslide 19: the comparison game persists (client ask).** Progress
  (question, pick, score, streak, finished) is saved to localStorage key
  `percent05_s19_comparisonGame` on every render and restored on mount, so it
  survives leaving the screen, reloading, and coming back from component 02.
  A finished game comes back finished and המשך open. Edited INSIDE the producer
  applet (decode → patch → re-encode with `<\/`); the pristine file is
  `producer-assets/comparison-game.orig.html` — a new producer drop needs the
  `_save` / `_restore` patch re-applied. "שחקו שוב" still restarts (and saves).

### 19.10.26 — partial multi-select shows ✓ on the right picks, uncommitted
- dslides 35, 38 (and every multi-select): on a partial first check the right
  picks stay picked (`.selected.correct`) and used to render as a filled purple
  box; they now show the green ✓ icon. One rule at the end of styles.css,
  copied to 02–05.

### 19.10.26 — dslide 39 wider table + ✓ on right fields at the retry (unit-wide), uncommitted
- dslide 39: the board photo is cropped to the table (`imageInputs.crop` in
  questions.js, handled in quiz-engine.js) and drawn at 1000px instead of 636px.
- Retry (first wrong check), unit-wide: every RIGHT value input gets the ✓
  (`mark-ok`) and every right dropdown blank its ✓; wrong ones stay red. A
  field the learner edits drops its ✓. Table cells (dslides 27, 44) and the
  board cells (39) had their own rules hiding the glyph / red border — fixed
  at the end of styles.css. Checked on 27, 34, 39, 43, 44.
- Same day (dslide 39, unit-wide): the ✓/✗ inside inputs and dropdowns moved
  to the RIGHT edge (also clears the dropdown arrow). Block at the end of styles.css.
- Same day, dslide 39: Elad's new banner art replaces the old board photo
  (`assets/img/q-targets-banner.jpg` in component 02, 1800px from the 2098px
  source). Cropped to targets + table, 1200px wide; the 5 input boxes were
  re-measured off the art and sit left of each painted %. Screen 40 still uses
  the old `q-targets.jpg`.
- Same day, dslide 40: when SOME ranks are right (not all), the red feedback
  reads "טעית חלקית" (final) / "טעית חלקית, ננסה שוב?" (first try). New
  `fb.partial` / `fb.partialRetry` on the question + `quizRankPartial` in the engine.
- Same day, dslide 45: text column 58% → 72% (flyer takes the rest), headers
  nowrap per line → every th is 2 lines (מוצר / אחוז ההנחה 1); the answers end
  ~75px above the bottom bar, no scroll.
- Same day, screen 54 (asked as dslide 53): removed "אם לא הצלחת לענות נכון…
  להסבר נוסף." — "כל הכבוד!" stays. Screen 61 still carries the same lines.
- Same day, peak task (screens 56, 58, 60): no question stepper (`step` removed).
- Same day, dslide 58: the grey "ריכוז השוקולד (אחוז)" column (header too) is
  hidden until the question is over — not shown at the first try.
- Same day, screen 61: removed the same "אם לא הצלחת…" lines (as on 54).
- Same day, dslide 63: the magnifier was dropped when the picture wasn't
  decoded yet at init (width 0 < 120, the prod decode race). quizImageZoomInit
  now waits for the image's load event, plus a window `load` sweep. Checked
  with throttled images on all 5 components: every zoomable photo gets it.
- Same day, dslide 65: grey "שטח הפארק (אחוז)" column only once the question
  is over; question ב reworded (Elad's text); the two speech bubbles removed,
  the photo stays.
- Same day, dslide 66: question ג reworded (the NEW park land only) and the key
  is 30 (was 90). Feedback (HOOD_C_FB) gained the last step: 90 − 60 = 30.
- 20.10.26, dslide 43: partly-right dropdown answer gets its own final title,
  "התשובה נכונה באופן חלקי. כל טעות בונה ידע עמוק יותר." (`fb.partial`, now
  read for dropdowns too in quizCheck).
- Same day, dslide 63: question stepper removed from the peak2 group (63, 65, 66).
- Same day, dslide 65: question ב shortened to "באיזו שכונה החלק של שטח הפארק
  מכלל שטח השכונה גדול יותר?" (the "בהנחה ש…" clause dropped).
- Same day — **component redistribution.** Screens 29–40 are their own
  component 03; the old 03/04/05 are now 04/05/06 (folders, `PART_CONFIG`,
  xAPI slug/id, per-component `index_dev.html`, root DEV `PARTS`, metadata
  JSONs renamed with `order` and item ids renumbered; the old 02 metadata's
  items 1–5 stay in 02, items 6–11 moved to 03). 02 and 03 each still carry a
  full copy of the old 02's `assets/` and `media/`. `report-modal.js` read the
  component number with a percent-08 regex (always "xx"); now generic.
