"use client";

/**
 * BATIMATO — Futuristic Hero Section
 * ────────────────────────────────────
 * Stack: Next.js + TypeScript + Tailwind CSS + Framer Motion + Three.js
 * Place in /components/HeroSection.tsx
 * Dependencies: npm install framer-motion three @types/three
 */

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  animate,
} from "framer-motion";
import * as THREE from "three";
import Batimatohomepage from "@/components/Batimatohomepage/page";
import Ballpit from "@/components/Ballpit";
import LightPillar from "@/components/LightPillar";
import Loader from "@/components/Loader/page";

// ─── Magnetic button hook ─────────────────────────────────────────────────────
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }, [strength, x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", onMove as EventListener);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove as EventListener);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [onMove, onLeave]);

  return { ref, sx, sy };
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 2.2, ease: "easeOut", onUpdate: (v) => setVal(Math.floor(v)) });
    return c.stop;
  }, [to]);
  return <>{val}{suffix}</>;
}

// ─── Background architectural SVG grid ───────────────────────────────────────
function ArchGrid() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <pattern id="bg-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0L0 0 0 60" fill="none" stroke="rgba(255,196,0,0.07)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="grid-vignette" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-grid)" />
      <rect width="100%" height="100%" fill="url(#grid-vignette)" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREE.JS HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Shared yellow emissive material */
const mkYellow = () => new THREE.MeshStandardMaterial({
  color: new THREE.Color("#FFC400"),
  emissive: new THREE.Color("#FFC400"),
  emissiveIntensity: 0.9,
  metalness: 0.5,
  roughness: 0.15,
});

/** Dark metal material */
const mkMetal = (hex = 0x1c1c1c, roughness = 0.25) => new THREE.MeshStandardMaterial({
  color: hex,
  metalness: 0.92,
  roughness,
});

/** Yellow edge lines on any geometry */
const mkEdges = (geo: THREE.BufferGeometry, color = "#FFC400") =>
  new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: new THREE.Color(color) }));

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD: REALISTIC PAINT BUCKET
// ═══════════════════════════════════════════════════════════════════════════════
function buildBucket(scene: THREE.Scene) {
  const group = new THREE.Group();
  scene.add(group);

  // ── 1. Canvas label texture ──────────────────────────────────────────────────
  const lc = document.createElement("canvas");
  lc.width = 1024; lc.height = 512;
  const ctx = lc.getContext("2d")!;

  // Base: dark steel gradient
  const baseG = ctx.createLinearGradient(0, 0, 1024, 512);
  baseG.addColorStop(0,    "#232323");
  baseG.addColorStop(0.35, "#1a1a1a");
  baseG.addColorStop(0.65, "#212121");
  baseG.addColorStop(1,    "#181818");
  ctx.fillStyle = baseG;
  ctx.fillRect(0, 0, 1024, 512);

  // Brushed metal streaks
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 1024;
    ctx.strokeStyle = `rgba(255,255,255,${0.008 + Math.random() * 0.022})`;
    ctx.lineWidth   = 0.8 + Math.random() * 2.2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 30, 512);
    ctx.stroke();
  }

  // Subtle horizontal highlight band (top reflection)
  const topRefl = ctx.createLinearGradient(0, 0, 0, 90);
  topRefl.addColorStop(0,   "rgba(255,255,255,0.07)");
  topRefl.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = topRefl;
  ctx.fillRect(0, 0, 1024, 90);

  // Bottom shadow
  const botShadow = ctx.createLinearGradient(0, 400, 0, 512);
  botShadow.addColorStop(0,   "rgba(0,0,0,0)");
  botShadow.addColorStop(1,   "rgba(0,0,0,0.45)");
  ctx.fillStyle = botShadow;
  ctx.fillRect(0, 400, 1024, 112);

  // Yellow accent stripe
  ctx.fillStyle = "#FFC400";
  ctx.fillRect(0, 310, 1024, 30);
  // Stripe inner highlight
  const stripeHL = ctx.createLinearGradient(0, 310, 0, 340);
  stripeHL.addColorStop(0,   "rgba(255,255,255,0.3)");
  stripeHL.addColorStop(0.4, "rgba(255,255,255,0)");
  ctx.fillStyle = stripeHL;
  ctx.fillRect(0, 310, 1024, 30);
  // Stripe glow bloom
  const stripeGlow = ctx.createLinearGradient(0, 285, 0, 370);
  stripeGlow.addColorStop(0,   "rgba(255,196,0,0)");
  stripeGlow.addColorStop(0.5, "rgba(255,196,0,0.14)");
  stripeGlow.addColorStop(1,   "rgba(255,196,0,0)");
  ctx.fillStyle = stripeGlow;
  ctx.fillRect(0, 285, 1024, 85);

  // ── BatiMato wordmark ────────────────────────────────────────────────────────
  ctx.save();
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";

  // Wide outer glow
  ctx.shadowColor = "#FFC400";
  ctx.shadowBlur  = 48;
  ctx.fillStyle   = "rgba(255,196,0,0.18)";
  ctx.font        = "900 118px 'Arial Black', Arial, sans-serif";
  ctx.fillText("BatiMato", 512, 185);

  // Medium glow
  ctx.shadowBlur  = 20;
  ctx.fillStyle   = "rgba(255,196,0,0.55)";
  ctx.fillText("BatiMato", 512, 185);

  // Crisp yellow
  ctx.shadowBlur = 6;
  ctx.fillStyle  = "#FFC400";
  ctx.fillText("BatiMato", 512, 185);

  // White highlight — top 40% of glyphs
  const wh = ctx.createLinearGradient(0, 120, 0, 240);
  wh.addColorStop(0,    "rgba(255,255,255,0.65)");
  wh.addColorStop(0.45, "rgba(255,255,255,0.1)");
  wh.addColorStop(1,    "rgba(255,255,255,0)");
  ctx.fillStyle  = wh;
  ctx.shadowBlur = 0;
  ctx.fillText("BatiMato", 512, 185);
  ctx.restore();

  // Tagline
  ctx.save();
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.font         = "600 26px Arial, sans-serif";
  ctx.fillStyle    = "rgba(255,255,255,0.38)";
  ctx.letterSpacing = "10px";
  ctx.fillText("MATÉRIAUX & OUTILLAGE", 512, 262);
  ctx.restore();

  // Dashes flanking tagline
  ctx.strokeStyle = "rgba(255,196,0,0.5)";
  ctx.lineWidth   = 1.5;
  ctx.beginPath(); ctx.moveTo(55, 262); ctx.lineTo(185, 262); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(839, 262); ctx.lineTo(969, 262); ctx.stroke();

  // Bottom row
  ctx.save();
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.font         = "500 18px Arial, sans-serif";
  ctx.fillStyle    = "rgba(255,196,0,0.55)";
  ctx.fillText("★  QUALITÉ CERTIFIÉE ISO 9001  ★", 512, 435);
  ctx.restore();

  // Rivet dots on left/right edges
  [40, 110, 190, 270, 360, 450].forEach(y => {
    [20, 1004].forEach(x => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#2e2e2e";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  });

  const labelTex = new THREE.CanvasTexture(lc);
  labelTex.needsUpdate = true;

  // ── 2. Bucket geometry pieces ────────────────────────────────────────────────

  // Main body (slightly tapered cylinder)
  const bodyGeo = new THREE.CylinderGeometry(0.92, 0.76, 1.65, 128, 4, true);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: labelTex,
    metalness: 0.82,
    roughness: 0.22,
    envMapIntensity: 1.2,
  });
  group.add(new THREE.Mesh(bodyGeo, bodyMat));

  // Bottom cap
  const botCapMat = mkMetal(0x141414, 0.3);
  const botCap = new THREE.Mesh(new THREE.CircleGeometry(0.76, 64), botCapMat);
  botCap.rotation.x = -Math.PI / 2;
  botCap.position.y = -0.825;
  group.add(botCap);

  // Bottom rim ring
  const botRim = new THREE.Mesh(new THREE.TorusGeometry(0.77, 0.025, 16, 64), mkMetal(0x2a2a2a, 0.2));
  botRim.position.y = -0.8;
  botRim.rotation.x = Math.PI / 2;
  group.add(botRim);

  // Top rim ring (thicker, more prominent)
  const topRimMat = mkMetal(0x2e2e2e, 0.18);
  const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.94, 0.038, 20, 128), topRimMat);
  topRim.position.y = 0.84;
  topRim.rotation.x = Math.PI / 2;
  group.add(topRim);

  // Lid disc
  const lidMat = mkMetal(0x202020, 0.2);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.93, 0.93, 0.055, 128), lidMat);
  lid.position.y = 0.875;
  group.add(lid);

  // Lid center circle (recessed, shows paint color)
  const lidCenterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#FFC400"),
    emissive: new THREE.Color("#FFC400"),
    emissiveIntensity: 0.25,
    metalness: 0.4,
    roughness: 0.55,
  });
  const lidCenter = new THREE.Mesh(new THREE.CircleGeometry(0.35, 64), lidCenterMat);
  lidCenter.rotation.x = -Math.PI / 2;
  lidCenter.position.y = 0.905;
  group.add(lidCenter);

  // Lid seal ring
  const lidSeal = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.018, 12, 64), mkMetal(0x333333, 0.35));
  lidSeal.position.y = 0.902;
  lidSeal.rotation.x = Math.PI / 2;
  group.add(lidSeal);

  // Yellow accent band
  const bandMat = mkYellow();
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.935, 0.935, 0.065, 128), bandMat);
  band.position.y = 0.64;
  group.add(band);

  // Second thinner accent band at bottom
  const band2 = new THREE.Mesh(new THREE.CylinderGeometry(0.79, 0.79, 0.04, 64), mkYellow());
  band2.position.y = -0.72;
  group.add(band2);

  // ── 3. Handle ─────────────────────────────────────────────────────────────
  const handleCurve = new THREE.CatmullRomCurve3(
    new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.88, 0.88, 0),
      new THREE.Vector3(0, 1.95, 0),
      new THREE.Vector3(0.88, 0.88, 0)
    ).getPoints(60)
  );
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x777700,
    emissive: new THREE.Color("#FFC400"),
    emissiveIntensity: 0.3,
    metalness: 0.95,
    roughness: 0.12,
  });
  group.add(new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 60, 0.038, 12, false), handleMat));

  // Handle pivot knobs (left & right)
  [-1, 1].forEach(side => {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), mkMetal(0x444400, 0.2));
    knob.position.set(side * 0.88, 0.88, 0);
    group.add(knob);
  });

  // ── 4. Dripping yellow paint (more realistic) ─────────────────────────────
  const dripMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#FFC400"),
    emissive: new THREE.Color("#FFC400"),
    emissiveIntensity: 0.6,
    roughness: 0.08,
    metalness: 0.1,
  });

  const dripDefs = [
    { x:  0.32, z:  0.70, h: 0.42, rTop: 0.038, rBot: 0.008 },
    { x: -0.55, z:  0.48, h: 0.30, rTop: 0.030, rBot: 0.006 },
    { x:  0.70, z: -0.38, h: 0.52, rTop: 0.042, rBot: 0.010 },
    { x: -0.20, z: -0.75, h: 0.22, rTop: 0.025, rBot: 0.005 },
  ];

  dripDefs.forEach(({ x, z, h, rTop, rBot }) => {
    // Drip stem (thin teardrop-like taper)
    const drip = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, 16), dripMat);
    drip.position.set(x, 0.875 - h / 2, z);
    group.add(drip);

    // Drip bulb at bottom
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(rTop * 1.8, 16, 16), dripMat);
    bulb.position.set(x, 0.875 - h - rTop * 1.6, z);
    bulb.scale.y = 1.35;
    group.add(bulb);

    // Small spread puddle ring on the bucket surface
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(rTop * 1.0, rTop * 2.2, 24),
      new THREE.MeshStandardMaterial({ color: new THREE.Color("#FFC400"), emissive: new THREE.Color("#FFC400"), emissiveIntensity: 0.4, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.877, z);
    group.add(ring);
  });

  // Paint pool on the lid
  const poolMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#FFC400"),
    emissive: new THREE.Color("#FFC400"),
    emissiveIntensity: 0.3,
    roughness: 0.05,
    metalness: 0.05,
  });
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.28, 64), poolMat);
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(-0.15, 0.908, 0.1);
  group.add(pool);

  return { group, labelTex, bodyMat };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD: ELECTRIC DRILL (orbiting tool #1)
// ═══════════════════════════════════════════════════════════════════════════════
function buildDrill(scene: THREE.Scene) {
  const g = new THREE.Group();
  scene.add(g);

  const bodyMat = mkMetal(0x111111, 0.35);
  const accentMat = mkYellow();
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x080808, metalness: 0.1, roughness: 0.85 });

  // Main body barrel
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.55, 32), bodyMat);
  barrel.rotation.z = Math.PI / 2;
  g.add(barrel);

  // Gearbox (front bulge)
  const gearbox = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.2, 32), bodyMat);
  gearbox.rotation.z = Math.PI / 2;
  gearbox.position.x = 0.32;
  g.add(gearbox);

  // Chuck (drill bit holder)
  const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.12, 16), mkMetal(0x333300, 0.15));
  chuck.rotation.z = Math.PI / 2;
  chuck.position.x = 0.46;
  g.add(chuck);

  // Drill bit
  const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.003, 0.35, 8), mkMetal(0x888800, 0.12));
  bit.rotation.z = Math.PI / 2;
  bit.position.x = 0.70;
  g.add(bit);

  // Handle (pistol grip)
  const gripCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.02, 0,    0),
    new THREE.Vector3(0.04, -0.12, 0),
    new THREE.Vector3(0.02, -0.28, 0),
    new THREE.Vector3(-0.02,-0.35, 0),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(gripCurve, 20, 0.075, 12, false), rubberMat));

  // Trigger
  const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.1, 0.05), mkMetal(0x333333, 0.4));
  trigger.position.set(0.08, -0.12, 0);
  g.add(trigger);

  // Yellow accent stripe on body
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.132, 0.132, 0.06, 32), accentMat);
  stripe.rotation.z = Math.PI / 2;
  stripe.position.x = 0.05;
  g.add(stripe);

  // Battery pack at bottom of grip
  const battery = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.14), bodyMat);
  battery.position.set(-0.02, -0.42, 0);
  g.add(battery);
  // Battery accent lines
  const battEdge = new THREE.Mesh(new THREE.BoxGeometry(0.162, 0.012, 0.142), accentMat);
  battEdge.position.set(-0.02, -0.385, 0);
  g.add(battEdge);

  // Ventilation slots on barrel
  for (let i = 0; i < 4; i++) {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.03, 0.008), mkMetal(0x050505, 0.9));
    slot.position.set(-0.1 + i * 0.04, 0.135, 0);
    g.add(slot);
  }

  // Glow light emanating from bit tip
  const drillLight = new THREE.PointLight(new THREE.Color("#FFC400"), 0.8, 1.2);
  drillLight.position.set(0.85, 0, 0);
  g.add(drillLight);

  return g;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD: ELECTRIC CABLE REEL / EXTENSION CORD (orbiting tool #2)
// ═══════════════════════════════════════════════════════════════════════════════
function buildCableReel(scene: THREE.Scene) {
  const g = new THREE.Group();
  scene.add(g);

  const reelMat  = mkMetal(0x151515, 0.4);
  const rimMat   = mkYellow();
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x1a0a0a, metalness: 0.1, roughness: 0.8 });

  // Central hub
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.32, 32), reelMat);
  hub.rotation.x = Math.PI / 2;
  g.add(hub);

  // Left disc
  const discL = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.025, 48), reelMat);
  discL.rotation.x = Math.PI / 2;
  discL.position.z = 0.17;
  g.add(discL);

  // Right disc
  const discR = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.025, 48), reelMat);
  discR.rotation.x = Math.PI / 2;
  discR.position.z = -0.17;
  g.add(discR);

  // Yellow accent rims on discs
  [0.175, -0.175].forEach(z => {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.018, 12, 48), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.z = z;
    g.add(rim);
  });

  // Coiled cable (torus approximation)
  for (let i = 0; i < 5; i++) {
    const r = 0.12 + i * 0.024;
    const coil = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 8, 48), cableMat);
    coil.rotation.x = Math.PI / 2;
    coil.position.z = (i - 2) * 0.022;
    g.add(coil);
  }

  // Plug at end of cable
  const plug = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.04), mkMetal(0x202020, 0.5));
  plug.position.set(0.32, 0, 0.18);
  g.add(plug);
  // Plug prongs
  [0.015, -0.015].forEach(dx => {
    const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.04, 8), mkMetal(0x888800, 0.1));
    prong.position.set(0.32 + dx, 0, 0.22);
    g.add(prong);
  });

  // Handle / crank
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 12), rimMat);
  crank.rotation.z = Math.PI / 2;
  crank.position.set(0.15, 0, 0.19);
  g.add(crank);

  return g;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD: CIRCUIT BREAKER / ELECTRICAL BOX (orbiting tool #3)
// ═══════════════════════════════════════════════════════════════════════════════
function buildCircuitBreaker(scene: THREE.Scene) {
  const g = new THREE.Group();
  scene.add(g);

  const caseMat    = mkMetal(0x0e0e0e, 0.5);
  const accentMat  = mkYellow();
  const screenMat  = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#001a33"),
    emissive: new THREE.Color("#00aaff"),
    emissiveIntensity: 0.55,
    metalness: 0.1,
    roughness: 0.3,
  });

  // Main box body
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.52, 0.12), caseMat);
  g.add(box);

  // Yellow accent frame edge
  g.add(mkEdges(new THREE.BoxGeometry(0.38, 0.52, 0.12)));

  // Front panel recess
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.44, 0.01), mkMetal(0x161616, 0.6));
  panel.position.z = 0.065;
  g.add(panel);

  // Mini "screen" display
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.09), screenMat);
  screen.position.set(-0.06, 0.14, 0.072);
  g.add(screen);

  // Toggle switches (3 breakers)
  [-0.08, 0, 0.08].forEach((y, i) => {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.03), mkMetal(i === 1 ? 0x003300 : 0x220000, 0.4));
    sw.position.set(0.09, y - 0.04, 0.075);
    g.add(sw);

    // Switch glow dot
    const dotMat = new THREE.MeshStandardMaterial({
      color: i === 1 ? new THREE.Color("#00ff44") : new THREE.Color("#ff2200"),
      emissive: i === 1 ? new THREE.Color("#00ff44") : new THREE.Color("#ff2200"),
      emissiveIntensity: 1.2,
    });
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), dotMat);
    dot.position.set(0.09, y - 0.015, 0.085);
    g.add(dot);
  });

  // Terminal screws at top
  for (let i = 0; i < 3; i++) {
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.025, 12), mkMetal(0x555500, 0.2));
    screw.position.set(-0.08 + i * 0.08, 0.22, 0.072);
    g.add(screw);
  }

  // Warning label stripe
  const warnMat = accentMat.clone();
  const warn = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.03), warnMat);
  warn.position.set(0, -0.2, 0.072);
  g.add(warn);

  // Yellow accent bar on top
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.025, 0.12), accentMat);
  topBar.position.y = 0.27;
  g.add(topBar);

  // Mounting tabs
  [-0.17, 0.17].forEach(x => {
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.025), caseMat);
    tab.position.set(x, 0, -0.072);
    g.add(tab);
  });

  return g;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD: PAINT ROLLER (orbiting tool #4)
// ═══════════════════════════════════════════════════════════════════════════════
function buildPaintRoller(scene: THREE.Scene) {
  const g = new THREE.Group();
  scene.add(g);

  const handleMat = mkMetal(0x1a1a1a, 0.3);
  const rollerMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#FFC400"),
    emissive: new THREE.Color("#FFC400"),
    emissiveIntensity: 0.35,
    roughness: 0.75,
    metalness: 0.05,
  });

  // Telescopic handle
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.7, 16), handleMat);
  handle.rotation.z = Math.PI / 2;
  handle.position.x = -0.35;
  g.add(handle);

  // Yellow accent rings on handle
  [-0.42, -0.18, 0.05].forEach(x => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.006, 8, 24), mkYellow());
    ring.rotation.y = Math.PI / 2;
    ring.position.x = x;
    g.add(ring);
  });

  // L-bracket arm
  const armV = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.22, 12), handleMat);
  armV.position.set(0.08, 0.11, 0);
  g.add(armV);
  const armH = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.36, 12), handleMat);
  armH.rotation.z = Math.PI / 2;
  armH.position.set(0.26, 0.22, 0);
  g.add(armH);

  // Roller cylinder (thick)
  const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.34, 32), rollerMat);
  roller.rotation.z = Math.PI / 2;
  roller.position.set(0.26, 0.22, 0);
  g.add(roller);

  // End caps
  [-0.18, 0.18].forEach(x => {
    const cap = new THREE.Mesh(new THREE.CircleGeometry(0.072, 32), handleMat);
    cap.rotation.y = Math.PI / 2;
    cap.position.set(0.26 + x, 0.22, 0);
    g.add(cap);
  });

  // Yellow paint drip on roller face
  const dripRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.065, 0.01, 8, 32),
    new THREE.MeshStandardMaterial({ color: new THREE.Color("#FFC400"), emissive: new THREE.Color("#FFC400"), emissiveIntensity: 0.6 })
  );
  dripRing.rotation.y = Math.PI / 2;
  dripRing.position.set(0.44, 0.22, 0);
  g.add(dripRing);

  return g;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN THREE.JS SCENE
// ═══════════════════════════════════════════════════════════════════════════════
function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 100);
    camera.position.set(0, 0.2, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // ── Build central bucket ──────────────────────────────────────────────────
    const { group: bucketGroup, labelTex, bodyMat } = buildBucket(scene);

    // ── Build orbiting electrical / painting tools ────────────────────────────
    const drill    = buildDrill(scene);
    const reel     = buildCableReel(scene);
    const breaker  = buildCircuitBreaker(scene);
    const roller   = buildPaintRoller(scene);

    // Scale tools down — they orbit around the bucket
    drill.scale.setScalar(0.55);
    reel.scale.setScalar(0.52);
    breaker.scale.setScalar(0.5);
    roller.scale.setScalar(0.6);

    // ── Particle field ────────────────────────────────────────────────────────
    const N = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: new THREE.Color("#FFC400"), size: 0.02, transparent: true, opacity: 0.5, sizeAttenuation: true,
    })));

    // ── Light rig ─────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    // Key light — warm yellow from front-right
    const keyLight = new THREE.PointLight(new THREE.Color("#FFC400"), 5.0, 12);
    keyLight.position.set(2.5, 3, 3.5);
    scene.add(keyLight);

    // Fill light — cool blue from left
    const fillLight = new THREE.PointLight(0x4488ff, 2.0, 10);
    fillLight.position.set(-3.5, 1, -1);
    scene.add(fillLight);

    // Top directional
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, 6, 4);
    scene.add(dirLight);

    // Pulsing under-glow
    const underGlow = new THREE.PointLight(new THREE.Color("#FFC400"), 1.8, 5);
    underGlow.position.set(0, -1.5, 1.5);
    scene.add(underGlow);

    // Rim light — yellow from behind
    const rimLight = new THREE.PointLight(new THREE.Color("#FFE066"), 2.5, 8);
    rimLight.position.set(0, 0, -3);
    scene.add(rimLight);

    // ── Mouse tracking ────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      mouseRef.current.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Render loop ───────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf: number;

    // Orbit configs for each tool: { obj, radius, speed, phase, yBob, yOffset, selfRotSpeed }
    const orbiters = [
      { obj: drill,   radius: 2.4, speed: 0.38, phase: 0,              yBob: 0.6, yOff:  0.3, sr: new THREE.Vector3(0, 0.015, 0.008) },
      { obj: reel,    radius: 2.2, speed: 0.30, phase: Math.PI * 0.5,  yBob: 0.5, yOff: -0.2, sr: new THREE.Vector3(0.008, 0.01, 0) },
      { obj: breaker, radius: 2.6, speed: 0.22, phase: Math.PI,        yBob: 0.7, yOff:  0.1, sr: new THREE.Vector3(0, 0.012, 0.006) },
      { obj: roller,  radius: 2.3, speed: 0.34, phase: Math.PI * 1.5,  yBob: 0.55,yOff:  0.4, sr: new THREE.Vector3(0.006, 0.014, 0) },
    ];

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t  = clock.getElapsedTime();
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Central bucket — float + slow rotate + mouse tilt
      bucketGroup.position.y = Math.sin(t * 0.85) * 0.1;
      bucketGroup.rotation.y = t * 0.22 + mx * 0.25;
      bucketGroup.rotation.x = my * 0.1;

      // Lights pulse
      keyLight.intensity   = 4.5 + Math.sin(t * 1.3) * 0.8;
      underGlow.intensity  = 1.4 + Math.sin(t * 2.5) * 0.7;
      rimLight.intensity   = 2.0 + Math.sin(t * 0.9) * 0.6;

      // Orbiting tools
      orbiters.forEach(({ obj, radius, speed, phase, yBob, yOff, sr }) => {
        const a = t * speed + phase;
        // Elliptical orbit in XZ plane, slight Y bob
        obj.position.set(
          Math.cos(a) * radius,
          yOff + Math.sin(t * 0.6 + phase) * yBob * 0.4,
          Math.sin(a) * radius * 0.45
        );
        // Face toward center + self-rotate
        obj.rotation.y += sr.y;
        obj.rotation.x += sr.x;
        obj.rotation.z += sr.z;
      });

      // Particles drift
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < N; i++) {
        pos[i * 3 + 1] += 0.0025;
        if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Camera subtle parallax
      camera.position.x += (mx * 0.35 - camera.position.x) * 0.04;
      camera.position.y += (my * 0.2 + 0.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.1, 0);

      renderer.render(scene, camera);
    };
    tick();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      labelTex.dispose();
      bodyMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY      = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const sceneY     = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const scrollFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const magPrimary   = useMagnetic(0.4);
  const magSecondary = useMagnetic(0.3);

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.35 } },
  };
  const fadeUp = {
    hidden:   { opacity: 0, y: 38 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] } },
  };
  const fadeIn = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.95 } },
  };

  const stats = [
    { n: 500,   sfx: "+",    label: "Produits"    },
    { n: 15,    sfx: " ans", label: "D'expertise" },
    { n: 20000, sfx: "+",    label: "Clients"     },
  ] as const;

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* ── Loading screen — sits above everything until assets/scene are ready ── */}
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* ── Layered background ──────────────────────────────────────────────────
          1) LightPillar sits at the very back, filling the hero.
          2) Ballpit stacks directly on top of it, transparent canvas so the
             pillar's glow shows through behind the balls. */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Layer 1 — Light Pillar (base) */}
        {/* <div className="absolute inset-0">
          <LightPillar
            topColor="#ffb227"
            bottomColor="#fff39f"
            intensity={1.4}
            rotationSpeed={1.3}
            glowAmount={0.002}
            pillarWidth={3}
            pillarHeight={0.4}
            noiseIntensity={0.5}
            pillarRotation={25}
            interactive={false}
            mixBlendMode="screen"
            quality="high"
          />
        </div> */}
{/*  */}
        {/* Layer 2 — Ballpit (on top of the pillar) */}
        {/* <div className="absolute inset-0">
          <Ballpit
            count={70}
            gravity={0.01}
            friction={0.9975}
            wallBounce={0.95}
            followCursor
            colors={["#fff727"]}
          />
        </div> */}
      </div>

      <ArchGrid />

      {/* Left yellow ambient glow */}
      <div aria-hidden="true" className="absolute -top-[10%] -left-[5%] w-[55vw] h-[55vw] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(255,196,0,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />

      {/* Bottom-right cool glow */}
      <div aria-hidden="true" className="absolute -bottom-[5%] -right-[5%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(60,80,220,0.09) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* Scanline texture */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)" }} />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center min-h-screen gap-0">

          {/* ════ LEFT — Copy ════ */}
          <motion.div style={{ y: textY }} className="flex-1 flex flex-col items-start z-10 order-2 lg:order-1 py-24 lg:py-0">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full">

              {/* Eyebrow */}
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2.5 text-[#FFC400] text-[0.72rem] tracking-[0.3em] uppercase font-bold">
                  <span className="inline-block w-7 h-px bg-gradient-to-r from-[#FFC400] to-transparent" />
                  BATIMATO — Matériaux de construction
                  <span className="inline-block w-7 h-px bg-gradient-to-l from-[#FFC400] to-transparent" />
                </span>
              </motion.div>

              {/* H1 line 1 */}
              <motion.div variants={fadeUp} className="mb-1">
                <h1 className="text-white font-black leading-[0.93] tracking-[-0.03em]"
                    style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}>
                  Donnez Vie
                </h1>
              </motion.div>

              {/* H1 line 2 — outlined */}
              <motion.div variants={fadeUp} className="mb-8">
                <h1 className="font-black leading-[0.93] tracking-[-0.03em]"
                    style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", color: "transparent", WebkitTextStroke: "2px #FFC400", textShadow: "0 0 45px rgba(255,196,0,0.4)" }}>
                  à Vos Murs
                </h1>
              </motion.div>

              {/* Subtext */}
              <motion.p variants={fadeUp} className="text-white/50 leading-relaxed max-w-[420px] mb-11"
                        style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}>
                Transformez vos espaces avec des matériaux innovants, durables
                et conçus pour l'avenir.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5 mb-14">
                <motion.button
                  ref={magPrimary.ref}
                  style={{ x: magPrimary.sx, y: magPrimary.sy }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative inline-flex items-center gap-2.5 px-7 h-[52px] rounded-[6px] bg-[#FFC400] text-[#1A1A1A] text-[0.82rem] font-extrabold tracking-[0.08em] uppercase border-none cursor-pointer overflow-hidden group"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Explorer Maintenant
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)" }} />
                </motion.button>

                <motion.button
                  ref={magSecondary.ref}
                  style={{ x: magSecondary.sx, y: magSecondary.sy }}
                  whileHover={{ scale: 1.04, borderColor: "#FFC400", backgroundColor: "rgba(255,196,0,0.13)", boxShadow: "0 0 18px rgba(255,196,0,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-7 h-[52px] rounded-[6px] bg-[rgba(255,196,0,0.07)] text-[#FFC400] text-[0.82rem] font-bold tracking-[0.08em] uppercase border border-[rgba(255,196,0,0.35)] cursor-pointer backdrop-blur-md"
                >
                  Voir le Catalogue
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFC400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeIn} className="flex items-center flex-wrap gap-7">
                {stats.map(({ n, sfx, label }, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[#FFC400] text-2xl font-black leading-none tabular-nums">
                      <Counter to={n} suffix={sfx} />
                    </span>
                    <span className="text-white/30 text-[0.62rem] tracking-[0.18em] uppercase mt-1">{label}</span>
                  </div>
                ))}
                <div className="w-px h-9 bg-[rgba(255,196,0,0.2)]" />
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-[rgba(255,196,0,0.15)] backdrop-blur-md">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFC400">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  <span className="text-white/40 text-[0.65rem] tracking-[0.12em] uppercase">Qualité Certifiée</span>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>

          {/* ════ RIGHT — 3D Scene ════ */}
          <motion.div
            style={{ y: sceneY }}
            className="flex-1 relative order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.15 }}
          >
            {/* Yellow radial glow behind canvas */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
                 style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(255,196,0,0.15) 0%, transparent 70%)", filter: "blur(28px)" }} />

            {/* Canvas */}
            <div className="relative w-full" style={{ height: "clamp(400px, 54vw, 680px)" }}>
              <ThreeScene />
            </div>

            {/* Tool legend card — bottom-left */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20, x: -16 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1.5, duration: 0.7 }}
              className="absolute bottom-[8%] left-0 bg-[rgba(10,10,10,0.82)] backdrop-blur-xl border border-[rgba(255,196,0,0.22)] rounded-xl px-5 py-4 min-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FFC400]" style={{ boxShadow: "0 0 8px #FFC400", animation: "pulseDot 2s ease-in-out infinite" }} />
                <span className="text-white/40 text-[0.65rem] tracking-[0.12em] uppercase">Gamme Complète</span>
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { icon: "⚡", label: "Outillage électrique" },
                  { icon: "🎨", label: "Peintures & Revêtements" },
                  { icon: "🔌", label: "Équipements & Câblage" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[0.75rem]">{icon}</span>
                    <span className="text-white/60 text-[0.72rem]">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div> */}

            {/* ISO badge — top-right */}
            <motion.div
              initial={{ opacity: 0, y: -16, x: 16 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1.7, duration: 0.7 }}
              className="absolute top-[8%] right-0 bg-[rgba(255,196,0,0.1)] backdrop-blur-md border border-[rgba(255,196,0,0.35)] rounded-lg px-4 py-3 text-center"
            >
              <span className="text-[#FFC400] font-black text-xl block">ISO</span>
              <span className="text-white/55 font-semibold text-[0.68rem]">9001 Certifié</span>
            </motion.div>

            {/* Floating "Peinture & Électricité" label — mid-right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.7 }}
              className="absolute top-[42%] right-0 flex flex-col items-end gap-1"
            >
              <span className="text-[#FFC400] text-[0.6rem] tracking-[0.2em] uppercase font-semibold">Peinture</span>
              <div className="w-12 h-px bg-gradient-to-l from-[#FFC400] to-transparent" />
              <span className="text-white/30 text-[0.6rem] tracking-[0.2em] uppercase">Électricité</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom glowing divider */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
           style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,196,0,0.55) 30%, #FFC400 50%, rgba(255,196,0,0.55) 70%, transparent 100%)" }} />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{ opacity: scrollFade }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-white/20 text-[0.6rem] tracking-[0.22em] uppercase">Défiler</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "linear-gradient(180deg, #FFC400, transparent)" }}
        />
      </motion.div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.45); }
        }
      `}</style>
      {/* <Batimatohomepage/> */}
    </section>
  );
}