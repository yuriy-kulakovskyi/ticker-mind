import { WatchList } from "@watchlist/domain/entities/watchlist.entity";
import { ICreateWatchlist } from "@watchlist/domain/interfaces/create-watchlist.interface";

export interface WatchListRepository {
  create(data: ICreateWatchlist): Promise<WatchList>;
  addItem(watchlistId: string, ticker: string, userId: string): Promise<WatchList>;
  removeItem(watchlistId: string, ticker: string, userId: string): Promise<WatchList>;
  findAllByUser(subscriberId: string): Promise<WatchList[]>;
  findById(id: string, subscriberId: string): Promise<WatchList | null>;
  update(id: string, data: Partial<WatchList>, userId: string): Promise<WatchList>;
  delete(id: string, userId: string): Promise<void>;
}