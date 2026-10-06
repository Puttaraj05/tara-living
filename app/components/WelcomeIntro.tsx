"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function WelcomeIntro() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 2100);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2900);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

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
