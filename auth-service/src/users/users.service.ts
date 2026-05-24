import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(
    username: string,
    email: string,
    password: string,
    role?: string,
  ): Promise<User> {
    const user = this.usersRepo.create({
      username,
      email,
      password,
      role: role as any,
    });
    return this.usersRepo.save(user);
  }
  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }


  async update(id: number, data: Partial<{ username: string; email: string; password: string }>): Promise<User | null> {
    await this.usersRepo.update(id, data);
    return this.usersRepo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<boolean> {
    await this.usersRepo.delete(id);
    return true;
  }
  


}
