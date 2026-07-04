"use client";

/**
 * BATIMATO — Explorer Page
 * ────────────────────────────────────
 * Route: /explorer  (app/explorer/page.tsx)
 * Stack: Next.js + TypeScript + Tailwind CSS + Framer Motion + Three.js
 * Dependencies: same as HeroSection (framer-motion, three, @types/three)
 *
 * WHAT THIS IS
 * A full catalog browser that mirrors every category, column and link from
 * the mega-menu in Navbar.tsx, styled to match HeroSection's dark/yellow
 * language, fronted by its own Three.js piece (a "radar" scene — a rotating
 * polar grid with a sweeping beam and three orbiting rings of nodes, one per
 * category). It intentionally does NOT reuse the paint-bucket scene: the
 * hero introduces the brand, this page is about scanning/searching a catalog,
 * so the visual metaphor is a radar rather than a product hero-shot.
 *
 * WIRING IT UP
 * In HeroSection.tsx, point the "Explorer Maintenant" button at this route,
 * e.g.:
 *
 *   import { useRouter } from "next/navigation";
 *   const router = useRouter();
 *   ...
 *   <motion.button onClick={() => router.push("/explorer")} ...>
 *
 * or swap the <motion.button> for a Next <Link href="/explorer"> wrapper.
 */

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import * as THREE from "three";
import Navbar from "@/components/navbar/page";
// ═══════════════════════════════════════════════════════════════════════════
// DATA — mirrors Navbar.tsx's NAV_ITEMS, enriched with an id/tagline/accent
// per category so this page can render richer section headers.
// ═══════════════════════════════════════════════════════════════════════════
type MegaLink = { label: string; href: string };
type MegaColumn = { title: string; image?: string; links: MegaLink[] };
type Category = {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  accent: string;
  columns: MegaColumn[];
};

const CATEGORIES: Category[] = [
  {
    id: "preparation-materiaux",
    label: "Préparation & Matériaux",
    icon: "/preparation.png",
    tagline: "Le socle de tout chantier réussi — supports, quincaillerie et protection.",
    accent: "#C9CDD3",
    columns: [
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
    id: "peintures",
    label: "Peinture",
    icon: "/peinture.png",
    tagline: "Des sous-couches aux finitions — la couleur, à l'intérieur comme dehors.",
    accent: "#FFC400",
    columns: [
      {
        title: "Sous-couche & Primaire",
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
        title: "Peinture Intérieur",
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
        title: "Peinture Extérieur",
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
    id: "outillage",
    label: "Outillage",
    icon: "/outrillage.png",
    tagline: "Électroportatif, outils à main et consommables pour aller vite, bien.",
    accent: "#4DA3FF",
    columns: [
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
        image: "/outillage3.png",
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

const INK = "#0A0A0A";
const YELLOW = "#FFC400";

// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS — "Radar Explorer" scene
// A polar grid floor with a rotating sweep beam, a slow-spinning wireframe
// core, and three tilted orbit rings (one per category, using its accent
// color) with nodes travelling around them. Deliberately distinct from the
// hero's paint-bucket-and-tools scene: no product geometry, no bucket — this
// is an instrument-panel / scanning metaphor to match "exploring a catalog."
// ═══════════════════════════════════════════════════════════════════════════
function RadarScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (mount.clientWidth === 0 || mount.clientHeight === 0) return;

    const isMobile = window.innerWidth < 768;
    let W = mount.clientWidth;
    let H = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 100);
    camera.position.set(0, 2.6, isMobile ? 6.4 : 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.maxWidth = "100%";
    mount.appendChild(renderer.domElement);

    // ── Polar grid floor (the "radar screen") ────────────────────────────────
    const grid = new THREE.PolarGridHelper(3.4, 16, 8, 64, 0x555555, 0x2a2a2a);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    grid.position.y = 0;
    scene.add(grid);

    // ── Sweeping radar beam: a stack of thin wedges fading into a trail ──────
    const sweepGroup = new THREE.Group();
    scene.add(sweepGroup);
    const WEDGES = 10;
    for (let i = 0; i < WEDGES; i++) {
      const thetaStart = -((i / WEDGES) * 0.9);
      const wedgeGeo = new THREE.CircleGeometry(3.4, 48, thetaStart, 0.9 / WEDGES + 0.01);
      const wedgeMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(YELLOW),
        transparent: true,
        opacity: 0.16 * (1 - i / WEDGES),
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const wedge = new THREE.Mesh(wedgeGeo, wedgeMat);
      wedge.rotation.x = -Math.PI / 2;
      wedge.position.y = 0.004;
      sweepGroup.add(wedge);
    }

    // ── Central wireframe core ────────────────────────────────────────────────
    const coreGeo = new THREE.IcosahedronGeometry(0.62, 1);
    const coreEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(coreGeo),
      new THREE.LineBasicMaterial({ color: new THREE.Color(YELLOW), transparent: true, opacity: 0.85 })
    );
    coreEdges.position.y = 1.5;
    scene.add(coreEdges);

    const coreGlow = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.5, 1),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(YELLOW), transparent: true, opacity: 0.06 })
    );
    coreGlow.position.copy(coreEdges.position);
    scene.add(coreGlow);

    // ── Orbit rings — one per category, tilted differently ───────────────────
    const ringDefs = CATEGORIES.map((c, i) => ({
      color: new THREE.Color(c.accent),
      radius: 1.55 + i * 0.42,
      tilt: (-0.5 + i * 0.5) * 0.7,
      speed: 0.22 + i * 0.07,
      nodeCount: 5 + i,
    }));

    const ringGroups: { group: THREE.Group; nodes: THREE.Mesh[]; def: (typeof ringDefs)[number] }[] = [];

    ringDefs.forEach((def) => {
      const group = new THREE.Group();
      group.position.copy(coreEdges.position);
      group.rotation.x = def.tilt;
      scene.add(group);

      const ringLine = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(
          new THREE.EllipseCurve(0, 0, def.radius, def.radius, 0, Math.PI * 2, false, 0).getPoints(96).map(p => new THREE.Vector3(p.x, 0, p.y))
        ),
        new THREE.LineBasicMaterial({ color: def.color, transparent: true, opacity: 0.45 })
      );
      group.add(ringLine);

      const nodes: THREE.Mesh[] = [];
      for (let i = 0; i < def.nodeCount; i++) {
        const node = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 12, 12),
          new THREE.MeshStandardMaterial({ color: def.color, emissive: def.color, emissiveIntensity: 1.1, roughness: 0.4 })
        );
        group.add(node);
        nodes.push(node);
      }
      ringGroups.push({ group, nodes, def });
    });

    // ── Particle field ────────────────────────────────────────────────────────
    const N = isMobile ? 70 : 140;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 1] = Math.random() * 5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: new THREE.Color(YELLOW), size: 0.018, transparent: true, opacity: 0.4 })));

    // ── Lights ─────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.PointLight(new THREE.Color(YELLOW), 3.2, 10);
    key.position.set(2, 3, 2.5);
    scene.add(key);
    const fill = new THREE.PointLight(0x4488ff, 1.4, 10);
    fill.position.set(-3, 1.5, -1);
    scene.add(fill);

    // ── Off-screen pause ─────────────────────────────────────────────────────
    let isVisible = true;
    const io = new IntersectionObserver((entries) => { isVisible = entries[0]?.isIntersecting ?? true; }, { threshold: 0.05 });
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!isVisible) return;
      const t = clock.getElapsedTime();

      sweepGroup.rotation.y = t * 0.6;
      coreEdges.rotation.y = t * 0.3;
      coreEdges.rotation.x = Math.sin(t * 0.4) * 0.15;
      coreGlow.rotation.copy(coreEdges.rotation);
      coreGlow.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
      key.intensity = 2.8 + Math.sin(t * 1.4) * 0.6;

      ringGroups.forEach(({ group, nodes, def }) => {
        group.rotation.y += 0.002;
        nodes.forEach((node, i) => {
          const a = t * def.speed + (i / nodes.length) * Math.PI * 2;
          node.position.set(Math.cos(a) * def.radius, Math.sin(t * 0.8 + i) * 0.06, Math.sin(a) * def.radius);
        });
      });

      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < N; i++) {
        pos[i * 3 + 1] -= 0.003;
        if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 5;
      }
      pGeo.attributes.position.needsUpdate = true;

      const camAngle = t * 0.06;
      camera.position.x = Math.sin(camAngle) * (isMobile ? 6.4 : 5.6);
      camera.position.z = Math.cos(camAngle) * (isMobile ? 6.4 : 5.6);
      camera.lookAt(0, 1.2, 0);

      renderer.render(scene, camera);
    };
    tick();

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const cw = Math.round(entry.contentRect.width);
      const ch = Math.round(entry.contentRect.height);
      if (cw === 0 || ch === 0 || (cw === W && ch === H)) return;
      W = cw; H = ch;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      renderer.dispose();
      pGeo.dispose();
      coreGeo.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full min-w-0" />;
}

// ═══════════════════════════════════════════════════════════════════════════
// UI PIECES
// ═══════════════════════════════════════════════════════════════════════════

function ProductImage({ src, alt, accent }: { src?: string; alt: string; accent: string }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${accent}22, transparent 70%)` }}
      >
        <span className="font-black text-3xl opacity-40" style={{ color: accent }}>
          {alt.trim().charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={() => setFailed(true)} className="w-full h-full object-contain" />
  );
}

function highlight(label: string, query: string) {
  if (!query) return label;
  const idx = label.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return label;
  return (
    <>
      {label.slice(0, idx)}
      <mark style={{ background: "transparent", color: YELLOW, fontWeight: 800 }}>{label.slice(idx, idx + query.length)}</mark>
      {label.slice(idx + query.length)}
    </>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function CategorySection({ cat, query }: { cat: Category; query: string }) {
  const q = query.trim().toLowerCase();

  const filteredColumns = useMemo(() => {
    if (!q) return cat.columns;
    return cat.columns
      .map((col) => ({
        ...col,
        links: col.links.filter((l) => l.label.toLowerCase().includes(q) || col.title.toLowerCase().includes(q)),
      }))
      .filter((col) => col.links.length > 0 || col.title.toLowerCase().includes(q));
  }, [cat.columns, q]);

  if (q && filteredColumns.length === 0) return null;

  const resultCount = filteredColumns.reduce((n, c) => n + c.links.length, 0);

  return (
    <motion.section
      id={cat.id}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="scroll-mt-28 py-16 sm:py-20 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${cat.accent}18`, border: `1px solid ${cat.accent}40` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.icon} alt="" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-tight" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
                {cat.label}
              </h2>
              <p className="text-white/45 text-sm mt-1 max-w-md">{cat.tagline}</p>
            </div>
          </div>
          <span
            className="text-[0.65rem] tracking-[0.18em] uppercase font-bold px-3 py-1.5 rounded-full"
            style={{ color: cat.accent, background: `${cat.accent}14`, border: `1px solid ${cat.accent}35` }}
          >
            {q ? `${resultCount} résultat${resultCount > 1 ? "s" : ""}` : `${cat.columns.reduce((n, c) => n + c.links.length, 0)} références`}
          </span>
        </motion.div>

        {/* Columns grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredColumns.map((col) => (
            <motion.div
              key={col.title}
              variants={fadeUp}
              className="group relative rounded-2xl overflow-hidden flex flex-col"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* image */}
              <div className="relative w-full h-[140px] border-b border-white/[0.07] overflow-hidden">
                <ProductImage src={col.image} alt={col.title} accent={cat.accent} />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(180deg, transparent 40%, ${INK} 100%)` }}
                />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="text-white font-bold text-[0.92rem] leading-snug mb-3 pb-3 border-b"
                  style={{ borderColor: `${cat.accent}30` }}
                >
                  {highlight(col.title, q)}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="flex items-start gap-2 text-white/55 text-[0.8rem] leading-snug hover:text-white transition-colors duration-150"
                      >
                        <svg
                          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={cat.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                          className="mt-[3px] flex-shrink-0 opacity-70 group-hover:translate-x-0.5 transition-transform"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        <span>{highlight(link.label, q)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function QuickNav({ activeId, query, onQueryChange }: { activeId: string; query: string; onQueryChange: (v: string) => void }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/[0.07]" style={{ background: "rgba(10,10,10,0.82)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3.5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollTo(cat.id)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full text-[0.75rem] font-bold whitespace-nowrap transition-all duration-200"
              style={{
                background: activeId === cat.id ? `${cat.accent}20` : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeId === cat.id ? cat.accent : "rgba(255,255,255,0.09)"}`,
                color: activeId === cat.id ? cat.accent : "rgba(255,255,255,0.55)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.accent }} />
              {cat.label}
            </button>
          ))}
        </div>

        <div
          className="flex items-center gap-2 px-3.5 h-[38px] rounded-full flex-shrink-0 w-full sm:w-[240px]"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Chercher un produit…"
            className="bg-transparent outline-none border-none text-white text-[0.8rem] placeholder-white/30 w-full"
          />
          {query && (
            <button onClick={() => onQueryChange("")} className="text-white/40 hover:text-white flex-shrink-0" aria-label="Effacer la recherche">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function ExplorerPage() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);

  useEffect(() => {
    const sections = CATEGORIES.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const totalRefs = useMemo(() => CATEGORIES.reduce((n, c) => n + c.columns.reduce((m, col) => m + col.links.length, 0), 0), []);
  const totalMatches = useMemo(() => {
    if (!query.trim()) return totalRefs;
    const q = query.trim().toLowerCase();
    return CATEGORIES.reduce(
      (n, c) => n + c.columns.reduce((m, col) => m + col.links.filter((l) => l.label.toLowerCase().includes(q) || col.title.toLowerCase().includes(q)).length, 0),
      0
    );
  }, [query, totalRefs]);

  return ( 
  <>
 
  <Navbar />
    <main className="w-full min-h-screen overflow-x-hidden" style={{ background: INK }}>
      {/* ═══ Banner ═══ */}
      <section className="relative w-full overflow-hidden border-b border-white/[0.07]" style={{ minHeight: "clamp(420px, 62vh, 640px)" }}>
        <div className="absolute inset-0">
          <RadarScene />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 30%, transparent 0%, #0A0A0A 85%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col items-center justify-center text-center pt-24 pb-14" style={{ minHeight: "clamp(420px, 62vh, 640px)" }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 text-[#FFC400] text-[0.7rem] tracking-[0.28em] uppercase font-bold mb-6"
          >
            <span className="inline-block w-7 h-px bg-gradient-to-r from-[#FFC400] to-transparent" />
            Catalogue complet
            <span className="inline-block w-7 h-px bg-gradient-to-l from-[#FFC400] to-transparent" />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white font-black leading-[0.95] tracking-[-0.03em] mb-5"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.2rem)" }}
          >
            Explorez Tout <span style={{ color: "transparent", WebkitTextStroke: "1.5px #FFC400" }}>l'Univers</span> Batimato
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 max-w-xl mb-2"
            style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}
          >
            {totalRefs}+ références réparties en préparation, peinture et outillage — cherchez ou parcourez par rayon.
          </motion.p>
        </div>
      </section>

      {/* ═══ Sticky search + quick nav ═══ */}
      <QuickNav activeId={activeId} query={query} onQueryChange={setQuery} />

      {/* ═══ Results summary (only while searching) ═══ */}
      <AnimatePresence>
        {query.trim() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-6 lg:px-12 overflow-hidden"
          >
            <p className="text-white/40 text-xs pt-5">
              {totalMatches > 0
                ? <>{totalMatches} résultat{totalMatches > 1 ? "s" : ""} pour « <span className="text-[#FFC400]">{query}</span> »</>
                : <>Aucun résultat pour « <span className="text-[#FFC400]">{query}</span> ». Essayez un autre mot-clé.</>}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Category sections ═══ */}
      {CATEGORIES.map((cat) => (
        <CategorySection key={cat.id} cat={cat} query={query} />
      ))}

      {/* ═══ CTA footer ═══ */}
      <section className="relative py-20 border-t border-white/[0.07] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(255,196,0,0.10) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-white font-black mb-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}>
            Vous ne trouvez pas ce qu'il vous faut ?
          </h2>
          <p className="text-white/45 mb-8 text-sm">
            Nos équipes vous conseillent en magasin ou par téléphone sur l'ensemble de nos 500+ produits.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2.5 px-7 h-[52px] rounded-[6px] bg-[#FFC400] text-[#1A1A1A] text-[0.82rem] font-extrabold tracking-[0.08em] uppercase no-underline"
          >
            Contacter Batimato
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </main>
     </>
  );
}