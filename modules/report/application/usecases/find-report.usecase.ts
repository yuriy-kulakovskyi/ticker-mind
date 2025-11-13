import { Injectable } from "@nestjs/common";
import { ReportService } from "@report/application/services/report.service";

@Injectable()
export class FindReportUseCase {
  constructor(
    private readonly reportService: ReportService
  ) {}

  async execute(id: string, subscriberId: string) {
    return this.reportService.findById(id, subscriberId);
  }
}