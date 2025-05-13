// src/utils/textUtils.ts

/**
 * Ensures proper word spacing in text by normalizing whitespace
 * @param text The text to normalize
 * @returns Normalized text with proper spacing
 */
export const ensureProperSpacing = (text: string): string => {
  if (!text) return '';

  // Replace multiple spaces with a single space
  let normalizedText = text.replace(/\s+/g, ' ');

  // Ensure there's a space after punctuation if followed by a letter
  normalizedText = normalizedText.replace(/([.,;:!?])([A-Za-z])/g, '$1 $2');

  // Trim any leading/trailing whitespace
  return normalizedText.trim();
};

/**
 * Process quote text to ensure proper word spacing when breaking into segments
 * @param quote The quote text to process
 * @param segmentCount Number of segments to split into (default: 3)
 * @returns Array of segments with proper spacing
 */
export const processQuoteIntoSegments = (quote: string, segmentCount: number = 3): string[] => {
  if (!quote) return [];

  // Normalize spacing in the quote
  const normalizedQuote = ensureProperSpacing(quote);

  // Split by words to preserve spaces
  const words = normalizedQuote.split(' ');

  // Calculate words per segment
  const wordsPerSegment = Math.ceil(words.length / segmentCount);

  // Create segments
  const segments: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerSegment) {
    segments.push(words.slice(i, i + wordsPerSegment).join(' '));
  }

  return segments;
};