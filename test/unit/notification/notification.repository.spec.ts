import { PrismaService } from "@prisma/prisma.service";
import { PrismaNotificationRepository } from "@notification/infrastructure/repositories/prisma-notification.repository";
import { BadRequestException, ForbiddenException } from "@nestjs/common";

type MockPrismaService = {
  notification: {
    create: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
  };
  watchlist: {
    findFirst: jest.Mock;
  };
};

describe("PrismaNotificationRepository", () => {
  let repo: PrismaNotificationRepository;
  let prisma: MockPrismaService;

  beforeEach(() => {
    prisma = {
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      watchlist: {
        findFirst: jest.fn(),
      }
    };

    repo = new PrismaNotificationRepository(prisma as unknown as PrismaService);
  });

  // ===========================================================================
  // CREATE
  // ===========================================================================
  it("should create a notification with tickers", async () => {
    const now = new Date();
    prisma.notification.create.mockResolvedValue({
      id: "1",
      title: "Price Alert",
      tickers: ["AAPL", "GOOGL"],
      message: "Test message",
      subscriberId: "user1",
      createdAt: now,
    });

    const result = await repo.createNotification({
      title: "Price Alert",
      tickers: ["AAPL", "GOOGL"],
      message: "Test message",
    }, "user1");

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        title: "Price Alert",
        tickers: ["AAPL", "GOOGL"],
        message: "Test message",
        subscriberId: "user1",
      }
    });
    expect(result.id).toBe("1");
    expect(result.tickers).toEqual(["AAPL", "GOOGL"]);
  });

  it("should create a notification with watchlistId", async () => {
    const now = new Date();
    const mockWatchlist = {
      id: "watchlist1",
      subscriberId: "user1",
      items: [
        { ticker: "AAPL", isDeleted: false },
        { ticker: "GOOGL", isDeleted: false },
        { ticker: "MSFT", isDeleted: true }
      ]
    };

    prisma.watchlist.findFirst.mockResolvedValue(mockWatchlist);
    prisma.notification.create.mockResolvedValue({
      id: "1",
      title: "Watchlist Alert",
      tickers: ["AAPL", "GOOGL"],
      message: "",
      subscriberId: "user1",
      createdAt: now,
    });

    const result = await repo.createNotification({
      title: "Watchlist Alert",
      watchlistId: "watchlist1",
      message: "",
    }, "user1");

    expect(prisma.watchlist.findFirst).toHaveBeenCalledWith({
      where: {
        id: "watchlist1",
        subscriberId: "user1",
        isDeleted: false
      },
      include: {
        items: { where: { isDeleted: false } }
      }
    });
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        title: "Watchlist Alert",
        tickers: ["AAPL", "GOOGL"],
        message: "",
        subscriberId: "user1",
      }
    });
    expect(result.tickers).toEqual(["AAPL", "GOOGL"]);
  });

  it("should throw BadRequestException if neither tickers nor watchlistId provided", async () => {
    await expect(
      repo.createNotification({
        title: "Invalid Alert",
        message: "",
      }, "user1")
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if watchlist not found", async () => {
    prisma.watchlist.findFirst.mockResolvedValue(null);

    await expect(
      repo.createNotification({
        title: "Alert",
        watchlistId: "invalid",
        message: "",
      }, "user1")
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if watchlist has no items array", async () => {
    prisma.watchlist.findFirst.mockResolvedValue({
      id: "watchlist1",
      items: null
    });

    await expect(
      repo.createNotification({
        title: "Alert",
        watchlistId: "watchlist1",
        message: "",
      }, "user1")
    ).rejects.toThrow(BadRequestException);
  });

  // ===========================================================================
  // FIND ALL BY SUBSCRIBER
  // ===========================================================================
  it("should find all notifications by subscriber", async () => {
    const now = new Date();
    prisma.notification.findMany.mockResolvedValue([
      {
        id: "1",
        title: "Alert 1",
        tickers: ["AAPL"],
        message: "Message 1",
        subscriberId: "user1",
        createdAt: now,
      },
      {
        id: "2",
        title: "Alert 2",
        tickers: ["GOOGL"],
        message: "Message 2",
        subscriberId: "user1",
        createdAt: now,
      }
    ]);

    const result = await repo.findNotificationsBySubscriber("user1");

    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: {
        subscriberId: "user1",
        isDeleted: false
      }
    });
    expect(result.length).toBe(2);
    expect(result[0].id).toBe("1");
  });

  // ===========================================================================
  // GET BY ID
  // ===========================================================================
  it("should get notification by id", async () => {
    const now = new Date();
    prisma.notification.findFirst.mockResolvedValue({
      id: "1",
      title: "Alert 1",
      tickers: ["AAPL"],
      message: "Message 1",
      subscriberId: "user1",
      createdAt: now,
    });

    const result = await repo.getNotificationById("user1", "1");

    expect(prisma.notification.findFirst).toHaveBeenCalledWith({
      where: {
        id: "1",
        subscriberId: "user1",
        isDeleted: false
      }
    });
    expect(result.id).toBe("1");
  });

  it("should throw ForbiddenException if notification not found", async () => {
    prisma.notification.findFirst.mockResolvedValue(null);

    await expect(
      repo.getNotificationById("user1", "999")
    ).rejects.toThrow(ForbiddenException);
  });

  // ===========================================================================
  // UPDATE
  // ===========================================================================
  it("should update a notification", async () => {
    const now = new Date();
    prisma.notification.findFirst.mockResolvedValue({
      id: "1",
      title: "Old Title",
      tickers: ["AAPL"],
      message: "Old Message",
      subscriberId: "user1",
      isDeleted: false,
    });

    prisma.notification.update.mockResolvedValue({
      id: "1",
      title: "Updated Title",
      tickers: ["AAPL"],
      message: "Updated Message",
      subscriberId: "user1",
      createdAt: now,
    });

    const result = await repo.updateNotification({
      id: "1",
      userId: "user1",
      title: "Updated Title",
      message: "Updated Message",
    });

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        title: "Updated Title",
        tickers: undefined,
        message: "Updated Message",
      }
    });
    expect(result.title).toBe("Updated Title");
  });

  it("should throw BadRequestException if no fields provided for update", async () => {
    await expect(
      repo.updateNotification({
        id: "1",
        userId: "user1",
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw ForbiddenException if userId not provided", async () => {
    await expect(
      repo.updateNotification({
        id: "1",
        userId: undefined as unknown as string,
        title: "Updated",
      })
    ).rejects.toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException if notification not found on update", async () => {
    prisma.notification.findFirst.mockResolvedValue(null);

    await expect(
      repo.updateNotification({
        id: "999",
        userId: "user1",
        title: "Updated",
      })
    ).rejects.toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException if updating someone else's notification", async () => {
    prisma.notification.findFirst.mockResolvedValue(null);

    await expect(
      repo.updateNotification({
        id: "1",
        userId: "user1",
        title: "Updated",
      })
    ).rejects.toThrow(ForbiddenException);
  });

  // ===========================================================================
  // DELETE
  // ===========================================================================
  it("should delete a notification (soft delete)", async () => {
    prisma.notification.findFirst.mockResolvedValue({
      id: "1",
      subscriberId: "user1",
      isDeleted: false,
    });

    prisma.notification.update.mockResolvedValue({ id: "1" });

    const result = await repo.deleteNotification("user1", "1");

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: "1", subscriberId: "user1" },
      data: { isDeleted: true }
    });
    expect(result).toBe("Notification with id 1 has been deleted.");
  });

  it("should throw ForbiddenException if notification not found on delete", async () => {
    prisma.notification.findFirst.mockResolvedValue(null);

    await expect(
      repo.deleteNotification("user1", "999")
    ).rejects.toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException if deleting someone else's notification", async () => {
    prisma.notification.findFirst.mockResolvedValue(null);

    await expect(
      repo.deleteNotification("user1", "1")
    ).rejects.toThrow(ForbiddenException);
  });
});
