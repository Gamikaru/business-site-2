/**
 * Parses the about content string into discrete blocks for cards
 * @param content The raw content string with HTML tags and paragraph separators
 * @returns Array of content blocks for individual cards
 */
export function parseContentBlocks(content: string): string[] {
  // Split content by paragraph tags or by double newlines
  const paragraphs = content
    .split(/<p>|<\/p>/)
    .filter(p => p.trim())
    .map(p => p.trim());

  // For improved visual layout, we'll group paragraphs intelligently
  const blocks: string[] = [];

  // If we have 3 or fewer paragraphs, each gets its own card
  if (paragraphs.length <= 3) {
    return paragraphs.map(p => `<p>${p}</p>`); // Wrap each paragraph in <p> tags
  }

  // For more paragraphs, we'll group them to have 3 cards total
  const paragraphsPerCard = Math.ceil(paragraphs.length / 3);

  for (let i = 0; i < paragraphs.length; i += paragraphsPerCard) {
    const blockParagraphs = paragraphs.slice(i, i + paragraphsPerCard);
    blocks.push(blockParagraphs.map(p => `<p>${p}</p>`).join(''));
  }

  return blocks;
}
