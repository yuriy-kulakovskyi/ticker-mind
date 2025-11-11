import { Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { SubscriberService } from "modules/subscriber/application/services/subscriber.service";
import { WatchListRepository } from "modules/watchlist/infrastructure/repositories/watchlist.repository";

@Injectable()
export class WatchlistService {
  constructor(
    @Inject('WatchListRepository')
    private readonly repo: WatchListRepository,
    private readonly subscriberService: SubscriberService
  ) {}

  async createWatchlist(name: string, subscriberId: string, subscriberEmail: string) {
    try {
      await this.subscriberService.getSubscriberById(subscriberId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        await this.subscriberService.createSubscriber(subscriberId, subscriberEmail);
      } else {
        throw error; 
      }
    }

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