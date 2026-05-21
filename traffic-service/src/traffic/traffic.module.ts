import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zone } from './zone.entity';
import { TrafficData } from './traffic-data.entity';
import { TrafficService } from './traffic.service';
import { TrafficResolver } from './traffic.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Zone, TrafficData])],
  providers: [TrafficService, TrafficResolver],
})
export class TrafficModule {}