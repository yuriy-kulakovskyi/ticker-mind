import { Injectable } from "@nestjs/common";
import { WatchlistService } from "../services/watchlist.service";

@Injectable()
export class WatchlistUseCase {
  constructor(private readonly watchlistService: WatchlistService) {}

  async createWatchlist(name: string, subscriberId: string, email?: string) {
    return this.watchlistService.createWatchlist(name, subscriberId, email);
  }

  async addTicker(watchlistId: string, ticker: string) {
    return this.watchlistService.addTicker(watchlistId, ticker);
  }

  async removeTicker(watchlistId: string, ticker: string) {
    return this.watchlistService.removeTicker(watchlistId, ticker);
  }

  async getWatchlists(subscriberId: string) {
    return this.watchlistService.getWatchlists(subscriberId);
  }

  async getWatchlistById(id: string) {
    return this.watchlistService.getWatchlistById(id);
  }

  async updateWatchlist(id: string, data: { name?: string }) {
    return this.watchlistService.updateWatchlist(id, data);
  }

  async deleteWatchlist(id: string) {
    return this.watchlistService.deleteWatchlist(id);
  }
}