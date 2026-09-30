"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export default function AddServicePage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    service_items: [""],
  });

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const handleServiceItemChange = (
    index: number,
    value: string
  ) => {
    setFormData((previous) => {
      const updatedItems = [
        ...previous.service_items,
      ];

      updatedItems[index] = value;

      return {
        ...previous,
        service_items: updatedItems,
      };
    });
  };

  const addServiceItem = () => {
    setFormData((previous) => ({
      ...previous,
      service_items: [
        ...previous.service_items,
        "",
      ],
    }));
  };

  const removeServiceItem = (
    index: number
  ) => {
    setFormData((previous) => ({
      ...previous,
      service_items:
        previous.service_items.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  };

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
    >
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!imageFile) {
      alert(
        "Please select a service image."
      );
      return;
    }

    setSaving(true);

    try {
      // --------------------------------
      // 1. Upload service image
      // --------------------------------

      const imageData = new FormData();

      imageData.append(
        "file",
        imageFile
      );

      const imageResponse =
        await fetch(
          `${API_URL}/api/services/upload-image`,
          {
            method: "POST",
            credentials: "include",
            body: imageData,
          }
        );

      if (!imageResponse.ok) {
        const errorText =
          await imageResponse.text();

        console.error(
          "IMAGE UPLOAD ERROR:",
          {
            status:
              imageResponse.status,
            response: errorText,
          }
        );

        throw new Error(
          `Image upload failed (${imageResponse.status}): ${errorText}`
        );
      }

      const imageResult =
        await imageResponse.json();

      if (!imageResult.image) {
        throw new Error(
          "Image upload succeeded but no image path was returned."
        );
      }

      // --------------------------------
      // 2. Create service
      // --------------------------------

      const serviceResponse =
        await fetch(
          `${API_URL}/api/services/`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title: formData.title,
              category:
                formData.category,
              description:
                formData.description,
              image:
                imageResult.image,
              service_items:
                formData.service_items.filter(
                  (item) =>
                    item.trim() !== ""
                ),
            }),
          }
        );

      if (!serviceResponse.ok) {
        const errorText =
          await serviceResponse.text();

        console.error(
          "SERVICE CREATION ERROR:",
          {
            status:
              serviceResponse.status,
            response: errorText,
          }
        );

        throw new Error(
          `Service creation failed (${serviceResponse.status}): ${errorText}`
        );
      }

      alert(
        "Service created successfully!"
      );

      window.location.href =
        "/admin/services";
    } catch (error) {
      console.error(
        "Service creation failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to create service."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">
            TL
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

          <button
            className="admin-nav-item"
            type="button"
          >
            <span className="admin-nav-icon">
              ♡
            </span>
            <span>Testimonials</span>
          </button>

          <button
            className="admin-nav-item"
            type="button"
          >
            <span className="admin-nav-icon">
              ↓
            </span>
            <span>Export</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <span>
            © {new Date().getFullYear()}{" "}
            Tara Living
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
              SERVICES
            </p>

            <h2>Add Service</h2>
          </div>

          <Link
            href="/admin/services"
            className="admin-project-add-button"
          >
            ← Back to Services
          </Link>
        </header>

        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">
              NEW SERVICE
            </p>

            <h3>
              Add a service,
              <br />
              <em>
                shape a space.
              </em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Add a new service that will
            be displayed across the Tara
            Living website.
          </p>
        </section>

        <section className="admin-project-form-section">
          <form
            className="admin-project-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-field">
              <label htmlFor="title">
                Service Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Full Home Interior"
                value={formData.title}
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

                <option value="Design & Styling">
                  Design & Styling
                </option>

                <option value="Renovation & Turnkey">
                  Renovation & Turnkey
                </option>
              </select>
            </div>

            <div className="admin-form-field">
              <label htmlFor="description">
                Service Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Describe this service..."
                value={
                  formData.description
                }
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-field">
              <label>
                What We Do
              </label>

              <div className="service-items-admin">
                {formData.service_items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="service-item-admin"
                      key={index}
                    >
                      <input
                        type="text"
                        value={item}
                        placeholder={`Service item ${
                          index + 1
                        }`}
                        onChange={(
                          event
                        ) =>
                          handleServiceItemChange(
                            index,
                            event
                              .target
                              .value
                          )
                        }
                      />

                      {formData
                        .service_items
                        .length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeServiceItem(
                              index
                            )
                          }
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )
                )}

                <button
                  type="button"
                  className="admin-add-item-button"
                  onClick={
                    addServiceItem
                  }
                >
                  + Add Service Item
                </button>
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="image">
                Service Image
              </label>

              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImageChange
                }
                required
              />

              {imagePreview && (
                <div className="admin-project-image-preview">
                  <img
                    src={imagePreview}
                    alt="Service preview"
                  />
                </div>
              )}
            </div>

            <div className="admin-form-actions">
              <Link
                href="/admin/services"
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
                  ? "Creating..."
                  : "Create Service"}
              </button>
            </div>
          </form>
        </section>

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