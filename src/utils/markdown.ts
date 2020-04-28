/**
 * Convert a markdown string to plain text.
 *
 * This code is based on the remove-markdown (https://github.com/stiang/remove-markdown)
 * package written by Stian Grytøyr.
 */
export const markdownToText = (md: string): string => {
  const output = md
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove horizontal rules
    .replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '')
    // Remove setext-style headers
    .replace(/^[=-]{2,}\s*$/g, '')
    // Remove footnotes?
    .replace(/\[\^.+?\](: .*?$)?/g, '')
    .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
    // Remove images
    .replace(/!\[(.*?)\][[(].*?[\])]/g, '')
    // Remove inline links
    .replace(/\[(.*?)\][[ (].*?[\])]/g, '$1')
    // Remove blockquotes
    .replace(/^\s{0,3}>\s?/g, '')
    // Remove reference-style links?
    .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
    // Remove atx-style headers
    .replace(
      /^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm,
      '$1$2$3',
    )
    // Remove emphasis (repeat the line to remove double emphasis)
    .replace(/([*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
    .replace(/([*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
    // Remove code blocks
    .replace(/(`{3,})(.*?)\1/gm, '$2')
    // Remove inline code
    .replace(/`(.+?)`/g, '$1')
    // Replace custom templates
    .replace(/\[(.*?)\]\]/g, '')
    // Replace two or more newlines with exactly two? Not entirely sure this belongs here...
    .replace(/\n{2,}/g, '\n\n');

  return output.trim();
};
