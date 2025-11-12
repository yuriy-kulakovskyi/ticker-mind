import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";
import { WatchList } from "@watchlist/domain/entities/watchlist.entity";
import { WatchListRepository } from "@watchlist/infrastructure/repositories/watchlist.repository";

@Injectable()
export class WatchlistService implements WatchListRepository {
  constructor(
    @Inject('WatchListRepository')
    private readonly repo: WatchListRepository,
    private readonly subscriberService: SubscriberService
  ) {}

  async create({name, subscriberId, subscriberEmail}: {name: string, subscriberId: string, subscriberEmail: string}): Promise<WatchList> {
    try {
      await this.subscriberService.findById(subscriberId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        await this.subscriberService.create(subscriberId, subscriberEmail);
      } else {
        throw error; 
      }
    }

    return this.repo.create({ name, subscriberId, subscriberEmail });
  }

  async addItem(watchlistId: string, ticker: string, userId: string): Promise<WatchList> {
    return this.repo.addItem(watchlistId, ticker, userId);
  }

  async removeItem(watchlistId: string, ticker: string, userId: string): Promise<WatchList> {
    return this.repo.removeItem(watchlistId, ticker, userId);
  }

  async findAllByUser(subscriberId: string): Promise<WatchList[]> {
    return this.repo.findAllByUser(subscriberId);
  }

  async findById(id: string, subscriberId: string): Promise<WatchList | null> {
    return this.repo.findById(id, subscriberId);
  }

  async update(id: string, data: Partial<WatchList>, userId: string): Promise<WatchList> {
    return this.repo.update(id, data, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    return this.repo.delete(id, userId);
  }
}