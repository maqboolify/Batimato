"use client";

/**
 * BATIMATO — Loading Screen
 * ────────────────────────────────────
 * Stack: Next.js + TypeScript + Tailwind CSS + Framer Motion + Three.js
 * Place in /components/Loader.tsx
 *
 * A full-viewport black-and-yellow loader: a rotating wireframe Three.js
 * icon wrapped in an SVG progress ring, an animated percentage counter,
 * a cycling status line, and the BatiMato wordmark — same visual language
 * as HeroSection (yellow #FFC400 on #0A0A0A, arch grid, glow, scanlines).
 *
 * Usage (inside HeroSection.tsx):
 *   const [isLoading, setIsLoading] = useState(true);
 *   ...
 *   <AnimatePresence>
 *     {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
 *   </AnimatePresence>
 */

import { useRef, useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import * as THREE from "three";

const Y = "#FFC400";

// ─── Status messages cycled while loading ─────────────────────────────────────
const MESSAGES = [
  "Préparation des matériaux…",
  "Chargement de l'atelier…",
  "Calibrage des outils…",
  "Mélange des couleurs…",
  "Presque prêt…",
];

// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS — rotating wireframe emblem
// ═══════════════════════════════════════════════════════════════════════════
function LoaderScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Outer wireframe shell — icosahedron edges only
    const shellGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const shellEdges = new THREE.EdgesGeometry(shellGeo);
    const shell = new THREE.LineSegments(
      shellEdges,
      new THREE.LineBasicMaterial({ color: new THREE.Color(Y), transparent: true, opacity: 0.9 })
    );
    scene.add(shell);

    // Inner faceted core — soft emissive glow
    const coreGeo = new THREE.IcosahedronGeometry(0.52, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(Y),
      emissive: new THREE.Color(Y),
      emissiveIntensity: 0.7,
      metalness: 0.3,
      roughness: 0.35,
      transparent: true,
      opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);
    const coreEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(coreGeo),
      new THREE.LineBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: 0.5 })
    );
    scene.add(coreEdges);

    // Thin secondary ring shell (slightly larger, faint)
    const outerGeo = new THREE.IcosahedronGeometry(1.55, 1);
    const outer = new THREE.LineSegments(
      new THREE.EdgesGeometry(outerGeo),
      new THREE.LineBasicMaterial({ color: new THREE.Color(Y), transparent: true, opacity: 0.14 })
    );
    scene.add(outer);

    // Orbiting particle dots
    const DOT_COUNT = 20;
    const dots: THREE.Mesh[] = [];
    const dotGeo = new THREE.SphereGeometry(0.026, 8, 8);
    const dotMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(Y),
      emissive: new THREE.Color(Y),
      emissiveIntensity: 1.1,
    });
    for (let i = 0; i < DOT_COUNT; i++) {
      const d = new THREE.Mesh(dotGeo, dotMat);
      scene.add(d);
      dots.push(d);
    }

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const key = new THREE.PointLight(new THREE.Color(Y), 3.2, 10);
    key.position.set(2.2, 1.8, 3);
    scene.add(key);
    const rim = new THREE.PointLight(0x4488ff, 0.9, 8);
    rim.position.set(-2.5, -1, -2);
    scene.add(rim);

    let raf: number;
    const clock = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      shell.rotation.y = t * 0.55;
      shell.rotation.x = t * 0.24;
      outer.rotation.y = -t * 0.18;
      outer.rotation.x = t * 0.1;
      core.rotation.y = -t * 0.4;
      core.rotation.x = t * 0.3;
      coreEdges.rotation.copy(core.rotation);

      const pulse = 1 + Math.sin(t * 2.2) * 0.06;
      core.scale.setScalar(pulse);
      coreEdges.scale.setScalar(pulse);

      dots.forEach((d, i) => {
        const a = t * 0.7 + (i / DOT_COUNT) * Math.PI * 2;
        const r = 1.9;
        d.position.set(Math.cos(a) * r, Math.sin(a * 1.4) * 0.35, Math.sin(a) * r * 0.55);
      });

      key.intensity = 2.8 + Math.sin(t * 1.8) * 0.7;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      shellGeo.dispose();
      shellEdges.dispose();
      coreGeo.dispose();
      outerGeo.dispose();
      dotGeo.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS RING — SVG circle wrapping the Three.js emblem
// ═══════════════════════════════════════════════════════════════════════════
function ProgressRing({ progress, size = 220 }: { progress: number; size?: number }) {
  const stroke = 1.5;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0"
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,196,0,0.12)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={Y}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.15s linear", filter: "drop-shadow(0 0 6px rgba(255,196,0,0.6))" }}
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADER — full component
// ═══════════════════════════════════════════════════════════════════════════
export default function Loader({
  onComplete,
  duration = 2400,
}: {
  onComplete: () => void;
  duration?: number;
}) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting">("loading");

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: duration / 1000,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setProgress(Math.min(100, Math.floor(v))),
      onComplete: () => {
        window.setTimeout(() => setPhase("exiting"), 280);
      },
    });

    const msgTimer = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, Math.max(500, duration / MESSAGES.length));

    return () => {
      controls.stop();
      window.clearInterval(msgTimer);
    };
  }, [duration]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0A0A0A] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={phase === "exiting" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => {
        if (phase === "exiting") onComplete();
      }}
    >
      {/* Arch grid background, same as hero */}
      <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-70">
        <defs>
          <pattern id="loader-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0L0 0 0 60" fill="none" stroke="rgba(255,196,0,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#loader-grid)" />
      </svg>

      {/* Center ambient glow */}
      <div
        aria-hidden
        className="absolute w-[46vw] h-[46vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,196,0,0.14) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      {/* Scanlines, same as hero */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
        }}
      />

      {/* Content column */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={phase === "exiting" ? { opacity: 0, scale: 0.92, y: -12 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Emblem: three.js scene + progress ring + % counter */}
        <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
          <ProgressRing progress={progress} size={220} />
          <div className="absolute inset-[18px]">
            <LoaderScene />
          </div>
          <span
            className="absolute text-[#FFC400] font-black tabular-nums"
            style={{ fontSize: "1.7rem", letterSpacing: "-0.02em", textShadow: "0 0 18px rgba(255,196,0,0.5)" }}
          >
            {progress}
            <span style={{ fontSize: "1rem", opacity: 0.7 }}>%</span>
          </span>
        </div>

        {/* Wordmark */}
        <div className="mt-9 flex items-center gap-3">
          <span className="inline-block w-7 h-px" style={{ background: "linear-gradient(90deg, transparent, #FFC400)" }} />
          <h1
            className="font-black uppercase select-none"
            style={{
              fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
              letterSpacing: "0.02em",
              color: "#fff",
            }}
          >
            Bati<span style={{ color: Y, textShadow: "0 0 22px rgba(255,196,0,0.55)" }}>Mato</span>
          </h1>
          <span className="inline-block w-7 h-px" style={{ background: "linear-gradient(90deg, #FFC400, transparent)" }} />
        </div>

        {/* Cycling status message */}
        <div className="mt-4 h-5 overflow-hidden">
          <motion.span
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="block text-white/40 text-[0.7rem] tracking-[0.18em] uppercase"
          >
            {MESSAGES[msgIndex]}
          </motion.span>
        </div>

        {/* Thin progress bar */}
        <div className="mt-7 w-[220px] h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${Y}, #FFE066)`,
              boxShadow: "0 0 10px rgba(255,196,0,0.6)",
              transition: "width 0.15s linear",
            }}
          />
        </div>
      </motion.div>

      {/* Bottom glowing divider, same as hero */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,196,0,0.55) 30%, #FFC400 50%, rgba(255,196,0,0.55) 70%, transparent 100%)",
        }}
      />
    </motion.div>
  );
}