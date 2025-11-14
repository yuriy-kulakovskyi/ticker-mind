import React from 'react';
import { formatSummary } from '@shared/utils/format-summary.util';
import { ReportEntity } from '@report/domain/entities/report.entity';

export function App({ reports }: { reports: ReportEntity[] }) {
  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f9fafb'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        marginBottom: '2rem',
        color: '#111827',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        My Reports 📈
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {reports.map((item) => (
          <article 
            key={item.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb'
            }}
          >
            <header style={{ marginBottom: '1rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                {item.title}
              </h2>
              
              {item.tickers && item.tickers.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {item.tickers.map((ticker: string, key: number) => (
                    <span 
                      key={key}
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {ticker}
                    </span>
                  ))}
                </div>
              )}
              
              <time style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                display: 'block'
              }}>
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </header>

            <div style={{ 
              fontSize: '1rem',
              color: '#374151',
              lineHeight: '1.75'
            }}>
              {formatSummary(item.summary)}
            </div>
          </article>
        ))}
      </div>

      {reports.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          <p style={{ fontSize: '1.125rem' }}>No reports available</p>
        </div>
      )}
    </div>
  );
}