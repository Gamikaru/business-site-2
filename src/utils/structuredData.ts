// src/utils/structuredData.ts
import { BlogPost } from '@/content/types';
import { defaultHomeContent } from '@/content/sections/home';

/**
 * Schema.org supported structured data types
 */
export type StructuredDataType =
    | 'Person'
    | 'WebSite'
    | 'BlogPosting'
    | 'Service'
    | 'Project'
    | 'FAQPage'
    | 'BreadcrumbList';

/**
 * Base structured data interface with required Schema.org properties
 */
export interface BaseStructuredData {
    '@context': 'https://schema.org';
    '@type': StructuredDataType;
    [key: string]: unknown;
}

/**
 * Website schema properties
 */
export interface WebsiteSchema extends BaseStructuredData {
    '@type': 'WebSite';
    name: string;
    description: string;
    url: string;
    potentialAction?: {
        '@type': 'SearchAction';
        target: string;
        'query-input': string;
    };
}

/**
 * Person schema properties
 */
export interface PersonSchema extends BaseStructuredData {
    '@type': 'Person';
    name: string;
    url: string;
    jobTitle?: string;
    sameAs?: string[];
    knowsAbout?: string[];
    image?: string;
}

/**
 * Blog posting schema properties
 */
export interface BlogPostingSchema extends BaseStructuredData {
    '@type': 'BlogPosting';
    headline: string;
    description?: string;
    image?: string;
    datePublished: string;
    dateModified: string;
    author: PersonSchema | { '@type': 'Person'; name: string; url: string };
    publisher: PersonSchema | { '@type': 'Person'; name: string; url: string };
    mainEntityOfPage: {
        '@type': 'WebPage';
        '@id': string;
    };
    keywords?: string;
}

/**
 * Service schema properties
 */
export interface ServiceSchema extends BaseStructuredData {
    '@type': 'Service';
    name: string;
    description: string;
    provider: PersonSchema | { '@type': 'Person'; name: string; url: string };
    url: string;
}

/**
 * Breadcrumb list schema properties
 */
export interface BreadcrumbListSchema extends BaseStructuredData {
    '@type': 'BreadcrumbList';
    itemListElement: Array<{
        '@type': 'ListItem';
        position: number;
        name: string;
        item: string;
    }>;
}

/**
 * Creates JSON-LD structured data for schema.org markup
 *
 * @param type The schema.org type
 * @param props Type-specific properties
 * @returns A string of JSON-LD markup wrapped in a script tag
 */
export function createStructuredData(type: StructuredDataType, props: Record<string, unknown>): string {
    const schemaData = {
        '@context': 'https://schema.org',
        '@type': type,
        ...props
    };

    return `<script type="application/ld+json">${JSON.stringify(schemaData)}</script>`;
}

/**
 * Creates website structured data
 *
 * @returns Website schema markup
 */
export function createWebsiteSchema(): WebsiteSchema {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: defaultHomeContent.meta.title,
        description: defaultHomeContent.meta.description,
        url: 'https://gavrielrudolph.com',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://gavrielrudolph.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    };
}

/**
 * Creates person structured data
 *
 * @returns Person schema markup
 */
export function createPersonSchema(): PersonSchema {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Gavriel Rudolph',
        url: 'https://gavrielrudolph.com',
        jobTitle: 'Full Stack Developer & AI Specialist',
        sameAs: [
            // Add your social profiles here
            'https://linkedin.com/in/gavriel-rudolph-95a66b127',
            'https://github.com/Gamikaru'
        ],
        knowsAbout: [
            'Web Development',
            'React',
            'Node.js',
            'TypeScript',
            'AI Integration',
            'Machine Learning',
            'Data Science'
        ]
    };
}

/**
 * Creates blog post structured data
 *
 * @param post The blog post data
 * @returns BlogPosting schema markup
 */
export function createBlogPostSchema(post: BlogPost): BlogPostingSchema {
    const formattedDate = new Date(post.publishDate).toISOString();
    const updatedDate = post.updatedDate
        ? new Date(post.updatedDate).toISOString()
        : formattedDate;

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.summary,
        image: post.featuredImage,
        datePublished: formattedDate,
        dateModified: updatedDate,
        author: {
            '@type': 'Person',
            name: 'Gavriel Rudolph',
            url: 'https://gavrielrudolph.com'
        },
        publisher: {
            '@type': 'Person',
            name: 'Gavriel Rudolph',
            url: 'https://gavrielrudolph.com'
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://gavrielrudolph.com/blog/${post.slug}`
        },
        keywords: post.tags.join(', ')
    };
}

/**
 * Creates service structured data
 *
 * @param serviceName The name of the service
 * @param description Service description
 * @param url URL for the service page
 * @returns Service schema markup
 */
export function createServiceSchema(
    serviceName: string,
    description: string,
    url: string
): ServiceSchema {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: serviceName,
        description: description,
        provider: {
            '@type': 'Person',
            name: 'Gavriel Rudolph',
            url: 'https://gavrielrudolph.com'
        },
        url: url
    };
}

/**
 * Creates breadcrumb structured data
 *
 * @param items Breadcrumb items with name and url
 * @returns BreadcrumbList schema markup
 */
export function createBreadcrumbSchema(
    items: Array<{ name: string; url: string }>
): BreadcrumbListSchema {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };
}