import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './incident.entity';
import { IncidentsService } from './incidents.service';
import { IncidentsResolver } from './incidents.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Incident])],
  providers: [IncidentsService, IncidentsResolver],
})
export class IncidentsModule {}
