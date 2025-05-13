// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { defaultBlogContent } from '@/content/sections/blogs';
import { defaultPortfolioContent } from '@/content/sections/portfolio';
import { defaultServicesContent } from '@/content/sections/services';

/**
 * Generate the sitemap for the website
 * This file is automatically detected by Next.js and will generate a sitemap.xml
 *
 * @returns Sitemap configuration
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://gavrielrudolph.com';
    const currentDate = new Date();

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/subscribe`,
            lastModified: currentDate,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ];

    // Dynamic pages - Blog posts
    const blogPages = defaultBlogContent.posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedDate ? new Date(post.updatedDate) : new Date(post.publishDate),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dynamic pages - Portfolio items
    const portfolioPages = defaultPortfolioContent.projects.map((project) => ({
        url: `${baseUrl}/portfolio/${project.id}`,
        lastModified: project.completionDate ? new Date(project.completionDate) : currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dynamic pages - Service details
    const servicePages = defaultServicesContent.services.map((service) => ({
        url: `${baseUrl}/services/${service.id}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        ...staticPages,
        ...blogPages,
        ...portfolioPages,
        ...servicePages,
    ];
}