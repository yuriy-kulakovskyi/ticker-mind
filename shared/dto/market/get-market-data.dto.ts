import { IsString, IsUppercase, Length } from "class-validator";

export class GetMarketDataQueryDto {
  @IsString()
  @IsUppercase()
  @Length(1, 10)
  ticker: string;
}