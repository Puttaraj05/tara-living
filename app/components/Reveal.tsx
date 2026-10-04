"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "left" | "scale" | "clip" | "fade";

/* shared hook: adds "pp-in" once the element scrolls into view */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("pp-in");
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return ref;
}

type RevealProps = {
  children: ReactNode;
  delay?: number;
  variant?: Variant;
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
}: RevealProps) {
  const ref = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`pp-rv pp-rv-${variant} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}