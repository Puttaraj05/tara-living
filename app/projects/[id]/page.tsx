"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import ScrollVideo from "../../components/ScrollVideo";
import ProjectGallery from "../../components/ProjectGallery";
import Reveal from "../../components/Reveal";
import { Lines, Words } from "../../components/TextReveal";
import ParallaxImg from "../../components/ParallaxImg";
import ScrollProgress from "../../components/ScrollProgress";
import { getMediaUrl } from "../../../lib/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Project = {
  id: number;
  title: string;
  location: string;
  category: string;
  image: string;
  cover_image?: string;
  description: string;
  client_review: string | null;
  client_name: string | null;
  client_video: string | null;
  tour_video: string | null;
  story_title: string | null;
  story_text: string | null;
  space_story: string | null;
  materials: string | null;
  lighting: string | null;
  work_done: string | null;
  gallery_images: string | string[] | null;
};


function parseGallery(gallery: string | string[] | null): string[] {
  if (!gallery) return [];
  if (Array.isArray(gallery)) return gallery;
  try {
    const parsed = JSON.parse(gallery);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* "The Hillside Residence" -> ["The Hillside", <em>Residence</em>] */
function splitTitle(title: string) {
  const w = title.trim().split(/\s+/);
  if (w.length < 2) return [title];
  const mid = Math.ceil(w.length / 2);
  return [w.slice(0, mid).join(" "), <em key="e">{w.slice(mid).join(" ")}</em>];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProject = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(`${API_URL}/api/projects/`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch projects");

        const projects: Project[] = await response.json();
        const found = projects.find((p) => String(p.id) === String(id));

        if (!found) {
          setError(true);
          return;
        }
        setProject(found);
      } catch (err) {
        console.error("Project loading error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <main className="pp-page pp-state">
        <p>Loading project...</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="pp-page pp-state">
        <p className="pp-eyebrow">PROJECT</p>
        <h1>Project not found.</h1>
        <Link href="/projects" className="pp-btn">
          ← Back to projects
        </Link>
      </main>
    );
  }

  const gallery = parseGallery(project.gallery_images);
  const heroImage = getMediaUrl(project.image);
  const tourVideo = getMediaUrl(project.tour_video);
  const clientVideo = getMediaUrl(project.client_video);
  const projectNo = String(project.id).padStart(2, "0");


  return (
    <main className="pp-page">
      <ScrollProgress />

      {/* ================= HERO ================= */}
      <section className="pp-hero">
        <div className="pp-hero-bg">
          <ParallaxImg strength={28} src={heroImage} alt={project.title} />
        </div>
        <div className="pp-hero-shade" />

        <Link href="/" className="pp-hero-logo">
  <Image
    src="/images/logo.png"
    alt="Tara Living Logo"
    width={462}
    height={410}
    priority
    className="pp-hero-logo-img"
  />
</Link>

        <div className="pp-hero-content">
          <div className="pp-meta">
            <span>{project.category}</span>
            <span>{project.location}</span>
          </div>

          <Lines as="h1" lines={splitTitle(project.title)} delay={250} />

          <div className="pp-hero-bottom">
            <span>SELECTED PROJECT — {projectNo}</span>
            <span className="pp-scroll-cue">
              SCROLL <i />
            </span>
          </div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="pp-intro">
        <div>
          <Reveal>
            <p className="pp-eyebrow">01 — THE PROJECT</p>
          </Reveal>
          <Lines
            lines={["A space designed", <em key="e">around living.</em>]}
          />
        </div>

        <div>
          <Reveal delay={150}>
            <p className="pp-lead">{project.description}</p>
          </Reveal>

          <div className="pp-facts">
            {[
              ["Category", project.category],
              ["Location", project.location],
              ["Project", `No. ${projectNo}`],
            ].map(([label, value], n) => (
              <Reveal key={label} delay={250 + n * 120} variant="scale">
                <div className="pp-fact">
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              </Reveal>
            ))}
          </div>

          {project.work_done && (
            <Reveal delay={200}>
              <div className="pp-work">
                <span>WORK DONE</span>
                <p>{project.work_done}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ================= HOME TOUR (unchanged) ================= */}
      {tourVideo && <ScrollVideo src={tourVideo} />}

      {/* ================= GALLERY (unchanged) ================= */}
      {gallery.length > 0 && (
        <ProjectGallery images={gallery.map((image) => getMediaUrl(image))} />
      )}
     


      {/* ================= SECTION 1: THE STORY ================= */}
{(project.story_title || project.story_text) && (
  <section className="pp-story">
    <div className="pp-story-img-wrap">
      <img
        src={
          (gallery && gallery[0] && getMediaUrl(gallery[0])) ||
          heroImage ||
          project.cover_image ||
          "/placeholder-interior.jpg"
        }
        alt={`${project.title} interior`}
      />
    </div>

    <div className="pp-story-content">
      <span className="pp-bignum">03</span>
      <p className="pp-eyebrow">THE STORY</p>
      {project.story_title && (
        <h2 className="pp-story-title">{project.story_title}</h2>
      )}
      <p className="pp-lead">{project.story_text || project.description}</p>
    </div>
  </section>
)}

{/* ================= SECTION 2: DESIGN DETAILS (BENTO) ================= */}
<section className="pp-details">
  <div className="pp-dh">
    <div className="pp-dh-header">
      <p className="pp-eyebrow">04 — DESIGN DETAILS</p>
      <h2 className="pp-dh-title">
        Thoughtful details, <em>quietly considered.</em>
      </h2>
    </div>
    <p className="pp-dh-note">
      Materials, light and space, designed to work as one.
    </p>
  </div>

  <div className="pp-bento">
    {/* Card 01 */}
    <div className="pp-tile pp-card">
      <span className="pp-card-no">01</span>
      <div className="pp-card-body">
        <h3>Materials</h3>
        <p>Subtle wood textures and natural stone elements.</p>
      </div>
    </div>

    {/* Portrait Image */}
    <div className="pp-tile pp-imgtile">
      <img
        src={getMediaUrl(gallery?.[1]) || heroImage}
        alt="Interior detail"
      />
    </div>

    {/* Wide Image (Span 2) */}
    <div className="pp-tile pp-imgtile span-2">
      <img
        src={getMediaUrl(gallery?.[2]) || heroImage}
        alt="Wide interior view"
      />
    </div>

    {/* Wide Image (Span 2) */}
    <div className="pp-tile pp-imgtile span-2">
      <img
        src={getMediaUrl(gallery?.[3]) || heroImage}
        alt="Wide living space"
      />
    </div>

    {/* Card 02 */}
    <div className="pp-tile pp-card">
      <span className="pp-card-no">02</span>
      <div className="pp-card-body">
        <h3>Lighting</h3>
        <p>Warm ambient illumination carefully placed.</p>
      </div>
    </div>

    {/* Portrait Image */}
    <div className="pp-tile pp-imgtile">
      <img
        src={getMediaUrl(gallery?.[4]) || heroImage}
        alt="Lighting detail"
      />
    </div>
  </div>
</section>

{/* ================= SECTION 3: SPACE STORY ================= */}
{project.space_story && (
  <section className="pp-offset">
    <div className="pp-offset-img-wrap">
      <img
        src={
          (gallery && gallery[5] && getMediaUrl(gallery[5])) ||
          (gallery && gallery[1] && getMediaUrl(gallery[1])) ||
          heroImage
        }
        alt="Interior space"
      />
    </div>

    <div className="pp-offset-cap">
      <span>SPACE STORY</span>
      <p>{project.space_story}</p>
    </div>
  </section>
)}

      {/* ================= CLIENT ================= */}
      {project.client_review && (
        <section className="pp-client">
          <Reveal>
            <p className="pp-eyebrow">05 — CLIENT EXPERIENCE</p>
          </Reveal>

          <blockquote>
            <Words text={`“${project.client_review}”`} />
          </blockquote>

          {project.client_name && (
            <Reveal delay={300}>
              <p className="pp-client-who">
                {project.client_name} · {project.location}
              </p>
            </Reveal>
          )}

          {clientVideo && (
            <Reveal variant="clip" className="pp-client-video">
              <video src={clientVideo} muted playsInline controls preload="metadata" />
            </Reveal>
          )}
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="pp-footer">
        <div className="pp-marquee" aria-hidden="true">
          <div className="pp-marquee-track">
            {[0, 1].map((k) => (
              <span key={k}>
                Designed with care ✦ Built to last ✦ Made for living ✦ Designed with
                care ✦ Built to last ✦ Made for living ✦{" "}
              </span>
            ))}
          </div>
        </div>

        <div className="pp-footer-in">
          <div className="pp-footer-top">
            <Lines
              as="h2"
              lines={["Let’s create", <em key="e">your space.</em>]}
            />
            <Link href="/#contact" className="pp-btn pp-btn-sand">
              Book a consultation ↗
            </Link>
          </div>

          <div className="pp-footer-cols">
            <div>
              <div className="pp-logo">
  <Image
    src="/images/logo1.png"
    alt="Tara Living Logo"
    width={462}
    height={410}
    priority
    className="logo"
    style={{
      width: "50px",
      height: "auto",
    }}
  />
</div>
              
              <p>
                Interior design studio crafting calm, functional homes in warm,
                natural materials.
              </p>
            </div>
            <div>
              <h4>Explore</h4>
              <Link href="/">Home</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/#about">About</Link>
              <Link href="/#contact">Contact</Link>
            </div>
            <div>
              <h4>Contact</h4>
              <a href="mailto:taraliving09@gmail.com">taraliving09@gmail.com</a>
              <a href="tel:+91 86391 14375">+91 86391 14375</a>
              <p>Hyderabad, India</p>
            </div>
            <div>
              <h4>Follow</h4>
              <a href="https://www.instagram.com/_taraliving?stkn=MWNremgxbWV2ODhwbg%3D%3D&utm_source=qr">Instagram</a>
              <a href="#">Facebook</a>
              <a
    href="https://wa.me/918639114375"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp"
  >WhatsApp</a>
            </div>
          </div>

          <div className="pp-footer-bot">
            <span>© 2026 YOUR STUDIO. ALL RIGHTS RESERVED.</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}