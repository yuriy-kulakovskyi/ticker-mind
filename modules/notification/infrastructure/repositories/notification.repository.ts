import { NotificationEntity } from "@notification/domain/entities/notification.entity";
import { INotification } from "@notification/domain/interfaces/notification.interface";
import { IUpdateNotification } from "@notification/domain/interfaces/update-notification.interface";

export interface NotificationRepository {
  createNotification(data: INotification, userId: string, subscriberEmail: string): Promise<NotificationEntity>;
  findNotificationsBySubscriber(subscriberId: string): Promise<NotificationEntity[]>;
  deleteNotification(subscriberId: string, notificationId: string): Promise<string>;
  updateNotification(data: IUpdateNotification): Promise<NotificationEntity>;
  getNotificationById(subscriberId: string, notificationId: string): Promise<NotificationEntity>;
}