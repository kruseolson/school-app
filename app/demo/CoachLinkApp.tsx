"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ALL_SPORTS,
  COACHES,
  COMMON_SPORTS,
  DEFAULT_SETTINGS,
  DURATIONS,
  SPORT_EMOJI,
  TIME_SLOTS,
  type Booking,
  type Coach,
  type Message,
  type Settings,
} from "./data";

// ─── Types ────────────────────────────────────────────────────────────────────

type BooleanSettingKey = {
  [K in keyof Settings]: Settings[K] extends boolean ? K : never;
}[keyof Settings];

type AppCtx = {
  tab: string;
  settings: Settings;
  selected: Coach | null;
  index: number;
  drag: number;
  isDragging: boolean;
  isSwiping: boolean;
  saved: string[];
  bookings: Booking[];
  photoIndex: Record<string, number>;
  search: string;
  showAll: boolean;
  expandedMatch: boolean;
  toast: string;
  chatId: string | null;
  draft: string;
  messages: Record<string, Message[]>;
  selectedTime: string;
  selectedDuration: string;
  filtered: Coach[];
  active: Coach | null;
  next: Coach | null;
  emoji: string;
  savedCoaches: Coach[];
  threadList: { id: string; name: string }[];
  setTab: (t: string) => void;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  toggleSetting: (key: BooleanSettingKey) => void;
  setSelected: (c: Coach | null) => void;
  setSearch: (s: string) => void;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setExpandedMatch: (v: boolean) => void;
  setChatId: (id: string | null) => void;
  setDraft: (s: string) => void;
  setShowAll: (v: boolean) => void;
  setSelectedTime: (t: string) => void;
  setSelectedDuration: (d: string) => void;
  saveCoach: (id: string) => void;
  swipe: (dir: "left" | "right") => void;
  book: () => void;
  send: () => void;
  pic: (c: Coach, dir: number) => void;
  startDrag: (e: React.PointerEvent, ghost: boolean) => void;
  moveDrag: (e: React.PointerEvent, ghost: boolean) => void;
  endDrag: (e: React.PointerEvent, ghost: boolean) => void;
  toggleSport: (sport: string) => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppCtx>(null!);
function useApp() {
  return useContext(AppContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

function AppProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState("match");
  const [selected, setSelected] = useState<Coach | null>(null);
  const [index, setIndex] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [drag, setDrag] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [photoIndex, setPhotoIndex] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState(false);
  const [toast, setToast] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    support: [{ from: "them", text: "Welcome to CoachLink. Need help with a booking?" }],
  });
  const [selectedTime, setSelectedTime] = useState("4:00 PM");
  const [selectedDuration, setSelectedDuration] = useState("1 hour");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(
    () =>
      COACHES.filter((c) => {
        const text = [c.name, c.sport, c.area, c.level].join(" ").toLowerCase();
        return (
          c.distance <= settings.radius &&
          c.price <= settings.budget &&
          (!settings.verifiedOnly || c.verified) &&
          (!settings.instantOnly || c.instant) &&
          (!settings.sports.length || settings.sports.includes(c.sport)) &&
          (!search || text.includes(search.toLowerCase()))
        );
      }).slice(0, 5),
    [settings, search]
  );

  const filteredRef = useRef(filtered);
  useEffect(() => {
    filteredRef.current = filtered;
  }, [filtered]);

  const clampedIndex = Math.min(index, Math.max(filtered.length - 1, 0));
  const active = filtered[clampedIndex] ?? null;
  const next = filtered[clampedIndex + 1] ?? null;
  const currentSport = selected?.sport ?? active?.sport ?? settings.sports[0] ?? "Basketball";
  const emoji = SPORT_EMOJI[currentSport] ?? "🏀";

  const savedCoaches = useMemo(
    () => COACHES.filter((c) => saved.includes(c.id)),
    [saved]
  );
  const threadList = useMemo(
    () => [
      ...savedCoaches.map((c) => ({ id: c.id, name: c.name })),
      { id: "support", name: "Coach Support" },
    ],
    [savedCoaches]
  );

  const update = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) =>
      setSettings((s) => ({ ...s, [key]: value })),
    []
  );

  const toggleSetting = useCallback(
    (key: BooleanSettingKey) =>
      setSettings((s) => ({ ...s, [key]: !s[key] })),
    []
  );

  const toggleSport = useCallback(
    (sport: string) => {
      setSettings((s) => ({
        ...s,
        sports: s.sports.includes(sport)
          ? s.sports.filter((x) => x !== sport)
          : [...s.sports, sport],
      }));
      setIndex(0);
    },
    []
  );

  const saveCoach = useCallback((id: string) => {
    setSaved((s) => (s.includes(id) ? s : [...s, id]));
    const c = COACHES.find((x) => x.id === id);
    if (c) {
      setMessages((m) => ({
        ...m,
        [id]:
          m[id] ??
          [{ from: "them" as const, text: `Hey, I coach ${c.sport.toLowerCase()}. What do you want to work on first?` }],
      }));
    }
  }, []);

  const swipe = useCallback(
    (dir: "left" | "right") => {
      if (!active || isSwiping) return;
      setIsSwiping(true);
      if (dir === "right") {
        saveCoach(active.id);
        setToast(`${active.name} saved.`);
      } else {
        setToast(`${active.name} skipped.`);
      }
      setTimeout(() => {
        setIndex((i) => Math.min(i + 1, Math.max(filteredRef.current.length - 1, 0)));
        setDrag(0);
        setDragStart(null);
        setIsDragging(false);
        setIsSwiping(false);
      }, 140);
    },
    [active, isSwiping, saveCoach]
  );

  const book = useCallback(() => {
    if (!selected) return;
    setBookings((b) => [
      {
        id: Date.now(),
        coach: selected.name,
        sport: selected.sport,
        time: selectedTime,
        duration: selectedDuration,
        price: selected.price,
        status: selected.instant ? "Confirmed" : "Pending approval",
      },
      ...b,
    ]);
    setToast("Booking created.");
    setTab("sessions");
  }, [selected, selectedTime, selectedDuration]);

  const send = useCallback(() => {
    if (!chatId || !draft.trim()) return;
    setMessages((m) => ({
      ...m,
      [chatId]: [...(m[chatId] ?? []), { from: "me" as const, text: draft.trim() }],
    }));
    setDraft("");
  }, [chatId, draft]);

  const pic = useCallback(
    (c: Coach, dir: number) =>
      setPhotoIndex((p) => ({
        ...p,
        [c.id]: ((p[c.id] ?? 0) + dir + c.photos.length) % c.photos.length,
      })),
    []
  );

  const startDrag = useCallback(
    (e: React.PointerEvent, ghost: boolean) => {
      if (ghost || isSwiping) return;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setDragStart({ x: e.clientX, y: e.clientY });
      setIsDragging(false);
    },
    [isSwiping]
  );

  const moveDrag = useCallback(
    (e: React.PointerEvent, ghost: boolean) => {
      if (ghost || !dragStart || isSwiping) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (Math.abs(dx) > 5) setIsDragging(true);
      if (Math.abs(dx) > Math.abs(dy)) setDrag(dx);
    },
    [dragStart, isSwiping]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent, ghost: boolean) => {
      if (ghost || !dragStart || isSwiping) return;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      if (drag > 35) swipe("right");
      else if (drag < -35) swipe("left");
      else {
        setDrag(0);
        setDragStart(null);
        setTimeout(() => setIsDragging(false), 0);
      }
    },
    [drag, dragStart, isSwiping, swipe]
  );

  const ctx: AppCtx = {
    tab, settings, selected, index, drag, isDragging, isSwiping,
    saved, bookings, photoIndex, search, showAll, expandedMatch, toast,
    chatId, draft, messages, selectedTime, selectedDuration,
    filtered, active, next, emoji, savedCoaches, threadList,
    setTab, update, toggleSetting, setSelected, setSearch, setIndex,
    setExpandedMatch, setChatId, setDraft, setShowAll,
    setSelectedTime, setSelectedDuration,
    saveCoach, swipe, book, send, pic, startDrag, moveDrag, endDrag, toggleSport,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bg(c: [string, string, string]) {
  return `linear-gradient(145deg, ${c[0]}, ${c[1]} 60%, ${c[2]})`;
}
function pct(v: number, min: number, max: number) {
  return ((v - min) / (max - min)) * 100;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Header({ title, sub }: { title: string; sub: string }) {
  const { settings, setTab, emoji } = useApp();
  return (
    <div className="top">
      <button className="profile" onClick={() => setTab("profile")}>
        {settings.name[0]}
      </button>
      <div>
        <b className="micro">LOCAL SPORTS MATCHES</b>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      <div className="emoji">{emoji}</div>
    </div>
  );
}

function Nav() {
  const { tab, setTab } = useApp();
  return (
    <nav>
      <button className={tab === "settings" ? "on" : ""} onClick={() => setTab("settings")}>
        ⚙<small>Settings</small>
      </button>
      <button className={tab === "sessions" ? "on" : ""} onClick={() => setTab("sessions")}>
        ◷<small>Sessions</small>
      </button>
      <button className={tab === "match" ? "on mid" : "mid"} onClick={() => setTab("match")}>
        ◎<small>Match</small>
      </button>
      <button className={tab === "messages" ? "on" : ""} onClick={() => setTab("messages")}>
        ✉<small>Messages</small>
      </button>
      <button className={tab === "saved" ? "on" : ""} onClick={() => setTab("saved")}>
        ♥<small>Saved</small>
      </button>
    </nav>
  );
}

function CoachCard({ c, ghost = false }: { c: Coach; ghost?: boolean }) {
  const {
    drag, isDragging, isSwiping,
    saved, photoIndex,
    swipe, saveCoach, setSelected, setTab, pic,
    startDrag, moveDrag, endDrag,
  } = useApp();
  const pi = photoIndex[c.id] ?? 0;
  const savedNow = saved.includes(c.id);
  const dp = Math.min(Math.abs(drag) / 140, 1);

  return (
    <div
      className={ghost ? "card ghost" : "card"}
      style={ghost ? {} : { transform: drag ? `translateX(${drag}px) rotate(${drag / 22}deg)` : undefined }}
      onPointerDown={(e) => startDrag(e, ghost)}
      onPointerMove={(e) => moveDrag(e, ghost)}
      onPointerUp={(e) => endDrag(e, ghost)}
      onPointerCancel={(e) => endDrag(e, ghost)}
      onClick={() => {
        if (!ghost && !isDragging && !isSwiping && Math.abs(drag) < 8) {
          setSelected(c);
          setTab("coach");
        }
      }}
    >
      <div className="photo" style={{ background: bg(c.colors) }}>
        <div className="fade" />
        <button
          className="arrow l"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); pic(c, -1); }}
        >‹</button>
        <button
          className="arrow r"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); pic(c, 1); }}
        >›</button>
        <div className="dots">
          {c.photos.map((_, i) => <i key={i} className={i === pi ? "dot active" : "dot"} />)}
        </div>
        <div className="sw save" style={{ opacity: drag > 0 ? dp : 0 }}>SAVE</div>
        <div className="sw skip" style={{ opacity: drag < 0 ? dp : 0 }}>SKIP</div>
        <span className="badge">{c.verified ? "VERIFIED" : "LOCAL"}</span>
        <span className="price">${c.price}/hr</span>
        <div className="avatar">{c.initials}</div>
        <div className="caption">
          <h2>{c.name}</h2>
          <p>{c.sport} Coach · {c.area}</p>
          <p>⭐ {c.rating} ({c.reviews})</p>
        </div>
      </div>
      <div className="body">
        <p className="tag">{c.headline}</p>
        <div className="stats">
          <b>{c.sessions}+<small> sessions</small></b>
          <b>{c.response}<small> response</small></b>
          <b>{c.retention}<small> return</small></b>
        </div>
        <div className="prompts">
          <div><small>Best for</small><b>{c.bestFor}</b></div>
          <div><small>First session</small><b>{c.firstSession}</b></div>
        </div>
        <div className="actions">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); swipe("left"); }}
          >Skip</button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); saveCoach(c.id); }}
          >{savedNow ? "Saved" : "Save"}</button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setSelected(c); setTab("coach"); }}
          >Profile</button>
        </div>
      </div>
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function Match() {
  const {
    expandedMatch, setExpandedMatch, toast, search, setSearch,
    setIndex, active, next, settings, setSelected, setTab,
  } = useApp();
  return (
    <main className={expandedMatch ? "phone match matchExpanded" : "phone match"}>
      <Header title="Discover" sub="Find trusted local coaches" />
      {toast && <div className="toast">{toast}</div>}
      <div className="matchTools">
        <input
          className="input"
          placeholder="Search coach or sport"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIndex(0); }}
        />
        <button className="expandBtn" onClick={() => setExpandedMatch(!expandedMatch)}>
          {expandedMatch ? "Less" : "More"}
        </button>
      </div>
      <section className="deck">
        {next && settings.discoverable && <CoachCard c={next} ghost />}
        {settings.discoverable && active
          ? <CoachCard c={active} />
          : <div className="empty"><h3>No coaches</h3><p>Try changing Settings.</p></div>}
      </section>
      {expandedMatch && active && (
        <section className="coachPreview" onClick={() => { setSelected(active); setTab("coach"); }}>
          <div>
            <b>{active.sport} coaching with {active.name}</b>
            <p>{active.headline}</p>
          </div>
          <div className="previewGrid">
            <span>{active.sessions}+ sessions</span>
            <span>{active.retention} return</span>
            <span>{active.response} response</span>
          </div>
          <p className="previewText">
            Best for: {active.bestFor}. First session: {active.firstSession}.
          </p>
          <button className="primary miniPrimary">Open full coach profile</button>
        </section>
      )}
      <Nav />
    </main>
  );
}

function CoachProfile() {
  const {
    selected, setTab,
    selectedTime, setSelectedTime,
    selectedDuration, setSelectedDuration,
    book,
  } = useApp();
  if (!selected) return null;
  return (
    <main className="phone">
      <button className="back" onClick={() => setTab("match")}>Back</button>
      <section className="panel hero">
        <div className="big" style={{ background: bg(selected.colors) }}>{selected.initials}</div>
        <div>
          <h2>{selected.name}</h2>
          <p>{selected.sport} Coach · {selected.area}</p>
          <p>⭐ {selected.rating} ({selected.reviews}) · {selected.sessions}+ sessions</p>
        </div>
      </section>
      <section className="panel">
        <h3>About</h3>
        <p>{selected.bio}</p>
        <h3>Coaching style</h3>
        <p>{selected.philosophy}</p>
      </section>
      <section className="grid">
        <div className="panel mini"><small>Best for</small><b>{selected.bestFor}</b></div>
        <div className="panel mini"><small>First session</small><b>{selected.firstSession}</b></div>
      </section>
      <section className="panel">
        <h3>Choose a time slot</h3>
        <div className="timeSlots">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              className={selectedTime === t ? "slot activeSlot" : "slot"}
              onClick={() => setSelectedTime(t)}
            >{t}</button>
          ))}
        </div>
        <h3 style={{ marginTop: 16 }}>Session length</h3>
        <div className="timeSlots">
          {DURATIONS.map((d) => (
            <button
              key={d}
              className={selectedDuration === d ? "slot activeSlot" : "slot"}
              onClick={() => setSelectedDuration(d)}
            >{d}</button>
          ))}
        </div>
      </section>
      <section className="panel">
        <h3>Parent feedback</h3>
        {selected.reviewList.map((r) => (
          <p className="quote" key={r}>"{r}"</p>
        ))}
      </section>
      <button className="primary" onClick={book}>
        Confirm {selectedDuration} · {selectedTime} · ${selected.price}/hr
      </button>
      <Nav />
    </main>
  );
}

function Saved() {
  const { savedCoaches, setSelected, setTab } = useApp();
  return (
    <main className="phone">
      <Header title="Saved" sub="Coaches you liked" />
      {!savedCoaches.length
        ? <p className="emptyText">No saved coaches yet.</p>
        : savedCoaches.map((c) => (
          <section
            className="panel rowCard"
            key={c.id}
            onClick={() => { setSelected(c); setTab("coach"); }}
          >
            <div className="thumb" style={{ background: bg(c.colors) }}>{c.initials}</div>
            <div>
              <h3>{c.name}</h3>
              <p>{c.sport} · ⭐ {c.rating}</p>
              <small>{c.verified ? "Verified coach" : "Local coach"}</small>
            </div>
            <b>›</b>
          </section>
        ))}
      <Nav />
    </main>
  );
}

function Sessions() {
  const { bookings } = useApp();
  return (
    <main className="phone">
      <Header title="Bookings" sub="Upcoming coaching sessions" />
      {!bookings.length
        ? <p className="emptyText">No bookings yet.</p>
        : bookings.map((b) => (
          <section className="panel" key={b.id}>
            <h3>{b.coach}</h3>
            <p>{b.sport} · {b.duration} · {b.time}</p>
            <small>${b.price}/hr</small>
            <b>{b.status}</b>
          </section>
        ))}
      <Nav />
    </main>
  );
}

function ChatThread() {
  const { chatId, setChatId, messages, draft, setDraft, send, threadList } = useApp();
  const name = threadList.find((t) => t.id === chatId)?.name ?? "Chat";
  return (
    <main className="phone chat">
      <button className="back" onClick={() => setChatId(null)}>Back</button>
      <h2>{name}</h2>
      <div className="msgs">
        {(messages[chatId!] ?? []).map((m, i) => (
          <p key={i} className={m.from === "me" ? "me" : "them"}>{m.text}</p>
        ))}
      </div>
      <div className="compose">
        <input
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message"
        />
        <button onClick={send}>Send</button>
      </div>
    </main>
  );
}

function Messages() {
  const { chatId, threadList, messages, setChatId } = useApp();
  if (chatId) return <ChatThread />;
  return (
    <main className="phone">
      <Header title="Messages" sub="Chat with coaches" />
      {threadList.map((t) => (
        <button className="panel msg" key={t.id} onClick={() => setChatId(t.id)}>
          <div className="thumb">{t.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <h3>{t.name}</h3>
            <p>{(messages[t.id] ?? []).slice(-1)[0]?.text ?? "Start chatting"}</p>
          </div>
        </button>
      ))}
      <Nav />
    </main>
  );
}

function Profile() {
  const { settings, update } = useApp();
  return (
    <main className="phone">
      <Header title="Profile" sub="Your athlete profile" />
      <section className="panel">
        <label>Name</label>
        <input className="input" value={settings.name} onChange={(e) => update("name", e.target.value)} />
        <label>Age</label>
        <input className="input" value={settings.age} onChange={(e) => update("age", e.target.value)} />
        <label>City</label>
        <input className="input" value={settings.city} onChange={(e) => update("city", e.target.value)} />
        <label>Bio</label>
        <textarea className="input" value={settings.bio} onChange={(e) => update("bio", e.target.value)} />
      </section>
      <Nav />
    </main>
  );
}

const TOGGLES: [BooleanSettingKey, string][] = [
  ["verifiedOnly", "Verified coaches only"],
  ["instantOnly", "Instant book only"],
  ["discoverable", "Show coaches in Match"],
  ["parentMode", "Parent mode"],
  ["notifications", "Notifications"],
  ["dark", "Dark mode"],
  ["haptics", "Haptics"],
];

function SettingsScreen() {
  const { settings, update, toggleSetting, showAll, setShowAll, toggleSport } = useApp();
  const visibleSports = showAll ? ALL_SPORTS : COMMON_SPORTS;
  return (
    <main className="phone fixedPhone">
      <Header title="Settings" sub="Discovery, privacy, and app controls" />
      <div className="settingsScroll">
        <section className="panel">
          <h3>Discovery</h3>
          <label>Search radius</label>
          <div className="slider">
            <span style={{ left: `${pct(settings.radius, 1, 50)}%` }}>{settings.radius} mi</span>
            <input
              type="range" min="1" max="50" value={settings.radius}
              onChange={(e) => update("radius", Number(e.target.value))}
            />
          </div>
          <div className="rangeText"><b>1 mi</b><b>50 mi</b></div>
          <label>Budget max</label>
          <div className="slider">
            <span style={{ left: `${pct(settings.budget, 20, 100)}%` }}>${settings.budget}/hr</span>
            <input
              type="range" min="20" max="100" value={settings.budget}
              onChange={(e) => update("budget", Number(e.target.value))}
            />
          </div>
          <div className="rangeText"><b>$20</b><b>$100</b></div>
          <h3>Sports</h3>
          <div className="chips">
            {visibleSports.map((s) => (
              <button
                key={s}
                className={settings.sports.includes(s) ? "chip onChip" : "chip"}
                onClick={() => toggleSport(s)}
              >
                {SPORT_EMOJI[s]} {s}
              </button>
            ))}
          </div>
          <button className="secondary" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show fewer sports" : "Show more sports"}
          </button>
        </section>
        <section className="panel">
          <h3>Trust filters</h3>
          {TOGGLES.map(([k, label]) => (
            <button key={k} className="toggle" onClick={() => toggleSetting(k)}>
              <span>{label}</span>
              <b>{settings[k] ? "On" : "Off"}</b>
            </button>
          ))}
        </section>
      </div>
      <Nav />
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function Inner() {
  const { tab, settings } = useApp();
  return (
    <div className={settings.dark ? "page dark" : "page"}>
      <style>{css}</style>
      <div className="app">
        {tab === "match" && <Match />}
        {tab === "coach" && <CoachProfile />}
        {tab === "saved" && <Saved />}
        {tab === "sessions" && <Sessions />}
        {tab === "messages" && <Messages />}
        {tab === "profile" && <Profile />}
        {tab === "settings" && <SettingsScreen />}
      </div>
    </div>
  );
}

export default function CoachLinkApp() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const css = `
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#0b1220}button,input,textarea{font:inherit}button{border:0;cursor:pointer}h1,h2,h3,p{margin:0}.page{min-height:100vh;display:grid;place-items:center;padding:16px;background:linear-gradient(#f8fafc,#e2e8f0)}.page.dark{background:#07111f}.app{width:min(420px,100%)}.phone{height:min(880px,calc(100vh - 32px));min-height:760px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;position:relative;background:#fff;color:#0f172a;border:10px solid #0f172a;border-radius:44px;padding:18px 16px 12px;box-shadow:0 30px 90px #0004;scrollbar-width:none}.dark .phone{background:#0f172a;color:#f8fafc;border-color:#020617}.phone::-webkit-scrollbar{display:none}.match{overflow:hidden}.fixedPhone{overflow:hidden}.settingsScroll{overflow-y:auto;min-height:0;flex:1;padding-bottom:12px;scrollbar-width:none}.settingsScroll::-webkit-scrollbar{display:none}.matchExpanded .top,.matchExpanded .toast{display:none}.matchExpanded .photo{height:48%;min-height:255px}.matchExpanded .deck{margin-top:4px;flex:.9}.coachPreview{background:#fff;border:1px solid #e2e8f0;border-radius:24px;padding:14px;display:grid;gap:10px;cursor:pointer}.dark .coachPreview{background:#1f2937;border-color:#334155}.coachPreview b{font-size:17px}.coachPreview p{color:#64748b;line-height:1.35}.dark .coachPreview p{color:#94a3b8}.previewGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.previewGrid span{background:#f1f5f9;border-radius:14px;padding:10px;text-align:center;font-size:12px;font-weight:900;color:#334155}.dark .previewGrid span{background:#111827;color:#e2e8f0}.previewText{font-size:13px}.miniPrimary{padding:12px;margin:0}.matchTools{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.expandBtn{border-radius:18px;padding:12px 14px;background:#2563eb;color:#fff;font-weight:900;align-self:end}.top{display:flex;align-items:center;justify-content:space-between;gap:12px}.top h1{font-size:24px;letter-spacing:-.05em}.top p,.panel p,.emptyText,label{color:#64748b}.dark .top p,.dark .panel p,.dark .emptyText,.dark label{color:#94a3b8}.micro{display:block;color:#2563eb;font-size:10px;letter-spacing:.14em}.profile,.emoji{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#fff;border:1px solid #e2e8f0;font-weight:900}.profile{background:linear-gradient(145deg,#0f172a,#2563eb);color:#fff}.dark .emoji{background:#1f2937;border-color:#334155}.input{width:100%;padding:14px 16px;border-radius:18px;border:1px solid #e2e8f0;background:#fff;color:#0f172a;margin-top:8px}.dark .input{background:#111827;border-color:#334155;color:#fff}.panel{background:#fff;border:1px solid #e2e8f0;border-radius:24px;padding:16px}.dark .panel{background:#1f2937;border-color:#334155}.deck{position:relative;flex:1;min-height:0}.card{position:absolute;inset:0;background:#fff;border:1px solid #e2e8f0;border-radius:32px;overflow:hidden;box-shadow:0 24px 65px #0003;touch-action:pan-y;user-select:none;transition:transform .14s ease,opacity .14s ease}.dark .card{background:#1f2937;border-color:#334155}.ghost{transform:scale(.96) translateY(18px);opacity:.55}.photo{position:relative;height:56%;min-height:310px;overflow:hidden}.fade{position:absolute;inset:0;background:linear-gradient(transparent 25%,#000c)}.avatar{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);width:120px;height:120px;border-radius:38px;border:2px solid #ffffff88;background:#ffffff22;color:#fff;display:grid;place-items:center;font-size:40px;font-weight:950}.caption{position:absolute;left:18px;right:18px;bottom:18px;color:#fff}.caption h2{font-size:30px}.pill,.badge,.price{position:absolute;z-index:3;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900}.badge{top:16px;left:16px;background:#dbeafe;color:#1d4ed8}.price{top:16px;right:16px;background:#020617cc;color:#fff}.arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:42px;height:42px;border-radius:50%;background:#ffffffe8;font-size:26px}.l{left:12px}.r{right:12px}.dots{position:absolute;top:16px;left:50%;transform:translateX(-50%);display:flex;gap:5px}.dot{width:24px;height:4px;border-radius:999px;background:#ffffff44}.active{background:#fff}.sw{position:absolute;top:86px;z-index:5;font-size:32px;font-weight:1000;padding:8px 14px;border:3px solid currentColor;border-radius:16px}.save{left:18px;color:#22c55e;transform:rotate(-12deg)}.skip{right:18px;color:#ef4444;transform:rotate(12deg)}.body{padding:16px}.tag{font-size:17px;font-weight:850}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips span,.chip{padding:8px 10px;border-radius:999px;background:#f1f5f9;color:#334155;font-size:12px;font-weight:850}.dark .chips span,.dark .chip{background:#111827;color:#e2e8f0;border:1px solid #334155}.onChip{background:#2563eb!important;color:#fff!important}.stats{display:flex;justify-content:space-between;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:12px;margin:12px 0}.dark .stats{background:#111827;border-color:#334155}.stats small{display:block;color:#64748b}.prompts,.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.prompts div,.mini{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:12px}.dark .prompts div,.dark .mini{background:#111827;border-color:#334155}.prompts small,.mini small{display:block;color:#64748b;margin-bottom:5px}.actions{display:flex;gap:8px;margin-top:12px}.actions button,.secondary,.toggle,.primary,.back,.compose button{border-radius:16px;padding:12px 14px;font-weight:900}.actions button{flex:1;background:#f1f5f9}.primary{width:100%;background:#2563eb;color:#fff}.secondary{width:100%;background:#f1f5f9}.dark .secondary,.dark .actions button{background:#111827;color:#fff}.toast{background:#020617;color:#fff;border-radius:16px;padding:10px 12px;font-size:13px}.big,.thumb{display:grid;place-items:center;color:#fff;font-weight:950}.big{width:86px;height:86px;border-radius:28px;font-size:30px}.thumb{width:54px;height:54px;border-radius:16px;background:linear-gradient(145deg,#0f172a,#2563eb);flex-shrink:0}.hero,.rowCard,.msg{display:flex;align-items:center;gap:14px}.rowCard{cursor:pointer}.quote{background:#f8fafc;border-radius:16px;padding:12px;margin-top:10px}.dark .quote{background:#111827}.slider{position:relative;padding-top:34px}.slider span{position:absolute;top:0;transform:translateX(-50%);background:#0f172a;color:#fff;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:900}.slider input{width:100%;accent-color:#2563eb}.rangeText{display:flex;justify-content:space-between;color:#64748b;font-size:13px;margin:8px 0 16px}.toggle{width:100%;display:flex;justify-content:space-between;background:#f8fafc;margin-top:8px}.dark .toggle{background:#111827;color:#fff}.msgs{display:grid;gap:10px}.me,.them{max-width:80%;padding:12px 14px;border-radius:18px}.me{justify-self:end;background:#2563eb;color:#fff}.them{justify-self:start;background:#f1f5f9}.dark .them{background:#1f2937}.compose{display:flex;gap:8px;margin-top:auto}.compose button{background:#2563eb;color:#fff}.timeSlots{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.slot{padding:12px 14px;border-radius:14px;background:#f1f5f9;color:#334155;font-weight:800}.dark .slot{background:#111827;color:#fff;border:1px solid #334155}.activeSlot{background:#2563eb!important;color:#fff!important}nav{position:sticky;bottom:0;margin-top:auto;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;background:#fffffff2;border:1px solid #e2e8f0;border-radius:30px;padding:8px;box-shadow:0 18px 50px #0002;z-index:20}.dark nav{background:#020617;border-color:#1f2937}nav button{border-radius:22px;background:transparent;color:#64748b;padding:8px 4px;display:grid;gap:3px;justify-items:center;font-weight:900}nav .on{background:#0f172a;color:#fff}.dark nav .on{background:#2563eb}.mid{transform:translateY(-10px)}nav small{font-size:10px}@media(max-width:430px){.page{padding:0}.app{width:100%}.phone{height:100vh;min-height:100vh;border:0;border-radius:0}.prompts,.grid{grid-template-columns:1fr}}
`;
