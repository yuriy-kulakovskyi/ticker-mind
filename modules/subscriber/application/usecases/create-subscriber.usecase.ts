import { Injectable } from "@nestjs/common";
import { SubscriberService } from "../services/subscriber.service";
import { Subscriber } from "modules/subscriber/domain/entities/subscriber.entity";

@Injectable()
export class CreateSubscriberUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(email: string, displayName?: string): Promise<Subscriber> {
    return this.subscriberService.createSubscriber(email, displayName);
  }
}