import { Injectable } from "@nestjs/common";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";

@Injectable()
export class DeleteSubscriberUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    return this.subscriberService.deleteSubscriber(id);
  }
}