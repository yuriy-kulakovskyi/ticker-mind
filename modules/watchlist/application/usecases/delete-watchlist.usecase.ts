import { Injectable } from "@nestjs/common";
import { WatchlistService } from "@watchlist/application/services/watchlist.service";

@Injectable()
export class DeleteWatchlistUseCase {
  constructor(private readonly watchlistService: WatchlistService) {}

  async execute(id: string, userId: string) {
    return this.watchlistService.delete(id, userId);
  }
}