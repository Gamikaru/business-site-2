# Semantic Color Variables Guide

## Introduction

This guide outlines best practices for using semantic color variables when building UI components. By following these principles, you'll create interfaces that are consistent, accessible, and easily themeable.

## The Semantic Color System

Our color system is built on semantic tokens rather than direct color values. This creates a separation between the raw palette and how colors are applied, ensuring consistency across different themes.

### Core Principle

**Never use raw color values directly in components.** Always reference semantic color variables.

```css
/* ❌ Don't do this */
.button {
  background-color: #41FC03;
}

/* ✅ Do this instead */
.button {
  background-color: var(--color-accent-primary);
}
```

## Semantic Color Categories

### Background Colors

Use these variables for various surface types:

```css
.page-container {
  background-color: var(--color-primary-bg);
}

.card {
  background-color: var(--color-card-bg);
}

.code-block {
  background-color: var(--color-code-bg);
}

.modal-overlay {
  background-color: var(--color-glass-bg);
}

/* State-based backgrounds */
.button:hover {
  background-color: var(--color-hover-bg);
}

.button:active {
  background-color: var(--color-active-bg);
}

.button:disabled {
  background-color: var(--color-disabled-bg);
}
```

### Typography Colors

Use these variables for text elements:

```css
body {
  color: var(--color-primary-text);
}

.secondary-text {
  color: var(--color-secondary-text);
}

.helper-text {
  color: var(--color-tertiary-text);
}

.disabled-label {
  color: var(--color-disabled-text);
}

h1, h2, h3 {
  color: var(--color-heading);
}

h4, h5, h6 {
  color: var(--color-subheading);
}

.highlight {
  color: var(--color-text-emphasis);
}

.code {
  color: var(--color-code-text);
}

/* For text on colored backgrounds */
.primary-button {
  background-color: var(--color-accent-primary);
  color: var(--color-text-on-accent);
}
```

### Brand & Accent Colors

Use these for branded elements and interactive components:

```css
.logo-element {
  color: var(--color-brand-primary);
}

.secondary-brand-element {
  color: var(--color-brand-secondary);
}

.primary-button {
  background-color: var(--color-accent-primary);
}

.primary-button:hover {
  background-color: var(--color-accent-primary-hover);
}

.primary-button:active {
  background-color: var(--color-accent-primary-active);
}

.accent-border {
  border-color: var(--color-accent-secondary);
}
```

### Status Colors

Use these for feedback and status indicators:

```css
.success-message {
  background-color: var(--color-success-subtle);
  color: var(--color-success);
}

.error-message {
  background-color: var(--color-error-subtle);
  color: var(--color-error);
}

.warning-badge {
  background-color: var(--color-warning);
}

.info-toast {
  background-color: var(--color-info-subtle);
  border-left: 4px solid var(--color-info);
}

.neutral-badge {
  background-color: var(--color-neutral);
}
```

### Support Colors

Use these for decorative and structural elements:

```css
.grid-overlay {
  border-color: var(--color-grid-lines);
}

.card {
  box-shadow: var(--shadow-md);
}

.button:focus {
  box-shadow: var(--shadow-focus);
}
```

## Breaking the Rules: Creative Typography

For special headings and creative typography, it's acceptable to use direct color references or create specific creative tokens:

### Multicolored Text

For headlines with multiple colors, consider these approaches:

```css
/* Individual spans for color variation */
.hero-headline span:nth-child(odd) {
  color: var(--color-heading);
}

.hero-headline span:nth-child(even) {
  color: var(--color-heading-accent);
}

/* Or use creative-specific tokens */
.creative-heading .primary {
  color: var(--color-brand-primary);
}

.creative-heading .secondary {
  color: var(--color-accent-secondary);
}

.creative-heading .accent {
  color: var(--color-text-emphasis);
}
```

### Gradients and Effects

For special text effects:

```css
.gradient-headline {
  background: linear-gradient(
    to right,
    var(--color-brand-primary),
    var(--color-accent-secondary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
```

## Dark Mode Considerations

Our semantic system automatically handles dark mode transitions when implemented correctly:

```css
/* This will automatically adapt to both light and dark modes */
.card {
  background-color: var(--color-card-bg);
  color: var(--color-primary-text);
  border: 1px solid var(--color-border);
}
```

## Best Practices

1. **Maintain Semantic Meaning**: Use variables based on their semantic purpose, not their visual appearance.

2. **Respect Accessibility**: Ensure text colors maintain at least a 4.5:1 contrast ratio with their backgrounds.

3. **Limit Creative Exceptions**: Reserve direct color manipulation for specific creative elements like hero headlines.

4. **Use Opacity Purposefully**: When adjusting opacity, consider using the pre-defined subtle variations instead:

   ```css
   /* ❌ Don't do this */
   .info-box {
     background-color: rgba(var(--color-info-rgb), 0.15);
   }

   /* ✅ Do this instead */
   .info-box {
     background-color: var(--color-info-subtle);
   }
   ```

5. **Hierarchical Thinking**: Use color to reinforce hierarchy and guide user attention.

6. **Consider Color Meaning**: Be mindful of cultural and psychological associations with colors.

## Component-Specific Guidelines

### Buttons

```css
.button-primary {
  background-color: var(--color-accent-primary);
  color: var(--color-text-on-accent);
}

.button-secondary {
  background-color: transparent;
  color: var(--color-accent-primary);
  border: 1px solid var(--color-accent-primary);
}

.button-tertiary {
  background-color: transparent;
  color: var(--color-accent-primary);
}
```

### Forms

```css
.input {
  background-color: var(--color-input-bg);
  border: 1px solid var(--color-border-input);
  color: var(--color-primary-text);
}

.input::placeholder {
  color: var(--color-field-placeholder);
}

.input:focus {
  border-color: var(--color-field-focus);
  box-shadow: var(--shadow-focus);
}

.input.invalid {
  border-color: var(--color-field-invalid);
}

.input-label {
  color: var(--color-secondary-text);
}

.input-helper {
  color: var(--color-tertiary-text);
}
```

### Cards

```css
.card {
  background-color: var(--color-card-bg);
  box-shadow: var(--shadow-md);
}

.card-header {
  border-bottom: 1px solid var(--color-divider);
}

.card-title {
  color: var(--color-heading);
}
```

## Conclusion

By consistently using semantic color variables, you'll create interfaces that are:

- **Themeable**: Easy to adapt to new brand colors or design trends
- **Consistent**: Maintain visual harmony across components
- **Accessible**: Ensure readable text and clear interactive states
- **Maintainable**: Centralize color decisions in one place

Remember: semantic colors describe the purpose of the element, not its visual appearance. This separation allows for consistent application of color across different themes and contexts.