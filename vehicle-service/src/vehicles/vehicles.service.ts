import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { GpsPosition } from './gps-position.entity';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { RecordPositionInput } from './dto/record-position.input';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(GpsPosition) private posRepo: Repository<GpsPosition>,
  ) {}

  async create(input: CreateVehicleInput): Promise<Vehicle> {
    const vehicle = this.vehicleRepo.create(input);
    return this.vehicleRepo.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find();
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async recordPosition(input: RecordPositionInput): Promise<GpsPosition> {
    const pos = this.posRepo.create(input);
    return this.posRepo.save(pos);
  }

  async getHistory(vehicleId: number): Promise<GpsPosition[]> {
    return this.posRepo.find({ where: { vehicleId }, order: { timestamp: 'DESC' } });
  }
}