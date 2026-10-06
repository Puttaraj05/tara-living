"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ProjectGalleryProps = { images: string[] };

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!section || !track || !bar) return;

    let target = 0;
    let current = 0;
    let maxX = 0;
    let lastIdx = 0;
    let raf = 0;

    const measure = () => {
      maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${maxX + window.innerHeight}px`;
      const rect = section.getBoundingClientRect();
      target = maxX > 0 ? Math.max(0, Math.min(1, -rect.top / maxX)) : 0;
    };

    const tick = () => {
      current += (target - current) * 0.09;
      if (Math.abs(target - current) < 0.0003) current = target;

      track.style.transform = `translate3d(${-current * maxX}px,0,0)`;
      bar.style.transform = `scaleX(${current})`;

      const vw = window.innerWidth;
      let best = 0;
      let bestDist = Infinity;

      track.querySelectorAll<HTMLElement>(".pg-item").forEach((item, i) => {
        const r = item.getBoundingClientRect();
        const dist = (r.left + r.width / 2 - vw / 2) / vw;
        const d = Math.min(Math.abs(dist), 0.8);

        item.style.transform = `scale(${1 - d * 0.14})`;
        item.style.opacity = `${1 - d * 0.55}`;

        const img = item.querySelector<HTMLImageElement>("img");
        if (img) {
          img.style.transform = `translate3d(${dist * -80}px,0,0) scale(1.2)`;
        }

        if (Math.abs(dist) < bestDist) {
          bestDist = Math.abs(dist);
          best = i;
        }
      });

      if (best !== lastIdx) {
        lastIdx = best;
        setIndex(best);
      }

      raf = current !== target ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(kick);
    ro.observe(track);

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    window.addEventListener("load", kick);
    kick();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("load", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [images]);

  if (!images.length) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section ref={sectionRef} className="pg-section">
      <div className="pg-frame">
        <div className="pg-heading">
          <div>
            <p className="pg-eyebrow">VISUAL MOMENTS</p>
            <h2>
              A closer look
              <br />
              <em>at the space.</em>
            </h2>
          </div>

          <div className="pg-count">
            <b>{pad(index + 1)}</b>
            <span>/ {pad(images.length)}</span>
          </div>
        </div>

        <div ref={trackRef} className="pg-track">
          {images.map((image, i) => (
            <div className="pg-item" key={`${image}-${i}`}>
              <div className="pg-image">
                <Image
                  src={image}
                  alt={`Project interior ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 85vw, 60vw"
                  priority={i < 2}
                  style={{
                    objectFit: "cover",
                    transform: "scale(1.2)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pg-footer">
          <span>SCROLL TO EXPLORE</span>
          <div className="pg-progress">
            <div ref={barRef} className="pg-bar" />
          </div>
        </div>
      </div>
    </section>
  );
}
