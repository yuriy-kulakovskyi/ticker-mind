import { Injectable } from "@nestjs/common";
import { ReportService } from "../services/report.service";
import { ICreateReport } from "@report/domain/interfaces/create-report.interface";

@Injectable()
export class CreateReportUseCase {
  constructor(
    private readonly reportService: ReportService
  ) {}

  async execute(data: ICreateReport) {
    return this.reportService.create(data)
  }
}