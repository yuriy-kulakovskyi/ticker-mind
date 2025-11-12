import { Module } from "@nestjs/common";
import { NotificationController } from "./controllers/notification.controller";
import { NotificationService } from "./application/services/notification.service";
import { CreateNotificationUseCase } from "./application/usecases/create-notification.usecase";
import { UpdateNotificationUseCase } from "./application/usecases/update-notification.usecase";
import { DeleteNotificationUseCase } from "./application/usecases/delete-notification.usecase";
import { GetNotificationsUseCase } from "./application/usecases/get-notifications.usecase";
import { PrismaNotificationRepository } from "./infrastructure/repositories/prisma-notification.repository";
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