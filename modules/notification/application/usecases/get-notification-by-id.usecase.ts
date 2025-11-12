import { Injectable } from "@nestjs/common";
import { NotificationService } from "@notification/application/services/notification.service";
import { NotificationEntity } from "@notification/domain/entities/notification.entity";

@Injectable()
export class GetNotificationByIdUseCase {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  async execute(subscriberId: string, notificationId: string): Promise<NotificationEntity> {
    return this.notificationService.getNotificationById(subscriberId, notificationId);
  }
}