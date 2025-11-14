import { PrismaService } from "@prisma/prisma.service";
import { PrismaReportRepository } from "@report/infrastructure/repositories/prisma-report.repository";
import { PrismaWatchlistRepository } from "@watchlist/infrastructure/repositories/prisma-watchlist.repository";
import { MarketService } from "@market/application/services/market.service";
import { OpenAIService } from "@shared/openai/open-ai.service";
import { BadRequestException, ForbiddenException } from "@nestjs/common";

type MockPrismaService = {
  report: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

type MockWatchlistRepository = {
  findById: jest.Mock;
};

type MockMarketService = {
  extractMarketDataBySymbol: jest.Mock;
};

type MockOpenAIService = {
  generateSummary: jest.Mock;
};

describe("PrismaReportRepository", () => {
  let repo: PrismaReportRepository;
  let prisma: MockPrismaService;
  let watchlistRepository: MockWatchlistRepository;
  let marketService: MockMarketService;
  let openAIService: MockOpenAIService;

  beforeEach(() => {
    prisma = {
      report: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      }
    };

    watchlistRepository = {
      findById: jest.fn(),
    };

    marketService = {
      extractMarketDataBySymbol: jest.fn(),
    };

    openAIService = {
      generateSummary: jest.fn(),
    };

    repo = new PrismaReportRepository(
      prisma as unknown as PrismaService,
      watchlistRepository as unknown as PrismaWatchlistRepository,
      marketService as unknown as MarketService,
      openAIService as unknown as OpenAIService,
    );
  });

  // ===========================================================================
  // CREATE
  // ===========================================================================
  it("should create a report with tickers", async () => {
    const mockMarketData = {
      symbol: "AAPL",
      timeZone: "America/New_York",
      info: "Apple Inc.",
      weeklyData: [
        { date: new Date(), open: 150, close: 155, high: 156, low: 149, volume: 1000000 }
      ]
    };

    marketService.extractMarketDataBySymbol.mockResolvedValue(mockMarketData);
    openAIService.generateSummary.mockResolvedValue("AI-generated summary");

    prisma.report.create.mockResolvedValue({
      id: "1",
      title: "Tech Report",
      summary: "AI-generated summary",
      tickers: ["AAPL"],
      subscriberId: "user1",
      isDeleted: false,
      createdAt: new Date(),
    });

    const result = await repo.create({
      title: "Tech Report",
      tickers: ["AAPL"],
      subscriberId: "user1",
    });

    expect(marketService.extractMarketDataBySymbol).toHaveBeenCalledWith("AAPL");
    expect(openAIService.generateSummary).toHaveBeenCalled();
    expect(prisma.report.create).toHaveBeenCalledWith({
      data: {
        title: "Tech Report",
        summary: "AI-generated summary",
        tickers: ["AAPL"],
        subscriberId: "user1",
        isDeleted: false,
      }
    });
    expect(result.id).toBe("1");
  });

  it("should create a report with watchlistId", async () => {
    const mockWatchlist = {
      id: "watchlist1",
      items: [
        { ticker: "AAPL", isDeleted: false },
        { ticker: "GOOGL", isDeleted: false }
      ]
    };

    const mockMarketData = {
      symbol: "AAPL",
      timeZone: "America/New_York",
      info: "Apple Inc.",
      weeklyData: [
        { date: new Date(), open: 150, close: 155, high: 156, low: 149, volume: 1000000 }
      ]
    };

    watchlistRepository.findById.mockResolvedValue(mockWatchlist);
    marketService.extractMarketDataBySymbol.mockResolvedValue(mockMarketData);
    openAIService.generateSummary.mockResolvedValue("AI-generated summary");

    prisma.report.create.mockResolvedValue({
      id: "1",
      title: "Watchlist Report",
      summary: "AI-generated summary",
      tickers: ["AAPL", "GOOGL"],
      subscriberId: "user1",
      isDeleted: false,
      createdAt: new Date(),
    });

    const result = await repo.create({
      title: "Watchlist Report",
      watchlistId: "watchlist1",
      subscriberId: "user1",
    });

    expect(watchlistRepository.findById).toHaveBeenCalledWith("watchlist1", "user1");
    expect(marketService.extractMarketDataBySymbol).toHaveBeenCalledTimes(2);
    expect(result.tickers).toEqual(["AAPL", "GOOGL"]);
  });

  it("should throw BadRequestException if neither tickers nor watchlistId provided", async () => {
    await expect(
      repo.create({
        title: "Invalid Report",
        subscriberId: "user1",
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if watchlist not found", async () => {
    watchlistRepository.findById.mockResolvedValue(null);

    await expect(
      repo.create({
        title: "Report",
        watchlistId: "invalid",
        subscriberId: "user1",
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if watchlist has no items", async () => {
    watchlistRepository.findById.mockResolvedValue({
      id: "watchlist1",
      items: []
    });

    await expect(
      repo.create({
        title: "Report",
        watchlistId: "watchlist1",
        subscriberId: "user1",
      })
    ).rejects.toThrow(BadRequestException);
  });

  // ===========================================================================
  // FIND ALL BY SUBSCRIBER
  // ===========================================================================
  it("should find all reports by subscriber", async () => {
    const now = new Date();
    prisma.report.findMany.mockResolvedValue([
      {
        id: "1",
        title: "Report 1",
        summary: "Summary 1",
        tickers: ["AAPL"],
        isDeleted: false,
        subscriberId: "user1",
        createdAt: now,
      },
      {
        id: "2",
        title: "Report 2",
        summary: "Summary 2",
        tickers: ["GOOGL"],
        isDeleted: false,
        subscriberId: "user1",
        createdAt: now,
      }
    ]);

    const result = await repo.findAllBySubscriber("user1");

    expect(prisma.report.findMany).toHaveBeenCalledWith({
      where: {
        subscriberId: "user1",
        isDeleted: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    expect(result.length).toBe(2);
    expect(result[0].id).toBe("1");
  });

  // ===========================================================================
  // FIND BY ID
  // ===========================================================================
  it("should find report by id", async () => {
    const now = new Date();
    prisma.report.findUnique.mockResolvedValue({
      id: "1",
      title: "Report 1",
      summary: "Summary 1",
      tickers: ["AAPL"],
      isDeleted: false,
      subscriberId: "user1",
      createdAt: now,
    });

    const result = await repo.findById("1", "user1");

    expect(prisma.report.findUnique).toHaveBeenCalledWith({
      where: { id: "1", subscriberId: "user1", isDeleted: false }
    });
    expect(result?.id).toBe("1");
  });

  it("should return null if report not found", async () => {
    prisma.report.findUnique.mockResolvedValue(null);

    const result = await repo.findById("999", "user1");

    expect(result).toBeNull();
  });

  it("should throw ForbiddenException if report belongs to different subscriber", async () => {
    prisma.report.findUnique.mockResolvedValue({
      id: "1",
      title: "Report 1",
      summary: "Summary 1",
      tickers: ["AAPL"],
      isDeleted: false,
      subscriberId: "user2",
      createdAt: new Date(),
    });

    await expect(repo.findById("1", "user1")).rejects.toThrow(ForbiddenException);
  });

  // ===========================================================================
  // UPDATE
  // ===========================================================================
  it("should update a report", async () => {
    const now = new Date();
    prisma.report.findUnique.mockResolvedValue({
      id: "1",
      title: "Old Title",
      summary: "Old Summary",
      tickers: ["AAPL"],
      isDeleted: false,
      subscriberId: "user1",
      createdAt: now,
    });

    prisma.report.update.mockResolvedValue({
      id: "1",
      title: "Updated Title",
      summary: "Old Summary",
      tickers: ["AAPL"],
      isDeleted: false,
      subscriberId: "user1",
      createdAt: now,
    });

    const result = await repo.update("1", "user1", { title: "Updated Title" });

    expect(prisma.report.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { title: "Updated Title" }
    });
    expect(result.title).toBe("Updated Title");
  });

  it("should throw BadRequestException if report not found on update", async () => {
    prisma.report.findUnique.mockResolvedValue(null);

    await expect(
      repo.update("999", "user1", { title: "Updated" })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if updating someone else's report", async () => {
    prisma.report.findUnique.mockResolvedValue({
      id: "1",
      subscriberId: "user2",
      isDeleted: false,
    });

    await expect(
      repo.update("1", "user1", { title: "Updated" })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if updating deleted report", async () => {
    prisma.report.findUnique.mockResolvedValue({
      id: "1",
      subscriberId: "user1",
      isDeleted: true,
    });

    await expect(
      repo.update("1", "user1", { title: "Updated" })
    ).rejects.toThrow(BadRequestException);
  });

  // ===========================================================================
  // DELETE
  // ===========================================================================
  it("should delete a report (soft delete)", async () => {
    prisma.report.findUnique.mockResolvedValue({
      id: "1",
      subscriberId: "user1",
      isDeleted: false,
    });

    prisma.report.update.mockResolvedValue({ id: "1" });

    const result = await repo.delete("1", "user1");

    expect(prisma.report.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { isDeleted: true }
    });
    expect(result).toBe("Report with id 1 has been deleted.");
  });

  it("should throw BadRequestException if report not found on delete", async () => {
    prisma.report.findUnique.mockResolvedValue(null);

    await expect(repo.delete("999", "user1")).rejects.toThrow(BadRequestException);
  });

  it("should throw BadRequestException if deleting someone else's report", async () => {
    prisma.report.findUnique.mockResolvedValue({
      id: "1",
      subscriberId: "user2",
      isDeleted: false,
    });

    await expect(repo.delete("1", "user1")).rejects.toThrow(BadRequestException);
  });
});
