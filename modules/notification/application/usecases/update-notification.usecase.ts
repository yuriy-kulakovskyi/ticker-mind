import { Injectable } from "@nestjs/common";
import { NotificationService } from "@notification/application/services/notification.service";
import { NotificationEntity } from "@notification/domain/entities/notification.entity";
import { IUpdateNotification } from "@notification/domain/interfaces/update-notification.interface";

@Injectable()
export class UpdateNotificationUseCase {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  async execute(data: IUpdateNotification): Promise<NotificationEntity> {
    return this.notificationService.updateNotification(data);
  }
}