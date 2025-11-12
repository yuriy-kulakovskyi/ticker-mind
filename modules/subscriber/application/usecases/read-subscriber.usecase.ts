import { Injectable } from "@nestjs/common";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";
import { Subscriber } from "@subscriber/domain/entities/subscriber.entity";

@Injectable()
export class ReadSubscriberUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(id: string): Promise<Partial<Subscriber>> {
    return this.subscriberService.getSubscriberById(id);
  }
}