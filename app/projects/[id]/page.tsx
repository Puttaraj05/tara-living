import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollVideo from "@/app/components/ScrollVideo";
import ProjectGallery from "@/app/components/ProjectGallery";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Project = {
  id: number;
  title: string;
  location: string;
  category: string;
  image: string;
  gallery_images: string | null;
  description: string;
  work_done: string;
  client_review: string | null;

  tour_video: string | null;
  story_title: string | null;
  story_text: string | null;
  materials: string | null;
  lighting: string | null;
  space_story: string | null;
  client_video: string | null;
  client_name: string | null;

  created_at: string;
};

function getMediaUrl(path: string | null | undefined) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_URL}${path}`;
}



async function getProject(id: string): Promise<Project | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/projects/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || data.message === "Project not found") {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  let galleryImages: string[] = [];

if (project.gallery_images) {
  try {
    const parsedGallery = JSON.parse(
      project.gallery_images
    );

    if (Array.isArray(parsedGallery)) {
      galleryImages = parsedGallery;
    }
  } catch {
    galleryImages = [];
  }
}

const galleryUrls = galleryImages.map(
  (image) => getMediaUrl(image)
);

  const imageUrl = getMediaUrl(project.image);
  const videoUrl = getMediaUrl(project.tour_video);

  return (
    <main className="project-detail-page">

      {/* HERO */}
      <section className="project-detail-hero">

        <div className="project-detail-hero-content">

          <p className="project-detail-eyebrow">
            {project.category}
          </p>

          <h1>
            {project.title}
          </h1>

          <div className="project-detail-meta">
            <span>{project.location}</span>
            <span>•</span>
            <span>
              {new Date(project.created_at).getFullYear()}
            </span>
          </div>

        </div>

        {imageUrl && (
          <div className="project-detail-hero-image">
            <img
              src={imageUrl}
              alt={project.title}
            />
          </div>
        )}

      </section>


      {/* INTRODUCTION */}
      <section className="project-detail-intro">

        <div className="project-detail-intro-label">
          <span>01</span>
          <p>THE PROJECT</p>
        </div>

        <div className="project-detail-intro-content">

          <h2>
            A space designed
            <br />
            <em>around living.</em>
          </h2>

          <p>
            {project.description}
          </p>

          {project.work_done && (
            <div className="project-work-done">

              <span>WORK DONE</span>

              <p>
                {project.work_done}
              </p>

            </div>
          )}

        </div>

      </section>


      {/* HOME TOUR */}
      {videoUrl && (
       <ScrollVideo src={videoUrl} />
      )}

      {galleryUrls.length > 0 && (
  <ProjectGallery
    images={galleryUrls}
  />
)}


      {/* THE HOME, IN DETAILS */}
      {(project.story_title || project.story_text) && (
        <section className="project-story">

          <div className="project-story-label">

            <p className="project-detail-eyebrow">
              03 — THE HOME, IN DETAILS
            </p>

          </div>

          <div className="project-story-content">

            {project.story_title && (
              <h2>
                {project.story_title}
              </h2>
            )}

            {project.story_text && (
              <p>
                {project.story_text}
              </p>
            )}

          </div>

        </section>
      )}


      {/* DETAILS THAT MATTER */}
      {(project.materials ||
        project.lighting ||
        project.space_story) && (

        <section className="project-details">

          <div className="project-section-heading">

            <p className="project-detail-eyebrow">
              04 — DETAILS THAT MATTER
            </p>

            <h2>
              Designed in
              <br />
              <em>the details.</em>
            </h2>

          </div>


          <div className="project-detail-grid">

            {project.materials && (
              <article className="project-detail-card">

                <span>01</span>

                <h3>
                  Materials
                </h3>

                <p>
                  {project.materials}
                </p>

              </article>
            )}


            {project.lighting && (
              <article className="project-detail-card">

                <span>02</span>

                <h3>
                  Lighting
                </h3>

                <p>
                  {project.lighting}
                </p>

              </article>
            )}


            {project.space_story && (
              <article className="project-detail-card">

                <span>03</span>

                <h3>
                  Space
                </h3>

                <p>
                  {project.space_story}
                </p>

              </article>
            )}

          </div>

        </section>
      )}


      {/* CLIENT REVIEW */}
      {(project.client_review ||
        project.client_video) && (

        <section className="project-client-review">

          <div className="project-client-heading">

            <p className="project-detail-eyebrow">
              05 — CLIENT EXPERIENCE
            </p>

            <h2>
              The experience,
              <br />
              <em>in their words.</em>
            </h2>

          </div>


          {project.client_video && (
            <div className="project-client-video">

              <video
                src={getMediaUrl(project.client_video)}
                controls
                playsInline
                preload="metadata"
              />

            </div>
          )}


          {project.client_review && (
            <blockquote>
              “{project.client_review}”
            </blockquote>
          )}


          {project.client_name && (
            <p className="project-client-name">
              — {project.client_name}
            </p>
          )}

        </section>
      )}


      {/* CTA */}
      <section className="project-detail-cta">

        <p className="project-detail-eyebrow">
          START YOUR PROJECT
        </p>

        <h2>
          Let&apos;s create
          <br />
          <em>your space.</em>
        </h2>

        <p>
          Have a space in mind?
          Let&apos;s bring your vision to life.
        </p>

        <Link
          href="/#contact"
          className="project-cta-button"
        >
          Book a Consultation
        </Link>

      </section>


      {/* BACK */}
      <div className="project-detail-back">

        <Link href="/projects">
          ← Back to Projects
        </Link>

      </div>

    </main>
  );
}