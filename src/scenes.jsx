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
      <SceneStage bg="bg-recycle.webp" sky="#DCEBEF" soil="#E9D3AE">
        <Sprite src="rec-trash-bin.webp" alt="سلة القمامة" x={18} y={96} w={26} fallback={F.bin("#8C8C84")} />
        <Sprite src="rec-treasure-bin.webp" alt="سلة الكنوز" x={82} y={96} w={26} fallback={F.bin("#7C8A2F")} />
        {phase !== "made" && phase !== "pieces" && (
          <Sprite src="assets/img/sort/waste-juice-can.webp" alt="علبة معدنية" x={can.x} y={can.y} w={can.w}
            anim={phase === "idle" ? "bob" : ""} style={{ opacity: can.o }} z={3} />
        )}
        {phase === "pieces" && <Sprite src="rec-pieces.webp" alt="العلبة تتفكك" x={50} y={70} w={34} anim="pop" fallback={F.pieces} />}
        {phase === "made" && <Sprite src="rec-pot.webp" alt="أصيص فيه شتلة" x={50} y={90} w={30} anim="pop" fallback={F.pot} />}
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
      <SceneStage bg="bg-faucet.webp" sky="#D9E9EF" soil="#E6D6BC">
        <Sprite src={open ? "water-tap-open.webp" : "water-tap-closed.webp"} alt={open ? "صنبور مفتوح" : "صنبور مغلق"}
          x={52} y={44} w={36} fallback={<img src={IMG + "water-tap-closed.webp"} alt="" style={{ width: "100%" }} />} />
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
        <Sprite src={wasted >= 50 ? "water-bucket-full.webp" : "water-bucket-empty.webp"} alt="دلو" x={63} y={95} w={28} />
        {!open && (
          <Sprite src={lost ? "water-drop-sad.webp" : "water-drop-happy.webp"} alt={lost ? "قطرة حزينة" : "قطرة سعيدة"}
            x={18} y={58} w={20} anim="pop" z={4} />
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
  { id: "ibex", name: "الوَعْلُ", home: "mountain", src: "bio-ibex.webp" },
  { id: "turtle", name: "السُّلَحْفَاةُ", home: "sea", src: "bio-turtle.webp" },
  { id: "palm", name: "النَّخْلَةُ", home: "oasis", src: "bio-palm.webp" },
];

const HABITAT_CARD_IMG = {
  mountain: "bio-card-mountain.webp",
  sea: "bio-card-sea.webp",
  oasis: "bio-card-oasis.webp",
};

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
      <img src={IMG + HABITAT_CARD_IMG[kind]} alt="" draggable="false" style={{ display: "block", width: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />
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
      <SceneStage bg="bg-habitat.webp" sky="#D6EAF0" soil="#E9D6AE">
        {homed.map((h) => (
          <Sprite key={h.id} src={h.src} alt={h.name} x={HABITATS[h.home].x} y={94} w={20} z={2} />
        ))}
        <Sprite
          key={cur.id} src={cur.src} alt={cur.name}
          x={placed ? target : 50} y={placed ? 94 : 62} w={placed ? 20 : 34} z={3}
          anim={placed ? "" : "bob"}
          fallback={<img src={IMG + "bio-ibex.webp"} alt="" style={{ width: "100%" }} />}
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
  const earth = cool ? "warm-earth-happy.webp" : trees >= 1 ? "warm-earth-better.webp" : "warm-earth-hot.webp";
  const heatLayer = (
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
      background: "radial-gradient(circle at 80% 18%, rgba(230,100,34,.55), rgba(230,100,34,0) 60%)",
      opacity: Math.max(0, heat) / 100, transition: `opacity .8s ${ease}`,
    }} />
  );

  return (
    <>
      <SceneStage bg="bg-warm.webp" sky="#F6E3CF" soil="#DDBB8C" overlay={heatLayer}>
        <Sprite src={cool ? "warm-sun-calm.webp" : "warm-sun-hot.webp"} alt="الشمس" x={80} y={40} w={24} fallback={F.sun(!cool)} />
        <Sprite src={earth} alt="حالة الأرض" x={30} y={58} w={34} anim="bob" z={3} />
        {[0, 1, 2].map((n) => n < trees && (
          <Sprite key={n} src={cool ? "warm-plant-4.webp" : "warm-plant-2.webp"} alt="شتلة"
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
  { src: "assets/img/sort/waste-juice-can.webp", x: 16, y: 90, w: 9, r: -14 },
  { src: "assets/img/sort/waste-banana-peel.webp", x: 34, y: 96, w: 14, r: 8 },
  { src: "assets/img/sort/waste-tuna-can.webp", x: 52, y: 88, w: 11, r: -6 },
  { src: "assets/img/sort/waste-apple-core.webp", x: 70, y: 95, w: 9, r: 12 },
  { src: "assets/img/sort/waste-glass-jar.webp", x: 86, y: 90, w: 9, r: -18 },
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
      <SceneStage bg="bg-collect.webp" sky="#D6E8EE" soil="#E5D2AC" overlay={smog}>
        {LITTER.map((p, i) => left.includes(i) && (
          <Sprite key={i} src={p.src} alt="قمامة" label="أجمع هذه القطعة" x={p.x} y={p.y} w={p.w} z={3}
            style={{ rotate: `${p.r}deg` }} onClick={() => setLeft((l) => l.filter((x) => x !== i))} />
        ))}
        {left.length === 0 && <Sprite src="collect-bird.webp" alt="عصفور" x={66} y={40} w={18} anim="pop" fallback={F.bird} />}
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
  const palm = dates === 8 ? "palm-full.webp" : dates === 6 ? "palm-half.webp" : "palm-empty.webp";

  return (
    <>
      <SceneStage bg="bg-palm.webp" sky="#DDEBE6" soil="#E6D0A4">
        <Sprite key={palm} src={palm} alt="نخلة" x={52} y={97} w={50} fallback={F.palm(dates)} />
        <Sprite src="palm-kids.webp" alt="أربعة أطفال" x={17} y={98} w={30} z={3} fallback={null} />
        {choice && season === 0 && (
          <Sprite src={choice === "all" ? "basket-full.webp" : "basket-some.webp"} alt="سلة الرطب"
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
      <SceneStage bg="bg-energy.webp" sky="#D9EBF1" soil="#E8D5AE">
        <Sprite src={step >= 1 ? "h2-sun-on.webp" : "h2-sun-off.webp"} alt="الشمس" x={84} y={34} w={20} fallback={F.sun(false)}
          style={{ opacity: step >= 1 ? 1 : 0.55 }} />
        <Sprite src={step >= 1 ? "h2-panel-on.webp" : "h2-panel-off.webp"} alt="لوح شمسي" x={76} y={86} w={24} fallback={F.panel(step >= 1)} />
        <Sprite src="h2-seawater.webp" alt="خزان ماء البحر" x={52} y={86} w={17} fallback={F.tank("#7FC8C2")}
          style={{ opacity: step >= 2 ? 1 : 0.6 }} />
        <Sprite src="h2-tank.webp" alt="خزان الهيدروجين" x={33} y={86} w={14} fallback={F.tank("#D7EDE6")}
          anim={step === 2 ? "pop" : ""} style={{ opacity: step >= 2 ? 1 : 0.45 }} />
        <Sprite src={step >= 3 ? "h2-car-go.webp" : "h2-car-stop.webp"} alt="سيارة" x={step >= 3 ? 8 : 16} y={98} w={30} z={3} fallback={F.car} />
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

export const WORD_SCENES = {
  recycle: RecycleScene,
  faucet: FaucetScene,
  habitat: HabitatScene,
  warm: WarmScene,
  collect: CollectScene,
  palm: PalmScene,
  energy: EnergyScene,
};
