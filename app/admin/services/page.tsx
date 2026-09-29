"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Service = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  created_at: string;
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/services/"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();

        setServices(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load services"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getImageUrl = (image: string) => {
    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/uploads")) {
      return `http://127.0.0.1:8000${image}`;
    }

    return image;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          <Link
            href="/admin"
            className="admin-nav-item"
          >
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
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">▣</span>
            <span>Projects</span>
          </Link>

          <Link
            href="/admin/services"
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">✦</span>
            <span>Services</span>
          </Link>

          <button
            className="admin-nav-item"
            type="button"
          >
            <span className="admin-nav-icon">♡</span>
            <span>Testimonials</span>
          </button>

          <button
            className="admin-nav-item"
            type="button"
          >
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
            <p className="admin-eyebrow">
              TARA LIVING
            </p>

            <h2>Services</h2>
          </div>

          <Link
            href="/admin/services/add"
            className="admin-project-add-button"
          >
            + Add Service
          </Link>
        </header>

        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">
              SERVICES
            </p>

            <h3>
              Shape every space,
              <br />
              <em>with intention.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Manage the services displayed across the
            Tara Living website.
          </p>
        </section>

        <section className="admin-projects-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">
                ALL SERVICES
              </p>

              <h3>
                {loading
                  ? "Loading..."
                  : `${services.length} ${
                      services.length === 1
                        ? "Service"
                        : "Services"
                    }`}
              </h3>
            </div>
          </div>

          {loading && (
            <div className="admin-empty-state">
              Loading services...
            </div>
          )}

          {error && (
            <div className="admin-empty-state admin-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            services.length === 0 && (
              <div className="admin-empty-state">
                No services have been added yet.
              </div>
            )}

          {!loading &&
            !error &&
            services.length > 0 && (
              <div className="admin-project-grid">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className="admin-project-card"
                  >
                    <div className="admin-project-image">
                      <img
                        src={getImageUrl(service.image)}
                        alt={service.title}
                      />

                      <span className="admin-project-status">
                        Published
                      </span>
                    </div>

                    <div className="admin-project-info">
                      <div>
                        <p>{service.category}</p>

                        <h4>{service.title}</h4>

                        <span>
                          {service.description}
                        </span>

                        <small>
                          Added{" "}
                          {formatDate(
                            service.created_at
                          )}
                        </small>
                      </div>

                      <div className="admin-project-actions">
                        <Link
                         href={`/admin/services/${service.id}/edit`}
                         className="admin-project-edit"
                        >
                          Edit <span>↗</span>
                        </Link>

                        <button
                          type="button"
                           className="admin-project-delete"
                           onClick={async () => {
                             const confirmed = window.confirm(
                               `Are you sure you want to delete "${service.title}"?`
                             );
                          
                             if (!confirmed) {
                               return;
                             }
                          
                             try {
                               const response = await fetch(
                                 `http://127.0.0.1:8000/api/services/${service.id}`,
                                 {
                                   method: "DELETE",
                                }
                                 );
                          
                              if (!response.ok) {
                                throw new Error("Failed to delete service");
                              }
                          
                              setServices((previousServices) =>
                                previousServices.filter(
                                  (item) => item.id !== service.id
                                )
                              );
                          
                              alert("Service deleted successfully!");
                            } catch (error) {
                              console.error("Delete failed:", error);
                          
                               alert(
                                "Unable to delete service. Please try again."
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
          <span>Service Management</span>
        </footer>
      </section>
    </main>
  );
}