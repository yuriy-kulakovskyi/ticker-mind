import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
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