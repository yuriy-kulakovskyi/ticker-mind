import { Injectable } from "@nestjs/common";
import { WatchlistService } from "../services/watchlist.service";

@Injectable()
export class WatchlistUseCase {
  constructor(private readonly watchlistService: WatchlistService) {}

  async createWatchlist(name: string, subscriberId: string) {
    return this.watchlistService.createWatchlist(name, subscriberId);
  }

  async addTicker(watchlistId: string, ticker: string, userId: string) {
    return this.watchlistService.addTicker(watchlistId, ticker, userId);
  }

  async removeTicker(watchlistId: string, ticker: string, userId: string) {
    return this.watchlistService.removeTicker(watchlistId, ticker, userId);
  }

  async getWatchlists(subscriberId: string) {
    return this.watchlistService.getWatchlists(subscriberId);
  }

  async getWatchlistById(id: string, subscriberId: string) {
    return this.watchlistService.getWatchlistById(id, subscriberId);
  }

  async updateWatchlist(id: string, data: { name?: string }, userId: string) {
    return this.watchlistService.updateWatchlist(id, data, userId);
  }

  async deleteWatchlist(id: string, userId: string) {
    return this.watchlistService.deleteWatchlist(id, userId);
  }
}