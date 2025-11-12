import { Injectable } from "@nestjs/common";
import { WatchlistService } from "@watchlist/application/services/watchlist.service";

@Injectable()
export class GetWatchlistByIdUseCase {
  constructor(
    private readonly watchlistService: WatchlistService
  ) {}

  
  async execute(id: string, subscriberId: string) {
    return this.watchlistService.getWatchlistById(id, subscriberId);
  }
}