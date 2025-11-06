import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { WatchListRepository } from "modules/watchlist/infrastructure/repositories/watchlist.repository";

@Injectable()
export class WatchlistService {
  constructor(
    @Inject('WatchListRepository')
    private readonly repo: WatchListRepository
  ) {}

  async createWatchlist(name: string, subscriberId: string, email?: string) {
    return this.repo.create({ name, subscriberId, email });
  }

  async addTicker(watchlistId: string, ticker: string) {
    return this.repo.addItem(watchlistId, ticker);
  }

  async removeTicker(watchlistId: string, ticker: string) {
    return this.repo.removeItem(watchlistId, ticker);
  }

  async getWatchlists(subscriberId: string) {
    return this.repo.findAllByUser(subscriberId);
  }

  async getWatchlistById(id: string) {
    const list = await this.repo.findById(id);
    if (!list) throw new NotFoundException('Watchlist not found');
    return list;
  }

  async updateWatchlist(id: string, data: { name?: string }) {
    return this.repo.update(id, data);
  }

  async deleteWatchlist(id: string) {
    return this.repo.delete(id);
  }
}