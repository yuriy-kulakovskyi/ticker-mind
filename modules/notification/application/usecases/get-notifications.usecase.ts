import { Injectable } from "@nestjs/common";
import { NotificationService } from "../services/notification.service";
import { NotificationEntity } from "@notification/domain/entities/notification.entity";

@Injectable()
export class GetNotificationsUseCase {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  async execute(subscriberId: string): Promise<NotificationEntity[]> {
    return this.notificationService.findNotificationsBySubscriber(subscriberId);
  }
}