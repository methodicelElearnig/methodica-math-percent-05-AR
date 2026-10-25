/* =====================================================================
   Unit content — quiz-engine configs. This range (slides 3-16) carries
   no engine questions yet; the hook pick and learn-mode choice are unit
   logic in unit.js.
   ===================================================================== */

'use strict';

/* Figma bubble shapes (551:12741 / 551:12742) — vendored verbatim (§8i) */
function bubblePathBottom(w, h) {
  const r = 10, i = 1, cx = w / 2, td = 15.3, tw = 17;
  return `M ${i + r} ${i} H ${w - i - r} A ${r} ${r} 0 0 1 ${w - i} ${i + r}` +
    ` V ${h - i - r} A ${r} ${r} 0 0 1 ${w - i - r} ${h - i}` +
    ` H ${cx + tw} L ${cx} ${h - i + td} L ${cx - tw} ${h - i}` +
    ` H ${i + r} A ${r} ${r} 0 0 1 ${i} ${h - i - r}` +
    ` V ${i + r} A ${r} ${r} 0 0 1 ${i + r} ${i} Z`;
}
function bubblePathSideLeft(w, h) {
  const r = 8.5, i = 1, cy = h / 2, td = 17.6, th = 11.3;
  return `M ${i + r} ${i} H ${w - i - r} A ${r} ${r} 0 0 1 ${w - i} ${i + r}` +
    ` V ${h - i - r} A ${r} ${r} 0 0 1 ${w - i - r} ${h - i}` +
    ` H ${i + r} A ${r} ${r} 0 0 1 ${i} ${h - i - r}` +
    ` V ${cy + th} L ${i - td} ${cy} L ${i} ${cy - th}` +
    ` V ${i + r} A ${r} ${r} 0 0 1 ${i + r} ${i} Z`;
}
function decorateBubbles(scope) {
  (scope || document).querySelectorAll('.speech-bubble').forEach(b => {
    if (b.querySelector('.bubble-shape')) return;
    const w = b.offsetWidth, h = b.offsetHeight;
    if (!w || !h) return;
    let svg;
    if (b.classList.contains('side-bubble')) {
      const td = 18;
      svg = `<svg class="bubble-shape" style="left:${-td}px;top:0;width:${w + td}px;height:${h}px" ` +
        `viewBox="${-td} 0 ${w + td} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<path d="${bubblePathSideLeft(w, h)}" fill="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
    } else {
      const td = 17;
      svg = `<svg class="bubble-shape" style="left:0;top:0;width:${w}px;height:${h + td}px" ` +
        `viewBox="0 0 ${w} ${h + td}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<path d="${bubblePathBottom(w, h)}" fill="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
    }
    b.insertAdjacentHTML('afterbegin', svg);
  });
}

/* ── The two exam quotes belong to the kids by POSITION on the rendered page:
   נועם is on the LEFT with "25 שאלות, 18 נכון" (72%), עינת on the RIGHT with
   "20 שאלות, 15 נכון" (75%) — which is what the feedback's arithmetic says too.
   The option ORDER and the key come from the rendered slide (עינת carries the
   green V), NOT from the XML, where the three pills sit at identical
   coordinates as animation build states. ── */
const EXAM_FB_BODY =
  'لمقارنة الاختبارين بشكل عادل، سنحوّل كليهما إلى اختبار مكوّن من 100 سؤال.' +
  '<div class="fb-line">أجاب عمر إجابة صحيحة عن 18 سؤالًا من أصل 25 سؤالًا، لذلك: ' +
  '<span dir="ltr"><span class="fraction"><span class="frac-top">18</span><span class="frac-bottom">25</span></span>' +
  '<span class="eq-sign">=</span>' +
  '<span class="fraction"><span class="frac-top">72</span><span class="frac-bottom">100</span></span>' +
  '<span class="eq-sign">=</span><span class="eq-res">72%</span></span></div>' +
  '<div class="fb-line">أجابت ليان إجابة صحيحة عن 15 سؤالًا من أصل 20 سؤالًا، لذلك: ' +
  '<span dir="ltr"><span class="fraction"><span class="frac-top">15</span><span class="frac-bottom">20</span></span>' +
  '<span class="eq-sign">=</span>' +
  '<span class="fraction"><span class="frac-top">75</span><span class="frac-bottom">100</span></span>' +
  '<span class="eq-sign">=</span><span class="eq-res">75%</span></span></div>' +
  '<div class="fb-line">أي أن ليان نجحت أكثر من عمر، ولذلك ستكون علامتها أعلى.</div>';


/* ── deck slides 34-41 · practice set 1 ──────────────────────────────────
   Every key below comes from the rendered slide's V badge, not from the
   feedback prose. Where the two disagree it is called out in CLAUDE.md. */
/* The cheeses, redrawn (01.09) — the deck's photo was 604x403 and read soft at
   any size. The block is SVG so it stays sharp; the LABEL is real HTML, so the
   18px type floor applies to it (SVG text is sized in user units and silently
   ducks under the floor once the viewBox scales). */
function cheeseCard(name, colour, grams, protein) {
  return `<span class="cheese">
    <svg class="cheese-art" viewBox="0 0 160 96" aria-hidden="true">
      <rect x="4" y="4" width="152" height="88" rx="12" fill="#f7d867" stroke="#dcb63c" stroke-width="2"/>
      <circle cx="30" cy="30" r="9" fill="#e9c34d"/><circle cx="128" cy="26" r="7" fill="#e9c34d"/>
      <circle cx="52" cy="70" r="6" fill="#e9c34d"/><circle cx="112" cy="66" r="8" fill="#e9c34d"/>
      <circle cx="80" cy="46" r="5" fill="#e9c34d"/>
    </svg>
    <span class="cheese-label" style="border-color:${colour}">
      <span class="cheese-name" style="color:${colour}">${name}</span>
      <span class="cheese-row"><span>الوزن (بالغرامات)</span><strong>${grams}</strong></span>
      <span class="cheese-row"><span>البروتين (بالغرامات)</span><strong>${protein}</strong></span>
    </span>
  </span>`;
}

const FRC = (n, d) => `<span class="fraction"><span class="frac-top">${n}</span>` +
                      `<span class="frac-bottom">${d}</span></span>`;
const EQ2 = (a, b, c, d, res) =>
  `<div class="fb-line"><span dir="ltr">${FRC(a, b)} = ${FRC(c, d)} = ${res}</span></div>`;

/* feedback bodies, copied from the deck's off-canvas panels */
const SHOPS_FB =
  'في متجر "ستايل سنتر" السعر الأصلي هو 200 ₪ وقيمة الخصم هي 40 ₪، لذلك نسبة الخصم هي:' +
  EQ2(40, 200, 20, 100, '20%') +
  '<div class="fb-line">في متجر "أوربان فايب" السعر الأصلي هو 250 ₪ وقيمة الخصم هي 60 ₪، لذلك نسبة الخصم هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(60, 250)} = ${FRC(6, 25)} = ${FRC(24, 100)} = 24%</span></div>` +
  '<div class="fb-line">لذلك فإن نسبة الخصم في متجر "أوربان فايب" أعلى.</div>';

/* DECK SLIP: the deck writes הרעמים as "25 משחקים ו-18 ניצחונות" reversed —
   its own table says 20 games / 15 wins, and the arithmetic 15/20 agrees with
   the table. Built from the table. */
const TEAMS_FB =
  'في فريق "البروق" عدد المباريات هو 25 وعدد مرات الفوز هو 18، لذلك نسبة الفوز من مجموع المباريات هي:' +
  EQ2(18, 25, 72, 100, '72%') +
  '<div class="fb-line">في فريق "الرعود" عدد المباريات هو 20 وعدد الانتصارات هو 15، لذلك فإن نسبة الانتصارات من مجموع المباريات هي:</div>' +
  EQ2(15, 20, 75, 100, '75%') +
  '<div class="fb-line">لذلك فإن نسبة الانتصارات في فريق "الرعود" أعلى من نسبة الانتصارات في فريق "البروق".<br>' +
  'يعني أن فريق "الرعود" هو الأفضل.</div>';

const CHEESE_FB =
  'علينا أن نقارن نسب البروتين فقط بين أنواع الجبن التي يقل وزنها عن 55 غرامًا، أي بين "عيمك-زهاف" و"غاليلين".' +
  '<div class="fb-line">لنحسب نسبة البروتين في جبنة "غاليلين":</div>' + EQ2(12, 50, 24, 100, '24%') +
  '<div class="fb-line">لنحسب أيضًا نسبة البروتين في جبنة "عيمك-زهاف":</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(10, 40)} = ${FRC(1, 4)} = ${FRC(25, 100)} = 25%</span></div>` +
  '<div class="fb-line">أي أنه من الأفضل أن يختار هادي جبنة "عيمك-زهاف" لأن وزنها أقل من 55 غرامًا ونسبة البروتين فيها أعلى.</div>';

const TABLES_FB =
  'لنقارن نسبة الطاولات التالفة من مجموع الطاولات التي فُحصت في الطرد الأول.' +
  '<div class="fb-line">نسبة الطاولات التالفة في الطرد الأول هي:</div>' + EQ2(5, 50, 10, 100, '10%') +
  '<div class="fb-line">نسبة الطاولات التالفة في الطرد الثاني هي:</div>' + EQ2(20, 500, 4, 100, '4%') +
  '<div class="fb-line">أي أن جودة الإنتاج كانت أقل في الطرد الأول.</div>';

const STUDENTS_FB =
  '<div class="fb-line"><strong>إسراء </strong>- النسبة المبسّطة هي <span dir="ltr">18 : 25</span> (لا يمكن تبسيطها أكثر).<br>' +
  `نسبة النجاح هي <span dir="ltr">${FRC(18, 25)} = 72%</span></div>` +
  '<div class="fb-line"><strong>مايا </strong>- النسبة المبسّطة هي <span dir="ltr">15 : 20 = 3 : 4</span><br>' +
  `نسبة النجاح هي <span dir="ltr">${FRC(15, 20)} = ${FRC(3, 4)} = 75%</span></div>` +
  '<div class="fb-line"><strong>آدم </strong>- النسبة المبسّطة هي <span dir="ltr">12 : 15 = 4 : 5</span><br>' +
  `نسبة النجاح هي <span dir="ltr">${FRC(12, 15)} = ${FRC(4, 5)} = 80%</span></div>`;

/* ── deck slides 44-58 · shared stems and feedback bodies ─────────────── */
const CONTEST_STEM =
  '<p class="q-lead">انطلقت مسابقة البرمجة السنوية!<br>' +
  'تلقى كل تلميذ امتحانًا يحتوي على عدد مختلف من الأسئلة.<br>' +
  'للوصول إلى النهائي، كان عليه أن يجيب إجابة صحيحة عن 75% على الأقل من الأسئلة.<br>' +
  'إليكم نتائج امتحانات الطلاب:</p>';
/* the table goes in the side column so the main one carries only text + answers */
const CONTEST_TABLE =
  '<table class="q-table"><thead><tr><th>المشاركون</th><th>عدد الأسئلة التي أُجيب عنها بشكل صحيح من بين عدد الأسئلة التي أجابوا عنها</th></tr></thead>' +
  '<tbody><tr><td>أحمد</td><td>15 من أصل 20</td></tr><tr><td>سلمى</td><td>15 من أصل 16</td></tr>' +
  '<tr><td>يوسف</td><td>18 من أصل 25</td></tr><tr><td>مايا</td><td>21 من أصل 30</td></tr></tbody></table>';

const LEAGUE_TABLE =
  '<table class="q-table"><thead><tr><th>مجموعة</th><th>مباريات</th><th>دقائق اللعب</th><th>مخالفات</th></tr></thead>' +
  '<tbody><tr><td>الأسود</td><td>10</td><td>400</td><td>60</td></tr>' +
  '<tr><td>النمور</td><td>25</td><td>1,000</td><td>120</td></tr></tbody></table>';

const LEAGUE_STEM =
  '<p class="q-lead">في دوري كرة السلة للمدارس، تريد إدارة الدوري منح لقب "الفريق النزيه" ' +
  'للفريق الذي ارتكب أقل عدد من المخالفات بالنسبة إلى زمن لعبه.<br>' +
  'وصلت إلى المباراة النهائية فرقتان بالبيانات التالية:</p>' + LEAGUE_TABLE;

const LIHI_FB =
  '<div class="fb-line">نسبة نجاح ليلى في امتحان الرياضيات هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(9,12)} = ${FRC(3,4)} = ${FRC(75,100)} = 75%</span></div>` +
  `<div class="fb-line">لاحظوا أنّنا قبل الانتقال إلى النسب المئوية اختصرنا الكسر <span class="fraction fr-inline"><span class="frac-top">9</span><span class="frac-bottom">12</span></span> لكي نسهّل توسيع المقام إلى 100 قبل الانتقال إلى النسبة المئوية (من الأسهل توسيع المقام 4 إلى 100 من توسيع المقام 12 إلى 100).</div>` +
  /* the deck sets the לשון and תנ"ך equations on the SAME line as their lead (slide 44 pages 2/4, 3/4) */
  `<div class="fb-line">نسبة نجاح ليلى في امتحان اللغة العبرية هي: <span dir="ltr">${FRC(20,25)} = ${FRC(80,100)} = 80%</span></div>` +
  '<div class="fb-line">لاحظوا أننا لم نختصر الكسر قبل التحويل إلى نسبة مئوية، لأنّ الانتقال من المقام 25 إلى المقام 100 سهل.</div>' +
  `<div class="fb-line">نسبة نجاح ليلى في امتحان التناخ هي: <span dir="ltr">${FRC(10,20)} = ${FRC(50,100)} = 50%</span></div>` +
  '<div class="fb-line">انتبهوا إلى أنّنا كنّا نستطيع أن نقول فورًا إنّ نسبة نجاح ليلى في التناخ هي 50% لأنّها أجابت إجابة صحيحة عن نصف الأسئلة.</div>' +
  '<div class="fb-line">الاستنتاج هو أن ليلى نجحت في اللغة العبرية أكثر مما نجحت في الرياضيات والتناخ.</div>';

const ASAF_FB = 'رمى أمير نحو الهدف 20 مرة وأصاب الهدف 15 مرة منها، لذلك فإن نسبة إصابات أمير في الهدف هي:' + EQ2(15,20,75,100,'75%');
const LIOR_FB = 'رمى ليث نحو الهدف 25 مرة وأصاب الهدف في 20 مرة منها، لذلك فإن نسبة إصابات ليث في الهدف هي:' + EQ2(20,25,80,100,'80%');

const GILI_FB =
  'قرأ كريم 15 صفحة من كتاب فيه 30 صفحة.' +
  '<div class="fb-line">يمكن أن نلاحظ أن 15 هو نصف 30، ولذلك سنحصل أيضًا على 50 من 100. أي أن نسبة الصفحات التي قرأها هي:</div>' +
  EQ2(15,30,50,100,'50%') +
  '<div class="fb-line">قرأ والد كريم 20 صفحة من كتاب فيه 100 صفحة، لذلك فإن النسبة المئوية للصفحات التي قرأها هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(20,100)} = 20%</span></div>` +
  '<div class="fb-line">أي أنّ كريم قرأ جزءًا أكبر من كتابه.</div>';

const SCREENS_FB =
  '<div class="fb-line">نسبة الشاشات المعيبة في مصنع "قدم":</div>' + EQ2(10,200,5,100,'5%') +
  '<div class="fb-line">نسبة الشاشات المعيبة في مصنع "عتيد":</div>' + EQ2(40,'1,000',4,100,'4%');

const MANAGER_FB =
  'عدد الشاشات المعيبة وحده لا يكفي.' +
  '<div class="fb-line">عندما تكون كميات الإنتاج مختلفة، يجب مقارنة نسبة الشاشات المعيبة.</div>';

const CONTEST_A_FB =
  'لدى أحمد وسلمى العدد نفسه من الإجابات الصحيحة، لكن لا يمكن التعامل معهما بالطريقة نفسها.' +
  '<div class="fb-line">نسبة نجاح أحمد هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(15,20)} = ${FRC(3,4)} = ${FRC(75,100)} = 75%</span></div>` +
  '<div class="fb-line">نسبة نجاح سلمى هي:</div>' + EQ2(15,16,93.75,100,'93.75%') +
  '<div class="fb-line">أي أن نسبة نجاح سلمى قريبة من 100%، أما أحمد فبالكاد وصل إلى النهائي الكبير.</div>';

const CONTEST_B_FB =
  '<div class="fb-line">نسبة نجاح أحمد هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(15,20)} = ${FRC(3,4)} = ${FRC(75,100)} = 75%</span></div>` +
  '<div class="fb-line">نسبة نجاح سلمى هي:</div>' + EQ2(15,16,93.75,100,'93.75%') +
  '<div class="fb-line">نسبة نجاح يوسف هي:</div>' + EQ2(18,25,72,100,'72%') +
  '<div class="fb-line">نسبة نجاح مايا هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(21,30)} = ${FRC(7,10)} = ${FRC(70,100)} = 70%</span></div>` +
  '<div class="fb-line">تجاوز أحمد وسلمى شروط القبول الأساسية وسيشاركان في النهائيات الكبرى.</div>';

/* DECK SLIP: slide 53's feedback writes ענת as "4/5=72%". 4/5 is 80%, the
   rendered slide shows 80, and slide 54 says רוני, גל and ענת are equal —
   which only holds at 80%. Built as 80%. */
const TARGETS_FB =
  '<strong>هكذا نحسب نسبة النجاح لكل طالب:</strong>' +
  `<div class="fb-line"><strong>زياد</strong>: <span dir="ltr">${FRC(21,25)} = 84%</span></div>` +
  `<div class="fb-line"><strong>رنا</strong>: <span dir="ltr">${FRC(16,20)} = 80%</span></div>` +
  `<div class="fb-line"><strong>سامر</strong>: <span dir="ltr">${FRC(8,10)} = 80%</span></div>` +
  `<div class="fb-line"><strong>ياسمين</strong>: <span dir="ltr">${FRC(19,25)} = 76%</span></div>` +
  `<div class="fb-line"><strong>ندى</strong>: <span dir="ltr">${FRC(4,5)} = 80%</span></div>`;

const RANK_FB =
  'زياد هو أفضل مُسدِّد في المسابقة لأن نسبة نجاحه هي الأعلى.' +
  '<div class="fb-line">رنا وسامر وندى لديهم نسبة نجاح متطابقة.</div>' +
  '<div class="fb-line">نسبة نجاح ياسمين هي الأدنى بينهم.</div>';

const LEAGUE_A_FB =
  'جاء في جملة الافتتاح:' +
  '<div class="fb-line">يُمنَح لقب "الفريق النزيه" للفريق الذي كان عدد مخالفاته الأقل نسبةً إلى ' +
  '<strong>إلى زمن اللعب الكلي</strong>، لذلك فإن زمن اللعب هو أساس المقارنة.</div>';

const LEAGUE_B_FB =
  '<div class="fb-line">نسبة المخالفات خلال وقت اللعب في فريق "الأسود" هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(60,400)} = ${FRC(3,20)} = ${FRC(15,100)} = 15%</span></div>` +
  '<div class="fb-line">نسبة المخالفات خلال زمن المباراة في فريق "النمور" هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(120,'1,000')} = ${FRC(3,25)} = ${FRC(12,100)} = 12%</span></div>` +
  '<div class="fb-line">سيحصل فريق "النمور" على الشهادة، لأن نسبة المخالفات لديه أقل.</div>';

/* ── deck slides 59-83 ─────────────────────────────────────────────────── */
const GAIA_TABLE_HEAD = ['منتج', 'السعر الأصلي (بالشيكل)', 'السعر بعد الخصم (بالشيكل)', 'مبلغ الخصم (بالشيكل)', 'نسبة الخصم'];
const GAIA_FB =
  'مبلغ الخصم على الجهاز اللوحي هو 400 شيكل، لذلك فإن نسبة الخصم المئوية هي:' +
  `<div class="fb-line"><span dir="ltr">${FRC(400,'1,600')} = ${FRC(1,4)} = ${FRC(25,100)} = 25%</span></div>` +
  '<div class="fb-line">مبلغ الخصم على الساعة الذكية هو 80 شيكلًا، ولذلك فإن نسبة الخصم هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(80,500)} = ${FRC(4,25)} = ${FRC(16,100)} = 16%</span></div>` +
  '<div class="fb-line">مبلغ الخصم على لوحة المفاتيح والفأرة هو 100 شيكل، ولذلك فإن نسبة الخصم هي:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(100,200)} = ${FRC(1,2)} = ${FRC(50,100)} = 50%</span></div>`;

const GAIA_B_FB =
  'إذا اشترينا المنتجات الثلاثة: جهازًا لوحيًا وساعة ذكية ولوحة مفاتيح لاسلكية، فإننا ندفع:' +
  '<div class="fb-line"><span dir="ltr">1,600 + 500 + 200 = 2,300</span> شيكل</div>' +
  '<div class="fb-line">بعد الخصومات يُدفع: <span dir="ltr">1,200 + 420 + 100 = 1,720</span> شيكل</div>' +
  '<div class="fb-line">هذا يعني أن مبلغ الخصم على المشتريات كلها هو: <span dir="ltr">2,300 − 1,720 = 580</span> شيكل</div>' +
  '<div class="fb-line">لذلك ستكون نسبة الخصم على هذه المشتريات:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(580,'2,300')} = ${FRC(29,115)} = 25.21%</span></div>` +
  '<div class="fb-line">من ناحية أخرى، إذا جمعنا نسب الخصومات فسنحصل على: <span dir="ltr">25% + 16% + 50% = 91%</span></div>' +
  '<div class="fb-line">لذلك لا يمكن القول إنّ نسبة الخصم على الشراء كلّه تساوي مجموع نسب الخصم التي مُنحت على كلّ منتج على حدة.</div>';

/* producer QA 08.10: part ב now follows the extra cup (dslide 57) — one more
   cup of chocolate in each pot, same total. The % column is part of the
   ANSWER and appears with the feedback (`.col-pct`). */
const CHOCO_TABLE =
  '<table class="q-table"><thead><tr><th>فوج</th><th>أكواب حليب الشوكولاتة</th><th>كمية جديدة من أكواب الشوكولاتة الذائبة</th><th class="col-later">تركيز الشوكولاتة (بالنسبة المئوية)</th></tr></thead>' +
  '<tbody><tr><td>البرتقال</td><td>50</td><td>23</td><td class="col-later"><span class="later-val">46%</span></td></tr>' +
  '<tr><td>الرمّان</td><td>20</td><td>10</td><td class="col-later"><span class="later-val">50%</span></td></tr></tbody></table>';
/* the deck's argument photo, one girl's line on each side of it (slide 74) */
const CHOCO_PHOTO =
      '<div class="photo-flank"><div class="photo-flank-says">' +
      '<div class="rs-bubble rs-bubble--above photo-say-bubble"><svg class="rs-bubble-shape" viewBox="0 0 216 89" preserveAspectRatio="none" aria-hidden="true"><use href="#bubble-tail-down"/></svg><span class="rs-bubble-text">تعزّزت نكهة الشوكولاتة في كلا القدرين بالقدر نفسه، لأننا أضفنا الكمية نفسها بالضبط.</span></div>' +
      '<div class="rs-bubble rs-bubble--above photo-say-bubble"><svg class="rs-bubble-shape" viewBox="0 0 216 89" preserveAspectRatio="none" aria-hidden="true"><use href="#bubble-tail-down"/></svg><span class="rs-bubble-text">لست متأكدًا، علينا أن نتحقق!</span></div></div>' +
      '<img class="q-photo" src="assets/img/q-argument.jpg" alt="مشاركتان في المخيّم تتجادلان قرب قدور الشوكولاتة الساخنة"></div>';
const IRIS_FB =
  'لتحديد أي حليب شوكولاتة أغنى بالشوكولاتة، نقارن نسبة الشوكولاتة المئوية في كل وصفة، وليس فقط عدد الأكواب.' +
  '<div class="fb-line"><strong>في الرمّان</strong>: 9 من أصل 20 كوبًا هي شوكولاتة — أي 45%.</div>' +
  '<div class="fb-line"><strong>في البرتقال</strong>: 22 من أصل 50 — أي 44%.</div>' +
  '<div class="fb-line">بما أن 45% أعلى من 44%، فإن طعم الشوكولاتة في حليب فوج «الرمّان» أقوى، ولذلك أخطأت ريم.</div>';
/* the producer's feedback for the new part ב (screenshot 08.10) */
const CHOCO_B_FB =
  'تركيز الشوكولاتة في حليب فوج «البرتقال» كان:' + EQ2(22,50,44,100,'44%') +
  `<div class="fb-line">وبعد إضافة كوب من الشوكولاتة الذائبة يصبح: <span dir="ltr">${FRC(23,50)} = 46%</span></div>` +
  '<div class="fb-line">تركيز الشوكولاتة في حليب فوج «الرمّان» هو:</div>' + EQ2(9,20,45,100,'45%') +
  `<div class="fb-line">وبعد إضافة كوب من الشوكولاتة الذائبة يصبح: <span dir="ltr">${FRC(10,20)} = 50%</span></div>` +
  '<div class="fb-line">لذلك، في فوج «الرمّان» يكون طعم الشوكولاتة في الحليب أقوى، لأن تركيز الشوكولاتة ارتفع بنسبة 5% مقابل ارتفاع بنسبة 2% فقط في فوج «البرتقال».</div>';
/* the producer's feedback for part ג — the full text of the 14:22 screenshot
   (08.10): כמות is the RIGHT column; the unknown leads each equation line
   (Elad's standing rule: `5x = 270`, never `270 = 5x`) */
const PARTY_FB =
  'يريد المرشدون تحضير قدر يتسع لـ 120 كوبًا من حليب الشوكولاتة بتركيز شوكولاتة يبلغ 45%.' +
  '<div class="fb-line">استعانوا بجدول التناسب ليحسبوا كم كوبًا من الشوكولاتة الذائبة النقية يحتاجون إلى وضعه في القدر:</div>' +
  '<table class="fb-table"><thead><tr><th>الكمية</th><th>نسبة مئوية</th></tr></thead>' +
  '<tbody><tr><td>x</td><td>45%</td></tr><tr><td>120 كوبًا</td><td>100%</td></tr></tbody></table>' +
  `<div class="fb-line">لنكوّن معادلة التناسب: <span dir="ltr">${FRC('x',120)} = ${FRC(45,100)}</span></div>` +
  '<div class="fb-line">نضرب في المقام المشترك (600) فنحصل على: <span dir="ltr">5x = 270</span></div>' +
  '<div class="fb-line">وبعد القسمة على 5 نحصل على: <span dir="ltr">x = 54</span></div>' +
  '<div class="fb-line">الاستنتاج: عليهم أن يضيفوا 54 كوبًا من الشوكولاتة الذائبة للحفاظ على التركيز 45%.</div>';

const HOOD_TABLE =
  /* the % column is on the table from the start, grey and empty; its values
     arrive with the verdict (producer QA 08.10, same pattern as screen 58) */
  '<table class="q-table"><thead><tr><th>حي</th><th>المساحة (دونم)</th><th>مساحة الحديقة (دونم)</th><th class="col-later">مساحة الحديقة (بالنسبة المئوية)</th></tr></thead>' +
  '<tbody><tr><td>آدم</td><td>1,500</td><td>180</td><td class="col-later"><span class="later-val">12%</span></td></tr>' +
  '<tr><td>سلمى</td><td>400</td><td>60</td><td class="col-later"><span class="later-val">15%</span></td></tr></tbody></table>';
const JENIA_FB =
  'في حي آدم، تم تخصيص 180 دونمًا من المساحة الكلية للحديقة، مقابل 60 دونمًا في حي سلمى.' +
  '<div class="fb-line">لذلك، من الناحية الكمّية، يتعلّق الأمر فعلًا بمساحة أكبر بثلاثة أضعاف.</div>';
const HOOD_B_FB =
  'في حي آدم تبلغ المساحة الكلية للحي 1,500 دونم، منها 180 دونمًا مخصصة للحديقة. لذلك:' +
  `<div class="fb-line"><span dir="ltr">${FRC(180,'1,500')} = ${FRC(3,25)} = ${FRC(12,100)} = 12%</span></div>` +
  '<div class="fb-line">في حي سلمى المساحة الكلية 400 دونم، منها 60 دونمًا مخصصة للحديقة. لذلك:</div>' +
  `<div class="fb-line"><span dir="ltr">${FRC(60,400)} = ${FRC(3,20)} = ${FRC(15,100)} = 15%</span></div>` +
  '<div class="fb-line">في حي سلمى، تبلغ نسبة المساحة المخصصة للحديقة 15% مقابل 12% في حي آدم.<br>هذه نسبة أعلى، ' +
  'ولذلك يمكن الاستنتاج أن كل مقيم سيحظى بمساحة أكبر في حديقة حي سلمى أثناء العرض.</div>';
/* deck slide 83, every element: the proportion table sits INSIDE the feedback
   (שטח is the right column), then one line with 600 over 100% as a stacked
   fraction, then the conclusion (producer QA 08.10) */
const HOOD_C_FB =
  'نسبة المساحة التي خُصصت للحديقة في حي سلمى كانت 15%، ومساحة الحي كله 400 دونم.' +
  '<div class="fb-line">إضافة 200 دونم ستكبّر الحي إلى 600 دونم.</div>' +
  '<div class="fb-line">لنحسب كم يساوي 15% من 600 باستخدام جدول التناسب:</div>' +
  '<table class="fb-table"><thead><tr><th>مساحة</th><th>نسبة مئوية</th></tr></thead>' +
  '<tbody><tr><td>x</td><td>15%</td></tr><tr><td>600 دونم</td><td>100%</td></tr></tbody></table>' +
  `<div class="fb-line"><span dir="ltr">${FRC('15% · 600','100%')} = 90</span></div>` +
  '<div class="fb-line">بعد التوسعة، ستكون هناك حاجة إلى 90 دونمًا من الحدائق. يوجد بالفعل 60 دونمًا،</div>' +
  `<div class="fb-line">لذلك يجب تخصيص <span dir="ltr">90 − 60 = 30</span> دونمًا من المنطقة الجديدة.</div>`;

const QUESTIONS = [
  {
    /* slide 20 */
    screen: 7,
    /* no progress chip on this slide — the deck opens with the lead line itself */
    label: '',
    stem:
      '<p class="q-lead"><strong>والآن دوركم:</strong><br>' +
      'الأخوان، عمر طالب الصف الثامن وليان طالبة الصف التاسع، تقدّما في اليوم نفسه لامتحانين مختلفين في الرياضيات.</p>' +
      /* RTL flex: the FIRST child renders rightmost, so עינת leads —
         the deck puts עינת right and נועם left */
      '<div class="exam-row">' +
        '<figure class="exam-kid">' +
          '<img src="assets/img/einat.png" alt="ليان">' +
          '<figcaption class="exam-name">ليان</figcaption>' +
        '</figure>' +
        '<div class="exam-quote exam-quote--to-right">"أوف، كان في الامتحان 20 سؤالًا، وأجبت إجابة صحيحة عن 15 سؤالًا فقط."</div>' +
        '<div class="exam-quote exam-quote--to-left">"يا لها من متعة! كان في الامتحان 25 سؤالًا، وأجبت إجابة صحيحة عن 18 منها!"</div>' +
        '<figure class="exam-kid">' +
          '<img src="assets/img/noam.jpg" alt="عمر">' +
          '<figcaption class="exam-name">عمر</figcaption>' +
        '</figure>' +
      '</div>' +
      '<p class="q-ask"><strong>من الذي نجح أكثر في الاختبار، عمر أم ليان؟</strong></p>',
    type: 'single',
    options: [
      { id: 'a', html: 'ليان' },
      { id: 'b', html: 'عمر' },
      { id: 'c', html: 'لا يمكن أن نعرف' },
    ],
    correct: 'a',
    maxAttempts: 2,
    fb: {
      correct: { title: 'أصبت!', body: EXAM_FB_BODY },
      wrong: { title: 'أخطأت، وهذا لا بأس به إطلاقًا، فهكذا نتعلّم تمامًا.', body: EXAM_FB_BODY },
      retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
    },
    /* the deck gives this screen no רמז — the hint button stays out */
    hint: '',
  },
  {
    /* slide 34 — warm-up */
    screen: 21, label: '',
    stem: '<p class="q-lead">تنافس سامر ورنا في التسديد على السلة في حصة الرياضة.<br>' +
      'رمت رنا الكرة نحو السلة 10 مرات، وسجّلت 7 مرات.<br>' +
      'رمى سامر الكرة نحو السلة 50 مرة، وأصاب 30 مرة.<br>' +
      'قال سامر: "كرتي دخلت السلة 30 مرة، وكرة رنا دخلت 7 مرات فقط. أنا أصوّب أفضل!"</p>' +
      '<p class="q-ask"><strong>هل سامر على حق؟</strong></p>',
    content: '<img class="q-photo" src="assets/img/q-basketball.jpg" alt="لوحة النتائج: رنا 7 إصابات من أصل 10، سامر 30 من أصل 50">',
    type: 'single',
    options: [{ id: 'a', html: 'نعم' }, { id: 'b', html: 'لا' }, { id: 'c', html: 'لا يمكن معرفة ذلك' }],
    correct: 'b',
    maxAttempts: 2,
    hint: 'لكي تكون المقارنة عادلة، احسبوا نسبة إصابات كل واحد منهم من مجموع رميّاته نحو السلة.',
    fb: {
      correct: { title: 'أحسنت!', body:
        'لنحسب نسبة إصابة كل واحد منهم من مجموع رمياته نحو السلة.' +
        '<div class="fb-line">نسبة تسديدات رنا الناجحة من مجموع رميّاتها:</div>' + EQ2(7, 10, 70, 100, '70%') +
        '<div class="fb-line">نسبة إصابات سامر من مجموع رميّاته كلها:</div>' + EQ2(30, 50, 60, 100, '60%') +
        '<div class="fb-line">لذلك سامر مخطئ.</div>' },
      wrong: { title: 'أخطأتم، لا بأس، فكل محاولة تقرّبكم من الفهم.', body:
        'لنحسب نسبة إصابة كل واحد منهم من مجموع رمياته نحو السلة.' +
        '<div class="fb-line">نسبة تسديدات رنا الناجحة من مجموع رميّاتها:</div>' + EQ2(7, 10, 70, 100, '70%') +
        '<div class="fb-line">نسبة إصابات سامر من مجموع رميّاته كلها:</div>' + EQ2(30, 50, 60, 100, '60%') +
        '<div class="fb-line">لذلك سامر مخطئ.</div>' },
      retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
    },
  },
  {
    /* slide 36 — practice 1/5 */
    screen: 23, step: { group: 'p1', index: 1, total: 5 },
    stem: '<p class="q-lead">في متجر "ستايل سنتر" يوجد خصم بقيمة 40 ₪ على بنطال جينز سعره 200 ₪.<br>' +
      'في متجر "أوربان فايب" هناك خصم بقيمة 60 ₪ على بنطال جينز سعره 250 ₪.</p>' +
      '<p class="q-ask"><strong>في أي متجر نسبة الخصم أعلى؟</strong></p>',
    content: '<img class="q-photo" src="assets/img/q-shops.jpg" alt="متجران للجينز: ستايل سنتر 200 ₪ مع خصم 40 ₪، أوربان فايب 250 ₪ مع خصم 60 ₪">',
    type: 'single',
    options: [{ id: 'a', html: 'في "ستايل سنتر"' }, { id: 'b', html: 'في "أوربان فايب"' },
              { id: 'c', html: 'في المتجرين نسبة الخصم متساوية' }, { id: 'd', html: 'لا يمكن معرفة ذلك' }],
    correct: 'b',
    maxAttempts: 2,
    /* producer 06.10 — hint gated to after the first wrong attempt. The engine
       renders the button with visibility:hidden and reveals it on the retry
       branch; this is the first screen in the unit to use the policy. */
    hintPolicy: 'after-wrong',
    hint: 'انتبهوا إلى أنّ السعر الأصلي يختلف من متجر إلى آخر، وكذلك مقدار الخصم.',
    fb: {
      correct: { title: 'صحيح!', body: SHOPS_FB },
      wrong: { title: 'هذا خطأ، فلنتعلّم منه.', body: SHOPS_FB },
      retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
    },
  },
  {
    /* slide 37 — practice 2/5, dropdown inside the headline */
    screen: 24, step: { group: 'p1', index: 2, total: 5 },
    stem: '<p class="q-lead">أنهى فريقان لكرة القدم الموسم:</p>' +
      '<table class="q-table"><thead><tr><th>فريق</th><th>المباريات</th><th>انتصارات</th></tr></thead>' +
      '<tbody><tr><td>البروق</td><td>25</td><td>18</td></tr>' +
      '<tr><td>الرعود</td><td>20</td><td>15</td></tr></tbody></table>' +
      '<p class="q-ask"><strong>أكملوا عنوان المجلة الرياضية:</strong></p>',
    type: 'dropdown',
    sentence: ['فريق ', ' هو الفريق الأفضل هذا الموسم!'],
    blanks: [{ pool: ['البروق', 'الرعود'], correct: 'الرعود' }],
    maxAttempts: 1,   /* producer 06.10 — one attempt; the first answer resolves */
    hint: 'عدد المباريات وعدد مرات الفوز مختلفان.<br>ما هي النسبة المئوية للفوز؟',
    fb: {
      correct: { title: 'صحيح!', body: TEAMS_FB },
      wrong: { title: 'هذا خطأ. لا بأس، هكذا نتعلّم!', body: TEAMS_FB },
      retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
    },
  },
  {
    /* slide 38 — practice 3/5, click the cheese */
    screen: 25, step: { group: 'p1', index: 3, total: 5 },
    stem: '<p class="q-lead">على الرف في سوبرماركت الحي "شيفع زكريا" ثلاثة أنواع من الجبن.<br>' +
      'يحضّر هادي فطيرة، وقد كُتب في الوصفة أن يستخدم جبنة وزنها أقل من 55 غرامًا.<br>' +
      'أيٌّ من أنواع الجبنة يناسبه، إذا كان يريد أعلى نسبة مئوية من البروتين؟</p>' +
      '<p class="q-ask"><strong>اضغطوا على الجبنة التي سيختارها على الأرجح:</strong></p>' +
      /* the shelf sits ABOVE the select and outside it (producer 01.09).
         RTL row: the first card renders rightmost, matching the deck's shelf. */
      '<div class="cheese-shelf">' +
        cheeseCard('غاليلين', '#2f7d4f', 50, 12) +
        cheeseCard('عيمك-زهاف', '#1c3f6e', 40, 10) +
        cheeseCard('شلهيفت', '#9c2b1f', 60, 12) + '</div>',
    type: 'single',
    options: [
      { id: 'a', html: 'غاليلين' },
      { id: 'b', html: 'عيمك-زهاف' },
      { id: 'c', html: 'شلهيفت' },
    ],
    correct: 'b',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer 06.10 */
    hint: 'أيّ جبنة لا تناسب حسب تعريف هادي؟',
    fb: {
      correct: { title: 'إجابة صحيحة!', body: CHEESE_FB },
      wrong: { title: 'هذا خطأ. لكن لا تقلق، الفهم يُبنى تدريجيًا.', body: CHEESE_FB },
      retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
    },
  },
  {
    /* slide 39 — practice 4/5 */
    screen: 26, step: { group: 'p1', index: 4, total: 5 },
    stem: '<p class="q-lead">أنهى مصنع الأثاث "خشب للجميع" تصنيع الطاولات لمدرسة إعدادية جديدة، وجهّزها في طرود للشحن.<br>' +
      'في طرد الشحن الأول تم فحص 50 طاولة ووُجد أن 5 منها تالفة.<br>' +
      'في طرد الشحن الثاني تم فحص 500 طاولة، ووُجدت 20 منها تالفة.</p>' +
      '<p class="q-ask"><strong>في أي طرد شحن كانت جودة الإنتاج أسوأ؟</strong></p>',
    content: '<div class="g-widget g-widget--above q-widget">' +
      '<div class="rs-bubble rs-bubble--above g-widget-bubble"><svg class="rs-bubble-shape" viewBox="0 0 216 89" preserveAspectRatio="none" aria-hidden="true"><use href="#bubble-tail-down"/></svg>' +
      '<span class="rs-bubble-text">ألو؟ خدمة العملاء؟<br>كيف يمكن فحص جودة الإنتاج عندكم؟</span></div>' +
      '<img data-char-pose="base" src="" alt="الشخصية المرافقة"></div>',
    type: 'single',
    options: [
      { id: 'a', html: 'في طرد الشحن الثاني، لأن نسبة التالف فيه هي 20%.' },
      { id: 'b', html: 'كانت الجودة متطابقة في الطردين، لأن نسبة التالف في كليهما كانت 10%.' },
      { id: 'c', html: 'في طرد الشحن الأول، لأن نسبة التالف فيه 10%، مقارنةً بالطرد الثاني الذي تبلغ نسبة التالف فيه 4% فقط.' },
      { id: 'd', html: 'في الطرد الثاني، لأنّ 20 طاولة تالفة أكثر من 5 طاولات تالفة.' },
    ],
    correct: 'c',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer 06.10 */
    hint: 'ما هي نسبة الطاولات التالفة في كل طرد؟',
    fb: {
      correct: { title: 'إجابة صحيحة!', body: TABLES_FB },
      wrong: { title: 'هذا خطأ. لا بأس، نتعلّم ونتحسّن!', body: TABLES_FB },
      retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
    },
  },
  {
    /* slide 40 — practice 5/5, part א: complete the table */
    screen: 27, step: { group: 'p1', index: 5, total: 5 },
    stem: '<p class="q-lead">سيختار طاقم العلوم في المدرسة طالبًا أو طالبة لتمثيل مدرسة "البحر والطبيعة" في مسابقة العلوم الوطنية.<br>' +
      'في الجدول الذي أمامكم تظهر نتائج الاختبارات للطالبات والطالب المرشحين.</p>' +
      '<p class="q-ask"><strong>أ. أكملوا في الجدول <mark>النسبة المبسّطة</mark> بين عدد الإجابات الصحيحة وعدد الأسئلة في الامتحان، و<mark>نسبة النجاح</mark> في الامتحان:</strong></p>',
    type: 'value-input',
    tableHead: ['الطالب/الطالبة', 'عدد الأسئلة', 'إجابات صحيحة', 'نسبة مبسّطة', 'نسبة النجاح في الاختبار %'],
    tableRows: [
      ['<img class="q-face" src="assets/img/student-esti.jpg" alt=""> إسراء', '25', '18',
        { ratio: true, label: 'نسبة إسراء المبسّطة' }, { pct: true, label: 'نسبة نجاح إسراء المئوية' }],
      ['<img class="q-face" src="assets/img/student-maya.jpg" alt=""> مايا', '20', '15',
        { ratio: true, label: 'النسبة المبسّطة لمايا' }, { pct: true, label: 'نسبة نجاح مايا المئوية' }],
      ['<img class="q-face" src="assets/img/student-alon.jpg" alt=""> آدم', '15', '12',
        { ratio: true, label: 'النسبة المبسّطة لآدم' }, { pct: true, label: 'نسبة نجاح آدم' }],
    ],
    /* per row: ratio-left, ratio-right, percent */
    correctInputs: ['18', '25', '72', '3', '4', '75', '4', '5', '80'],
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'تذكروا، تُكتب النسبة من اليسار إلى اليمين.<br>لحساب نسبة النجاح، احسبوا الجزء الذي يمثّل عدد الإجابات الصحيحة من عدد الأسئلة في الامتحان، ثم حوّلوه إلى نسبة مئوية.',
    fb: {
      correct: { title: 'صحيح!', body: '<strong>نجحتم في إكمال الجدول دون أخطاء.</strong>' + STUDENTS_FB },
      wrong: { title: 'أخطأت، أحسنت لأنك حاولت، والآن يمكننا أن نضبط الإجابة أكثر.', body: STUDENTS_FB },
      retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
    },
  },
  {
    /* slide 41 — practice 5/5, part ב */
    screen: 28, step: { group: 'p1', index: 5, total: 5 },
    stem: '<p class="q-lead">سيختار طاقم العلوم في المدرسة تلميذًا أو تلميذة لتمثيل مدرسة "البحر والطبيعة" في مسابقة العلوم الوطنية.<br>' +
      'يعرض الجدول التالي نتائج اختبارات المرشحين:</p>' +
      '<table class="q-table"><thead><tr><th>طالب/ة</th><th>عدد الأسئلة</th><th>إجابات صحيحة</th><th>نسبة مبسّطة</th><th>نسبة النجاح %</th></tr></thead>' +
      '<tbody><tr><td><img class="q-face" src="assets/img/student-esti.jpg" alt=""> إسراء</td><td>25</td><td>18</td><td dir="ltr">18 : 25</td><td>72%</td></tr>' +
      '<tr><td><img class="q-face" src="assets/img/student-maya.jpg" alt=""> مايا</td><td>20</td><td>15</td><td dir="ltr">3 : 4</td><td>75%</td></tr>' +
      '<tr><td><img class="q-face" src="assets/img/student-alon.jpg" alt=""> آدم</td><td>15</td><td>12</td><td dir="ltr">4 : 5</td><td>80%</td></tr></tbody></table>' +
      '<p class="q-ask"><strong>ب. بحسب نتائج الامتحان، مَن من التلاميذ يجدر اختياره؟</strong></p>',
    type: 'single',
    options: [{ id: 'a', html: 'إسراء' }, { id: 'b', html: 'مايا' },
              { id: 'c', html: 'آدم' }, { id: 'd', html: 'لا يمكن الحسم' }],
    correct: 'c',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'تأمّلوا الجدول وتحقّقوا من المعلومات التي تتيح لكم تحديد أيّ التلاميذ كان أكثر نجاحًا.',
    fb: {
      correct: { title: 'أحسنت!', body: 'آدم هو صاحب أعلى نسبة نجاح في الاختبار، ولذلك فهو الأنسب لتمثيل المدرسة.' },
      wrong: { title: 'أخطأت. لا بأس، فالتدريب يصنع الفرق!', body: 'آدم هو صاحب أعلى نسبة نجاح في الاختبار، ولذلك فهو الأنسب لتمثيل المدرسة.' },
      retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
    },
  },
  {
    /* slide 44 */
    screen: 30, step: { group: 'p2', index: 1, total: 4 },
    dense: true,
    stem: '<p class="q-lead">خضعت ليلى لثلاثة اختبارات، وهذه هي النتائج:</p>' +
      '<table class="q-table" id="q30-table"><thead><tr><th>المادة</th><th>عدد الأسئلة</th><th>إجابات صحيحة</th><th class="col-pct">نسبة النجاح في الاختبار %</th></tr></thead>' +
      '<tbody><tr><td>الرياضيات</td><td>12</td><td>9</td><td class="col-pct">75%</td></tr>' +
      '<tr><td>اللغة العبرية</td><td>25</td><td>20</td><td class="col-pct">80%</td></tr>' +
      '<tr><td>التناخ</td><td>20</td><td>نصف الأسئلة</td><td class="col-pct">50%</td></tr></tbody></table>' +
      '<p class="q-ask"><strong>في أي اختبار كان نجاحها أكبر؟</strong></p>',
    type: 'single',
    options: [{ id: 'a', html: 'الرياضيات' }, { id: 'b', html: 'اللغة العبرية' },
              { id: 'c', html: 'التناخ' }, { id: 'd', html: 'نجحت في جميعها بالقدر نفسه' }],
    correct: 'b',
    maxAttempts: 2,
    hint: 'احسبوا نسبة النجاح في كل اختبار.',
    fb: { correct: { title: 'صحيح!', body: LIHI_FB },
          wrong: { title: 'هذا خطأ. لا بأس، فلنتعلم من ذلك!', body: LIHI_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 45 */
    screen: 31, step: { group: 'p2', index: 2, total: 4 },
    stem: '<p class="q-lead">تدرّب أمير وليث على الرماية.<br>' +
      'رمى أمير نحو الهدف 20 مرة وأصاب الهدف في 15 مرة منها.</p>' +
      '<p class="q-ask"><strong>أ. ما النسبة المئوية لإصابات أمير في الهدف؟</strong></p>',
    content: '<img class="q-photo" src="assets/img/q-archery-a.jpg" alt="أمير يتدرّب على الرماية">',
    type: 'value-input',
    tableHead: ['نسبة إصابات أمير'],
    tableRows: [[{ pct: true, label: 'نسبة إصابات أمير' }]],
    correctInputs: ['75'],
    maxAttempts: 2,
    hint: 'احسبوا عدد الإصابات من عدد الرميات ثم وسّعوا الكسر إلى مقام 100.',
    fb: { correct: { title: 'صحيح!', body: ASAF_FB },
          wrong: { title: 'أخطأت، وهذا جزء طبيعي من عملية التعلّم.', body: ASAF_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 46 */
    screen: 32, step: { group: 'p2', index: 2, total: 4 },
    stem: '<p class="q-lead">رمى ليث نحو الهدف 25 مرة وأصاب الهدف في 20 مرة منها.</p>' +
      '<p class="q-ask"><strong>ب. ما النسبة المئوية لإصابات ليث في الهدف؟</strong></p>',
    content: '<img class="q-photo q-photo--sm" src="assets/img/q-archery-b.jpg" alt="ليث يتدرّب على الرماية">' +
      '<div class="g-widget g-widget--above q-widget-inline">' +
      '<div class="rs-bubble rs-bubble--above g-widget-bubble"><svg class="rs-bubble-shape" viewBox="0 0 216 89" preserveAspectRatio="none" aria-hidden="true"><use href="#bubble-tail-down"/></svg>' +
      '<span class="rs-bubble-text">ما دمت لا تصيب 75% على الأقل من المحاولات، فلن تُعتبر محترفًا!</span></div>' +
      '<img data-char-pose="base" src="" alt="الشخصية المرافقة"></div>',
    type: 'value-input',
    tableHead: ['نسبة إصابات ليث'],
    tableRows: [[{ pct: true, label: 'نسبة إصابات ليث' }]],
    correctInputs: ['80'],
    maxAttempts: 2,
    hint: 'احسبوا عدد الإصابات من عدد الرميات، ثم وسّعوا الكسر إلى مقام 100.',
    fb: { correct: { title: 'صحيح!', body: LIOR_FB },
          wrong: { title: 'أخطأتم، ومن الرائع أنكم تتدرّبون ولا تستسلمون.', body: LIOR_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 47 */
    screen: 33, step: { group: 'p2', index: 3, total: 4 },
    noZoom: true,
    stem: '<p class="q-lead">كريم ووالده يتجادلان حول من تقدّم أكثر في الكتاب الذي يقرؤه.<br>' +
      'قرأ كريم 15 صفحة من كتاب فيه 30 صفحة.<br>' +
      'قرأ والد كريم 20 صفحة من كتاب يحتوي على 100 صفحة.</p>' +
      '<p class="q-ask"><strong>من قرأ جزءًا أكبر من كتابه؟</strong></p>',
    content: '<img class="q-photo" src="assets/img/q-reading.jpg" alt="يقرأ كريم وأبوه كتباً">',
    type: 'single',
    options: [
      { id: 'a', html: 'كريم، لأنه قرأ نصف كتابه (50%)، بينما قرأ والده 20% فقط.' },
      { id: 'b', html: 'قرأ والد كريم جزءًا أكبر: فهو وصل إلى 20% من الكتاب، بينما كريم وصل إلى 15% فقط.' },
      { id: 'c', html: 'كلاهما قرأ النسبة المئوية نفسها من كتابه.' },
      { id: 'd', html: 'قرأ والد كريم نسبة مئوية أكبر من كتابه، لأن عدد الصفحات في كتابه أكبر.' },
    ],
    correct: 'a',
    maxAttempts: 2,
    hint: 'احسبوا كم بالمئة قرأ كل واحد منهما من كتابه.',
    fb: { correct: { title: 'صحيح!', body: GILI_FB },
          wrong: { title: 'أخطأت، لكن المحاولة تنمّي التفكير.', body: GILI_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },   /* producer QA 08.10 */
  },
  {
    /* slide 48 */
    screen: 34, step: { group: 'p2', index: 4, total: 4 },
    stem: '<p class="q-lead">أنتم محتارون في اختيار المصنع الذي ستطلبون منه شاشات للهواتف المحمولة.<br>' +
      'أنتج مصنع "قدم" هذا الشهر كمية صغيرة من الشاشات بلغت 200 شاشة، وتبيّن أن 10 شاشات منها معيبة.<br>' +
      'أنتج مصنع "عتيد" هذا الشهر 1,000 شاشة، ومن بينها تبيّن أن 40 شاشة معيبة.</p>' +
      '<p class="q-ask"><strong>أ. احسبوا النسبة المئوية للشاشات التالفة في كل مصنع من المصانع:</strong></p>',
    noZoom: true,
    type: 'value-input',
    /* RTL row: קדם leads, so it renders rightmost. Widths keep the deck's size
       contrast — the whole point is that one factory is far smaller. */
    panels: [
      { name: 'قدم',  img: 'assets/img/q-box-small.png', w: 130, lines: ['📱 200', '❌ 10'] },
      { name: 'عتيد', img: 'assets/img/q-box-big.png',   w: 220, lines: ['📱 1,000', '❌ 40'] },
    ],
    correctInputs: ['5', '4'],
    maxAttempts: 2,
    hint: 'احسبوا نسبة الشاشات المعيبة من مجمل الشاشات في كل مصنع.',
    fb: { correct: { title: 'صحيح!', body: SCREENS_FB },
          wrong: { title: 'هذا خطأ. لا بأس، لنحسب معًا:', body: SCREENS_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 49 — multi-select */
    screen: 35, step: { group: 'p2', index: 4, total: 4 },
    dense: true,
    stem: '<p class="q-lead">اكتشفنا:<br>' +
      'مصنع "قدم" أنتج هذا الشهر 200 شاشة، ومنها 10 شاشات معيبة، أي 5%.<br>' +
      'أنتج مصنع "عتيد" هذا الشهر 1,000 شاشة، ومن بينها 40 شاشة معيبة - 4%.<br>' +
      'تحاول مديرة مصنع "قدم" إقناعكم باختيار مصنعها، وتقول:</p>' +
      /* the manager's line sits right under "ואומרת:", tail toward her photo on
         the left — as the deck lays it out (producer QA 08.10) */
      /* CSS-drawn bubble: the sprite cannot stretch to column width without
         squashing its tail, and this one must span the column (QA 08.10) */
      '<div class="say-after-colon">' +
      '<svg class="say-tail" viewBox="0 0 26 30" width="26" height="30" aria-hidden="true"><path d="M26 1.5 L2 15 L26 28.5" fill="#fff" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>' +
      '<span class="say-text">في مصنعي أُنتجت 10 شاشات معيبة فقط، وليس 40 كما في «عتيد».<br>مصنعي أكثر جودة!</span></div>' +
      '<p class="q-ask"><strong>ب. لماذا قد يكون ادعاء مديرة المصنع مضلِّلًا؟</strong><br>' +
      '<strong>حدّدوا جميع الإجابات الصحيحة.</strong></p>',
    noZoom: true,
    /* the manager's line is a speech bubble off her photo (producer 01.09) */
    /* bubble ABOVE the photo with the tail coming out of its bottom, onto her
       — the beside-bubble rendered broken here (producer 01.09) */
    content: '<div class="photo-say"><img class="q-photo" src="assets/img/q-factory.jpg" alt="مديرة المصنع"></div>',
    type: 'multi',
    options: [
      { id: 'a', html: 'هي لا تأخذ في الحسبان عدد الشاشات التي ينتجها كل واحد من المصانع.' },
      { id: 'b', html: 'نسبة الشاشات المعيبة في مصنع "قدم" أقل من نسبة الشاشات المعيبة في مصنع "عتيد".' },
      { id: 'c', html: 'نسبة الشاشات المعيبة في مصنع "عتيد" أقل من نسبة الشاشات المعيبة في مصنع "قدم".' },
      { id: 'd', html: 'كمية الإنتاج في مصنع "عتيد" أكبر 4 مرات من كمية الإنتاج في مصنع "قدم".' },
    ],
    correctSet: ['a', 'c'],
    maxAttempts: 2,
    hint: 'قارنوا بين عدد الشاشات المعيبة وعدد الشاشات التي أُنتجت في كل مصنع.<br>' +
      'هل يكفي أن ننظر إلى عدد الشاشات المعيبة فقط لنحدد أي مصنع أفضل جودة؟',
    fb: { correct: { title: 'صحيح!', body: MANAGER_FB },
          wrong: { title: 'هذا خطأ، فلنفهم السبب:', body: MANAGER_FB }   /* producer QA 08.10 */,
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 51 — multi-select */
    screen: 37, step: { group: 'p2b', index: 1, total: 2 },
    dense: true,
    /* producer QA 08.10: new question + answer set; only answer 2 is true
       (75% vs 93.75%), so the screen became single-choice */
    stem: CONTEST_STEM + '<p class="q-ask"><strong>أ. هل كان نجاح أحمد وسلمى متطابقًا (حصلا على العلامة نفسها)؟</strong></p>',
    content: CONTEST_TABLE,
    type: 'single',
    options: [
      { id: 'a', html: 'لا، لأن نسبة إجابات أحمد الصحيحة المئوية أعلى من نسبة إجابات سلمى.' },
      { id: 'b', html: 'لا، لأن نسبة الإجابات الصحيحة لدى سلمى أعلى من نسبتها لدى أحمد.' },
      { id: 'c', html: 'نعم، لأنهما أجابا فعلًا إجابة صحيحة عن العدد نفسه من الأسئلة.' },
      { id: 'd', html: 'نعم، كلاهما أجاب إجابة صحيحة عن 75% على الأقل من الأسئلة.' },
    ],
    correct: 'b',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',
    hint: 'انتبهوا إلى عدد الأسئلة التي حصل عليها كل واحد منهما.',
    fb: { correct: { title: 'صحيح!', body: CONTEST_A_FB },
          wrong: { title: 'هذا خطأ. لا بأس، لنشرح الأمر خطوة خطوة:', body: CONTEST_A_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 52 — multi-select */
    screen: 38, step: { group: 'p2b', index: 1, total: 2 },
    dense: true,
    stem: CONTEST_STEM + '<p class="q-ask"><strong>ب. من بين التلاميذ الأربعة، من استوفى شروط الحد الأدنى وتأهّل إلى النهائي الكبير؟</strong><br><strong>حدّدوا جميع الإجابات الصحيحة.</strong></p>',
    content: CONTEST_TABLE,
    type: 'multi',
    options: [
      { id: 'a', html: 'أحمد' }, { id: 'b', html: 'سلمى' },
      { id: 'c', html: 'يوسف' }, { id: 'd', html: 'مايا' },
    ],
    correctSet: ['a', 'b'],
    maxAttempts: 2,
    hint: '',
    fb: { correct: { title: 'صحيح!', body: CONTEST_B_FB },
          wrong: { title: 'هذا خطأ، لا تيأسوا، فكل تعلُّم يبدأ هكذا.', body: CONTEST_B_FB }   /* producer QA 08.10 */,
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 53 — complete the success percentages */
    screen: 39, step: { group: 'p2b', index: 2, total: 2 },
    dense: true,
    stem: '<p class="q-lead">عُلِّقت عند مدخل المدرسة نتائج الطلاب الذين حققوا أفضل الإنجازات في مسابقة الرماية التي أُقيمت في أسبوع الرياضة.<br>' +
      'نسوا إضافة شيء واحد فقط... نسبة النجاح المئوية لكل طالب!</p>' +
      '<p class="q-ask"><strong>أ. أكملوا نسب النجاح في العمود المناسب لكل واحد من الطلاب في الجدول.</strong></p>',
    type: 'value-input',
    /* producer QA 08.10: as in the deck, the answers go INTO the board picture —
       one input over each "אחוז הצלחה" cell (the % sign is painted in the art). */
    /* QA 19.10.26: Elad's new banner (2098x749 source, shipped at 1800px),
       cropped to the targets + table (x 125-1980, y 75-668) and drawn 1200px
       wide. Each input sits left of its painted % (cell boxes measured off the
       art). DOM order right-to-left (דני first) = correctInputs. */
    imageInputs: { src: 'assets/img/q-targets-banner.jpg', alt: 'لوحة نتائج مسابقة الرماية', w: 1200,
      crop: { x: 5.958, y: 10.013, w: 88.418, h: 79.172, ar: 2098 / 749 }, cells: [
      { x: 63.441, y: 78.238, w: 8.103, h: 7.477, label: 'نسبة نجاح زياد' },
      { x: 49.809, y: 78.238, w: 8.103, h: 7.477, label: 'نسبة نجاح رنا' },
      { x: 36.225, y: 78.238, w: 8.103, h: 7.477, label: 'نسبة نجاح سامر' },
      { x: 22.450, y: 78.238, w: 8.103, h: 7.477, label: 'نسبة نجاح ياسمين' },
      { x: 9.009, y: 78.238, w: 8.103, h: 7.477, label: 'نسبة نجاح ندى' },
    ] },
    correctInputs: ['84', '80', '80', '76', '80'],
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'احسبوا الجزء من الكل وحوّلوه إلى نسبة مئوية.',
    fb: { correct: { title: 'أحسنت!', body: '<strong>لقد ملأتم الجدول بشكل مثالي:</strong>' + TARGETS_FB },
          wrong: { title: 'أخطأتم، وهذا لا بأس به، فمزيد من التدرّب سيساعد على ربط الأجزاء معًا.', body: TARGETS_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 54 — rank the players */
    screen: 40, step: { group: 'p2b', index: 2, total: 2 },
    stem: '<p class="q-ask"><strong>ب. رتّبوا اللاعبين بحسب نتائجهم:</strong></p>' +
      '<p class="q-lead q-after-ask">يمكن وضع أكثر من لاعب واحد في كل مرتبة.</p>',   /* producer QA 08.10 */
    content: '<img class="q-photo" src="assets/img/q-targets.jpg" alt="لوحة نتائج مسابقة الرماية">',
    type: 'rank',
    hintPolicy: 'after-wrong',
    tiles: ['رنا', 'ياسمين', 'ندى', 'سامر', 'زياد'],
    /* rank 1 = דני (84%) · rank 2 = רוני, ענת, גל (all 80%) · rank 3 = יעל (76%) */
    slots: [[4], [0, 2, 3], [1]],
    maxAttempts: 2,
    hint: 'انتبهوا إلى نسبة النجاح لدى كل لاعب من اللاعبين.',
    fb: { correct: { title: 'صحيح!', body: RANK_FB },
          wrong: { title: 'أخطأت، سنتعلّم، وسنتحسّن ونتابع إلى الأمام.', body: RANK_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟',
          /* Elad 19.10: some ranks right, not all */
          partial: 'أخطأت جزئيًا', partialRetry: 'أخطأت جزئيًا، هل نحاول مرة أخرى؟' },
  },
  {
    /* slide 57 */
    screen: 42, step: { group: 'p3', index: 1, total: 2 },
    stem: LEAGUE_STEM + '<p class="q-ask"><strong>أ. ما أساس المقارنة (الكامل) في كل واحدة من المجموعات؟</strong></p>',
    type: 'single',
    options: [
      { id: 'a', html: 'عدد المباريات' },
      { id: 'b', html: 'وقت اللعب الكلي (دقائق اللعب في جميع المباريات)' },
      { id: 'c', html: 'عدد المخالفات' },
    ],
    correct: 'b',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'انتبهوا إلى الجملة في البداية: لقب "الفريق النزيه" يُمنح للفريق الذي كان عدد مخالفاته الأقل نسبةً إلى زمن لعبه.',
    fb: { correct: { title: 'صحيح!', body: LEAGUE_A_FB },
          wrong: { title: 'أخطأت، المهم أن تحاول ولا تستسلم.', body: LEAGUE_A_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 58 — fill in the certificate */
    screen: 43, step: { group: 'p3', index: 1, total: 2 },
    stem: '<p class="q-lead">هذه بيانات المباريات والمخالفات للفريقين:</p>' + LEAGUE_TABLE +
      '<p class="q-ask"><strong>ب. أكملوا التفاصيل الناقصة في شهادة التقدير:</strong></p>',
    type: 'dropdown',
    sentence: ['<span class="cert">🏆 شهادة تقدير 🏆<br>تُمنح لفريق ',
               ' على اللعب النظيف طوال الموسم.<br>نسبة المخالفات على مدار وقت المباراة: ',
               '، مقابل ', ' للفريق المنافس.</span>'],
    blanks: [
      { pool: ['الأسود', 'النمور'], correct: 'النمور' },
      { pool: ['10%', '12%', '15%'], correct: '12%' },
      { pool: ['10%', '12%', '15%'], correct: '15%' },
    ],
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'احسبوا النسبة بين عدد المخالفات وعدد الدقائق.',
    fb: { correct: { title: 'صحيح!', body: LEAGUE_B_FB },
          wrong: { title: 'أخطأت، وكل خطأ يبني معرفة أعمق.', body: LEAGUE_B_FB },
          partial: 'الإجابة صحيحة جزئيًا. كل خطأ يبني معرفة أعمق.',   /* QA 20.10.26 */
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },

  {
    /* slide 59 */
    screen: 44, step: { group: 'p3', index: 2, total: 2 }, dense: true,
    stem: '<p class="q-lead">غادة مترددة في شراء لوازم جديدة استعدادًا للعام الدراسي.<br>' +
      'بعد أن صادفت إعلانًا عن تخفيضات في متجر للإلكترونيات،<br>' +
      'جمعت البيانات في جدول لتفحص أيًّا من العروض مجدية فعلًا:</p>' +
      '<p class="q-ask"><strong>أ. ساعدوا غادة على إكمال الجدول.</strong></p>',
    content: '<img class="q-photo q-photo--tall" src="assets/img/q-electronics.png" alt="إعلان تخفيضات لمتجر إلكترونيات">',
    noZoom: false,
    type: 'value-input',
    tableHead: GAIA_TABLE_HEAD,
    tableRows: [
      ['جهاز لوحي', '1,600', '1,200', { nis: true, label: 'مبلغ الخصم على الجهاز اللوحي' }, { pct: true, label: 'نسبة الخصم على الجهاز اللوحي' }],
      ['ساعة ذكية', '500', '420', { nis: true, label: 'مبلغ الخصم على الساعة' }, { pct: true, label: 'نسبة الخصم على الساعة' }],
      ['لوحة مفاتيح وفأرة لاسلكية', '200', '100', { nis: true, label: 'مبلغ الخصم على لوحة المفاتيح' }, { pct: true, label: 'نسبة الخصم على لوحة المفاتيح' }],
    ],
    correctInputs: ['400', '25', '80', '16', '100', '50'],
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'احسبوا نسبة الخصم المئوية من السعر الأصلي.',
    fb: { correct: { title: 'أحسنت!', body: GAIA_FB },
          wrong: { title: 'أخطأت، لكنّ هذه هي الطريقة الصحيحة، ما زلنا بحاجة إلى مزيد من الدقة.', body: GAIA_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 60 */
    screen: 45, step: { group: 'p3', index: 2, total: 2 }, dense: true,
    stem: '<p class="q-lead">تتردد غادة في شراء معدات جديدة استعدادًا للعام الدراسي.<br>جمعت بيانات العروض في جدول:</p>' +
      '<table class="q-table"><thead><tr><th>المنتج</th><th>السعر الأصلي<br>(بالشيكل)</th><th>السعر بعد الخصم<br>(بالشيكل)</th><th>مبلغ الخصم<br>(بالشيكل)</th><th>نسبة الخصم</th></tr></thead>' +
      '<tbody><tr><td>جهاز لوحي</td><td>1,600</td><td>1,200</td><td>400</td><td>25%</td></tr>' +
      '<tr><td>ساعة ذكية</td><td>500</td><td>420</td><td>80</td><td>16%</td></tr>' +
      '<tr><td>لوحة مفاتيح وفأرة لاسلكيتان</td><td>200</td><td>100</td><td>100</td><td>50%</td></tr></tbody></table>' +
      '<p class="q-ask"><strong>ب. اقرؤوا ادّعاء البائعة وحدّدوا إن كان صحيحًا أم غير صحيح:</strong></p>' +
      '<p class="q-claim">"إذا اشتُريت المنتجات الثلاثة كلّها، فإنّ نسبة الخصم الإجمالية تساوي مجموع نسب الخصم على كلّ منتج بشكل منفرد."</p>',
    content: '<img class="q-photo q-photo--tall" src="assets/img/q-electronics.png" alt="إعلان تخفيضات لمتجر إلكترونيات">',
    type: 'single',
    options: [{ id: 'a', html: 'صحيح' }, { id: 'b', html: 'غير صحيح' }],
    correct: 'b',
    maxAttempts: 1,   /* two options only — no second try (producer QA 08.10) */
    hint: 'احسبوا نسبة الخصم على المشتريات كلها، وقارنوها بمجموع نسب الخصم التي أُعطيت على كل منتج.',
    fb: { correct: { title: 'أحسنت!', body: GAIA_B_FB },
          wrong: { title: 'هذا خطأ. لا بأس، إنها فرصة لتعلّم شيء جديد:', body: GAIA_B_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 72 — peak task, part א */
    screen: 56, dense: true,   /* no stepper on the peak task (Elad 19.10) */
    stem: '<p class="q-lead"><strong>فوج «الرمّان»</strong> يحضّر في قدر صغير <strong>20 كوبًا من حليب الشوكولاتة</strong>، وفيها <strong>9 أكواب من الشوكولاتة الذائبة النقية</strong>.<br>' +
      '<strong>فوج «البرتقال»</strong> يحضّر في قدر كبير <strong>50 كوبًا من حليب الشوكولاتة</strong>، وفيها <strong>22 كوبًا من الشوكولاتة الذائبة النقية</strong>.<br>' +
      'قالت ريم من فوج «البرتقال»:</p>' +
      '<p class="q-quote">"حليب الشوكولاتة عندنا طعمه أقوى بالشوكولاتة!<br>نحن وضعنا في القدر 22 كوبًا من الشوكولاتة، وفي فوج «الرمّان» وضعوا 9 أكواب فقط."</p>' +
      '<p class="q-ask"><strong>أ. هل كانت ريم محقّة؟</strong></p>',
    content: '<img class="q-photo" src="assets/img/q-choco-book.jpg" alt="وصفات حليب الشوكولاتة عند فوج «الرمّان» وفوج «البرتقال»">',
    type: 'single',
    options: [
      { id: 'a', html: 'نعم، كانت ريم محقّة، لأنهم وضعوا أكوابًا أكثر من الشوكولاتة في قدر فوج «البرتقال».' },
      { id: 'b', html: 'نعم، كانت ريم محقّة لأن قدر فوج «البرتقال» كان أكبر.' },
      { id: 'c', html: 'لا، أخطأت ريم، لأنه لكي نحدّد لمن طعمه أقوى، علينا أن نفحص الجزء النسبي (النسبة المئوية) من الشوكولاتة في القدر.' },
      { id: 'd', html: 'لا، أخطأت ريم لأن النكهة في القدور الصغيرة تكون دائمًا أقوى.' },
    ],
    correct: 'c',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'لإجراء مقارنة عادلة بين تركيز طعم الشوكولاتة، علينا أن نحسب النسبة المئوية لأكواب الشوكولاتة من الكمية الكلية لحليب الشوكولاتة.',
    fb: { correct: { title: 'أحسنت!', body: IRIS_FB },
          wrong: { title: 'أخطأت، لا تقلق، فالتعلّم الجيد يتضمّن أخطاء.', body: IRIS_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 74 — peak task, part ב */
    screen: 58,  /* no stepper on the peak task (Elad 19.10) */
    stem: '<p class="q-lead">ها هي بيانات حليب الشوكولاتة في الفوجين بعد الإضافة:</p>' + CHOCO_TABLE +
      '<p class="q-ask"><strong>ب. هل ازداد طعم الشوكولاتة قوة في القدرين بالدرجة نفسها؟</strong></p>',
    content: CHOCO_PHOTO,
    noZoom: true,
    type: 'single',
    options: [{ id: 'a', html: 'نعم' }, { id: 'b', html: 'لا' },
              { id: 'c', html: 'لا يمكن معرفة ذلك' }],
    correct: 'b',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'ما النسبة المئوية لتركيز الشوكولاتة في كل فوج؟',
    fb: { correct: { title: 'صحيح!', body: CHOCO_B_FB },
          wrong: { title: 'أخطأت، وهذا جزء من رحلة فهم الرياضيات.', body: CHOCO_B_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 76 — peak task, part ג */
    screen: 60,  /* no stepper on the peak task (Elad 19.10) */
    stem: '<p class="q-lead">في اليوم الأخير من المخيم، قرروا توحيد الفوجين في حفلة كبيرة.<br>' +
      'أراد المرشدون تحضير قدر ضخم من حليب الشوكولاتة يتسع لما مجموعه 120 كوبًا.<br>' +
      'يريدون أن يكون حليب الشوكولاتة في الحفلة بالجودة والطعم نفسيهما تمامًا مثل حليب الشوكولاتة الخاص بفوج «الرمّان».</p>' +
      '<p class="q-ask"><strong>ج. كم كوبًا من الشوكولاتة الذائبة النقية عليهم أن يضعوا في القدر الجديد (سعته 120 كوبًا) للحفاظ على تركيز شوكولاتة بنسبة 45%؟</strong></p>',
    type: 'value-input',
    single: { label: 'عدد أكواب الشوكولاتة', unit: 'أكواب' },
    correctInputs: ['54'],
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'استعينوا بجدول التناسب.',
    fb: { correct: { title: 'صحيح!', body: PARTY_FB },
          wrong: { title: 'أخطأت، وكل خطأ هو خطوة إلى الأمام في الطريق.', body: PARTY_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 80 — peak task 2, part א */
    screen: 63,   /* stepper removed, QA 20.10.26 */
    stem: '<p class="q-lead">المساحة الكلية لحي آدم هي <strong>1,500 دونم</strong>، منها <strong>180 دونمًا</strong> مخصصة للحديقة.<br>' +
      'المساحة الكلية لحي سلمى هي <strong>400 دونم</strong>، منها <strong>60 دونمًا</strong> مخصصة للحديقة.<br>' +
      'جنى، التي تسكن في حي آدم، قالت:</p>' +
      '<p class="q-quote">"في العرض الذي سيقام عندنا يمكن أن يحضر عدد أكبر من المشاهدين، لأن مساحة الحديقة في حيّنا <strong>أكبر بـ 3 أضعاف</strong> من مساحتها في حيّ سلمى."</p>' +
      '<p class="q-ask"><strong>أ. هل هي محقّة؟</strong></p>',
    content: '<img class="q-photo" src="assets/img/q-neighbourhoods.jpg" alt="حي آدم مساحته 1,500 دونم، وحي سلمى مساحته 400 دونم">',
    type: 'single',
    options: [{ id: 'a', html: 'نعم' }, { id: 'b', html: 'لا' }, { id: 'c', html: 'لا يمكن معرفة ذلك' }],
    correct: 'a',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'تحققوا من المساحات التي يجب المقارنة بينها.',
    fb: { correct: { title: 'صحيح!', body: JENIA_FB },
          wrong: { title: 'أخطأت، لكن المحاولة تنمّي التفكير.', body: JENIA_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 82 — peak task 2, part ב */
    screen: 65, dense: true,
    stem: '<p class="q-lead">إليكم بيانات مساحات الحدائق العامة في كل حيّ من الأحياء:</p>' + HOOD_TABLE +
      '<p class="q-ask"><strong>ب. في أي حي يكون جزء مساحة الحديقة من المساحة الكلية للحي أكبر؟</strong></p>',   /* Elad 20.10 */
    /* Elad 19.10: the two speech bubbles are gone — the photo alone */
    content: '<img class="q-photo" src="assets/img/q-officials.jpg" alt="يناقش ممثلو البلدية المعطيات">',
    noZoom: true,
    type: 'single',
    options: [{ id: 'a', html: 'في حي آدم' }, { id: 'b', html: 'في حي سلمى' },
              { id: 'c', html: 'في كلا الحيين بالقدر نفسه' }],
    correct: 'b',
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'انتبهوا إلى نسبة مساحة الحديقة في كل حي.',
    fb: { correct: { title: 'صحيح!', body: HOOD_B_FB },
          wrong: { title: 'أخطأت، لا تقلق، الفهم يُبنى تدريجيًا.', body: HOOD_B_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
  {
    /* slide 83 — peak task 2, part ג */
    screen: 66,
    stem: '<p class="q-lead">تخطط البلدية لتحويل العرض إلى تقليد سنوي، وفي الوقت نفسه أعلنت عن توسيع حي سلمى.<br>' +
      'تبلغ مساحة حي سلمى اليوم <strong>400 دونم</strong>، منها <strong>60 دونمًا</strong> هي حديقة (15%).<br>' +
      'تخطط البلدية لإضافة منطقة سكنية جديدة إلى الحي بمساحة <strong>200 دونم</strong>.</p>' +
      /* Elad 19.10: the question now counts only the NEW park land — answer 30, not 90 */
      '<p class="q-ask"><strong>ج. إذا ضممنا المساحة الجديدة إلى الـ 60 دونمًا الموجودة أصلًا للحديقة:<br>كم دونمًا من الحديقة يجب تخصيصها من المنطقة الجديدة، حتى تكون 15% من مساحة الحي مخصصة للحديقة حتى بعد التوسعة؟</strong></p>',
    type: 'value-input',
    tableHead: ['دونمات من الحديقة'],
    tableRows: [[{ input: true, label: 'عدد الدونمات', suffix: ' دونمات' }]],
    correctInputs: ['30'],
    maxAttempts: 2,
    hintPolicy: 'after-wrong',   /* producer QA 08.10 */
    hint: 'استعينوا بجدول التناسب.',
    fb: { correct: { title: 'صحيح!', body: HOOD_C_FB },
          wrong: { title: 'أخطأتَ، وهذه خطوة مهمة في الطريق إلى الحل الدقيق.', body: HOOD_C_FB },
          retry: 'هذا غير دقيق، هل نحاول مجدداً؟' },
  },
];
