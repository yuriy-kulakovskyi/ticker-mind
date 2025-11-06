import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateWatchlistDto {
  @IsString()
  @IsOptional()
  @Length(2, 50)
  name?: string;
}