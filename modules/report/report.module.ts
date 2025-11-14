import { Module } from "@nestjs/common";
import { ReportController } from "@report/controllers/report.controller";
import { ReportService } from "@report/application/services/report.service";
import { FindReportUseCase } from "./application/usecases/find-report.usecase";
import { CreateReportUseCase } from "./application/usecases/create-report.usecase";
import { UpdateReportUseCase } from "./application/usecases/update-report.usecase";
import { DeleteReportUseCase } from "./application/usecases/delete-report.usecase";
import { FindSubscribersReportsUseCase } from "./application/usecases/find-subscribers-reports.usecase";
import { PrismaReportRepository } from "./infrastructure/repositories/prisma-report.repository";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "@prisma/prisma.module";
import { PrismaService } from "@prisma/prisma.service";
import { OpenAIService } from "@shared/openai/open-ai.service";
import { WatchlistModule } from "@watchlist/watchlist.module";
import { MarketModule } from "@market/market.module";
import { SubscriberModule } from "@subscriber/subscriber.module";

@Module({
  imports: [HttpModule, PrismaModule, WatchlistModule, MarketModule, SubscriberModule],
  controllers: [ReportController],
  providers: [
    ReportService,
    FindReportUseCase,
    CreateReportUseCase,
    UpdateReportUseCase,
    DeleteReportUseCase,
    FindSubscribersReportsUseCase,
    PrismaReportRepository,
    PrismaService,
    OpenAIService,
  ],
  exports: [FindSubscribersReportsUseCase]
})

export class ReportModule {}