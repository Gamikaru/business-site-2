// src/utils/textFormatting.ts
/**
 * Text formatting and rich text utilities
 */

export interface TextFormattingOptions {
    allowHtml?: boolean;
    allowHeadings?: boolean;
    allowLinks?: boolean;
    allowImages?: boolean;
    maxHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    linkTarget?: '_blank' | '_self';
    imagePlaceholder?: string;
    highlightClass?: string;
}

export interface TruncateOptions {
    maxLength: number;
    suffix?: string;
    preserveWords?: boolean;
}

/**
 * Calculate reading time for text content
 *
 * @param text Content to calculate reading time for
 * @param wordsPerMinute Average reading speed in words per minute
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 225): number {
    const cleanText = text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    const words = cleanText.split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Convert HTML-like pattern in plain text to proper HTML elements
 * e.g., <strong>text</strong> becomes an actual strong element
 *
 * @param text Input text with HTML-like tags
 * @param options Formatting options
 * @returns Formatted HTML string
 */
export function formatRichText(text: string, options: TextFormattingOptions = {}): string {
    const {
        allowHtml = true,
        allowHeadings = true,
        allowLinks = true,
        allowImages = true,
        maxHeadingLevel = 6,
        linkTarget = '_blank',
        highlightClass = 'highlight',
    } = options;

    // If HTML is not allowed, escape all HTML
    let processedText = allowHtml ? text : escapeHtml(text);

    // Process special patterns only if HTML is allowed
    if (allowHtml) {
        // Convert line breaks to <br> tags
        processedText = processedText.replace(/(?:\r\n|\r|\n)/g, '<br />');

        // Handle headings if allowed
        if (allowHeadings) {
            for (let i = maxHeadingLevel; i >= 1; i--) {
                const pattern = new RegExp(`<h${i}>(.*?)<\\/h${i}>`, 'g');
                processedText = processedText.replace(pattern, `<h${i}>$1</h${i}>`);
            }
        } else {
            // Remove heading tags if not allowed
            processedText = processedText.replace(/<h[1-6]>(.*?)<\/h[1-6]>/g, '$1');
        }

        // Handle links if allowed
        if (allowLinks) {
            const linkPattern = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"\s*(?:[^>]*?)>(.*?)<\/a>/g;
            processedText = processedText.replace(linkPattern, `<a href="$1" target="${linkTarget}" rel="noopener noreferrer">$2</a>`);
        } else {
            // Remove link tags if not allowed, but keep the text
            processedText = processedText.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"\s*(?:[^>]*?)>(.*?)<\/a>/g, '$2');
        }

        // Handle images if allowed
        if (allowImages) {
            const imgPattern = /<img\s+(?:[^>]*?\s+)?src="([^"]*)"\s*(?:[^>]*?)(?:\s+alt="([^"]*)")?\s*\/?>/g;
            processedText = processedText.replace(imgPattern, '<img src="$1" alt="$2" />');
        } else {
            // Replace images with placeholder or remove if not allowed
            const imgPlaceholder = options.imagePlaceholder || '[Image]';
            processedText = processedText.replace(/<img\s+(?:[^>]*?\s+)?src="([^"]*)"\s*(?:[^>]*?)(?:\s+alt="([^"]*)")?\s*\/?>/g,
                (_, __, alt) => alt ? imgPlaceholder + `: ${alt}` : imgPlaceholder);
        }

        // Handle highlight patterns with spans and custom class
        processedText = processedText.replace(
            /<highlight>(.*?)<\/highlight>/g,
            `<span class="${highlightClass}">$1</span>`
        );
    }

    return processedText;
}

/**
 * Truncate text to a specified length
 *
 * @param text Text to truncate
 * @param options Truncation options
 * @returns Truncated text
 */
export function truncateText(text: string, options: TruncateOptions): string {
    const { maxLength, suffix = '...', preserveWords = true } = options;

    if (text.length <= maxLength) {
        return text;
    }

    // Simply truncate if word preservation is not needed
    if (!preserveWords) {
        return text.slice(0, maxLength) + suffix;
    }

    // Truncate at the last complete word
    let truncated = text.slice(0, maxLength);

    // Find the last space in the truncated text
    const lastSpace = truncated.lastIndexOf(' ');

    // If there's a space, truncate at that point
    if (lastSpace > 0) {
        truncated = truncated.slice(0, lastSpace);
    }

    return truncated + suffix;
}

/**
 * Escape HTML special characters to prevent XSS
 *
 * @param html HTML string to escape
 * @returns Escaped HTML string
 */
export function escapeHtml(html: string): string {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Parse Markdown-like syntax to HTML
 * This is a very basic implementation for simple formatting
 *
 * @param markdown Markdown text
 * @returns HTML string
 */
export function parseSimpleMarkdown(markdown: string): string {
    let html = markdown;

    // Convert line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br />');

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Lists
    // Unordered lists
    html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');

    // Wrap in paragraph tags if not already
    if (!html.startsWith('<')) {
        html = `<p>${html}</p>`;
    }

    return html;
}

/**
 * Extract excerpt from HTML content
 *
 * @param html HTML content
 * @param maxLength Maximum length of excerpt
 * @param suffix Text to append after excerpt
 * @returns Plain text excerpt
 */
export function extractExcerpt(html: string, maxLength: number = 160, suffix: string = '...'): string {
    // Remove HTML tags
    const text = html.replace(/<\/?[^>]+(>|$)/g, ' ');

    // Normalize whitespace
    const normalizedText = text.replace(/\s+/g, ' ').trim();

    // Truncate text
    return truncateText(normalizedText, { maxLength, suffix, preserveWords: true });
}

/**
 * Convert string to slug (URL-friendly string)
 *
 * @param text Text to slugify
 * @returns Slugified text
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Format a date in a human-readable way
 *
 * @param date Date to format
 * @param format Format string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: string = 'default'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }

    // Format options
    const formats: Record<string, Intl.DateTimeFormatOptions> = {
        default: { year: 'numeric', month: 'long', day: 'numeric' },
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        monthYear: { year: 'numeric', month: 'long' },
        monthDay: { month: 'long', day: 'numeric' },
        relative: { year: 'numeric', month: 'long', day: 'numeric' }
    };

    // Use relative format if specified
    if (format === 'relative') {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (diffInDays < 365) {
            const months = Math.floor(diffInDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }

        // If more than a year, use standard date format
        return dateObj.toLocaleDateString('en-US', formats.default);
    }

    // Use specified format or default
    const formatOptions = formats[format] || formats.default;
    return dateObj.toLocaleDateString('en-US', formatOptions);
}

/**
 * Convert HTML to plain text
 *
 * @param html HTML content
 * @returns Plain text content
 */
export function htmlToPlainText(html: string): string {
    return html
        .replace(/<style[^>]*>.*?<\/style>/g, '') // Remove style tags and their content
        .replace(/<script[^>]*>.*?<\/script>/g, '') // Remove script tags and their content
        .replace(/<[^>]+>/g, ' ') // Replace other tags with a space
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
}