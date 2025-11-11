import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { WatchListRepository } from "./watchlist.repository";
import { PrismaService } from "prisma/prisma.service";
import { WatchList } from "modules/watchlist/domain/entities/watchlist.entity";
import { ICreateWatchlist } from "modules/watchlist/domain/interfaces/create-watchlist.interface";

@Injectable()
export class PrismaWatchlistRepository implements WatchListRepository {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: ICreateWatchlist): Promise<WatchList> {
    return this.prisma.watchlist.create({
      data: {
        name: data.name,
        subscriberId: data.subscriberId
      },
      include: { items: true }
    });
  }

  async addItem(watchlistId: string, ticker: string): Promise<WatchList> {
    const existing = await this.prisma.watchlistItem.findFirst({
      where: {
        watchlistId,
        ticker
      }
    });

    if (existing) {
      throw new ConflictException('Ticker already exists in watchlist');
    }

    return this.prisma.watchlist.update({
      where: { id: watchlistId },
      data: {
        items: {
          create: { ticker }
        }
      },
      include: { items: true }
    });
  }

  async removeItem(watchlistId: string, ticker: string): Promise<WatchList | null> {
    const item = await this.prisma.watchlistItem.findFirst({
      where: {
        watchlistId,
        ticker
      }
    });

    if (!item) {
      throw new NotFoundException('Ticker not found in watchlist');
    }

    await this.prisma.watchlistItem.delete({ where: { id: item.id } });

    return this.prisma.watchlist.findUnique({
      where: { id: watchlistId },
      include: { items: true }
    });
  }

  async findAllByUser(subscriberId: string): Promise<WatchList[]> {
    return this.prisma.watchlist.findMany({
      where: { subscriberId },
      include: { items: true }
    });
  }

  async findById(id: string, subscriberId: string): Promise<WatchList | null> {
    return this.prisma.watchlist.findUnique({
      where: { id, subscriberId },
      include: { items: true }
    });
  }

  async update(id: string, data: WatchList): Promise<WatchList> {
    return this.prisma.watchlist.update({
      where: { id },
      data: { name: data.name },
      include: { items: true }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.watchlist.delete({
      where: { id }
    });
  }
}