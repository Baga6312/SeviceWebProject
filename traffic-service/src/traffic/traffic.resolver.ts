import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TrafficService } from './traffic.service';
import { Zone } from './zone.entity';
import { TrafficData } from './traffic-data.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { MeasureDensityInput } from './dto/measure-density.input';

@Resolver(() => Zone)
export class TrafficResolver {
  constructor(private service: TrafficService) {}

  @Mutation(() => Zone)
  createZone(@Args('input') input: CreateZoneInput) {
    return this.service.createZone(input);
  }

  @Query(() => [Zone])
  getZones() {
    return this.service.getZones();
  }

  @Mutation(() => TrafficData)
  measureDensity(@Args('input') input: MeasureDensityInput) {
    return this.service.measureDensity(input);
  }

  @Query(() => [TrafficData])
  getCongestedZones() {
    return this.service.getCongestedZones();
  }
}
