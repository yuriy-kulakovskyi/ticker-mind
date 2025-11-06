import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { WatchlistController } from "./controllers/watchlist.controller";
import { WatchlistService } from "./application/services/watchlist.service";
import { WatchList } from "./domain/entities/watchlist.entity";
import { PrismaWatchlistRepository } from "./infrastructure/repositories/prisma-watchlist.repository";
import { PrismaModule } from "prisma/prisma.module";
import { WatchlistUseCase } from "./application/usecases/watchlist.usecase";

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [WatchlistController],
  providers: [
    WatchlistService,
    WatchList,
    WatchlistUseCase,
    {
      provide: 'WatchListRepository',
      useClass: PrismaWatchlistRepository,
    },
  ],
})

export class WatchlistModule {}