import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { SsrRenderer } from './server/ssr.renderer';
import { FindSubscribersReportsUseCase } from '@report/application/usecases/find-subscribers-reports.usecase';

@Controller()
export class SsrController {
  constructor(
    private readonly renderer: SsrRenderer,
    private readonly getReports: FindSubscribersReportsUseCase,
  ) {}

  @Get('/admin/report')
  async marketPage(@Query("subscriberId") subscriberId: string, @Res() res: Response) {
    const reports = await this.getReports.execute(subscriberId);

    const html = this.renderer.render({
      title: `Market: ${subscriberId}`,
      reports,
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}