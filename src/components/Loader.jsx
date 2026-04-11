"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const textRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    // Animate progress counter
    gsap.to(
      { val: 0 },
      {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function () {
          setProgress(Math.round(this.targets()[0].val));
        },
      }
    );

    // Fade out loader after delay
    tl.to(loaderRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: "power3.inOut",
      delay: 2.8,
    }).set(loaderRef.current, { display: "none" });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a0533 0%, #0A0A0F 100%)",
      }}
    >
      {/* Spinning circular text */}
      <div className="relative w-48 h-48 md:w-64 md:h-64">
        <svg
          ref={textRef}
          viewBox="0 0 200 200"
          className="w-full h-full animate-[spin_4s_linear_infinite]"
        >
          <defs>
            <path
              id="circlePath"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
          </defs>
          <text
            fill="#A855F7"
            fontSize="11.5"
            fontFamily="var(--font-display)"
            fontWeight="700"
            letterSpacing="4"
          >
            <textPath href="#circlePath">
              AWS CLOUD CLUB ✦ LAUNCH SEQUENCE ✦ INITIATING ✦
            </textPath>
          </text>
        </svg>

        {/* Center percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl md:text-5xl font-bold text-gradient"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {progress}
          </span>
          <span className="text-xs text-purple-light/60 tracking-[0.3em] mt-1">
            PERCENT
          </span>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-xs text-purple-light/40 tracking-[0.2em]" style={{ fontFamily: "var(--font-display)" }}>
        AWS
      </div>
      <div className="absolute bottom-8 right-8 text-xs text-purple-light/40 tracking-[0.2em]" style={{ fontFamily: "var(--font-display)" }}>
        CLOUD CLUB
      </div>
    </div>
  );
}
