/* ============================================================
   الرسم — خريطة عُمان، الجدّ سالم، أيقونات القصص، ومناظر مشاهدها الكرتونيّة
   ============================================================ */
import React from "react";
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

export function StoryBadge({ storyId, icon, color, size = 56 }) {
  const biome = BIOME_OF[storyId] || "mountain";
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

export function SceneBackdrop({ bg }) {
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
