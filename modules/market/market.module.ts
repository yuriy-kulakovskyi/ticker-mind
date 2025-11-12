import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { MarketController } from "@market/controllers/market.controller";
import { MarketService } from "@market/application/services/market.service";
import { AlphaVantageApiClient } from "@market/infrastructure/api-client.repository";
import { PrismaMarketRepository } from "@market/infrastructure/prisma-market.repository";
import { SyncMarketDataUseCase } from "@market/application/usecases/sync-market-data.usecase";
import { GetMarketDataUseCase } from "@market/application/usecases/get-market-data.usecase";
import { PrismaService } from "@prisma/prisma.service";


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
      useClass: PrismaMarketRepository,
    },
    
    AlphaVantageApiClient,
    PrismaMarketRepository,
    
    PrismaService,
  ],
  exports: [MarketService], 
})
export class MarketModule {}