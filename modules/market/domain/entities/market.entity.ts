import { MarketRepository } from "@market/infrastructure/market.repository";
import { MarketCandle } from "@market/domain/entities/market-candle.entity";

export class Market {
  constructor(
    public symbol: string,
    public lastRefreshed: Date,
    public timeZone: string,
    public info: string,
    public weeklyData: MarketCandle[],
  ) {}

  static fromApiResponse(data: MarketRepository): Market {
    const meta = data["Meta Data"];
    const timeSeries = data["Weekly Time Series"];

    if (!meta || !timeSeries) {
      throw new Error('Invalid API response: Missing Meta Data or Weekly Time Series');
    }

    // slice() to take only the latest 20 entries, not to load data for too long period
    const weeklyData: MarketCandle[] = Object.entries(timeSeries).slice(0, 20).map(
      ([date, values]: [string, MarketRepository["Weekly Time Series"][string]]) =>
        new MarketCandle(
          new Date(date),
          parseFloat(values["1. open"]),
          parseFloat(values["2. high"]),
          parseFloat(values["3. low"]),
          parseFloat(values["4. close"]),
          parseInt(values["5. volume"])
        )
    );

    return new Market(
      meta["2. Symbol"],
      new Date(meta["3. Last Refreshed"]),
      meta["4. Time Zone"],
      meta["1. Information"],
      weeklyData
    );
  }
}