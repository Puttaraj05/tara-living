"use client";

import { useEffect } from "react";

const sectionRoutes: Record<string, string> = {
  "/about": "about",
  "/services": "services",
  "/process": "process",
  "/journal": "journal",
  "/contact": "contact",
};

export default function PathSectionScroll() {
  useEffect(() => {
    const pathname = window.location.pathname;
    const sectionId = sectionRoutes[pathname];

    if (!sectionId) return;

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    const findSection = () => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      if (attempts < 30) {
        attempts++;
        requestAnimationFrame(findSection);
      }
    };

    timer = setTimeout(findSection, 300);

    return () => clearTimeout(timer);
  }, []);

  return null;
}