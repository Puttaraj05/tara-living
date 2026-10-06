import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "../../lib/media";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Project = {
  id: number;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
  created_at: string;
};

/* =========================================================
   IMAGE
========================================================= */

function getProjectImage(image: string | null | undefined) {
  const url = getMediaUrl(image);
  return url || "/images/service-1.jpg";
}

/* =========================================================
   PROJECT DESCRIPTIONS
   Fixed editorial descriptions
========================================================= */

function getProjectDescription(project: Project, index: number) {
  const descriptions = [
    "A thoughtfully composed interior where natural materials, warm textures and refined detailing come together to create a calm and inviting atmosphere.",

    "Designed around everyday living, this space balances functionality with understated elegance through carefully selected finishes, lighting and furniture.",

    "A contemporary interior shaped by clean lines, layered textures and purposeful details, creating a space that feels both sophisticated and effortless.",

    "An expressive interpretation of modern living, combining timeless materials with carefully considered proportions and a warm residential character.",

    "Every element of this interior was considered to create visual harmony — from the material palette and lighting to the smallest finishing details.",

    "A refined space designed with simplicity at its core, where thoughtful planning and subtle luxury create an environment that feels personal and timeless.",
  ];

  return descriptions[index % descriptions.length];
}


/* =========================================================
   API
========================================================= */

async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/projects`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}


/* =========================================================
   PAGE
========================================================= */

export default async function ProjectsPage() {
  const projects = await getProjects();

  const featuredProject = projects[0];
  const remainingProjects = projects.slice(1);

  return (
    <main className="portfolio-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="portfolio-hero">

        <div className="portfolio-hero-background" />

        <div className="portfolio-hero-content">

          <Link
            href="/"
            className="portfolio-back-link"
          >
            <span>←</span>
            Back to home
          </Link>

          <div className="portfolio-hero-main">

            <p className="eyebrow portfolio-reveal">
              TARA LIVING / SELECTED WORK
            </p>

            <h1 className="portfolio-reveal">
              Spaces
              <br />
              <em>with a story.</em>
            </h1>

            <div className="portfolio-hero-bottom">

              <p className="portfolio-hero-description">
                A collection of interiors shaped by thoughtful
                planning, natural materials and a deep
                understanding of how people experience space.
              </p>

              <div className="portfolio-scroll">
                <span>Explore projects</span>
                <span className="portfolio-scroll-line" />
                <span>↓</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO / STATS
      ===================================================== */}

      <section className="portfolio-intro">

        <div className="portfolio-intro-label">
          <span>01</span>
          <span>THE COLLECTION</span>
        </div>

        <div className="portfolio-intro-content">

          <h2>
            Interiors designed
            <br />
            <em>around people.</em>
          </h2>

          <p>
            From intimate homes to thoughtfully designed
            commercial spaces, every Tara Living project begins
            with understanding how a space should feel, function
            and evolve with the people who use it.
          </p>

        </div>

        <div className="portfolio-stats">

          <div>
            <strong>{projects.length}</strong>
            <span>Projects</span>
          </div>

          <div>
            <strong>10+</strong>
            <span>Years of experience</span>
          </div>

          <div>
            <strong>04</strong>
            <span>Design disciplines</span>
          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED PROJECT
      ===================================================== */}

      {featuredProject && (

        <section className="portfolio-featured">

          <div className="portfolio-section-heading">

            <div>
              <span className="portfolio-index">
                02
              </span>

              <span className="portfolio-heading-label">
                FEATURED PROJECT
              </span>
            </div>

            <span className="portfolio-heading-line" />

          </div>


          <Link
            href={`/projects/${featuredProject.id}`}
            className="portfolio-featured-project"
          >

            <div className="portfolio-featured-image">

              <Image
                src={getProjectImage(featuredProject.image)}
                alt={featuredProject.title}
                fill
                priority
                sizes="100vw"
              />

              <div className="portfolio-image-shade" />

              <div className="portfolio-featured-number">
                01
              </div>

              <div className="portfolio-view-project">
                <span>View project</span>
                <strong>↗</strong>
              </div>

            </div>


            <div className="portfolio-featured-info">

              <div>

                <span className="portfolio-project-category">
                  {featuredProject.category}
                </span>

                <h2>
                  {featuredProject.title}
                </h2>

              </div>

              <div className="portfolio-featured-details">

                <div>
                  <span>LOCATION</span>
                  <strong>
                    {featuredProject.location}
                  </strong>
                </div>

                <div>
                  <span>YEAR</span>
                  <strong>
                    {new Date(
                      featuredProject.created_at
                    ).getFullYear()}
                  </strong>
                </div>

              </div>

              <p>
                {getProjectDescription(featuredProject, 0)}
              </p>

              <div className="portfolio-discover">
                Discover project
                <span>→</span>
              </div>

            </div>

          </Link>

        </section>

      )}


      {/* =====================================================
          PROJECT COLLECTION
      ===================================================== */}

      {remainingProjects.length > 0 && (

        <section className="portfolio-collection">

          <div className="portfolio-section-heading">

            <div>
              <span className="portfolio-index">
                03
              </span>

              <span className="portfolio-heading-label">
                SELECTED PROJECTS
              </span>
            </div>

            <span className="portfolio-heading-line" />

          </div>


          <div className="portfolio-project-list">

            {remainingProjects.map((project, index) => {

              const projectNumber = String(
                index + 2
              ).padStart(2, "0");

              const isReverse = index % 2 !== 0;

              return (

                <Link
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className={`portfolio-editorial-project ${
                    isReverse ? "reverse" : ""
                  }`}
                >

                  <div className="portfolio-editorial-image">

                    <Image
                      src={getProjectImage(project.image)}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 58vw"
                    />

                    <div className="portfolio-image-overlay" />

                    <span className="portfolio-project-number">
                      {projectNumber}
                    </span>

                    <div className="portfolio-image-arrow">
                      ↗
                    </div>

                  </div>


                  <div className="portfolio-editorial-info">

                    <span className="portfolio-project-number-text">
                      {projectNumber}
                    </span>

                    <span className="portfolio-project-category">
                      {project.category}
                    </span>

                    <h2>
                      {project.title}
                    </h2>

                    <div className="portfolio-project-meta">

                      <span>
                        {project.location}
                      </span>

                      <span>
                        {new Date(
                          project.created_at
                        ).getFullYear()}
                      </span>

                    </div>

                    <p>
                      {getProjectDescription(
                        project,
                        index + 1
                      )}
                    </p>

                    <span className="portfolio-project-link">
                      Explore project
                      <span>↗</span>
                    </span>

                  </div>

                </Link>

              );
            })}

          </div>

        </section>

      )}


      {/* =====================================================
          DESIGN PHILOSOPHY
      ===================================================== */}

      <section className="portfolio-philosophy">

        <div className="portfolio-philosophy-number">
          04
        </div>

        <div className="portfolio-philosophy-content">

          <p className="eyebrow">
            OUR DESIGN PHILOSOPHY
          </p>

          <h2>
            Beauty lives
            <br />
            <em>in the details.</em>
          </h2>

          <p className="portfolio-philosophy-text">
            We believe the best interiors are not simply
            beautiful to look at. They feel natural to live in,
            work in and experience. Our approach combines
            considered layouts, tactile materials, meaningful
            details and a timeless visual language.
          </p>

        </div>

      </section>


      {/* =====================================================
          CATEGORY STRIP
      ===================================================== */}

      <section className="portfolio-categories">

        <div className="portfolio-category-item">
          <span>01</span>
          <strong>Residential</strong>
          <p>
            Homes created around the people who live in them.
          </p>
        </div>

        <div className="portfolio-category-item">
          <span>02</span>
          <strong>Commercial</strong>
          <p>
            Purposeful spaces designed for modern businesses.
          </p>
        </div>

        <div className="portfolio-category-item">
          <span>03</span>
          <strong>Design & Styling</strong>
          <p>
            Details that give every space its own identity.
          </p>
        </div>

        <div className="portfolio-category-item">
          <span>04</span>
          <strong>Renovation</strong>
          <p>
            Thoughtful transformations with lasting character.
          </p>
        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="portfolio-final-cta">

        <div className="portfolio-final-inner">

          <p className="eyebrow">
            HAVE A SPACE IN MIND?
          </p>

          <h2>
            Let&apos;s create
            <br />
            <em>something meaningful.</em>
          </h2>

          <p>
            Tell us about your space and let&apos;s explore
            what it could become.
          </p>

          <Link
            href="/#contact"
            className="portfolio-final-button"
          >
            Start your project
            <span>↗</span>
          </Link>

        </div>

      </section>

    </main>
  );
}