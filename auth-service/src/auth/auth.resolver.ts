import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role, User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => AuthResponse)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  me(@Context() context: any) {
    return context.req.user;
  }

  @Query(() => [User])
  getUsers() {
    return this.usersService.findAll();
  }
}