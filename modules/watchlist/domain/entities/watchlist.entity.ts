import { WatchlistItem } from "@prisma/client";

export class WatchList {
  constructor(
    public id: string,
    public name: string,
    public subscriberId: string,
    public createdAt: Date,
    public isDeleted: boolean,
    public items: WatchlistItem[],
  ) {}
}