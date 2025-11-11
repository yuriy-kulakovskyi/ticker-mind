import { Injectable } from "@nestjs/common";
import { WatchlistService } from "../services/watchlist.service";

@Injectable()
export class GetWatchlistsUseCase {
  constructor(
    private readonly watchlistService: WatchlistService
  ) {}

  async execute(subscriberId: string) {
    return this.watchlistService.getWatchlists(subscriberId);
  }
}