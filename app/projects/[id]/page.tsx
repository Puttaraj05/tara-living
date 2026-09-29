import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollVideo from "@/app/components/ScrollVideo";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

type Project = {
  id: number;

  title: string;
  location: string;
  category: string;
  image: string;

  gallery_images: string | null;

  description: string;
  work_done: string;

  tour_video: string | null;

  story_title: string | null;
  story_text: string | null;

  materials: string | null;
  lighting: string | null;
  space_story: string | null;

  client_video: string | null;
  client_review: string | null;
  client_name: string | null;

  created_at: string;
};

function getMediaUrl(
  path: string | null | undefined
) {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_URL}${path}`;
}

async function getProject(
  id: string
): Promise<Project | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/projects/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (
      !data ||
      data.message === "Project not found"
    ) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function parseGallery(
  gallery: string | null
): string[] {
  if (!gallery) return [];

  try {
    const parsed = JSON.parse(gallery);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
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

  const imageUrl = getMediaUrl(
    project.image
  );

  const videoUrl = getMediaUrl(
    project.tour_video
  );

  const galleryImages = parseGallery(
    project.gallery_images
  ).map(getMediaUrl);

  const year = new Date(
    project.created_at
  ).getFullYear();

  /*
   * Use gallery images as editorial images.
   * If the database has fewer images, we simply
   * render the sections that are available.
   */

  const image1 =
    galleryImages[0] || imageUrl;

  const image2 =
    galleryImages[1] || imageUrl;

  const image3 =
    galleryImages[2] || imageUrl;

  const image4 =
    galleryImages[3] || imageUrl;

  return (
    <main className="editorial-project">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="editorial-header">

        <Link
          href="/"
          className="editorial-logo"
        >
          TARA LIVING
        </Link>

        <nav>
          <Link href="/projects">
            Projects
          </Link>

          <Link href="/#about">
            About
          </Link>

          <Link href="/#contact">
            Contact
          </Link>
        </nav>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="editorial-hero">

        <div className="editorial-hero-image">

          {imageUrl && (
            <img
              src={imageUrl}
              alt={project.title}
            />
          )}

          <div className="editorial-hero-shade" />

        </div>


        <div className="editorial-hero-content">

          <div className="editorial-hero-kicker">

            <span>
              {project.category}
            </span>

            <span>
              {project.location}
            </span>

            <span>
              {year}
            </span>

          </div>


          <h1>
            {project.title}
          </h1>


          <div className="editorial-hero-bottom">

            <span>
              TARA LIVING
            </span>

            <span>
              SCROLL TO EXPLORE
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROJECT INTRO
      ===================================================== */}

      <section className="editorial-intro">

        <div className="editorial-number">
          01
        </div>


        <div className="editorial-intro-content">

          <div className="editorial-intro-heading">

            <p className="editorial-eyebrow">
              THE PROJECT
            </p>

            <h2>
              Designed around
              <br />
              <em>
                the way life unfolds.
              </em>
            </h2>

          </div>


          <div className="editorial-intro-text">

            <p>
              {project.description}
            </p>

            {project.work_done && (
              <div className="editorial-work">

                <span>
                  SCOPE OF WORK
                </span>

                <p>
                  {project.work_done}
                </p>

              </div>
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          LARGE IMAGE
      ===================================================== */}

      {image1 && (
        <section className="editorial-image-full">

          <img
            src={image1}
            alt=""
          />

          <div className="editorial-image-caption">
            {project.title}
          </div>

        </section>
      )}


      {/* =====================================================
          HOME TOUR
      ===================================================== */}

      {videoUrl && (
        <section className="editorial-tour">

          <div className="editorial-section-top">

            <div>
              <span>
                02
              </span>

              <p>
                HOME TOUR
              </p>
            </div>

            <span>
              SCROLL
            </span>

          </div>


          <div className="editorial-tour-title">

            <h2>
              Experience
              <br />
              <em>the space.</em>
            </h2>

          </div>


          <div className="editorial-video">

            <ScrollVideo
              src={videoUrl}
            />

          </div>

        </section>
      )}


      {/* =====================================================
          VISUAL STORY
      ===================================================== */}

      {galleryImages.length > 0 && (
        <section className="editorial-gallery">

          <div className="editorial-section-top">

            <div>
              <span>
                03
              </span>

              <p>
                VISUAL STORY
              </p>
            </div>

          </div>


          <div className="editorial-gallery-intro">

            <h2>
              A collection of
              <br />
              <em>
                quiet moments.
              </em>
            </h2>

            <p>
              Every detail was considered to create
              a space that feels natural, personal and
              effortlessly lived in.
            </p>

          </div>


          <div className="editorial-gallery-grid">

            {image1 && (
              <div className="gallery-image gallery-image-large">

                <img
                  src={image1}
                  alt=""
                />

              </div>
            )}


            {image2 && (
              <div className="gallery-image gallery-image-small">

                <img
                  src={image2}
                  alt=""
                />

              </div>
            )}


            {image3 && (
              <div className="gallery-image gallery-image-wide">

                <img
                  src={image3}
                  alt=""
                />

              </div>
            )}


            {image4 && (
              <div className="gallery-image gallery-image-tall">

                <img
                  src={image4}
                  alt=""
                />

              </div>
            )}

          </div>

        </section>
      )}


      {/* =====================================================
          STORY
      ===================================================== */}

      {(project.story_title ||
        project.story_text) && (

        <section className="editorial-story">

          <div className="editorial-section-top">

            <div>
              <span>
                04
              </span>

              <p>
                THE HOME, IN DETAILS
              </p>
            </div>

          </div>


          <div className="editorial-story-layout">

            <div className="editorial-story-image">

              {image3 && (
                <img
                  src={image3}
                  alt=""
                />
              )}

            </div>


            <div className="editorial-story-copy">

              <p className="editorial-eyebrow">
                DESIGN APPROACH
              </p>

              {project.story_title && (
                <h2>
                  {project.story_title}
                </h2>
              )}

              {project.story_text && (
                <p className="editorial-story-text">
                  {project.story_text}
                </p>
              )}

            </div>

          </div>


          {/* DETAILS */}

          {(project.materials ||
            project.lighting ||
            project.space_story) && (

            <div className="editorial-details">

              {project.materials && (
                <div>

                  <span>
                    01
                  </span>

                  <h3>
                    Materials
                  </h3>

                  <p>
                    {project.materials}
                  </p>

                </div>
              )}


              {project.lighting && (
                <div>

                  <span>
                    02
                  </span>

                  <h3>
                    Lighting
                  </h3>

                  <p>
                    {project.lighting}
                  </p>

                </div>
              )}


              {project.space_story && (
                <div>

                  <span>
                    03
                  </span>

                  <h3>
                    Spatial Approach
                  </h3>

                  <p>
                    {project.space_story}
                  </p>

                </div>
              )}

            </div>
          )}

        </section>
      )}


      {/* =====================================================
          CLIENT
      ===================================================== */}

      {(project.client_review ||
        project.client_video) && (

        <section className="editorial-client">

          <div className="editorial-section-top">

            <div>
              <span>
                05
              </span>

              <p>
                CLIENT EXPERIENCE
              </p>
            </div>

          </div>


          <div className="editorial-client-content">

            <p className="editorial-eyebrow">
              IN THEIR WORDS
            </p>

            {project.client_review && (
              <blockquote>
                “{project.client_review}”
              </blockquote>
            )}

            {project.client_name && (
              <div className="editorial-client-name">
                — {project.client_name}
              </div>
            )}

          </div>


          {project.client_video && (
            <div className="editorial-client-video">

              <video
                src={getMediaUrl(
                  project.client_video
                )}
                controls
                playsInline
                preload="metadata"
              />

            </div>
          )}

        </section>
      )}


      {/* =====================================================
          FINAL IMAGE
      ===================================================== */}

      {image4 && (
        <section className="editorial-final-image">

          <img
            src={image4}
            alt=""
          />

          <div className="editorial-final-overlay">

            <p>
              TARA LIVING
            </p>

            <h2>
              Spaces that
              <br />
              <em>
                feel like home.
              </em>
            </h2>

          </div>

        </section>
      )}


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="editorial-cta">

        <p className="editorial-eyebrow">
          START YOUR PROJECT
        </p>

        <h2>
          Let&apos;s create
          <br />
          <em>
            your space.
          </em>
        </h2>

        <p className="editorial-cta-text">
          Have a space in mind?
          <br />
          Let&apos;s bring your vision to life.
        </p>

        <Link
          href="/#contact"
          className="editorial-cta-button"
        >
          Book a Consultation
        </Link>

        <Link
          href="/projects"
          className="editorial-back"
        >
          ← Back to all projects
        </Link>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="editorial-footer">

        <div>
          TARA LIVING
        </div>

        <p>
          Living spaces.
          <br />
          Thoughtfully designed.
        </p>

        <div>
          © {year} Tara Living
        </div>

      </footer>

    </main>
  );
}