import React from 'react';
import { formatInlineStyles } from "./format-inline-styles.util";
import { parseTable } from "./parse-table.util";

export function formatSummary(summary: string): React.ReactElement[] {
  const lines = summary.split('\n');
  const elements: React.ReactElement[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    
    if (!trimmed) {
      // Empty line - add spacing
      elements.push(<br key={`br-${key++}`} />);
      i++;
      continue;
    }

    // Check for table
    if (trimmed.includes('|')) {
      const tableResult = parseTable(lines, i);
      if (tableResult) {
        elements.push(tableResult.element);
        i = tableResult.nextIndex;
        continue;
      }
    }

    // Main heading (starts with ** and ends with **)
    if (trimmed.match(/^\*\*[^*]+\*\*\s*$/)) {
      const text = trimmed.replace(/\*\*/g, '');
      elements.push(
        <h3 key={`h3-${key++}`} style={{ 
          color: '#2563eb', 
          marginTop: '1.5rem', 
          marginBottom: '0.75rem',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          {text}
        </h3>
      );
      i++;
      continue;
    }

    // Subheadings (starts with * and ends with *, but not **)
    if (trimmed.match(/^\*(?!\*).+(?<!\*)\*\s*$/) && !trimmed.match(/^\*\*.+\*\*\s*$/)) {
      const text = trimmed.replace(/^\*|\*$/g, '');
      elements.push(
        <h4 key={`h4-${key++}`} style={{ 
          marginTop: '1.25rem', 
          marginBottom: '0.5rem',
          fontSize: '1.125rem',
          fontWeight: '500'
        }}>
          {formatInlineStyles(text)}
        </h4>
      );
      i++;
      continue;
    }

    // Bullet points (starts with -)
    if (trimmed.startsWith('-')) {
      const content = trimmed.substring(1).trim();
      const formattedContent = formatInlineStyles(content);
      elements.push(
        <li key={`li-${key++}`} style={{ 
          marginLeft: '1.5rem', 
          marginBottom: '0.5rem',
          lineHeight: '1.6'
        }}>
          {formattedContent}
        </li>
      );
      i++;
      continue;
    }

    // Regular paragraph
    const formattedContent = formatInlineStyles(trimmed);
    elements.push(
      <p key={`p-${key++}`} style={{ 
        marginBottom: '0.75rem',
        lineHeight: '1.6',
        color: '#374151'
      }}>
        {formattedContent}
      </p>
    );
    i++;
  }

  return elements;
}