/* ============================================================
   الرسم — خريطة عُمان، الجدّ سالم، الأوسمة، أيقونات القصص
   ============================================================ */
import React from "react";
import { c, env as envColor, shadow, font, ease } from "./theme.js";

/* ── أيقونات البيئات ───────────────────────────────────── */
const SHAPES = {
  drop: <path d="M12 3C12 3 5 12 5 16.5A7 7 0 0019 16.5C19 12 12 3 12 3Z" />,
  turtle: (
    <g>
      <path d="M4 13c0-3 3.5-5 8-5s8 2 8 5-3.5 5-8 5-8-2-8-5Z" />
      <circle cx="18.6" cy="9.6" r="1.6" />
      <path d="M6 17l-2 3M18 17l2 3M6 9l-2.5-1M18 9l2.5-1" />
    </g>
  ),
  boat: (
    <g>
      <path d="M3 15h18l-2.5 4h-13L3 15Z" />
      <path d="M12 15V5" />
      <path d="M12 5.5l5 5H12" />
      <path d="M2 19.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
    </g>
  ),
  shell: <path d="M12 20c-4 0-7-3-7-7a7 7 0 0114 0c0 2.2-1.6 3.8-3.8 3.8A3.8 3.8 0 0111.5 13a2.2 2.2 0 012.2-2.2" />,
  goat: (
    <g>
      <path d="M4 18l7-13 7 13H4Z" />
      <circle cx="17.3" cy="7" r="1.9" />
      <path d="M16.2 5.4c.4-1.4 1.8-1.9 2.8-1.3M18.4 5.4c-.4-1.4-1.8-1.9-2.8-1.3" />
    </g>
  ),
  falcon: <path d="M2 13c4-5 8-6 10-6s6 1 10 6c-4-2-7-2-10-1-3-1-6-1-10 1Z" />,
  wind: (
    <g>
      <path d="M3 8h11a2.4 2.4 0 100-4.8" />
      <path d="M3 13h15a2.4 2.4 0 110 4.8" />
      <path d="M3 18h8" />
    </g>
  ),
  tree: (
    <g>
      <circle cx="10" cy="8" r="5.3" />
      <path d="M10 13.3V21" />
      <path d="M17 10.2c1.2 0 2.1 1 2.1 2.1s-1 2.1-2.1 2.1" />
    </g>
  ),
  baysun: (
    <g>
      <path d="M2 20c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
      <path d="M12 13V8" />
      <path d="M9 8a3 3 0 016 0" />
    </g>
  ),
  check: <path d="M5 13l4.5 4.5L19 8" />,
  medal: (
    <g>
      <circle cx="12" cy="10" r="6" />
      <path d="M9 15.5 7.5 22l4.5-2.6L16.5 22 15 15.5" />
    </g>
  ),
  map: (
    <g>
      <path d="M9 4 3 6.5v14L9 18l6 2.5 6-2.5v-14L15 6.5 9 4Z" />
      <path d="M9 4v14M15 6.5v14" />
    </g>
  ),
  recycleBin: (
    <g>
      <path d="M5 8h14l-1.2 11.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5L5 8Z" />
      <path d="M9 8V5h6v3" />
      <path d="M10 12l2-2 2 2M10 16l2 2 2-2" />
    </g>
  ),
  house: (
    <g>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-6h4v6" />
    </g>
  ),
  cart: (
    <g>
      <path d="M3 4h2.2l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.1a1.6 1.6 0 0 0 1.6-1.2L21 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </g>
  ),
  book: (
    <g>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 014 18.5v-13Z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5a1.5 1.5 0 001.5-1.5v-13Z" />
    </g>
  ),
  stove: (
    <g>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="2" />
      <circle cx="15.5" cy="9.5" r="2" />
      <path d="M6 16h12" />
    </g>
  ),
  shower: (
    <g>
      <path d="M6 9a6 6 0 0 1 12 0" />
      <path d="M4 9h16" />
      <path d="M8 13v1M12 13v1M16 13v1M8 17v1M12 17v1M16 17v1" />
    </g>
  ),
  shirt: (
    <path d="M8 4 4 7l2 3 2-1.3V20h8V8.7L18 10l2-3-4-3-2 2h-4L8 4Z" />
  ),
  toy: (
    <g>
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="16" r="3" />
      <path d="M8 13V9a4 4 0 0 1 8 0v4" />
      <path d="M10 7.5 8.5 5M14 7.5 15.5 5" />
    </g>
  ),
  ac: (
    <g>
      <rect x="3" y="6" width="18" height="7" rx="2" />
      <path d="M6 17v3M12 17v4M18 17v3" />
      <circle cx="18" cy="9.5" r=".6" fill="currentColor" stroke="none" />
    </g>
  ),
  heater: (
    <g>
      <rect x="7" y="3" width="10" height="18" rx="4" />
      <path d="M9.5 8h5M9.5 12h5" />
    </g>
  ),
  lamp: (
    <g>
      <path d="M9 21h6M12 21v-4" />
      <path d="M6 3h12l-2.5 8h-7Z" />
    </g>
  ),
  tv: (
    <g>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </g>
  ),
  fridge: (
    <g>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M6 10h12" />
      <path d="M9 5.5v2M9 13v2.5" />
    </g>
  ),
  window: (
    <g>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M12 4v16M4 12h16" />
    </g>
  ),
  fan: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12 12 5.5a3 3 0 1 1 3 3ZM12 12l6.1 2.2a3 3 0 1 1-2.1 3.8ZM12 12l-4 5.2a3 3 0 1 1-2.4-3.6Z" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </g>
  ),
  projector: (
    <g>
      <rect x="3" y="7" width="12" height="8" rx="2" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M15 10.5 21 8v8l-6-2.5Z" />
    </g>
  ),
};

export function Glyph({ name, size = 26, color = c.ink, strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" }}
    >
      {SHAPES[name] || SHAPES.drop}
    </svg>
  );
}

export function IconChip({ children, bg = c.sage, size = 56, radius }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: radius ?? size * 0.32, background: bg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   خلفياتُ بيئاتِ القِصَصِ — مَشْهَدٌ صَغِيرٌ يُلَمِّحُ إِلَى المَكَانِ
   بَدَلَ لَوْنٍ مُصْمَتٍ خَلْفَ الأَيْقُونَةِ
   ============================================================ */
const BIOME_OF = {
  falaj: "mountain", ibex: "mountain", frankincense: "mountain",
  turtle: "nightSea", oilspill: "sea", bay: "sea",
  mangrove: "mangrove", falcon: "island", airquality: "hazySky",
};

function BiomeBackdrop({ biome }) {
  switch (biome) {
    case "mountain":
      return (
        <g>
          <rect width="64" height="64" fill="#CDE7E0" />
          <path d="M0 44 14 26 24 38 36 20 50 40 64 30V64H0Z" fill="#8FBF9C" />
          <path d="M22 44 30 32 40 46Z" fill="#6FA37E" opacity=".85" />
        </g>
      );
    case "nightSea":
      return (
        <g>
          <rect width="64" height="64" fill="#16234A" />
          <circle cx="49" cy="15" r="7" fill="#F3E6B8" opacity=".9" />
          <path d="M0 46c8-5 12 5 20 0s12 5 20 0 12 5 24 0V64H0Z" fill="#0E3352" />
        </g>
      );
    case "sea":
      return (
        <g>
          <rect width="64" height="64" fill="#BEE3EC" />
          <path d="M0 40c8-6 12 6 20 0s12 6 20 0 12 6 24 0V64H0Z" fill="#3E86A8" />
          <path d="M0 50c8-4 12 4 20 0s12 4 20 0 12 4 24 0V64H0Z" fill="#2C6484" />
        </g>
      );
    case "mangrove":
      return (
        <g>
          <rect width="64" height="64" fill="#D7E7C8" />
          <path d="M0 46h64V64H0Z" fill="#4E6E9C" opacity=".55" />
          <path d="M14 46V30M14 46 8 36M14 40 20 32" stroke="#5E7A45" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M36 46V26M36 46 30 34M36 38 44 28" stroke="#4A6338" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="14" cy="24" r="9" fill="#6E9460" /><circle cx="36" cy="18" r="10" fill="#5E8352" />
        </g>
      );
    case "island":
      return (
        <g>
          <rect width="64" height="64" fill="#A9D6E8" />
          <path d="M0 44c10-4 14 4 22 0s14 4 22 0 12 4 20 0V64H0Z" fill="#2E7DAF" />
          <ellipse cx="32" cy="44" rx="14" ry="7" fill="#D8CBA3" />
        </g>
      );
    case "hazySky":
      return (
        <g>
          <rect width="64" height="64" fill="#D9D6C6" />
          <rect x="8" y="34" width="8" height="20" fill="#8B96A0" />
          <rect x="20" y="24" width="8" height="30" fill="#7C8790" />
          <rect x="34" y="30" width="8" height="24" fill="#8B96A0" />
          <path d="M0 54h64V64H0Z" fill="#6E7A82" />
          <circle cx="24" cy="16" r="3" fill="#C7C2B0" opacity=".8" /><circle cx="34" cy="12" r="4" fill="#C7C2B0" opacity=".7" />
        </g>
      );
    default:
      return <rect width="64" height="64" fill="#E4EEDC" />;
  }
}

export function StoryBadge({ storyId, icon, color, size = 56 }) {
  const biome = BIOME_OF[storyId] || "mountain";
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.32, overflow: "hidden", flexShrink: 0, position: "relative" }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ display: "block" }}>
        <BiomeBackdrop biome={biome} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(20,28,18,.16)",
      }}>
        <Glyph name={icon} size={size * 0.46} color="#FFF" strokeWidth={2.1} />
      </div>
    </div>
  );
}

/* ============================================================
   الجدّ سالم — الشخصية التي توجّه التطبيق
   الحالات: ask | think | agree | warn | smile
   ============================================================ */
const SKIN = "#EFD0AB";
const SKIN_SHADE = "#E0BC92";
const HAIR = "#F4F2EC";

function mouthFor(mood) {
  switch (mood) {
    case "smile": return <path d="M50 76 Q60 86 70 76" fill="none" stroke="#8A5A42" strokeWidth="3" strokeLinecap="round" />;
    case "agree": return <path d="M52 76 Q60 83 68 76" fill="none" stroke="#8A5A42" strokeWidth="3" strokeLinecap="round" />;
    case "ask":   return <ellipse cx="60" cy="78" rx="4.5" ry="5" fill="#8A5A42" />;
    case "warn":  return <path d="M51 79 Q60 73 69 79" fill="none" stroke="#8A5A42" strokeWidth="3" strokeLinecap="round" />;
    default:      return <path d="M52 78 H68" fill="none" stroke="#8A5A42" strokeWidth="3" strokeLinecap="round" />;
  }
}

function browsFor(mood) {
  const s = { fill: "none", stroke: "#CFCBC0", strokeWidth: 3.4, strokeLinecap: "round" };
  switch (mood) {
    case "ask":   return <g {...s}><path d="M43 47 Q49 41 55 45" /><path d="M65 45 Q71 42 77 47" /></g>;
    case "warn":  return <g {...s}><path d="M43 43 Q49 48 55 49" /><path d="M65 49 Q71 48 77 43" /></g>;
    case "think": return <g {...s}><path d="M43 46 Q49 43 55 46" /><path d="M65 44 Q71 40 77 44" /></g>;
    default:      return <g {...s}><path d="M43 45 Q49 41 55 45" /><path d="M65 45 Q71 41 77 45" /></g>;
  }
}

function eyesFor(mood) {
  if (mood === "smile") {
    return (
      <g fill="none" stroke="#3B3126" strokeWidth="3" strokeLinecap="round">
        <path d="M45 58 Q49 54 53 58" />
        <path d="M67 58 Q71 54 75 58" />
      </g>
    );
  }
  return (
    <g fill="#3B3126">
      <circle cx="49" cy="58" r="3.2" />
      <circle cx="71" cy="58" r="3.2" />
    </g>
  );
}

export function Salim({ mood = "smile", size = 96 }) {
  return (
    <svg width={size} height={size * 1.17} viewBox="0 0 120 140" aria-hidden="true">
      {/* الدشداشة */}
      <path d="M16 140 C18 114 36 101 60 101 C84 101 102 114 104 140 Z" fill="#FBFAF6" stroke={c.line} strokeWidth="2" />
      <path d="M52 104 L60 121 L68 104" fill="none" stroke={c.sageDeep} strokeWidth="3.2" strokeLinecap="round" />
      {/* الرقبة */}
      <path d="M52 88 h16 v12 a8 8 0 0 1 -16 0 Z" fill={SKIN_SHADE} />
      {/* اللحية */}
      <path d="M33 60 C33 96 45 110 60 110 C75 110 87 96 87 60 C80 72 40 72 33 60 Z" fill={HAIR} />
      {/* الوجه */}
      <ellipse cx="60" cy="60" rx="27" ry="29" fill={SKIN} />
      {/* الأذنان */}
      <ellipse cx="32" cy="62" rx="4.5" ry="6" fill={SKIN_SHADE} />
      <ellipse cx="88" cy="62" rx="4.5" ry="6" fill={SKIN_SHADE} />
      {/* المصر العُماني */}
      <path d="M29 44 C29 20 44 9 60 9 C76 9 91 20 91 44 C76 34 44 34 29 44 Z" fill={c.sageDeep} />
      <path d="M27 46 C43 34 77 34 93 46 C93 55 82 58 60 58 C38 58 27 55 27 46 Z" fill={c.sageInk} />
      <path d="M30 44 C46 36 74 36 90 44" fill="none" stroke={c.accent} strokeWidth="2.6" strokeLinecap="round" opacity=".85" />
      <path d="M91 44 C98 47 100 54 96 60" fill="none" stroke={c.sageInk} strokeWidth="5" strokeLinecap="round" />
      {browsFor(mood)}
      {eyesFor(mood)}
      {/* الشارب */}
      <path d="M50 70 Q60 66 70 70" fill="none" stroke="#DAD6CB" strokeWidth="4" strokeLinecap="round" />
      {mouthFor(mood)}
    </svg>
  );
}

/* فقاعة كلام الجدّ سالم */
export function SalimSays({ mood = "smile", text, size = 62, tone = "sage" }) {
  const bg = tone === "sand" ? "rgba(255,255,255,.94)" : c.sage;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, width: "100%" }}>
      <div style={{ flex: "none", filter: "drop-shadow(0 3px 6px rgba(34,48,31,.14))" }}>
        <Salim mood={mood} size={size} />
      </div>
      <div
        style={{
          flex: 1, background: bg, borderRadius: "16px 16px 16px 4px",
          padding: "11px 14px", boxShadow: shadow.sm, minWidth: 0,
        }}
      >
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.95, color: c.ink, fontFamily: font.body }}>{text}</p>
      </div>
    </div>
  );
}

/* ============================================================
   خريطة عُمان — الشاشة الرئيسية
   الإحداثيات في content.js داخل mapPos لكل قصة
   ============================================================ */
const OMAN_MAIN =
  "M150 58 L168 78 L182 108 L200 120 L208 124 L215 138 L228 160 L232 166 L226 184 " +
  "L214 208 L204 228 L196 248 L186 270 L175 292 L163 312 L150 332 L138 352 L125 372 " +
  "L110 390 L96 405 L82 416 L70 424 L55 432 L50 416 L48 400 L43 370 L40 340 L43 310 " +
  "L48 280 L53 248 L60 215 L68 190 L78 168 L86 146 L95 125 L104 95 L118 72 Z";
const MUSANDAM = "M152 18 L178 26 L183 42 L168 50 L152 40 L146 28 Z";

export function OmanMap({ stories, completed = [], onPick, activeId }) {
  return (
    <svg
      viewBox="0 0 300 500"
      role="img"
      aria-label="خريطة سلطنة عُمان، وعليها مواقع المغامرات"
      style={{ width: "auto", height: "min(56vh, 520px)", maxWidth: "100%", display: "block", margin: "0 auto" }}
    >
      <defs>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCE9EC" />
          <stop offset="100%" stopColor="#C6DCE1" />
        </linearGradient>
        <linearGradient id="landGrad" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#F2EAD8" />
          <stop offset="55%" stopColor="#EADFC6" />
          <stop offset="100%" stopColor="#E3D5B8" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="300" height="500" fill="url(#seaGrad)" />

      {/* موج خفيف في البحر */}
      <g fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity=".55">
        <path d="M238 210 q7 -5 14 0 t14 0" />
        <path d="M246 244 q7 -5 14 0 t14 0" />
        <path d="M206 330 q7 -5 14 0 t14 0" />
        <path d="M172 424 q7 -5 14 0 t14 0" />
        <path d="M30 150 q7 -5 14 0 t14 0" />
      </g>

      {/* اليابسة */}
      <path d={OMAN_MAIN} fill="url(#landGrad)" stroke="#C6B995" strokeWidth="2.4" strokeLinejoin="round" />
      <path d={MUSANDAM} fill="url(#landGrad)" stroke="#C6B995" strokeWidth="2.4" strokeLinejoin="round" />

      {/* جزر الديمانيّات */}
      <g fill="url(#landGrad)" stroke="#C6B995" strokeWidth="1.6">
        <ellipse cx="176" cy="84" rx="7" ry="4" />
        <ellipse cx="190" cy="94" rx="5" ry="3" />
        <ellipse cx="185" cy="75" rx="4.5" ry="2.8" />
      </g>

      {/* تضاريس: جبال الحجر وجبال ظفار */}
      <g fill="none" stroke="#C9B98F" strokeWidth="2.4" strokeLinecap="round" opacity=".8">
        <path d="M118 140 l10 -11 10 11M140 130 l10 -11 10 11M162 148 l9 -10 9 10" />
        <path d="M80 396 l10 -11 10 11M102 386 l9 -10 9 10" />
      </g>
      {/* كثبان الوسطى */}
      <g fill="none" stroke="#D5C7A2" strokeWidth="2" strokeLinecap="round" opacity=".75">
        <path d="M76 252 q12 -7 24 0M70 292 q12 -7 24 0M92 326 q12 -7 24 0" />
      </g>

      {/* المؤشّرات */}
      {stories.map((s) => {
        const col = envColor[s.id] || c.sageDeep;
        const done = completed.includes(s.id);
        const active = activeId === s.id;
        return (
          <g
            key={s.id}
            transform={`translate(${s.mapPos.x} ${s.mapPos.y})`}
            style={{ cursor: "pointer" }}
            onClick={() => onPick(s.id)}
            role="button"
            tabIndex={0}
            aria-label={`${s.title} — ${s.env}${done ? "، مكتملة" : ""}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(s.id); } }}
          >
            {/* مساحة لمس أوسع من الدائرة المرئية */}
            <circle r="17" fill="transparent" />
            {active && <circle r="16" fill={col} opacity=".22" />}
            <circle r="12" fill={done ? col : c.paper} stroke={col} strokeWidth="2.4" />
            <g transform="translate(-6.5 -6.5)">
              <svg width="13" height="13" viewBox="0 0 24 24" style={{ overflow: "visible" }}>
                <g
                  fill="none"
                  stroke={done ? c.onDark : col}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {SHAPES[s.icon] || SHAPES.drop}
                </g>
              </svg>
            </g>
            {done && (
              <g transform="translate(8.5 -12)">
                <circle r="5.5" fill={c.medal} stroke={c.paper} strokeWidth="1.8" />
                <path d="M-2.6 0.2 L-0.6 2.2 L2.8 -1.6" fill="none" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   الأوسمة — شكل واحد يجمعها ورمز يخصّ كل بيئة
   ============================================================ */
export function Medal({ storyId, icon, earned = false, size = 66 }) {
  const col = envColor[storyId] || c.sageDeep;
  const ring = earned ? col : c.line;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 60 72" aria-hidden="true">
      {/* الشريط */}
      <path d="M20 4 L30 22 L40 4" fill="none" stroke={earned ? c.accent : c.line} strokeWidth="5" strokeLinecap="round" />
      {/* القرص */}
      <circle cx="30" cy="42" r="21" fill={earned ? c.medalSoft : "transparent"} stroke={ring} strokeWidth="3"
        strokeDasharray={earned ? "0" : "5 5"} />
      <circle cx="30" cy="42" r="15" fill={earned ? col : "transparent"} opacity={earned ? 1 : 0} />
      <g transform="translate(21 33)">
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ overflow: "visible" }}>
          <g fill="none" stroke={earned ? c.onDark : c.inkFaint} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {SHAPES[icon] || SHAPES.drop}
          </g>
        </svg>
      </g>
    </svg>
  );
}

/* ============================================================
   الأنماط المشتركة للحركة
   ============================================================ */
export const keyframes = `
  @keyframes bob { 0%,100% { transform: translateY(0) rotate(-2deg);} 50% { transform: translateY(-9px) rotate(2deg);} }
  @keyframes twinkle { 0%,100% { opacity:.3;} 50% { opacity:1;} }
  @keyframes rise { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform:none;} }
  @keyframes fade { from { opacity:0;} to { opacity:1;} }
  @keyframes slideFwd { from { opacity:0; transform: translateX(26px);} to { opacity:1; transform:none;} }
  @keyframes slideBack { from { opacity:0; transform: translateX(-26px);} to { opacity:1; transform:none;} }
  @keyframes pop { 0% { transform: scale(0);} 65% { transform: scale(1.18);} 100% { transform: scale(1);} }
  @keyframes dripFall { 0% { transform: translateY(0); opacity:0; } 15% { opacity:1; } 100% { transform: translateY(46px); opacity:0; } }
  @keyframes ripple { 0% { transform: scale(.6); opacity:.55; } 100% { transform: scale(1.5); opacity:0; } }
  @keyframes drive { from { transform: translateX(0);} to { transform: translateX(-62px);} }
  @keyframes grow { from { transform: scaleY(.15); } to { transform: scaleY(1); } }
  @keyframes heatWave { 0%,100% { transform: translateY(0) scaleY(1); opacity:.5; } 50% { transform: translateY(-7px) scaleY(1.2); opacity:.85; } }
  @keyframes blow { 0% { transform: translateY(0) scaleX(.6); opacity:0; } 35% { opacity:.95; } 100% { transform: translateY(16px) scaleX(1.5); opacity:0; } }
  @keyframes tvPlay { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
  @keyframes spinFan { to { transform: rotate(360deg); } }

  .bob { animation: bob 3.2s ease-in-out infinite; display:inline-block; }
  .star { animation: twinkle 2.4s ease-in-out infinite; }
  .fwd { animation: slideFwd .38s ${ease} both; }
  .back { animation: slideBack .38s ${ease} both; }
  .rise { animation: rise .5s ${ease} both; }
  .pop { animation: pop .42s ${ease} both; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;
