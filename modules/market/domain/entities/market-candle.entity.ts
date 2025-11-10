export class MarketCandle {
  constructor(
    public date: Date,
    public open: number,
    public high: number,
    public low: number,
    public close: number,
    public volume: number,
  ) {}
}