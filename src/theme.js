/* ============================================================
   نظام الألوان والخطوط — مصدر واحد لكل ألوان التطبيق

   قبل هذا الملف كان في التطبيق نظاما ألوان متعارضان: مجموعة قديمة
   تستعملها الألعاب والاختبارات، ومجموعة جديدة تستعملها الواجهة
   والقصص. حُذفت القديمة، وصار كل لون في التطبيق يأتي من هنا.
   ============================================================ */

/* ── الأساس ────────────────────────────────────────────── */
export const c = {
  /* الأسطح */
  ground:    "#EDE7DA",  // خلفية الشاشة
  sky:       "#DCE6E8",  // بحر الخريطة
  paper:     "#FBFAF6",  // سطح البطاقات
  surface:   "#FFFFFF",  // سطح مرتفع
  sage:      "#DCE6D9",  // سطح هادئ
  sageDeep:  "#7C9473",  // اللون الأساسي
  sageInk:   "#5B7052",  // الأساسي غامقًا
  dusty:     "#B7C4CE",  // ثانوي بارد
  dustyInk:  "#4C5A62",

  /* الحبر */
  ink:       "#22301F",
  inkSoft:   "#57654F",
  inkFaint:  "#8A9583",
  onDark:    "#FFFFFF",

  /* الخطوط الفاصلة */
  line:      "#D8DED3",
  lineSoft:  "#E7EAE2",

  /* لهجة دافئة واحدة */
  accent:    "#C9633B",
  accentInk: "#A34E2C",
  accentSoft:"#F7E3D9",

  /* ألوان دلالية */
  good:      "#1E6B45",
  goodSoft:  "#DCEFE1",
  warn:      "#B5862F",
  warnSoft:  "#F6EBD3",
  bad:       "#B33D24",
  badSoft:   "#FBDCD3",

  /* الأوسمة */
  medal:     "#B5862F",
  medalSoft: "#F6EBD3",
};

/* ── ألوان البيئات ─────────────────────────────────────────
   لون واحد لكل بيئة عُمانية، كلها بدرجات إشباع متقاربة حتى
   تبدو من عائلة واحدة مهما تنقّل الطفل بينها. */
export const env = {
  falaj:        "#3E8C7C",  // الجبل الأخضر
  turtle:       "#2E6E8E",  // رأس الحدّ
  oilspill:     "#3B5670",  // بحر مسقط
  mangrove:     "#5E8352",  // غابة القرم
  ibex:         "#A2703F",  // جبال الحقف
  falcon:       "#4487AE",  // الديمانيّات
  airquality:   "#6B8598",  // صحار
  frankincense: "#4E8B6E",  // ظفار
  bay:          "#2E93A3",  // خليج مسقط
};

/* ── الظلال ────────────────────────────────────────────── */
export const shadow = {
  sm: "0 2px 6px rgba(34,48,31,0.07)",
  md: "0 6px 16px rgba(34,48,31,0.10)",
  lg: "0 14px 32px rgba(34,48,31,0.16)",
  up: "0 -6px 18px rgba(34,48,31,0.08)",
};

/* ── الخطوط ────────────────────────────────────────────── */
export const font = {
  display: "'Markazi Text', 'Segoe UI', serif",
  body: "'Tajawal', 'Segoe UI', Tahoma, sans-serif",
};

/* ── الحركة ────────────────────────────────────────────── */
export const ease = "cubic-bezier(.22,.61,.36,1)";

/* ── خلفيات المشاهد داخل القصص ─────────────────────────── */
export const bgStyles = {
  night:         "linear-gradient(180deg,#1B2647 0%,#101A3A 55%,#243052 100%)",
  warningNight:  "linear-gradient(180deg,#1B2647 0%,#3C2A1B 100%)",
  dawn:          "linear-gradient(180deg,#2E5076 0%,#728BA8 55%,#DFC08A 100%)",
  warningDawn:   "linear-gradient(180deg,#4A3526 0%,#7A5034 100%)",
  water:         "linear-gradient(180deg,#4FA3BE 0%,#1A5A78 70%,#0D3B52 100%)",
  warningWater:  "linear-gradient(180deg,#402D23 0%,#6B4C36 100%)",
  day:           "linear-gradient(180deg,#9AD0DC 0%,#E6D8AC 60%,#D6B584 100%)",
  warningDay:    "linear-gradient(180deg,#C59C63 0%,#8A6640 100%)",
  forest:        "linear-gradient(180deg,#7BAC92 0%,#4A7A5F 60%,#35624B 100%)",
  warningForest: "linear-gradient(180deg,#877A58 0%,#5B4C33 100%)",
  ending:        "linear-gradient(180deg,#9BD8E4 0%,#4FA3BE 45%,#1A5A78 100%)",
};

export const isWarningBg = (bg) => bg.startsWith("warning");
export const isNightBg = (bg) => bg === "night" || bg === "warningNight";

/* ── المقاسات ──────────────────────────────────────────────
   ثلاث نقاط فقط. المكوّنات واحدة، وما يتغيّر هو ترتيبها. */
export const bp = {
  phone: 0,      // عمود واحد يملأ الشاشة
  tablet: 700,   // العمود نفسه أوسع وأكبر خطًّا
  wide: 1040,    // لوحان: الخريطة في جانب والمشهد في الآخر
};
