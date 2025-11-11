import { WatchList } from "modules/watchlist/domain/entities/watchlist.entity";
import { ICreateWatchlist } from "modules/watchlist/domain/interfaces/create-watchlist.interface";

export interface WatchListRepository {
  create(data: ICreateWatchlist): Promise<WatchList>;
  addItem(watchlistId: string, ticker: string): Promise<WatchList | null>;
  removeItem(watchlistId: string, ticker: string): Promise<WatchList | null>;
  findAllByUser(subscriberId: string): Promise<WatchList[]>;
  findById(id: string, subscriberId: string): Promise<WatchList | null>;
  update(id: string, data: Partial<WatchList>): Promise<WatchList>;
  delete(id: string): Promise<void>;
}