import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
  ) {}

  async create(input: CreateNotificationInput): Promise<Notification> {
    const notif = this.repo.create(input);
    return this.repo.save(notif);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return this.repo.find({ where: { userId } });
  }

  async markAsRead(id: number): Promise<Notification | null> {
    await this.repo.update(id, { isRead: true });
    return this.repo.findOne({ where: { id } });
 }
}