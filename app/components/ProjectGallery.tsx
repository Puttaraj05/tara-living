"use client";

import { useEffect, useRef, useState } from "react";

type ProjectGalleryProps = {
  images: string[];
};

export default function ProjectGallery({
  images,
}: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [lightboxImage, setLightboxImage] =
    useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bar = barRef.current;

    if (!section || !track || !bar) return;

    let target = 0;
    let current = 0;
    let maxX = 0;
    let raf = 0;
    let lastIndex = -1;

    const measure = () => {
      /*
       * Calculate the amount of horizontal movement
       * available inside the gallery.
       */
      maxX = Math.max(
        0,
        track.scrollWidth - window.innerWidth
      );

      /*
       * Give the section enough vertical height
       * for the horizontal gallery to complete.
       */
      section.style.height =
        `${window.innerHeight + maxX}px`;

      const rect =
        section.getBoundingClientRect();

      if (maxX <= 0) {
        target = 0;
        return;
      }

      target = Math.max(
        0,
        Math.min(
          1,
          -rect.top / maxX
        )
      );
    };

    const updateItems = () => {
      const viewportCenter =
        window.innerWidth / 2;

      const items =
        track.querySelectorAll<HTMLElement>(
          ".pg-item"
        );

      let closestIndex = 0;
      let closestDistance = Infinity;

      items.forEach((item, i) => {
        const rect =
          item.getBoundingClientRect();

        const itemCenter =
          rect.left + rect.width / 2;

        const distance =
          Math.abs(
            itemCenter - viewportCenter
          );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }

        /*
         * Subtle emphasis on the image closest
         * to the center.
         */
        const normalizedDistance = Math.min(
          distance / window.innerWidth,
          1
        );

        const scale =
          1 -
          normalizedDistance * 0.055;

        const opacity =
          1 -
          normalizedDistance * 0.25;

        item.style.transform =
          `scale(${scale})`;

        item.style.opacity =
          `${opacity}`;
      });

      if (
        closestIndex !== lastIndex
      ) {
        lastIndex = closestIndex;
        setIndex(closestIndex);
      }
    };

    const tick = () => {
      current +=
        (target - current) * 0.09;

      if (
        Math.abs(
          target - current
        ) < 0.0004
      ) {
        current = target;
      }

      /*
       * Move only as far as the actual
       * track width allows.
       */
      track.style.transform =
        `translate3d(${
          -current * maxX
        }px, 0, 0)`;

      bar.style.transform =
        `scaleX(${current})`;

      updateItems();

      if (current !== target) {
        raf =
          requestAnimationFrame(
            tick
          );
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      measure();

      if (!raf) {
        raf =
          requestAnimationFrame(
            tick
          );
      }
    };

    const resizeObserver =
      new ResizeObserver(kick);

    resizeObserver.observe(track);

    window.addEventListener(
      "scroll",
      kick,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      kick
    );

    window.addEventListener(
      "load",
      kick
    );

    kick();

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "scroll",
        kick
      );

      window.removeEventListener(
        "resize",
        kick
      );

      window.removeEventListener(
        "load",
        kick
      );

      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [images]);

  /*
   * Prevent background page scrolling while
   * the photo viewer is open.
   */
  useEffect(() => {
    if (!lightboxImage) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setLightboxImage(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [lightboxImage]);

  if (!images.length) {
    return null;
  }

  const pad = (n: number) =>
    String(n).padStart(2, "0");

  return (
    <>
      <section
        ref={sectionRef}
        className="pg-section"
      >
        <div className="pg-frame">

          {/* Heading */}
          <div className="pg-heading">
            <div>
              <p className="pg-eyebrow">
                VISUAL MOMENTS
              </p>

              <h2>
                A closer look
                <br />
                <em>at the space.</em>
              </h2>
            </div>

            <div className="pg-count">
              <b>
                {pad(index + 1)}
              </b>

              <span>
                / {pad(images.length)}
              </span>
            </div>
          </div>

          {/* Horizontal scroll gallery */}
          <div
            ref={trackRef}
            className="pg-track"
          >
            {images.map(
              (image, i) => (
                <article
                  className="pg-item"
                  key={`${image}-${i}`}
                >
                  <button
                    type="button"
                    className="pg-photo-button"
                    onClick={() =>
                      setLightboxImage(
                        image
                      )
                    }
                    aria-label={`View project photo ${
                      i + 1
                    }`}
                  >
                    <div className="pg-image">

                      <img
                        src={image}
                        alt={`Project interior ${
                          i + 1
                        }`}
                        loading={
                          i < 2
                            ? "eager"
                            : "lazy"
                        }
                        decoding="async"
                      />

                      <span className="pg-view">
                        <span>
                          View Photo
                        </span>

                        <span className="pg-view-arrow">
                          ↗
                        </span>
                      </span>

                    </div>
                  </button>

                  <div className="pg-item-meta">
                    <span>
                      {pad(i + 1)}
                    </span>

                    <span>
                      PROJECT DETAIL
                    </span>
                  </div>
                </article>
              )
            )}
          </div>

          {/* Footer / progress */}
          <div className="pg-footer">
            <span>
              SCROLL TO EXPLORE
            </span>

            <div className="pg-progress">
              <div
                ref={barRef}
                className="pg-bar"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Full photo viewer */}
      {lightboxImage && (
        <div
          className="pg-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() =>
            setLightboxImage(null)
          }
        >
          <div className="pg-lightbox-header">
            <span>
              TARA LIVING
            </span>

            <button
              type="button"
              onClick={() =>
                setLightboxImage(null)
              }
              className="pg-lightbox-close"
              aria-label="Close photo"
            >
              CLOSE
              <span>×</span>
            </button>
          </div>

          <div
            className="pg-lightbox-image-wrap"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={lightboxImage}
              alt="Project interior enlarged"
              className="pg-lightbox-image"
            />
          </div>

          <div className="pg-lightbox-footer">
            <span>
              CLICK OUTSIDE TO CLOSE
            </span>

            <span>
              ESC
            </span>
          </div>
        </div>
      )}
    </>
  );
}