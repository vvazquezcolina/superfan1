// src/app/sitemap.xml.ts
import type { MetadataRoute } from 'next';

// IMPORTANT: Replace with your actual domain
const BASE_URL = 'https://www.puertomayacancun.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Define static routes
  const staticRoutes = [
    '', // Homepage
    '/actividades',
    '/eventos',
    '/mayan-lounge',
    '/mayan-market',
    '/nosotros',
    '/nosotras', // Assuming this is also a static page
    '/promociones',
    '/servicios',
    '/tours',
    '/tours/mayan-jungle-tour',
    '/tours/jet-ski-cancun',
    '/tours/mangrove-tour',
    '/tours/mayan-path',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'never' = 'weekly';
    let priority = 0.8;

    if (route === '') { // Homepage
      changeFrequency = 'daily';
      priority = 1.0;
    } else if (route.startsWith('/tours') && route !== '/tours') { // Individual tour pages
      changeFrequency = 'monthly';
      priority = 0.9;
    } else if (route === '/tours' || route === '/promociones' || route === '/actividades') {
      changeFrequency = 'weekly';
      priority = 0.7;
    } else { // Other static pages
      changeFrequency = 'monthly';
      priority = 0.6;
    }

    return {
      url: `${BASE_URL}${route}`,
      lastModified: new Date(), // Or a more specific date if available
      changeFrequency,
      priority,
    };
  });

  // Note: For a truly dynamic site with blog posts or frequently changing content,
  // you would fetch those routes and add them to sitemapEntries here.
  // For example:
  // const blogPosts = await fetchBlogPosts(); // Fictional function
  // blogPosts.forEach(post => {
  //   sitemapEntries.push({
  //     url: `${BASE_URL}/blog/${post.slug}`,
  //     lastModified: new Date(post.updatedAt),
  //     changeFrequency: 'weekly',
  //     priority: 0.7,
  //   });
  // });

  return sitemapEntries;
}
