import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsWebSocketGateway } from './notifications.gateway';
import { RedisService } from './redis.service';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

const mockWsGateway = { broadcast: jest.fn() };
const mockRedis = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useValue: mockRepo },
        { provide: NotificationsWebSocketGateway, useValue: mockWsGateway },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();
    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create notification and broadcast', async () => {
    const notif = {
      id: 1,
      message: 'Test',
      type: 'INFO',
      userId: 1,
      isRead: false,
    };
    mockRepo.create.mockReturnValue(notif);
    mockRepo.save.mockResolvedValue(notif);

    const result = await service.create({
      userId: 1,
      message: 'Test',
      type: 'INFO',
    });

    expect(mockWsGateway.broadcast).toHaveBeenCalled();
    expect(result).toEqual(notif);
  });

  it('should return cached notifications', async () => {
    const cached = [{ id: 1, message: 'Test', type: 'INFO', isRead: false }];
    mockRedis.get.mockResolvedValue(JSON.stringify(cached));

    const result = await service.findByUser(1);

    expect(result).toEqual(cached);
    expect(mockRepo.find).not.toHaveBeenCalled();
  });

  it('should fetch from DB on cache miss', async () => {
    mockRedis.get.mockResolvedValue(null);
    mockRepo.find.mockResolvedValue([{ id: 1, message: 'Test' }]);

    await service.findByUser(1);

    expect(mockRepo.find).toHaveBeenCalled();
    expect(mockRedis.set).toHaveBeenCalled();
  });

  it('should mark notification as read and invalidate cache', async () => {
    const notif = { id: 1, userId: 1, isRead: true };
    mockRepo.findOne.mockResolvedValue(notif);

    await service.markAsRead(1);

    expect(mockRepo.update).toHaveBeenCalledWith(1, { isRead: true });
    expect(mockRedis.del).toHaveBeenCalledWith('notifs:1');
  });
});
