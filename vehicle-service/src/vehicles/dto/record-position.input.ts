import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class RecordPositionInput {
  @Field(() => Int)
  @IsNumber()
  vehicleId: number;

  @Field(() => Float)
  @IsNumber()
  lat: number;

  @Field(() => Float)
  @IsNumber()
  lng: number;
}
