import { IsOptional, IsString } from "class-validator";

export class UpdateReportDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString({ each: true })
  @IsOptional()
  tickers?: string[];
}