/* ============================================================
   مغامرة «كود الخصم ينتهي الليلة!» — محطة مسقط

   قصة تفاعلية بأربع نهايات، تتخلّلها ألعاب قصيرة: عدسة المحقق
   لكشف حيل الإعلان، ميزان الأسابيع، ومفتاح الجدّ. تشارك المحفظة
   والمندوس ودكّان الزينة نفسها مع لعبة «أحتاجه أم أريده؟» عبر
   profile.needsWants، وتحفظ تقدّمها الخاص فى profile.discountCode.

   لا صوت فى هذه النسخة (لا أداة توليد أو تسجيل صوت متاحة)،
   فالتغذية الراجعة كلها بصرية ونصية.
   ============================================================ */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { c, shadow, font, ease } from "./theme.js";
import { Salim, SalimSays, Glyph, IconChip } from "./art.jsx";
import { GameFrame, Btn, WinCard, MarketIcon } from "./games.jsx";
import { Coins, Dates, CoinDecision, Shop, MandoosOpen } from "./needsWants.jsx";
import {
  discountConfig, discountHeroes, discountAdBeats, discountDecisions, discountEndings,
  discountTricks, discountKeyTeeth, discountKeyMiniAds, discountQuiz, discountTexts as T,
} from "./content.js";

const isF = (p) => !!p && p.gender === "f";
const pick = (p, m, f) => (isF(p) ? (f || m) : m);
const pickH = (heroGender, m, f) => (heroGender === "f" ? (f || m) : m);
const ar = (n) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
const shuffle = (a) => {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
};

/* ============================================================
   أيقونات المغامرة
   ============================================================ */
const DC_SHAPES = {
  moneyBox: (
    <g>
      <rect x="8" y="17" width="32" height="23" rx="4" fill="#C9633B" stroke="#8A431E" strokeWidth="1.6" />
      <rect x="8" y="17" width="32" height="7" fill="#B33D24" stroke="#8A431E" strokeWidth="1" />
      <rect x="19" y="10" width="10" height="8" rx="2" fill="#8A431E" />
      <ellipse cx="24" cy="20.5" rx="5" ry="2" fill="#5A2E15" />
    </g>
  ),
  moonIcon: (
    <path d="M30 6a17 17 0 100 34c-6-2-11-9-11-17s5-15 11-17Z" fill="#F0E4B0" stroke="#C9A85A" strokeWidth="1.4" />
  ),
  footballIcon: (
    <g>
      <circle cx="24" cy="24" r="17" fill="#F4EAD7" stroke="#3A3F42" strokeWidth="1.6" />
      <path d="M24 15l6 4-2 7h-8l-2-7Z" fill="#3A3F42" />
      <path d="M24 7v8M9 24h8M39 24h-8M15.5 13.5l4.5 5.5M32.5 13.5l-4.5 5.5M15.5 34.5l4.5-5.5M32.5 34.5l-4.5-5.5M24 33v8"
        stroke="#3A3F42" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </g>
  ),
  ballBig: (
    <g>
      <circle cx="24" cy="24" r="19" fill="#FF4FA3" stroke="#B3006B" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="19" fill="url(#dcBallShine)" opacity=".5" />
      <path d="M14 12l3 3M34 12l-3 3M10 24h4M34 24h4" stroke="#FFD23F" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="18" cy="18" r="4" fill="#fff" opacity=".55" />
    </g>
  ),
  ballSmall: (
    <g>
      <circle cx="24" cy="24" r="11" fill="#C98CAE" stroke="#8A5470" strokeWidth="1.5" />
      <circle cx="21" cy="21" r="2.4" fill="#fff" opacity=".4" />
    </g>
  ),
  key: (
    <g>
      <circle cx="13" cy="24" r="7.5" fill="none" stroke="#C9863A" strokeWidth="3" />
      <path d="M19 24h21M32 24v7M38 24v5" stroke="#C9863A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  ),
  magnifier: (
    <g>
      <circle cx="18" cy="18" r="11" fill="rgba(255,255,255,.18)" stroke="#3A3F42" strokeWidth="3" />
      <path d="M26.5 26.5 39 39" stroke="#3A3F42" strokeWidth="4.5" strokeLinecap="round" />
    </g>
  ),
  craftsman: (
    <g>
      <circle cx="18" cy="12" r="5" fill="#EFD0AB" stroke="#B5824F" strokeWidth="1.4" />
      <path d="M9 32c0-8 4-13 9-13s9 5 9 13Z" fill="#8FA8C4" stroke="#3E5A7A" strokeWidth="1.4" />
      <rect x="26" y="24" width="16" height="4" rx="1.5" fill="#8A6A3E" transform="rotate(-25 34 26)" />
    </g>
  ),
};
function DCIcon({ icon, size = 40 }) {
  if (icon === "toyWood") return <MarketIcon icon="toyWood" size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" style={{ filter: "drop-shadow(0 3px 5px rgba(34,48,31,.22))" }}>
      <defs>
        <radialGradient id="dcBallShine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".8" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {DC_SHAPES[icon] || DC_SHAPES.moneyBox}
    </svg>
  );
}

/* ============================================================
   عناصر مشتركة صغيرة
   ============================================================ */
function Card({ children, style }) {
  return <div style={{ background: c.paper, borderRadius: 18, padding: 16, boxShadow: shadow.sm, ...style }}>{children}</div>;
}

function AdFrame({ children, onClickFrame }) {
  return (
    <div style={{ borderRadius: 20, padding: 4, background: "linear-gradient(135deg,#FF4FA3,#FFD23F,#3FE0D0)" }}>
      <div
        onClick={onClickFrame}
        style={{
          borderRadius: 16, background: "#1B1030", padding: "22px 16px", textAlign: "center",
          position: "relative", minHeight: 220, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", gap: 12, overflow: "hidden",
        }}
      >
        <span style={{ position: "absolute", top: 8, insetInlineStart: 10, fontSize: 9, color: "rgba(255,255,255,.45)", fontFamily: font.body }}>
          {T.adLabel}
        </span>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   ١ — اختيار البطل
   ============================================================ */
function HeroPick({ profile, onPick, onExit }) {
  return (
    <GameFrame title={T.place} goal={pick(profile, T.pickHero, T.pickHero)} hint={pick(profile, T.salimIntro, T.salimIntro)} hintMood="ask" onExit={onExit}>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        {discountHeroes.map((h) => (
          <button
            key={h.id} type="button" onClick={() => onPick(h)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "22px 10px",
              borderRadius: 18, border: `1px solid ${c.line}`, background: c.paper, cursor: "pointer", minHeight: 44, boxShadow: shadow.sm,
            }}
          >
            <IconChip bg={c.sage} size={64} radius={22}>
              <Glyph name={h.gender === "f" ? "star" : "check"} size={30} color={c.sageDeep} />
            </IconChip>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 19, color: c.ink }}>{h.name}</span>
          </button>
        ))}
      </div>
    </GameFrame>
  );
}

/* ============================================================
   ٢ — اختبار الصور القصير (قبلي وبعدي)
   ============================================================ */
function MiniQuiz({ profile, grade34, onFinish, onExit }) {
  const list = useMemo(() => shuffle(discountQuiz.filter((q) => grade34 || !q.grades34Only)), [grade34]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [waitChoice, setWaitChoice] = useState(null);
  const [weekPick, setWeekPick] = useState(null);
  const q = list[i];

  const advance = (correct, isWait) => {
    const nextScore = score + (correct ? 1 : 0);
    if (isWait !== undefined) setWaitChoice(isWait);
    if (i + 1 >= list.length) onFinish({ score: nextScore, waitChoice: isWait !== undefined ? isWait : waitChoice, total: list.length });
    else { setScore(nextScore); setI(i + 1); }
  };

  const bags = q && q.kind === "weeks" ? Math.ceil(q.price / q.weekly) + 2 : 0;

  return (
    <GameFrame title={T.place} goal={T.quizIntro} score={`${ar(i + 1)}/${ar(list.length)}`} hint={q.prompt} hintMood="ask" onExit={onExit}>
      {q.kind === "weeks" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {Array.from({ length: bags }).map((_, idx) => (
              <button
                key={idx} type="button" onClick={() => advance(idx + 1 === q.correct, undefined)}
                style={{
                  width: 52, height: 52, borderRadius: 14, border: `2px solid ${c.line}`, background: c.paper,
                  fontFamily: font.display, fontWeight: 700, fontSize: 17, color: c.ink, cursor: "pointer", minHeight: 44,
                }}
              >
                {ar(idx + 1)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr" }}>
          {["a", "b"].map((side) => (
            <button
              key={side} type="button"
              onClick={() => advance(q.kind === "trick" ? side === q.answer : true, q.kind === "decision" ? side === "b" : undefined)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 8px",
                borderRadius: 18, border: `1px solid ${c.line}`, background: c.paper, cursor: "pointer", minHeight: 44, boxShadow: shadow.sm,
              }}
            >
              <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 14, color: c.ink, textAlign: "center", lineHeight: 1.5 }}>{q[side].label}</span>
            </button>
          ))}
        </div>
      )}
    </GameFrame>
  );
}

/* ============================================================
   ٣ — مشهد الإعلان
   ============================================================ */
function AdScene({ profile, onDone, onExit }) {
  const [i, setI] = useState(0);
  const beat = discountAdBeats[i];
  const next = () => { if (i + 1 >= discountAdBeats.length) onDone(); else setI((n) => n + 1); };
  return (
    <GameFrame title={T.place} goal={pick(profile, T.watchAd, T.watchAdF)} hint="" onExit={onExit}>
      <AdFrame>
        {beat.speaker && <p style={{ margin: 0, color: "#FFD23F", fontFamily: font.display, fontWeight: 700, fontSize: 13 }}>{beat.speaker}</p>}
        <p style={{ margin: 0, color: "#fff", fontFamily: font.display, fontWeight: 700, fontSize: 19, lineHeight: 1.7 }}>{beat.text}</p>
        {beat.priceReveal && (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "baseline" }}>
            <span style={{ color: "rgba(255,255,255,.5)", textDecoration: "line-through", fontSize: 18 }}>١٦</span>
            <span style={{ color: "#FFD23F", fontSize: 30, fontWeight: 700, fontFamily: font.display }}>١٢</span>
          </div>
        )}
        {beat.countdown && (
          <div style={{ fontFamily: font.display, fontSize: 24, color: "#FF4FA3", fontWeight: 700, letterSpacing: 2 }}>٠٣:٥٩:٥٩</div>
        )}
      </AdFrame>
      <Btn wide onClick={next}>{T.nextBeat}</Btn>
    </GameFrame>
  );
}

/* ============================================================
   ٤ — الركض إلى الأم
   ============================================================ */
function RunToMom({ profile, hero, onDone, onExit }) {
  const lines = [
    T.runToMom1, T.runToMom2,
    pickH(hero.gender, T.momLineM, T.momLineF),
    pick(profile, T.salimBeforeChoice, T.salimBeforeChoiceF),
  ];
  const [i, setI] = useState(0);
  const next = () => { if (i + 1 >= lines.length) onDone(); else setI((n) => n + 1); };
  return (
    <GameFrame title={T.place} goal={hero.name} hint={lines[i]} hintMood="ask" onExit={onExit}>
      <Card style={{ textAlign: "center", minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ margin: 0, fontFamily: font.display, fontSize: 16, lineHeight: 1.9, color: c.ink }}>{lines[i]}</p>
      </Card>
      <Btn wide onClick={next}>{T.nextBeat}</Btn>
    </GameFrame>
  );
}

/* ============================================================
   ٥ — القرار
   ============================================================ */
function DecisionScene({ profile, grade34, onChoose, onExit }) {
  const opts = discountDecisions.filter((d) => grade34 || !d.grades34Only);
  return (
    <GameFrame title={T.place} goal={pick(profile, T.chooseLabel, T.chooseLabelF)} hint={pick(profile, T.salimBeforeChoice, T.salimBeforeChoiceF)} hintMood="ask" onExit={onExit}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: opts.length > 3 ? "1fr 1fr" : "1fr" }}>
        {opts.map((d) => (
          <button
            key={d.id} type="button" onClick={() => onChoose(d)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", textAlign: "start",
              borderRadius: 16, border: `1px solid ${c.line}`, background: c.paper, cursor: "pointer", minHeight: 44, boxShadow: shadow.sm,
            }}
          >
            <DCIcon icon={d.icon} size={40} />
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 14.5, color: c.ink, lineHeight: 1.5 }}>{d.label}</span>
          </button>
        ))}
      </div>
    </GameFrame>
  );
}

/* ============================================================
   ٦ — النهايات
   ============================================================ */
function EndingScene({ profile, endingId, badgeDone, onTryAnother, onContinue, onBackToHub, onExit }) {
  const ending = discountEndings[endingId];
  const [i, setI] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const lines = ending.lines;
  const next = () => { if (i + 1 >= lines.length) setShowReveal(true); else setI((n) => n + 1); };

  return (
    <GameFrame title={ending.title} goal={ending.album} hint={showReveal ? ending.salimLine : lines[i]} hintMood={showReveal ? "smile" : "ask"} onExit={onExit}>
      {!showReveal ? (
        <>
          <Card style={{ textAlign: "center", minHeight: 100 }}>
            <p style={{ margin: 0, fontFamily: font.body, fontSize: 14.5, lineHeight: 1.9, color: c.ink }}>{lines[i]}</p>
          </Card>
          <Btn wide onClick={next}>{T.nextBeat}</Btn>
        </>
      ) : (
        <>
          {endingId === "smallBox" ? (
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <div style={{ background: "#2A1440", borderRadius: 16, padding: 14, textAlign: "center", flex: 1 }}>
                <DCIcon icon="ballBig" size={56} />
                <p style={{ margin: "6px 0 0", fontSize: 11, color: "#FFD23F", fontFamily: font.body }}>فِي الإِعْلَانِ</p>
              </div>
              <div style={{ background: c.paper, borderRadius: 16, padding: 14, textAlign: "center", flex: 1, boxShadow: shadow.sm }}>
                <DCIcon icon="ballSmall" size={56} />
                <p style={{ margin: "6px 0 0", fontSize: 11, color: c.inkFaint, fontFamily: font.body }}>فِي الصُّنْدُوقِ</p>
              </div>
            </div>
          ) : (
            <Card style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 15, color: c.accentInk, lineHeight: 1.8 }}>{ending.reveal}</p>
            </Card>
          )}
          <Card style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 13, color: c.inkSoft, fontFamily: font.body, lineHeight: 1.9 }}>{ending.weeksNote}</p>
          </Card>
          <p style={{ margin: 0, textAlign: "center", fontSize: 12, color: c.inkFaint, fontFamily: font.body }}>{pick(profile, T.afterEnding, T.afterEndingF)}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn onClick={onTryAnother} tone="cool">{T.tryAnother}</Btn>
            {!badgeDone ? <Btn onClick={onContinue} tone="warm">{T.continueWithGrandpa}</Btn> : <Btn onClick={onBackToHub}>{T.endingsAlbum}</Btn>}
          </div>
        </>
      )}
    </GameFrame>
  );
}

/* ============================================================
   ٧ — عدسة المحقق
   ============================================================ */
const TRICK_POS = {
  countdown: { top: "10%", insetInlineStart: "8%" },
  tonight: { bottom: "8%", insetInlineStart: "10%" },
  everyone: { top: "38%", insetInlineEnd: "6%" },
  strikethrough: { top: "62%", insetInlineStart: "40%" },
  adLabel: { top: "6%", insetInlineEnd: "8%" },
};

function LensScene({ profile, tricks, onDone, onExit }) {
  const [found, setFound] = useState([]);
  const [explain, setExplain] = useState("");
  const [glowId, setGlowId] = useState(null);
  const [shakeAt, setShakeAt] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    const remaining = tricks.filter((t) => !found.includes(t.id));
    if (remaining.length === 0) return;
    timerRef.current = setTimeout(() => setGlowId(remaining[0].id), 20000);
    return () => clearTimeout(timerRef.current);
  }, [found, tricks]);

  const tap = (id) => {
    if (found.includes(id)) return;
    const next = [...found, id];
    setFound(next);
    setGlowId(null);
    setExplain(tricks.find((t) => t.id === id).explain);
    if (next.length >= tricks.length) setTimeout(onDone, 900);
  };
  const missTap = () => setShakeAt(Date.now());

  const allDone = found.length >= tricks.length;

  return (
    <GameFrame
      title={T.place} goal={pick(profile, T.lensGoal, T.lensGoalF)} score={`${ar(found.length)}/${ar(tricks.length)}`}
      hint={allDone ? pick(profile, T.lensDone, T.lensDoneF) : (explain || (glowId ? pick(profile, T.lensNudge, T.lensNudgeF) : ""))} hintMood={allDone ? "smile" : "ask"} onExit={onExit}
    >
      <AdFrame onClickFrame={missTap}>
        <p style={{ margin: 0, color: "#FFD23F", fontFamily: font.display, fontWeight: 700, fontSize: 13 }}>نَجْمُ العُلَبِ</p>
        <p style={{ margin: 0, color: "#fff", fontFamily: font.display, fontWeight: 700, fontSize: 17 }}>كُرَةُ المُفَاجَآتِ اللَّامِعَةُ!</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "baseline" }}>
          <span style={{ color: "rgba(255,255,255,.5)", textDecoration: "line-through", fontSize: 16 }}>١٦</span>
          <span style={{ color: "#FFD23F", fontSize: 24, fontWeight: 700, fontFamily: font.display }}>١٢</span>
        </div>
        {tricks.map((t) => (
          <button
            key={t.id} type="button"
            onClick={(e) => { e.stopPropagation(); tap(t.id); }}
            style={{
              position: "absolute", ...TRICK_POS[t.id], zIndex: 3, border: "none", borderRadius: 999,
              padding: "7px 12px", cursor: "pointer", minHeight: 40, fontFamily: font.body, fontSize: 11,
              fontWeight: 700, whiteSpace: "nowrap",
              background: found.includes(t.id) ? "#4E8B6E" : "rgba(255,255,255,.14)",
              color: found.includes(t.id) ? "#fff" : "rgba(255,255,255,.85)",
              boxShadow: glowId === t.id ? "0 0 0 4px rgba(255,210,63,.8)" : "none",
              animation: glowId === t.id ? "nwStreakGlow 1.2s ease-in-out infinite" : "none",
            }}
          >
            {found.includes(t.id) ? `✓ ${T.lensStamped}` : t.label}
          </button>
        ))}
      </AdFrame>
    </GameFrame>
  );
}

/* ============================================================
   ٨ — كم أسبوعًا؟
   ============================================================ */
function WeeksScene({ profile, grade34, onDone, onExit }) {
  const price = 12, weekly = 3, correct = 4;
  const [placed, setPlaced] = useState(0);
  const [picked, setPicked] = useState(null);
  const [firstTry, setFirstTry] = useState(true);
  const [done, setDone] = useState(false);

  const addBag = () => {
    const n = placed + 1;
    setPlaced(n);
    if (n * weekly >= price) setTimeout(() => setDone(true), 400);
  };
  const choose = (n) => {
    setPicked(n);
    if (n === correct) setTimeout(() => setDone(true), 500);
    else { setFirstTry(false); setTimeout(() => setPicked(null), 500); }
  };

  useEffect(() => { if (done) setTimeout(() => onDone({ firstTry }), 1400); }, [done]);

  return (
    <GameFrame title={T.place} goal={T.weeksIntro} hint={done ? pick(profile, T.weeksReflect, T.weeksReflectF) : T.weeksIntro.replace("؟", "") + ": " + "١٢ بِيسَةً، تَدَّخِرُ ٣ كُلَّ أُسْبُوعٍ"} hintMood={done ? "smile" : "ask"} onExit={onExit}>
      <Card style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <DCIcon icon="ballBig" size={44} />
          <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15 }}>{ar(price)} بِيسَةً</span>
        </div>

        <div style={{ width: "100%", height: 10, borderRadius: 99, background: c.lineSoft, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(100, (placed * weekly * 100) / price)}%`, background: c.sageDeep, transition: `width .4s ${ease}` }} />
        </div>

        {!grade34 ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <button
                key={idx} type="button" disabled={idx < placed || done} onClick={addBag}
                style={{
                  width: 50, height: 50, borderRadius: 12, border: `2px solid ${idx < placed ? c.sageDeep : c.line}`,
                  background: idx < placed ? c.sage : c.paper, cursor: idx < placed ? "default" : "pointer", minHeight: 44,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}
              >
                👝
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[2, 3, 4, 6].map((n) => (
              <button
                key={n} type="button" onClick={() => choose(n)} disabled={done}
                style={{
                  width: 54, height: 54, borderRadius: 14, cursor: "pointer", minHeight: 44,
                  border: `2px solid ${picked === n ? c.bad : c.line}`, background: picked === n ? c.badSoft : c.paper,
                  fontFamily: font.display, fontWeight: 700, fontSize: 18, color: c.ink,
                }}
              >
                {ar(n)}
              </button>
            ))}
          </div>
        )}
        {done && <p style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 16, color: c.good }}>{ar(correct)} أَسَابِيعَ!</p>}
      </Card>
    </GameFrame>
  );
}

/* ============================================================
   ٩ — مفتاح الجدّ
   ============================================================ */
function KeyScene({ profile, teeth, onDone, onExit }) {
  const [revealed, setRevealed] = useState([]);
  const [turned, setTurned] = useState(false);
  const [miniIdx, setMiniIdx] = useState(0);
  const [miniDone, setMiniDone] = useState(false);

  const revealTooth = (id) => { if (!revealed.includes(id)) setRevealed((r) => [...r, id]); };

  if (miniDone) {
    return (
      <GameFrame title={T.place} hint={pick(profile, T.keyOutro, T.keyOutroF)} hintMood="smile" onExit={onExit}>
        <WinCard text={pick(profile, T.keyOutro, T.keyOutroF)} onDone={onDone} mood="smile" doneLabel={T.continueStory} />
      </GameFrame>
    );
  }

  if (turned) {
    const ad = discountKeyMiniAds[miniIdx];
    const next = () => { if (miniIdx + 1 >= discountKeyMiniAds.length) setMiniDone(true); else setMiniIdx((n) => n + 1); };
    return (
      <GameFrame title={T.place} goal={T.keyMiniIntro} score={`${ar(miniIdx + 1)}/${ar(discountKeyMiniAds.length)}`} hint={ad.label} hintMood="ask" onExit={onExit}>
        <Card style={{ textAlign: "center" }}>
          <DCIcon icon="moneyBox" size={48} />
          <p style={{ margin: "8px 0 0", fontFamily: font.display, fontWeight: 700, fontSize: 15 }}>{ad.label}</p>
        </Card>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={next}>{T.keyMiniWait}</Btn>
          <Btn onClick={next} tone="warm">{T.keyMiniBuy}</Btn>
        </div>
      </GameFrame>
    );
  }

  return (
    <GameFrame title={T.place} goal={T.keyIntro} hint={T.keyIntro} hintMood="ask" onExit={onExit}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {teeth.map((t) => (
          <button
            key={t.id} type="button" onClick={() => revealTooth(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", textAlign: "start",
              borderRadius: 14, border: `1px solid ${c.line}`, background: revealed.includes(t.id) ? c.sage : c.paper,
              cursor: "pointer", minHeight: 44,
            }}
          >
            <DCIcon icon="key" size={30} />
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 14, color: c.ink }}>
              {revealed.includes(t.id) ? t.q : "•••"}
            </span>
          </button>
        ))}
      </div>
      {revealed.length >= teeth.length && <Btn wide onClick={() => setTurned(true)}>أُدِيرُ المِفْتَاحَ</Btn>}
    </GameFrame>
  );
}

/* ============================================================
   ١٠ — الوسام (نصٌّ فقط، بلا خزانة أوسمة)
   ============================================================ */
function BadgeScene({ profile, stamped, onDone }) {
  return (
    <GameFrame title={T.badgeName} hint="" onExit={onDone}>
      <WinCard
        text={pick(profile, T.badgeLine, T.badgeLineF) + (stamped ? ` ${T.endingsStampLine}` : "")}
        onDone={onDone}
        doneLabel={T.continueStory}
      />
    </GameFrame>
  );
}

/* ============================================================
   ١١ — مرصد البيت
   ============================================================ */
function HomeMissionScene({ profile, tricks, mission, onSpot, onWaitDay, onConfirm, onExit }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const start = () => {
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / 3000);
      setProgress(p);
      if (p >= 1) { onConfirm(); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  const cancel = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); setProgress(0); };
  useEffect(() => () => cancel(), []);

  return (
    <GameFrame title={T.homeMissionTitle} hint={pick(profile, T.homeMissionBody, T.homeMissionBodyF)} hintMood="ask" onExit={onExit}>
      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))" }}>
        {tricks.map((t) => {
          const n = mission.tricksSpotted?.[t.id] || 0;
          return (
            <button
              key={t.id} type="button" onClick={() => onSpot(t.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 6px",
                borderRadius: 14, border: `1px solid ${c.line}`, background: n > 0 ? c.goodSoft : c.paper, cursor: "pointer", minHeight: 44,
              }}
            >
              <span style={{ fontFamily: font.display, fontSize: 12, fontWeight: 700, color: c.ink, textAlign: "center" }}>{t.label}</span>
              {n > 0 && <span style={{ fontSize: 11, color: c.good, fontFamily: font.display, fontWeight: 700 }}>×{ar(n)}</span>}
            </button>
          );
        })}
      </div>

      <Card style={{ textAlign: "center" }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, color: c.inkSoft, fontFamily: font.body, lineHeight: 1.9 }}>{pick(profile, T.waitChallenge, T.waitChallengeF)}</p>
        <Btn onClick={onWaitDay}>🌙 {T.waitedToday} ({ar(mission.waitDays || 0)})</Btn>
      </Card>

      {!mission.confirmed ? (
        <button
          type="button" onPointerDown={start} onPointerUp={cancel} onPointerLeave={cancel}
          style={{
            position: "relative", overflow: "hidden", border: "none", borderRadius: 16, padding: "16px 14px",
            background: c.accent, color: "#FFF", fontFamily: font.display, fontWeight: 700, fontSize: 14,
            cursor: "pointer", minHeight: 54,
          }}
        >
          <span style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.35)", width: `${progress * 100}%`, transition: "width .05s linear" }} />
          <span style={{ position: "relative" }}>{pick(profile, T.confirmHold, T.confirmHoldF)}</span>
        </button>
      ) : (
        <p style={{ margin: 0, textAlign: "center", fontFamily: font.display, fontWeight: 700, color: c.good }}>
          {pick(profile, T.homeMissionDone, T.homeMissionDoneF)}
        </p>
      )}
    </GameFrame>
  );
}

/* ============================================================
   ١٢ — مركز المغامرة (بعد أوّل إتمام)
   ============================================================ */
function Hub({ profile, dc, grade34, onReplay, onHomeMission, onFinal, onExit }) {
  const totalEndings = grade34 ? 4 : 3;
  return (
    <GameFrame title={T.place} goal={T.endingsAlbum} score={`${ar(dc.endings.length)}/${ar(totalEndings)}`} hint={pick(profile, T.badgeLine, T.badgeLineF)} hintMood="smile" onExit={onExit}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2, 1fr)" }}>
        {Object.keys(discountEndings).filter((id) => grade34 || !discountEndings[id].grades34Only).map((id) => {
          const found = dc.endings.includes(id);
          return (
            <div key={id} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px",
              borderRadius: 14, border: `1px solid ${c.line}`, background: found ? c.goodSoft : c.sage, opacity: found ? 1 : .5,
            }}>
              <DCIcon icon={id === "smallBox" ? "ballSmall" : id === "craftsman" ? "craftsman" : id === "endlessNight" ? "moonIcon" : "footballIcon"} size={36} />
              <span style={{ fontSize: 12, fontFamily: font.display, fontWeight: 700, color: c.ink, textAlign: "center" }}>
                {found ? discountEndings[id].album : "؟"}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Btn wide onClick={onReplay}>أُعِيدُ القِصَّةَ</Btn>
        <Btn wide onClick={onHomeMission} tone="warm">{T.homeMissionTitle}</Btn>
        <Btn wide onClick={onFinal} tone="cool">{T.badgeName}</Btn>
      </div>
    </GameFrame>
  );
}

/* ============================================================
   المكوّن الرئيس
   ============================================================ */
const emptyDC = () => ({
  hero: null, preQuiz: null, postQuiz: null, firstChoice: null, endings: [],
  tricks: { found: 0, withHelp: 0 }, weeksQuestion: null, key: false, badge: false,
  endingsStamp: false, homeMission: { tricksSpotted: {}, waitDays: 0, confirmed: false },
});
const emptyNW = () => ({ wallet: 0, mandoos: { amount: 0, levelsUntilOpen: 0 }, decor: [] });

export function DiscountCodeGame({ profile, onExit, onWin, onUpdateProfile }) {
  const dc = profile.discountCode || emptyDC();
  const nw = profile.needsWants || emptyNW();
  const grade = nw.grade || 1;
  const grade34 = grade >= 3;
  const cfg = grade34 ? discountConfig.grades34 : discountConfig.grades12;

  const patch = (dcPatch, nwPatch) => {
    const payload = { discountCode: { ...dc, ...dcPatch } };
    if (nwPatch) payload.needsWants = { ...nw, ...nwPatch };
    onUpdateProfile && onUpdateProfile(payload);
  };

  const [screen, setScreen] = useState(() => {
    if (!dc.hero) return "heroPick";
    if (!dc.preQuiz) return "prequiz";
    if (!dc.badge) return "ad";
    return "hub";
  });
  const [currentEndingId, setCurrentEndingId] = useState(null);
  const [sessionCoins, setSessionCoins] = useState(0);

  const heroObj = dc.hero ? discountHeroes.find((h) => h.id === dc.hero) : null;

  const onHeroPicked = (h) => { patch({ hero: h.id }); setScreen("prequiz"); };
  const onPreQuizDone = (res) => { patch({ preQuiz: { ...res, date: new Date().toISOString().slice(0, 10) } }); setScreen("ad"); };
  const onPostQuizDone = (res) => { patch({ postQuiz: { ...res, date: new Date().toISOString().slice(0, 10) } }); setScreen("homeMission"); };
  const onAdDone = () => setScreen("runToMom");
  const onRunDone = () => setScreen("decision");

  const onChoose = (d) => {
    const isFirst = !dc.firstChoice;
    const endings = dc.endings.includes(d.ending) ? dc.endings : [...dc.endings, d.ending];
    const coinsHere = dc.endings.includes(d.ending) ? 0 : 3;
    patch({ firstChoice: isFirst ? d.id : dc.firstChoice, endings });
    if (coinsHere) setSessionCoins((n) => n + coinsHere);
    setCurrentEndingId(d.ending);
    setScreen("ending");
  };

  const onTryAnother = () => setScreen("decision");
  const onContinueWithGrandpa = () => setScreen("lens");
  const onBackToHub = () => setScreen("hub");

  const tricksForGrade = useMemo(() => discountTricks.filter((t) => grade34 || !t.grades34Only), [grade34]);
  const teethForGrade = useMemo(() => discountKeyTeeth.filter((t) => grade34 || !t.grades34Only), [grade34]);

  const onLensDone = () => {
    setSessionCoins((n) => n + tricksForGrade.length * 2);
    patch({ tricks: { found: tricksForGrade.length, withHelp: 0 } });
    setScreen("weeks");
  };
  const onWeeksDone = ({ firstTry }) => {
    setSessionCoins((n) => n + (firstTry ? 2 : 1));
    patch({ weeksQuestion: { firstTry } });
    setScreen("key");
  };
  const onKeyDone = () => {
    const allGradeEndings = grade34 ? 4 : 3;
    const stamped = dc.endings.length >= allGradeEndings;
    patch({ key: true, endingsStamp: stamped });
    setScreen("badgeThenCoins");
  };

  const onBadgeContinue = () => {
    patch({ badge: true });
    setScreen("coindecision");
  };
  const onCoinChoice = (choice) => {
    if (choice === "mandoos") {
      const m = nw.mandoos || { amount: 0, levelsUntilOpen: 0 };
      const nextAmount = m.amount + sessionCoins;
      const nextLevels = m.amount === 0 && m.levelsUntilOpen === 0 ? 2 : m.levelsUntilOpen;
      patch({}, { mandoos: { amount: nextAmount, levelsUntilOpen: nextLevels } });
      setScreen("postquiz");
    } else if (choice === "shop") {
      patch({}, { wallet: nw.wallet + sessionCoins });
      setScreen("shop");
    } else {
      patch({}, { wallet: nw.wallet + sessionCoins });
      setScreen("postquiz");
    }
    setSessionCoins(0);
  };

  const onSpotTrick = (id) => {
    const mission = dc.homeMission || { tricksSpotted: {}, waitDays: 0, confirmed: false };
    const spotted = { ...mission.tricksSpotted, [id]: (mission.tricksSpotted[id] || 0) + 1 };
    patch({ homeMission: { ...mission, tricksSpotted: spotted } });
  };
  const onWaitDay = () => {
    const mission = dc.homeMission || { tricksSpotted: {}, waitDays: 0, confirmed: false };
    patch({ homeMission: { ...mission, waitDays: (mission.waitDays || 0) + 1 } });
  };
  const onMissionConfirm = () => {
    const mission = dc.homeMission || { tricksSpotted: {}, waitDays: 0, confirmed: false };
    patch({ homeMission: { ...mission, confirmed: true, date: new Date().toISOString().slice(0, 10) } }, { wallet: nw.wallet + 10 });
    setScreen("final");
  };

  const goMenu = () => setScreen("hub");

  if (screen === "heroPick") return <HeroPick profile={profile} onPick={onHeroPicked} onExit={onExit} />;
  if (screen === "prequiz") return <MiniQuiz profile={profile} grade34={grade34} onFinish={onPreQuizDone} onExit={onExit} />;
  if (screen === "postquiz") return <MiniQuiz profile={profile} grade34={grade34} onFinish={onPostQuizDone} onExit={goMenu} />;
  if (screen === "ad") return <AdScene profile={profile} onDone={onAdDone} onExit={onExit} />;
  if (screen === "runToMom") return <RunToMom profile={profile} hero={heroObj} onDone={onRunDone} onExit={onExit} />;
  if (screen === "decision") return <DecisionScene profile={profile} grade34={grade34} onChoose={onChoose} onExit={onExit} />;
  if (screen === "ending" && currentEndingId) {
    return (
      <EndingScene
        profile={profile} endingId={currentEndingId} badgeDone={dc.badge}
        onTryAnother={onTryAnother} onContinue={onContinueWithGrandpa} onBackToHub={onBackToHub} onExit={onExit}
      />
    );
  }
  if (screen === "lens") return <LensScene profile={profile} tricks={tricksForGrade} onDone={onLensDone} onExit={onExit} />;
  if (screen === "weeks") return <WeeksScene profile={profile} grade34={grade34} onDone={onWeeksDone} onExit={onExit} />;
  if (screen === "key") return <KeyScene profile={profile} teeth={teethForGrade} onDone={onKeyDone} onExit={onExit} />;
  if (screen === "badgeThenCoins") return <BadgeScene profile={profile} stamped={dc.endingsStamp} onDone={onBadgeContinue} />;
  if (screen === "coindecision") return <CoinDecision profile={profile} earned={sessionCoins} onChoose={onCoinChoice} onExit={goMenu} />;
  if (screen === "shop") {
    return (
      <Shop
        profile={profile} wallet={nw.wallet} owned={nw.decor}
        onBuy={(item) => { if (nw.wallet >= item.price && !nw.decor.includes(item.id)) patch({}, { wallet: nw.wallet - item.price, decor: [...nw.decor, item.id] }); }}
        onExit={() => setScreen("postquiz")}
      />
    );
  }
  if (screen === "homeMission") {
    return (
      <HomeMissionScene
        profile={profile} tricks={tricksForGrade} mission={dc.homeMission || { tricksSpotted: {}, waitDays: 0, confirmed: false }}
        onSpot={onSpotTrick} onWaitDay={onWaitDay} onConfirm={onMissionConfirm} onExit={goMenu}
      />
    );
  }
  if (screen === "final") {
    return (
      <GameFrame title={T.finalTitle} hint="" onExit={goMenu}>
        <WinCard text={pick(profile, T.finalLine, T.finalLineF)} onDone={onWin} />
      </GameFrame>
    );
  }

  return (
    <Hub
      profile={profile} dc={dc} grade34={grade34}
      onReplay={() => setScreen("ad")}
      onHomeMission={() => setScreen("homeMission")}
      onFinal={() => setScreen(dc.homeMission?.confirmed ? "final" : "homeMission")}
      onExit={onExit}
    />
  );
}
