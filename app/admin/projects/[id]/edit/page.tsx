"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";

type Project = {
  id: number;
  title: string;
  location: string;
  category: string;
  image: string;
  description: string;
  work_done: string;
  client_review: string | null;

  tour_video: string | null;
  story_title: string | null;
  story_text: string | null;
  materials: string | null;
  lighting: string | null;
  space_story: string | null;
  client_video: string | null;
  client_name: string | null;
  gallery_images: string | null;

  created_at: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export default function EditProjectPage() {
  const params = useParams();

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    description: "",
    work_done: "",
    client_review: "",

    tour_video: "",
    story_title: "",
    story_text: "",
    materials: "",
    lighting: "",
    space_story: "",
    client_video: "",
    client_name: "",
  });

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [galleryFiles, setGalleryFiles] =
    useState<File[]>([]);

  const [galleryPreviews, setGalleryPreviews] =
    useState<string[]>([]);

  const [existingGalleryImages, setExistingGalleryImages] =
    useState<string[]>([]);

  const [tourVideoFile, setTourVideoFile] =
    useState<File | null>(null);

  const [clientVideoFile, setClientVideoFile] =
    useState<File | null>(null);

  const [tourVideoPreview, setTourVideoPreview] =
    useState("");

  const [clientVideoPreview, setClientVideoPreview] =
    useState("");

  /*
   * ---------------------------------------
   * Load project
   * ---------------------------------------
   */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/projects/${params.id}`,
          {
            credentials: "include",
          }
        );

        if (response.status === 401) {
          throw new Error(
            "Authentication expired. Please log out and log in again."
          );
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load project"
          );
        }

        const data: Project =
          await response.json();

        setProject(data);

        /*
         * Existing gallery images
         */
        if (data.gallery_images) {
          try {
            const gallery = JSON.parse(
              data.gallery_images
            );

            if (Array.isArray(gallery)) {
              setExistingGalleryImages(
                gallery
              );
            }
          } catch {
            setExistingGalleryImages([]);
          }
        }

        /*
         * Form data
         */
        setFormData({
          title: data.title,
          location: data.location,
          category: data.category,
          description: data.description,
          work_done: data.work_done,
          client_review:
            data.client_review || "",

          tour_video:
            data.tour_video || "",

          story_title:
            data.story_title || "",

          story_text:
            data.story_text || "",

          materials:
            data.materials || "",

          lighting:
            data.lighting || "",

          space_story:
            data.space_story || "",

          client_video:
            data.client_video || "",

          client_name:
            data.client_name || "",
        });

        /*
         * Main project image
         */
        if (data.image) {
          setImagePreview(
            data.image.startsWith("http")
              ? data.image
              : `${API_URL}${data.image}`
          );
        }

        /*
         * Home tour video
         */
        if (data.tour_video) {
          setTourVideoPreview(
            data.tour_video.startsWith(
              "http"
            )
              ? data.tour_video
              : `${API_URL}${data.tour_video}`
          );
        }

        /*
         * Client video
         */
        if (data.client_video) {
          setClientVideoPreview(
            data.client_video.startsWith(
              "http"
            )
              ? data.client_video
              : `${API_URL}${data.client_video}`
          );
        }
      } catch (error) {
        console.error(
          "Failed to load project:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load project"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  /*
   * ---------------------------------------
   * Normal form changes
   * ---------------------------------------
   */
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

  /*
   * ---------------------------------------
   * Main project image
   * ---------------------------------------
   */
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

  /*
   * ---------------------------------------
   * Home tour video
   * ---------------------------------------
   */
  const handleTourVideoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setTourVideoFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setTourVideoPreview(previewUrl);
  };

  /*
   * ---------------------------------------
   * Gallery selection
   * ---------------------------------------
   */
  const handleGalleryChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    setGalleryFiles(
      (previousFiles) => [
        ...previousFiles,
        ...files,
      ]
    );

    const previewUrls = files.map(
      (file) =>
        URL.createObjectURL(file)
    );

    setGalleryPreviews(
      (previousPreviews) => [
        ...previousPreviews,
        ...previewUrls,
      ]
    );

    event.target.value = "";
  };

  /*
   * ---------------------------------------
   * Remove new gallery image
   * ---------------------------------------
   */
  const removeNewGalleryImage = (
    index: number
  ) => {
    setGalleryFiles(
      (previousFiles) =>
        previousFiles.filter(
          (_, fileIndex) =>
            fileIndex !== index
        )
    );

    setGalleryPreviews(
      (previousPreviews) => {
        const previewToRemove =
          previousPreviews[index];

        if (previewToRemove) {
          URL.revokeObjectURL(
            previewToRemove
          );
        }

        return previousPreviews.filter(
          (_, previewIndex) =>
            previewIndex !== index
        );
      }
    );
  };

  /*
   * ---------------------------------------
   * Remove existing gallery image
   * ---------------------------------------
   */
  const removeExistingGalleryImage = (
    index: number
  ) => {
    setExistingGalleryImages(
      (previousImages) =>
        previousImages.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );
  };

  /*
   * ---------------------------------------
   * Client video
   * ---------------------------------------
   */
  const handleClientVideoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setClientVideoFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setClientVideoPreview(previewUrl);
  };

  /*
   * ---------------------------------------
   * Submit project update
   * ---------------------------------------
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!project) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      let imagePath =
        project.image;

      let tourVideoPath =
        project.tour_video || "";

      let clientVideoPath =
        project.client_video || "";

      const galleryImagePaths = [
        ...existingGalleryImages,
      ];

      /*
       * ---------------------------------------
       * Upload main project image
       * ---------------------------------------
       */
      if (imageFile) {
        const imageData =
          new FormData();

        imageData.append(
          "file",
          imageFile
        );

        const imageResponse =
          await fetch(
            `${API_URL}/api/projects/upload-image`,
            {
              method: "POST",
              credentials: "include",
              body: imageData,
            }
          );

        if (
          imageResponse.status === 401
        ) {
          throw new Error(
            "Authentication expired. Please log out and log in again."
          );
        }

        if (!imageResponse.ok) {
          const errorText =
            await imageResponse.text();

          console.error(
            "Project image upload error:",
            errorText
          );

          throw new Error(
            "Image upload failed"
          );
        }

        const imageResult =
          await imageResponse.json();

        imagePath =
          imageResult.image;
      }

      /*
       * ---------------------------------------
       * Upload home tour video
       * ---------------------------------------
       */
      if (tourVideoFile) {
        const videoData =
          new FormData();

        videoData.append(
          "file",
          tourVideoFile
        );

        const videoResponse =
          await fetch(
            `${API_URL}/api/projects/upload-video`,
            {
              method: "POST",
              credentials: "include",
              body: videoData,
            }
          );

        if (
          videoResponse.status === 401
        ) {
          throw new Error(
            "Authentication expired. Please log out and log in again."
          );
        }

        if (!videoResponse.ok) {
          const errorText =
            await videoResponse.text();

          console.error(
            "Home tour upload error:",
            errorText
          );

          throw new Error(
            "Home tour video upload failed"
          );
        }

        const videoResult =
          await videoResponse.json();

        tourVideoPath =
          videoResult.video;
      }

      /*
       * ---------------------------------------
       * Upload client video
       * ---------------------------------------
       */
      if (clientVideoFile) {
        const videoData =
          new FormData();

        videoData.append(
          "file",
          clientVideoFile
        );

        const videoResponse =
          await fetch(
            `${API_URL}/api/projects/upload-video`,
            {
              method: "POST",
              credentials: "include",
              body: videoData,
            }
          );

        if (
          videoResponse.status === 401
        ) {
          throw new Error(
            "Authentication expired. Please log out and log in again."
          );
        }

        if (!videoResponse.ok) {
          const errorText =
            await videoResponse.text();

          console.error(
            "Client video upload error:",
            errorText
          );

          throw new Error(
            "Client video upload failed"
          );
        }

        const videoResult =
          await videoResponse.json();

        clientVideoPath =
          videoResult.video;
      }

      /*
       * ---------------------------------------
       * Upload gallery images
       * ---------------------------------------
       */
      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const galleryData =
            new FormData();

          galleryData.append(
            "file",
            file
          );

          const galleryResponse =
            await fetch(
              `${API_URL}/api/projects/upload-gallery-image`,
              {
                method: "POST",
                credentials: "include",
                body: galleryData,
              }
            );

          if (
            galleryResponse.status ===
            401
          ) {
            throw new Error(
              "Authentication expired. Please log out and log in again."
            );
          }

          if (!galleryResponse.ok) {
            const errorText =
              await galleryResponse.text();

            console.error(
              "Gallery upload error:",
              errorText
            );

            throw new Error(
              "Gallery image upload failed"
            );
          }

          const galleryResult =
            await galleryResponse.json();

          galleryImagePaths.push(
            galleryResult.image
          );
        }
      }

      /*
       * ---------------------------------------
       * Update project
       * ---------------------------------------
       */
      const response =
        await fetch(
          `${API_URL}/api/projects/${project.id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title: formData.title,
              location:
                formData.location,
              category:
                formData.category,
              description:
                formData.description,
              work_done:
                formData.work_done,

              client_review:
                formData.client_review,

              image: imagePath,

              gallery_images:
                galleryImagePaths.length >
                0
                  ? JSON.stringify(
                      galleryImagePaths
                    )
                  : null,

              tour_video:
                tourVideoPath || null,

              story_title:
                formData.story_title,

              story_text:
                formData.story_text,

              materials:
                formData.materials,

              lighting:
                formData.lighting,

              space_story:
                formData.space_story,

              client_video:
                clientVideoPath || null,

              client_name:
                formData.client_name,
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
          "Project update error:",
          errorText
        );

        throw new Error(
          "Project update failed"
        );
      }

      const result =
        await response.json();

      console.log(
        "Project updated:",
        result
      );

      alert(
        "Project updated successfully!"
      );

      window.location.href =
        "/admin/projects";
    } catch (error) {
      console.error(
        "Project update failed:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update project.";

      setError(message);

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  /*
   * ---------------------------------------
   * Loading
   * ---------------------------------------
   */
  if (loading) {
    return (
      <main className="admin-page">
        <section className="admin-main">
          <div className="admin-empty-state">
            Loading project...
          </div>
        </section>
      </main>
    );
  }

  /*
   * ---------------------------------------
   * Error / not found
   * ---------------------------------------
   */
  if (error || !project) {
    return (
      <main className="admin-page">
        <section className="admin-main">
          <div className="admin-empty-state admin-error">
            {error ||
              "Project not found."}
          </div>
        </section>
      </main>
    );
  }

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
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">
              ▣
            </span>
            <span>Projects</span>
          </Link>

          <button
            className="admin-nav-item"
            type="button"
          >
            <span className="admin-nav-icon">
              ✦
            </span>
            <span>Services</span>
          </button>

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
              PORTFOLIO
            </p>

            <h2>Edit Project</h2>
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
              EDIT PROJECT
            </p>

            <h3>
              Refine your space,
              <br />
              <em>beautifully.</em>
            </h3>
          </div>

          <p className="admin-welcome-text">
            Update the project details displayed
            on the Tara Living website.
          </p>
        </section>

        <section className="admin-project-form-section">
          <form
            className="admin-project-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form-grid">
              <div className="admin-form-field">
                <label htmlFor="title">
                  Project Title
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
                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={
                    formData.location
                  }
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={
                  formData.category
                }
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

            <div className="admin-form-field">
              <label htmlFor="description">
                Project Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={
                  formData.description
                }
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
                rows={5}
                value={
                  formData.work_done
                }
                onChange={handleChange}
                required
              />
            </div>

            {/* HOME TOUR */}

            <div className="admin-form-section-heading">
              <p className="admin-eyebrow">
                HOME TOUR
              </p>

              <h4>
                Bring the project to life.
              </h4>
            </div>

            <div className="admin-form-field">
              <label htmlFor="tour_video">
                Home Tour Video
              </label>

              <input
                id="tour_video"
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={
                  handleTourVideoChange
                }
              />

              {tourVideoPreview && (
                <div className="admin-project-video-preview">
                  <video
                    src={tourVideoPreview}
                    controls
                    preload="metadata"
                  />
                </div>
              )}
            </div>

            {/* THE HOME, IN DETAILS */}

            <div className="admin-form-section-heading">
              <p className="admin-eyebrow">
                THE HOME, IN DETAILS
              </p>

              <h4>
                Tell the story behind the
                space.
              </h4>
            </div>

            <div className="admin-form-field">
              <label htmlFor="story_title">
                Story Title
              </label>

              <input
                id="story_title"
                name="story_title"
                type="text"
                value={
                  formData.story_title
                }
                onChange={handleChange}
                placeholder="The idea behind this home"
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="story_text">
                Design Thought
              </label>

              <textarea
                id="story_text"
                name="story_text"
                rows={6}
                value={
                  formData.story_text
                }
                onChange={handleChange}
                placeholder="Describe the design thinking behind this project..."
              />
            </div>

            {/* DETAILS THAT MATTER */}

            <div className="admin-form-section-heading">
              <p className="admin-eyebrow">
                DETAILS THAT MATTER
              </p>

              <h4>
                Capture the design details.
              </h4>
            </div>

            <div className="admin-form-field">
              <label htmlFor="materials">
                Materials
              </label>

              <textarea
                id="materials"
                name="materials"
                rows={5}
                value={
                  formData.materials
                }
                onChange={handleChange}
                placeholder="Wood, stone, fabrics, finishes..."
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="lighting">
                Lighting
              </label>

              <textarea
                id="lighting"
                name="lighting"
                rows={5}
                value={
                  formData.lighting
                }
                onChange={handleChange}
                placeholder="Describe the lighting approach..."
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="space_story">
                Space Story
              </label>

              <textarea
                id="space_story"
                name="space_story"
                rows={5}
                value={
                  formData.space_story
                }
                onChange={handleChange}
                placeholder="How the spaces flow and work together..."
              />
            </div>

            {/* CLIENT REVIEW */}

            <div className="admin-form-section-heading">
              <p className="admin-eyebrow">
                CLIENT REVIEW
              </p>

              <h4>
                The experience, in their
                words.
              </h4>
            </div>

            <div className="admin-form-field">
              <label htmlFor="client_name">
                Client Name
              </label>

              <input
                id="client_name"
                name="client_name"
                type="text"
                value={
                  formData.client_name
                }
                onChange={handleChange}
                placeholder="Client name"
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="client_review">
                Written Review
              </label>

              <textarea
                id="client_review"
                name="client_review"
                rows={5}
                value={
                  formData.client_review
                }
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="client_video">
                Client Video Review
              </label>

              <input
                id="client_video"
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={
                  handleClientVideoChange
                }
              />

              {clientVideoPreview && (
                <div className="admin-project-video-preview">
                  <video
                    src={
                      clientVideoPreview
                    }
                    controls
                    preload="metadata"
                  />
                </div>
              )}
            </div>

            {/* PROJECT IMAGE */}

            <div className="admin-form-field">
              <label htmlFor="image">
                Project Image
              </label>

              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImageChange
                }
              />

              {imagePreview && (
                <div className="admin-project-image-preview">
                  <img
                    src={imagePreview}
                    alt="Project preview"
                  />
                </div>
              )}
            </div>

            {/* PROJECT GALLERY */}

            <div className="admin-form-field">
              <label htmlFor="gallery">
                Project Gallery
              </label>

              <p className="admin-field-description">
                Upload multiple interior
                images for the project
                gallery.
              </p>

              <input
                id="gallery"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={
                  handleGalleryChange
                }
              />

              {/* EXISTING GALLERY */}

              {existingGalleryImages.length >
                0 && (
                <div className="admin-gallery-preview-grid">
                  {existingGalleryImages.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        className="admin-gallery-preview"
                        key={`${image}-${index}`}
                      >
                        <img
                          src={
                            image.startsWith(
                              "http"
                            )
                              ? image
                              : `${API_URL}${image}`
                          }
                          alt={`Existing gallery ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="admin-gallery-remove"
                          onClick={() =>
                            removeExistingGalleryImage(
                              index
                            )
                          }
                          aria-label={`Remove existing gallery image ${
                            index + 1
                          }`}
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* NEW GALLERY */}

              {galleryPreviews.length >
                0 && (
                <div className="admin-gallery-preview-grid">
                  {galleryPreviews.map(
                    (
                      image,
                      index
                    ) => (
                      <div
                        className="admin-gallery-preview"
                        key={`${image}-${index}`}
                      >
                        <img
                          src={image}
                          alt={`New gallery ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="admin-gallery-remove"
                          onClick={() =>
                            removeNewGalleryImage(
                              index
                            )
                          }
                          aria-label={`Remove new gallery image ${
                            index + 1
                          }`}
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* ACTIONS */}

            <div className="admin-form-actions">
              <Link
                href="/admin/projects"
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

          <span>
            Project Management
          </span>
        </footer>
      </section>
    </main>
  );
}