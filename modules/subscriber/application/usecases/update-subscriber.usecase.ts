import { Injectable } from "@nestjs/common";
import { SubscriberService } from "../services/subscriber.service";
import { Subscriber } from "modules/subscriber/domain/entities/subscriber.entity";

@Injectable()
export class UpdateSubscriberUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(id: string, displayName: string): Promise<Subscriber> {
    return this.subscriberService.updateSubscriber(id, displayName);
  }
}