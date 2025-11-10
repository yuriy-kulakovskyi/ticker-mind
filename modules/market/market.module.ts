import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { MarketController } from "./controllers/market.controller";
import { MarketService } from "./application/services/market.service";
import { AlphaVantageApiClient } from "./infrastructure/api-client.repository";
import { MarketPrismaRepository } from "./infrastructure/market-prisma.repository";
import { SyncMarketDataUseCase } from "./application/usecases/sync-market-data.usecase";
import { GetMarketDataUseCase } from "./application/usecases/get-market-data.usecase";
import { PrismaService } from "prisma/prisma.service";


@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [MarketController],
  providers: [
    SyncMarketDataUseCase,
    GetMarketDataUseCase,
    
    MarketService,
    
    // Infrastructure - Dependency Inversion with interface tokens
    {
      provide: 'IMarketDataProvider',
      useClass: AlphaVantageApiClient,
    },
    {
      provide: 'IMarketStorage',
      useClass: MarketPrismaRepository,
    },
    
    AlphaVantageApiClient,
    MarketPrismaRepository,
    
    PrismaService,
  ],
  exports: [MarketService], 
})
export class MarketModule {}