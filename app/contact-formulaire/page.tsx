"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ─── Tokens (mirrored from HomePage / ContactPage) ───────────────────────────
const INK = "#0B1C32";
const BLUE = "#2A6DD9";
const BLUE_DEEP = "#1656C9";

// ─── Utilities ────────────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease },
  }),
};

function useInViewAnim(threshold = "-80px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: threshold });
  return [ref, inView];
}

// ─── Reusable bits (copied from ContactPage so this page is self-contained) ──

function SectionLabel({ children, color = BLUE_DEEP }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px" style={{ background: color }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color }}>{children}</span>
    </div>
  );
}

function MagneticBtn({ children, className, style, href, onClick, type }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  const Tag = href ? "a" : "button";

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={handleLeave} className="inline-block">
      <Tag href={href} onClick={onClick} type={type} className={className} style={style}>
        {children}
      </Tag>
    </motion.div>
  );
}

// ─── Back button ──────────────────────────────────────────────────────────────
// Uses router.back() — this walks the browser history the same way clicking
// the browser's own back button would, so it lands the user back on the
// technical-assistance page they came from.

function BackButton() {
  const router = useRouter();
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-20 pt-10">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-65"
        style={{ color: BLUE_DEEP }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Retour
      </button>
    </div>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [ref, inView] = useInViewAnim();
  const [requestType, setRequestType] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fields, setFields] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    address: "", postal: "", city: "", company: "", message: "",
  });

  const REQUEST_TYPES = [
    "Demande d'assistance technique",
    "Demande de devis",
    "Information produit",
    "Service après-vente",
    "Partenariat professionnel",
    "Autre demande",
  ];

  const handleChange = (e) => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!requestType || !fields.firstName || !fields.email || !agreed) return;
    setSubmitted(true);
  };

  const inputCls = "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 bg-white";
  const inputStyle = { borderColor: "#E1E8F1", color: INK };
  const inputFocus = { "--tw-ring-color": BLUE + "40" };
  const labelCls = "text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5 flex items-center gap-1";

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-[#F6F9FD] relative overflow-hidden" id="contact-form">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #0B1C32 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-20">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} className="mb-12">
          <SectionLabel>Formulaire de contact</SectionLabel>
          <h2 className="font-black tracking-tight leading-[0.9]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: INK }}>
            Soumettez votre<br />
            <span style={{ color: BLUE }}>demande</span>
          </h2>
          <p className="mt-4 text-sm" style={{ color: "#8694A8" }}>
            Champs obligatoires <span style={{ color: "#E11D48" }}>★</span>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-white border p-14 text-center shadow-lg"
              style={{ borderColor: "#E6ECF4" }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#059669]/10 flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
              <h3 className="font-black text-2xl mb-3" style={{ color: INK }}>Demande envoyée !</h3>
              <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#46556B" }}>
                Notre équipe technique vous contactera sous 24h ouvrées. Merci de votre confiance.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 text-xs font-semibold hover:underline"
                style={{ color: BLUE }}
              >
                Soumettre une nouvelle demande →
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-white border shadow-lg overflow-hidden"
              style={{ borderColor: "#E6ECF4" }}
            >
              {/* Request type selector — dark banner */}
              <div className="px-8 py-7" style={{ background: INK }}>
                <label className={labelCls} style={{ color: "rgba(255,255,255,0.5)" }}>
                  Vous souhaitez nous soumettre une demande
                  <span style={{ color: "#E11D48" }}>★</span>
                </label>
                <div className="relative mt-1.5">
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full appearance-none rounded-xl border px-4 py-3.5 text-sm outline-none cursor-pointer pr-10"
                    style={{
                      borderColor: requestType ? BLUE : "rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.07)",
                      color: requestType ? "white" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    <option value="" disabled style={{ color: INK, background: "white" }}>— Sélection —</option>
                    {REQUEST_TYPES.map((t, i) => (
                      <option key={i} value={t} style={{ color: INK, background: "white" }}>{t}</option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              {/* Fields grid */}
              <div className="px-8 py-8 space-y-6">
                {/* Row 1: first name + last name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls} style={{ color: "#8694A8" }}>
                      Prénom <span style={{ color: "#E11D48" }}>★</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={fields.firstName}
                      onChange={handleChange}
                      placeholder="Entrez votre prénom"
                      className={inputCls}
                      style={{ ...inputStyle, ...inputFocus }}
                    />
                  </div>
                  <div>
                    <label className={labelCls} style={{ color: "#8694A8" }}>
                      Nom <span style={{ color: "#E11D48" }}>★</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={fields.lastName}
                      onChange={handleChange}
                      placeholder="Entrez votre nom"
                      className={inputCls}
                      style={{ ...inputStyle, ...inputFocus }}
                    />
                  </div>
                </div>

                {/* Row 2: phone + email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls} style={{ color: "#8694A8" }}>
                      Téléphone <span style={{ color: "#E11D48" }}>★</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs pointer-events-none"
                        style={{ color: "#46556B" }}>
                        <span>🇫🇷</span>
                        <span className="font-medium">+33</span>
                        <div className="w-px h-4" style={{ background: "#E1E8F1" }} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={fields.phone}
                        onChange={handleChange}
                        placeholder="_ _ _ _ _ _ _ _ _"
                        className={inputCls}
                        style={{ ...inputStyle, ...inputFocus, paddingLeft: "5.5rem" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} style={{ color: "#8694A8" }}>
                      E-mail <span style={{ color: "#E11D48" }}>★</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#B9C8DC" }}>@</span>
                      <input
                        type="email"
                        name="email"
                        value={fields.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        className={inputCls}
                        style={{ ...inputStyle, ...inputFocus, paddingLeft: "2rem" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: address + postal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls} style={{ color: "#8694A8" }}>
                      Adresse <span style={{ color: "#E11D48" }}>★</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={fields.address}
                      onChange={handleChange}
                      placeholder="Entrez le nom de la rue"
                      className={inputCls}
                      style={{ ...inputStyle, ...inputFocus }}
                    />
                  </div>
                  <div>
                    <label className={labelCls} style={{ color: "#8694A8" }}>
                      Code postal <span style={{ color: "#E11D48" }}>★</span>
                    </label>
                    <input
                      type="text"
                      name="postal"
                      value={fields.postal}
                      onChange={handleChange}
                      placeholder="_ _ _ _ _"
                      maxLength={5}
                      className={inputCls}
                      style={{ ...inputStyle, ...inputFocus }}
                    />
                  </div>
                </div>

                {/* Row 4: city + company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls} style={{ color: "#8694A8" }}>
                      Ville <span style={{ color: "#E11D48" }}>★</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={fields.city}
                      onChange={handleChange}
                      placeholder="Entrez la ville"
                      className={inputCls}
                      style={{ ...inputStyle, ...inputFocus }}
                    />
                  </div>
                  <div>
                    <label className={labelCls} style={{ color: "#8694A8" }}>
                      Entreprise <span style={{ color: "#E11D48" }}>★</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={fields.company}
                      onChange={handleChange}
                      placeholder="Renseignez les informations de l'entreprise"
                      className={inputCls}
                      style={{ ...inputStyle, ...inputFocus }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={labelCls} style={{ color: "#8694A8" }}>
                    Objet du message <span style={{ color: "#E11D48" }}>★</span>
                  </label>
                  <textarea
                    name="message"
                    value={fields.message}
                    onChange={handleChange}
                    placeholder="Entrez votre question"
                    rows={5}
                    className={inputCls}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                  />
                </div>

                {/* Footer: checkbox + captcha placeholder + submit */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group flex-1">
                    <div
                      onClick={() => setAgreed(!agreed)}
                      className="mt-0.5 w-4.5 h-4.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors"
                      style={{
                        width: 18, height: 18,
                        borderColor: agreed ? BLUE : "#C8D5E4",
                        background: agreed ? BLUE : "white",
                      }}
                    >
                      {agreed && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <span className="text-xs leading-relaxed" style={{ color: "#46556B" }}>
                      J'accepte les{" "}
                      <a href="/cgv" className="underline font-medium" style={{ color: BLUE_DEEP }}>conditions générales de vente</a>
                    </span>
                  </label>

                  {/* Simulated reCAPTCHA visual */}
                  <div className="flex-shrink-0 rounded-xl border px-4 py-3 flex items-center gap-3 text-xs"
                    style={{ borderColor: "#D5E0EF", background: "#F6F9FD", minWidth: 200 }}>
                    <div className="w-5 h-5 rounded border-2 border-[#C8D5E4]" />
                    <span style={{ color: "#46556B" }}>Je ne suis pas un robot</span>
                    <div className="ml-auto text-center">
                      <div className="text-[10px] font-bold" style={{ color: "#4A90D9" }}>reCAPTCHA</div>
                      <div className="text-[8px]" style={{ color: "#B9C8DC" }}>Confidentialité</div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <MagneticBtn
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-semibold text-white text-sm shadow-lg cursor-pointer transition-opacity"
                    style={{
                      background: INK,
                      boxShadow: "0 12px 30px -8px rgba(11,28,50,0.4)",
                      opacity: (requestType && fields.firstName && fields.email && agreed) ? 1 : 0.5,
                    }}
                  >
                    Soumettre ma demande
                  </MagneticBtn>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
// Mount this on its own route (e.g. app/contact-formulaire/page.jsx in the
// Next.js App Router) — it must match the path used in router.push() inside
// ContactPage.jsx. Because navigation here uses router.push (not replace),
// the technical-assistance page stays in browser history, so the browser's
// own back button — and the "Retour" button below — both return to it.

export default function ContactFormPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen">
      <BackButton />
      <ContactForm />
    </main>
  );
}