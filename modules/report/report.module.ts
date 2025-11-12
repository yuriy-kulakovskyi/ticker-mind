import { Module } from "@nestjs/common";
import { ReportController } from "@report/controllers/report.controller";
import { ReportService } from "@report/application/services/report.service";

@Module({
  controllers: [ReportController],
  providers: [ReportService]
})

export class ReportModule {}