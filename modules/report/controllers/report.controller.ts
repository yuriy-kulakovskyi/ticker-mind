import { Controller, Get, UseGuards, Request, Query, Post, Body, Patch, Delete, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { AuthGuard } from "@presentation/guards/auth.guard";
import { CreateReportUseCase } from "@report/application/usecases/create-report.usecase";
import { DeleteReportUseCase } from "@report/application/usecases/delete-report.usecase";
import { FindReportUseCase } from "@report/application/usecases/find-report.usecase";
import { FindSubscribersReportsUseCase } from "@report/application/usecases/find-subscribers-reports.usecase";
import { UpdateReportUseCase } from "@report/application/usecases/update-report.usecase";
import { CreateReportDTO } from "@shared/dto/report/create-report.dto";
import { IUserResponse } from "@shared/interfaces/user.interface";

@Controller("report")
@UseGuards(AuthGuard)
export class ReportController {
  constructor(
    private readonly findReportUseCase: FindReportUseCase,
    private readonly findSubscribersReportsUseCase: FindSubscribersReportsUseCase,
    private readonly deleteReportUseCase: DeleteReportUseCase,
    private readonly createReportUseCase: CreateReportUseCase,
    private readonly updateReportUseCase: UpdateReportUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() req: IUserResponse) {
    return this.findSubscribersReportsUseCase.execute(req.user.user_id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Request() req: IUserResponse, @Param('id') id: string) {
    return this.findReportUseCase.execute(id, req.user.user_id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: IUserResponse, @Body() createReportDto: CreateReportDTO) {
    return this.createReportUseCase.execute({ 
      subscriberId: req.user.user_id,
      title: createReportDto.title,
      tickers: createReportDto.tickers,
      watchlistId: createReportDto.watchlistId
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Request() req: IUserResponse, @Param('id') id: string, @Body() updateReportDto: CreateReportDTO) {
    return this.updateReportUseCase.execute(id, req.user.user_id, {
      title: updateReportDto.title,
      tickers: updateReportDto.tickers,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req: IUserResponse, @Param('id') id: string) {
    return this.deleteReportUseCase.execute(id, req.user.user_id);
  }
}