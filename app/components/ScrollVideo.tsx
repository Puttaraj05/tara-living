"use client";

import { useEffect, useRef, useState } from "react";

type Chapter = { at: number; title: string; text?: string };

type ScrollVideoProps = {
  src: string;
  chapters?: Chapter[];
  /* scroll length per second of video. Higher = slower, smoother scrub */
  pxPerSecond?: number;
};

const FPS = 24; // seek in whole frames, never in tiny fractions

const DEFAULT_CHAPTERS: Chapter[] = [
  { at: 0, title: "Step inside.", text: "Every home begins at the door." },
  { at: 0.25, title: "Light, everywhere.", text: "Open, calm and full of daylight." },
  { at: 0.5, title: "Made for living.", text: "Spaces that flow into each other." },
  { at: 0.75, title: "Finished in detail.", text: "Materials chosen to last." },
];

export default function ScrollVideo({
  src,
  chapters = DEFAULT_CHAPTERS,
  pxPerSecond = 70,
}: ScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const bar = barRef.current;
    if (!section || !video || !bar) return;

    let target = 0;   // where the scroll position says we should be (0–1)
    let current = 0;  // eased value we actually render
    let lastFrameTime = -1;
    let lastIdx = 0;
    let raf = 0;

    /* scroll length follows the video length: 58s and 90s videos feel the same */
    const setHeight = () => {
      if (!video.duration) return;
      section.style.height = `${video.duration * pxPerSecond + window.innerHeight}px`;
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const distance = section.offsetHeight - window.innerHeight;
      target = distance > 0 ? Math.max(0, Math.min(1, -rect.top / distance)) : 0;
    };

    const tick = () => {
      current += (target - current) * 0.1;
      if (Math.abs(target - current) < 0.0003) current = target;

      const d = video.duration;
      /* never queue a new seek while one is still decoding – this is what
         causes the stutter */
      if (d && !video.seeking) {
        const t = Math.min(
          Math.round(current * d * FPS) / FPS,
          Math.max(0, d - 0.05)
        );
        if (t !== lastFrameTime) {
          lastFrameTime = t;
          video.currentTime = t;
        }
      }

      bar.style.transform = `scaleX(${current})`;

      let idx = 0;
      for (let i = 0; i < chapters.length; i++) {
        if (current >= chapters[i].at) idx = i;
      }
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }

      raf = current !== target || video.seeking ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMeta = () => {
      setHeight();
      kick();
    };

    /* unlocks seeking on iOS Safari */
    video.play().then(() => video.pause()).catch(() => {});

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onMeta);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("seeked", kick);
    if (video.readyState >= 1) onMeta();
    kick();

    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onMeta);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("seeked", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [chapters, pxPerSecond]);

  return (
    <section ref={sectionRef} className="sv-section">
      <div className="sv-frame">
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        />
        <div className="sv-shade" />

        <div className="sv-overlay">
          <div className="sv-label">
            <span>02</span>
            <p>HOME TOUR</p>
          </div>

          {chapters.length > 0 && (
            <div className="sv-chapters">
              {chapters.map((c, i) => (
                <div
                  key={c.title}
                  className={`sv-chapter ${
                    i === active ? "is-active" : i < active ? "is-past" : ""
                  }`}
                >
                  <h3>{c.title}</h3>
                  {c.text && <p>{c.text}</p>}
                </div>
              ))}
            </div>
          )}

          <div className="sv-footer">
            <span>SCROLL TO EXPLORE</span>
            <div className="sv-progress">
              <div ref={barRef} className="sv-bar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}