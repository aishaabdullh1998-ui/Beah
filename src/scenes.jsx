/* ============================================================
   مشاهد «كلمات تتحرّك»

   كانت كل كلمة في المعجم تُعرض برسم خطّي ساكن يصف المصطلح ولا
   يُظهره. هنا صار لكل كلمة مشهد يُحرّكه الطفل بنفسه، فيرى النتيجة
   تحدث أمامه: الصنبور يقطر حتى يُغلقه، والنخلة تفرغ إن أخذ كل
   الرطب، والسيارة تسير بلا دخان بعد أن يركّب الشمس والماء.
   ============================================================ */
import React, { useEffect, useRef, useState } from "react";
import { c, shadow, font, ease } from "./theme.js";
import { ImgFallback } from "./art.jsx";

/* ── عناصر مشتركة ──────────────────────────────────────── */
export function Stage({ children, sky = "#E7F0F2", height = 168 }) {
  return (
    <div
      style={{
        width: "100%", borderRadius: 16, overflow: "hidden", background: sky,
        boxShadow: "inset 0 1px 6px rgba(34,48,31,.10)", transition: `background .8s ${ease}`,
      }}
    >
      <svg viewBox="0 0 220 140" style={{ width: "100%", height, display: "block" }} aria-hidden="true">
        {children}
      </svg>
    </div>
  );
}

export function ActBtn({ children, onClick, tone = "brand", disabled }) {
  const bg = tone === "brand" ? c.sageDeep : tone === "warm" ? c.accent : tone === "cool" ? c.dustyInk : c.warn;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none", borderRadius: 12, padding: "11px 18px", cursor: disabled ? "default" : "pointer",
        background: disabled ? c.line : bg, color: disabled ? c.inkFaint : c.onDark,
        fontFamily: font.display, fontWeight: 700, fontSize: 17, lineHeight: 1.2,
        boxShadow: disabled ? "none" : shadow.sm, minHeight: 44,
        transition: `transform .2s ${ease}, filter .2s`,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
    >
      {children}
    </button>
  );
}

export function Hint({ children, tone = "soft" }) {
  const col = tone === "bad" ? c.bad : tone === "good" ? c.good : c.inkSoft;
  return (
    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.9, color: col, textAlign: "center", fontFamily: font.body }}>
      {children}
    </p>
  );
}

const Row = ({ children, wrap = true }) => (
  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: wrap ? "wrap" : "nowrap", width: "100%" }}>
    {children}
  </div>
);

const Meter = ({ value, color, label }) => (
  <div style={{ width: "100%", maxWidth: 240 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: c.inkFaint, marginBottom: 4 }}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(value)}٪</span>
    </div>
    <div style={{ height: 8, borderRadius: 99, background: c.lineSoft, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 99, transition: `width .35s linear, background .5s ${ease}` }} />
    </div>
  </div>
);

/* ============================================================
   المسرح المصوَّر
   كل مشهد = خلفية مرسومة كاملة + عناصر شفافة فوقها.
   المواضع بالنسبة المئوية فتبقى متناسقة على الهاتف واللوحي.
   إن لم تُحمَّل صورة، يظهر بديل بسيط بألوان التطبيق.
   ============================================================ */
const IMG = "assets/img/dict-scenes/";
const INK = "#5B3626";

export function SceneStage({ bg, sky = "#E7F0F2", soil = "#F1DDB8", children, overlay }) {
  const [bgOk, setBgOk] = useState(true);
  return (
    <div
      style={{
        position: "relative", width: "100%", maxWidth: 520, aspectRatio: "4 / 3",
        borderRadius: 18, overflow: "hidden", border: `3px solid ${INK}`,
        background: `linear-gradient(${sky} 0%, ${sky} 62%, ${soil} 62%, ${soil} 100%)`,
        boxShadow: "0 5px 0 rgba(91,54,38,.28)", touchAction: "manipulation",
      }}
    >
      {bg && bgOk && (
        <img
          src={IMG + bg} alt="" aria-hidden="true" draggable="false" onError={() => setBgOk(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {overlay}
      {children}
    </div>
  );
}

/* عنصر فوق المسرح: (x, y) نقطة قاعدته السفلية الوسطى، w عرضه — كلها بالنسبة المئوية */
function Sprite({ src, alt = "", x, y, w, fallback = null, anim, onClick, z = 2, style, label }) {
  const [ok, setOk] = useState(true);
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? label || alt : undefined}
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: `${w}%`,
        transform: "translate(-50%, -100%)", zIndex: z, padding: 0, border: "none", background: "none",
        cursor: onClick ? "pointer" : "default", touchAction: "manipulation",
        transition: `left .7s ${ease}, top .7s ${ease}, width .7s ${ease}, opacity .5s`,
        ...style,
      }}
    >
      <div className={anim} style={{ display: "block", transformOrigin: "50% 100%" }}>
        {src && ok ? (
          <img
            src={src.startsWith("assets/") ? src : IMG + src} alt={alt} draggable="false" onError={() => setOk(false)}
            style={{ display: "block", width: "100%", height: "auto", filter: "drop-shadow(0 5px 4px rgba(91,54,38,.22))" }}
          />
        ) : fallback}
      </div>
    </Tag>
  );
}

/* بدائل مؤقتة بسيطة بخط التطبيق البني، تظهر فقط إن غابت الصورة */
const F = {
  sun: (hot) => (
    <svg viewBox="0 0 100 100" width="100%"><circle cx="50" cy="50" r="30" fill={hot ? "#E66422" : "#F2A41A"} stroke={INK} strokeWidth="4" />
      <g stroke={hot ? "#E66422" : "#F2A41A"} strokeWidth="6" strokeLinecap="round">{[0,45,90,135,180,225,270,315].map((a)=>(<line key={a} x1="50" y1="8" x2="50" y2="16" transform={`rotate(${a} 50 50)`} />))}</g></svg>
  ),
  plant: (big) => (
    <svg viewBox="0 0 100 120" width="100%"><ellipse cx="50" cy="114" rx="30" ry="6" fill="#B5835A" />
      <path d={`M50 114 V${big ? 40 : 70}`} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <ellipse cx={big ? 50 : 38} cy={big ? 36 : 66} rx={big ? 34 : 14} ry={big ? 30 : 8} fill="#7C8A2F" stroke={INK} strokeWidth="4" />
      {!big && <ellipse cx="62" cy="62" rx="14" ry="8" fill="#9AA84A" stroke={INK} strokeWidth="4" />}</svg>
  ),
  bin: (col) => (
    <svg viewBox="0 0 100 110" width="100%"><rect x="16" y="26" width="68" height="80" rx="12" fill={col} stroke={INK} strokeWidth="5" />
      <rect x="10" y="14" width="80" height="16" rx="8" fill={col} stroke={INK} strokeWidth="5" /></svg>
  ),
  pot: (
    <svg viewBox="0 0 100 110" width="100%"><path d="M22 58 L78 58 L70 106 L30 106 Z" fill="#D46A34" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M50 58 V26" stroke={INK} strokeWidth="5" /><ellipse cx="36" cy="30" rx="16" ry="9" fill="#7C8A2F" stroke={INK} strokeWidth="4" /><ellipse cx="64" cy="24" rx="16" ry="9" fill="#9AA84A" stroke={INK} strokeWidth="4" /></svg>
  ),
  pieces: (
    <svg viewBox="0 0 120 70" width="100%"><g fill="#C7CFD4" stroke={INK} strokeWidth="4"><rect x="8" y="24" width="30" height="26" rx="6" transform="rotate(-16 23 37)" /><rect x="46" y="10" width="30" height="24" rx="6" transform="rotate(12 61 22)" /><rect x="82" y="30" width="28" height="30" rx="6" transform="rotate(22 96 45)" /></g></svg>
  ),
  bird: (
    <svg viewBox="0 0 100 80" width="100%"><ellipse cx="48" cy="46" rx="30" ry="22" fill="#F2A41A" stroke={INK} strokeWidth="4" /><circle cx="70" cy="30" r="14" fill="#F2A41A" stroke={INK} strokeWidth="4" /><path d="M82 30 l12 4 -12 4Z" fill="#E66422" stroke={INK} strokeWidth="3" /><circle cx="72" cy="27" r="2.5" fill={INK} /></svg>
  ),
  palm: (n) => (
    <svg viewBox="0 0 160 200" width="100%"><path d="M80 196 V70" stroke="#8A6A3E" strokeWidth="14" strokeLinecap="round" />
      <g fill="#7C8A2F" stroke={INK} strokeWidth="4"><path d="M80 70 q-50 -10 -70 -40 q50 0 70 40Z" /><path d="M80 70 q50 -10 70 -40 q-50 0 -70 40Z" /><path d="M80 66 q-20 -40 0 -64 q20 30 0 64Z" /></g>
      {Array.from({ length: n }).map((_, i) => <circle key={i} cx={56 + (i % 4) * 16} cy={84 + Math.floor(i / 4) * 16} r="7" fill="#E66422" stroke={INK} strokeWidth="3" />)}</svg>
  ),
  basket: (n) => (
    <svg viewBox="0 0 100 80" width="100%"><path d="M12 30 h76 l-10 46 h-56Z" fill="#D9C29A" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {Array.from({ length: n }).map((_, i) => <circle key={i} cx={30 + (i % 4) * 13} cy={26 - Math.floor(i / 4) * 9} r="7" fill="#E66422" stroke={INK} strokeWidth="3" />)}</svg>
  ),
  panel: (on) => (
    <svg viewBox="0 0 100 90" width="100%"><rect x="8" y="8" width="84" height="54" rx="6" fill={on ? "#7FC8C2" : "#6E7C84"} stroke={INK} strokeWidth="4" />
      <path d="M36 8 V62 M64 8 V62 M8 35 H92" stroke={INK} strokeWidth="3" /><path d="M50 62 V88" stroke={INK} strokeWidth="6" /></svg>
  ),
  tank: (col) => (
    <svg viewBox="0 0 80 100" width="100%"><rect x="10" y="12" width="60" height="84" rx="16" fill={col} stroke={INK} strokeWidth="4" /></svg>
  ),
  car: (
    <svg viewBox="0 0 140 80" width="100%"><path d="M10 56 v-14 q0 -8 8 -8 h16 l14 -18 h44 l16 18 h14 q8 0 8 8 v14Z" fill="#7C8A2F" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="38" cy="60" r="12" fill={INK} /><circle cx="104" cy="60" r="12" fill={INK} /></svg>
  ),
  tap: (open) => (
    <svg viewBox="0 0 100 90" width="100%">
      <rect x="40" y="4" width="20" height="26" rx="4" fill="#9FB0B6" stroke={INK} strokeWidth="4" />
      <rect x="20" y="26" width="60" height="14" rx="7" fill="#B9C6CB" stroke={INK} strokeWidth="4" />
      <path d="M70 33 Q92 33 92 55" fill="none" stroke="#B9C6CB" strokeWidth="12" strokeLinecap="round" />
      <path d="M70 33 Q92 33 92 55" fill="none" stroke={INK} strokeWidth="4" />
      <g transform={`rotate(${open ? -38 : 0} 30 14)`}>
        <rect x="8" y="8" width="44" height="12" rx="6" fill="#E66422" stroke={INK} strokeWidth="4" />
      </g>
    </svg>
  ),
  bucket: (full) => (
    <svg viewBox="0 0 100 90" width="100%">
      <path d="M18 24 L82 24 L72 86 L28 86 Z" fill="#CDE7E3" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {full && <path d="M26 50 L74 50 L72 86 L28 86Z" fill="#5FA6C4" />}
      <path d="M18 24 Q50 36 82 24" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M24 24 Q50 2 76 24" fill="none" stroke="#8C8C84" strokeWidth="5" />
    </svg>
  ),
  dropFace: (sad) => (
    <svg viewBox="0 0 100 120" width="100%">
      <path d="M50 6C50 6 14 58 14 80a36 36 0 0072 0C86 58 50 6 50 6Z" fill="#5FA6C4" stroke={INK} strokeWidth="4" />
      <circle cx="38" cy="78" r="4.4" fill={INK} /><circle cx="62" cy="78" r="4.4" fill={INK} />
      {sad
        ? <path d="M36 98q14-12 28 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        : <path d="M36 92q14 12 28 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />}
    </svg>
  ),
  litter: (kind) => {
    if (kind === "banana") return (
      <svg viewBox="0 0 100 70" width="100%"><path d="M12 50q4-30 34-38q-6 10 2 16q-26 2-24 30q-8 0-12-8Z" fill="#E7C65A" stroke={INK} strokeWidth="4" strokeLinejoin="round" /></svg>
    );
    if (kind === "apple") return (
      <svg viewBox="0 0 100 90" width="100%"><path d="M50 30c16-14 34-2 30 16c-4 20-20 34-30 34S24 66 20 46C16 28 34 16 50 30Z" fill="#E6875C" stroke={INK} strokeWidth="4" /><path d="M50 30V16" stroke="#8A6A45" strokeWidth="4" strokeLinecap="round" /></svg>
    );
    if (kind === "jar") return (
      <svg viewBox="0 0 80 100" width="100%"><rect x="16" y="30" width="48" height="60" rx="8" fill="#CDE7E3" stroke={INK} strokeWidth="4" opacity=".85" /><rect x="24" y="14" width="32" height="18" rx="4" fill="#B9C6CB" stroke={INK} strokeWidth="4" /></svg>
    );
    if (kind === "tuna") return (
      <svg viewBox="0 0 100 70" width="100%"><ellipse cx="50" cy="40" rx="42" ry="22" fill="#B9C6CB" stroke={INK} strokeWidth="4" /><ellipse cx="50" cy="28" rx="42" ry="12" fill="#D7E2E4" stroke={INK} strokeWidth="4" /></svg>
    );
    return (
      <svg viewBox="0 0 70 100" width="100%"><rect x="10" y="10" width="50" height="80" rx="10" fill="#8C8C84" stroke={INK} strokeWidth="4" /><rect x="10" y="10" width="50" height="16" rx="8" fill="#B9C6CB" stroke={INK} strokeWidth="4" /></svg>
    );
  },
  earthMound: (state) => {
    const col = state === 2 ? "#7C8A2F" : state === 1 ? "#B79A52" : "#A85A2E";
    return (
      <svg viewBox="0 0 120 90" width="100%">
        <ellipse cx="60" cy="70" rx="56" ry="20" fill={col} stroke={INK} strokeWidth="4" />
        {state < 2 && <path d="M30 60 40 72M60 56 60 70M90 60 80 72" stroke={INK} strokeWidth="2.4" opacity=".4" strokeLinecap="round" fill="none" />}
        {state === 2 && (
          <>
            <circle cx="44" cy="62" r="3.4" fill={INK} /><circle cx="76" cy="62" r="3.4" fill={INK} />
            <path d="M44 72q16 10 32 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  },
  kids: (
    <svg viewBox="0 0 160 90" width="100%">
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${16 + i * 38},10)`}>
          <circle cx="14" cy="14" r="12" fill="#EFC49A" stroke={INK} strokeWidth="3" />
          <path d="M2 70V40q0-14 12-14t12 14v30Z" fill={["#5FA6C4", "#E66422", "#2E8C7A", "#F2A41A"][i]} stroke={INK} strokeWidth="3" />
        </g>
      ))}
    </svg>
  ),
  ibexBig: (
    <svg viewBox="0 0 140 130" width="100%">
      <ellipse cx="60" cy="86" rx="40" ry="22" fill="#B5895A" stroke={INK} strokeWidth="5" />
      <rect x="30" y="100" width="10" height="26" rx="5" fill="#8A6A3E" /><rect x="52" y="104" width="10" height="24" rx="5" fill="#8A6A3E" /><rect x="86" y="104" width="10" height="24" rx="5" fill="#8A6A3E" />
      <ellipse cx="104" cy="58" rx="18" ry="15" fill="#C29A66" stroke={INK} strokeWidth="5" />
      <circle cx="110" cy="54" r="3.4" fill={INK} />
      <path d="M108 48c8-20 26-32 36-30-12 10-22 20-28 36Z" fill="#5A4326" stroke={INK} strokeWidth="3" />
    </svg>
  ),
  turtleBig: (
    <svg viewBox="0 0 140 110" width="100%">
      <ellipse cx="66" cy="60" rx="46" ry="34" fill="#6E9460" stroke={INK} strokeWidth="5" />
      <path d="M38 42l10 14-10 14M66 36v24M94 42l-10 14 10 14M34 60h12M98 60h-12" stroke="#4A6338" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity=".6" />
      <ellipse cx="116" cy="46" rx="13" ry="11" fill="#8FAE72" stroke={INK} strokeWidth="4" />
      <circle cx="120" cy="43" r="2.6" fill="#2E3A28" />
      <ellipse cx="18" cy="42" rx="11" ry="7" fill="#8FAE72" stroke={INK} strokeWidth="3.4" transform="rotate(-25 18 42)" />
      <ellipse cx="18" cy="78" rx="11" ry="7" fill="#8FAE72" stroke={INK} strokeWidth="3.4" transform="rotate(25 18 78)" />
      <ellipse cx="110" cy="84" rx="11" ry="7" fill="#8FAE72" stroke={INK} strokeWidth="3.4" transform="rotate(-18 110 84)" />
    </svg>
  ),
  palmBig: (
    <svg viewBox="0 0 140 160" width="100%">
      <path d="M70 156V60" stroke="#8A6A3E" strokeWidth="11" strokeLinecap="round" />
      <g fill="#7C8A2F" stroke={INK} strokeWidth="4">
        <path d="M70 60q-42-8-58-34q42 0 58 34Z" /><path d="M70 60q42-8 58-34q-42 0-58 34Z" />
        <path d="M70 56q-16-32 0-52q16 20 0 52Z" />
      </g>
      {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={52 + (i % 3) * 14} cy={70 + Math.floor(i / 3) * 14} r="6" fill="#E66422" stroke={INK} strokeWidth="3" />)}
    </svg>
  ),
  habitatCard: (kind) => {
    if (kind === "mountain") return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}><rect width="100" height="100" fill="#D6EAF0" /><path d="M0 70 30 30 55 58 75 24 100 66V100H0Z" fill="#BC8656" /><path d="M0 84 26 60 55 82 78 54 100 82V100H0Z" fill="#8C5E3A" /></svg>
    );
    if (kind === "sea") return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}><rect width="100" height="100" fill="#BEE3EC" /><path d="M0 60q12-8 25 0t25 0 25 0 25 0v40H0Z" fill="#2E86A8" /><path d="M0 76q12-6 25 0t25 0 25 0 25 0v24H0Z" fill="#17607F" /></svg>
    );
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}><rect width="100" height="100" fill="#EADFB8" /><ellipse cx="50" cy="82" rx="46" ry="16" fill="#5FA6C4" /><path d="M50 70V28" stroke="#8A6A3E" strokeWidth="6" strokeLinecap="round" /><path d="M50 40q-18-4-26-18q18 0 26 18Zm0 0q18-4 26-18q-18 0-26 18Z" fill="#7C8A2F" stroke={INK} strokeWidth="2" /></svg>
    );
  },
  beachLamp: (on) => (
    <svg viewBox="0 0 60 120" width="100%">
      <rect x="25" y="42" width="10" height="70" rx="3" fill="#8C8C84" stroke={INK} strokeWidth="4" />
      <ellipse cx="30" cy="112" rx="16" ry="4" fill="#D9C29A" opacity=".6" />
      <path d="M30 42 L8 18 H52Z" fill={on ? "#F2A41A" : "#6E7C84"} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {on && <circle cx="30" cy="16" r="12" fill="#FCE8A8" opacity=".55" />}
    </svg>
  ),
  gate: (
    <svg viewBox="0 0 90 100" width="100%">
      <rect x="6" y="18" width="10" height="78" fill="#8A6A3E" stroke={INK} strokeWidth="4" />
      <rect x="74" y="18" width="10" height="78" fill="#8A6A3E" stroke={INK} strokeWidth="4" />
      <g stroke="#8A6A3E" strokeWidth="7" strokeLinecap="round">
        <path d="M16 34h58M16 56h58M16 78h58" />
      </g>
      <g stroke={INK} strokeWidth="2" opacity=".45">
        <path d="M16 34h58M16 56h58M16 78h58" />
      </g>
    </svg>
  ),
  oryx: (
    <svg viewBox="0 0 160 120" width="100%">
      <ellipse cx="68" cy="82" rx="46" ry="23" fill="#F3EEE2" stroke={INK} strokeWidth="5" />
      <rect x="40" y="98" width="10" height="20" rx="4" fill="#DCD3BC" stroke={INK} strokeWidth="3" />
      <rect x="64" y="100" width="10" height="18" rx="4" fill="#DCD3BC" stroke={INK} strokeWidth="3" />
      <rect x="94" y="98" width="10" height="20" rx="4" fill="#DCD3BC" stroke={INK} strokeWidth="3" />
      <ellipse cx="118" cy="56" rx="19" ry="16" fill="#F3EEE2" stroke={INK} strokeWidth="5" />
      <path d="M110 46c3-18 1-30-5-36M126 46c-3-18-1-30 5-36" fill="none" stroke="#DCD3BC" strokeWidth="5" strokeLinecap="round" />
      <path d="M110 46c3-18 1-30-5-36M126 46c-3-18-1-30 5-36" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="128" cy="52" r="2.8" fill={INK} />
    </svg>
  ),
  dune: (
    <svg viewBox="0 0 140 70" width="100%">
      <path d="M0 70 Q35 8 70 38 T140 70Z" fill="#E6C488" stroke={INK} strokeWidth="4" />
      <path d="M20 58q10-8 20-2M90 60q10-6 20-2" stroke="#C9A565" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
    </svg>
  ),
  coral: (broken) => (
    <svg viewBox="0 0 120 100" width="100%">
      {!broken ? (
        <g fill="none" strokeWidth="5" strokeLinecap="round">
          <path d="M30 96V62q0-10 10-14M30 62q-14-4-14-18M44 72q10-6 10-20" stroke="#E6875C" />
          <path d="M72 96V56q0-12 12-16M72 62q16-4 16-20M60 72q-10-8-8-24" stroke="#F0B84E" />
          <path d="M96 96V68q0-10 8-14" stroke="#7FC8C2" />
        </g>
      ) : (
        <g stroke="#B9774F" strokeWidth="5" strokeLinecap="round" opacity=".5">
          <path d="M28 96 40 70M70 96 62 68M94 96 100 76" fill="none" />
        </g>
      )}
    </svg>
  ),
  anchor: (
    <svg viewBox="0 0 70 100" width="100%">
      <circle cx="35" cy="14" r="9" fill="none" stroke={INK} strokeWidth="5" />
      <path d="M35 23V80" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M10 56h50" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M35 80q-20 0-24-20M35 80q20 0 24-20" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  fish: (
    <svg viewBox="0 0 80 50" width="100%">
      <path d="M18 25q18-18 40-9q7 4 7 9t-7 9q-22 9-40-9Z" fill="#F2A41A" stroke={INK} strokeWidth="4" />
      <path d="M18 25 4 12 4 38Z" fill="#E66422" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="48" cy="21" r="2.6" fill={INK} />
    </svg>
  ),
};

/* ============================================================
   ١ — إعادة التدوير: العلبة تتفكّك ثم تصير شيئًا جديدًا
   ============================================================ */
function RecycleScene({ onDone }) {
  const [phase, setPhase] = useState("idle"); // idle | trash | pieces | made
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  const toTreasure = () => {
    setPhase("pieces");
    t.current = setTimeout(() => setPhase("made"), 900);
  };

  const can = phase === "idle"
    ? { x: 50, y: 66, w: 16, o: 1 }
    : phase === "trash" ? { x: 18, y: 74, w: 8, o: 0 } : { x: 82, y: 74, w: 8, o: 0 };

  return (
    <>
      <SceneStage sky="#DCEBEF" soil="#E9D3AE">
        <Sprite alt="سلة القمامة" x={18} y={96} w={26} fallback={F.bin("#8C8C84")} />
        <Sprite alt="سلة الكنوز" x={82} y={96} w={26} fallback={F.bin("#7C8A2F")} />
        {phase !== "made" && phase !== "pieces" && (
          <Sprite alt="علبة معدنية" x={can.x} y={can.y} w={can.w}
            anim={phase === "idle" ? "bob" : ""} style={{ opacity: can.o }} z={3} fallback={F.litter("can")} />
        )}
        {phase === "pieces" && <Sprite alt="العلبة تتفكك" x={50} y={70} w={34} anim="pop" fallback={F.pieces} />}
        {phase === "made" && <Sprite alt="أصيص فيه شتلة" x={50} y={90} w={30} anim="pop" fallback={F.pot} />}
      </SceneStage>

      {phase === "idle" && (
        <Row>
          <ActBtn tone="sand" onClick={() => setPhase("trash")}>سَلَّةُ القُمَامَةِ</ActBtn>
          <ActBtn onClick={toTreasure}>سَلَّةُ الكُنُوزِ</ActBtn>
        </Row>
      )}
      {phase === "trash" && (
        <>
          <Hint tone="bad">العُلْبَةُ دُفِنَتْ، وَكَانَ يُمْكِنُ أَنْ تَصِيرَ شَيْئًا جَدِيدًا.</Hint>
          <ActBtn tone="warm" onClick={() => setPhase("idle")}>أُحَاوِلُ مَرَّةً أُخْرَى</ActBtn>
        </>
      )}
      {phase === "pieces" && <Hint>العُلْبَةُ تَتَفَكَّكُ...</Hint>}
      {phase === "made" && (
        <>
          <Hint tone="good">صَارَتِ العُلْبَةُ أَصِيصًا، وَفِيهِ شَتْلَةٌ تَنْمُو.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ٢ — ترشيد الماء: الصنبور يقطر حتى يُغلقه الطفل
   ============================================================ */
function FaucetScene({ onDone }) {
  const [open, setOpen] = useState(true);
  const [wasted, setWasted] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    timer.current = setInterval(() => {
      setWasted((w) => (w >= 100 ? 100 : w + 3.5));
    }, 320);
    return () => clearInterval(timer.current);
  }, [open]);

  useEffect(() => { if (wasted >= 100) setOpen(false); }, [wasted]);

  const lost = wasted >= 100;
  const saved = Math.max(0, Math.round(100 - wasted));
  const reset = () => { setWasted(0); setOpen(true); };

  return (
    <>
      <SceneStage sky="#D9E9EF" soil="#E6D6BC">
        <Sprite alt={open ? "صنبور مفتوح" : "صنبور مغلق"} x={52} y={44} w={36} fallback={F.tap(open)} />
        {open && (
          <div style={{ position: "absolute", left: "62%", top: "41%", width: "4%", height: "36%", zIndex: 1 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                position: "absolute", left: 0, top: 0, width: "100%", paddingTop: "140%", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                background: "#7FC8C2", border: `2px solid ${INK}`, animation: `stageDrip 1.05s linear ${i * 0.35}s infinite`,
              }} />
            ))}
          </div>
        )}
        <Sprite alt="دلو" x={63} y={95} w={28} fallback={F.bucket(wasted >= 50)} />
        {!open && (
          <Sprite alt={lost ? "قطرة حزينة" : "قطرة سعيدة"} x={18} y={58} w={20} anim="pop" z={4} fallback={F.dropFace(lost)} />
        )}
      </SceneStage>

      <Meter value={wasted} color={wasted > 70 ? c.bad : wasted > 35 ? c.warn : c.dustyInk} label="مَاءٌ ضَاعَ" />

      {open && <ActBtn tone="cool" onClick={() => setOpen(false)}>أُغْلِقُ المِحْبَسَ</ActBtn>}
      {!open && lost && (
        <>
          <Hint tone="bad">امْتَلَأَ العَدَّادُ، وَضَاعَ المَاءُ كُلُّهُ.</Hint>
          <ActBtn tone="warm" onClick={reset}>أُحَاوِلُ مَرَّةً أُخْرَى</ActBtn>
        </>
      )}
      {!open && !lost && (
        <>
          <Hint tone="good">أَغْلَقْتَهُ فِي وَقْتِهِ، فَحَفِظْتَ {saved}٪ مِنَ المَاءِ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ٣ — التنوّع الحيوي: كل كائن إلى بيئته
   الخلفية بانوراما: الجبل يمينًا، الواحة في الوسط، البحر يسارًا،
   بنفس ترتيب البطاقات تحتها.
   ============================================================ */
const HABITATS = {
  mountain: { name: "الجَبَلُ", x: 80 },
  oasis: { name: "الوَاحَةُ", x: 50 },
  sea: { name: "البَحْرُ", x: 20 },
};

const CREATURES = [
  { id: "ibex", name: "الوَعْلُ", home: "mountain", big: "ibexBig" },
  { id: "turtle", name: "السُّلَحْفَاةُ", home: "sea", big: "turtleBig" },
  { id: "palm", name: "النَّخْلَةُ", home: "oasis", big: "palmBig" },
];

function HabitatCard({ kind, onPick, wrong }) {
  const h = HABITATS[kind];
  return (
    <button
      type="button"
      onClick={onPick}
      style={{
        flex: "1 1 0", maxWidth: 150, minWidth: 0, border: `3px solid ${wrong ? c.bad : INK}`, borderRadius: 16,
        background: c.paper, padding: 5, cursor: "pointer", touchAction: "manipulation",
        boxShadow: "0 4px 0 rgba(91,54,38,.28)", transition: `border-color .25s, transform .25s ${ease}`,
        transform: wrong ? "translateX(-5px)" : "none",
      }}
    >
      <div style={{ display: "block", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: 11 }}>
        {F.habitatCard(kind)}
      </div>
      <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: c.ink, padding: "4px 0 2px", fontFamily: font.display }}>
        {h.name}
      </span>
    </button>
  );
}

function HabitatScene({ onDone }) {
  const [i, setI] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [placed, setPlaced] = useState(false);
  const [homed, setHomed] = useState([]);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  const cur = CREATURES[i];

  const pick = (kind) => {
    if (placed) return;
    if (kind !== cur.home) { setWrong(kind); t.current = setTimeout(() => setWrong(null), 600); return; }
    setPlaced(true);
    t.current = setTimeout(() => {
      setHomed((h) => [...h, cur]);
      if (i + 1 < CREATURES.length) { setI(i + 1); setPlaced(false); }
      else onDone();
    }, 900);
  };

  const target = HABITATS[cur.home].x;

  return (
    <>
      <SceneStage sky="#D6EAF0" soil="#E9D6AE">
        {homed.map((h) => (
          <Sprite key={h.id} alt={h.name} x={HABITATS[h.home].x} y={94} w={20} z={2} fallback={F[h.big]} />
        ))}
        <Sprite
          key={cur.id} alt={cur.name}
          x={placed ? target : 50} y={placed ? 94 : 62} w={placed ? 20 : 34} z={3}
          anim={placed ? "" : "bob"}
          fallback={F[cur.big]}
        />
      </SceneStage>

      <Hint>أَيْنَ يَعِيشُ <b style={{ color: c.ink }}>{cur.name}</b>؟</Hint>

      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 520, justifyContent: "center" }}>
        {Object.keys(HABITATS).map((k) => (
          <HabitatCard key={k} kind={k} wrong={wrong === k} onPick={() => pick(k)} />
        ))}
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {CREATURES.map((_, idx) => (
          <span key={idx} style={{ width: 9, height: 9, borderRadius: "50%", background: idx <= i ? c.sageDeep : c.line }} />
        ))}
      </div>
    </>
  );
}

/* ============================================================
   ٤ — سخونة الأرض: الشتلات تُبرّد الميزان
   ============================================================ */
function WarmScene({ onDone }) {
  const [trees, setTrees] = useState(0);
  const heat = 100 - trees * 32;
  const cool = trees >= 3;
  const earthState = cool ? 2 : trees >= 1 ? 1 : 0;
  const heatLayer = (
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
      background: "radial-gradient(circle at 80% 18%, rgba(230,100,34,.55), rgba(230,100,34,0) 60%)",
      opacity: Math.max(0, heat) / 100, transition: `opacity .8s ${ease}`,
    }} />
  );

  return (
    <>
      <SceneStage sky="#F6E3CF" soil="#DDBB8C" overlay={heatLayer}>
        <Sprite alt="الشمس" x={80} y={40} w={24} fallback={F.sun(!cool)} />
        <Sprite alt="حالة الأرض" x={30} y={58} w={34} anim="bob" z={3} fallback={F.earthMound(earthState)} />
        {[0, 1, 2].map((n) => n < trees && (
          <Sprite key={n} alt="شتلة"
            x={58 + n * 15} y={95} w={cool ? 18 : 13} anim="pop" fallback={F.plant(cool)} />
        ))}
      </SceneStage>

      <Meter value={heat} color={cool ? c.good : heat > 66 ? c.bad : c.warn} label="حَرَارَةُ الأَرْضِ" />

      {!cool && <ActBtn onClick={() => setTrees((x) => x + 1)}>أَزْرَعُ شَتْلَةً</ActBtn>}
      {cool && (
        <>
          <Hint tone="good">ثَلَاثُ شَتَلَاتٍ خَفَّضَتِ الحَرَارَةَ، وَابْتَسَمَتِ الأَرْضُ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ٥ — التلوّث: الساحة تُنظَّف فتصفو السماء
   ============================================================ */
const LITTER = [
  { kind: "can", x: 16, y: 90, w: 9, r: -14 },
  { kind: "banana", x: 34, y: 96, w: 14, r: 8 },
  { kind: "tuna", x: 52, y: 88, w: 11, r: -6 },
  { kind: "apple", x: 70, y: 95, w: 9, r: 12 },
  { kind: "jar", x: 86, y: 90, w: 9, r: -18 },
];

function CollectScene({ onDone }) {
  const [left, setLeft] = useState(LITTER.map((_, i) => i));
  const ratio = left.length / LITTER.length;
  const smog = (
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
      background: "linear-gradient(rgba(120,108,96,.75), rgba(150,138,120,.35) 60%, rgba(150,138,120,0))",
      opacity: ratio, transition: `opacity .8s ${ease}`,
    }} />
  );

  return (
    <>
      <SceneStage sky="#D6E8EE" soil="#E5D2AC" overlay={smog}>
        {LITTER.map((p, i) => left.includes(i) && (
          <Sprite key={i} alt="قمامة" label="أجمع هذه القطعة" x={p.x} y={p.y} w={p.w} z={3}
            style={{ rotate: `${p.r}deg` }} onClick={() => setLeft((l) => l.filter((x) => x !== i))} fallback={F.litter(p.kind)} />
        ))}
        {left.length === 0 && <Sprite alt="عصفور" x={66} y={40} w={18} anim="pop" fallback={F.bird} />}
      </SceneStage>

      {left.length > 0 && <Hint>بَقِيَتْ {left.length} قِطَعٍ. اُنْقُرْ عَلَيْهَا لِتَجْمَعَهَا.</Hint>}
      {left.length === 0 && (
        <>
          <Hint tone="good">صَفَتِ السَّمَاءُ، وَعَادَ العُصْفُورُ إِلَى السَّاحَةِ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ٦ — الاستدامة: النخلة تبقى إن أخذنا قدر حاجتنا
   ============================================================ */
function PalmScene({ onDone }) {
  const [choice, setChoice] = useState(null); // null | all | enough
  const [season, setSeason] = useState(0);

  const dates = choice === null ? 8 : choice === "all" ? 0 : season === 0 ? 6 : 8;

  return (
    <>
      <SceneStage sky="#DDEBE6" soil="#E6D0A4">
        <Sprite key={dates} alt="نخلة" x={52} y={97} w={50} fallback={F.palm(dates)} />
        <Sprite alt="أربعة أطفال" x={17} y={98} w={30} z={3} fallback={F.kids} />
        {choice && season === 0 && (
          <Sprite alt="سلة الرطب"
            x={85} y={97} w={20} anim="pop" z={3} fallback={F.basket(choice === "all" ? 8 : 2)} />
        )}
      </SceneStage>

      {choice === null && (
        <>
          <Hint>فِي النَّخْلَةِ ثَمَانِيَةُ رُطَبَاتٍ، وَحَوْلَهَا أَرْبَعَةُ أَطْفَالٍ.</Hint>
          <Row>
            <ActBtn tone="sand" onClick={() => setChoice("all")}>آخُذُ الكُلَّ</ActBtn>
            <ActBtn onClick={() => setChoice("enough")}>آخُذُ رُطَبَتَيْنِ</ActBtn>
          </Row>
        </>
      )}
      {choice === "all" && (
        <>
          <Hint tone="bad">أَخَذْتَ كُلَّ شَيْءٍ، فَلَمْ يَبْقَ لِأَصْدِقَائِكَ وَلَا لِلْمَوْسِمِ القَادِمِ.</Hint>
          <ActBtn tone="warm" onClick={() => setChoice(null)}>أُحَاوِلُ مَرَّةً أُخْرَى</ActBtn>
        </>
      )}
      {choice === "enough" && season === 0 && (
        <>
          <Hint tone="good">أَخَذْتَ قَدْرَ حَاجَتِكَ، وَبَقِيَ لِلْبَقِيَّةِ سِتُّ رُطَبَاتٍ.</Hint>
          <ActBtn tone="cool" onClick={() => setSeason(1)}>أَنْتَظِرُ المَوْسِمَ القَادِمَ</ActBtn>
        </>
      )}
      {choice === "enough" && season === 1 && (
        <>
          <Hint tone="good">وَفِي المَوْسِمِ القَادِمِ عَادَتِ النَّخْلَةُ مُمْتَلِئَةً مِنْ جَدِيدٍ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ٧ — الهيدروجين الأخضر: شمس + ماء بحر = وقود بلا دخان
   ============================================================ */
function EnergyScene({ onDone }) {
  const [step, setStep] = useState(0); // 0 لا شيء · 1 شمس · 2 ماء · 3 تسير

  return (
    <>
      <SceneStage sky="#D9EBF1" soil="#E8D5AE">
        <Sprite alt="الشمس" x={84} y={34} w={20} fallback={F.sun(false)}
          style={{ opacity: step >= 1 ? 1 : 0.55 }} />
        <Sprite alt="لوح شمسي" x={76} y={86} w={24} fallback={F.panel(step >= 1)} />
        <Sprite alt="خزان ماء البحر" x={52} y={86} w={17} fallback={F.tank("#7FC8C2")}
          style={{ opacity: step >= 2 ? 1 : 0.6 }} />
        <Sprite alt="خزان الهيدروجين" x={33} y={86} w={14} fallback={F.tank("#D7EDE6")}
          anim={step === 2 ? "pop" : ""} style={{ opacity: step >= 2 ? 1 : 0.45 }} />
        <Sprite alt="سيارة" x={step >= 3 ? 8 : 16} y={98} w={30} z={3} fallback={F.car} />
      </SceneStage>

      {step === 0 && (<><Hint>اِبْدَأْ بِالشَّمْسِ لِتُشَغِّلَ اللَّوْحَ.</Hint><ActBtn tone="sand" onClick={() => setStep(1)}>أَلْمِسُ الشَّمْسَ</ActBtn></>)}
      {step === 1 && (<><Hint>اللَّوْحُ يَعْمَلُ. أَدْخِلْ مَاءَ البَحْرِ الآنَ.</Hint><ActBtn tone="cool" onClick={() => setStep(2)}>أُضِيفُ مَاءَ البَحْرِ</ActBtn></>)}
      {step === 2 && (<><Hint>الهِيدْرُوجِينُ جَاهِزٌ. شَغِّلِ السَّيَّارَةَ.</Hint><ActBtn onClick={() => setStep(3)}>أُشَغِّلُ السَّيَّارَةَ</ActBtn></>)}
      {step >= 3 && (
        <>
          <Hint tone="good">سَارَتِ السَّيَّارَةُ بِلَا دُخَانٍ، بِشَمْسِ عُمَانَ وَمَاءِ بَحْرِهَا.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ٨ — المحميات الطبيعية: السلحفاة تضع بيضها إن خفَّ النور
   ============================================================ */
function ReserveScene({ onDone }) {
  const [lightOn, setLightOn] = useState(true);
  const [nested, setNested] = useState(false);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  const turnOff = () => {
    setLightOn(false);
    t.current = setTimeout(() => setNested(true), 900);
  };

  return (
    <>
      <SceneStage sky={lightOn ? "#9FB0C2" : "#28334E"} soil="#D9C29A">
        <Sprite alt="عَمُودُ إِنَارَةٍ" x={16} y={92} w={16} fallback={F.beachLamp(lightOn)} />
        <Sprite alt="سُلَحْفَاةٌ" x={nested ? 56 : 74} y={94} w={30} anim={nested ? "" : "bob"} z={2} fallback={F.turtleBig} />
        {nested && (
          <div style={{ position: "absolute", left: "50%", top: "90%", display: "flex", gap: 5, zIndex: 3 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#F3EEE2", border: `2px solid ${INK}` }} />
            ))}
          </div>
        )}
      </SceneStage>

      {!nested && lightOn && <ActBtn onClick={turnOff}>أُطْفِئُ النُّورَ</ActBtn>}
      {!nested && !lightOn && <Hint>السُّلَحْفَاةُ تَتَّجِهُ إِلَى الرَّمْلِ الهَادِئِ...</Hint>}
      {nested && (
        <>
          <Hint tone="good">فِي الظَّلَامِ الهَادِئِ، وَضَعَتِ السُّلَحْفَاةُ بَيْضَهَا بِأَمَانٍ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ٩ — الكائنات المهددة بالانقراض: المها يعود إلى الصحراء
   ============================================================ */
function OryxScene({ onDone }) {
  const [released, setReleased] = useState(0);
  const done = released >= 3;

  return (
    <>
      <SceneStage sky="#F3E6C8" soil="#E6D0A4">
        <Sprite alt="بَوَّابَةُ المَحْمِيَّةِ" x={86} y={94} w={16} fallback={F.gate} />
        {Array.from({ length: released }).map((_, i) => (
          <Sprite key={i} alt="مَها عَرَبِيٌّ" x={24 + i * 24} y={96} w={26} anim="pop" z={2} fallback={F.oryx} />
        ))}
      </SceneStage>

      {!done && <ActBtn onClick={() => setReleased((n) => n + 1)}>أَفْتَحُ البَوَّابَةَ</ActBtn>}
      {!done && released > 0 && <Hint>عَادَ مَهًا جَدِيدٌ إِلَى الصَّحْرَاءِ.</Hint>}
      {done && (
        <>
          <Hint tone="good">عَادَ المَها إِلَى صَحْرَاءِ عُمَانَ، وَكَبِرَ قَطِيعُهُ مِنْ جَدِيدٍ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ١٠ — التصحّر: صفّ الشجيرات يوقف تقدّم الرمال
   ============================================================ */
function DesertScene({ onDone }) {
  const [trees, setTrees] = useState(0);
  const advance = Math.max(0, 100 - trees * 34);
  const stopped = trees >= 3;

  return (
    <>
      <SceneStage sky="#F3E6C8" soil="#E6D0A4">
        <Sprite key={trees} alt="كَثِيبٌ رَمْلِيٌّ" x={72} y={96} w={46 - trees * 10} z={1} fallback={F.dune} />
        {[0, 1, 2].map((n) => n < trees && (
          <Sprite key={n} alt="شُجَيْرَةٌ" x={28 + n * 14} y={96} w={16} anim="pop" z={2} fallback={F.plant(false)} />
        ))}
      </SceneStage>

      <Meter value={advance} color={stopped ? c.good : advance > 66 ? c.bad : c.warn} label="تَقَدُّمُ الرِّمَالِ" />

      {!stopped && <ActBtn onClick={() => setTrees((x) => x + 1)}>أَزْرَعُ شُجَيْرَةً</ActBtn>}
      {stopped && (
        <>
          <Hint tone="good">صَفُّ الشُّجَيْرَاتِ أَوْقَفَ الرِّمَالَ، وَبَقِيَتِ الأَرْضُ خَضْرَاءَ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ١١ — حماية الشعب المرجانية: المرساة تختار الرمل لا المرجان
   ============================================================ */
function ReefScene({ onDone }) {
  const [choice, setChoice] = useState(null); // null | reef | sand
  const dropped = choice !== null;

  return (
    <>
      <SceneStage sky="#BEE3EC" soil="#2E86A8">
        <Sprite alt="شُعَبٌ مَرْجَانِيَّةٌ" x={26} y={94} w={34} z={1} fallback={F.coral(choice === "reef")} />
        <Sprite alt="سَمَكَةٌ" x={70} y={55} w={20} anim="bob" z={1} fallback={F.fish} style={{ opacity: choice === "reef" ? 0.25 : 1 }} />
        <Sprite
          alt="مِرْسَاةٌ" x={choice === "reef" ? 26 : choice === "sand" ? 78 : 50} y={dropped ? 90 : 28} w={14}
          anim={dropped ? "pop" : "bob"} z={3} fallback={F.anchor}
        />
      </SceneStage>

      {!dropped && (
        <>
          <Hint>أَيْنَ يُرْسِي القَارِبُ مِرْسَاتَهُ؟</Hint>
          <Row>
            <ActBtn tone="sand" onClick={() => setChoice("reef")}>عَلَى الشُّعَبِ المَرْجَانِيَّةِ</ActBtn>
            <ActBtn onClick={() => setChoice("sand")}>عَلَى الرَّمْلِ النَّظِيفِ</ActBtn>
          </Row>
        </>
      )}
      {choice === "reef" && (
        <>
          <Hint tone="bad">انْكَسَرَ المَرْجَانُ، وَهَرَبَتِ الأَسْمَاكُ مِنْ بَيْتِهَا.</Hint>
          <ActBtn tone="warm" onClick={() => setChoice(null)}>أُحَاوِلُ مَرَّةً أُخْرَى</ActBtn>
        </>
      )}
      {choice === "sand" && (
        <>
          <Hint tone="good">رَسَتِ المِرْسَاةُ عَلَى الرَّمْلِ، وَبَقِيَ المَرْجَانُ وَالأَسْمَاكُ بِأَمَانٍ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

export const WORD_SCENES = {
  recycle: RecycleScene,
  faucet: FaucetScene,
  habitat: HabitatScene,
  warm: WarmScene,
  collect: CollectScene,
  palm: PalmScene,
  energy: EnergyScene,
  reserve: ReserveScene,
  oryx: OryxScene,
  desert: DesertScene,
  reef: ReefScene,
};
