"use client";

import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  RoundedBox,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SMAA, ChromaticAberration } from "@react-three/postprocessing";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

const RED = "#dc2626";
const STEEL = "#cfd4db";
const STEEL_DARK = "#2c3037";
const CARD = "#cdb78d";
const CARD_LIGHT = "#ddc9a3";
const WOOD = "#8a6a3f";

type Mat = "card" | "cardLight" | "glass" | "plastic" | "chrome" | "darkChrome";

function BoxMat({ mat }: { mat: Mat }) {
  switch (mat) {
    case "glass":
      return (
        <MeshTransmissionMaterial
          samples={6}
          resolution={256}
          transmission={1}
          thickness={0.9}
          roughness={0.08}
          ior={1.45}
          chromaticAberration={0.03}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.05}
          color="#ffffff"
          attenuationColor="#eaf0ff"
          attenuationDistance={2.5}
        />
      );
    case "plastic":
      return <meshPhysicalMaterial color={RED} roughness={0.25} metalness={0} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.2} />;
    case "chrome":
      return <meshStandardMaterial color={STEEL} metalness={1} roughness={0.16} envMapIntensity={1.5} />;
    case "darkChrome":
      return <meshStandardMaterial color={STEEL_DARK} metalness={1} roughness={0.22} envMapIntensity={1.3} />;
    case "cardLight":
      return <meshStandardMaterial color={CARD_LIGHT} roughness={0.85} metalness={0.02} envMapIntensity={0.5} />;
    default:
      return <meshStandardMaterial color={CARD} roughness={0.88} metalness={0.02} envMapIntensity={0.5} />;
  }
}

function Crate({ args, pos, rot, mat = "card" }: { args: [number, number, number]; pos: [number, number, number]; rot?: [number, number, number]; mat?: Mat }) {
  return (
    <RoundedBox args={args} radius={0.04} smoothness={3} position={pos} rotation={rot} castShadow receiveShadow>
      <BoxMat mat={mat} />
    </RoundedBox>
  );
}

/** Én sammensatt pallereol: stolper, røde bjelker, treplater og stablede kasser. */
function PalletRack() {
  const W = 5.4; // bredde
  const H = 5.4; // høyde
  const D = 1.9; // dybde
  const halfW = W / 2;
  const levelYs = useMemo(() => [-H / 2 + 0.5, -H / 2 + 2.2, -H / 2 + 3.9], []);

  // Stablede kasser pr nivå (deterministisk variasjon). Paller rendres separat.
  const items = useMemo(() => {
    const mats: Mat[] = ["card", "cardLight", "glass", "plastic", "chrome", "card", "cardLight", "darkChrome"];
    const out: { args: [number, number, number]; pos: [number, number, number]; rot?: [number, number, number]; mat: Mat }[] = [];
    let idx = 0;
    levelYs.forEach((y, li) => {
      [-1.25, 1.25].forEach((px, pi) => {
        const n = (li + pi) % 2 === 0 ? 2 : 1;
        for (let k = 0; k < n; k++) {
          const w = 0.85 + ((li + pi + k) % 2) * 0.12;
          const h = 0.7 + ((li * 2 + k) % 2) * 0.22;
          const x = px + (k - (n - 1) / 2) * 0.95;
          out.push({
            args: [w, h, D * 0.6],
            pos: [x, y + 0.18 + h / 2, ((k % 2) - 0.5) * 0.12],
            rot: [0, ((li + k) % 2) * 0.08, 0],
            mat: mats[idx % mats.length],
          });
          idx++;
        }
      });
    });
    return out;
  }, [levelYs, D]);

  return (
    <group>
      {/* Stolper (chrome) med føtter */}
      {[-halfW, halfW].map((x) => (
        <group key={x}>
          <mesh position={[x, 0, D / 2 - 0.12]} castShadow>
            <boxGeometry args={[0.16, H, 0.16]} />
            <meshStandardMaterial color={STEEL} metalness={1} roughness={0.18} envMapIntensity={1.4} />
          </mesh>
          <mesh position={[x, 0, -D / 2 + 0.12]} castShadow>
            <boxGeometry args={[0.16, H, 0.16]} />
            <meshStandardMaterial color={STEEL} metalness={1} roughness={0.18} envMapIntensity={1.4} />
          </mesh>
          {/* diagonal kryss-stag */}
          <mesh position={[x, 0, 0]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.07, H * 0.96, 0.07]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={1} roughness={0.3} envMapIntensity={1.1} />
          </mesh>
        </group>
      ))}

      {/* Røde bjelker (front + bak) pr nivå */}
      {levelYs.map((y, i) =>
        [D / 2 - 0.12, -D / 2 + 0.12].map((z, j) => (
          <RoundedBox key={`${i}-${j}`} args={[W, 0.2, 0.16]} radius={0.04} smoothness={3} position={[0, y - 0.05, z]} castShadow>
            <meshPhysicalMaterial color={RED} roughness={0.3} metalness={0.25} clearcoat={0.5} clearcoatRoughness={0.3} envMapIntensity={1.2} />
          </RoundedBox>
        )),
      )}

      {/* Treplater (paller) */}
      {levelYs.map((y) =>
        [-1.25, 1.25].map((px) => (
          <mesh key={`${y}-${px}`} position={[px, y + 0.09, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.05, 0.16, D * 0.84]} />
            <meshStandardMaterial color={WOOD} roughness={0.82} metalness={0.03} envMapIntensity={0.4} />
          </mesh>
        )),
      )}

      {/* Kasser/varer */}
      {items.map((it, i) => (
        <Crate key={i} {...it} />
      ))}
    </group>
  );
}

function Rig({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const ptr = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame((s, d) => {
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -ptr.current.y * 0.1, 3, d);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ptr.current.x * 0.12, 3, d);
    }
    // sakte turntable så man ser at det er en ekte 3D-reol
    if (turn.current && !reduce) turn.current.rotation.y += d * 0.12;
  });

  return (
    <group ref={group} position={[1.7, -0.1, 0]}>
      <group ref={turn}>
        <PalletRack />
      </group>
    </group>
  );
}

function Scene({ reduce }: { reduce: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 6]} intensity={2.4} color="#fff3e6" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, -1, 4]} intensity={45} color={RED} distance={18} />
      <pointLight position={[5, 5, 3]} intensity={14} color="#fff0db" distance={20} />

      <Suspense fallback={null}>
        <Rig reduce={reduce} />
        <Environment resolution={256}>
          <color attach="background" args={["#0a0b0d"]} />
          <Lightformer form="rect" intensity={3} color="#fff3e0" scale={[12, 6, 1]} position={[0, 6, -5]} rotation={[Math.PI / 2, 0, 0]} />
          <Lightformer form="rect" intensity={2.4} color="#dfe8ff" scale={[8, 8, 1]} position={[8, 1, 3]} rotation={[0, -Math.PI / 2, 0]} />
          <Lightformer form="rect" intensity={2.2} color="#ffe6cf" scale={[8, 8, 1]} position={[-8, 1, 2]} rotation={[0, Math.PI / 2, 0]} />
          <Lightformer form="circle" intensity={2.6} color={RED} scale={3} position={[-4, -2, 5]} />
        </Environment>
      </Suspense>

      <ContactShadows position={[1.7, -3.0, 0]} opacity={0.5} scale={22} blur={3} far={8} color="#1a1208" />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.45} luminanceThreshold={0.8} luminanceSmoothing={0.3} mipmapBlur radius={0.6} />
        <ChromaticAberration offset={new THREE.Vector2(0.0003, 0.0003)} radialModulation={false} modulationOffset={0} />
        <Vignette offset={0.3} darkness={0.65} />
        <SMAA />
      </EffectComposer>
    </>
  );
}

export default function HeroGlass() {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.4, 11], fov: 36 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Scene reduce={reduce} />
    </Canvas>
  );
}
