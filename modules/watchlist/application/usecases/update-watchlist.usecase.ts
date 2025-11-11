import { Injectable } from "@nestjs/common";
import { WatchlistService } from "../services/watchlist.service";

@Injectable()
export class UpdateWatchlistUseCase {
  constructor(
    private readonly watchlistService: WatchlistService
  ) {}

  async execute(id: string, data: { name: string }, userId: string) {
    return this.watchlistService.updateWatchlist(id, data, userId);
  }
}