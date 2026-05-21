import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateVehicleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  plate: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  type: string;

  @Field(() => Int)
  @IsNumber()
  ownerId: number;
}