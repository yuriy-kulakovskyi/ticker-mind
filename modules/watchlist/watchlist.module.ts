import { Module } from "@nestjs/common";
import { WatchlistController } from "./controllers/watchlist.controller";
import { WatchlistService } from "./application/services/watchlist.service";

@Module({
  controllers: [WatchlistController],
  providers: [WatchlistService],
})

export class WatchlistModule {}