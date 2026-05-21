import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './zone.entity';
import { TrafficData } from './traffic-data.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { MeasureDensityInput } from './dto/measure-density.input';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Zone) private zoneRepo: Repository<Zone>,
    @InjectRepository(TrafficData) private trafficRepo: Repository<TrafficData>,
  ) {}

  async createZone(input: CreateZoneInput): Promise<Zone> {
    const zone = this.zoneRepo.create(input);
    return this.zoneRepo.save(zone);
  }

  async getZones(): Promise<Zone[]> {
    return this.zoneRepo.find();
  }

  async measureDensity(input: MeasureDensityInput): Promise<TrafficData> {
    const zone = await this.zoneRepo.findOne({ where: { id: input.zoneId } });
    if (!zone) throw new NotFoundException('Zone not found');

    const level = input.density < 30 ? 'LOW' : input.density < 70 ? 'MEDIUM' : 'HIGH';
    const data = this.trafficRepo.create({ ...input, level });
    return this.trafficRepo.save(data);
  }

  async getCongestedZones(): Promise<TrafficData[]> {
    return this.trafficRepo.find({ where: { level: 'HIGH' }, order: { timestamp: 'DESC' } });
  }
}