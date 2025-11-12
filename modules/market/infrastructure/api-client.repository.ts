import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { MarketRepository } from "@market/infrastructure/market.repository";
import { firstValueFrom } from "rxjs";
import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Market } from "@market/domain/entities/market.entity";
import { IMarketDataProvider } from "@market/domain/interfaces/market-data-provider.interface";


@Injectable()
export class AlphaVantageApiClient implements IMarketDataProvider {
  private readonly logger = new Logger(AlphaVantageApiClient.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getMarketData(ticker: string): Promise<Market> {
    const apiUrl = this.configService.get<string>("ALPHA_VINTAGE_API_URL");
    const apiKey = this.configService.get<string>("ALPHA_VINTAGE_API_KEY");

    if (!apiUrl || !apiKey) {
      throw new HttpException(
        "API configuration missing",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      this.logger.log(`Fetching market data for ticker: ${ticker}`);
      
      const response = await firstValueFrom(
        this.httpService.get<MarketRepository>(`${apiUrl}&symbol=${ticker}&apikey=${apiKey}`)
      );

      const market = Market.fromApiResponse(response.data);
      
      this.logger.log(`Successfully fetched market data for ticker: ${ticker}`);
      return market;
    } catch (error) {
      this.logger.error(
        `Failed to fetch market data for ticker: ${ticker}`,
        error.stack
      );
      
      throw new HttpException(
        `Failed to fetch market data for ${ticker}: ${error.message}`,
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}