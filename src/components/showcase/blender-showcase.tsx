"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LiveBadge } from "./player";
import { cn } from "@/lib/utils";

type Variant = {
  body: number;
  accent: number;
  eyes: number;
  accessory: "katana" | "staff" | "helmet" | "antenna";
};

function variantFor(slug: string): Variant {
  if (slug.includes("ronin"))
    return { body: 0x353548, accent: 0x8b5cf6, eyes: 0x22d3ee, accessory: "katana" };
  if (slug.includes("mage"))
    return { body: 0x2b2340, accent: 0xa855f7, eyes: 0xf0abfc, accessory: "staff" };
  if (slug.includes("pilot"))
    return { body: 0x2a2f3a, accent: 0xf97316, eyes: 0x22d3ee, accessory: "helmet" };
  return { body: 0x28323a, accent: 0x34d399, eyes: 0xfbbf24, accessory: "antenna" };
}

/** Builds the same stylized character the .py package generates in Blender. */
function buildCharacter(variant: Variant) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color: variant.body,
    metalness: 0.35,
    roughness: 0.45,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: variant.accent,
    metalness: 0.7,
    roughness: 0.3,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: variant.eyes,
    emissive: variant.eyes,
    emissiveIntensity: 2.2,
  });

  const box = (
    w: number, h: number, d: number,
    x: number, y: number, z: number,
    mat: THREE.Material
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };

  const H = 1.8;
  const legH = H * 0.42;
  const torsoH = H * 0.32;
  const headS = H * 0.16;

  box(0.62, torsoH, 0.3, 0, legH + torsoH / 2, 0, bodyMat); // torso
  box(0.5, 0.14, 0.28, 0, legH, 0, accentMat); // hips
  box(headS, headS, headS, 0, legH + torsoH + headS / 2 + 0.05, 0, bodyMat); // head

  const eyeY = legH + torsoH + headS / 2 + 0.08;
  box(0.05, 0.07, 0.02, -headS * 0.22, eyeY, headS / 2, eyeMat);
  box(0.05, 0.07, 0.02, headS * 0.22, eyeY, headS / 2, eyeMat);

  const arms: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const arm = box(0.13, torsoH * 0.95, 0.13, side * 0.41, legH + torsoH * 0.5, 0, accentMat);
    arm.geometry.translate(0, -torsoH * 0.45, 0);
    arm.position.y = legH + torsoH * 0.95;
    arms.push(arm);
    box(0.16, legH * 0.96, 0.18, side * 0.14, legH * 0.5, 0, bodyMat);
  }

  // Accessory
  if (variant.accessory === "katana") {
    const blade = box(0.03, H * 0.7, 0.03, 0.55, legH + torsoH * 0.6, 0.1, accentMat);
    blade.rotation.z = -0.35;
  } else if (variant.accessory === "staff") {
    box(0.04, H * 0.95, 0.04, -0.55, H * 0.5, 0, accentMat);
    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.09, 1),
      eyeMat
    );
    orb.position.set(-0.55, H * 0.98, 0);
    group.add(orb);
  } else if (variant.accessory === "helmet") {
    box(headS * 1.15, headS * 0.5, headS * 1.15, 0, legH + torsoH + headS + 0.02, 0, accentMat);
  } else {
    box(0.02, 0.25, 0.02, 0, legH + torsoH + headS + 0.15, 0, accentMat);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), eyeMat);
    tip.position.set(0, legH + torsoH + headS + 0.3, 0);
    group.add(tip);
  }

  return { group, arms };
}

export function BlenderShowcase({
  slug,
  polyCount,
  rigType,
}: {
  slug: string;
  polyCount: string | null;
  rigType: string | null;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [turntable, setTurntable] = useState(true);
  const [tris, setTris] = useState(0);
  const stateRef = useRef({ wireframe, turntable });
  stateRef.current = { wireframe, turntable };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0f, 6, 14);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(2.6, 1.9, 3.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2;
    controls.maxDistance = 8;
    controls.maxPolarAngle = Math.PI * 0.55;

    const variant = variantFor(slug);
    const { group, arms } = buildCharacter(variant);
    scene.add(group);

    // Count triangles for the stats chip
    let triangles = 0;
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const index = obj.geometry.getIndex();
        triangles += (index ? index.count : obj.geometry.getAttribute("position").count) / 3;
      }
    });
    setTris(Math.round(triangles));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(3, 4, 3);
    scene.add(key);
    const rim = new THREE.PointLight(variant.accent, 30, 12);
    rim.position.set(-3, 2.4, -2);
    scene.add(rim);
    const fill = new THREE.PointLight(variant.eyes, 8, 10);
    fill.position.set(0, 0.4, 3);
    scene.add(fill);

    // Ground
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(2.4, 48),
      new THREE.MeshStandardMaterial({ color: 0x11111a, metalness: 0.4, roughness: 0.7 })
    );
    disc.rotation.x = -Math.PI / 2;
    scene.add(disc);
    const grid = new THREE.PolarGridHelper(2.4, 12, 5, 48, 0x2a2a3a, 0x1c1c28);
    grid.position.y = 0.002;
    scene.add(grid);

    const resize = () => {
      const { width } = mount.getBoundingClientRect();
      const height = mount.clientHeight || width * 0.75;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    let raf = 0;
    const clock = new THREE.Clock();
    const materials: THREE.MeshStandardMaterial[] = [];
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) materials.push(obj.material as THREE.MeshStandardMaterial);
    });

    const animate = () => {
      const t = clock.getElapsedTime();
      const { wireframe: wf, turntable: tt } = stateRef.current;

      if (tt) group.rotation.y += 0.005;
      group.position.y = Math.sin(t * 1.6) * 0.03; // idle breathe
      arms[0].rotation.x = Math.sin(t * 1.6) * 0.08;
      arms[1].rotation.x = -Math.sin(t * 1.6) * 0.08;

      for (const material of materials) {
        if (material.wireframe !== wf) material.wireframe = wf;
      }

      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) =>
            m.dispose()
          );
        }
      });
      mount.removeChild(renderer.domElement);
    };
  }, [slug]);

  return (
    <div ref={frameRef} className="gradient-ring flex flex-col overflow-hidden rounded-3xl bg-ink-2">
      <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_50%_20%,rgba(249,115,22,0.08),transparent_60%)] sm:aspect-[16/10]">
        <LiveBadge text="Interactive 3D viewer" />
        <span className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-ink/80 px-3 py-1.5 text-[10px] font-semibold text-fog-2 backdrop-blur">
          🖱 Drag to orbit · scroll to zoom
        </span>
        <div ref={mountRef} className="h-full w-full" />
        {/* Stats chip */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 text-[10px] font-semibold">
          <span className="rounded-full border border-orange-400/30 bg-ink/80 px-2.5 py-1 text-orange-300 backdrop-blur">
            ◆ {polyCount ?? `${tris.toLocaleString()} tris (preview)`}
          </span>
          {rigType && (
            <span className="rounded-full border border-cyan-400/30 bg-ink/80 px-2.5 py-1 text-cyan-300 backdrop-blur">
              ⚙ {rigType}
            </span>
          )}
        </div>
      </div>

      {/* Viewer controls */}
      <div className="flex items-center gap-2 border-t border-white/8 bg-ink/85 px-4 py-2.5 backdrop-blur">
        <button
          onClick={() => setTurntable((v) => !v)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition",
            turntable
              ? "border-transparent bg-gradient-brand text-white"
              : "border-white/12 text-fog-2 hover:text-fog"
          )}
        >
          {turntable ? "⏸ Turntable" : "▶ Turntable"}
        </button>
        <button
          onClick={() => setWireframe((v) => !v)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition",
            wireframe
              ? "border-transparent bg-gradient-brand text-white"
              : "border-white/12 text-fog-2 hover:text-fog"
          )}
        >
          ◈ Wireframe
        </button>
        <span className="ml-auto hidden text-[10px] text-fog-2 sm:block">
          Web preview of the procedural character — the .blend build script ships in the download
        </span>
        <button
          onClick={() => frameRef.current?.requestFullscreen?.()}
          aria-label="Fullscreen"
          className="shrink-0 rounded-lg p-1.5 text-fog-2 transition hover:bg-white/10 hover:text-fog"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
