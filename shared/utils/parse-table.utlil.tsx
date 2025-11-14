import React from 'react';
import { formatInlineStyles } from './format-inline-styles.util';

export function parseTable(lines: string[], startIndex: number): { element: React.ReactElement; nextIndex: number } | null {
  if (!lines[startIndex]?.includes('|')) return null;
  
  const tableLines: string[] = [];
  let i = startIndex;
  
  // Collect all table lines
  while (i < lines.length && lines[i].includes('|')) {
    tableLines.push(lines[i]);
    i++;
  }
  
  if (tableLines.length < 2) return null;
  
  // Parse header
  const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
  
  // Parse rows (skip the separator line at index 1)
  const rows = tableLines.slice(2).map(row => 
    row.split('|').map(cell => cell.trim()).filter(cell => cell)
  );
  
  const tableElement = (
    <div key={`table-${startIndex}`} style={{ overflowX: 'auto', marginTop: '1rem', marginBottom: '1.5rem' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.875rem',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            {headers.map((header, idx) => (
              <th key={idx} style={{
                padding: '0.75rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#111827',
                borderBottom: '2px solid #d1d5db'
              }}>
                {formatInlineStyles(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} style={{
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f9fafb'
            }}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} style={{
                  padding: '0.75rem',
                  color: '#374151'
                }}>
                  {formatInlineStyles(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  return { element: tableElement, nextIndex: i };
}