"use client";

import dynamic from 'next/dynamic';

// Dynamically import the FontSystemTester with no SSR
const FontSystemTester = dynamic(
  () => import('@/components/common/Typography/FontSystemTester'),
  { ssr: false }
);

export default function FontSystemDebugger() {
  return (
    <div className="container mx-auto my-8 px-4">
      <h2 className="text-xl font-bold mb-4">Font System Debug</h2>
      <FontSystemTester />
    </div>
  );
}
