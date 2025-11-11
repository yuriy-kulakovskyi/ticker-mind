import { Injectable } from "@nestjs/common";
import { SubscriberService } from "../services/subscriber.service";
import { Subscriber } from "modules/subscriber/domain/entities/subscriber.entity";

@Injectable()
export class ReadSubscriberUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(id: string): Promise<Subscriber> {
    return this.subscriberService.getSubscriberById(id);
  }
}