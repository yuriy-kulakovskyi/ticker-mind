import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from '../pages/App';
import { ReportEntity } from '@report/domain/entities/report.entity';

declare global {
  interface Window {
    __SSR_DATA__: {
      reports: ReportEntity[];
    };
  }
}

hydrateRoot(
  document.getElementById('root')!,
  <App {...window.__SSR_DATA__} />
);