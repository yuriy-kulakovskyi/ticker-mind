import { Injectable } from '@nestjs/common';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { App } from '../pages/App';
import { ReportEntity } from '@report/domain/entities/report.entity';

@Injectable()
export class SsrRenderer {
  render(props: { title?: string, reports: ReportEntity[];  }) {
    const html = renderToString(<App reports={props.reports} />);
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${props.title ?? 'Market Intelligence Reports'}</title>
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
          <script>window.__SSR_DATA__ = ${JSON.stringify(props)}</script>
        </body>
      </html>
    `;
  }
}