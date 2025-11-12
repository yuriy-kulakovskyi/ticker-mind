import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tickers: string[];

  @IsString()
  @IsNotEmpty()
  message: string;
}