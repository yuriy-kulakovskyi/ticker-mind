import { IsOptional, IsString } from "class-validator";

export class UpdateNotificationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString({ each: true })
  @IsOptional()
  tickers?: string[];

  @IsString()
  @IsOptional()
  message?: string;
}