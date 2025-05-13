// src/utils/metadata.ts
import { Metadata } from 'next';

export function createMetadata({
    title,
    description,
    path = '',
    ogImage = '/images/profilepic.jpg',
}: {
    title: string;
    description: string;
    path?: string;
    ogImage?: string;
}): Metadata {
    const url = `https://gavrielrudolph.com${path}`;

    return {
        title,
        description,
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url,
            title,
            description,
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}