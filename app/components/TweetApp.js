"use client";

import { useState, useCallback } from "react";

const SEED_TWEETS = [
  { id: 1, category: "Freedom & Time", tweet: `Closing your laptop at 2PM on a Wednesday because you can.\n\nNo boss. No permission. No guilt.\n\nThis is what we're building towards as Nigerian techies.\n\nThe freedom to own your time is the real bag.\n\nYa Allah, make it happen 🤲` },
  { id: 2, category: "Freedom & Time", tweet: `Imagine waking up on a Tuesday in Lagos,\nnot rushing for danfo,\nnot praying NEPA brings light for the office.\n\nJust opening your laptop. On YOUR terms.\n\nThat's the techie dream. Build it daily. 💻` },
  { id: 3, category: "Wealth & Mindset", tweet: `Real wealth as a Nigerian techie:\n\n→ Dollar income, naira expenses\n→ No panic when exchange rate shifts\n→ Helping your family without checking your balance\n→ Sleeping at night without calculating costs\n\nWe go get there. 🙏` },
  { id: 4, category: "Wealth & Mindset", tweet: `Dollar-denominated skills + naira cost of living = one of the best arbitrages in the world.\n\nWe live in Nigeria. We earn globally.\n\nSomeone is reading this and still sleeping on the opportunity. Wake up. 🌅` },
  { id: 5, category: "The Techie Grind", tweet: `Nobody in Nigeria told us tech was easy.\n\nBad light. Expensive data. No mentors. No roadmap.\n\nAnd we still learned to code, design, market, and ship.\n\nIf that's not proof we can build anything — I don't know what is. 🔥` },
  { id: 6, category: "The Techie Grind", tweet: `NEPA takes light.\nYou switch to inverter.\nInverter dies.\nYou use hotspot.\nHotspot is slow.\nYou still ship.\n\nOther developers call that adversity.\nWe call it Tuesday. 😤💪` },
  { id: 7, category: "Remote Work", tweet: `The best thing about remote work as a Nigerian developer:\n\nYour value is determined by your output, not your proximity to the office.\n\nCode speaks every language.\nDesign has no borders.\n\nBuild and get paid globally. 🌐` },
  { id: 8, category: "Freelancing", tweet: `Your first $100 freelancing will feel more valuable than your first ₦100k salary.\n\nBecause YOU earned it. No company. No boss. No permission slip.\n\nJust your skill, your client, your money. 💪` },
  { id: 9, category: "Community & Giving", tweet: `When you blow, carry people with you.\n\nNot after you check your account.\nNot "when the time is right."\n\nThe best Nigerian techies I know help freely.\n\nAbundance mentality > scarcity mindset. 🤝` },
  { id: 10, category: "Family & Peace", tweet: `Going to sleep without fretting about costs.\n\nWaking up without dreading the day.\n\nThese sound simple but for many Nigerian families, they're the real dream.\n\nTech can buy back that peace. Build. 💚` },
];

const CATEGORIES = [
  "Freedom & Time", "Wealth & Mindset", "The Techie Grind",
  "Remote Work", "Freelancing", "Community & Giving",
  "Travel & Experiences", "Family & Peace", "Imposter Syndrome", "Nigeria Specific",
];

const CAT_COLORS = {
  "Freedom & Time": "#00e676", "Wealth & Mindset": "#ffd700",
  "The Techie Grind": "#ff6b35", "Remote Work": "#00bcd4",
  "Freelancing": "#ab47bc", "Community & Giving": "#66bb6a",
  "Travel & Experiences": "#ff7043", "Family & Peace": "#4db6ac",
  "Imposter Syndrome": "#7e57c2", "Nigeria Specific": "#2e7d32",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOTS = ["9:00 AM", "1:00 PM", "7:00 PM"];

function getWeekDates() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function TweetApp() {
  const [tab, setTab] = useState("generator");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [current, setCurrent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [allGenerated, setAllGenerated] = useState([...SEED_TWEETS]);
  const [savedTweets, setSavedTweets] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [schedulingFor, setSchedulingFor] = useState(null);
  const [toast, setToast] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiCount, setAiCount] = useState(0);
  const weekDates = getWeekDates();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const callAPI = async (category, recentTweets, customPrompt) => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, recentTweets, customPrompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "API error");
    return data.tweet;
  };

  const generate = useCallback(async () => {
    const cat =
      categoryFilter === "All"
        ? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
        : categoryFilter;
    setIsGenerating(true);
    setError(null);
    try {
      const tweetText = await callAPI(cat, allGenerated, customPrompt);
      const newTweet = {
        id: Date.now(),
        category: cat,
        tweet: tweetText,
        isAI: true,
        generatedAt: new Date().toLocaleTimeString(),
      };
      setCurrent(newTweet);
      setAllGenerated((prev) => [...prev, newTweet]);
      setAiCount((n) => n + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [categoryFilter, allGenerated, customPrompt]);

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied ✓");
  };

  const saveTweet = (tweet) => {
    const exists = savedTweets.find((t) => t.id === tweet.id);
    if (exists) {
      setSavedTweets((prev) => prev.filter((t) => t.id !== tweet.id));
      showToast("Removed from saved");
    } else {
      setSavedTweets((prev) => [...prev, tweet]);
      showToast("Saved ✓");
    }
  };

  const isSaved = (id) => savedTweets.some((t) => t.id === id);

  const scheduleToSlot = (tweet, dayIdx, slot) => {
    setSchedule((prev) => ({ ...prev, [`${dayIdx}-${slot}`]: tweet }));
    setSchedulingFor(null);
    showToast(`Scheduled for ${DAYS[dayIdx]} · ${slot} ✓`);
  };

  const scheduledCount = Object.keys(schedule).length;

  const browseTweets = allGenerated
    .filter((t) => {
      const matchCat = categoryFilter === "All" || t.category === categoryFilter;
      const matchSearch =
        searchQuery === "" ||
        t.tweet.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .reverse();

  /* ─── inline styles ─── */
  const s = {
    header: {
      background: "#09090c",
      borderBottom: "1px solid #16161e",
      padding: "18px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12,
      position: "sticky",
      top: 0,
      zIndex: 50,
    },
    tabs: {
      display: "flex",
      gap: 3,
      background: "#0f0f14",
      borderRadius: 12,
      padding: 4,
      border: "1px solid #1a1a24",
    },
    tab: (a) => ({
      padding: "8px 16px",
      borderRadius: 9,
      border: "none",
      background: a ? "#00e676" : "transparent",
      color: a ? "#000" : "#555",
      fontSize: 11,
      fontWeight: a ? 800 : 400,
      cursor: "pointer",
      fontFamily: "monospace",
      letterSpacing: 0.5,
      transition: "all 0.2s",
    }),
    main: { maxWidth: 860, margin: "0 auto", padding: "32px 20px" },
    card: {
      background: "#0d0d12",
      border: "1px solid #1a1a24",
      borderRadius: 18,
      padding: "28px 24px",
      marginBottom: 16,
      position: "relative",
      overflow: "hidden",
    },
    bigCard: {
      background: "#0d0d12",
      border: "1px solid #1a1a24",
      borderRadius: 20,
      padding: "36px 32px",
      minHeight: 260,
      marginBottom: 24,
      position: "relative",
      overflow: "hidden",
    },
    chip: (a) => ({
      padding: "5px 14px",
      borderRadius: 20,
      border: `1px solid ${a ? "#00e676" : "#1e1e2a"}`,
      background: a ? "#00e67614" : "transparent",
      color: a ? "#00e676" : "#444",
      fontSize: 11,
      cursor: "pointer",
      fontFamily: "monospace",
      transition: "all 0.15s",
    }),
    badge: (cat) => {
      const c = CAT_COLORS[cat] || "#888";
      return {
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        background: c + "18",
        color: c,
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: 1,
        marginBottom: 12,
      };
    },
    btn: (v) => {
      const base = { padding: "8px 18px", borderRadius: 10, fontSize: 11, cursor: "pointer", fontFamily: "monospace", fontWeight: 600, transition: "all 0.15s" };
      if (v === "primary") return { ...base, background: "#1d9bf0", color: "#fff", border: "none" };
      if (v === "green")   return { ...base, background: "#00e67618", color: "#00e676", border: "1px solid #00e67630" };
      if (v === "danger")  return { ...base, background: "#ff6b3518", color: "#ff6b35", border: "1px solid #ff6b3530" };
      return { ...base, background: "#16161e", color: "#888", border: "1px solid #1e1e2a" };
    },
    generateBtn: {
      background: "linear-gradient(135deg, #00e676, #00b84c)",
      color: "#000",
      border: "none",
      padding: "18px 56px",
      borderRadius: 16,
      fontSize: 15,
      fontWeight: 900,
      letterSpacing: 1,
      textTransform: "uppercase",
      boxShadow: "0 6px 40px #00e67628",
      cursor: "pointer",
      fontFamily: "monospace",
      display: "block",
      margin: "0 auto 36px",
      transition: "transform 0.15s, opacity 0.15s",
    },
    input: {
      background: "#0d0d12",
      border: "1px solid #1a1a24",
      borderRadius: 10,
      padding: "10px 16px",
      color: "#ede8df",
      fontSize: 13,
      fontFamily: "monospace",
      outline: "none",
    },
    calCell: (filled) => ({
      background: filled ? "#00e67608" : "#0d0d12",
      border: `1px solid ${filled ? "#00e67630" : "#1a1a24"}`,
      borderRadius: 10,
      minHeight: 76,
      padding: 8,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }),
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060608", color: "#ede8df", fontFamily: "Georgia, serif" }}>
      {/* Toast */}
      {toast && (
        <div className="toast" style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: toast.type === "error" ? "#ff4444" : "#00e676",
          color: "#000", padding: "10px 20px", borderRadius: 10,
          fontFamily: "monospace", fontSize: 12, fontWeight: 700,
          boxShadow: "0 4px 24px #00000060",
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 18, color: "#00e676", letterSpacing: 3 }}>
            🇳🇬 FERANMITE
          </div>
          <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginTop: 3 }}>
            {aiCount} tweets generated today · powered by FeranmiteTech
          </div>
        </div>
        <div style={s.tabs}>
          {[
            { key: "generator", label: "⚡ Generate" },
            { key: "browse",    label: `📚 History (${allGenerated.length})` },
            { key: "calendar",  label: "📅 Schedule" },
            { key: "saved",     label: `🔖 Saved${savedTweets.length ? ` (${savedTweets.length})` : ""}` },
          ].map((t) => (
            <button key={t.key} style={s.tab(tab === t.key)} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={s.main}>

        {/* ── GENERATOR ── */}
        {tab === "generator" && (
          <div>
            {/* Live badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#00e67610", border: "1px solid #00e67625",
              borderRadius: 20, padding: "6px 16px", marginBottom: 24,
              fontFamily: "monospace", fontSize: 11, color: "#00e676",
            }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, background: "#00e676", borderRadius: "50%", display: "inline-block" }} />
              AI-powered · Unlimited · Never repeats · Secured by FeranmiteTech
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {["All", ...CATEGORIES].map((cat) => (
                <button key={cat} style={s.chip(categoryFilter === cat)} onClick={() => setCategoryFilter(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Custom prompt */}
            <div style={{ marginBottom: 24, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                style={{ ...s.input, flex: 1, minWidth: 220 }}
                placeholder="Optional: give a specific angle — e.g. '3AM coding session, no light'"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
              {customPrompt && (
                <button style={s.btn("ghost")} onClick={() => setCustomPrompt("")}>✕ Clear</button>
              )}
            </div>

            {/* Big tweet card */}
            <div style={s.bigCard}>
              <div style={{
                position: "absolute", top: -40, right: -40, width: 200, height: 200,
                background: "radial-gradient(circle, #00e67606 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              {isGenerating ? (
                <div style={{ textAlign: "center", padding: "50px 0" }}>
                  <div className="spin" style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
                  <p style={{ fontFamily: "monospace", fontSize: 13, color: "#444" }}>
                    FeranmiteTech AI is writing your tweet...
                  </p>
                </div>
              ) : current ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={s.badge(current.category)}>{current.category}</span>
                    {current.isAI && (
                      <span style={{ fontSize: 9, color: "#00e67660", fontFamily: "monospace" }}>
                        AI · {current.generatedAt}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 16, lineHeight: 1.85, color: "#ede8df", margin: "0 0 28px", whiteSpace: "pre-line" }}>
                    {current.tweet}
                  </p>
                  <div style={{
                    borderTop: "1px solid #1a1a24", paddingTop: 16,
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
                  }}>
                    <span style={{ fontSize: 10, color: "#333", fontFamily: "monospace" }}>
                      {current.tweet.length} chars
                    </span>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button style={s.btn(isSaved(current.id) ? "danger" : "ghost")} onClick={() => saveTweet(current)}>
                        {isSaved(current.id) ? "🔖 Saved" : "🔖 Save"}
                      </button>
                      <button style={s.btn("ghost")} onClick={() => copy(current.tweet)}>📋 Copy</button>
                      <button style={s.btn("ghost")} onClick={() => setSchedulingFor(current)}>📅 Schedule</button>
                      <button
                        style={s.btn("primary")}
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(current.tweet)}`, "_blank")}
                      >
                        Post → X
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "50px 0", color: "#252530" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>✦</div>
                  <p style={{ fontFamily: "monospace", fontSize: 14 }}>
                    AI generates a brand new tweet every single time
                  </p>
                  <p style={{ fontFamily: "monospace", fontSize: 11, marginTop: 6, color: "#1e1e26" }}>
                    Unlimited · Never repeats · Always original
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div style={{
                background: "#ff444418", border: "1px solid #ff444430",
                borderRadius: 12, padding: "12px 16px", marginBottom: 20,
                fontFamily: "monospace", fontSize: 12, color: "#ff6666",
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              style={{ ...s.generateBtn, opacity: isGenerating ? 0.6 : 1 }}
              onClick={generate}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Tweet ✦"}
            </button>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, maxWidth: 480, margin: "0 auto" }}>
              {[
                { label: "AI Generated", value: aiCount, color: "#00e676" },
                { label: "In History", value: allGenerated.length, color: "#ffd700" },
                { label: "Saved", value: savedTweets.length, color: "#ff6b35" },
                { label: "Scheduled", value: scheduledCount, color: "#00bcd4" },
              ].map((st) => (
                <div key={st.label} style={{
                  background: "#0d0d12", border: "1px solid #1a1a24",
                  borderRadius: 12, padding: "14px 8px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: st.color }}>{st.value}</div>
                  <div style={{ fontSize: 9, color: "#333", fontFamily: "monospace", marginTop: 4 }}>{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BROWSE / HISTORY ── */}
        {tab === "browse" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <input
                style={{ ...s.input, flex: 1, minWidth: 200 }}
                placeholder="Search all tweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span style={{ fontSize: 11, color: "#333", fontFamily: "monospace" }}>{browseTweets.length} tweets</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {["All", ...CATEGORIES].map((cat) => (
                <button key={cat} style={s.chip(categoryFilter === cat)} onClick={() => setCategoryFilter(cat)}>{cat}</button>
              ))}
            </div>
            {browseTweets.map((t) => (
              <div key={t.id} style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={s.badge(t.category)}>{t.category}</span>
                  {t.isAI && <span style={{ fontSize: 9, color: "#00e67660", fontFamily: "monospace" }}>AI</span>}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#c8c0b0", margin: "0 0 16px", whiteSpace: "pre-line" }}>
                  {t.tweet}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={s.btn(isSaved(t.id) ? "danger" : "ghost")} onClick={() => saveTweet(t)}>
                    {isSaved(t.id) ? "🔖 Saved" : "🔖 Save"}
                  </button>
                  <button style={s.btn("ghost")} onClick={() => copy(t.tweet)}>📋 Copy</button>
                  <button style={s.btn("ghost")} onClick={() => setSchedulingFor(t)}>📅 Schedule</button>
                  <button
                    style={s.btn("primary")}
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t.tweet)}`, "_blank")}
                  >Post → X</button>
                </div>
              </div>
            ))}
            {browseTweets.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#333", fontFamily: "monospace", fontSize: 13 }}>
                No tweets match your filter.
              </div>
            )}
          </div>
        )}

        {/* ── CALENDAR ── */}
        {tab === "calendar" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 4px" }}>Weekly Schedule</h2>
              <p style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>3 slots/day · {scheduledCount}/21 filled</p>
              <div style={{ marginTop: 10, height: 3, borderRadius: 4, background: "#1a1a24", maxWidth: 280, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  background: "linear-gradient(90deg, #00e676, #00b84c)",
                  width: `${(scheduledCount / 21) * 100}%`, transition: "width 0.4s",
                }} />
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "70px repeat(7, 1fr)", gap: 5, minWidth: 680 }}>
                <div />
                {weekDates.map((d, i) => (
                  <div key={i} style={{
                    textAlign: "center", padding: "8px 4px",
                    fontFamily: "monospace", fontSize: 11,
                    color: d.toDateString() === new Date().toDateString() ? "#00e676" : "#555",
                  }}>
                    <div style={{ fontWeight: 700 }}>{DAYS[d.getDay()]}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, marginTop: 2 }}>{d.getDate()}</div>
                  </div>
                ))}
                {SLOTS.map((slot) => (
                  <>
                    <div key={slot} style={{ display: "flex", alignItems: "center", fontSize: 9, color: "#333", fontFamily: "monospace" }}>
                      {slot}
                    </div>
                    {weekDates.map((_, dayIdx) => {
                      const key = `${dayIdx}-${slot}`;
                      const filled = schedule[key];
                      return (
                        <div
                          key={key}
                          style={s.calCell(!!filled)}
                          onClick={() => {
                            if (filled) {
                              if (window.confirm("Remove this tweet from schedule?")) {
                                setSchedule((prev) => { const n = { ...prev }; delete n[key]; return n; });
                              }
                            } else {
                              setSchedulingFor({ __pickSlot: true, dayIdx, slot });
                            }
                          }}
                        >
                          {filled ? (
                            <>
                              <div style={{ fontSize: 8, color: "#00e676", fontFamily: "monospace", lineHeight: 1.4 }}>
                                {filled.tweet.substring(0, 50)}...
                              </div>
                              <div style={{ fontSize: 8, color: "#222", fontFamily: "monospace" }}>tap to remove</div>
                            </>
                          ) : (
                            <div style={{ color: "#1e1e2a", fontSize: 20, textAlign: "center", margin: "auto" }}>+</div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>

            {scheduledCount > 0 && (
              <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", marginBottom: 16 }}>
                  SCHEDULED ({scheduledCount})
                </div>
                {Object.entries(schedule).map(([key, tweet]) => {
                  const [dayIdx, ...sp] = key.split("-");
                  const slot = sp.join("-");
                  const d = weekDates[parseInt(dayIdx)];
                  return (
                    <div key={key} style={{ ...s.card, padding: "18px 20px", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: "#00e676", fontFamily: "monospace" }}>
                          {DAYS[d?.getDay()]} {d?.getDate()} · {slot}
                        </span>
                        <span style={s.badge(tweet.category)}>{tweet.category}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#888", margin: 0, whiteSpace: "pre-line" }}>
                        {tweet.tweet.substring(0, 140)}...
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SAVED ── */}
        {tab === "saved" && (
          <div>
            {savedTweets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#252530" }}>
                <div style={{ fontSize: 52 }}>🔖</div>
                <p style={{ fontFamily: "monospace", fontSize: 13, marginTop: 16 }}>
                  No saved tweets yet. Generate and save the ones you love.
                </p>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", marginBottom: 20 }}>
                  {savedTweets.length} saved tweet{savedTweets.length !== 1 ? "s" : ""}
                </div>
                {savedTweets.map((t) => (
                  <div key={t.id} style={s.card}>
                    <span style={s.badge(t.category)}>{t.category}</span>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: "#c8c0b0", margin: "0 0 16px", whiteSpace: "pre-line" }}>
                      {t.tweet}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button style={s.btn("danger")} onClick={() => saveTweet(t)}>🗑 Remove</button>
                      <button style={s.btn("ghost")} onClick={() => copy(t.tweet)}>📋 Copy</button>
                      <button style={s.btn("ghost")} onClick={() => setSchedulingFor(t)}>📅 Schedule</button>
                      <button
                        style={s.btn("primary")}
                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t.tweet)}`, "_blank")}
                      >Post → X</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── SCHEDULE MODAL ── */}
      {schedulingFor && (
        <div
          style={{
            position: "fixed", inset: 0, background: "#000000dd",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, padding: 20,
          }}
          onClick={() => setSchedulingFor(null)}
        >
          <div
            style={{
              background: "#0d0d12", border: "1px solid #1a1a24",
              borderRadius: 20, padding: 28, maxWidth: 500, width: "100%",
              maxHeight: "82vh", overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {schedulingFor.__pickSlot ? (
              <>
                <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  {DAYS[schedulingFor.dayIdx]} · {schedulingFor.slot}
                </div>
                <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace", marginBottom: 20 }}>
                  Choose a tweet or generate a new one
                </div>
                <button
                  style={{ ...s.btn("green"), width: "100%", marginBottom: 16, padding: "12px", textAlign: "center" }}
                  onClick={async () => {
                    setIsGenerating(true);
                    try {
                      const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
                      const tweetText = await callAPI(cat, allGenerated, "");
                      const newTweet = { id: Date.now(), category: cat, tweet: tweetText, isAI: true, generatedAt: new Date().toLocaleTimeString() };
                      setAllGenerated((prev) => [...prev, newTweet]);
                      setAiCount((n) => n + 1);
                      scheduleToSlot(newTweet, schedulingFor.dayIdx, schedulingFor.slot);
                    } catch (e) {
                      showToast(e.message, "error");
                    }
                    setIsGenerating(false);
                  }}
                >
                  ⚡ Generate & Schedule AI Tweet
                </button>
                <div style={{ fontSize: 10, color: "#333", fontFamily: "monospace", marginBottom: 12 }}>OR PICK FROM HISTORY:</div>
                {[...savedTweets, ...allGenerated.filter((t) => t.isAI)].slice(0, 12).map((t) => (
                  <div
                    key={t.id}
                    style={{ ...s.card, cursor: "pointer", padding: "14px 16px", marginBottom: 8 }}
                    onClick={() => scheduleToSlot(t, schedulingFor.dayIdx, schedulingFor.slot)}
                  >
                    <span style={s.badge(t.category)}>{t.category}</span>
                    <p style={{ fontSize: 12, color: "#888", margin: 0, whiteSpace: "pre-line" }}>
                      {t.tweet.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Schedule this tweet</div>
                <div style={{ ...s.card, marginBottom: 20, padding: "16px 18px" }}>
                  <span style={s.badge(schedulingFor.category)}>{schedulingFor.category}</span>
                  <p style={{ fontSize: 13, color: "#a0988a", margin: 0, whiteSpace: "pre-line" }}>
                    {schedulingFor.tweet.substring(0, 160)}...
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {SLOTS.map((slot) => (
                    <div key={slot}>
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: "#555", marginBottom: 6 }}>{slot}</div>
                      {weekDates.map((d, i) => {
                        const key = `${i}-${slot}`;
                        const taken = !!schedule[key];
                        return (
                          <button
                            key={i}
                            disabled={taken}
                            style={{
                              display: "block", width: "100%", marginBottom: 5,
                              padding: "7px 8px", borderRadius: 8,
                              border: `1px solid ${taken ? "#1a1a24" : "#00e67630"}`,
                              background: taken ? "#0d0d12" : "#00e67610",
                              color: taken ? "#2a2a34" : "#00e676",
                              fontSize: 10, cursor: taken ? "not-allowed" : "pointer",
                              fontFamily: "monospace",
                            }}
                            onClick={() => !taken && scheduleToSlot(schedulingFor, i, slot)}
                          >
                            {DAYS[d.getDay()]} {d.getDate()} {taken ? "✗" : "→"}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </>
            )}
            <button
              style={{ ...s.btn("ghost"), marginTop: 16, width: "100%", padding: 12 }}
              onClick={() => setSchedulingFor(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
