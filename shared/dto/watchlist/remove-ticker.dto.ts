import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RemoveTickerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9.-]{1,10}$/, {
    message: 'Ticker must be uppercase letters/numbers and up to 10 chars',
  })
  ticker: string;
}