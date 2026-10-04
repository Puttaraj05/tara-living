"use client";

import { useRef } from "react";

type ProjectTourVideoProps = {
  src: string;
};

export default function ProjectTourVideo({
  src,
}: ProjectTourVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="project-tour-video-wrap">
      <video
        ref={videoRef}
        className="project-tour-video-player"
        src={src}
        controls
        playsInline
        preload="metadata"
      />

      <div className="project-tour-video-label">
        <span>HOME TOUR</span>
        <span>PLAY VIDEO</span>
      </div>
    </div>
  );
}