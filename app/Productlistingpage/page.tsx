"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/page";
// ─── Tokens (matches Navbar.tsx / homepage) ──────────────────────────────────
const YELLOW = "#F5C300";
const YELLOW_DARK = "#D4A800";
const INK = "#1A1A1A";
const BORDER = "rgba(26,26,26,0.10)";
const MUT = "rgba(26,26,26,0.52)";
const DIM = "rgba(26,26,26,0.36)";
const GRAY = "#F7F7F7";

type Product = {
  id: string;
  sku: string;
  brand: string;
  name: string;
  image: string;
  tags: string[];
  price: number;
  compareAtPrice: number | null;
  unitPrice: string;
  stock: "in_stock" | "low_stock" | "out_of_stock";
};

type CategoryData = {
  category: {
    slug: string;
    parentLabel: string;
    parentHref: string;
    name: string;
    tagline: string;
    description: string;
    stats: { products: number; brands: number; delivery: string };
  };
  brands: { name: string; count: number }[];
  surfaceTypes: { name: string; count: number }[];
  priceRange: { min: number; max: number; currentMin: number; currentMax: number };
  activeFilters: string[];
  totalCount: number;
  page: number;
  totalPages: number;
  sortOptions: string[];
  products: Product[];
};

const STOCK_LABEL: Record<Product["stock"], { label: string; color: string }> = {
  in_stock: { label: "En Stock", color: "#22C55E" },
  low_stock: { label: "Stock limité", color: "#F59E0B" },
  out_of_stock: { label: "Rupture stock", color: "#EF4444" },
};

function fmtPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Grid: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  List: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Cart: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  Bell: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

function ProductCard({ p }: { p: Product }) {
  const [hover, setHover] = useState(false);
  const stockInfo = STOCK_LABEL[p.stock];
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${hover ? "rgba(26,26,26,0.18)" : BORDER}`,
        borderRadius: "10px",
        overflow: "hidden",
        background: "#fff",
        transition: "border-color .2s, box-shadow .2s, transform .2s",
        boxShadow: hover ? "0 10px 28px rgba(26,26,26,0.10)" : "none",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "1/1", background: GRAY, overflow: "hidden" }}>
        <img
          src={p.image}
          alt={p.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hover ? "scale(1.05)" : "scale(1)", transition: "transform .5s ease",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ color: DIM, fontSize: "10.5px", letterSpacing: "0.04em", marginBottom: "6px" }}>
          SKU: {p.sku} · {p.brand.toUpperCase()}
        </div>
        <div style={{ color: INK, fontWeight: 700, fontSize: "14px", lineHeight: 1.35, marginBottom: "10px", minHeight: "38px" }}>
          {p.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px" }}>
          {p.tags.map((t) => (
            <span key={t} style={{
              border: `1px solid ${BORDER}`, borderRadius: "4px", padding: "2px 7px",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.03em", color: MUT,
            }}>{t}</span>
          ))}
        </div>

        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "2px" }}>
            <span style={{ color: INK, fontWeight: 800, fontSize: "19px" }}>{fmtPrice(p.price)}</span>
            {p.compareAtPrice && (
              <span style={{ color: DIM, fontSize: "12.5px", textDecoration: "line-through" }}>{fmtPrice(p.compareAtPrice)}</span>
            )}
          </div>
          <div style={{ color: DIM, fontSize: "11px", marginBottom: "12px" }}>HT / unité · {p.unitPrice}</div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11.5px", fontWeight: 600, color: stockInfo.color }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: stockInfo.color, display: "inline-block" }} />
              {stockInfo.label}
            </span>
            <button
              disabled={p.stock === "out_of_stock"}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 13px", borderRadius: "7px",
                background: p.stock === "out_of_stock" ? "#F2F2F2" : INK,
                color: p.stock === "out_of_stock" ? DIM : "#fff",
                border: "none", fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.03em",
                cursor: p.stock === "out_of_stock" ? "not-allowed" : "pointer",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => { if (p.stock !== "out_of_stock") (e.currentTarget as HTMLElement).style.background = YELLOW_DARK; }}
              onMouseLeave={(e) => { if (p.stock !== "out_of_stock") (e.currentTarget as HTMLElement).style.background = INK; }}
            >
              {p.stock === "out_of_stock" ? <Icon.Bell /> : <Icon.Cart />}
              {p.stock === "out_of_stock" ? "ALERTER" : "AJOUTER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main exported component ─────────────────────────────────────────────────
export default function ProductListingPage({ data }: { data: CategoryData }) {
  if (!data || !data.category) {
    return (
      <div style={{ padding: "80px 48px", textAlign: "center", color: "#999", fontSize: "14px" }}>
        Données produit indisponibles. Vérifiez que <code>data/products.json</code> est bien lu et transmis en tant que prop <code>data</code> à <code>ProductListingPage</code>.
      </div>
    );
  }

  const { category, sortOptions, products, totalCount, page, totalPages } = data;

  const [sort, setSort] = useState(sortOptions[0]);
  const [view, setView] = useState<"grid" | "list">("grid");

  return ( <>

    <Navbar/>
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div style={{ background: INK, padding: "9px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", color: "rgba(255,255,255,0.45)" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Accueil</a>
          <span>›</span>
          <a href={category.parentHref} style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>{category.parentLabel}</a>
          <span>›</span>
          <span style={{ color: YELLOW, fontWeight: 600 }}>{category.name}</span>
        </div>
      </div>

      {/* Category header banner */}
      <div style={{ background: INK, borderBottom: `3px solid ${YELLOW}`, padding: "32px 0" }}>
        <div style={{
          maxWidth: "1280px", margin: "0 auto", padding: "0 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ width: "3px", height: "16px", background: YELLOW, display: "inline-block" }} />
              <span style={{ color: YELLOW, fontSize: "11px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                Catégorie professionnelle
              </span>
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              {category.name} : <span style={{ color: YELLOW }}>{category.tagline}</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13.5px", maxWidth: "560px", lineHeight: 1.6, margin: 0 }}>
              {category.description}
            </p>
          </div>
          <div style={{ display: "flex", gap: "28px", flexShrink: 0 }}>
            {[
              { n: category.stats.products, l: "Produits" },
              { n: category.stats.brands, l: "Marques" },
              { n: category.stats.delivery, l: "Livraison" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ color: YELLOW, fontWeight: 900, fontSize: "1.5rem", lineHeight: 1 }}>{s.n}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "4px" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body (no sidebar) */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 48px 64px" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "20px" }}>
          <div style={{ fontSize: "13.5px", color: INK }}>
            <strong>{totalCount}</strong> produits trouvés <span style={{ color: DIM }}>dans {category.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: DIM, fontWeight: 700, letterSpacing: "0.06em" }}>TRIER :</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ border: `1px solid ${BORDER}`, borderRadius: "7px", padding: "8px 12px", fontSize: "12.5px", color: INK, fontWeight: 600, outline: "none", background: "#fff" }}
            >
              {sortOptions.map((o) => <option key={o} value={o}>{o.toUpperCase()}</option>)}
            </select>
            <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: "7px", overflow: "hidden" }}>
              <button onClick={() => setView("grid")} style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", background: view === "grid" ? INK : "#fff", color: view === "grid" ? YELLOW : MUT }}>
                <Icon.Grid />
              </button>
              <button onClick={() => setView("list")} style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", background: view === "list" ? INK : "#fff", color: view === "list" ? YELLOW : MUT }}>
                <Icon.List />
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: view === "grid" ? "repeat(4, 1fr)" : "1fr",
          gap: "16px",
        }}>
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        {products.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: DIM, fontSize: "13.5px" }}>
            Aucun produit disponible.
          </div>
        )}

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "32px", flexWrap: "wrap", gap: "16px" }}>
          <span style={{ fontSize: "12.5px", color: DIM }}>
            Affichage 1–{Math.min(9, totalCount)} de <strong style={{ color: INK }}>{totalCount}</strong> produits
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button style={pagerBtn(false)}>‹</button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((n) => (
              <button key={n} style={pagerBtn(n === page)}>{n}</button>
            ))}
            {totalPages > 4 && <span style={{ color: DIM, padding: "0 4px" }}>…</span>}
            {totalPages > 3 && <button style={pagerBtn(false)}>{totalPages}</button>}
            <button style={pagerBtn(false)}>›</button>
          </div>
        </div>
      </div>
    </div>
      </>
  );
}

function pagerBtn(active: boolean): React.CSSProperties {
  return {
    width: "32px", height: "32px", borderRadius: "6px",
    border: `1px solid ${active ? YELLOW_DARK : BORDER}`,
    background: active ? YELLOW : "#fff",
    color: active ? INK : MUT,
    fontWeight: active ? 800 : 500, fontSize: "12.5px",
    cursor: "pointer",
  };
}