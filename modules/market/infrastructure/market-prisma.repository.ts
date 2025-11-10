import { PrismaService } from "prisma/prisma.service";
import { Market } from "../domain/entities/market.entity";
import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { MarketCandle } from "../domain/entities/market-candle.entity";
import { IMarketStorage } from "../domain/interfaces/market-storage.interface";


@Injectable()
export class MarketPrismaRepository implements IMarketStorage {
  private readonly logger = new Logger(MarketPrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async saveMarketData(market: Market, ticker: string): Promise<void> {
    try {
      const existingMarket = await this.prisma.market.findUnique({
        where: { symbol: ticker },
        include: { candles: true },
      });

      if (existingMarket) {
        await this.updateExistingMarket(existingMarket, market);
      } else {
        await this.createNewMarket(market);
      }

      this.logger.log(`Successfully saved market data for ticker: ${ticker}`);
    } catch (error) {
      this.logger.error(
        `Failed to save market data for ticker: ${ticker}`,
        error.stack
      );
      throw error;
    }
  }

  async extractMarketDataBySymbol(symbol: string): Promise<Market> {
    this.logger.log(`Extracting market data for symbol: ${symbol}`);
    
    const market = await this.prisma.market.findUnique({
      where: { symbol },
      include: { candles: {
        orderBy: { date: 'desc' }
      } },
    });

    if (!market) {
      this.logger.warn(`Market data not found for symbol: ${symbol}`);
      throw new NotFoundException(`Market data for symbol '${symbol}' not found`);
    }

    const weeklyData: MarketCandle[] = market.candles.map(candle =>
      new MarketCandle(
        candle.date,
        candle.open,
        candle.high,
        candle.low,
        candle.close,
        candle.volume
      )
    );

    return new Market(
      market.symbol,
      market.lastRefreshed,
      market.timeZone,
      market.info,
      weeklyData
    );
  }

  private async updateExistingMarket(
    existingMarket: { candles: { date: Date }[] },
    market: Market
  ): Promise<void> {
    const hasNewData = this.hasNewDataAvailable(existingMarket, market);

    if (!hasNewData) {
      this.logger.log(`No new data available for ${market.symbol}`);
      return;
    }

    const latestExistingDate = existingMarket.candles.length > 0
      ? new Date(Math.max(...existingMarket.candles.map(c => new Date(c.date).getTime())))
      : null;

    const newCandles = latestExistingDate
      ? market.weeklyData.filter(c => c.date.getTime() > latestExistingDate.getTime())
      : market.weeklyData;

    await this.prisma.market.update({
      where: { symbol: market.symbol },
      data: {
        lastRefreshed: market.lastRefreshed,
        timeZone: market.timeZone,
        info: market.info,
        candles: {
          create: newCandles.map(c => ({
            date: c.date,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: c.volume,
          })),
        },
      },
    });
  }

  private async createNewMarket(market: Market): Promise<void> {
    await this.prisma.market.create({
      data: {
        symbol: market.symbol,
        lastRefreshed: market.lastRefreshed,
        timeZone: market.timeZone,
        info: market.info,
        candles: {
          create: market.weeklyData.slice(0, 20).map(c => ({
            date: c.date,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: c.volume,
          })),
        },
      },
    });
  }

  private hasNewDataAvailable(
    existingMarket: { candles: { date: Date }[] },
    newMarket: Market
  ): boolean {
    if (existingMarket.candles.length === 0) {
      return true; 
    }

    const latestExistingDate = new Date(
      Math.max(...existingMarket.candles.map(c => new Date(c.date).getTime()))
    );

    const latestNewDate = new Date(
      Math.max(...newMarket.weeklyData.map(c => c.date.getTime()))
    );

    return latestNewDate.getTime() > latestExistingDate.getTime();
  }
}