/* ============================================================
   الرسم — خريطة عُمان، الجدّ سالم، أيقونات القصص، ومناظر مشاهدها الكرتونيّة
   ============================================================ */
import React, { useState } from "react";
import { c, env as envColor, shadow, font, ease } from "./theme.js";

/* ── أيقونات البيئات ───────────────────────────────────── */
const SHAPES = {
  drop: <path d="M12 3C12 3 5 12 5 16.5A7 7 0 0019 16.5C19 12 12 3 12 3Z" fill="currentColor" stroke="none" />,
  turtle: (
    <g fill="currentColor" stroke="none">
      <ellipse cx="12" cy="13" rx="7.4" ry="5.6" />
      <circle cx="17.6" cy="9.6" r="1.7" />
      <ellipse cx="4.4" cy="9.2" rx="2" ry="1.3" transform="rotate(-25 4.4 9.2)" />
      <ellipse cx="4.4" cy="16.8" rx="2" ry="1.3" transform="rotate(25 4.4 16.8)" />
      <ellipse cx="19.8" cy="17" rx="2" ry="1.3" transform="rotate(-25 19.8 17)" />
      <ellipse cx="12" cy="19.6" rx="1.3" ry=".9" />
      <circle cx="12" cy="13" r="2.6" fillOpacity=".18" fill="#000" />
    </g>
  ),
  boat: (
    <g fill="currentColor" stroke="none">
      <path d="M3 15.5h18l-2.6 4.3H5.6Z" />
      <rect x="11.3" y="3.5" width="1.4" height="12" />
      <path d="M12.7 4.2 19 14.3h-6.3Z" />
      <path d="M11.3 6.5 6.4 14.3h4.9Z" fillOpacity=".7" />
    </g>
  ),
  shell: (
    <g>
      <path d="M12 3c4 2 8 7 8 12a8 5.5 0 01-16 0c0-5 4-10 8-12Z" fill="currentColor" stroke="none" />
      <path d="M12 6v11M9 7.4 9.6 17M15 7.4 14.4 17M6.6 10 8 17.6M17.4 10 16 17.6" stroke="#000" strokeOpacity=".18" strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  ),
  goat: (
    <g fill="currentColor" stroke="none">
      <ellipse cx="10.5" cy="14" rx="6.3" ry="3.4" />
      <rect x="5.5" y="16" width="1.6" height="4.4" rx=".6" />
      <rect x="9" y="16.6" width="1.6" height="3.8" rx=".6" />
      <rect x="13" y="16.6" width="1.6" height="3.8" rx=".6" />
      <ellipse cx="17.2" cy="10.4" rx="2.6" ry="2.2" />
      <path d="M18.4 8.6c1.6-3.4 4.4-5.4 6-5-2 1.4-3.6 3.4-4.6 6Z" />
    </g>
  ),
  falcon: (
    <g fill="currentColor" stroke="none">
      <path d="M12 8c-3 4-7 5.6-11 4.6 3.6 2.4 8 2.4 11-.4 3 2.8 7.4 2.8 11 .4-4 1-8-.6-11-4.6Z" />
      <path d="M9.5 12.4c-1 2.6-.6 5 .6 6.6.6-2 1.4-3.6 1.9-4.4.5.8 1.3 2.4 1.9 4.4 1.2-1.6 1.6-4 .6-6.6-1 .6-1.8 1.6-2.5 2.6-.7-1-1.5-2-2.5-2.6Z" fillOpacity=".85" />
    </g>
  ),
  wind: (
    <g fill="currentColor" stroke="none">
      <path d="M3 8h10.5a2.4 2.4 0 10-2.3-3.2 1 1 0 101.9.6 1.4 1.4 0 111.3 1.8H3a1 1 0 000 2Z" />
      <path d="M3 13.6h15a2.8 2.8 0 11-2.7 3.7 1 1 0 111.9-.6 1.8 1.8 0 100-2.3H3a1 1 0 010-2Z" fillOpacity=".85" />
      <path d="M3 18.6h7.5a1 1 0 010 2H3a1 1 0 010-2Z" fillOpacity=".6" />
    </g>
  ),
  tree: (
    <g>
      <path d="M11 22V13.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M11 17 7 20M11 15 15.5 18" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeOpacity=".8" />
      <ellipse cx="8" cy="8.5" rx="4.6" ry="4" fill="currentColor" stroke="none" />
      <ellipse cx="13.5" cy="6.5" rx="4" ry="3.4" fill="currentColor" stroke="none" />
      <ellipse cx="14.6" cy="11.4" rx="3.6" ry="3" fill="currentColor" stroke="none" />
    </g>
  ),
  baysun: (
    <g>
      <circle cx="12" cy="9" r="3.6" fill="currentColor" stroke="none" />
      <path d="M12 2.6v1.8M12 12.6v1.8M5.6 9h1.8M16.6 9h1.8M7.3 4.3l1.3 1.3M15.4 4.3l-1.3 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M2 17.4c1.6-1 3.2-1 4.8 0s3.2 1 4.8 0 3.2-1 4.8 0 3.2 1 4.8 0" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M2 20.4c1.6-1 3.2-1 4.8 0s3.2 1 4.8 0 3.2-1 4.8 0 3.2 1 4.8 0" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeOpacity=".6" />
    </g>
  ),
  check: <path d="M5 13l4.5 4.5L19 8" />,
  star: <path d="M12 3.5 14.7 9 20.8 9.9 16.4 14.2 17.5 20.3 12 17.4 6.5 20.3 7.6 14.2 3.2 9.9 9.3 9Z" />,
  lock: (
    <g>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    </g>
  ),
  search: (
    <g>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.2 15.2 20 20" />
    </g>
  ),
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
  coin: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.4" />
      <path d="M12 9v6M10.2 10.5c0-1 .8-1.5 1.8-1.5s1.8.5 1.8 1.3c0 1.8-3.6 1-3.6 2.8 0 .8.8 1.4 1.8 1.4s1.8-.5 1.8-1.5" />
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
      style={{ fill: "none", stroke: color, color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" }}
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

/* صورة مولَّدة مع بديل احتياطي: إن تعذّر تحميلها (لا اتصال، أو
   الملف غير موجود) يظهر الرسم القديم بدلًا منها دون أي كسر بصري. */
export function ImgFallback({ src, alt, fallback, width, height, style }) {
  const [broken, setBroken] = useState(false);
  if (broken || !src) return fallback ?? null;
  return (
    <img
      src={src} alt={alt || ""} loading="lazy" draggable="false"
      width={width} height={height}
      onError={() => setBroken(true)}
      style={{ display: "block", objectFit: "contain", ...style }}
    />
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

/* ============================================================
   أَيْقُونَاتُ القِصَصِ المُلَوَّنَةُ — رَسْمٌ مُفَصَّلٌ بِأَلْوَانِهِ الطَّبِيعِيَّةِ
   بَدَلَ رَمْزٍ أُحَادِيِّ اللَّوْنِ، لِيَظْهَرَ أَقْرَبَ إِلَى شَكْلِهِ الحَقِيقِيِّ
   ============================================================ */
const STORY_ICON_SHAPES = {
  drop: (
    <g>
      <path d="M24 6C24 6 10 24 10 33a14 14 0 0028 0C38 24 24 6 24 6Z" fill="#5FA6C4" stroke="#2E6E8E" strokeWidth="1.6" />
      <path d="M17 30a8 10 0 007 9c-6-1-10-5-10-9.6Z" fill="#BEE3EC" opacity=".75" />
    </g>
  ),
  turtle: (
    <g>
      <ellipse cx="24" cy="27" rx="15" ry="11" fill="#6E9460" stroke="#4A6338" strokeWidth="1.6" />
      <path d="M17 22l3 4-3 4M24 20v5.5M31 22l-3 4 3 4M15.5 27h4M32.5 27h-4" stroke="#4A6338" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".55" />
      <ellipse cx="37" cy="20" rx="4.6" ry="3.8" fill="#8FAE72" stroke="#4A6338" strokeWidth="1.3" />
      <circle cx="38.6" cy="19" r="1" fill="#2E3A28" />
      <ellipse cx="8" cy="19" rx="3.6" ry="2.4" fill="#8FAE72" stroke="#4A6338" strokeWidth="1.2" transform="rotate(-25 8 19)" />
      <ellipse cx="8" cy="35" rx="3.6" ry="2.4" fill="#8FAE72" stroke="#4A6338" strokeWidth="1.2" transform="rotate(25 8 35)" />
      <ellipse cx="40" cy="35" rx="3.6" ry="2.4" fill="#8FAE72" stroke="#4A6338" strokeWidth="1.2" transform="rotate(-25 40 35)" />
      <ellipse cx="24" cy="40" rx="2.6" ry="1.8" fill="#8FAE72" stroke="#4A6338" strokeWidth="1.2" />
    </g>
  ),
  boat: (
    <g>
      <path d="M6 30h36l-5 9H11Z" fill="#B5824F" stroke="#7A5530" strokeWidth="1.6" />
      <rect x="22.8" y="6" width="2.4" height="25" fill="#6E5330" />
      <path d="M25.4 8 38 27H25.4Z" fill="#FBF6E8" stroke="#C9B98C" strokeWidth="1.3" />
      <path d="M23 12 13 27h10Z" fill="#F0E4C4" stroke="#C9B98C" strokeWidth="1.2" opacity=".9" />
      <path d="M28 12 34 24M26 16 31 25" stroke="#D8C89E" strokeWidth=".8" opacity=".7" fill="none" />
    </g>
  ),
  shell: (
    <g>
      <path d="M24 6c8 4 16 14 16 24a16 11 0 01-32 0c0-10 8-20 16-24Z" fill="#EAC48C" stroke="#B5862F" strokeWidth="1.6" />
      <path d="M24 12v22M18 14 19.2 32M30 14 28.8 32M13 19 15.5 34M35 19 32.5 34M9 27 12 36M39 27 36 36" stroke="#C99A54" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M24 34a7 4 0 01-7-4h14a7 4 0 01-7 4Z" fill="#F2A98B" opacity=".7" />
    </g>
  ),
  goat: (
    <g>
      <ellipse cx="20" cy="27" rx="13" ry="7" fill="#B5895A" stroke="#7A5A2E" strokeWidth="1.6" />
      <path d="M11 27a13 4 0 0018 0Z" fill="#D9C09B" opacity=".6" />
      <rect x="9" y="32" width="3.2" height="9" rx="1.4" fill="#8A6A3E" />
      <rect x="17" y="33" width="3.2" height="8" rx="1.4" fill="#8A6A3E" />
      <rect x="27" y="33" width="3.2" height="8" rx="1.4" fill="#8A6A3E" />
      <ellipse cx="34" cy="19" rx="5.4" ry="4.6" fill="#C29A66" stroke="#7A5A2E" strokeWidth="1.4" />
      <circle cx="36.6" cy="18" r="1.1" fill="#2E2113" />
      <path d="M36.5 15c3-7 9-11 12-10-4 3-7 7-9.4 12Z" fill="#5A4326" stroke="#3B2A18" strokeWidth="1" />
      <path d="M38 15.5c1-2.4 2.4-4.4 4-6M39.4 17.2c1.6-2 3.4-3.6 5-4.8" stroke="#7A5A2E" strokeWidth=".8" opacity=".6" fill="none" />
    </g>
  ),
  falcon: (
    <g>
      <path d="M24 16c-6 8-14 11-22 9 7 5 16 5 22-1 6 6 15 6 22 1-8 2-16-1-22-9Z" fill="#8A6A45" stroke="#5A4326" strokeWidth="1.3" />
      <path d="M19 24c-2 5-1.2 10 1.2 13 1.2-4 2.8-7 3.8-8.8 1 1.8 2.6 4.8 3.8 8.8 2.4-3 3.2-8 1.2-13-2 1.2-3.6 3.2-5 5.2-1.4-2-3-4-5-5.2Z" fill="#B5895A" stroke="#5A4326" strokeWidth="1.2" />
      <path d="M12 21c1.6.6 3.4.6 5-.4M31 20.6c1.6 1 3.4 1 5 .4" stroke="#5A4326" strokeWidth=".9" opacity=".6" fill="none" />
    </g>
  ),
  wind: (
    <g>
      <path d="M6 16h21a4.8 4.8 0 10-4.6-6.4" fill="none" stroke="#5FA6C4" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M6 27.2h30a5.6 5.6 0 11-5.4 7.4" fill="none" stroke="#5FA6C4" strokeWidth="2.8" strokeLinecap="round" opacity=".85" />
      <path d="M6 37.2h15" fill="none" stroke="#5FA6C4" strokeWidth="2.8" strokeLinecap="round" opacity=".6" />
      <path d="M33 22c2-2 5-1.6 5.6 1 .5 2.2-1.6 4-4 3.4-1.6-.4-2.6-2-1.6-4.4Z" fill="#7FB86A" stroke="#4E7A3E" strokeWidth="1" transform="rotate(20 35 24)" />
    </g>
  ),
  tree: (
    <g>
      <path d="M22 42V26c-3-2-5-5-4-9" stroke="#8A6A45" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M22 30 15 36M23 25 30 30M20 33 13 30" stroke="#8A6A45" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8" />
      <ellipse cx="14" cy="16" rx="8.4" ry="7" fill="#9FB585" stroke="#6E8A58" strokeWidth="1.4" />
      <ellipse cx="25" cy="11" rx="7.4" ry="6.2" fill="#8FAE72" stroke="#6E8A58" strokeWidth="1.4" />
      <ellipse cx="27" cy="21" rx="6.6" ry="5.6" fill="#7FA164" stroke="#6E8A58" strokeWidth="1.4" />
    </g>
  ),
  baysun: (
    <g>
      <circle cx="24" cy="16" r="7.2" fill="#F0B84E" stroke="#C9863A" strokeWidth="1.4" />
      <path d="M24 4v3.6M24 24.4V28M10 16h3.6M34.4 16H38M14 6l2.6 2.6M31.4 6l-2.6 2.6" stroke="#F0B84E" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 33.4c3.2-2 6.4-2 9.6 0s6.4 2 9.6 0 6.4-2 9.6 0 6.4 2 9.6 0" fill="none" stroke="#3E86A8" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M4 40c3.2-2 6.4-2 9.6 0s6.4 2 9.6 0 6.4-2 9.6 0 6.4 2 9.6 0" fill="none" stroke="#6FB4CE" strokeWidth="2.6" strokeLinecap="round" opacity=".75" />
    </g>
  ),
};

export function StoryIcon({ icon, size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ display: "block" }}>
      {STORY_ICON_SHAPES[icon] || STORY_ICON_SHAPES.drop}
    </svg>
  );
}

/* ============================================================
   أَيْقُونَاتُ المُصْطَلَحَاتِ فِي المُعْجَمِ — رَسْمٌ مُلَوَّنٌ مُفَصَّلٌ
   بَدَلَ صُوَرِ جِيمِينَاي، بِنَفْسِ أُسْلُوبِ أَيْقُونَاتِ القِصَصِ أَعْلَاه.
   ============================================================ */
const DICT_ICON_SHAPES = {
  recycle: (
    <g>
      <g fill="#8FAE72" stroke="#4A7A3E" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M24 6 33 20 15 20Z" />
        <path d="M24 6 33 20 15 20Z" transform="rotate(120 24 24)" />
        <path d="M24 6 33 20 15 20Z" transform="rotate(240 24 24)" />
      </g>
      <circle cx="24" cy="24" r="4.4" fill="#F0B84E" stroke="#C9863A" strokeWidth="1.4" />
    </g>
  ),
  conserve: (
    <g>
      <path d="M22 6C22 6 8 24 8 33a14 14 0 0028 0C36 24 22 6 22 6Z" fill="#5FA6C4" stroke="#2E6E8E" strokeWidth="1.6" />
      <path d="M15 30a8 10 0 007 9c-6-1-10-5-10-9.6Z" fill="#BEE3EC" opacity=".75" />
      <rect x="30" y="4" width="10" height="8" rx="2" fill="#9FB0B6" stroke="#5B3626" strokeWidth="1.3" />
      <path d="M40 10q8 0 8 10" fill="none" stroke="#9FB0B6" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  biodiversity: (
    <g>
      <ellipse cx="14" cy="34" rx="9" ry="6" fill="#B5895A" stroke="#7A5A2E" strokeWidth="1.4" />
      <path d="M8 29c1.4-5 6-8 10-7-2 2-3 4-3 6Z" fill="#C29A66" stroke="#7A5A2E" strokeWidth="1.1" />
      <ellipse cx="34" cy="20" rx="10" ry="7.4" fill="#6E9460" stroke="#4A6338" strokeWidth="1.4" />
      <ellipse cx="43.4" cy="16.4" rx="3.2" ry="2.6" fill="#8FAE72" stroke="#4A6338" strokeWidth="1" />
      <path d="M22 44V34c-2-1.4-3.4-3.4-2.8-6" stroke="#8A6A45" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="17" cy="26" rx="6" ry="5" fill="#9FB585" stroke="#6E8A58" strokeWidth="1.1" />
    </g>
  ),
  warming: (
    <g>
      <rect x="20" y="6" width="8" height="26" rx="4" fill="#F0ECE2" stroke="#5B3626" strokeWidth="1.6" />
      <rect x="21.6" y="16" width="4.8" height="16" rx="2.4" fill="#E66422" />
      <circle cx="24" cy="37" r="7" fill="#E66422" stroke="#5B3626" strokeWidth="1.6" />
      <circle cx="38" cy="12" r="6.4" fill="#F0B84E" stroke="#C9863A" strokeWidth="1.4" />
      <path d="M38 2.6v3M46.4 12h-3M31.6 12h3" stroke="#F0B84E" strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
  pollution: (
    <g>
      <path d="M10 34q-6 0-6-6.4 0-5.6 5-6.2.6-6.4 7.4-6.4 5 0 7 4 2-1.6 5-.4 3.2 1.4 3 5 4.6.6 4.6 5.6 0 4.8-5 4.8Z" fill="#AEB4AC" stroke="#6E756E" strokeWidth="1.4" opacity=".92" />
      <rect x="18" y="34" width="6" height="12" fill="#8B96A0" stroke="#5B3626" strokeWidth="1.3" />
      <path d="M21 20c3 3 1 6 3 9M30 22c3 3 1 6 3 9" stroke="#C7C2B0" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".8" />
    </g>
  ),
  sustainability: (
    <g>
      <path d="M24 44V22" stroke="#8A6A3E" strokeWidth="3" strokeLinecap="round" />
      <g fill="#7C8A2F" stroke="#4A6338" strokeWidth="1.4">
        <path d="M24 22q-15-3-20-13q15 0 20 13Z" /><path d="M24 22q15-3 20-13q-15 0-20 13Z" />
      </g>
      <path d="M8 40h28l-3 6H11Z" fill="#D9C29A" stroke="#5B3626" strokeWidth="1.4" strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <circle key={i} cx={16 + i * 6} cy="38" r="2.6" fill="#E66422" stroke="#5B3626" strokeWidth="1" />)}
    </g>
  ),
  greenh2: (
    <g>
      <rect x="6" y="8" width="24" height="15" rx="2.4" fill="#7FC8C2" stroke="#5B3626" strokeWidth="1.6" />
      <path d="M10 8V23M16 8V23M22 8V23M28 8V23" stroke="#5B3626" strokeWidth=".8" opacity=".5" />
      <circle cx="38" cy="12" r="5.4" fill="#F0B84E" stroke="#C9863A" strokeWidth="1.3" />
      <circle cx="34" cy="34" r="4.2" fill="#D7EDE6" stroke="#2E7D6B" strokeWidth="1.4" />
      <circle cx="42" cy="34" r="4.2" fill="#D7EDE6" stroke="#2E7D6B" strokeWidth="1.4" />
      <path d="M38 34h0" stroke="#2E7D6B" strokeWidth="1.4" />
      <path d="M18 30h20l-4 7H14Z" fill="#8A6A45" stroke="#5B3626" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="21" cy="40" r="3.6" fill="#5B3626" /><circle cx="33" cy="40" r="3.6" fill="#5B3626" />
    </g>
  ),
  reserve: (
    <g>
      <ellipse cx="20" cy="30" rx="16" ry="12" fill="#6E9460" stroke="#4A6338" strokeWidth="1.6" />
      <ellipse cx="34" cy="22" rx="5" ry="4" fill="#8FAE72" stroke="#4A6338" strokeWidth="1.3" />
      <circle cx="37" cy="20" r="1.2" fill="#2E3A28" />
      <path d="M30 10a7 7 0 108 10 6 6 0 01-8-10Z" fill="#F0ECE2" stroke="#C9863A" strokeWidth="1.1" />
    </g>
  ),
  oryx: (
    <g>
      <ellipse cx="18" cy="32" rx="14" ry="9" fill="#F3EEE2" stroke="#8A6A45" strokeWidth="1.6" />
      <ellipse cx="34" cy="20" rx="8" ry="6.6" fill="#F3EEE2" stroke="#8A6A45" strokeWidth="1.6" />
      <path d="M30 14c2-9 1-15-3-18M38 14c-2-9-1-15 3-18" fill="none" stroke="#DCD3BC" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 14c2-9 1-15-3-18M38 14c-2-9-1-15 3-18" fill="none" stroke="#5B3626" strokeWidth="1" strokeLinecap="round" />
      <circle cx="37" cy="18" r="1.3" fill="#5B3626" />
    </g>
  ),
  desert: (
    <g>
      <path d="M4 36Q16 16 26 30T48 36Z" fill="#E6C488" stroke="#B5895A" strokeWidth="1.6" />
      <path d="M36 36V26" stroke="#4A7A3E" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="33" cy="24" rx="4.4" ry="3.2" fill="#8FAE72" stroke="#4A7A3E" strokeWidth="1.1" />
      <ellipse cx="39" cy="23" rx="3.8" ry="3" fill="#9FB585" stroke="#4A7A3E" strokeWidth="1.1" />
    </g>
  ),
  reef: (
    <g>
      <path d="M14 42V28q0-6 6-8M14 28q-8-2-8-10M22 32q6-4 6-12" fill="none" stroke="#E6875C" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 42V24q0-7 7-9M30 28q9-2 9-12" fill="none" stroke="#F0B84E" strokeWidth="3" strokeLinecap="round" />
      <path d="M41 16q7-4 13-2q1 6-3 10q-7 3-13-2Z" fill="#F2A41A" stroke="#C9863A" strokeWidth="1.3" />
      <circle cx="49" cy="15" r="1.1" fill="#5B3626" />
    </g>
  ),
};

export function DictIcon({ id, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ display: "block" }}>
      {DICT_ICON_SHAPES[id] || STORY_ICON_SHAPES.drop}
    </svg>
  );
}

const STORY_THUMB = {
  falaj: "assets/img/stories/story-thumb-01-falaj.webp",
  turtle: "assets/img/stories/story-thumb-02-salma.webp",
  oilspill: "assets/img/stories/story-thumb-03-muscat-sea.webp",
  mangrove: "assets/img/stories/story-thumb-04-mangrove.webp",
  ibex: "assets/img/stories/story-thumb-05-tuti.webp",
  falcon: "assets/img/stories/story-thumb-06-nest.webp",
  airquality: "assets/img/stories/story-thumb-07-sky.webp",
  frankincense: "assets/img/stories/story-thumb-08-dhofar.webp",
  bay: "assets/img/stories/story-thumb-09-muscat-gulf.webp",
};

function StoryBadgeIcon({ biome, icon, size }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.32, overflow: "hidden", flexShrink: 0, position: "relative" }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ display: "block" }}>
        <BiomeBackdrop biome={biome} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: size * 0.62, height: size * 0.62, borderRadius: "50%",
          background: "rgba(255,255,255,.85)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 6px rgba(20,28,18,.25)",
        }}>
          <StoryIcon icon={icon} size={size * 0.44} />
        </div>
      </div>
    </div>
  );
}

export function StoryBadge({ storyId, icon, color, size = 56 }) {
  const biome = BIOME_OF[storyId] || "mountain";
  const thumb = STORY_THUMB[storyId];
  if (!thumb) return <StoryBadgeIcon biome={biome} icon={icon} size={size} />;
  return (
    <ImgFallback
      src={thumb} alt=""
      width={size} height={size * 1.1}
      style={{ borderRadius: size * 0.24, flexShrink: 0, objectFit: "cover", background: envColor[storyId] || c.sage }}
      fallback={<StoryBadgeIcon biome={biome} icon={icon} size={size} />}
    />
  );
}

const STORY_BADGE_EARNED = {
  falaj: "assets/img/badges/badge-story-01.webp",
  turtle: "assets/img/badges/badge-story-02.webp",
  oilspill: "assets/img/badges/badge-story-03.webp",
  mangrove: "assets/img/badges/badge-story-04.webp",
  ibex: "assets/img/badges/badge-story-05.webp",
  falcon: "assets/img/badges/badge-story-06.webp",
  airquality: "assets/img/badges/badge-story-07.webp",
  frankincense: "assets/img/badges/badge-story-08.webp",
  bay: "assets/img/badges/badge-story-09.webp",
};
const STORY_BADGE_EMPTY = "assets/img/badges/badge-empty.webp";

/* شارة إتمام القصة في نهاية سطرها — وسام مكتسب أو مربّع فارغ منتظر */
export function CompletionBadge({ storyId, earned, size = 30 }) {
  const src = earned ? STORY_BADGE_EARNED[storyId] : STORY_BADGE_EMPTY;
  const fallback = earned
    ? <IconChip bg={c.goodSoft} size={size} radius={10}><Glyph name="check" size={size * 0.53} color={c.good} strokeWidth={2.6} /></IconChip>
    : <span style={{ width: size, height: size, borderRadius: 10, border: `1.5px dashed ${(envColor[storyId] || c.sageDeep)}66`, display: "block" }} />;
  if (!src) return fallback;
  return <ImgFallback src={src} alt="" width={size} height={size} style={{ borderRadius: "50%", flexShrink: 0 }} fallback={fallback} />;
}

/* ============================================================
   خلفيّاتُ مَشَاهِدِ القِصَّةِ — مَنَاظِرُ كَرْتُونِيَّةٌ كَامِلَةُ التَّفْصِيلِ
   خَلْفَ نَصِّ كُلِّ مَشْهَدٍ، بَدَلَ تَدَرُّجٍ لَوْنِيٍّ مُصْمَتٍ
   ============================================================ */
function SceneDefs() {
  return (
    <defs>
      <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FD3E8" /><stop offset="55%" stopColor="#BFE6D9" /><stop offset="100%" stopColor="#EADFB8" />
      </linearGradient>
      <linearGradient id="skyDawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2E4F7A" /><stop offset="45%" stopColor="#8C93AC" /><stop offset="75%" stopColor="#E8B27E" /><stop offset="100%" stopColor="#F4D9A0" />
      </linearGradient>
      <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0E1B3C" /><stop offset="100%" stopColor="#243A63" />
      </linearGradient>
      <linearGradient id="skyWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7FD0E0" /><stop offset="55%" stopColor="#2E86A8" /><stop offset="100%" stopColor="#123B54" />
      </linearGradient>
      <linearGradient id="skyForest" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#BFE0D8" /><stop offset="100%" stopColor="#E9E4BE" />
      </linearGradient>
      <linearGradient id="skyEnding" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FD3E8" /><stop offset="60%" stopColor="#DCEFC7" /><stop offset="100%" stopColor="#F6E7A8" />
      </linearGradient>
    </defs>
  );
}

function IbexMark({ x, y, scale = 1, color = "#4A3624" }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} fill={color}>
      <ellipse cx="0" cy="0" rx="13" ry="6.5" />
      <path d="M11 -3 20 -8 15 0Z" />
      <path d="M15 -6C20 -14 28 -17 30 -14C25 -11 20 -7 16 -3Z" />
      <rect x="-8" y="5" width="3" height="9" /><rect x="4" y="5" width="3" height="9" />
    </g>
  );
}

function TurtleMark({ x, y, scale = 1, rotate = 0, color = "#3E6E4E" }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`} fill={color}>
      <ellipse cx="0" cy="0" rx="16" ry="12" />
      <ellipse cx="14" cy="-2" rx="6" ry="5" />
    </g>
  );
}

function DayScene() {
  return (
    <>
      <rect x="0" y="0" width="400" height="300" fill="url(#skyDay)" />
      <circle cx="332" cy="54" r="30" fill="#FFD873" /><circle cx="332" cy="54" r="48" fill="#FFD873" opacity=".2" />
      <path d="M40 68q20-14 40 0t40 0" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" fill="none" opacity=".55" />
      <path d="M90 92q18-12 36 0t36 0" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".45" />
      <path d="M0 190 60 130 110 170 160 110 210 165 260 120 320 175 400 140V300H0Z" fill="#D8B27E" />
      <path d="M0 220 50 175 100 210 150 160 220 215 280 175 340 220 400 195V300H0Z" fill="#BC8656" />
      <IbexMark x={252} y={166} scale={1.15} />
      <path d="M0 260 60 245 130 262 200 240 280 260 340 244 400 258V300H0Z" fill="#E4C596" />
      <ellipse cx="70" cy="272" rx="22" ry="9" fill="#C9A46A" /><ellipse cx="230" cy="278" rx="26" ry="10" fill="#C9A46A" /><ellipse cx="342" cy="270" rx="18" ry="8" fill="#C9A46A" />
      <g transform="translate(30,255)"><path d="M0 45V10" stroke="#5E7A45" strokeWidth="4" /><path d="M0 26 -12 45M0 20 12 40" stroke="#5E7A45" strokeWidth="3" fill="none" strokeLinecap="round" /></g>
    </>
  );
}

function DawnScene() {
  return (
    <>
      <rect x="0" y="0" width="400" height="300" fill="url(#skyDawn)" />
      <circle cx="200" cy="150" r="34" fill="#FFCB7A" opacity=".9" /><circle cx="200" cy="150" r="60" fill="#FFCB7A" opacity=".22" />
      <path d="M60 60q6-6 12 0q6-6 12 0" stroke="#3B4A63" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M300 84q6-6 12 0q6-6 12 0" stroke="#3B4A63" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M0 175h400v40H0Z" fill="#3E86A8" />
      <path d="M0 195q20-6 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0V220H0Z" fill="#5FA6C4" opacity=".7" />
      <path d="M0 210h400v90H0Z" fill="#EAD9B0" />
      <path d="M70 300C82 262 92 250 124 216" stroke="#D8C293" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M64 292C58 284 68 280 62 272M96 262C90 254 100 250 94 242M114 232C108 224 118 220 112 212" stroke="#C9B27E" strokeWidth="4" fill="none" strokeLinecap="round" />
      <TurtleMark x={140} y={208} scale={1} rotate={-22} />
    </>
  );
}

function NightScene() {
  return (
    <>
      <rect x="0" y="0" width="400" height="300" fill="url(#skyNight)" />
      <circle cx="320" cy="55" r="22" fill="#F3E6B8" opacity=".9" /><circle cx="312" cy="50" r="22" fill="#0E1B3C" opacity=".55" />
      {[...Array(10)].map((_, i) => (
        <circle key={i} cx={20 + (i * 37) % 380} cy={20 + ((i * 53) % 110)} r={i % 3 === 0 ? 1.8 : 1.1} fill="#F3E6B8" opacity={0.5 + (i % 4) * 0.12} />
      ))}
      <path d="M0 190h400v30H0Z" fill="#173A55" />
      <path d="M0 205q20-5 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0V220H0Z" fill="#20496A" opacity=".8" />
      <path d="M0 210h400v90H0Z" fill="#8A7A54" />
      <path d="M70 300C82 262 92 250 124 216" stroke="#77694A" strokeWidth="11" fill="none" strokeLinecap="round" />
      <TurtleMark x={150} y={206} scale={0.95} rotate={-18} color="#2E4A38" />
    </>
  );
}

function WaterScene() {
  return (
    <>
      <rect x="0" y="0" width="400" height="300" fill="url(#skyWater)" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${60 + i * 110} 0 L${90 + i * 110} 300`} stroke="#BEE9F2" strokeWidth="14" opacity=".14" />
      ))}
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={40 + (i * 63) % 360} cy={260 - (i * 37) % 220} r={3 + (i % 3)} fill="#FFFFFF" opacity=".35" />
      ))}
      <path d="M0 250h400v50H0Z" fill="#0E3B52" />
      <path d="M60 255C70 235 90 233 94 251C98 237 114 235 116 255Z" fill="#E88A5C" />
      <g transform="translate(150,262)"><circle cx="0" cy="0" r="14" fill="#C9633B" /><circle cx="10" cy="4" r="10" fill="#D9754D" /></g>
      <path d="M230 255C238 237 254 235 258 253C262 239 276 237 278 255Z" fill="#7FA6D6" />
      <g transform="translate(310,258)"><circle cx="0" cy="0" r="11" fill="#4E8B6E" /><circle cx="9" cy="3" r="8" fill="#5EA07E" /></g>
      <g transform="translate(120,110)" fill="#F0C86A"><ellipse cx="0" cy="0" rx="12" ry="7" /><path d="M-12 0 -20 -6 -20 6Z" /></g>
      <g transform="translate(280,150) scale(-1,1)" fill="#7FD1B9"><ellipse cx="0" cy="0" rx="10" ry="6" /><path d="M-10 0 -17 -5 -17 5Z" /></g>
    </>
  );
}

function ForestScene() {
  return (
    <>
      <rect x="0" y="0" width="400" height="300" fill="url(#skyForest)" />
      <path d="M0 190 70 140 140 175 210 120 280 170 340 135 400 165V300H0Z" fill="#8FBF9C" />
      <path d="M0 300h400V220q-20-10-40 0t-40 0-40 0-40 0-40 0-40 0-40 0-40 0-40 0-40 0Z" fill="#6E9E7C" opacity=".5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${40 + i * 80},${215 - (i % 2) * 10})`}>
          <path d="M0 60V20" stroke="#4A6338" strokeWidth="4" />
          <path d="M0 40 -14 60M0 34 14 54" stroke="#4A6338" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="0" cy="14" r="17" fill={i % 2 ? "#5E8352" : "#6E9460"} />
        </g>
      ))}
      <path d="M0 250h400v50H0Z" fill="#4E6E9C" opacity=".4" />
    </>
  );
}

function EndingScene() {
  return (
    <>
      <rect x="0" y="0" width="400" height="300" fill="url(#skyEnding)" />
      <g transform="translate(200,90)">
        {[...Array(8)].map((_, i) => (
          <rect key={i} x="-3" y="-70" width="6" height="30" fill="#FFD873" opacity=".55" transform={`rotate(${i * 45})`} />
        ))}
        <circle cx="0" cy="0" r="34" fill="#FFD873" />
      </g>
      <path d="M0 210 60 175 130 205 200 165 270 205 340 175 400 200V300H0Z" fill="#8FBF9C" />
      <path d="M0 240 60 220 130 245 200 215 270 245 340 220 400 235V300H0Z" fill="#6FA37E" />
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={30 + i * 65} cy={260 + (i % 2) * 14} r="5" fill={["#F0C86A", "#E88A5C", "#C9633B", "#F0C86A", "#E88A5C", "#C9633B"][i]} />
      ))}
      <path d="M70 130q10-8 20 0q10-8 20 0" stroke="#3B4A63" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M300 110q10-8 20 0q10-8 20 0" stroke="#3B4A63" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  );
}

const SCENE_BY_BASE = { day: DayScene, dawn: DawnScene, night: NightScene, water: WaterScene, forest: ForestScene, ending: EndingScene };

const STORY_SCENE_IMG = {
  falaj: { before: "assets/img/scenes/scene-01-falaj-dry.webp", after: "assets/img/scenes/scene-01-falaj-flow.webp" },
  turtle: { before: "assets/img/scenes/scene-02-rashadd-night.webp" },
  oilspill: { before: "assets/img/scenes/scene-03-muscat-sea.webp", after: "assets/img/scenes/scene-03-muscat-clean.webp" },
  mangrove: { before: "assets/img/scenes/scene-04-mangrove.webp" },
  ibex: { before: "assets/img/scenes/scene-05-huqf-dry.webp", after: "assets/img/scenes/scene-05-huqf-water.webp" },
  falcon: { before: "assets/img/scenes/scene-06-daymaniyat.webp" },
  airquality: { before: "assets/img/scenes/scene-07-sohar-haze.webp", after: "assets/img/scenes/scene-07-sohar-clear.webp" },
  frankincense: { before: "assets/img/scenes/scene-08-dhofar.webp" },
  bay: { before: "assets/img/scenes/scene-09-muscat-gulf.webp" },
};

function SceneBackdropSvg({ bg }) {
  const warn = bg.startsWith("warning");
  const base = warn ? bg.slice(7, 8).toLowerCase() + bg.slice(8) : bg;
  const Scene = SCENE_BY_BASE[base] || DayScene;
  return (
    <svg
      viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" width="100%" height="100%"
      style={{ position: "absolute", inset: 0, display: "block" }} aria-hidden="true"
    >
      <SceneDefs />
      <Scene />
      {warn && <rect x="0" y="0" width="400" height="300" fill="#5B4530" opacity=".38" />}
    </svg>
  );
}

export function SceneBackdrop({ bg, storyId, isEnding }) {
  const warn = bg.startsWith("warning");
  const pair = STORY_SCENE_IMG[storyId];
  const src = pair && (isEnding && pair.after ? pair.after : pair.before);
  if (!src) return <SceneBackdropSvg bg={bg} />;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }} aria-hidden="true">
      <ImgFallback
        src={src} alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        fallback={<SceneBackdropSvg bg={bg} />}
      />
      {warn && <div style={{ position: "absolute", inset: 0, background: "#5B4530", opacity: .38 }} />}
    </div>
  );
}

/* أبطال القصص — صورة البطل في المربّع أعلى المشهد، تتبدّل حسب الحدث */
const HERO_IMG = {
  falaj: {
    default: "assets/img/heroes/hero-salem-smile.webp",
    scenes: {
      start: "assets/img/heroes/hero-salem-worried.webp",
      ignore_wrong: "assets/img/heroes/hero-salem-worried.webp",
      ask_grandpa: "assets/img/heroes/hero-salem-ask.webp",
      organize_right: "assets/img/heroes/hero-salem-happy.webp",
    },
  },
  turtle: {
    default: "assets/img/heroes/hero-salma-walk.webp",
    scenes: {
      start: "assets/img/heroes/hero-salma-moon.webp",
      tangled: "assets/img/heroes/hero-salma-hide.webp",
      safe_swim: "assets/img/heroes/hero-salma-swim.webp",
    },
  },
  ibex: {
    default: "assets/img/heroes/hero-tuti-proud.webp",
    scenes: {
      start: "assets/img/heroes/hero-tuti-thirsty.webp",
      sea_wrong: "assets/img/heroes/hero-tuti-thirsty.webp",
      follow_mom: "assets/img/heroes/hero-tuti-track.webp",
      wait_right: "assets/img/heroes/hero-tuti-drink.webp",
    },
  },
};

export function StoryHero({ storyId, sceneId, icon, size = 46 }) {
  const set = HERO_IMG[storyId];
  const src = set && (set.scenes[sceneId] || set.default);
  const fallback = <StoryIcon icon={icon} size={size} />;
  if (!src) return fallback;
  return <ImgFallback src={src} alt="" width={size * 1.7} height={size * 1.7} style={{ objectFit: "contain" }} fallback={fallback} />;
}

/* ============================================================
   أَفَاتَارُ الطِّفْلِ — أَيْقُونَةٌ خَاصَّةٌ لِلْوَلَدِ وَلِلْبِنْتِ، تَظْهَرُ بَعْدَ التَّسْجِيلِ
   تُحَاوِلُ عَرْضَ صُورَةٍ مُولَّدَةٍ (لَمْ تُرْفَعْ بَعْدُ)، وَإِلَّا رَسْمٌ مَرْسُومٌ باليد
   بَدَلَ ذَلِكَ دُونَ أَيِّ كَسْرٍ بَصَرِيٍّ.
   ============================================================ */
const AVATAR_IMG = {
  m: "assets/img/avatar/avatar-boy.webp",
  f: "assets/img/avatar/avatar-girl.webp",
};

/* كمّة مطرّزة مشتركة — بيضاء كريمية بشريط ذهبي ونقاط فيروزية، كما في
   الصور المرجعية للشخصيات. */
function KummaCap() {
  return (
    <g>
      <path d="M26 42 Q60 16 94 42 L94 50 Q60 34 26 50 Z" fill="#F6ECCF" stroke={AV_INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="26" y="42" width="68" height="9" rx="4" fill="#E7C65A" stroke={AV_INK} strokeWidth="2" />
      {[40, 52, 68, 80].map((x) => <circle key={x} cx={x} cy="46.5" r="1.8" fill="#2E8C7A" />)}
    </g>
  );
}

const AV_INK = "#5B3626";

/* أفاتار الولد — دشداشة بيضاء بياقة وزرّين، وكمّة مطرّزة، مستوحاة من
   الشخصية المرجعية للتطبيق. */
function BoyAvatar() {
  return (
    <svg viewBox="0 0 120 130" width="100%" height="100%" role="img" aria-hidden="true">
      <path d="M14 130 Q14 96 60 92 Q106 96 106 130 Z" fill="#FFFFFF" stroke={AV_INK} strokeWidth="3" />
      <path d="M60 94 L60 124" stroke={AV_INK} strokeWidth="1.6" />
      <circle cx="60" cy="118" r="3" fill="#D9CBA3" stroke={AV_INK} strokeWidth="1.3" />
      <rect x="52" y="78" width="16" height="18" rx="6" fill="#E8B98A" />
      <ellipse cx="30" cy="70" rx="7" ry="9" fill="#E8B98A" stroke={AV_INK} strokeWidth="2" />
      <ellipse cx="90" cy="70" rx="7" ry="9" fill="#E8B98A" stroke={AV_INK} strokeWidth="2" />
      <circle cx="60" cy="62" r="34" fill="#EFC49A" stroke={AV_INK} strokeWidth="3" />
      <path d="M30 56 Q28 44 38 38" fill="none" stroke="#3B2A1D" strokeWidth="5" strokeLinecap="round" />
      <path d="M90 56 Q92 44 82 38" fill="none" stroke="#3B2A1D" strokeWidth="5" strokeLinecap="round" />
      <KummaCap />
      <ellipse cx="42" cy="70" rx="8" ry="5" fill="#F2A98B" opacity=".55" />
      <ellipse cx="78" cy="70" rx="8" ry="5" fill="#F2A98B" opacity=".55" />
      <path d="M44 56 q8 -4 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M62 56 q8 -4 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="64" r="3.4" fill="#3B2A1D" />
      <circle cx="70" cy="64" r="3.4" fill="#3B2A1D" />
      <path d="M50 78 Q60 87 70 78" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* أفاتار البنت — ثوب فيروزي بخيوط ذهبية، ولحاف كريمي بزينة ذهبية
   على الجبين، مستوحاة من الشخصية المرجعية للتطبيق. */
function GirlAvatar() {
  return (
    <svg viewBox="0 0 120 130" width="100%" height="100%" role="img" aria-hidden="true">
      <path d="M10 130 Q10 94 60 90 Q110 94 110 130 Z" fill="#2E8C7A" stroke={AV_INK} strokeWidth="3" />
      <path d="M30 128 Q36 108 60 104 Q84 108 90 128" fill="none" stroke="#E7C65A" strokeWidth="2.2" strokeDasharray="4 4" />
      <rect x="52" y="80" width="16" height="16" rx="6" fill="#EFC49A" />
      <path d="M16 96 Q14 50 60 30 Q106 50 104 96 Q104 120 86 118 Q92 90 60 84 Q28 90 34 118 Q16 120 16 96Z" fill="#F7EEDA" stroke={AV_INK} strokeWidth="3" />
      <ellipse cx="60" cy="68" rx="28" ry="30" fill="#EFC49A" stroke={AV_INK} strokeWidth="3" />
      <path d="M32 58 Q60 42 88 58" fill="none" stroke={AV_INK} strokeWidth="2.6" />
      <path d="M38 52 Q60 62 82 52" fill="none" stroke="#E7C65A" strokeWidth="2.2" />
      <circle cx="60" cy="60" r="3.4" fill="#E7C65A" stroke={AV_INK} strokeWidth="1.3" />
      <ellipse cx="42" cy="76" rx="8" ry="5" fill="#F2A98B" opacity=".55" />
      <ellipse cx="78" cy="76" rx="8" ry="5" fill="#F2A98B" opacity=".55" />
      <path d="M44 64 q8 -4 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M62 64 q8 -4 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="72" r="3.4" fill="#3B2A1D" />
      <circle cx="70" cy="72" r="3.4" fill="#3B2A1D" />
      <path d="M50 86 Q60 94 70 86" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function AvatarGlyph({ gender }) {
  return gender === "f" ? <GirlAvatar /> : <BoyAvatar />;
}

export function PlayerAvatar({ gender, size = 40 }) {
  const g = gender === "f" ? "f" : "m";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, boxShadow: shadow.sm }}>
      <ImgFallback
        src={AVATAR_IMG[g]} alt="" width={size} height={size}
        style={{ borderRadius: "50%", width: size, height: size }}
        fallback={<AvatarGlyph gender={g} />}
      />
    </div>
  );
}

/* ============================================================
   الجدّ سالم — الشخصية التي توجّه التطبيق
   الحالات: ask | think | agree | warn | smile
   رسم SVG مكوَّد بالدشداشة البيضاء الجديدة والكمّة المطرّزة واللحية
   البيضاء، بنفس أسلوب رسم بقية التطبيق (خطوط حبر، ألوان دافئة).
   ============================================================ */
const SALIM_FACE_RATIO = 130 / 120; // ارتفاع/عرض الرسم

/* تفاصيل الوجه المتغيّرة حسب الحالة النفسية — كل العناصر الثابتة
   (الرأس، اللحية، الكمّة، الياقة) تبقى واحدة، وتتغيّر الحواجب
   والعينان والفم فقط لتروي الانفعال. */
const SALIM_MOOD = {
  smile: {
    brows: <><path d="M44 54 q8 -3 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M62 54 q8 -3 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" /></>,
    eyes: <><circle cx="50" cy="61" r="3.2" fill="#3B2A1D" /><circle cx="70" cy="61" r="3.2" fill="#3B2A1D" /></>,
    mouth: <path d="M50 73 Q60 80 70 73" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" />,
  },
  ask: {
    brows: <><path d="M44 50 q8 -6 14 -1" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M62 50 q8 -6 14 -1" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" /></>,
    eyes: <><circle cx="50" cy="61" r="4" fill="#3B2A1D" /><circle cx="70" cy="61" r="4" fill="#3B2A1D" /></>,
    mouth: <ellipse cx="60" cy="75" rx="6.5" ry="7" fill="#7A4A36" stroke={AV_INK} strokeWidth="2" />,
  },
  think: {
    brows: <><path d="M44 52 q8 -2 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M62 49 q8 -5 14 -1" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" /></>,
    eyes: <><ellipse cx="48" cy="62" rx="3" ry="2.2" fill="#3B2A1D" /><ellipse cx="72" cy="61" rx="3" ry="2.2" fill="#3B2A1D" /></>,
    mouth: <path d="M53 75 Q60 72 68 75" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" />,
  },
  warn: {
    brows: <><path d="M44 52 L58 56" stroke={AV_INK} strokeWidth="3.4" fill="none" strokeLinecap="round" /><path d="M76 52 L62 56" stroke={AV_INK} strokeWidth="3.4" fill="none" strokeLinecap="round" /></>,
    eyes: <><circle cx="50" cy="62" r="3.2" fill="#3B2A1D" /><circle cx="70" cy="62" r="3.2" fill="#3B2A1D" /></>,
    mouth: <path d="M51 76 H69" stroke={AV_INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />,
  },
  agree: {
    brows: <><path d="M44 53 q8 -3 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M62 53 q8 -3 14 0" stroke={AV_INK} strokeWidth="3" fill="none" strokeLinecap="round" /></>,
    eyes: <><path d="M46 61 q4 -3 8 0" stroke="#3B2A1D" strokeWidth="2.6" fill="none" strokeLinecap="round" /><path d="M66 61 q4 -3 8 0" stroke="#3B2A1D" strokeWidth="2.6" fill="none" strokeLinecap="round" /></>,
    mouth: <path d="M48 72 Q60 86 72 72 Q60 80 48 72Z" fill="#7A4A36" stroke={AV_INK} strokeWidth="2.4" />,
  },
};

export function Salim({ mood = "smile", size = 96 }) {
  const m = SALIM_MOOD[mood] || SALIM_MOOD.smile;
  return (
    <svg
      viewBox="0 0 120 130" width={size} height={Math.round(size * SALIM_FACE_RATIO)}
      style={{ display: "block" }} role="img" aria-hidden="true"
    >
      <path d="M14 130 Q14 96 60 92 Q106 96 106 130 Z" fill="#FFFFFF" stroke={AV_INK} strokeWidth="3" />
      <path d="M54 93 L50 122 M66 93 L70 122" stroke={AV_INK} strokeWidth="1.5" />
      <circle cx="50" cy="124" r="2.6" fill="#D9CBA3" stroke={AV_INK} strokeWidth="1.2" />
      <circle cx="70" cy="124" r="2.6" fill="#D9CBA3" stroke={AV_INK} strokeWidth="1.2" />
      <rect x="52" y="78" width="16" height="18" rx="6" fill="#C9935F" />
      <ellipse cx="30" cy="70" rx="7" ry="9" fill="#C9935F" stroke={AV_INK} strokeWidth="2" />
      <ellipse cx="90" cy="70" rx="7" ry="9" fill="#C9935F" stroke={AV_INK} strokeWidth="2" />
      <circle cx="60" cy="62" r="34" fill="#D9A36C" stroke={AV_INK} strokeWidth="3" />
      <path d="M28 64 Q26 94 60 100 Q94 94 92 64 Q93 87 79 93 Q87 78 83 65 L82 80 Q74 91 60 93 Q46 91 38 80 L37 65 Q33 78 41 93 Q27 87 28 64Z" fill="#F2EFE8" stroke={AV_INK} strokeWidth="2.6" strokeLinejoin="round" />
      <KummaCap />
      <path d="M44 58 q16 -3 32 0" stroke="#B5794A" strokeWidth="1.4" fill="none" opacity=".6" />
      <ellipse cx="42" cy="68" rx="7" ry="4.4" fill="#E6875C" opacity=".4" />
      <ellipse cx="78" cy="68" rx="7" ry="4.4" fill="#E6875C" opacity=".4" />
      {m.brows}
      {m.eyes}
      {m.mouth}
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
   الهوية البصرية — شعار الموقع
   علامةٌ مُركَّبةٌ من أشكالٍ هندسيَّةٍ مُسطَّحةٍ مُتراكبةٍ (دون إطارٍ
   خارجيٍّ) — شمسٌ وجبالٌ عن اليمين، ونخلةٌ عن اليسار، فوق شريطِ
   ماءٍ واحدٍ يجمعهما: نفس أسلوب «الكتل الهندسيَّة» المرجعيّ، بلوحة
   ألوانٍ عُمانيَّةٍ خاصَّةٍ بالتطبيق (ذهب التمر، فخار بهلا، سعف
   النخيل، ماء الفلج، وردة الجبل الأخضر) بدل ألوان المرجع نفسها.
   ============================================================ */
const BRAND_INK = "#5B3626";

export function BrandMark({ size = 96 }) {
  return (
    <svg viewBox="0 0 180 120" width={size * 1.5} height={size} role="img" aria-hidden="true">
      {/* شريط الماء — يجمع النخلة والجبل في علامةٍ واحدةٍ */}
      <rect x="8" y="86" width="164" height="24" rx="12" fill="#144D4A" stroke={BRAND_INK} strokeWidth="4" />
      <path d="M22 86 A16 16 0 0 1 54 86Z" fill="#7FC8C2" stroke={BRAND_INK} strokeWidth="3.2" strokeLinejoin="round" />

      {/* الجبل والشمس */}
      <path d="M94 88 128 40 160 88Z" fill="#B84C16" stroke={BRAND_INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="146" cy="34" r="15" fill="#F2A41A" stroke={BRAND_INK} strokeWidth="3.4" />
      <path d="M110 88 134 28 154 88Z" fill="#E66422" stroke={BRAND_INK} strokeWidth="4" strokeLinejoin="round" />

      {/* النخلة */}
      <rect x="40" y="48" width="10" height="40" rx="4" fill="#8A6A3E" stroke={BRAND_INK} strokeWidth="3.2" />
      <path d="M23 49 A22 22 0 0 1 67 49Z" fill="#7C8A2F" stroke={BRAND_INK} strokeWidth="3.4" strokeLinejoin="round" />
      <path d="M58 25 69 36 58 47 47 36Z" fill="#9AA84A" stroke={BRAND_INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="45" cy="27" r="3.4" fill={BRAND_INK} />

      {/* لمسة لونٍ صغيرة تجمع الطرفين */}
      <path d="M88 85 95 92 88 99 81 92Z" fill="#F0717A" stroke={BRAND_INK} strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="34" cy="110" r="7" fill={BRAND_INK} />
      <circle cx="146" cy="110" r="7" fill={BRAND_INK} />
    </svg>
  );
}

/* شعار كامل: العلامة + اسم الموقع بتصميم مزدوج اللون وخط فاصل مزخرف،
   بدل عنوان نصّي عادي — يصلح لواجهة الترحيب وللترويج. */
export function BrandLogo({ size = 96, align = "center" }) {
  const centered = align === "center";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: centered ? "center" : "flex-end", gap: 0 }}>
      <BrandMark size={size} />
      <div style={{ textAlign: centered ? "center" : "right", marginTop: 2 }}>
        <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: size * 0.355, lineHeight: 1.15, color: c.ink }}>
          مُغَامَرَتِي
        </div>
        <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: size * 0.355, lineHeight: 1.15, color: c.sageDeep }}>
          البَيْئِيَّةُ
        </div>
        <svg width={size * 0.92} height="13" viewBox="0 0 96 13" style={{ display: "block", margin: centered ? "4px auto 0" : "4px 0 0 auto" }} aria-hidden="true">
          <path d="M2 6.5 Q24 1 48 6.5 T94 6.5" stroke={c.sageDeep} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="48" cy="7" r="3" fill={c.sageInk} />
        </svg>
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
  @keyframes stageDrip { 0% { transform: translateY(0); opacity:0; } 12% { opacity:1; } 100% { transform: translateY(620%); opacity:0; } }
  button, a, [role=button] { touch-action: manipulation; }
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

  .btn-pop { transition: transform .12s ${ease}, box-shadow .12s ${ease}; }
  .btn-pop:active { transform: translateY(5px); box-shadow: 0 1px 0 ${c.ink} !important; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;
