import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './zone.entity';
import { TrafficData } from './traffic-data.entity';
import { CreateZoneInput } from './dto/create-zone.input';
import { MeasureDensityInput } from './dto/measure-density.input';
import axios from 'axios';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Zone) private zoneRepo: Repository<Zone>,
    @InjectRepository(TrafficData) private trafficRepo: Repository<TrafficData>,
  ) {}

  private async notify(message: string, type: string) {
    try {
      await axios.post(`${process.env.NOTIF_SERVICE || 'http://localhost:3002'}/graphql`, {
        query: `mutation { sendNotification(input: { userId: 1, message: "${message}", type: "${type}" }) { id } }`
      });
    } catch (e) {
      console.error('Notification failed:', e.message);
    }
  }

  async createZone(input: CreateZoneInput): Promise<Zone> {
    const zone = this.zoneRepo.create(input);
    return this.zoneRepo.save(zone);
  }

  async getAllTrafficData(): Promise<TrafficData[]> {
    return this.trafficRepo.find({ order: { timestamp: 'DESC' } });
  }
  async getZones(): Promise<Zone[]> {
    return this.zoneRepo.find();
  }

  async measureDensity(input: MeasureDensityInput): Promise<TrafficData> {
    const zone = await this.zoneRepo.findOne({ where: { id: input.zoneId } });
    if (!zone) throw new NotFoundException('Zone not found');

    const level = input.density < 30 ? 'LOW' : input.density < 70 ? 'MEDIUM' : 'HIGH';
    const data = this.trafficRepo.create({ ...input, level });
    const saved = await this.trafficRepo.save(data);

    if (level === 'HIGH') {
      await this.notify(`Zone ${zone.name} - Density: ${input.density}% (${level})`, 'TRAFFIC');
    }

    return saved;
  }

  async getCongestedZones(): Promise<TrafficData[]> {
    return this.trafficRepo.find({ where: { level: 'HIGH' }, order: { timestamp: 'DESC' } });
  }
}