"use client";

import { useEffect, useRef } from "react";

type ScrollVideoProps = {
  src: string;
};

export default function ScrollVideo({
  src,
}: ScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const video = videoRef.current;

    if (!section || !frame || !video) return;

    let raf = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();

      const viewportHeight = window.innerHeight;

      /*
       * The video becomes active when its section
       * reaches the viewport.
       */
      const started = rect.top <= 0;

      const ended =
        rect.bottom <= viewportHeight;

      if (started && !ended) {
        frame.classList.add("is-active");

        if (video.duration) {
          const scrollDistance =
            section.offsetHeight - viewportHeight;

          const progress = Math.max(
            0,
            Math.min(
              1,
              -rect.top / scrollDistance
            )
          );

          video.currentTime =
            progress * video.duration;
        }
      } else {
        frame.classList.remove("is-active");
      }

      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;

      raf = requestAnimationFrame(update);
    };

    video.pause();

    video.addEventListener(
      "loadedmetadata",
      onScroll
    );

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      onScroll
    );

    onScroll();

    return () => {
      video.removeEventListener(
        "loadedmetadata",
        onScroll
      );

      window.removeEventListener(
        "scroll",
        onScroll
      );

      window.removeEventListener(
        "resize",
        onScroll
      );

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-video-section"
    >
      <div
        ref={frameRef}
        className="scroll-video-frame"
      >
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
        />

        <div className="scroll-video-overlay">
          <div className="scroll-video-label">
            <span>02</span>
            <p>HOME TOUR</p>
          </div>

          <div className="scroll-video-scroll-text">
            SCROLL TO EXPLORE
          </div>
        </div>
      </div>
    </section>
  );
}