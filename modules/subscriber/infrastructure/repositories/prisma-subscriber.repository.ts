import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { SubscriberRepository } from "@subscriber/infrastructure/repositories/subscriber.repository";
import { PrismaService } from "@prisma/prisma.service";
import { Subscriber } from "@subscriber/domain/entities/subscriber.entity";

@Injectable()
export class PrismaSubscriberRepository implements SubscriberRepository {
  constructor(
    private prisma: PrismaService
  ) {}

  async create(id: string, email: string, displayName?: string): Promise<Subscriber> {
    const existingActive = await this.prisma.subscriber.findFirst({
      where: { 
        email,
        isDeleted: false
      }
    });

    if (existingActive) {
      throw new ConflictException("Subscriber with this email already exists");
    }

    const existingDeleted = await this.prisma.subscriber.findFirst({
      where: { 
        OR: [
          { id, isDeleted: true },
          { email, isDeleted: true }
        ]
      }
    });

    if (existingDeleted) {
      const subscriber = await this.prisma.subscriber.update({
        where: { id: existingDeleted.id },
        data: {
          id, 
          email,
          displayName,
          isDeleted: false
        }
      });

      return new Subscriber(
        subscriber.id,
        subscriber.email,
        subscriber.displayName,
        subscriber.createdAt
      );
    }

    const subscriber = await this.prisma.subscriber.create({
      data: {
        id,
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
    const existing = await this.prisma.subscriber.findFirst({
      where: { 
        id,
        isDeleted: false
      }
    });

    if (!existing) {
      throw new NotFoundException("Subscriber not found");
    }

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
    const existing = await this.prisma.subscriber.findFirst({
      where: { 
        id,
        isDeleted: false
      }
    });

    if (!existing) {
      throw new NotFoundException("Subscriber not found");
    }

    await this.prisma.subscriber.update({
      where: { id },
      data: { isDeleted: true }
    });

    return { message: "Subscriber deleted successfully" };
  }

  async findById(id: string): Promise<Partial<Subscriber>> {
    const subscriber = await this.prisma.subscriber.findFirst({
      where: { 
        id,
        isDeleted: false
      }
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

  async getMe(id: string): Promise<Subscriber> {
    const subscriber = await this.prisma.subscriber.findFirst({
      where: { 
        id,
        isDeleted: false
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true
      }
    });

    if (!subscriber) {
      throw new NotFoundException("Subscriber not found");
    }

    return subscriber;
  }

  async getAll(): Promise<Subscriber[]> {
    const subscribers = await this.prisma.subscriber.findMany({
      where: { isDeleted: false }
    });

    return subscribers.map(subscriber => new Subscriber(
      subscriber.id,
      subscriber.email,
      subscriber.displayName,
      subscriber.createdAt
    ));
  }
}