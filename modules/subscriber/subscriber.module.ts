import { Module } from "@nestjs/common";
import { SubscriberController } from "./controllers/subscriber.controller";
import { SubscriberService } from "./application/services/subscriber.service";
import { UpdateSubscriberUseCase } from "./application/usecases/update-subscriber.usecase";
import { CreateSubscriberUseCase } from "./application/usecases/create-subscriber.usecase";
import { DeleteSubscriberUseCase } from "./application/usecases/delete-subscriber.usecase";
import { ReadSubscriberUseCase } from "./application/usecases/read-subscriber.usecase";
import { Subscriber } from "./domain/entities/subscriber.entity";
import { PrismaSubscriberRepository } from "./infrastructure/repositories/prisma-subscriber.repository";
import { PrismaService } from "prisma/prisma.service";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "prisma/prisma.module";

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [SubscriberController],
  providers: [
    SubscriberService, 
    UpdateSubscriberUseCase, 
    CreateSubscriberUseCase,
    DeleteSubscriberUseCase, 
    ReadSubscriberUseCase,
    Subscriber,
    PrismaSubscriberRepository,
    PrismaService
  ],
})

export class SubscriberModule {}