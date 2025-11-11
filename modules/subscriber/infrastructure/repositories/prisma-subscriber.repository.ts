import { Injectable, NotFoundException } from "@nestjs/common";
import { SubscriberRepository } from "./subscriber.repository";
import { PrismaService } from "prisma/prisma.service";
import { Subscriber } from "modules/subscriber/domain/entities/subscriber.entity";

@Injectable()
export class PrismaSubscriberRepository implements SubscriberRepository {
  constructor(
    private prisma: PrismaService
  ) {}

  async create(email: string, displayName?: string): Promise<Subscriber> {
    const subscriber = await this.prisma.subscriber.create({
      data: {
        email,
        displayName
      }
    });

    return new Subscriber(
      subscriber.id,
      subscriber.email,
      subscriber.displayName,
      subscriber.createdAt
    );
  }

  async update(displayName: string, id: string): Promise<Subscriber> {
    const subscriber = await this.prisma.subscriber.update({
      where: { id },
      data: { displayName }
    });

    return new Subscriber(
      subscriber.id,
      subscriber.email,
      subscriber.displayName,
      subscriber.createdAt
    );
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.prisma.subscriber.delete({
      where: { id }
    });

    return { message: "Subscriber deleted successfully" };
  }

  async findById(id: string): Promise<Subscriber> {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { id }
    });

    if (!subscriber) {
      throw new NotFoundException("Subscriber not found");
    }

    return new Subscriber(
      subscriber.id,
      subscriber.email,
      subscriber.displayName,
      subscriber.createdAt
    );
  }
}