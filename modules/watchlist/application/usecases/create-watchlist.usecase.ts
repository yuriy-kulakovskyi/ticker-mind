import { Injectable } from "@nestjs/common";
import { WatchlistService } from "../services/watchlist.service";

@Injectable()
export class CreateWatchlistUseCase {
  constructor(private readonly watchlistService: WatchlistService) {}

  async execute(name: string, subscriberId: string) {
    return this.watchlistService.createWatchlist(name, subscriberId);
  }
}