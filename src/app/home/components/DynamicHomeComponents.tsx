// src/app/home/components/DynamicHomeComponents.tsx
'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { LinkContext, useLinkContext, SafeLink } from '@/components/core/LinkContext'

// Suspense fallback component
const SectionLoader = () => (
  <div className="h-80 w-full animate-pulse bg-bg-secondary/20 rounded-lg" aria-hidden="true" />
)

// Dynamically import client-side only components with proper loading states
const HomeBlog = dynamic(() => import('../HomeBlog'), {
  ssr: false,
  loading: () => <SectionLoader />
})

const HomeTestimonials = dynamic(() => import('../HomeTestimonials'), {
  ssr: false,
  loading: () => <SectionLoader />
})

// Re-export link context components for backward compatibility
export { LinkContext, useLinkContext, SafeLink }

interface BlogPost {
  id: string
  title: string
  excerpt: string
  readTime: string
  imageSrc: string
  link: string
}

interface TestimonialItem {
  id: string
  quote: string
  author: string
  role: string
  result: string
}

interface DynamicHomeComponentsProps {
  blogContent?: {
    heading: string
    introduction: string
    posts: BlogPost[]
    ctaText: string
    ctaLink: string
  }
  testimonialContent?: {
    heading: string
    items: TestimonialItem[]
  }
}

const DynamicHomeComponents: React.FC<DynamicHomeComponentsProps> = ({
  blogContent,
  testimonialContent
}) => {
  // Only render on the client side
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sample fallback data if content props aren't provided
  const defaultBlogContent = {
    heading: "Latest Insights",
    introduction: "Explore the latest trends and insights from our team of experts.",
    posts: [
      {
        id: "blog-1",
        title: "The Future of Web Development",
        excerpt: "Exploring the latest trends in frontend and backend technologies.",
        readTime: "5 min read",
        imageSrc: "/images/blog/blog-1.jpg",
        link: "/blog/future-web-development"
      },
      {
        id: "blog-2",
        title: "Optimizing React Applications",
        excerpt: "Performance tips and tricks for modern React applications.",
        readTime: "7 min read",
        imageSrc: "/images/blog/blog-2.jpg",
        link: "/blog/optimizing-react-apps"
      },
      {
        id: "blog-3",
        title: "Building with Next.js 15",
        excerpt: "Leveraging the latest features in Next.js for better applications.",
        readTime: "6 min read",
        imageSrc: "/images/blog/blog-3.jpg",
        link: "/blog/building-nextjs-15"
      }
    ],
    ctaText: "View All Articles",
    ctaLink: "/blog"
  }

  const defaultTestimonialContent = {
    heading: "Client Success Stories",
    items: [
      {
        id: "testimonial-1",
        quote: "Working with this team transformed our digital presence completely. The attention to detail and technical expertise was exactly what we needed to take our platform to the next level.",
        author: "Sarah Johnson",
        role: "CTO, TechInnovate",
        result: "40% increase in user engagement and 25% improvement in conversion rates."
      },
      {
        id: "testimonial-2",
        quote: "The dedication to quality and performance optimization made all the difference. Our application now loads in half the time and users have noticed the improvement.",
        author: "Michael Chen",
        role: "Product Director, FutureSoft",
        result: "Page load time reduced by 60% and core web vitals all in the green."
      }
    ]
  }

  // Don't render anything during SSR to prevent hydration errors
  if (!isClient) {
    return null
  }

  // Use provided content or fallback to defaults
  const actualBlogContent = blogContent || defaultBlogContent
  const actualTestimonialContent = testimonialContent || defaultTestimonialContent

  return (
    <>
      <HomeTestimonials
        heading={actualTestimonialContent.heading}
        items={actualTestimonialContent.items}
      />

      <HomeBlog
        heading={actualBlogContent.heading}
        introduction={actualBlogContent.introduction}
        posts={actualBlogContent.posts}
        ctaText={actualBlogContent.ctaText}
        ctaLink={actualBlogContent.ctaLink}
      />
    </>
  )
}

export default DynamicHomeComponents