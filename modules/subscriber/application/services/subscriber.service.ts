import { Inject, Injectable } from "@nestjs/common";
import { Subscriber } from "@subscriber/domain/entities/subscriber.entity";
import { SubscriberRepository } from "@subscriber/infrastructure/repositories/subscriber.repository";

@Injectable()
export class SubscriberService implements SubscriberRepository {
  constructor(
  @Inject('SubscriberRepository')
    private readonly subscriberRepository: SubscriberRepository
  ) {}

  async create(id: string, email: string, displayName?: string): Promise<Subscriber> {
    return this.subscriberRepository.create(id, email, displayName);
  }

  async update(id: string, displayName: string): Promise<Subscriber> {
    return this.subscriberRepository.update(displayName, id);
  }

  async delete(id: string): Promise<{ message: string }> {
    return this.subscriberRepository.delete(id);
  }

  async findById(id: string): Promise<Partial<Subscriber>> {
    return this.subscriberRepository.findById(id);
  }

  async getMe(id: string): Promise<Subscriber> {
    return this.subscriberRepository.getMe(id);
  }

  async getAll(): Promise<Subscriber[]> {
    return this.subscriberRepository.getAll();
  }
}