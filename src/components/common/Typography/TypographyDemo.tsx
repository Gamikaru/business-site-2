"use client"; // Add this directive at the top of the file

import React from 'react';
import { FontSelector } from './index';
import { Text } from './Text';
import { H1, H2, H3, H4, H5, H6 } from './Heading';
import { Prose } from './Prose';
import FontDebugger from './FontDebugger';
import { useFontContext } from '@/context/FontContext';

// Rest of your component stays the same...

interface TypographyDemoProps {
  className?: string;
}

const TypographyDemo: React.FC<TypographyDemoProps> = ({ className = '' }) => {
  const { currentSystemData } = useFontContext();

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="mb-8 p-4 bg-bg-secondary rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Text size="lg" weight="semibold" className="mb-2">
              Current Font System: {currentSystemData?.name}
            </Text>
            <div className="text-sm text-text-secondary">
              <Text as="div">
                Heading: <span className="font-heading">{currentSystemData?.heading.family.split(',')[0]}</span>
              </Text>
              <Text as="div">
                Body: <span className="font-body">{currentSystemData?.body.family.split(',')[0]}</span>
              </Text>
              <Text as="div">
                Code: <span className="font-code">{currentSystemData?.code.family.split(',')[0]}</span>
              </Text>
            </div>
          </div>
          <FontSelector variant="dropdown" showPreview />
        </div>
      </div>

      {/* Add the Font Debugger */}
      <FontDebugger />

      <div className="space-y-8">
        <section className="space-y-2">
          <H2 className="border-b border-border pb-2">Heading Hierarchy</H2>
          <H1>Heading Level 1</H1>
          <H2>Heading Level 2</H2>
          <H3>Heading Level 3</H3>
          <H4>Heading Level 4</H4>
          <H5>Heading Level 5</H5>
          <H6>Heading Level 6</H6>
        </section>

        <section className="space-y-4">
          <H2 className="border-b border-border pb-2">Heading Variants</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <H3 variant="default">Default Heading</H3>
              <H3 variant="secondary">Secondary Heading</H3>
              <H3 variant="accent">Accent Heading</H3>
              <H3 variant="gradient">Gradient Heading</H3>
            </div>
            <div>
              <H3 weight="normal">Normal Weight</H3>
              <H3 weight="medium">Medium Weight</H3>
              <H3 weight="bold">Bold Weight</H3>
              <H3 weight="extrabold">Extrabold Weight</H3>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <H2 className="border-b border-border pb-2">Text Variants</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <H4>Text Colors</H4>
              <Text variant="default">Default Text</Text>
              <Text variant="secondary">Secondary Text</Text>
              <Text variant="tertiary">Tertiary Text</Text>
              <Text variant="muted">Muted Text</Text>
              <Text variant="accent">Accent Text</Text>
              <Text variant="success">Success Text</Text>
              <Text variant="warning">Warning Text</Text>
              <Text variant="error">Error Text</Text>
              <Text variant="info">Info Text</Text>
            </div>

            <div className="space-y-2">
              <H4>Text Sizes</H4>
              <Text size="xs">Extra Small Text (xs)</Text>
              <Text size="sm">Small Text (sm)</Text>
              <Text size="base">Base Text (base)</Text>
              <Text size="lg">Large Text (lg)</Text>
              <Text size="xl">Extra Large Text (xl)</Text>
              <Text size="2xl">2XL Text (2xl)</Text>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <H2 className="border-b border-border pb-2">Font Families</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-bg-secondary rounded-md">
              <H4 className="mb-2">Heading Font</H4>
              <div className="font-heading">
                <p className="mb-2">ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz</p>
                <p>1234567890!@#$%^&*()</p>
              </div>
            </div>

            <div className="p-4 bg-bg-secondary rounded-md">
              <H4 className="mb-2">Body Font</H4>
              <div className="font-body">
                <p className="mb-2">ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz</p>
                <p>1234567890!@#$%^&*()</p>
              </div>
            </div>

            <div className="p-4 bg-bg-secondary rounded-md">
              <H4 className="mb-2">Code Font</H4>
              <div className="font-code">
                <p className="mb-2">ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz</p>
                <p>1234567890!@#$%^&*()</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <H2 className="border-b border-border pb-2">Rich Text Example</H2>
          <Prose className="max-w-none">
            <h2>Rich Content With Prose</h2>
            <p>The following demonstrates how rich text content is styled automatically using the Prose component.</p>

            <h3>Lists</h3>
            <ul>
              <li>This is a basic unordered list</li>
              <li>With multiple items
                <ul>
                  <li>And nested items</li>
                  <li>That maintain proper styling</li>
                </ul>
              </li>
              <li>The spacing is handled automatically</li>
            </ul>

            <ol>
              <li>This is an ordered list</li>
              <li>With proper numbering</li>
              <li>And consistent styling</li>
            </ol>

            <h3>Text Formatting</h3>
            <p>
              Text can be <strong>bold</strong>, <em>italic</em>, or <strong><em>both</em></strong>.
              You can add <a href="#">links</a> that match your theme colors.
              There&apos;s also support for <code>inline code</code> and other elements.
            </p>

            <blockquote>
              <p>Blockquotes are styled with a border and proper spacing to make quotations stand out from regular text.</p>
            </blockquote>

            <h3>Code Blocks</h3>
            <pre><code>{`function typographyDemo() {
  return {
    fontSystem: "customizable",
    components: ["Text", "Heading", "Prose"],
    features: "Rich typography control"
  };
}`}</code></pre>

            <p>The entire system automatically adapts when you change the font system through the font selector.</p>
          </Prose>
        </section>
      </div>
    </div>
  );
};

export { TypographyDemo };