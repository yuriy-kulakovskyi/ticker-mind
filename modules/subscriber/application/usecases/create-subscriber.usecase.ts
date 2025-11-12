import { Injectable } from "@nestjs/common";
import { SubscriberService } from "@subscriber/application/services/subscriber.service";
import { Subscriber } from "@subscriber/domain/entities/subscriber.entity";

@Injectable()
export class CreateSubscriberUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(id: string, email: string, displayName?: string): Promise<Subscriber> {
    return this.subscriberService.create(id, email, displayName);
  }
}