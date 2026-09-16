/* ============================================================
   الألعاب البيئية

   إطار واحد يجمع الألعاب الثلاث: الهدف أعلى الشاشة، والنتيجة
   بجانبه، وتلميح الجدّ سالم تحتهما، والخروج في مكانه دائمًا.

   فرز المخلّفات والتسوّق مبنيّان بمنظور ثلاثي الأبعاد عبر CSS
   transforms. البيت الذكي رسمٌ مسطّح بـ SVG، وأجهزته تستجيب
   بصريًّا لحالة تشغيلها. بلا أي مكتبة خارجية، لتعمل على أجهزة المدارس.
   ============================================================ */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { c, shadow, font, ease } from "./theme.js";
import { Salim, SalimSays, Glyph, IconChip } from "./art.jsx";
import {
  wasteBins, wasteItems, wasteTexts,
  homeRooms, homeTexts,
  marketSets, marketTexts, labels,
} from "./content.js";

const isF = (p) => !!p && p.gender === "f";
const pick = (p, m, f) => (isF(p) ? (f || m) : m);
const ar = (n) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

/* ============================================================
   الإطار الموحّد
   ============================================================ */
export function GameFrame({ title, goal, score, hint, hintMood = "ask", onExit, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontFamily: font.display, fontSize: 23, fontWeight: 700, color: c.ink }}>{title}</h2>
        <button
          type="button" onClick={onExit}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7, background: c.sage, border: "none",
            borderRadius: 11, padding: "9px 14px", cursor: "pointer", color: c.ink,
            fontFamily: font.body, fontSize: 13.5, fontWeight: 700, minHeight: 44, boxShadow: shadow.sm,
          }}
        >
          <span aria-hidden="true">›</span>{labels.backToGames}
        </button>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        background: c.sage, borderRadius: 14, padding: "10px 14px",
      }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: c.ink, fontFamily: font.body, minWidth: 0 }}>{goal}</p>
        {score != null && (
          <span style={{
            flex: "none", background: c.surface, borderRadius: 11, padding: "5px 11px",
            fontFamily: font.display, fontWeight: 700, fontSize: 17, color: c.sageInk,
            fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
          }}>{score}</span>
        )}
      </div>

      {hint && <SalimSays mood={hintMood} text={hint} size={52} />}
      {children}
    </div>
  );
}

export function Btn({ children, onClick, tone = "brand", wide }) {
  const bg = tone === "brand" ? c.sageDeep : tone === "warm" ? c.accent : tone === "cool" ? c.dustyInk : c.warn;
  return (
    <button
      type="button" onClick={onClick}
      style={{
        border: "none", borderRadius: 13, padding: "12px 20px", cursor: "pointer",
        background: bg, color: c.onDark, fontFamily: font.display, fontWeight: 700,
        fontSize: 17.5, minHeight: 46, boxShadow: shadow.sm, width: wide ? "100%" : "auto",
      }}
    >
      {children}
    </button>
  );
}

export const Meter = ({ value, max, color, label, unit }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: c.inkFaint, marginBottom: 4, fontFamily: font.body }}>
        <span>{label}</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{ar(value)} {unit}</span>
      </div>
      <div style={{ height: 9, borderRadius: 99, background: c.lineSoft, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: `width .4s ${ease}, background .4s ${ease}` }} />
      </div>
    </div>
  );
};

export function WinCard({ text, onDone, mood = "smile" }) {
  return (
    <div className="pop" style={{ background: c.goodSoft, borderRadius: 18, padding: 22, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center" }}><Salim mood={mood} size={80} /></div>
      <p style={{ margin: "6px 0 14px", fontFamily: font.display, fontSize: 18, fontWeight: 700, color: c.good, lineHeight: 1.6 }}>{text}</p>
      <Btn onClick={onDone}>{labels.backToGames}</Btn>
    </div>
  );
}

/* ============================================================
   أدوات المنظور الثلاثي
   ============================================================ */
const YAW = -15;   // دوران المشهد حول المحور الرأسي
const PITCH = 6;   // ميل بسيط للأعلى

/* صندوق له وجه وسطح وجانب — لبنة كل الأجسام */
function Box3D({ w, h, dep = 14, face, top, side, radius = 4, children, glow }) {
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div style={{
        position: "absolute", top: -dep * 0.62, left: dep * 0.5, width: w, height: dep,
        background: top, transform: "skewX(-44deg)", borderRadius: radius / 2,
      }} />
      <div style={{
        position: "absolute", top: -dep * 0.2, right: -dep * 0.55, width: dep, height: h,
        background: side, transform: "skewY(-44deg)", borderRadius: radius / 2,
      }} />
      <div style={{
        position: "absolute", inset: 0, background: face, borderRadius: radius,
        boxShadow: glow ? `0 0 22px ${glow}` : "0 6px 12px rgba(6,12,20,.35)",
        overflow: "hidden", transition: `box-shadow .4s ${ease}`,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   ١ — فرز المخلّفات (حاويات مجسّمة وأغطية تُفتح)
   ============================================================ */
const shuffle = (a) => {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
};

function WasteShape({ shape, size = 84 }) {
  const s = { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.2 };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ filter: "drop-shadow(0 6px 8px rgba(34,48,31,.22))" }}>
      {shape === "bottle" && (
        <g stroke="#2F6F86" {...s}>
          <path d="M20 8h8v6c3 1.4 5 4 5 7.6V38a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V21.6c0-3.6 2-6.2 5-7.6V8Z" fill="#CBE6EF" />
          <path d="M15 27h18" /><path d="M19 8h10" />
        </g>
      )}
      {shape === "peel" && (
        <g stroke="#7A6428" {...s}>
          <path d="M9 13c2 17 11 25 27 25-11 4-25 0-29-11-1.6-4.4-1-10.6 2-14Z" fill="#EEE2A2" />
          <path d="M9 13c4-3 8-3 11-1M14 22c3 8 9 13 17 15" />
        </g>
      )}
      {shape === "book" && (
        <g stroke="#33637F" {...s}>
          <path d="M9 10h13a4 4 0 0 1 4 4v25a4 4 0 0 0-4-4H9Z" fill="#D2E2ED" />
          <path d="M39 10H26a4 4 0 0 0-4 4v25a4 4 0 0 1 4-4h13Z" fill="#E9F2F8" />
          <path d="M22 14v25" />
        </g>
      )}
      {shape === "can" && (
        <g stroke="#367366" {...s}>
          <rect x="16" y="11" width="16" height="28" rx="3" fill="#CDE4DE" />
          <ellipse cx="24" cy="11" rx="8" ry="3" fill="#E6F2EF" />
          <path d="M16 19h16M16 31h16" />
        </g>
      )}
      {shape === "bag" && (
        <g stroke="#9C5335" {...s}>
          <path d="M13 16h22l-3 25H16Z" fill="#F2DDD0" />
          <path d="M19 16v-3a5 5 0 0 1 10 0v3M20 24h8" />
        </g>
      )}
      {shape === "box" && (
        <g stroke="#7E6136" {...s}>
          <path d="M8 18l16-8 16 8-16 8Z" fill="#EAD9B6" />
          <path d="M8 18v14l16 8V26Z" fill="#DBC69B" />
          <path d="M40 18v14l-16 8V26Z" fill="#CDB68B" />
        </g>
      )}
      {shape === "jar" && (
        <g stroke="#367366" {...s}>
          <path d="M16 18h16v18a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4Z" fill="#D0E8E1" />
          <rect x="15" y="10" width="18" height="7" rx="3" fill="#ADD3C8" />
          <path d="M16 26h16" />
        </g>
      )}
    </svg>
  );
}

function Bin3D({ bin, state, onPick }) {
  // state: idle | wrong | right
  const open = state === "right" || state === "wrong";
  return (
    <button
      type="button"
      onClick={onPick}
      style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        perspective: 420, minHeight: 44,
        transform: state === "wrong" ? "translateX(-5px)" : "none",
        transition: `transform .16s ${ease}`,
      }}
    >
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${PITCH + 4}deg) rotateY(${YAW * 0.5}deg)`, paddingTop: 14 }}>
        <div style={{ position: "relative", width: 78, height: 74, transformStyle: "preserve-3d", margin: "0 auto" }}>
          {/* الغطاء */}
          <div style={{
            position: "absolute", top: -12, left: 0, width: 78, height: 13,
            transformOrigin: "left bottom",
            transform: `rotateX(${open ? -58 : 0}deg)`,
            transition: `transform .35s ${ease}`,
            background: `linear-gradient(180deg, ${bin.color} 0%, ${bin.color}cc 100%)`,
            borderRadius: 4, boxShadow: "0 3px 6px rgba(6,12,20,.25)",
          }} />
          {/* السطح الداخلي */}
          <div style={{
            position: "absolute", top: -3, left: 5, width: 68, height: 12,
            background: "rgba(10,18,26,.55)", transform: "skewX(-44deg)", borderRadius: 2,
          }} />
          {/* الجانب */}
          <div style={{
            position: "absolute", top: 2, right: -9, width: 11, height: 70,
            background: `${bin.color}`, filter: "brightness(.72)", transform: "skewY(-44deg)", borderRadius: 2,
          }} />
          {/* الوجه */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "5px 5px 8px 8px",
            background: `linear-gradient(170deg, ${bin.color}ee 0%, ${bin.color}aa 100%)`,
            boxShadow: "0 8px 14px rgba(6,12,20,.26)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"
              style={{ fill: "none", stroke: "rgba(255,255,255,.92)", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }}>
              <circle cx="12" cy="12" r="7.5" />
              <path d="M9.4 9.6 12 7l2.6 2.6M9.4 14.4 12 17l2.6-2.6" />
            </svg>
          </div>
          {/* الظل */}
          <div style={{
            position: "absolute", bottom: -12, left: 6, width: 70, height: 10, borderRadius: "50%",
            background: "rgba(10,18,26,.22)", filter: "blur(4px)",
          }} />
        </div>
      </div>
      <span style={{
        display: "block", marginTop: 16, fontFamily: font.display, fontSize: 15.5,
        fontWeight: 700, color: bin.color, lineHeight: 1.4,
      }}>{bin.name}</span>
    </button>
  );
}

function SortingGame({ profile, onExit, onWin }) {
  const [queue] = useState(() => shuffle(wasteItems));
  const [i, setI] = useState(0);
  const [binState, setBinState] = useState({});
  const [flying, setFlying] = useState(null);
  const [hint, setHint] = useState(wasteTexts.salimStart);
  const [mood, setMood] = useState("ask");
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  const item = queue[i];
  const finished = i >= queue.length;

  const drop = (binId) => {
    if (finished || flying) return;
    if (binId !== item.bin) {
      setBinState({ [binId]: "wrong" });
      setMood("warn");
      setHint(pick(profile, wasteTexts.wrong, wasteTexts.wrongF));
      t.current = setTimeout(() => setBinState({}), 620);
      return;
    }
    setBinState({ [binId]: "right" });
    setFlying(binId);
    setMood("agree");
    setHint(`${item.name} فِي مَكَانِهِ.`);
    t.current = setTimeout(() => {
      setFlying(null); setBinState({});
      setI((n) => n + 1);
      setMood("ask");
    }, 640);
  };

  useEffect(() => {
    if (i >= queue.length && queue.length) { setMood("smile"); setHint(pick(profile, wasteTexts.win, wasteTexts.winF)); }
  }, [i, queue.length, profile]);

  return (
    <GameFrame
      title="فَرْزُ المُخَلَّفَاتِ"
      goal={pick(profile, wasteTexts.goal, wasteTexts.goalF)}
      score={`${ar(Math.min(i, queue.length))}/${ar(queue.length)}`}
      hint={hint} hintMood={mood} onExit={onExit}
    >
      {!finished ? (
        <>
          {/* منضدة الفرز */}
          <div style={{
            borderRadius: 18, padding: "20px 12px 14px", perspective: 620,
            background: "linear-gradient(180deg,#EDF2F3 0%,#DCE5E7 100%)",
            boxShadow: "inset 0 1px 8px rgba(34,48,31,.12)",
          }}>
            <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${PITCH}deg)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                className={flying ? "" : "bob"}
                style={{
                  transform: flying ? "translateY(56px) scale(.35)" : "none",
                  opacity: flying ? 0 : 1,
                  transition: `transform .6s ${ease}, opacity .6s ${ease}`,
                }}
              >
                <WasteShape shape={item.shape} />
              </div>
              <p style={{ margin: 0, fontFamily: font.display, fontSize: 19.5, fontWeight: 700, color: c.ink }}>{item.name}</p>
              {/* سطح المنضدة */}
              <div style={{
                width: "86%", height: 12, borderRadius: 4, marginTop: 4,
                background: "linear-gradient(180deg,#C6D0D2 0%,#A9B5B8 100%)",
                boxShadow: "0 10px 16px rgba(34,48,31,.16)",
              }} />
            </div>
          </div>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", justifyItems: "center" }}>
            {wasteBins.map((b) => (
              <Bin3D key={b.id} bin={b} state={binState[b.id] || "idle"} onPick={() => drop(b.id)} />
            ))}
          </div>
        </>
      ) : (
        <WinCard text={pick(profile, wasteTexts.win, wasteTexts.winF)} onDone={onWin} />
      )}
    </GameFrame>
  );
}

/* ============================================================
   ٢ — البيت الذكي (رسوم مسطّحة لكل مكان، بأسلوب واضح ومحبّب للطفل)
   ============================================================ */
const ROOM_PALETTE = {
  living:   { wall: "#F6DFA8", floor: "#C9754F", floor2: "#B8623E", rug: "#E9A15C" },
  kitchen:  { wall: "#F3E3CE", floor: "#D8C7A0", floor2: "#C7B389", rug: "#EADCC0" },
  bathroom: { wall: "#8FD0D6", floor: "#EAF4F4", floor2: "#D8E9E9", rug: "#C9E7E9" },
  school:   { wall: "#F3D3DA", floor: "#E3CFA4", floor2: "#D2BC8B", rug: "#EEDDBB" },
};

function RoomStyle() {
  return (
    <style>{`
      @keyframes srSpin { to { transform: rotate(360deg); } }
      @keyframes srDrip { 0% { opacity:0; transform: translateY(0); } 30% { opacity:1; } 100% { opacity:0; transform: translateY(20px); } }
      @keyframes srBlow { 0%,100% { opacity:.35; transform: translateX(0); } 50% { opacity:.9; transform: translateX(6px); } }
      @keyframes srGlow { 0%,100% { opacity:.55; } 50% { opacity:1; } }
      @keyframes srBeam { 0%,100% { opacity:.14; } 50% { opacity:.26; } }
    `}</style>
  );
}

/* ── أجهزة تفاعليّة: تعكس حالة التشغيل داخل الرسم نفسه ── */
function WallWindow({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="64" height="84" rx="4" fill="#F4EAD7" />
      <rect x="4" y="4" width="56" height="76" rx="2" fill={on ? "#BEE7EE" : "#2E3A47"} />
      {on ? <circle cx="46" cy="18" r="9" fill="#FFD873" /> : (
        <g fill="#3B4A5C">
          <rect x="4" y="10" width="56" height="6" /><rect x="4" y="22" width="56" height="6" />
          <rect x="4" y="34" width="56" height="6" /><rect x="4" y="46" width="56" height="6" />
          <rect x="4" y="58" width="56" height="6" /><rect x="4" y="70" width="56" height="6" />
        </g>
      )}
      <rect x="30" y="4" width="4" height="76" fill="#F4EAD7" />
      <rect x="4" y="38" width="56" height="4" fill="#F4EAD7" />
    </g>
  );
}

function WallAC({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="54" height="20" rx="6" fill="#F4F7F2" stroke="#C7D0C2" strokeWidth="1.5" />
      <rect x="5" y="13" width="44" height="4" rx="2" fill="#AEB8A8" />
      <circle cx="46" cy="6" r="2.6" fill={on ? "#6FD3A6" : "#B7BFB8"} />
      {on && [0, 1, 2].map((i) => (
        <rect key={i} x={8 + i * 15} y="21" width="9" height="3" rx="1.5" fill="#8FD0E6"
          style={{ animation: `srBlow 1.4s ease-in-out ${i * 0.22}s infinite` }} />
      ))}
    </g>
  );
}

function CeilingLamp({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {on && <circle cx="20" cy="42" r="34" fill="#FFD873" opacity=".2" style={{ animation: "srGlow 2.4s ease-in-out infinite" }} />}
      <line x1="20" y1="0" x2="20" y2="22" stroke="#8C948C" strokeWidth="3" />
      <path d="M4 22h32l-6 18H10Z" fill={on ? "#FFD873" : "#C7CBC0"} />
    </g>
  );
}

function FloorLamp({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {on && <circle cx="14" cy="10" r="32" fill="#FFD873" opacity=".22" style={{ animation: "srGlow 2.4s ease-in-out infinite" }} />}
      <path d="M0 0h28l-6 16H6Z" fill={on ? "#FFD873" : "#C7CBC0"} />
      <line x1="14" y1="16" x2="14" y2="70" stroke="#8C948C" strokeWidth="3" />
      <ellipse cx="14" cy="72" rx="16" ry="4" fill="#7E867E" />
    </g>
  );
}

function WallHeater({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="26" height="46" rx="6" fill="#F0F1EC" stroke="#C7CBC0" strokeWidth="1.5" />
      <rect x="5" y="8" width="16" height="3" fill="#B9BFB4" />
      <rect x="5" y="16" width="16" height="3" fill="#B9BFB4" />
      <rect x="5" y="24" width="16" height="3" fill="#B9BFB4" />
      <circle cx="13" cy="38" r="4" fill={on ? "#E8894F" : "#C2C8C1"} />
      {on && <circle cx="13" cy="38" r="11" fill="#E8894F" opacity=".28" style={{ animation: "srGlow 2s ease-in-out infinite" }} />}
    </g>
  );
}

function WallFridge({ x, y, on, big }) {
  const w = big ? 50 : 36, h = big ? 108 : 60;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width={w} height={h} rx="6" fill="#EEF1EC" stroke="#C7CBC0" strokeWidth="1.5" />
      <line x1="0" y1={h * 0.35} x2={w} y2={h * 0.35} stroke="#C7CBC0" strokeWidth="1.5" />
      <rect x={w - 8} y="6" width="3" height="10" rx="1.5" fill="#9AA29A" />
      <rect x={w - 8} y={h * 0.35 + 6} width="3" height="14" rx="1.5" fill="#9AA29A" />
      <circle cx="6" cy="6" r="3" fill={on ? "#6FD3A6" : "#C2C8C1"} />
    </g>
  );
}

function TVWall({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="74" height="46" rx="4" fill="#2A3138" />
      <rect x="4" y="4" width="66" height="38" rx="2" fill={on ? "#5FBFC9" : "#171C21"} />
      {on && (
        <g opacity=".85">
          <rect x="8" y="8" width="26" height="14" rx="2" fill="#F0C86A" />
          <rect x="38" y="8" width="24" height="30" rx="2" fill="#7FD1B9" />
          <rect x="8" y="26" width="26" height="12" rx="2" fill="#E08A5C" />
        </g>
      )}
      <rect x="32" y="46" width="10" height="6" fill="#3A424A" />
    </g>
  );
}

function Stove({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="76" height="18" rx="3" fill="#3A3F42" />
      <circle cx="18" cy="9" r="6.5" fill={on ? "#E8744C" : "#5A6165"} />
      <circle cx="38" cy="9" r="6.5" fill={on ? "#F0A15C" : "#5A6165"} />
      <circle cx="58" cy="9" r="6.5" fill="#5A6165" />
      {on && (
        <>
          <circle cx="18" cy="9" r="11" fill="#E8744C" opacity=".3" style={{ animation: "srGlow 1.6s ease-in-out infinite" }} />
          <circle cx="38" cy="9" r="11" fill="#F0A15C" opacity=".3" style={{ animation: "srGlow 1.6s ease-in-out .3s infinite" }} />
        </>
      )}
    </g>
  );
}

function ExhaustFan({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="20" cy="20" r="20" fill="#E7EAE6" stroke="#C7CBC0" strokeWidth="1.5" />
      <g style={{ transformOrigin: "20px 20px", animation: on ? "srSpin 1s linear infinite" : "none" }}>
        <path d="M20 20 L20 6 A14 14 0 0 1 32 13 Z" fill="#8C948C" />
        <path d="M20 20 L32 27 A14 14 0 0 1 20 34 Z" fill="#8C948C" />
        <path d="M20 20 L8 27 A14 14 0 0 1 8 13 Z" fill="#8C948C" />
      </g>
      <circle cx="20" cy="20" r="3" fill="#5A6165" />
    </g>
  );
}

function ShowerHead({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M0 0h30v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4Z" fill="#B9C6CE" />
      <line x1="15" y1="12" x2="15" y2="18" stroke="#9FAEB6" strokeWidth="2" />
      {on && [0, 1, 2, 3].map((i) => (
        <line key={i} x1={4 + i * 7} y1="20" x2={4 + i * 7} y2="44" stroke="#8FD0E6" strokeWidth="2.4" strokeLinecap="round"
          style={{ animation: `srDrip 1s linear ${i * 0.18}s infinite` }} />
      ))}
    </g>
  );
}

function ProjectorUnit({ x, y, on }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {on && <path d="M12 9 L150 70 L150 -50 Z" fill="#9FD3EA" opacity=".22" style={{ animation: "srBeam 2.4s ease-in-out infinite" }} />}
      <rect x="0" y="0" width="46" height="18" rx="4" fill="#EDEFEA" stroke="#C7CBC0" strokeWidth="1.5" />
      <circle cx="10" cy="9" r="5" fill={on ? "#4487AE" : "#9CA69C"} />
    </g>
  );
}

/* ── عناصر تزيينية ثابتة ── */
function Bookshelf({ x, y }) {
  const rows = [["#C9633B", "#4E8B6E", "#EAA33C"], ["#3E8C7C", "#B33D24", "#4E8B6E"]];
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="76" height="80" rx="3" fill="#B08A5C" />
      <rect x="4" y="4" width="68" height="34" rx="2" fill="#8A6A3E" />
      <rect x="4" y="42" width="68" height="34" rx="2" fill="#8A6A3E" />
      {rows.map((row, ri) => (
        <g key={ri} transform={`translate(8,${8 + ri * 38})`}>
          {row.map((col, ci) => <rect key={ci} x={ci * 20} y="0" width="16" height="24" rx="1.5" fill={col} />)}
        </g>
      ))}
    </g>
  );
}

function Sofa({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-8" y="8" width="20" height="56" rx="10" fill="#357867" />
      <rect x="208" y="8" width="20" height="56" rx="10" fill="#357867" />
      <rect x="0" y="0" width="220" height="42" rx="14" fill="#3E8C7C" />
      <rect x="0" y="30" width="220" height="34" rx="12" fill="#48A088" />
      <rect x="10" y="34" width="62" height="26" rx="8" fill="#3E8C7C" />
      <rect x="79" y="34" width="62" height="26" rx="8" fill="#3E8C7C" />
      <rect x="148" y="34" width="62" height="26" rx="8" fill="#3E8C7C" />
    </g>
  );
}

function CoffeeTable({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="6" y="12" width="6" height="18" fill="#6E5330" />
      <rect x="80" y="12" width="6" height="18" fill="#6E5330" />
      <rect x="0" y="0" width="92" height="12" rx="4" fill="#8A6A3E" />
    </g>
  );
}

function Chalkboard({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-6" y="-6" width="132" height="82" rx="4" fill="#8A6A3E" />
      <rect x="0" y="0" width="120" height="70" rx="2" fill="#3E7A5E" />
      <path d="M14 46h22M42 38h30M14 30h40" stroke="#EAF0E6" strokeWidth="2.4" strokeLinecap="round" opacity=".8" />
      <rect x="0" y="72" width="120" height="8" rx="2" fill="#B08A5C" />
    </g>
  );
}

function TeacherDesk({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="6" y="36" width="6" height="14" fill="#8A431E" />
      <rect x="72" y="36" width="6" height="14" fill="#8A431E" />
      <rect x="0" y="10" width="84" height="26" rx="4" fill="#C9633B" />
      <rect x="10" y="0" width="30" height="12" rx="2" fill="#EAF0E6" />
    </g>
  );
}

function StudentDesk({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="2" y="16" width="5" height="12" fill="#B5862F" />
      <rect x="27" y="16" width="5" height="12" fill="#B5862F" />
      <rect x="0" y="4" width="34" height="12" rx="3" fill="#EAA33C" />
      <rect x="0" y="26" width="34" height="10" rx="3" fill="#D9A15C" />
    </g>
  );
}

function Clock({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="14" cy="14" r="14" fill="#FFFDF6" stroke="#8A6A3E" strokeWidth="2" />
      <line x1="14" y1="14" x2="14" y2="6" stroke="#3A3F42" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="14" x2="19" y2="16" stroke="#3A3F42" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Bathtub({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="10" width="120" height="46" rx="20" fill="#FFFFFF" stroke="#BFD8DC" strokeWidth="2" />
      <rect x="8" y="18" width="104" height="26" rx="14" fill="#EAF6F8" />
      <circle cx="10" cy="58" r="4" fill="#C7D9DB" /><circle cx="110" cy="58" r="4" fill="#C7D9DB" />
    </g>
  );
}

function Sink({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="10" y="24" width="10" height="22" fill="#D9E6E8" />
      <path d="M30 6v-8" stroke="#9FAEB6" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="30" cy="20" rx="34" ry="14" fill="#FFFFFF" stroke="#BFD8DC" strokeWidth="2" />
      <ellipse cx="30" cy="20" rx="22" ry="8" fill="#EAF6F8" />
    </g>
  );
}

function Toilet({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="6" y="0" width="26" height="16" rx="3" fill="#FFFFFF" stroke="#BFD8DC" strokeWidth="2" />
      <ellipse cx="19" cy="34" rx="20" ry="16" fill="#FFFFFF" stroke="#BFD8DC" strokeWidth="2" />
      <ellipse cx="19" cy="33" rx="12" ry="9" fill="#EAF6F8" />
    </g>
  );
}

function ShowerStall({ x, y, children }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="0" y="0" width="78" height="110" rx="6" fill="#DCEEF0" opacity=".55" stroke="#9FC7CC" strokeWidth="2" />
      {children}
    </g>
  );
}

const Rug = ({ x, y, w, h, fill }) => <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} opacity=".9" />;

/* رسمُ المكان بالكامل، مسطّحًا وواضحًا، وأجهزته تتفاعل مع حالة التشغيل */
function RoomScene({ room, on, dark }) {
  const pal = ROOM_PALETTE[room.id];
  const has = (id) => on.has(id);
  let content;
  if (room.id === "living") {
    content = (
      <>
        <Rug x={60} y={178} w={280} h={50} fill={pal.rug} />
        <WallWindow x={22} y={16} on={has("window")} />
        <Bookshelf x={298} y={20} />
        <WallAC x={118} y={12} on={has("ac")} />
        <TVWall x={188} y={46} on={has("tv")} />
        <WallHeater x={20} y={112} on={has("heater")} />
        <WallFridge x={352} y={106} on={has("fridge")} />
        <Sofa x={88} y={148} />
        <CoffeeTable x={156} y={198} />
        <FloorLamp x={336} y={92} on={has("lamp")} />
      </>
    );
  } else if (room.id === "kitchen") {
    content = (
      <>
        <Rug x={40} y={182} w={320} h={46} fill={pal.rug} />
        <rect x={140} y={30} width="120" height="46" rx="4" fill="#EFE0C4" stroke={pal.floor2} strokeWidth="2" />
        <rect x={148} y={38} width="50" height="30" rx="2" fill={pal.floor2} />
        <rect x={202} y={38} width="50" height="30" rx="2" fill={pal.floor2} />
        <ExhaustFan x={60} y={40} on={has("fan")} />
        <rect x={20} y={100} width="290" height="70" rx="6" fill="#D9A15C" />
        <rect x={20} y={100} width="290" height="14" rx="4" fill="#B5862F" />
        <Stove x={56} y={94} on={has("stove")} />
        <WallFridge x={322} y={62} on={has("fridge")} big />
      </>
    );
  } else if (room.id === "bathroom") {
    content = (
      <>
        <Rug x={140} y={190} w={120} h={34} fill={pal.rug} />
        <ShowerStall x={296} y={26}>
          <ShowerHead x={24} y={4} on={has("shower")} />
        </ShowerStall>
        <WallHeater x={20} y={28} on={has("heater")} />
        <CeilingLamp x={160} y={0} on={has("lamp")} />
        <Bathtub x={24} y={130} />
        <Toilet x={210} y={150} />
        <Sink x={270} y={140} />
      </>
    );
  } else {
    content = (
      <>
        <Rug x={40} y={198} w={320} h={30} fill={pal.rug} />
        <Clock x={30} y={18} />
        <Chalkboard x={150} y={22} />
        <Bookshelf x={330} y={40} />
        <WallAC x={276} y={12} on={has("ac")} />
        <ProjectorUnit x={186} y={6} on={has("projector")} />
        <CeilingLamp x={340} y={0} on={has("lamp")} />
        <TeacherDesk x={150} y={106} />
        <StudentDesk x={34} y={150} /><StudentDesk x={84} y={150} />
        <StudentDesk x={34} y={192} /><StudentDesk x={84} y={192} />
        <StudentDesk x={254} y={150} /><StudentDesk x={304} y={150} />
      </>
    );
  }
  return (
    <svg viewBox="0 0 400 240" width="100%" style={{ display: "block", maxWidth: 420, margin: "0 auto" }} aria-hidden="true">
      <RoomStyle />
      <rect x="0" y="0" width="400" height="168" fill={pal.wall} />
      <rect x="0" y="168" width="400" height="72" fill={pal.floor} />
      <rect x="0" y="166" width="400" height="4" fill={pal.floor2} opacity=".6" />
      {content}
      {dark && <rect x="0" y="0" width="400" height="240" fill="#0B1626" opacity=".5" />}
    </svg>
  );
}

function RoomTile({ room, done, onClick }) {
  return (
    <button
      type="button" onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        background: c.paper, border: `1px solid ${c.line}`, borderRadius: 16, padding: "16px 10px",
        cursor: "pointer", minHeight: 44, boxShadow: shadow.sm, position: "relative",
      }}
    >
      {done && (
        <span style={{
          position: "absolute", top: 8, insetInlineEnd: 8, width: 20, height: 20, borderRadius: "50%",
          background: c.goodSoft, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Glyph name="check" size={12} color={c.good} strokeWidth={3} />
        </span>
      )}
      <IconChip bg={c.sage} size={46} radius={16}>
        <Glyph name={room.icon} size={22} color={c.sageDeep} />
      </IconChip>
      <span style={{ fontFamily: font.display, fontSize: 15, fontWeight: 700, color: c.ink, textAlign: "center", lineHeight: 1.4 }}>
        {room.name}
      </span>
    </button>
  );
}

function SmartHomeGame({ profile, onExit, onWin }) {
  const [roomId, setRoomId] = useState(null);
  const [roomsDone, setRoomsDone] = useState(() => new Set());
  const [round, setRound] = useState(0);
  const [on, setOn] = useState(() => new Set());
  const [hint, setHint] = useState("");
  const [mood, setMood] = useState("ask");
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  const room = homeRooms.find((rm) => rm.id === roomId);

  const openRoom = (id) => {
    const rm = homeRooms.find((x) => x.id === id);
    setRoomId(id);
    setRound(0);
    setOn(new Set(rm.rounds[0].on));
    setHint("");
    setMood("ask");
    setLocked(false);
    setFinished(false);
  };

  const r = room ? room.rounds[round] : null;
  const roomMaxWatts = room ? room.devices.reduce((sum, d) => sum + d.watts, 0) + 400 : 0;

  const usage = useMemo(() => {
    if (!room) return 0;
    let w = 0;
    room.devices.forEach((d) => { if (on.has(d.id) && !d.isWindow) w += d.watts; });
    if (on.has("window") && on.has("ac")) w += 400;
    return w;
  }, [on, room]);

  const toggle = (id) => {
    if (locked || finished) return;
    setOn((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const endRound = () => {
    const missing = r.needed.filter((id) => !on.has(id));
    if (missing.length) {
      setMood("warn");
      setHint(`${pick(profile, homeTexts.missing, homeTexts.missingF)} ${room.devices.find((d) => d.id === missing[0]).name} لَازِمَةٌ الآنَ.`);
      return;
    }
    if (on.has("window") && on.has("ac")) { setMood("warn"); setHint(homeTexts.windowOpen); return; }
    if (usage > r.limit) { setMood("warn"); setHint(pick(profile, homeTexts.overLimit, homeTexts.overLimitF)); return; }

    if (round + 1 < room.rounds.length) {
      setLocked(true);
      setMood("agree");
      setHint(isF(profile) ? "أَحْسَنْتِ. نَنْتَقِلُ إِلَى التَّحَدِّي التَّالِي." : "أَحْسَنْتَ. نَنْتَقِلُ إِلَى التَّحَدِّي التَّالِي.");
      t.current = setTimeout(() => {
        const next = round + 1;
        setRound(next);
        setOn(new Set(room.rounds[next].on));
        setLocked(false);
        setMood("ask");
        setHint("");
      }, 1100);
    } else {
      setRoomsDone((prev) => new Set(prev).add(room.id));
      setFinished(true); setMood("smile");
      setHint(pick(profile, homeTexts.roomWin, homeTexts.roomWinF));
    }
  };

  const backToRooms = () => { setRoomId(null); setFinished(false); };
  const allRoomsDone = roomsDone.size >= homeRooms.length;

  /* شاشة اختيار المكان */
  if (!room) {
    return (
      <GameFrame
        title="البَيْتُ الذَّكِيُّ"
        goal={pick(profile, homeTexts.chooseRoom, homeTexts.chooseRoomF)}
        score={`${ar(roomsDone.size)}/${ar(homeRooms.length)}`}
        hint={allRoomsDone ? pick(profile, homeTexts.win, homeTexts.winF) : homeTexts.salimStart}
        hintMood={allRoomsDone ? "smile" : "ask"}
        onExit={onExit}
      >
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
          {homeRooms.map((rm) => (
            <RoomTile key={rm.id} room={rm} done={roomsDone.has(rm.id)} onClick={() => openRoom(rm.id)} />
          ))}
        </div>
        {allRoomsDone && <Btn wide onClick={onWin}>{labels.backToGames}</Btn>}
      </GameFrame>
    );
  }

  const over = usage > r.limit;
  const dark = !!r.dark;

  return (
    <GameFrame
      title={room.name}
      goal={pick(profile, homeTexts.goal, homeTexts.goalF)}
      score={`${ar(round + 1)}/${ar(room.rounds.length)}`}
      hint={hint || pick(profile, r.text, r.textF)} hintMood={mood} onExit={backToRooms}
    >
      {!finished ? (
        <>
          <div style={{
            borderRadius: 18, padding: 10, overflow: "hidden",
            background: c.paper, boxShadow: shadow.sm,
          }}>
            <RoomScene room={room} on={on} dark={dark} />
          </div>

          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(104px, 1fr))" }}>
            {room.devices.map((d) => {
              const active = on.has(d.id);
              return (
                <button
                  key={d.id} type="button" onClick={() => toggle(d.id)} aria-pressed={active}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6,
                    borderRadius: 12, padding: "9px 11px", minHeight: 46, cursor: "pointer",
                    border: `2px solid ${active ? (d.isWindow ? c.dustyInk : c.warn) : c.line}`,
                    background: active ? (d.isWindow ? "#E3EDF1" : c.warnSoft) : c.paper,
                    transition: `all .25s ${ease}`,
                  }}
                >
                  <span style={{ fontFamily: font.display, fontSize: 15, fontWeight: 700, color: c.ink, lineHeight: 1.4 }}>{d.name}</span>
                  <span style={{
                    fontFamily: font.body, fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
                    color: active ? (d.isWindow ? c.dustyInk : c.accentInk) : c.inkFaint,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {d.isWindow ? (active ? "مَفْتُوحَة" : "مُغْلَقَة") : (active ? `${ar(d.watts)} و` : "مُطْفَأ")}
                  </span>
                </button>
              );
            })}
          </div>

          <Meter
            value={usage} max={roomMaxWatts} unit="وَاط"
            color={over ? c.bad : usage > r.limit * 0.7 ? c.warn : c.good}
            label="الاسْتِهْلَاكُ الآنَ"
          />
          <p style={{ margin: 0, fontSize: 12, color: c.inkFaint, textAlign: "center", fontFamily: font.body }}>
            الحَدُّ الآنَ: {ar(r.limit)} وَاط
          </p>
          <Btn wide onClick={endRound} tone={over ? "warm" : "brand"}>{homeTexts.endDay}</Btn>
        </>
      ) : (
        <WinCard text={pick(profile, homeTexts.roomWin, homeTexts.roomWinF)} onDone={backToRooms} />
      )}
    </GameFrame>
  );
}

/* ============================================================
   ٣ — التسوّق المستدام (ممرّ سوق له عمق)
   ============================================================ */
/* ── رسومُ مُنْتَجَاتِ التَّسَوُّقِ ─────────────────────────
   كُلُّ أَيْقُونَةٍ صُنْدُوقٌ صَغِيرٌ يُوضِّحُ المُنْتَجَ دَاخِلَ صُورَةِ السِّعْرِ. */
export function MarketIcon({ icon, size = 40 }) {
  const s = { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.4, fill: "none" };
  const shapes = {
    waterMany: (
      <g stroke="#EAF6FA" {...s}>
        <path d="M17 20h6v4c2 1 3 2.6 3 4.6V38a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V28.6c0-2 1-3.6 3-4.6Z" fill="#4E90B4" />
        <path d="M27 22h5v3c1.6.8 2.4 2 2.4 3.6V36a1.6 1.6 0 0 1-1.6 1.6H27" fill="#5FA0C2" opacity=".85" />
      </g>
    ),
    waterBig: (
      <g stroke="#EAF6FA" {...s}>
        <path d="M19 8h10v7c3.4 1.6 5.6 4.6 5.6 8.6V38a3 3 0 0 1-3 3H16.4a3 3 0 0 1-3-3V23.6c0-4 2.2-7 5.6-8.6Z" fill="#3E7F9C" />
        <path d="M16 26h16" stroke="#EAF6FA" strokeWidth="1.6" opacity=".7" />
      </g>
    ),
    datesLocal: (
      <g stroke="#7A5A2E" {...s}>
        <path d="M8 30c1.5-8 8-10 16-10s14.5 2 16 10c-6 4-26 4-32 0Z" fill="#D9C79A" />
        <g fill="#8A5A2E" stroke="none">
          <ellipse cx="18" cy="24" rx="3.4" ry="2.6" /><ellipse cx="26" cy="22" rx="3.4" ry="2.6" /><ellipse cx="33" cy="25" rx="3.4" ry="2.6" />
        </g>
      </g>
    ),
    datesImported: (
      <g stroke="#8A7A5E" {...s}>
        <rect x="8" y="16" width="32" height="18" rx="3" fill="#EDE6D2" />
        <g fill="#8A5A2E" stroke="none">
          <ellipse cx="17" cy="25" rx="3" ry="2.3" /><ellipse cx="24" cy="25" rx="3" ry="2.3" /><ellipse cx="31" cy="25" rx="3" ry="2.3" />
        </g>
        <path d="M8 16h32M8 34h32" stroke="#FFF" strokeWidth="1.6" opacity=".55" />
      </g>
    ),
    veggieWeek: (
      <g {...s}>
        <path d="M8 30c1.5-7 8-9 16-9s14.5 2 16 9c-6 3.6-26 3.6-32 0Z" fill="#D9C79A" stroke="#7A5A2E" />
        <path d="M15 24l3-7 3 7Z" fill="#C9633B" stroke="#8A431E" />
        <circle cx="26" cy="23" r="4" fill="#B33D24" stroke="#7A2413" />
        <path d="M32 22l2-5 2 5Z" fill="#4E8B6E" stroke="#2E5E3F" />
      </g>
    ),
    veggieMany: (
      <g {...s}>
        <path d="M6 30c1.5-7 9-9 18-9s16.5 2 18 9c-7 4-29 4-36 0Z" fill="#D9C79A" stroke="#7A5A2E" />
        <path d="M12 23l3-7 3 7Z" fill="#C9633B" stroke="#8A431E" />
        <circle cx="21" cy="21" r="4" fill="#B33D24" stroke="#7A2413" />
        <path d="M28 21l2.4-6 2.4 6Z" fill="#4E8B6E" stroke="#2E5E3F" />
        <circle cx="36" cy="23" r="3.4" fill="#B33D24" stroke="#7A2413" />
        <path d="M9 16l-2-3M39 16l2-3" stroke="#7A5A2E" strokeWidth="1.6" opacity=".6" />
      </g>
    ),
    bagPlastic: (
      <g stroke="#9C5335" {...s}>
        <path d="M13 16h22l-3 22H16Z" fill="#F0DCD1" />
        <path d="M19 16v-3a5 5 0 0 1 10 0v3" />
      </g>
    ),
    bagCloth: (
      <g stroke="#3E7A6E" {...s}>
        <path d="M12 17h24l-2 20H14Z" fill="#BFE0D4" />
        <path d="M18 17v-3a6 6 0 0 1 12 0v3" />
        <path d="M12 23h24" opacity=".6" />
      </g>
    ),
    clothesLocal: (
      <g stroke="#7C9473" {...s}>
        <path d="M15 9 10 13l3 4 3-2v20h12V15l3 2 3-4-5-4-2 2h-7Z" fill="#EAF0E6" />
      </g>
    ),
    clothesFast: (
      <g stroke="#A34E2C" {...s}>
        <path d="M11 12 7 15l2 3 2-1.5v9h12v-9l2 1.5 2-3-4-3-1.5 1.5h-5.5Z" fill="#F4CBB4" transform="translate(0 -3) scale(.72)" />
        <path d="M15 20 11 23l2 3 2-1.5v9h12v-9l2 1.5 2-3-4-3-1.5 1.5h-5.5Z" fill="#EFB79A" transform="translate(4 4) scale(.72)" />
        <path d="M19 14 15 17l2 3 2-1.5v9h12v-9l2 1.5 2-3-4-3-1.5 1.5h-5.5Z" fill="#E9A183" transform="translate(-2 10) scale(.72)" />
      </g>
    ),
    shoeDurable: (
      <g stroke="#5B4A2E" {...s}>
        <path d="M6 32c0-3 2-5 5-6l9-4c3-1.4 6-1.4 9 0l9 4c3 1.4 4 2.6 4 6Z" fill="#C9633B" />
        <path d="M6 32h32v3H6Z" fill="#8A431E" />
      </g>
    ),
    shoeCheap: (
      <g stroke="#5B4A2E" {...s}>
        <path d="M6 32c0-3 2-5 5-6l9-4c3-1.4 6-1.4 9 0l9 4c3 1.4 4 2.6 4 6Z" fill="#D9A98C" />
        <path d="M6 32h32v3H6Z" fill="#8A431E" />
        <path d="M20 23l4 5-3 2" stroke="#B33D24" strokeWidth="2" />
      </g>
    ),
    giveAway: (
      <g stroke="#B5862F" {...s}>
        <path d="M24 34s-12-7-12-15a7 7 0 0 1 12-4.8A7 7 0 0 1 36 19c0 8-12 15-12 15Z" fill="#F3E7CC" />
      </g>
    ),
    trashClothes: (
      <g stroke="#9C6B4A" {...s}>
        <path d="M11 16h26l-2.4 20.6A3 3 0 0 1 31.6 39H16.4a3 3 0 0 1-3-2.4Z" fill="#E7DCC8" />
        <path d="M17 16v-3h14v3" />
        <path d="M20 21v11M28 21v11" opacity=".55" />
      </g>
    ),
    notebookRecycled: (
      <g stroke="#4E7345" {...s}>
        <rect x="11" y="8" width="26" height="32" rx="2" fill="#E4EEDC" />
        <rect x="11" y="8" width="8" height="32" fill="#BFDCB0" />
        <path d="M27 18a6 6 0 1 1-4.2 10.2" />
        <path d="M27 14l3 4-4 1" />
      </g>
    ),
    notebookPlastic: (
      <g stroke="#4B5A6C" {...s}>
        <rect x="11" y="8" width="26" height="32" rx="2" fill="#DCE6EC" />
        <rect x="11" y="8" width="8" height="32" fill="#B7C9D6" />
        <path d="M25 14h9v9h-9Z" opacity=".5" />
      </g>
    ),
    penRefill: (
      <g stroke="#2E6E8E" {...s}>
        <path d="M14 34 30 18l4 4-16 16-5 1Z" fill="#CFE6EE" />
        <path d="M27 21l4 4" />
        <path d="M35 12a4 4 0 1 1-2.8 6.8" />
        <path d="M35 8l3 4-4 1" />
      </g>
    ),
    penDisposable: (
      <g stroke="#8C6B4A" {...s}>
        <path d="M10 34 21 23l3 3-11 11-4 1Z" fill="#E9D8C2" />
        <path d="M18 26l3 3" />
        <path d="M20 34 31 23l3 3-11 11-4 1Z" fill="#E9D8C2" transform="translate(2 -3)" />
        <path d="M28 20l3 3" transform="translate(2 -3)" />
      </g>
    ),
    bagDurable: (
      <g stroke="#5B4A2E" {...s}>
        <path d="M13 18a11 11 0 0 1 22 0v18a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3Z" fill="#C9633B" />
        <path d="M18 18v-2a6 6 0 0 1 12 0v2" />
        <rect x="17" y="24" width="14" height="9" rx="2" fill="#8A431E" opacity=".5" />
      </g>
    ),
    bagCheap: (
      <g stroke="#5B4A2E" {...s}>
        <path d="M13 18a11 11 0 0 1 22 0v18a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3Z" fill="#DFAE8F" />
        <path d="M18 18v-2a6 6 0 0 1 12 0v2" />
        <path d="M17 27l5 5-2 3" stroke="#B33D24" strokeWidth="2" />
      </g>
    ),
    toyWood: (
      <g stroke="#8A6A3E" {...s}>
        <rect x="9" y="22" width="30" height="12" rx="3" fill="#D9A15C" />
        <circle cx="16" cy="36" r="3.4" fill="#8A6A3E" />
        <circle cx="32" cy="36" r="3.4" fill="#8A6A3E" />
        <path d="M14 22v-6h20v6" opacity=".7" />
      </g>
    ),
    toyPlastic: (
      <g stroke="#3E7F9C" {...s}>
        <rect x="9" y="22" width="30" height="12" rx="3" fill="#8FC7D8" />
        <circle cx="16" cy="36" r="3.4" fill="#3E7F9C" />
        <circle cx="32" cy="36" r="3.4" fill="#3E7F9C" />
        <path d="M20 24l4 6-3 2" stroke="#B33D24" strokeWidth="2" />
      </g>
    ),
    batteryRecharge: (
      <g stroke="#1E6B45" {...s}>
        <rect x="12" y="16" width="24" height="16" rx="3" fill="#DCEFE1" />
        <rect x="36" y="21" width="3" height="6" fill="#1E6B45" />
        <path d="M26 18l-5 7h5l-5 7" stroke="#1E6B45" fill="none" />
      </g>
    ),
    batteryDisposable: (
      <g stroke="#B33D24" {...s}>
        <rect x="12" y="16" width="24" height="16" rx="3" fill="#FBDCD3" />
        <rect x="36" y="21" width="3" height="6" fill="#B33D24" />
        <path d="M20 20l8 8M28 20l-8 8" />
      </g>
    ),
    toyDrawer: (
      <g stroke="#8C6B4A" {...s}>
        <rect x="9" y="12" width="30" height="24" rx="2" fill="#E7D7B8" />
        <rect x="14" y="26" width="20" height="4" rx="2" fill="#8C6B4A" />
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ filter: "drop-shadow(0 3px 5px rgba(34,48,31,.28))" }}>
      {shapes[icon] || shapes.giveAway}
    </svg>
  );
}

function ProductBox({ opt, chosen, onPick, index }) {
  const tint = index === 0 ? "#B9603C" : "#3E8C7C";
  return (
    <button
      type="button" onClick={onPick}
      style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        transformStyle: "preserve-3d", minHeight: 44,
        transform: chosen ? "translateY(-14px) rotateY(-10deg) scale(1.04)" : "none",
        transition: `transform .4s ${ease}`,
      }}
    >
      <div style={{ width: 104, transformStyle: "preserve-3d" }}>
        <Box3D w={104} h={92} dep={20} radius={5}
          face={`linear-gradient(165deg, ${tint} 0%, ${tint}d0 100%)`}
          top={`${tint}`} side={`${tint}`}
          glow={chosen ? "rgba(34,48,31,.5)" : null}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, padding: "6px 6px 2px" }}>
            <MarketIcon icon={opt.icon} size={40} />
            <span style={{
              color: "#FFF", fontFamily: font.display, fontWeight: 700, fontSize: 11.5,
              lineHeight: 1.35, textAlign: "center", textShadow: "0 1px 3px rgba(0,0,0,.4)",
            }}>{opt.name}</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 7, background: "rgba(0,0,0,.18)" }} />
        </Box3D>
      </div>
      {/* بطاقة السعر */}
      <span style={{
        display: "inline-block", marginTop: 10, background: "#FFFDF6", borderRadius: 6,
        padding: "3px 10px", fontFamily: font.display, fontWeight: 700, fontSize: 15,
        color: c.ink, fontVariantNumeric: "tabular-nums", boxShadow: "0 3px 6px rgba(34,48,31,.2)",
        border: "1px solid rgba(34,48,31,.12)",
      }}>
        {ar(opt.price.toFixed(2))} ر.ع
      </span>
    </button>
  );
}

function SetTile({ set, done, onClick }) {
  return (
    <button
      type="button" onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        background: c.paper, border: `1px solid ${c.line}`, borderRadius: 16, padding: "16px 10px",
        cursor: "pointer", minHeight: 44, boxShadow: shadow.sm, position: "relative",
      }}
    >
      {done && (
        <span style={{
          position: "absolute", top: 8, insetInlineEnd: 8, width: 20, height: 20, borderRadius: "50%",
          background: c.goodSoft, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Glyph name="check" size={12} color={c.good} strokeWidth={3} />
        </span>
      )}
      <IconChip bg={c.sage} size={46} radius={16}>
        <Glyph name={set.icon} size={22} color={c.sageDeep} />
      </IconChip>
      <span style={{ fontFamily: font.display, fontSize: 15, fontWeight: 700, color: c.ink, textAlign: "center", lineHeight: 1.4 }}>
        {set.name}
      </span>
    </button>
  );
}

function MarketGame({ profile, onExit, onWin }) {
  const [setId, setSetId] = useState(null);
  const [setsDone, setSetsDone] = useState(() => new Set());
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState([]);
  const [note, setNote] = useState(null);
  const [mood, setMood] = useState("ask");
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  const mset = marketSets.find((ms) => ms.id === setId);

  const openSet = (id) => {
    setSetId(id);
    setStep(0);
    setPicks([]);
    setNote(null);
    setMood("ask");
  };
  const backToSets = () => { setSetId(null); setStep(0); setPicks([]); setNote(null); };

  const done = mset ? step >= mset.needs.length : false;
  const spent = mset ? picks.reduce((s, p, idx) => s + mset.needs[idx].options[p].price, 0) : 0;
  const waste = mset ? picks.reduce((s, p, idx) => s + mset.needs[idx].options[p].waste, 0) : 0;
  const allBest = mset && picks.length === mset.needs.length && picks.every((p, idx) => p === mset.needs[idx].best);
  const inBudget = mset ? spent <= mset.budget : true;
  const setsAllDone = setsDone.size >= marketSets.length;

  const choose = (optIdx) => {
    if (done || note) return;
    const cur = mset.needs[step];
    setNote(cur.options[optIdx].note);
    setMood(optIdx === cur.best ? "agree" : "think");
    setPicks((p) => [...p, optIdx]);
    t.current = setTimeout(() => {
      setNote(null); setMood("ask");
      setStep((s) => {
        const nextStep = s + 1;
        if (nextStep >= mset.needs.length) setSetsDone((prev) => new Set(prev).add(mset.id));
        return nextStep;
      });
    }, 1600);
  };

  const restart = () => { setPicks([]); setStep(0); setNote(null); setMood("ask"); };

  /* شاشة اختيار السوق */
  if (!mset) {
    return (
      <GameFrame
        title="التَّسَوُّقُ المُسْتَدَامُ"
        goal={pick(profile, marketTexts.chooseSet, marketTexts.chooseSetF)}
        score={`${ar(setsDone.size)}/${ar(marketSets.length)}`}
        hint={setsAllDone ? pick(profile, marketTexts.win, marketTexts.winF) : marketTexts.salimStart}
        hintMood={setsAllDone ? "smile" : "ask"}
        onExit={onExit}
      >
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
          {marketSets.map((ms) => (
            <SetTile key={ms.id} set={ms} done={setsDone.has(ms.id)} onClick={() => openSet(ms.id)} />
          ))}
        </div>
        {setsAllDone && <Btn wide onClick={onWin}>{labels.backToGames}</Btn>}
      </GameFrame>
    );
  }

  const cur = mset.needs[step];

  return (
    <GameFrame
      title={mset.name}
      goal={pick(profile, marketTexts.goal, marketTexts.goalF)}
      score={`${ar(Math.min(step, mset.needs.length))}/${ar(mset.needs.length)}`}
      hint={note} hintMood={mood} onExit={backToSets}
    >
      {!done ? (
        <>
          <div style={{
            borderRadius: 18, padding: "16px 10px 0", perspective: 900, overflow: "hidden",
            background: "linear-gradient(180deg,#F1ECDF 0%,#E3DAC6 100%)",
          }}>
            <p style={{ margin: "0 0 14px", textAlign: "center", fontFamily: font.display, fontSize: 20, fontWeight: 700, color: c.ink }}>
              {cur.need}
            </p>

            <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${PITCH + 2}deg)`, position: "relative" }}>
              {/* الرفّ الخلفي */}
              <div style={{
                position: "absolute", left: "6%", right: "6%", top: -6, height: 118,
                background: "linear-gradient(180deg,#CBBB9A 0%,#B6A483 100%)",
                borderRadius: "6px 6px 0 0", transform: "translateZ(-70px)",
                boxShadow: "inset 0 6px 14px rgba(0,0,0,.14)",
              }} />
              {/* رفّ علوي */}
              <div style={{
                position: "absolute", left: "4%", right: "4%", top: 6, height: 9,
                background: "linear-gradient(180deg,#A28D68 0%,#8A7654 100%)",
                transform: "translateZ(-46px)", borderRadius: 3,
              }} />

              <div style={{ display: "flex", justifyContent: "center", gap: 20, transformStyle: "preserve-3d", position: "relative", zIndex: 2 }}>
                {cur.options.map((opt, idx) => (
                  <ProductBox key={idx} opt={opt} index={idx} chosen={picks[step] === idx} onPick={() => choose(idx)} />
                ))}
              </div>

              {/* لوح الرفّ الأمامي */}
              <div style={{
                marginTop: -4, height: 16, borderRadius: 3,
                background: "linear-gradient(180deg,#B9A484 0%,#8E7B59 100%)",
                boxShadow: "0 12px 18px rgba(34,48,31,.24)",
              }} />
              {/* أرضيّة السوق */}
              <div style={{
                height: 52, marginTop: 0,
                background: "linear-gradient(180deg,#D8CFB8 0%,#EDE6D6 100%)",
                backgroundImage: "linear-gradient(180deg,#D8CFB8 0%,#EDE6D6 100%), repeating-linear-gradient(90deg, rgba(120,104,74,.10) 0 1px, transparent 1px 46px)",
                transform: "rotateX(64deg)", transformOrigin: "top center",
              }} />
            </div>
          </div>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <Meter value={Number(spent.toFixed(2))} max={mset.budget} unit="ر.ع"
              color={inBudget ? c.good : c.bad} label="أُنْفِقَ" />
            <Meter value={waste} max={9} unit="نُقْطَة"
              color={waste === 0 ? c.good : waste < 5 ? c.warn : c.bad} label="الهَدَرُ" />
          </div>
        </>
      ) : (
        <div className="pop" style={{
          background: allBest && inBudget ? c.goodSoft : c.warnSoft,
          borderRadius: 18, padding: 22, textAlign: "center",
        }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Salim mood={allBest && inBudget ? "smile" : "think"} size={80} />
          </div>
          <p style={{
            margin: "6px 0 10px", fontFamily: font.display, fontSize: 18, fontWeight: 700, lineHeight: 1.6,
            color: allBest && inBudget ? c.good : c.warn,
          }}>
            {allBest && inBudget ? pick(profile, marketTexts.setWin, marketTexts.setWinF) : pick(profile, marketTexts.partial, marketTexts.partialF)}
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: c.inkSoft, fontFamily: font.body, fontVariantNumeric: "tabular-nums" }}>
            {isF(profile) ? "أَنْفَقْتِ" : "أَنْفَقْتَ"} {ar(spent.toFixed(2))} ر.ع مِنْ {ar(mset.budget)} · الهَدَرُ {ar(waste)}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {!(allBest && inBudget) && <Btn tone="warm" onClick={restart}>{labels.retry}</Btn>}
            <Btn onClick={backToSets}>{labels.backToGames}</Btn>
          </div>
        </div>
      )}
    </GameFrame>
  );
}

export const GAMES = {
  sorting: SortingGame,
  smarthome: SmartHomeGame,
  market: MarketGame,
};
