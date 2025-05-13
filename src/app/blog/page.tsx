import { blogContent } from "./content";
import { Metadata } from "next";
import BlogClientPage from "./components/BlogClientPage";

// Server component for metadata
export const metadata: Metadata = {
  title: blogContent.meta.title,
  description: blogContent.meta.description,
};

export default function BlogPage() {
  return <BlogClientPage />;
}
