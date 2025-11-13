import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReportDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  tickers?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  watchlistId?: string;
}