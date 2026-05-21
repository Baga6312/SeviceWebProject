import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { GpsPosition } from './gps-position.entity';
import { VehiclesService } from './vehicles.service';
import { VehiclesResolver } from './vehicles.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, GpsPosition])],
  providers: [VehiclesService, VehiclesResolver],
})
export class VehiclesModule {}