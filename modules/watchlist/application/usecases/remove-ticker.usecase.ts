import { Injectable } from "@nestjs/common";
import { WatchlistService } from "../services/watchlist.service";

@Injectable()
export class RemoveTickerUseCase {
  constructor(
    private readonly watchlistService: WatchlistService
  ) {}

  async execute(watchlistId: string, ticker: string, userId: string) {
    return this.watchlistService.removeTicker(watchlistId, ticker, userId);
  }
}