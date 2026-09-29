"use client";

import { useEffect, useRef, useState } from "react";

type ScrollVideoProps = {
  src: string;
};

export default function ScrollVideo({
  src,
}: ScrollVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) {
      return;
    }

    let frame = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();

      const viewportHeight = window.innerHeight;

      /*
       * The section begins when its top reaches
       * the top of the viewport.
       */
      const sectionStarted = rect.top <= 0;

      /*
       * The section finishes when its bottom
       * reaches the bottom of the viewport.
       */
      const sectionFinished =
        rect.bottom <= viewportHeight;

      const active =
        sectionStarted && !sectionFinished;

      setIsActive(active);

      /*
       * Calculate video progress ONLY while
       * the video section is active.
       */
      if (active && video.duration) {
        const scrollDistance =
          section.offsetHeight - viewportHeight;

        const passed = -rect.top;

        const progress = Math.max(
          0,
          Math.min(
            1,
            passed / scrollDistance
          )
        );

        video.currentTime =
          progress * video.duration;
      }

      frame = 0;
    };

    const handleScroll = () => {
      if (frame) {
        return;
      }

      frame = requestAnimationFrame(update);
    };

    const handleResize = () => {
      handleScroll();
    };

    video.pause();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    video.addEventListener(
      "loadedmetadata",
      handleScroll
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      video.removeEventListener(
        "loadedmetadata",
        handleScroll
      );

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="scroll-video-section"
    >
      <div
        className={`scroll-video-frame ${
          isActive
            ? "scroll-video-frame-active"
            : ""
        }`}
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

            <p>
              HOME TOUR
            </p>
          </div>

          <div className="scroll-video-scroll-text">
            SCROLL TO EXPLORE
          </div>

        </div>
      </div>
    </section>
  );
}