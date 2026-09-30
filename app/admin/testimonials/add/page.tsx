"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export default function AddTestimonialPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    client_name: "",
    location: "",
    property_type: "",
    rating: 5,
    review: "",
  });

  const [image, setImage] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!image) {
      alert("Please select a client image.");
      return;
    }

    try {
      setLoading(true);

      /*
       * ---------------------------------------
       * 1. Upload testimonial image
       * ---------------------------------------
       */

      const imageFormData = new FormData();

      imageFormData.append(
        "file",
        image
      );

      const imageResponse = await fetch(
        `${API_URL}/api/testimonials/upload-image`,
        {
          method: "POST",
          credentials: "include",
          body: imageFormData,
        }
      );

      if (imageResponse.status === 401) {
        throw new Error(
          "Authentication expired. Please log out and log in again."
        );
      }

      if (!imageResponse.ok) {
        const errorText =
          await imageResponse.text();

        console.error(
          "Image upload error:",
          errorText
        );

        throw new Error(
          "Failed to upload image"
        );
      }

      const imageResult =
        await imageResponse.json();

      /*
       * ---------------------------------------
       * 2. Create testimonial
       * ---------------------------------------
       */

      const response = await fetch(
        `${API_URL}/api/testimonials/`,
        {
          method: "POST",
          credentials: "include",
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

            image:
              imageResult.image,
          }),
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Authentication expired. Please log out and log in again."
        );
      }

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Create testimonial error:",
          errorText
        );

        throw new Error(
          "Failed to create testimonial"
        );
      }

      alert(
        "Testimonial added successfully!"
      );

      router.push(
        "/admin/testimonials"
      );
    } catch (error) {
      console.error(
        "Failed to add testimonial:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add testimonial. Please try again."
      );
    } finally {
      setLoading(false);
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
              Add Testimonial
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
                  placeholder="Enter client name"
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
                  placeholder="Example: Hyderabad"
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
                  gridColumn: "1 / -1",
                }}
              >
                <label>
                  Client Review
                </label>

                <textarea
                  value={
                    formData.review
                  }
                  placeholder="Write the client's testimonial..."
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

              {/* IMAGE */}
              <div
                className="admin-form-field"
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <label>
                  Client Photo
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={(event) => {
                    const selectedFile =
                      event.target.files?.[0];

                    if (selectedFile) {
                      setImage(
                        selectedFile
                      );
                    }
                  }}
                />

                <small>
                  JPG, PNG or WEBP
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
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Save Testimonial"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}