"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();

  const [testimonial, setTestimonial] =
    useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    client_name: "",
    location: "",
    property_type: "",
    rating: 5,
    review: "",
  });

  const [newImage, setNewImage] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/testimonials/${params.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load testimonial"
          );
        }

        const data: Testimonial =
          await response.json();

        setTestimonial(data);

        setFormData({
          client_name: data.client_name,
          location: data.location,
          property_type: data.property_type,
          rating: data.rating,
          review: data.review,
        });
      } catch (error) {
        console.error(
          "Failed to load testimonial:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, [params.id]);

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
      return `http://127.0.0.1:8000${image}`;
    }

    return image;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!testimonial) {
      return;
    }

    try {
      setSaving(true);

      let imagePath = testimonial.image;

      // Upload new image only if selected
      if (newImage) {
        const imageFormData =
          new FormData();

        imageFormData.append(
          "file",
          newImage
        );

        const imageResponse =
          await fetch(
            "http://127.0.0.1:8000/api/testimonials/upload-image",
            {
              method: "POST",
              body: imageFormData,
            }
          );

        if (!imageResponse.ok) {
          throw new Error(
            "Failed to upload image"
          );
        }

        const imageResult =
          await imageResponse.json();

        imagePath = imageResult.image;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/testimonials/${testimonial.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            client_name:
              formData.client_name,

            location:
              formData.location,

            property_type:
              formData.property_type,

            rating:
              formData.rating,

            review:
              formData.review,

            image: imagePath,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update testimonial"
        );
      }

      alert(
        "Testimonial updated successfully!"
      );

      router.push(
        "/admin/testimonials"
      );
    } catch (error) {
      console.error(
        "Update failed:",
        error
      );

      alert(
        "Unable to update testimonial. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <main className="admin-main">
          <p>Loading testimonial...</p>
        </main>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="admin-page">
        <main className="admin-main">
          <h2>
            Testimonial not found
          </h2>

          <Link
            href="/admin/testimonials"
            className="admin-form-cancel"
          >
            ← Back to Testimonials
          </Link>
        </main>
      </div>
    );
  }

  const currentImage = getImageUrl(
    testimonial.image
  );

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
              Edit Testimonial
            </h1>
          </div>

          <Link
            href="/admin/testimonials"
            className="admin-form-cancel"
          >
            ← Back
          </Link>
        </div>

        <section className="admin-project-form-section">
          <form
            className="admin-project-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-grid">
              {/* CLIENT NAME */}
              <div className="admin-form-field">
                <label>
                  Client Name
                </label>

                <input
                  type="text"
                  value={
                    formData.client_name
                  }
                  required
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      client_name:
                        event.target.value,
                    })
                  }
                />
              </div>

              {/* LOCATION */}
              <div className="admin-form-field">
                <label>
                  Location
                </label>

                <input
                  type="text"
                  value={
                    formData.location
                  }
                  required
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      location:
                        event.target.value,
                    })
                  }
                />
              </div>

              {/* PROPERTY TYPE */}
              <div className="admin-form-field">
                <label>
                  Property Type
                </label>

                <select
                  value={
                    formData.property_type
                  }
                  required
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      property_type:
                        event.target.value,
                    })
                  }
                >
                  <option value="">
                    Select property type
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="Apartment">
                    Apartment
                  </option>

                  <option value="Independent House">
                    Independent House
                  </option>

                  <option value="Office">
                    Office
                  </option>

                  <option value="Retail Store">
                    Retail Store
                  </option>

                  <option value="Commercial Space">
                    Commercial Space
                  </option>
                </select>
              </div>

              {/* RATING */}
              <div className="admin-form-field">
                <label>
                  Rating
                </label>

                <select
                  value={
                    formData.rating
                  }
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      rating: Number(
                        event.target.value
                      ),
                    })
                  }
                >
                  <option value={5}>
                    ★★★★★ — 5 Stars
                  </option>

                  <option value={4}>
                    ★★★★☆ — 4 Stars
                  </option>

                  <option value={3}>
                    ★★★☆☆ — 3 Stars
                  </option>

                  <option value={2}>
                    ★★☆☆☆ — 2 Stars
                  </option>

                  <option value={1}>
                    ★☆☆☆☆ — 1 Star
                  </option>
                </select>
              </div>

              {/* REVIEW */}
              <div
                className="admin-form-field"
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <label>
                  Client Review
                </label>

                <textarea
                  value={
                    formData.review
                  }
                  rows={7}
                  required
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      review:
                        event.target.value,
                    })
                  }
                />
              </div>

              {/* CURRENT IMAGE */}
              {currentImage && (
                <div
                  className="admin-form-field"
                  style={{
                    gridColumn:
                      "1 / -1",
                  }}
                >
                  <label>
                    Current Client Photo
                  </label>

                  <div className="admin-project-image-preview">
                    <img
                      src={currentImage}
                      alt={
                        testimonial.client_name
                      }
                    />
                  </div>
                </div>
              )}

              {/* NEW IMAGE */}
              <div
                className="admin-form-field"
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <label>
                  Replace Client Photo
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const selectedFile =
                      event.target.files?.[0];

                    if (selectedFile) {
                      setNewImage(
                        selectedFile
                      );
                    }
                  }}
                />

                <small>
                  Leave empty to keep the
                  current photo.
                </small>
              </div>
            </div>

            <div className="admin-form-actions">
              <Link
                href="/admin/testimonials"
                className="admin-form-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="admin-form-submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Update Testimonial"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}