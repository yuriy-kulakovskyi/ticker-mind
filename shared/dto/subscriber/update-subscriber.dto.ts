import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateSubscriberDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 100)
  displayName: string;
}