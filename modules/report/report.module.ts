import { Module } from "@nestjs/common";
import { ReportController } from "./controllers/report.controller";
import { ReportService } from "./application/services/report.service";

@Module({
  controllers: [ReportController],
  providers: [ReportService]
})

export class ReportModule {}