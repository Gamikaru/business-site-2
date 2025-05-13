import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/common/Button";
import { Heading } from "@/components/common/Typography";
import { ScrollReveal } from "@/components/core/Animations";
import RichText from "@/components/common/Typography/RichText";

interface NewsletterContentType {
  heading: string;
  tagline: string;
  description: string;
  submitButton: string;
  formFields: {
    id: string;
    label: string;
    type: string;
    placeholder?: string; // Make placeholder optional to match content structure
    required: boolean;
    options?: string[];
  }[];
  privacyNote: string;
}

interface NewsletterPreviewType {
  heading: string;
  description: string;
  items: string[];
  ctaText: string;
  ctaLink: string;
}

interface MediumProfileType {
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface ContentPolicyType {
  heading: string;
  description: string;
}

interface BlogNewsletterProps {
  newsletterContent: NewsletterContentType;
  newsletterPreviewContent: NewsletterPreviewType;
  mediumProfileContent: MediumProfileType;
  contentPolicyContent: ContentPolicyType;
}

const BlogNewsletter: React.FC<BlogNewsletterProps> = ({
  newsletterContent,
  newsletterPreviewContent,
  mediumProfileContent,
  contentPolicyContent
}) => {
  // State for form handling
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    interests: [] as string[],
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitting: false,
    success: false,
    error: false,
  });

  // Form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          interests: [...prev.interests, value],
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          interests: prev.interests.filter(item => item !== value),
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ submitting: true, success: false, error: false });

    // Simulated form submission
    setTimeout(() => {
      if (formData.email && formData.firstName) {
        setSubmitStatus({ submitting: false, success: true, error: false });
        setFormData({ firstName: "", email: "", interests: [] });

        setTimeout(() => {
          setSubmitStatus(prev => ({ ...prev, success: false }));
        }, 3000);
      } else {
        setSubmitStatus({ submitting: false, success: false, error: true });
      }
    }, 1000);
  };

  // Cleanup error message after delay
  useEffect(() => {
    if (submitStatus.error) {
      const timer = setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, error: false }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus.error]);

  return (
    <section className="relative bg-bg-primary py-16 md:py-24">
<div className="container mx-auto min-h-screen flex flex-col justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16">        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Newsletter Form */}
          <ScrollReveal direction="left" delay={0.2}>
            <div className="bg-bg-card border border-divider rounded-lg p-6 md:p-8 relative">
              {/* Technical frame */}
              <div className="absolute -left-4 -top-4 w-12 h-12 border-l-2 border-t-2 border-brand-primary/40 rounded-tl-lg"></div>
              <div className="absolute -right-4 -bottom-4 w-12 h-12 border-r-2 border-b-2 border-brand-primary/40 rounded-br-lg"></div>

              {/* Newsletter Header */}
              <div className="mb-6">
                <Heading level={3} className="text-2xl md:text-3xl font-heading mb-2">
                  <RichText content={newsletterContent.heading} />
                </Heading>
                <p className="text-text-secondary">
                  <RichText content={newsletterContent.tagline} />
                </p>
              </div>

              {/* Newsletter Description */}
              <div className="mb-6">
                <p className="text-text-secondary">
                  <RichText content={newsletterContent.description} />
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-text-primary">
                    {newsletterContent.formFields[0].label}
                  </label>
                  <input
                    type={newsletterContent.formFields[0].type}
                    id={newsletterContent.formFields[0].id}
                    name={newsletterContent.formFields[0].id}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={newsletterContent.formFields[0].placeholder}
                    required={newsletterContent.formFields[0].required}
                    className="w-full px-4 py-2 border border-border-input bg-bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    disabled={submitStatus.submitting}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-text-primary">
                    {newsletterContent.formFields[1].label}
                  </label>
                  <input
                    type={newsletterContent.formFields[1].type}
                    id={newsletterContent.formFields[1].id}
                    name={newsletterContent.formFields[1].id}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={newsletterContent.formFields[1].placeholder}
                    required={newsletterContent.formFields[1].required}
                    className="w-full px-4 py-2 border border-border-input bg-bg-input rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    disabled={submitStatus.submitting}
                  />
                </div>

                {/* Interests */}
                <div>
                  <span className="block text-sm font-medium mb-1 text-text-primary">
                    {newsletterContent.formFields[2].label}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {newsletterContent.formFields[2].options?.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          id={option.replace(/\s+/g, '-').toLowerCase()}
                          name="interests"
                          value={option}
                          checked={formData.interests.includes(option)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-brand-primary border-border-input rounded focus:ring-brand-primary"
                          disabled={submitStatus.submitting}
                        />
                        <label htmlFor={option.replace(/\s+/g, '-').toLowerCase()} className="ml-2 text-sm text-text-secondary">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    intent="primary"
                    size="lg"
                    className="w-full justify-center"
                    disabled={submitStatus.submitting}
                  >
                    {submitStatus.submitting ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </div>
                    ) : submitStatus.success ? (
                      <div className="flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>Subscribed!</span>
                      </div>
                    ) : (
                      newsletterContent.submitButton
                    )}
                  </Button>

                  {/* Error message */}
                  {submitStatus.error && (
                    <motion.div
                      className="mt-2 text-error text-sm flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      Please complete all required fields.
                    </motion.div>
                  )}
                </div>

                {/* Privacy Note */}
                <div className="mt-4">
                  <RichText content={newsletterContent.privacyNote} className="text-text-tertiary" />
                </div>
              </form>
            </div>
          </ScrollReveal>

          {/* Newsletter Preview and Extra Content */}
          <div className="space-y-8">
            {/* Newsletter Preview */}
            <ScrollReveal direction="right" delay={0.3}>
              <div className="bg-bg-card border border-divider rounded-lg p-6 md:p-8 relative">
                <Heading level={3} className="text-lg md:text-xl font-heading mb-4">
                  {newsletterPreviewContent.heading}
                </Heading>

                <p className="text-text-secondary mb-4">
                  {newsletterPreviewContent.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {newsletterPreviewContent.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </div>
                      <span className="ml-2 text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  intent="secondary"
                  href={newsletterPreviewContent.ctaLink}
                >
                  {newsletterPreviewContent.ctaText}
                </Button>
              </div>
            </ScrollReveal>

            {/* Medium Profile */}
            <ScrollReveal direction="right" delay={0.4}>
              <div className="bg-bg-card border border-divider rounded-lg p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-text-secondary mr-2">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"></path>
                  </svg>
                  <Heading level={4} className="text-lg font-heading">
                    Medium Profile
                  </Heading>
                </div>

                <p className="text-text-secondary mb-4">
                  {mediumProfileContent.description}
                </p>

                <Button
                  intent="secondary"
                  href={mediumProfileContent.ctaLink}
                  size="sm"
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17l9.2-9.2M17 17V7H7"></path>
                    </svg>
                  }
                  iconPosition="right"
                >
                  {mediumProfileContent.ctaText}
                </Button>
              </div>
            </ScrollReveal>

            {/* Content Policy */}
            <ScrollReveal direction="right" delay={0.5}>
              <div className="bg-bg-card border border-divider rounded-lg p-6 md:p-8">
                <Heading level={4} className="text-lg font-heading mb-4">
                  {contentPolicyContent.heading}
                </Heading>

                <div className="text-text-secondary">
                  <RichText content={contentPolicyContent.description} />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogNewsletter;
