import { Subscriber } from "modules/subscriber/domain/entities/subscriber.entity";

export interface SubscriberRepository {
  create(email: string, displayName?: string): Promise<Subscriber>;
  update(displayName: string, id: string): Promise<Subscriber>;
  delete(id: string): Promise<{ message: string }>;
  findById(id: string): Promise<Subscriber>;
}