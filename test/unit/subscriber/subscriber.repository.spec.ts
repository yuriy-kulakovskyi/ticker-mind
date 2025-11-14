import { PrismaService } from "@prisma/prisma.service";
import { PrismaSubscriberRepository } from "@subscriber/infrastructure/repositories/prisma-subscriber.repository";

type MockPrismaService = {
  subscriber: {
    create: jest.Mock;
    update: jest.Mock;
    findFirst: jest.Mock;
    findMany: jest.Mock;
    delete: jest.Mock;
  };
};

describe("PrismaSubscriberRepository", () => {
  let repo: PrismaSubscriberRepository;
  let prisma: MockPrismaService;

  beforeEach(() => {
    prisma = {
      subscriber: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      }
    };

    repo = new PrismaSubscriberRepository(prisma as unknown as PrismaService);
  });

  it("should create a subscriber", async () => {
    prisma.subscriber.create.mockResolvedValue({
      id: "1",
      email: "user1@example.com",
      displayName: "User One"
    });

    const result = await repo.create(
      "1",
      "user1@example.com",
      "User One"
    );

    expect(prisma.subscriber.create).toHaveBeenCalledWith({
      data: {
        email: "user1@example.com",
        displayName: "User One",
        id: "1"
      }
    });
    expect(result.id).toBe("1");
  });

  it("should get all subscribers", async () => {
    prisma.subscriber.findMany.mockResolvedValue([
      { id: "1", email: "user1@example.com", displayName: "User One", createdAt: new Date() },
      { id: "2", email: "user2@example.com", displayName: "User Two", createdAt: new Date() }
    ]);

    const result = await repo.getAll();

    expect(prisma.subscriber.findMany).toHaveBeenCalledWith({
      where: { isDeleted: false }
    });
    expect(result.length).toBe(2);
  });

  it("should get a subscriber by id", async () => {
    prisma.subscriber.findFirst.mockResolvedValue({
      id: "1",
      email: "user1@example.com",
      displayName: "User One",
      createdAt: new Date()
    });

    const result = await repo.findById("1");

    expect(prisma.subscriber.findFirst).toHaveBeenCalledWith({
      where: { id: "1", isDeleted: false }
    });
    expect(result.id).toBe("1");
  });

  it("should throw NotFoundException if subscriber not found by id", async () => {
    prisma.subscriber.findFirst.mockResolvedValue(null);

    await expect(repo.findById("999")).rejects.toThrow("Subscriber not found");

    expect(prisma.subscriber.findFirst).toHaveBeenCalledWith({
      where: { id: "999", isDeleted: false }
    });
  });

  it("should delete a subscriber (soft delete)", async () => {
    prisma.subscriber.findFirst.mockResolvedValue({
      id: "1",
      email: "user1@example.com",
      displayName: "User One",
      createdAt: new Date()
    });
    prisma.subscriber.update.mockResolvedValue({ id: "1" });

    const result = await repo.delete("1");

    expect(prisma.subscriber.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { isDeleted: true }
    });
    expect(result).toEqual({ message: "Subscriber deleted successfully" });
  });

  it("should update a subscriber", async () => {
    prisma.subscriber.findFirst.mockResolvedValue({
      id: "1",
      email: "user1@example.com",
      displayName: "User One",
      createdAt: new Date()
    });

    prisma.subscriber.update.mockResolvedValue({
      id: "1",
      email: "user1@example.com",
      displayName: "Updated User",
      createdAt: new Date()
    });

    const result = await repo.update("Updated User", "1");

    expect(prisma.subscriber.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { displayName: "Updated User" }
    });
    expect(result.displayName).toBe("Updated User");
  });
});