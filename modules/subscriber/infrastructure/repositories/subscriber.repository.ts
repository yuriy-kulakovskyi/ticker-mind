import { Subscriber } from "@subscriber/domain/entities/subscriber.entity";

export interface SubscriberRepository {
  create(id: string, email: string, displayName?: string): Promise<Subscriber>;
  update(displayName: string, id: string): Promise<Subscriber>;
  delete(id: string): Promise<{ message: string }>;
  findById(id: string): Promise<Partial<Subscriber>>;
  getMe(id: string): Promise<Subscriber>;
  getAll(): Promise<Subscriber[]>;
}