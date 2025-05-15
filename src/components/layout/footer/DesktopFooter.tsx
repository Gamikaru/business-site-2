"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAnimationPreferences } from "@/components/core/Animations/hooks/useAnimationPreferences";
import Icon from "@/components/common/Icons/Icon";

// Define the footer navigation and content sections
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/portfolio" },
];

const serviceLinks = [
  { label: "AI / RPA", href: "/services/ai-automation" },
  { label: "Web Apps", href: "/services/web-development" },
  { label: "Perf. Tuning", href: "/services/performance" },
];

const DesktopFooter: React.FC = () => {
  const { shouldAnimate } = useAnimationPreferences();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle newsletter form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call for newsletter subscription
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);

      // Reset subscription message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 5000);
    }, 1000);
  };

  return (
    <footer className="bg-bg-primary pt-16 border-t border-divider">
      {/* Blueprint Grid Overlay */}
      <div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%2328B487' stroke-width='0.8'%3E%3Cpath d='M0 0 L100 0 L100 100 L0 100 Z'/%3E%3Cpath d='M25 0 L25 100 M50 0 L50 100 M75 0 L75 100'/%3E%3Cpath d='M0 25 L100 25 M0 50 L100 50 M0 75 L100 75'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Main Footer Content */}
        <div className="relative grid grid-cols-12 gap-6 pb-12">
          {/* Quick Links */}
          <div className="col-span-3">
            <h3 className="text-heading font-heading font-semibold text-lg mb-4">
              Quick Links
              <div
                className="w-16 h-px mt-2"
                style={{ background: "var(--color-accent-primary)" }}
              ></div>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-heading transition-colors duration-200 inline-flex items-center group"
                  >
                    <span
                      className="mr-2 opacity-80"
                      style={{ color: "var(--color-accent-primary)" }}
                    >
                      •
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-3">
            <h3 className="text-heading font-heading font-semibold text-lg mb-4">
              Services
              <div
                className="w-16 h-px mt-2"
                style={{ background: "var(--color-accent-primary)" }}
              ></div>
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-heading transition-colors duration-200 inline-flex items-center group"
                  >
                    <span
                      className="mr-2 opacity-80"
                      style={{ color: "var(--color-accent-primary)" }}
                    >
                      •
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insights */}
          <div className="col-span-3">
            <h3 className="text-heading font-heading font-semibold text-lg mb-4">
              Insights
              <div
                className="w-16 h-px mt-2"
                style={{ background: "var(--color-accent-primary)" }}
              ></div>
            </h3>
            <div className="mb-4">
              <h4 className="text-heading font-medium">Latest Post ▶</h4>
              <p className="text-text-secondary text-sm mt-1">
                &quot;LLM Guardrails&quot;
              </p>
              <Link
                href="/blog/llm-guardrails"
                className="text-sm mt-2 inline-flex items-center group transition-colors duration-200"
                style={{ color: "var(--color-accent-primary)" }}
              >
                Read More
                <Icon
                  name="fi:FiArrowRight"
                  size={12}
                  className="ml-1 group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div className="col-span-3">
            <h3 className="text-heading font-heading font-semibold text-lg mb-4">
              Connect
              <div
                className="w-16 h-px mt-2"
                style={{ background: "var(--color-accent-primary)" }}
              ></div>
            </h3>
            <div className="space-y-2">
              <p className="text-text-primary">hello@gav.dev</p>
              <p className="text-text-secondary">Tampa, FL</p>
              <div className="flex space-x-4 mt-3">
                {/* Twitter/X Icon */}
                <motion.a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-sm border text-icon-secondary transition-colors duration-200 focus-visible-ring"
                  style={{
                    borderColor: "var(--color-divider)",
                    color: "var(--color-icon-secondary)",
                  }}
                  whileHover={shouldAnimate() ? { y: -3 } : {}}
                  transition={{ duration: 0.2 }}
                  aria-label="Twitter"
                >
                  <Icon name="fi:FiTwitter" size={16} />
                </motion.a>

                {/* GitHub Icon */}
                <motion.a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-sm border text-icon-secondary transition-colors duration-200 focus-visible-ring"
                  style={{
                    borderColor: "var(--color-divider)",
                    color: "var(--color-icon-secondary)",
                  }}
                  whileHover={shouldAnimate() ? { y: -3 } : {}}
                  transition={{ duration: 0.2 }}
                  aria-label="GitHub"
                >
                  <Icon name="fi:FiGithub" size={16} />
                </motion.a>

                {/* LinkedIn Icon */}
                <motion.a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-sm border text-icon-secondary transition-colors duration-200 focus-visible-ring"
                  style={{
                    borderColor: "var(--color-divider)",
                    color: "var(--color-icon-secondary)",
                  }}
                  whileHover={shouldAnimate() ? { y: -3 } : {}}
                  transition={{ duration: 0.2 }}
                  aria-label="LinkedIn"
                >
                  <Icon name="fi:FiLinkedin" size={16} />
                </motion.a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="relative py-8 border-t border-divider text-center">
          <h3 className="text-xl font-heading font-semibold text-heading mb-4">
            Newsletter
          </h3>
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <p className="text-text-secondary mr-2 whitespace-nowrap">
                Stay two steps ahead.
              </p>
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className={`w-full px-4 py-2 bg-bg-input border border-field-border rounded-md focus-visible-ring transition-colors duration-200 ${
                    isSubscribed ? "border-success bg-success-subtle" : ""
                  }`}
                  required
                  aria-label="Email for newsletter"
                  disabled={isSubmitting || isSubscribed}
                />
                {isSubscribed && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                    <Icon name="fi:FiCheck" size={16} />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="flex-shrink-0 bg-gradient-button text-text-on-accent px-6 py-2 rounded-md shadow-button hover:shadow-lg transition-all duration-150 focus-visible-ring flex items-center justify-center"
                disabled={isSubmitting || isSubscribed}
              >
                {isSubmitting ? (
                  <Icon name="fi:FiLoader" className="animate-spin" size={16} />
                ) : isSubscribed ? (
                  "Subscribed!"
                ) : (
                  <>
                    Subscribe{" "}
                    <Icon name="fi:FiSend" size={14} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="border-t border-divider py-4 text-text-tertiary">
        <div className="container mx-auto py-16 md:py-32 px-4 md:px-8 max-w-7xl relative z-10">

          <div>© 2025 Gavriel Rudolph — Built with React & ☕ in Tampa</div>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
