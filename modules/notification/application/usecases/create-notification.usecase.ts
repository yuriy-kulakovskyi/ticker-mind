import { Injectable } from "@nestjs/common";
import { NotificationService } from "@notification/application/services/notification.service";
import { INotification } from "@notification/domain/interfaces/notification.interface";
import { NotificationEntity } from "@notification/domain/entities/notification.entity";

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  async execute(data: INotification, userId: string): Promise<NotificationEntity> {
    return this.notificationService.createNotification(data, userId);
  }
}