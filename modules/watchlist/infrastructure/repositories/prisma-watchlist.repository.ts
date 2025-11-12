import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { WatchListRepository } from "@watchlist/infrastructure/repositories/watchlist.repository";
import { PrismaService } from "@prisma/prisma.service";
import { WatchList } from "@watchlist/domain/entities/watchlist.entity";
import { ICreateWatchlist } from "@watchlist/domain/interfaces/create-watchlist.interface";

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
      include: { 
        items: {
          where: { isDeleted: false }
        }
      }
    });
  }

  async addItem(watchlistId: string, ticker: string, userId: string): Promise<WatchList> {
    const watchlist = await this.prisma.watchlist.findFirst({
      where: {
        id: watchlistId,
        subscriberId: userId,
        isDeleted: false
      }
    });

    if (!watchlist) {
      throw new NotFoundException('Watchlist not found');
    }

    const existing = await this.prisma.watchlistItem.findFirst({
      where: {
        watchlistId,
        ticker,
        isDeleted: false
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
      include: { 
        items: {
          where: { isDeleted: false }
        }
      }
    });
  }

  async removeItem(watchlistId: string, ticker: string, userId: string): Promise<WatchList> {
    const watchlist = await this.prisma.watchlist.findFirst({
      where: {
        id: watchlistId,
        subscriberId: userId,
        isDeleted: false
      }
    });

    if (!watchlist) {
      throw new NotFoundException('Watchlist not found');
    }

    const item = await this.prisma.watchlistItem.findFirst({
      where: {
        watchlistId,
        ticker,
        isDeleted: false
      }
    });

    if (!item) {
      throw new NotFoundException('Ticker not found in watchlist');
    }

    await this.prisma.watchlistItem.update({ 
      where: { id: item.id },
      data: { isDeleted: true }
    });

    const updatedWatchlist = await this.prisma.watchlist.findFirst({
      where: { 
        id: watchlistId,
        isDeleted: false
      },
      include: { 
        items: {
          where: { isDeleted: false }
        }
      }
    });

    if (!updatedWatchlist) {
      throw new NotFoundException('Watchlist not found');
    }

    return updatedWatchlist;
  }

  async findAllByUser(subscriberId: string): Promise<WatchList[]> {
    return this.prisma.watchlist.findMany({
      where: { 
        subscriberId,
        isDeleted: false
      },
      include: { 
        items: {
          where: { isDeleted: false }
        }
      }
    });
  }

  async findById(id: string, subscriberId: string): Promise<WatchList | null> {
    return this.prisma.watchlist.findFirst({
      where: { 
        id, 
        subscriberId,
        isDeleted: false
      },
      include: { 
        items: {
          where: { isDeleted: false }
        }
      }
    });
  }

  async update(id: string, data: Partial<WatchList>, userId: string): Promise<WatchList> {
    const watchlist = await this.prisma.watchlist.findFirst({
      where: { 
        id,
        subscriberId: userId,
        isDeleted: false
      }
    });

    if (!watchlist) {
      throw new NotFoundException('Watchlist not found');
    }

    return this.prisma.watchlist.update({
      where: { id },
      data: { name: data.name },
      include: { 
        items: {
          where: { isDeleted: false }
        }
      }
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.prisma.watchlist.findFirst({
      where: { 
        id,
        subscriberId: userId,
        isDeleted: false
      }
    });

    if (!existing) {
      throw new NotFoundException('Watchlist not found');
    }

    await this.prisma.watchlist.update({
      where: { id },
      data: { isDeleted: true }
    });
  }
}