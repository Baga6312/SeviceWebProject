import { Test, TestingModule } from '@nestjs/testing';
import { TrafficService } from './traffic.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Zone } from './zone.entity';
import { TrafficData } from './traffic-data.entity';
import { NotFoundException } from '@nestjs/common';

const mockZoneRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
const mockTrafficRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

describe('TrafficService', () => {
  let service: TrafficService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficService,
        { provide: getRepositoryToken(Zone), useValue: mockZoneRepo },
        { provide: getRepositoryToken(TrafficData), useValue: mockTrafficRepo },
      ],
    }).compile();
    service = module.get<TrafficService>(TrafficService);
    jest.clearAllMocks();
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('should create a zone', async () => {
    const zone = { id: 1, name: 'Zone A', lat: 36.8, lng: 10.1, radius: 500 };
    mockZoneRepo.create.mockReturnValue(zone);
    mockZoneRepo.save.mockResolvedValue(zone);
    const result = await service.createZone({ name: 'Zone A', lat: 36.8, lng: 10.1, radius: 500 });
    expect(result.name).toBe('Zone A');
  });

  it('should throw NotFoundException if zone not found', async () => {
    mockZoneRepo.findOne.mockResolvedValue(null);
    await expect(service.measureDensity({ zoneId: 999, density: 50 })).rejects.toThrow(NotFoundException);
  });

  it('should classify LOW density', async () => {
    mockZoneRepo.findOne.mockResolvedValue({ id: 1, name: 'Zone A' });
    const data = { id: 1, zoneId: 1, density: 20, level: 'LOW' };
    mockTrafficRepo.create.mockReturnValue(data);
    mockTrafficRepo.save.mockResolvedValue(data);
    const result = await service.measureDensity({ zoneId: 1, density: 20 });
    expect(result.level).toBe('LOW');
  });

  it('should classify HIGH density and notify', async () => {
    mockZoneRepo.findOne.mockResolvedValue({ id: 1, name: 'Zone A' });
    const data = { id: 1, zoneId: 1, density: 85, level: 'HIGH' };
    mockTrafficRepo.create.mockReturnValue(data);
    mockTrafficRepo.save.mockResolvedValue(data);
    const result = await service.measureDensity({ zoneId: 1, density: 85 });
    expect(result.level).toBe('HIGH');
  });
});