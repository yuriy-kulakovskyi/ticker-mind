import { Injectable } from "@nestjs/common";
import { WatchlistService } from "@watchlist/application/services/watchlist.service";

@Injectable()
export class CreateWatchlistUseCase {
  constructor(private readonly watchlistService: WatchlistService) {}

  async execute(name: string, subscriberId: string, subscriberEmail: string) {
    return this.watchlistService.createWatchlist(name, subscriberId, subscriberEmail);
  }
}