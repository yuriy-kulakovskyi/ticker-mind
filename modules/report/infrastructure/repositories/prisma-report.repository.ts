import { Market } from "@market/domain/entities/market.entity";
import { MarketService } from "@market/application/services/market.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { ReportEntity } from "@report/domain/entities/report.entity";
import { ICreateReport } from "@report/domain/interfaces/create-report.interface";
import { PrismaWatchlistRepository } from "@watchlist/infrastructure/repositories/prisma-watchlist.repository";
import { isArray } from "class-validator";
import { OpenAIService } from "@shared/openai/open-ai.service";
import { IUpdateReport } from "@report/domain/interfaces/update-report.interface";

@Injectable()
export class PrismaReportRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly watchlistRepository: PrismaWatchlistRepository,
    private readonly marketService: MarketService,
    private readonly openAIService: OpenAIService,
  ) {}

  async create(data: ICreateReport): Promise<ReportEntity> {
    let summary: string;

    if (data.watchlistId) {
      const watchlist = await this.watchlistRepository.findById(data.watchlistId, data.subscriberId);

      if (!watchlist) {
        throw new BadRequestException('Invalid watchlistId provided.');
      }

      if (!watchlist.items || !isArray(watchlist.items) || watchlist.items.length === 0) {
        throw new BadRequestException('Watchlist has no items.');
      }

      const tickers = watchlist.items.filter(item => !item.isDeleted).map(item => item.ticker);

      const marketDataPromises = tickers.map(ticker => 
        this.marketService.extractMarketDataBySymbol(ticker)
      );
      const marketDataArray = await Promise.all(marketDataPromises);

      const marketReportPrompt = this.generateMarketReportPrompt(marketDataArray);

      try {
        summary = await this.openAIService.generateSummary(marketReportPrompt);
      } catch (error) {
        console.log(error);
        
        throw new BadRequestException('Error generating report summary.');
      }

      return this.prismaService.report.create({
        data: {
          title: data.title,
          summary: summary,
          tickers: tickers,
          subscriberId: data.subscriberId,
          isDeleted: false,
        },
      });
    }

    const tickers = data.tickers || [];
    const marketDataPromises = tickers.map(ticker => 
      this.marketService.extractMarketDataBySymbol(ticker)
    );
    const marketDataArray = await Promise.all(marketDataPromises);

    const marketReportPrompt = this.generateMarketReportPrompt(marketDataArray);
    
    try {
      summary = await this.openAIService.generateSummary(marketReportPrompt);
    } catch (error) {
      throw new BadRequestException('Error generating report summary.');
    }
    
    return this.prismaService.report.create({
      data: {
        title: data.title,
        summary: summary,
        tickers: data.tickers,
        subscriberId: data.subscriberId,
        isDeleted: false,
      },
    });
  }

  async findAllBySubscriber(subscriberId: string): Promise<ReportEntity[]> {
    const reports = await this.prismaService.report.findMany({
      where: { 
        subscriberId,
        isDeleted: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return reports.map(report => new ReportEntity(
      report.id,
      report.title,
      report.summary,
      report.tickers,
      report.isDeleted,
      report.subscriberId,
      report.createdAt,
    ));
  }

  async findById(id: string, subscriberId: string): Promise<ReportEntity | null> {
    const report = await this.prismaService.report.findFirst({
      where: { id },
    });

    if (!report) {
      return null;
    }

    // Check if the report belongs to the subscriber
    if (report.subscriberId !== subscriberId) {
      throw new BadRequestException('You do not have permission to access this report.');
    }

    return new ReportEntity(
      report.id,
      report.title,
      report.summary,
      report.tickers,
      report.isDeleted,
      report.subscriberId,
      report.createdAt,
    );
  }

  async delete(id: string, subscriberId: string): Promise<string> {
    // First, check if the report exists and belongs to the subscriber
    const report = await this.prismaService.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new BadRequestException('Report not found.');
    }

    if (report.subscriberId !== subscriberId) {
      throw new BadRequestException('You do not have permission to delete this report.');
    }

    await this.prismaService.report.update({
      where: { id },
      data: { isDeleted: true },
    });

    return `Report with id ${id} has been deleted.`;
  }

  async update(id: string, subscriberId: string, data: IUpdateReport): Promise<ReportEntity> {
    // First, check if the report exists and belongs to the subscriber
    const existingReport = await this.prismaService.report.findFirst({
      where: { id, subscriberId, isDeleted: false},
    });

    if (!existingReport) {
      throw new BadRequestException('Report not found.');
    }

    if (existingReport.subscriberId !== subscriberId) {
      throw new BadRequestException('You do not have permission to update this report.');
    }

    if (existingReport.isDeleted) {
      throw new BadRequestException('Cannot update a deleted report.');
    }

    const updatedReport = await this.prismaService.report.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return new ReportEntity(
      updatedReport.id,
      updatedReport.title,
      updatedReport.summary,
      updatedReport.tickers,
      updatedReport.isDeleted,
      updatedReport.subscriberId,
      updatedReport.createdAt,
    );
  }

  private generateMarketReportPrompt(marketDataArray: Market[]): string {
    if (marketDataArray.length === 0) {
      return 'No market data available for the selected tickers.';
    }

    const summaries = marketDataArray.map(marketData => {
      const last5 = marketData.weeklyData.slice(-5);
      const recent = last5.map(c => 
        `📅 ${c.date.toISOString().split('T')[0]} — Open: ${c.open}, Close: ${c.close}, High: ${c.high}, Low: ${c.low}, Vol: ${c.volume}`
      ).join('\n');

      return `
        Symbol: ${marketData.symbol}
        Timezone: ${marketData.timeZone}
        Info: ${marketData.info}
        Recent candles:
        ${recent}
      `;
    });

    return `
      Generate a short, analytical summary for the following stocks:

      ${summaries.join('\n---\n')}
    `.trim();
  }
}