import { Module } from "@nestjs/common";
import { NotificationController } from "@notification/controllers/notification.controller";
import { NotificationService } from "@notification/application/services/notification.service";
import { CreateNotificationUseCase } from "@notification/application/usecases/create-notification.usecase";
import { UpdateNotificationUseCase } from "@notification/application/usecases/update-notification.usecase";
import { DeleteNotificationUseCase } from "@notification/application/usecases/delete-notification.usecase";
import { GetNotificationsUseCase } from "@notification/application/usecases/get-notifications.usecase";
import { PrismaNotificationRepository } from "@notification/infrastructure/repositories/prisma-notification.repository";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "@prisma/prisma.module";
import { GetNotificationByIdUseCase } from "./application/usecases/get-notification-by-id.usecase";

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    CreateNotificationUseCase,
    UpdateNotificationUseCase,
    DeleteNotificationUseCase,
    GetNotificationsUseCase,
    GetNotificationByIdUseCase,
    PrismaNotificationRepository,
  ],
})

export class NotificationModule {}