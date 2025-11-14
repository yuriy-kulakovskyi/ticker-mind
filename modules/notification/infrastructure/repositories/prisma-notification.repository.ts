import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { NotificationEntity } from "@notification/domain/entities/notification.entity";
import { INotification } from "@notification/domain/interfaces/notification.interface";
import { IUpdateNotification } from "@notification/domain/interfaces/update-notification.interface";
import { PrismaService } from "@prisma/prisma.service";
import { isArray } from "class-validator";

@Injectable()
export class PrismaNotificationRepository {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async createNotification(data: INotification, userId: string): Promise<NotificationEntity> {
    if (!data.tickers && !data.watchlistId) {
      throw new BadRequestException('Either tickers or watchlistId must be provided.');
    }

    if (data.watchlistId) {
      const watchlist = await this.prismaService.watchlist.findFirst({
        where: {
          id: data.watchlistId,
          subscriberId: userId,
          isDeleted: false
        },
        include: {
          items: { where: { isDeleted: false } }
        }
      });

      if (!watchlist || !isArray(watchlist.items)) {
        throw new BadRequestException('Invalid watchlistId provided.');
      }

      const notification = await this.prismaService.notification.create({
        data: {
          title: data.title,
          tickers: watchlist.items.filter(item => !item.isDeleted).map(item => item.ticker),
          message: "",
          subscriberId: userId,
        },
      });

      return new NotificationEntity(
        notification.id,
        notification.title,
        notification.tickers,
        notification.message,
        notification.subscriberId,
        notification.createdAt,
      );
    }

    const notification = await this.prismaService.notification.create({
      data: {
        title: data.title,
        tickers: data.tickers,
        message: data.message,
        subscriberId: userId,
      },
    });

    return new NotificationEntity(
      notification.id,
      notification.title,
      notification.tickers,
      notification.message,
      notification.subscriberId,
      notification.createdAt,
    );
  }

  async findNotificationsBySubscriber(subscriberId: string): Promise<NotificationEntity[]> {
    const notifications = await this.prismaService.notification.findMany({
      where: { 
        subscriberId,
        isDeleted: false
      },
    });

    return notifications.map(notification => new NotificationEntity(
      notification.id,
      notification.title,
      notification.tickers,
      notification.message,
      notification.subscriberId,
      notification.createdAt,
    ));
  }

  async deleteNotification(subscriberId: string, notificationId: string): Promise<string> {
    const existing = await this.prismaService.notification.findFirst({
      where: { 
        id: notificationId,
        subscriberId,
        isDeleted: false
      }
    });

    if (!existing) {
      throw new ForbiddenException('Notification not found or access denied.');
    }

    await this.prismaService.notification.update({
      where: { id: notificationId, subscriberId },
      data: { isDeleted: true }
    });

    return `Notification with id ${notificationId} has been deleted.`;
  }

  async updateNotification(data: IUpdateNotification): Promise<NotificationEntity> {
    if (!data.title && !data.tickers && !data.message) {
      throw new BadRequestException('At least one field (title, tickers, message) must be provided for update.');
    }

    if (!data.userId) {
      throw new ForbiddenException('User ID is required to update notification.');
    }

    const existing = await this.prismaService.notification.findFirst({
      where: { 
        id: data.id,
        subscriberId: data.userId,
        isDeleted: false
      }
    });

    if (!existing) {
      throw new ForbiddenException('Notification not found or access denied.');
    }
    
    const notification = await this.prismaService.notification.update({
      where: { id: data.id },
      data: {
        title: data.title,
        tickers: data.tickers,
        message: data.message,
      },
    });

    return new NotificationEntity(
      notification.id,
      notification.title,
      notification.tickers,
      notification.message,
      notification.subscriberId,
      notification.createdAt,
    );
  }

  async getNotificationById(subscriberId: string, notificationId: string): Promise<NotificationEntity> {
    const notification = await this.prismaService.notification.findFirst({
      where: { 
        id: notificationId,
        subscriberId,
        isDeleted: false
      }
    });

    if (!notification) {
      throw new ForbiddenException('Notification not found or access denied.');
    }

    return new NotificationEntity(
      notification.id,
      notification.title,
      notification.tickers,
      notification.message,
      notification.subscriberId,
      notification.createdAt,
    );
  }
}