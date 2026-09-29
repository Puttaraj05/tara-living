"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<
    Testimonial[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/testimonials/"
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
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const getImageUrl = (image: string | null) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/uploads")) {
      return `http://127.0.0.1:8000${image}`;
    }

    return image;
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
        `http://127.0.0.1:8000/api/testimonials/${testimonial.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete testimonial"
        );
      }

      setTestimonials((previous) =>
        previous.filter(
          (item) => item.id !== testimonial.id
        )
      );

      alert("Testimonial deleted successfully!");
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      alert(
        "Unable to delete testimonial. Please try again."
      );
    }
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>TARA</span>
          <small>LIVING</small>
        </div>

        <nav className="admin-nav">
          <Link
            href="/admin"
            className="admin-nav-item"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/clients"
            className="admin-nav-item"
          >
            Clients
          </Link>

          <Link
            href="/admin/projects"
            className="admin-nav-item"
          >
            Projects
          </Link>

          <Link
            href="/admin/services"
            className="admin-nav-item"
          >
            Services
          </Link>

          <Link
            href="/admin/testimonials"
            className="admin-nav-item active"
          >
            Testimonials
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <p className="admin-eyebrow">
              CLIENT EXPERIENCE
            </p>

            <h1 className="admin-welcome">
              Testimonials
            </h1>
          </div>

          <Link
            href="/admin/testimonials/add"
            className="admin-form-submit"
          >
            + Add Testimonial
          </Link>
        </div>

        <section className="admin-project-form-section">
          {loading ? (
            <p>Loading testimonials...</p>
          ) : testimonials.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No testimonials yet</h3>

              <p>
                Add your first client testimonial
                to display it here.
              </p>
            </div>
          ) : (
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
                      {imageUrl ? (
                        <div className="admin-project-image">
                          <img
                            src={imageUrl}
                            alt={
                              testimonial.client_name
                            }
                          />
                        </div>
                      ) : (
                        <div className="admin-project-image admin-testimonial-placeholder">
                          <span>
                            No Photo
                          </span>
                        </div>
                      )}

                      <div className="admin-project-content">
                        <div>
                          <div className="testimonial-stars">
                            {"★".repeat(
                              testimonial.rating
                            )}
                          </div>

                          <h3>
                            {
                              testimonial.client_name
                            }
                          </h3>

                          <p>
                            {
                              testimonial.location
                            }
                          </p>

                          <span className="admin-project-category">
                            {
                              testimonial.property_type
                            }
                          </span>

                          <p className="admin-testimonial-review">
                            {testimonial.review}
                          </p>
                        </div>

                        <div className="admin-project-actions">
                          <Link
                            href={`/admin/testimonials/${testimonial.id}/edit`}
                            className="admin-project-edit"
                          >
                            Edit <span>↗</span>
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
      </main>
    </div>
  );
}