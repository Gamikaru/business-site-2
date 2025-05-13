// src/utils/contentValidation.ts
import type { ContentSectionId } from '@/content/types';

/**
 * Content validation error object
 */
export interface ContentValidationError {
    message: string;
    path: string;
    sectionId: ContentSectionId;
}

/**
 * Base content interface shared by all section types
 */
export interface BaseContent {
    meta: {
        title: string;
        description: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

/**
 * Home section content structure
 */
export interface HomeContent extends BaseContent {
    hero: {
        name: string;
        tagline: string;
        [key: string]: unknown;
    };
    roles: Array<{
        id?: string;
        title?: string;
        [key: string]: unknown;
    }>;
    intro: {
        [key: string]: unknown;
    };
}

/**
 * About section content structure
 */
export interface AboutContent extends BaseContent {
    blocks: Array<{
        id: string;
        title: string;
        [key: string]: unknown;
    }>;
}

/**
 * Services section content structure
 */
export interface ServicesContent extends BaseContent {
    services: Array<{
        [key: string]: unknown;
    }>;
    categories: Array<{
        [key: string]: unknown;
    }>;
}

/**
 * Portfolio section content structure
 */
export interface PortfolioContent extends BaseContent {
    projects: Array<{
        [key: string]: unknown;
    }>;
    categories: Array<{
        [key: string]: unknown;
    }>;
}

/**
 * Blog section content structure
 */
export interface BlogContent extends BaseContent {
    posts: Array<{
        [key: string]: unknown;
    }>;
    categories: Array<{
        [key: string]: unknown;
    }>;
    tags: Array<{
        [key: string]: unknown;
    }>;
}

/**
 * Contact section content structure
 */
export interface ContactContent extends BaseContent {
    formSteps: Array<{
        [key: string]: unknown;
    }>;
    contactInfo: {
        [key: string]: unknown;
    };
    pageContent: {
        [key: string]: unknown;
    };
}

/**
 * Newsletter section content structure
 */
export interface NewsletterContent extends BaseContent {
    newsletterInfo: {
        [key: string]: unknown;
    };
    topics: Array<{
        [key: string]: unknown;
    }>;
    formFields: Array<{
        [key: string]: unknown;
    }>;
}

/**
 * Union of all supported content types
 */
export type SectionContent =
    | HomeContent
    | AboutContent
    | ServicesContent
    | PortfolioContent
    | BlogContent
    | ContactContent
    | NewsletterContent;

/**
 * Type guard functions for content types
 */
function isHomeContent(content: BaseContent): content is HomeContent {
    return 'hero' in content && 'roles' in content && 'intro' in content;
}

function isAboutContent(content: BaseContent): content is AboutContent {
    return 'blocks' in content;
}

function isServicesContent(content: BaseContent): content is ServicesContent {
    return 'services' in content;
}

function isPortfolioContent(content: BaseContent): content is PortfolioContent {
    return 'projects' in content;
}

function isBlogContent(content: BaseContent): content is BlogContent {
    return 'posts' in content && 'tags' in content;
}

function isContactContent(content: BaseContent): content is ContactContent {
    return 'formSteps' in content && 'contactInfo' in content;
}

function isNewsletterContent(content: BaseContent): content is NewsletterContent {
    return 'newsletterInfo' in content && 'topics' in content;
}

/**
 * Validates that a content object contains all required fields and has the expected structure
 *
 * @param content The content object to validate
 * @param sectionId The section identifier (home, about, etc.)
 * @returns An array of validation errors, empty if valid
 */
export function validateContent(
    content: unknown,
    sectionId: ContentSectionId
): ContentValidationError[] {
    const errors: ContentValidationError[] = [];

    // Check if content exists
    if (!content) {
        errors.push({
            message: `${sectionId} content is missing or undefined`,
            path: '',
            sectionId,
        });
        return errors;
    }

    // Type guard for base content
    if (typeof content !== 'object' || content === null) {
        errors.push({
            message: `${sectionId} content is not a valid object`,
            path: '',
            sectionId,
        });
        return errors;
    }

    const baseContent = content as BaseContent;

    // Validate base structure (all sections should have these)
    if (!baseContent.meta) {
        errors.push({
            message: 'Meta information is missing',
            path: 'meta',
            sectionId,
        });
    } else {
        // Validate meta fields
        if (!baseContent.meta.title) {
            errors.push({
                message: 'Meta title is required for SEO',
                path: 'meta.title',
                sectionId,
            });
        }

        if (!baseContent.meta.description) {
            errors.push({
                message: 'Meta description is required for SEO',
                path: 'meta.description',
                sectionId,
            });
        }
    }

    // Section-specific validation
    switch (sectionId) {
        case 'home':
            validateHomeContent(baseContent, errors);
            break;
        case 'about':
            validateAboutContent(baseContent, errors);
            break;
        case 'services':
            validateServicesContent(baseContent, errors);
            break;
        case 'portfolio':
            validatePortfolioContent(baseContent, errors);
            break;
        case 'blog':
            validateBlogContent(baseContent, errors);
            break;
        case 'contact':
            validateContactContent(baseContent, errors);
            break;
        case 'newsletter':
            validateNewsletterContent(baseContent, errors);
            break;
    }

    return errors;
}

/**
 * Validates home section content
 */
function validateHomeContent(content: BaseContent, errors: ContentValidationError[]) {
    if (!isHomeContent(content)) {
        errors.push({
            message: 'Content is not a valid home section',
            path: '',
            sectionId: 'home',
        });
        return;
    }

    if (!content.hero) {
        errors.push({
            message: 'Hero section is required',
            path: 'hero',
            sectionId: 'home',
        });
    } else {
        if (!content.hero.name) {
            errors.push({
                message: 'Hero name is required',
                path: 'hero.name',
                sectionId: 'home',
            });
        }
        if (!content.hero.tagline) {
            errors.push({
                message: 'Hero tagline is required',
                path: 'hero.tagline',
                sectionId: 'home',
            });
        }
    }

    if (!content.roles || !Array.isArray(content.roles) || content.roles.length === 0) {
        errors.push({
            message: 'Roles section must contain at least one role',
            path: 'roles',
            sectionId: 'home',
        });
    }

    if (!content.intro) {
        errors.push({
            message: 'Intro section is required',
            path: 'intro',
            sectionId: 'home',
        });
    }
}

/**
 * Validates about section content
 */
function validateAboutContent(content: BaseContent, errors: ContentValidationError[]) {
    if (!isAboutContent(content)) {
        errors.push({
            message: 'Content is not a valid about section',
            path: '',
            sectionId: 'about',
        });
        return;
    }

    if (!content.blocks || !Array.isArray(content.blocks) || content.blocks.length === 0) {
        errors.push({
            message: 'About blocks are required',
            path: 'blocks',
            sectionId: 'about',
        });
    } else {
        // Check each block for required properties
        content.blocks.forEach((block, index) => {
            if (!block.id) {
                errors.push({
                    message: `Block at index ${index} is missing an id`,
                    path: `blocks[${index}].id`,
                    sectionId: 'about',
                });
            }
            if (!block.title) {
                errors.push({
                    message: `Block at index ${index} is missing a title`,
                    path: `blocks[${index}].title`,
                    sectionId: 'about',
                });
            }
        });
    }
}

/**
 * Validates services section content
 */
function validateServicesContent(content: BaseContent, errors: ContentValidationError[]) {
    if (!isServicesContent(content)) {
        errors.push({
            message: 'Content is not a valid services section',
            path: '',
            sectionId: 'services',
        });
        return;
    }

    if (!content.services || !Array.isArray(content.services) || content.services.length === 0) {
        errors.push({
            message: 'Services list is required and must not be empty',
            path: 'services',
            sectionId: 'services',
        });
    }

    if (!content.categories || !Array.isArray(content.categories)) {
        errors.push({
            message: 'Service categories are required',
            path: 'categories',
            sectionId: 'services',
        });
    }
}

/**
 * Validates portfolio section content
 */
function validatePortfolioContent(content: BaseContent, errors: ContentValidationError[]) {
    if (!isPortfolioContent(content)) {
        errors.push({
            message: 'Content is not a valid portfolio section',
            path: '',
            sectionId: 'portfolio',
        });
        return;
    }

    if (!content.projects || !Array.isArray(content.projects)) {
        errors.push({
            message: 'Portfolio projects are required',
            path: 'projects',
            sectionId: 'portfolio',
        });
    }

    if (!content.categories || !Array.isArray(content.categories)) {
        errors.push({
            message: 'Portfolio categories are required',
            path: 'categories',
            sectionId: 'portfolio',
        });
    }
}

/**
 * Validates blog section content
 */
function validateBlogContent(content: BaseContent, errors: ContentValidationError[]) {
    if (!isBlogContent(content)) {
        errors.push({
            message: 'Content is not a valid blog section',
            path: '',
            sectionId: 'blog',
        });
        return;
    }

    if (!content.posts || !Array.isArray(content.posts)) {
        errors.push({
            message: 'Blog posts are required',
            path: 'posts',
            sectionId: 'blog',
        });
    }

    if (!content.categories || !Array.isArray(content.categories)) {
        errors.push({
            message: 'Blog categories are required',
            path: 'categories',
            sectionId: 'blog',
        });
    }

    if (!content.tags || !Array.isArray(content.tags)) {
        errors.push({
            message: 'Blog tags are required',
            path: 'tags',
            sectionId: 'blog',
        });
    }
}

/**
 * Validates contact section content
 */
function validateContactContent(content: BaseContent, errors: ContentValidationError[]) {
    if (!isContactContent(content)) {
        errors.push({
            message: 'Content is not a valid contact section',
            path: '',
            sectionId: 'contact',
        });
        return;
    }

    if (!content.formSteps || !Array.isArray(content.formSteps) || content.formSteps.length === 0) {
        errors.push({
            message: 'Contact form steps are required',
            path: 'formSteps',
            sectionId: 'contact',
        });
    }

    if (!content.contactInfo) {
        errors.push({
            message: 'Contact information is required',
            path: 'contactInfo',
            sectionId: 'contact',
        });
    }

    if (!content.pageContent) {
        errors.push({
            message: 'Contact page content is required',
            path: 'pageContent',
            sectionId: 'contact',
        });
    }
}

/**
 * Validates newsletter section content
 */
function validateNewsletterContent(content: BaseContent, errors: ContentValidationError[]) {
    if (!isNewsletterContent(content)) {
        errors.push({
            message: 'Content is not a valid newsletter section',
            path: '',
            sectionId: 'newsletter',
        });
        return;
    }

    if (!content.newsletterInfo) {
        errors.push({
            message: 'Newsletter information is required',
            path: 'newsletterInfo',
            sectionId: 'newsletter',
        });
    }

    if (!content.topics || !Array.isArray(content.topics) || content.topics.length === 0) {
        errors.push({
            message: 'Newsletter topics are required',
            path: 'topics',
            sectionId: 'newsletter',
        });
    }

    if (!content.formFields || !Array.isArray(content.formFields)) {
        errors.push({
            message: 'Newsletter form fields are required',
            path: 'formFields',
            sectionId: 'newsletter',
        });
    }
}