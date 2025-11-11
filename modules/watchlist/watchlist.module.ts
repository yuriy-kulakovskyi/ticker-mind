import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { WatchlistController } from "./controllers/watchlist.controller";
import { WatchlistService } from "./application/services/watchlist.service";
import { WatchList } from "./domain/entities/watchlist.entity";
import { PrismaWatchlistRepository } from "./infrastructure/repositories/prisma-watchlist.repository";
import { PrismaModule } from "prisma/prisma.module";
import { CreateWatchlistUseCase } from "./application/usecases/create-watchlist.usecase";
import { GetWatchlistsUseCase } from "./application/usecases/get-watchlists.usecase";
import { GetWatchlistByIdUseCase } from "./application/usecases/get-watchlist-by-id.usecase";
import { UpdateWatchlistUseCase } from "./application/usecases/update-watchlist.usecase";
import { AddTickerUseCase } from "./application/usecases/add-ticker.usecase";
import { RemoveTickerUseCase } from "./application/usecases/remove-ticker.usecase";
import { DeleteWatchlistUseCase } from "./application/usecases/delete-watchlist.usecase";

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [WatchlistController],
  providers: [
    WatchlistService,
    WatchList,
    {
      provide: 'WatchListRepository',
      useClass: PrismaWatchlistRepository,
    },

    CreateWatchlistUseCase,
    GetWatchlistsUseCase,
    GetWatchlistByIdUseCase,
    UpdateWatchlistUseCase,
    AddTickerUseCase,
    RemoveTickerUseCase,
    DeleteWatchlistUseCase
  ],
})

export class WatchlistModule {}