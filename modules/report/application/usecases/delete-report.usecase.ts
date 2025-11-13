import { Injectable } from "@nestjs/common";
import { ReportService } from "../services/report.service";

@Injectable()
export class DeleteReportUseCase {
  constructor(
    private readonly reportService: ReportService
  ) {}

  async execute(id: string, subscriberId: string) {
    return this.reportService.delete(id, subscriberId);
  }
}
