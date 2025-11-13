import { Injectable } from "@nestjs/common";
import { ReportService } from "../services/report.service";

@Injectable()
export class FindSubscribersReportsUseCase {
  constructor(
    private readonly reportService: ReportService
  ) {}

  async execute(subscriberId: string) {
    return this.reportService.findAllBySubscriber(subscriberId);
  }
}