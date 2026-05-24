import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const exists = await this.usersService.findByEmail(input.email);
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(input.password, 10);
    const user = await this.usersService.create(
      input.username,
      input.email,
      hashed,
      input.role,
    );

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { token, user };
  }

  async login(input: LoginInput) {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { token, user };
  }
}
