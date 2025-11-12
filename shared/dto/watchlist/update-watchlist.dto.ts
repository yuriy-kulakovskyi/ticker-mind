import { IsString, Length } from 'class-validator';

export class UpdateWatchlistDto {
  @IsString()
  @Length(2, 50)
  name: string;
}