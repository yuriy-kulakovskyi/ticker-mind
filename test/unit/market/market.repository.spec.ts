import { PrismaService } from "@prisma/prisma.service";
import { PrismaMarketRepository } from "@market/infrastructure/prisma-market.repository";
import { Market } from "@market/domain/entities/market.entity";
import { MarketCandle } from "@market/domain/entities/market-candle.entity";
import { NotFoundException } from "@nestjs/common";

type MockPrismaService = {
  market: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
};

describe("PrismaMarketRepository", () => {
  let repo: PrismaMarketRepository;
  let prisma: MockPrismaService;

  beforeEach(() => {
    prisma = {
      market: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      }
    };

    repo = new PrismaMarketRepository(prisma as unknown as PrismaService);
  });

  // ===========================================================================
  // EXTRACT MARKET DATA BY SYMBOL
  // ===========================================================================
  it("should extract market data by symbol", async () => {
    const mockCandles = [
      {
        date: new Date("2024-01-05"),
        open: 150.0,
        high: 155.0,
        low: 149.0,
        close: 154.0,
        volume: 1000000
      },
      {
        date: new Date("2024-01-12"),
        open: 154.0,
        high: 158.0,
        low: 152.0,
        close: 157.0,
        volume: 1200000
      }
    ];

    prisma.market.findUnique.mockResolvedValue({
      symbol: "AAPL",
      lastRefreshed: new Date("2024-01-12"),
      timeZone: "America/New_York",
      info: "Apple Inc.",
      candles: mockCandles
    });

    const result = await repo.extractMarketDataBySymbol("AAPL");

    expect(prisma.market.findUnique).toHaveBeenCalledWith({
      where: { symbol: "AAPL" },
      include: { candles: { orderBy: { date: 'desc' } } }
    });
    expect(result.symbol).toBe("AAPL");
    expect(result.info).toBe("Apple Inc.");
    expect(result.weeklyData.length).toBe(2);
    expect(result.weeklyData[0]).toBeInstanceOf(MarketCandle);
  });

  it("should throw NotFoundException if symbol not found", async () => {
    prisma.market.findUnique.mockResolvedValue(null);

    await expect(
      repo.extractMarketDataBySymbol("INVALID")
    ).rejects.toThrow(NotFoundException);

    expect(prisma.market.findUnique).toHaveBeenCalledWith({
      where: { symbol: "INVALID" },
      include: { candles: { orderBy: { date: 'desc' } } }
    });
  });

  // ===========================================================================
  // SAVE MARKET DATA - CREATE NEW
  // ===========================================================================
  it("should create new market data when symbol doesn't exist", async () => {
    const marketCandles = [
      new MarketCandle(
        new Date("2024-01-05"),
        150.0,
        155.0,
        149.0,
        154.0,
        1000000
      ),
      new MarketCandle(
        new Date("2024-01-12"),
        154.0,
        158.0,
        152.0,
        157.0,
        1200000
      )
    ];

    const market = new Market(
      "AAPL",
      new Date("2024-01-12"),
      "America/New_York",
      "Apple Inc.",
      marketCandles
    );

    prisma.market.findUnique.mockResolvedValue(null);
    prisma.market.create.mockResolvedValue({});

    await repo.saveMarketData(market, "AAPL");

    expect(prisma.market.findUnique).toHaveBeenCalledWith({
      where: { symbol: "AAPL" },
      include: { candles: true }
    });
    expect(prisma.market.create).toHaveBeenCalledWith({
      data: {
        symbol: "AAPL",
        lastRefreshed: market.lastRefreshed,
        timeZone: "America/New_York",
        info: "Apple Inc.",
        candles: {
          create: expect.arrayContaining([
            expect.objectContaining({
              date: marketCandles[0].date,
              open: 150.0,
              high: 155.0,
              low: 149.0,
              close: 154.0,
              volume: 1000000
            })
          ])
        }
      }
    });
  });

  it("should limit candles to 20 when creating new market", async () => {
    const marketCandles = Array.from({ length: 30 }, (_, i) =>
      new MarketCandle(
        new Date(2024, 0, i + 1),
        150.0 + i,
        155.0 + i,
        149.0 + i,
        154.0 + i,
        1000000
      )
    );

    const market = new Market(
      "AAPL",
      new Date("2024-01-30"),
      "America/New_York",
      "Apple Inc.",
      marketCandles
    );

    prisma.market.findUnique.mockResolvedValue(null);
    prisma.market.create.mockResolvedValue({});

    await repo.saveMarketData(market, "AAPL");

    expect(prisma.market.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          candles: expect.objectContaining({
            create: expect.arrayContaining([
              expect.any(Object)
            ])
          })
        })
      })
    );

    const createCall = prisma.market.create.mock.calls[0][0];
    expect(createCall.data.candles.create.length).toBe(20);
  });

  // ===========================================================================
  // SAVE MARKET DATA - UPDATE EXISTING
  // ===========================================================================
  it("should update existing market with new candles", async () => {
    const existingCandles = [
      {
        date: new Date("2024-01-05"),
        open: 150.0,
        high: 155.0,
        low: 149.0,
        close: 154.0,
        volume: 1000000
      }
    ];

    const newMarketCandles = [
      new MarketCandle(
        new Date("2024-01-05"),
        150.0,
        155.0,
        149.0,
        154.0,
        1000000
      ),
      new MarketCandle(
        new Date("2024-01-12"),
        154.0,
        158.0,
        152.0,
        157.0,
        1200000
      )
    ];

    const market = new Market(
      "AAPL",
      new Date("2024-01-12"),
      "America/New_York",
      "Apple Inc.",
      newMarketCandles
    );

    prisma.market.findUnique.mockResolvedValue({
      symbol: "AAPL",
      candles: existingCandles
    });
    prisma.market.update.mockResolvedValue({});

    await repo.saveMarketData(market, "AAPL");

    expect(prisma.market.update).toHaveBeenCalledWith({
      where: { symbol: "AAPL" },
      data: {
        lastRefreshed: market.lastRefreshed,
        timeZone: "America/New_York",
        info: "Apple Inc.",
        candles: {
          create: expect.arrayContaining([
            expect.objectContaining({
              date: new Date("2024-01-12"),
              open: 154.0,
              high: 158.0,
              low: 152.0,
              close: 157.0,
              volume: 1200000
            })
          ])
        }
      }
    });
  });

  it("should not update if no new data available", async () => {
    const existingCandles = [
      {
        date: new Date("2024-01-12"),
        open: 154.0,
        high: 158.0,
        low: 152.0,
        close: 157.0,
        volume: 1200000
      }
    ];

    const marketCandles = [
      new MarketCandle(
        new Date("2024-01-05"),
        150.0,
        155.0,
        149.0,
        154.0,
        1000000
      )
    ];

    const market = new Market(
      "AAPL",
      new Date("2024-01-05"),
      "America/New_York",
      "Apple Inc.",
      marketCandles
    );

    prisma.market.findUnique.mockResolvedValue({
      symbol: "AAPL",
      candles: existingCandles
    });

    await repo.saveMarketData(market, "AAPL");

    expect(prisma.market.update).not.toHaveBeenCalled();
  });

  it("should update if existing market has no candles", async () => {
    const marketCandles = [
      new MarketCandle(
        new Date("2024-01-05"),
        150.0,
        155.0,
        149.0,
        154.0,
        1000000
      )
    ];

    const market = new Market(
      "AAPL",
      new Date("2024-01-05"),
      "America/New_York",
      "Apple Inc.",
      marketCandles
    );

    prisma.market.findUnique.mockResolvedValue({
      symbol: "AAPL",
      candles: []
    });
    prisma.market.update.mockResolvedValue({});

    await repo.saveMarketData(market, "AAPL");

    expect(prisma.market.update).toHaveBeenCalledWith({
      where: { symbol: "AAPL" },
      data: expect.objectContaining({
        candles: {
          create: expect.arrayContaining([
            expect.objectContaining({
              date: new Date("2024-01-05"),
            })
          ])
        }
      })
    });
  });

  it("should handle errors when saving market data", async () => {
    const market = new Market(
      "AAPL",
      new Date(),
      "America/New_York",
      "Apple Inc.",
      []
    );

    const error = new Error("Database error");
    prisma.market.findUnique.mockRejectedValue(error);

    await expect(
      repo.saveMarketData(market, "AAPL")
    ).rejects.toThrow("Database error");
  });
});
