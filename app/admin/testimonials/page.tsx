"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

type Testimonial = {
  id: number;
  client_name: string;
  location: string;
  property_type: string;
  rating: number;
  review: string;
  image: string | null;
  created_at: string;
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<
    Testimonial[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/testimonials/`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load testimonials"
          );
        }

        const data = await response.json();

        setTestimonials(data);
      } catch (error) {
        console.error(
          "Failed to load testimonials:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load testimonials"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const getImageUrl = (
    image: string | null
  ) => {
    if (!image) {
      return null;
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

  const deleteTestimonial = async (
    testimonial: Testimonial
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the testimonial from "${testimonial.client_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/testimonials/${testimonial.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete testimonial"
        );
      }

      setTestimonials(
        (currentTestimonials) =>
          currentTestimonials.filter(
            (item) =>
              item.id !== testimonial.id
          )
      );

      alert(
        "Testimonial deleted successfully."
      );
    } catch (error) {
      console.error(
        "Testimonial deletion failed:",
        error
      );

      alert(
        "Unable to delete testimonial. Please try again."
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
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ✦
            </span>

            <span>Services</span>
          </Link>

          <Link
            href="/admin/testimonials"
            className="admin-nav-item active"
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

            <h2>Testimonials</h2>
          </div>

          <Link
            href="/admin/testimonials/add"
            className="admin-project-add-button"
          >
            + Add Testimonial
          </Link>
        </header>

        {/* INTRO */}

        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">
              CLIENT EXPERIENCE
            </p>

            <h3>
              Real experiences,
              <br />
              <em>beautifully remembered.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Add, edit and manage the client
            testimonials displayed across the
            Tara Living website.
          </p>
        </section>

        {/* TESTIMONIALS */}

        <section className="admin-projects-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-eyebrow">
                ALL TESTIMONIALS
              </p>

              <h3>
                {loading
                  ? "Loading..."
                  : `${testimonials.length} ${
                      testimonials.length === 1
                        ? "Testimonial"
                        : "Testimonials"
                    }`}
              </h3>
            </div>

            {!loading &&
              !error &&
              testimonials.length > 0 && (
                <Link
                  href="/admin/testimonials/add"
                  className="admin-section-action"
                >
                  Add another testimonial
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

              Loading testimonials...
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="admin-empty-state admin-error">
              <strong>
                Unable to load testimonials
              </strong>

              <span>{error}</span>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            testimonials.length === 0 && (
              <div className="admin-empty-state">
                <strong>
                  No testimonials yet.
                </strong>

                <span>
                  Add your first client testimonial
                  to showcase real experiences on
                  the Tara Living website.
                </span>

                <Link
                  href="/admin/testimonials/add"
                  className="admin-project-add-button"
                >
                  + Add Testimonial
                </Link>
              </div>
            )}

          {/* TESTIMONIAL GRID */}

          {!loading &&
            !error &&
            testimonials.length > 0 && (
              <div className="admin-project-grid">
                {testimonials.map(
                  (testimonial) => {
                    const imageUrl =
                      getImageUrl(
                        testimonial.image
                      );

                    return (
                      <article
                        key={testimonial.id}
                        className="admin-project-card"
                      >
                        {/* IMAGE */}

                        {imageUrl ? (
                          <div className="admin-project-image">
                            <img
                              src={imageUrl}
                              alt={
                                testimonial.client_name
                              }
                            />

                            <span className="admin-project-status">
                              Published
                            </span>
                          </div>
                        ) : (
                          <div className="admin-project-image admin-testimonial-placeholder">
                            <span>
                              No Photo
                            </span>

                            <span className="admin-project-status">
                              Published
                            </span>
                          </div>
                        )}

                        {/* CONTENT */}

                        <div className="admin-project-info">
                          <div className="admin-project-content">
                            {/* RATING */}

                            <div className="testimonial-stars">
                              {"★".repeat(
                                Math.max(
                                  0,
                                  Math.min(
                                    5,
                                    testimonial.rating
                                  )
                                )
                              )}
                            </div>

                            {/* CLIENT */}

                            <h4>
                              {
                                testimonial.client_name
                              }
                            </h4>

                            {/* LOCATION */}

                            <span>
                              {
                                testimonial.location
                              }
                            </span>

                            {/* PROPERTY TYPE */}

                            <p className="admin-project-category">
                              {
                                testimonial.property_type
                              }
                            </p>

                            {/* REVIEW */}

                            <p className="admin-testimonial-review">
                              {testimonial.review}
                            </p>

                            {/* DATE */}

                            <small>
                              Added{" "}
                              {formatDate(
                                testimonial.created_at
                              )}
                            </small>
                          </div>

                          {/* ACTIONS */}

                          <div className="admin-project-actions">
                            <Link
                              href={`/admin/testimonials/${testimonial.id}/edit`}
                              className="admin-project-edit"
                            >
                              Edit
                              <span>↗</span>
                            </Link>

                            <button
                              type="button"
                              className="admin-project-delete"
                              onClick={() =>
                                deleteTestimonial(
                                  testimonial
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
        </section>

        {/* FOOTER */}

        <footer className="admin-footer">
          <span>TARA LIVING</span>

          <span>
            Testimonial Management
          </span>
        </footer>
      </section>
    </main>
  );
}