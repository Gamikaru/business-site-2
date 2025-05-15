"use client";

import React from 'react';
import Link from 'next/link';

// Create a context to prevent nested links
export const LinkContext = React.createContext<boolean>(false);

// Custom hook to check if we're inside a link already
export function useLinkContext() {
  return React.useContext(LinkContext);
}

// Regular anchor SafeLink component
export function SafeLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode
}) {
  const isInsideLink = useLinkContext();

  if (isInsideLink) {
    // If already inside a link, render a span or div instead
    return <span className="cursor-pointer" {...props}>{children}</span>;
  }

  // Otherwise render a normal link with context provider
  return (
    <LinkContext.Provider value={true}>
      <a href={href} {...props}>
        {children}
      </a>
    </LinkContext.Provider>
  );
}

// Next.js Link compatible SafeLink
export function SafeNextLink({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const isInsideLink = useLinkContext();

  if (isInsideLink) {
    // If already inside a link, render a span instead
    return <span className="cursor-pointer" {...props}>{children}</span>;
  }

  // Otherwise render a Next.js Link with context provider
  return (
    <LinkContext.Provider value={true}>
      <Link href={href} {...props}>
        {children}
      </Link>
    </LinkContext.Provider>
  );
}

// For buttons inside clickable areas
export function ActionButton({
  onClick,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={(e) => {
        // Stop propagation to prevent parent link from being activated
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}