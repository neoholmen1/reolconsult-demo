"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  ContactShadows,
  Float,
  Environment,
  Lightformer,
  SoftShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

const STEEL = "#322a25";
const RED = "#d62828";
const CREAM = "#dccaa9";
const KRAFT = "#b89165";
const DARK = "#2a231e";

/** Stilisert pallereol i 3D med PBR-materialer. */
function Rack({ levels = 3 }: { levels?: number }) {
  const width = 4;
  const height = 4.4;
  const depth = 1.7;
  const half = width / 2;

  const levelYs = useMemo(
    () => Array.from({ length: levels }, (_, i) => -height / 2 + 0.55 + i * (height / levels)),
    [levels, height],
  );

  const crates = useMemo(() => {
    const palette = [CREAM, KRAFT, CREAM, DARK];
    const out: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = [];
    levelYs.forEach((y, li) => {
      for (let s = 0; s < 3; s++) {
        if ((li * 3 + s) % 5 === 4) continue;
        const w = 0.98 + ((li + s) % 2) * 0.14;
        const h = 0.82 + ((li * 2 + s) % 2) * 0.16;
        const x = -half + 0.85 + s * 1.15;
        out.push({
          pos: [x, y + h / 2 + 0.1, ((s % 2) - 0.5) * 0.18],
          size: [w, h, depth * 0.6],
          color: palette[(li + s) % palette.length],
        });
      }
    });
    return out;
  }, [levelYs, half, depth]);

  return (
    <group>
      {/* Stolper — galvanisert stål */}
      {[-half, half].map((x) => (
        <RoundedBox key={x} args={[0.2, height, depth]} radius={0.04} smoothness={2} position={[x, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={STEEL} roughness={0.34} metalness={0.92} envMapIntensity={1.1} />
        </RoundedBox>
      ))}
      {/* Røde bjelker — pulverlakkert metall med sheen */}
      {levelYs.map((y, i) =>
        [depth / 2 - 0.16, -depth / 2 + 0.16].map((z, j) => (
          <RoundedBox key={`${i}-${j}`} args={[width, 0.16, 0.14]} radius={0.03} smoothness={2} position={[0, y, z]} castShadow>
            <meshPhysicalMaterial color={RED} roughness={0.32} metalness={0.25} clearcoat={0.5} clearcoatRoughness={0.3} envMapIntensity={1.2} />
          </RoundedBox>
        )),
      )}
      {/* Kasser — matte */}
      {crates.map((c, i) => (
        <RoundedBox key={i} args={c.size} radius={0.05} smoothness={3} position={c.pos} castShadow receiveShadow>
          <meshStandardMaterial color={c.color} roughness={0.88} metalness={0.02} envMapIntensity={0.5} />
        </RoundedBox>
      ))}
    </group>
  );
}

function Rig({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    const tx = state.pointer.y * 0.16;
    const ty = state.pointer.x * 0.32 - 0.5 + (reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.18) * 0.14);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, tx, 3.5, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ty, 3.5, delta);
  });

  return (
    <Float speed={reduce ? 0 : 1.1} rotationIntensity={0} floatIntensity={reduce ? 0 : 0.45}>
      <group ref={group} rotation={[0.04, -0.5, 0]} position={[0.3, 0.1, 0]}>
        <Rack levels={3} />
        <group position={[3.9, -0.8, -3.6]} scale={0.72} rotation={[0, 0.25, 0]}>
          <Rack levels={3} />
        </group>
      </group>
    </Float>
  );
}

/** Studio-lyssetting bygd lokalt med Lightformer → ekte refleksjoner uten nett. */
function StudioEnv() {
  return (
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={3} color="#fff2e0" scale={[10, 5, 1]} position={[0, 5, -4]} rotation={[Math.PI / 2, 0, 0]} />
      <Lightformer form="rect" intensity={2} color="#ffe8cf" scale={[6, 6, 1]} position={[6, 2, 2]} rotation={[0, -Math.PI / 2, 0]} />
      <Lightformer form="rect" intensity={1.6} color="#cfe0ff" scale={[6, 6, 1]} position={[-6, 1, 1]} rotation={[0, Math.PI / 2, 0]} />
      <Lightformer form="rect" intensity={2.4} color={RED} scale={[3, 1.4, 1]} position={[-3, -1, 4]} rotation={[0, 0, 0]} />
      <Lightformer form="circle" intensity={1.2} color="#ffffff" scale={4} position={[2, 6, 4]} />
    </Environment>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0.6, 0.7, 11], fov: 32 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <SoftShadows size={28} samples={12} focus={0.9} />
      <ambientLight intensity={0.35} color="#fff3e6" />
      <directionalLight
        position={[5, 9, 6]}
        intensity={2.6}
        color="#fff1df"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-7, 3, -3]} intensity={0.5} color="#bcd2ff" />

      <Suspense fallback={null}>
        <Rig reduce={reduce} />
        <StudioEnv />
      </Suspense>

      <ContactShadows position={[0, -2.7, 0]} opacity={0.5} scale={20} blur={2.8} far={7} color="#241a12" />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.55} luminanceThreshold={0.85} luminanceSmoothing={0.3} mipmapBlur radius={0.6} />
        <Vignette offset={0.32} darkness={0.55} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
