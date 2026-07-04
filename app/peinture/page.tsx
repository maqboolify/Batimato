"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { UseInViewOptions } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
// Mirrors BATIMATO's existing visual language (gold #FFC400 on near-black),
// but with the category-tabs + sub-grid structure from the reference layout.

const PRODUCT_UNIVERSE = [
  {
    key: "interieures",
    label: "Peintures Intérieures",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21V9l9-6 9 6v12" />
        <path d="M9 21v-7h6v7" />
      </svg>
    ),
    items: [
      { label: "Impression / Sous-couche", img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=85" },
      { label: "Finition mate", img: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&q=85" },
      { label: "Finition satinée", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=85" },
      { label: "Finition veloutée", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=85" },
    ],
  },
  {
    key: "exterieures",
    label: "Peintures Extérieures",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="9" width="18" height="12" rx="1" />
        <path d="M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
      </svg>
    ),
    items: [
      { label: "Primaire façade", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=85" },
      { label: "Revêtement bas-carbone", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=85" },
      { label: "Finition tous-temps", img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=600&q=85" },
      { label: "Anti-mousse & traitement", img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=85" },
    ],
  },
  {
    key: "bois",
    label: "Bois",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19h16M5 19V8l4-4h6l4 4v11" />
        <path d="M9 19v-6h6v6" />
      </svg>
    ),
    items: [
      { label: "Primaire microporeux", img: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=85" },
      { label: "Lasure protectrice", img: "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=600&q=85" },
      { label: "Vernis intérieur", img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=85" },
      { label: "Saturateur terrasse", img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=600&q=85" },
    ],
  },
  {
    key: "laques",
    label: "Laques",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v6" />
        <path d="M8 9h8l1 4a5 5 0 0 1-10 0z" />
        <path d="M9 21h6" />
      </svg>
    ),
    items: [
      { label: "Laque mate", img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=85" },
      { label: "Laque satinée", img: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&q=85" },
      { label: "Laque brillante", img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=85" },
      { label: "Sous-couche laque", img: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=85" },
    ],
  },
  {
    key: "sol",
    label: "Sol",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 18h18" />
        <path d="M5 18V8l7-5 7 5v10" />
      </svg>
    ),
    items: [
      { label: "Résine époxy", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=85" },
      { label: "Peinture garage", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=85" },
      { label: "Primaire sol", img: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&q=85" },
      { label: "Vernis de finition", img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=85" },
    ],
  },
  {
    key: "decoration",
    label: "Décoration",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    items: [
      { label: "Enduit décoratif", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=85" },
      { label: "Effet béton ciré", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=85" },
      { label: "Stuc & tadelakt", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=85" },
      { label: "Patine & glacis", img: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&q=85" },
    ],
  },
  {
    key: "brosses",
    label: "Gamme brosses et rouleaux",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 11l6-6 4 4-6 6" />
        <path d="M5 21l4-4-4-4-2 6z" />
        <path d="M9 11l4 4" />
      </svg>
    ),
    items: [
      { label: "Rouleaux laqueurs", img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=85" },
      { label: "Pinceaux plats", img: "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=600&q=85" },
      { label: "Brosses façade", img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=600&q=85" },
      { label: "Accessoires & bacs", img: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&q=85" },
    ],
  },
  {
    key: "ite",
    label: "Isolation Thermique par l'Extérieur",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 21V10l8-7 8 7v11" />
        <path d="M9 21v-5h6v5" />
        <path d="M4 14h16" />
      </svg>
    ),
    items: [
      { label: "Panneaux isolants", img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=85" },
      { label: "Enduit de sous-couche", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=85" },
      { label: "Treillis d'armature", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=85" },
      { label: "Finition talochée", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=85" },
    ],
  },
  {
    key: "apercu",
    label: "Aperçu",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="7" height="7" rx="1" />
        <rect x="14" y="4" width="7" height="7" rx="1" />
        <rect x="3" y="15" width="7" height="7" rx="1" />
        <rect x="14" y="15" width="7" height="7" rx="1" />
      </svg>
    ),
    items: [
      { label: "Nouveautés", img: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&q=85" },
      { label: "Meilleures ventes", img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=85" },
      { label: "Gammes Éco", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=85" },
      { label: "Sélection Pro", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=85" },
    ],
  },
  {
    key: "az",
    label: "Produits A - Z",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 17V7l3 10V7" />
        <path d="M4 12h3" />
        <path d="M13 7h6l-6 10h6" />
      </svg>
    ),
    items: [
      { label: "Index alphabétique", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=85" },
      { label: "Fiches techniques", img: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&q=85" },
      { label: "Fiches sécurité", img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=85" },
      { label: "Catalogue PDF", img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=85" },
    ],
  },
];

// ─── Utilities (consistent with the rest of BATIMATO) ─────────────────────────

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function useInViewAnim(threshold: UseInViewOptions["margin"] = "-80px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: threshold });
  return [ref, inView] as const;
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{ background: color + "18", color, border: `1px solid ${color}40` }}
      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full"
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px bg-[#FFC400]" />
      <span className="text-[#FFC400] text-[10px] font-bold uppercase tracking-[0.25em]">{children}</span>
    </div>
  );
}

// ─── Universe Hero ──────────────────────────────────────────────────────────────

function UniverseHero({ activeLabel }: { activeLabel: string }) {
  return (
    <section className="relative w-full min-h-[480px] bg-[#0A0A0A] overflow-hidden flex flex-col">
      {/* BACKGROUND VIDEO — replace src with your own asset */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.4) saturate(0.7)" }}
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1600&q=80"
        >
          {/* TODO: swap in your background video source */}
          <source src="/videos/produits-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-[#0A0A0A]/55" />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -bottom-32 -left-32 w-[640px] h-[640px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(255,196,0,0.12) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <Badge color="#FFC400">BATIMATO — Matériaux de construction</Badge>
          <h1
            className="mt-6 font-black text-white leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
          >
            <span className="block">L'Univers</span>
            <span className="block text-[#FFC400]">Produits</span>
          </h1>
        </motion.div>
      </div>

      {/* Active category strip */}
      <div className="relative z-10 border-t border-white/[0.08] bg-[#0A0A0A]/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 h-16 flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeLabel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-white font-bold text-lg"
            >
              {activeLabel}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── Category Tabs ──────────────────────────────────────────────────────────────

function CategoryTabs({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <section className="bg-[#0F0F0F] border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex items-stretch min-w-max divide-x divide-white/[0.06]">
            {PRODUCT_UNIVERSE.map((cat) => {
              const isActive = cat.key === active;
              return (
                <button
                  key={cat.key}
                  onClick={() => onSelect(cat.key)}
                  className="group relative flex flex-col items-center justify-center gap-2.5 py-7 px-5 transition-colors duration-200"
                >
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isActive ? "#FFC400" : "rgba(255,255,255,0.04)",
                      color: isActive ? "#0A0A0A" : "rgba(255,255,255,0.45)",
                      border: isActive ? "1px solid #FFC400" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {cat.icon}
                  </span>
                  <span
                    className="text-[11px] font-semibold text-center leading-tight max-w-[110px] transition-colors duration-200"
                    style={{ color: isActive ? "#FFC400" : "rgba(255,255,255,0.45)" }}
                  >
                    {cat.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full"
                      style={{ background: "#FFC400" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Sub-Grid ────────────────────────────────────────────────────────────────────

function SubGrid({ category }: { category: (typeof PRODUCT_UNIVERSE)[number] }) {
  const [ref, inView] = useInViewAnim();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-24 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"} className="mb-12">
          <SectionLabel>Découvrez la gamme</SectionLabel>
          <h2
            className="text-white font-black tracking-tight leading-[0.9]"
            style={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)" }}
          >
            {category.label}
          </h2>
          <p className="mt-4 text-white/40 text-sm max-w-xl">
            Sélectionnez une finition pour consulter les fiches techniques et passer commande.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category.key}
            variants={stagger}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {category.items.map((item, i) => (
              <motion.a
                key={i}
                href="#"
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl overflow-hidden border border-white/[0.06] block"
                style={{ background: "rgba(255,255,255,0.025)" }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.55) saturate(0.55) sepia(0.12)" }}
                    animate={{ scale: hovered === i ? 1.08 : 1 }}
                    transition={{ duration: 0.5, ease }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/10 to-transparent" />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border"
                    animate={{ borderColor: hovered === i ? "rgba(255,196,0,0.5)" : "rgba(255,255,255,0)" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-white font-bold text-sm leading-tight">{item.label}</div>
                  <motion.span
                    className="mt-2 inline-flex items-center gap-1.5 text-[#FFC400] text-xs font-semibold"
                    animate={{ gap: hovered === i ? "10px" : "6px" }}
                  >
                    Voir la fiche
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProduitsPage() {
  const [activeKey, setActiveKey] = useState(PRODUCT_UNIVERSE[0].key);
  const activeCategory = PRODUCT_UNIVERSE.find((c) => c.key === activeKey)!;

  return (
    <main className="bg-[#0A0A0A] overflow-x-hidden">
      <UniverseHero activeLabel={activeCategory.label} />
      <CategoryTabs active={activeKey} onSelect={setActiveKey} />
      <SubGrid category={activeCategory} />
    </main>
  );
}