// src/app/home/components/cta/CTAButton.tsx
"use client";

import React, { useState } from "react";
import styled from "styled-components";

export interface CTAButtonProps {
  ctaLink: string;
  as: "a" | "button";
  accentColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    brand: string;
  };
}

const CTAButton: React.FC<CTAButtonProps> = ({
  ctaLink,
  as,
  accentColors
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Button text content
  const staticText = "CURIOUS?";
  const hoverText = "LET'S TALK";

  // Handle hover states
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Render as <a> or <button>
  const ButtonElement = as === "a" ? "a" : "button";

  return (
    <StyledWrapper
      $primary={accentColors.primary}
      $secondary={accentColors.secondary}
      $tertiary={accentColors.tertiary}
      $brand={accentColors.brand}
    >
      <ButtonElement
        className="button button-item"
        href={as === "a" ? ctaLink : undefined}
        onClick={as === "button" ? () => (window.location.href = ctaLink) : undefined}
        type={as === "button" ? "button" : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="button-bg">
          <span className="button-bg-layers">
            <span className="button-bg-layer button-bg-layer-1 -primary" />
            <span className="button-bg-layer button-bg-layer-2 -secondary" />
            <span className="button-bg-layer button-bg-layer-3 -tertiary" />
          </span>
        </span>
        <span className="button-inner">
          {/* Static text with animated question mark */}
          <span className="button-inner-static">
            CURIOUS<span className="question-mark">?</span>
          </span>

          {/* Hover text with arrow */}
          <span className="button-inner-hover">
            LET'S TALK<span className="arrow">→</span>
          </span>
        </span>
      </ButtonElement>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{
  $primary: string;
  $secondary: string;
  $tertiary: string;
  $brand: string;
}>`
  button {
    all: unset;
  }

  .button {
    position: relative;
    display: inline-flex;
    height: 3.5rem;
    align-items: center;
    border-radius: 9999px;
    padding-left: 2.8rem;
    padding-right: 2.8rem;
    font-family: var(--font-body, 'Segoe UI', sans-serif);
    font-size: 1.2rem;
    font-weight: 640;
    color: #fff; /* Ensure text is white by default */
    letter-spacing: -0.01em;
    text-transform: uppercase;
    cursor: pointer;
    min-width: 15rem;
    width: max-content;
    justify-content: center;
    white-space: nowrap;
    border: none;
    background: transparent;
    z-index: 1;
    overflow: visible;
    transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1),
                box-shadow 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  /* Neo-brutalist 3D effect on hover */
  .button:hover {
    transform: translateY(-2px);
    box-shadow: 4px 4px 0 0 #fff; /* Changed to white shadow */
  }

  .button:active {
    transform: translateY(0);
    box-shadow: 2px 2px 0 0 #fff; /* Changed to white shadow */
    transition: transform 0.1s, box-shadow 0.1s;
  }

  /* Gradient border effect container */
  .button::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 9999px;
    background: linear-gradient(
      90deg,
      var(--color-accent-primary, ${props => props.$primary}),
      var(--color-accent-secondary, ${props => props.$secondary}),
      var(--color-brand-primary, ${props => props.$brand})
    );
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    z-index: -1;
  }

  /* Background mask to create border effect */
  .button::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: transparent; /* Ensure transparent background */
    z-index: -1;
    border: 2px solid #fff; /* Add white border by default */
  }

  /* Show gradient border on hover without animation */
  .button:hover::before {
    opacity: 1;
  }

  .button-item {
    background-color: transparent;
  }

  .button-item .button-bg {
    border: none;
    background-color: transparent;
    background-image: none;
    border-radius: 9999px;
    transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1);
  }

  /* Keep your current gradient fill animation */
  .button-item:hover .button-bg {
    background-image: linear-gradient(
      120deg,
      var(--color-accent-primary, ${props => props.$primary}) 0%,
      var(--color-accent-secondary, ${props => props.$secondary}) 50%,
      var(--color-brand-primary, ${props => props.$brand}) 100%
    );
    background-size: 200% 200%;
    background-position: 0% 100%;
    animation: cta-fill-gradient 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    background-color: unset;
  }

  /* Improved gradient animation sequence */
  @keyframes cta-fill-gradient {
    0% {
      background-position: 0% 100%;
      opacity: 0.5;
      transform: scale(0.98);
    }
    50% {
      background-position: 50% 50%;
      opacity: 0.9;
      transform: scale(1);
    }
    100% {
      background-position: 100% 0%;
      opacity: 1;
      transform: scale(1);
    }
  }

  .button-inner,
  .button-inner-hover,
  .button-inner-static {
    pointer-events: none;
    display: block;
    white-space: nowrap; /* prevent wrapping */
  }

  .button-inner {
    position: relative;
    z-index: 10;
    width: 100%;
    text-align: center;
    overflow: hidden; /* prevent vertical overflow of animating text */
    height: 1.5em; /* ensures enough space for text, adjust as needed */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button-inner-static {
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .button-inner-hover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    opacity: 0;
    transform: translateY(100%);
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease;
  }

  /* Question mark to arrow transformation */
  .question-mark {
    display: inline-block;
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease;
  }

  .arrow {
    display: inline-block;
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s ease;
    margin-left: 0.3rem;
  }

  .button-bg {
    overflow: hidden;
    border-radius: 2rem;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(1);
    transition: transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .button-bg,
  .button-bg-layer,
  .button-bg-layers {
    display: block;
  }

  .button-bg-layers {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: -60%;
    aspect-ratio: 1 / 1;
    width: max(200%, 10rem);
  }

  .button-bg-layer {
    border-radius: 9999px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(0);
  }

  .button-bg-layer.-primary {
    background-color: var(--color-accent-primary, ${props => props.$primary});
  }

  .button-bg-layer.-secondary {
    background-color: var(--color-accent-secondary, ${props => props.$secondary});
  }

  .button-bg-layer.-tertiary {
    background-color: var(--color-brand-primary, ${props => props.$brand});
  }

  /* Enhanced hover animation effects - modify to work with new border effect */
  .button:hover .button-inner-static {
    opacity: 0;
    transform: translateY(-100%);
    transition:
      transform 0.7s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.3s ease;
  }

  .button:hover .button-inner-hover {
    opacity: 1;
    transform: translateY(0);
    transition:
      transform 0.7s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.6s ease 0.1s;
  }

  /* Special animation for question mark */
  .button:hover .question-mark {
    transform: rotate(90deg) scale(0);
    opacity: 0;
  }

  /* Special animation for arrow */
  .button:not(:hover) .arrow {
    transform: rotate(-90deg) scale(0);
    opacity: 0;
  }

  .button:hover .arrow {
    transform: translateX(0.4rem);
    transition-delay: 0.2s;
  }

  .button:hover .button-bg-layer {
    transition:
      transform 1.3s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.3s linear;
  }

  .button:hover .button-bg-layer-1 {
    transform: scale(1);
  }

  .button:hover .button-bg-layer-2 {
    transition-delay: 0.12s;
    transform: scale(1);
  }

  .button:hover .button-bg-layer-3 {
    transition-delay: 0.24s;
    transform: scale(1);
  }
`;

export default CTAButton;