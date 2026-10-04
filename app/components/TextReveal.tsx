"use client";

import type { ReactNode } from "react";
import { useInView } from "./Reveal";

/* Headline whose lines slide up out of a mask */
export function Lines({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const ref = useInView<HTMLHeadingElement>(0.3);

  return (
    <Tag ref={ref} className={`pp-lines ${className}`}>
      {lines.map((line, i) => (
        <span className="pp-line" key={i}>
          <span
            className="pp-line-in"
            style={{ transitionDelay: `${delay + i * 120}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/* Paragraph/quote that appears word by word */
export function Words({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useInView<HTMLDivElement>(0.3);

  return (
    <div ref={ref} className={`pp-words ${className}`}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="pp-word"
          style={{ transitionDelay: `${Math.min(i * 40, 1400)}ms` }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}