/* ============================================================
   الألعاب البيئية

   إطار واحد يجمع الألعاب الثلاث: الهدف أعلى الشاشة، والنتيجة
   بجانبه، وتلميح الجدّ سالم تحتهما، والخروج في مكانه دائمًا.

   المشاهد مبنيّة بمنظور ثلاثي الأبعاد حقيقي عبر CSS transforms:
   جدران لها عمق، وأجسام لها وجه وجانب وسطح، وإضاءة تتغيّر مع
   حالة الغرفة. بلا أي مكتبة خارجية، لتعمل على أجهزة المدارس.
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

function Btn({ children, onClick, tone = "brand", wide }) {
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

const Meter = ({ value, max, color, label, unit }) => {
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

function WinCard({ text, onDone, mood = "smile" }) {
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

/* جسم قائم في الفراغ، يُدار عكس المشهد ليبقى مواجهًا للناظر */
function Obj({ x = 0, y = 0, z = 0, onClick, label, pressed, children, zIndex }) {
  const inner = (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {children}
    </div>
  );
  const style = {
    position: "absolute", left: "50%", top: "50%",
    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-YAW}deg) translate(-50%, -50%)`,
    zIndex,
  };
  if (!onClick) return <div style={style}>{inner}</div>;
  return (
    <button
      type="button" onClick={onClick} aria-label={label} aria-pressed={pressed}
      style={{ ...style, background: "none", border: "none", padding: 0, cursor: "pointer" }}
    >
      {inner}
    </button>
  );
}

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
   ٢ — البيت الذكي (غرفة مأهولة بمنظور حقيقي)
   ============================================================ */
const R = { w: 312, h: 206, d: 186 };

function Wall({ w, h, tz, rot, bg, children, zIndex }) {
  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%", width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2,
      transform: `${rot} translateZ(${tz}px)`,
      background: bg, transformStyle: "preserve-3d", zIndex, pointerEvents: "none",
    }}>{children}</div>
  );
}

/* الأجهزة مرسومة أجسامًا في الغرفة، والجسم نفسه هو الزرّ */
function Device({ dev, on, onToggle }) {
  const label = dev.isWindow ? (on ? "مَفْتُوحَة" : "مُغْلَقَة") : (on ? "يَعْمَل" : "مُطْفَأ");

  if (dev.id === "window") {
    return (
      <Obj x={44} y={8} z={-R.d / 2 + 2} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={2}>
        <div style={{ position: "relative", width: 76, height: 62 }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: 5, overflow: "hidden",
            background: on
              ? "linear-gradient(180deg,#8FD2E6 0%,#D8E9C8 100%)"
              : "linear-gradient(180deg,#5E7B8C 0%,#4A6272 100%)",
            border: "4px solid #E8E2D4", boxSizing: "border-box",
            boxShadow: on ? "0 0 26px rgba(255,214,120,.55)" : "inset 0 2px 8px rgba(0,0,0,.35)",
            transition: `all .45s ${ease}`,
          }}>
            {on && <div style={{ position: "absolute", top: 8, left: 10, width: 20, height: 20, borderRadius: "50%", background: "#FFD873", boxShadow: "0 0 16px #FFD873" }} />}
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 4, marginLeft: -2, background: "#E8E2D4" }} />
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, marginTop: -2, background: "#E8E2D4" }} />
            {!on && (
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg,#D9D3C4 0 7px,#C9C2B2 7px 14px)" }} />
            )}
          </div>
          {on && (
            <>
              <span style={{ position: "absolute", right: -16, top: 12, width: 10, height: 26, borderRadius: 8, background: "rgba(255,196,120,.5)", filter: "blur(3px)", animation: "heatWave 2.4s ease-in-out infinite" }} />
              <span style={{ position: "absolute", right: -24, top: 26, width: 8, height: 20, borderRadius: 8, background: "rgba(255,196,120,.38)", filter: "blur(3px)", animation: "heatWave 2.4s ease-in-out .7s infinite" }} />
            </>
          )}
        </div>
      </Obj>
    );
  }

  if (dev.id === "ac") {
    return (
      <Obj x={44} y={-62} z={-R.d / 2 + 4} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={2}>
        <div style={{ position: "relative" }}>
          <Box3D w={82} h={28} dep={16} radius={6}
            face="linear-gradient(180deg,#FAFBF9 0%,#DFE4DE 100%)"
            top="#FFFFFF" side="#C8CFC8"
            glow={on ? "rgba(140,210,235,.75)" : null}>
            <div style={{ position: "absolute", bottom: 4, left: 6, right: 6, height: 7, borderRadius: 3, background: "repeating-linear-gradient(90deg,#B9C3BC 0 3px,#DDE3DC 3px 6px)" }} />
            <div style={{ position: "absolute", top: 5, right: 7, width: 6, height: 6, borderRadius: "50%", background: on ? "#6FD3A6" : "#B7BFB8", boxShadow: on ? "0 0 7px #6FD3A6" : "none" }} />
          </Box3D>
          {on && [0, 1, 2].map((k) => (
            <span key={k} style={{
              position: "absolute", left: 14 + k * 24, top: 32, width: 14, height: 3, borderRadius: 3,
              background: "rgba(150,215,240,.85)", animation: `blow 1.5s ease-in-out ${k * 0.22}s infinite`,
            }} />
          ))}
        </div>
      </Obj>
    );
  }

  if (dev.id === "tv") {
    return (
      <Obj x={-62} y={-30} z={-R.d / 2 + 4} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={2}>
        <Box3D w={92} h={56} dep={12} radius={5}
          face="linear-gradient(180deg,#2D343B 0%,#1B2127 100%)"
          top="#3A424A" side="#151A1F"
          glow={on ? "rgba(120,200,235,.6)" : null}>
          <div style={{
            position: "absolute", inset: 5, borderRadius: 3,
            background: on
              ? "linear-gradient(120deg,#3EA9C9 0%,#7FD1B9 38%,#F0C86A 70%,#E08A5C 100%)"
              : "#11161B",
            backgroundSize: on ? "260% 100%" : "auto",
            animation: on ? "tvPlay 5s linear infinite" : "none",
            transition: `background .4s ${ease}`,
          }} />
        </Box3D>
      </Obj>
    );
  }

  if (dev.id === "lamp") {
    return (
      <Obj x={124} y={22} z={62} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={6}>
        <div style={{ position: "relative", width: 56, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent",
            borderBottom: `30px solid ${on ? "#FFD873" : "#B9BEB4"}`,
            filter: on ? "drop-shadow(0 0 16px rgba(255,216,115,.9))" : "none",
            transform: "rotate(180deg)", transition: `all .4s ${ease}`,
          }} />
          <div style={{ width: 6, height: 62, background: "linear-gradient(90deg,#8C948C,#C3C9C1,#8C948C)" }} />
          <div style={{ width: 40, height: 8, borderRadius: "50%", background: "#7E867E" }} />
          {on && <div style={{ position: "absolute", top: 22, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,216,115,.38) 0%, transparent 68%)", pointerEvents: "none" }} />}
        </div>
      </Obj>
    );
  }

  if (dev.id === "fridge") {
    return (
      <Obj x={-126} y={26} z={22} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={5}>
        <Box3D w={58} h={102} dep={20} radius={6}
          face="linear-gradient(170deg,#F2F4F1 0%,#D6DBD5 100%)"
          top="#FBFCFA" side="#BFC6BE"
          glow={on ? "rgba(140,210,235,.35)" : null}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 38, height: 3, background: "#B7BFB7" }} />
          <div style={{ position: "absolute", right: 7, top: 14, width: 4, height: 18, borderRadius: 3, background: "#9AA29A" }} />
          <div style={{ position: "absolute", right: 7, top: 48, width: 4, height: 24, borderRadius: 3, background: "#9AA29A" }} />
          <div style={{ position: "absolute", left: 8, top: 8, width: 6, height: 6, borderRadius: "50%", background: on ? "#6FD3A6" : "#C2C8C1", boxShadow: on ? "0 0 7px #6FD3A6" : "none" }} />
        </Box3D>
      </Obj>
    );
  }

  if (dev.id === "heater") {
    return (
      <Obj x={-150} y={-74} z={-58} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={4}>
        <Box3D w={44} h={58} dep={16} radius={20}
          face="linear-gradient(180deg,#EFF1EC 0%,#D3D8D0 100%)"
          top="#FAFBF8" side="#BCC2B9"
          glow={on ? "rgba(240,150,90,.6)" : null}>
          <div style={{ position: "absolute", left: 9, right: 9, top: 14, height: 3, borderRadius: 3, background: "#AEB5AC" }} />
          <div style={{ position: "absolute", left: 9, right: 9, top: 24, height: 3, borderRadius: 3, background: "#AEB5AC" }} />
          <div style={{ position: "absolute", left: "50%", marginLeft: -4, bottom: 8, width: 8, height: 8, borderRadius: "50%", background: on ? "#E8894F" : "#C2C8C1", boxShadow: on ? "0 0 9px #E8894F" : "none" }} />
        </Box3D>
      </Obj>
    );
  }

  /* المَوْقِدُ — يَشْغَلُ نَفْسَ مَوْضِعِ المُكَيِّفِ فِي غُرَفٍ لَا مُكَيِّفَ فِيهَا */
  if (dev.id === "stove") {
    return (
      <Obj x={44} y={-62} z={-R.d / 2 + 4} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={2}>
        <Box3D w={82} h={30} dep={16} radius={6}
          face="linear-gradient(180deg,#3A3F42 0%,#25292B 100%)"
          top="#4A5054" side="#1A1D1E"
          glow={on ? "rgba(232,116,68,.75)" : null}>
          <div style={{ position: "absolute", top: 6, left: 10, width: 16, height: 16, borderRadius: "50%", background: on ? "#E8744C" : "#5A6165", boxShadow: on ? "0 0 12px #E8744C" : "none", transition: `all .3s ${ease}` }} />
          <div style={{ position: "absolute", top: 6, right: 10, width: 16, height: 16, borderRadius: "50%", background: on ? "#F0A15C" : "#5A6165", boxShadow: on ? "0 0 12px #F0A15C" : "none", transition: `all .3s ${ease}` }} />
        </Box3D>
      </Obj>
    );
  }

  /* الشَّفَّاطُ — يَشْغَلُ مَوْضِعَ التِّلْفَازِ فِي غُرَفٍ لَا تِلْفَازَ فِيهَا */
  if (dev.id === "fan") {
    return (
      <Obj x={-62} y={-30} z={-R.d / 2 + 4} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={2}>
        <Box3D w={52} h={52} dep={10} radius={26}
          face="linear-gradient(180deg,#E7EAE6 0%,#C9CEC5 100%)"
          top="#F2F4F0" side="#B2B8AD"
          glow={on ? "rgba(140,210,235,.55)" : null}>
          <div style={{
            position: "absolute", inset: 10, borderRadius: "50%", border: "2px solid #8C948C",
            animation: on ? "spinFan 1.1s linear infinite" : "none",
          }}>
            {[0, 90, 180, 270].map((deg) => (
              <span key={deg} style={{
                position: "absolute", left: "50%", top: "50%", width: 3, height: 13,
                background: "#8C948C", transformOrigin: "top", marginLeft: -1.5,
                transform: `rotate(${deg}deg) translateY(0)`,
              }} />
            ))}
          </div>
        </Box3D>
      </Obj>
    );
  }

  /* الدُّشُّ — يَشْغَلُ مَوْضِعَ المُكَيِّفِ فِي غُرَفٍ لَا مُكَيِّفَ فِيهَا */
  if (dev.id === "shower") {
    return (
      <Obj x={44} y={-62} z={-R.d / 2 + 4} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={2}>
        <div style={{ position: "relative" }}>
          <Box3D w={40} h={16} dep={10} radius={8}
            face="linear-gradient(180deg,#DCE6E8 0%,#B9C6CE 100%)"
            top="#EDF2F3" side="#9FAEB6"
            glow={on ? "rgba(140,210,235,.7)" : null} />
          {on && [0, 1, 2, 3].map((k) => (
            <span key={k} style={{
              position: "absolute", left: 6 + k * 9, top: 16, width: 2.4, height: 30, borderRadius: 3,
              background: "rgba(140,200,225,.75)", animation: `dripFall 1s linear ${k * 0.18}s infinite`,
            }} />
          ))}
        </div>
      </Obj>
    );
  }

  /* جِهَازُ العَرْضِ — يَشْغَلُ مَوْضِعَ التِّلْفَازِ فِي غُرَفٍ لَا تِلْفَازَ فِيهَا */
  return (
    <Obj x={-62} y={-30} z={-R.d / 2 + 4} onClick={() => onToggle(dev.id)} label={`${dev.name}: ${label}`} pressed={on} zIndex={2}>
      <div style={{ position: "relative" }}>
        <Box3D w={70} h={26} dep={10} radius={5}
          face="linear-gradient(180deg,#EDEFEA 0%,#CFD5C9 100%)"
          top="#F7F8F4" side="#B6BDAE"
          glow={on ? "rgba(120,200,235,.55)" : null}>
          <div style={{ position: "absolute", left: 8, top: "50%", marginTop: -5, width: 10, height: 10, borderRadius: "50%", background: on ? "#4487AE" : "#9CA69C", boxShadow: on ? "0 0 10px #4487AE" : "none" }} />
        </Box3D>
        {on && (
          <div style={{
            position: "absolute", left: 4, top: 12, width: 0, height: 0,
            borderTop: "22px solid transparent", borderBottom: "22px solid transparent",
            borderRight: "58px solid rgba(150,205,230,.28)",
          }} />
        )}
      </div>
    </Obj>
  );
}

const ROOM_THEME = {
  living: {
    lit:  { wall: "linear-gradient(180deg,#7E8FA1 0%,#63758A 100%)", side: "linear-gradient(180deg,#68798D 0%,#526379 100%)", floor: "linear-gradient(180deg,#A8977C 0%,#8A7962 100%)", sky: "linear-gradient(180deg,#1E2B44 0%,#2B3C55 100%)" },
    dim:  { wall: "linear-gradient(180deg,#44536A 0%,#33415A 100%)", side: "linear-gradient(180deg,#38465C 0%,#2A374D 100%)", floor: "linear-gradient(180deg,#6A5E4C 0%,#584E3F 100%)", sky: "linear-gradient(180deg,#10182A 0%,#1A2438 100%)" },
    alwaysLit: false,
  },
  kitchen: {
    lit: { wall: "linear-gradient(180deg,#F2E2C8 0%,#E4CCA2 100%)", side: "linear-gradient(180deg,#E6D2AC 0%,#D3B989 100%)", floor: "linear-gradient(180deg,#D8C7A0 0%,#C0AA7E 100%)", sky: "linear-gradient(180deg,#3A2E1E 0%,#4A3B26 100%)" },
    dim: { wall: "linear-gradient(180deg,#8A7A5E 0%,#6E6148 100%)", side: "linear-gradient(180deg,#7C6D53 0%,#5E5340 100%)", floor: "linear-gradient(180deg,#6A5D45 0%,#544936 100%)", sky: "linear-gradient(180deg,#241C12 0%,#332818 100%)" },
    alwaysLit: true,
  },
  bathroom: {
    lit: { wall: "linear-gradient(180deg,#CFE6EA 0%,#AFD1D8 100%)", side: "linear-gradient(180deg,#BEDBE0 0%,#9DC3CB 100%)", floor: "linear-gradient(180deg,#B5D0D5 0%,#95B4BA 100%)", sky: "linear-gradient(180deg,#123240 0%,#1A4756 100%)" },
    dim: { wall: "linear-gradient(180deg,#4A6067 0%,#374A50 100%)", side: "linear-gradient(180deg,#3E5257 0%,#2C3C40 100%)", floor: "linear-gradient(180deg,#354649 0%,#273336 100%)", sky: "linear-gradient(180deg,#0B1F26 0%,#122C33 100%)" },
    alwaysLit: false,
  },
  school: {
    lit: { wall: "linear-gradient(180deg,#DCE7D6 0%,#C3D6BB 100%)", side: "linear-gradient(180deg,#CEDCC6 0%,#B2C7A8 100%)", floor: "linear-gradient(180deg,#C9B78E 0%,#AF9C74 100%)", sky: "linear-gradient(180deg,#1E3420 0%,#2A4A2C 100%)" },
    dim: { wall: "linear-gradient(180deg,#586B54 0%,#455641 100%)", side: "linear-gradient(180deg,#4C5E48 0%,#3A4A37 100%)", floor: "linear-gradient(180deg,#4C4331 0%,#3A3326 100%)", sky: "linear-gradient(180deg,#101F12 0%,#172B18 100%)" },
    alwaysLit: false,
  },
};

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
  const theme = room ? ROOM_THEME[room.id] : null;
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
  const lit = theme.alwaysLit || on.has("lamp") || on.has("window");
  const dark = !!r.dark;
  const colors = lit && !dark ? theme.lit : theme.dim;

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
            borderRadius: 18, padding: "30px 8px 22px", overflow: "hidden",
            background: colors.sky, transition: `background .8s ${ease}`,
          }}>
            <div style={{ perspective: 820, width: "100%", display: "flex", justifyContent: "center" }}>
              <div style={{
                position: "relative", width: R.w, height: R.h, transformStyle: "preserve-3d",
                transform: `rotateX(${PITCH}deg) rotateY(${YAW}deg)`,
              }}>
                {/* الجدار الخلفي */}
                <Wall w={R.w} h={R.h} tz={-R.d / 2} rot="" zIndex={1} bg={colors.wall} />
                {/* الجدار الجانبي */}
                <Wall w={R.d} h={R.h} tz={-R.w / 2} rot="rotateY(90deg)" zIndex={1} bg={colors.side} />
                {/* الأرضية */}
                <Wall w={R.w} h={R.d} tz={-R.h / 2} rot="rotateX(90deg)" zIndex={0} bg={colors.floor}>
                  <div style={{
                    position: "absolute", left: "26%", top: "34%", width: "48%", height: "40%",
                    borderRadius: 10, background: lit ? "rgba(124,148,115,.4)" : "rgba(70,86,66,.5)",
                    border: "3px solid rgba(255,255,255,.14)", transition: `background .6s ${ease}`,
                  }} />
                </Wall>
                {/* السقف */}
                <Wall w={R.w} h={R.d} tz={R.h / 2} rot="rotateX(90deg)" zIndex={0}
                  bg={lit ? "rgba(226,232,226,.85)" : "rgba(58,70,88,.9)"} />

                {/* الأجهزة */}
                {room.devices.map((d) => (
                  <Device key={d.id} dev={d} on={on.has(d.id)} onToggle={toggle} />
                ))}

                {/* طبقة الإضاءة */}
                <div style={{
                  position: "absolute", left: "50%", top: "50%", width: R.w, height: R.h,
                  marginLeft: -R.w / 2, marginTop: -R.h / 2, transform: "translateZ(30px)",
                  pointerEvents: "none", borderRadius: 2,
                  background: on.has("lamp")
                    ? "radial-gradient(circle at 82% 62%, rgba(255,216,115,.30) 0%, transparent 62%)"
                    : (lit ? "none" : "rgba(8,14,26,.42)"),
                  transition: `background .6s ${ease}`, zIndex: 8,
                }} />
              </div>
            </div>
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
function MarketIcon({ icon, size = 40 }) {
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
