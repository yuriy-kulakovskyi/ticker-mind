import { Controller, Get, Res, Req, UseGuards, Request, Query } from '@nestjs/common';
import { Response } from 'express';
import { SsrAuthGuard } from '@presentation/guards/ssr-auth.guard';
import { IUserResponse } from '@shared/interfaces/user.interface';
import { SsrService } from './ssr.service';

@Controller()
export class SsrController {
  constructor(
    private readonly ssrService: SsrService
  ) {}

  @Get('/admin/auth')
  async authRedirect(@Query('token') token: string, @Res() res: Response) {
    return this.ssrService.authRedirect(token, res);
  }

  @Get('/admin/reports')
  @UseGuards(SsrAuthGuard)
  async reportsPage(@Request() req: IUserResponse, @Res() res: Response) {
    return this.ssrService.reportsPage(req, res);
  }
}