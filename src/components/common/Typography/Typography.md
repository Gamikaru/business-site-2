# Typography System Documentation

This document provides guidance on how to use the typography system in your components effectively. The typography system provides a set of consistent, customizable components for text rendering throughout the application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Text Component](#text-component)
3. [Heading Components](#heading-components)
4. [Prose Component](#prose-component)
5. [RichText Component](#richtext-component)
6. [Font System](#font-system)
7. [Examples](#examples)
8. [Best Practices](#best-practices)

## Getting Started

### Setup

The typography system is built around our font context and properly configured in the project. To use it in your components, simply import the needed components:

```tsx
import { Text, H1, H2, Prose } from '@/components/common/Typography';

function MyComponent() {
  return (
    <div>
      <H1>Main Heading</H1>
      <Text>Regular paragraph text</Text>
    </div>
  );
}
```

## Text Component

The `Text` component is the foundation of the typography system. It provides consistent text styling with numerous customization options.

```tsx
import { Text } from '@/components/common/Typography';

function MyComponent() {
  return (
    <>
      <Text>Default text</Text>
      <Text variant="secondary" size="lg" weight="medium">
        Customized text
      </Text>
      <Text as="span" variant="accent" weight="bold">
        Accent text as span
      </Text>
    </>
  );
}
```

### Props

- `as`: "p" | "span" | "div" | "label" - HTML element to render (default: "p")
- `variant`:
  - "default" - Primary text color
  - "secondary" - Secondary text color
  - "tertiary" - Tertiary text color
  - "muted" - Disabled or less important text
  - "accent" - Accent colored text
  - "success" - Success status text
  - "warning" - Warning status text
  - "error" - Error status text
  - "info" - Informational text
- `size`: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
- `weight`: "normal" | "medium" | "semibold" | "bold" | "extrabold"
- `family`: "body" | "heading" | "code" - Font family to use
- `leading`: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose" - Line height control
- `align`: "left" | "center" | "right" | "justify" - Text alignment
- `tracking`: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest" - Letter spacing
- `transform`: "uppercase" | "lowercase" | "capitalize" | "normalCase" - Text transform
- `wrap`: "normal" | "nowrap" | "pre" | "preLine" | "preWrap" - Whitespace handling
- `decoration`: "none" | "underline" | "lineThrough" - Text decoration
- `wordSpacing`: "normal" | "wide" | "wider" - Word spacing control
- `truncate`: boolean - Whether to truncate text with ellipsis
- `preserveSpacing`: boolean - Preserve whitespace (default: true)

## Heading Components

For headings, use either the generic `Heading` component or specific level components (H1-H6) for semantic HTML.

```tsx
import { Heading, H1, H2, H3, H4, H5, H6 } from '@/components/common/Typography';

function HeadingsExample() {
  return (
    <div>
      <H1>Main Page Title</H1>
      <H2 variant="secondary">Section Header</H2>
      <H3 variant="accent">Accent Heading</H3>
      <H4 weight="medium">Medium Weight Heading</H4>
      <H5 align="center">Centered Heading</H5>
      <H6 transform="uppercase">Small Uppercase Heading</H6>

      {/* Using the generic Heading component */}
      <Heading level={2} variant="gradient">Gradient Heading</Heading>
    </div>
  );
}
```

### Props

- `level`: 1 | 2 | 3 | 4 | 5 | 6 - Heading level (semantic and visual size)
- `as`: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" - Override the HTML element
- `variant`:
  - "default" - Primary heading color
  - "secondary" - Secondary color
  - "accent" - Accent color
  - "gradient" - Gradient background text
- `weight`: "normal" | "medium" | "semibold" | "bold" | "extrabold"
- `align`: "left" | "center" | "right"
- `transform`: "uppercase" | "lowercase" | "capitalize" | "normal"
- `spacing`: "normal" | "wide" | "wider" - Controls word spacing
- `preserveSpacing`: boolean - Preserve whitespace (default: true)

## Prose Component

The `Prose` component is designed for rich, long-form content. It applies proper typography styles to HTML content, making it ideal for blog posts, articles, or any content with mixed formatting.

```tsx
import { Prose } from '@/components/common/Typography';

function Article() {
  return (
    <Prose size="lg">
      <h2>Article Title</h2>
      <p>First paragraph with <strong>bold text</strong> and <em>emphasis</em>.</p>
      <h3>Subsection</h3>
      <p>More content with <a href="#">links</a> and <code>inline code</code>.</p>
      <pre><code>const code = 'formatted code block';</code></pre>
      <blockquote>
        <p>A nice blockquote with proper styling.</p>
      </blockquote>
      <ul>
        <li>List item one</li>
        <li>List item two
          <ul>
            <li>Nested list item</li>
          </ul>
        </li>
      </ul>
    </Prose>
  );
}
```

### Props

- `size`: "sm" | "base" | "lg" | "xl" - Control the overall text size (default: "base")
- `preserveSpacing`: boolean - Controls whether whitespace is preserved (default: true)

The Prose component styles numerous HTML elements automatically:
- Headings (h1-h6) use your font-heading family with proper spacing
- Paragraphs use your font-body family with appropriate line height
- Lists (ul, ol) with proper indentation and bullet styling
- Code blocks with font-code family and syntax backgrounds
- Blockquotes with accent borders and proper spacing
- Links with appropriate styling and hover effects
- And many other elements according to best typography practices

## RichText Component

The `RichText` component safely renders HTML content from external sources, useful for CMS or API-provided content.

```tsx
import { RichText } from '@/components/common/Typography';

function CMSContent() {
  const htmlContent = `<h2>Title from CMS</h2>
                       <p>Content with <strong>formatting</strong> from CMS.</p>`;

  return (
    <RichText content={htmlContent} className="cms-content" />
  );
}
```

### Props

- `content`: string - HTML content to render
- `className`: string - Additional CSS classes

## Font System

The typography system is built on a configurable font system that allows easy font family switching throughout the application.

### FontSelector Component

The `FontSelector` component allows users to switch between different font systems.

```tsx
import { FontSelector } from '@/components/common/Typography';

function Settings() {
  return (
    <div className="settings-panel">
      <h2>Typography Settings</h2>
      <div>
        <label>Choose Font System:</label>
        <FontSelector variant="dropdown" showPreview />
      </div>
    </div>
  );
}
```

#### Props

- `variant`: "dropdown" | "buttons" | "compact" - Display style (default: "dropdown")
- `showPreview`: boolean - Whether to show font previews (default: false)
- `align`: "left" | "center" | "right" - Alignment of the selector (default: "left")
- `maxItems`: number - Maximum number of items to show in buttons variant (default: 4)
- `customTrigger`: React.ReactNode - Custom trigger element for dropdown

### FontDebugger Component

The `FontDebugger` component helps diagnose font loading and application issues.

```tsx
import { FontDebugger } from '@/components/common/Typography';

function DevTools() {
  return (
    <div className="dev-panel">
      <h2>Font Debugging</h2>
      <FontDebugger />
    </div>
  );
}
```

## Examples

### Basic Text Formatting

```tsx
import { Text } from '@/components/common/Typography';

function TextExample() {
  return (
    <div className="space-y-4">
      <Text size="xl" weight="bold">
        Welcome to our platform
      </Text>

      <Text variant="secondary" size="lg">
        We provide solutions for all your needs
      </Text>

      <Text>
        This is a regular paragraph with <Text as="span" weight="bold">bold text</Text> inline
        and <Text as="span" variant="accent">accent text</Text> for emphasis.
      </Text>
    </div>
  );
}
```

### Article Layout

```tsx
import { H1, H2, Text, Prose } from '@/components/common/Typography';

function BlogPost() {
  return (
    <article className="max-w-3xl mx-auto">
      <H1>The Future of Web Development</H1>

      <Text variant="secondary" size="lg" className="mt-2">
        Published on January 15, 2023 • 5 min read
      </Text>

      <Text as="div" className="mt-6">
        <img src="/images/hero.jpg" alt="Cover image" className="w-full rounded-lg" />
      </Text>

      <Prose className="mt-8">
        <p>Web development is constantly evolving...</p>

        <h2>The Rise of Component Systems</h2>
        <p>Modern web applications rely heavily on reusable components...</p>

        <blockquote>
          <p>The best way to predict the future is to invent it.</p>
        </blockquote>

        <h2>Embracing Type Safety</h2>
        <p>TypeScript has become the standard for large applications...</p>

        <pre><code>const greeting: string = 'Hello, world!';</code></pre>

        <p>In conclusion, the web development landscape continues to advance...</p>
      </Prose>
    </article>
  );
}
```

### Forms and Labels

```tsx
import { Text, H3 } from '@/components/common/Typography';

function ContactForm() {
  return (
    <form className="space-y-4">
      <H3>Contact Us</H3>

      <div className="form-group">
        <Text as="label" htmlFor="name" weight="medium">
          Your Name
        </Text>
        <input type="text" id="name" className="form-input" />
      </div>

      <div className="form-group">
        <Text as="label" htmlFor="email" weight="medium">
          Email Address
        </Text>
        <input type="email" id="email" className="form-input" />
        <Text variant="tertiary" size="sm">
          We'll never share your email with anyone else.
        </Text>
      </div>

      <div className="form-group">
        <Text as="label" htmlFor="message" weight="medium">
          Message
        </Text>
        <textarea id="message" className="form-textarea" rows={4}></textarea>
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}
```

### Font System Selection

```tsx
import { FontSelector, Text, H2, Prose } from '@/components/common/Typography';

function Typography() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <H2>Typography Settings</H2>
        <FontSelector variant="dropdown" showPreview />
      </div>

      <div className="p-4 bg-bg-secondary rounded-lg">
        <H2>Preview Text</H2>
        <Text size="lg" className="mt-2">
          This text changes based on the selected font system
        </Text>
        <Prose className="mt-4">
          <p>You can see how different elements like <strong>bold text</strong>, <em>italic text</em>,
            and <code>code snippets</code> look with this font system.</p>
        </Prose>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <Text size="sm" variant="secondary">Heading Font</Text>
          <H2 className="mt-1">Aa Bb Cc</H2>
        </div>
        <div className="p-4 border rounded-lg">
          <Text size="sm" variant="secondary">Body Font</Text>
          <Text className="text-xl mt-1">Aa Bb Cc</Text>
        </div>
        <div className="p-4 border rounded-lg">
          <Text size="sm" variant="secondary">Code Font</Text>
          <Text family="code" className="text-xl mt-1">Aa Bb Cc</Text>
        </div>
      </div>
    </div>
  );
}
```

## Best Practices

1. **Use Semantic Components**: Choose the right component for the job. Use `H1`-`H6` for headings in the correct hierarchy, and `Text` for paragraphs and smaller text elements.

2. **Consistent Variants**: Establish consistent use of variants across the application:
   - `default` for primary content
   - `secondary` for supporting text
   - `tertiary` or `muted` for less important information
   - `accent` for highlighting important elements
   - Status variants (`success`, `error`, etc.) for feedback

3. **Responsive Typography**: For important text, consider adjusting sizes responsively:
   ```tsx
   <Text className="text-sm md:text-base lg:text-lg">
     Responsive text example
   </Text>
   ```

4. **Long-form Content**: For articles, blog posts, or other long-form content, always use the `Prose` component to ensure proper styling of all elements.

5. **Font Family Consistency**: Use the font families consistently:
   - `family="heading"` for important titles and headers
   - `family="body"` (default) for most text content
   - `family="code"` only for code snippets and technical content

6. **Typography Scales**: Try to stick to the predefined size scales rather than using custom sizes to maintain consistency:
   ```tsx
   // Good - uses the system scale
   <Text size="lg">Larger text</Text>

   // Avoid - breaks the system scale
   <Text className="text-[17px]">Custom sized text</Text>
   ```

7. **Text Truncation**: Use the `truncate` prop for text that might overflow:
   ```tsx
   <Text truncate className="max-w-xs">
     This is very long text that will be truncated with ellipsis
   </Text>
   ```

8. **Accessibility Considerations**:
   - Maintain sufficient color contrast for all text variants
   - Use font sizes of at least 16px (base) for body text
   - Don't rely solely on color to convey meaning
   - Keep line lengths reasonable (around 60-80 characters)

9. **Performance**: When rendering lists with many text items, consider memoizing components to prevent unnecessary re-renders.

10. **Font Loading Strategy**: Be mindful of font loading and potential layout shifts:
    - Consider using the FontDebugger during development
    - Use `font-display: swap` for better loading experience
    - Consider preloading critical fonts

11. **Line Height and Spacing**: Adjust line height based on text size and purpose:
    - Headings often need tighter line heights (`leading="tight"`)
    - Body text usually needs normal to relaxed line heights (`leading="relaxed"`)
    - Long paragraphs benefit from more spacing (`leading="loose"`)

12. **Preserve System Design**: Avoid overriding the typography system with inline styles or direct Tailwind classes unless absolutely necessary.
