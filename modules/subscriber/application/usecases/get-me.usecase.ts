import { Injectable } from "@nestjs/common";
import { Subscriber } from "@subscriber/domain/entities/subscriber.entity";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";

@Injectable()
export class GetMeUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(userId: string): Promise<Subscriber> {
    return this.subscriberService.getMe(userId);
  }
}