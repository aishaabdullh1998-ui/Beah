/* ============================================================
   لعبة «أحتاجه أم أريده؟» — محطة سوق نزوى

   دكّان الجدّ سالم: يسحب الطفل كل شيء إلى سلّة «أحتاج» أو
   سلّة «أريد» (سحبٌ، أو لمسٌ فلمسٌ للأصابع الصغيرة)، عبر أربعة
   مستويات تتدرّج من الوضوح إلى الموقف إلى الميزانية، مع اقتصاد
   بيسات بسيط: مندوسٌ للادّخار، ودكّانٌ صغيرٌ يُزيَّن بالبيسات.

   ملاحظة: لا صوت ولا تسجيلات في هذه النسخة (لا أداة تسجيل ولا
   توليد صوت متاحة)، والتغذية الراجعة كلها بصريّة ونصّية.
   ============================================================ */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { c, shadow, font, ease } from "./theme.js";
import { Salim, SalimSays, Glyph, IconChip, ImgFallback } from "./art.jsx";
import { GameFrame, Btn, WinCard, MarketIcon } from "./games.jsx";
import {
  needsWantsItems1, needsWantsItems2, needsWantsSituations, needsWantsBudget,
  needsWantsDecor, needsWantsQuiz, needsWantsQuizExtra, needsWantsTexts as T,
} from "./content.js";

const isF = (p) => !!p && p.gender === "f";
const pick = (p, m, f) => (isF(p) ? (f || m) : m);
const ar = (n) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
const shuffle = (a) => {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
};
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   أيقوناتٌ مُلوَّنةٌ لأشياء اللعبة (48×48)، وبعضُها معارٌ من
   أيقونات سوق التسوّق المستدام حين يتّفق الشيء نفسه.
   ============================================================ */
const NW_SHAPES = {
  bread: (
    <g>
      <path d="M6 28c0-9 8-16 18-16s18 7 18 16-8 12-18 12S6 37 6 28Z" fill="#D9A15C" stroke="#8A6A3E" strokeWidth="1.6" />
      <path d="M14 24c2 4 2 8 0 11M24 20c1.6 5 1.6 11 0 16M34 24c-2 4-2 8 0 11" stroke="#B5824F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  ),
  soap: (
    <g>
      <ellipse cx="24" cy="26" rx="16" ry="9" fill="#BEE3EC" stroke="#3E7F9C" strokeWidth="1.6" />
      <ellipse cx="24" cy="23" rx="12" ry="5" fill="#EAF6F8" opacity=".7" />
      <circle cx="10" cy="12" r="2.4" fill="#BEE3EC" stroke="#3E7F9C" strokeWidth="1" />
      <circle cx="16" cy="7" r="1.6" fill="#BEE3EC" stroke="#3E7F9C" strokeWidth="1" />
    </g>
  ),
  balloon: (
    <g>
      <path d="M24 6c7 0 12 5.5 12 12.5S30 33 24 33s-12-8-12-14.5S17 6 24 6Z" fill="#E9714E" stroke="#B33D24" strokeWidth="1.6" />
      <path d="M22 8c-2 2-2 5 0 7" stroke="#F3A184" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".8" />
      <path d="M24 33l-2 3 2 2-2 3" stroke="#8A6A3E" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </g>
  ),
  candy: (
    <g>
      <path d="M14 24c0-4 4-7 10-7s10 3 10 7-4 7-10 7-10-3-10-7Z" fill="#E9714E" stroke="#B33D24" strokeWidth="1.6" />
      <path d="M14 24 6 18v12Z" fill="#F0B84E" stroke="#C9863A" strokeWidth="1.3" />
      <path d="M34 24 42 18v12Z" fill="#4E8B6E" stroke="#2E5E3F" strokeWidth="1.3" />
    </g>
  ),
  toyCar: (
    <g>
      <path d="M6 30h4l3-8h18l4 8h4v6H6Z" fill="#4E8B6E" stroke="#2E5E3F" strokeWidth="1.6" />
      <path d="M15 22 18 15h9l4 7Z" fill="#8FD0E6" stroke="#2E5E3F" strokeWidth="1.3" />
      <circle cx="15" cy="36" r="4" fill="#3A3F42" /><circle cx="33" cy="36" r="4" fill="#3A3F42" />
      <circle cx="15" cy="36" r="1.6" fill="#8C948C" /><circle cx="33" cy="36" r="1.6" fill="#8C948C" />
    </g>
  ),
  stickers: (
    <g>
      <rect x="7" y="9" width="34" height="28" rx="3" fill="#F3E7CC" stroke="#B5862F" strokeWidth="1.4" />
      <path d="M15 18l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6Z" fill="#E9714E" />
      <path d="M31 15l1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5Z" fill="#3E8C7C" />
      <circle cx="18" cy="31" r="3.4" fill="#4487AE" />
      <path d="M30 30l1.3 2.6 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4Z" fill="#F0B84E" />
    </g>
  ),
  rice: (
    <g>
      <path d="M9 22h30l-3 14a4 4 0 01-4 3H16a4 4 0 01-4-3Z" fill="#E7DCC8" stroke="#B5862F" strokeWidth="1.5" />
      <ellipse cx="24" cy="22" rx="15" ry="5" fill="#FBF6E8" stroke="#B5862F" strokeWidth="1.4" />
      <path d="M18 20l2 2M24 19l1.6 2.2M30 20l-2 2" stroke="#C9B98C" strokeWidth="1" opacity=".7" fill="none" />
    </g>
  ),
  toothbrush: (
    <g>
      <rect x="20" y="20" width="6" height="22" rx="3" fill="#5FA6C4" stroke="#2E6E8E" strokeWidth="1.4" />
      <path d="M16 8h16a4 4 0 014 4v6a4 4 0 01-4 4H16a4 4 0 01-4-4v-6a4 4 0 014-4Z" fill="#EAF6F8" stroke="#2E6E8E" strokeWidth="1.4" />
      <path d="M16 12h16M16 16h16" stroke="#3E7F9C" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  ),
  uniform: (
    <g>
      <path d="M15 10 9 14l2 4 4-2v18h18V16l4 2 2-4-6-4-3 2h-8Z" fill="#8FA8C4" stroke="#3E5A7A" strokeWidth="1.5" />
      <rect x="20" y="30" width="8" height="10" fill="#3E5A7A" opacity=".3" />
    </g>
  ),
  iceCream: (
    <g>
      <path d="M17 22a7 7 0 0114 0c0 3-3 5-7 5s-7-2-7-5Z" fill="#E9A184" stroke="#B33D24" strokeWidth="1.5" />
      <path d="M19 25l5 15 5-15Z" fill="#D9A15C" stroke="#8A6A3E" strokeWidth="1.4" />
      <circle cx="24" cy="15" r="3" fill="#F0B84E" stroke="#C9863A" strokeWidth="1" />
    </g>
  ),
  soda: (
    <g>
      <rect x="16" y="10" width="16" height="28" rx="4" fill="#4487AE" stroke="#2E6E8E" strokeWidth="1.5" />
      <path d="M16 18h16M16 26h16" stroke="#EAF6F8" strokeWidth="1.4" opacity=".7" />
      <path d="M20 8l1.6-3M27 8l-1.6-3" stroke="#8C948C" strokeWidth="1.3" strokeLinecap="round" />
    </g>
  ),
  doll: (
    <g>
      <circle cx="24" cy="14" r="7" fill="#EFD0AB" stroke="#B5824F" strokeWidth="1.4" />
      <path d="M14 40c0-9 4.5-14 10-14s10 5 10 14Z" fill="#E9714E" stroke="#B33D24" strokeWidth="1.5" />
      <path d="M18 10c0-3 3-5 6-5s6 2 6 5" fill="#8A6A3E" stroke="none" />
    </g>
  ),
  kite: (
    <g>
      <path d="M24 6 36 22 24 42 12 22Z" fill="#F0B84E" stroke="#C9863A" strokeWidth="1.5" />
      <path d="M24 6V42M12 22h24" stroke="#8A6A3E" strokeWidth="1" opacity=".6" />
      <path d="M24 42c2 3 1 6-1 8" stroke="#8A6A3E" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  ),
  glowHat: (
    <g>
      <ellipse cx="24" cy="30" rx="18" ry="4.4" fill="#F0B84E" stroke="#C9863A" strokeWidth="1.4" />
      <path d="M14 28a10 9 0 0120 0Z" fill="#F6C86A" stroke="#C9863A" strokeWidth="1.4" />
      <path d="M24 12v3M17 15l2 2M31 15l-2 2" stroke="#FFD873" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),
  bag: (
    <g>
      <rect x="11" y="16" width="26" height="24" rx="5" fill="#C9633B" stroke="#8A431E" strokeWidth="1.6" />
      <path d="M17 16v-3a7 7 0 0114 0v3" fill="none" stroke="#8A431E" strokeWidth="1.6" />
      <rect x="18" y="24" width="12" height="9" rx="2" fill="#8A431E" opacity=".45" />
    </g>
  ),
  jacket: (
    <g>
      <path d="M16 9 10 13l2 4 5-2v25h14V15l5 2 2-4-6-4-4 3h-8Z" fill="#5FA6C4" stroke="#2E6E8E" strokeWidth="1.5" />
      <path d="M24 12v28" stroke="#2E6E8E" strokeWidth="1" opacity=".5" />
    </g>
  ),
  juice: (
    <g>
      <path d="M15 16h18l-2 22a3 3 0 01-3 3H20a3 3 0 01-3-3Z" fill="#F0B84E" stroke="#C9863A" strokeWidth="1.5" />
      <path d="M15 16h18" stroke="#C9863A" strokeWidth="1.4" />
      <path d="M28 16 30 6" stroke="#5FA6C4" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),
  toyPlane: (
    <g>
      <path d="M6 24h36l-8 6H14Z" fill="#8FD0E6" stroke="#2E6E8E" strokeWidth="1.5" />
      <path d="M24 10v20M16 16h16" stroke="#2E6E8E" strokeWidth="1.6" />
      <path d="M20 30h8l-2 6h-4Z" fill="#4487AE" stroke="#2E6E8E" strokeWidth="1.3" />
    </g>
  ),
  lantern: (
    <g>
      <path d="M18 8h12v4H18Z" fill="#C9863A" />
      <path d="M16 12h16l-2 22H18Z" fill="#F0B84E" stroke="#B5862F" strokeWidth="1.5" />
      <path d="M20 16v14M24 15v16M28 16v14" stroke="#B5862F" strokeWidth="1.2" opacity=".7" />
      <path d="M24 34v6" stroke="#8A6A3E" strokeWidth="1.6" />
    </g>
  ),
  dallah: (
    <g>
      <path d="M18 40c-2-10 0-18 4-22h4c4 4 6 12 4 22Z" fill="#C9863A" stroke="#8A6A3E" strokeWidth="1.5" />
      <path d="M26 20 38 16" stroke="#8A6A3E" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 18V8" stroke="#8A6A3E" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="6" r="2.4" fill="#8A6A3E" />
      <path d="M18 30c-3 1-4 4-2 7" stroke="#8A6A3E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </g>
  ),
  mat: (
    <g>
      <rect x="6" y="16" width="36" height="18" rx="2" fill="#D9A15C" stroke="#8A6A3E" strokeWidth="1.4" />
      <path d="M6 20h36M6 25h36M6 30h36" stroke="#B5824F" strokeWidth="1.2" opacity=".7" />
      <path d="M12 16v18M20 16v18M28 16v18M36 16v18" stroke="#B5824F" strokeWidth="1" opacity=".4" />
    </g>
  ),
  palmFan: (
    <g>
      <path d="M24 30c-10-2-16-10-16-20 10 0 16 8 16 20Z" fill="#8FAE72" stroke="#4E7A3E" strokeWidth="1.4" />
      <path d="M24 30c10-2 16-10 16-20-10 0-16 8-16 20Z" fill="#9FB585" stroke="#4E7A3E" strokeWidth="1.4" />
      <path d="M24 30v12" stroke="#8A6A3E" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),
  palm: (
    <g>
      <path d="M23 42V22" stroke="#8A6A45" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M23 24c-8-4-13-2-15 2 6 2 11 0 15-2Z" fill="#7FA164" stroke="#4E7A3E" strokeWidth="1.1" />
      <path d="M23 24c8-4 13-2 15 2-6 2-11 0-15-2Z" fill="#8FAE72" stroke="#4E7A3E" strokeWidth="1.1" />
      <path d="M23 22c-3-6-2-11 2-14 2 5 1 10-2 14Z" fill="#7FA164" stroke="#4E7A3E" strokeWidth="1.1" />
      <path d="M23 22c3-6 2-11-2-14-2 5-1 10 2 14Z" fill="#8FAE72" stroke="#4E7A3E" strokeWidth="1.1" />
    </g>
  ),
  canopy: (
    <g>
      <path d="M6 22a18 12 0 0136 0Z" fill="#D9A15C" stroke="#8A6A3E" strokeWidth="1.5" />
      <path d="M12 22a12 8 0 0124 0" fill="none" stroke="#B5824F" strokeWidth="1.2" opacity=".7" />
      <path d="M24 22v18" stroke="#8A6A3E" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),
  carvedDoor: (
    <g>
      <path d="M14 42V16a10 10 0 0120 0v26Z" fill="#8A6A45" stroke="#5A4326" strokeWidth="1.6" />
      <path d="M18 42V18a6 6 0 0112 0v24" fill="none" stroke="#B5895A" strokeWidth="1.3" />
      <circle cx="27" cy="30" r="1.6" fill="#D9A15C" />
    </g>
  ),
};
const MARKET_REUSED = new Set(["waterBig", "notebookRecycled", "datesLocal", "shoeDurable", "penRefill"]);

function NWIcon({ icon, size = 40 }) {
  if (MARKET_REUSED.has(icon)) return <MarketIcon icon={icon} size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ filter: "drop-shadow(0 3px 5px rgba(34,48,31,.22))" }}>
      {NW_SHAPES[icon] || NW_SHAPES.bag}
    </svg>
  );
}

/* ============================================================
   عناصر مشتركة
   ============================================================ */
export function Coins({ n }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, background: c.surface, borderRadius: 11,
      padding: "5px 11px", fontFamily: font.display, fontWeight: 700, fontSize: 16, color: "#B5862F",
      fontVariantNumeric: "tabular-nums", boxShadow: shadow.sm,
    }}>
      <Glyph name="coin" size={16} color="#D9A15C" strokeWidth={2.2} />
      {ar(n)}
    </span>
  );
}

export function Dates({ n }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ fontSize: 26, filter: i <= n ? "none" : "grayscale(1) opacity(.35)" }}>🌴</span>
      ))}
    </div>
  );
}

const BASKET_STYLE = {
  need: { bg: "#D7EDE6", ink: c.ink, deep: "#144D4A", icon: "house", label: T.needBasket },
  want: { bg: "#F9C9A7", ink: c.ink, deep: c.sageDeep, icon: "star", label: T.wantBasket },
};

function Basket({ kind, active, onClick, refEl }) {
  const st = BASKET_STYLE[kind];
  return (
    <button
      ref={refEl} type="button" onClick={onClick}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        border: `3px solid ${active ? st.deep : "transparent"}`, borderRadius: 20, padding: "14px 8px",
        background: st.bg, cursor: "pointer", minHeight: 44, transition: `all .2s ${ease}`,
        transform: active ? "scale(1.04)" : "none",
      }}
    >
      <IconChip bg="rgba(255,255,255,.55)" size={40} radius={14}>
        <Glyph name={st.icon} size={20} color={st.deep} strokeWidth={2.2} />
      </IconChip>
      <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 16, color: st.ink }}>{st.label}</span>
    </button>
  );
}

/* عنصر قابل للسحب أو اللمس: سحبٌ حقيقيٌّ، أو لمسٌ للاختيار ثمّ
   لمسُ سلّةٍ لإتمام الفرز — يخدم الأصابع الصغيرة على السواء. */
function DragItem({ id, icon, name, selected, onSelect, onDrag, bounceKey }) {
  const [pos, setPos] = useState(null);
  const startRef = useRef(null);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY, moved: false };
    setPos({ x: 0, y: 0 });
  };
  const onPointerMove = (e) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x, dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) startRef.current.moved = true;
    setPos({ x: dx, y: dy });
  };
  const onPointerUp = (e) => {
    if (!startRef.current) return;
    const moved = startRef.current.moved;
    const { clientX, clientY } = e;
    startRef.current = null;
    setPos(null);
    if (!moved) onSelect(id);
    else onDrag(id, clientX, clientY);
  };

  return (
    <button
      type="button"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      key={bounceKey}
      className={bounceKey ? "nwBounce" : ""}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: selected ? c.surface : "rgba(255,255,255,.9)",
        border: `2.5px solid ${selected ? c.accent : "transparent"}`,
        borderRadius: 16, padding: "8px 10px", cursor: "grab", minHeight: 44, minWidth: 44,
        boxShadow: shadow.md, touchAction: "none",
        transform: pos ? `translate(${pos.x}px, ${pos.y}px) scale(1.08)` : selected ? "scale(1.07)" : "none",
        transition: pos ? "none" : `transform .25s ${ease}`,
        zIndex: pos ? 20 : 1, position: "relative",
      }}
    >
      <NWIcon icon={icon} size={44} />
      <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 700, color: c.ink, textAlign: "center", lineHeight: 1.3 }}>{name}</span>
    </button>
  );
}

/* ============================================================
   ١ — سؤال الصفّ
   ============================================================ */
function GradeAsk({ profile, onPick, onExit }) {
  return (
    <GameFrame title={T.place} goal={pick(profile, "اِخْتَرْ صَفَّكَ الدِّرَاسِيَّ", "اِخْتَارِي صَفَّكِ الدِّرَاسِيَّ")} hint={pick(profile, T.gradeAsk, T.gradeAskF)} hintMood="ask" onExit={onExit}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[1, 2, 3, 4].map((g) => (
          <button
            key={g} type="button" onClick={() => onPick(g)}
            style={{
              aspectRatio: "1", borderRadius: 18, border: "none", background: c.sageDeep, color: "#FFF",
              fontFamily: font.display, fontWeight: 700, fontSize: 30, cursor: "pointer", minHeight: 44, boxShadow: shadow.md,
            }}
          >
            {ar(g)}
          </button>
        ))}
      </div>
    </GameFrame>
  );
}

/* ============================================================
   ٢ — اختبار الصور القصير (قبلي وبعدي)
   ============================================================ */
function QuizFlow({ profile, grade, onFinish, onExit }) {
  const list = useMemo(() => {
    const base = shuffle(needsWantsQuiz);
    return grade >= 3 ? [...base, needsWantsQuizExtra] : base;
  }, [grade]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const q = list[i];

  const choose = (side) => {
    const correct = side === q.answer;
    const nextScore = score + (correct ? 1 : 0);
    if (i + 1 >= list.length) onFinish(nextScore, list.length);
    else { setScore(nextScore); setI(i + 1); }
  };

  const qText = q.question ? pick(profile, q.question, q.questionF || q.question) : T.quizIntro;

  return (
    <GameFrame title={T.place} goal={T.quizIntro} score={`${ar(i + 1)}/${ar(list.length)}`}
      hint={q.question ? qText : "أَيُّهُمَا نَحْتَاجُهُ أَكْثَرَ؟"} hintMood="ask" onExit={onExit}>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
        {["a", "b"].map((side) => (
          <button
            key={side} type="button" onClick={() => choose(side)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 10px",
              borderRadius: 18, border: `1px solid ${c.line}`, background: c.paper, cursor: "pointer", minHeight: 44, boxShadow: shadow.sm,
            }}
          >
            <NWIcon icon={q[side].icon} size={64} />
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15, color: c.ink }}>{q[side].name}</span>
          </button>
        ))}
      </div>
    </GameFrame>
  );
}

/* ============================================================
   ٣ — التمهيد: «الجدّ يعلّمك»
   ============================================================ */
function Tutorial({ profile, onDone, onExit }) {
  const [step, setStep] = useState(0); // 0 intro، 1 ماء (تلقائي)، 2 بالون (تلقائي)، 3 خبز (يجرّب الطفل)
  const [placed, setPlaced] = useState(null);
  const items = [
    { id: "water", ...needsWantsItems1[0] },
    { id: "balloon", ...needsWantsItems1[4] },
    { id: "bread", ...needsWantsItems1[1] },
  ];

  useEffect(() => {
    if (step === 1 || step === 2) {
      const t = setTimeout(() => { setPlaced(items[step - 1].bin); setTimeout(() => { setStep(step + 1); setPlaced(null); }, 700); }, 1400);
      return () => clearTimeout(t);
    }
  }, [step]);

  const finishBread = (bin) => { setPlaced(bin); setTimeout(onDone, 700); };

  const hint = step === 0 ? pick(profile, T.tutorialWelcome, T.tutorialWelcomeF)
    : step === 1 ? T.tutorialWater
    : step === 2 ? T.tutorialBalloon
    : pick(profile, T.tutorialBread, T.tutorialBreadF);

  return (
    <GameFrame title={T.place} goal="التَّمْهِيدُ مَعَ الجَدِّ سَالِمٍ" hint={hint} hintMood="ask" onExit={onExit}>
      <div style={{ background: "linear-gradient(180deg,#F1ECDF 0%,#E3DAC6 100%)", borderRadius: 18, padding: "26px 14px", display: "flex", justifyContent: "center" }}>
        {step === 0 ? (
          <Btn onClick={() => setStep(1)}>لِنَبْدَأْ</Btn>
        ) : step <= 2 ? (
          <div style={{ opacity: placed ? 0 : 1, transition: `opacity .5s ${ease}` }}>
            <NWIcon icon={items[step - 1].icon} size={80} />
          </div>
        ) : (
          <div style={{ opacity: placed ? 0 : 1, transition: `opacity .5s ${ease}` }}>
            <NWIcon icon={items[2].icon} size={80} />
          </div>
        )}
      </div>
      {step === 3 && (
        <div style={{ display: "flex", gap: 12 }}>
          <Basket kind="want" active={false} onClick={() => finishBread("want")} />
          <Basket kind="need" active={false} onClick={() => finishBread("need")} />
        </div>
      )}
    </GameFrame>
  );
}

/* ============================================================
   ٤ — مستويا السَّير (الأوّل والثاني)
   ============================================================ */
function ConveyorLevel({ profile, grade, levelIndex, items, crossTime, maxOnBelt, onDone, onExit }) {
  const total = items.length;
  const [queue, setQueue] = useState(() => {
    let q;
    do { q = shuffle(items); } while (q.some((it, i) => i >= 2 && it.bin === q[i - 1].bin && it.bin === q[i - 2].bin));
    return q.map((it, i) => ({ ...it, key: `${it.id}-${i}-${Math.random()}` }));
  });
  const [active, setActive] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sortedCount, setSortedCount] = useState(0);
  const [missed, setMissed] = useState(0);
  const [hint, setHint] = useState(pick(profile, T.goalLevel, T.goalLevelF));
  const [mood, setMood] = useState("ask");
  const [streak, setStreak] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [streakBubble, setStreakBubble] = useState(false);
  const [finished, setFinished] = useState(false);
  const wrongOnceRef = useRef(new Set());
  const needRef = useRef(null);
  const wantRef = useRef(null);
  const rm = useMemo(reducedMotion, []);

  useEffect(() => {
    if (finished) return;
    if (active.length < maxOnBelt && queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      setActive((a) => [...a, { ...next, startedAt: Date.now() }]);
    }
    if (active.length === 0 && queue.length === 0 && sortedCount >= total) {
      setFinished(true);
    }
  }, [active, queue, finished, sortedCount, total, maxOnBelt]);

  const handleMissed = (key) => {
    setActive((a) => {
      const item = a.find((x) => x.key === key);
      if (!item) return a;
      setQueue((q) => [...q, { ...item, key: `${item.id}-r-${Math.random()}` }]);
      setMissed((m) => m + 1);
      return a.filter((x) => x.key !== key);
    });
  };

  const sort = (key, bin) => {
    const item = active.find((x) => x.key === key);
    if (!item) return;
    if (bin === item.bin) {
      const firstTry = !wrongOnceRef.current.has(key);
      setActive((a) => a.filter((x) => x.key !== key));
      setSortedCount((n) => n + 1);
      setSelectedId(null);
      setMood("agree");
      setHint(item.say);
      const earned = firstTry ? 2 : 1;
      setCoinsEarned((n) => n + earned);
      if (firstTry) {
        setStreak((s) => {
          const ns = s + 1;
          if (ns > 0 && ns % 4 === 0) { setCoinsEarned((n) => n + 2); setStreakBubble(true); setMood("smile"); setTimeout(() => setStreakBubble(false), 1400); }
          return ns;
        });
      } else setStreak(0);
    } else {
      wrongOnceRef.current.add(key);
      setHintCount((h) => h + 1);
      setStreak(0);
      setMood("think");
      setHint(item.hint);
      setSelectedId(null);
    }
  };

  const tryDrop = (key, clientX, clientY) => {
    const nR = needRef.current?.getBoundingClientRect();
    const wR = wantRef.current?.getBoundingClientRect();
    const near = (r) => r && clientX > r.left - 40 && clientX < r.right + 40 && clientY > r.top - 40 && clientY < r.bottom + 40;
    if (near(nR)) sort(key, "need");
    else if (near(wR)) sort(key, "want");
  };

  const stars = hintCount <= 1 ? 3 : hintCount <= 3 ? 2 : 1;
  const camelPct = Math.min(100, (sortedCount / total) * 100);

  useEffect(() => { if (finished) onDone({ stars, hints: hintCount, coins: coinsEarned, firstTryCorrect: sortedCount - hintCount >= 0 ? sortedCount : sortedCount }); }, [finished]);

  if (finished) {
    return (
      <GameFrame title={T.place} score={<Coins n={coinsEarned} />} hint="" onExit={onExit}>
        <div className="pop" style={{ background: c.goodSoft, borderRadius: 18, padding: 22, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><Salim mood="smile" size={72} /></div>
          <Dates n={stars} />
          <p style={{ margin: "8px 0 0", fontFamily: font.display, fontWeight: 700, fontSize: 17, color: c.good }}>
            {pick(profile, "أَتْقَنْتَ هَذَا المُسْتَوَى.", "أَتْقَنْتِ هَذَا المُسْتَوَى.")}
          </p>
        </div>
      </GameFrame>
    );
  }

  return (
    <GameFrame
      title={T.place} goal={pick(profile, T.goalLevel, T.goalLevelF)} score={<Coins n={coinsEarned} />}
      hint={hint} hintMood={mood} onExit={onExit}
    >
      <style>{`@keyframes nwBelt { from { left: 102%; } to { left: -18%; } } @keyframes nwStreakGlow { 0%,100% { box-shadow: 0 0 0 rgba(255,216,115,0); } 50% { box-shadow: 0 0 22px rgba(255,216,115,.9); } } .nwBounce { animation: nwShake .35s ease-in-out; } @keyframes nwShake { 0%,100% { transform: translateX(0); } 30% { transform: translateX(-6px); } 60% { transform: translateX(6px); } }`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 8, borderRadius: 99, background: c.lineSoft, position: "relative", overflow: "visible" }}>
          <div style={{ height: "100%", width: `${camelPct}%`, borderRadius: 99, background: c.sageDeep, transition: `width .4s ${ease}` }} />
          <span style={{ position: "absolute", top: -16, insetInlineStart: `calc(${camelPct}% - 10px)`, fontSize: 20, transition: `inset-inline-start .4s ${ease}` }}>🐫</span>
        </div>
        <span style={{ fontSize: 12, color: c.inkFaint, fontFamily: font.body }}>{ar(sortedCount)}/{ar(total)}</span>
      </div>

      <div style={{
        position: "relative", height: maxOnBelt > 1 ? 200 : 108, borderRadius: 16, overflow: "hidden",
        background: "linear-gradient(180deg,#E3DAC6 0%,#D2C6A8 100%)",
        boxShadow: streakBubble ? "0 0 0 3px #FFD873 inset" : "none",
        animation: streakBubble ? "nwStreakGlow 1.2s ease-in-out" : "none",
      }}>
        {streakBubble && (
          <span style={{
            position: "absolute", top: 6, insetInlineStart: "50%", transform: "translateX(50%)", zIndex: 5,
            background: "#FFD873", color: "#5A4326", fontFamily: font.display, fontWeight: 700, fontSize: 13,
            borderRadius: 999, padding: "3px 10px", boxShadow: shadow.sm,
          }}>سِلْسِلَةٌ ×{ar(streak)}!</span>
        )}
        {active.map((it, idx) => (
          <div
            key={it.key}
            style={{
              position: "absolute", top: maxOnBelt > 1 ? 10 + (idx % 2) * 96 : 14,
              [rm ? "insetInlineStart" : "left"]: rm ? "38%" : undefined,
              animation: rm ? "none" : `nwBelt ${crossTime}ms linear forwards`,
            }}
            onAnimationEnd={() => handleMissed(it.key)}
          >
            <DragItem id={it.key} icon={it.icon} name={it.name} selected={selectedId === it.key}
              onSelect={setSelectedId} onDrag={tryDrop} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Basket kind="want" refEl={wantRef} active={!!selectedId} onClick={() => selectedId && sort(selectedId, "want")} />
        <Basket kind="need" refEl={needRef} active={!!selectedId} onClick={() => selectedId && sort(selectedId, "need")} />
      </div>
      {missed > 0 && <p style={{ margin: 0, fontSize: 11.5, color: c.inkFaint, textAlign: "center", fontFamily: font.body }}>{T.missedNote}</p>}
    </GameFrame>
  );
}

/* ============================================================
   ٥ — المستوى الثالث: بطاقات المواقف
   ============================================================ */
function pickSituations() {
  const byId = (id) => needsWantsSituations.find((s) => s.id === id);
  const pairA = [byId(1), byId(2)];
  const rest = shuffle(needsWantsSituations.filter((s) => s.id !== 1 && s.id !== 2));
  const chosen = rest.slice(0, 6);
  const pos = Math.floor(Math.random() * 7);
  const seq = [...chosen];
  seq.splice(pos, 0, pairA[0], pairA[1]);
  return seq;
}

function SituationLevel({ profile, onDone, onExit }) {
  const [seq] = useState(pickSituations);
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [mood, setMood] = useState("ask");
  const [hint, setHint] = useState(pick(profile, T.goalLevel3, T.goalLevel3F));
  const [discovery, setDiscovery] = useState(null);
  const [adCompare, setAdCompare] = useState(false);
  const [finished, setFinished] = useState(false);
  const needRef = useRef(null);
  const wantRef = useRef(null);
  const seenPairRef = useRef({});

  const cur = seq[i];
  const stars = hintCount <= 0 ? 3 : hintCount <= 2 ? 2 : 1;

  const advance = () => {
    if (i + 1 >= seq.length) { setFinished(true); onDone({ stars, hints: hintCount, coins: coinsEarned }); }
    else { setI((n) => n + 1); setHint(pick(profile, T.goalLevel3, T.goalLevel3F)); setMood("ask"); setSelected(false); }
  };

  const afterCorrect = () => {
    seenPairRef.current[cur.pair] = (seenPairRef.current[cur.pair] || 0) + 1;
    if (seenPairRef.current[cur.pair] === 2) {
      setDiscovery(cur);
      return;
    }
    if (cur.isAd) { setAdCompare(true); return; }
    advance();
  };

  const sort = (bin) => {
    setSelected(false);
    if (bin === cur.bin) {
      setCoinsEarned((n) => n + 2);
      setMood("agree");
      setHint(pick(profile, "اِخْتِيَارٌ مُوَفَّقٌ.", "اِخْتِيَارٌ مُوَفَّقٌ."));
      setTimeout(afterCorrect, 550);
    } else {
      setHintCount((h) => h + 1);
      setMood("think");
      setHint(pick(profile, "فَكِّرْ فِي المَوْقِفِ مَرَّةً أُخْرَى.", "فَكِّرِي فِي المَوْقِفِ مَرَّةً أُخْرَى."));
    }
  };

  if (finished) {
    return (
      <GameFrame title={T.place} score={<Coins n={coinsEarned} />} hint="" onExit={onExit}>
        <div className="pop" style={{ background: c.goodSoft, borderRadius: 18, padding: 22, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><Salim mood="smile" size={72} /></div>
          <Dates n={stars} />
        </div>
      </GameFrame>
    );
  }

  if (discovery) {
    const other = seq.find((s) => s.pair === discovery.pair && s.id !== discovery.id);
    return (
      <GameFrame title={T.place} hint={pick(profile, T.discovery, T.discoveryF)} hintMood="smile" onExit={onExit}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {[other, discovery].map((s) => (
            <div key={s.id} style={{ background: c.paper, borderRadius: 16, padding: 14, textAlign: "center", flex: 1, boxShadow: shadow.sm }}>
              <NWIcon icon={s.icon} size={56} />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: c.inkFaint, fontFamily: font.body }}>
                {s.bin === "need" ? T.needBasket : T.wantBasket}
              </p>
            </div>
          ))}
        </div>
        <Btn wide onClick={() => { setDiscovery(null); if (discovery.isAd) setAdCompare(true); else advance(); }}>أُتَابِعُ</Btn>
      </GameFrame>
    );
  }

  if (adCompare) {
    return (
      <GameFrame title={T.place} hint={pick(profile, T.adLine, T.adLineF)} hintMood="think" onExit={onExit}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <div style={{ background: "#FDF3DC", borderRadius: 16, padding: 14, textAlign: "center", flex: 1, boxShadow: shadow.sm }}>
            <div style={{ filter: "drop-shadow(0 0 10px #FFD873)" }}><NWIcon icon="toyPlane" size={64} /></div>
            <p style={{ margin: "6px 0 0", fontFamily: font.display, fontWeight: 700, fontSize: 12.5, color: "#B5862F" }}>{T.adAd}</p>
          </div>
          <div style={{ background: c.paper, borderRadius: 16, padding: 14, textAlign: "center", flex: 1, boxShadow: shadow.sm }}>
            <div style={{ opacity: .8, transform: "scale(.8)" }}><NWIcon icon="toyPlane" size={64} /></div>
            <p style={{ margin: "6px 0 0", fontFamily: font.display, fontWeight: 700, fontSize: 12.5, color: c.inkFaint }}>{T.adReal}</p>
          </div>
        </div>
        <Btn wide onClick={() => { setAdCompare(false); advance(); }}>أُتَابِعُ</Btn>
      </GameFrame>
    );
  }

  const tryDrop = (key, clientX, clientY) => {
    const nR = needRef.current?.getBoundingClientRect();
    const wR = wantRef.current?.getBoundingClientRect();
    const near = (r) => r && clientX > r.left - 40 && clientX < r.right + 40 && clientY > r.top - 40 && clientY < r.bottom + 40;
    if (near(nR)) sort("need");
    else if (near(wR)) sort("want");
  };

  return (
    <GameFrame title={T.place} goal={pick(profile, T.goalLevel3, T.goalLevel3F)} score={`${ar(i + 1)}/${ar(seq.length)}`} hint={hint} hintMood={mood} onExit={onExit}>
      <div style={{ background: "linear-gradient(180deg,#F1ECDF 0%,#E3DAC6 100%)", borderRadius: 18, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <p style={{ margin: 0, fontFamily: font.body, fontSize: 14.5, color: c.ink, lineHeight: 1.9, textAlign: "center" }}>{cur.text}</p>
        <DragItem id="cur" icon={cur.icon} name={cur.name} selected={selected} onSelect={() => setSelected(true)} onDrag={tryDrop} />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Basket kind="want" refEl={wantRef} active={selected} onClick={() => selected && sort("want")} />
        <Basket kind="need" refEl={needRef} active={selected} onClick={() => selected && sort("need")} />
      </div>
    </GameFrame>
  );
}

/* ============================================================
   ٦ — المستوى الرابع: قائمة البيت (الصفّان ٣–٤)
   ============================================================ */
function BudgetLevel({ profile, onDone, onExit }) {
  const { purse, list, extra } = needsWantsBudget;
  const [cart, setCart] = useState([]);
  const [warn, setWarn] = useState(null);
  const [done, setDone] = useState(false);
  const [leftoverChoice, setLeftoverChoice] = useState(null);
  const [souvenirBought, setSouvenirBought] = useState(null);

  const all = [...list, ...extra];
  const spent = cart.reduce((s, id) => s + all.find((x) => x.id === id).price, 0);
  const left = purse - spent;
  const listDone = list.every((it) => cart.includes(it.id));

  const toggle = (id) => {
    setWarn(null);
    setCart((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const finish = () => {
    if (listDone) { setDone(true); return; }
    const missing = list.filter((it) => !cart.includes(it.id));
    const need = missing.reduce((s, it) => s + it.price, 0);
    if (left < need) {
      const cheapest = missing[0];
      setWarn(pick(profile,
        `بَقِيَ فِي الصُّرَّةِ ${ar(left)}، وَ${cheapest.name} بِـ${ar(cheapest.price)}… مَاذَا نَفْعَلُ؟`,
        `بَقِيَ فِي الصُّرَّةِ ${ar(left)}، وَ${cheapest.name} بِـ${ar(cheapest.price)}… مَاذَا نَفْعَلُ؟`));
    } else {
      setWarn(pick(profile, "لَمْ تَشْتَرِ كُلَّ حَاجَاتِ القَائِمَةِ بَعْدُ.", "لَمْ تَشْتَرِي كُلَّ حَاجَاتِ القَائِمَةِ بَعْدُ."));
    }
  };

  if (leftoverChoice) {
    return (
      <GameFrame title={T.place} hint="" onExit={onExit}>
        <WinCard
          text={pick(profile, "أَحْسَنْتَ! أَتْمَمْتَ التَّسَوُّقَ.", "أَحْسَنْتِ! أَتْمَمْتِ التَّسَوُّقَ.")}
          onDone={() => onDone({ done: true, savedLeftover: leftoverChoice === "save", coins: 10 })}
        />
      </GameFrame>
    );
  }

  if (done) {
    const leftover = purse - spent;
    return (
      <GameFrame title={T.place} hint={pick(profile, T.leftoverAsk, T.leftoverAskF)} hintMood="ask" onExit={onExit}>
        <p style={{ textAlign: "center", fontFamily: font.display, fontSize: 15, color: c.ink }}>
          {pick(profile, "بَقِيَ مَعَكَ", "بَقِيَ مَعَكِ")} <Coins n={leftover} />
        </p>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))" }}>
          {extra.map((it) => {
            const afford = it.price <= leftover;
            return (
              <button key={it.id} type="button" disabled={!afford || souvenirBought}
                onClick={() => setSouvenirBought(it.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 6px",
                  borderRadius: 14, border: `1px solid ${c.line}`, background: afford ? c.paper : c.sage,
                  opacity: afford ? 1 : .5, cursor: afford ? "pointer" : "not-allowed", minHeight: 44,
                }}
              >
                <NWIcon icon={it.icon} size={40} />
                <span style={{ fontSize: 11, fontFamily: font.body, color: c.ink }}>{it.name}</span>
                <span style={{ fontSize: 11, color: "#B5862F", fontFamily: font.display, fontWeight: 700 }}>{ar(it.price)}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => setLeftoverChoice("spend")} tone="warm">{pick(profile, "أَشْتَرِي", "أَشْتَرِي")}</Btn>
          <Btn onClick={() => setLeftoverChoice("save")}>{pick(profile, "أَدَّخِرُ فِي المَنْدُوسِ", "أَدَّخِرُ فِي المَنْدُوسِ")}</Btn>
        </div>
      </GameFrame>
    );
  }

  return (
    <GameFrame title={T.place} goal={pick(profile, T.budgetGoal, T.budgetGoalF)} score={<Coins n={left} />} hint={warn} hintMood="warn" onExit={onExit}>
      <div style={{ background: "linear-gradient(180deg,#F1ECDF 0%,#E3DAC6 100%)", borderRadius: 18, padding: 14 }}>
        <p style={{ margin: "0 0 8px", fontFamily: font.display, fontWeight: 700, fontSize: 13, color: c.ink }}>قَائِمَةُ البَيْتِ</p>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))" }}>
          {list.map((it) => {
            const inCart = cart.includes(it.id);
            return (
              <button key={it.id} type="button" onClick={() => toggle(it.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "9px 4px",
                  borderRadius: 12, border: `2px solid ${inCart ? c.sageDeep : c.line}`,
                  background: inCart ? c.sage : c.paper, cursor: "pointer", minHeight: 44,
                }}
              >
                <NWIcon icon={it.icon} size={36} />
                <span style={{ fontSize: 10.5, fontFamily: font.body, color: c.ink }}>{it.name}</span>
                <span style={{ fontSize: 10.5, color: "#B5862F", fontFamily: font.display, fontWeight: 700 }}>{ar(it.price)}</span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: "12px 0 8px", fontFamily: font.display, fontWeight: 700, fontSize: 13, color: c.ink }}>عَلَى الرَّفِّ أَيْضًا</p>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))" }}>
          {extra.map((it) => {
            const inCart = cart.includes(it.id);
            const wantsFlash = warn && !inCart;
            return (
              <button key={it.id} type="button" onClick={() => toggle(it.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "9px 4px",
                  borderRadius: 12, border: `2px solid ${inCart ? c.accent : c.line}`,
                  background: inCart ? c.warnSoft : c.paper, cursor: "pointer", minHeight: 44,
                  boxShadow: inCart && wantsFlash ? "0 0 0 3px #E9A184" : "none",
                }}
              >
                <NWIcon icon={it.icon} size={36} />
                <span style={{ fontSize: 10.5, fontFamily: font.body, color: c.ink }}>{it.name}</span>
                <span style={{ fontSize: 10.5, color: "#B5862F", fontFamily: font.display, fontWeight: 700 }}>{ar(it.price)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <Btn wide onClick={finish}>{T.budgetDone}</Btn>
    </GameFrame>
  );
}

/* ============================================================
   ٧ — قرار البيسات بعد كل مستوى
   ============================================================ */
export function CoinDecision({ profile, earned, onChoose, onExit }) {
  return (
    <GameFrame title={T.place} goal={T.coinDecisionTitle} score={<Coins n={earned} />} hint={pick(profile, T.coinDecisionGoal, T.coinDecisionGoalF)} hintMood="smile" onExit={onExit}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Btn wide onClick={() => onChoose("mandoos")}>{T.toMandoos}</Btn>
        <Btn wide onClick={() => onChoose("shop")} tone="warm">{T.toShop}</Btn>
        <Btn wide onClick={() => onChoose("later")} tone="cool">{T.decideLater}</Btn>
      </div>
    </GameFrame>
  );
}

/* ============================================================
   ٨ — دُكّان الزينة
   ============================================================ */
export function Shop({ profile, wallet, owned, onBuy, onExit }) {
  return (
    <GameFrame title={T.place} goal={pick(profile, T.shopTitle, T.shopTitleF)} score={<Coins n={wallet} />} hint={pick(profile, T.shopGoal, T.shopGoalF)} hintMood="ask" onExit={onExit}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>
        {needsWantsDecor.map((it) => {
          const has = owned.includes(it.id);
          const afford = wallet >= it.price;
          return (
            <button
              key={it.id} type="button" disabled={has || !afford} onClick={() => onBuy(it)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px",
                borderRadius: 14, border: `1px solid ${c.line}`, background: has ? c.goodSoft : c.paper,
                opacity: !has && !afford ? .5 : 1, cursor: has || !afford ? "default" : "pointer", minHeight: 44,
              }}
            >
              <NWIcon icon={it.icon} size={44} />
              <span style={{ fontSize: 11.5, fontFamily: font.body, color: c.ink, textAlign: "center" }}>{it.name}</span>
              {has
                ? <Glyph name="check" size={14} color={c.good} strokeWidth={2.6} />
                : <span style={{ fontSize: 12, color: "#B5862F", fontFamily: font.display, fontWeight: 700 }}>{ar(it.price)}</span>}
            </button>
          );
        })}
      </div>
    </GameFrame>
  );
}

/* ============================================================
   ٩ — فتح المندوس
   ============================================================ */
export function MandoosOpen({ profile, amount, onDone }) {
  return (
    <GameFrame title={T.place} hint="" onExit={onDone}>
      <div className="pop" style={{ background: "linear-gradient(180deg,#FFF3D0 0%,#F6E1A0 100%)", borderRadius: 18, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 46 }}>🏺✨</div>
        <p style={{ margin: "8px 0 0", fontFamily: font.display, fontWeight: 700, fontSize: 18, color: "#8A6A3E" }}>
          {pick(profile, T.mandoosOpen, T.mandoosOpenF)}
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 13.5, color: c.inkSoft, fontFamily: font.body }}>{T.mandoosOpenLine}</p>
        <div style={{ marginTop: 10 }}><Coins n={amount} /></div>
        <div style={{ marginTop: 14 }}><Btn onClick={onDone}>مُتَابَعَةٌ</Btn></div>
      </div>
    </GameFrame>
  );
}

/* ============================================================
   ١٠ — مهمّة البيت
   ============================================================ */
function HomeMission({ profile, onDone, onExit }) {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const rafRef = useRef(null);

  const start = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / 3000);
      setProgress(p);
      if (p >= 1) { onDone(); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  const cancel = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); setProgress(0); };
  useEffect(() => () => cancel(), []);

  return (
    <GameFrame title={T.homeMissionTitle} hint={pick(profile, T.homeMissionBody, T.homeMissionBodyF)} hintMood="ask" onExit={onExit}>
      <div style={{ background: c.sage, borderRadius: 18, padding: 20, textAlign: "center" }}>
        <p style={{ margin: 0, fontFamily: font.body, fontSize: 14, lineHeight: 1.9, color: c.ink }}>
          {pick(profile, T.homeMissionBody, T.homeMissionBodyF)}
        </p>
      </div>
      <button
        type="button"
        onPointerDown={start} onPointerUp={cancel} onPointerLeave={cancel} onPointerCancel={cancel}
        style={{
          position: "relative", overflow: "hidden", border: "none", borderRadius: 16, padding: "16px 14px",
          background: c.accent, color: "#FFF", fontFamily: font.display, fontWeight: 700, fontSize: 15,
          cursor: "pointer", minHeight: 54, touchAction: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none", userSelect: "none",
        }}
      >
        <span style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.35)", width: `${progress * 100}%`, transition: "width .05s linear" }} />
        <span style={{ position: "relative" }}>{pick(profile, T.homeMissionConfirm, T.homeMissionConfirmF)}</span>
      </button>
    </GameFrame>
  );
}

/* ============================================================
   ١١ — الشاشة الرئيسة للمحطّة
   ============================================================ */
const LEVEL_META = [
  { id: "l1", name: "المُسْتَوَى الأَوَّلُ" },
  { id: "l2", name: "المُسْتَوَى الثَّانِي" },
  { id: "l3", name: "المُسْتَوَى الثَّالِثُ" },
  { id: "l4", name: "المُسْتَوَى الرَّابِعُ" },
];

function LevelTile({ meta, levelData, locked, onClick }) {
  return (
    <button
      type="button" onClick={onClick} disabled={locked}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        background: locked ? c.sage : c.paper, border: `1px solid ${c.line}`, borderRadius: 16, padding: "14px 8px",
        cursor: locked ? "default" : "pointer", minHeight: 44, boxShadow: shadow.sm, opacity: locked ? .55 : 1,
      }}
    >
      <span style={{ fontFamily: font.display, fontSize: 14, fontWeight: 700, color: c.ink }}>{meta.name}</span>
      {levelData ? <Dates n={levelData.stars || 0} /> : <span style={{ fontSize: 20 }}>{locked ? "🔒" : "▶️"}</span>}
    </button>
  );
}

function TeacherPanel({ nw, onClose }) {
  const spent = (nw.spendSaveLog || []).reduce((s, x) => s + (x.spent || 0), 0);
  const saved = (nw.spendSaveLog || []).reduce((s, x) => s + (x.saved || 0), 0);
  const ratio = spent + saved > 0 ? Math.round((saved / (spent + saved)) * 100) : 0;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,28,18,.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: c.surface, borderRadius: 18, padding: 20, maxWidth: 360, width: "100%", boxShadow: shadow.lg }}>
        <h3 style={{ margin: "0 0 10px", fontFamily: font.display, fontSize: 17, color: c.ink }}>{T.teacherPanel}</h3>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6, fontFamily: font.body, fontSize: 13, color: c.inkSoft }}>
          <li>الاختبار القبلي: {nw.preQuiz ? `${ar(nw.preQuiz.score)}/${ar(nw.preQuiz.total)}` : "—"}</li>
          <li>الاختبار البعدي: {nw.postQuiz ? `${ar(nw.postQuiz.score)}/${ar(nw.postQuiz.total)}` : "—"}</li>
          <li>نسبة الادّخار: {ar(ratio)}٪</li>
          <li>مهمة البيت: {nw.homeMission?.done ? "تمّت" : "لم تتمّ بعد"}</li>
        </ul>
        <div style={{ marginTop: 14 }}><Btn onClick={onClose}>إِغْلَاقٌ</Btn></div>
      </div>
    </div>
  );
}

/* ============================================================
   المكوّن الرئيس
   ============================================================ */
const emptyNW = () => ({
  grade: null, preQuiz: null, postQuiz: null, tutorialDone: false,
  levels: {}, wallet: 0, mandoos: { amount: 0, levelsUntilOpen: 0 },
  decor: [], souvenirs: [], homeMission: null, spendSaveLog: [], achieved: false,
});

export function NeedsWantsGame({ profile, onExit, onWin, onUpdateProfile }) {
  const nw = profile.needsWants || emptyNW();
  const [screen, setScreen] = useState(() => {
    if (!nw.grade) return "gradeAsk";
    if (!nw.preQuiz) return "prequiz";
    if (!nw.tutorialDone) return "tutorial";
    return "menu";
  });
  const [pendingEarn, setPendingEarn] = useState(0);
  const [showTeacher, setShowTeacher] = useState(false);
  const pressRef = useRef(null);

  const patch = (p) => { const next = { ...nw, ...p }; onUpdateProfile && onUpdateProfile({ needsWants: next }); };

  const goMenu = () => setScreen("menu");

  const onGradePicked = (g) => { patch({ grade: g }); setScreen("prequiz"); };

  const onPreQuizDone = (score, total) => { patch({ preQuiz: { score, total, date: new Date().toISOString().slice(0, 10) } }); setScreen("tutorial"); };
  const onPostQuizDone = (score, total) => { patch({ postQuiz: { score, total, date: new Date().toISOString().slice(0, 10) } }); setScreen("homemission"); };

  const onTutorialDone = () => { patch({ tutorialDone: true, levels: { ...nw.levels, tutorial: { done: true } } }); setScreen("menu"); };

  const depositMandoos = (amount) => {
    const m = nw.mandoos || { amount: 0, levelsUntilOpen: 0 };
    const nextAmount = m.amount + amount;
    const nextLevels = m.amount === 0 && m.levelsUntilOpen === 0 ? 2 : m.levelsUntilOpen;
    patch({ mandoos: { amount: nextAmount, levelsUntilOpen: nextLevels }, spendSaveLog: [...(nw.spendSaveLog || []), { after: screen, saved: amount, spent: 0 }] });
  };

  const tickMandoos = () => {
    const m = nw.mandoos;
    if (!m || m.levelsUntilOpen <= 0) return { opened: false };
    const nu = m.levelsUntilOpen - 1;
    if (nu <= 0 && m.amount > 0) {
      const bonus = Math.floor(m.amount * 1.5);
      patch({ mandoos: { amount: 0, levelsUntilOpen: 0 }, wallet: nw.wallet + bonus });
      return { opened: true, bonus };
    }
    patch({ mandoos: { ...m, levelsUntilOpen: nu } });
    return { opened: false };
  };

  const grade34 = nw.grade >= 3;
  const finalLevelDone = grade34 ? !!nw.levels.l4 : !!nw.levels.l3;

  const onLevelDone = (id, data) => {
    const nextLevels = { ...nw.levels, [id]: { ...data, plays: (nw.levels[id]?.plays || 0) + 1 } };
    patch({ levels: nextLevels, spendSaveLog: [...(nw.spendSaveLog || []), { after: id, spent: 0, saved: 0 }] });
    const mandoosResult = tickMandoos();
    if (id === "l4") {
      const w = nw.wallet + (data.coins || 10);
      patch({ levels: nextLevels, wallet: w });
      setScreen(mandoosResult.opened ? "mandoosOpened" : (nextLevels.l4 && !nw.postQuiz ? "postquiz" : "menu"));
      return;
    }
    setPendingEarn(data.coins || 0);
    setScreen(mandoosResult.opened ? "mandoosOpened" : "coindecision");
  };

  const onCoinChoice = (choice) => {
    if (choice === "mandoos") { depositMandoos(pendingEarn); setScreen("menu"); }
    else if (choice === "shop") { patch({ wallet: nw.wallet + pendingEarn }); setScreen("shop"); }
    else { patch({ wallet: nw.wallet + pendingEarn }); setScreen("menu"); }
    const done34 = grade34 ? nw.levels.l3 : true;
    if (!grade34 && nw.levels.l1 && nw.levels.l2 && nw.levels.l3 && !nw.postQuiz) setScreen("postquiz");
  };

  const onBuyDecor = (item) => {
    if (nw.wallet < item.price || nw.decor.includes(item.id)) return;
    patch({ wallet: nw.wallet - item.price, decor: [...nw.decor, item.id] });
  };

  const onHomeMissionDone = () => {
    patch({ homeMission: { done: true, date: new Date().toISOString().slice(0, 10) }, wallet: nw.wallet + 10 });
    setScreen("final");
  };

  const teacherPress = () => { pressRef.current = setTimeout(() => setShowTeacher(true), 2200); };
  const teacherRelease = () => clearTimeout(pressRef.current);

  if (screen === "gradeAsk") return <GradeAsk profile={profile} onPick={onGradePicked} onExit={onExit} />;
  if (screen === "prequiz") return <QuizFlow profile={profile} grade={nw.grade || 1} onFinish={onPreQuizDone} onExit={onExit} />;
  if (screen === "postquiz") return <QuizFlow profile={profile} grade={nw.grade || 1} onFinish={onPostQuizDone} onExit={goMenu} />;
  if (screen === "tutorial") return <Tutorial profile={profile} onDone={onTutorialDone} onExit={onExit} />;
  if (screen === "homemission") return <HomeMission profile={profile} onDone={onHomeMissionDone} onExit={goMenu} />;
  if (screen === "mandoosOpened") {
    return <MandoosOpen profile={profile} amount={nw.wallet} onDone={() => setScreen(finalLevelDone && !nw.postQuiz ? "postquiz" : "menu")} />;
  }
  if (screen === "coindecision") return <CoinDecision profile={profile} earned={pendingEarn} onChoose={onCoinChoice} onExit={goMenu} />;
  if (screen === "shop") return <Shop profile={profile} wallet={nw.wallet} owned={nw.decor} onBuy={onBuyDecor} onExit={goMenu} />;

  if (screen === "l1") {
    const cfg = grade34 ? { crossTime: 8000, maxOnBelt: 2 } : { crossTime: 10000, maxOnBelt: 1 };
    return <ConveyorLevel profile={profile} grade={nw.grade} levelIndex={1} items={needsWantsItems1} crossTime={cfg.crossTime} maxOnBelt={cfg.maxOnBelt} onDone={(d) => onLevelDone("l1", d)} onExit={goMenu} />;
  }
  if (screen === "l2") {
    const cfg = grade34 ? { crossTime: 6000, maxOnBelt: 2 } : { crossTime: 8000, maxOnBelt: 1 };
    return <ConveyorLevel profile={profile} grade={nw.grade} levelIndex={2} items={needsWantsItems2} crossTime={cfg.crossTime} maxOnBelt={cfg.maxOnBelt} onDone={(d) => onLevelDone("l2", d)} onExit={goMenu} />;
  }
  if (screen === "l3") return <SituationLevel profile={profile} onDone={(d) => onLevelDone("l3", d)} onExit={goMenu} />;
  if (screen === "l4") return <BudgetLevel profile={profile} onDone={(d) => onLevelDone("l4", d)} onExit={goMenu} />;

  if (screen === "final") {
    return (
      <GameFrame title={T.finalTitle} hint="" onExit={goMenu}>
        <WinCard text={T.finalLine} onDone={onWin} />
      </GameFrame>
    );
  }

  const allDoneForGrade = grade34 ? (nw.levels.l1 && nw.levels.l2 && nw.levels.l3 && nw.levels.l4) : (nw.levels.l1 && nw.levels.l2 && nw.levels.l3);
  const readyForFinal = allDoneForGrade && nw.postQuiz && !nw.homeMission;

  return (
    <GameFrame
      title={T.place}
      goal={pick(profile, "اخْتَرْ مُسْتَوًى لِتَلْعَبَهُ", "اخْتَارِي مُسْتَوًى لِتَلْعَبِيهِ")}
      score={<Coins n={nw.wallet} />}
      hint={readyForFinal ? pick(profile, "أَحْسَنْتَ! بَقِيَتْ مُهِمَّةُ البَيْتِ.", "أَحْسَنْتِ! بَقِيَتْ مُهِمَّةُ البَيْتِ.") : ""}
      hintMood="smile"
      onExit={onExit}
    >
      <ImgFallback
        src="assets/img/scenes/nw-shop-scene.webp" alt="مشهد دكان الجدّ سالم في سوق نزوى"
        style={{ width: "100%", height: 130, borderRadius: 18, border: `3px solid ${c.ink}`, objectFit: "cover" }}
        fallback={null}
      />
      <div
        onPointerDown={teacherPress} onPointerUp={teacherRelease} onPointerLeave={teacherRelease} onPointerCancel={teacherRelease}
        style={{ textAlign: "center", fontSize: 16, color: c.lineSoft, userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none", touchAction: "none", letterSpacing: 3 }}
      >
        •••
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2, 1fr)" }}>
        <LevelTile meta={{ name: "التَّمْهِيدُ" }} levelData={nw.levels.tutorial ? { stars: 3 } : null} locked={false} onClick={() => setScreen("tutorial")} />
        <LevelTile meta={LEVEL_META[0]} levelData={nw.levels.l1} locked={false} onClick={() => setScreen("l1")} />
        <LevelTile meta={LEVEL_META[1]} levelData={nw.levels.l2} locked={false} onClick={() => setScreen("l2")} />
        <LevelTile meta={LEVEL_META[2]} levelData={nw.levels.l3} locked={false} onClick={() => setScreen("l3")} />
        {grade34 && <LevelTile meta={LEVEL_META[3]} levelData={nw.levels.l4} locked={!nw.levels.l3} onClick={() => setScreen("l4")} />}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={() => setScreen("shop")}>{pick(profile, T.shopTitle, T.shopTitleF)}</Btn>
        {nw.mandoos?.amount > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: c.sage, borderRadius: 12, padding: "8px 12px", fontFamily: font.body, fontSize: 12.5, color: c.ink }}>
            🏺 <Coins n={nw.mandoos.amount} /> · {ar(nw.mandoos.levelsUntilOpen)} {pick(profile, "مُسْتَوَيَاتٍ لِلْفَتْحِ", "مُسْتَوَيَاتٍ لِلْفَتْحِ")}
          </div>
        )}
      </div>

      {nw.decor.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {nw.decor.map((id) => {
            const it = needsWantsDecor.find((d) => d.id === id);
            return it ? <NWIcon key={id} icon={it.icon} size={30} /> : null;
          })}
        </div>
      )}

      {readyForFinal && <Btn wide onClick={() => setScreen("homemission")} tone="warm">{pick(profile, "مُهِمَّةُ البَيْتِ", "مُهِمَّةُ البَيْتِ")}</Btn>}
      {nw.homeMission?.done && <Btn wide onClick={() => setScreen("final")}>{pick(profile, "أَرَى وَسَامِي", "أَرَى وَسَامِي")}</Btn>}

      {showTeacher && <TeacherPanel nw={nw} onClose={() => setShowTeacher(false)} />}
    </GameFrame>
  );
}
