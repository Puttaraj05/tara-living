import type { MetadataRoute } from "next";

const BASE_URL = "https://www.taraliving.co.in";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tara-living-api.onrender.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static website pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Fetch dynamic projects from backend
  let projectPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(`${API_URL}/api/projects/`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const projects = await response.json();

      projectPages = projects.map((project: any) => ({
        url: `${BASE_URL}/projects/${project.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("Sitemap project fetch failed:", error);
  }

  return [...staticPages, ...projectPages];
}