import Image from "next/image";
import Link from "next/link";

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

function getProjectImage(image: string | null | undefined) {
  if (!image || image === "string") {
    return "/images/service-1.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  return image;
}

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

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="projects-page">

      {/* HEADER */}
      <section className="projects-page-header">

        <div className="projects-page-header-inner">

          <Link
            href="/"
            className="projects-back-link"
          >
            ← Back to home
          </Link>

          <p className="eyebrow">
            OUR PORTFOLIO
          </p>

          <h1>
            Spaces that
            <br />
            <em>tell a story.</em>
          </h1>

          <p className="projects-page-intro">
            A collection of residential, commercial and
            retail interiors thoughtfully designed by Tara
            Living.
          </p>

        </div>

      </section>

      {/* PROJECT GRID */}
      <section className="projects-page-grid">

        {projects.map((project, index) => (

          <Link
            href={`/projects/${project.id}`}
            className={`projects-page-card ${
              index === 0 ? "featured" : ""
            }`}
            key={project.id}
          >

            <div className="projects-page-image">

              <Image
                src={getProjectImage(project.image)}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              <div className="projects-page-overlay">

                <span>
                  View Project
                </span>

                <strong>
                  ↗
                </strong>

              </div>

            </div>

            <div className="projects-page-info">

              <div>

                <span className="project-category">
                  {project.category}
                </span>

                <h2>
                  {project.title}
                </h2>

              </div>

              <div className="projects-page-meta">

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
                {project.description}
              </p>

            </div>

          </Link>

        ))}

      </section>

      {/* CTA */}
      <section className="projects-page-cta">

        <p className="eyebrow">
          HAVE A SPACE IN MIND?
        </p>

        <h2>
          Let&apos;s create
          <br />
          <em>something beautiful.</em>
        </h2>

        <Link
          href="/#contact"
          className="projects-page-cta-link"
        >
          Start Your Project
          <span>↗</span>
        </Link>

      </section>

    </main>
  );
}