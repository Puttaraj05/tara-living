"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

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
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/services/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();

        setServices(data);
      } catch (error) {
        console.error(
          "Failed to load services:",
          error
        );

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
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/uploads")) {
      return `${API_URL}${image}`;
    }

    return image;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const deleteService = async (
    service: Service
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/services/${service.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete service"
        );
      }

      setServices((currentServices) =>
        currentServices.filter(
          (item) => item.id !== service.id
        )
      );

      alert("Service deleted successfully.");
    } catch (error) {
      console.error(
        "Service deletion failed:",
        error
      );

      alert(
        "Unable to delete service. Please try again."
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
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ▣
            </span>

            <span>Projects</span>
          </Link>

          <Link
            href="/admin/services"
            className="admin-nav-item active"
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

            <h2>Services</h2>
          </div>

          <Link
            href="/admin/services/add"
            className="admin-project-add-button"
          >
            + Add Service
          </Link>
        </header>

        {/* INTRO */}

        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">
              SERVICE MANAGEMENT
            </p>

            <h3>
              Shape every space,
              <br />
              <em>with intention.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Add, edit and manage the services
            displayed across the Tara Living
            website.
          </p>
        </section>

        {/* SERVICES */}

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

            {!loading &&
              !error &&
              services.length > 0 && (
                <Link
                  href="/admin/services/add"
                  className="admin-section-action"
                >
                  Add another service
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

              Loading services...
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="admin-empty-state admin-error">
              <strong>
                Unable to load services
              </strong>

              <span>{error}</span>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            services.length === 0 && (
              <div className="admin-empty-state">
                <strong>
                  No services yet.
                </strong>

                <span>
                  Add your first service to
                  start building the Tara Living
                  service collection.
                </span>

                <Link
                  href="/admin/services/add"
                  className="admin-project-add-button"
                >
                  + Add Service
                </Link>
              </div>
            )}

          {/* SERVICE GRID */}

          {!loading &&
            !error &&
            services.length > 0 && (
              <div className="admin-project-grid">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className="admin-project-card"
                  >
                    {/* IMAGE */}

                    <div className="admin-project-image">
                      {service.image ? (
                        <img
                          src={getImageUrl(
                            service.image
                          )}
                          alt={service.title}
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
                          {service.category ||
                            "Interior Design"}
                        </p>

                        <h4>
                          {service.title}
                        </h4>

                        <span>
                          {service.description ||
                            "No description available."}
                        </span>

                        <small>
                          Added{" "}
                          {formatDate(
                            service.created_at
                          )}
                        </small>
                      </div>

                      {/* ACTIONS */}

                      <div className="admin-project-actions">
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="admin-project-edit"
                        >
                          Edit
                          <span>↗</span>
                        </Link>

                        <button
                          type="button"
                          className="admin-project-delete"
                          onClick={() =>
                            deleteService(
                              service
                            )
                          }
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
            Service Management
          </span>
        </footer>
      </section>
    </main>
  );
}