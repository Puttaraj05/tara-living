"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  strength?: number;
  grow?: boolean;
  className?: string;
};

export default function ParallaxImg({
  src,
  alt,
  strength = 12,
  grow = false,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let raf = 0;

    const update = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;

      const t = Math.max(
        -1,
        Math.min(
          1,
          (r.top + r.height / 2 - vh / 2) /
            (vh / 2 + r.height / 2)
        )
      );

      const overhang = (r.height * strength) / 100;
      inner.style.transform = `translate3d(0, ${-t * overhang}px, 0)`;

      if (grow) {
        const p = Math.max(
          0,
          Math.min(1, (vh - r.top) / (vh * 0.9))
        );

        wrap.style.transform = `scale(${0.84 + 0.16 * p})`;
        wrap.style.borderRadius = `${(1 - p) * 32}px`;
      }

      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength, grow]);

  return (
    <div ref={wrapRef} className={`pp-pimg ${className}`}>
      <div
        ref={innerRef}
        className="pp-pimg-in"
        style={{
          top: `-${strength}%`,
          height: `${100 + strength * 2}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
