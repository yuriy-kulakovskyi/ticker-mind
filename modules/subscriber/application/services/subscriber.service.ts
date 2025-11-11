import { Injectable } from "@nestjs/common";
import { PrismaSubscriberRepository } from "modules/subscriber/infrastructure/repositories/prisma-subscriber.repository";
import { Subscriber } from "modules/subscriber/domain/entities/subscriber.entity";

@Injectable()
export class SubscriberService {
  constructor(
    private readonly subscriberRepository: PrismaSubscriberRepository
  ) {}

  async createSubscriber(email: string, displayName?: string): Promise<Subscriber> {
    return this.subscriberRepository.create(email, displayName);
  }

  async updateSubscriber(id: string, displayName: string): Promise<Subscriber> {
    return this.subscriberRepository.update(displayName, id);
  }

  async deleteSubscriber(id: string): Promise<{ message: string }> {
    return this.subscriberRepository.delete(id);
  }

  async getSubscriberById(id: string): Promise<Subscriber> {
    return this.subscriberRepository.findById(id);
  }
}