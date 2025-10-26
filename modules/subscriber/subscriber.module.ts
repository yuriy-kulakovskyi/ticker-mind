import { Module } from "@nestjs/common";
import { SubscriberController } from "./controllers/subscriber.controller";
import { SubscriberService } from "./application/services/subscriber.service";

@Module({
  controllers: [SubscriberController],
  providers: [SubscriberService],
})

export class SubscriberModule {}