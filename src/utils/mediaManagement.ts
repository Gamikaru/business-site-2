// src/utils/mediaManagement.ts
/**
 * Media formats supported in the application
 */
export type MediaFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'svg' | 'mp4' | 'webm' | 'youtube' | 'vimeo';

/**
 * Media resource interface
 */
export interface MediaResource {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    format?: MediaFormat;
    blurDataUrl?: string;
    placeholder?: 'blur' | 'empty';
    responsive?: boolean;
    priority?: boolean;
    id?: string;
    title?: string;
    caption?: string;
    attribution?: string;
    sizes?: string;
}

/**
 * Video resource interface
 */
export interface VideoResource extends MediaResource {
    poster?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    preload?: 'auto' | 'metadata' | 'none';
    playIcon?: string;
}

/**
 * Image dimensions
 */
export interface ImageDimensions {
    width: number;
    height: number;
    aspectRatio: number;
}

/**
 * Detect media format from URL or file path
 *
 * @param src Media source URL or path
 * @returns Detected media format or undefined
 */
export function detectMediaFormat(src: string): MediaFormat | undefined {
    // URL patterns for video platforms
    if (/youtube\.com|youtu\.be/i.test(src)) {
        return 'youtube';
    }

    if (/vimeo\.com/i.test(src)) {
        return 'vimeo';
    }

    // File extensions
    const extensions: Record<string, MediaFormat> = {
        jpg: 'jpg',
        jpeg: 'jpeg',
        png: 'png',
        webp: 'webp',
        avif: 'avif',
        gif: 'gif',
        svg: 'svg',
        mp4: 'mp4',
        webm: 'webm',
    };

    const match = src.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
    if (match && match[1]) {
        const extension = match[1].toLowerCase();
        if (extension in extensions) {
            return extensions[extension];
        }
    }

    return undefined;
}

/**
 * Is the media a video format
 *
 * @param format Media format to check
 * @returns Whether the format is a video
 */
export function isVideoFormat(format: MediaFormat | undefined): boolean {
    return format === 'mp4' || format === 'webm' || format === 'youtube' || format === 'vimeo';
}

/**
 * Get image dimensions from width and height or calculate from one dimension and aspect ratio
 *
 * @param options Partial dimensions with at least width, height, or aspectRatio
 * @returns Complete dimensions
 */
export function getImageDimensions(options: Partial<ImageDimensions>): ImageDimensions {
    const { width, height, aspectRatio } = options;

    if (width && height) {
        return {
            width,
            height,
            aspectRatio: width / height,
        };
    }

    if (width && aspectRatio) {
        const calculatedHeight = Math.round(width / aspectRatio);
        return {
            width,
            height: calculatedHeight,
            aspectRatio,
        };
    }

    if (height && aspectRatio) {
        const calculatedWidth = Math.round(height * aspectRatio);
        return {
            width: calculatedWidth,
            height,
            aspectRatio,
        };
    }

    // Default dimensions if insufficient information
    return {
        width: width || 1200,
        height: height || 800,
        aspectRatio: aspectRatio || 1.5,
    };
}

/**
 * Extract YouTube video ID from URL
 *
 * @param url YouTube URL
 * @returns YouTube video ID or null if not found
 */
export function getYouTubeId(url: string): string | null {
    // Handle standard YouTube URLs
    const standardRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const standardMatch = url.match(standardRegex);

    if (standardMatch && standardMatch[1]) {
        return standardMatch[1];
    }

    // Handle YouTube short URLs
    const shortRegex = /youtube\.com\/shorts\/([^"&?\/\s]{11})/;
    const shortMatch = url.match(shortRegex);

    if (shortMatch && shortMatch[1]) {
        return shortMatch[1];
    }

    return null;
}

/**
 * Extract Vimeo video ID from URL
 *
 * @param url Vimeo URL
 * @returns Vimeo video ID or null if not found
 */
export function getVimeoId(url: string): string | null {
    const regex = /(?:vimeo\.com\/)(\d+)/;
    const match = url.match(regex);

    return match && match[1] ? match[1] : null;
}

/**
 * Generate YouTube embed URL
 *
 * @param videoId YouTube video ID
 * @param options Embed options
 * @returns YouTube embed URL
 */
export function getYouTubeEmbedUrl(
    videoId: string,
    options: {
        autoplay?: boolean;
        controls?: boolean;
        loop?: boolean;
        mute?: boolean;
        showInfo?: boolean;
        start?: number;
        end?: number;
        playlistId?: string;
    } = {}
): string {
    const {
        autoplay = false,
        controls = true,
        loop = false,
        mute = false,
        showInfo = true,
        start,
        end,
        playlistId,
    } = options;

    const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        controls: controls ? '1' : '0',
        loop: loop ? '1' : '0',
        mute: mute ? '1' : '0',
        showinfo: showInfo ? '1' : '0',
        rel: '0',
        modestbranding: '1',
    });

    if (start !== undefined) {
        params.append('start', String(start));
    }

    if (end !== undefined) {
        params.append('end', String(end));
    }

    if (loop && playlistId) {
        params.append('playlist', playlistId);
    } else if (loop) {
        params.append('playlist', videoId);
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generate Vimeo embed URL
 *
 * @param videoId Vimeo video ID
 * @param options Embed options
 * @returns Vimeo embed URL
 */
export function getVimeoEmbedUrl(
    videoId: string,
    options: {
        autoplay?: boolean;
        loop?: boolean;
        muted?: boolean;
        byline?: boolean;
        title?: boolean;
        portrait?: boolean;
        color?: string;
    } = {}
): string {
    const {
        autoplay = false,
        loop = false,
        muted = false,
        byline = false,
        title = false,
        portrait = false,
        color,
    } = options;

    const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        loop: loop ? '1' : '0',
        muted: muted ? '1' : '0',
        byline: byline ? '1' : '0',
        title: title ? '1' : '0',
        portrait: portrait ? '1' : '0',
        dnt: '1', // Do Not Track
    });

    if (color) {
        params.append('color', color.replace('#', ''));
    }

    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

/**
 * Generate image sizes attribute for responsive images
 *
 * @param breakpoints Breakpoint configurations
 * @returns Sizes attribute string
 */
export function generateImageSizes(
    breakpoints: { width: number; size: string }[] = []
): string {
    if (breakpoints.length === 0) {
        // Default responsive behavior if no breakpoints provided
        return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    }

    // Sort breakpoints from smallest to largest
    const sortedBreakpoints = [...breakpoints].sort((a, b) => a.width - b.width);

    // Build sizes string
    const sizes = sortedBreakpoints.map(({ width, size }) => {
        return `(max-width: ${width}px) ${size}`;
    });

    // Add default size for larger screens
    const lastBreakpoint = sortedBreakpoints[sortedBreakpoints.length - 1];
    if (lastBreakpoint) {
        sizes.push(lastBreakpoint.size);
    }

    return sizes.join(', ');
}

/**
 * Generate common image breakpoints (useful for Next.js Image component)
 *
 * @returns Array of image widths for common device sizes
 */
export function getCommonImageBreakpoints(): number[] {
    return [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048];
}

/**
 * Generate aspect ratio CSS value
 *
 * @param width Width value
 * @param height Height value
 * @returns CSS aspect-ratio value
 */
export function getAspectRatioCss(width: number, height: number): string {
    // Reduce to simplest form
    const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b);
    };

    const divisor = gcd(width, height);
    const simplifiedWidth = width / divisor;
    const simplifiedHeight = height / divisor;

    return `${simplifiedWidth} / ${simplifiedHeight}`;
}

/**
 * Get YouTube thumbnail URL
 *
 * @param videoId YouTube video ID
 * @param quality Thumbnail quality
 * @returns YouTube thumbnail URL
 */
export function getYouTubeThumbnail(
    videoId: string,
    quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'
): string {
    const qualityMap = {
        default: 'default',
        hq: 'hqdefault',
        mq: 'mqdefault',
        sd: 'sddefault',
        maxres: 'maxresdefault',
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Check if media is external (hosted outside the website)
 *
 * @param src Media source URL
 * @returns Whether the media is external
 */
export function isExternalMedia(src: string): boolean {
    if (!src) return false;

    // Check if URL is absolute with a different domain
    if (/^https?:\/\//i.test(src)) {
        try {
            const url = new URL(src);
            if (typeof window !== 'undefined') {
                return url.hostname !== window.location.hostname;
            }
            return true;
        } catch {
            return false;
        }
    }

    return false;
}

/**
 * Get a placeholder image URL for missing images
 *
 * @param width Width of placeholder
 * @param height Height of placeholder
 * @param text Text to display on placeholder
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(width: number = 1200, height: number = 800, text: string = 'Image'): string {
    // Create SVG placeholder with dimensions
    // This uses base64 encoding to avoid external dependencies
    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0" />
      <rect width="100%" height="100%" fill="url(#grid)" />
      <text x="50%" y="50%" font-family="sans-serif" font-size="${Math.max(14, height / 20)}px" fill="#888" text-anchor="middle" dominant-baseline="middle">${text}</text>
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="#ddd" stroke-width="1" fill="none" />
        </pattern>
      </defs>
    </svg>
  `;

    // Convert to base64
    let encodedSvg: string;
    if (typeof window !== 'undefined') {
        // Browser environment
        encodedSvg = btoa(svg.trim());
    } else {
        // Node.js environment - handle Buffer usage safely
        try {
            // Check if Buffer is available
            if (typeof Buffer !== 'undefined') {
                encodedSvg = Buffer.from(svg.trim()).toString('base64');
            } else {
                // Fallback in environments without Buffer
                encodedSvg = '';
                console.warn('Buffer is not available in this environment');
            }
        } catch {
            encodedSvg = '';
            console.warn('Error encoding SVG as base64');
        }
    }

    return `data:image/svg+xml;base64,${encodedSvg}`;
}