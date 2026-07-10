"use client";

/**
 * BATIMATO — Homepage (no e-commerce)
 * ─────────────────────────────────────────────────────────────────
 * Sections:
 *  1. CategoryShowcase  — Full-bleed image categories (no shop, just explore)
 *  2. BrandTicker       — Partner marquee (logo images)
 *  3. WhyBatimato       — Trust pillars + stats with real photo accent
 *  4. ExpertiseStrip    — Large split-screen photo + copy bento
 *  5. Projects          — Masonry-style real project photos
 *  6. ProcessTimeline   — How we work together
 *  7. Testimonials      — Quote carousel with avatar photos (currently disabled)
 *  8. CTABanner         — Full-bleed yellow conversion banner
 *  9. Footer
 *
 * Stack: Next.js + Tailwind CSS + Framer Motion
 *
 * MOBILE NOTES
 * ─────────────────────────────────────────────────────────────────
 * Layout is built with inline styles (fixed multi-column grids), so
 * plain CSS can't override them without `!important`. The
 * <ResponsiveStyles /> component below injects a single global
 * stylesheet with `!important` media-query rules that only kick in
 * under 768px / 480px, targeting the `bm-*` classNames sprinkled
 * through the sections. Desktop is completely untouched.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, animate } from "framer-motion";
import type { Variants } from "framer-motion";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const Y    = "#FFC400";
const YD   = "#D4A000";
const YL   = "rgba(255,196,0,0.10)";
const INK  = "#0A0A0A";
const INKL = "#111111";
const CARD = "#141414";
const BDR  = "rgba(255,255,255,0.07)";
const BDRY = "rgba(255,196,0,0.28)";
const MUT  = "rgba(255,255,255,0.42)";
const DIM  = "rgba(255,255,255,0.16)";

// ─── Photo bank (free CDN images) ────────────────────────────────────────────
// Using Unsplash source URLs — swap for your own photos in production
const PHOTOS = {
  // Category cards
  paint:      "/paint.png",
  tools:      "/outillage.png",
  prep:       "downbg.png",
  electric:   "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80&auto=format&fit=crop",
  protection: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR23jxEOJTz4u2Ssl30DSfQ_1rvGqyIv3gVYtdQTOM6L-szZL5ibDXqNnI&s=10",
  materials:  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop",

  // Expertise split
  expertise:  "/iso.png",
  showroom:   "/main.png",

  // Projects masonry
  proj1:      "https://amelioservice.com/Deux_peintres_professionnels_hyperr_alistes_en_action_dans_l_appartement_haussmannien_de__subject_1_%20(1).png",
  proj2:      "https://www.snmi.org/wp-content/uploads/2021/08/Realisation_groupe_vega_snmi_01_paris-1-782x525.jpg",
  proj3:      "https://images.prismic.io/travauxlib%2Ffd4f2e27-e029-4fd2-ac54-9d13881cb376_revetement-sol-carrelage.jpg?auto=compress,format&rect=0,0,1050,700&w=1050&h=700",
  proj4:      "https://lesdemoisellesaversailles.com/wp-content/uploads/2025/06/les-demoiselles-a-versailles-conciergerie-luxe-conciergerie-haut-de-gamme-france-amp-international-48.jpg",
  proj5:      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfvPIOoatrrwh_GlcXz5_LWMW4F6T58h16hTYOGDBZnpYwaGIoGa5tLos&s=10",
};

// ─── Shared animation variants ─────────────────────────────────────────────
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─── Animated counter ─────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: v => setVal(Math.floor(v)) });
    return c.stop;
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Section header ────────────────────────────────────────────────────────
function SectionHeader({
  eyebrow, title, subtitle, centered = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bm-heading-wrap"
      style={{ textAlign: centered ? "center" : "left", margin: centered ? "0 auto" : "0" }}
    >
      <motion.div variants={fadeUp}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          color: Y, fontSize: "0.68rem", letterSpacing: "0.3em",
          fontWeight: 700, textTransform: "uppercase", marginBottom: "16px",
        }}>
          <span style={{ display: "inline-block", width: "22px", height: "1px", background: Y }} />
          {eyebrow}
          {centered && <span style={{ display: "inline-block", width: "22px", height: "1px", background: Y }} />}
        </span>
      </motion.div>
      <motion.h2 variants={fadeUp} className="bm-heading" style={{
        color: "#fff", fontWeight: 900, lineHeight: 1.1,
        letterSpacing: "-0.03em", marginBottom: subtitle ? "18px" : 0,
        fontSize: "clamp(2rem, 4vw, 3.2rem)",
      }}>
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} className="bm-subtitle" style={{
          color: MUT, lineHeight: 1.7, fontSize: "clamp(0.88rem, 1.1vw, 1rem)",
          maxWidth: centered ? "520px" : "480px",
          margin: centered ? "0 auto" : "0",
        }}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

function GlowDivider() {
  return (
    <div aria-hidden style={{
      height: "1px",
      background: `linear-gradient(90deg, transparent 0%, rgba(255,196,0,0.55) 30%, ${Y} 50%, rgba(255,196,0,0.55) 70%, transparent 100%)`,
    }} />
  );
}

function ArchGrid({ opacity = 0.7 }: { opacity?: number }) {
  return (
    <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }}>
      <defs>
        <pattern id="hp-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0L0 0 0 60" fill="none" stroke="rgba(255,196,0,0.06)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hp-grid)" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL RESPONSIVE STYLES — injected once, only affects mobile widths
// ═══════════════════════════════════════════════════════════════════════════
function ResponsiveStyles() {
  return (
    <style>{`
      /* ---------- Tablet & mobile (≤768px) ---------- */
      @media (max-width: 768px) {
        .bm-container { padding-left: 24px !important; padding-right: 24px !important; }
        .bm-section-pad { padding-top: 64px !important; padding-bottom: 64px !important; }

        .bm-heading { font-size: clamp(1.6rem, 6vw, 2.1rem) !important; line-height: 1.15 !important; }
        .bm-subtitle { max-width: 100% !important; }
        .bm-section-head-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }

        /* Category showcase */
        .bm-cat-top { grid-template-columns: 1fr !important; }
        .bm-cat-bottom { grid-template-columns: 1fr !important; gap: 12px !important; }
        .bm-cat-card { min-height: 220px !important; }

        /* Why Batimato */
        .bm-why-main { grid-template-columns: 1fr !important; gap: 24px !important; }
        .bm-pillars-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
        .bm-why-photo { min-height: 260px !important; order: -1 !important; }

        /* Expertise strip */
        .bm-expertise-main { grid-template-columns: 1fr !important; gap: 48px !important; }
        .bm-expertise-float { position: static !important; margin: -32px 16px 0 auto !important; width: fit-content !important; }

        /* Projects (masonry) */
        .bm-projects-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
        .bm-project-card { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 200px !important; }

        /* Process timeline */
        .bm-process-grid { grid-template-columns: 1fr 1fr !important; gap: 40px 16px !important; }
        .bm-process-connector { display: none !important; }

        /* Testimonials */
        .bm-quote-mark { font-size: 140px !important; top: 12px !important; }

        /* Brand ticker */
        .bm-brand-item { padding: 0 24px !important; height: 64px !important; }
        .bm-brand-logo { height: 64px !important; max-width: 150px !important; }

        /* CTA banner */
        .bm-cta-pad { padding: 56px 24px !important; }
        .bm-cta-row { flex-direction: column !important; align-items: flex-start !important; }
        .bm-cta-actions { width: 100% !important; }
        .bm-cta-actions a { width: 100% !important; justify-content: center !important; }

        /* Footer */
        .bm-footer { border-radius: 20px !important; margin: 24px auto !important; }
        .bm-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px 24px !important; padding: 56px 24px 40px !important; }
        .bm-footer-bottom { padding: 24px !important; flex-direction: column !important; text-align: center !important; gap: 16px !important; }
        .bm-footer-logo { height: 60px !important; }
        .bm-footer-col-link { font-size: 1.05rem !important; }
      }

      /* ---------- Small phones (≤480px) ---------- */
      @media (max-width: 480px) {
        .bm-container { padding-left: 16px !important; padding-right: 16px !important; }
        .bm-section-pad { padding-top: 48px !important; padding-bottom: 48px !important; }

        .bm-cat-bottom { grid-template-columns: 1fr !important; }
        .bm-pillars-grid { grid-template-columns: 1fr !important; }
        .bm-process-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        .bm-projects-grid { grid-template-columns: 1fr !important; }
        .bm-project-card { min-height: 220px !important; }
        .bm-footer-grid { grid-template-columns: 1fr !important; padding: 48px 20px 32px !important; }
        .bm-cta-pad { padding: 40px 16px !important; }
      }
    `}</style>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. CATEGORY SHOWCASE — full-bleed photo cards, no prices, just explore
// ═══════════════════════════════════════════════════════════════════════════
const CATEGORIES = [
  { label: "Peintures & Revêtements", sub: "Intérieur · Extérieur · Façades", href: "/peintures",              img: PHOTOS.paint,      span: 2 },
  { label: "Outillage Électroportatif", sub: "Perceuses · Scies · Meuleuses",  href: "/outillage",             img: PHOTOS.tools,      span: 2 },
  { label: "Préparation des supports",  sub: "Enduits · Abrasifs · Toile de verre", href: "/preparation-materiaux", img: PHOTOS.prep,   span: 1 },
  { label: "Câblage & Électricité",     sub: "Tableaux · Câbles · Prises",     href: "/electricite",           img: PHOTOS.electric,   span: 1 },
  { label: "Protection & EPI",          sub: "Masques · Combinaisons · Gants", href: "/protection",            img: PHOTOS.protection, span: 1 },
];

function CategoryCard({ cat, delay = 0 }: { cat: typeof CATEGORIES[0]; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={cat.href}
      className="bm-cat-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: `span ${cat.span}`,
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        display: "block",
        textDecoration: "none",
        minHeight: cat.span === 2 ? "340px" : "260px",
        cursor: "pointer",
      }}
    >
      {/* Photo */}
      <img
        src={cat.img}
        alt={cat.label}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(.25,.46,.45,.94)",
          filter: hovered ? "brightness(0.55)" : "brightness(0.38)",
        }}
      />
      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)",
      }} />
      {/* Yellow edge flash on hover */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "3px",
        background: Y,
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "transform 0.4s cubic-bezier(.4,0,.2,1)",
      }} />

      {/* Text */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "28px",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.35s ease",
      }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: cat.span === 2 ? "1.35rem" : "1rem", marginBottom: "6px", lineHeight: 1.25 }}>
          {cat.label}
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", marginBottom: "14px" }}>
          {cat.sub}
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          color: Y, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-8px)",
          transition: "opacity 0.3s, transform 0.3s",
        }}>
          Découvrir
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </motion.a>
  );
}

function CategoryShowcase() {
  return (
    <section className="bm-section-pad" style={{ background: INK, padding: "100px 0 80px", position: "relative", overflow: "hidden" }}>
      <ArchGrid opacity={0.5} />
      <div className="bm-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
        <div className="bm-section-head-row" style={{ marginBottom: "56px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
          <SectionHeader
            eyebrow="Nos Univers"
            title={<>Tout ce qu'il faut pour<br /><span style={{ color: Y }}>bâtir, rénover, embellir</span></>}
            subtitle="Matériaux professionnels, outillage haute performance, peintures techniques — sélectionnés pour les artisans et les particuliers exigeants."
          />
          <motion.a
            href="/catalogue"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              color: Y, textDecoration: "none", fontWeight: 700,
              fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase",
              flexShrink: 0, transition: "gap 0.2s",
            }}
            whileHover={{ gap: "14px" } as any}
          >
            Voir le catalogue complet
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.a>
        </div>

        {/* Main top row — both cards now full-width and equal size, stacked */}
        <div className="bm-cat-top" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "12px" }}>
          <CategoryCard cat={CATEGORIES[0]} delay={0} />
          <CategoryCard cat={CATEGORIES[1]} delay={0.1} />
        </div>
        {/* Bottom 3-column row */}
        <div className="bm-cat-bottom" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {CATEGORIES.slice(2).map((cat, i) => (
            <CategoryCard key={cat.label} cat={{ ...cat, span: 1 }} delay={0.15 + i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. WHY BATIMATO — pillars + animated stats
// ═══════════════════════════════════════════════════════════════════════════
const PILLARS = [
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>),
    title: "Qualité ISO 9001",
    body: "Chaque référence passe un contrôle qualité rigoureux. Uniquement les meilleurs standards du marché.",
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>),
    title: "Livraison en 4h",
    body: "Commande passée avant 12h, livrée le jour même en 4h chrono. Livraison offerte pour tous nos clients.",
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
    title: "Conseil Expert",
    body: "Techniciens disponibles en showroom, par téléphone ou chat. La bonne solution du premier coup.",
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>),
    title: "500+ Références",
    body: "Des grandes marques aux spécialistes — un catalogue pensé pour les professionnels du bâtiment.",
  },
];

const STATS = [
  { n: 20000, sfx: "+", label: "Clients actifs" },
  { n: 15,    sfx: " ans", label: "D'expertise" },
  { n: 32,    sfx: "",    label: "Showrooms" },
  { n: 98,    sfx: "%",   label: "Satisfaction" },
];

function WhyBatimato() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bm-section-pad" style={{ background: INKL, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, transparent, ${Y} 40%, transparent 100%)`,
      }} />

      <div className="bm-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
        {/* Header + link */}
        <div className="bm-section-head-row" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", marginBottom: "64px" }}>
          <SectionHeader
            eyebrow="Pourquoi Batimato"
            title={<>L'excellence au service<br /><span style={{ color: Y }}>de vos chantiers</span></>}
          />
          <motion.a href="/a-propos"
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "0 20px", height: "44px", borderRadius: "8px", border: `1px solid ${BDR}`, color: MUT, textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.25s", flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = BDRY; (e.currentTarget as HTMLElement).style.color = Y; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BDR; (e.currentTarget as HTMLElement).style.color = MUT; }}
          >
            En savoir plus
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.a>
        </div>

        <div className="bm-why-main" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "stretch" }}>
          {/* Left — pillars */}
          <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="bm-pillars-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
          >
            {PILLARS.map(p => (
              <motion.div key={p.title} variants={fadeUp}
                style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: "16px", padding: "28px 24px", transition: "border-color 0.3s, transform 0.3s" }}
                whileHover={{ borderColor: BDRY, y: -4 } as any}
              >
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", background: YL, border: `1px solid ${BDRY}`, borderRadius: "10px", color: Y, marginBottom: "16px" }}>
                  {p.icon}
                </div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem", marginBottom: "8px", lineHeight: 1.35 }}>{p.title}</div>
                <div style={{ color: MUT, fontSize: "0.82rem", lineHeight: 1.65 }}>{p.body}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right — large photo with stats overlay */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bm-why-photo"
            style={{ position: "relative", borderRadius: "16px", overflow: "hidden", minHeight: "420px" }}
          >
            <img src={PHOTOS.expertise} alt="Expert Batimato au travail"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)" }} />

            {/* Stats grid overlay */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px",
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px",
              background: BDR, borderTop: `1px solid ${BDRY}`,
            }}>
              {/* {STATS.map((s, i) => (
                <div key={s.label} style={{ background: "rgba(10,10,10,0.7)", backdropFilter: "blur(12px)", padding: "18px 20px", borderRight: i % 2 === 0 ? `1px solid ${BDR}` : "none" }}>
                  <div style={{ color: Y, fontWeight: 900, fontSize: "1.8rem", lineHeight: 1, letterSpacing: "-0.02em" }}>
                    <Counter to={s.n} suffix={s.sfx} />
                  </div>
                  <div style={{ color: DIM, fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginTop: "4px" }}>{s.label}</div>
                </div>
              ))} */}
            </div>

            {/* ISO badge */}
            <div style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(10,10,10,0.75)", backdropFilter: "blur(12px)", border: `1px solid ${BDRY}`, borderRadius: "10px", padding: "10px 16px", textAlign: "center" }}>
              <div style={{ color: Y, fontWeight: 900, fontSize: "1.1rem" }}>ISO</div>
              <div style={{ color: MUT, fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>9001 Certifié</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. EXPERTISE SPLIT — big photo + copy columns
// ═══════════════════════════════════════════════════════════════════════════
const EXPERTISE_ITEMS = [
  { label: "Diagnostic de chantier", body: "Nos techniciens analysent votre projet sur site ou en showroom et recommandent les solutions adaptées." },
  { label: "Fiches techniques détaillées", body: "PDF complets pour chaque produit — dosages, temps de séchage, compatibilités, normes NF et CE." },
  { label: "Commande & suivi simplifié", body: "Devis en 2h, confirmation immédiate, suivi de livraison en temps réel jusqu'à votre chantier." },
];

function ExpertiseStrip() {
  return (
    <section className="bm-section-pad" style={{ background: INK, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <ArchGrid opacity={0.4} />
      <div className="bm-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
        <div className="bm-expertise-main" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          {/* Left — stacked photos */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: "relative" }}
          >
            {/* Main photo */}
            <div style={{ borderRadius: "16px", overflow: "hidden", aspectRatio: "4/3", position: "relative" }}>
              <img src={PHOTOS.showroom} alt="Showroom Batimato"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,196,0,0.08) 0%, transparent 60%)" }} />
            </div>
            {/* Floating mini-card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bm-expertise-float"
              style={{
                position: "absolute", bottom: "-24px", right: "-24px",
                background: CARD, border: `1px solid ${BDRY}`,
                borderRadius: "14px", padding: "20px 24px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                minWidth: "180px",
              }}
            >
              {/* <div style={{ color: Y, fontWeight: 900, fontSize: "2rem", lineHeight: 1 }}>32</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem", marginTop: "4px" }}>Showrooms</div> */}
              <div style={{ color: MUT, fontSize: "0.75rem", marginTop: "2px" }}>Île-de-France</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80", display: "inline-block", animation: "pulse2 2s infinite" }} />
                <span style={{ color: "#4ADE80", fontSize: "0.7rem", fontWeight: 600 }}>Ouvert maintenant</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — copy */}
          <div>
            <SectionHeader
              eyebrow="Notre expertise"
              title={<>Plus qu'un fournisseur —<br /><span style={{ color: Y }}>un partenaire de chantier</span></>}
              subtitle="De la sélection du bon produit à la livraison sur site, nous accompagnons chaque étape de votre projet."
            />

            <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {EXPERTISE_ITEMS.map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12 }}
                  style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}
                >
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: YL, border: `1px solid ${BDRY}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: Y, fontWeight: 900, fontSize: "0.75rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", marginBottom: "6px" }}>{item.label}</div>
                    <div style={{ color: MUT, fontSize: "0.84rem", lineHeight: 1.65 }}>{item.body}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div className="bm-cta-actions" style={{ marginTop: "40px", display: "flex", gap: "12px" }}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a href="/rdv" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "0 24px", height: "48px", borderRadius: "8px",
                background: Y, color: INK, fontWeight: 800, fontSize: "0.82rem",
                letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = YD)}
                onMouseLeave={e => (e.currentTarget.style.background = Y)}
              >
                Prendre RDV Showroom
              </a>
              <a href="/fiches-techniques" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "0 24px", height: "48px", borderRadius: "8px",
                border: `1px solid ${BDR}`, color: MUT, fontWeight: 600, fontSize: "0.82rem",
                letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = BDRY; (e.currentTarget as HTMLElement).style.color = Y; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BDR; (e.currentTarget as HTMLElement).style.color = MUT; }}
              >
                Fiches techniques
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse2 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }`}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. PROJECTS — masonry photo grid
// ═══════════════════════════════════════════════════════════════════════════
const PROJECTS = [
  { img: PHOTOS.proj1, title: "Rénovation complète T4 — Paris 11e", tag: "Peinture intérieure", size: "tall" },
  { img: PHOTOS.proj2, title: "Façade immeuble haussmannien", tag: "Ravalement façade", size: "normal" },
  { img: PHOTOS.proj3, title: "Showroom commercial 320m²", tag: "Revêtement sol & murs", size: "normal" },
  { img: PHOTOS.proj4, title: "Villa contemporaine Versailles", tag: "Peinture extérieure", size: "wide" },
  { img: PHOTOS.proj5, title: "Bureaux open space La Défense", tag: "Aménagement intérieur", size: "normal" },
];

function ProjectCard({ p, delay = 0 }: { p: typeof PROJECTS[0]; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="bm-project-card"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.75, delay }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: "14px", overflow: "hidden",
        gridColumn: p.size === "wide" ? "span 2" : "span 1",
        gridRow: p.size === "tall" ? "span 2" : "span 1",
        minHeight: p.size === "tall" ? "460px" : "220px",
        cursor: "pointer",
      }}
    >
      <img src={p.img} alt={p.title}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(.25,.46,.45,.94)",
          filter: hovered ? "brightness(0.5)" : "brightness(0.65)",
        }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "22px" }}>
        <span style={{ display: "inline-block", background: YL, border: `1px solid ${BDRY}`, color: Y, fontSize: "0.65rem", padding: "3px 10px", borderRadius: "4px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "8px", textTransform: "uppercase" }}>
          {p.tag}
        </span>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.35 }}>{p.title}</div>
      </div>
      {/* Bottom edge yellow bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: Y, transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.4s ease" }} />
    </motion.div>
  );
}

function Projects() {
  return (
    <section className="bm-section-pad" style={{ background: INKL, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <div className="bm-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
        <div className="bm-section-head-row" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", marginBottom: "48px" }}>
          <SectionHeader
            eyebrow="Réalisations"
            title={<>Des projets qui<br /><span style={{ color: Y }}>parlent d'eux-mêmes</span></>}
            subtitle="Chantiers résidentiels, tertiaires et industriels — avec les mêmes matériaux, partout en France."
          />
          <motion.a href="/realisations"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: Y, textDecoration: "none", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}
            whileHover={{ gap: "14px" } as any}
          >
            Toutes les réalisations
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.a>
        </div>

        {/* Masonry grid */}
        <div className="bm-projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto", gap: "12px" }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} delay={i * 0.08} />)}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. PROCESS TIMELINE
// ═══════════════════════════════════════════════════════════════════════════
const STEPS = [
  {
    n: "01",
    title: "Définissez votre projet",
    body: "En showroom ou en ligne, décrivez-nous votre chantier : surface, contraintes, délais. On s'adapte à vous.",
    icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  },
  {
    n: "02",
    title: "Recevez votre devis",
    body: "Devis technique personnalisé en 2h, avec les références exactes, quantités optimisées et alternatives disponibles.",
    icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
  },
  {
    n: "03",
    title: "Livraison sur chantier en 4h",
    body: "Commande validée avant 12h ? Livraison offerte sur votre chantier en 4h chrono. Sinon, retrait immédiat dans nos 32 showrooms.",
    icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>),
  },
  {
    n: "04",
    title: "Suivi & SAV dédié",
    body: "Besoin d'aide en cours de chantier ? Notre équipe reste joignable du lundi au samedi, 8h–18h, par téléphone ou chat.",
    icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.37 2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  },
];

function ProcessTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bm-section-pad" style={{ background: INK, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", left: "50%", top: "20%", transform: "translateX(-50%)", width: "700px", height: "300px", background: "radial-gradient(ellipse, rgba(255,196,0,0.05) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

      <div className="bm-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <SectionHeader eyebrow="Comment ça marche" title={<>Simple comme<br /><span style={{ color: Y }}>un chantier réussi</span></>} subtitle="Quatre étapes. Un interlocuteur. Zéro prise de tête." centered />
        </div>

        <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="bm-process-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", position: "relative" }}
        >
          {/* Connector */}
          <div aria-hidden className="bm-process-connector" style={{ position: "absolute", top: "40px", left: "12.5%", right: "12.5%", height: "1px", background: `linear-gradient(90deg, ${BDRY}, ${BDRY})`, zIndex: 0 }} />

          {STEPS.map((s, i) => (
            <motion.div key={s.n} variants={fadeUp} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ width: "80px", height: "80px", margin: "0 auto 24px", borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, ${YL} 0%, rgba(255,196,0,0.03) 100%)`, border: `1px solid ${BDRY}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: Y, opacity: 0.45, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em" }}>{s.n}</span>
                <span style={{ color: Y }}>{s.icon}</span>
              </div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem", marginBottom: "10px", lineHeight: 1.35 }}>{s.title}</div>
              <div style={{ color: MUT, fontSize: "0.82rem", lineHeight: 1.65 }}>{s.body}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. TESTIMONIALS — currently disabled (not rendered in HomePage below).
// Left in place so it can be re-enabled later with no rework needed.
// ═══════════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  { quote: "Depuis qu'on travaille avec Batimato, nos délais d'approvisionnement ont été divisés par deux. Le service client répond en moins d'une heure — c'est rare dans le secteur.", name: "Karim Benali", role: "Chef de chantier, Groupe Vinci", initials: "KB" },
  { quote: "La qualité des peintures qu'ils proposent est incomparable. J'ai testé plusieurs fournisseurs, rien de comparable. Et les prix restent compétitifs pour du matériel pro.", name: "Sophie Marchand", role: "Architecte d'intérieur, Paris", initials: "SM" },
  { quote: "Pour ma rénovation complète, l'équipe Batimato m'a guidé produit par produit. Sans eux, j'aurais fait trois fois plus d'erreurs et deux fois plus de dépenses.", name: "Thomas Renard", role: "Particulier, Paris 11e", initials: "TR" },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bm-section-pad" style={{ background: INKL, padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden className="bm-quote-mark" style={{ position: "absolute", top: "40px", left: "50%", transform: "translateX(-50%)", fontSize: "280px", lineHeight: 1, fontWeight: 900, color: "rgba(255,196,0,0.03)", pointerEvents: "none", userSelect: "none", fontFamily: "Georgia, serif" }}>"</div>

      <div ref={ref} className="bm-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}>
          <div style={{ marginBottom: "48px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: Y, fontSize: "0.68rem", letterSpacing: "0.28em", fontWeight: 700, textTransform: "uppercase" }}>
              <span style={{ display: "inline-block", width: "22px", height: "1px", background: Y }} />
              Ce qu'ils disent
              <span style={{ display: "inline-block", width: "22px", height: "1px", background: Y }} />
            </span>
          </div>

          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
            <blockquote style={{ color: "#fff", fontWeight: 400, lineHeight: 1.8, fontSize: "clamp(1.05rem, 2vw, 1.25rem)", marginBottom: "40px", fontStyle: "italic" }}>
              "{TESTIMONIALS[active].quote}"
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: YL, border: `1px solid ${BDRY}`, display: "flex", alignItems: "center", justifyContent: "center", color: Y, fontWeight: 800, fontSize: "0.8rem" }}>
                {TESTIMONIALS[active].initials}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{TESTIMONIALS[active].name}</div>
                <div style={{ color: MUT, fontSize: "0.78rem" }}>{TESTIMONIALS[active].role}</div>
              </div>
            </div>
          </motion.div>

          {/* Stars */}
          <div style={{ display: "flex", justifyContent: "center", gap: "4px", margin: "24px 0 16px" }}>
            {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={Y}><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z"/></svg>)}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Témoignage ${i + 1}`}
                style={{ width: i === active ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i === active ? Y : DIM, border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. BRAND TICKER — real partner logo images, moving marquee
// ═══════════════════════════════════════════════════════════════════════════
// NOTE: these paths point at the same CDN/host that serves the original
// brand-slider images (e.g. https://your-domain.tld/modules/tvcmsbrandlist/views/img/...).
// Replace BRAND_LOGO_BASE with your actual asset host/CDN if these logos
// live elsewhere (or move the files into /public and use root-relative paths).
const BRAND_LOGO_BASE = "/modules/tvcmsbrandlist/views/img";

const BRANDS = [
  { name: "Tollens",      img: `/tollens.png` },
  { name: "Guittet",      img: `/guittet.png` },
  { name: "Opac",         img: `/opac.png` },
  { name: "Farrow & Ball",img: `/Sans titre 4_20260424174608.png` },
  { name: "Mirka",        img: `/mirka_20260424180116.png` },
  { name: "Milwaukee",    img: `/milwaukeee_20260424180411.png` },
  { name: "Sikkens",      img: `/sikkens.png` },
  { name: "Orac Decor",   img: `/orac decor.png` },
  { name: "Staff Decor",  img: `/staff decor.png` },
];

function BrandTicker() {
  return (
    <section style={{ background: "#050505", padding: "60px 0", overflow: "hidden", position: "relative" }}>
      <GlowDivider />
      <div style={{ paddingTop: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span style={{ color: "white", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600 }}>Marques distribuées</span>
        </div>
        <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)" }}>
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            style={{ display: "flex", width: "max-content" }}
          >
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <div key={i} className="bm-brand-item" style={{
                padding: "0 40px",
                borderRight: `1px solid ${BDR}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "90px",
              }}>
                <img
                  src={b.img}
                  alt={b.name}
                  title={b.name}
                  loading="lazy"
                  className="bm-brand-logo"
                  style={{
                    height: "90px",
                    width: "auto",
                    maxWidth: "220px",
                    objectFit: "contain",
                    filter: "grayscale(1) brightness(0) invert(1) opacity(0.55)",
                    transition: "filter 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.filter = "grayscale(0) brightness(1) invert(0) opacity(1)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.filter = "grayscale(1) brightness(0) invert(1) opacity(0.55)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <div style={{ marginTop: "40px" }}><GlowDivider /></div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. CTA BANNER — full-bleed yellow
// ═══════════════════════════════════════════════════════════════════════════
function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} style={{ position: "relative", overflow: "hidden" }}>
      {/* Photo base */}
      <div style={{ position: "relative", minHeight: "420px", display: "flex", alignItems: "center" }}>
        <img src={PHOTOS.prep} alt="Chantier Batimato"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.22)" }} />

        {/* Yellow tint overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(255,196,0,0.18) 0%, transparent 60%)" }} />

        {/* Grid */}
        <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <defs>
            <pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 0 0 60" fill="none" stroke="rgba(255,196,0,0.08)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>

        {/* Yellow left border accent */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: `linear-gradient(180deg, transparent, ${Y} 30%, ${Y} 70%, transparent)` }} />

        <div className="bm-cta-pad" style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 48px", position: "relative", zIndex: 1, width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="bm-cta-row"
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "40px" }}
          >
            <div style={{ maxWidth: "560px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: Y, fontSize: "0.68rem", letterSpacing: "0.28em", fontWeight: 700, textTransform: "uppercase", marginBottom: "20px" }}>
                <span style={{ display: "inline-block", width: "22px", height: "1px", background: Y }} />
                Prêt à démarrer ?
              </span>
              <h2 className="bm-heading" style={{ color: "#fff", fontWeight: 900, lineHeight: 1.15, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", margin: "0 0 16px" }}>
                Votre chantier mérite<br /><span style={{ color: Y }}>les meilleurs matériaux.</span>
              </h2>
              <p style={{ color: MUT, fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
                Demandez un devis personnalisé en 5 minutes. Un expert vous rappelle sous 2 heures, sans engagement. Livraison offerte en 4h sur votre chantier.
              </p>
            </div>

            <div className="bm-cta-actions" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <motion.a href="/devis"
                whileHover={{ scale: 1.04, backgroundColor: YD } as any}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "0 32px", height: "56px", borderRadius: "8px", background: Y, color: INK, fontWeight: 800, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.2s" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Demander un devis gratuit
              </motion.a>
              <a href="/showrooms"
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "7px", color: MUT, textDecoration: "none", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = Y)}
                onMouseLeave={e => (e.currentTarget.style.color = MUT)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Trouver un showroom
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. FOOTER — dark card w/ 4 columns, yellow bottom bar (brand theme)
// ═══════════════════════════════════════════════════════════════════════════
const FOOTER_COLUMNS = [
  {
    heading: "Catalogue",
    links: [
      { label: "Peintures & Revêtements", href: "/peintures" },
      { label: "Outillage électroportatif", href: "/outillage" },
      { label: "Préparation & Supports", href: "/preparation-materiaux" },
    ],
  },
  {
    heading: "Entreprise",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Showrooms", href: "/showrooms" },
      { label: "Carrières", href: "/carrieres" },
    ],
  },
  {
    heading: "Assistance",
    links: [
      { label: "Demander un devis", href: "/devis" },
      { label: "Fiches techniques", href: "/fiches-techniques" },
      { label: "Centre d'aide", href: "/aide" },
    ],
  },
];

const FOOTER_CONTACT = {
  heading: "Contact",
  email: "contact@batimato.fr",
  phone: "01 23 45 67 89",
};

function FooterColumn({ heading, links, delay = 0 }: { heading: string; links: { label: string; href: string }[]; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay }}
    >
      <div style={{ color: MUT, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "24px" }}>
        {heading}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
        {links.map(l => (
          <li key={l.label}>
            <a href={l.href} className="bm-footer-col-link"
              style={{ color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.01em", lineHeight: 1.2, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = Y)}
              onMouseLeave={e => (e.currentTarget.style.color = "#fff")}
            >{l.label}</a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bm-footer" style={{
      background: INK,
      borderRadius: "28px",
      overflow: "hidden",
      maxWidth: "1360px",
      margin: "40px auto",
      border: `1px solid ${BDR}`,
      position: "relative",
    }}>
      <ArchGrid opacity={0.35} />

      {/* Top — link columns */}
      <div className="bm-footer-grid" style={{
        position: "relative", zIndex: 1,
        padding: "80px 56px 64px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "40px",
      }}>
        {FOOTER_COLUMNS.map((col, i) => (
          <FooterColumn key={col.heading} heading={col.heading} links={col.links} delay={i * 0.08} />
        ))}

        {/* Contact column — same visual weight as the others */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: 0.24 }}
        >
          <div style={{ color: MUT, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "24px" }}>
            {FOOTER_CONTACT.heading}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <a href={`mailto:${FOOTER_CONTACT.email}`} className="bm-footer-col-link"
              style={{ color: Y, textDecoration: "none", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.01em", lineHeight: 1.25, wordBreak: "break-word", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {FOOTER_CONTACT.email}
            </a>
            <a href="tel:+33123456789" className="bm-footer-col-link"
              style={{ color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "-0.01em", lineHeight: 1.2, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = Y)}
              onMouseLeave={e => (e.currentTarget.style.color = "#fff")}
            >
              {FOOTER_CONTACT.phone}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom — yellow theme bar */}
      <div className="bm-footer-bottom" style={{
        position: "relative", zIndex: 1,
        background: "white",
        padding: "28px 56px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}>
        {/* Logo — swap the src below for your logo asset */}
        <a href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <img
            src="/logo.JPG"
            alt="Batimato"
            className="bm-footer-logo"
            style={{ height: "114px", width: "auto", objectFit: "contain", display: "block" }}
          />
        </a>

        {/* Copyright */}
        <span style={{ color: "rgba(10,10,10,0.75)", fontSize: "0.85rem", fontWeight: 600 }}>
          © {new Date().getFullYear()} Batimato SAS — Tous droits réservés
        </span>

        {/* Social icons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
          {/* Instagram */}
          <a href="#" aria-label="Instagram" style={{ color: INK, display: "flex", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
          </a>
          {/* TikTok */}
          <a href="#" aria-label="TikTok" style={{ color: INK, display: "flex", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 1h-3.3v14.6c0 1.6-1.3 2.9-2.9 2.9a2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6 0 .9.1V9.4a6.2 6.2 0 0 0-.9-.1A6.2 6.2 0 0 0 4.1 15.6a6.2 6.2 0 0 0 6.2 6.2 6.2 6.2 0 0 0 6.2-6.2V8.1a8.4 8.4 0 0 0 4.9 1.6V6.4a5 5 0 0 1-4.9-5.4z"/></svg>
          </a>
          {/* YouTube */}
          <a href="#" aria-label="YouTube" style={{ color: INK, display: "flex", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <main style={{ background: INK }}>
      <ResponsiveStyles />
      <CategoryShowcase />
      <BrandTicker />
      <WhyBatimato />
      <ExpertiseStrip />
      {/* <Projects /> */}
      <ProcessTimeline />
      {/* <Testimonials /> */}
      <CTABanner />
      <Footer />
    </main>
  );
}