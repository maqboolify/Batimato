"use client";

/**
 * BATIMATO — Contact / Devis Page
 * ─────────────────────────────────────────────────────────────────
 * Sections:
 *  1. Navbar          — reused from your existing navigation component
 *  2. ContactHero      — black + yellow intro, quick-contact chips
 *  3. ContactMain       — 2-column: coordinates card + dynamic quote form
 *  4. Footer            — same dark card / yellow bottom bar as the homepage
 *
 * The quote form lets a customer pick a product category (mirroring your
 * nav: Peinture, Outillage, Préparation & Matériaux, plus Électricité and
 * Plomberie) and specify how many of each item they need — they can add as
 * many line items as their project requires.
 *
 * UPDATED: reworked for a polished, professional mobile experience —
 * tighter breakpoints, a stacked 2-column layout for line items on small
 * screens, richer yellow accents (glow, gradient rails, focus rings,
 * hover lift on the CTA), and tuned spacing at every viewport.
 *
 * NOTE: adjust the Navbar import path below to match your project
 * structure (e.g. "@/components/Navbar").
 */
import Link from "next/link";
import { useState } from "react";
import type { ReactNode, ComponentType } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar/page";

// ─── Tokens — matches the Batimato navbar/site theme ─────────────────────────
const YELLOW      = "#F5C300";
const YELLOW_DARK  = "#D4A800";
const YELLOW_LIGHT = "#FFF9D6";
const INK          = "#1A1A1A";
const GRAY         = "#F2F2F2";
const BDR          = "rgba(26,26,26,0.09)";
const BDRY         = "rgba(245,195,0,0.35)";
const MUT          = "rgba(26,26,26,0.55)";
const DIM          = "rgba(26,26,26,0.28)";
const MUT_DARKBG   = "rgba(255,255,255,0.55)";
const DIM_DARKBG   = "rgba(255,255,255,0.16)";
const RING         = "0 0 0 4px rgba(245,195,0,0.16)";

// ─── Quote form data ──────────────────────────────────────────────────────────
// Categories mirror the site catalogue (Peinture, Outillage, Préparation &
// Matériaux) plus Électricité and Plomberie, so a customer can request a
// quote for exactly what their chantier needs. Edit freely to match your
// real product taxonomy.
const CATEGORY_OPTIONS = [
  "Peinture & Revêtements",
  "Outillage électroportatif",
  "Préparation des supports",
  "Électricité",
  "Plomberie",
  "Protection & EPI",
  "Autre",
];
const UNIT_OPTIONS = ["pièce(s)", "m²", "litre(s)", "kg", "sac(s)", "rouleau(x)"];

type QuoteItem = {
  id: number;
  category: string;
  description: string;
  quantity: number;
  unit: string;
};

let itemUid = 1;
const makeItem = (): QuoteItem => ({
  id: itemUid++,
  category: CATEGORY_OPTIONS[0],
  description: "",
  quantity: 1,
  unit: UNIT_OPTIONS[0],
});

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  Phone: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.37 2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>),
  Mail: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>),
  Pin: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>),
  Clock: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>),
  Plus: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>),
  Minus: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>),
  Trash: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>),
  Check: () => (<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
  ArrowRight: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>),
  Instagram: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>),
  TikTok: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 1h-3.3v14.6c0 1.6-1.3 2.9-2.9 2.9a2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6 0 .9.1V9.4a6.2 6.2 0 0 0-.9-.1A6.2 6.2 0 0 0 4.1 15.6a6.2 6.2 0 0 0 6.2 6.2 6.2 6.2 0 0 0 6.2-6.2V8.1a8.4 8.4 0 0 0 4.9 1.6V6.4a5 5 0 0 1-4.9-5.4z" /></svg>),
  YouTube: () => (<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.5V8.5l6.3 3.5-6.3 3.5z" /></svg>),
};

// ─── Small shared field styles ─────────────────────────────────────────────────
const inputStyle = {
  width: "100%", height: 44, border: `1px solid ${BDR}`, borderRadius: 9,
  padding: "0 14px", fontSize: "0.88rem", color: INK, background: "#fff", outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};
const labelStyle = { display: "block", color: INK, fontWeight: 700, fontSize: "0.78rem", marginBottom: 8 };
const stepperBtn = { width: 34, height: 36, border: "none", background: "none", color: INK, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 };

function focusRing(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = BDRY;
  e.currentTarget.style.boxShadow = RING;
}
function blurRing(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = BDR;
  e.currentTarget.style.boxShadow = "none";
}

function BgGrid() {
  return (
    <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }}>
      <defs>
        <pattern id="contact-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0L0 0 0 60" fill="none" stroke="rgba(245,195,0,0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#contact-grid)" />
    </svg>
  );
}

// Soft radial glow used behind hero copy — the one bold, signature accent.
function HeroGlow() {
  return (
    <div aria-hidden className="hero-glow" style={{
      position: "absolute", top: "-20%", left: "-10%", width: 620, height: 620,
      background: "radial-gradient(circle, rgba(245,195,0,0.16) 0%, rgba(245,195,0,0) 68%)",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════
function ContactHero() {
  const chips = [
    { icon: Icon.Phone, label: "01 23 45 67 89", href: "tel:+33123456789" },
    { icon: Icon.Mail, label: "contact@batimato.fr", href: "mailto:contact@batimato.fr" },
    // { icon: Icon.Pin, label: "32 showrooms en Île-de-France", href: "/showrooms" },
  ];

  return (
    <section className="contact-hero" style={{ background: INK, position: "relative", overflow: "hidden", padding: "88px 0 72px" }}>
      <BgGrid />
      <HeroGlow />
      <div className="hero-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: YELLOW, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 20 }}>
            <span style={{ width: 22, height: 1, background: YELLOW, display: "inline-block" }} />
            Contact
          </span>
          <h1 className="hero-title" style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 18px", maxWidth: 720 }}>
            Un projet ? Une question ?<br /><span style={{ color: YELLOW }}>Parlons-en.</span>
          </h1>
          <p className="hero-sub" style={{ color: MUT_DARKBG, fontSize: "1rem", lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
            Décrivez-nous votre chantier et les références dont vous avez besoin — notre équipe technique vous prépare un devis sous 2 heures ouvrées.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="hero-chips" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
        >
          {chips.map(c => (
            <a key={c.label} href={c.href} className="hero-chip" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "rgba(255,255,255,0.06)", border: `1px solid ${DIM_DARKBG}`,
              borderRadius: 10, padding: "11px 18px", color: "#fff", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600,
              transition: "border-color 0.2s, background 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BDRY; e.currentTarget.style.background = "rgba(245,195,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = DIM_DARKBG; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ color: YELLOW, display: "flex" }}><c.icon /></span>
              {c.label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LEFT COLUMN — coordinates + showroom card + socials
// ═══════════════════════════════════════════════════════════════════════════
type InfoRowProps = {
  icon: ComponentType;
  label: string;
  value: ReactNode;
  href?: string;
};

function InfoRow({ icon: IconComp, label, value, href }: InfoRowProps) {
  const content = (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div className="info-icon" style={{ width: 38, height: 38, borderRadius: 9, background: YELLOW_LIGHT, border: `1px solid ${BDRY}`, display: "flex", alignItems: "center", justifyContent: "center", color: YELLOW_DARK, flexShrink: 0, transition: "box-shadow 0.2s, transform 0.2s" }}>
        <IconComp />
      </div>
      <div>
        <div style={{ color: MUT, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
        <div style={{ color: INK, fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
  return href
    ? (
      <a
        href={href}
        style={{ textDecoration: "none" }}
        onMouseEnter={e => {
          const icon = e.currentTarget.querySelector<HTMLElement>(".info-icon");
          if (icon) { icon.style.boxShadow = "0 0 0 4px rgba(245,195,0,0.14)"; icon.style.transform = "translateY(-1px)"; }
        }}
        onMouseLeave={e => {
          const icon = e.currentTarget.querySelector<HTMLElement>(".info-icon");
          if (icon) { icon.style.boxShadow = "none"; icon.style.transform = "translateY(0)"; }
        }}
      >
        {content}
      </a>
    )
    : content;
}

function ContactInfoColumn() {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div className="info-card" style={{ background: GRAY, border: `1px solid ${BDR}`, borderTop: `3px solid ${YELLOW}`, borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ color: INK, fontWeight: 800, fontSize: "1.05rem" }}>Nos coordonnées</div>
        <InfoRow icon={Icon.Phone} label="Téléphone" value="01 23 45 67 89" href="tel:+33123456789" />
        <InfoRow icon={Icon.Mail} label="Email" value="contact@batimato.fr" href="mailto:contact@batimato.fr" />
        <InfoRow icon={Icon.Pin} label="Adresse" value={<>BATIMATO<br />79 rue de rateau 93120 La Courneuve</>} />
        <InfoRow icon={Icon.Clock} label="Horaires" value={<>Lun–Ven : 7h30–18h30<br />Sam : 8h–17h</>} />
      </div>

      {/* <div style={{ background: INK, borderRadius: 16, padding: "26px 24px", position: "relative", overflow: "hidden" }}>
        <BgGrid />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>32 showrooms</div>
          <div style={{ color: MUT_DARKBG, fontSize: "0.82rem", lineHeight: 1.6, marginBottom: 18 }}>
            Retrait immédiat, conseil technique sur place et matériel professionnel en stock.
          </div>
          <a href="/showrooms" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: YELLOW, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}>
            Trouver le plus proche <Icon.ArrowRight />
          </a>
        </div>
      </div> */}

      <div style={{ display: "flex", gap: 10 }}>
        {[Icon.Instagram, Icon.TikTok, Icon.YouTube].map((IconComp, i) => (
          <a key={i} href="#" aria-label="Réseau social" style={{ width: 38, height: 38, borderRadius: 9, border: `1px solid ${BDR}`, display: "flex", alignItems: "center", justifyContent: "center", color: INK, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = YELLOW; e.currentTarget.style.borderColor = YELLOW; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = BDR; e.currentTarget.style.transform = "translateY(0)"; }}
          ><IconComp /></a>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RIGHT COLUMN — dynamic quote form
// ═══════════════════════════════════════════════════════════════════════════
type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

function Field({ label, value, onChange, placeholder, type = "text", required = false }: FieldProps) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color: YELLOW_DARK }}> *</span>}</label>
      <input type={type} value={value} required={required} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={focusRing}
        onBlur={blurRing}
      />
    </div>
  );
}

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  ariaLabel?: string;
  className?: string;
};

function Select({ value, onChange, options, ariaLabel, className }: SelectProps) {
  return (
    <select className={className} aria-label={ariaLabel} value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, cursor: "pointer" }}
      onFocus={focusRing}
      onBlur={blurRing}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function QuoteForm() {
  const [form, setForm] = useState({ firstName: "", lastName: "", company: "", email: "", phone: "" });
  const [items, setItems] = useState<QuoteItem[]>([makeItem()]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateItem = (id: number, field: keyof QuoteItem, value: string | number) =>
    setItems(prev => prev.map(it => (it.id === id ? { ...it, [field]: value } : it)));
  const addItem = () => setItems(prev => [...prev, makeItem()]);
  const removeItem = (id: number) => setItems(prev => (prev.length > 1 ? prev.filter(it => it.id !== id) : prev));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    // TODO: wire this up to your form endpoint / API route (e.g. POST /api/devis)
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 900);
  };

  const resetForm = () => {
    setForm({ firstName: "", lastName: "", company: "", email: "", phone: "" });
    setItems([makeItem()]);
    setMessage("");
    setConsent(false);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="quote-card"
        style={{ background: "#fff", border: `1px solid ${BDR}`, borderTop: `3px solid ${YELLOW}`, borderRadius: 18, padding: "64px 40px", textAlign: "center" }}
      >
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: YELLOW_LIGHT, border: `1px solid ${BDRY}`, display: "flex", alignItems: "center", justifyContent: "center", color: YELLOW_DARK, margin: "0 auto 22px" }}>
          <Icon.Check />
        </div>
        <div style={{ color: INK, fontWeight: 900, fontSize: "1.4rem", marginBottom: 10 }}>Demande envoyée !</div>
        <p style={{ color: MUT, fontSize: "0.92rem", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
          Merci{form.firstName ? ` ${form.firstName}` : ""}, votre demande a bien été reçue. Un technicien Batimato vous recontacte sous 2 heures ouvrées avec votre devis.
        </p>
        <button onClick={resetForm} style={{ background: "none", border: `1.5px solid ${BDR}`, borderRadius: 9, padding: "11px 22px", color: INK, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
          Envoyer une nouvelle demande
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
      className="quote-card"
      style={{ background: "#fff", border: `1px solid ${BDR}`, borderTop: `3px solid ${YELLOW}`, borderRadius: 18, padding: "40px", boxShadow: "0 20px 60px rgba(26,26,26,0.06)" }}
    >
      <div style={{ color: INK, fontWeight: 900, fontSize: "1.5rem", letterSpacing: "-0.01em", marginBottom: 6 }}>Demande de devis</div>
      <p style={{ color: MUT, fontSize: "0.88rem", marginBottom: 32 }}>Indiquez vos coordonnées et les articles dont vous avez besoin — un expert vous répond sous 2h.</p>

      {/* Identity fields */}
      <div className="cf-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Field label="Prénom" required value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} placeholder="Jean" />
        <Field label="Nom" required value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} placeholder="Dupont" />
      </div>
      <div className="cf-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Field label="Société (optionnel)" value={form.company} onChange={v => setForm({ ...form, company: v })} placeholder="Nom de votre entreprise" />
        <Field label="Téléphone" required type="tel" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="06 12 34 56 78" />
      </div>
      <div style={{ marginBottom: 32 }}>
        <Field label="Email" required type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="vous@exemple.fr" />
      </div>

      {/* Line items */}
      <div style={{ borderTop: `1px solid ${BDR}`, paddingTop: 28, marginBottom: 28 }}>
        <div style={{ color: INK, fontWeight: 800, fontSize: "1rem", marginBottom: 4 }}>Articles nécessaires</div>
        <div style={{ color: MUT, fontSize: "0.82rem", marginBottom: 18 }}>Sélectionnez une catégorie et la quantité pour chaque article de votre commande.</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} className="cf-item-row" style={{
              display: "grid", gridTemplateColumns: "1.3fr 1.6fr 0.9fr 0.9fr auto",
              gap: 10, alignItems: "center",
              background: GRAY, border: `1px solid ${BDR}`, borderRadius: 12, padding: "12px 14px",
            }}>
              <Select className="cf-item-category" ariaLabel="Catégorie" value={item.category} onChange={v => updateItem(item.id, "category", v)} options={CATEGORY_OPTIONS} />
              <input
                className="cf-item-desc"
                value={item.description}
                onChange={e => updateItem(item.id, "description", e.target.value)}
                placeholder="Référence ou description"
                style={inputStyle}
                onFocus={focusRing}
                onBlur={blurRing}
              />
              <div className="cf-item-qty" style={{ display: "flex", alignItems: "center", border: `1px solid ${BDR}`, borderRadius: 8, background: "#fff", height: 38, overflow: "hidden" }}>
                <button type="button" onClick={() => updateItem(item.id, "quantity", Math.max(1, item.quantity - 1))} style={stepperBtn} aria-label="Diminuer la quantité">
                  <Icon.Minus />
                </button>
                <input
                  type="number" min={1} value={item.quantity}
                  onChange={e => updateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: "100%", border: "none", outline: "none", textAlign: "center", fontSize: "0.85rem", color: INK, background: "transparent" }}
                />
                <button type="button" onClick={() => updateItem(item.id, "quantity", item.quantity + 1)} style={stepperBtn} aria-label="Augmenter la quantité">
                  <Icon.Plus />
                </button>
              </div>
              <Select className="cf-item-unit" ariaLabel="Unité" value={item.unit} onChange={v => updateItem(item.id, "unit", v)} options={UNIT_OPTIONS} />
              <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1}
                className="cf-item-remove"
                style={{ background: "none", border: "none", color: items.length === 1 ? DIM : MUT, cursor: items.length === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 6 }}
                aria-label="Supprimer cet article"
              >
                <Icon.Trash />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addItem} style={{
          marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8,
          background: "none", border: `1.5px dashed ${BDRY}`, borderRadius: 9,
          padding: "10px 18px", color: YELLOW_DARK, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
          transition: "background 0.2s, border-color 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = YELLOW_LIGHT; e.currentTarget.style.borderColor = YELLOW_DARK; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = BDRY; }}
        >
          <Icon.Plus /> Ajouter un article
        </button>
      </div>

      {/* Message */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Message (optionnel)</label>
        <textarea
          value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Précisez les détails de votre chantier, délais souhaités, etc."
          rows={4}
          style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "vertical", fontFamily: "inherit" }}
          onFocus={focusRing}
          onBlur={blurRing}
        />
      </div>

      {/* Consent + submit */}
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 24, cursor: "pointer" }}>
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required style={{ marginTop: 3, accentColor: YELLOW_DARK }} />
        <span style={{ color: MUT, fontSize: "0.8rem", lineHeight: 1.6 }}>
          J'accepte que Batimato me recontacte au sujet de ma demande de devis.
        </span>
      </label>

      <button type="submit" disabled={submitting || !consent} className="cf-submit" style={{
        width: "100%", height: 52, borderRadius: 10, border: "none",
        background: submitting || !consent ? DIM : `linear-gradient(135deg, ${YELLOW} 0%, ${YELLOW_DARK} 100%)`,
        color: INK, fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.04em", textTransform: "uppercase",
        cursor: submitting || !consent ? "not-allowed" : "pointer",
        transition: "transform 0.15s, box-shadow 0.15s, background 0.2s",
        boxShadow: submitting || !consent ? "none" : "0 8px 22px rgba(245,195,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}
        onMouseEnter={e => { if (!submitting && consent) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(245,195,0,0.45)"; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = submitting || !consent ? "none" : "0 8px 22px rgba(245,195,0,0.35)"; }}
      >
        {submitting ? "Envoi en cours…" : (<>Envoyer ma demande de devis <Icon.ArrowRight /></>)}
      </button>
    </motion.form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — two-column layout
// ═══════════════════════════════════════════════════════════════════════════
function ContactMain() {
  return (
    <section className="contact-section" style={{ background: "#fff", padding: "72px 0 96px" }}>
      <div className="contact-grid-wrap" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "380px 1fr", gap: 40, alignItems: "flex-start" }}>
        <ContactInfoColumn />
        <QuoteForm />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER — same dark card / yellow bottom bar used across the site
// ═══════════════════════════════════════════════════════════════════════════
const FOOTER_COLUMNS = [
  { heading: "Catalogue", links: [
    { label: "Peintures & Revêtements", href: "/peintures" },
    { label: "Outillage électroportatif", href: "/outillage" },
    { label: "Préparation & Supports", href: "/preparation-materiaux" },
  ] },
  { heading: "Entreprise", links: [
    { label: "À propos", href: "/a-propos" },
    { label: "Showrooms", href: "/showrooms" },
    { label: "Carrières", href: "/carrieres" },
  ] },
  { heading: "Assistance", links: [
    { label: "Demander un devis", href: "/devis" },
    { label: "Fiches techniques", href: "/fiches-techniques" },
    { label: "Centre d'aide", href: "/aide" },
  ] },
];

type FooterColumnProps = {
  heading: string;
  links: { label: string; href: string }[];
};

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div>
      <div style={{ color: MUT_DARKBG, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 24 }}>{heading}</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        {links.map(l => (
          <li key={l.label}>
            <a href={l.href} className="footer-link" style={{ color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.01em", lineHeight: 1.2, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = YELLOW)}
              onMouseLeave={e => (e.currentTarget.style.color = "#fff")}
            >{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer" style={{ background: INK, borderRadius: 28, overflow: "hidden", maxWidth: 1360, margin: "0 auto 40px", border: `1px solid ${DIM_DARKBG}`, position: "relative" }}>
      <BgGrid />
      <div className="footer-cols" style={{ position: "relative", zIndex: 1, padding: "72px 56px 56px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
        {FOOTER_COLUMNS.map(col => <FooterColumn key={col.heading} {...col} />)}
        <div>
          <div style={{ color: MUT_DARKBG, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 24 }}>Contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <a href="mailto:contact@batimato.fr" style={{ color: YELLOW, textDecoration: "none", fontWeight: 800, fontSize: "1.1rem" }}>contact@batimato.fr</a>
            <a href="tel:+33123456789" style={{ color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "1.25rem" }}>01 23 45 67 89</a>
          </div>
        </div>
      </div>

      <div className="footer-bar" style={{ position: "relative", zIndex: 1, background: YELLOW, padding: "26px 56px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        {/* Logo — swap the src for your logo asset */}
        <a href="/" style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.JPG" alt="Batimato" className="footer-logo" style={{ height: 92, width: "auto", objectFit: "contain", borderRadius: "10px" }} />
        </a>
        <span className="footer-copy" style={{ color: "rgba(26,26,26,0.75)", fontSize: "0.83rem", fontWeight: 600 }}>
          © {new Date().getFullYear()} Batimato SAS — Tous droits réservés
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {[Icon.Instagram, Icon.TikTok, Icon.YouTube].map((IconComp, i) => (
            <a key={i} href="#" aria-label="Réseau social" style={{ color: INK, display: "flex", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            ><IconComp /></a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function ContactPage() {
  return (
    <main style={{ background: "#fff" }}>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: rgba(26,26,26,0.35); }

        /* ── Tablet ─────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .contact-grid-wrap { grid-template-columns: 1fr !important; gap: 28px !important; }
          .footer-cols { grid-template-columns: repeat(2, 1fr) !important; padding: 56px 40px 40px !important; gap: 32px !important; }
          .hero-container { padding: 0 32px !important; }
          .contact-grid-wrap { padding: 0 32px !important; }
        }

        /* ── Mobile ─────────────────────────────────────────────── */
        @media (max-width: 640px) {
          .contact-hero { padding: 56px 0 40px !important; }
          .hero-container { padding: 0 20px !important; }
          .hero-title { font-size: clamp(1.7rem, 8vw, 2.2rem) !important; margin-bottom: 14px !important; }
          .hero-sub { font-size: 0.92rem !important; margin-bottom: 28px !important; }
          .hero-chips { gap: 10px !important; }
          .hero-chip { flex: 1 1 auto; justify-content: center; padding: 12px 14px !important; font-size: 0.82rem !important; }
          .hero-glow { width: 380px !important; height: 380px !important; top: -15% !important; left: -20% !important; }

          .contact-section { padding: 40px 0 56px !important; }
          .contact-grid-wrap { padding: 0 16px !important; }

          .info-card { padding: 22px 18px !important; border-radius: 14px !important; }

          .quote-card { padding: 24px 18px !important; border-radius: 14px !important; }
          .cf-row2 { grid-template-columns: 1fr !important; gap: 14px !important; }

          .cf-item-row {
            grid-template-columns: 1fr 1fr !important;
            grid-template-areas:
              "desc desc"
              "category unit"
              "qty remove" !important;
            row-gap: 10px !important;
            padding: 14px !important;
          }
          .cf-item-desc { grid-area: desc; }
          .cf-item-category { grid-area: category; }
          .cf-item-unit { grid-area: unit; }
          .cf-item-qty { grid-area: qty; width: 100%; }
          .cf-item-remove {
            grid-area: remove;
            justify-self: end;
            border: 1px solid ${BDR} !important;
            border-radius: 8px !important;
            width: 38px; height: 38px;
          }

          .cf-submit { height: 50px !important; font-size: 0.85rem !important; }

          .footer-cols { grid-template-columns: 1fr !important; padding: 44px 24px 32px !important; gap: 28px !important; }
          .footer-link { font-size: 1.05rem !important; }
          .footer-bar { padding: 22px 24px !important; flex-direction: column !important; text-align: center !important; gap: 16px !important; }
          .footer-logo { height: 64px !important; }
          .footer-copy { order: 3; font-size: 0.76rem !important; }
          .site-footer { border-radius: 20px !important; margin-bottom: 24px !important; }
        }

        @media (max-width: 380px) {
          .hero-chip { font-size: 0.78rem !important; padding: 10px 12px !important; }
        }
      `}</style>

      <Navbar />
      <ContactHero />
      <ContactMain />
      <Footer />
    </main>
  );
}