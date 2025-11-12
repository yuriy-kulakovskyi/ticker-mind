import { Injectable } from "@nestjs/common";
import { WatchlistService } from "@watchlist/application/services/watchlist.service";

@Injectable()
export class GetWatchlistsUseCase {
  constructor(
    private readonly watchlistService: WatchlistService
  ) {}

  async execute(subscriberId: string) {
    return this.watchlistService.getWatchlists(subscriberId);
  }
}