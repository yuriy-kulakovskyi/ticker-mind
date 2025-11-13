import { Injectable } from "@nestjs/common";
import { ReportService } from "@report/application/services/report.service";

@Injectable()
export class FindSubscribersReportsUseCase {
  constructor(
    private readonly reportService: ReportService
  ) {}

  async execute(subscriberId: string) {
    return this.reportService.findAllBySubscriber(subscriberId);
  }
}