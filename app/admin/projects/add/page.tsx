"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function AddProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    description: "",
    work_done: "",
    client_review: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!imageFile) {
      alert("Please select a project image.");
      return;
    }

    try {
      // =========================================================
      // 1. Upload project image
      // =========================================================

      const imageData = new FormData();

      imageData.append("file", imageFile);

      const imageResponse = await fetch(
        `${API_URL}/api/projects/upload-image`,
        {
          method: "POST",

          // IMPORTANT:
          // Send the HTTP-only tara_admin_token cookie.
          credentials: "include",

          body: imageData,
        }
      );

      if (imageResponse.status === 401) {
        alert(
          "Your admin session has expired. Please log in again."
        );

        window.location.href = "/admin/login";
        return;
      }

      if (!imageResponse.ok) {
        const errorData = await imageResponse.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            errorData?.message ||
            "Image upload failed"
        );
      }

      const imageResult = await imageResponse.json();

      // =========================================================
      // 2. Create project in MySQL
      // =========================================================

      const projectResponse = await fetch(
        `${API_URL}/api/projects/`,
        {
          method: "POST",

          // IMPORTANT:
          // Send the HTTP-only tara_admin_token cookie.
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,
            image: imageResult.image,
          }),
        }
      );

      if (projectResponse.status === 401) {
        alert(
          "Your admin session has expired. Please log in again."
        );

        window.location.href = "/admin/login";
        return;
      }

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            errorData?.message ||
            "Project creation failed"
        );
      }

      const projectResult = await projectResponse.json();

      console.log("Project created:", projectResult);

      alert("Project created successfully!");

      // =========================================================
      // 3. Return to Projects page
      // =========================================================

      window.location.href = "/admin/projects";
    } catch (error) {
      console.error("Project creation failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to create the project. Please try again."
      );
    }
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
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">▣</span>
            <span>Projects</span>
          </Link>

          <button
            className="admin-nav-item"
            type="button"
          >
            <span className="admin-nav-icon">✦</span>
            <span>Services</span>
          </button>

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
          <span>
            © {new Date().getFullYear()} Tara Living
          </span>

          <span>
            Interior Design Studio
          </span>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">
              PROJECT MANAGEMENT
            </p>

            <h2>Add Project</h2>
          </div>

          <Link
            href="/admin/projects"
            className="admin-project-add-button"
          >
            ← Back to Projects
          </Link>
        </header>

        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">
              NEW PROJECT
            </p>

            <h3>
              Add a new
              <br />
              <em>interior story.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Add the project details, imagery and client
            review that will appear across the Tara Living
            portfolio.
          </p>
        </section>

        <section className="admin-project-form-section">
          <form
            className="admin-project-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-project-form-grid">
              <div className="admin-project-form-main">
                <div className="admin-form-card">
                  <div className="admin-form-card-header">
                    <div>
                      <p className="admin-eyebrow">
                        01
                      </p>

                      <h3>
                        Project Details
                      </h3>
                    </div>
                  </div>

                  <div className="admin-form-field">
                    <label htmlFor="title">
                      Project Title
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g. Contemporary Villa Interior"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-field">
                      <label htmlFor="location">
                        Location
                      </label>

                      <input
                        id="location"
                        name="location"
                        type="text"
                        placeholder="e.g. Hyderabad, Telangana"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="admin-form-field">
                      <label htmlFor="category">
                        Category
                      </label>

                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Select category
                        </option>

                        <option value="Residential">
                          Residential
                        </option>

                        <option value="Commercial">
                          Commercial
                        </option>

                        <option value="Renovation">
                          Renovation
                        </option>

                        <option value="Design & Styling">
                          Design & Styling
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-field">
                    <label htmlFor="description">
                      Project Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe the project, design direction and overall vision..."
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-form-field">
                    <label htmlFor="work_done">
                      Work Done
                    </label>

                    <textarea
                      id="work_done"
                      name="work_done"
                      placeholder="Mention the work completed — space planning, furniture, lighting, false ceiling, styling, etc."
                      rows={6}
                      value={formData.work_done}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="admin-form-field">
                    <label htmlFor="client_review">
                      Client Review
                    </label>

                    <textarea
                      id="client_review"
                      name="client_review"
                      placeholder="Add the client's feedback about their experience..."
                      rows={5}
                      value={formData.client_review}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <aside className="admin-project-form-side">
                <div className="admin-form-card">
                  <div className="admin-form-card-header">
                    <div>
                      <p className="admin-eyebrow">
                        02
                      </p>

                      <h3>
                        Project Image
                      </h3>
                    </div>
                  </div>

                  <label
                    htmlFor="project-image"
                    className="admin-image-upload"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Project preview"
                      />
                    ) : (
                      <div className="admin-image-upload-empty">
                        <span>＋</span>

                        <strong>
                          Upload Project Image
                        </strong>

                        <small>
                          JPG, PNG or WEBP
                        </small>
                      </div>
                    )}
                  </label>

                  <input
                    id="project-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    hidden
                  />

                  {imageFile && (
                    <p className="admin-image-file-name">
                      {imageFile.name}
                    </p>
                  )}
                </div>

                <div className="admin-form-card admin-form-note">
                  <p className="admin-eyebrow">
                    TIP
                  </p>

                  <p>
                    Use a high-quality project image that
                    represents the space clearly. Landscape
                    images work particularly well for the
                    portfolio.
                  </p>
                </div>
              </aside>
            </div>

            <div className="admin-project-form-actions">
              <Link
                href="/admin/projects"
                className="admin-form-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="admin-form-submit"
              >
                Create Project
                <span>↗</span>
              </button>
            </div>
          </form>
        </section>

        <footer className="admin-footer">
          <span>
            TARA LIVING
          </span>

          <span>
            Project Management
          </span>
        </footer>
      </section>
    </main>
  );
}