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

  return (
    <>
      <Stage sky={phase === "made" ? "#DCEFE1" : "#E7F0F2"}>
        <rect x="0" y="118" width="220" height="22" fill={c.sage} />

        {phase === "idle" || phase === "trash" ? (
          <g className={phase === "trash" ? "" : "bob"} opacity={phase === "trash" ? ".45" : "1"}
             transform={phase === "trash" ? "translate(0 26)" : ""}>
            <rect x="96" y="52" width="28" height="48" rx="8" fill="#B9C6CE" stroke="#8697A1" strokeWidth="2.5" />
            <path d="M96 70 h28" stroke="#8697A1" strokeWidth="2.5" />
            <ellipse cx="110" cy="52" rx="14" ry="4.5" fill="#D3DDE3" stroke="#8697A1" strokeWidth="2.5" />
          </g>
        ) : null}

        {phase === "pieces" && (
          <g className="pop">
            <rect x="72" y="60" width="18" height="16" rx="4" fill="#B9C6CE" stroke="#8697A1" strokeWidth="2" transform="rotate(-18 81 68)" />
            <rect x="100" y="48" width="20" height="14" rx="4" fill="#C6D2D9" stroke="#8697A1" strokeWidth="2" transform="rotate(12 110 55)" />
            <rect x="128" y="66" width="16" height="18" rx="4" fill="#B9C6CE" stroke="#8697A1" strokeWidth="2" transform="rotate(24 136 75)" />
          </g>
        )}

        {phase === "made" && (
          <g className="pop">
            {/* أصيص من العلبة القديمة */}
            <path d="M92 84 L128 84 L123 118 L97 118 Z" fill="#C27650" stroke="#9A5535" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="88" y="76" width="44" height="10" rx="4" fill="#D08762" stroke="#9A5535" strokeWidth="2.5" />
            {/* شتلة */}
            <path d="M110 76 V56" stroke={c.good} strokeWidth="3.4" strokeLinecap="round" />
            <path d="M110 64 q-16 -4 -18 -16 q14 0 18 16Z" fill={c.good} opacity=".92" />
            <path d="M110 58 q16 -4 18 -16 q-14 0 -18 16Z" fill={c.good} opacity=".78" />
          </g>
        )}

        {/* السلّتان */}
        <g>
          <rect x="16" y="86" width="36" height="32" rx="6" fill="#E3D6B8" stroke="#BFA97C" strokeWidth="2.5" />
          <path d="M22 86 v-7 h24 v7" fill="none" stroke="#BFA97C" strokeWidth="2.5" />
          <rect x="168" y="86" width="36" height="32" rx="6" fill={c.goodSoft} stroke={c.good} strokeWidth="2.5" />
          <g stroke={c.good} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="186" cy="102" r="9" />
            <path d="M182 99 l4 -4 4 4M182 105 l4 4 4 -4" />
          </g>
        </g>
      </Stage>

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
      <Stage sky={open ? "#E2EEF2" : lost ? "#F0E2DC" : "#DCEFE1"}>
        {/* الحائط والحوض */}
        <rect x="0" y="112" width="220" height="28" fill={c.sage} />
        <path d="M74 112 q36 -22 72 0 Z" fill="#DCE6E8" stroke="#B7C4CE" strokeWidth="2.5" />
        {/* الصنبور */}
        <foreignObject x="80" y="18" width="56" height="56">
          <ImgFallback
            src={open ? "assets/img/dict-scenes/water-tap-drip.webp" : "assets/img/dict-scenes/water-tap-closed.webp"}
            alt={open ? "صنبور يقطر" : "صنبور مغلق"}
            style={{ width: 56, height: 56, objectFit: "contain" }}
            fallback={
              <svg viewBox="0 0 56 56" width="56" height="56">
                <g transform="translate(-64 -10)">
                  <rect x="100" y="34" width="12" height="26" rx="3" fill="#9FB0B8" stroke="#77878F" strokeWidth="2" />
                  <path d="M106 36 h26 v22" fill="none" stroke="#9FB0B8" strokeWidth="9" strokeLinecap="round" />
                  <path d="M106 36 h26 v22" fill="none" stroke="#C3D0D6" strokeWidth="4" strokeLinecap="round" />
                  <g style={{ transformOrigin: "106px 32px", transform: open ? "rotate(0deg)" : "rotate(92deg)", transition: `transform .5s ${ease}` }}>
                    <rect x="88" y="28" width="36" height="8" rx="4" fill={open ? c.accent : c.good} stroke="#7C4119" strokeWidth="1.6" />
                  </g>
                </g>
              </svg>
            }
          />
        </foreignObject>
        {/* القطرات */}
        {open && (
          <g fill="#4FA3BE">
            {[0, 1, 2].map((i) => (
              <ellipse key={i} cx="132" cy="62" rx="3.4" ry="4.6"
                style={{ animation: `dripFall 1.05s linear ${i * 0.35}s infinite` }} />
            ))}
          </g>
        )}
        {/* الدلو */}
        <foreignObject x="70" y="80" width="40" height="34">
          <ImgFallback
            src={wasted >= 50 ? "assets/img/dict-scenes/water-bucket-full.webp" : "assets/img/dict-scenes/water-bucket-empty.webp"}
            alt={wasted >= 50 ? "دلو ممتلئ" : "دلو فارغ"}
            style={{ width: 40, height: 34, objectFit: "contain" }}
            fallback={<rect x="0" y={34 - Math.min(16, wasted * 0.16)} width="40" height={Math.min(16, wasted * 0.16)} rx="3" fill="#8FC7D8" opacity=".85" />}
          />
        </foreignObject>
      </Stage>

      <Meter value={wasted} color={wasted > 70 ? c.bad : wasted > 35 ? c.warn : c.dustyInk} label="مَاءٌ ضَاعَ" />

      {open && <ActBtn tone="cool" onClick={() => setOpen(false)}>أُغْلِقُ المِحْبَسَ</ActBtn>}

      {!open && lost && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ImgFallback src="assets/img/dict-scenes/water-drop-sad.webp" alt="قطرة حزينة" width={48} height={48} fallback={null} />
          </div>
          <Hint tone="bad">امْتَلَأَ العَدَّادُ، وَضَاعَ المَاءُ كُلُّهُ.</Hint>
          <ActBtn tone="warm" onClick={reset}>أُحَاوِلُ مَرَّةً أُخْرَى</ActBtn>
        </>
      )}

      {!open && !lost && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ImgFallback src="assets/img/dict-scenes/water-drop-happy.webp" alt="قطرة سعيدة" width={48} height={48} fallback={null} />
          </div>
          <Hint tone="good">أَغْلَقْتَهُ فِي وَقْتِهِ، فَحَفِظْتَ {saved}٪ مِنَ المَاءِ.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ============================================================
   ٣ — التنوّع الحيوي: كل كائن إلى بيئته
   ============================================================ */
const HABITATS = {
  mountain: { name: "الجَبَلُ", sky: "#E3E9E4" },
  sea: { name: "البَحْرُ", sky: "#DCEAF0" },
  oasis: { name: "الوَاحَةُ", sky: "#E6EEDC" },
};

const CREATURES = [
  { id: "ibex", name: "الوَعْلُ", home: "mountain" },
  { id: "turtle", name: "السُّلَحْفَاةُ", home: "sea" },
  { id: "palm", name: "النَّخْلَةُ", home: "oasis" },
];

const HABITAT_CARD_IMG = {
  mountain: "assets/img/dict-scenes/bio-card-mountain.webp",
  sea: "assets/img/dict-scenes/bio-card-sea.webp",
  oasis: "assets/img/dict-scenes/bio-card-oasis.webp",
};

function HabitatCardArt({ kind }) {
  return (
    <svg viewBox="0 0 92 54" style={{ width: "100%", display: "block" }} aria-hidden="true">
      {kind === "mountain" && (
        <>
          <path d="M0 54 L26 20 L44 40 L62 14 L92 54 Z" fill="#C4B58E" stroke="#A89670" strokeWidth="2" strokeLinejoin="round" />
          <path d="M62 14 L70 24 L54 24 Z" fill="#EFEAD9" />
        </>
      )}
      {kind === "sea" && (
        <>
          <rect x="0" y="26" width="92" height="28" fill="#7FBBD2" />
          <g fill="none" stroke="#FFF" strokeWidth="2" opacity=".7" strokeLinecap="round">
            <path d="M8 36 q7 -5 14 0 t14 0" /><path d="M50 44 q7 -5 14 0 t14 0" />
          </g>
        </>
      )}
      {kind === "oasis" && (
        <>
          <rect x="0" y="40" width="92" height="14" fill="#DCCFA8" />
          <path d="M46 40 V22" stroke="#8A6A3E" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M46 24 q-16 -4 -20 -12 q16 0 20 12Z" fill="#5E8352" />
          <path d="M46 24 q16 -4 20 -12 q-16 0 -20 12Z" fill="#6E9460" />
          <ellipse cx="18" cy="44" rx="14" ry="5" fill="#8FC7D8" />
        </>
      )}
    </svg>
  );
}

function HabitatCard({ kind, onPick, wrong }) {
  const h = HABITATS[kind];
  return (
    <button
      type="button"
      onClick={onPick}
      style={{
        border: `2px solid ${wrong ? c.bad : c.line}`, borderRadius: 14, background: h.sky,
        padding: 0, overflow: "hidden", cursor: "pointer", width: 92, minHeight: 44,
        boxShadow: shadow.sm, transition: `border-color .25s, transform .25s ${ease}`,
        transform: wrong ? "translateX(-4px)" : "none",
      }}
    >
      <ImgFallback
        src={HABITAT_CARD_IMG[kind]} alt={h.name}
        style={{ width: "100%", height: 54, objectFit: "cover" }}
        fallback={<HabitatCardArt kind={kind} />}
      />
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: c.ink, padding: "5px 0 7px", fontFamily: font.body }}>
        {h.name}
      </span>
    </button>
  );
}

function HabitatScene({ onDone }) {
  const [i, setI] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [placed, setPlaced] = useState(false);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  const cur = CREATURES[i];

  const pick = (kind) => {
    if (placed) return;
    if (kind !== cur.home) { setWrong(kind); t.current = setTimeout(() => setWrong(null), 600); return; }
    setPlaced(true);
    t.current = setTimeout(() => {
      if (i + 1 < CREATURES.length) { setI(i + 1); setPlaced(false); }
      else onDone();
    }, 850);
  };

  return (
    <>
      <Stage sky={placed ? "#DCEFE1" : "#EDF1EA"} height={120}>
        <rect x="0" y="112" width="220" height="28" fill={c.sage} />
        <g transform="translate(110 70)">
          <g className={placed ? "pop" : "bob"}>
            {(cur.id === "ibex" || cur.id === "turtle") && (
              <foreignObject x="-24" y="-24" width="48" height="48">
                <ImgFallback
                  src={`assets/img/dict-scenes/bio-${cur.id}.webp`} alt={cur.name}
                  style={{ width: 48, height: 48, objectFit: "contain" }}
                  fallback={
                    cur.id === "ibex" ? (
                      <svg viewBox="-24 -24 48 48" width="48" height="48">
                        <g fill="none" stroke="#A2703F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M-18 26 L0 -14 L18 26 Z" />
                          <circle cx="14" cy="-8" r="5" />
                          <path d="M10 -13 q3 -8 10 -6M18 -13 q-3 -8 -10 -6" />
                        </g>
                      </svg>
                    ) : (
                      <svg viewBox="-24 -24 48 48" width="48" height="48">
                        <g fill="none" stroke="#2E6E8E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M-22 4 q0 -14 22 -14 t22 14 q0 14 -22 14 T-22 4Z" />
                          <circle cx="20" cy="-6" r="4.5" />
                          <path d="M-14 16 l-6 9M14 16 l6 9" />
                        </g>
                      </svg>
                    )
                  }
                />
              </foreignObject>
            )}
            {cur.id === "palm" && (
              <g>
                <path d="M0 28 V-6" stroke="#8A6A3E" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M0 -4 q-22 -6 -28 -18 q22 0 28 18Z" fill="#5E8352" />
                <path d="M0 -4 q22 -6 28 -18 q-22 0 -28 18Z" fill="#6E9460" />
                <path d="M0 -8 q-8 -18 2 -26 q8 12 -2 26Z" fill="#4E7345" />
              </g>
            )}
          </g>
        </g>
      </Stage>

      <Hint>أَيْنَ يَعِيشُ <b style={{ color: c.ink }}>{cur.name}</b>؟</Hint>

      <Row>
        {Object.keys(HABITATS).map((k) => (
          <HabitatCard key={k} kind={k} wrong={wrong === k} onPick={() => pick(k)} />
        ))}
      </Row>

      <div style={{ display: "flex", gap: 6 }}>
        {CREATURES.map((_, idx) => (
          <span key={idx} style={{ width: 8, height: 8, borderRadius: "50%", background: idx <= i ? c.sageDeep : c.line }} />
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
  const earthColor = cool ? "#5E8352" : trees === 2 ? "#8A8A4E" : trees === 1 ? "#A87A42" : "#B85C35";

  return (
    <>
      <Stage sky={cool ? "#DCEFE1" : trees === 2 ? "#EDEFDC" : trees === 1 ? "#F3E8D6" : "#F6DFD4"}>
        {/* الشمس */}
        <circle cx="188" cy="26" r="15" fill={cool ? "#F0C86A" : "#E8894F"} style={{ transition: `fill .6s ${ease}` }} />
        {/* الأرض */}
        <g transform="translate(66 46)">
          <foreignObject x="-32" y="-32" width="64" height="64">
            <ImgFallback
              src={cool ? "assets/img/dict-scenes/warm-earth-happy.webp" : trees >= 1 ? "assets/img/dict-scenes/warm-earth-better.webp" : "assets/img/dict-scenes/warm-earth-hot.webp"}
              alt="حالة الأرض"
              style={{ width: 64, height: 64, objectFit: "contain" }}
              fallback={
                <svg viewBox="-32 -32 64 64" width="64" height="64">
                  <circle cx="0" cy="0" r="30" fill={earthColor} style={{ transition: `fill .6s ${ease}` }} />
                  <path d="M-18 -8 q8 -7 16 0 q8 7 16 0" fill="none" stroke="#FFF" strokeWidth="2.4" opacity=".55" strokeLinecap="round" />
                  {cool
                    ? <path d="M-11 8 q11 10 22 0" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
                    : <path d="M-11 12 q11 -8 22 0" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />}
                  <circle cx="-10" cy="-2" r="2.6" fill="#FFF" />
                  <circle cx="10" cy="-2" r="2.6" fill="#FFF" />
                </svg>
              }
            />
          </foreignObject>
        </g>
        {/* الأرضية والشتلات */}
        <rect x="0" y="112" width="220" height="28" fill={c.sage} />
        {[0, 1, 2].map((n) =>
          n < trees ? (
            <g key={n} transform={`translate(${128 + n * 30} 112)`} style={{ transformOrigin: "bottom", animation: `grow .5s ${ease} both` }}>
              <path d="M0 0 V-22" stroke="#7A5B33" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="-28" r="11" fill={c.good} opacity=".9" />
            </g>
          ) : null
        )}
      </Stage>

      <Meter value={heat} color={cool ? c.good : heat > 66 ? c.bad : c.warn} label="حَرَارَةُ الأَرْضِ" />

      {!cool && <ActBtn onClick={() => setTrees((t) => t + 1)}>أَزْرَعُ شَتْلَةً</ActBtn>}
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
  { x: 30, y: 104, r: -12 }, { x: 62, y: 116, r: 18 }, { x: 96, y: 100, r: 6 },
  { x: 130, y: 118, r: -22 }, { x: 160, y: 104, r: 14 },
];

function CollectScene({ onDone }) {
  const [left, setLeft] = useState(LITTER.map((_, i) => i));
  const ratio = left.length / LITTER.length;
  const sky = ratio > 0.6 ? "#E6E2D4" : ratio > 0.2 ? "#E8EDE4" : "#DCEFE1";

  return (
    <>
      <Stage sky={sky}>
        <rect x="0" y="120" width="220" height="20" fill={c.sage} />
        {/* السلة */}
        <g transform="translate(190 92)">
          <rect x="-16" y="0" width="32" height="28" rx="6" fill={c.goodSoft} stroke={c.good} strokeWidth="2.5" />
          <path d="M-11 0 v-6 h22 v6" fill="none" stroke={c.good} strokeWidth="2.5" />
        </g>
        {/* عصفور يظهر بعد التنظيف */}
        {left.length === 0 && (
          <g transform="translate(150 36)">
            <g className="pop">
              <path d="M-14 0 q7 -9 14 -9 t14 9 q-7 -3 -14 -1 -7 -2 -14 1Z" fill={c.dustyInk} />
            </g>
          </g>
        )}
        {/* القمامة */}
        {LITTER.map((p, i) =>
          left.includes(i) ? (
            <g
              key={i}
              transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}
              style={{ cursor: "pointer" }}
              onClick={() => setLeft((l) => l.filter((x) => x !== i))}
            >
              <rect x="-16" y="-14" width="32" height="28" fill="transparent" />
              <rect x="-9" y="-6" width="18" height="12" rx="3" fill="#C8B79A" stroke="#A08E6E" strokeWidth="2" />
              <path d="M-9 -1 h18" stroke="#A08E6E" strokeWidth="1.8" />
            </g>
          ) : null
        )}
      </Stage>

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
      <Stage sky={choice === "all" ? "#F0E2DC" : choice === "enough" && season === 1 ? "#DCEFE1" : "#EEF0E2"}>
        <rect x="0" y="116" width="220" height="24" fill="#DCCFA8" />
        {/* النخلة */}
        <g transform="translate(110 116)">
          <path d="M0 0 V-52" stroke="#8A6A3E" strokeWidth="7" strokeLinecap="round" />
          <path d="M0 -50 q-30 -8 -38 -24 q30 0 38 24Z" fill="#5E8352" />
          <path d="M0 -50 q30 -8 38 -24 q-30 0 -38 24Z" fill="#6E9460" />
          <path d="M0 -54 q-14 -26 2 -38 q14 20 -2 38Z" fill="#4E7345" />
          {/* الرطب */}
          {Array.from({ length: dates }).map((_, i) => (
            <circle key={i} className="pop"
              cx={-16 + (i % 4) * 11} cy={-40 + Math.floor(i / 4) * 10} r="4"
              fill={c.accent} />
          ))}
        </g>
        {/* الأطفال */}
        {[0, 1, 2, 3].map((n) => (
          <g key={n} transform={`translate(${26 + n * 16} 116)`}>
            <circle cx="0" cy="-16" r="5" fill={c.dusty} />
            <path d="M-6 0 q6 -12 12 0Z" fill={c.dustyInk} opacity=".8" />
          </g>
        ))}
      </Stage>

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
   ٧ — الهيدروجين الأخضر: شمس وماء بحر، فسيارة بلا دخان
   ============================================================ */
function EnergyScene({ onDone }) {
  const [step, setStep] = useState(0); // 0 لا شيء · 1 شمس · 2 ماء · 3 تسير

  return (
    <>
      <Stage sky={step >= 3 ? "#DCEFE1" : "#E4EEF2"}>
        {/* الشمس واللوح */}
        <circle cx="34" cy="26" r="14" fill={step >= 1 ? "#F0C86A" : "#D8DCD6"} style={{ transition: `fill .5s ${ease}` }} />
        {step >= 1 && (
          <g stroke="#F0C86A" strokeWidth="2.6" strokeLinecap="round">
            <path d="M34 4 v-2M14 26 h-2M54 26 h2M19 11 l-2 -2M49 11 l2 -2" />
          </g>
        )}
        <g transform="translate(24 54)">
          <rect x="0" y="0" width="42" height="26" rx="3" fill={step >= 1 ? "#4487AE" : "#C3CBC6"} stroke="#35617D" strokeWidth="2" style={{ transition: `fill .5s ${ease}` }} />
          <path d="M14 0 v26M28 0 v26M0 13 h42" stroke="#35617D" strokeWidth="1.4" opacity=".7" />
          <path d="M21 26 v10" stroke="#8697A1" strokeWidth="3" />
        </g>

        {/* البحر */}
        <path d="M0 108 h74 v32 H0Z" fill={step >= 2 ? "#4FA3BE" : "#B9C6CE"} style={{ transition: `fill .5s ${ease}` }} />
        <g fill="none" stroke="#FFF" strokeWidth="1.8" opacity=".6" strokeLinecap="round">
          <path d="M10 118 q7 -5 14 0 t14 0" />
        </g>

        {/* المحلّل */}
        <g transform="translate(92 62)">
          <rect x="0" y="0" width="36" height="46" rx="6" fill="#EDEFEA" stroke="#9AA79E" strokeWidth="2.5" />
          <text x="18" y="28" textAnchor="middle" fontSize="15" fontWeight="700" fill={step >= 2 ? c.good : "#B6BFB8"} fontFamily="monospace">H₂</text>
          {step >= 2 && [0, 1, 2].map((i) => (
            <circle key={i} cx={10 + i * 8} cy="40" r="3" fill={c.good} opacity=".8"
              style={{ animation: `dripFall 1.1s linear ${i * 0.3}s infinite reverse` }} />
          ))}
        </g>
        {/* الأنبوب من البحر إلى المحلّل */}
        <path d="M74 118 h10 v-32 h8" fill="none" stroke={step >= 2 ? "#4FA3BE" : "#C3CBC6"} strokeWidth="4" strokeLinecap="round" style={{ transition: `stroke .5s ${ease}` }} />

        {/* السيارة */}
        <g transform="translate(160 96)" style={{ animation: step >= 3 ? `drive 1.6s ${ease} forwards` : "none" }}>
          <path d="M-22 12 q2 -14 10 -14 h8 l8 -8 h10 q6 0 8 8 h6 q4 0 4 6 v8 Z" fill={c.good} stroke="#155234" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="-12" cy="14" r="6" fill="#3B4A3E" />
          <circle cx="16" cy="14" r="6" fill="#3B4A3E" />
        </g>
        <rect x="0" y="130" width="220" height="10" fill={c.sage} />
      </Stage>

      {step === 0 && (<><Hint>اِبْدَأْ بِالشَّمْسِ لِتُشَغِّلَ اللَّوْحَ.</Hint><ActBtn tone="sand" onClick={() => setStep(1)}>أَلْمِسُ الشَّمْسَ</ActBtn></>)}
      {step === 1 && (<><Hint>اللَّوْحُ يَعْمَلُ. أَدْخِلْ مَاءَ البَحْرِ الآنَ.</Hint><ActBtn tone="cool" onClick={() => setStep(2)}>أُضِيفُ مَاءَ البَحْرِ</ActBtn></>)}
      {step === 2 && (<><Hint>الهِيدْرُوجِينُ جَاهِزٌ. شَغِّلِ السَّيَّارَةَ.</Hint><ActBtn onClick={() => setStep(3)}>أُشَغِّلُ السَّيَّارَةَ</ActBtn></>)}
      {step === 3 && (
        <>
          <Hint tone="good">سَارَتِ السَّيَّارَةُ بِلَا دُخَانٍ، بِشَمْسِ عُمَانَ وَمَاءِ بَحْرِهَا.</Hint>
          <ActBtn onClick={onDone}>أُوَاصِلُ التَّعَلُّمَ</ActBtn>
        </>
      )}
    </>
  );
}

/* ── الفهرس ────────────────────────────────────────────── */
export const WORD_SCENES = {
  recycle: RecycleScene,
  faucet: FaucetScene,
  habitat: HabitatScene,
  warm: WarmScene,
  collect: CollectScene,
  palm: PalmScene,
  energy: EnergyScene,
};
