import { Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { WatchListRepository } from "modules/watchlist/infrastructure/repositories/watchlist.repository";

@Injectable()
export class WatchlistService {
  constructor(
    @Inject('WatchListRepository')
    private readonly repo: WatchListRepository
  ) {}

  async createWatchlist(name: string, subscriberId: string, subscriberEmail: string) {
    return this.repo.create({ name, subscriberId, subscriberEmail });
  }

  async addTicker(watchlistId: string, ticker: string, userId: string) {
    const watchlist = await this.repo.findById(watchlistId, userId);
    
    if (!watchlist) {
      throw new NotFoundException('Watchlist not found');
    }
    
    return this.repo.addItem(watchlistId, ticker);
  }

  async removeTicker(watchlistId: string, ticker: string, userId: string) {
    const watchlist = await this.repo.findById(watchlistId, userId);
    
    if (!watchlist) {
      throw new NotFoundException('Watchlist not found');
    }
    
    return this.repo.removeItem(watchlistId, ticker);
  }

  async getWatchlists(subscriberId: string) {
    return this.repo.findAllByUser(subscriberId);
  }

  async getWatchlistById(id: string, subscriberId: string) {
    const list = await this.repo.findById(id, subscriberId);
    
    if (!list) {
      throw new NotFoundException('Watchlist not found');
    }
    
    return list;
  }

  async updateWatchlist(id: string, data: { name: string }, userId: string) {
    const watchlist = await this.repo.findById(id, userId);
    
    if (!watchlist) {
      throw new NotFoundException('Watchlist not found');
    }
    
    return this.repo.update(id, data);
  }

  async deleteWatchlist(id: string, userId: string) {
    const watchlist = await this.repo.findById(id, userId);
    
    if (!watchlist) {
      throw new NotFoundException('Watchlist not found');
    }
    
    return this.repo.delete(id);
  }
}