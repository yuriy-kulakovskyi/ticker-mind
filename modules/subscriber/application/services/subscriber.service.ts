import { Inject, Injectable } from "@nestjs/common";
import { Subscriber } from "modules/subscriber/domain/entities/subscriber.entity";
import { SubscriberRepository } from "modules/subscriber/infrastructure/repositories/subscriber.repository";

@Injectable()
export class SubscriberService {
  constructor(
  @Inject('SubscriberRepository')
    private readonly subscriberRepository: SubscriberRepository
  ) {}

  async createSubscriber(id: string, email: string, displayName?: string): Promise<Subscriber> {
    return this.subscriberRepository.create(id, email, displayName);
  }

  async updateSubscriber(id: string, displayName: string): Promise<Subscriber> {
    return this.subscriberRepository.update(displayName, id);
  }

  async deleteSubscriber(id: string): Promise<{ message: string }> {
    return this.subscriberRepository.delete(id);
  }

  async getSubscriberById(id: string): Promise<Partial<Subscriber>> {
    return this.subscriberRepository.findById(id);
  }

  async getMe(id: string): Promise<Subscriber> {
    return this.subscriberRepository.getMe(id);
  }
}