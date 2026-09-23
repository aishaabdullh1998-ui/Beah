/* ============================================================
   طبقة الاستراتيجيات القرائية — «أَتَوَقَّعُ ثُمَّ أَرَى»
   التنبؤ · الربط بالخبرة · الاستنتاج · التلخيص · المفردات

   النصوص في content.js (readingTexts)، والألوان في theme.js.
   هذا الملف لبطاقات الاستراتيجيات فقط.
   ============================================================ */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { c, shadow, font, ease } from "./theme.js";
import { readingTexts as R } from "./content.js";
import { Glyph, IconChip, Salim, SalimSays } from "./art.jsx";

const isF = (p) => p && p.gender === "f";
const pick = (p, m, f) => (isF(p) ? (f || m) : m);

/* ============================================================
   النطق — كل سؤال مسموع
   ============================================================ */
export function speakArabic(text) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis || !text) return false;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new window.SpeechSynthesisUtterance(String(text));
    u.lang = "ar-SA";
    u.rate = 0.85;
    u.pitch = 1;
    const voices = synth.getVoices ? synth.getVoices() : [];
    const ar = voices.find((v) => v.lang && v.lang.toLowerCase().indexOf("ar") === 0);
    if (ar) u.voice = ar;
    synth.speak(u);
    return true;
  } catch (e) { return false; }
}

export function stopSpeaking() {
  try { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); }
  catch (e) { /* تجاهل */ }
}

/* زر السماعة — يظهر بجانب كل سؤال */
export function Listen({ text, color = c.sageInk }) {
  const [on, setOn] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  if (!text) return null;
  return (
    <button
      type="button"
      aria-label={R.listen}
      title={R.listen}
      onClick={() => { setOn(true); speakArabic(text); window.setTimeout(() => setOn(false), 1200); }}
      style={{
        flex: "none", width: 36, height: 36, borderRadius: 999, cursor: "pointer",
        border: "none", background: `${color}1A`, color,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transform: on ? "scale(.92)" : "none", transition: `transform .2s ${ease}`,
      }}
    >
      <SpeakerIcon color={color} />
    </button>
  );
}

function SpeakerIcon({ color }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 5 6.5 8.5H3.5v7h3L11 19V5Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M15 9.2a4 4 0 0 1 0 5.6M17.8 6.4a8 8 0 0 1 0 11.2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   هيكل البطاقة المشترك
   ============================================================ */
export function ReadingCard({ tag, ask, speakText, children, mood = "ask", tone = c.sageInk }) {
  return (
    <div
      className="pop"
      style={{
        background: "rgba(255,250,236,.98)", borderRadius: 18, padding: 15,
        boxShadow: shadow.lg, border: `2px solid ${tone}22`,
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      {tag && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: `${tone}18`, color: tone, borderRadius: 999, padding: "4px 12px",
            fontFamily: font.display, fontWeight: 700, fontSize: 12.5,
          }}>{tag}</span>
        </div>
      )}
      {ask && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
          <div style={{ flex: "none", marginTop: 2 }}><Salim mood={mood} size={44} /></div>
          <p style={{ margin: 0, flex: 1, fontFamily: font.display, fontWeight: 700, fontSize: 16, lineHeight: 1.85, color: c.ink }}>
            {ask}
          </p>
          <Listen text={speakText || ask} color={tone} />
        </div>
      )}
      {children}
    </div>
  );
}

/* السؤال وخياراته معًا — ليسمعها من لا يقرأها بعدُ */
function readAloud(ask, options) {
  const list = (options || []).map((o, i) => `${toArabicOrdinal(i)}: ${typeof o === "string" ? o : o.text}`);
  return [ask].concat(list).join("… ");
}

function toArabicOrdinal(i) {
  return ["الأَوَّلُ", "الثَّانِي", "الثَّالِثُ", "الرَّابِعُ"][i] || String(i + 1);
}

/* زر خيار عام */
export function OptionBtn({ label, onClick, state = "idle", disabled, tone = c.sageInk }) {
  const bgFor = { idle: "#FFFFFF", chosen: tone, right: c.good, dim: "#FFFFFF" };
  const fgFor = { idle: tone, chosen: "#FFF", right: "#FFF", dim: c.inkSoft };
  return (
    <button
      type="button" onClick={onClick} disabled={disabled}
      className="btn-pop"
      style={{
        width: "100%", textAlign: "right", borderRadius: 14, padding: "12px 15px",
        border: `2px solid ${state === "idle" || state === "dim" ? `${tone}2E` : "transparent"}`,
        background: bgFor[state] || "#FFF", color: fgFor[state] || tone,
        fontFamily: font.display, fontSize: 15.5, fontWeight: 700, lineHeight: 1.7,
        cursor: disabled ? "default" : "pointer", boxShadow: state === "idle" ? shadow.sm : "none",
        minHeight: 48, opacity: state === "dim" ? 0.55 : 1,
        transition: `all .25s ${ease}`,
      }}
    >
      {label}
    </button>
  );
}

/* زر المتابعة */
export function NextBtn({ label, onClick, tone = c.sageInk }) {
  return (
    <button
      type="button" onClick={onClick} className="btn-pop"
      style={{
        width: "100%", borderRadius: 14, border: "none", background: tone, color: "#FFF",
        padding: "13px 10px", minHeight: 50, fontFamily: font.display, fontSize: 16.5,
        fontWeight: 700, cursor: "pointer", boxShadow: shadow.md,
      }}
    >
      {label}
    </button>
  );
}

function Note({ text, tone = c.sageInk, soft }) {
  return (
    <div style={{
      background: soft ? `${tone}12` : `${tone}18`, borderRadius: 12, padding: "10px 13px",
      display: "flex", alignItems: "flex-start", gap: 8,
    }}>
      <p style={{ margin: 0, flex: 1, fontSize: 13.5, lineHeight: 1.9, color: c.ink, fontFamily: font.body }}>{text}</p>
      <Listen text={text} color={tone} />
    </div>
  );
}

/* ============================================================
   نص المشهد مع إبراز الدليل وتحديد كلمات القصة
   ============================================================ */
export function ReadingText({ text, words = [], evidence, onWord, tone = c.sageInk }) {
  return (
    <p style={{ margin: "8px 0 0", color: "#33301F", lineHeight: 2, fontSize: 14.5, fontFamily: font.body }}>
      <ReadingInline text={text} words={words} evidence={evidence} onWord={onWord} tone={tone} />
    </p>
  );
}

/* المقاطع نفسها بلا غلاف، لتُستعمل داخل العنوان أيضًا */
export function ReadingInline({ text, words = [], evidence, onWord, tone = c.sageInk }) {
  const parts = useMemo(() => splitText(text, words, evidence), [text, words, evidence]);
  return (
    <>
      {parts.map((part, i) => {
        if (part.kind === "evidence") {
          return (
            <mark key={i} style={{
              background: "#FFE9A8", color: c.ink, borderRadius: 6, padding: "2px 3px",
              boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone",
            }}>{part.text}</mark>
          );
        }
        if (part.kind === "word") {
          return (
            <button
              key={i} type="button" onClick={() => onWord && onWord(part.word)}
              style={{
                border: "none", background: "transparent", padding: 0, margin: 0,
                font: "inherit", fontWeight: 700, color: tone, cursor: onWord ? "pointer" : "text",
                borderBottom: `2px dotted ${tone}`, lineHeight: "inherit",
              }}
            >{part.text}</button>
          );
        }
        return <React.Fragment key={i}>{part.text}</React.Fragment>;
      })}
    </>
  );
}

/* يقسّم النص إلى مقاطع عادية ومقاطع مُبرَزة، بلا تداخل */
function splitText(text, words, evidence) {
  const src = String(text || "");
  const marks = [];
  const push = (needle, extra) => {
    if (!needle) return;
    const at = src.indexOf(needle);
    if (at < 0) return;
    marks.push({ start: at, end: at + needle.length, ...extra });
  };
  push(evidence, { kind: "evidence" });
  (words || []).forEach((w) => push(w.match || w.word, { kind: "word", word: w }));

  marks.sort((a, b) => a.start - b.start);
  const out = [];
  let at = 0;
  marks.forEach((m) => {
    if (m.start < at) return; // تداخل — نتجاهل الثاني
    if (m.start > at) out.push({ kind: "plain", text: src.slice(at, m.start) });
    out.push({ ...m, text: src.slice(m.start, m.end) });
    at = m.end;
  });
  if (at < src.length) out.push({ kind: "plain", text: src.slice(at) });
  return out;
}

/* ============================================================
   ١ · بطاقة «قبل أن نقرأ»
   ============================================================ */
export function PreviewCard({ story, profile, tone, onDone }) {
  const pv = story.reading.preview;
  const [chosen, setChosen] = useState(null);
  const ask = pick(profile, pv.ask, pv.askF);
  return (
    <ReadingCard tag={R.previewTitle} ask={ask} speakText={readAloud(ask, pv.options)} tone={tone}>
      {chosen === null ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {pv.options.map((o, i) => (
            <OptionBtn key={i} label={o} tone={tone} onClick={() => setChosen(i)} />
          ))}
        </div>
      ) : (
        <>
          <OptionBtn label={pv.options[chosen]} state="chosen" tone={tone} disabled />
          <Note text={pick(profile, R.previewAfter, R.previewAfterF)} tone={tone} />
          <NextBtn label={R.previewStart} tone={tone} onClick={() => onDone(chosen)} />
        </>
      )}
    </ReadingCard>
  );
}

/* ============================================================
   ٢ · بطاقة الربط بالخبرة
   ============================================================ */
export function ConnectCard({ connect, profile, tone, onDone }) {
  const [answer, setAnswer] = useState(null);
  const ask = pick(profile, connect.ask, connect.askF);
  const opts = [
    { key: "yes", label: R.connectYes },
    { key: "no", label: R.connectNo },
    { key: "maybe", label: pick(profile, R.connectMaybe, R.connectMaybeF) },
  ];
  return (
    <ReadingCard tag={pick(profile, R.connectTitle, R.connectTitleF)} ask={ask} speakText={readAloud(ask, opts.map((o) => o.label))} tone={tone}>
      {answer === null ? (
        <div style={{ display: "flex", gap: 8 }}>
          {opts.map((o) => (
            <div key={o.key} style={{ flex: 1 }}>
              <OptionBtn label={o.label} tone={tone} onClick={() => setAnswer(o.key)} />
            </div>
          ))}
        </div>
      ) : (
        <>
          <Note text={pick(profile, R.connectAfter, R.connectAfterF)} tone={tone} />
          <NextBtn label={R.reviewDone} tone={tone} onClick={() => onDone(answer)} />
        </>
      )}
    </ReadingCard>
  );
}

/* ============================================================
   ٣ · بطاقة التنبؤ — لا تُصحَّح أبدًا
   ============================================================ */
export function PredictCard({ predict, profile, tone, onDone }) {
  const [chosen, setChosen] = useState(null);
  const ask = pick(profile, predict.ask, predict.askF);
  return (
    <ReadingCard tag={R.predictTitle} ask={ask} speakText={readAloud(ask, predict.options)} tone={tone}>
      {chosen === null ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {predict.options.map((o, i) => (
            <OptionBtn key={i} label={o.text} tone={tone} onClick={() => setChosen(i)} />
          ))}
        </div>
      ) : (
        <>
          <OptionBtn label={predict.options[chosen].text} state="chosen" tone={tone} disabled />
          <Note text={pick(profile, R.predictSaved, R.predictSavedF)} tone={tone} />
          <NextBtn label={R.reviewDone} tone={tone} onClick={() => onDone(predict.options[chosen])} />
        </>
      )}
    </ReadingCard>
  );
}

/* ============================================================
   ٤ · بطاقة المراجعة — جوهر الدورة
   ============================================================ */
export function ReviewCard({ review, profile, tone, onDone }) {
  const { predictText, outcome, tested } = review;
  const matched = tested && outcome === "yes";
  const line = !tested
    ? pick(profile, R.reviewUntested, R.reviewUntestedF)
    : outcome === "unsure"
      ? pick(profile, R.reviewUnsure, R.reviewUnsureF)
      : matched
        ? pick(profile, R.reviewMatch, R.reviewMatchF)
        : pick(profile, R.reviewDiffer, R.reviewDifferF);
  const happened = tested
    ? review.happened
    : pick(profile, review.untested, review.untestedF);

  return (
    <ReadingCard tag={R.reviewTitle} tone={tone} mood={matched ? "agree" : "think"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <Row label={R.reviewMine} text={predictText} tone={tone} />
        <Row label={R.reviewHappened} text={happened} tone={c.accent} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
        <div style={{ flex: "none" }}><Salim mood={matched ? "agree" : "think"} size={44} /></div>
        <p style={{ margin: 0, flex: 1, fontSize: 13.5, lineHeight: 1.95, color: c.ink, fontFamily: font.body }}>{line}</p>
        <Listen text={line} color={tone} />
      </div>
      <NextBtn label={R.reviewDone} tone={tone} onClick={onDone} />
    </ReadingCard>
  );
}

function Row({ label, text, tone }) {
  return (
    <div style={{
      background: `${tone}12`, borderRight: `4px solid ${tone}`, borderRadius: 12,
      padding: "10px 13px",
    }}>
      <p style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 12.5, color: tone }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.85, color: c.ink, fontFamily: font.body }}>{text}</p>
    </div>
  );
}

/* ============================================================
   ٥ · سؤال الاستنتاج — محاولتان ثم الشرح
   ============================================================ */
export function InferenceCard({ inference, profile, tone, onDone, onReveal }) {
  const [tries, setTries] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [solved, setSolved] = useState(false);
  const revealed = tries >= 2 && !solved;

  const choose = (opt, i) => {
    if (solved || revealed) return;
    if (opt.correct) {
      setSolved(true);
      onReveal && onReveal(tries === 0);
      return;
    }
    const n = tries + 1;
    setTries(n);
    setWrong((w) => [...w, i]);
    if (n >= 2) onReveal && onReveal(false);
  };

  const correctIdx = inference.options.findIndex((o) => o.correct);
  return (
    <ReadingCard tag={R.inferenceTitle} ask={inference.ask} speakText={readAloud(inference.ask, inference.options)} tone={tone} mood={solved ? "agree" : "ask"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {inference.options.map((o, i) => {
          let state = "idle";
          if (solved || revealed) state = i === correctIdx ? "right" : "dim";
          else if (wrong.includes(i)) state = "dim";
          return (
            <OptionBtn key={i} label={o.text} state={state} tone={tone}
              disabled={solved || revealed || wrong.includes(i)}
              onClick={() => choose(o, i)} />
          );
        })}
      </div>
      {!solved && !revealed && tries > 0 && (
        <Note text={pick(profile, R.inferenceHint, R.inferenceHintF)} tone={c.accent} />
      )}
      {(solved || revealed) && (
        <>
          <Note text={solved ? pick(profile, R.inferenceRight, R.inferenceRightF) : ""} tone={c.good} soft />
          <Note text={inference.explain} tone={tone} />
          <NextBtn label={R.inferenceDone} tone={tone} onClick={onDone} />
        </>
      )}
    </ReadingCard>
  );
}

/* ============================================================
   ٦ · ترتيب الأحداث — باللمس، لا بالسحب
   ============================================================ */
export function OrderEvents({ items, profile, tone, onDone }) {
  const shuffled = useMemo(() => shuffleStable(items), [items]);
  const [picked, setPicked] = useState([]);
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);

  const full = picked.length === items.length;
  const right = full && picked.every((idx, pos) => idx === pos);

  useEffect(() => {
    if (!full || done) return;
    if (right) { setDone(true); onDone && onDone({ firstTry: tries === 0, attempts: tries + 1, ok: true }); }
    else setTries((t) => t + 1);
  }, [full, right, done]);

  const tap = (idx) => {
    if (done || picked.includes(idx)) return;
    setPicked((p) => [...p, idx]);
  };
  const reset = () => setPicked([]);

  return (
    <ReadingCard tag={R.orderTitle} ask={R.orderAsk} speakText={readAloud(R.orderAsk, items)} tone={tone} mood={done ? "agree" : "ask"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {shuffled.map((idx) => {
          const pos = picked.indexOf(idx);
          const state = pos >= 0 ? (done ? "right" : "chosen") : "idle";
          return (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{
                flex: "none", width: 30, height: 30, borderRadius: 999,
                background: pos >= 0 ? tone : `${tone}18`, color: pos >= 0 ? "#FFF" : tone,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: font.display, fontWeight: 700, fontSize: 14,
              }}>{pos >= 0 ? toArabicDigits(pos + 1) : "•"}</span>
              <div style={{ flex: 1 }}>
                <OptionBtn label={items[idx]} state={state} tone={tone}
                  disabled={done || pos >= 0} onClick={() => tap(idx)} />
              </div>
            </div>
          );
        })}
      </div>
      {!done && full && (
        <>
          <Note text={pick(profile, R.orderWrong, R.orderWrongF)} tone={c.accent} />
          {tries >= 2 && <Note text={R.orderHint} tone={tone} soft />}
          <NextBtn label={R.orderReset} tone={c.accent} onClick={reset} />
        </>
      )}
      {done && (
        <>
          <Note text={R.orderRight} tone={c.good} soft />
          <NextBtn label={R.orderDone} tone={tone} onClick={() => onDone && onDone(null)} />
        </>
      )}
    </ReadingCard>
  );
}

function toArabicDigits(n) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

/* خلط ثابت لا يتغيّر بين إعادات الرسم */
function shuffleStable(items) {
  const idx = items.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  // نتجنّب أن يخرج الترتيب صحيحًا من البداية
  if (idx.every((v, i) => v === i) && idx.length > 1) [idx[0], idx[1]] = [idx[1], idx[0]];
  return idx;
}

/* ============================================================
   ٧ · الفكرة الرئيسة
   ============================================================ */
export function MainIdeaCard({ mainIdea, profile, tone, onDone }) {
  const [chosen, setChosen] = useState(null);
  const [solved, setSolved] = useState(false);
  const [firstOk, setFirstOk] = useState(null);
  const correctIdx = mainIdea.options.findIndex((o) => o.correct);

  const choose = (o, i) => {
    if (solved) return;
    setChosen(i);
    if (firstOk === null) setFirstOk(!!o.correct);
    if (o.correct) setSolved(true);
  };

  return (
    <ReadingCard tag={R.mainIdeaTitle} ask={mainIdea.ask} speakText={readAloud(mainIdea.ask, mainIdea.options)} tone={tone} mood={solved ? "agree" : "ask"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {mainIdea.options.map((o, i) => {
          let state = "idle";
          if (solved) state = i === correctIdx ? "right" : "dim";
          else if (chosen === i) state = "dim";
          return (
            <OptionBtn key={i} label={o.text} state={state} tone={tone}
              disabled={solved} onClick={() => choose(o, i)} />
          );
        })}
      </div>
      {!solved && chosen !== null && <Note text={R.mainIdeaPartial} tone={c.accent} />}
      {solved && (
        <>
          <Note text={R.mainIdeaRight} tone={c.good} soft />
          <NextBtn label={R.mainIdeaDone} tone={tone} onClick={() => onDone(!!firstOk)} />
        </>
      )}
    </ReadingCard>
  );
}

/* ============================================================
   ٨ · كلمات القصة
   ============================================================ */
export function WordCards({ words, story, profile, tone, onDone }) {
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState([]);
  const touch = (i) => {
    setOpen(open === i ? null : i);
    setSeen((s) => (s.includes(i) ? s : [...s, i]));
  };
  return (
    <ReadingCard tag={R.wordsTitle} ask={pick(profile, R.wordsAsk, R.wordsAskF)} tone={tone}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {words.map((w, i) => {
          const sc = story.scenes[w.inScene];
          const sentence = sc ? sentenceWith(sc.text, w.match || w.word) || sc.title : "";
          return (
            <div key={i} style={{
              background: "#FFFFFF", borderRadius: 14, boxShadow: shadow.sm,
              border: `2px solid ${seen.includes(i) ? `${tone}44` : `${tone}1F`}`, overflow: "hidden",
            }}>
              <button
                type="button" onClick={() => touch(i)} className="btn-pop"
                style={{
                  width: "100%", textAlign: "right", border: "none", background: "transparent",
                  padding: "12px 15px", minHeight: 48, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 9,
                }}
              >
                <span style={{
                  flex: 1, fontFamily: font.display, fontWeight: 700, fontSize: 17, color: tone,
                  borderBottom: `2px dotted ${tone}`,
                }}>{w.word}</span>
                <span aria-hidden="true" style={{ color: tone, fontSize: 15, transform: open === i ? "rotate(180deg)" : "none", transition: `transform .25s ${ease}` }}>⌄</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 15px 13px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <p style={{ margin: 0, flex: 1, fontSize: 14, lineHeight: 1.9, color: c.ink, fontFamily: font.body }}>{w.meaning}</p>
                    <Listen text={`${w.word}. ${w.meaning}`} color={tone} />
                  </div>
                  {sentence && (
                    <div style={{ background: `${tone}12`, borderRadius: 11, padding: "9px 12px" }}>
                      <p style={{ margin: 0, fontFamily: font.display, fontWeight: 700, fontSize: 12, color: tone }}>{R.wordsInText}</p>
                      <p style={{ margin: "4px 0 0", fontSize: 13.5, lineHeight: 1.9, color: c.ink, fontFamily: font.body }}>{sentence}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <NextBtn label={R.wordsDone} tone={tone} onClick={() => onDone(seen.length)} />
    </ReadingCard>
  );
}

/* يستخرج الجملة التي وردت فيها الكلمة */
function sentenceWith(text, needle) {
  const src = String(text || "");
  const at = src.indexOf(needle);
  if (at < 0) return "";
  const stops = ["،", ".", "؟", "!", "؛"];
  let s = 0, e = src.length;
  for (let i = at; i >= 0; i -= 1) if (stops.includes(src[i])) { s = i + 1; break; }
  for (let i = at + needle.length; i < src.length; i += 1) if (stops.includes(src[i])) { e = i + 1; break; }
  return src.slice(s, e).trim();
}

/* ============================================================
   ٩ · سؤال توظيف الكلمة
   ============================================================ */
export function WordCheck({ questions, profile, tone, onDone }) {
  const [qi, setQi] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [counted, setCounted] = useState(false);

  const q = questions[qi];
  const correctIdx = q.options.findIndex((o) => o.correct);

  const choose = (o, i) => {
    if (solved) return;
    setChosen(i);
    if (!counted) { setCounted(true); if (o.correct) setScore((s) => s + 1); }
    if (o.correct) setSolved(true);
  };

  const next = () => {
    if (qi + 1 < questions.length) {
      setQi(qi + 1); setChosen(null); setSolved(false); setCounted(false);
    } else onDone({ score: score, total: questions.length });
  };

  return (
    <ReadingCard tag={R.wordCheckTitle} ask={q.ask} speakText={readAloud(q.ask, q.options)} tone={tone} mood={solved ? "agree" : "ask"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {q.options.map((o, i) => {
          let state = "idle";
          if (solved) state = i === correctIdx ? "right" : "dim";
          else if (chosen === i) state = "dim";
          return (
            <OptionBtn key={i} label={o.text} state={state} tone={tone}
              disabled={solved} onClick={() => choose(o, i)} />
          );
        })}
      </div>
      {!solved && chosen !== null && <Note text={pick(profile, R.wordCheckWrong, R.wordCheckWrongF)} tone={c.accent} />}
      {solved && (
        <>
          <Note text={pick(profile, R.wordCheckRight, R.wordCheckRightF)} tone={c.good} soft />
          <NextBtn label={R.wordsDone} tone={tone} onClick={next} />
        </>
      )}
    </ReadingCard>
  );
}

/* ============================================================
   ١٠ · بطاقة الإنجاز — أرقام الطفل نفسه، بلا مقارنة
   ============================================================ */
export function AchievementCard({ metrics, profile, tone, onDone }) {
  const m = summarize(metrics);
  const yes = R.achieveYes, no = R.achieveNo;
  const rows = [
    { k: R.achievePredict, v: m.predictTested ? `${toArabicDigits(m.predictMatched)} / ${toArabicDigits(m.predictTested)}` : R.achieveNone },
    { k: R.achieveUnsure, v: toArabicDigits(m.unsure) },
    { k: R.achieveInference, v: m.inferenceFirstTry === null ? R.achieveNone : (m.inferenceFirstTry ? yes : no) },
    { k: R.achieveOrder, v: m.orderFirstTry === null ? R.achieveNone : (m.orderFirstTry ? yes : no) },
    { k: R.achieveMainIdea, v: m.mainIdeaFirstTry === null ? R.achieveNone : (m.mainIdeaFirstTry ? yes : no) },
    { k: R.achieveWords, v: m.wordTotal ? `${toArabicDigits(m.wordScore)} / ${toArabicDigits(m.wordTotal)}` : R.achieveNone },
    { k: R.achieveTime, v: `${toArabicDigits(m.minutes)} ${R.achieveMinutes}` },
  ];
  return (
    <ReadingCard tag={R.achieveTitle} tone={tone} mood="agree">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <IconChip bg={`${tone}1A`} size={62} radius={22}>
          <Glyph name="medal" size={30} color={tone} strokeWidth={2.4} />
        </IconChip>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, background: i % 2 ? "transparent" : `${tone}0F`,
            borderRadius: 10, padding: "9px 12px",
          }}>
            <span style={{ flex: 1, fontSize: 13.5, color: c.ink, fontFamily: font.body, lineHeight: 1.7 }}>{r.k}</span>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15, color: tone }}>{r.v}</span>
          </div>
        ))}
      </div>
      <Note text={pick(profile, R.achieveNote, R.achieveNoteF)} tone={tone} soft />
      <NextBtn label={R.achieveDone} tone={tone} onClick={onDone} />
    </ReadingCard>
  );
}

/* ============================================================
   تلخيص المؤشرات — يُستعمل في البطاقة وفي شاشة المعلمة
   ============================================================ */
export function summarize(metrics) {
  const m = metrics || {};
  const preds = Array.isArray(m.predictions) ? m.predictions : [];
  const tested = preds.filter((p) => p.tested);
  return {
    predictTotal: preds.length,
    predictTested: tested.length,
    predictMatched: tested.filter((p) => p.outcome === "yes").length,
    unsure: preds.filter((p) => p.outcome === "unsure").length,
    inferenceFirstTry: typeof m.inferenceFirstTry === "boolean" ? m.inferenceFirstTry : null,
    orderFirstTry: typeof m.orderFirstTry === "boolean" ? m.orderFirstTry : null,
    mainIdeaFirstTry: typeof m.mainIdeaFirstTry === "boolean" ? m.mainIdeaFirstTry : null,
    wordScore: m.wordScore || 0,
    wordTotal: m.wordTotal || 0,
    wordsOpened: m.wordsOpened || 0,
    previewChoice: typeof m.previewChoice === "number" ? m.previewChoice : null,
    connectAnswer: m.connectAnswer || null,
    minutes: Math.max(1, Math.round((m.seconds || 0) / 60)),
    seconds: m.seconds || 0,
  };
}
