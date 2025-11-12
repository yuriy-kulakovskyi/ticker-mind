import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { WatchlistController } from "@watchlist/controllers/watchlist.controller";
import { WatchlistService } from "@watchlist/application/services/watchlist.service";
import { PrismaWatchlistRepository } from "@watchlist/infrastructure/repositories/prisma-watchlist.repository";
import { PrismaModule } from "@prisma/prisma.module";
import { CreateWatchlistUseCase } from "@watchlist/application/usecases/create-watchlist.usecase";
import { GetWatchlistsUseCase } from "@watchlist/application/usecases/get-watchlists.usecase";
import { GetWatchlistByIdUseCase } from "@watchlist/application/usecases/get-watchlist-by-id.usecase";
import { UpdateWatchlistUseCase } from "@watchlist/application/usecases/update-watchlist.usecase";
import { AddTickerUseCase } from "@watchlist/application/usecases/add-ticker.usecase";
import { RemoveTickerUseCase } from "@watchlist/application/usecases/remove-ticker.usecase";
import { DeleteWatchlistUseCase } from "@watchlist/application/usecases/delete-watchlist.usecase";
import { SubscriberModule } from "@subscriber/subscriber.module";

@Module({
  imports: [HttpModule, PrismaModule, SubscriberModule],
  controllers: [WatchlistController],
  providers: [
    WatchlistService,
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
    DeleteWatchlistUseCase,
  ],
})

export class WatchlistModule {}