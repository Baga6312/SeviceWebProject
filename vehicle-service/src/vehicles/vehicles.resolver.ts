import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './vehicle.entity';
import { GpsPosition } from './gps-position.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { RecordPositionInput } from './dto/record-position.input';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private service: VehiclesService) {}

  @Mutation(() => Vehicle)
  addVehicle(@Args('input') input: CreateVehicleInput) {
    return this.service.create(input);
  }

  @Query(() => [Vehicle])
  getVehicles() {
    return this.service.findAll();
  }

  @Query(() => Vehicle)
  getVehicle(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => GpsPosition)
  recordPosition(@Args('input') input: RecordPositionInput) {
    return this.service.recordPosition(input);
  }

  @Query(() => [GpsPosition])
  getHistory(@Args('vehicleId', { type: () => Int }) vehicleId: number) {
    return this.service.getHistory(vehicleId);
  }
}
