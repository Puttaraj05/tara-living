"use client";

import { useEffect, useRef } from "react";

type ProjectGalleryProps = {
  images: string[];
};

export default function ProjectGallery({
  images,
}: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const track = trackRef.current;

    if (!section || !frame || !track) {
      return;
    }

    let animationFrame = 0;

    const updateGallery = () => {
      const rect = section.getBoundingClientRect();

      const viewportHeight = window.innerHeight;

      /*
       * How far the user can scroll while
       * the gallery remains active.
       */
      const scrollDistance =
        section.offsetHeight - viewportHeight;

      if (scrollDistance <= 0) {
        return;
      }

      const passed = -rect.top;

      let progress =
        passed / scrollDistance;

      progress = Math.max(
        0,
        Math.min(1, progress)
      );

      /*
       * Horizontal distance required to show
       * the complete gallery.
       */
      const maxTranslate =
        track.scrollWidth -
        window.innerWidth;

      const translateX =
        progress * maxTranslate;

      /*
       * Move gallery horizontally.
       */
      track.style.transform =
        `translate3d(${-translateX}px, 0, 0)`;

      /*
       * Keep the gallery visually fixed while
       * scrolling through this section.
       */
      const sectionStarted =
        rect.top <= 0;

      const sectionFinished =
        rect.bottom <= viewportHeight;

      const isActive =
        sectionStarted && !sectionFinished;

      if (isActive) {
        frame.classList.add(
          "project-gallery-frame-active"
        );
      } else {
        frame.classList.remove(
          "project-gallery-frame-active"
        );
      }

      animationFrame = 0;
    };

    const handleScroll = () => {
      if (animationFrame) {
        return;
      }

      animationFrame =
        requestAnimationFrame(
          updateGallery
        );
    };

    const handleResize = () => {
      handleScroll();
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    /*
     * Wait for images/layout to calculate
     * their real width.
     */
    window.addEventListener(
      "load",
      handleResize
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

      window.removeEventListener(
        "load",
        handleResize
      );

      if (animationFrame) {
        cancelAnimationFrame(
          animationFrame
        );
      }
    };
  }, [images]);

  if (!images.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="project-gallery-section"
    >
      <div
        ref={frameRef}
        className="project-gallery-frame"
      >

        {/* HEADING */}
        <div className="project-gallery-heading">

          <p className="eyebrow">
            VISUAL MOMENTS
          </p>

          <h2>
            A closer look
            <br />
            <em>at the space.</em>
          </h2>
        </div>

        {/* HORIZONTAL TRACK */}
        <div
          ref={trackRef}
          className="project-gallery-track"
        >

          {images.map(
            (image, index) => (
              <div
                className="project-gallery-item"
                key={`${image}-${index}`}
              >

                <div className="project-gallery-image">

                  <img
                    src={image}
                    alt={`Project interior ${
                      index + 1
                    }`}
                    loading={
                      index === 0
                        ? "eager"
                        : "lazy"
                    }
                  />

                </div>

                <div className="project-gallery-number">
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </div>

              </div>
            )
          )}

        </div>

        {/* BOTTOM PROGRESS */}
        <div className="project-gallery-progress">

          <span>
            SCROLL TO EXPLORE
          </span>

          <span>
            {String(
              images.length
            ).padStart(2, "0")}
          </span>

        </div>

      </div>
    </section>
  );
}