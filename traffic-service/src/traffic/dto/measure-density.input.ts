import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class MeasureDensityInput {
  @Field(() => Int)
  @IsNumber()
  zoneId: number;

  @Field(() => Float)
  @IsNumber()
  density: number;
}