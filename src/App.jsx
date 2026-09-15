/* ============================================================
   مغامراتي البيئية — الواجهة

   النصوص كلها في content.js، والألوان في theme.js، والرسم في
   art.jsx و scenes.jsx. هذا الملف للشاشات والتنقّل فقط.
   ============================================================ */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { c, env as envColor, shadow, font, ease, bgStyles, isWarningBg, isNightBg, bp } from "./theme.js";
import {
  AUTHOR, COPYRIGHT_YEAR, sections, salim as salimText, encouragements,
  stories, quizSets, dictionaryTerms, doDontCards, labels,
} from "./content.js";
import { Glyph, IconChip, Salim, SalimSays, OmanMap, Medal, keyframes } from "./art.jsx";
import { WORD_SCENES, ActBtn, Hint } from "./scenes.jsx";

/* ============================================================
   التخزين — تقدّم كل طفل في متصفح جهازه
   ============================================================ */
const STORAGE_PREFIX = "mughamarati:student:";
const emptyProfile = (name, gender) => ({ name, gender, completed: [], quizzesTaken: [], updatedAt: Date.now() });

async function loadProfile(name, gender) {
  try {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.get === "function") {
      const res = await window.storage.get(`student:${name}`, true);
      const p = res ? JSON.parse(res.value) : null;
      return p ? { ...emptyProfile(name, gender), ...p, gender } : emptyProfile(name, gender);
    }
    const raw = window.localStorage.getItem(STORAGE_PREFIX + name);
    if (!raw) return emptyProfile(name, gender);
    const p = JSON.parse(raw);
    return {
      name,
      gender: gender || p.gender || "m",
      completed: Array.isArray(p.completed) ? p.completed : [],
      quizzesTaken: Array.isArray(p.quizzesTaken) ? p.quizzesTaken : [],
      updatedAt: p.updatedAt || Date.now(),
    };
  } catch (e) {
    return emptyProfile(name, gender);
  }
}

async function saveProfile(profile) {
  const payload = { ...profile, updatedAt: Date.now() };
  try {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.set === "function") {
      await window.storage.set(`student:${profile.name}`, JSON.stringify(payload), true);
      return;
    }
    window.localStorage.setItem(STORAGE_PREFIX + profile.name, JSON.stringify(payload));
  } catch (e) { /* تجاهل بصمت */ }
}

/* ============================================================
   أدوات
   ============================================================ */
function useViewport() {
  const read = () => {
    if (typeof window === "undefined") return "phone";
    const w = window.innerWidth;
    return w >= bp.wide ? "wide" : w >= bp.tablet ? "tablet" : "phone";
  };
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const on = () => setVp(read());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

const isF = (p) => !!p && p.gender === "f";
const pick = (p, m, f) => (isF(p) ? (f || m) : m);
const ed = (n) => String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

/* ============================================================
   عناصر مشتركة
   ============================================================ */
function Card({ children, pad = 18, style }) {
  return (
    <div style={{ background: c.paper, borderRadius: 18, boxShadow: shadow.sm, padding: pad, ...style }}>
      {children}
    </div>
  );
}

function BigButton({ title, sub, icon, bg, fg, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 14, textAlign: "right", width: "100%",
        background: bg, border: "none", borderRadius: 20, padding: 18, cursor: "pointer",
        boxShadow: shadow.md, minHeight: 44, transition: `transform .25s ${ease}`,
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(.985)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
    >
      <IconChip bg="rgba(255,255,255,0.26)" size={52} radius={19}>
        <Glyph name={icon} size={25} color={fg} />
      </IconChip>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: font.display, color: fg, fontWeight: 700, fontSize: 21, lineHeight: 1.4 }}>{title}</span>
        <span style={{ display: "block", color: fg, opacity: 0.82, fontSize: 12.5, marginTop: 2, fontFamily: font.body }}>{sub}</span>
      </span>
    </button>
  );
}

function BackButton({ onClick, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7, background: c.sage, border: "none",
        borderRadius: 11, padding: "9px 14px", cursor: "pointer", color: c.ink,
        fontFamily: font.body, fontSize: 13.5, fontWeight: 700, minHeight: 44, boxShadow: shadow.sm,
      }}
    >
      <span aria-hidden="true">›</span>{text}
    </button>
  );
}

function ProgressPill({ done, total }) {
  return (
    <span style={{
      background: c.surface, borderRadius: 14, padding: "6px 12px", fontFamily: font.display,
      fontWeight: 700, fontSize: 18, color: c.sageDeep, fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap", boxShadow: shadow.sm,
    }}>
      {ed(done)}/{ed(total)}
    </span>
  );
}

/* ============================================================
   شاشة الترحيب — الاسم والمخاطبة
   ============================================================ */
function Welcome({ onStart }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const ready = !!name.trim() && !!gender;

  return (
    <div style={{ width: "100%", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ textAlign: "center" }}>
        <div className="bob" style={{ display: "inline-block" }}><Salim mood="smile" size={104} /></div>
        <h1 style={{ margin: "6px 0 0", fontFamily: font.display, color: c.ink, fontWeight: 700, fontSize: 34, lineHeight: 1.25 }}>مُغَامَرَتِي</h1>
        <h1 style={{ margin: "-6px 0 0", fontFamily: font.display, color: c.sageDeep, fontWeight: 700, fontSize: 34, lineHeight: 1.25 }}>البَيْئِيَّةُ</h1>
        <p style={{ margin: "10px 0 0", color: c.inkSoft, fontSize: 13.5, lineHeight: 1.9, fontFamily: font.body }}>
          قِصَصٌ وَكَلِمَاتٌ مِنْ قَلْبِ بِيئَةِ سَلْطَنَةِ عُمَانَ
        </p>
      </div>

      <Card pad={18}>
        <label htmlFor="childName" style={{ fontFamily: font.display, color: c.ink, fontWeight: 700, fontSize: 19 }}>
          {labels.nameAsk}
        </label>
        <input
          id="childName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={labels.namePlaceholder}
          dir="rtl"
          maxLength={40}
          style={{
            width: "100%", marginTop: 10, borderRadius: 14, padding: "12px 14px", fontSize: 16,
            border: `1.5px solid ${c.line}`, background: c.surface, fontFamily: font.body,
            color: c.ink, outline: "none", boxSizing: "border-box", minHeight: 44,
          }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {[["m", labels.boy], ["f", labels.girl]].map(([g, txt]) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              aria-pressed={gender === g}
              style={{
                flex: 1, minHeight: 44, borderRadius: 13, cursor: "pointer", fontFamily: font.display,
                fontSize: 18, fontWeight: 700, padding: "10px 8px",
                border: `2px solid ${gender === g ? c.sageDeep : c.line}`,
                background: gender === g ? c.sage : c.surface,
                color: gender === g ? c.sageInk : c.inkSoft,
                transition: `all .2s ${ease}`,
              }}
            >
              {txt}
            </button>
          ))}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 12, color: c.inkFaint, lineHeight: 1.8, fontFamily: font.body }}>
          نَسْأَلُ لِنُخَاطِبَكَ بِالصِّيغَةِ الصَّحِيحَةِ فِي كُلِّ التَّطْبِيقِ.
        </p>
      </Card>

      <button
        type="button"
        disabled={!ready}
        onClick={() => onStart(name.trim(), gender)}
        style={{
          width: "100%", borderRadius: 16, padding: "14px 18px", border: "none", minHeight: 52,
          background: ready ? c.sageDeep : c.line, color: ready ? c.onDark : c.inkFaint,
          fontFamily: font.display, fontSize: 21, fontWeight: 700, cursor: ready ? "pointer" : "default",
          boxShadow: ready ? shadow.md : "none", transition: `all .25s ${ease}`,
        }}
      >
        {labels.start}
      </button>
    </div>
  );
}

/* ============================================================
   الخريطة — الشاشة الرئيسية
   ============================================================ */
function MapPanel({ profile, onOpenStory, onOpenWords, onOpenMedals, compact }) {
  const [sel, setSel] = useState(null);
  const done = profile.completed || [];
  const story = stories.find((s) => s.id === sel);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {!compact && (
        <SalimSays mood="smile" text={pick(profile, salimText.welcome, salimText.welcomeF)} size={58} />
      )}

      <Card pad={10} style={{ background: "#D7E6EA" }}>
        <OmanMap stories={stories} completed={done} onPick={setSel} activeId={sel} />
      </Card>

      {story ? (
        <Card pad={16} style={{ borderInlineStart: `4px solid ${envColor[story.id]}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconChip bg={`${envColor[story.id]}22`} size={48} radius={17}>
              <Glyph name={story.icon} size={23} color={envColor[story.id]} />
            </IconChip>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontFamily: font.display, fontSize: 20, fontWeight: 700, color: c.ink, lineHeight: 1.4 }}>{story.title}</h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: c.inkFaint, fontFamily: font.body }}>{story.env}</p>
            </div>
            {done.includes(story.id) && (
              <IconChip bg={c.goodSoft} size={30} radius={10}><Glyph name="check" size={16} color={c.good} strokeWidth={2.6} /></IconChip>
            )}
          </div>
          <p style={{ margin: "10px 0 12px", fontSize: 13.5, color: c.inkSoft, lineHeight: 1.9, fontFamily: font.body }}>{story.teaser}</p>
          <ActBtn onClick={() => onOpenStory(story.id)}>
            {done.includes(story.id) ? "أُعِيدُ هَذِهِ القِصَّةَ" : "أَبْدَأُ هَذِهِ القِصَّةَ"}
          </ActBtn>
        </Card>
      ) : (
        <Card pad={14}>
          <p style={{ margin: 0, fontSize: 13.5, color: c.inkSoft, textAlign: "center", lineHeight: 1.9, fontFamily: font.body }}>
            {isF(profile)
              ? "اُنْقُرِي عَلَى أَيِّ عَلَامَةٍ فِي الخَرِيطَةِ لِتَبْدَئِي مُغَامَرَةً."
              : "اُنْقُرْ عَلَى أَيِّ عَلَامَةٍ فِي الخَرِيطَةِ لِتَبْدَأَ مُغَامَرَةً."}
          </p>
        </Card>
      )}

      <BigButton
        title={sections.words} sub={sections.wordsSub} icon="book"
        bg={c.dusty} fg="#233038" onClick={onOpenWords}
      />
      <BigButton
        title={sections.medals}
        sub={`${ed(done.length)} مِنْ ${ed(stories.length)}`}
        icon="medal" bg={c.sageDeep} fg={c.onDark} onClick={onOpenMedals}
      />
    </div>
  );
}

/* ============================================================
   مشغّل القصة
   ============================================================ */
function StoryPlayer({ story, profile, onComplete, onExit, rounded }) {
  const [currentId, setCurrentId] = useState("start");
  const [dir, setDir] = useState("fwd");
  const scene = story.scenes[currentId];
  const warning = isWarningBg(scene.bg);
  const accent = envColor[story.id] || c.sageDeep;
  const [msgIndex] = useState(() => Math.floor(Math.random() * encouragements.length));

  const go = (next, back) => { setDir(back ? "back" : "fwd"); setCurrentId(next); };

  return (
    <div
      style={{
        background: bgStyles[scene.bg], borderRadius: rounded ? 22 : 0, overflow: "hidden",
        display: "flex", flexDirection: "column", minHeight: 600, position: "relative",
        transition: `background .6s ${ease}`,
      }}
    >
      {isNightBg(scene.bg) && (
        <>
          <span className="star" style={{ position: "absolute", top: "7%", insetInlineStart: "20%", color: "#FFD873", fontSize: 11 }}>✦</span>
          <span className="star" style={{ position: "absolute", top: "13%", insetInlineStart: "68%", color: "#FFD873", fontSize: 15, animationDelay: ".6s" }}>✦</span>
        </>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", gap: 10, position: "relative", zIndex: 2 }}>
        <button
          type="button" onClick={onExit}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 999,
            background: "rgba(255,255,255,.88)", color: c.ink, padding: "8px 14px", minHeight: 40,
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font.body,
          }}
        >
          <span aria-hidden="true">›</span>{labels.backToMap}
        </button>
        <div style={{ display: "flex", gap: 7 }} aria-label={`المرحلة ${scene.stage} من ${story.totalStages}`}>
          {Array.from({ length: story.totalStages }).map((_, i) => (
            <span key={i} style={{
              width: 9, height: 9, borderRadius: "50%",
              background: i + 1 <= scene.stage ? "#FFD873" : "rgba(255,255,255,.34)",
              transition: `background .4s ${ease}`,
            }} />
          ))}
        </div>
      </div>

      <div
        key={currentId}
        className={dir === "fwd" ? "fwd" : "back"}
        style={{ padding: "0 16px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1, position: "relative", zIndex: 2 }}
      >
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
          <div className="bob" style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.25))" }}>
            <IconChip bg="rgba(255,255,255,.3)" size={82} radius={28}>
              <Glyph name={story.icon} size={38} color="#FFF" strokeWidth={1.8} />
            </IconChip>
          </div>
        </div>

        <div style={{ background: warning ? "rgba(255,244,234,.96)" : "rgba(255,250,236,.97)", borderRadius: 18, padding: 16, boxShadow: shadow.lg }}>
          <h2 style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 21, lineHeight: 1.45, color: warning ? c.bad : accent }}>
            {scene.title}
          </h2>
          <p style={{ margin: "8px 0 0", color: "#33301F", lineHeight: 2, fontSize: 14.5, fontFamily: font.body }}>{scene.text}</p>
        </div>

        {!scene.isEnding && (
          <>
            {scene.isRetry && <SalimSays mood="think" text={salimText.onRetry} size={48} tone="sand" />}
            {!scene.isRetry && scene.choices.length > 1 && (
              <SalimSays mood="ask" text={pick(profile, salimText.onChoice, salimText.onChoiceF)} size={48} tone="sand" />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {scene.choices.map((ch) => (
                <button
                  key={ch.next}
                  type="button"
                  onClick={() => go(ch.next, !!scene.isRetry)}
                  style={{
                    width: "100%", textAlign: "right", borderRadius: 14, padding: "13px 16px", border: "none",
                    background: scene.isRetry ? accent : "#FFFFFF", color: scene.isRetry ? "#FFF" : accent,
                    fontFamily: font.display, fontSize: 17, fontWeight: 700, cursor: "pointer",
                    boxShadow: shadow.md, minHeight: 48, lineHeight: 1.5,
                    transition: `transform .2s ${ease}`,
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = "scale(.98)"; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </>
        )}

        {scene.isEnding && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <div className="pop" style={{ background: "rgba(255,255,255,.95)", borderRadius: 18, padding: "16px 16px 18px", width: "100%", textAlign: "center", boxShadow: shadow.lg }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Medal storyId={story.id} icon={story.icon} earned size={62} />
              </div>
              <p style={{ margin: "2px 0 0", fontFamily: font.display, color: accent, fontWeight: 700, fontSize: 19 }}>{scene.badge}</p>
              <p style={{ margin: "8px 0 0", color: "#33301F", fontSize: 13, lineHeight: 1.95, fontFamily: font.body }}>
                {pick(profile, scene.tip.m, scene.tip.f)}
              </p>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px dashed ${c.line}` }}>
                <p style={{ margin: 0, color: c.accentInk, fontFamily: font.display, fontWeight: 700, fontSize: 16 }}>
                  {pick(profile, encouragements[msgIndex].m, encouragements[msgIndex].f)(profile.name)}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button
                type="button" onClick={() => go("start", true)}
                style={{ flex: 1, borderRadius: 14, border: "none", background: c.accent, color: "#FFF", padding: "12px 10px", minHeight: 48, fontFamily: font.display, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
              >
                {labels.replay}
              </button>
              <button
                type="button" onClick={() => onComplete(story.id)}
                style={{ flex: 1, borderRadius: 14, border: "none", background: accent, color: "#FFF", padding: "12px 10px", minHeight: 48, fontFamily: font.display, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
              >
                {labels.backToMap}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   كلمات تتحرّك
   ============================================================ */
function WordsList({ profile, onOpen, onOpenDoDont }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SalimSays mood="smile" text={pick(profile, salimText.onWords, salimText.onWordsF)} size={56} />
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
        {dictionaryTerms.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onOpen(t.id)}
            style={{
              background: c.paper, border: `1px solid ${c.line}`, borderRadius: 16, padding: "14px 12px",
              cursor: "pointer", boxShadow: shadow.sm, minHeight: 88, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: font.display, fontSize: 15.5, fontWeight: 700, color: c.ink, lineHeight: 1.5,
              transition: `transform .2s ${ease}, border-color .2s`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.sageDeep; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.line; }}
          >
            <span style={{ width: 34, height: 4, borderRadius: 9, background: c.sageDeep, opacity: 0.55 }} />
            {t.term}
          </button>
        ))}
      </div>
      <BigButton title={labels.doDont} sub="أُصَنِّفُ السُّلُوكَ بِنَفْسِي" icon="check" bg={c.sageDeep} fg={c.onDark} onClick={onOpenDoDont} />
    </div>
  );
}

function WordDetail({ term, profile, onBack }) {
  const [done, setDone] = useState(false);
  const Scene = WORD_SCENES[term.scene];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card pad={16}>
        <h2 style={{ margin: 0, fontFamily: font.display, fontSize: 24, fontWeight: 700, color: c.ink, textAlign: "center", lineHeight: 1.4 }}>{term.term}</h2>
        <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.95, color: c.inkSoft, textAlign: "center", fontFamily: font.body }}>{term.def}</p>
      </Card>

      {!done ? (
        <Card pad={16}>
          <p style={{ margin: "0 0 12px", fontSize: 13.5, lineHeight: 1.9, color: c.ink, textAlign: "center", fontFamily: font.body }}>
            {pick(profile, term.ask, term.askF)}
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Scene onDone={() => setDone(true)} />
          </div>
        </Card>
      ) : (
        <Card pad={18} style={{ background: c.goodSoft, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><Salim mood="agree" size={72} /></div>
          <p style={{ margin: 0, fontFamily: font.display, color: c.good, fontWeight: 700, fontSize: 18, lineHeight: 1.6 }}>
            {pick(profile, term.phrase, term.phraseF)}
          </p>
        </Card>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <BackButton onClick={onBack} text={labels.backToWords} />
      </div>
    </div>
  );
}

function DoDont({ onBack }) {
  const [i, setI] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);
  const card = doDontCards[i];

  const handle = (choiceGood) => {
    if (feedback) return;
    if (choiceGood === card.good) {
      setFeedback("ok");
      t.current = setTimeout(() => { setFeedback(null); setI((x) => (x + 1) % doDontCards.length); }, 900);
    } else {
      setFeedback("no");
      t.current = setTimeout(() => setFeedback(null), 900);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
      <h2 style={{ margin: 0, fontFamily: font.display, fontSize: 22, fontWeight: 700, color: c.ink }}>{labels.doDont}</h2>
      <Card pad={22} style={{ width: "100%", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.95, color: c.ink, fontFamily: font.body }}>{card.text}</p>
      </Card>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button type="button" onClick={() => handle(true)}
          style={{ border: "none", borderRadius: 16, background: c.goodSoft, color: c.good, padding: "14px 22px", minHeight: 44, cursor: "pointer", fontFamily: font.display, fontWeight: 700, fontSize: 16 }}>
          {labels.goodDeed}
        </button>
        <button type="button" onClick={() => handle(false)}
          style={{ border: "none", borderRadius: 16, background: c.badSoft, color: c.bad, padding: "14px 22px", minHeight: 44, cursor: "pointer", fontFamily: font.display, fontWeight: 700, fontSize: 16 }}>
          {labels.badDeed}
        </button>
      </div>
      <div style={{ minHeight: 26 }}>
        {feedback === "ok" && <Hint tone="good">{labels.rightAnswer}</Hint>}
        {feedback === "no" && <Hint tone="bad">{labels.thinkAgain}</Hint>}
      </div>
      <BackButton onClick={onBack} text={labels.backToWords} />
    </div>
  );
}

/* ============================================================
   خزانة الأوسمة
   ============================================================ */
function Medals({ profile, onBack }) {
  const done = profile.completed || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontFamily: font.display, fontSize: 24, fontWeight: 700, color: c.ink }}>{sections.medals}</h2>
        <ProgressPill done={done.length} total={stories.length} />
      </div>

      {done.length === 0 && (
        <SalimSays mood="ask" text={pick(profile, salimText.emptyMedals, salimText.emptyMedalsF)} size={58} />
      )}

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))" }}>
        {stories.map((s) => {
          const earned = done.includes(s.id);
          const ending = Object.values(s.scenes).find((sc) => sc.isEnding);
          return (
            <Card key={s.id} pad={12} style={{
              textAlign: "center",
              background: earned ? c.paper : "transparent",
              boxShadow: earned ? shadow.sm : "none",
              border: earned ? "none" : `1px dashed ${c.line}`,
            }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Medal storyId={s.id} icon={s.icon} earned={earned} size={60} />
              </div>
              <p style={{ margin: "6px 0 0", fontFamily: font.display, fontSize: 14.5, fontWeight: 700, lineHeight: 1.55, color: earned ? c.ink : c.inkFaint }}>
                {earned ? ending.badge : "لَمْ يُفْتَحْ بَعْدُ"}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: c.inkFaint, fontFamily: font.body }}>{s.env}</p>
            </Card>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <BackButton onClick={onBack} text={labels.backToMap} />
      </div>
    </div>
  );
}

/* ============================================================
   أسئلة الجدّ سالم
   ============================================================ */
function Quiz({ setIndex, profile, onFinish }) {
  const questions = quizSets[setIndex] || quizSets[0];
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);

  const q = questions[i];
  const options = q.type === "tf" ? ["صَحِيحٌ", "خَطَأٌ"] : q.options;
  const isRight = (idx) => (q.type === "tf" ? (idx === 0) === q.correct : idx === q.correct);

  const answer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (isRight(idx)) setScore((s) => s + 1);
    t.current = setTimeout(() => {
      if (i + 1 < questions.length) { setI(i + 1); setSelected(null); }
      else setDone(true);
    }, 900);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <SalimSays mood={done ? "agree" : "ask"} text={pick(profile, salimText.beforeQuiz, salimText.beforeQuizF)} size={58} />

      {!done ? (
        <>
          <p style={{ margin: 0, textAlign: "center", color: c.inkFaint, fontSize: 12.5, fontFamily: font.body }}>
            سُؤَالٌ {ed(i + 1)} مِنْ {ed(questions.length)}
          </p>
          <Card pad={18}>
            <p style={{ margin: 0, color: c.ink, fontSize: 16, lineHeight: 1.95, fontWeight: 700, fontFamily: font.body }}>{q.q}</p>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {options.map((opt, idx) => {
              let bg = c.paper, col = c.ink, bd = c.line;
              if (selected !== null) {
                if (isRight(idx)) { bg = c.goodSoft; col = c.good; bd = c.good; }
                else if (idx === selected) { bg = c.badSoft; col = c.bad; bd = c.bad; }
              }
              return (
                <button
                  key={idx} type="button" onClick={() => answer(idx)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                    borderRadius: 14, padding: "13px 16px", border: `2px solid ${bd}`, background: bg,
                    color: col, fontFamily: font.display, fontSize: 17, fontWeight: 700, cursor: "pointer",
                    textAlign: "right", minHeight: 48, boxShadow: shadow.sm, transition: `all .25s ${ease}`,
                  }}
                >
                  <span>{opt}</span>
                  {selected !== null && isRight(idx) && <Glyph name="check" size={18} color={c.good} strokeWidth={2.8} />}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <Card pad={22} style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><Salim mood="smile" size={84} /></div>
          <p style={{ margin: "4px 0 0", fontFamily: font.display, color: c.accentInk, fontWeight: 700, fontSize: 20, lineHeight: 1.5 }}>
            {isF(profile) ? `أَحْسَنْتِ يَا ${profile.name}!` : `أَحْسَنْتَ يَا ${profile.name}!`}
          </p>
          <p style={{ margin: "6px 0 14px", color: c.inkSoft, fontSize: 14.5, fontFamily: font.body }}>
            {isF(profile) ? "حَصَلْتِ" : "حَصَلْتَ"} عَلَى {ed(score)} مِنْ {ed(questions.length)}
          </p>
          <ActBtn onClick={onFinish}>{labels.continueQuiz}</ActBtn>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   الإطار العام
   ============================================================ */
function Screen({ children }) {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100%", background: c.ground, color: c.ink, fontFamily: font.body,
        display: "flex", flexDirection: "column", padding: "0 16px", boxSizing: "border-box",
      }}
    >
      <style>{keyframes}</style>
      <div style={{ width: "100%", maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "20px 0 24px", textAlign: "center", fontSize: 11.5, lineHeight: 1.9, color: c.inkFaint, fontFamily: font.body }}>
      © {COPYRIGHT_YEAR} {AUTHOR} — جَمِيعُ الحُقُوقِ مَحْفُوظَةٌ
    </footer>
  );
}

function Loading() {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,48,31,.22)", zIndex: 50 }}>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      <div style={{ width: 34, height: 34, borderRadius: "50%", border: `3px solid ${c.onDark}`, borderTopColor: "transparent", animation: "spin .8s linear infinite" }} />
    </div>
  );
}

/* ============================================================
   التطبيق
   ============================================================ */
export default function App() {
  const vp = useViewport();
  const wide = vp === "wide";
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState("map");
  const [storyId, setStoryId] = useState(null);
  const [wordId, setWordId] = useState(null);
  const [pendingQuiz, setPendingQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  const start = async (name, gender) => {
    setLoading(true);
    const p = await loadProfile(name, gender);
    setProfile(p);
    setLoading(false);
    setView("map");
  };

  const completeStory = async (sId) => {
    if (!profile) return;
    const completed = profile.completed.includes(sId) ? profile.completed : [...profile.completed, sId];
    const next = { ...profile, completed };
    setProfile(next);
    await saveProfile(next);

    const milestone = Math.floor(completed.length / 3);
    if (milestone >= 1 && !next.quizzesTaken.includes(milestone) && milestone <= quizSets.length) {
      setPendingQuiz(milestone);
      setView("quiz");
    } else {
      setView("map");
    }
  };

  const finishQuiz = async () => {
    const next = { ...profile, quizzesTaken: [...profile.quizzesTaken, pendingQuiz] };
    setProfile(next);
    await saveProfile(next);
    setPendingQuiz(null);
    setView("map");
  };

  const story = useMemo(() => stories.find((s) => s.id === storyId), [storyId]);
  const term = useMemo(() => dictionaryTerms.find((t) => t.id === wordId), [wordId]);
  const openStory = (id) => { setStoryId(id); setView("story"); };

  const content = () => {
    if (view === "story" && story) {
      return (
        <StoryPlayer
          story={story} profile={profile} rounded={vp !== "phone"}
          onComplete={completeStory} onExit={() => setView("map")}
        />
      );
    }
    if (view === "quiz" && pendingQuiz !== null) return <Quiz setIndex={pendingQuiz - 1} profile={profile} onFinish={finishQuiz} />;
    if (view === "word" && term) return <WordDetail term={term} profile={profile} onBack={() => setView("words")} />;
    if (view === "dodont") return <DoDont onBack={() => setView("words")} />;
    if (view === "words") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontFamily: font.display, fontSize: 24, fontWeight: 700, color: c.ink }}>{sections.words}</h2>
            <BackButton onClick={() => setView("map")} text={labels.backToMap} />
          </div>
          <WordsList profile={profile} onOpen={(id) => { setWordId(id); setView("word"); }} onOpenDoDont={() => setView("dodont")} />
        </div>
      );
    }
    if (view === "medals") return <Medals profile={profile} onBack={() => setView("map")} />;

    return (
      <MapPanel
        profile={profile} compact={false}
        onOpenStory={openStory}
        onOpenWords={() => setView("words")}
        onOpenMedals={() => setView("medals")}
      />
    );
  };

  if (!profile) {
    return (
      <Screen>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 0" }}>
          <Welcome onStart={start} />
        </div>
        <Footer />
        {loading && <Loading />}
      </Screen>
    );
  }

  const done = profile.completed || [];

  return (
    <Screen>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 2px 14px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <Salim mood="smile" size={40} />
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11.5, color: c.inkFaint, fontFamily: font.body }}>أَهْلًا بِكَ</p>
            <p style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 19, color: c.ink, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {profile.name}
            </p>
          </div>
        </div>
        <ProgressPill done={done.length} total={stories.length} />
      </header>

      {wide ? (
        <div style={{ display: "grid", gridTemplateColumns: "372px minmax(0,1fr)", gap: 26, alignItems: "start", flex: 1 }}>
          <aside style={{ position: "sticky", top: 16 }}>
            <MapPanel
              profile={profile} compact
              onOpenStory={openStory}
              onOpenWords={() => setView("words")}
              onOpenMedals={() => setView("medals")}
            />
          </aside>
          <section style={{ minWidth: 0 }}>
            {view === "map" ? (
              <Card pad={24}>
                <SalimSays mood="smile" text={pick(profile, salimText.welcome, salimText.welcomeF)} size={74} />
                <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 2, color: c.inkSoft, fontFamily: font.body }}>
                  {isF(profile)
                    ? "اخْتَارِي مَوْقِعًا مِنَ الخَرِيطَةِ، أَوِ افْتَحِي كَلِمَاتٍ تَتَحَرَّكُ، أَوْ تَصَفَّحِي خِزَانَةَ أَوْسِمَتِكِ."
                    : "اخْتَرْ مَوْقِعًا مِنَ الخَرِيطَةِ، أَوِ افْتَحْ كَلِمَاتٍ تَتَحَرَّكُ، أَوْ تَصَفَّحْ خِزَانَةَ أَوْسِمَتِكَ."}
                </p>
              </Card>
            ) : content()}
          </section>
        </div>
      ) : (
        <div style={{ flex: 1, maxWidth: vp === "tablet" ? 620 : "none", width: "100%", margin: "0 auto" }}>{content()}</div>
      )}

      <Footer />
      {loading && <Loading />}
    </Screen>
  );
}
