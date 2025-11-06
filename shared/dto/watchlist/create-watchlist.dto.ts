import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateWatchlistDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;
}