import { Injectable } from '@nestjs/common';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { App } from '../pages/App';
import { ReportEntity } from '@report/domain/entities/report.entity';

@Injectable()
export class SsrRenderer {
  render(props: { reports: ReportEntity[] }) {
    const html = renderToString(<App reports={props.reports} />);
    const safeData = JSON.stringify(props)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027');

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'">
          <meta name="description" content="View your market intelligence reports">
          <meta property="og:title" content="Market Intelligence Reports">
          <link rel="icon" href="/favicon.ico">
          <title>Market Intelligence Reports</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              background-color: #f9fafb;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>window.__SSR_DATA__ = ${safeData}</script>
        </body>
      </html>
    `;
  }
}