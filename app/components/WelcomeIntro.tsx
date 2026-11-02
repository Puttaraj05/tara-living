"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const INTRO_KEY = "tara_welcome_intro_seen";

export default function WelcomeIntro() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    // Check whether the intro has already completed in this session
    if (sessionStorage.getItem(INTRO_KEY)) return;

    setVisible(true);

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 2100);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(INTRO_KEY, "true");
    }, 2900);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={`welcome-intro ${
        exiting ? "welcome-intro-exit" : ""
      }`}
    >
      <div className="welcome-intro-inner">
        <div className="welcome-brand">
          <Image
            src="/images/logo1.png"
            alt="Tara Living"
            width={240}
            height={100}
            priority
            className="welcome-logo"
          />
        </div>

        <div className="welcome-subtitle">
          INTERIOR DESIGN STUDIO
        </div>

        <div className="welcome-location">
          HYDERABAD
        </div>

        <div className="welcome-line" />

        <div className="welcome-tagline">
          A SPACE, CONSIDERED.
        </div>
      </div>
    </div>
  );
}