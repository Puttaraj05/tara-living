"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type ProcessSectionProps = {
  processSteps: ProcessStep[];
};

export default function ProcessSection({
  processSteps,
}: ProcessSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const track = section.querySelector(
        ".process-track"
      ) as HTMLElement;

      const progressFill = section.querySelector(
        ".process-progress-fill"
      ) as HTMLElement;

      const path = section.querySelector(
        ".process-line-main"
      ) as SVGPathElement;

      if (!track) return;

      /*
      =====================================================
      HORIZONTAL DISTANCE

      5 cards total
      3 cards visible

      We need to move exactly 2 card widths.
      =====================================================
      */

      const getDistance = () => {
        return window.innerWidth * (2 / 3);
      };


      /*
      =====================================================
      CURVED LINE
      =====================================================
      */

      if (path) {
        const pathLength = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(path, {
          strokeDashoffset: 0,

          ease: "none",

          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });
      }


      /*
      =====================================================
      HORIZONTAL SCROLL
      =====================================================
      */

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: () =>
            `+=${window.innerHeight * 2.8}`,

          pin: true,

          scrub: 1.2,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            if (progressFill) {
              progressFill.style.width =
                `${self.progress * 100}%`;
            }
          },
        },
      });


      /*
      =====================================================
      CARD ENTRANCE ANIMATIONS
      =====================================================
      */

      const cards = gsap.utils.toArray<HTMLElement>(
        ".process-card"
      );

      cards.forEach((card, index) => {
        const content = card.querySelector(
          ".process-card-content"
        );

        const number = card.querySelector(
          ".process-card-number"
        );

        if (!content || !number) return;


        /*
        First card visible immediately.
        Other cards enter as horizontal track reaches them.
        */

        if (index === 0) {
          gsap.fromTo(
            [number, content],
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              delay: 0.15,
            }
          );
        }


        /*
        Cards 02–05 animate while the
        horizontal track moves.
        */

        if (index > 0) {
          gsap.fromTo(
            [number, content],
            {
              opacity: 0.15,
              y: 30,
              scale: 0.94,
              filter: "blur(4px)",
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",

              ease: "power3.out",

              scrollTrigger: {
                trigger: card,

                containerAnimation:
                  horizontalTween,

                start: "left 85%",

                end: "left 50%",

                scrub: 1,
              },
            }
          );
        }
      });


      /*
      =====================================================
      ACTIVE CARD SCALE
      =====================================================
      */

      cards.forEach((card, index) => {
        if (index === 0) return;

        const number = card.querySelector(
          ".process-card-number"
        );

        if (!number) return;

        gsap.fromTo(
          number,

          {
            scale: 0.75,
          },

          {
            scale: 1.08,

            ease: "power2.out",

            scrollTrigger: {
              trigger: card,

              containerAnimation:
                horizontalTween,

              start: "left 75%",

              end: "left 45%",

              scrub: 1,
            },
          }
        );
      });


      /*
      =====================================================
      REFRESH
      =====================================================
      */

      ScrollTrigger.refresh();

    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="process"
    >
      <div className="process-pin">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="process-heading">

          <div className="process-heading-line">
            <span />
            <p>OUR PROCESS</p>
            <span />
          </div>

          <h2>
            A thoughtful process.
            <br />
            <em>Effortless experience.</em>
          </h2>

        </div>


        {/* =========================================
            BACKGROUND NUMBER
        ========================================= */}

        <div className="process-background-number">
          05
        </div>


        {/* =========================================
            VIEWPORT
        ========================================= */}

        <div className="process-viewport">

          <div className="process-track">

            {/* =====================================
                CONTINUOUS CURVE
            ===================================== */}

            <svg
              className="process-line"
              viewBox="0 0 2500 500"
              preserveAspectRatio="none"
            >

              <path
                className="process-line-shadow"
                d="
                  M 80 330

                  C 250 330
                    280 150
                    500 150

                  S 720 150
                    820 320

                  S 1080 470
                    1260 270

                  S 1500 90
                    1690 220

                  S 1940 390
                    2120 210

                  S 2320 100
                    2420 180
                "
              />

              <path
                className="process-line-main"
                d="
                  M 80 330

                  C 250 330
                    280 150
                    500 150

                  S 720 150
                    820 320

                  S 1080 470
                    1260 270

                  S 1500 90
                    1690 220

                  S 1940 390
                    2120 210

                  S 2320 100
                    2420 180
                "
              />

            </svg>


            {/* =====================================
                FIVE PROCESS STEPS
            ===================================== */}

            {processSteps.map((item, index) => (
              <div
                className={`process-card process-card-${
                  index + 1
                }`}
                key={item.number}
              >

                {/* NUMBER */}

                <div className="process-card-number">
                  {item.number}
                </div>


                {/* CONTENT */}

                <div className="process-card-content">

                  <span className="process-label">
                    STEP {item.number}
                  </span>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>


        {/* =========================================
            BOTTOM PROGRESS
        ========================================= */}

        <div className="process-progress">

          <span className="process-progress-label">
            OUR JOURNEY
          </span>

          <div className="process-progress-line">

            <div className="process-progress-fill" />

          </div>

          <span className="process-progress-count">
            05
          </span>

        </div>

      </div>
    </section>
  );
}