import { Injectable } from "@nestjs/common";
import { SubscriberService } from "../services/subscriber.service";
import { Subscriber } from "@subscriber/domain/entities/subscriber.entity";

@Injectable()
export class GetAllSubscribersUseCase {
  constructor(
    private readonly subscriberService: SubscriberService
  ) {}

  async execute(): Promise<Subscriber[]> {
    return this.subscriberService.getAll();
  }
}