import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateSubscriberDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  displayName: string;
}