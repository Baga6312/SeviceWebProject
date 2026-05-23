import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { GpsPosition } from './gps-position.entity';
import { NotFoundException } from '@nestjs/common';

const mockVehicleRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
const mockPosRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: getRepositoryToken(Vehicle), useValue: mockVehicleRepo },
        { provide: getRepositoryToken(GpsPosition), useValue: mockPosRepo },
      ],
    }).compile();
    service = module.get<VehiclesService>(VehiclesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('should create a vehicle', async () => {
    const v = { id: 1, plate: 'TU-123', type: 'CAR', ownerId: 1 };
    mockVehicleRepo.create.mockReturnValue(v);
    mockVehicleRepo.save.mockResolvedValue(v);
    const result = await service.create({ plate: 'TU-123', type: 'CAR', ownerId: 1 });
    expect(result.plate).toBe('TU-123');
  });

  it('should throw NotFoundException if vehicle not found', async () => {
    mockVehicleRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should record a position', async () => {
    const pos = { id: 1, vehicleId: 1, lat: 36.8, lng: 10.1 };
    mockPosRepo.create.mockReturnValue(pos);
    mockPosRepo.save.mockResolvedValue(pos);
    const result = await service.recordPosition({ vehicleId: 1, lat: 36.8, lng: 10.1 });
    expect(result.vehicleId).toBe(1);
  });

  it('should get history', async () => {
    mockPosRepo.find.mockResolvedValue([{ id: 1, vehicleId: 1 }]);
    const result = await service.getHistory(1);
    expect(result.length).toBe(1);
  });
});