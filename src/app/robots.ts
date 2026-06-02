import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/signup", "/dashboard", "/api/"],
    },
    sitemap: "https://gize-pi.vercel.app/sitemap.xml",
  }
}
