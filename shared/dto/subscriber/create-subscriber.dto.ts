import { IsOptional, IsString, Length } from "class-validator";

export class CreateSubscriberDto {
  @IsString()
  @Length(0, 100)
  @IsOptional()
  displayName?: string;
}