"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
// ─── Types ────────────────────────────────────────────────────────────────────
type MegaLink = {
  label: string;
  href: string;
};

type MegaColumn = {
  title: string;
  image?: string;
  links: MegaLink[];
};

type NavItem = {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  megaColumns?: MegaColumn[];
};

// ─── Nav Data ─────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    label: "Préparation & Matériaux",
    href: "/preparation-materiaux",
    icon: "/preparation.png",
    megaColumns: [
      {
        title: "Préparation des supports",
        image: "/preparation-des-supports.png",
        links: [
          { label: "Enduit et Mastic", href: "/preparation-materiaux/enduit-et-mastic" },
          { label: "Toile de verre, calicot & Fissnet", href: "/preparation-materiaux/toile-de-verre-calicot-fissnet" },
          { label: "Abrasif, Papier de verre", href: "/preparation-materiaux/abrasif-papier-de-verre" },
          { label: "Entretien, Décapant et Diluant", href: "/preparation-materiaux/entretien-decapant-et-diluant" },
          { label: "Bande à Joint", href: "/preparation-materiaux/bande-a-joint" },
        ],
      },
      {
        title: "Quincaillerie",
        image: "/protection-sol.png",
        links: [
          { label: "Accessoire du peintre", href: "/preparation-materiaux/accessoire-du-peintre" },
          { label: "Colle, résine et mastic", href: "/preparation-materiaux/colle-resine-et-mastic" },
          { label: "Anti nuisible", href: "/preparation-materiaux/anti-nuisible" },
        ],
      },
      {
        title: "Protection sol & EPI",
        image: "/protection-sol.png",
        links: [
          { label: "Bâche et polyane", href: "/preparation-materiaux/bache-et-polyane" },
          { label: "Vêtement de protection", href: "/preparation-materiaux/vetement-de-protection" },
          { label: "Masques et lunettes", href: "/preparation-materiaux/masques-et-lunettes" },
          { label: "Ruban Adhésif", href: "/preparation-materiaux/ruban-adhesif" },
        ],
      },
      {
        title: "Matériaux de construction",
        image: "/materiaux-de-construction.png",
        links: [
          { label: "Ragréage & Mortier colle carrelage", href: "/preparation-materiaux/ragreage-mortier-colle-carrelage" },
          { label: "Sac à gravats et sac poubelle", href: "/preparation-materiaux/sac-a-gravats-et-sac-poubelle" },
          { label: "Trappe de visite", href: "/preparation-materiaux/trappe-de-visite" },
        ],
      },
    ],
  },
  {
    label: "Peinture",
    href: "/peintures",
    icon: "/peinture.png",
    megaColumns: [
      {
        title: "Sous-couche & Primaire : Préparez vos supports",
        image: "/sous-couche.png",
        links: [
          { label: "Sous-couche pour Plaques de Plâtre & Rénovation", href: "/peintures/sous-couche-plaques-de-platre-renovation" },
          { label: "Primaire d'Isolation pour Pièces Humides", href: "/peintures/primaire-isolation-pieces-humides" },
          { label: "Sous-couche Impression Bois : Intérieur & Extérieur", href: "/peintures/sous-couche-impression-bois" },
          { label: "Primaire & Protection Antirouille pour Métaux", href: "/peintures/primaire-protection-antirouille-metaux" },
          { label: "Fixateur et Impression pour Façades et Murs extérieur", href: "/peintures/fixateur-impression-facades-murs-exterieur" },
          { label: "Primaire d'Accrochage Spécial Supports Lisses", href: "/peintures/primaire-accrochage-supports-lisses" },
        ],
      },
      {
        title: "Peinture Intérieur : Décoration & Rénovation Pro",
        image: "/peinture-interieur.png",
        links: [
          { label: "Peinture mur et plafond", href: "/peintures/peinture-mur-et-plafond" },
          { label: "Cuisine et salle de bain", href: "/peintures/cuisine-et-salle-de-bain" },
          { label: "Protection antirouille métal", href: "/peintures/protection-antirouille-metal" },
          { label: "Traitement du bois", href: "/peintures/traitement-du-bois" },
          { label: "Peinture Sol garage & atelier", href: "/peintures/peinture-sol-garage-atelier" },
          { label: "Peinture Faïence, Carrelage & meuble cuisine", href: "/peintures/peinture-faience-carrelage-meuble-cuisine" },
          { label: "Bombe de peinture, Aérosol pas cher", href: "/peintures/bombe-de-peinture-aerosol-pas-cher" },
          { label: "Nuancier", href: "/peintures/nuancier" },
        ],
      },
      {
        title: "Peinture Extérieur : Protection & Rénovation Façade",
        image: "/exterieur.png",
        links: [
          { label: "Peinture extérieure façade", href: "/peintures/peinture-exterieure-facade" },
          { label: "Peinture toiture", href: "/peintures/peinture-toiture" },
          { label: "Peinture protection bois", href: "/peintures/peinture-protection-bois" },
          { label: "Peinture antirouille métaux", href: "/peintures/peinture-antirouille-metaux" },
          { label: "Peinture sol extérieur & terrasse", href: "/peintures/peinture-sol-exterieur-terrasse" },
        ],
      },
    ],
  },
  {
    label: "Outillage",
    href: "/outillage",
    icon: "/outrillage.png",
    megaColumns: [
      {
        title: "Outillage électroportatif",
        image: "/outillage1.png",
        links: [
          { label: "Perceuses et visseuses", href: "/outillage/perceuses-et-visseuses" },
          { label: "Perforateurs et burineurs", href: "/outillage/perforateurs-et-burineurs" },
          { label: "Ponceuses électriques", href: "/outillage/ponceuses-electriques" },
          { label: "Scies sauteuses", href: "/outillage/scies-sauteuses" },
          { label: "Meuleuses d'angle", href: "/outillage/meuleuses-dangle" },
          { label: "Scies circulaires et découpe", href: "/outillage/scies-circulaires-et-decoupe" },
          { label: "Scies sabres", href: "/outillage/scies-sabres" },
          { label: "Cloueur professionnel", href: "/outillage/cloueur-professionnel" },
          { label: "Télémètre laser", href: "/outillage/telemetre-laser" },
          { label: "Outillage de jardin Pro", href: "/outillage/outillage-de-jardin-pro" },
          { label: "Mélangeur et malaxeur", href: "/outillage/melangeur-et-malaxeur" },
          { label: "Projecteur et Lampe", href: "/outillage/projecteur-et-lampe" },
        ],
      },
      {
        title: "Outillage et outil à main",
        image: "/outillage2.png",
        links: [
          { label: "Couteau à enduire", href: "/outillage/couteau-a-enduire" },
          { label: "Cutter, couteau et ciseau", href: "/outillage/cutter-couteau-et-ciseau" },
          { label: "Grattoir et Riflard", href: "/outillage/grattoir-et-riflard" },
          { label: "Outils de mesure", href: "/outillage/outils-de-mesure" },
          { label: "Rangement", href: "/outillage/rangement" },
          { label: "Marteau", href: "/outillage/marteau" },
          { label: "Marqueur", href: "/outillage/marqueur" },
          { label: "Ventouse de levage", href: "/outillage/ventouse-de-levage" },
          { label: "Clés et pinces", href: "/outillage/cles-et-pinces" },
          { label: "Scie à métaux et bois", href: "/outillage/scie-a-metaux-et-bois" },
          { label: "Embouts de vissage", href: "/outillage/embouts-de-vissage" },
          { label: "Tournevis", href: "/outillage/tournevis" },
        ],
      },
      {
        title: "Consommables",
        image: "outillage3.png",
        links: [
          { label: "Forets & mèches pour perceuses", href: "/outillage/forets-et-meches-pour-perceuses" },
          { label: "Embouts de vissage", href: "/outillage/consommables-embouts-de-vissage" },
          { label: "Embouts burin pour perforateurs", href: "/outillage/embouts-burin-pour-perforateurs" },
          { label: "Disques & lames de découpe", href: "/outillage/disques-et-lames-de-decoupe" },
          { label: "Scies cloches", href: "/outillage/scies-cloches" },
          { label: "Disques abrasifs & ponçages", href: "/outillage/disques-abrasifs-et-poncages" },
          { label: "Batteries & chargeurs électroportatifs", href: "/outillage/batteries-et-chargeurs-electroportatifs" },
          { label: "Vis et clou", href: "/outillage/vis-et-clou" },
        ],
      },
    ],
  },

];

// ─── Tokens — Batimato Theme ──────────────────────────────────────────────────
const YELLOW = "#F5C300";
const YELLOW_DARK = "#D4A800";
const YELLOW_LIGHT = "#FFF9D6";
const INK = "#1A1A1A";
const GRAY = "#F2F2F2";

const T = {
  bg: "#FFFFFF",
  bgAlt: "#F8F8F8",
  border: "rgba(26,26,26,0.09)",
  borderHover: "rgba(26,26,26,0.18)",
  textPrimary: INK,
  textMuted: "rgba(26,26,26,0.5)",
  textDim: "rgba(26,26,26,0.38)",
  accent: YELLOW,
  accentDark: YELLOW_DARK,
  accentLight: YELLOW_LIGHT,
  megaBg: "#FFFFFF",
  navH: 98,
  utilH: 36,
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Chevron: ({ open }: { open: boolean }) => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ transition: "transform 0.25s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Location: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Phone: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.37 2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
};

// ─── Mega Menu (3-column link layout + product image per column) ─────────────
function MegaMenu({
  item,
  visible,
  top,
}: {
  item: NavItem;
  visible: boolean;
  top: number;
}) {
  const hasColumns = !!item.megaColumns && item.megaColumns.length > 0;

  return (
    <>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          top: top,
          background: "rgba(26,26,26,0.22)",
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.2s ease",
          zIndex: 998,
        }}
      />

      <div
        aria-hidden={!visible}
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          zIndex: 999,
          background: T.megaBg,
          borderBottom: `3px solid ${YELLOW}`,
          boxShadow: "0 12px 40px rgba(26,26,26,0.13)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <div style={{ height: "3px", background: YELLOW }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", minHeight: hasColumns ? "300px" : "0" }}>
          <div style={{ padding: "32px 48px 40px" }}>
            {hasColumns ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${item.megaColumns!.length}, 1fr)`,
                  gap: "40px",
                }}
              >
                {item.megaColumns!.map((col) => (
                  <div
                    key={col.title}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <div style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: INK,
                      marginBottom: "18px",
                      lineHeight: 1.35,
                      paddingBottom: "12px",
                      borderBottom: `2px solid ${YELLOW}`,
                      width: "100%",
                      textAlign: "center",
                    }}>
                      {col.title}
                    </div>

                    <ul style={{
                      listStyle: "none", margin: 0, padding: 0,
                      display: "flex", flexDirection: "column", gap: "13px",
                      width: "100%",
                    }}>
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "center",
                              textAlign: "center",
                              gap: "9px",
                              color: T.textMuted,
                              fontSize: "14px",
                              lineHeight: 1.4,
                              textDecoration: "none",
                              transition: "color 0.15s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = YELLOW_DARK)}
                            onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>

                    {col.image && (
                      <div style={{
                        marginTop: "22px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}>
                        <img
                          src={col.image}
                          alt={col.title}
                          style={{
                            width: "100%",
                            maxWidth: "220px",
                            height: "140px",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: "28px 0",
                color: T.textDim,
                fontSize: "13px",
                fontStyle: "italic",
                textAlign: "center",
              }}>
                Contenu à venir.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Mobile Drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(26,26,26,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s",
          zIndex: 1099,
        }}
      />
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: "min(340px, 88vw)",
        background: "#FFFFFF",
        borderRight: `1px solid ${T.border}`,
        boxShadow: "8px 0 40px rgba(26,26,26,0.15)",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
        overflowY: "auto", zIndex: 1100,
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `3px solid ${YELLOW}`,
          flexShrink: 0,
        }}>
          <Logo compact />
          <button
            onClick={onClose}
            style={{
              background: GRAY,
              border: `1px solid ${T.border}`,
              borderRadius: "8px",
              width: "36px", height: "36px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: T.textMuted,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Icon.Close />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: GRAY, border: `1px solid ${T.border}`,
            borderRadius: "8px", padding: "10px 14px",
          }}>
            <span style={{ color: T.textMuted, display: "flex" }}><Icon.Search /></span>
            <input
              type="text"
              placeholder="Rechercher un produit…"
              style={{ background: "none", border: "none", outline: "none", color: INK, fontSize: "13px", width: "100%" }}
            />
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 0" }}>
          {NAV_ITEMS.map((item) => {
            const hasColumns = !!item.megaColumns && item.megaColumns.length > 0;
            return (
              <div key={item.label} style={{ borderBottom: `1px solid ${T.border}` }}>
                <button
                  onClick={() => hasColumns && setExpanded(expanded === item.label ? null : item.label)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "14px 20px",
                    background: expanded === item.label ? YELLOW_LIGHT : "none",
                    borderLeft: expanded === item.label ? `3px solid ${YELLOW}` : "3px solid transparent",
                    border: "none",
                    color: expanded === item.label ? INK : T.textMuted,
                    fontSize: "15px", fontWeight: 700,
                    cursor: hasColumns ? "pointer" : "default", textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {item.icon && (
                      <img
                        src={item.icon}
                        alt=""
                        style={{ width: "22px", height: "22px", objectFit: "contain", flexShrink: 0 }}
                      />
                    )}
                    {item.label}
                    {item.badge && (
                      <span style={{
                        fontSize: "9px", fontWeight: 700,
                        padding: "2px 6px", borderRadius: "4px",
                        background: item.badge === "New" ? INK : YELLOW,
                        color: item.badge === "New" ? "#fff" : INK,
                        letterSpacing: "0.06em",
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {hasColumns && <Icon.Chevron open={expanded === item.label} />}
                </button>

                {hasColumns && expanded === item.label && (
                  <div style={{ paddingBottom: "12px", background: "#FAFAFA" }}>
                    {item.megaColumns!.map((col) => (
                      <div key={col.title} style={{ padding: "10px 20px 4px" }}>
                        <div style={{ color: INK, fontWeight: 700, fontSize: "12px", marginBottom: "8px" }}>
                          {col.title}
                        </div>
                        {col.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            style={{
                              display: "block",
                              padding: "7px 0",
                              color: T.textMuted, textDecoration: "none",
                              fontSize: "12.5px",
                              borderLeft: "2px solid transparent",
                              paddingLeft: "10px",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = INK; e.currentTarget.style.borderLeftColor = YELLOW; }}
                            onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.borderLeftColor = "transparent"; }}
                          >
                            {link.label}
                          </a>
                        ))}
                        {col.image && (
                          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
                            <img
                              src={col.image}
                              alt={col.title}
                              style={{ width: "100%", maxWidth: "180px", height: "100px", objectFit: "contain" }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}` }}>
  <Link
    href="/contact"
    style={{
      display: "block",
      textAlign: "center",
      padding: "11px",
      background: YELLOW,
      borderRadius: "8px",
      color: INK,
      fontSize: "13px",
      fontWeight: 700,
      textDecoration: "none",
    }}
  >
    Contact
  </Link>
</div>
      </div>
    </>
  );
}

// ─── Logo — replace with your own image ──────────────────────────────────────
// `compact` renders a smaller version for the mobile drawer header.
function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0, minWidth: 0 }}>
      <img
        src="/logo.JPG"
        alt="Batimato"
        className="site-logo"
        style={{
          height: compact ? "44px" : "100px",
          width: "auto",
          maxWidth: "100%",
          display: "block",
          objectFit: "contain",
        }}
      />
    </a>
  );
}

// ─── Utility Bar ──────────────────────────────────────────────────────────────
function UtilityBar() {
  return (
    <div style={{ background: INK, height: T.utilH, display: "flex", alignItems: "center" }}>
      <div style={{
        maxWidth: "1280px", margin: "0 auto", padding: "0 48px",
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.45)", fontSize: "11px" }}>
          <Icon.Location />
          <span>32 magasins en Île-de-France</span>
          <span style={{ margin: "0 6px", opacity: 0.3 }}>·</span>
          <span style={{ color: "#4ADE80", fontWeight: 600 }}>Ouvert maintenant</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: YELLOW, fontSize: "11px", fontWeight: 600 }}>
            <Icon.Phone />
            <span>01 23 45 67 89</span>
          </div>
          {["Prise de RDV Showroom", "Nous trouver", "Fiches techniques"].map((label) => (
            <a
              key={label}
              href="#"
              style={{ color: "rgba(255,255,255,0.38)", textDecoration: "none", fontSize: "11px", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = YELLOW)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NavButton ────────────────────────────────────────────────────────────────
function NavButton({
  item,
  isOpen,
  onEnter,
}: {
  item: NavItem;
  isOpen: boolean;
  onEnter: () => void;
}) {
  return (
    <button
      onMouseEnter={onEnter}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "0 13px",
        height: T.navH,
        background: "none",
        border: "none",
        borderBottom: "3px solid transparent",
        borderTop: "3px solid transparent",
        color: T.textMuted,
        fontSize: "16px",
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: "0.01em",
        transition: "color 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {item.icon && (
        <img
          src={item.icon}
          alt=""
          style={{ width: "24px", height: "24px", objectFit: "contain", flexShrink: 0 }}
        />
      )}
      {item.label}
      {item.badge && (
        <span style={{
          fontSize: "8.5px", fontWeight: 700,
          padding: "2px 5px", borderRadius: "4px",
          background: item.badge === "New" ? INK : YELLOW,
          color: item.badge === "New" ? "#fff" : INK,
          letterSpacing: "0.06em",
        }}>
          {item.badge}
        </span>
      )}
      <Icon.Chevron open={isOpen} />
    </button>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaTop, setMegaTop] = useState(T.utilH + T.navH);

  const headerRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const measureMegaTop = useCallback(() => {
    if (headerRef.current) setMegaTop(headerRef.current.getBoundingClientRect().bottom);
  }, []);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 8); measureMegaTop(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    measureMegaTop();
    return () => window.removeEventListener("scroll", onScroll);
  }, [measureMegaTop]);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpenMenu(null); setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close the inline search overlay automatically once we cross into
  // desktop layout so it can't get stuck open with a stale fixed width.
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 640) setSearchOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleEnter = (label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    measureMegaTop();
    setOpenMenu(label);
  };
  const handleLeave = () => {
    timerRef.current = setTimeout(() => setOpenMenu(null), 150);
  };
  const currentItem = NAV_ITEMS.find(i => i.label === openMenu);

  return (
    <>
      <style>{`
        html, body { overflow-x: hidden; }
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(26,26,26,0.32) !important; }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          align-items: center;
          height: ${T.navH}px;
          gap: 0;
          width: 100%;
        }
        .navbar-divider {
          width: 1px;
          height: 28px;
          background: ${T.border};
          margin: 0 24px;
          flex-shrink: 0;
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          margin-left: auto;
        }
        .contact-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 0 16px; height: 38px;
          background: ${YELLOW}; color: ${INK};
          text-decoration: none; font-size: 13px; font-weight: 700;
          border-radius: 8px; border: none;
          transition: background 0.15s, transform 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .contact-btn:hover { background: ${YELLOW_DARK}; transform: translateY(-1px); }

        .nav-desktop { display: flex; align-items: center; flex: 1; min-width: 0; }
        .nav-hamburger { display: none; }

        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .utility-bar { display: none !important; }
          .navbar-inner { height: 84px; padding: 0 20px; }
          .navbar-divider { display: none; }
          .site-logo { height: 64px !important; }
        }

        @media (max-width: 640px) {
          .navbar-inner { padding: 0 16px; height: 76px; }
          .site-logo { height: 56px !important; }
          .navbar-right { gap: 8px; }
          .contact-btn-label { display: none; }
          .contact-btn { padding: 0 12px; }
          .search-box.open { width: min(160px, 42vw) !important; }
        }
      `}</style>

      <div ref={wrapRef} style={{ position: "sticky", top: 0, zIndex: 1000, width: "100%" }}>
        {/* <div className="utility-bar"><UtilityBar /></div> */}

        <header
          ref={headerRef}
          style={{
            background: "#FFFFFF",
            borderBottom: scrolled ? `3px solid ${YELLOW}` : `1px solid ${T.border}`,
            boxShadow: scrolled ? "0 4px 24px rgba(26,26,26,0.09)" : "none",
            transition: "box-shadow 0.3s, border-color 0.3s",
            width: "100%",
          }}
        >
          <div className="navbar-inner">
            <Logo />

            <div className="navbar-divider" />

            <nav
              className="nav-desktop"
              onMouseLeave={handleLeave}
            >
              {NAV_ITEMS.map((item) => (
                <NavButton
                  key={item.label}
                  item={item}
                  isOpen={openMenu === item.label}
                  onEnter={() => handleEnter(item.label)}
                />
              ))}
            </nav>

            <div style={{ flex: 1 }} className="nav-desktop" />

            <div className="navbar-right">
              {/* Search */}
              <div
                className={`search-box${searchOpen ? " open" : ""}`}
                style={{
                  display: "flex", alignItems: "center",
                  background: searchOpen ? GRAY : "transparent",
                  border: `1px solid ${searchOpen ? T.borderHover : "transparent"}`,
                  borderRadius: "8px", padding: "0 10px", height: "38px",
                  width: searchOpen ? "220px" : "38px",
                  transition: "all 0.25s ease", overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", display: "flex", alignItems: "center", padding: 0, flexShrink: 0 }}
                >
                  <Icon.Search />
                </button>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Rechercher…"
                  style={{
                    background: "none", border: "none", outline: "none", color: INK, fontSize: "13px",
                    width: searchOpen ? "100%" : "0",
                    marginLeft: searchOpen ? "8px" : "0",
                    opacity: searchOpen ? 1 : 0,
                    transition: "opacity 0.2s, margin 0.2s", flexShrink: 0,
                    minWidth: 0,
                  }}
                />
              </div>

              {/* Contact */}
              <Link href="/contact" className="contact-btn">
  <Icon.Phone />
  <span className="contact-btn-label">Contact</span>
</Link>

              {/* Hamburger */}
              <button
                className="nav-hamburger"
                onClick={() => setMobileOpen(true)}
                style={{ background: GRAY, border: `1px solid ${T.border}`, borderRadius: "8px", width: "40px", height: "38px", alignItems: "center", justifyContent: "center", color: T.textMuted, cursor: "pointer", flexShrink: 0 }}
              >
                <Icon.Menu />
              </button>
            </div>
          </div>
        </header>

        {currentItem && (
          <div
            onMouseEnter={() => { if (timerRef.current) clearTimeout(timerRef.current); }}
            onMouseLeave={handleLeave}
            style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999, pointerEvents: openMenu ? "auto" : "none" }}
          >
            <MegaMenu item={currentItem} visible={!!openMenu} top={0} />
          </div>
        )}
      </div>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}