"use client";

import rawData from "@/data/products.json";
import Navbar from "@/components/navbar/page";
import { useRef, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";

const BG = "#0D0D0D";
const BG2 = "#1A1A1A";
const BG3 = "#242424";
const BORDER = "#2E2E2E";
const YELLOW = "#F5C300";
const YELLOW_DARK = "#D4A900";
const TEXT_PRIMARY = "#FFFFFF";
const TEXT_SECONDARY = "#A0A0A0";
const TEXT_MUTED = "#666666";
const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.04, ease } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };

function useInViewAnim(threshold = "-60px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: threshold });
  return [ref, inView];
}

function parsePriceString(priceStr) {
  if (!priceStr) return null;
  const cleaned = String(priceStr).replace(/\s/g, "").replace("€", "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inferType(item) {
  const text = ((item.title || "") + " " + (item.description || "")).toLowerCase();
  if (text.includes("impression") || text.includes("primaire") || text.includes("prim") || text.includes("fixateur") || text.includes("fondur") || text.includes("sous-couche")) return "impression";
  if (text.includes("enduit") || text.includes("ragréage") || text.includes("mortier") || text.includes("crepi") || text.includes("crépi") || text.includes("revetement") || text.includes("revêtement")) return "enduit";
  if (text.includes("facade") || text.includes("façade") || text.includes("ite") || text.includes("thermique") || text.includes("imperméabilité")) return "ite";
  return "finition";
}

function inferAspect(item) {
  const text = ((item.title || "") + " " + (item.description || "")).toLowerCase();
  if (text.includes("brillant")) return "brillant";
  if (text.includes("mat-velours") || text.includes("mat velours") || text.includes("mate-veloutée") || text.includes("mat velouté")) return "mat-velours";
  if (text.includes("velours") || text.includes("velouté")) return "velours";
  if (text.includes("satin")) return "satin";
  if (text.includes("mat")) return "mat";
  return "autre";
}

function inferBase(item) {
  const text = ((item.title || "") + " " + (item.description || "")).toLowerCase();
  if (text.includes("solvant") || text.includes("glycérophtalique") || text.includes("alkyde") || text.includes("alkydes") || text.includes("pliolite") || text.includes("solvanté")) return "phase-solvant";
  return "phase-aqueuse";
}

function inferBrand(item, brandIdSet) {
  // If the item already carries a brand field, prefer matching it to a known brand id
  if (item.brand) {
    const guess = slugify(item.brand);
    if (brandIdSet && brandIdSet.has(guess)) return guess;
    return guess;
  }
  const t = (item.title || "").toLowerCase();
  if (t.startsWith("dul") || t.startsWith("duli")) return "guittet";
  if (t.startsWith("gui") || t.startsWith("guit")) return "guittet";
  if (t.startsWith("pan") || t.startsWith("panti")) return "seigneurie";
  if (t.startsWith("ody") || t.startsWith("calista")) return "chromatic";
  if (t.startsWith("frei") || t.startsWith("freit")) return "gauthier";
  if (t.startsWith("sat") || t.startsWith("satin")) return "absolu";
  if (t.startsWith("colour") || t.startsWith("color") || t.startsWith("ab colorant")) return "chromatic";
  return "guittet";
}

function inferApplications(item) {
  const text = ((item.title || "") + " " + (item.description || "")).toLowerCase();
  const apps = [];
  if (text.includes("rouleau")) apps.push("rouleau");
  if (text.includes("brosse")) apps.push("brosse");
  if (text.includes("pistolet")) apps.push("pistolet");
  if (text.includes("taloche")) apps.push("taloche");
  if (text.includes("spalter")) apps.push("spalter");
  if (text.includes("lisseuse") || text.includes("lisseus")) apps.push("lisseuse");
  if (text.includes("couteau")) apps.push("couteau");
  if (apps.length === 0) apps.push("rouleau", "brosse");
  return apps;
}

function inferDestinations(item) {
  const text = ((item.title || "") + " " + (item.description || "")).toLowerCase();
  const dests = [];
  if (text.includes("chambre")) dests.push("chambre", "chambre-coucher", "chambre-enfants");
  if (text.includes("cuisine")) dests.push("cuisine");
  if (text.includes("bureau")) dests.push("bureau");
  if (text.includes("couloir") || text.includes("entrée") || text.includes("entree")) dests.push("entree");
  if (dests.length === 0) dests.push("piece-a-vivre");
  if (!dests.includes("piece-a-vivre") && (text.includes("murs") || text.includes("plafond") || text.includes("décoration") || text.includes("decoration"))) dests.push("piece-a-vivre");
  return [...new Set(dests)];
}

function inferLabels(item) {
  const text = ((item.title || "") + " " + (item.description || "")).toLowerCase();
  const labels = [];
  if (text.includes("nf ") || text.includes(" nf") || text.includes("nf\n")) labels.push("nf");
  if (text.includes("ecolabel") || text.includes("écolabel")) labels.push("ecolabel");
  if (text.includes("m1")) labels.push("m1");
  if (text.includes("ce ") || text.includes("certifié")) labels.push("ce");
  if (text.includes("nf environnement")) labels.push("nf-environnement");
  return labels;
}

function inferPictos(item) {
  const text = ((item.title || "") + " " + (item.description || "")).toLowerCase();
  const pictos = [];
  const isExterior = text.includes("facade") || text.includes("façade") || text.includes("extérieur") || text.includes("exterieur") || text.includes("ite") || text.includes("toiture");
  const isInterior = text.includes("intérieur") || text.includes("interieur") || text.includes("murs") || text.includes("plafond");
  if (isExterior && isInterior) pictos.push("INT_EXT");
  else if (isExterior) pictos.push("EXT");
  else pictos.push("INT");
  if (inferBase(item) === "phase-aqueuse") pictos.push("EAU");
  inferApplications(item).forEach((a) => pictos.push(a));
  return pictos;
}

/* -------------------------------------------------------------------------
   Normalize the raw JSON. The file's actual top-level shape is:
   {
     category: { slug, parentLabel, parentHref, name, tagline, description, stats },
     brands: [{ name, count }, ...],
     products: [...]   <-- may or may not be present; guarded below
   }
   Rather than assuming a bare array (which caused the original crash),
   we defensively look for the array wherever it actually lives.
------------------------------------------------------------------------- */
function extractProductsArray(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const candidateKeys = ["products", "items", "results", "data", "list"];
  for (const key of candidateKeys) {
    if (Array.isArray(data[key])) return data[key];
  }
  // Last resort: find the first array value anywhere on the object
  for (const value of Object.values(data)) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

const rawProductsData = extractProductsArray(rawData);
const CATEGORY_META = (rawData && typeof rawData === "object" && rawData.category) || null;
const RAW_BRANDS = (rawData && typeof rawData === "object" && Array.isArray(rawData.brands)) ? rawData.brands : [];

// Build BRANDS from the JSON's brand list (falls back to hardcoded list if empty)
const DEFAULT_BRANDS = [
  { id: "absolu", label: "Absolu" },
  { id: "chromatic", label: "Chromatic" },
  { id: "gauthier", label: "Gauthier" },
  { id: "guittet", label: "Guittet" },
  { id: "ppg-light-pc", label: "PPG Light PC" },
  { id: "seigneurie", label: "Seigneurie" },
];

const BRANDS = RAW_BRANDS.length
  ? RAW_BRANDS.map((b) => ({ id: slugify(b.name), label: b.name, count: b.count }))
  : DEFAULT_BRANDS;

const BRAND_ID_SET = new Set(BRANDS.map((b) => b.id));

const PRODUCTS = rawProductsData.map((item, index) => {
  const priceNum = parsePriceString(item.price);
  const id = slugify(item.title || item.name || `product-${index}`);
  return {
    id,
    name: item.title || item.name || "Produit sans nom",
    shortDesc: item.description || "",
    img: item.image || item.img || "",
    price: priceNum,
    pricePerLitre: priceNum ? parseFloat((priceNum / 3).toFixed(2)) : null,
    fullDesc: item.description || "",
    highlights: [],
    technicalProps: [],
    brand: inferBrand(item, BRAND_ID_SET),
    type: inferType(item),
    aspect: inferAspect(item),
    base: inferBase(item),
    applications: inferApplications(item),
    destinations: inferDestinations(item),
    labels: inferLabels(item),
    pictos: inferPictos(item),
    badge: null,
    sales: 500 - index * 10,
    erpCode: `ERP-${String(index + 1).padStart(5, "0")}`,
    conditioning: ["3L", "15L"],
    colors: ["BLANC"],
  };
});

const PRODUCTS_PER_PAGE = 9;

// Prefer real category metadata from the JSON when available
const CATEGORIES = [
  {
    id: CATEGORY_META?.slug || "peintures",
    label: CATEGORY_META?.name || "Peintures",
    count: CATEGORY_META?.stats?.products ?? PRODUCTS.length,
  },
];

const PAGE_TITLE = CATEGORY_META?.name || "PEINTURES";
const PAGE_TAGLINE = CATEGORY_META?.tagline || null;

const PRODUCT_TYPES = [
  { id: "enduit", label: "Enduit" },
  { id: "finition", label: "Finition" },
  { id: "ite", label: "ITE" },
  { id: "impression", label: "Impression" },
];
const APPLICATIONS = [
  { id: "brosse", label: "Brosse" },
  { id: "couteau", label: "Couteau de vitrier" },
  { id: "lisseuse", label: "Lisseuse inox" },
  { id: "pistolet", label: "Pistolet" },
  { id: "rouleau", label: "Rouleau" },
  { id: "spalter", label: "Spalter" },
  { id: "taloche", label: "Taloche" },
];
const DESTINATIONS = [
  { id: "bureau", label: "Bureau" },
  { id: "chambre", label: "Chambre" },
  { id: "chambre-enfants", label: "Chambre d'enfants" },
  { id: "chambre-coucher", label: "Chambre à coucher" },
  { id: "cuisine", label: "Cuisine" },
  { id: "entree", label: "Entrée, couloir" },
  { id: "piece-a-vivre", label: "Pièce à vivre" },
];
const LABELS = [
  { id: "ce", label: "CE" },
  { id: "ecolabel", label: "Ecolabel" },
  { id: "excell-plus", label: "Excell +" },
  { id: "excell-zone-verte", label: "Excell Zone verte" },
  { id: "m1", label: "M1 - Emission classification" },
  { id: "nf", label: "NF" },
  { id: "nf-environnement", label: "NF Environnement" },
];
const ASPECTS = [
  { id: "autre", label: "Autre" },
  { id: "brillant", label: "Brillant" },
  { id: "mat", label: "Mat" },
  { id: "mat-velours", label: "Mat Velours" },
  { id: "mat-profond", label: "Mat profond" },
  { id: "mat-satine", label: "Mat à satiné" },
  { id: "satin", label: "Satin" },
  { id: "velours", label: "Velours" },
];
const BASES = [
  { id: "phase-aqueuse", label: "Phase aqueuse" },
  { id: "phase-solvant", label: "Phase solvant" },
];

function Picto({ kind, size = "sm" }) {
  const base = "flex items-center justify-center font-bold rounded";
  const sz = size === "lg" ? "w-10 h-10 text-[11px]" : "w-7 h-7 text-[9px]";
  switch (kind) {
    case "INT":
      return <div className={`${base} ${sz}`} style={{ background: YELLOW, color: "#000" }}>INT</div>;
    case "EXT":
      return <div className={`${base} ${sz}`} style={{ background: YELLOW, color: "#000" }}>EXT</div>;
    case "INT_EXT":
      return (
        <div className={`${sz} rounded overflow-hidden grid grid-rows-2 font-bold`} style={{ background: YELLOW, color: "#000", fontSize: size === "lg" ? 9 : 7 }}>
          <div className="flex items-center justify-center border-b border-black/20">INT</div>
          <div className="flex items-center justify-center">EXT</div>
        </div>
      );
    case "EAU":
      return (
        <div className={`${base} ${sz}`} style={{ background: BG3, color: YELLOW, border: `1px solid ${BORDER}` }}>
          <svg width={size === "lg" ? 18 : 13} height={size === "lg" ? 18 : 13} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5s6.5 7.2 6.5 12A6.5 6.5 0 015.5 14.5C5.5 9.7 12 2.5 12 2.5z" /></svg>
        </div>
      );
    case "NOT_OK":
      return (
        <div className={`${base} ${sz}`} style={{ background: "#7f1d1d", color: "#fca5a5" }}>
          <svg width={size === "lg" ? 18 : 14} height={size === "lg" ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </div>
      );
    case "brosse":
      return <div className={`${base} ${sz}`} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}><svg width={size === "lg" ? 18 : 14} height={size === "lg" ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21V11a3 3 0 013-3 3 3 0 013 3v10M6 8h12l-1-5H7L6 8z" /></svg></div>;
    case "rouleau":
      return <div className={`${base} ${sz}`} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}><svg width={size === "lg" ? 18 : 14} height={size === "lg" ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="14" height="6" rx="1" /><path d="M10 10v10" /></svg></div>;
    case "pistolet":
      return <div className={`${base} ${sz}`} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}><svg width={size === "lg" ? 18 : 14} height={size === "lg" ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 13h7l7-4v8l-7-4M4 13v6h3v-6" /></svg></div>;
    case "taloche":
      return <div className={`${base} ${sz}`} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}><svg width={size === "lg" ? 18 : 14} height={size === "lg" ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="14" height="9" rx="1" /><path d="M14 16l6 6" /></svg></div>;
    case "spalter":
      return <div className={`${base} ${sz}`} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}><svg width={size === "lg" ? 18 : 14} height={size === "lg" ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="18" height="8" rx="1" /><path d="M11 11v10" /></svg></div>;
    case "lisseuse":
      return <div className={`${base} ${sz}`} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT_SECONDARY }}><svg width={size === "lg" ? 18 : 14} height={size === "lg" ? 18 : 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="6" width="20" height="4" rx="1" /><path d="M12 10v9" /></svg></div>;
    default:
      return null;
  }
}

function PictoRow({ pictos, size }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {pictos.map((p, i) => <Picto key={i} kind={p} size={size} />)}
    </div>
  );
}

const BRAND_LABELS = BRANDS.reduce((acc, b) => {
  acc[b.id] = b.label;
  return acc;
}, {});

const SORT_OPTIONS = [
  { id: "best-sellers", label: "Les plus vendus" },
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "name-asc", label: "A à Z" },
  { id: "name-desc", label: "Z à A" },
];

const BADGE_COLORS = {
  Nouveau: { bg: "#059669", color: "#fff" },
  PROMO: { bg: "#E11D48", color: "#fff" },
  Best: { bg: YELLOW, color: "#000" },
  Certifié: { bg: "#7C3AED", color: "#fff" },
};

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
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.2);
    y.set((e.clientY - r.top - r.height / 2) * 0.2);
  };
  const handleLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={handleLeave} className="inline-block">
      <button type={type} onClick={onClick} className={className} style={style}>{children}</button>
    </motion.div>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b py-5" style={{ borderColor: BORDER }}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-between w-full text-left">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: TEXT_SECONDARY }}>{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ color: TEXT_MUTED }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease }} className="overflow-hidden">
            <div className="pt-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({ label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="flex items-center gap-2.5">
        <span onClick={(e) => { e.preventDefault(); onChange(); }} className="w-[17px] h-[17px] rounded-md flex-shrink-0 flex items-center justify-center border transition-colors duration-150" style={{ background: checked ? YELLOW : "transparent", borderColor: checked ? YELLOW : BORDER }}>
          {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5"><path d="M5 12l5 5L20 7" /></svg>}
        </span>
        <span className="text-sm transition-colors duration-150" style={{ color: checked ? TEXT_PRIMARY : TEXT_SECONDARY }}>{label}</span>
      </span>
      {count != null && <span className="text-xs" style={{ color: TEXT_MUTED }}>{count}</span>}
    </label>
  );
}

function FilterSidebar({ filters, toggleFilter, clearAll, counts, activeCount }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: BORDER, background: BG2 }}>
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: BORDER }}>
        <h2 className="font-bold text-sm" style={{ color: TEXT_PRIMARY }}>Filtrer les résultats</h2>
        {activeCount > 0 && <button onClick={clearAll} className="text-xs font-semibold" style={{ color: YELLOW }}> Effacer ({activeCount})</button>}
      </div>
      <FilterSection title="Catégorie">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="flex items-center gap-2 text-sm" style={{ color: TEXT_PRIMARY }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
            <span className="font-semibold">{c.label}</span>
            <span className="ml-auto text-xs" style={{ color: TEXT_MUTED }}>{c.count}</span>
          </div>
        ))}
      </FilterSection>
      <FilterSection title="Type de produit">
        {PRODUCT_TYPES.map((t) => <CheckRow key={t.id} label={t.label} count={counts.type[t.id] ?? 0} checked={filters.type.includes(t.id)} onChange={() => toggleFilter("type", t.id)} />)}
      </FilterSection>
      <FilterSection title="Marque">
        {BRANDS.map((b) => <CheckRow key={b.id} label={b.label} count={counts.brand[b.id] ?? 0} checked={filters.brand.includes(b.id)} onChange={() => toggleFilter("brand", b.id)} />)}
      </FilterSection>
      <FilterSection title="Application/Mode de pose" defaultOpen={false}>
        {APPLICATIONS.map((a) => <CheckRow key={a.id} label={a.label} count={counts.applications[a.id] ?? 0} checked={filters.applications.includes(a.id)} onChange={() => toggleFilter("applications", a.id)} />)}
      </FilterSection>
      <FilterSection title="Destinations" defaultOpen={false}>
        {DESTINATIONS.map((d) => <CheckRow key={d.id} label={d.label} count={counts.destinations[d.id] ?? 0} checked={filters.destinations.includes(d.id)} onChange={() => toggleFilter("destinations", d.id)} />)}
      </FilterSection>
      <FilterSection title="Labels">
        {LABELS.map((l) => <CheckRow key={l.id} label={l.label} count={counts.labels[l.id] ?? 0} checked={filters.labels.includes(l.id)} onChange={() => toggleFilter("labels", l.id)} />)}
      </FilterSection>
      <FilterSection title="Aspect">
        {ASPECTS.map((a) => <CheckRow key={a.id} label={a.label} count={counts.aspect[a.id] ?? 0} checked={filters.aspect.includes(a.id)} onChange={() => toggleFilter("aspect", a.id)} />)}
      </FilterSection>
      <FilterSection title="Base">
        {BASES.map((b) => <CheckRow key={b.id} label={b.label} count={counts.base[b.id] ?? 0} checked={filters.base.includes(b.id)} onChange={() => toggleFilter("base", b.id)} />)}
      </FilterSection>
    </div>
  );
}

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.id === value);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium min-w-[190px]" style={{ borderColor: BORDER, color: TEXT_PRIMARY, background: BG2 }}>
        {current.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: TEXT_MUTED }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="absolute right-0 mt-2 w-full rounded-xl border shadow-xl z-20 overflow-hidden" style={{ borderColor: BORDER, background: BG2 }}>
              {SORT_OPTIONS.map((o) => (
                <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); }} className="w-full text-left px-4 py-3 text-sm transition-colors" style={{ color: o.id === value ? YELLOW : TEXT_SECONDARY, background: o.id === value ? BG3 : "transparent", fontWeight: o.id === value ? 700 : 500 }}>
                  {o.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed" style={{ borderColor: BORDER, color: TEXT_PRIMARY, background: BG2 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center text-sm" style={{ color: TEXT_MUTED }}>…</span>
        ) : (
          <button key={page} onClick={() => onPageChange(page)} className="w-10 h-10 rounded-xl border text-sm font-semibold transition-all" style={{ borderColor: currentPage === page ? YELLOW : BORDER, background: currentPage === page ? YELLOW : BG2, color: currentPage === page ? "#000" : TEXT_PRIMARY }}>
            {page}
          </button>
        )
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed" style={{ borderColor: BORDER, color: TEXT_PRIMARY, background: BG2 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  );
}

function ProductCard({ p, i, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE_COLORS[p.badge];
  return (
    <motion.div
      variants={fadeUp} custom={i} layout
      className="group relative rounded-2xl overflow-hidden border flex flex-col"
      style={{ borderColor: BORDER, background: BG2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4, borderColor: YELLOW, boxShadow: `0 20px 40px -16px rgba(0,0,0,0.5)` }}
      transition={{ duration: 0.3 }}
    >
      {p.badge && badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: badge.bg, color: badge.color }}>{p.badge}</span>
        </div>
      )}
      <button onClick={() => onNavigate(p.id)} className="relative aspect-square overflow-hidden flex items-center justify-center p-6 text-left" style={{ background: BG3 }}>
        <motion.img
          src={p.img} alt={p.name}
          className="w-full h-full object-contain"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease }}
          onError={(e) => { e.target.style.opacity = "0.15"; }}
        />
      </button>
      <div className="p-5 flex flex-col flex-1">
        <button onClick={() => onNavigate(p.id)} className="font-bold text-base leading-tight hover:text-yellow-400 text-left transition-colors" style={{ color: TEXT_PRIMARY }}>{p.name}</button>
        <p className="text-xs leading-relaxed mt-2.5" style={{ color: TEXT_SECONDARY }}>{p.shortDesc}</p>
        <div className="mt-4"><PictoRow pictos={p.pictos} /></div>
        <div className="mt-5 pt-4 border-t flex items-center justify-between gap-3" style={{ borderColor: BORDER }}>
          <div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: TEXT_MUTED }}>À partir de</div>
            <div className="font-black text-lg" style={{ color: TEXT_PRIMARY }}>
              {typeof p.price === "number" ? `${p.price.toFixed(2).replace(".", ",")} €` : "Sur devis"}
            </div>
          </div>
          <MagneticBtn onClick={() => onNavigate(p.id)} className="px-5 py-3 rounded-xl font-bold text-sm flex-shrink-0 transition-opacity hover:opacity-90" style={{ background: YELLOW, color: "#000" }}>
            Commander
          </MagneticBtn>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <button className="flex items-center gap-1.5 transition-colors hover:text-white" style={{ color: TEXT_MUTED }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h6M21 12h-6M12 3v6M12 21v-6" /><circle cx="12" cy="12" r="9" /></svg>
            Comparer
          </button>
          <button className="flex items-center gap-1.5 transition-colors hover:text-white" style={{ color: TEXT_MUTED }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
            Ajouter à mes listes
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const EMPTY_FILTERS = { type: [], brand: [], applications: [], destinations: [], labels: [], aspect: [], base: [] };

function ProductsPage({ onNavigate }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("best-sellers");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [ref, inView] = useInViewAnim();

  const toggleFilter = (group, id) => {
    setFilters((f) => {
      const has = f[group].includes(id);
      return { ...f, [group]: has ? f[group].filter((x) => x !== id) : [...f[group], id] };
    });
    setCurrentPage(1);
  };
  const clearAll = () => { setFilters(EMPTY_FILTERS); setCurrentPage(1); };
  const activeCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  const filtered = useMemo(() => PRODUCTS.filter((p) => {
    if (filters.type.length && !filters.type.includes(p.type)) return false;
    if (filters.brand.length && !filters.brand.includes(p.brand)) return false;
    if (filters.applications.length && !filters.applications.some((a) => p.applications.includes(a))) return false;
    if (filters.destinations.length && !filters.destinations.some((d) => p.destinations.includes(d))) return false;
    if (filters.labels.length && !filters.labels.some((l) => p.labels.includes(l))) return false;
    if (filters.aspect.length && !filters.aspect.includes(p.aspect)) return false;
    if (filters.base.length && !filters.base.includes(p.base)) return false;
    return true;
  }), [filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "price-asc": return arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      case "price-desc": return arr.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      case "name-asc": return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc": return arr.sort((a, b) => b.name.localeCompare(a.name));
      default: return arr.sort((a, b) => b.sales - a.sales);
    }
  }, [filtered, sort]);

  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE);
  const paginated = useMemo(() => sorted.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE), [sorted, currentPage]);

  const handleSortChange = (newSort) => { setSort(newSort); setCurrentPage(1); };
  const handlePageChange = (page) => { setCurrentPage(page); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  const counts = useMemo(() => {
    const withoutGroup = (excludeGroup) => PRODUCTS.filter((p) => {
      if (excludeGroup !== "type" && filters.type.length && !filters.type.includes(p.type)) return false;
      if (excludeGroup !== "brand" && filters.brand.length && !filters.brand.includes(p.brand)) return false;
      if (excludeGroup !== "applications" && filters.applications.length && !filters.applications.some((a) => p.applications.includes(a))) return false;
      if (excludeGroup !== "destinations" && filters.destinations.length && !filters.destinations.some((d) => p.destinations.includes(d))) return false;
      if (excludeGroup !== "labels" && filters.labels.length && !filters.labels.some((l) => p.labels.includes(l))) return false;
      if (excludeGroup !== "aspect" && filters.aspect.length && !filters.aspect.includes(p.aspect)) return false;
      if (excludeGroup !== "base" && filters.base.length && !filters.base.includes(p.base)) return false;
      return true;
    });
    const tally = (list, key, multi) => {
      const out = {};
      list.forEach((p) => { const vals = multi ? p[key] : [p[key]]; vals.forEach((v) => { if (v) out[v] = (out[v] || 0) + 1; }); });
      return out;
    };
    return {
      type: tally(withoutGroup("type"), "type", false),
      brand: tally(withoutGroup("brand"), "brand", false),
      applications: tally(withoutGroup("applications"), "applications", true),
      destinations: tally(withoutGroup("destinations"), "destinations", true),
      labels: tally(withoutGroup("labels"), "labels", true),
      aspect: tally(withoutGroup("aspect"), "aspect", false),
      base: tally(withoutGroup("base"), "base", false),
    };
  }, [filters]);

  return (
    <main className="overflow-x-hidden" style={{ background: BG }}>
      <div style={{ height: 4, background: YELLOW }} />

      <section className="pt-12 pb-10 lg:pt-16" style={{ background: BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="font-black tracking-[-0.03em]" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: TEXT_PRIMARY }}>
            {PAGE_TITLE.toUpperCase()}
          </motion.h1>
          {PAGE_TAGLINE && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="text-sm font-semibold mt-3" style={{ color: YELLOW }}>
              {PAGE_TAGLINE}
            </motion.p>
          )}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ height: 3, background: YELLOW, width: 80, originX: 0, marginTop: 12 }} />
        </div>
      </section>

      <section className="border-y" style={{ borderColor: BORDER, background: BG2 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm" style={{ color: TEXT_SECONDARY }}>
            <span className="font-bold" style={{ color: TEXT_PRIMARY }}>{sorted.length}</span> Produits
            {totalPages > 1 && <span className="ml-2" style={{ color: TEXT_MUTED }}>— Page {currentPage}/{totalPages}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold" style={{ borderColor: BORDER, color: TEXT_PRIMARY, background: BG3 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
              Filtrer {activeCount > 0 && `(${activeCount})`}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden sm:inline" style={{ color: TEXT_SECONDARY }}>Trier:</span>
              <SortDropdown value={sort} onChange={handleSortChange} />
            </div>
          </div>
        </div>
      </section>

      <section ref={ref} className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FilterSidebar filters={filters} toggleFilter={toggleFilter} clearAll={clearAll} counts={counts} activeCount={activeCount} />
            </div>
          </aside>

          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
                <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.3, ease }} className="fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm overflow-y-auto p-5 lg:hidden" style={{ background: BG2 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-black text-lg" style={{ color: TEXT_PRIMARY }}>Filtres</h2>
                    <button onClick={() => setMobileFiltersOpen(false)} className="p-2" style={{ color: TEXT_SECONDARY }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                  </div>
                  <FilterSidebar filters={filters} toggleFilter={toggleFilter} clearAll={clearAll} counts={counts} activeCount={activeCount} />
                  <MagneticBtn onClick={() => setMobileFiltersOpen(false)} className="mt-5 w-full py-4 rounded-2xl font-bold text-sm" style={{ background: YELLOW, color: "#000" }}>
                    Voir {sorted.length} résultats
                  </MagneticBtn>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div>
            {sorted.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-24 rounded-2xl border" style={{ borderColor: BORDER, background: BG2 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: BG3 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
                </div>
                <h3 className="font-bold text-lg" style={{ color: TEXT_PRIMARY }}>Aucun produit trouvé</h3>
                <p className="text-sm mt-2 max-w-xs" style={{ color: TEXT_SECONDARY }}>Essayez de modifier ou réinitialiser vos filtres.</p>
                <button onClick={clearAll} className="mt-6 text-sm font-semibold" style={{ color: YELLOW }}>Effacer les filtres</button>
              </motion.div>
            ) : (
              <>
                <motion.div layout variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {paginated.map((p, i) => <ProductCard key={p.id} p={p} i={i} onNavigate={onNavigate} />)}
                  </AnimatePresence>
                </motion.div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                <p className="text-center text-xs mt-4" style={{ color: TEXT_MUTED }}>
                  Affichage {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, sorted.length)} sur {sorted.length} produits
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductDetailPage({ productId, onBack }) {
  const p = PRODUCTS.find((x) => x.id === productId);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(p?.colors?.[0] || "BLANC");
  const [selectedCond, setSelectedCond] = useState(p?.conditioning?.[0] || "3L");
  const [activeTab, setActiveTab] = useState("highlights");

  if (!p) return (
    <div className="flex items-center justify-center h-screen" style={{ background: BG }}>
      <div className="text-center">
        <p className="text-lg font-bold" style={{ color: TEXT_PRIMARY }}>Produit introuvable</p>
        <button onClick={onBack} className="mt-4 text-sm font-semibold" style={{ color: YELLOW }}>← Retour aux produits</button>
      </div>
    </div>
  );

  const badge = BADGE_COLORS[p.badge];
  const brandLabel = BRAND_LABELS[p.brand] || p.brand;
  const typeLabel = PRODUCT_TYPES.find((t) => t.id === p.type)?.label || p.type;
  const breadcrumbPieces = ["Accueil", "Peintures", typeLabel + "s", p.name];
  const relatedProducts = PRODUCTS.filter((x) => x.id !== p.id && (x.brand === p.brand || x.type === p.type)).slice(0, 3);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-screen" style={{ background: BG }}>
      <div style={{ height: 4, background: YELLOW }} />

      <div className="border-b" style={{ borderColor: BORDER, background: BG2 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-4 flex items-center justify-between gap-4 flex-wrap">
          <nav className="flex items-center gap-1.5 text-xs font-medium flex-wrap" style={{ color: TEXT_MUTED }}>
            <button onClick={onBack} className="hover:text-white transition-colors">Accueil</button>
            {breadcrumbPieces.slice(1, -1).map((piece, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                <button onClick={i === 0 ? onBack : undefined} className={i === 0 ? "hover:text-white transition-colors" : ""}>{piece}</button>
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              <span style={{ color: YELLOW }} className="font-semibold truncate max-w-[160px]">{p.name}</span>
            </span>
          </nav>
          <motion.button onClick={() => onBack()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors" style={{ borderColor: BORDER, color: TEXT_PRIMARY, background: BG3 }} whileHover={{ x: -2, borderColor: YELLOW }} transition={{ duration: 0.15 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Retour aux produits
          </motion.button>
        </div>
      </div>

      <section className="py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="mb-8 pb-6 border-b flex items-start justify-between gap-6 flex-wrap" style={{ borderColor: BORDER }}>
            <div className="flex-1">
              {p.badge && badge && <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3" style={{ background: badge.bg, color: badge.color }}>{p.badge}</span>}
              <h1 className="font-black tracking-[-0.02em]" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: TEXT_PRIMARY }}>{p.name}</h1>
              <p className="text-sm mt-1.5" style={{ color: TEXT_SECONDARY }}>{typeLabel}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold" style={{ borderColor: BORDER, color: TEXT_SECONDARY, background: BG2 }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-black" style={{ background: "#14532d", color: "#86efac" }}>A+</div>
                <span>Émissions dans l'air intérieur</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl border font-bold text-sm" style={{ borderColor: BORDER, color: TEXT_PRIMARY, background: BG2 }}>{brandLabel}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[380px_1fr] gap-10 xl:gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease }} className="rounded-3xl overflow-hidden flex items-center justify-center p-10 lg:p-14" style={{ background: BG2, border: `1px solid ${BORDER}`, minHeight: 380 }}>
              <motion.img key={p.img} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} src={p.img} alt={p.name} className="w-full max-w-[280px] h-auto object-contain drop-shadow-2xl" onError={(e) => { e.target.style.opacity = "0.15"; }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08, ease }}>
              <div className="rounded-2xl border p-6 lg:p-8" style={{ borderColor: BORDER, background: BG2 }}>
                <p className="text-sm font-semibold mb-6" style={{ color: TEXT_SECONDARY }}>Sélectionnez les paramètres du produit pour obtenir le prix et la disponibilité</p>
                <div className="mb-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: TEXT_MUTED }}>Sélectionner le type</div>
                  <div className="flex flex-wrap gap-2">
                    {p.colors.map((c) => (
                      <button key={c} onClick={() => setSelectedColor(c)} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all" style={{ borderColor: selectedColor === c ? YELLOW : BORDER, color: selectedColor === c ? YELLOW : TEXT_SECONDARY, background: selectedColor === c ? "rgba(245,195,0,0.1)" : BG3 }}>
                        <span className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: selectedColor === c ? YELLOW : BORDER, background: selectedColor === c ? YELLOW : "transparent" }} />
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: TEXT_MUTED }}>Choisir le conditionnement</div>
                    <div className="relative">
                      <select value={selectedCond} onChange={(e) => setSelectedCond(e.target.value)} className="w-full appearance-none px-4 py-3.5 pr-10 rounded-xl border text-sm font-semibold" style={{ borderColor: BORDER, color: TEXT_PRIMARY, background: BG3 }}>
                        {p.conditioning.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: TEXT_MUTED }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: TEXT_MUTED }}>Quantité</div>
                    <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: BORDER }}>
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-12 h-[50px] flex items-center justify-center text-xl font-light transition-colors flex-shrink-0" style={{ color: TEXT_PRIMARY, background: BG3 }}>−</button>
                      <div className="flex-1 text-center font-bold text-sm" style={{ color: TEXT_PRIMARY, background: BG2 }}>{qty}</div>
                      <button onClick={() => setQty((q) => q + 1)} className="w-12 h-[50px] flex items-center justify-center text-xl font-light transition-colors flex-shrink-0" style={{ color: TEXT_PRIMARY, background: BG3 }}>+</button>
                    </div>
                  </div>
                </div>
                <div className="mb-6 pb-6 border-b" style={{ borderColor: BORDER }}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: TEXT_MUTED }}>Voir les stocks</div>
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#4ade80" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    Click & collect
                  </div>
                </div>
                <div className="mb-6 text-xs" style={{ color: TEXT_MUTED }}>CODE ERP : <span className="font-bold" style={{ color: TEXT_PRIMARY }}>{p.erpCode}</span></div>
                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <div className="flex gap-6">
                    {p.pricePerLitre && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: TEXT_MUTED }}>Votre prix au L</div>
                        <div className="text-base font-bold" style={{ color: YELLOW }}>{p.pricePerLitre.toFixed(2).replace(".", ",")} €</div>
                        <div className="text-xs" style={{ color: TEXT_MUTED }}>{(p.pricePerLitre * 0.8333).toFixed(2).replace(".", ",")} € HT</div>
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: TEXT_MUTED }}>Votre prix à l'unité</div>
                      <div className="text-2xl font-black" style={{ color: YELLOW }}>
                        {typeof p.price === "number" ? `${(p.price * qty).toFixed(2).replace(".", ",")} €` : "Sur devis"}
                      </div>
                      {typeof p.price === "number" && <div className="text-xs" style={{ color: TEXT_MUTED }}>{(p.price * qty * 0.8333).toFixed(2).replace(".", ",")} € HT</div>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <MagneticBtn className="px-8 py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity" style={{ background: YELLOW, color: "#000" }}>Ajouter au panier</MagneticBtn>
                    <div className="flex items-center gap-4 text-xs" style={{ color: TEXT_MUTED }}>
                      <button className="flex items-center gap-1.5 hover:text-white transition-colors"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12h6M21 12h-6M12 3v6M12 21v-6" /><circle cx="12" cy="12" r="9" /></svg>Comparer</button>
                      <button className="flex items-center gap-1.5 hover:text-white transition-colors"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>Ajouter à mes listes</button>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-start gap-3 rounded-xl px-4 py-3.5" style={{ background: "rgba(245,195,0,0.08)", border: `1px solid rgba(245,195,0,0.2)` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="1.8" className="flex-shrink-0 mt-0.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <div>
                    <p className="text-xs font-bold" style={{ color: TEXT_PRIMARY }}>Déjà client ?</p>
                    <p className="text-xs mt-0.5" style={{ color: TEXT_SECONDARY }}>Connectez-vous pour accéder à <button className="font-semibold underline" style={{ color: YELLOW }}>votre tarif</button></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 border-t" style={{ borderColor: BORDER }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start sm:items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: TEXT_MUTED }}>Propriétés</div>
              <PictoRow pictos={p.pictos} size="lg" />
            </div>
            {p.labels.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: TEXT_MUTED }}>Certifications</div>
                <div className="flex flex-wrap gap-2">
                  {p.labels.map((l) => {
                    const lbl = LABELS.find((x) => x.id === l);
                    return <span key={l} className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-lg border" style={{ borderColor: BORDER, color: TEXT_SECONDARY, background: BG3 }}>{lbl?.label || l}</span>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-b" style={{ borderColor: BORDER, background: BG2 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex gap-1 overflow-x-auto">
            {[{ id: "highlights", label: "✦ Points forts" }, { id: "description", label: "Description" }, { id: "technical", label: "Caractéristiques techniques" }, { id: "docs", label: "Documentation" }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-5 py-5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all" style={{ borderBottomColor: activeTab === tab.id ? YELLOW : "transparent", color: activeTab === tab.id ? YELLOW : TEXT_MUTED }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {activeTab === "highlights" && <div className="max-w-2xl"><p className="text-sm" style={{ color: TEXT_SECONDARY }}>{p.shortDesc}</p></div>}
              {activeTab === "description" && <div className="max-w-2xl"><p className="text-sm leading-relaxed" style={{ color: TEXT_SECONDARY, lineHeight: 1.85 }}>{p.fullDesc}</p></div>}
              {activeTab === "technical" && <div className="max-w-2xl"><p className="text-sm" style={{ color: TEXT_SECONDARY }}>Caractéristiques techniques non disponibles pour ce produit.</p></div>}
              {activeTab === "docs" && (
                <div className="flex flex-wrap gap-3">
                  {["Sécurité", "Fiche technique", "Documents de référence"].map((doc) => (
                    <button key={doc} className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors hover:border-yellow-400" style={{ borderColor: BORDER, color: TEXT_PRIMARY, background: BG2 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      {doc}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-12 border-t" style={{ borderColor: BORDER, background: BG2 }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <h2 className="font-black text-xl mb-8 tracking-[-0.02em]" style={{ color: TEXT_PRIMARY }}>Produits similaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProducts.map((rp, i) => (
                <motion.button key={rp.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4 }} onClick={() => onBack(rp.id)} className="rounded-2xl border overflow-hidden text-left transition-all duration-300" style={{ borderColor: BORDER, background: BG3 }} whileHover={{ y: -4, borderColor: YELLOW, boxShadow: "0 16px 32px -12px rgba(0,0,0,0.5)" }}>
                  <div className="aspect-square flex items-center justify-center p-8" style={{ background: BG2 }}>
                    <img src={rp.img} alt={rp.name} className="w-full h-full object-contain" onError={(e) => { e.target.style.opacity = "0.15"; }} />
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-sm" style={{ color: TEXT_PRIMARY }}>{rp.name}</div>
                    <div className="text-xs mt-1" style={{ color: TEXT_MUTED }}>{rp.shortDesc.slice(0, 70)}…</div>
                    <div className="mt-3 font-black text-base" style={{ color: YELLOW }}>{typeof rp.price === "number" ? `${rp.price.toFixed(2).replace(".", ",")} €` : "Sur devis"}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.main>
  );
}

export default function App() {
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  useEffect(() => {
    const productId = typeof window !== "undefined" ? (window.history.state?.productId ?? null) : null;
    setCurrentProductId(productId);
    const onPopState = (e: PopStateEvent) => {
      setCurrentProductId(e.state?.productId ?? null);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateToProduct = (id: string) => {
    if (typeof window !== "undefined") { window.history.pushState({ productId: id }, "", `#product-${id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }
    setCurrentProductId(id);
  };

  const navigateBack = (id?: string) => {
    if (id) {
      if (typeof window !== "undefined") { window.history.pushState({ productId: id }, "", `#product-${id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }
      setCurrentProductId(id);
    } else {
      setCurrentProductId(null);
      if (typeof window !== "undefined") window.history.back();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <Navbar/>
      {currentProductId ? (
        <motion.div key={`product-${currentProductId}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <ProductDetailPage productId={currentProductId} onBack={navigateBack} />
        </motion.div>
      ) : (
        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <ProductsPage onNavigate={navigateToProduct} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}