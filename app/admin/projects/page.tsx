"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

type Project = {
  id: number;
  title: string;
  location: string;
  category: string;
  image: string;
  description: string;
  work_done: string;
  client_review: string | null;
  created_at: string;
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/projects/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getImageUrl = (image: string) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}${image}`;
  };

  const deleteProject = async (id: number) => {
  if (!confirm("Are you sure you want to delete this project?")) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/projects/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const responseText = await response.text();

    console.log("DELETE STATUS:", response.status);
    console.log("DELETE RESPONSE:", responseText);

    if (!response.ok) {
      throw new Error(
        `Failed to delete project (${response.status}): ${responseText}`
      );
    }

    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );

  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Failed to delete project"
    );
  }
};

  return (
    <main className="admin-page">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">
            <img src="/images/logo.png" alt="Tara Living" />
          </div>

          <div>
            <h1>TARA LIVING</h1>
            <span>ADMIN</span>
          </div>
        </div>

        <nav className="admin-nav">
          <Link
            href="/admin"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ⌂
            </span>

            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/clients"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ◉
            </span>

            <span>Clients</span>
          </Link>

          <Link
            href="/admin/projects"
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">
              ▣
            </span>

            <span>Projects</span>
          </Link>

          <Link
            href="/admin/services"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ✦
            </span>

            <span>Services</span>
          </Link>

          <Link
            href="/admin/testimonials"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ♡
            </span>

            <span>Testimonials</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <span>
            © {new Date().getFullYear()} Tara Living
          </span>

          <span>
            Interior Design Studio
          </span>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="admin-main">
        {/* TOP BAR */}

        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">
              TARA LIVING
            </p>

            <h2>Projects</h2>
          </div>

          <Link
            href="/admin/projects/add"
            className="admin-project-add-button"
          >
            + Add Project
          </Link>
        </header>

        {/* INTRO */}

        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">
              PORTFOLIO MANAGEMENT
            </p>

            <h3>
              Your spaces,
              <br />
              <em>beautifully presented.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Add, edit and manage the interior
            projects displayed across the Tara
            Living website.
          </p>
        </section>

        {/* PROJECTS */}

        <section className="admin-projects-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">
                ALL PROJECTS
              </p>

              <h3>
                {loading
                  ? "Loading..."
                  : `${projects.length} ${
                      projects.length === 1
                        ? "Project"
                        : "Projects"
                    }`}
              </h3>
            </div>

            {!loading &&
              !error &&
              projects.length > 0 && (
                <Link
                  href="/admin/projects/add"
                  className="admin-section-action"
                >
                  Add another project
                  <span>↗</span>
                </Link>
              )}
          </div>

          {/* LOADING */}

          {loading && (
            <div className="admin-empty-state">
              <span className="admin-loading-dot">
                •
              </span>

              Loading projects...
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="admin-empty-state admin-error">
              <strong>
                Unable to load projects
              </strong>

              <span>{error}</span>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            projects.length === 0 && (
              <div className="admin-empty-state">
                <strong>
                  No projects yet.
                </strong>

                <span>
                  Add your first interior project
                  to start building the portfolio.
                </span>

                <Link
                  href="/admin/projects/add"
                  className="admin-project-add-button"
                >
                  + Add Project
                </Link>
              </div>
            )}

          {/* PROJECT GRID */}

          {!loading &&
            !error &&
            projects.length > 0 && (
              <div className="admin-project-grid">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="admin-project-card"
                  >
                    {/* IMAGE */}

                    <div className="admin-project-image">
                      {project.image ? (
                        <img
                          src={getImageUrl(
                            project.image
                          )}
                          alt={project.title}
                        />
                      ) : (
                        <div className="admin-project-no-image">
                          No Image
                        </div>
                      )}

                      <span className="admin-project-status">
                        Published
                      </span>
                    </div>

                    {/* CONTENT */}

                    <div className="admin-project-info">
                      <div className="admin-project-content">
                        <p>
                          {project.category ||
                            "Interior Design"}
                        </p>

                        <h4>
                          {project.title}
                        </h4>

                        <span>
                          {project.location ||
                            "Location not specified"}
                        </span>

                        <small>
                          Added{" "}
                          {formatDate(
                            project.created_at
                          )}
                        </small>
                      </div>

                      {/* ACTIONS */}

                      <div className="admin-project-actions">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="admin-project-edit"
                        >
                          Edit
                          <span>↗</span>
                        </Link>

                        <button
  type="button"
  className="admin-project-delete"
  onClick={() => deleteProject(project.id)}
>
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>

        {/* FOOTER */}

        <footer className="admin-footer">
          <span>TARA LIVING</span>

          <span>
            Project Management
          </span>
        </footer>
      </section>
    </main>
  );
}