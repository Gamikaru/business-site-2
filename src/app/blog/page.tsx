// src/app/blog/page.tsx
import { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";
import { defaultBlogContent } from "@/content/sections/blogs";

// Generate metadata using our utility and content system
export const metadata: Metadata = createMetadata({
  title: defaultBlogContent.meta.title,
  description: defaultBlogContent.meta.description,
  path: "/blog",
});

export default function BlogPage() {
  return (
    <main className="flex flex-col items-center w-full">
      {/* Blog header with intro text */}
      <section id="blog-header" className="w-full">
        {/* <BlogHeader /> */}
      </section>

      {/* Featured/latest posts section */}
      <section id="featured-posts" className="w-full">
        {/* <FeaturedPosts /> */}
      </section>

      {/* Blog categories and tags for filtering */}
      <section id="blog-categories" className="w-full">
        {/* <BlogCategories /> */}
      </section>

      {/* Main blog post listing */}
      <section id="blog-posts" className="w-full">
        {/* <BlogPostGrid /> */}
      </section>

      {/* Blog stats and author info */}
      <section id="blog-info" className="w-full">
        {/* <BlogAuthorInfo /> */}
      </section>

      {/* Newsletter signup specific to blog */}
      <section id="blog-newsletter" className="w-full">
        {/* <BlogNewsletterSignup /> */}
      </section>
    </main>
  );
}
