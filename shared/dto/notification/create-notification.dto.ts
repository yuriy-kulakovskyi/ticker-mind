import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
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

  @IsString()
  @IsNotEmpty()
  message: string;
}