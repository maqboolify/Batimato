"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

// ─── Tokens (identical to homepage) ───────────────────────────────────────────
const INK = "#0B1C32";
const BLUE = "#2A6DD9";
const BLUE_DEEP = "#1656C9";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.06, ease },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

function useInViewAnim(threshold = "-80px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: threshold });
  return [ref, inView];
}

// ─── Data — exact fields/options from the live contact form ──────────────────

const REQUEST_TYPES = [
  "Service études couleurs",
  "Assistance technique",
  "Service prescription",
  "Service commercial",
  "Journée technique",
  "Rendez-vous showroom",
];

const CONTACT_CARDS = [
  {
    icon: "phone",
    title: "Par téléphone",
    text: "Nos conseillers sont disponibles du lundi au vendredi.",
    value: "01 23 45 67 89",
    color: BLUE,
  },
  {
    icon: "mail",
    title: "Par e-mail",
    text: "Une réponse de notre service client sous 24h ouvrées.",
    value: "contact@peinturesdeparis.com",
    color: "#7C3AED",
  },
  {
    icon: "pin",
    title: "En magasin",
    text: "32 agences en Île-de-France, ouvertes 6j/7.",
    value: "Trouver mon magasin",
    color: "#059669",
  },
];

const FOOTER_PRODUCTS = [
  { label: "Peintures", href: "/peintures" },
  { label: "Matériel & fournitures", href: "/materiel-fournitures" },
];

const FOOTER_COMPANY = [
  { label: "Nos services", href: "/nos-services" },
  { label: "Contact", href: "/formulaire-contact" },
  { label: "A propos de nous", href: "/le-groupe" },
];

const FOOTER_LEGAL = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/conditions-generales-de-vente" },
  { label: "Paramétrage des cookies", href: "#" },
];

// ─── Icon set (line icons, consistent stroke weight) ──────────────────────────

function Icon({ name, size = 18, color = "currentColor" }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "phone":
      return <svg {...props}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>;
    case "mail":
      return <svg {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>;
    case "pin":
      return <svg {...props}><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
    case "chevron":
      return <svg {...props}><path d="M9 18l6-6-6-6" /></svg>;
    case "facebook":
      return <svg {...props} fill={color} stroke="none"><path d="M22 12a10 10 0 10-11.56 9.88v-7H7.9v-2.88h2.54V9.84c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.88h-2.33v7A10 10 0 0022 12z" /></svg>;
    case "instagram":
      return <svg {...props}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" /></svg>;
    default:
      return null;
  }
}

// ─── Badge / SectionLabel (same as homepage) ──────────────────────────────────

function Badge({ children, color }) {
  return (
    <span
      style={{ background: color + "14", color, border: `1px solid ${color}3a` }}
      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}

function SectionLabel({ children, color = BLUE_DEEP }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px" style={{ background: color }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color }}>{children}</span>
    </div>
  );
}

// ─── Magnetic Button (same as homepage/login) ─────────────────────────────────

import type { ReactNode, CSSProperties } from "react";

interface MagneticBtnProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}
function MagneticBtn({
  children,
  className,
  style,
  type = "button",
  onClick,
  disabled,
}: MagneticBtnProps) {
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
  const Tag = href ? "a" : "button";
  const tagProps = href
    ? { href, onClick }
    : { type, onClick, disabled };

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={handleLeave} className="inline-block">
      <Tag {...tagProps} className={className} style={style}>
        {children}
      </Tag>
    </motion.div>
  );
}

// ─── Form field primitives ────────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#46556B" }}>
      {children}
      {required && <span style={{ color: "#E11D48" }}> *</span>}
    </label>
  );
}

function shellStyle(focused, error) {
  return {
    borderColor: error ? "#E11D48" : focused ? BLUE : "#E1E8F1",
    boxShadow: focused ? `0 0 0 4px ${error ? "#E11D48" : BLUE}14` : "none",
    background: "#fff",
  };
}

function TextField({ label, required, type = "text", placeholder, value, onChange, name, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative rounded-xl border transition-all duration-200" style={shellStyle(focused, error)}>
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none px-4 py-3.5 text-sm rounded-xl"
          style={{ color: INK }}
        />
      </div>
      {error && <div className="mt-1.5 text-[11px] font-medium" style={{ color: "#E11D48" }}>{error}</div>}
    </div>
  );
}

function TextArea({ label, required, placeholder, value, onChange, name, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative rounded-xl border transition-all duration-200" style={shellStyle(focused, error)}>
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={5}
          className="w-full bg-transparent outline-none px-4 py-3.5 text-sm rounded-xl resize-none"
          style={{ color: INK }}
        />
      </div>
      {error && <div className="mt-1.5 text-[11px] font-medium" style={{ color: "#E11D48" }}>{error}</div>}
    </div>
  );
}

function SelectField({ label, required, value, onChange, name, options, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative rounded-xl border transition-all duration-200" style={shellStyle(focused, error)}>
        <select
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none pl-4 pr-10 py-3.5 text-sm rounded-xl appearance-none"
          style={{ color: value ? INK : "#8694A8" }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#8694A8" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </div>
      {error && <div className="mt-1.5 text-[11px] font-medium" style={{ color: "#E11D48" }}>{error}</div>}
    </div>
  );
}

function PhoneField({ label, required, value, onChange, name, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="relative rounded-xl border transition-all duration-200 flex items-center" style={shellStyle(focused, error)}>
        <div className="flex items-center gap-1.5 pl-4 pr-3 border-r" style={{ borderColor: "#E1E8F1", color: "#46556B" }}>
          <span className="text-base leading-none">🇫🇷</span>
          <span className="text-sm font-medium">+33</span>
        </div>
        <input
          name={name}
          type="tel"
          required={required}
          placeholder="_ _ _ _ _ _ _ _ _"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none px-4 py-3.5 text-sm rounded-xl"
          style={{ color: INK }}
        />
      </div>
      {error && <div className="mt-1.5 text-[11px] font-medium" style={{ color: "#E11D48" }}>{error}</div>}
    </div>
  );
}

// ─── Banner / Hero ─────────────────────────────────────────────────────────────

function ContactBanner() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, #EAF1FB 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: "linear-gradient(#0B1C32 1px, transparent 1px), linear-gradient(90deg, #0B1C32 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          aria-label="breadcrumb"
          className="flex items-center gap-2 text-xs font-medium mb-10"
          style={{ color: "#8694A8" }}
        >
          <a href="/" className="hover:underline" style={{ color: "#8694A8" }}>Accueil</a>
          <Icon name="chevron" size={12} />
          <span style={{ color: INK }} className="font-semibold">Contact</span>
        </motion.nav>

        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Badge color={BLUE}>Une question ? Un projet ?</Badge>
          <h1 className="mt-6 font-black tracking-[-0.03em] leading-[0.95]"
            style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)", color: INK }}>
            Contactez-<span style={{ color: BLUE }}>nous</span>
          </h1>
          <p className="mt-6 text-base lg:text-lg leading-relaxed max-w-xl" style={{ color: "#46556B" }}>
            Notre équipe d'experts est à votre écoute pour répondre à toutes vos questions techniques, commerciales ou colorimétriques.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact cards (quick channels) ────────────────────────────────────────────

function ContactCards() {
  const [ref, inView] = useInViewAnim();
  return (
    <section ref={ref} className="bg-white pb-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-3 gap-5"
        >
          {CONTACT_CARDS.map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="group relative rounded-2xl border p-6 bg-white hover:shadow-md transition-all duration-300"
              style={{ borderColor: "#E6ECF4" }}
              whileHover={{ y: -3 }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: c.color + "14", border: `1px solid ${c.color}30` }}>
                <Icon name={c.icon} color={c.color} />
              </div>
              <h3 className="font-bold text-sm" style={{ color: INK }}>{c.title}</h3>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#46556B" }}>{c.text}</p>
              <div className="mt-4 text-sm font-semibold" style={{ color: c.color }}>{c.value}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [ref, inView] = useInViewAnim("-40px");
  const [form, setForm] = useState({
    requirementType: "",
    firstName: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    zipCode: "",
    city: "",
    companyName: "",
    comment: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const required = ["requirementType", "firstName", "name", "phone", "email", "address", "zipCode", "city", "companyName", "comment"];
    const newErrors = {};
    required.forEach((k) => {
      if (!form[k]?.trim()) newErrors[k] = "Champ obligatoire";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Merci de renseigner une adresse email valide";
    }
    if (!agreed) newErrors.agreed = "Champ obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Wire to real submission endpoint here.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border p-12 text-center bg-white shadow-xl"
            style={{ borderColor: "#E6ECF4" }}
          >
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "#05966914" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h2 className="font-black tracking-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: INK }}>
              Votre demande a été envoyée
            </h2>
            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "#46556B" }}>
              Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais, généralement sous 24h ouvrées.
            </p>
            <MagneticBtn
              href="/"
              className="mt-8 inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-sm shadow-lg"
              style={{ background: BLUE, boxShadow: `0 12px 30px -8px ${BLUE}66` }}
            >
              Retour à l'accueil
            </MagneticBtn>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-10 lg:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-20">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <SectionLabel>Formulaire</SectionLabel>
            <h2 className="font-black tracking-tight" style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", color: INK }}>
              Écrivez-nous
            </h2>
          </div>
          <p className="text-xs font-semibold" style={{ color: "#8694A8" }}>* Champs obligatoires</p>
        </motion.div>

        <motion.form
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl border p-6 sm:p-10 bg-white shadow-sm"
          style={{ borderColor: "#E6ECF4" }}
        >
          <motion.div variants={fadeUp} className="mb-6">
            <SelectField
              label="Vous désirez nous communiquer une demande"
              required
              name="requirementType"
              value={form.requirementType}
              onChange={handleChange}
              options={REQUEST_TYPES}
              placeholder="— Sélection —"
              error={errors.requirementType}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-5">
            <TextField label="Prénom" required name="firstName" placeholder="Renseignez votre prénom" value={form.firstName} onChange={handleChange} error={errors.firstName} />
            <TextField label="Nom" required name="name" placeholder="Renseignez votre nom" value={form.name} onChange={handleChange} error={errors.name} />
          </motion.div>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-5 mt-5">
            <PhoneField label="Téléphone" required name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            <TextField label="E-mail" required type="email" name="email" placeholder="vous@exemple.fr" value={form.email} onChange={handleChange} error={errors.email} />
          </motion.div>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-5 mt-5">
            <TextField label="Adresse" required name="address" placeholder="Renseignez le nom de la rue" value={form.address} onChange={handleChange} error={errors.address} />
            <TextField label="Code postal" required name="zipCode" placeholder="_ _ _ _ _" value={form.zipCode} onChange={handleChange} error={errors.zipCode} />
          </motion.div>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-5 mt-5">
            <TextField label="Ville" required name="city" placeholder="Renseignez la ville" value={form.city} onChange={handleChange} error={errors.city} />
            <TextField label="Société" required name="companyName" placeholder="Merci de renseigner la société" value={form.companyName} onChange={handleChange} error={errors.companyName} />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5">
            <TextArea label="Sujet du message" required name="comment" placeholder="Entrez votre question" value={form.comment} onChange={handleChange} error={errors.comment} />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-7 pt-7 border-t" style={{ borderColor: "#EEF2F8" }}>
            <label className="flex items-start gap-3 text-sm cursor-pointer select-none" style={{ color: "#46556B" }}>
              <span
                onClick={() => { setAgreed((a) => !a); setErrors((er) => ({ ...er, agreed: undefined })); }}
                className="mt-0.5 w-[18px] h-[18px] rounded-md flex-shrink-0 flex items-center justify-center border transition-colors duration-150"
                style={{ background: agreed ? BLUE : "#fff", borderColor: errors.agreed ? "#E11D48" : agreed ? BLUE : "#D7E1EE" }}
              >
                {agreed && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                )}
              </span>
              J'accepte les conditions générales de vente
            </label>
            {errors.agreed && <div className="mt-1.5 text-[11px] font-medium" style={{ color: "#E11D48" }}>{errors.agreed}</div>}

            <p className="mt-4 text-[11px] leading-relaxed" style={{ color: "#8694A8" }}>
              Ce site est protégé par reCAPTCHA et les{" "}
              <a href="https://policies.google.com/privacy" className="underline">règles de confidentialité</a> et{" "}
              <a href="https://policies.google.com/terms" className="underline">conditions d'utilisation</a> de Google s'appliquent.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex justify-end">
            <MagneticBtn
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl font-semibold text-white text-sm shadow-lg w-full sm:w-auto"
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
                  Envoyer ma demande
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </>
              )}
            </MagneticBtn>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}

// ─── Footer (matches homepage card/section language) ──────────────────────────

function ContactFooter() {
  const [ref, inView] = useInViewAnim();
  return (
    <>
      {/* Top footer band — stores / brands / careers */}
      <section ref={ref} className="py-20 bg-[#F6F9FD] border-t" style={{ borderColor: "#E1E8F1" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid md:grid-cols-3 gap-10"
          >
            {[
              {
                title: "32 points de vente en Île-de-France",
                cta: "Nous trouver",
                href: "https://magasins.peinturesdeparis.com/peinturesdeparis/fr",
              },
              {
                title: "Les plus grandes marques",
                cta: "Le groupe",
                href: "/le-groupe",
              },
              {
                title: "Rejoignez-nous",
                text: "Plus de 180 collaborateurs au service des professionnels de la peinture, et un réseau de distribution intégré.",
                cta: "Postulez en ligne",
                href: "/nos-metiers",
              },
            ].map((b, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <h3 className="font-bold text-lg leading-tight" style={{ color: INK }}>{b.title}</h3>
                {b.text && <p className="text-sm mt-3 leading-relaxed" style={{ color: "#46556B" }}>{b.text}</p>}
                <a href={b.href} className="inline-flex items-center gap-2 mt-5 text-sm font-semibold hover:gap-3.5 transition-all duration-200" style={{ color: BLUE_DEEP }}>
                  {b.cta}
                  <Icon name="chevron" size={13} />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social banner */}
      <section className="py-5" style={{ background: "#9d2c85" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-sm text-white/90">L'actualité Peintures de Paris en temps réel sur</p>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/peinturesdeparis" aria-label="facebook" className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/15" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Icon name="facebook" size={15} color="#fff" />
            </a>
            <a href="https://www.instagram.com/peinturesdeparis" aria-label="instagram" className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors hover:bg-white/15" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Icon name="instagram" size={15} color="#fff" />
            </a>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <footer style={{ background: INK }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Nos produits</h4>
              <nav className="flex flex-col gap-3">
                {FOOTER_PRODUCTS.map((l) => (
                  <a key={l.label} href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Peintures de Paris</h4>
              <nav className="flex flex-col gap-3">
                {FOOTER_COMPANY.map((l) => (
                  <a key={l.label} href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>
            <div>
              <div className="inline-flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: BLUE }}>PP</div>
                <span className="font-bold text-sm text-white">Peintures de Paris</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Depuis 50 ans, nous accompagnons les professionnels de la construction en Île-de-France.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-5" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <ul className="flex flex-wrap items-center gap-6">
              {FOOTER_LEGAL.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Copyright PPG {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <main className="bg-white overflow-x-hidden">
      <ContactBanner />
      <ContactCards />
      <ContactForm />
      <ContactFooter />
    </main>
  );
}