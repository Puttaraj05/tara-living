"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";

type Service = {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  service_items: string[] | null;
  created_at: string;
};

export default function EditServicePage() {
  const params = useParams();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    service_items: [""],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/services/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load service");
        }

        const data: Service = await response.json();

        setService(data);

        setFormData({
          title: data.title,
          category: data.category,
          description: data.description,
          service_items:
            data.service_items && data.service_items.length > 0
              ? data.service_items
              : [""],
        });

        setImagePreview(
          `http://127.0.0.1:8000${data.image}`
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load service"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

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

const removeServiceItem = (index: number) => {
  setFormData((previous) => ({
    ...previous,
    service_items: previous.service_items.filter(
      (_, itemIndex) => itemIndex !== index
    ),
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

    if (!service) {
      return;
    }

    setSaving(true);

    try {
      let imagePath = service.image;

      if (imageFile) {
        const imageData = new FormData();

        imageData.append("file", imageFile);

        const imageResponse = await fetch(
          "http://127.0.0.1:8000/api/services/upload-image",
          {
            method: "POST",
            body: imageData,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Image upload failed");
        }

        const imageResult = await imageResponse.json();

        imagePath = imageResult.image;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/services/${service.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            description: formData.description,
            image: imagePath,
            service_items: formData.service_items.filter(
              (item) => item.trim() !== ""
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Service update failed");
      }

      alert("Service updated successfully!");

      window.location.href = "/admin/services";
    } catch (error) {
      console.error(
        "Service update failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to update service."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <section className="admin-main">
          <div className="admin-empty-state">
            Loading service...
          </div>
        </section>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="admin-page">
        <section className="admin-main">
          <div className="admin-empty-state admin-error">
            {error || "Service not found."}
          </div>
        </section>
      </main>
    );
  }

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
            <p className="admin-eyebrow">
              SERVICES
            </p>

            <h2>Edit Service</h2>
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
              EDIT SERVICE
            </p>

            <h3>
              Refine your offering,
              <br />
              <em>beautifully.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Update the service details displayed across
            the Tara Living website.
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
                value={formData.description}
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
      (item, index) => (
        <div
          className="service-item-admin"
          key={index}
        >
          <input
            type="text"
            value={item}
            placeholder={`Service item ${index + 1}`}
            onChange={(event) =>
              handleServiceItemChange(
                index,
                event.target.value
              )
            }
          />

          {formData.service_items.length > 1 && (
            <button
              type="button"
              onClick={() =>
                removeServiceItem(index)
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
      onClick={addServiceItem}
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
                onChange={handleImageChange}
              />

              {imagePreview && (
                <div className="admin-project-image-preview">
                  <img
                    src={imagePreview}
                    alt={service.title}
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
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </section>

        <footer className="admin-footer">
          <span>TARA LIVING</span>
          <span>Service Management</span>
        </footer>
      </section>
    </main>
  );
}