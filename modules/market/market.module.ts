import { Module } from "@nestjs/common";
import { MarketController } from "./controllers/market.controller";
import { MarketService } from "./application/services/market.service";
import { ApiClientService } from "./infrastructure/api-client.service";

@Module({
  controllers: [MarketController],
  providers: [MarketService, ApiClientService],
})

export class MarketModule {}