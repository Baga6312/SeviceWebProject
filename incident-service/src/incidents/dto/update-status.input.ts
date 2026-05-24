import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateStatusInput {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  status: string;
}
