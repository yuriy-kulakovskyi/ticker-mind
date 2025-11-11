import { Injectable } from "@nestjs/common";
import { WatchlistService } from "../services/watchlist.service";

@Injectable()
export class DeleteWatchlistUseCase {
  constructor(private readonly watchlistService: WatchlistService) {}

  async execute(id: string, userId: string) {
    return this.watchlistService.deleteWatchlist(id, userId);
  }
}