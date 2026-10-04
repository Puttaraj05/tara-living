"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  /* how far the photo travels inside its frame, as % of the frame height.
     12 = subtle, 28 = dramatic (hero) */
  strength?: number;
  /* frame scales up and loses rounded corners while scrolling in */
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

      /* -1 (frame has left the top) … +1 (frame about to enter at the bottom) */
      const t = Math.max(
        -1,
        Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2))
      );
      const overhang = (r.height * strength) / 100;
      inner.style.transform = `translate3d(0, ${-t * overhang}px, 0)`;

      if (grow) {
        const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.9)));
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
        style={{ top: `-${strength}%`, height: `${100 + strength * 2}%` }}
      >
        <img src={src} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}