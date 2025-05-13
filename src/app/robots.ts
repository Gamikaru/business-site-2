// src/app/robots.ts
import { MetadataRoute } from 'next';

/**
 * Generate the robots.txt file for the website
 * This file is automatically detected by Next.js and will generate a robots.txt
 *
 * @returns Robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // You can disallow specific paths if needed
      // disallow: ['/private/', '/admin/'],
    },
    sitemap: 'https://gavrielrudolph.com/sitemap.xml',
    host: 'https://gavrielrudolph.com',
  };
}