import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ id: 1, email: 'test@test.com', role: 'OPERATOR' });

      const result = await service.register({
        username: 'test',
        email: 'test@test.com',
        password: 'Test1234!',
        role: 'OPERATOR',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('test@test.com');
    });

    it('should throw ConflictException if email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 1, email: 'test@test.com' });

      await expect(service.register({
        username: 'test',
        email: 'test@test.com',
        password: 'Test1234!',
        role: 'OPERATOR',
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login and return token', async () => {
      const hashed = await bcrypt.hash('Test1234!', 10);
      mockUsersService.findByEmail.mockResolvedValue({ id: 1, email: 'test@test.com', role: 'OPERATOR', password: hashed });

      const result = await service.login({ email: 'test@test.com', password: 'Test1234!' });

      expect(result.token).toBe('mock-token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login({ email: 'wrong@test.com', password: 'Test1234!' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password wrong', async () => {
      const hashed = await bcrypt.hash('Test1234!', 10);
      mockUsersService.findByEmail.mockResolvedValue({ id: 1, email: 'test@test.com', password: hashed });

      await expect(service.login({ email: 'test@test.com', password: 'WrongPass!' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});