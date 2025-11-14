import { Logger, Module } from "@nestjs/common";
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
import { NotificationScheduler } from "./application/schedulers/notification.scheduler";
import { SubscriberModule } from "@subscriber/subscriber.module";
import { GetAllSubscribersUseCase } from "@subscriber/application/usecases/get-all-subscribers.usecase";
import { SendMailService } from "@shared/mailer/mailer.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    HttpModule, 
    PrismaModule, 
    SubscriberModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST') || 'smtp.gmail.com',
          port: configService.get('MAIL_PORT') || 587,
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Ticker Mind" <${configService.get('MAIL_FROM') || configService.get('MAIL_USER')}>`,
        },
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    CreateNotificationUseCase,
    UpdateNotificationUseCase,
    DeleteNotificationUseCase,
    GetNotificationsUseCase,
    GetNotificationByIdUseCase,
    PrismaNotificationRepository,
    NotificationScheduler,
    GetAllSubscribersUseCase,
    SendMailService,
    Logger
  ],
})

export class NotificationModule {}