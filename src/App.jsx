/* ============================================================
   مغامراتي البيئية — الواجهة

   النصوص في content.js، والألوان في theme.js، والرسم في art.jsx،
   ومشاهد الكلمات في scenes.jsx، والألعاب في games.jsx.
   هذا الملف للشاشات والتنقّل فقط.
   ============================================================ */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { c, env as envColor, shadow, font, ease, bgStyles, isWarningBg, bp } from "./theme.js";
import {
  COPYRIGHT_YEAR, sections, salim as salimText, encouragements,
  stories, quizSets, dictionaryTerms, doDontCards, labels, games, mission, footerText,
  readingTexts,
} from "./content.js";
import { Glyph, IconChip, ImgFallback, Salim, SalimSays, OmanMap, StoryBadge, StoryIcon, StoryHero, CompletionBadge, SceneBackdrop, keyframes } from "./art.jsx";
import { WORD_SCENES, ActBtn, Hint } from "./scenes.jsx";
import {
  PreviewCard, ConnectCard, PredictCard, ReviewCard, InferenceCard,
  OrderEvents, MainIdeaCard, WordCards, WordCheck, AchievementCard,
  ReadingText, ReadingInline, stopSpeaking, summarize,
} from "./reading.jsx";
import { GAMES as BASE_GAMES } from "./games.jsx";
import { NeedsWantsGame } from "./needsWants.jsx";
import { DiscountCodeGame } from "./discountCode.jsx";

const GAMES = { ...BASE_GAMES, needsWants: NeedsWantsGame, discountCode: DiscountCodeGame };

/* ============================================================
   التخزين — تقدّم كل طفل في متصفح جهازه
   ============================================================ */
const STORAGE_PREFIX = "mughamarati:student:";
const emptyProfile = (name, gender) => ({
  name, gender, completed: [], gamesDone: [], quizzesTaken: [], accepted: false,
  reading: {}, updatedAt: Date.now(),
});

async function loadProfile(name, gender) {
  const base = emptyProfile(name, gender);
  try {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.get === "function") {
      const res = await window.storage.get(`student:${name}`, true);
      const p = res ? JSON.parse(res.value) : null;
      return p ? { ...base, ...p, gender } : base;
    }
    const raw = window.localStorage.getItem(STORAGE_PREFIX + name);
    if (!raw) return base;
    const p = JSON.parse(raw);
    return {
      ...base, ...p,
      name,
      gender: gender || p.gender || "m",
      completed: Array.isArray(p.completed) ? p.completed : [],
      gamesDone: Array.isArray(p.gamesDone) ? p.gamesDone : [],
      quizzesTaken: Array.isArray(p.quizzesTaken) ? p.quizzesTaken : [],
      accepted: !!p.accepted,
      reading: p.reading && typeof p.reading === "object" ? p.reading : {},
      updatedAt: p.updatedAt || Date.now(),
    };
  } catch (e) {
    return base;
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

/* كل ملفات الأطفال المحفوظة على هذا الجهاز — لشاشة المعلمة فقط */
function listDeviceProfiles() {
  const out = [];
  try {
    if (typeof window === "undefined" || !window.localStorage) return out;
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || key.indexOf(STORAGE_PREFIX) !== 0) continue;
      try {
        const p = JSON.parse(window.localStorage.getItem(key));
        if (p && p.name) out.push(p);
      } catch (e) { /* تجاهل سجلًّا تالفًا */ }
    }
  } catch (e) { /* تجاهل */ }
  return out;
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

/* أيقونات أزرار اختيار القصص بدل الإيموجي */
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu;
const CHOICE_ICON_BY_EMOJI = {
  "🎈": "assets/img/choices/choice-balloon.webp",
  "⛵": "assets/img/choices/choice-boat.webp",
  "🚤": "assets/img/choices/choice-boat.webp",
  "🔍": "assets/img/choices/choice-investigate.webp",
  "🔎": "assets/img/choices/choice-investigate.webp",
  "🐾": "assets/img/choices/choice-tracks.webp",
  "🚶": "assets/img/choices/choice-walk.webp",
  "🏃": "assets/img/choices/choice-walk.webp",
};
const GRANDPA_EMOJI = "👴";

function parseChoiceLabel(label) {
  const found = label.match(EMOJI_RE) || [];
  const text = label.replace(EMOJI_RE, "").trim();
  const isGrandpa = found.includes(GRANDPA_EMOJI);
  const icon = !isGrandpa ? found.map((e) => CHOICE_ICON_BY_EMOJI[e]).find(Boolean) : null;
  return { text, icon, isGrandpa };
}

/* ============================================================
   عناصر مشتركة
   ============================================================ */
function Card({ children, pad = 18, style }) {
  return (
    <div style={{ background: c.paper, borderRadius: 24, boxShadow: shadow.sm, border: `3px solid ${c.ink}`, padding: pad, ...style }}>
      {children}
    </div>
  );
}

function BigButton({ title, sub, icon, image, imageAlt, bg, fg, onClick, badge, badgeIcon, locked, lockedNote }) {
  const bgEff = locked ? c.sage : bg;
  const fgEff = locked ? c.inkFaint : fg;
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={locked ? "" : "btn-pop"}
      style={{
        display: "flex", alignItems: "center", gap: 14, textAlign: "right", width: "100%",
        background: bgEff, border: `3px solid ${c.ink}`, borderRadius: 24, padding: 18, cursor: locked ? "default" : "pointer",
        boxShadow: locked ? "none" : shadow.md, minHeight: 44,
        opacity: locked ? .75 : 1,
      }}
    >
      {!locked && image ? (
        <ImgFallback
          src={image} alt={imageAlt}
          width={56} height={56} style={{ flexShrink: 0 }}
          fallback={
            <IconChip bg="rgba(255,248,236,.4)" size={52} radius={19}>
              <Glyph name={icon} size={25} color={fgEff} />
            </IconChip>
          }
        />
      ) : (
        <IconChip bg={locked ? "rgba(91,54,38,.08)" : "rgba(255,248,236,.4)"} size={52} radius={19}>
          <Glyph name={locked ? "lock" : icon} size={25} color={fgEff} />
        </IconChip>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: font.display, color: fgEff, fontWeight: 700, fontSize: 21, lineHeight: 1.4 }}>{title}</span>
        <span style={{ display: "block", color: fgEff, opacity: locked ? 1 : 0.88, fontSize: 12.5, marginTop: 2, fontFamily: font.body }}>{locked ? lockedNote : sub}</span>
      </span>
      {badge && (
        <span style={{
          flex: "none", display: "flex", alignItems: "center", gap: 4,
          background: "rgba(255,248,236,.4)", color: fg, borderRadius: 11,
          padding: "4px 10px", fontFamily: font.display, fontWeight: 700, fontSize: 15,
          fontVariantNumeric: "tabular-nums",
        }}>
          {badgeIcon && <ImgFallback src={badgeIcon} alt="" width={16} height={16} fallback={null} />}
          {badge}
        </span>
      )}
    </button>
  );
}

function BackButton({ onClick, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7, background: c.paper, border: `2.5px solid ${c.ink}`,
        borderRadius: 999, padding: "9px 14px", cursor: "pointer", color: c.ink,
        fontFamily: font.display, fontSize: 13.5, fontWeight: 700, minHeight: 44, boxShadow: shadow.sm,
      }}
    >
      <span aria-hidden="true">›</span>{text}
    </button>
  );
}

function ScreenHead({ title, onBack, backText, extra }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
      <h2 style={{ margin: 0, fontFamily: font.display, fontSize: 24, fontWeight: 800, color: c.ink }}>{title}</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {extra}
        {onBack && <BackButton onClick={onBack} text={backText} />}
      </div>
    </div>
  );
}

function ProgressPill({ done, total }) {
  return (
    <span style={{
      background: c.surface, borderRadius: 999, padding: "6px 14px", fontFamily: font.display,
      fontWeight: 700, fontSize: 18, color: c.sageInk, fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap", boxShadow: shadow.sm, border: `2.5px solid ${c.ink}`,
    }}>
      {ed(done)}/{ed(total)}
    </span>
  );
}

/* ============================================================
   شاشة الترحيب
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
          قِصَصٌ وَأَلْعَابٌ وَكَلِمَاتٌ مِنْ قَلْبِ بِيئَةِ سَلْطَنَةِ عُمَانَ
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
   خطاب التكليف — يُفتح مرّة واحدة
   ============================================================ */
function MissionLetter({ profile, onAccept }) {
  const body = isF(profile) ? mission.bodyF : mission.body;
  return (
    <div className="rise" style={{ width: "100%", maxWidth: 460, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      <Card pad={22} style={{ textAlign: "center", border: `1px solid ${c.line}` }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IconChip bg={c.sage} size={64} radius={22}>
            <Glyph name="medal" size={30} color={c.sageDeep} />
          </IconChip>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12.5, letterSpacing: ".06em", color: c.inkFaint, fontFamily: font.body }}>
          {mission.org}
        </p>
        <h1 style={{ margin: "4px 0 0", fontFamily: font.display, fontSize: 27, fontWeight: 700, color: c.ink, lineHeight: 1.4 }}>
          {mission.title}
        </h1>

        <div style={{
          marginTop: 16, padding: "18px 16px", borderRadius: 14,
          background: c.sage, border: `2px dashed ${c.sageDeep}55`,
        }}>
          <p style={{ margin: 0, fontFamily: font.display, fontSize: 19, fontWeight: 700, color: c.ink, lineHeight: 1.9 }}>
            {mission.salute} {profile.name}،
          </p>
          {body.map((line, idx) => (
            <p key={idx} style={{
              margin: "10px 0 0", fontSize: idx === 1 ? 18 : 14.5, lineHeight: 2.05,
              color: c.ink, fontFamily: idx === 1 ? font.display : font.body,
              fontWeight: idx === 1 ? 700 : 400,
            }}>{line}</p>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, justifyContent: "center" }}>
          <Salim mood="agree" size={54} />
          <p style={{ margin: 0, fontSize: 12.5, color: c.inkSoft, fontFamily: font.body, textAlign: "right" }}>
            {mission.signedBy}
          </p>
        </div>
      </Card>

      <button
        type="button" onClick={onAccept}
        style={{
          width: "100%", borderRadius: 16, padding: "15px 18px", border: "none", minHeight: 54,
          background: c.sageDeep, color: c.onDark, fontFamily: font.display, fontSize: 22,
          fontWeight: 700, cursor: "pointer", boxShadow: shadow.md,
        }}
      >
        {mission.accept}
      </button>
    </div>
  );
}

/* ============================================================
   الشاشة الرئيسية — أقسام التطبيق
   ============================================================ */
function HomePanel({ profile, go, compact }) {
  const done = profile.completed || [];
  const gdone = profile.gamesDone || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {!compact && <SalimSays mood="smile" text={pick(profile, salimText.welcome, salimText.welcomeF)} size={58} />}
      <BigButton
        title={sections.stories} sub={sections.storiesSub} icon="map"
        image="assets/img/home/home-stories.webp" imageAlt="رسمة قصص بيئية"
        bg={c.sageDeep} fg={c.onDark} badge={`${ed(done.length)}/${ed(stories.length)}`}
        badgeIcon="assets/img/home/ui-medal.webp"
        onClick={() => go("stories")}
      />
      <BigButton
        title={sections.games} sub={sections.gamesSub} icon="house"
        image="assets/img/home/home-games.webp" imageAlt="رسمة ألعاب بيئية"
        bg={c.accent} fg={c.onDark} badge={`${ed(gdone.length)}/${ed(games.length)}`}
        badgeIcon="assets/img/home/ui-trophy.webp"
        onClick={() => go("games")}
      />
      <BigButton
        title={sections.words} sub={sections.wordsSub} icon="book"
        image="assets/img/home/home-dictionary.webp" imageAlt="رسمة المعجم البصري"
        bg={c.dusty} fg="#233038" onClick={() => go("words")}
      />
    </div>
  );
}

/* ============================================================
   القصص — قائمة أزرار، والخريطة اختيارية
   ============================================================ */
function StoriesScreen({ profile, onOpenStory, onBack }) {
  const [mode, setMode] = useState("list");
  const [sel, setSel] = useState(null);
  const done = profile.completed || [];
  const story = stories.find((s) => s.id === sel);

  const Toggle = (
    <div style={{ display: "flex", background: c.sage, borderRadius: 12, padding: 3, gap: 3 }}>
      {[["list", labels.showList], ["map", labels.showMap]].map(([m, txt]) => (
        <button
          key={m} type="button" onClick={() => { setMode(m); setSel(null); }}
          aria-pressed={mode === m}
          style={{
            border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", minHeight: 40,
            background: mode === m ? c.surface : "transparent",
            color: mode === m ? c.sageInk : c.inkSoft,
            fontFamily: font.body, fontWeight: 700, fontSize: 12.5,
            boxShadow: mode === m ? shadow.sm : "none", transition: `all .2s ${ease}`,
          }}
        >
          {txt}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      <ScreenHead title={sections.stories} onBack={onBack} backText={labels.backToMap} extra={Toggle} />

      {mode === "list" ? (
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {stories.map((s) => {
            const col = envColor[s.id];
            const isDone = done.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onOpenStory(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, textAlign: "right", width: "100%",
                  background: c.paper, border: `1px solid ${c.line}`, borderInlineStart: `4px solid ${col}`,
                  borderRadius: 16, padding: "13px 14px", cursor: "pointer", minHeight: 74,
                  boxShadow: shadow.sm, transition: `transform .2s ${ease}, border-color .2s`,
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(.99)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                <StoryBadge storyId={s.id} icon={s.icon} color={col} size={52} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: font.display, fontSize: 18.5, fontWeight: 700, color: c.ink, lineHeight: 1.45 }}>
                    {s.title}
                  </span>
                  <span style={{ display: "block", fontSize: 11.5, color: c.inkFaint, marginTop: 1, fontFamily: font.body }}>{s.env}</span>
                </span>
                <CompletionBadge storyId={s.id} earned={isDone} size={30} />
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <Card pad={10} style={{ background: "#D7E6EA" }}>
            <OmanMap stories={stories} completed={done} onPick={setSel} activeId={sel} />
          </Card>
          {story ? (
            <Card pad={16} style={{ borderInlineStart: `4px solid ${envColor[story.id]}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <StoryBadge storyId={story.id} icon={story.icon} color={envColor[story.id]} size={52} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontFamily: font.display, fontSize: 19, fontWeight: 700, color: c.ink, lineHeight: 1.4 }}>{story.title}</h3>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: c.inkFaint, fontFamily: font.body }}>{story.env}</p>
                </div>
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
                  ? "اُنْقُرِي عَلَى أَيِّ عَلَامَةٍ فِي الخَرِيطَةِ."
                  : "اُنْقُرْ عَلَى أَيِّ عَلَامَةٍ فِي الخَرِيطَةِ."}
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================
   الألعاب البيئية
   ============================================================ */
function GamesScreen({ profile, onOpen, onBack }) {
  const gdone = profile.gamesDone || [];
  const tints = { sorting: c.dustyInk, smarthome: c.sageDeep, market: c.accent, needsWants: c.warn, discountCode: envColor.oilspill };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      <ScreenHead title={sections.games} onBack={onBack} backText={labels.backToMap} />
      <SalimSays
        mood="ask"
        text="نَفْرِزُ، وَنُدَبِّرُ كَهْرَبَاءَ بَيْتٍ، وَنَتَسَوَّقُ بِحِكْمَةٍ، وَنَكْتَشِفُ حِيَلَ الإِعْلَانَاتِ."
        size={54}
      />
      {games.map((g) => {
        const locked = g.requires && !gdone.includes(g.requires);
        return (
          <BigButton
            key={g.id}
            title={g.title} sub={g.sub} icon={g.icon}
            bg={tints[g.id]} fg={c.onDark}
            badge={gdone.includes(g.id) ? "✓" : undefined}
            locked={locked}
            lockedNote={pick(profile, "يُفتح بعد إنهاء سوق نزوى", "يُفتح بعد إنهاء سوق نزوى")}
            onClick={() => onOpen(g.id)}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   مشغّل القصة
   ============================================================ */
function StoryPlayer({ story, profile, onComplete, onExit, rounded, onReadingDone }) {
  const R = story.reading || null;
  const [currentId, setCurrentId] = useState("start");
  const [dir, setDir] = useState("fwd");
  const scene = story.scenes[currentId];
  const warning = isWarningBg(scene.bg);
  const accent = envColor[story.id] || c.sageDeep;
  const [msgIndex] = useState(() => Math.floor(Math.random() * encouragements.length));

  /* ---- حالة طبقة القراءة ---- */
  const [phase, setPhase] = useState(R ? "preview" : "scene");     // preview → scene → summary
  const [step, setStep] = useState("scene");                       // داخل المشهد
  const [endStep, setEndStep] = useState("order");                 // بعد النهاية
  const [pendingReview, setPendingReview] = useState(null);
  const [doneConnect, setDoneConnect] = useState(false);
  const [doneInference, setDoneInference] = useState(false);
  const [donePredict, setDonePredict] = useState([]);              // معرّفات المشاهد
  const [openWord, setOpenWord] = useState(null);
  const startedAt = useRef(Date.now());
  const metrics = useRef({
    previewChoice: null, predictions: [], connectAnswer: null,
    inferenceFirstTry: null, orderFirstTry: null, mainIdeaFirstTry: null,
    wordScore: 0, wordTotal: 0, wordsOpened: 0, seconds: 0,
  });

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => { stopSpeaking(); }, [currentId, step, endStep, phase]);

  /* المحطة الفعّالة في المشهد الحالي */
  const sceneStep = useMemo(() => {
    if (!R) return "choices";
    if (pendingReview) return "review";
    if (R.connect && R.connect.after === currentId && !doneConnect) return "connect";
    if (R.inference && R.inference.at === currentId && !doneInference) return "inference";
    if (scene.predict && !donePredict.includes(currentId)) return "predict";
    return "choices";
  }, [R, pendingReview, currentId, doneConnect, doneInference, donePredict, scene]);

  const go = (next, back) => {
    const pr = scene.predict;
    const answered = pr && (metrics.current.predictions.find((x) => x.scene === currentId) || null);
    if (pr && answered) {
      const tested = next === pr.about;
      setPendingReview({
        predictText: answered.text,
        outcome: answered.outcome,
        tested,
        happened: pr.happened,
        untested: pr.untested,
        untestedF: pr.untestedF,
      });
      answered.tested = tested;
    }
    setDir(back ? "back" : "fwd");
    setCurrentId(next);
  };

  const finishReading = () => {
    metrics.current.seconds = Math.round((Date.now() - startedAt.current) / 1000);
    if (onReadingDone) onReadingDone(story.id, { ...metrics.current });
  };

  /* إعادة القصة تبدأ دورة قراءة جديدة من أولها */
  const replay = () => {
    stopSpeaking();
    setPendingReview(null);
    setDoneConnect(false);
    setDoneInference(false);
    setDonePredict([]);
    setOpenWord(null);
    setEndStep("order");
    startedAt.current = Date.now();
    metrics.current = {
      previewChoice: null, predictions: [], connectAnswer: null,
      inferenceFirstTry: null, orderFirstTry: null, mainIdeaFirstTry: null,
      wordScore: 0, wordTotal: 0, wordsOpened: 0, seconds: 0,
    };
    setDir("back");
    setCurrentId("start");
    setPhase(R ? "preview" : "scene");
  };

  /* إبراز الدليل يظهر فقط أثناء سؤال الاستنتاج */
  const evidence = R && R.inference && R.inference.at === currentId && sceneStep === "inference"
    ? R.inference.evidence : null;
  const sceneWords = R ? (R.words || []).filter((w) => w.inScene === currentId) : [];

  return (
    <div
      style={{
        background: bgStyles[scene.bg], borderRadius: rounded ? 22 : 18, overflow: "hidden",
        display: "flex", flexDirection: "column", minHeight: 600, position: "relative",
        transition: `background .6s ${ease}`,
      }}
    >
      <SceneBackdrop bg={scene.bg} storyId={story.id} isEnding={!!scene.isEnding} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", gap: 10, position: "relative", zIndex: 2 }}>
        <button
          type="button" onClick={onExit}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 999,
            background: "rgba(255,255,255,.88)", color: c.ink, padding: "8px 14px", minHeight: 40,
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font.body,
          }}
        >
          <span aria-hidden="true">›</span>{labels.backToStories2}
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
        key={phase === "preview" ? "preview" : currentId}
        className={dir === "fwd" ? "fwd" : "back"}
        style={{ padding: "0 16px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1, position: "relative", zIndex: 2 }}
      >
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
          <div className="bob" style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.25))" }}>
            <IconChip bg="rgba(255,255,255,.85)" size={82} radius={28}>
              <StoryHero storyId={story.id} sceneId={phase === "preview" ? "start" : currentId} icon={story.icon} size={46} />
            </IconChip>
          </div>
        </div>

        {/* ===== قبل أن نقرأ: العنوان والصورة فقط، بلا نص القصة ===== */}
        {phase === "preview" && (
          <>
            <div style={{ background: "rgba(255,250,236,.97)", borderRadius: 18, padding: 16, boxShadow: shadow.lg, textAlign: "center" }}>
              <h2 style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 21, lineHeight: 1.45, color: accent }}>
                {story.title}
              </h2>
              <p style={{ margin: "6px 0 0", color: c.inkSoft, fontSize: 13, fontFamily: font.body }}>{story.env}</p>
            </div>
            <PreviewCard
              story={story} profile={profile} tone={accent}
              onDone={(idx) => { metrics.current.previewChoice = idx; setPhase("scene"); }}
            />
          </>
        )}

        {phase !== "preview" && (
          <>
            <div style={{ background: warning ? "rgba(255,244,234,.96)" : "rgba(255,250,236,.97)", borderRadius: 18, padding: 16, boxShadow: shadow.lg }}>
              <h2 style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 21, lineHeight: 1.45, color: warning ? c.bad : accent }}>
                {R ? (
                  <ReadingInline
                    text={scene.title} words={sceneWords} tone={warning ? c.bad : accent}
                    onWord={(w) => setOpenWord(openWord && openWord.word === w.word ? null : w)}
                  />
                ) : scene.title}
              </h2>
              {R ? (
                <ReadingText
                  text={scene.text} words={sceneWords} evidence={evidence}
                  tone={accent} onWord={(w) => setOpenWord(openWord && openWord.word === w.word ? null : w)}
                />
              ) : (
                <p style={{ margin: "8px 0 0", color: "#33301F", lineHeight: 2, fontSize: 14.5, fontFamily: font.body }}>{scene.text}</p>
              )}
              {openWord && (
                <div style={{ marginTop: 10, background: `${accent}14`, borderRadius: 12, padding: "10px 13px" }}>
                  <p style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 14, color: accent }}>{openWord.word}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13.5, lineHeight: 1.9, color: c.ink, fontFamily: font.body }}>{openWord.meaning}</p>
                </div>
              )}
            </div>

            {/* ===== داخل المشهد ===== */}
            {!scene.isEnding && sceneStep === "review" && (
              <ReviewCard
                review={pendingReview} profile={profile} tone={accent}
                onDone={() => setPendingReview(null)}
              />
            )}

            {!scene.isEnding && sceneStep === "connect" && (
              <ConnectCard
                connect={R.connect} profile={profile} tone={accent}
                onDone={(a) => { metrics.current.connectAnswer = a; setDoneConnect(true); }}
              />
            )}

            {!scene.isEnding && sceneStep === "inference" && (
              <InferenceCard
                inference={R.inference} profile={profile} tone={accent}
                onReveal={(firstTry) => {
                  if (metrics.current.inferenceFirstTry === null) metrics.current.inferenceFirstTry = !!firstTry;
                }}
                onDone={() => setDoneInference(true)}
              />
            )}

            {!scene.isEnding && sceneStep === "predict" && (
              <PredictCard
                predict={scene.predict} profile={profile} tone={accent}
                onDone={(opt) => {
                  metrics.current.predictions.push({ scene: currentId, outcome: opt.outcome, text: opt.text, tested: false });
                  setDonePredict((d) => [...d, currentId]);
                }}
              />
            )}

            {!scene.isEnding && sceneStep === "choices" && (
              <>
                {scene.isRetry && <SalimSays mood="think" text={salimText.onRetry} size={48} tone="sand" />}
                {!scene.isRetry && scene.choices.length > 1 && (
                  <SalimSays mood="ask" text={pick(profile, salimText.onChoice, salimText.onChoiceF)} size={48} tone="sand" />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {scene.choices.map((ch) => {
                    const { text, icon, isGrandpa } = parseChoiceLabel(ch.label);
                    return (
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
                          display: "flex", alignItems: "center", gap: 10,
                        }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = "scale(.98)"; }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = "none"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                      >
                        {isGrandpa && <span style={{ flexShrink: 0 }}><Salim mood="ask" size={30} /></span>}
                        {icon && <ImgFallback src={icon} alt="" width={26} height={26} style={{ flexShrink: 0 }} fallback={null} />}
                        <span style={{ flex: 1 }}>{text}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ===== النهاية: مراجعة أخيرة ثم التلخيص ثم الوسام ===== */}
            {scene.isEnding && pendingReview && (
              <ReviewCard
                review={pendingReview} profile={profile} tone={accent}
                onDone={() => setPendingReview(null)}
              />
            )}

            {scene.isEnding && !pendingReview && R && endStep === "order" && (
              <OrderEvents
                items={R.order} profile={profile} tone={accent}
                onDone={(res) => {
                  if (res && metrics.current.orderFirstTry === null) metrics.current.orderFirstTry = !!res.firstTry;
                  if (!res) setEndStep("mainIdea");
                }}
              />
            )}

            {scene.isEnding && !pendingReview && R && endStep === "mainIdea" && (
              <MainIdeaCard
                mainIdea={R.mainIdea} profile={profile} tone={accent}
                onDone={(firstTry) => { metrics.current.mainIdeaFirstTry = !!firstTry; setEndStep("words"); }}
              />
            )}

            {scene.isEnding && !pendingReview && R && endStep === "words" && (
              <WordCards
                words={R.words} story={story} profile={profile} tone={accent}
                onDone={(seen) => { metrics.current.wordsOpened = seen; setEndStep("wordCheck"); }}
              />
            )}

            {scene.isEnding && !pendingReview && R && endStep === "wordCheck" && (
              <WordCheck
                questions={R.wordCheck} profile={profile} tone={accent}
                onDone={(res) => {
                  metrics.current.wordScore = res.score;
                  metrics.current.wordTotal = res.total;
                  finishReading();
                  setEndStep("achievement");
                }}
              />
            )}

            {scene.isEnding && !pendingReview && R && endStep === "achievement" && (
              <AchievementCard
                metrics={metrics.current} profile={profile} tone={accent}
                onDone={() => setEndStep("badge")}
              />
            )}

            {scene.isEnding && !pendingReview && (!R || endStep === "badge") && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <div className="pop" style={{ background: "rgba(255,255,255,.95)", borderRadius: 18, padding: "16px 16px 18px", width: "100%", textAlign: "center", boxShadow: shadow.lg }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <IconChip bg={`${accent}22`} size={62} radius={22}>
                      <Glyph name="check" size={30} color={accent} strokeWidth={2.6} />
                    </IconChip>
                  </div>
                  <p style={{ margin: "8px 0 0", fontFamily: font.display, color: accent, fontWeight: 700, fontSize: 19 }}>{scene.badge}</p>
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
                    type="button" onClick={replay}
                    style={{ flex: 1, borderRadius: 14, border: "none", background: c.accent, color: "#FFF", padding: "12px 10px", minHeight: 48, fontFamily: font.display, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
                  >
                    {labels.replay}
                  </button>
                  <button
                    type="button" onClick={() => onComplete(story.id)}
                    style={{ flex: 1, borderRadius: 14, border: "none", background: accent, color: "#FFF", padding: "12px 10px", minHeight: 48, fontFamily: font.display, fontSize: 16, fontWeight: 700, cursor: "pointer" }}
                  >
                    {labels.backToStories2}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   شاشة المعلمة — ضغطة مطوّلة على شعار التطبيق
   مؤشرات داعمة فقط، بلا ترتيب بين الطلبة
   ============================================================ */
function useLongPress(onLong, ms = 1500) {
  const timer = useRef(null);
  const clear = () => { if (timer.current) { window.clearTimeout(timer.current); timer.current = null; } };
  useEffect(() => clear, []);
  return {
    onPointerDown: (e) => {
      if (e.currentTarget.setPointerCapture && e.pointerId != null) {
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* تجاهل */ }
      }
      clear();
      timer.current = window.setTimeout(() => { timer.current = null; onLong(); }, ms);
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (e) => e.preventDefault(),
    style: { touchAction: "manipulation", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" },
  };
}

function teacherRows() {
  const out = [];
  listDeviceProfiles().forEach((p) => {
    const reading = p.reading && typeof p.reading === "object" ? p.reading : {};
    Object.keys(reading).forEach((sId) => {
      const attempts = Array.isArray(reading[sId]) ? reading[sId] : [];
      if (!attempts.length) return;
      const st = stories.find((x) => x.id === sId);
      const m = summarize(attempts[0]);
      out.push({
        name: p.name,
        story: st ? st.title : sId,
        predict: m.predictTested ? `${m.predictMatched}/${m.predictTested}` : "—",
        unsure: String(m.unsure),
        inference: m.inferenceFirstTry === null ? "—" : (m.inferenceFirstTry ? "نعم" : "لا"),
        order: m.orderFirstTry === null ? "—" : (m.orderFirstTry ? "نعم" : "لا"),
        mainIdea: m.mainIdeaFirstTry === null ? "—" : (m.mainIdeaFirstTry ? "نعم" : "لا"),
        words: m.wordTotal ? `${m.wordScore}/${m.wordTotal}` : "—",
        minutes: String(m.minutes),
        attempts: attempts.length,
      });
    });
  });
  return out.sort((a, b) => a.name.localeCompare(b.name, "ar") || a.story.localeCompare(b.story, "ar"));
}

function TeacherSheet({ onClose }) {
  const rows = useMemo(teacherRows, []);
  const [copied, setCopied] = useState(false);
  const cols = readingTexts.teacherCols;

  const copy = async () => {
    const tsv = [cols.join("\t")].concat(
      rows.map((r) => [r.name, r.story, r.predict, r.unsure, r.inference, r.order, r.mainIdea, r.words, r.minutes].join("\t"))
    ).join("\n");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(tsv);
      else {
        const ta = document.createElement("textarea");
        ta.value = tsv; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
      }
      setCopied(true); window.setTimeout(() => setCopied(false), 1800);
    } catch (e) { /* تجاهل */ }
  };

  const cell = { padding: "8px 9px", fontSize: 12, fontFamily: font.body, color: c.ink, whiteSpace: "nowrap" };
  const head = { ...cell, fontFamily: font.display, fontWeight: 700, color: c.sageInk, background: `${c.sageInk}12` };

  return (
    <div
      role="dialog" aria-modal="true" aria-label={readingTexts.teacherTitle}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 90, background: "rgba(20,77,74,.42)",
        display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 12,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pop"
        style={{
          background: c.paper, borderRadius: 20, width: "100%", maxWidth: 760,
          maxHeight: "86vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: shadow.lg,
        }}
      >
        <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${c.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, flex: 1, fontFamily: font.display, fontWeight: 700, fontSize: 18, color: c.ink }}>
              {readingTexts.teacherTitle}
            </h2>
            <button type="button" onClick={onClose} style={{
              border: "none", background: `${c.ink}12`, color: c.ink, borderRadius: 999,
              padding: "7px 14px", minHeight: 38, fontFamily: font.body, fontSize: 13, cursor: "pointer",
            }}>{readingTexts.teacherClose}</button>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: c.inkSoft, fontFamily: font.body, lineHeight: 1.8 }}>
            {readingTexts.teacherHint}
          </p>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "10px 12px" }}>
          {rows.length === 0 ? (
            <p style={{ margin: "18px 0", textAlign: "center", color: c.inkSoft, fontSize: 13, fontFamily: font.body }}>
              {readingTexts.teacherEmpty}
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl" }}>
              <thead>
                <tr>{cols.map((h) => <th key={h} style={head}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 ? "transparent" : `${c.sage}44` }}>
                    <td style={cell}>{r.name}</td>
                    <td style={cell}>{r.story}</td>
                    <td style={cell}>{r.predict}</td>
                    <td style={cell}>{r.unsure}</td>
                    <td style={cell}>{r.inference}</td>
                    <td style={cell}>{r.order}</td>
                    <td style={cell}>{r.mainIdea}</td>
                    <td style={cell}>{r.words}</td>
                    <td style={cell}>{r.minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${c.line}` }}>
          <button type="button" onClick={copy} disabled={!rows.length} style={{
            width: "100%", border: "none", borderRadius: 14, background: rows.length ? c.sageInk : `${c.ink}22`,
            color: "#FFF", padding: "12px 10px", minHeight: 48, fontFamily: font.display,
            fontSize: 15.5, fontWeight: 700, cursor: rows.length ? "pointer" : "default",
          }}>{copied ? readingTexts.teacherCopied : readingTexts.teacherCopy}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   كلمات تتحرّك
   ============================================================ */
const WORD_ICON = {
  recycle: "recycleBin",
  faucet: "drop",
  habitat: "goat",
  warm: "baysun",
  collect: "recycleBin",
  palm: "tree",
  energy: "wind",
};

const WORD_IMG = {
  recycle: "assets/img/dictionary/dict-recycling.webp",
  conserve: "assets/img/dictionary/dict-water.webp",
  biodiversity: "assets/img/dictionary/dict-biodiversity.webp",
  warming: "assets/img/dictionary/dict-warming.webp",
  pollution: "assets/img/dictionary/dict-pollution.webp",
  sustainability: "assets/img/dictionary/dict-sustainability.webp",
  greenh2: "assets/img/dictionary/dict-hydrogen.webp",
};

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
            <ImgFallback
              src={WORD_IMG[t.id]} alt={t.term}
              width={44} height={44}
              fallback={
                <IconChip bg={c.sage} size={40} radius={14}>
                  <Glyph name={WORD_ICON[t.scene] || "star"} size={20} color={c.sageInk} strokeWidth={2.2} />
                </IconChip>
              }
            />
            {t.term}
          </button>
        ))}
      </div>
      <BigButton
        title={labels.doDont} sub="أُصَنِّفُ السُّلُوكَ بِنَفْسِي" icon="check"
        image="assets/img/dictionary/dict-dodont.webp" imageAlt="بطاقات افعل ولا تفعل"
        bg={c.sageDeep} fg={c.onDark} onClick={onOpenDoDont}
      />
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
      {footerText} © {COPYRIGHT_YEAR}
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
  const [view, setView] = useState("home");
  const [storyId, setStoryId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [wordId, setWordId] = useState(null);
  const [pendingQuiz, setPendingQuiz] = useState(null);
  const [teacher, setTeacher] = useState(false);
  const [loading, setLoading] = useState(false);

  const start = async (name, gender) => {
    setLoading(true);
    const p = await loadProfile(name, gender);
    setProfile(p);
    setLoading(false);
    setView(p.accepted ? "home" : "mission");
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
      setView("stories");
    }
  };

  const completeGame = async (gId) => {
    if (!profile) return;
    const gamesDone = profile.gamesDone.includes(gId) ? profile.gamesDone : [...profile.gamesDone, gId];
    const next = { ...profile, gamesDone };
    setProfile(next);
    await saveProfile(next);
    setView("games");
  };

  const finishQuiz = async () => {
    const next = { ...profile, quizzesTaken: [...profile.quizzesTaken, pendingQuiz] };
    setProfile(next);
    await saveProfile(next);
    setPendingQuiz(null);
    setView("stories");
  };

  const acceptMission = async () => {
    const next = { ...profile, accepted: true };
    setProfile(next);
    await saveProfile(next);
    setView("home");
  };

  /* شاشة المعلمة — ضغطة مطوّلة على شعار التطبيق */
  const heldRef = useRef(false);
  const holdHandlers = useLongPress(() => { heldRef.current = true; setTeacher(true); }, 1500);
  const logoHold = {
    ...holdHandlers,
    onPointerDown: (e) => { heldRef.current = false; holdHandlers.onPointerDown(e); },
  };

  /* مؤشرات القراءة — تُحفظ محاولةً بعد محاولةٍ، والأولى هي المعتمدة في البحث */
  const recordReading = async (sId, m) => {
    if (!profile) return;
    const prev = profile.reading && typeof profile.reading === "object" ? profile.reading : {};
    const attempts = Array.isArray(prev[sId]) ? prev[sId] : [];
    const next = { ...profile, reading: { ...prev, [sId]: [...attempts, { ...m, at: Date.now() }] } };
    setProfile(next);
    await saveProfile(next);
  };

  const updateProfile = async (patch) => {
    if (!profile) return;
    const next = { ...profile, ...patch };
    setProfile(next);
    await saveProfile(next);
  };

  const story = useMemo(() => stories.find((s) => s.id === storyId), [storyId]);
  const term = useMemo(() => dictionaryTerms.find((t) => t.id === wordId), [wordId]);
  const openStory = (id) => { setStoryId(id); setView("story"); };
  const openGame = (id) => { setGameId(id); setView("game"); };
  const Game = gameId ? GAMES[gameId] : null;

  const content = () => {
    if (view === "story" && story) {
      return (
        <StoryPlayer
          story={story} profile={profile} rounded={vp !== "phone"}
          onComplete={completeStory} onExit={() => setView("stories")}
          onReadingDone={recordReading}
        />
      );
    }
    if (view === "game" && Game) {
      return (
        <Game
          profile={profile} onExit={() => setView("games")} onWin={() => completeGame(gameId)}
          onUpdateProfile={updateProfile}
        />
      );
    }
    if (view === "quiz" && pendingQuiz !== null) return <Quiz setIndex={pendingQuiz - 1} profile={profile} onFinish={finishQuiz} />;
    if (view === "word" && term) return <WordDetail term={term} profile={profile} onBack={() => setView("words")} />;
    if (view === "dodont") return <DoDont onBack={() => setView("words")} />;
    if (view === "stories") return <StoriesScreen profile={profile} onOpenStory={openStory} onBack={() => setView("home")} />;
    if (view === "games") return <GamesScreen profile={profile} onOpen={openGame} onBack={() => setView("home")} />;
    if (view === "words") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <ScreenHead title={sections.words} onBack={() => setView("home")} backText={labels.backToMap} />
          <WordsList profile={profile} onOpen={(id) => { setWordId(id); setView("word"); }} onOpenDoDont={() => setView("dodont")} />
        </div>
      );
    }

    return <HomePanel profile={profile} go={setView} compact={false} />;
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

  if (view === "mission") {
    return (
      <Screen>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" }}>
          <MissionLetter profile={profile} onAccept={acceptMission} />
        </div>
        <Footer />
      </Screen>
    );
  }

  const done = profile.completed || [];

  return (
    <Screen>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 2px 14px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => { if (heldRef.current) { heldRef.current = false; return; } setView("home"); }}
          {...logoHold}
          style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "right", ...logoHold.style }}
        >
          <Salim mood="smile" size={40} />
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 11.5, color: c.inkFaint, fontFamily: font.body }}>أَهْلًا بِكَ</span>
            <span style={{ display: "block", fontFamily: font.display, fontWeight: 700, fontSize: 19, color: c.ink, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {profile.name}
            </span>
          </span>
        </button>
        <ProgressPill done={done.length} total={stories.length} />
      </header>

      {wide ? (
        <div style={{ display: "grid", gridTemplateColumns: "352px minmax(0,1fr)", gap: 26, alignItems: "start", flex: 1 }}>
          <aside style={{ position: "sticky", top: 16 }}>
            <HomePanel profile={profile} go={setView} compact />
          </aside>
          <section style={{ minWidth: 0 }}>
            {view === "home" ? (
              <Card pad={24}>
                <SalimSays mood="smile" text={pick(profile, salimText.welcome, salimText.welcomeF)} size={74} />
                <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 2, color: c.inkSoft, fontFamily: font.body }}>
                  {isF(profile)
                    ? "اخْتَارِي قِسْمًا مِنَ الجَانِبِ: قِصَصٌ تَقُودِينَهَا، وَأَلْعَابٌ تُجَرِّبِينَ فِيهَا قَرَارَاتِكِ، وَمُعْجَمًا بَصَرِيًّا تَسْتَكْشِفِينَهُ بِيَدَيْكِ."
                    : "اخْتَرْ قِسْمًا مِنَ الجَانِبِ: قِصَصٌ تَقُودُهَا، وَأَلْعَابٌ تُجَرِّبُ فِيهَا قَرَارَاتِكَ، وَمُعْجَمًا بَصَرِيًّا تَسْتَكْشِفُهُ بِيَدَيْكَ."}
                </p>
              </Card>
            ) : content()}
          </section>
        </div>
      ) : (
        <div style={{ flex: 1, maxWidth: vp === "tablet" ? 640 : "none", width: "100%", margin: "0 auto" }}>{content()}</div>
      )}

      <Footer />
      {teacher && <TeacherSheet onClose={() => setTeacher(false)} />}
      {loading && <Loading />}
    </Screen>
  );
}
