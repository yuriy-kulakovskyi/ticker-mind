import React from 'react';

export function formatInlineStyles(text: string): (string | React.ReactElement)[] {
  // First, process paired asterisks
  const parts: (string | React.ReactElement)[] = [];
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the styled part (removing stray asterisks)
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index).replace(/\*/g, '');
      if (textBefore) parts.push(textBefore);
    }
    
    if (match[1]) {
      // Double asterisk - bold text
      parts.push(
        <strong key={`bold-${key++}`} style={{ fontWeight: '600', color: '#1f2937' }}>
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Single asterisk - just the text without asterisks
      parts.push(match[4]);
    }
    
    lastIndex = regex.lastIndex;
  }

  // Add remaining text (removing stray asterisks)
  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex).replace(/\*/g, '');
    if (remaining) parts.push(remaining);
  }

  // If no matches were found, clean up any stray asterisks from original text
  return parts.length > 0 ? parts : [text.replace(/\*/g, '')];
}