import { Injectable } from "@nestjs/common";
import { Subscriber } from "modules/subscriber/domain/entities/subscriber.entity";
import { SubscriberService } from "../services/subscriber.service";

@Injectable()
export class GetMeUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(userId: string): Promise<Subscriber> {
    return this.subscriberService.getMe(userId);
  }
}