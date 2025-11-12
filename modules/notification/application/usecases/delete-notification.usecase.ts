import { Injectable } from "@nestjs/common";
import { NotificationService } from "../services/notification.service";

@Injectable()
export class DeleteNotificationUseCase {
  constructor(
    private readonly notificationService: NotificationService
  ) {}

  async execute(subscriberId: string, notificationId: string): Promise<string> {
    return this.notificationService.deleteNotification(subscriberId, notificationId);
  }
}