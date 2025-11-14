import { Module } from '@nestjs/common';
import { SsrController } from './ssr.controller';
import { SsrRenderer } from './server/ssr.renderer';
import { AlphaVantageApiClient } from '@market/infrastructure/api-client.repository';
import { PrismaMarketRepository } from '@market/infrastructure/prisma-market.repository';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FindSubscribersReportsUseCase } from '@report/application/usecases/find-subscribers-reports.usecase';
import { ReportService } from '@report/application/services/report.service';
import { PrismaReportRepository } from '@report/infrastructure/repositories/prisma-report.repository';
import { PrismaWatchlistRepository } from '@watchlist/infrastructure/repositories/prisma-watchlist.repository';
import { MarketService } from '@market/application/services/market.service';
import { OpenAIService } from '@shared/openai/open-ai.service';

@Module({
  imports: [HttpModule],
  controllers: [SsrController],
  providers: [
    SsrRenderer, 
    FindSubscribersReportsUseCase, 
    ReportService,
    PrismaService,
    ConfigService,
    PrismaReportRepository,
    PrismaWatchlistRepository,
    MarketService,
    OpenAIService,
    {
      provide: 'IMarketDataProvider',
      useClass: AlphaVantageApiClient,
    },
    {
      provide: 'IMarketStorage',
      useClass: PrismaMarketRepository,
    }
  ],
})
export class SsrModule {}