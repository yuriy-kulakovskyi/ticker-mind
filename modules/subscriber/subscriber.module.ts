import { Module } from "@nestjs/common";
import { SubscriberController } from "@subscriber/controllers/subscriber.controller";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";
import { UpdateSubscriberUseCase } from "@subscriber/application/usecases/update-subscriber.usecase";
import { CreateSubscriberUseCase } from "@subscriber/application/usecases/create-subscriber.usecase";
import { DeleteSubscriberUseCase } from "@subscriber/application/usecases/delete-subscriber.usecase";
import { ReadSubscriberUseCase } from "@subscriber/application/usecases/read-subscriber.usecase";
import { PrismaSubscriberRepository } from "@subscriber/infrastructure/repositories/prisma-subscriber.repository";
import { PrismaService } from "@prisma/prisma.service";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "@prisma/prisma.module";
import { GetMeUseCase } from "@subscriber/application/usecases/get-me.usecase";

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [SubscriberController],
  providers: [
    SubscriberService, 
    UpdateSubscriberUseCase, 
    CreateSubscriberUseCase,
    DeleteSubscriberUseCase, 
    ReadSubscriberUseCase,
    GetMeUseCase,
    {
      provide: 'SubscriberRepository',
      useClass: PrismaSubscriberRepository,
    },
    PrismaService
  ],
  exports: [SubscriberService], 
})

export class SubscriberModule {}