import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Incident } from './incident.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('IncidentsService', () => {
  let service: IncidentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: getRepositoryToken(Incident), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<IncidentsService>(IncidentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('should create an incident', async () => {
    const inc = { id: 1, type: 'ACCIDENT', status: 'SIGNALED', reportedBy: 1 };
    mockRepo.create.mockReturnValue(inc);
    mockRepo.save.mockResolvedValue(inc);
    const result = await service.create({
      type: 'ACCIDENT',
      description: 'Test',
      location: 'Tunis',
      reportedBy: 1,
    });
    expect(result.type).toBe('ACCIDENT');
  });

  it('should throw NotFoundException if incident not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update incident status', async () => {
    const inc = { id: 1, status: 'IN_PROGRESS', reportedBy: 1 };
    mockRepo.findOne.mockResolvedValue(inc);
    const result = await service.updateStatus({ id: 1, status: 'IN_PROGRESS' });
    expect(mockRepo.update).toHaveBeenCalledWith(1, { status: 'IN_PROGRESS' });
    expect(result.status).toBe('IN_PROGRESS');
  });

  it('should find all incidents', async () => {
    mockRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await service.findAll();
    expect(result.length).toBe(2);
  });
});
