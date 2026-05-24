import { Resolver, Mutation, Args, Query, Context , Int} from '@nestjs/graphql';
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
import { RedisService } from './redis.service';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  @Mutation(() => AuthResponse)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context: any) {
    const token = context.req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.redisService.set(`blacklist:${token}`, '1', 86400);
    }
    return true;
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  me(@Context() context: any) {
    return context.req.user;
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getUsers() {
      return this.usersService.findAll();
  }  



  @Mutation(() => User)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
updateUser(
  @Args('id', { type: () => Int }) id: number,
  @Args('username', { nullable: true }) username?: string,
  @Args('email', { nullable: true }) email?: string,
) {
  return this.usersService.update(id, { username, email });
}

@Mutation(() => Boolean)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
deleteUser(@Args('id', { type: () => Int }) id: number) {
  return this.usersService.delete(id);
}
}
