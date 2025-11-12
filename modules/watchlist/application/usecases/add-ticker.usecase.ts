import { Injectable } from "@nestjs/common";
import { WatchlistService } from "@watchlist/application/services/watchlist.service";

@Injectable()
export class AddTickerUseCase {
  constructor(
    private readonly watchlistService: WatchlistService
  ) {}

  async execute(watchlistId: string, ticker: string, userId: string) {
    return this.watchlistService.addTicker(watchlistId, ticker, userId);
  }
}