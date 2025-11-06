import { Injectable } from "@nestjs/common";
import { WatchListRepository } from "./watchlist.repository";
import { PrismaService } from "prisma/prisma.service";
import { WatchList } from "modules/watchlist/domain/entities/watchlist.entity";

@Injectable()
export class PrismaWatchlistRepository implements WatchListRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; subscriberId: string; email?: string }): Promise<WatchList> {
    if (data.email) {
      return this.prisma.watchlist.create({
        data: {
          name: data.name,
          subscriber: {
            connectOrCreate: {
              where: { id: data.subscriberId },
              create: { id: data.subscriberId, email: data.email }
            }
          }
        },
        include: { items: true }
      });
    }
    
    return this.prisma.watchlist.create({
      data: {
        name: data.name,
        subscriberId: data.subscriberId
      },
      include: { items: true }
    });
  }

  async addItem(watchlistId: string, ticker: string): Promise<WatchList> {
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
    if (item) {
      await this.prisma.watchlistItem.delete({
        where: { id: item.id }
      });
    }

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

  async update(id: string, data: Partial<WatchList>): Promise<WatchList> {
    return this.prisma.watchlist.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.watchlist.delete({
      where: { id }
    });
  }
}