import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field()
  @IsNumber()
  userId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  type: string;
}
