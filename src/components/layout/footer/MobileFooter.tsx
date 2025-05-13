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

const MobileFooter: React.FC = () => {
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
    <footer className="bg-bg-primary pt-10 border-t border-divider">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Quick Links - Left Column */}
          <div>
            <h3 className="text-heading font-heading font-semibold text-base mb-3">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-heading transition-colors duration-200 inline-flex items-center group py-1"
                  >
                    <span className="mr-2 text-brand-primary opacity-80">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - Right Column */}
          <div>
            <h3 className="text-heading font-heading font-semibold text-base mb-3">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-heading transition-colors duration-200 inline-flex items-center group py-1"
                  >
                    <span className="mr-2 text-brand-primary opacity-80">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-divider my-6"></div>

        {/* Newsletter Section */}
        <div className="mb-6">
          <h3 className="text-heading font-heading font-semibold text-base mb-3">
            Newsletter
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className={`w-full px-4 py-3 bg-bg-input border border-field-border rounded-md focus-visible-ring transition-colors duration-200 ${
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
              className="w-full bg-gradient-button text-text-on-accent py-3 rounded-md shadow-button transition-all duration-150 focus-visible-ring flex items-center justify-center"
              disabled={isSubmitting || isSubscribed}
            >
              {isSubmitting ? (
                <Icon name="fi:FiLoader" className="animate-spin" size={16} />
              ) : isSubscribed ? (
                "Subscribed!"
              ) : (
                <>
                  Subscribe <Icon name="fi:FiSend" size={14} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="h-px bg-divider my-6"></div>

        {/* Contact & Social */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-text-primary">hello@gav.dev</span>
            <div className="flex space-x-4">
              {/* Social Icons */}
              <motion.a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-sm border border-divider text-icon-secondary hover:text-brand-primary hover:border-brand-primary transition-colors duration-200 focus-visible-ring"
                whileHover={shouldAnimate() ? { y: -2 } : {}}
                transition={{ duration: 0.2 }}
                aria-label="Twitter"
              >
                <Icon name="fi:FiTwitter" size={18} />
              </motion.a>

              <motion.a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-sm border border-divider text-icon-secondary hover:text-brand-primary hover:border-brand-primary transition-colors duration-200 focus-visible-ring"
                whileHover={shouldAnimate() ? { y: -2 } : {}}
                transition={{ duration: 0.2 }}
                aria-label="GitHub"
              >
                <Icon name="fi:FiGithub" size={18} />
              </motion.a>

              <motion.a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-sm border border-divider text-icon-secondary hover:text-brand-primary hover:border-brand-primary transition-colors duration-200 focus-visible-ring"
                whileHover={shouldAnimate() ? { y: -2 } : {}}
                transition={{ duration: 0.2 }}
                aria-label="LinkedIn"
              >
                <Icon name="fi:FiLinkedin" size={18} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="py-6 text-text-tertiary text-sm text-center space-y-1">
          <div>© 2025 Gavriel Rudolph</div>
          <div>Tampa, FL</div>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;