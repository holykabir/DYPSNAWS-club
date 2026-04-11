"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { EVENTS } from "@/data/events";

function EventCard({ event, index, totalCount, scrollProgress }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const yPos = index * -2.8;

  const handleClick = (e) => {
    e.stopPropagation();
    router.push(`/events/${event.slug}`);
  };

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetY = yPos + scrollProgress * (totalCount * 2.8);
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.06
    );

    const targetX = hovered ? 1.0 : 0;
    const targetRotY = hovered ? -0.12 : 0;
    const targetScale = hovered ? 1.06 : 1;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.08
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.08
    );
    const s = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale,
      0.08
    );
    groupRef.current.scale.set(s, s, s);

    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.25 + index) * 0.015;
  });

  return (
    <group
      ref={groupRef}
      position={[0, yPos, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Card body */}
      <RoundedBox args={[5.5, 2.2, 0.06]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color={hovered ? event.color : "#1a0533"}
          transparent
          opacity={hovered ? 0.92 : 0.65}
          roughness={0.4}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Glow border */}
      <RoundedBox args={[5.56, 2.26, 0.01]} radius={0.08} smoothness={4}>
        <meshBasicMaterial
          color={event.color}
          transparent
          opacity={hovered ? 0.5 : 0.12}
        />
      </RoundedBox>

      {/* Type badge */}
      <Text
        position={[-2.2, 0.7, 0.05]}
        fontSize={0.13}
        color={event.color}
        anchorX="left"
        letterSpacing={0.08}
      >
        {event.type}
      </Text>

      {/* Title */}
      <Text
        position={[-2.2, 0.2, 0.05]}
        fontSize={0.3}
        color="#F5F5F5"
        anchorX="left"
        maxWidth={4.5}
        fontWeight="bold"
      >
        {event.title}
      </Text>

      {/* Date */}
      <Text
        position={[-2.2, -0.2, 0.05]}
        fontSize={0.14}
        color="#A855F7"
        anchorX="left"
      >
        {event.date}
      </Text>

      {/* Description */}
      <Text
        position={[-2.2, -0.6, 0.05]}
        fontSize={0.12}
        color="#999999"
        anchorX="left"
        maxWidth={4}
        lineHeight={1.3}
      >
        {event.desc}
      </Text>

      {/* VIEW EVENT button — uses Html from drei for reliable click */}
      {hovered && (
        <Html position={[1.8, -0.6, 0.08]} center>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/events/${event.slug}`);
            }}
            className="px-5 py-2 text-[11px] font-bold tracking-[0.1em] text-white rounded-full whitespace-nowrap transition-all duration-300 hover:scale-105"
            style={{
              background: event.color,
              fontFamily: "var(--font-display)",
              boxShadow: `0 0 20px ${event.color}60`,
              pointerEvents: "auto",
            }}
          >
            VIEW EVENT →
          </button>
        </Html>
      )}
    </group>
  );
}

function EventScene({ scrollProgress }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 8]} intensity={0.7} color="#A855F7" />
      <pointLight position={[-4, -4, 8]} intensity={0.3} color="#6B21A8" />
      <fog attach="fog" args={["#0A0A0F", 6, 18]} />

      {EVENTS.map((event, i) => (
        <EventCard
          key={event.slug}
          event={event}
          index={i}
          totalCount={EVENTS.length}
          scrollProgress={scrollProgress}
        />
      ))}
    </>
  );
}

export default function EventStack3D() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const eventsSection = document.getElementById("events");
    if (!eventsSection) return;

    const rect = eventsSection.getBoundingClientRect();
    const sectionHeight = eventsSection.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: "transparent", pointerEvents: "auto" }}
        frameloop="demand"
        onCreated={({ gl, invalidate }) => {
          const animate = () => {
            invalidate();
            requestAnimationFrame(animate);
          };
          animate();
        }}
      >
        <EventScene scrollProgress={scrollProgress} />
      </Canvas>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs text-purple-light/40 tracking-[0.15em] pointer-events-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <div className="w-8 h-px bg-purple-light/30" />
        SCROLL TO EXPLORE
        <div className="w-8 h-px bg-purple-light/30" />
      </div>
    </div>
  );
}
