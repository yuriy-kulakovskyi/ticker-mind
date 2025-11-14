import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { FindSubscribersReportsUseCase } from "@report/application/usecases/find-subscribers-reports.usecase";
import { IUserResponse } from "@shared/interfaces/user.interface";
import { Response } from "express";
import { SsrRenderer } from "./server/ssr.renderer";

@Injectable()
export class SsrService {
  constructor(
    private readonly getReports: FindSubscribersReportsUseCase,
    private readonly renderer: SsrRenderer
  ) {}

  async authRedirect(token: string, res: Response) {
    if (!token) {
      return res.status(400).send('Token is required');
    }

    // Set the token in an HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Ensure cookie is available for all paths
    });

    return res.redirect('/admin/reports');
  }

  async reportsPage(req: IUserResponse, res: Response) {
    try {
      const subscriberId = req.user.user_id;

      const reports = await this.getReports.execute(subscriberId);

      const html = this.renderer.render({
        reports,
      });

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('No reports found for this subscriber');
      } else {
        throw new BadRequestException('Failed to load reports page');
      }
    }
  }
}