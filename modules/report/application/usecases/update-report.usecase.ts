import { Injectable } from "@nestjs/common";
import { ReportService } from "@report/application/services/report.service";
import { IUpdateReport } from "@report/domain/interfaces/update-report.interface";

@Injectable()
export class UpdateReportUseCase {
  constructor(
    private readonly reportService: ReportService
  ) {}

  async execute(id: string, subscriberId: string, data: IUpdateReport) {
    return this.reportService.update(id, subscriberId, data);
  }
}