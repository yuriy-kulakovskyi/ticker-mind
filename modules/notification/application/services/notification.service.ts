import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationEntity } from "@notification/domain/entities/notification.entity";
import { INotification } from "@notification/domain/interfaces/notification.interface";
import { IUpdateNotification } from "@notification/domain/interfaces/update-notification.interface";
import { NotificationRepository } from "@notification/infrastructure/repositories/notification.repository";
import { PrismaNotificationRepository } from "@notification/infrastructure/repositories/prisma-notification.repository";
import { ensureSubscriberExists } from "@shared/utils/subscriber-helper.util";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";

@Injectable()
export class NotificationService implements NotificationRepository {
  constructor(
    private readonly notificationRepository: PrismaNotificationRepository,
    private readonly subscriberService: SubscriberService
  ) {}

  async createNotification(data: INotification, userId: string, subscriberEmail: string): Promise<NotificationEntity> {
    await ensureSubscriberExists(userId, subscriberEmail, this.subscriberService);
    
    return this.notificationRepository.createNotification(data, userId);
  }

  async findNotificationsBySubscriber(subscriberId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.findNotificationsBySubscriber(subscriberId);
  }

  async deleteNotification(subscriberId: string, notificationId: string): Promise<string> {
    return this.notificationRepository.deleteNotification(subscriberId, notificationId);
  }

  async updateNotification(data: IUpdateNotification): Promise<NotificationEntity> {
    return this.notificationRepository.updateNotification(data);
  }

  async getNotificationById(subscriberId: string, notificationId: string): Promise<NotificationEntity> {
    return this.notificationRepository.getNotificationById(subscriberId, notificationId);
  }
}