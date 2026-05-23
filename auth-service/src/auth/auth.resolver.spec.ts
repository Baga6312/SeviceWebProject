import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RedisService } from './redis.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

const mockUsersService = { findAll: jest.fn() };
const mockRedisService = { set: jest.fn(), get: jest.fn() };

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();
    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call login', async () => {
    mockAuthService.login.mockResolvedValue({ token: 'abc', user: { id: 1 } });
    const result = await resolver.login({ email: 'test@test.com', password: 'Test1234!' });
    expect(result.token).toBe('abc');
  });
});