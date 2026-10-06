const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const R2_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

export function getMediaUrl(
  value: string | null | undefined
): string {
  if (!value || value === "string") {
    return "";
  }

  const media = value.trim();

  if (!media) {
    return "";
  }

  // Already a complete URL.
  if (
    media.startsWith("http://") ||
    media.startsWith("https://") ||
    media.startsWith("blob:") ||
    media.startsWith("data:")
  ) {
    return media;
  }

  // Existing/local backend uploads.
  if (media.startsWith("/uploads/")) {
    return `${API_URL}${media}`;
  }

  // Next/public local assets.
  if (media.startsWith("/")) {
    return media;
  }

  // New R2 object key.
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${media.replace(
      /^\/+/,
      ""
    )}`;
  }

  // Safe fallback if R2 URL is not configured.
  return `${API_URL}/${media.replace(/^\/+/, "")}`;
}
