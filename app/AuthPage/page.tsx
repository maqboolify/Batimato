"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ─── Tokens (identical to homepage) ───────────────────────────────────────────
const INK = "#0B1C32";
const BLUE = "#2A6DD9";
const BLUE_DEEP = "#1656C9";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

// Signature element data: real palette from the product world, doubling as
// the right-panel's living backdrop. Selecting a swatch tints the whole panel.
const PALETTE = [
  { name: "Nuit Parisienne", hex: "#1a2744" },
  { name: "Calcaire Haussmann", hex: "#e8dcc8" },
  { name: "Vert Belvédère", hex: "#2d5a3d" },
  { name: "Ardoise Fine", hex: "#6b7280" },
  { name: "Terre de Sienne", hex: "#c2713a" },
  { name: "Blanc Architectural", hex: "#f5f2ed" },
];

// ─── Magnetic Button (reused pattern from homepage) ───────────────────────────

function MagneticBtn({ children, className, style, type = "button", onClick, disabled }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    if (disabled) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={handleLeave} className="inline-block w-full">
      <button type={type} onClick={onClick} disabled={disabled} className={className} style={style}>
        {children}
      </button>
    </motion.div>
  );
}

// ─── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, type = "text", placeholder, value, onChange, name, showToggle, autoComplete }) {
  const [reveal, setReveal] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputType = showToggle ? (reveal ? "text" : "password") : type;

  return (
    <div>
      <label
        className="block text-[11px] font-bold uppercase tracking-[0.16em] mb-2 transition-colors duration-200"
        style={{ color: focused ? BLUE_DEEP : "#46556B" }}
      >
        {label}
      </label>
      <div
        className="relative rounded-xl border transition-all duration-200"
        style={{
          borderColor: focused ? BLUE : "#E1E8F1",
          boxShadow: focused ? `0 0 0 4px ${BLUE}14` : "none",
          background: "#fff",
        }}
      >
        <input
          name={name}
          type={inputType}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none px-4 py-3.5 text-sm rounded-xl"
          style={{ color: INK }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1"
            style={{ color: "#8694A8" }}
            aria-label={reveal ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {reveal ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9.27-3.11-11-7.5a11.6 11.6 0 012.94-4.36M9.9 4.24A10.94 10.94 0 0112 4c5 0 9.27 3.11 11 7.5a11.62 11.62 0 01-1.67 2.68M14.12 14.12a3 3 0 11-4.24-4.24" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Segmented Toggle (Login / Signup) ────────────────────────────────────────

function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="relative grid grid-cols-2 p-1 rounded-2xl"
      style={{ background: "#F3F7FC", border: "1px solid #E1E8F1" }}
    >
      <motion.div
        className="absolute top-1 bottom-1 rounded-xl bg-white shadow-sm"
        style={{ width: "calc(50% - 4px)" }}
        animate={{ x: mode === "login" ? 4 : "calc(100% + 4px)" }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      />
      {["login", "signup"].map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className="relative z-10 py-3 text-sm font-bold transition-colors duration-200"
          style={{ color: mode === m ? INK : "#8694A8" }}
        >
          {m === "login" ? "Connexion" : "Inscription"}
        </button>
      ))}
    </div>
  );
}

// ─── Password strength (lightweight, signup only) ─────────────────────────────

function StrengthBar({ value }) {
  const score = [
    value.length >= 8,
    /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;

  const labels = ["Faible", "Moyen", "Bon", "Excellent"];
  const colors = ["#E11D48", "#D97706", "#2A6DD9", "#059669"];
  const idx = Math.max(score - 1, 0);

  if (!value) return null;

  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "#E6ECF4" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: colors[idx] }}
              initial={{ width: 0 }}
              animate={{ width: i <= idx ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-wider mt-1.5" style={{ color: colors[idx] }}>
        {labels[idx]}
      </div>
    </div>
  );
}

// ─── Right Panel: brand / signature swatch interaction ────────────────────────

function BrandPanel({ mode }) {
  const [selected, setSelected] = useState(0);
  const active = PALETTE[selected];

  const copy = {
    login: {
      eyebrow: "Espace professionnel",
      title: "Déjà\nclient ?",
      sub: "Connectez-vous pour retrouver vos devis, vos tarifs négociés et l'historique de vos commandes.",
    },
    signup: {
      eyebrow: "Nouveau compte",
      title: "Nouveau\nclient ?",
      sub: "Créez votre compte afin de pouvoir accéder à l'ensemble des services disponibles !",
    },
  };
  const c = copy[mode];

  const benefits = [
    { icon: "lock", text: "Paiement en ligne 100% sécurisé" },
    { icon: "box", text: "Commande en ligne 24h/24, 7j/7" },
    { icon: "home", text: "Livraison gratuite en comptoir" },
  ];

  return (
    <div className="relative h-full overflow-hidden" style={{ background: INK }}>
      {/* Ambient tinted glow — crossfades between solid gradient layers per swatch.
          (Animating the `background` string directly causes Motion to try to
          interpolate between two gradient strings, which produces muddy
          in-between colors. Stacking one absolutely-positioned layer per
          swatch and crossfading opacity keeps each color pure.) */}
      <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full pointer-events-none">
        {PALETTE.map((c2, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${c2.hex}33 0%, transparent 70%)` }}
            animate={{ opacity: selected === i ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </div>
      <div className="absolute -bottom-40 -left-20 w-[480px] h-[480px] rounded-full pointer-events-none">
        {PALETTE.map((c2, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${c2.hex}22 0%, transparent 70%)` }}
            animate={{ opacity: selected === i ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </div>

      {/* Grid texture, identical motif to Hero */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between p-10 lg:p-14">
        {/* Logo mark */}
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 text-white"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: BLUE }}>
            PP
          </div>
          <span className="font-bold text-sm tracking-tight">Peintures de Paris</span>
        </motion.a>

        {/* Copy block */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.14)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: active.hex }} />
                {c.eyebrow}
              </span>
              <h1
                className="font-black leading-[0.95] tracking-[-0.02em] text-white whitespace-pre-line"
                style={{ fontSize: "clamp(2.25rem, 4vw, 3.25rem)" }}
              >
                {c.title}
              </h1>
              <p className="mt-5 text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.62)" }}>
                {c.sub}
              </p>

              {mode === "signup" && (
                <div className="mt-7 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>Compte professionnel en</span>
                  <span style={{ color: "#FB7185" }}>2 minutes !</span>
                </div>
              )}

              <div className="mt-7 space-y-3.5">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.78)" }}>
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.08)" }}
                    >
                      {b.icon === "lock" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                          <rect x="5" y="11" width="14" height="9" rx="2" />
                          <path d="M8 11V7a4 4 0 018 0v4" />
                        </svg>
                      )}
                      {b.icon === "box" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                          <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                          <path d="M3 8v8l9 5 9-5V8" />
                          <path d="M12 13v8" />
                        </svg>
                      )}
                      {b.icon === "home" && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                          <path d="M3 11l9-7 9 7" />
                          <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" />
                        </svg>
                      )}
                    </span>
                    {b.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Signature interaction: live Chromatic swatch picker */}
          <div className="mt-10">
            <div className="text-[10px] uppercase tracking-[0.2em] mb-3.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Chromatic® System — testez une teinte
            </div>
            <div className="flex gap-2.5">
              {PALETTE.map((c2, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="relative w-10 h-10 rounded-full"
                  style={{ background: c2.hex }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label={c2.name}
                >
                  {selected === i && (
                    <motion.div
                      layoutId="swatch-ring"
                      className="absolute -inset-1.5 rounded-full border-2"
                      style={{ borderColor: "#fff" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold mt-3.5"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              {active.name} <span style={{ color: "rgba(255,255,255,0.4)" }}>· {active.hex.toUpperCase()}</span>
            </motion.div>
          </div>
        </div>

        {/* Footer trust strip */}
        <div className="flex items-center gap-7 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {[["32", "magasins"], ["180+", "experts"], ["50+", "ans"]].map(([v, l], i) => (
            <div key={i}>
              <div className="text-xl font-black text-white">{v}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Wire to real auth here.
    setTimeout(() => setSubmitting(false), 1200);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left: form */}
        <div className="relative flex items-center justify-center px-6 sm:px-10 lg:px-20 py-16">
          {/* faint ambient glow consistent with homepage's soft sections */}
          <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full opacity-60 pointer-events-none"
            style={{ background: "radial-gradient(circle, #EAF1FB 0%, transparent 70%)" }} />

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative z-10 w-full max-w-[420px]"
          >
            {/* Mobile logo (panel hidden below lg) */}
            <motion.a href="/" variants={fadeUp} className="lg:hidden inline-flex items-center gap-2.5 mb-10">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: BLUE }}>
                PP
              </div>
              <span className="font-bold text-sm tracking-tight" style={{ color: INK }}>Peintures de Paris</span>
            </motion.a>

            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px" style={{ background: BLUE_DEEP }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: BLUE_DEEP }}>
                  {mode === "login" ? "Bon retour" : "Bienvenue"}
                </span>
              </div>
              <h1 className="font-black tracking-tight leading-[0.95] whitespace-pre-line" style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.5rem)", color: INK }}>
                {mode === "login" ? "Connexion à\nvotre compte" : "Créer votre\ncompte pro"}
              </h1>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8">
              <ModeToggle mode={mode} setMode={setMode} />
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                  className="space-y-5"
                >
                  {mode === "signup" && (
                    <Field
                      label="Nom complet"
                      name="name"
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  )}

                  <Field
                    label="Adresse e-mail"
                    name="email"
                    type="email"
                    placeholder="jean@entreprise.fr"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />

                  <div>
                    <Field
                      label="Mot de passe"
                      name="password"
                      showToggle
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                    {mode === "signup" && <StrengthBar value={form.password} />}
                  </div>

                  {mode === "signup" && (
                    <Field
                      label="Confirmer le mot de passe"
                      name="confirm"
                      showToggle
                      placeholder="••••••••"
                      value={form.confirm}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  )}

                  {mode === "login" ? (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none" style={{ color: "#46556B" }}>
                        <span
                          onClick={() => setRemember((r) => !r)}
                          className="w-[18px] h-[18px] rounded-md flex items-center justify-center border transition-colors duration-150"
                          style={{ background: remember ? BLUE : "#fff", borderColor: remember ? BLUE : "#D7E1EE" }}
                        >
                          {remember && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </span>
                        Se souvenir de moi
                      </label>
                      <a href="/mot-de-passe-oublie" className="font-semibold hover:underline" style={{ color: BLUE_DEEP }}>
                        Mot de passe oublié ?
                      </a>
                    </div>
                  ) : (
                    <label className="flex items-start gap-2.5 text-xs cursor-pointer select-none" style={{ color: "#46556B" }}>
                      <span
                        className="mt-0.5 w-[18px] h-[18px] rounded-md flex-shrink-0 flex items-center justify-center border"
                        style={{ borderColor: "#D7E1EE" }}
                      />
                      J'accepte les{" "}
                      <a href="/cgv" className="font-semibold hover:underline" style={{ color: BLUE_DEEP }}>
                        conditions générales
                      </a>{" "}
                      et la{" "}
                      <a href="/confidentialite" className="font-semibold hover:underline" style={{ color: BLUE_DEEP }}>
                        politique de confidentialité
                      </a>
                      .
                    </label>
                  )}
                </motion.div>
              </AnimatePresence>

              <MagneticBtn
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-sm shadow-lg w-full"
                style={{ background: BLUE, boxShadow: `0 12px 30px -8px ${BLUE}66`, opacity: submitting ? 0.75 : 1 }}
              >
                {submitting ? (
                  <motion.span
                    className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    {mode === "login" ? "Se connecter" : "Créer mon compte"}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </MagneticBtn>
            </form>

            <motion.p variants={fadeUp} className="mt-9 text-center text-sm" style={{ color: "#46556B" }}>
              {mode === "login" ? (
                <>
                  Pas encore de compte ?{" "}
                  <button onClick={() => setMode("signup")} className="font-bold hover:underline" style={{ color: BLUE_DEEP }}>
                    Inscrivez-vous
                  </button>
                </>
              ) : (
                <>
                  Déjà client ?{" "}
                  <button onClick={() => setMode("login")} className="font-bold hover:underline" style={{ color: BLUE_DEEP }}>
                    Connectez-vous
                  </button>
                </>
              )}
            </motion.p>
          </motion.div>
        </div>

        {/* Right: brand panel (hidden on mobile, signature element lives here) */}
        <div className="hidden lg:block">
          <BrandPanel mode={mode} />
        </div>
      </div>
    </main>
  );
}