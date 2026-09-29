"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
        const response = await fetch(
          "http://127.0.0.1:8000/api/projects/"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();

        setProjects(data);
      } catch (error) {
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
    if (image.startsWith("http")) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;
  };

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">TL</div>

          <div>
            <h1>TARA LIVING</h1>
            <span>ADMIN</span>
          </div>
        </div>

        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-item">
            <span className="admin-nav-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/clients"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">◉</span>
            <span>Clients</span>
          </Link>

          <Link
            href="/admin/projects"
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">▣</span>
            <span>Projects</span>
          </Link>

          <button className="admin-nav-item" type="button">
            <span className="admin-nav-icon">✦</span>
            <span>Services</span>
          </button>

          <button className="admin-nav-item" type="button">
            <span className="admin-nav-icon">♡</span>
            <span>Testimonials</span>
          </button>

          <button className="admin-nav-item" type="button">
            <span className="admin-nav-icon">↓</span>
            <span>Export</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <span>© {new Date().getFullYear()} Tara Living</span>
          <span>Interior Design Studio</span>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">TARA LIVING</p>
            <h2>Projects</h2>
          </div>

          <Link
            href="/admin/projects/add"
            className="admin-project-add-button"
          >
            + Add Project
          </Link>
        </header>

        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">PORTFOLIO</p>

            <h3>
              Your spaces,
              <br />
              <em>beautifully presented.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Manage the interior projects displayed across the
            Tara Living website.
          </p>
        </section>

        <section className="admin-projects-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">ALL PROJECTS</p>

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
          </div>

          {loading && (
            <div className="admin-empty-state">
              Loading projects...
            </div>
          )}

          {error && (
            <div className="admin-empty-state admin-error">
              {error}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="admin-empty-state">
              No projects have been added yet.
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="admin-project-grid">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="admin-project-card"
                >
                  <div className="admin-project-image">
                    <img
                      src={getImageUrl(project.image)}
                      alt={project.title}
                    />

                    <span className="admin-project-status">
                      Published
                    </span>
                  </div>

                  <div className="admin-project-info">
                    <div>
                      <p>{project.category}</p>

                      <h4>{project.title}</h4>

                      <span>{project.location}</span>

                      <small>
                        Added {formatDate(project.created_at)}
                      </small>
                    </div>

                    <div className="admin-project-actions">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="admin-project-edit"
                      >
                        Edit <span>↗</span>
                      </Link>
                    
                      <button
                        type="button"
                        className="admin-project-delete"
                        onClick={async () => {
                          const confirmed = window.confirm(
                            `Are you sure you want to delete "${project.title}"?`
                          );
                    
                          if (!confirmed) {
                            return;
                          }
                    
                          try {
                            const response = await fetch(
                              `http://127.0.0.1:8000/api/projects/${project.id}`,
                              {
                                method: "DELETE",
                              }
                            );
                    
                            if (!response.ok) {
                              throw new Error("Failed to delete project");
                            }
                    
                            setProjects((previousProjects) =>
                              previousProjects.filter(
                                (item) => item.id !== project.id
                              )
                            );
                    
                            alert("Project deleted successfully!");
                          } catch (error) {
                            console.error("Delete failed:", error);
                    
                            alert(
                              "Unable to delete project. Please try again."
                            );
                          }
                        }}
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

        <footer className="admin-footer">
          <span>TARA LIVING</span>
          <span>Project Management</span>
        </footer>
      </section>
    </main>
  );
}