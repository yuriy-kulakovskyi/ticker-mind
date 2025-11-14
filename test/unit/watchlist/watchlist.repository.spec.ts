import { PrismaWatchlistRepository } from "@watchlist/infrastructure/repositories/prisma-watchlist.repository";
import { NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";

type MockPrismaService = {
  watchlist: {
    create: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
  };
  watchlistItem: {
    findFirst: jest.Mock;
    update: jest.Mock;
  };
};

describe("PrismaWatchlistRepository", () => {
  let repo: PrismaWatchlistRepository;
  let prisma: MockPrismaService;

  beforeEach(() => {
    prisma = {
      watchlist: {
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      watchlistItem: {
        findFirst: jest.fn(),
        update: jest.fn(),
      }
    };

    repo = new PrismaWatchlistRepository(prisma as unknown as PrismaService);
  });

  // ===========================================================================
  // CREATE
  // ===========================================================================
  it("should create a watchlist", async () => {
    prisma.watchlist.create.mockResolvedValue({
      id: "1",
      name: "Tech",
      subscriberId: "user1",
      items: []
    });

    const result = await repo.create({
      name: "Tech",
      subscriberId: "user1",
      subscriberEmail: "user1@example.com"
    });

    expect(prisma.watchlist.create).toHaveBeenCalledWith({
      data: { name: "Tech", subscriberId: "user1" },
      include: { items: { where: { isDeleted: false } } }
    });
    expect(result.id).toBe("1");
  });

  // ===========================================================================
  // ADD ITEM
  // ===========================================================================
  it("should add item to watchlist", async () => {
    prisma.watchlist.findFirst.mockResolvedValue({
      id: "1",
      subscriberId: "user1",
    });

    prisma.watchlistItem.findFirst.mockResolvedValue(null);

    prisma.watchlist.update.mockResolvedValue({
      id: "1",
      name: "Tech",
      items: [{ ticker: "AAPL" }]
    });

    const result = await repo.addItem("1", "AAPL", "user1");

    expect(prisma.watchlist.update).toHaveBeenCalled();
    expect(result.items.length).toBe(1);
  });

  it("should throw NotFoundException when adding item to missing watchlist", async () => {
    prisma.watchlist.findFirst.mockResolvedValue(null);

    await expect(repo.addItem("1", "AAPL", "user1"))
      .rejects.toThrow(NotFoundException);
  });

  it("should throw ConflictException if item already exists", async () => {
    prisma.watchlist.findFirst.mockResolvedValue({ id: "1" });

    prisma.watchlistItem.findFirst.mockResolvedValue({ id: "item1" });

    await expect(repo.addItem("1", "AAPL", "user1"))
      .rejects.toThrow(ConflictException);
  });

  // ===========================================================================
  // REMOVE ITEM
  // ===========================================================================
  it("should remove item from watchlist", async () => {
    prisma.watchlist.findFirst.mockResolvedValue({ id: "1" });

    prisma.watchlistItem.findFirst.mockResolvedValue({
      id: "item1",
      ticker: "AAPL"
    });

    prisma.watchlistItem.update.mockResolvedValue({});

    prisma.watchlist.findFirst.mockResolvedValueOnce({ id: "1" }) // first check
    prisma.watchlist.findFirst.mockResolvedValueOnce({
      id: "1",
      items: []
    }); // after removing

    const result = await repo.removeItem("1", "AAPL", "user1");

    expect(result.items).toHaveLength(0);
  });

  it("should throw NotFoundException if watchlist not found (removeItem)", async () => {
    prisma.watchlist.findFirst.mockResolvedValue(null);

    await expect(repo.removeItem("1", "AAPL", "user1"))
      .rejects.toThrow(NotFoundException);
  });

  it("should throw NotFoundException if ticker not found", async () => {
    prisma.watchlist.findFirst.mockResolvedValue({ id: "1" });
    prisma.watchlistItem.findFirst.mockResolvedValue(null);

    await expect(repo.removeItem("1", "AAPL", "user1"))
      .rejects.toThrow(NotFoundException);
  });

  // ===========================================================================
  // FIND ALL BY USER
  // ===========================================================================
  it("should find all watchlists for user", async () => {
    prisma.watchlist.findMany.mockResolvedValue([
      { id: "1", name: "Tech", items: [] }
    ]);

    const result = await repo.findAllByUser("user1");

    expect(result.length).toBe(1);
  });

  // ===========================================================================
  // FIND BY ID
  // ===========================================================================
  it("should find watchlist by id", async () => {
    prisma.watchlist.findFirst.mockResolvedValue({
      id: "1",
      name: "Tech",
      items: []
    });

    const result = await repo.findById("1", "user1");

    expect(result?.id).toBe("1");
  });

  it("should return null if watchlist not found", async () => {
    prisma.watchlist.findFirst.mockResolvedValue(null);

    const result = await repo.findById("1", "user1");

    expect(result).toBeNull();
  });

  // ===========================================================================
  // UPDATE
  // ===========================================================================
  it("should update watchlist", async () => {
    prisma.watchlist.findFirst.mockResolvedValue({ id: "1" });

    prisma.watchlist.update.mockResolvedValue({
      id: "1",
      name: "Updated",
      items: []
    });

    const result = await repo.update("1", { name: "Updated" }, "user1");

    expect(result.name).toBe("Updated");
  });

  it("should throw NotFoundException on update of missing watchlist", async () => {
    prisma.watchlist.findFirst.mockResolvedValue(null);

    await expect(
      repo.update("1", { name: "Updated" }, "user1")
    ).rejects.toThrow(NotFoundException);
  });

  // ===========================================================================
  // DELETE
  // ===========================================================================
  it("should delete watchlist (soft delete)", async () => {
    prisma.watchlist.findFirst.mockResolvedValue({ id: "1" });

    prisma.watchlist.update.mockResolvedValue({ id: "1" });

    await repo.delete("1", "user1");

    expect(prisma.watchlist.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { isDeleted: true }
    });
  });

  it("should throw NotFoundException on delete of missing watchlist", async () => {
    prisma.watchlist.findFirst.mockResolvedValue(null);

    await expect(repo.delete("1", "user1"))
      .rejects.toThrow(NotFoundException);
  });
});